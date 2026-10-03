import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await connectDB();
    const banners = await db.collection('banners')
      .find({})
      .sort({ sortOrder: 1 })
      .toArray();

    const formatted = banners.map((b: any) => {
      const { _id, ...rest } = b;
      return { ...rest, id: rest.id || _id?.toString() };
    });

    return NextResponse.json(
      { success: true, banners: formatted },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    console.error('[Admin Banners API GET Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to retrieve banners' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.title || !data.desktopImage) {
      return NextResponse.json({ error: 'Title and Desktop Image are required' }, { status: 400 });
    }

    const db = await connectDB();
    const id = `ban-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const count = await db.collection('banners').countDocuments();

    const newBanner = {
      id,
      eyebrow: (data.eyebrow || '').trim() || undefined,
      title: data.title.trim(),
      subtitle: (data.subtitle || '').trim(),
      desktopImage: data.desktopImage.trim(),
      mobileImage: (data.mobileImage || '').trim() || null,
      altText: (data.altText || '').trim() || undefined,
      ctaText: (data.ctaText || 'SHOP COLLECTION').trim(),
      ctaUrl: (data.ctaUrl || '/shop').trim(),
      secondaryCtaText: (data.secondaryCtaText || '').trim() || undefined,
      secondaryCtaUrl: (data.secondaryCtaUrl || '').trim() || undefined,
      placement: data.placement || 'homepage_hero',
      sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : count + 1,
      status: data.status === 'inactive' ? 'inactive' : 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If new banner is active homepage_hero, deactivate other hero banners
    if (newBanner.placement === 'homepage_hero' && newBanner.status === 'active') {
      await db.collection('banners').updateMany(
        { placement: 'homepage_hero' },
        { $set: { status: 'inactive', updatedAt: new Date().toISOString() } }
      );
    }

    await db.collection('banners').insertOne(newBanner as any);

    await logAuditMongo(
      session.name,
      session.email,
      'BANNER_CREATED',
      'Banner',
      id,
      `Created banner "${newBanner.title}" (Placement: ${newBanner.placement})`
    );

    return NextResponse.json({ success: true, banner: newBanner });
  } catch (error: any) {
    console.error('[Admin Banners API POST Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to create banner' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { id, ...updates } = data;

    if (!id) {
      return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });
    }

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const banner = await db.collection('banners').findOne(filter);
    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    // Enforce single active homepage hero
    const nextPlacement = updates.placement || banner.placement;
    const nextStatus = updates.status !== undefined ? updates.status : banner.status;
    if (nextPlacement === 'homepage_hero' && nextStatus === 'active') {
      await db.collection('banners').updateMany(
        { placement: 'homepage_hero', id: { $ne: banner.id || id } },
        { $set: { status: 'inactive', updatedAt: new Date().toISOString() } }
      );
    }

    updates.updatedAt = new Date().toISOString();
    await db.collection('banners').updateOne(filter, { $set: updates });

    await logAuditMongo(
      session.name,
      session.email,
      'BANNER_UPDATED',
      'Banner',
      banner.id || id,
      `Updated banner "${updates.title || banner.title}"`
    );

    const updated = await db.collection('banners').findOne(filter);
    const { _id, ...clean } = updated as any;

    return NextResponse.json({ success: true, banner: clean });
  } catch (error: any) {
    console.error('[Admin Banners API PUT Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Banner ID required' }, { status: 400 });
    }

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const banner = await db.collection('banners').findOne(filter);
    if (!banner) {
      return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    }

    await db.collection('banners').deleteOne(filter);

    await logAuditMongo(
      session.name,
      session.email,
      'BANNER_DELETED',
      'Banner',
      banner.id || id,
      `Deleted banner "${banner.title}" from MongoDB`
    );

    return NextResponse.json({
      success: true,
      message: `Deleted banner "${banner.title}" from MongoDB`,
      deletedId: id,
    });
  } catch (error: any) {
    console.error('[Admin Banners API DELETE Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete banner' }, { status: 500 });
  }
}
