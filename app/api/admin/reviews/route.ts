import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

async function recalculateProductReviewStats(db: any, productId: string) {
  if (!productId) return;
  try {
    const approvedReviews = await db.collection('reviews').find({
      $or: [{ productId }, { productSlug: productId }],
      status: 'approved',
    }).toArray();

    const count = approvedReviews.length;
    const avgRating = count > 0
      ? Math.round((approvedReviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 5), 0) / count) * 10) / 10
      : 0;

    await db.collection('products').updateOne(
      { $or: [{ id: productId }, { slug: productId }] },
      { $set: { reviewsCount: count, rating: avgRating } }
    );
  } catch (err) {
    console.error('Error recalculating product review stats:', err);
  }
}

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase().trim() || '';
    const status = searchParams.get('status') || 'all';
    const ratingFilter = searchParams.get('rating');
    const verifiedFilter = searchParams.get('verified');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));

    const db = await connectDB();

    // Fetch reviews, products, and paid orders in parallel for authoritative resolution
    const [rawReviews, products, paidOrders] = await Promise.all([
      db.collection('reviews').find({}).sort({ createdAt: -1, date: -1 }).toArray(),
      db.collection('products').find({}).toArray(),
      db.collection('orders').find({ paymentStatus: 'paid', status: { $nin: ['cancelled', 'refunded'] } }).toArray(),
    ]);

    // Build product lookup map
    const productMap = new Map<string, any>();
    products.forEach((p: any) => {
      if (p.id) productMap.set(p.id, p);
      if (p.slug) productMap.set(p.slug, p);
    });

    // Authoritative enrichment: verified buyer check, real product relation, dates
    const enriched = rawReviews.map((r: any) => {
      const { _id, ...rest } = r;
      const reviewId = rest.id || _id?.toString();
      const pId = rest.productId || rest.productSlug;
      const linkedProduct = pId ? productMap.get(pId) : null;
      const productName = linkedProduct?.name || rest.productName || rest.purchasedProduct || (pId ? 'Product unavailable' : 'Jewellery Piece');

      // Verified buyer check: customer actually purchased this product in a qualifying paid order
      const reviewerEmail = (rest.customerEmail || rest.email || '').toLowerCase().trim();
      const reviewerCustId = rest.customerId || '';
      let isVerified = false;

      if (pId && (reviewerEmail || reviewerCustId)) {
        isVerified = paidOrders.some((order: any) => {
          const matchUser = (reviewerEmail && order.email?.toLowerCase().trim() === reviewerEmail) ||
                            (reviewerCustId && order.customerId === reviewerCustId);
          if (!matchUser) return false;

          // Check if order items contain this product
          return Array.isArray(order.items) && order.items.some((item: any) =>
            item.productId === pId || item.slug === pId || (linkedProduct && item.productId === linkedProduct.id)
          );
        });
      }

      // Format date
      let displayDate = rest.date;
      if (rest.createdAt) {
        try {
          displayDate = new Date(rest.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        } catch {
          displayDate = rest.date || 'Recent';
        }
      }

      return {
        ...rest,
        id: reviewId,
        productId: pId,
        productName,
        productImage: linkedProduct?.images?.[0] || null,
        rating: Math.max(1, Math.min(5, Number(rest.rating) || 5)),
        title: rest.title ? rest.title.trim() : '',
        comment: rest.comment || rest.content || '',
        customerName: rest.customerName || 'Valued Patron',
        customerEmail: rest.customerEmail || rest.email || '',
        location: rest.location ? rest.location.trim() : null, // Never fabricate location
        verifiedBuyer: isVerified,
        status: rest.status || 'pending',
        date: displayDate || 'Recent',
        createdAt: rest.createdAt || rest.date || new Date().toISOString(),
      };
    });

    // Filter in-memory after authoritative verification
    let filtered = enriched;

    if (status !== 'all') {
      filtered = filtered.filter(r => r.status === status);
    }

    if (ratingFilter && ratingFilter !== 'all') {
      const targetRating = parseInt(ratingFilter, 10);
      filtered = filtered.filter(r => Math.round(r.rating) === targetRating);
    }

    if (verifiedFilter === 'true') {
      filtered = filtered.filter(r => r.verifiedBuyer === true);
    } else if (verifiedFilter === 'false') {
      filtered = filtered.filter(r => r.verifiedBuyer === false);
    }

    if (search) {
      filtered = filtered.filter(r =>
        r.customerName?.toLowerCase().includes(search) ||
        r.customerEmail?.toLowerCase().includes(search) ||
        r.title?.toLowerCase().includes(search) ||
        r.comment?.toLowerCase().includes(search) ||
        r.productName?.toLowerCase().includes(search)
      );
    }

    const total = filtered.length;
    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      reviews: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error: any) {
    console.error('Error fetching admin reviews:', error);
    return NextResponse.json({ error: 'Failed to retrieve reviews from database' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status, featured } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    if (status && !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json({ error: 'Invalid review status' }, { status: 400 });
    }

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const review = await db.collection('reviews').findOne(filter);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    const updates: any = { updatedAt: new Date().toISOString() };
    if (status) updates.status = status;
    if (typeof featured === 'boolean') updates.featured = featured;

    await db.collection('reviews').updateOne(filter, { $set: updates });

    // Record formal audit log
    const actionName = status === 'approved' ? 'REVIEW_APPROVED' : status === 'rejected' ? 'REVIEW_REJECTED' : 'REVIEW_MODERATED';
    await logAuditMongo(
      session.name,
      session.email,
      actionName,
      'Review',
      id,
      `Moderated review by ${review.customerName || 'customer'} to '${status || 'updated'}'`
    );

    // Recalculate product rating aggregates in MongoDB if product exists
    const pId = review.productId || review.productSlug;
    if (pId) {
      await recalculateProductReviewStats(db, pId);
    }

    const updatedReview = { ...review, ...updates };
    delete (updatedReview as any)._id;

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: error.message || 'Failed to update review' }, { status: 500 });
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

    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 });
    }

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const review = await db.collection('reviews').findOne(filter);
    if (!review) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    await db.collection('reviews').deleteOne(filter);

    // Record formal audit log
    await logAuditMongo(
      session.name,
      session.email,
      'REVIEW_DELETED',
      'Review',
      id,
      `Permanently deleted review for ${review.productName || review.productId || 'product'}`
    );

    // Recalculate product rating aggregates in MongoDB
    const pId = review.productId || review.productSlug;
    if (pId) {
      await recalculateProductReviewStats(db, pId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete review' }, { status: 500 });
  }
}
