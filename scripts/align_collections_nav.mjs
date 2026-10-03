import { MongoClient } from 'mongodb';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const uri = env.match(/MONGODB_URI=(.*)/)[1].trim();

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('mk_silver_hub');
  const navCol = db.collection('navigation');

  await navCol.updateOne(
    { slug: 'collections', parentId: null },
    {
      $set: {
        megaMenuEnabled: true,
        featuredTitle: 'COLLECTIONS',
        featuredDescription: 'Curated 925 sterling silver capsules for bridal, festive and everyday elegance.',
        featuredCtaText: 'Explore Collections →',
        featuredCtaUrl: '/collections',
        image: '/images/occasions/bridal-collection.jpg',
        updatedAt: new Date().toISOString(),
      },
    }
  );

  const colls = [
    { label: 'Royal Heritage', slug: 'royal-heritage', url: '/shop?collection=heritage' },
    { label: 'Bridal Curations', slug: 'bridal-curations', url: '/shop?collection=bridal' },
    { label: 'Everyday Essentials', slug: 'everyday-essentials', url: '/shop?collection=everyday' },
    { label: 'Minimal Collection', slug: 'minimal-collection', url: '/shop?collection=minimal' },
    { label: 'Festive Special', slug: 'festive-special', url: '/shop?collection=festive' },
    { label: 'Silver For Him', slug: 'silver-for-him', url: '/shop?collection=men' },
  ];

  await navCol.deleteMany({ parentId: 'nav-collections' });
  for (let i = 0; i < colls.length; i++) {
    const c = colls[i];
    await navCol.insertOne({
      id: 'nav-coll-' + c.slug,
      label: c.label,
      slug: c.slug,
      url: c.url,
      type: 'collection',
      parentId: 'nav-collections',
      referenceId: null,
      order: i + 1,
      level: 2,
      isActive: true,
      megaMenuEnabled: false,
      openInNewTab: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  console.log('✓ Collections mega menu configured with', colls.length, 'children');
  await client.close();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
