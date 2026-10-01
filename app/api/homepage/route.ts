import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();
    const sections = await db.collection('homepage')
      .find({ status: 'active' })
      .sort({ sortOrder: 1 })
      .toArray();

    const formatted = sections.map((s: any) => {
      const { _id, ...rest } = s;
      return { ...rest, id: rest.id || _id?.toString() };
    });

    return NextResponse.json({ success: true, sections: formatted });
  } catch (error: any) {
    return NextResponse.json({ error: 'Unable to retrieve homepage content' }, { status: 500 });
  }
}
