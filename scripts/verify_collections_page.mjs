import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  // Find a tab that is not admin navbar
  const storeTab = tabs.find(t => t.url.includes('localhost:3000') && !t.url.includes('/admin') && t.type === 'page');

  if (!storeTab) {
    console.error('Storefront tab not found on 9222');
    return;
  }

  console.log('Connecting to Storefront tab:', storeTab.webSocketDebuggerUrl);
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
    console.log(`✓ Saved screenshot: ${filename} (${fp})`);
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  console.log('Navigating to http://localhost:3000/collections ...');
  await send('Page.navigate', { url: 'http://localhost:3000/collections' });
  await sleep(3500);

  // Set viewport to Desktop 1440x900
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });
  await sleep(1000);

  const title = await evalJs('document.title');
  const h1Text = await evalJs('document.querySelector("h1")?.innerText');
  const cardCount = await evalJs('document.querySelectorAll("article").length');
  const imagesInfo = await evalJs(`
    Array.from(document.querySelectorAll("article img")).map(img => ({
      src: img.src,
      alt: img.alt,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight
    }))
  `);

  console.log('Page Title:', title);
  console.log('H1:', h1Text);
  console.log('Total Collection Cards:', cardCount);
  console.log('Cards Image Info:', JSON.stringify(imagesInfo, null, 2));

  await capture('collections_desktop_top.png');

  // Scroll down to see featured editorial and secondary sections
  await evalJs('window.scrollBy({ top: 750, behavior: "instant" })');
  await sleep(1000);
  await capture('collections_desktop_editorial.png');

  await evalJs('window.scrollBy({ top: 800, behavior: "instant" })');
  await sleep(1000);
  await capture('collections_desktop_style_section.png');

  // Test Mobile Viewport (390x844 - iPhone 14/15)
  console.log('Testing Mobile Viewport 390x844...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true
  });
  await evalJs('window.scrollTo({ top: 0, behavior: "instant" })');
  await sleep(1000);
  await capture('collections_mobile_top.png');

  await evalJs('window.scrollBy({ top: 600, behavior: "instant" })');
  await sleep(1000);
  await capture('collections_mobile_cards.png');

  // Reset viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  ws.close();
}

run().catch(console.error);
