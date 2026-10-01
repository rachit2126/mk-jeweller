import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();
    const banners = await db.collection('banners')
      .find({ status: 'active' })
      .sort({ sortOrder: 1 })
      .toArray();

    const formatted = banners.map((b: any) => {
      const { _id, ...rest } = b;
      return { ...rest, id: rest.id || _id?.toString() };
    });

    return NextResponse.json({ success: true, banners: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to retrieve banners' }, { status: 500 });
  }
}
