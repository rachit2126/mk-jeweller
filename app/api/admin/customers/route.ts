import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search')?.toLowerCase().trim() || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));

  const db = await connectDB();
  const query: any = {};

  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
      { id: regex },
    ];
  }

  const [rawCustomers, orders] = await Promise.all([
    db.collection('customers').find(query).sort({ createdAt: -1 }).toArray(),
    db.collection('orders').find({}).toArray(),
  ]);

  // Recalculate authoritative stats strictly from real MongoDB orders
  const enriched = rawCustomers.map(cust => {
    const { _id, password, passwordHash, ...rest } = cust as any;
    const custId = rest.id || _id?.toString();

    // Match orders by customer ID or email
    const custOrders = orders.filter(o =>
      (o.customerId && (o.customerId === custId || o.customerId === _id?.toString())) ||
      (o.email && cust.email && o.email.toLowerCase() === cust.email.toLowerCase())
    );

    // Eligible paid spend (excluding cancelled and refunded orders)
    const paidEligibleOrders = custOrders.filter(o =>
      o.paymentStatus === 'paid' && o.status !== 'cancelled' && o.status !== 'refunded'
    );
    const totalSpend = paidEligibleOrders.reduce(
      (sum, o) => sum + (Number(o.amount) || Number(o.total) || 0),
      0
    );

    // Latest order date
    const sortedOrders = [...custOrders].sort((a, b) => {
      const timeA = new Date(a.createdAt || a.date || 0).getTime();
      const timeB = new Date(b.createdAt || b.date || 0).getTime();
      return timeB - timeA;
    });
    const lastOrder = sortedOrders[0];
    const lastOrderDate = lastOrder
      ? (lastOrder.date || (lastOrder.createdAt ? new Date(lastOrder.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : null))
      : null;

    return {
      ...rest,
      id: custId,
      ordersCount: custOrders.length,
      totalSpend,
      lastOrderDate,
      status: rest.status || 'active',
    };
  });

  const total = enriched.length;
  const skip = (page - 1) * limit;
  const paginated = enriched.slice(skip, skip + limit);

  return NextResponse.json({
    success: true,
    customers: paginated,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    await db.collection('customers').updateOne(filter, { $set: { ...updates, updatedAt: new Date().toISOString() } });
    await logAuditMongo(session.name, session.email, 'CUSTOMER_UPDATED', 'Customer', id, 'Updated customer details in MongoDB');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const result = await db.collection('customers').deleteOne(filter);
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    await logAuditMongo(session.name, session.email, 'CUSTOMER_DELETED', 'Customer', id, 'Deleted customer record from MongoDB');

    return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete customer' }, { status: 500 });
  }
}
