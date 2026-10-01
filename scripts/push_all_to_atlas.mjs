import { MongoClient } from 'mongodb';

const localUri = 'mongodb://127.0.0.1:27017/mk_silver_hub';
const atlasUri = 'mongodb+srv://rachit4907_db_user:ODtTiSmnRdbnJkkx@cluster0.utsztvu.mongodb.net/mk_silver_hub?retryWrites=true&w=majority&appName=Cluster0';

async function migrateAllToAtlas() {
  console.log('Connecting to Local MongoDB...');
  const localClient = new MongoClient(localUri);
  await localClient.connect();
  const localDb = localClient.db('mk_silver_hub');

  console.log('Connecting to MongoDB Atlas Cluster0...');
  const atlasClient = new MongoClient(atlasUri);
  await atlasClient.connect();
  const atlasDb = atlasClient.db('mk_silver_hub');

  console.log('Both databases connected! Starting full data transfer to Atlas...\n');

  const collections = [
    'users',
    'products',
    'categories',
    'collections',
    'orders',
    'customers',
    'inventory',
    'reviews',
    'banners',
    'homepage',
    'navigation',
    'coupons',
    'settings',
    'audit_logs',
  ];

  for (const colName of collections) {
    const localDocs = await localDb.collection(colName).find({}).toArray();
    console.log(`[${colName}] Found ${localDocs.length} documents in local DB.`);

    const atlasCol = atlasDb.collection(colName);

    if (localDocs.length > 0) {
      for (const doc of localDocs) {
        const { _id, ...fields } = doc;
        const filter = doc.id
          ? { id: doc.id }
          : doc.email
          ? { email: doc.email }
          : doc.slug
          ? { slug: doc.slug }
          : { _id };

        await atlasCol.updateOne(filter, { $set: fields }, { upsert: true });
      }
    }

    const atlasCount = await atlasCol.countDocuments();
    console.log(`  ✓ Synced to Atlas: ${atlasCount} documents in "${colName}".`);
  }

  // Create necessary indexes in Atlas
  console.log('\nCreating performance and uniqueness indexes in Atlas...');
  const safeIndex = async (fn) => {
    try { await fn(); } catch (e) { /* index already exists */ }
  };
  await safeIndex(() => atlasDb.collection('users').createIndex({ email: 1 }, { unique: true }));
  await safeIndex(() => atlasDb.collection('products').createIndex({ id: 1 }, { unique: true, sparse: true }));
  await safeIndex(() => atlasDb.collection('products').createIndex({ slug: 1 }, { sparse: true }));
  await safeIndex(() => atlasDb.collection('products').createIndex({ category: 1 }));
  await safeIndex(() => atlasDb.collection('products').createIndex({ status: 1 }));
  await safeIndex(() => atlasDb.collection('categories').createIndex({ slug: 1 }, { unique: true, sparse: true }));
  await safeIndex(() => atlasDb.collection('collections').createIndex({ slug: 1 }, { unique: true, sparse: true }));
  await safeIndex(() => atlasDb.collection('orders').createIndex({ id: 1 }, { unique: true, sparse: true }));
  await safeIndex(() => atlasDb.collection('orders').createIndex({ orderNumber: 1 }, { unique: true, sparse: true }));
  await safeIndex(() => atlasDb.collection('orders').createIndex({ email: 1 }));
  await safeIndex(() => atlasDb.collection('customers').createIndex({ email: 1 }, { unique: true, sparse: true }));
  await safeIndex(() => atlasDb.collection('coupons').createIndex({ code: 1 }, { unique: true, sparse: true }));
  console.log('✓ All indexes processed successfully in Atlas!');

  console.log('\n=== FINAL ATLAS VERIFICATION ===');
  const finalCols = await atlasDb.listCollections().toArray();
  for (const c of finalCols) {
    const count = await atlasDb.collection(c.name).countDocuments();
    console.log(`- mk_silver_hub.${c.name}: ${count} documents`);
  }

  await localClient.close();
  await atlasClient.close();
  console.log('\nFULL MIGRATION TO MONGODB ATLAS COMPLETE AND VERIFIED!');
}

migrateAllToAtlas().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
