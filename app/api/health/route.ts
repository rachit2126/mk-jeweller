import { NextResponse } from 'next/server';
import { connectDB, isMongoConfigured } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const configured = isMongoConfigured();
  try {
    const db = await connectDB();
    await db.command({ ping: 1 });
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      configured: true,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      database: 'disconnected',
      configured,
      message: error?.message || 'Database connection currently unavailable',
    }, { status: 503 });
  }
}
