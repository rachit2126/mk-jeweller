import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const db = await connectDB();
  const isObjectId = ObjectId.isValid(decodedId) && decodedId.length === 24;

  const filter = isObjectId
    ? { $or: [{ _id: new ObjectId(decodedId) }, { id: decodedId }] }
    : { id: decodedId };

  const customer = await db.collection('customers').findOne(filter);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  const { _id, password, passwordHash, ...rest } = customer as any;
  const custId = rest.id || _id?.toString();

  // Find all orders associated with this customer
  const orders = await db.collection('orders').find({
    $or: [
      { customerId: custId },
      { customerId: _id?.toString() },
      { email: customer.email?.toLowerCase() },
    ],
  }).sort({ createdAt: -1 }).toArray();

  const paidOrders = orders.filter(
    (o) => o.paymentStatus === 'paid' && o.status !== 'cancelled' && o.status !== 'refunded'
  );
  const totalSpend = paidOrders.reduce(
    (sum, o) => sum + (Number(o.amount) || Number(o.total) || 0),
    0
  );

  return NextResponse.json({
    success: true,
    customer: {
      ...rest,
      id: custId,
      ordersCount: orders.length,
      totalSpend,
      orders,
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const updates = await req.json();

  const db = await connectDB();
  const isObjectId = ObjectId.isValid(decodedId) && decodedId.length === 24;
  const filter = isObjectId
    ? { $or: [{ _id: new ObjectId(decodedId) }, { id: decodedId }] }
    : { id: decodedId };

  const result = await db.collection('customers').updateOne(filter, {
    $set: { ...updates, updatedAt: new Date().toISOString() },
  });

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  await logAuditMongo(
    session.name,
    session.email,
    'CUSTOMER_UPDATED',
    'Customer',
    decodedId,
    `Updated customer profile ${decodedId}`
  );

  return NextResponse.json({ success: true });
}
