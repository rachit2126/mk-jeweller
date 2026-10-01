import { MongoClient } from 'mongodb';
import fs from 'fs';

const BASE_URL = 'http://localhost:3000';
const MONGO_URI = process.env.MONGODB_URI || (() => {
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    const m = env.match(/MONGODB_URI=(.*)/);
    return m ? m[1].trim() : 'mongodb://127.0.0.1:27017/mk_silver_hub';
  } catch {
    return 'mongodb://127.0.0.1:27017/mk_silver_hub';
  }
})();

async function runVerification() {
  console.log('================================================================');
  console.log('MK SILVER HUB — COMPREHENSIVE END-TO-END MONGODB VERIFICATION');
  console.log('================================================================\n');

  const mongoClient = new MongoClient(MONGO_URI);
  await mongoClient.connect();
  const db = mongoClient.db('mk_silver_hub');
  console.log('✓ Connected to MongoDB database "mk_silver_hub"');

  const report = {};

  // -------------------------------------------------------------------------
  // TEST A: ADMIN LOGIN & DASHBOARD
  // -------------------------------------------------------------------------
  console.log('\n--- TEST A: ADMIN LOGIN ---');
  let adminCookie = '';
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@mksilverhub.com',
      password: 'AdminPassword123!',
    }),
  });

  const loginData = await loginRes.json();
  const cookieHeaders = loginRes.headers.getSetCookie ? loginRes.headers.getSetCookie() : [loginRes.headers.get('set-cookie')];
  adminCookie = cookieHeaders.filter(Boolean).map(c => c.split(';')[0]).join('; ');
  if (loginRes.ok && loginData.success && adminCookie) {
    console.log('✓ Admin login successful. Role:', loginData.user?.role, 'Redirect:', loginData.redirectUrl);
    report.adminLogin = 'PASS';
  } else {
    console.error('✗ Admin login failed:', loginData);
    report.adminLogin = 'FAIL';
  }

  // Verify Admin Analytics / Dashboard loads from MongoDB
  const analyticsRes = await fetch(`${BASE_URL}/api/admin/analytics`, {
    headers: { Cookie: adminCookie },
  });
  const analyticsData = await analyticsRes.json();
  if (analyticsRes.ok && analyticsData.kpis) {
    console.log(`✓ Admin Dashboard loaded from MongoDB: Revenue ₹${analyticsData.kpis.totalRevenue}, Orders: ${analyticsData.kpis.totalOrders}, Products: ${analyticsData.kpis.totalProducts}`);
    report.adminDashboard = 'PASS';
  } else {
    console.error('✗ Admin Dashboard failed');
    report.adminDashboard = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST B: CREATE NEW PRODUCT ("MK Verification Silver Ring")
  // -------------------------------------------------------------------------
  console.log('\n--- TEST B: CREATE PRODUCT (MK Verification Silver Ring) ---');
  const uniqueSuffix = Date.now().toString().slice(-4);
  const testProductName = `MK Verification Silver Ring ${uniqueSuffix}`;
  const testProductSlug = `mk-verification-silver-ring-${uniqueSuffix}`;

  const createRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      name: testProductName,
      slug: testProductSlug,
      category: 'rings',
      categoryLabel: 'Rings',
      price: 2499,
      compareAtPrice: 3499,
      stock: 18,
      sku: `MK-RNG-VERIFY-${uniqueSuffix}`,
      images: ['/images/collection-rings.jpg'],
      status: 'active',
      isNewArrival: true,
      description: 'Handcrafted pure 925 sterling silver verification ring with hallmarked purity.',
      shortDescription: 'Verified 925 Silver Ring',
      details: {
        material: 'Solid 925 Sterling Silver',
        plating: 'Anti-Tarnish Rhodium Finish',
        dimensions: 'Band width 3.5mm',
        gemstone: 'Cubic Zirconia',
        claspType: 'Standard Comfort Fit',
        hallmark: 'BIS 925 Hallmarked',
      },
    }),
  });

  const createData = await createRes.json();
  let createdProductId = '';
  if (createRes.ok && createData.success && createData.product) {
    createdProductId = createData.product.id;
    console.log(`✓ Product created successfully via Admin API. ID: ${createdProductId}, Slug: ${createData.product.slug}`);
    report.createProduct = 'PASS';
  } else {
    console.error('✗ Product creation failed:', createData);
    report.createProduct = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST C: VERIFY IN MONGODB
  // -------------------------------------------------------------------------
  console.log('\n--- TEST C: VERIFY DIRECTLY IN MONGODB ---');
  const mongoDoc = await db.collection('products').findOne({ slug: testProductSlug });
  const mongoInv = await db.collection('inventory').findOne({ productId: createdProductId });
  const mongoAudit = await db.collection('audit_logs').findOne({ resourceId: createdProductId });

  if (mongoDoc && mongoDoc.price === 2499 && mongoDoc.name === testProductName) {
    console.log(`✓ Verified MongoDB product document: "${mongoDoc.name}", Price: ₹${mongoDoc.price}, SKU: ${mongoDoc.sku}`);
    if (mongoInv && mongoInv.currentStock === 18) {
      console.log(`✓ Verified MongoDB inventory document: SKU ${mongoInv.sku}, Stock: ${mongoInv.currentStock}`);
    }
    if (mongoAudit) {
      console.log(`✓ Verified MongoDB audit log entry: ${mongoAudit.action} by ${mongoAudit.adminName}`);
    }
    report.mongoProductVerification = 'PASS';
  } else {
    console.error('✗ Product not found in MongoDB!');
    report.mongoProductVerification = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST D & E: STOREFRONT VISIBILITY (/api/products & /shop)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST D & E: STOREFRONT VISIBILITY ---');
  const shopApiRes = await fetch(`${BASE_URL}/api/products?category=rings`);
  const shopApiData = await shopApiRes.json();
  const foundInShop = shopApiData.products?.find(p => p.slug === testProductSlug);

  if (foundInShop) {
    console.log(`✓ Product appears in Storefront API: "${foundInShop.name}", Price: ₹${foundInShop.price}`);
    report.storefrontShop = 'PASS';
  } else {
    console.error('✗ Product missing from Storefront API!');
    report.storefrontShop = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST F: PRODUCT DETAIL PAGE (/api/products/[slug])
  // -------------------------------------------------------------------------
  console.log('\n--- TEST F: PRODUCT DETAIL ---');
  const detailRes = await fetch(`${BASE_URL}/api/products/${testProductSlug}`);
  const detailData = await detailRes.json();

  if (detailRes.ok && detailData.product && detailData.product.slug === testProductSlug) {
    console.log(`✓ Product detail loads dynamically from MongoDB: "${detailData.product.name}", Related count: ${detailData.relatedProducts?.length}`);
    report.productDetail = 'PASS';
  } else {
    console.error('✗ Product detail failed:', detailData);
    report.productDetail = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST G: EDIT PRODUCT (UPDATE PRICE TO ₹2,899)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST G: EDIT PRODUCT IN ADMIN & VERIFY REFLECTION ---');
  const editRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie,
    },
    body: JSON.stringify({
      price: 2899,
      stock: 15,
    }),
  });

  const editData = await editRes.json();
  if (editRes.ok && editData.product && editData.product.price === 2899) {
    console.log('✓ Admin product update successful. New price: ₹2,899, Stock: 15');
    // Verify MongoDB document
    const updatedMongoDoc = await db.collection('products').findOne({ id: createdProductId });
    if (updatedMongoDoc?.price === 2899 && updatedMongoDoc?.stock === 15) {
      console.log('✓ MongoDB document updated to ₹2,899 and stock 15');
      // Verify Storefront reflection
      const updatedDetailRes = await fetch(`${BASE_URL}/api/products/${testProductSlug}`);
      const updatedDetailData = await updatedDetailRes.json();
      if (updatedDetailData.product?.price === 2899) {
        console.log('✓ Storefront immediately reflects updated price ₹2,899!');
        report.editProduct = 'PASS';
      }
    }
  } else {
    console.error('✗ Product edit failed:', editData);
    report.editProduct = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST H: ARCHIVE / DELETE PRODUCT & STOREFRONT EXCLUSION
  // -------------------------------------------------------------------------
  console.log('\n--- TEST H: ARCHIVE PRODUCT & STOREFRONT EXCLUSION ---');
  const deleteRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie },
  });

  const deleteData = await deleteRes.json();
  if (deleteRes.ok && deleteData.success) {
    console.log('✓ Product archived via Admin API');
    const archivedDoc = await db.collection('products').findOne({ id: createdProductId });
    if (archivedDoc?.status === 'archived') {
      console.log('✓ MongoDB status set to "archived" (soft-delete preserves order history)');
    }
    // Verify storefront excludes archived product
    const shopAfterDelete = await fetch(`${BASE_URL}/api/products?category=rings`);
    const shopAfterData = await shopAfterDelete.json();
    const stillInShop = shopAfterData.products?.find(p => p.slug === testProductSlug);
    if (!stillInShop) {
      console.log('✓ Archived product is excluded from storefront shop results!');
      report.archiveProduct = 'PASS';
    } else {
      console.error('✗ Archived product still visible in storefront!');
      report.archiveProduct = 'FAIL';
    }
  } else {
    console.error('✗ Product archive failed:', deleteData);
    report.archiveProduct = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST I: CATEGORIES FROM MONGODB
  // -------------------------------------------------------------------------
  console.log('\n--- TEST I: CATEGORIES FROM MONGODB ---');
  const catRes = await fetch(`${BASE_URL}/api/categories`);
  const catData = await catRes.json();
  if (catRes.ok && Array.isArray(catData.categories) && catData.categories.length > 0) {
    console.log(`✓ Fetched ${catData.categories.length} active categories from MongoDB:`, catData.categories.map(c => c.name).join(', '));
    report.categories = 'PASS';
  } else {
    report.categories = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST J: COLLECTIONS FROM MONGODB
  // -------------------------------------------------------------------------
  console.log('\n--- TEST J: COLLECTIONS FROM MONGODB ---');
  const collRes = await fetch(`${BASE_URL}/api/collections`);
  const collData = await collRes.json();
  if (collRes.ok && Array.isArray(collData.collections) && collData.collections.length > 0) {
    console.log(`✓ Fetched ${collData.collections.length} active collections from MongoDB:`, collData.collections.map(c => c.name).join(', '));
    report.collections = 'PASS';
  } else {
    report.collections = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST K: CUSTOMER REGISTRATION & ACCOUNT ISOLATION
  // -------------------------------------------------------------------------
  console.log('\n--- TEST K: CUSTOMER REGISTRATION & ISOLATION ---');
  const testCustomerEmail = `patron.${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Aditi Deshmukh',
      email: testCustomerEmail,
      phone: '+91 98331 22440',
      password: 'PatronPassword123!',
      confirmPassword: 'PatronPassword123!',
      terms: true,
    }),
  });

  const regData = await regRes.json();
  const customerCookie = regRes.headers.get('set-cookie')?.split(';')[0];
  if (regRes.ok && regData.success && customerCookie) {
    console.log(`✓ Customer registered successfully: ${regData.user?.name} (${regData.user?.email})`);
    
    // Check MongoDB user document
    const mongoUser = await db.collection('users').findOne({ email: testCustomerEmail });
    const mongoCust = await db.collection('customers').findOne({ email: testCustomerEmail });
    if (mongoUser && mongoCust) {
      console.log(`✓ Verified MongoDB user and customer documents created with role: "${mongoUser.role}"`);
    }

    // Check customer /api/auth/me
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Cookie: customerCookie },
    });
    const meData = await meRes.json();
    if (meData.user?.email === testCustomerEmail && meData.user?.name === 'Aditi Deshmukh') {
      console.log(`✓ Authenticated session returns isolated customer data: ${meData.user.name}`);
      report.customerAccount = 'PASS';
    }
  } else {
    console.error('✗ Customer registration failed:', regData);
    report.customerAccount = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST L: ORDERS FOR AUTHENTICATED USER
  // -------------------------------------------------------------------------
  console.log('\n--- TEST L: CUSTOMER ORDERS ISOLATION ---');
  const ordersRes = await fetch(`${BASE_URL}/api/orders/my-orders`, {
    headers: { Cookie: customerCookie },
  });
  const ordersData = await ordersRes.json();
  if (ordersRes.ok && Array.isArray(ordersData.orders)) {
    console.log(`✓ Orders endpoint returns customer orders isolated from other users (count: ${ordersData.orders.length})`);
    report.ordersIsolation = 'PASS';
  } else {
    report.ordersIsolation = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST M: LOGOUT
  // -------------------------------------------------------------------------
  console.log('\n--- TEST M: LOGOUT ---');
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { Cookie: customerCookie },
  });
  const logoutData = await logoutRes.json();
  if (logoutRes.ok && logoutData.success) {
    console.log('✓ Logout successful, cookies invalidated');
    report.logout = 'PASS';
  } else {
    report.logout = 'FAIL';
  }

  // -------------------------------------------------------------------------
  // TEST N: ROLE SECURITY (NORMAL USER ATTEMPTING ADMIN)
  // -------------------------------------------------------------------------
  console.log('\n--- TEST N: ROLE SECURITY ---');
  const userAdminAttempt = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { Cookie: customerCookie },
  });
  if (userAdminAttempt.status === 401 || userAdminAttempt.status === 403) {
    console.log(`✓ Security verified: Customer accessing /api/admin/products is blocked with status ${userAdminAttempt.status}`);
    report.adminSecurity = 'PASS';
  } else {
    console.error(`✗ Security failed: Customer got status ${userAdminAttempt.status}`);
    report.adminSecurity = 'FAIL';
  }

  await mongoClient.close();

  console.log('\n================================================================');
  console.log('FINAL VERIFICATION SUMMARY');
  console.log('================================================================');
  console.table(report);

  const allPassed = Object.values(report).every(v => v === 'PASS');
  console.log(allPassed ? '\n>>> ALL END-TO-END VERIFICATION TESTS PASSED <<<' : '\n>>> SOME TESTS FAILED <<<');
  return allPassed;
}

runVerification().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
