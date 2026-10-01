import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const BASE_URL = 'http://localhost:3000';
const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

const uri = process.env.MONGODB_URI || (() => {
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    const m = env.match(/MONGODB_URI=(.*)/);
    return m ? m[1].trim() : '';
  } catch {
    return '';
  }
})();

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('====================================================');
  console.log('TESTING MULTI-IMAGE PRODUCT UPLOAD & PERSISTENCE');
  console.log('====================================================\n');

  // 1. Authenticate Admin
  console.log('1. Authenticating Admin Session...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@mksilverhub.com',
      password: 'AdminPassword123!',
      portal: 'admin',
    }),
  });
  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie') || '';
  if (!loginRes.ok || !loginData.success) {
    throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
  }

  const adminMatch = setCookie.match(/mk_admin_session=([^;,\s]+)/);
  const userMatch = setCookie.match(/mk_session=([^;,\s]+)/);
  const adminToken = adminMatch ? adminMatch[1] : '';
  const userToken = userMatch ? userMatch[1] : '';

  const authHeaders = {
    Cookie: `mk_admin_session=${adminToken}; mk_session=${userToken}`,
  };
  console.log(`   ✓ Authenticated as: ${loginData.session?.name} (${loginData.session?.role})`);

  // 2. Prepare Sample Multi-Image Upload (3 test images)
  console.log('\n2. Testing Multi-Image Batch Upload API (POST /api/admin/media/upload)...');
  const sampleImagePath = path.join(process.cwd(), 'public/images/auth-editorial-bg.jpg');
  const sampleBuffer = fs.readFileSync(sampleImagePath);

  const formData = new FormData();
  formData.append('folder', 'products');
  formData.append('preset', 'high_quality');

  // Append 3 separate files
  formData.append(
    'files',
    new Blob([sampleBuffer], { type: 'image/jpeg' }),
    'solitaire-pendant-front.jpg'
  );
  formData.append(
    'files',
    new Blob([sampleBuffer], { type: 'image/jpeg' }),
    'solitaire-pendant-side.jpg'
  );
  formData.append(
    'files',
    new Blob([sampleBuffer], { type: 'image/jpeg' }),
    'solitaire-pendant-hallmark.jpg'
  );

  const uploadRes = await fetch(`${BASE_URL}/api/admin/media/upload`, {
    method: 'POST',
    headers: authHeaders,
    body: formData,
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok || !uploadData.success) {
    throw new Error(`Upload API failed: ${JSON.stringify(uploadData)}`);
  }

  console.log(`   ✓ Multi-upload successful! Uploaded ${uploadData.items?.length} images`);
  console.log(`     Image 1: ${uploadData.items[0]?.url} (Savings: ${uploadData.items[0]?.savingsPercent}%)`);
  console.log(`     Image 2: ${uploadData.items[1]?.url} (Savings: ${uploadData.items[1]?.savingsPercent}%)`);
  console.log(`     Image 3: ${uploadData.items[2]?.url} (Savings: ${uploadData.items[2]?.savingsPercent}%)`);

  const uploadedUrls = uploadData.items.map((it) => it.url);

  // 3. Create Product with multiple uploaded images
  console.log('\n3. Creating Product in MongoDB with 3 uploaded images...');
  const newProductPayload = {
    name: `Test Multi-Image Royal Necklace ${Date.now()}`,
    slug: `test-multi-image-royal-necklace-${Date.now()}`,
    sku: `MK-TEST-MULTI-${Date.now().toString().slice(-4)}`,
    category: 'necklaces',
    price: 4999,
    compareAtPrice: 6999,
    stock: 15,
    images: uploadedUrls,
    secondaryImage: uploadedUrls[1],
    description: 'Fine handcrafted multi-image test necklace.',
    shortDescription: 'Multi-image test necklace.',
  };

  const createProdRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(newProductPayload),
  });

  const createProdData = await createProdRes.json();
  if (!createProdRes.ok || !createProdData.success) {
    throw new Error(`Product create failed: ${JSON.stringify(createProdData)}`);
  }
  const createdProductId = createProdData.product?.id;
  console.log(`   ✓ Created product ID: ${createdProductId} with ${createProdData.product.images?.length} images`);

  // 4. Verify in MongoDB Atlas directly
  console.log('\n4. Verifying persistence directly in MongoDB Atlas...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('mk_silver_hub');

  const mongoDoc = await db.collection('products').findOne({ id: createdProductId });
  if (!mongoDoc || mongoDoc.images?.length !== 3) {
    throw new Error('MongoDB document images mismatch!');
  }
  console.log(`   ✓ MongoDB contains all 3 images:`);
  mongoDoc.images.forEach((img, i) => console.log(`     [${i}]: ${img}`));

  // 5. Test Reorder and Set as Main (move image 2 to index 0)
  console.log('\n5. Testing Reorder & Set as Main via PUT /api/admin/products/[id]...');
  const reorderedUrls = [uploadedUrls[2], uploadedUrls[0], uploadedUrls[1]];
  const updateRes = await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
    method: 'PUT',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      images: reorderedUrls,
      secondaryImage: reorderedUrls[1],
    }),
  });
  const updateData = await updateRes.json();
  console.log(`   ✓ Update response: success=${updateData.success}`);

  const updatedMongoDoc = await db.collection('products').findOne({ id: createdProductId });
  if (updatedMongoDoc.images[0] !== uploadedUrls[2]) {
    throw new Error('New Main image not persisted at index 0 in MongoDB!');
  }
  console.log(`   ✓ Verified in MongoDB: Main image is now ${updatedMongoDoc.images[0]}`);

  // 6. Test Remove image (remove 1 image)
  console.log('\n6. Testing Image Removal...');
  const finalUrls = [reorderedUrls[0], reorderedUrls[1]];
  await fetch(`${BASE_URL}/api/admin/products/${createdProductId}`, {
    method: 'PUT',
    headers: { ...authHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ images: finalUrls }),
  });

  const finalMongoDoc = await db.collection('products').findOne({ id: createdProductId });
  if (finalMongoDoc.images.length !== 2) {
    throw new Error('Image removal not reflected in MongoDB!');
  }
  console.log(`   ✓ Verified in MongoDB: Image count reduced to ${finalMongoDoc.images.length}`);

  // Clean up test product
  await db.collection('products').deleteOne({ id: createdProductId });
  await db.collection('inventory').deleteOne({ productId: createdProductId });
  await client.close();

  // 7. Visual UI Test & Screenshot via CDP on Chrome port 9222
  console.log('\n7. Capturing UI Screenshots on Chrome port 9222...');
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await listRes.json();
  const adminTab = tabs.find((t) => t.url?.includes('localhost:3000')) || tabs[0];

  const ws = new WebSocket(adminTab.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const resolve = callbacks.get(data.id);
      callbacks.delete(data.id);
      resolve(data);
    }
  };

  await new Promise((resolve) => (ws.onopen = resolve));

  function send(method, params = {}) {
    return new Promise((resolve) => {
      const msgId = id++;
      const timer = setTimeout(() => {
        if (callbacks.has(msgId)) {
          callbacks.delete(msgId);
          resolve({ timedOut: true });
        }
      }, 7000);
      callbacks.set(msgId, (res) => {
        clearTimeout(timer);
        resolve(res);
      });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');

  // Desktop View (1440x900)
  console.log('   Navigating to http://localhost:3000/admin/products/new (Desktop)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  await send('Page.navigate', { url: `${BASE_URL}/admin/products/new` });
  await sleep(3500);

  const shot1 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot1.result?.data) {
    const p1 = path.join(ARTIFACT_DIR, 'admin_products_new_multi_upload.png');
    fs.writeFileSync(p1, Buffer.from(shot1.result.data, 'base64'));
    console.log(`   ✓ Saved desktop screenshot: ${p1}`);
  }

  // Mobile View (390x844)
  console.log('   Navigating to http://localhost:3000/admin/products/new (Mobile 390x844)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Page.reload');
  await sleep(3000);

  const shot2 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot2.result?.data) {
    const p2 = path.join(ARTIFACT_DIR, 'admin_products_new_multi_upload_mobile.png');
    fs.writeFileSync(p2, Buffer.from(shot2.result.data, 'base64'));
    console.log(`   ✓ Saved mobile screenshot: ${p2}`);
  }

  // Reset to desktop
  await send('Emulation.clearDeviceMetricsOverride');
  await send('Page.navigate', { url: `${BASE_URL}/admin/products/new` });

  ws.close();

  console.log('\n====================================================');
  console.log('ALL MULTI-IMAGE UPLOAD & MONGODB TESTS PASSED 100%!');
  console.log('====================================================\n');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
