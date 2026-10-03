import { MongoClient } from 'mongodb';

/**
 * Safe targeted cleanup script for removing explicitly identified mock/demo customers
 * from MongoDB while preserving real customer and admin accounts.
 *
 * Targets:
 * - Seed demo customers: cust-01, cust-02, cust-03, cust-04, usr_normal_customer
 * - Test accounts with @example.com or @mksilverhub.test
 *
 * Preserves:
 * - Super Admin (admin@mksilverhub.com)
 * - Real customers (rachit4907@gmail.com, rachit4r907@gmail.com, etc.)
 */
async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is required');
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || 'mk_silver_hub');

  console.log('Connected to MongoDB Atlas...');

  const filter = {
    $or: [
      { id: { $in: ['cust-01', 'cust-02', 'cust-03', 'cust-04', 'usr_normal_customer'] } },
      { email: { $regex: '@example\\.com$', $options: 'i' } },
      { email: { $regex: '@mksilverhub\\.test$', $options: 'i' } },
      { email: 'customer@mksilverhub.com' },
    ],
  };

  const custBefore = await db.collection('customers').countDocuments({});
  const usersBefore = await db.collection('users').countDocuments({});

  const custDel = await db.collection('customers').deleteMany(filter);
  const usersDel = await db.collection('users').deleteMany({
    ...filter,
    role: { $ne: 'SUPER_ADMIN' }, // Extra safeguard
  });

  const custAfter = await db.collection('customers').countDocuments({});
  const usersAfter = await db.collection('users').countDocuments({});

  console.log(`Customers collection: removed ${custDel.deletedCount} demo records. Remaining: ${custAfter} real customers (was ${custBefore}).`);
  console.log(`Users collection: removed ${usersDel.deletedCount} demo users. Remaining: ${usersAfter} real accounts (was ${usersBefore}).`);

  await client.close();
}

main().catch((err) => {
  console.error('Cleanup error:', err);
  process.exit(1);
});
