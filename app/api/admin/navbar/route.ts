import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { DbNavigationItem } from '@/lib/db/types';
import { getCurrentAdmin, logAuditMongo } from '@/lib/services/auth';

export const dynamic = 'force-dynamic';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Default production navigation seed matching the exact MK Silver Hub catalogue structure
 */
function getInitialNavigationSeed(): DbNavigationItem[] {
  const now = new Date().toISOString();
  return [
    {
      id: 'nav-earrings',
      label: 'Earrings',
      slug: 'earrings',
      url: '/shop?category=earrings',
      type: 'category',
      parentId: null,
      referenceId: 'cat-earrings',
      order: 1,
      level: 1,
      isActive: true,
      megaMenuEnabled: true,
      openInNewTab: false,
      image: '/images/collection-earrings.jpg',
      featuredTitle: 'EARRINGS',
      featuredDescription: 'Elegant designs for every occasion in pure 925 silver.',
      featuredCtaText: 'Shop Earrings →',
      featuredCtaUrl: '/shop?category=earrings',
      columns: [
        {
          heading: 'STUDS',
          links: [
            { label: 'Classic Studs', url: '/shop?category=earrings&subcategory=classic-studs', count: 12 },
            { label: 'Pearl Studs', url: '/shop?category=earrings&subcategory=pearl-studs', count: 8 },
            { label: 'Stone Studs', url: '/shop?category=earrings&subcategory=stone-studs', count: 15 },
            { label: 'Everyday Studs', url: '/shop?category=earrings&subcategory=everyday-studs', count: 9 },
          ],
        },
        {
          heading: 'HOOPS',
          links: [
            { label: 'Small Hoops', url: '/shop?category=earrings&subcategory=small-hoops', count: 6 },
            { label: 'Medium Hoops', url: '/shop?category=earrings&subcategory=medium-hoops', count: 4 },
            { label: 'Large Hoops', url: '/shop?category=earrings&subcategory=large-hoops', count: 3 },
          ],
        },
        {
          heading: 'DROP EARRINGS',
          links: [
            { label: 'Stone Drops', url: '/shop?category=earrings&subcategory=stone-drops', count: 6 },
            { label: 'Pearl Drops', url: '/shop?category=earrings&subcategory=pearl-drops', count: 3 },
            { label: 'Dangle Earrings', url: '/shop?category=earrings&subcategory=dangle-earrings', count: 8 },
          ],
        },
        {
          heading: 'JHUMKI',
          links: [
            { label: 'Traditional Jhumki', url: '/shop?category=earrings&subcategory=traditional-jhumki', count: 7 },
            { label: 'Stone Jhumki', url: '/shop?category=earrings&subcategory=stone-jhumki', count: 5 },
            { label: 'Temple Jhumki', url: '/shop?category=earrings&subcategory=temple-jhumki', count: 4 },
          ],
        },
      ],
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-earrings-studs',
      label: 'Studs',
      slug: 'studs',
      url: '/shop?category=earrings&subcategory=studs',
      type: 'category',
      parentId: 'nav-earrings',
      referenceId: 'cat-earrings',
      order: 1,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-earrings-hoops',
      label: 'Hoops',
      slug: 'hoops',
      url: '/shop?category=earrings&subcategory=hoops',
      type: 'category',
      parentId: 'nav-earrings',
      referenceId: 'cat-earrings',
      order: 2,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-earrings-drops',
      label: 'Drop Earrings',
      slug: 'drop-earrings',
      url: '/shop?category=earrings&subcategory=drop-earrings',
      type: 'category',
      parentId: 'nav-earrings',
      referenceId: 'cat-earrings',
      order: 3,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-earrings-jhumki',
      label: 'Jhumki',
      slug: 'jhumki',
      url: '/shop?category=earrings&subcategory=jhumki',
      type: 'category',
      parentId: 'nav-earrings',
      referenceId: 'cat-earrings',
      order: 4,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-earrings-everyday',
      label: 'Everyday Earrings',
      slug: 'everyday-earrings',
      url: '/shop?category=earrings&subcategory=everyday-earrings',
      type: 'category',
      parentId: 'nav-earrings',
      referenceId: 'cat-earrings',
      order: 5,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-earrings-statement',
      label: 'Statement Earrings',
      slug: 'statement-earrings',
      url: '/shop?category=earrings&subcategory=statement-earrings',
      type: 'category',
      parentId: 'nav-earrings',
      referenceId: 'cat-earrings',
      order: 6,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },

    // Necklaces
    {
      id: 'nav-necklaces',
      label: 'Necklaces',
      slug: 'necklaces',
      url: '/shop?category=necklaces',
      type: 'category',
      parentId: null,
      referenceId: 'cat-necklaces',
      order: 2,
      level: 1,
      isActive: true,
      megaMenuEnabled: true,
      openInNewTab: false,
      image: '/images/collection-necklaces.jpg',
      featuredTitle: 'NECKLACES',
      featuredDescription: 'Timeless sterling chains, pendants and chokers.',
      featuredCtaText: 'Shop Necklaces →',
      featuredCtaUrl: '/shop?category=necklaces',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-necklaces-pendant',
      label: 'Pendant Necklaces',
      slug: 'pendant-necklaces',
      url: '/shop?category=necklaces&subcategory=pendant-necklaces',
      type: 'category',
      parentId: 'nav-necklaces',
      referenceId: 'cat-necklaces',
      order: 1,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-necklaces-chains',
      label: 'Chains',
      slug: 'chains',
      url: '/shop?category=necklaces&subcategory=chains',
      type: 'category',
      parentId: 'nav-necklaces',
      referenceId: 'cat-necklaces',
      order: 2,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-necklaces-chokers',
      label: 'Chokers',
      slug: 'chokers',
      url: '/shop?category=necklaces&subcategory=chokers',
      type: 'category',
      parentId: 'nav-necklaces',
      referenceId: 'cat-necklaces',
      order: 3,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-necklaces-layered',
      label: 'Layered Necklaces',
      slug: 'layered-necklaces',
      url: '/shop?category=necklaces&subcategory=layered-necklaces',
      type: 'category',
      parentId: 'nav-necklaces',
      referenceId: 'cat-necklaces',
      order: 4,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-necklaces-bridal',
      label: 'Bridal Necklaces',
      slug: 'bridal-necklaces',
      url: '/shop?category=necklaces&subcategory=bridal-necklaces',
      type: 'category',
      parentId: 'nav-necklaces',
      referenceId: 'cat-necklaces',
      order: 5,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },

    // Rings
    {
      id: 'nav-rings',
      label: 'Rings',
      slug: 'rings',
      url: '/shop?category=rings',
      type: 'category',
      parentId: null,
      referenceId: 'cat-rings',
      order: 3,
      level: 1,
      isActive: true,
      megaMenuEnabled: true,
      openInNewTab: false,
      image: '/images/collection-rings.jpg',
      featuredTitle: 'RINGS',
      featuredDescription: 'Solitaire, statement and daily 925 sterling rings.',
      featuredCtaText: 'Shop Rings →',
      featuredCtaUrl: '/shop?category=rings',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-rings-silver',
      label: 'Silver Rings',
      slug: 'silver-rings',
      url: '/shop?category=rings&subcategory=silver-rings',
      type: 'category',
      parentId: 'nav-rings',
      referenceId: 'cat-rings',
      order: 1,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-rings-solitaire',
      label: 'Solitaire Rings',
      slug: 'solitaire-rings',
      url: '/shop?category=rings&subcategory=solitaire-rings',
      type: 'category',
      parentId: 'nav-rings',
      referenceId: 'cat-rings',
      order: 2,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-rings-statement',
      label: 'Statement Rings',
      slug: 'statement-rings',
      url: '/shop?category=rings&subcategory=statement-rings',
      type: 'category',
      parentId: 'nav-rings',
      referenceId: 'cat-rings',
      order: 3,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-rings-couple',
      label: 'Couple Rings',
      slug: 'couple-rings',
      url: '/shop?category=rings&subcategory=couple-rings',
      type: 'category',
      parentId: 'nav-rings',
      referenceId: 'cat-rings',
      order: 4,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },

    // Bracelets
    {
      id: 'nav-bracelets',
      label: 'Bracelets',
      slug: 'bracelets',
      url: '/shop?category=bracelets',
      type: 'category',
      parentId: null,
      referenceId: 'cat-bracelets',
      order: 4,
      level: 1,
      isActive: true,
      megaMenuEnabled: true,
      openInNewTab: false,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
      featuredTitle: 'BRACELETS',
      featuredDescription: 'Elegant wristwear designed with pure 925 silver finesse.',
      featuredCtaText: 'Shop Bracelets →',
      featuredCtaUrl: '/shop?category=bracelets',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-bracelets-chain',
      label: 'Chain Bracelets',
      slug: 'chain-bracelets',
      url: '/shop?category=bracelets&subcategory=chain-bracelets',
      type: 'category',
      parentId: 'nav-bracelets',
      referenceId: 'cat-bracelets',
      order: 1,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-bracelets-cuff',
      label: 'Cuff Bracelets',
      slug: 'cuff-bracelets',
      url: '/shop?category=bracelets&subcategory=cuff-bracelets',
      type: 'category',
      parentId: 'nav-bracelets',
      referenceId: 'cat-bracelets',
      order: 2,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-bracelets-charm',
      label: 'Charm Bracelets',
      slug: 'charm-bracelets',
      url: '/shop?category=bracelets&subcategory=charm-bracelets',
      type: 'category',
      parentId: 'nav-bracelets',
      referenceId: 'cat-bracelets',
      order: 3,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },

    // Bangles
    {
      id: 'nav-bangles',
      label: 'Bangles',
      slug: 'bangles',
      url: '/shop?category=bangles',
      type: 'category',
      parentId: null,
      referenceId: 'cat-bangles',
      order: 5,
      level: 1,
      isActive: true,
      megaMenuEnabled: true,
      openInNewTab: false,
      image: '/images/occasions/festive-specials.jpg',
      featuredTitle: 'BANGLES',
      featuredDescription: 'Traditional and contemporary sterling kada and bangles.',
      featuredCtaText: 'Shop Bangles →',
      featuredCtaUrl: '/shop?category=bangles',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-bangles-silver',
      label: 'Silver Bangles',
      slug: 'silver-bangles',
      url: '/shop?category=bangles&subcategory=silver-bangles',
      type: 'category',
      parentId: 'nav-bangles',
      referenceId: 'cat-bangles',
      order: 1,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-bangles-kada',
      label: 'Kada',
      slug: 'kada',
      url: '/shop?category=bangles&subcategory=kada',
      type: 'category',
      parentId: 'nav-bangles',
      referenceId: 'cat-bangles',
      order: 2,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-bangles-stacking',
      label: 'Stacking Bangles',
      slug: 'stacking-bangles',
      url: '/shop?category=bangles&subcategory=stacking-bangles',
      type: 'category',
      parentId: 'nav-bangles',
      referenceId: 'cat-bangles',
      order: 3,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-bangles-traditional',
      label: 'Traditional Bangles',
      slug: 'traditional-bangles',
      url: '/shop?category=bangles&subcategory=traditional-bangles',
      type: 'category',
      parentId: 'nav-bangles',
      referenceId: 'cat-bangles',
      order: 4,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },

    // Anklets
    {
      id: 'nav-anklets',
      label: 'Anklets',
      slug: 'anklets',
      url: '/shop?category=anklets',
      type: 'category',
      parentId: null,
      referenceId: 'cat-anklets',
      order: 6,
      level: 1,
      isActive: true,
      megaMenuEnabled: true,
      openInNewTab: false,
      image: '/images/occasions/everyday-elegance.jpg',
      featuredTitle: 'ANKLETS',
      featuredDescription: 'Delicate charms and bridal silver payal crafted with love.',
      featuredCtaText: 'Shop Anklets →',
      featuredCtaUrl: '/shop?category=anklets',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-anklets-everyday',
      label: 'Everyday Anklets',
      slug: 'everyday-anklets',
      url: '/shop?category=anklets&subcategory=everyday-anklets',
      type: 'category',
      parentId: 'nav-anklets',
      referenceId: 'cat-anklets',
      order: 1,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-anklets-silver',
      label: 'Silver Anklets',
      slug: 'silver-anklets',
      url: '/shop?category=anklets&subcategory=silver-anklets',
      type: 'category',
      parentId: 'nav-anklets',
      referenceId: 'cat-anklets',
      order: 2,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-anklets-bridal',
      label: 'Bridal Anklets',
      slug: 'bridal-anklets',
      url: '/shop?category=anklets&subcategory=bridal-anklets',
      type: 'category',
      parentId: 'nav-anklets',
      referenceId: 'cat-anklets',
      order: 3,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },

    // Pendants
    {
      id: 'nav-pendants',
      label: 'Pendants',
      slug: 'pendants',
      url: '/shop?category=pendants',
      type: 'category',
      parentId: null,
      referenceId: 'cat-pendants',
      order: 7,
      level: 1,
      isActive: true,
      megaMenuEnabled: true,
      openInNewTab: false,
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
      featuredTitle: 'PENDANTS',
      featuredDescription: 'Sparkling solitary and motif pendants in hallmark silver.',
      featuredCtaText: 'Shop Pendants →',
      featuredCtaUrl: '/shop?category=pendants',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-pendants-solitaire',
      label: 'Solitaire Pendants',
      slug: 'solitaire-pendants',
      url: '/shop?category=pendants&subcategory=solitaire-pendants',
      type: 'category',
      parentId: 'nav-pendants',
      referenceId: 'cat-pendants',
      order: 1,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-pendants-religious',
      label: 'Religious Pendants',
      slug: 'religious-pendants',
      url: '/shop?category=pendants&subcategory=religious-pendants',
      type: 'category',
      parentId: 'nav-pendants',
      referenceId: 'cat-pendants',
      order: 2,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-pendants-floral',
      label: 'Floral Pendants',
      slug: 'floral-pendants',
      url: '/shop?category=pendants&subcategory=floral-pendants',
      type: 'category',
      parentId: 'nav-pendants',
      referenceId: 'cat-pendants',
      order: 3,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-pendants-gemstone',
      label: 'Gemstone Pendants',
      slug: 'gemstone-pendants',
      url: '/shop?category=pendants&subcategory=gemstone-pendants',
      type: 'category',
      parentId: 'nav-pendants',
      referenceId: 'cat-pendants',
      order: 4,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },

    // Mangalsutra
    {
      id: 'nav-mangalsutra',
      label: 'Mangalsutra',
      slug: 'mangalsutra',
      url: '/shop?category=mangalsutra',
      type: 'category',
      parentId: null,
      referenceId: 'cat-mangalsutra',
      order: 8,
      level: 1,
      isActive: true,
      megaMenuEnabled: true,
      openInNewTab: false,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
      featuredTitle: 'MANGALSUTRA',
      featuredDescription: 'Sacred bonds adorned with modern 925 sterling silver.',
      featuredCtaText: 'Shop Mangalsutra →',
      featuredCtaUrl: '/shop?category=mangalsutra',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-mangalsutra-modern',
      label: 'Modern Mangalsutra',
      slug: 'modern-mangalsutra',
      url: '/shop?category=mangalsutra&subcategory=modern-mangalsutra',
      type: 'category',
      parentId: 'nav-mangalsutra',
      referenceId: 'cat-mangalsutra',
      order: 1,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'nav-mangalsutra-traditional',
      label: 'Traditional Mangalsutra',
      slug: 'traditional-mangalsutra',
      url: '/shop?category=mangalsutra&subcategory=traditional-mangalsutra',
      type: 'category',
      parentId: 'nav-mangalsutra',
      referenceId: 'cat-mangalsutra',
      order: 2,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },

    // Collections
    {
      id: 'nav-collections',
      label: 'Collections',
      slug: 'collections',
      url: '/collections',
      type: 'collection',
      parentId: null,
      referenceId: null,
      order: 9,
      level: 1,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },

    // New Arrivals
    {
      id: 'nav-new-arrivals',
      label: 'New Arrivals',
      slug: 'new-arrivals',
      url: '/shop?sort=newest',
      type: 'custom',
      parentId: null,
      referenceId: null,
      order: 10,
      level: 1,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },

    // Best Sellers
    {
      id: 'nav-best-sellers',
      label: 'Best Sellers',
      slug: 'best-sellers',
      url: '/shop?isBestSeller=true',
      type: 'custom',
      parentId: null,
      referenceId: null,
      order: 11,
      level: 1,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

export async function GET(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = await connectDB();
    const navCol = db.collection('navigation');

    let items = await navCol.find({}).sort({ order: 1, sortOrder: 1 }).toArray();

    // Check if navigation collection needs initialization from the rich structure
    const needsSeed = items.length === 0 || (items.length <= 4 && !items.some((i: any) => i.parentId));
    if (needsSeed) {
      const initialSeed = getInitialNavigationSeed();
      await navCol.deleteMany({});
      await navCol.insertMany(initialSeed as any);
      items = await navCol.find({}).sort({ order: 1, sortOrder: 1 }).toArray();
    }

    // Query active non-deleted products in MongoDB to compute real counts
    const activeProducts = await db.collection('products').find(
      { isDeleted: { $ne: true }, status: { $ne: 'archived' } },
      { projection: { id: 1, name: 1, category: 1, subcategory: 1, subcategoryId: 1, tags: 1, collectionIds: 1 } }
    ).toArray();

    // Compute dynamic product counts
    const enrichedItems = items.map((item: any) => {
      const { _id, ...rest } = item;
      const slug = (rest.slug || slugify(rest.label || '')).toLowerCase();

      let count = 0;
      activeProducts.forEach((p: any) => {
        const pCat = (p.category || '').toLowerCase();
        const pSub = (p.subcategory || p.subcategoryId || '').toLowerCase();
        const pName = (p.name || '').toLowerCase();
        const pTags = Array.isArray(p.tags) ? p.tags.map((t: string) => t.toLowerCase()) : [];

        if (pCat === slug || pSub === slug || pTags.includes(slug) || pName.includes(slug)) {
          count++;
        }
      });

      return {
        ...rest,
        id: rest.id || _id?.toString(),
        slug,
        order: rest.order ?? rest.sortOrder ?? 1,
        level: rest.level ?? (rest.parentId ? 2 : 1),
        isActive: rest.isActive !== undefined ? rest.isActive : rest.status !== 'inactive',
        megaMenuEnabled: Boolean(rest.megaMenuEnabled),
        openInNewTab: Boolean(rest.openInNewTab),
        productCount: count,
      } as DbNavigationItem;
    });

    // Query available Categories, Collections, Products for linking dropdowns
    const [categories, collections, sampleProducts] = await Promise.all([
      db.collection('categories').find({ status: { $ne: 'inactive' } }, { projection: { id: 1, name: 1, slug: 1, image: 1 } }).sort({ sortOrder: 1 }).toArray(),
      db.collection('collections').find({ status: { $ne: 'inactive' } }, { projection: { id: 1, name: 1, slug: 1, image: 1 } }).sort({ sortOrder: 1 }).toArray(),
      db.collection('products').find({ isDeleted: { $ne: true }, status: 'active' }, { projection: { id: 1, name: 1, slug: 1, sku: 1, images: 1 } }).limit(50).toArray(),
    ]);

    return NextResponse.json({
      success: true,
      items: enrichedItems,
      categories: categories.map((c: any) => ({ id: c.id || c.slug, name: c.name, slug: c.slug, image: c.image })),
      collections: collections.map((c: any) => ({ id: c.id || c.slug, name: c.name, slug: c.slug, image: c.image })),
      products: sampleProducts.map((p: any) => ({ id: p.id || p.slug, name: p.name, slug: p.slug, sku: p.sku })),
    });
  } catch (error: any) {
    console.error('[Admin Navbar API GET Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to retrieve navigation items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const rawLabel = (data.label || '').trim();

    if (!rawLabel || rawLabel.length < 1) {
      return NextResponse.json({ error: 'Navigation label is required' }, { status: 400 });
    }

    const db = await connectDB();
    const slug = slugify(data.slug || rawLabel);
    const parentId = data.parentId ? String(data.parentId).trim() : null;
    const level = parentId ? 2 : 1;

    // Resolve URL from type and reference if not manually provided
    let url = (data.url || data.customUrl || '').trim();
    if (!url) {
      if (data.type === 'category') {
        url = parentId ? `/shop?category=${encodeURIComponent(parentId.replace('nav-', ''))}&subcategory=${encodeURIComponent(slug)}` : `/shop?category=${encodeURIComponent(slug)}`;
      } else if (data.type === 'collection') {
        url = `/collections/${encodeURIComponent(slug)}`;
      } else if (data.type === 'product') {
        url = `/product/${encodeURIComponent(slug)}`;
      } else {
        url = `/shop?category=${encodeURIComponent(slug)}`;
      }
    }

    const id = `nav-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();

    const currentCount = await db.collection('navigation').countDocuments({ parentId });
    const order = typeof data.order === 'number' && !isNaN(data.order) ? data.order : currentCount + 1;

    const newItem: DbNavigationItem = {
      id,
      label: rawLabel,
      slug,
      url,
      type: data.type || 'category',
      parentId,
      referenceId: data.referenceId || null,
      customUrl: data.customUrl || null,
      order,
      sortOrder: order,
      level,
      isActive: data.isActive !== false,
      status: data.isActive !== false ? 'active' : 'inactive',
      megaMenuEnabled: Boolean(data.megaMenuEnabled),
      openInNewTab: Boolean(data.openInNewTab),
      image: (data.image || '').trim() || null,
      featuredTitle: data.featuredTitle || null,
      featuredDescription: data.featuredDescription || null,
      featuredCtaText: data.featuredCtaText || null,
      featuredCtaUrl: data.featuredCtaUrl || null,
      columns: Array.isArray(data.columns) ? data.columns : undefined,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection('navigation').insertOne(newItem as any);

    await logAuditMongo(
      session.name,
      session.email,
      'NAVBAR_ITEM_CREATED',
      'Navigation',
      id,
      `Created navigation item "${rawLabel}" (Parent: ${parentId || 'Root'}, Type: ${newItem.type})`
    );

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error('[Admin Navbar API POST Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to create navigation item' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await req.json();
    const db = await connectDB();
    const navCol = db.collection('navigation');
    const now = new Date().toISOString();

    // 1. Batch Save / Full Tree Update
    if (Array.isArray(data.items)) {
      const incomingIds: string[] = [];
      for (const item of data.items) {
        if (!item.id) continue;
        incomingIds.push(item.id);
        const setDoc: any = {
          label: item.label,
          slug: item.slug || slugify(item.label),
          url: item.url,
          type: item.type || 'category',
          parentId: item.parentId || null,
          referenceId: item.referenceId || null,
          customUrl: item.customUrl || null,
          order: item.order ?? item.sortOrder ?? 1,
          sortOrder: item.order ?? item.sortOrder ?? 1,
          level: item.level ?? (item.parentId ? 2 : 1),
          isActive: item.isActive !== false,
          status: item.isActive !== false ? 'active' : 'inactive',
          megaMenuEnabled: Boolean(item.megaMenuEnabled),
          openInNewTab: Boolean(item.openInNewTab),
          image: item.image || null,
          featuredTitle: item.featuredTitle || null,
          featuredDescription: item.featuredDescription || null,
          featuredCtaText: item.featuredCtaText || null,
          featuredCtaUrl: item.featuredCtaUrl || null,
          columns: item.columns || undefined,
          updatedAt: now,
        };

        await navCol.updateOne(
          { id: item.id },
          { $set: setDoc },
          { upsert: true }
        );
      }

      // Safe clean up: remove any items from DB that were removed from the tree
      if (incomingIds.length > 0) {
        await navCol.deleteMany({ id: { $nin: incomingIds } });
      }

      await logAuditMongo(
        session.name,
        session.email,
        'NAVBAR_ITEM_UPDATED',
        'Navigation',
        'bulk',
        `Saved full navigation structure with ${data.items.length} items`
      );

      return NextResponse.json({ success: true, message: 'Navigation saved successfully' });
    }

    // 2. Drag & Drop Reorder
    if (Array.isArray(data.reorder)) {
      for (const r of data.reorder) {
        if (!r.id) continue;
        const updateDoc: any = {
          order: r.order,
          sortOrder: r.order,
          updatedAt: now,
        };
        if (r.parentId !== undefined) {
          updateDoc.parentId = r.parentId || null;
          updateDoc.level = r.parentId ? 2 : 1;
        }
        await navCol.updateOne({ id: r.id }, { $set: updateDoc });
      }

      await logAuditMongo(
        session.name,
        session.email,
        'NAVBAR_REORDERED',
        'Navigation',
        'reorder',
        `Reordered ${data.reorder.length} navigation items`
      );

      return NextResponse.json({ success: true, message: 'Navigation reordered successfully' });
    }

    // 3. Single Item Update
    const { id, ...updates } = data;
    if (!id) {
      return NextResponse.json({ error: 'Navigation item ID is required' }, { status: 400 });
    }

    const setDoc: any = { updatedAt: now };
    if (updates.label !== undefined) setDoc.label = String(updates.label).trim();
    if (updates.slug !== undefined) setDoc.slug = slugify(updates.slug);
    if (updates.url !== undefined) setDoc.url = String(updates.url).trim();
    if (updates.type !== undefined) setDoc.type = updates.type;
    if (updates.parentId !== undefined) {
      setDoc.parentId = updates.parentId || null;
      setDoc.level = updates.parentId ? 2 : 1;
    }
    if (updates.referenceId !== undefined) setDoc.referenceId = updates.referenceId || null;
    if (updates.customUrl !== undefined) setDoc.customUrl = updates.customUrl || null;
    if (updates.order !== undefined) {
      setDoc.order = Number(updates.order);
      setDoc.sortOrder = Number(updates.order);
    }
    if (updates.isActive !== undefined) {
      setDoc.isActive = Boolean(updates.isActive);
      setDoc.status = updates.isActive ? 'active' : 'inactive';
    }
    if (updates.megaMenuEnabled !== undefined) setDoc.megaMenuEnabled = Boolean(updates.megaMenuEnabled);
    if (updates.openInNewTab !== undefined) setDoc.openInNewTab = Boolean(updates.openInNewTab);
    if (updates.image !== undefined) setDoc.image = updates.image;
    if (updates.featuredTitle !== undefined) setDoc.featuredTitle = updates.featuredTitle;
    if (updates.featuredDescription !== undefined) setDoc.featuredDescription = updates.featuredDescription;
    if (updates.featuredCtaText !== undefined) setDoc.featuredCtaText = updates.featuredCtaText;
    if (updates.featuredCtaUrl !== undefined) setDoc.featuredCtaUrl = updates.featuredCtaUrl;
    if (updates.columns !== undefined) setDoc.columns = updates.columns;

    await navCol.updateOne({ id }, { $set: setDoc });

    const auditAction = updates.columns || updates.featuredTitle ? 'MEGA_MENU_UPDATED' : 'NAVBAR_ITEM_UPDATED';
    await logAuditMongo(
      session.name,
      session.email,
      auditAction,
      'Navigation',
      id,
      `Updated navigation item "${updates.label || id}"`
    );

    const updated = await navCol.findOne({ id });
    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    console.error('[Admin Navbar API PATCH Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to update navigation item' }, { status: 500 });
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
      return NextResponse.json({ error: 'Navigation item ID is required' }, { status: 400 });
    }

    const db = await connectDB();
    const navCol = db.collection('navigation');

    const item = await navCol.findOne({ id });
    if (!item) {
      return NextResponse.json({ error: 'Navigation item not found' }, { status: 404 });
    }

    // Count any direct child items before deletion
    const childCount = await navCol.countDocuments({ parentId: id });

    // Delete item and cascade to all direct child items
    await navCol.deleteMany({
      $or: [{ id }, { parentId: id }],
    });

    await logAuditMongo(
      session.name,
      session.email,
      'NAVBAR_ITEM_DELETED',
      'Navigation',
      id,
      `Deleted navigation item "${item.label}" (ID: ${id}) and ${childCount} child navigation item(s)`
    );

    return NextResponse.json({
      success: true,
      message: childCount > 0
        ? `Deleted "${item.label}" and its ${childCount} child item(s) from navigation`
        : `Deleted "${item.label}" from navigation`,
      deletedId: id,
      deletedChildrenCount: childCount,
    });
  } catch (error: any) {
    console.error('[Admin Navbar API DELETE Error]:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete navigation item' }, { status: 500 });
  }
}
