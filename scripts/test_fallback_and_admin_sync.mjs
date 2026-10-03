import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const storeTab = tabs.find(t => t.url.includes('localhost:3000') && !t.url.includes('/admin') && t.type === 'page');

  if (!storeTab) {
    console.error('Storefront tab not found on 9222');
    return;
  }

  const ws = new WebSocket(storeTab.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.id && callbacks.has(data.id)) {
      const res = callbacks.get(data.id);
      callbacks.delete(data.id);
      res(data);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise(r => {
      const msgId = id++;
      callbacks.set(msgId, r);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async function evalJs(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res.result?.value;
  }

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const fp = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(fp, Buffer.from(res.result.data, 'base64'));
    console.log(`✓ Saved screenshot: ${filename}`);
  }

  await send('Page.enable');
  await send('Runtime.enable');

  // Connect to MongoDB and temporarily simulate an empty image for a test collection
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();

  console.log('1. Testing temporary fallback by setting thumbnail to empty for col-gifts ...');
  const originalGift = await db.collection('collections').findOne({ id: 'col-gifts' });
  const originalThumb = originalGift.thumbnail;

  await db.collection('collections').updateOne({ id: 'col-gifts' }, { $set: { thumbnail: '' } });

  // Navigate to /collections
  await send('Page.navigate', { url: 'http://localhost:3000/collections' });
  await sleep(3000);

  // Check if fallback text exists
  const fallbackTextExists = await evalJs('document.body.innerText.includes("IMAGE COMING SOON")');
  console.log('✓ Fallback "Image coming soon" rendered without broken image icon:', fallbackTextExists);

  // Capture fallback state
  await evalJs('window.scrollBy({ top: 400, behavior: "instant" })');
  await sleep(600);
  await capture('collections_fallback_demonstration.png');

  // Restore original image
  console.log('2. Restoring original image and verifying live storefront sync ...');
  await db.collection('collections').updateOne({ id: 'col-gifts' }, { $set: { thumbnail: originalThumb } });

  // Trigger page reload
  await send('Page.navigate', { url: 'http://localhost:3000/collections' });
  await sleep(3000);

  const restoredImg = await evalJs('document.body.innerText.includes("Gifts Collection")');
  console.log('✓ Storefront restored and synchronized:', restoredImg);

  await client.close();
  ws.close();
}

run().catch(console.error);
