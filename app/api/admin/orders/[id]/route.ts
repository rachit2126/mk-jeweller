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

  const order = await db.collection('orders').findOne(
    isObjectId
      ? { $or: [{ _id: new ObjectId(decodedId) }, { id: decodedId }, { id: `#${decodedId}` }] }
      : { $or: [{ id: decodedId }, { id: `#${decodedId}` }] }
  );

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const { _id, ...rest } = order;
  return NextResponse.json({ order: { ...rest, id: rest.id || _id?.toString() } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const { status, paymentStatus, note, timelineNote } = await req.json();

  const db = await connectDB();
  const isObjectId = ObjectId.isValid(decodedId) && decodedId.length === 24;

  const filter = isObjectId
    ? { $or: [{ _id: new ObjectId(decodedId) }, { id: decodedId }, { id: `#${decodedId}` }] }
    : { $or: [{ id: decodedId }, { id: `#${decodedId}` }] };

  const order = await db.collection('orders').findOne(filter);

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  const orderId = order.id;
  const oldStatus = order.status;
  const timeline = order.timeline || [];

  if (status && status !== oldStatus) {
    timeline.unshift({
      status: `Status changed to ${status.toUpperCase()}`,
      note: timelineNote || `Order status updated by ${session.name}`,
      timestamp: new Date().toISOString(),
    });

    await logAuditMongo(
      session.name,
      session.email,
      'ORDER_UPDATED',
      'Order',
      orderId,
      `Changed order ${orderId} status from ${oldStatus} to ${status}`
    );
  }

  if (paymentStatus && paymentStatus !== order.paymentStatus) {
    timeline.unshift({
      status: `Payment ${paymentStatus.toUpperCase()}`,
      note: `Payment status marked as ${paymentStatus}`,
      timestamp: new Date().toISOString(),
    });
  }

  const updates: any = {
    timeline,
    updatedAt: new Date().toISOString(),
  };
  if (status) updates.status = status;
  if (paymentStatus) updates.paymentStatus = paymentStatus;
  if (note !== undefined) updates.notes = note;

  await db.collection('orders').updateOne({ _id: order._id }, { $set: updates });

  const updatedOrder = {
    ...order,
    ...updates,
  };
  delete (updatedOrder as any)._id;

  return NextResponse.json({ success: true, order: updatedOrder });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const db = await connectDB();
  const isObjectId = ObjectId.isValid(decodedId) && decodedId.length === 24;

  const filter = isObjectId
    ? { $or: [{ _id: new ObjectId(decodedId) }, { id: decodedId }, { id: `#${decodedId}` }] }
    : { $or: [{ id: decodedId }, { id: `#${decodedId}` }] };

  const result = await db.collection('orders').deleteOne(filter);
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }

  await logAuditMongo(
    session.name,
    session.email,
    'ORDER_DELETED',
    'Order',
    decodedId,
    `Deleted order ${decodedId} from MongoDB`
  );

  return NextResponse.json({ success: true, message: 'Order deleted successfully' });
}
