import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin } from '@/lib/services/auth';

export async function GET(req: Request) {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '500', 10), 1000);

    const db = await connectDB();
    const total = await db.collection('audit_logs').countDocuments();
    const docs = await db.collection('audit_logs').find({}).sort({ timestamp: -1 }).limit(limit).toArray();
    const logs = docs.map(l => {
      const { _id, ...rest } = l;
      return { ...rest, id: rest.id || _id?.toString() };
    });

    return NextResponse.json({ logs, total });
  } catch (error) {
    console.error('Audit logs fetch error:', error);
    return NextResponse.json({ error: 'Failed to retrieve audit logs' }, { status: 500 });
  }
}
