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
      query.$or = [{ productId }, { productSlug: productId }];
    }

    const reviews = await db.collection('reviews').find(query).sort({ createdAt: -1, date: -1 }).toArray();
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

    const numRating = Math.max(1, Math.min(5, Number(rating) || 5));
    const session = await getCurrentUser();
    const db = await connectDB();

    // Look up product to verify existence and get authentic name
    const product = await db.collection('products').findOne({
      $or: [{ id: productId }, { slug: productId }],
    });

    const reviewerEmail = session?.email?.toLowerCase().trim() || body.customerEmail?.toLowerCase().trim() || null;
    const reviewerName = session?.name?.trim() || customerName?.trim() || 'Valued Patron';

    // Check if customer actually purchased this item in a valid paid order
    let isVerified = false;
    if (reviewerEmail) {
      const pastOrder = await db.collection('orders').findOne({
        email: reviewerEmail,
        paymentStatus: 'paid',
        status: { $nin: ['cancelled', 'refunded'] },
        $or: [
          { 'items.productId': productId },
          { 'items.slug': productId },
          ...(product?.id ? [{ 'items.productId': product.id }] : []),
        ],
      });
      if (pastOrder) isVerified = true;
    }

    // Check for existing review from this customer for this product to prevent spam
    if (reviewerEmail) {
      const existing = await db.collection('reviews').findOne({
        productId,
        $or: [{ customerEmail: reviewerEmail }, { email: reviewerEmail }],
      });
      if (existing) {
        return NextResponse.json(
          { error: 'You have already submitted a review for this jewellery piece.' },
          { status: 409 }
        );
      }
    }

    const newReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId,
      productName: product?.name || '925 Sterling Silver Jewellery',
      customerName: reviewerName,
      customerEmail: reviewerEmail || undefined,
      rating: numRating,
      title: title ? title.trim() : '',
      comment: comment.trim(),
      location: location ? location.trim() : null, // Never fabricate location
      verifiedBuyer: isVerified,
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
