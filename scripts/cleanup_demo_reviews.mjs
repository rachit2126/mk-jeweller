import { MongoClient } from 'mongodb';
import fs from 'fs';

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=(.*)/);
if (!match) {
  console.error('MONGODB_URI not found in .env.local');
  process.exit(1);
}
const uri = match[1].trim();

async function cleanup() {
  console.log('Connecting to MongoDB Atlas to audit & cleanup demo reviews...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('mk_silver_hub');
  const revCol = db.collection('reviews');

  const allReviews = await revCol.find({}).toArray();
  console.log(`Found ${allReviews.length} total reviews in MongoDB.`);

  // Targeted filter: match only known demo review IDs and demo titles
  const demoFilter = {
    $or: [
      { id: { $in: ['rev-01', 'rev-02', 'rev-03'] } },
      { title: { $in: ['Exquisite Craftsmanship', 'Perfect Anniversary Gift', 'Authentic 925 Silver', 'Exquisite Everyday Silver'] } },
      { customerName: { $in: ['Priya S.', 'Ananya Sharma', 'Meera Rajput', 'Priya Sharma'] } },
    ],
  };

  const demoRecords = await revCol.find(demoFilter).toArray();
  console.log(`Identified ${demoRecords.length} demo review records to remove:`);
  demoRecords.forEach(r => {
    console.log(`  - [${r.id || r._id}] "${r.title}" by ${r.customerName}`);
  });

  if (demoRecords.length > 0) {
    const deleteResult = await revCol.deleteMany(demoFilter);
    console.log(`\n✓ Safely deleted ${deleteResult.deletedCount} demo reviews.`);
  } else {
    console.log('\nNo demo reviews found.');
  }

  const remaining = await revCol.countDocuments({});
  console.log(`Remaining legitimate reviews in MongoDB Atlas: ${remaining}`);

  await client.close();
}

cleanup().catch(err => {
  console.error('Error during demo reviews cleanup:', err);
  process.exit(1);
});
