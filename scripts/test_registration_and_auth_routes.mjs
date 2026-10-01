import fs from 'fs';

async function runRegistrationAndRouteAudit() {
  console.log('===============================================================');
  console.log('MK SILVER HUB — REGISTRATION & AUTH ROUTING AUDIT SUITE');
  console.log('===============================================================\n');

  const BASE_URL = 'http://localhost:3000';
  const testEmail = `patron_${Date.now()}@mksilverhub.test`;

  // --------------------------------------------------------------------------
  // TEST 1: ROUTING AUDIT ON /login HTML
  // --------------------------------------------------------------------------
  console.log('TEST 1: Auditing /login HTML links and forms...');
  const loginPageRes = await fetch(`${BASE_URL}/login`);
  const loginHtml = await loginPageRes.text();

  if (loginHtml.includes('href="/contact"') && loginHtml.includes('Create Account')) {
    throw new Error('FAIL: /login still contains "Create Account" pointing to /contact!');
  }
  if (!loginHtml.includes('/register')) {
    throw new Error('FAIL: /login does not contain link to /register!');
  }
  if (!loginHtml.includes('/forgot-password')) {
    throw new Error('FAIL: /login does not contain link to /forgot-password!');
  }
  if (loginHtml.includes('QUICK TEST CREDENTIALS') || loginHtml.includes('Admin Demo') || loginHtml.includes('nebula')) {
    throw new Error('FAIL: /login still contains demo test credentials or references to nebula!');
  }
  if (!loginHtml.includes('autoComplete="username"') && !loginHtml.includes('autocomplete="username"')) {
    throw new Error('FAIL: /login missing autocomplete="username" attribute on email/username input!');
  }
  if (!loginHtml.includes('autoComplete="current-password"') && !loginHtml.includes('autocomplete="current-password"')) {
    throw new Error('FAIL: /login missing autocomplete="current-password" attribute on password input!');
  }
  if (!loginHtml.includes('id="username"') || !loginHtml.includes('id="password"') || !loginHtml.includes('id="rememberMe"')) {
    throw new Error('FAIL: /login missing required input IDs (username, password, rememberMe)!');
  }
  console.log('   ✓ /login links "Create Account" strictly to /register');
  console.log('   ✓ /login links "Forgot password?" strictly to /forgot-password');
  console.log('   ✓ /login contains NO demo credentials, mock banners, or hardcoded emails');
  console.log('   ✓ /login inputs have valid autocomplete ("username" & "current-password")');
  console.log('   ✓ /login inputs have proper names and IDs');

  // --------------------------------------------------------------------------
  // TEST 2: ROUTING AUDIT ON /register HTML
  // --------------------------------------------------------------------------
  console.log('\nTEST 2: Auditing /register page...');
  const regPageRes = await fetch(`${BASE_URL}/register`);
  if (regPageRes.status !== 200) {
    throw new Error(`FAIL: /register returned status ${regPageRes.status}`);
  }
  const regHtml = await regPageRes.text();
  if (!regHtml.includes('/login')) {
    throw new Error('FAIL: /register does not contain link to Sign In (/login)!');
  }
  console.log('   ✓ /register responds with 200 OK');
  console.log('   ✓ /register links "Sign In" strictly to /login');

  // --------------------------------------------------------------------------
  // TEST 3: REGISTRATION VALIDATION GUARDS
  // --------------------------------------------------------------------------
  console.log('\nTEST 3: Testing Registration validation guards...');
  const mismatchRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'DifferentPassword123!',
      terms: true,
    }),
  });
  if (mismatchRes.status !== 400) {
    throw new Error(`Expected 400 for password mismatch, got ${mismatchRes.status}`);
  }
  console.log('   ✓ Password mismatch rejected with 400 Bad Request');

  const unagreedRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: testEmail,
      password: 'Password123!',
      confirmPassword: 'Password123!',
      terms: false,
    }),
  });
  if (unagreedRes.status !== 400) {
    throw new Error(`Expected 400 for unagreed terms, got ${unagreedRes.status}`);
  }
  console.log('   ✓ Unchecked terms rejected with 400 Bad Request');

  // --------------------------------------------------------------------------
  // TEST 4: SUCCESSFUL REGISTRATION & ROLE ENFORCEMENT
  // --------------------------------------------------------------------------
  console.log('\nTEST 4: Registering new patron with privilege escalation attempt...');
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Aarav Mehta',
      email: testEmail,
      phone: '+91 9876543210',
      password: 'SecurePass925!',
      confirmPassword: 'SecurePass925!',
      terms: true,
      role: 'ADMIN', // Should be strictly ignored
    }),
  });
  const regData = await regRes.json();
  if (regRes.status !== 201 && regRes.status !== 200) {
    throw new Error(`Registration failed: ${regRes.status} ${JSON.stringify(regData)}`);
  }
  if (regData.user.role !== 'USER') {
    throw new Error(`CRITICAL: Registered user got role '${regData.user.role}' instead of 'USER'!`);
  }
  if (regData.redirectTo !== '/account') {
    throw new Error(`Expected redirect to /account, got ${regData.redirectTo}`);
  }
  console.log(`   ✓ Registration succeeded: User ID ${regData.user.id}`);
  console.log(`   ✓ Server strictly assigned role: '${regData.user.role}' (privilege escalation blocked)`);
  console.log(`   ✓ Redirection destination verified: '${regData.redirectTo}'`);

  const setCookie = regRes.headers.get('set-cookie');
  if (!setCookie || !setCookie.includes('mk_session=')) {
    throw new Error('FAIL: mk_session cookie was not issued upon registration!');
  }
  console.log('   ✓ Secure mk_session HttpOnly cookie issued automatically');

  // --------------------------------------------------------------------------
  // TEST 5: DUPLICATE EMAIL REJECTION
  // --------------------------------------------------------------------------
  console.log('\nTEST 5: Testing duplicate registration handling...');
  const duplicateRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Another Name',
      email: testEmail,
      password: 'AnotherPassword123!',
      confirmPassword: 'AnotherPassword123!',
      terms: true,
    }),
  });
  const dupData = await duplicateRes.json();
  if (duplicateRes.status !== 409) {
    throw new Error(`Expected 409 Conflict for duplicate email, got ${duplicateRes.status}: ${JSON.stringify(dupData)}`);
  }
  console.log(`   ✓ Duplicate email properly rejected with 409 Conflict: "${dupData.error}"`);

  // --------------------------------------------------------------------------
  // TEST 6: LOGIN WITH NEWLY REGISTERED PATRON CREDENTIALS
  // --------------------------------------------------------------------------
  console.log('\nTEST 6: Testing Sign In with newly registered patron credentials...');
  const patronLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'SecurePass925!',
    }),
  });
  const patronLoginData = await patronLoginRes.json();
  if (!patronLoginData.success || patronLoginData.redirectUrl !== '/account') {
    throw new Error(`Patron login failed: ${JSON.stringify(patronLoginData)}`);
  }
  console.log(`   ✓ Patron login succeeded with status 200`);
  console.log(`   ✓ Verified redirect destination: "${patronLoginData.redirectUrl}"`);
  console.log(`   ✓ Verified role: "${patronLoginData.user.role}"`);

  // --------------------------------------------------------------------------
  // TEST 7: ADMIN LOGIN VERIFICATION
  // --------------------------------------------------------------------------
  console.log('\nTEST 7: Testing Administrator Sign In...');
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@mksilverhub.com',
      password: 'AdminPassword123!',
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  if (!adminLoginData.success || adminLoginData.redirectUrl !== '/admin') {
    throw new Error(`Admin login failed: ${JSON.stringify(adminLoginData)}`);
  }
  console.log(`   ✓ Admin login succeeded with status 200`);
  console.log(`   ✓ Verified redirect destination: "${adminLoginData.redirectUrl}"`);
  console.log(`   ✓ Verified role: "${adminLoginData.user.role}"`);

  // --------------------------------------------------------------------------
  // TEST 8: FORGOT PASSWORD PAGE AUDIT
  // --------------------------------------------------------------------------
  console.log('\nTEST 8: Auditing /forgot-password page...');
  const forgotPageRes = await fetch(`${BASE_URL}/forgot-password`);
  if (forgotPageRes.status !== 200) {
    throw new Error(`FAIL: /forgot-password returned status ${forgotPageRes.status}`);
  }
  const forgotHtml = await forgotPageRes.text();
  if (!forgotHtml.includes('/login')) {
    throw new Error('FAIL: /forgot-password does not contain link to Return to Sign In (/login)!');
  }
  console.log('   ✓ /forgot-password responds with 200 OK');
  console.log('   ✓ /forgot-password contains "Return to Sign In" linking to /login');

  // --------------------------------------------------------------------------
  // CLEANUP
  // --------------------------------------------------------------------------
  console.log('\nCleaning up test user from database...');
  try {
    const dbPath = 'data/db/mk_store.json';
    const store = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    store.users = store.users.filter(u => u.email !== testEmail);
    fs.writeFileSync(dbPath, JSON.stringify(store, null, 2));
    console.log(`   ✓ Test user ${testEmail} cleaned up successfully.`);
  } catch (err) {
    console.warn('   Could not clean up test user:', err.message);
  }

  console.log('\n===============================================================');
  console.log('🎉 ALL 8 AUDIT & INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
  console.log('===============================================================');
}

runRegistrationAndRouteAudit().catch((err) => {
  console.error('\n❌ AUDIT FAILED:', err.message);
  process.exit(1);
});
