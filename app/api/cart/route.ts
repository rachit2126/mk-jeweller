import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentUser } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/cart
 * Fetches persisted cart from MongoDB for the authenticated user.
 */
export async function GET() {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ cart: [] });
    }

    const db = await connectDB();
    const userCart = await db.collection('user_carts').findOne({ userId: session.userId });

    return NextResponse.json({
      success: true,
      cart: userCart?.items || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to retrieve cart' }, { status: 500 });
  }
}

/**
 * POST /api/cart
 * Persists and updates user cart in MongoDB.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getCurrentUser();
    if (!session) {
      return NextResponse.json({ error: 'Authentication required for server cart' }, { status: 401 });
    }

    const { items } = await req.json();
    const db = await connectDB();

    await db.collection('user_carts').updateOne(
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

    return NextResponse.json({ success: true, message: 'Cart synced to MongoDB' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to sync cart' }, { status: 500 });
  }
}
