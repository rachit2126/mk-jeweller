import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentUser } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/wishlist
 * Fetches persisted wishlist from MongoDB for the authenticated user.
 */
export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ wishlist: [] });
    }

    const db = await connectDB();
    const userWishlist = await db.collection('user_wishlists').findOne({ userId: session.userId });

    return NextResponse.json({
      success: true,
      wishlist: userWishlist?.items || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to retrieve wishlist' }, { status: 500 });
  }
}

/**
 * POST /api/wishlist
 * Persists and updates user wishlist in MongoDB.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required for server wishlist' }, { status: 401 });
    }

    const { items } = await req.json();
    const db = await connectDB();

    await db.collection('user_wishlists').updateOne(
      { userId: session.userId },
      {
        $set: {
          items: items || [],
          updatedAt: new Date().toISOString(),
        },
        $setOnInsert: {
          createdAt: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Wishlist synced to MongoDB' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to sync wishlist' }, { status: 500 });
  }
}
