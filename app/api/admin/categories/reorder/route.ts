import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { items } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items array for category reordering' }, { status: 400 });
    }

    const db = await connectDB();
    const bulkOps = items.map((item: { id: string; sortOrder: number }) => ({
      updateOne: {
        filter: { $or: [{ id: item.id }, { slug: item.id }] },
        update: {
          $set: {
            sortOrder: Number(item.sortOrder) || 1,
            updatedAt: new Date().toISOString(),
          },
        },
      },
    }));

    await db.collection('categories').bulkWrite(bulkOps);

    await logAuditMongo(
      session.name,
      session.email,
      'CATEGORY_REORDERED' as any,
      'Category',
      'bulk-reorder',
      `Reordered ${items.length} categories in catalogue`
    );

    return NextResponse.json({ success: true, message: `Updated sort order for ${items.length} categories` });
  } catch (error: any) {
    console.error('Error reordering categories:', error);
    return NextResponse.json({ error: error.message || 'Failed to reorder categories' }, { status: 500 });
  }
}
