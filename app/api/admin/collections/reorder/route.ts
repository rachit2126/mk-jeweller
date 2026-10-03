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
      return NextResponse.json({ error: 'Invalid items array for collection reordering' }, { status: 400 });
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

    await db.collection('collections').bulkWrite(bulkOps);

    await logAuditMongo(
      session.name,
      session.email,
      'COLLECTION_REORDERED' as any,
      'Collection',
      'bulk-reorder',
      `Reordered ${items.length} collections in merchandising catalogue`
    );

    return NextResponse.json({ success: true, message: `Updated sort order for ${items.length} collections` });
  } catch (error: any) {
    console.error('Error reordering collections:', error);
    return NextResponse.json({ error: error.message || 'Failed to reorder collections' }, { status: 500 });
  }
}
