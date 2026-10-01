import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin } from '@/lib/services/auth';

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await connectDB();
  const docs = await db.collection('reviews').find({}).toArray();
  const reviews = docs.map(r => {
    const { _id, ...rest } = r;
    return { ...rest, id: rest.id || _id?.toString() };
  });

  return NextResponse.json({ reviews });
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id, status, featured } = await req.json();
  const db = await connectDB();
  const review = await db.collection('reviews').findOne({ id });

  if (!review) {
    return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  }

  const updates: any = {};
  if (status) updates.status = status;
  if (typeof featured === 'boolean') updates.featured = featured;

  await db.collection('reviews').updateOne({ id }, { $set: updates });

  await db.collection('audit_logs').insertOne({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    adminName: session.name,
    adminEmail: session.email,
    action: 'REVIEW_MODERATED',
    resource: 'Review',
    resourceId: id,
    details: `Updated review status to ${status || 'updated'} in MongoDB`,
    timestamp: new Date().toISOString(),
  });

  const updatedReview = { ...review, ...updates };
  delete (updatedReview as any)._id;

  return NextResponse.json({ success: true, review: updatedReview });
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const db = await connectDB();
  await db.collection('reviews').deleteOne({ id });

  await db.collection('audit_logs').insertOne({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    adminName: session.name,
    adminEmail: session.email,
    action: 'REVIEW_DELETED',
    resource: 'Review',
    resourceId: id,
    details: 'Deleted review from MongoDB',
    timestamp: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}

