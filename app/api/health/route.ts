import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await connectDB();
    await db.command({ ping: 1 });
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
    }, { status: 503 });
  }
}
