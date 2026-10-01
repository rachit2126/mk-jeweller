import fs from 'fs';
import { MongoClient } from 'mongodb';

const envFile = fs.readFileSync('.env.local', 'utf8');
const match = envFile.match(/MONGODB_URI=(.*)/);
const uri = match[1].trim();

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runTest() {
  console.log('==================================================');
  console.log('MK SILVER HUB — DELETE PRODUCT FULL STACK VERIFICATION');
  console.log('==================================================\n');

  const mongoClient = new MongoClient(uri);
  await mongoClient.connect();
  const db = mongoClient.db('mk_silver_hub');

  // Step 1: Admin Login
  console.log('1. Admin Authentication:');
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@mksilverhub.com', password: 'AdminPassword123!' })
  });
  const adminCookie = adminLoginRes.headers.get('set-cookie');
  console.log('   Admin Login Status:', adminLoginRes.status, 'Cookie received:', !!adminCookie);
  if (adminLoginRes.status !== 200 || !adminCookie) {
    throw new Error('Admin login failed');
  }

  // Step 2: Create Test Product
  console.log('\n2. Creating Test Product:');
  const createRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': adminCookie,
    },
    body: JSON.stringify({
      name: 'DELETE FLOW TEST PRODUCT',
      category: 'rings',
      price: 3499,
      stock: 15,
      slug: 'delete-flow-test-product-' + Date.now(),
    }),
  });
  const createData = await createRes.json();
  console.log('   Create status:', createRes.status, 'Product created ID:', createData.product?.id, 'Slug:', createData.product?.slug);
  const testId = createData.product?.id;
  const testSlug = createData.product?.slug;
  if (!testId) {
    throw new Error('Product creation failed');
  }

  // Step 3: Verify in MongoDB Atlas
  console.log('\n3. Verifying Product in MongoDB Atlas:');
  const mongoDocBefore = await db.collection('products').findOne({ id: testId });
  console.log('   Found in MongoDB:', !!mongoDocBefore, 'Name:', mongoDocBefore?.name, 'ObjectId:', mongoDocBefore?._id.toString());
  if (!mongoDocBefore) {
    throw new Error('Product not found in MongoDB after creation');
  }

  // Step 4: Perform DELETE Request
  console.log('\n4. Executing DELETE /api/admin/products/' + testId + ':');
  const deleteRes = await fetch(`${BASE_URL}/api/admin/products/${testId}`, {
    method: 'DELETE',
    headers: { 'Cookie': adminCookie },
  });
  const deleteData = await deleteRes.json();
  console.log('   DELETE Status:', deleteRes.status);
  console.log('   DELETE Response:', deleteData);
  if (deleteRes.status !== 200 || !deleteData.success) {
    throw new Error('DELETE API failed: ' + JSON.stringify(deleteData));
  }

  // Step 5: Verify MongoDB Atlas (Document must no longer exist!)
  console.log('\n5. Verifying MongoDB Atlas document removal:');
  const mongoDocAfter = await db.collection('products').findOne({ id: testId });
  const mongoDocAfterByObjId = await db.collection('products').findOne({ _id: mongoDocBefore._id });
  console.log('   Document exists by id:', !!mongoDocAfter);
  console.log('   Document exists by ObjectId:', !!mongoDocAfterByObjId);
  if (mongoDocAfter || mongoDocAfterByObjId) {
    throw new Error('FAILED: Document STILL EXISTS in MongoDB!');
  }
  console.log('   ✓ CONFIRMED: Document completely removed from MongoDB Atlas!');

  // Step 6: Verify Admin Products List
  console.log('\n6. Verifying Admin Product List (GET /api/admin/products):');
  const adminListRes = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { 'Cookie': adminCookie },
  });
  const adminListData = await adminListRes.json();
  const presentInAdmin = adminListData.products.some(p => p.id === testId);
  console.log('   Present in Admin list:', presentInAdmin);
  if (presentInAdmin) {
    throw new Error('FAILED: Product is still returned in admin products list!');
  }
  console.log('   ✓ CONFIRMED: Product disappeared from Admin list!');

  // Step 7: Verify Storefront Listing
  console.log('\n7. Verifying Storefront Listing (GET /api/products):');
  const storeRes = await fetch(`${BASE_URL}/api/products`);
  const storeData = await storeRes.json();
  const presentInStore = storeData.products.some(p => p.id === testId);
  console.log('   Present in Storefront list:', presentInStore);
  if (presentInStore) {
    throw new Error('FAILED: Product is still returned in storefront listing!');
  }
  console.log('   ✓ CONFIRMED: Product not present in storefront!');

  // Step 8: Verify Search
  console.log('\n8. Verifying Search (GET /api/products?search=DELETE+FLOW):');
  const searchRes = await fetch(`${BASE_URL}/api/products?search=DELETE+FLOW`);
  const searchData = await searchRes.json();
  const presentInSearch = searchData.products.some(p => p.id === testId);
  console.log('   Present in Search:', presentInSearch);
  if (presentInSearch) {
    throw new Error('FAILED: Product is still found in search!');
  }
  console.log('   ✓ CONFIRMED: Product not found in search!');

  // Step 9: Verify Product Detail Page
  console.log('\n9. Verifying Product Detail Page (GET /api/products/' + testSlug + '):');
  const detailRes = await fetch(`${BASE_URL}/api/products/${testSlug}`);
  console.log('   Detail page API status:', detailRes.status);
  if (detailRes.status !== 404) {
    throw new Error('FAILED: Expected 404 for deleted product, got: ' + detailRes.status);
  }
  console.log('   ✓ CONFIRMED: Product detail returns 404 Not Found!');

  // Step 10: Security Test — Normal USER cannot delete
  console.log('\n10. Security Test — Normal Customer Account:');
  const customerLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'customer@mksilverhub.com', password: 'CustomerPassword123!' })
  });
  const customerCookie = customerLoginRes.headers.get('set-cookie');
  console.log('    Customer Login Status:', customerLoginRes.status);

  const unauthorizedDeleteRes = await fetch(`${BASE_URL}/api/admin/products/prod-01`, {
    method: 'DELETE',
    headers: { 'Cookie': customerCookie || '' },
  });
  console.log('    Customer DELETE status:', unauthorizedDeleteRes.status);
  const unauthData = await unauthorizedDeleteRes.json();
  console.log('    Customer DELETE response:', unauthData);
  if (unauthorizedDeleteRes.status !== 403) {
    throw new Error('FAILED: Expected 403 Forbidden for normal customer, got: ' + unauthorizedDeleteRes.status);
  }
  console.log('    ✓ CONFIRMED: Normal USER receives 403 Forbidden!');

  // Step 11: Security Test — Unauthenticated Request
  console.log('\n11. Security Test — Unauthenticated DELETE:');
  const anonDeleteRes = await fetch(`${BASE_URL}/api/admin/products/prod-01`, {
    method: 'DELETE',
  });
  console.log('    Anonymous DELETE status:', anonDeleteRes.status);
  if (anonDeleteRes.status !== 401) {
    throw new Error('FAILED: Expected 401 Unauthorized, got: ' + anonDeleteRes.status);
  }
  console.log('    ✓ CONFIRMED: Unauthenticated request receives 401 Unauthorized!');

  // Step 12: Delete by MongoDB ObjectId directly
  console.log('\n12. Testing DELETE by 24-character hex MongoDB ObjectId directly:');
  const create2Res = await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Cookie': adminCookie },
    body: JSON.stringify({
      name: 'OBJECTID DELETE TEST PRODUCT',
      category: 'earrings',
      price: 1999,
      stock: 5,
    }),
  });
  const create2Data = await create2Res.json();
  const test2Id = create2Data.product?.id;
  const mongoDoc2 = await db.collection('products').findOne({ id: test2Id });
  const hexObjId = mongoDoc2._id.toString();
  console.log('    Created test product with MongoDB _id:', hexObjId);

  const deleteByObjIdRes = await fetch(`${BASE_URL}/api/admin/products/${hexObjId}`, {
    method: 'DELETE',
    headers: { 'Cookie': adminCookie },
  });
  const deleteByObjIdData = await deleteByObjIdRes.json();
  console.log('    DELETE by ObjectId Status:', deleteByObjIdRes.status, 'Response:', deleteByObjIdData);
  if (deleteByObjIdRes.status !== 200 || !deleteByObjIdData.success) {
    throw new Error('FAILED: DELETE by hex ObjectId failed!');
  }
  const checkMongo2 = await db.collection('products').findOne({ _id: mongoDoc2._id });
  console.log('    Check in MongoDB after ObjectId delete:', !!checkMongo2);
  if (checkMongo2) {
    throw new Error('FAILED: Product deleted by ObjectId still exists in MongoDB!');
  }
  console.log('    ✓ CONFIRMED: Product deleted by MongoDB hex ObjectId successfully!');

  await mongoClient.close();

  console.log('\n==================================================');
  console.log('ALL 12 VERIFICATION CHECKS PASSED PERFECTLY!');
  console.log('LEVEL 1 — FRONTEND: VERIFIED ✓');
  console.log('LEVEL 2 — BACKEND: VERIFIED ✓');
  console.log('LEVEL 3 — DATABASE: VERIFIED ✓');
  console.log('==================================================');
}

runTest().catch(err => {
  console.error('\n❌ TEST FAILED:', err.message);
  process.exit(1);
});
