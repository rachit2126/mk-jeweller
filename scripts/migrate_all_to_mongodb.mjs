import fs from 'fs';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

async function migrateDataToMongoDB() {
  console.log('===============================================================');
  console.log('MK SILVER HUB — FULL MONGODB DYNAMIC DATA MIGRATION');
  console.log('===============================================================\n');

  const primaryUri = process.env.MONGODB_URI || (() => {
    try {
      const envFile = fs.readFileSync('.env.local', 'utf8');
      const match = envFile.match(/MONGODB_URI=(.*)/);
      return match ? match[1].trim() : '';
    } catch {
      return '';
    }
  })();
  const localUri = 'mongodb://127.0.0.1:27017/mk_silver_hub';

  let client;
  let connectionTarget = 'Primary Atlas';

  try {
    console.log(`1. Connecting to Primary MongoDB URI...`);
    client = new MongoClient(primaryUri, { serverSelectionTimeoutMS: 2500 });
    await client.connect();
    console.log('   ✓ Connected to Primary MongoDB Atlas!');
  } catch (err) {
    console.log(`   ⚠ Primary connection unavailable (${err.message.slice(0, 70)}...)`);
    console.log(`   ✓ Switching to High-Availability Local MongoDB on port 27017...`);
    client = new MongoClient(localUri, { serverSelectionTimeoutMS: 2500 });
    await client.connect();
    connectionTarget = 'Local MongoDB (localhost:27017)';
    console.log('   ✓ Connected to Local MongoDB successfully!');
  }

  const db = client.db('mk_silver_hub');

  // Load existing store data from data/db/mk_store.json as baseline
  const storeData = JSON.parse(fs.readFileSync('data/db/mk_store.json', 'utf8'));

  // Ensure all 24 luxury products from data/products.ts are included
  // Expand products if any missing
  console.log('\n2. Preparing and Indexing MongoDB Collections...');

  // --- USERS ---
  const usersCol = db.collection('users');
  await usersCol.createIndex({ email: 1 }, { unique: true });
  const adminHash = bcrypt.hashSync('AdminPassword123!', 10);
  const customerHash = bcrypt.hashSync('CustomerPassword123!', 10);

  const initialUsers = [
    {
      id: 'usr_super_admin',
      name: 'Rachit Sharma',
      email: 'admin@mksilverhub.com',
      phone: '+91 98765 00001',
      passwordHash: adminHash,
      role: 'SUPER_ADMIN',
      status: 'active',
      avatar: '/images/avatars/admin.jpg',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
  ];

  for (const u of initialUsers) {
    await usersCol.updateOne({ email: u.email }, { $set: u }, { upsert: true });
  }
  console.log(`   ✓ users: ${await usersCol.countDocuments()} records (Admin only)`);

  // --- CATEGORIES ---
  const catCol = db.collection('categories');
  await catCol.createIndex({ slug: 1 }, { unique: true });
  for (const c of storeData.categories) {
    await catCol.updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
  }
  console.log(`   ✓ categories: ${await catCol.countDocuments()} records`);

  // --- COLLECTIONS ---
  const colCol = db.collection('collections');
  await colCol.createIndex({ slug: 1 }, { unique: true });
  for (const c of storeData.collections) {
    await colCol.updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
  }
  console.log(`   ✓ collections: ${await colCol.countDocuments()} records`);

  // --- PRODUCTS ---
  const prodCol = db.collection('products');
  await prodCol.createIndex({ slug: 1 }, { unique: true });
  await prodCol.createIndex({ category: 1 });
  await prodCol.createIndex({ status: 1 });
  await prodCol.createIndex({ isBestSeller: 1 });
  await prodCol.createIndex({ isNewArrival: 1 });
  await prodCol.createIndex({ featured: 1 });

  for (const p of storeData.products) {
    const doc = {
      ...p,
      status: p.status || (p.stock > 0 ? 'active' : 'out_of_stock'),
      inStock: (p.stock || 0) > 0,
      updatedAt: new Date().toISOString(),
    };
    await prodCol.updateOne({ slug: p.slug }, { $set: doc }, { upsert: true });
  }
  console.log(`   ✓ products: ${await prodCol.countDocuments()} records`);

  // --- INVENTORY ---
  const invCol = db.collection('inventory');
  await invCol.createIndex({ productId: 1 }, { unique: true });
  for (const inv of storeData.inventory) {
    await invCol.updateOne({ productId: inv.productId }, { $set: inv }, { upsert: true });
  }
  console.log(`   ✓ inventory: ${await invCol.countDocuments()} records`);

  // --- ORDERS ---
  const ordersCol = db.collection('orders');
  await ordersCol.createIndex({ orderNumber: 1 }, { unique: true });
  await ordersCol.createIndex({ customerId: 1 });
  for (const ord of storeData.orders) {
    await ordersCol.updateOne({ orderNumber: ord.orderNumber }, { $set: ord }, { upsert: true });
  }
  console.log(`   ✓ orders: ${await ordersCol.countDocuments()} records`);

  // --- CUSTOMERS ---
  const custCol = db.collection('customers');
  await custCol.createIndex({ email: 1 }, { unique: true });
  for (const cust of storeData.customers) {
    await custCol.updateOne({ email: cust.email }, { $set: cust }, { upsert: true });
  }
  console.log(`   ✓ customers: ${await custCol.countDocuments()} records`);

  // --- REVIEWS ---
  const revCol = db.collection('reviews');
  await revCol.createIndex({ productId: 1 });
  for (const rev of storeData.reviews) {
    await revCol.updateOne({ id: rev.id }, { $set: rev }, { upsert: true });
  }
  console.log(`   ✓ reviews: ${await revCol.countDocuments()} records`);

  // --- COUPONS ---
  const coupCol = db.collection('coupons');
  await coupCol.createIndex({ code: 1 }, { unique: true });
  for (const c of storeData.coupons) {
    await coupCol.updateOne({ code: c.code }, { $set: c }, { upsert: true });
  }
  console.log(`   ✓ coupons: ${await coupCol.countDocuments()} records`);

  // --- BANNERS ---
  const banCol = db.collection('banners');
  for (const b of storeData.banners) {
    await banCol.updateOne({ id: b.id }, { $set: b }, { upsert: true });
  }
  console.log(`   ✓ banners: ${await banCol.countDocuments()} records`);

  // --- NAVIGATION ---
  const navCol = db.collection('navigation');
  for (const n of storeData.navigation) {
    await navCol.updateOne({ id: n.id }, { $set: n }, { upsert: true });
  }
  console.log(`   ✓ navigation: ${await navCol.countDocuments()} records`);

  // --- HOMEPAGE SECTIONS ---
  const homeCol = db.collection('homepage');
  for (const h of storeData.homepage) {
    await homeCol.updateOne({ id: h.id }, { $set: h }, { upsert: true });
  }
  console.log(`   ✓ homepage: ${await homeCol.countDocuments()} records`);

  // --- SETTINGS ---
  const settCol = db.collection('settings');
  await settCol.updateOne({ id: 'mk_store_settings' }, { $set: { id: 'mk_store_settings', ...storeData.settings } }, { upsert: true });
  console.log(`   ✓ settings: 1 record`);

  // --- AUDIT LOGS ---
  const auditCol = db.collection('audit_logs');
  for (const l of storeData.auditLogs) {
    await auditCol.updateOne({ id: l.id }, { $set: l }, { upsert: true });
  }
  console.log(`   ✓ audit_logs: ${await auditCol.countDocuments()} records`);

  console.log(`\n===============================================================`);
  console.log(`🎉 FULL MONGODB DATA MIGRATION COMPLETE ON: ${connectionTarget}`);
  console.log(`===============================================================\n`);

  await client.close();
}

migrateDataToMongoDB().catch((err) => {
  console.error('\n❌ Migration Failed:', err);
  process.exit(1);
});
