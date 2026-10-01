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

  const db = await connectDB();
  const query: any = {};

  if (search) {
    const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
    ];
  }

  const [customers, orders] = await Promise.all([
    db.collection('customers').find(query).toArray(),
    db.collection('orders').find({}).toArray(),
  ]);

  // Recalculate actual stats from real MongoDB orders
  const enriched = customers.map(cust => {
    const { _id, ...rest } = cust;
    const custOrders = orders.filter(o => o.email?.toLowerCase() === cust.email?.toLowerCase());
    const totalSpend = custOrders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? (o.amount || o.total || 0) : 0), 0);
    return {
      ...rest,
      id: rest.id || _id?.toString(),
      ordersCount: custOrders.length,
      totalSpend: totalSpend || cust.totalSpend || 0,
      orders: custOrders,
    };
  });

  return NextResponse.json({ customers: enriched });
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
