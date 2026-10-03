import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await listRes.json();
  const pageTab = tabs.find((t) => t.type === 'page') || tabs[0];

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
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
      }, 15000);
      callbacks.set(msgId, (res) => {
        clearTimeout(timer);
        resolve(res);
      });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  console.log('1. Navigating to http://localhost:3000/shop...');
  await send('Page.navigate', { url: 'http://localhost:3000/shop' });
  await sleep(3000);

  // Trigger hover on product card
  console.log('2. Simulating hover on product card to trigger Quick View button...');
  await send('Runtime.evaluate', {
    expression: `
      const card = document.querySelector('.mk-product-card');
      if (card) {
        card.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      }
    `
  });
  await sleep(600);

  console.log('3. Capturing card hover state...');
  const shotHover = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shotHover.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'product_card_hover_state.png'), Buffer.from(shotHover.result.data, 'base64'));
    console.log('   ✓ Saved product_card_hover_state.png');
  }

  // Click Quick View button
  console.log('4. Clicking Quick View button...');
  await send('Runtime.evaluate', {
    expression: `
      const qvBtn = document.querySelector('.quickview-overlay button');
      if (qvBtn) qvBtn.click();
    `
  });
  await sleep(800);

  console.log('5. Capturing Quick View modal dialog...');
  const shotModal = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shotModal.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'product_card_quickview_modal.png'), Buffer.from(shotModal.result.data, 'base64'));
    console.log('   ✓ Saved product_card_quickview_modal.png');
  }

  // Close modal
  await send('Runtime.evaluate', {
    expression: `
      const closeBtn = document.querySelector('button[aria-label="Close Quick View"]');
      if (closeBtn) closeBtn.click();
    `
  });
  await sleep(500);

  // Click Add to Cart
  console.log('6. Clicking Add to Cart button on card...');
  await send('Runtime.evaluate', {
    expression: `
      const addBtn = document.querySelector('.card-add-btn');
      if (addBtn) addBtn.click();
    `
  });
  await sleep(600);

  console.log('7. Capturing Added To Cart state on card...');
  const shotAdded = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shotAdded.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'product_card_added_state.png'), Buffer.from(shotAdded.result.data, 'base64'));
    console.log('   ✓ Saved product_card_added_state.png');
  }

  ws.close();
  console.log('QuickView and Cart tests complete!');
}

run().catch((e) => {
  console.error('Error running test:', e);
  process.exit(1);
});
