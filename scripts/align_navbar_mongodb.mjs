import { MongoClient } from 'mongodb';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const uri = env.match(/MONGODB_URI=(.*)/)[1].trim();

async function alignNavigation() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('mk_silver_hub');
  const navCol = db.collection('navigation');

  console.log('Aligning MongoDB navigation items to pure dynamic architecture...');

  // 1. Remove the legacy hardcoded fake columns from Earrings so it uses dynamic children like all others
  await navCol.updateOne(
    { slug: 'earrings', parentId: null },
    {
      $unset: { columns: '' },
      $set: {
        megaMenuEnabled: true,
        featuredTitle: 'EARRINGS',
        featuredDescription: 'Artisanal 925 sterling silver earrings designed for everyday luxury.',
        featuredCtaText: 'Shop Earrings →',
        featuredCtaUrl: '/shop?category=earrings',
        image: '/images/collection-earrings.jpg',
        updatedAt: new Date().toISOString(),
      },
    }
  );

  // 2. Ensure all other primary categories have megaMenuEnabled: true and verified images
  const categoryConfigs = [
    {
      slug: 'necklaces',
      title: 'NECKLACES',
      desc: 'Timeless sterling chains, statement chokers and delicate pendants.',
      img: '/images/collection-necklaces.jpg',
    },
    {
      slug: 'rings',
      title: 'RINGS',
      desc: 'Handcrafted 925 silver bands, solitaires and statement rings.',
      img: '/images/collection-rings.jpg',
    },
    {
      slug: 'bracelets',
      title: 'BRACELETS',
      desc: 'Fluid silver chains, cuff bangles and charm bracelets.',
      img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
    },
    {
      slug: 'bangles',
      title: 'BANGLES',
      desc: 'Classic hallmarked silver kada, sleek stacking bangles and traditional designs.',
      img: '/images/occasions/festive-specials.jpg',
    },
    {
      slug: 'anklets',
      title: 'ANKLETS',
      desc: 'Delicate everyday payal and bridal sterling silver anklets.',
      img: '/images/occasions/everyday-elegance.jpg',
    },
    {
      slug: 'pendants',
      title: 'PENDANTS',
      desc: 'Sparkling solitaires, floral motifs and spiritual silver pendants.',
      img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
    },
    {
      slug: 'mangalsutra',
      title: 'MANGALSUTRA',
      desc: 'Modern sacred black bead chains in pure 925 sterling silver.',
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
    },
  ];

  for (const cfg of categoryConfigs) {
    await navCol.updateOne(
      { slug: cfg.slug, parentId: null },
      {
        $set: {
          megaMenuEnabled: true,
          featuredTitle: cfg.title,
          featuredDescription: cfg.desc,
          featuredCtaText: `Shop ${cfg.title} →`,
          featuredCtaUrl: `/shop?category=${cfg.slug}`,
          image: cfg.img,
          updatedAt: new Date().toISOString(),
        },
        $unset: { columns: '' },
      }
    );
  }

  // 3. Ensure 'About' exists as requested in the final navbar specification
  const aboutItem = await navCol.findOne({ slug: 'about', parentId: null });
  if (!aboutItem) {
    await navCol.insertOne({
      id: 'nav-about',
      label: 'About',
      slug: 'about',
      url: '/about',
      type: 'custom',
      parentId: null,
      referenceId: null,
      order: 12,
      level: 1,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('✓ Added About navigation item');
  }

  // 4. Verify all items
  const items = await navCol.find({ parentId: null }).sort({ order: 1 }).toArray();
  console.log('Updated Root Navigation Items:');
  for (const item of items) {
    const children = await navCol.find({ parentId: item.id }).sort({ order: 1 }).toArray();
    console.log(`- ${item.label} (${item.slug}) | hasMega: ${item.megaMenuEnabled} | children: ${children.length}`);
  }

  await client.close();
  console.log('Navigation alignment complete!');
}

alignNavigation().catch((err) => {
  console.error('Error aligning navigation:', err);
  process.exit(1);
});
