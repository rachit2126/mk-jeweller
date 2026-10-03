import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ids, action } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No categories selected' }, { status: 400 });
    }

    if (!['activate', 'deactivate', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid bulk action' }, { status: 400 });
    }

    const db = await connectDB();
    const filter = { $or: [{ id: { $in: ids } }, { slug: { $in: ids } }] };

    if (action === 'activate' || action === 'deactivate') {
      const newStatus = action === 'activate' ? 'active' : 'inactive';
      const result = await db.collection('categories').updateMany(filter, {
        $set: {
          status: newStatus,
          updatedAt: new Date().toISOString(),
        },
      });

      await logAuditMongo(
        session.name,
        session.email,
        'CATEGORY_STATUS_CHANGED' as any,
        'Category',
        'bulk',
        `Bulk updated ${result.modifiedCount} categories to ${newStatus}`
      );

      return NextResponse.json({
        success: true,
        message: `Set ${result.modifiedCount} categories to ${newStatus}`,
      });
    }

    if (action === 'delete') {
      const targetCategories = await db.collection('categories').find(filter).toArray();
      const safeToDeleteIds: string[] = [];
      const blockedCategories: string[] = [];

      for (const cat of targetCategories) {
        const prodCount = await db.collection('products').countDocuments({
          category: cat.slug?.toLowerCase(),
          status: { $ne: 'archived' },
          isDeleted: { $ne: true },
        });

        const childCount = await db.collection('categories').countDocuments({
          $or: [{ parentId: cat.id }, { parentId: cat.slug }],
        });

        if (prodCount > 0 || childCount > 0) {
          blockedCategories.push(`${cat.name} (${prodCount} products, ${childCount} subcategories)`);
        } else {
          safeToDeleteIds.push(cat.id);
        }
      }

      if (safeToDeleteIds.length === 0) {
        return NextResponse.json(
          {
            error: `None of the selected categories could be deleted because all of them have active products or subcategories: ${blockedCategories.join('; ')}`,
          },
          { status: 400 }
        );
      }

      const deleteResult = await db.collection('categories').deleteMany({ id: { $in: safeToDeleteIds } });

      await logAuditMongo(
        session.name,
        session.email,
        'CATEGORY_DELETED',
        'Category',
        'bulk',
        `Bulk deleted ${deleteResult.deletedCount} categories (${safeToDeleteIds.join(', ')})`
      );

      let msg = `Successfully deleted ${deleteResult.deletedCount} categories.`;
      if (blockedCategories.length > 0) {
        msg += ` Skipped ${blockedCategories.length} categories due to dependencies: ${blockedCategories.join(', ')}`;
      }

      return NextResponse.json({
        success: true,
        message: msg,
        deletedCount: deleteResult.deletedCount,
        skippedCount: blockedCategories.length,
      });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in bulk category action:', error);
    return NextResponse.json({ error: error.message || 'Bulk action failed' }, { status: 500 });
  }
}
