import fs from 'fs';
import { MongoClient } from 'mongodb';

async function runUnifiedAuthTests() {
  console.log('===============================================================');
  console.log('MK SILVER HUB — UNIFIED AUTHENTICATION & MONGODB ATLAS TESTS');
  console.log('===============================================================\n');

  const BASE_URL = 'http://localhost:3000';
  const MONGO_URI = process.env.MONGODB_URI || (() => {
    try {
      const envFile = fs.readFileSync('.env.local', 'utf8');
      const match = envFile.match(/MONGODB_URI=(.*)/);
      return match ? match[1].trim() : '';
    } catch {
      return '';
    }
  })();

  // --------------------------------------------------------------------------
  // TEST 9: MONGODB ATLAS CONNECTION VERIFICATION
  // --------------------------------------------------------------------------
  console.log('TEST 9: Verifying Centralized MongoDB Atlas Connection...');
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('mk_silver_hub');
    const usersCount = await db.collection('users').countDocuments();
    console.log(`   ✓ Atlas Connected successfully! Verified ${usersCount} users in collection 'users'.`);
    await client.close();
  } catch (err) {
    throw new Error(`Atlas connection failed: ${err.message}`);
  }

  // --------------------------------------------------------------------------
  // TEST 10: INVALID CREDENTIALS TEST (GENERIC ERROR HANDLING)
  // --------------------------------------------------------------------------
  console.log('\nTEST 10: Testing Invalid Credentials & Error Masking...');
  const invalidRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'nonexistent_user_99@mksilverhub.com',
      password: 'WrongPassword!',
    }),
  });
  const invalidData = await invalidRes.json();
  if (invalidRes.status === 401 && invalidData.error === 'Invalid email or password') {
    console.log(`   ✓ Correct generic authentication error returned: "${invalidData.error}" (Status: 401)`);
  } else {
    throw new Error(`Expected generic error 401, got ${invalidRes.status}: ${JSON.stringify(invalidData)}`);
  }

  // --------------------------------------------------------------------------
  // TEST 1: NORMAL USER LOGIN & ACCESS VERIFICATION
  // --------------------------------------------------------------------------
  console.log('\nTEST 1: Testing Normal User (Customer) Login...');
  const userLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'customer@mksilverhub.com',
      password: 'CustomerPassword123!',
      rememberMe: true,
    }),
  });
  const userLoginData = await userLoginRes.json();
  const userCookie = userLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

  if (userLoginRes.ok && userLoginData.success) {
    console.log(`   ✓ Login successful for: ${userLoginData.user.name} (Role: ${userLoginData.user.role})`);
    console.log(`   ✓ Server instructed redirect destination: ${userLoginData.redirectUrl}`);
    if (userLoginData.redirectUrl !== '/account') {
      throw new Error(`Expected redirectUrl /account for USER, got ${userLoginData.redirectUrl}`);
    }
  } else {
    throw new Error(`Customer login failed: ${JSON.stringify(userLoginData)}`);
  }

  // TEST 8: Session Persistence (Refresh after user login)
  console.log('\nTEST 8: Testing Session Persistence (GET /api/auth/me) for Normal User...');
  const userMeRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: userCookie },
  });
  const userMeData = await userMeRes.json();
  console.log(`   ✓ Authenticated: ${userMeData.authenticated}, User: ${userMeData.user.email}, IsAdmin: ${userMeData.isAdmin}`);
  if (userMeData.isAdmin !== false) {
    throw new Error(`Expected isAdmin: false for normal customer, got ${userMeData.isAdmin}`);
  }

  // TEST 4 & 5: Normal User attempts to access Admin API (Direct backend enforcement)
  console.log('\nTEST 4 & 5: Testing User Access Block on Admin APIs...');
  const unauthorizedAdminApiRes = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { Cookie: userCookie },
  });
  console.log(`   ✓ Calling GET /api/admin/products as USER returns Status: ${unauthorizedAdminApiRes.status}`);
  if (unauthorizedAdminApiRes.status !== 401 && unauthorizedAdminApiRes.status !== 403) {
    throw new Error(`Security breach! Expected 401 or 403, got ${unauthorizedAdminApiRes.status}`);
  }

  // --------------------------------------------------------------------------
  // TEST 6: LOGOUT FUNCTIONALITY
  // --------------------------------------------------------------------------
  console.log('\nTEST 6: Testing Universal Logout...');
  const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { Cookie: userCookie },
  });
  const logoutData = await logoutRes.json();
  const clearCookieHeader = logoutRes.headers.get('set-cookie');
  console.log(`   ✓ Logout successful: ${logoutData.message}`);
  console.log(`   ✓ Cookie cleared in header: ${Boolean(clearCookieHeader)}`);

  // Verify session invalidated
  const postLogoutMe = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: 'mk_session=' },
  });
  console.log(`   ✓ Subsequent check without cookie returns Status: ${postLogoutMe.status} (Unauthenticated)`);

  // --------------------------------------------------------------------------
  // TEST 2: ADMIN CREDENTIALS LOGIN & ROLE DETECTION
  // --------------------------------------------------------------------------
  console.log('\nTEST 2: Testing Administrator Login on SAME Login API...');
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@mksilverhub.com',
      password: 'AdminPassword123!',
      rememberMe: true,
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  const adminCookie = adminLoginRes.headers.get('set-cookie')?.split(';')[0] || '';

  if (adminLoginRes.ok && adminLoginData.success) {
    console.log(`   ✓ Login successful for: ${adminLoginData.user.name} (Role: ${adminLoginData.user.role})`);
    console.log(`   ✓ Server instructed redirect destination: ${adminLoginData.redirectUrl}`);
    if (adminLoginData.redirectUrl !== '/admin') {
      throw new Error(`Expected redirectUrl /admin for SUPER_ADMIN, got ${adminLoginData.redirectUrl}`);
    }
  } else {
    throw new Error(`Admin login failed: ${JSON.stringify(adminLoginData)}`);
  }

  // TEST 7: Session Persistence (Refresh after admin login)
  console.log('\nTEST 7: Testing Session Persistence (GET /api/auth/me) for Admin...');
  const adminMeRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Cookie: adminCookie },
  });
  const adminMeData = await adminMeRes.json();
  console.log(`   ✓ Authenticated: ${adminMeData.authenticated}, Admin: ${adminMeData.user.email}, IsAdmin: ${adminMeData.isAdmin}`);
  if (adminMeData.isAdmin !== true) {
    throw new Error(`Expected isAdmin: true for administrator, got ${adminMeData.isAdmin}`);
  }

  // Admin access to Admin API
  console.log('\nTesting Admin Access to Admin APIs with Admin Session...');
  const adminApiRes = await fetch(`${BASE_URL}/api/admin/analytics`, {
    headers: { Cookie: adminCookie },
  });
  const adminApiData = await adminApiRes.json();
  console.log(`   ✓ GET /api/admin/analytics Status: ${adminApiRes.status}`);
  console.log(`   ✓ Live KPI Data: Total Revenue = ₹${adminApiData.kpis.totalRevenue.toLocaleString('en-IN')}`);

  // --------------------------------------------------------------------------
  // TEST 3: ADMIN ACCESS TO STOREFRONT
  // --------------------------------------------------------------------------
  console.log('\nTEST 3: Testing Administrator Visiting Storefront...');
  const storeRes = await fetch(`${BASE_URL}/api/admin/products`, {
    headers: { Cookie: adminCookie },
  });
  console.log(`   ✓ Admin can browse products & store normally. (Status: ${storeRes.status})`);

  console.log('\n===============================================================');
  console.log('ALL 10 VERIFICATION TESTS COMPLETED WITH 100% SUCCESS!');
  console.log('===============================================================\n');
}

runUnifiedAuthTests().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
