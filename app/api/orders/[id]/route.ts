import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentUser, getCurrentAdmin } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const db = await connectDB();
    const isObjectId = ObjectId.isValid(decodedId) && decodedId.length === 24;

    const filter = isObjectId
      ? { $or: [{ _id: new ObjectId(decodedId) }, { id: decodedId }, { id: `#${decodedId}` }] }
      : { $or: [{ id: decodedId }, { id: `#${decodedId}` }] };

    const order = await db.collection('orders').findOne(filter);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { _id, ...rest } = order;
    return NextResponse.json({ success: true, order: { ...rest, id: rest.id || _id?.toString() } });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to retrieve order details.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    const admin = await getCurrentAdmin();

    if (!user && !admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const body = await req.json();

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(decodedId) && decodedId.length === 24;

    const filter = isObjectId
      ? { $or: [{ _id: new ObjectId(decodedId) }, { id: decodedId }, { id: `#${decodedId}` }] }
      : { $or: [{ id: decodedId }, { id: `#${decodedId}` }] };

    const order = await db.collection('orders').findOne(filter);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Only allow customer to cancel their own order, or admin to modify any field
    if (!admin && order.customerId !== user?.userId && order.email !== user?.email) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates: any = { updatedAt: new Date().toISOString() };
    if (body.status) updates.status = body.status;
    if (body.notes !== undefined) updates.notes = body.notes;

    if (body.status && body.status !== order.status) {
      const timeline = order.timeline || [];
      timeline.unshift({
        status: `Status updated to ${body.status.toUpperCase()}`,
        note: body.note || `Status updated`,
        timestamp: new Date().toISOString(),
      });
      updates.timeline = timeline;
    }

    await db.collection('orders').updateOne({ _id: order._id }, { $set: updates });

    return NextResponse.json({ success: true, message: 'Order updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to update order.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
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

    return NextResponse.json({ success: true, message: 'Order deleted successfully from MongoDB' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
