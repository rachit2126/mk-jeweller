import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await connectDB();
    const reviews = await db.collection('reviews').find({}).toArray();

    const total = reviews.length;
    const pending = reviews.filter(r => r.status === 'pending').length;
    const approved = reviews.filter(r => r.status === 'approved').length;
    const rejected = reviews.filter(r => r.status === 'rejected').length;

    return NextResponse.json({
      success: true,
      total,
      pending,
      approved,
      rejected,
    });
  } catch (error: any) {
    console.error('Error fetching review stats:', error);
    return NextResponse.json({ error: 'Failed to retrieve review stats' }, { status: 500 });
  }
}
