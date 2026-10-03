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
  console.log('Connecting to Chrome tab:', pageTab.title, pageTab.url);

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

  // 1. Desktop 1440x900 - Homepage Best Sellers
  console.log('1. Setting desktop viewport 1440x900...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  console.log('2. Navigating to http://localhost:3000/#best-sellers...');
  await send('Page.navigate', { url: 'http://localhost:3000/#best-sellers' });
  await sleep(3500);

  // Scroll to #best-sellers
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('best-sellers');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    `
  });
  await sleep(1500);

  console.log('3. Capturing Best Sellers section screenshot...');
  const shot1 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot1.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'product_card_bestsellers_desktop.png'), Buffer.from(shot1.result.data, 'base64'));
    console.log('   ✓ Saved product_card_bestsellers_desktop.png');
  }

  // 2. Shop Page PLP Grid
  console.log('4. Navigating to http://localhost:3000/shop...');
  await send('Page.navigate', { url: 'http://localhost:3000/shop' });
  await sleep(3000);

  console.log('5. Capturing Shop Page PLP Grid screenshot...');
  const shot2 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot2.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'product_card_shop_page_desktop.png'), Buffer.from(shot2.result.data, 'base64'));
    console.log('   ✓ Saved product_card_shop_page_desktop.png');
  }

  // 3. Mobile Viewport 390x844
  console.log('6. Setting mobile viewport 390x844...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  console.log('7. Navigating to http://localhost:3000/shop (Mobile)...');
  await send('Page.navigate', { url: 'http://localhost:3000/shop' });
  await sleep(3000);

  console.log('8. Capturing Shop Page Mobile screenshot...');
  const shot3 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot3.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'product_card_shop_page_mobile.png'), Buffer.from(shot3.result.data, 'base64'));
    console.log('   ✓ Saved product_card_shop_page_mobile.png');
  }

  // Restore desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  ws.close();
  console.log('All verification captures complete!');
}

run().catch((e) => {
  console.error('Error running capture:', e);
  process.exit(1);
});
