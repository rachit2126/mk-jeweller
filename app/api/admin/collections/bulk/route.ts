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
      return NextResponse.json({ error: 'No collections selected' }, { status: 400 });
    }

    if (!['activate', 'deactivate', 'delete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid bulk action' }, { status: 400 });
    }

    const db = await connectDB();
    const filter = { $or: [{ id: { $in: ids } }, { slug: { $in: ids } }] };

    if (action === 'activate' || action === 'deactivate') {
      const newStatus = action === 'activate' ? 'active' : 'inactive';
      const result = await db.collection('collections').updateMany(filter, {
        $set: {
          status: newStatus,
          updatedAt: new Date().toISOString(),
        },
      });

      await logAuditMongo(
        session.name,
        session.email,
        'COLLECTION_STATUS_CHANGED' as any,
        'Collection',
        'bulk',
        `Bulk updated ${result.modifiedCount} collections to ${newStatus}`
      );

      return NextResponse.json({
        success: true,
        message: `Set ${result.modifiedCount} collections to ${newStatus}`,
      });
    }

    if (action === 'delete') {
      const targetCollections = await db.collection('collections').find(filter).toArray();
      const safeToDeleteIds: string[] = [];
      const blockedCollections: string[] = [];

      for (const col of targetCollections) {
        const prodCount = await db.collection('products').countDocuments({
          $or: [
            { id: { $in: col.productIds || [] } },
            { collectionIds: col.slug },
            { collectionIds: col.id },
          ],
          status: { $ne: 'archived' },
          isDeleted: { $ne: true },
        });

        if (prodCount > 0) {
          blockedCollections.push(`${col.name} (${prodCount} active products)`);
        } else {
          safeToDeleteIds.push(col.id);
        }
      }

      if (safeToDeleteIds.length === 0) {
        return NextResponse.json(
          {
            error: `None of the selected collections could be deleted because all contain active products: ${blockedCollections.join('; ')}`,
          },
          { status: 400 }
        );
      }

      const deleteResult = await db.collection('collections').deleteMany({ id: { $in: safeToDeleteIds } });

      await logAuditMongo(
        session.name,
        session.email,
        'COLLECTION_DELETED' as any,
        'Collection',
        'bulk',
        `Bulk deleted ${deleteResult.deletedCount} collections (${safeToDeleteIds.join(', ')})`
      );

      let msg = `Successfully deleted ${deleteResult.deletedCount} collections.`;
      if (blockedCollections.length > 0) {
        msg += ` Skipped ${blockedCollections.length} collections containing active products: ${blockedCollections.join(', ')}`;
      }

      return NextResponse.json({
        success: true,
        message: msg,
        deletedCount: deleteResult.deletedCount,
        skippedCount: blockedCollections.length,
      });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in bulk collection action:', error);
    return NextResponse.json({ error: error.message || 'Bulk action failed' }, { status: 500 });
  }
}
