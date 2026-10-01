import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentUser } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');

    const db = await connectDB();
    const query: any = { status: 'approved' };
    if (productId) {
      query.productId = productId;
    }

    const reviews = await db.collection('reviews').find(query).sort({ date: -1 }).toArray();
    const formatted = reviews.map((r: any) => {
      const { _id, ...rest } = r;
      return { ...rest, id: rest.id || _id?.toString() };
    });

    return NextResponse.json({ success: true, reviews: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to retrieve reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, rating, title, comment, customerName, location } = body;

    if (!productId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required review fields.' }, { status: 400 });
    }

    const session = await getCurrentUser();
    const db = await connectDB();

    // Check if customer actually ordered this item for verified buyer status
    let isVerified = false;
    if (session?.email) {
      const pastOrder = await db.collection('orders').findOne({
        email: session.email.toLowerCase(),
        'items.productId': productId,
      });
      if (pastOrder) isVerified = true;
    }

    const newReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId,
      customerName: session?.name || customerName || 'Valued Patron',
      rating: Number(rating) || 5,
      title: title || 'Exceptional Craftsmanship',
      comment,
      location: location || 'India',
      verified: isVerified,
      status: 'pending', // Pending admin approval by default
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      createdAt: new Date().toISOString(),
    };

    const result = await db.collection('reviews').insertOne(newReview as any);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully and is awaiting curation.',
      review: { ...newReview, _id: result.insertedId.toString() },
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to submit review.' }, { status: 500 });
  }
}
