import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/services/auth';
import { getOrderStats } from '@/lib/services/orderStats';
import { connectDB } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const stats = await getOrderStats();

    // Also get verified review count from MongoDB
    const db = await connectDB();
    const reviewsCount = await db.collection('reviews').countDocuments({});

    return NextResponse.json({
      success: true,
      total: stats.total,
      pending: stats.pending,
      processing: stats.processing,
      shipped: stats.shipped,
      delivered: stats.delivered,
      cancelled: stats.cancelled,
      refunded: stats.refunded,
      stats,
      reviewsCount,
    });
  } catch (error: any) {
    console.error('Error fetching admin order stats:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve order statistics' },
      { status: 500 }
    );
  }
}
