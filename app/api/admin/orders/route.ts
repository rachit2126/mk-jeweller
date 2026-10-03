import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { DbOrder } from '@/lib/db/types';
import { getCurrentAdmin } from '@/lib/services/auth';
import { getOrderStats } from '@/lib/services/orderStats';

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const status = searchParams.get('status')?.toLowerCase().trim() || '';
  const paymentStatus = searchParams.get('paymentStatus')?.toLowerCase().trim() || '';
  const sort = searchParams.get('sort')?.toLowerCase().trim() || 'newest';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));

  const db = await connectDB();
  const query: any = {};

  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { id: regex },
      { customerName: regex },
      { email: regex },
      { phone: regex },
    ];
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (paymentStatus && paymentStatus !== 'all') {
    query.paymentStatus = paymentStatus;
  }

  // Sorting
  let sortOption: any = { createdAt: -1 };
  if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  } else if (sort === 'highest') {
    sortOption = { amount: -1 };
  } else if (sort === 'lowest') {
    sortOption = { amount: 1 };
  }

  const total = await db.collection('orders').countDocuments(query);
  const skip = (page - 1) * limit;

  const docs = await db.collection('orders')
    .find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .toArray();

  const orders = docs.map((o) => {
    const { _id, ...rest } = o;
    return { ...rest, id: rest.id || _id?.toString() } as DbOrder;
  });

  // Calculate real MongoDB status counts using the shared OrderStatsService
  const stats = await getOrderStats();
  const counts = {
    all: stats.total,
    pending: stats.pending,
    processing: stats.processing,
    shipped: stats.shipped,
    delivered: stats.delivered,
    cancelled: stats.cancelled,
    refunded: stats.refunded,
  };

  return NextResponse.json({
    orders,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
    counts,
  });
}

export async function POST(req: NextRequest) {
  // Can be called by storefront checkout or admin
  try {
    const data = await req.json();
    const db = await connectDB();

    const orderCount = await db.collection('orders').countDocuments();
    const orderId = `#MKT${String(12346 + orderCount)}`;
    const newOrder: any = {
      orderNumber: orderId,
      id: orderId,
      customerId: data.customerId,
      customerName: data.customerName || 'Customer',
      email: data.email || '',
      phone: data.phone || '',
      items: data.items || [],
      subtotal: data.subtotal || 0,
      discount: data.discount || 0,
      tax: data.tax || 0,
      shipping: data.shipping || 0,
      amount: data.amount || 0,
      paymentStatus: data.paymentStatus || 'paid',
      paymentMethod: data.paymentMethod || 'Razorpay UPI',
      status: 'processing',
      shippingAddress: data.shippingAddress || {
        addressLine: 'Delivery Address',
        city: 'Jaipur',
        state: 'Rajasthan',
        postalCode: '302001',
        country: 'India',
      },
      timeline: [
        { status: 'Order Placed', note: 'Customer successfully checked out', timestamp: new Date().toISOString() },
      ],
      notes: data.notes,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('orders').insertOne(newOrder as any);

    // Update customer spend & orders count in MongoDB
    if (newOrder.email) {
      await db.collection('customers').updateOne(
        { email: newOrder.email.toLowerCase() },
        {
          $inc: { ordersCount: 1, totalSpend: newOrder.amount },
          $set: { lastOrderDate: new Date().toISOString().slice(0, 10) },
        }
      );
    }

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}

