import { NextResponse } from 'next/server';
import { connectDB, resolveMongoUri } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
  const uri = resolveMongoUri();
  const isConfigured = Boolean(uri && uri.length > 0);

  // 1. Missing MongoDB Configuration State
  if (!isConfigured) {
    const cfEnv = (globalThis as any)?.__CLOUDFLARE_ENV__;
    const availableKeys = cfEnv && typeof cfEnv === 'object' ? Object.keys(cfEnv) : [];

    return NextResponse.json({
      status: 'error',
      database: 'missing_configuration',
      configured: false,
      message: 'MONGODB_URI is not available in the Worker environment',
      diagnostics: {
        hasProcessEnvUri: Boolean(process.env.MONGODB_URI || process.env.MONGODB_ATLAS_URI),
        hasCfEnvUri: Boolean(cfEnv?.MONGODB_URI || cfEnv?.MONGODB_ATLAS_URI),
        cfEnvKeys: availableKeys,
      },
    }, { status: 503 });
  }

  // 2. Test Live Database Connectivity
  try {
    const db = await connectDB();
    const count = await db.collection('products').countDocuments({}, { limit: 1, maxTimeMS: 3000 });

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      configured: true,
      items: count,
    }, { status: 200 });
  } catch (error: any) {
    // 3. Database Connection Failure State
    return NextResponse.json({
      status: 'error',
      database: 'connection_failed',
      configured: true,
      message: error?.message || 'Database connection currently unavailable',
    }, { status: 503 });
  }
}
