import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin } from '@/lib/services/auth';

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await connectDB();
  const docs = await db.collection('audit_logs').find({}).sort({ timestamp: -1 }).limit(100).toArray();
  const logs = docs.map(l => {
    const { _id, ...rest } = l;
    return { ...rest, id: rest.id || _id?.toString() };
  });

  return NextResponse.json({ logs });
}

