import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { DbCoupon } from '@/lib/db/types';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await connectDB();
  const docs = await db.collection('coupons').find({}).toArray();
  const coupons = docs.map(c => {
    const { _id, ...rest } = c;
    return { ...rest, id: rest.id || _id?.toString() } as DbCoupon;
  });
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.code || !data.value) {
      return NextResponse.json({ error: 'Code and discount value are required' }, { status: 400 });
    }

    const cleanCode = data.code.toUpperCase().trim();
    const db = await connectDB();

    const existing = await db.collection('coupons').findOne({ code: cleanCode });
    if (existing) {
      return NextResponse.json({ error: 'Coupon code already exists' }, { status: 400 });
    }

    const newCoupon: DbCoupon = {
      id: `coup-${Date.now()}`,
      code: cleanCode,
      type: data.type || 'percentage',
      value: Number(data.value),
      minOrder: Number(data.minOrder) || 0,
      maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
      startDate: data.startDate || new Date().toISOString().slice(0, 10),
      endDate: data.endDate || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10),
      usageLimit: Number(data.usageLimit) || 1000,
      usageCount: 0,
      status: 'active',
    };

    await db.collection('coupons').insertOne(newCoupon as any);
    await logAuditMongo(session.name, session.email, 'COUPON_CREATED', 'Coupon', newCoupon.id, `Created coupon "${cleanCode}" in MongoDB`);

    return NextResponse.json({ success: true, coupon: newCoupon });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create coupon' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Coupon ID is required' }, { status: 400 });

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const coupon = await db.collection('coupons').findOne(filter);
    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    await db.collection('coupons').updateOne(filter, { $set: updates });
    await logAuditMongo(session.name, session.email, 'COUPON_UPDATED', 'Coupon', id, `Updated coupon ${coupon.code} in MongoDB`);

    const updated = { ...coupon, ...updates };
    delete (updated as any)._id;

    return NextResponse.json({ success: true, coupon: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update coupon' }, { status: 500 });
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
    if (!id) return NextResponse.json({ error: 'Coupon ID required' }, { status: 400 });

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const result = await db.collection('coupons').deleteOne(filter);
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    await logAuditMongo(session.name, session.email, 'COUPON_DELETED', 'Coupon', id, 'Deleted coupon from MongoDB');

    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete coupon' }, { status: 500 });
  }
}
