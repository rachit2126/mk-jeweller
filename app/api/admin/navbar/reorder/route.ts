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
    const data = await req.json();
    const items = data.items || data.reorder;

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Items array is required for reordering' }, { status: 400 });
    }

    const db = await connectDB();
    const navCol = db.collection('navigation');
    const now = new Date().toISOString();

    for (const item of items) {
      if (!item.id) continue;
      const updateDoc: any = {
        order: Number(item.order),
        sortOrder: Number(item.order),
        updatedAt: now,
      };

      if (item.parentId !== undefined) {
        updateDoc.parentId = item.parentId || null;
        updateDoc.level = item.parentId ? 2 : 1;
      }

      await navCol.updateOne({ id: item.id }, { $set: updateDoc });
    }

    await logAuditMongo(
      session.name,
      session.email,
      'NAVBAR_REORDERED',
      'Navigation',
      'reorder',
      `Reordered ${items.length} navbar navigation items`
    );

    return NextResponse.json({
      success: true,
      message: 'Navbar order updated successfully',
    });
  } catch (error: any) {
    console.error('[Admin Navbar Reorder Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to reorder navbar items' },
      { status: 500 }
    );
  }
}
