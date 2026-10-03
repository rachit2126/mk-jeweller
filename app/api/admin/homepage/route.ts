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
    const sections = await db.collection('homepage')
      .find({})
      .sort({ sortOrder: 1 })
      .toArray();

    const formatted = sections.map((s: any) => {
      const { _id, ...rest } = s;
      return { ...rest, id: rest.id || _id?.toString() };
    });

    return NextResponse.json(
      { success: true, sections: formatted },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    console.error('[Admin Homepage API GET Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to retrieve homepage sections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.name || !data.type) {
      return NextResponse.json({ error: 'Section name and type are required' }, { status: 400 });
    }

    const db = await connectDB();
    const id = data.id || `sec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const count = await db.collection('homepage').countDocuments();

    const newSection = {
      id,
      name: data.name.trim(),
      type: data.type.trim(),
      enabled: data.enabled !== false,
      sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : count + 1,
      title: (data.title || '').trim() || undefined,
      subtitle: (data.subtitle || '').trim() || undefined,
      ctaText: (data.ctaText || '').trim() || undefined,
      ctaUrl: (data.ctaUrl || '').trim() || undefined,
      image: (data.image || '').trim() || undefined,
      customData: data.customData || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.collection('homepage').insertOne(newSection as any);

    await logAuditMongo(
      session.name,
      session.email,
      'HOMEPAGE_SECTION_CREATED',
      'Homepage',
      id,
      `Created homepage section "${newSection.name}" (${newSection.type})`
    );

    return NextResponse.json({ success: true, section: newSection });
  } catch (error: any) {
    console.error('[Admin Homepage API POST Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to create homepage section' }, { status: 500 });
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
      return NextResponse.json({ error: 'Section ID required' }, { status: 400 });
    }

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const section = await db.collection('homepage').findOne(filter);
    if (!section) {
      return NextResponse.json({ error: 'Homepage section not found' }, { status: 404 });
    }

    updates.updatedAt = new Date().toISOString();
    await db.collection('homepage').updateOne(filter, { $set: updates });

    await logAuditMongo(
      session.name,
      session.email,
      'HOMEPAGE_SECTION_UPDATED',
      'Homepage',
      section.id || id,
      `Updated homepage section "${updates.name || section.name}"`
    );

    const updated = await db.collection('homepage').findOne(filter);
    const { _id, ...clean } = updated as any;

    return NextResponse.json({ success: true, section: clean });
  } catch (error: any) {
    console.error('[Admin Homepage API PUT Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update homepage section' }, { status: 500 });
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
      return NextResponse.json({ error: 'Section ID required' }, { status: 400 });
    }

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const section = await db.collection('homepage').findOne(filter);
    if (!section) {
      return NextResponse.json({ error: 'Homepage section not found' }, { status: 404 });
    }

    await db.collection('homepage').deleteOne(filter);

    await logAuditMongo(
      session.name,
      session.email,
      'HOMEPAGE_SECTION_DELETED',
      'Homepage',
      section.id || id,
      `Deleted homepage section "${section.name}" from MongoDB`
    );

    return NextResponse.json({
      success: true,
      message: `Deleted homepage section "${section.name}" from MongoDB`,
      deletedId: id,
    });
  } catch (error: any) {
    console.error('[Admin Homepage API DELETE Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete homepage section' }, { status: 500 });
  }
}
