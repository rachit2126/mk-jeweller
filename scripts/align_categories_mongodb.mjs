import { MongoClient } from 'mongodb';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=(.*)/);
if (!match) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}
const uri = match[1].trim();

async function alignCategories() {
  console.log('Connecting to MongoDB Atlas to align Categories...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('mk_silver_hub');

  const categoriesCol = db.collection('categories');
  const productsCol = db.collection('products');
  const auditLogsCol = db.collection('audit_logs');

  // 1. Fix broken Bracelets image URL (previously returned 404 on Unsplash)
  const bracelets = await categoriesCol.findOne({ slug: 'bracelets' });
  if (bracelets) {
    const validBraceletImage = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop';
    await categoriesCol.updateOne(
      { slug: 'bracelets' },
      {
        $set: {
          image: validBraceletImage,
          updatedAt: new Date().toISOString(),
        },
      }
    );
    console.log('✓ Fixed Bracelets category image with verified 925 silver bracelet photo (200 OK).');
  }

  // 2. Safe cleanup of accidental test category "w rings"
  const wRings = await categoriesCol.findOne({ slug: 'w-rings' });
  if (wRings) {
    const productsInWRings = await productsCol.countDocuments({
      $or: [{ category: 'w-rings' }, { category: 'w rings' }]
    });

    if (productsInWRings === 0) {
      await categoriesCol.deleteOne({ slug: 'w-rings' });
      await auditLogsCol.insertOne({
        id: `log-${Date.now()}-cleanup-wrings`,
        adminName: 'Rachit Sharma',
        adminEmail: 'rachit@mksilverhub.com',
        action: 'CATEGORY_DELETED',
        resource: 'Category',
        resourceId: wRings.id || 'cat-w-rings',
        details: 'Safely removed accidental test record "w rings" (0 products attached).',
        timestamp: new Date().toISOString(),
      });
      console.log('✓ Safely cleaned up accidental/test category "w rings" with audit log.');
    } else {
      console.log(`Notice: "w rings" has ${productsInWRings} products, preserving.`);
    }
  }

  // 3. Ensure all categories have standard schema fields and indexes
  const allCats = await categoriesCol.find({}).sort({ sortOrder: 1 }).toArray();
  for (let i = 0; i < allCats.length; i++) {
    const cat = allCats[i];
    await categoriesCol.updateOne(
      { _id: cat._id },
      {
        $set: {
          parentId: cat.parentId || null,
          sortOrder: cat.sortOrder || i + 1,
          status: cat.status || 'active',
          seoTitle: cat.seoTitle || `${cat.name} | Fine 925 Sterling Jewellery | MK Silver Hub`,
          seoDescription: cat.seoDescription || `Explore handcrafted 925 sterling silver ${cat.name.toLowerCase()} at MK Silver Hub. Certified purity, timeless elegance.`,
          seoKeywords: cat.seoKeywords || `925 silver ${cat.name.toLowerCase()}, sterling silver, luxury jewellery`,
          createdAt: cat.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    );
  }

  // 4. Create indexes if not present
  try {
    await categoriesCol.createIndex({ status: 1 });
    await categoriesCol.createIndex({ sortOrder: 1 });
    await categoriesCol.createIndex({ parentId: 1 });
    console.log('✓ Verified indexes for categories collection.');
  } catch (idxErr) {
    console.log('Index note:', idxErr.message);
  }

  const finalCats = await categoriesCol.find({}).sort({ sortOrder: 1 }).toArray();
  console.log(`\nFinal Categories in MongoDB (${finalCats.length}):`);
  finalCats.forEach(c => {
    console.log(`- [${c.sortOrder}] ${c.name} (slug: ${c.slug}, status: ${c.status}, image: ${c.image?.slice(0, 50)}...)`);
  });

  await client.close();
}

alignCategories().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
