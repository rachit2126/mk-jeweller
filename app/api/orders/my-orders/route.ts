import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/services/auth';
import { connectDB } from '@/lib/db/mongodb';

export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const db = await connectDB();
    const ordersCol = db.collection('orders');

    // Query orders for this specific authenticated user
    const userOrders = await ordersCol
      .find({
        $or: [
          { userId: session.userId },
          { customerId: session.userId },
          { 'customer.email': session.email.toLowerCase() },
          { customerEmail: session.email.toLowerCase() },
        ],
      })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedOrders = userOrders.map((ord: any) => {
      const { _id, ...rest } = ord;
      return {
        ...rest,
        id: rest.orderNumber || rest.id || _id.toString(),
      };
    });

    return NextResponse.json({
      orders: formattedOrders,
    });
  } catch (error: any) {
    console.error('[My Orders API Error]:', error?.message);
    return NextResponse.json({ error: 'Unable to retrieve your orders.' }, { status: 500 });
  }
}
