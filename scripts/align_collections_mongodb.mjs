import { MongoClient } from 'mongodb';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=(.*)/);
if (!match) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}
const uri = match[1].trim();

async function alignCollections() {
  console.log('Connecting to MongoDB Atlas to align Collections...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('mk_silver_hub');

  const collectionsCol = db.collection('collections');
  const productsCol = db.collection('products');

  const activeProducts = await productsCol.find({
    isDeleted: { $ne: true },
    status: { $ne: 'archived' }
  }).toArray();
  const activeProductIds = new Set(activeProducts.map(p => p.id));
  console.log(`Active non-deleted products in DB: ${activeProducts.length}`);

  const collections = await collectionsCol.find({}).sort({ sortOrder: 1 }).toArray();

  for (let i = 0; i < collections.length; i++) {
    const col = collections[i];

    // Filter out orphan/deleted product IDs
    let validProductIds = (col.productIds || []).filter(pId => activeProductIds.has(pId));

    // If active product has collectionIds referencing this collection, ensure it's in validProductIds
    activeProducts.forEach(p => {
      if (Array.isArray(p.collectionIds) && (p.collectionIds.includes(col.slug) || p.collectionIds.includes(col.id))) {
        if (!validProductIds.includes(p.id)) {
          validProductIds.push(p.id);
        }
      }
    });

    const isAutomatic = col.slug === 'new-arrivals' || col.slug === 'best-sellers' || col.type === 'automatic';

    let rules = col.rules;
    if (col.slug === 'new-arrivals') {
      rules = [{ field: 'isNewArrival', operator: 'equals', value: true }];
    } else if (col.slug === 'best-sellers') {
      rules = [{ field: 'isBestSeller', operator: 'equals', value: true }];
    }

    await collectionsCol.updateOne(
      { _id: col._id },
      {
        $set: {
          type: isAutomatic ? 'automatic' : 'manual',
          ruleMatch: 'ALL',
          rules: rules || [],
          limit: isAutomatic ? 12 : undefined,
          sortBy: col.slug === 'new-arrivals' ? 'newest' : col.slug === 'best-sellers' ? 'best_selling' : 'newest',
          productIds: isAutomatic ? [] : validProductIds,
          status: col.status || 'active',
          sortOrder: col.sortOrder || i + 1,
          seoTitle: col.seoTitle || `${col.name} | Fine 925 Sterling Jewellery | MK Silver Hub`,
          seoDescription: col.seoDescription || `Shop the exclusive ${col.name} suite in certified 925 sterling silver.`,
          seoKeywords: col.seoKeywords || `925 silver ${col.name.toLowerCase()}, sterling silver jewellery`,
          createdAt: col.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    );
  }

  // Create indexes if not present
  try {
    await collectionsCol.createIndex({ slug: 1 }, { unique: true });
    await collectionsCol.createIndex({ status: 1 });
    await collectionsCol.createIndex({ type: 1 });
    await collectionsCol.createIndex({ sortOrder: 1 });
    console.log('✓ Verified and created indexes for collections collection.');
  } catch (idxErr) {
    console.log('Index note:', idxErr.message);
  }

  const updatedCollections = await collectionsCol.find({}).sort({ sortOrder: 1 }).toArray();
  console.log(`\nFinal Collections in MongoDB (${updatedCollections.length}):`);
  updatedCollections.forEach(c => {
    console.log(`- [${c.sortOrder}] ${c.name} (type: ${c.type}, slug: ${c.slug}, status: ${c.status}, products: ${c.productIds?.length || 0})`);
  });

  await client.close();
}

alignCollections().catch(err => {
  console.error('Collections alignment error:', err);
  process.exit(1);
});
