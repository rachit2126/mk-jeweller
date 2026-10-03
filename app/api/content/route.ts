import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    const db = await connectDB();
    const contentCol = db.collection('content');

    // Auto-seed About page document if database content collection has no /about
    if (slug === '/about' || slug === 'about') {
      const existingAbout = await contentCol.findOne({
        $or: [{ slug: '/about' }, { slug: 'about' }, { id: 'cnt-about' }],
      });

      if (!existingAbout) {
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

        await contentCol.insertOne(initialAboutDoc as any);
      }
    }

    if (id) {
      const doc = await contentCol.findOne({ id, status: 'published' });
      if (!doc) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      const { _id, ...clean } = doc;
      return NextResponse.json(
        { success: true, item: clean },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    if (slug) {
      const normalizedSlug = slug.startsWith('/') ? slug : `/${slug}`;
      const doc = await contentCol.findOne({
        $or: [{ slug: normalizedSlug }, { slug: slug }],
        status: 'published',
      });

      if (!doc) {
        return NextResponse.json({ error: 'Content not found' }, { status: 404 });
      }
      const { _id, ...clean } = doc;
      return NextResponse.json(
        { success: true, item: clean },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      );
    }

    const query: any = { status: 'published' };
    if (type) query.type = type;

    const docs = await contentCol.find(query).sort({ updatedAt: -1 }).toArray();
    const items = docs.map((d: any) => {
      const { _id, ...rest } = d;
      return { ...rest, id: rest.id || _id?.toString() };
    });

    return NextResponse.json(
      { success: true, items },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  } catch (error: any) {
    console.error('[Public Content API Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch content' }, { status: 500 });
  }
}
