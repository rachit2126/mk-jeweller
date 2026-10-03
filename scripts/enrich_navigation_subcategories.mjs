import { MongoClient } from 'mongodb';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const uri = env.match(/MONGODB_URI=(.*)/)[1].trim();

const SUBCAT_DATA = [
  // Earrings
  { parentSlug: 'earrings', slug: 'studs', desc: 'Minimal everyday studs', img: '/images/collections/earrings-editorial.jpg' },
  { parentSlug: 'earrings', slug: 'hoops', desc: 'Classic & modern hoops', img: '/images/why-choose/unique-designs-earrings.jpg' },
  { parentSlug: 'earrings', slug: 'drop-earrings', desc: 'Fluid dangling silhouettes', img: '/images/collection-earrings.jpg' },
  { parentSlug: 'earrings', slug: 'jhumki', desc: 'Heritage polki & silver', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop' },
  { parentSlug: 'earrings', slug: 'everyday-earrings', desc: 'Lightweight workwear pairs', img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=600&auto=format&fit=crop' },
  { parentSlug: 'earrings', slug: 'statement-earrings', desc: 'Bold gala & bridal designs', img: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?q=80&w=600&auto=format&fit=crop' },

  // Necklaces
  { parentSlug: 'necklaces', slug: 'pendant-necklaces', desc: 'Elegant pendants', img: '/images/products/necklaces-modern-baroque-pearl-chain-01.png' },
  { parentSlug: 'necklaces', slug: 'chains', desc: 'Everyday essentials', img: '/images/products/necklaces-festive-lotus-ruby-necklace-01.jpg' },
  { parentSlug: 'necklaces', slug: 'chokers', desc: 'Modern classics', img: '/images/products/necklaces-royal-heritage-polki-choker-01.jpg' },
  { parentSlug: 'necklaces', slug: 'layered-necklaces', desc: 'Trendy layers', img: '/images/products/necklaces-pearl-blossom-collar-01.png' },
  { parentSlug: 'necklaces', slug: 'bridal-necklaces', desc: 'For special moments', img: '/images/products/necklaces-emerald-polki-bridal-set-01.png' },

  // Rings
  { parentSlug: 'rings', slug: 'silver-rings', desc: 'Pure 925 sterling bands', img: '/images/collection-rings.jpg' },
  { parentSlug: 'rings', slug: 'solitaire-rings', desc: 'Sparkling cubic zirconia', img: '/images/why-choose/premium-quality-ring.jpg' },
  { parentSlug: 'rings', slug: 'statement-rings', desc: 'Artisanal cocktails & motifs', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop' },
  { parentSlug: 'rings', slug: 'couple-rings', desc: 'Matching eternity bands', img: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop' },

  // Bracelets
  { parentSlug: 'bracelets', slug: 'chain-bracelets', desc: 'Delicate links & chains', img: 'https://images.unsplash.com/photo-1611591475871-3312385b2447?q=80&w=600&auto=format&fit=crop' },
  { parentSlug: 'bracelets', slug: 'cuff-bracelets', desc: 'Bold open cuff silhouettes', img: '/images/occasions/everyday-elegance.jpg' },
  { parentSlug: 'bracelets', slug: 'charm-bracelets', desc: 'Meaningful silver charms', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop' },

  // Bangles
  { parentSlug: 'bangles', slug: 'silver-bangles', desc: 'Classic hallmark slip-ons', img: '/images/occasions/festive-specials.jpg' },
  { parentSlug: 'bangles', slug: 'kada', desc: 'Traditional heavy kada', img: 'https://images.unsplash.com/photo-1611591475871-3312385b2447?q=80&w=600&auto=format&fit=crop' },
  { parentSlug: 'bangles', slug: 'stacking-bangles', desc: 'Slender stackable bands', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop' },
  { parentSlug: 'bangles', slug: 'traditional-bangles', desc: 'Jaipur artisanal filigree', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop' },

  // Anklets
  { parentSlug: 'anklets', slug: 'everyday-anklets', desc: 'Subtle daily wear payal', img: '/images/occasions/everyday-elegance.jpg' },
  { parentSlug: 'anklets', slug: 'silver-anklets', desc: 'Hallmarked 925 payal bells', img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop' },
  { parentSlug: 'anklets', slug: 'bridal-anklets', desc: 'Ornate ghungroo bridal sets', img: '/images/occasions/bridal-collection.jpg' },

  // Pendants
  { parentSlug: 'pendants', slug: 'solitaire-pendants', desc: 'Minimal brilliant solitaires', img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=600&auto=format&fit=crop' },
  { parentSlug: 'pendants', slug: 'religious-pendants', desc: 'Sacred Ganesha & Om icons', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop' },
  { parentSlug: 'pendants', slug: 'floral-pendants', desc: 'Nature-inspired silver motifs', img: '/images/products/necklaces-pearl-blossom-collar-01.png' },
  { parentSlug: 'pendants', slug: 'gemstone-pendants', desc: 'Emerald & ruby silver drops', img: '/images/products/necklaces-modern-baroque-pearl-chain-01.png' },

  // Mangalsutra
  { parentSlug: 'mangalsutra', slug: 'modern-mangalsutra', desc: 'Minimal everyday beads', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop' },
  { parentSlug: 'mangalsutra', slug: 'traditional-mangalsutra', desc: 'Heritage dual-strand polki', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop' },

  // Collections
  { parentSlug: 'collections', slug: 'royal-heritage', desc: 'Imperial polki & kundan', img: '/images/products/necklaces-royal-heritage-polki-choker-01.jpg' },
  { parentSlug: 'collections', slug: 'bridal-curations', desc: 'Grand wedding statement pieces', img: '/images/occasions/bridal-collection.jpg' },
  { parentSlug: 'collections', slug: 'everyday-essentials', desc: 'Pure 925 daily wear', img: '/images/occasions/everyday-elegance.jpg' },
  { parentSlug: 'collections', slug: 'minimal-collection', desc: 'Sleek contemporary accents', img: '/images/collection-rings.jpg' },
  { parentSlug: 'collections', slug: 'festive-special', desc: 'Celebratory silver sets', img: '/images/occasions/festive-specials.jpg' },
  { parentSlug: 'collections', slug: 'silver-for-him', desc: 'Men’s chains, kadas & rings', img: '/images/editorial/silver-for-him.jpg' },
];

async function enrichNavigation() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('mk_silver_hub');
  const navCol = db.collection('navigation');

  console.log('Enriching subcategory children with descriptions and imagery...');

  for (const item of SUBCAT_DATA) {
    const parent = await navCol.findOne({ slug: item.parentSlug, parentId: null });
    if (!parent) continue;

    const res = await navCol.updateOne(
      { parentId: parent.id, slug: item.slug },
      {
        $set: {
          description: item.desc,
          image: item.img,
          updatedAt: new Date().toISOString(),
        }
      }
    );
    if (res.matchedCount > 0) {
      console.log(`✓ Updated [${item.parentSlug}] ${item.slug} -> ${item.desc}`);
    }
  }

  // Also ensure featured descriptions & images for all roots
  const roots = [
    {
      slug: 'necklaces',
      title: 'NECKLACES',
      desc: 'Timeless sterling chains, pendants and chokers for every occasion.',
      image: '/images/collection-necklaces.jpg',
      ctaText: 'EXPLORE NECKLACES →',
    },
    {
      slug: 'earrings',
      title: 'EARRINGS',
      desc: 'Artisanal 925 sterling silver earrings designed for everyday luxury.',
      image: '/images/collection-earrings.jpg',
      ctaText: 'EXPLORE EARRINGS →',
    },
    {
      slug: 'rings',
      title: 'RINGS',
      desc: 'Handcrafted 925 silver bands, solitaires and statement rings.',
      image: '/images/collection-rings.jpg',
      ctaText: 'EXPLORE RINGS →',
    },
    {
      slug: 'bracelets',
      title: 'BRACELETS',
      desc: 'Fluid silver chains, cuff bangles and charm bracelets.',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
      ctaText: 'EXPLORE BRACELETS →',
    },
    {
      slug: 'bangles',
      title: 'BANGLES',
      desc: 'Classic hallmarked silver kada, sleek stacking bangles and traditional designs.',
      image: '/images/occasions/festive-specials.jpg',
      ctaText: 'EXPLORE BANGLES →',
    },
    {
      slug: 'anklets',
      title: 'ANKLETS',
      desc: 'Delicate everyday payal and bridal sterling silver anklets.',
      image: '/images/occasions/everyday-elegance.jpg',
      ctaText: 'EXPLORE ANKLETS →',
    },
    {
      slug: 'pendants',
      title: 'PENDANTS',
      desc: 'Sparkling solitaires, floral motifs and spiritual silver pendants.',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1000&auto=format&fit=crop',
      ctaText: 'EXPLORE PENDANTS →',
    },
    {
      slug: 'mangalsutra',
      title: 'MANGALSUTRA',
      desc: 'Modern sacred black bead chains in pure 925 sterling silver.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop',
      ctaText: 'EXPLORE MANGALSUTRA →',
    },
    {
      slug: 'collections',
      title: 'COLLECTIONS',
      desc: 'Curated royal heritage, festive specials and minimal everyday capsules.',
      image: '/images/editorial/art-of-silver-banner.jpg',
      ctaText: 'EXPLORE COLLECTIONS →',
    },
  ];

  for (const r of roots) {
    await navCol.updateOne(
      { slug: r.slug, parentId: null },
      {
        $set: {
          featuredTitle: r.title,
          featuredDescription: r.desc,
          featuredCtaText: r.ctaText,
          image: r.image,
          updatedAt: new Date().toISOString(),
        }
      }
    );
  }

  await client.close();
  console.log('Enrichment finished successfully!');
}

enrichNavigation().catch(console.error);
