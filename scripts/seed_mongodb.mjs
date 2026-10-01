import fs from 'fs';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI || (() => {
  try {
    const envFile = fs.readFileSync('.env.local', 'utf8');
    const match = envFile.match(/MONGODB_URI=(.*)/);
    return match ? match[1].trim() : '';
  } catch {
    return '';
  }
})();

async function seedMongo() {
  console.log('Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('mk_silver_hub');

  console.log('Connected to Atlas! Preparing collections...');

  const usersCollection = db.collection('users');

  // Create unique index on email
  await usersCollection.createIndex({ email: 1 }, { unique: true });

  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const customerPasswordHash = await bcrypt.hash('CustomerPassword123!', 10);

  const initialUsers = [
    {
      id: 'usr_super_admin',
      name: 'Rachit Sharma',
      email: 'admin@mksilverhub.com',
      phone: '+91 98765 00001',
      passwordHash: adminPasswordHash,
      role: 'SUPER_ADMIN',
      status: 'active',
      avatar: '/images/avatars/admin.jpg',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
    {
      id: 'usr_normal_customer',
      name: 'Priya Sharma',
      email: 'customer@mksilverhub.com',
      phone: '+91 98765 43210',
      passwordHash: customerPasswordHash,
      role: 'USER',
      status: 'active',
      avatar: '/images/avatars/customer.jpg',
      addresses: [
        {
          id: 'addr_1',
          name: 'Priya Sharma',
          street: '14/B, Lotus Boulevard, Civil Lines',
          city: 'Jaipur',
          state: 'Rajasthan',
          pincode: '302006',
          phone: '+91 98765 43210',
          isDefault: true,
        },
      ],
      wishlist: ['prod-01', 'prod-03'],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    },
  ];

  for (const u of initialUsers) {
    await usersCollection.updateOne(
      { email: u.email },
      { $set: u },
      { upsert: true }
    );
    console.log(`✓ Seeded user in Atlas: ${u.email} [ROLE: ${u.role}]`);
  }

  // Also verify count
  const count = await usersCollection.countDocuments();
  console.log(`Total users in Atlas: ${count}`);

  await client.close();
  console.log('MongoDB Atlas seeding complete!');
}

seedMongo().catch(err => {
  console.error('Atlas seed error:', err);
  process.exit(1);
});
