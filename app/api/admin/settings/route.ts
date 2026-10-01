import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function GET() {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const db = await connectDB();
  let settings: any = await db.collection('settings').findOne({});
  if (!settings) {
    const defaultSettings = {
      storeName: 'MK Silver Hub',
      supportEmail: 'care@mksilverhub.com',
      supportPhone: '+91 98765 43210',
      address: 'Johari Bazaar, Jaipur, Rajasthan 302003',
      taxRate: 3.0,
      currency: 'INR',
      freeShippingThreshold: 999,
      maintenanceMode: false,
    };
    const res = await db.collection('settings').insertOne(defaultSettings as any);
    settings = { ...defaultSettings, _id: res.insertedId };
  }

  const { _id, ...safe } = settings;
  return NextResponse.json({ settings: safe });
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const updates = await req.json();
    const db = await connectDB();

    await db.collection('settings').updateOne(
      {},
      { $set: { ...updates, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    await logAuditMongo(session.name, session.email, 'SETTINGS_UPDATED', 'Settings', 'global', 'Updated store settings in MongoDB');

    const updated = await db.collection('settings').findOne({});
    const { _id, ...safe } = updated || {};
    return NextResponse.json({ success: true, settings: safe });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 500 });
  }
}
