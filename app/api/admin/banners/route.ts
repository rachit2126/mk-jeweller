import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { DbBanner } from '@/lib/db/types';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function GET() {
  const db = await connectDB();
  const docs = await db.collection('banners').find({}).sort({ sortOrder: 1 }).toArray();
  const banners = docs.map(b => {
    const { _id, ...rest } = b;
    return { ...rest, id: rest.id || _id?.toString() } as DbBanner;
  });
  return NextResponse.json({ banners });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await req.json();
    const db = await connectDB();
    const count = await db.collection('banners').countDocuments();

    const banner: DbBanner = {
      id: `ban-${Date.now()}`,
      title: data.title || 'Untitled Banner',
      subtitle: data.subtitle,
      desktopImage: data.desktopImage || '/images/editorial/bridal-banner-clean-hd.jpg',
      mobileImage: data.mobileImage,
      ctaText: data.ctaText || 'Shop Now',
      ctaUrl: data.ctaUrl || '/shop',
      placement: data.placement || 'homepage_hero',
      sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : count + 1,
      status: data.status || 'active',
    };

    await db.collection('banners').insertOne(banner as any);
    await logAuditMongo(session.name, session.email, 'BANNER_CREATED', 'Banner', banner.id, `Created banner "${banner.title}" in MongoDB`);

    return NextResponse.json({ success: true, banner });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create banner' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: 'Banner ID is required' }, { status: 400 });

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const banner = await db.collection('banners').findOne(filter);
    if (!banner) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });

    await db.collection('banners').updateOne(filter, { $set: updates });
    await logAuditMongo(session.name, session.email, 'BANNER_UPDATED', 'Banner', id, `Updated banner "${banner.title}" in MongoDB`);

    const updated = { ...banner, ...updates };
    delete (updated as any)._id;

    return NextResponse.json({ success: true, banner: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const result = await db.collection('banners').deleteOne(filter);
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    await logAuditMongo(session.name, session.email, 'BANNER_DELETED', 'Banner', id, 'Deleted banner from MongoDB');

    return NextResponse.json({ success: true, message: 'Banner deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete banner' }, { status: 500 });
  }
}
