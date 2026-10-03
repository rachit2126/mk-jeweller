import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectDB } from '@/lib/db/mongodb';
import { DbContentItem } from '@/lib/db/types';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const search = searchParams.get('search')?.toLowerCase();

    const db = await connectDB();

    const query: any = {};
    if (type && type !== 'all') {
      query.type = type;
    }
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { title: regex },
        { slug: regex },
        { author: regex },
        { excerpt: regex },
      ];
    }

    let docs = await db.collection('content').find(query).sort({ updatedAt: -1 }).toArray();

    // Auto-seed initial About page document if content collection is completely empty
    if (docs.length === 0 && (!type || type === 'all') && (!status || status === 'all') && !search) {
      const now = new Date().toISOString();
      const initialAboutDoc = {
        id: 'cnt-about',
        title: 'Our Story | Origin & Ethos',
        slug: '/about',
        type: 'editorial',
        status: 'published',
        author: 'MK Silver Hub',
        excerpt: 'Made in Jaipur. Designed for Now. Handcrafted 925 sterling silver fine jewellery.',
        content: 'At MK Silver Hub, we craft contemporary 925 sterling silver jewellery inspired by the rich silversmithing traditions of Jaipur.',
        coverImage: '/images/why-choose/master-craftsmanship-detail.jpg',
        seoTitle: 'Our Story | Origin & Ethos | MK Silver Hub',
        seoDescription: 'Hand-cast pure 925 sterling silver crafted in Jaipur. BIS hallmarked and hypoallergenic.',
        sections: [
          {
            id: 'sec-about-hero',
            type: 'hero',
            title: 'MADE IN JAIPUR.\nDESIGNED FOR NOW.',
            subtitle: 'ORIGIN & ETHOS',
            content: 'At MK Silver Hub, we craft contemporary 925 sterling silver jewellery inspired by the rich silversmithing traditions of Jaipur. Our pieces blend timeless artisanal techniques with modern silhouettes, sculpted for your everyday expressions.\n\nEvery jewel is hand-cast in pure 92.5% elemental silver, stamped with certified BIS hallmarks and finished with anti-tarnish rhodium to ensure lifelong brilliance and hypoallergenic comfort.',
            image: '/images/why-choose/master-craftsmanship-detail.jpg',
            buttonText: 'EXPLORE COLLECTION',
            buttonUrl: '/shop',
          },
          {
            id: 'sec-about-values',
            type: 'values',
            title: 'Four Pillars of MK Silver Hub',
            subtitle: 'OUR PROMISE',
            items: [
              {
                title: '925 Sterling Silver',
                description: 'Every single piece is BIS hallmarked to certify 92.5% elemental bullion purity. No compromises, no synthetic shortcuts.',
                icon: 'ShieldCheck',
              },
              {
                title: 'Crafted in Jaipur',
                description: 'Sculpted by master silversmiths whose families have perfected jewelry metalwork in the Pink City for generations.',
                icon: 'Award',
              },
              {
                title: 'Skin Friendly & Hypoallergenic',
                description: '100% nickel-free and lead-free. Sealed with high-grade rhodium to ensure soothing everyday contact with even sensitive skin.',
                icon: 'Sparkles',
              },
              {
                title: 'Made to Last',
                description: 'Engineered for daily resilience, reinforced clasps, and scratch-resistant luster designed to be worn and loved for years.',
                icon: 'Heart',
              },
            ],
          },
          {
            id: 'sec-about-cta',
            type: 'cta',
            title: 'Fine 925 Sterling Silver For Your Story',
            subtitle: 'Enjoy complimentary insured shipping across India and an unconditional 7-day exchange promise on every creation.',
            buttonText: 'SHOP ALL JEWELLERY',
            buttonUrl: '/shop',
          },
        ],
        createdAt: now,
        updatedAt: now,
      };

      await db.collection('content').insertOne(initialAboutDoc as any);
      docs = await db.collection('content').find(query).sort({ updatedAt: -1 }).toArray();
    }

    const items = docs.map(doc => {
      const { _id, ...rest } = doc;
      return {
        ...rest,
        id: rest.id || _id?.toString(),
      } as DbContentItem;
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Error fetching admin content:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
    }

    const db = await connectDB();
    const now = new Date().toISOString();

    let cleanSlug = body.slug.trim();
    if (!cleanSlug.startsWith('/')) {
      cleanSlug = `/${cleanSlug}`;
    }

    const newItem: DbContentItem = {
      id: `cnt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: body.title.trim(),
      slug: cleanSlug,
      type: body.type || 'editorial',
      status: body.status || 'published',
      author: body.author || session.name || 'Admin',
      excerpt: body.excerpt || '',
      content: body.content || '',
      coverImage: body.coverImage || '',
      seoTitle: body.seoTitle || body.title.trim(),
      seoDescription: body.seoDescription || body.excerpt || '',
      publishedAt: body.status === 'published' ? now : undefined,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('content').insertOne(newItem as any);

    await logAuditMongo(
      session.name,
      session.email,
      'CONTENT_CREATED',
      'Content',
      newItem.id,
      `Created ${newItem.type} content "${newItem.title}" (${newItem.slug})`
    );

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error('Error creating content:', error);
    return NextResponse.json({ error: error.message || 'Failed to create content' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Content ID required' }, { status: 400 });
    }

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const existing = await db.collection('content').findOne(filter);
    if (!existing) {
      return NextResponse.json({ error: 'Content record not found' }, { status: 404 });
    }

    const now = new Date().toISOString();
    let auditAction = 'CONTENT_UPDATED';

    if (updates.status && updates.status !== existing.status) {
      if (updates.status === 'published') {
        auditAction = 'CONTENT_PUBLISHED';
        updates.publishedAt = now;
      } else if (updates.status === 'draft') {
        auditAction = 'CONTENT_UNPUBLISHED';
      }
    }

    updates.updatedAt = now;

    if (updates.slug && !updates.slug.startsWith('/')) {
      updates.slug = `/${updates.slug.trim()}`;
    }

    await db.collection('content').updateOne(filter, { $set: updates });

    await logAuditMongo(
      session.name,
      session.email,
      auditAction,
      'Content',
      existing.id || id,
      `Updated ${existing.type || 'content'} "${updates.title || existing.title}"`
    );

    const updatedDoc = await db.collection('content').findOne(filter);
    const { _id, ...cleanUpdated } = updatedDoc as any;

    return NextResponse.json({ success: true, item: cleanUpdated });
  } catch (error: any) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: error.message || 'Failed to update content' }, { status: 500 });
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
      return NextResponse.json({ error: 'Content ID required' }, { status: 400 });
    }

    const db = await connectDB();
    const isObjectId = ObjectId.isValid(id) && id.length === 24;
    const filter = isObjectId ? { $or: [{ _id: new ObjectId(id) }, { id }] } : { id };

    const item = await db.collection('content').findOne(filter);
    if (!item) {
      return NextResponse.json({ error: 'Content record not found' }, { status: 404 });
    }

    const sectionId = searchParams.get('sectionId');

    // Case 1: Delete specific section from block-based content (e.g. About page hero/values/cta)
    if (sectionId) {
      const existingSections = Array.isArray(item.sections) ? item.sections : [];
      const sectionToDelete = existingSections.find((s: any) => s.id === sectionId);

      if (!sectionToDelete) {
        return NextResponse.json({ error: 'Section not found in content document' }, { status: 404 });
      }

      await db.collection('content').updateOne(filter, {
        $pull: { sections: { id: sectionId } } as any,
        $set: { updatedAt: new Date().toISOString() },
      });

      await logAuditMongo(
        session.name,
        session.email,
        'CONTENT_SECTION_DELETED',
        'Content',
        item.id || id,
        `Deleted section "${sectionToDelete.title || sectionId}" from ${item.title}`
      );

      return NextResponse.json({
        success: true,
        message: `Deleted section "${sectionToDelete.title || sectionId}" from ${item.title}`,
        sectionId,
        documentId: item.id || id,
      });
    }

    // Case 2: Delete entire content document
    await db.collection('content').deleteOne(filter);

    await logAuditMongo(
      session.name,
      session.email,
      'CONTENT_DELETED',
      'Content',
      item.id || id,
      `Deleted ${item.type} content "${item.title}" from MongoDB`
    );

    return NextResponse.json({ success: true, id, message: `Deleted content "${item.title}" from MongoDB` });
  } catch (error: any) {
    console.error('Error deleting content:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete content' }, { status: 500 });
  }
}
