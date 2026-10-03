import { connectDB } from '@/lib/db/mongodb';

export interface OrderStatsResult {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  refunded: number;
}

/**
 * Reusable server-side service to calculate authoritative order statistics directly from MongoDB.
 * Used by Sidebar, Orders Page, Dashboard, Analytics, and API endpoints.
 */
export async function getOrderStats(): Promise<OrderStatsResult> {
  const db = await connectDB();

  // Run aggregation to group by status, plus count total and refunded
  const [statusAgg, refundedCount, totalCount] = await Promise.all([
    db.collection('orders').aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]).toArray(),
    db.collection('orders').countDocuments({
      $or: [
        { status: 'refunded' },
        { paymentStatus: 'refunded' },
      ],
    }),
    db.collection('orders').countDocuments({}),
  ]);

  const statsMap: Record<string, number> = {};
  for (const item of statusAgg) {
    if (item._id) {
      statsMap[item._id] = item.count;
    }
  }

  return {
    total: totalCount,
    pending: statsMap['pending'] || 0,
    processing: statsMap['processing'] || 0,
    shipped: statsMap['shipped'] || 0,
    delivered: statsMap['delivered'] || 0,
    cancelled: statsMap['cancelled'] || 0,
    refunded: refundedCount,
  };
}
