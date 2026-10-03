import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const storeTab = tabs.find((t) => t.url === 'http://localhost:3000/' && t.type === 'page');

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

  await new Promise((r) => (ws.onopen = r));

  function send(method, params = {}) {
    return new Promise((r) => {
      const msgId = id++;
      callbacks.set(msgId, r);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  async function evalJs(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res.result?.result?.value ?? res.result?.value;
  }

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const fp = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(fp, Buffer.from(res.result.data, 'base64'));
    console.log(`✓ Saved screenshot: ${filename}`);
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  // Set desktop viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  console.log('Navigating to http://localhost:3000/ ...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await sleep(4000);

  // Set desktop viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  // Wait for .cat-editorial-section to appear in DOM
  let sectionFound = false;
  for (let i = 0; i < 20; i++) {
    sectionFound = await evalJs(`
      (() => {
        const el = document.querySelector('.cat-editorial-section');
        if (el) {
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
          return true;
        }
        return false;
      })()
    `);
    if (sectionFound) break;
    await sleep(500);
  }

  console.log('Category section found:', sectionFound);
  await sleep(1500);

  // Capture desktop default view
  await capture('category_redesign_desktop_1440.png');

  // Click next button
  console.log('Testing Next button click...');
  await evalJs(`
    (() => {
      const nextBtn = document.querySelector('.cat-nav-next');
      if (nextBtn) nextBtn.click();
    })()
  `);
  await sleep(700);
  await capture('category_redesign_desktop_next_clicked.png');

  // Hover over the center active card
  const centerPos = await evalJs(`
    (() => {
      const activeCard = document.querySelector('.cat-editorial-card.is-active');
      if (!activeCard) return null;
      const rect = activeCard.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()
  `);
  if (centerPos) {
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: Math.round(centerPos.x),
      y: Math.round(centerPos.y),
    });
    await sleep(600);
    await capture('category_redesign_desktop_hover.png');
  }

  // Mobile Viewport test (390px)
  console.log('Setting mobile viewport (390px)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await evalJs(`
    (() => {
      const el = document.querySelector('.cat-editorial-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()
  `);
  await sleep(1000);
  await capture('category_redesign_mobile_390.png');

  // Compact Mobile (320px)
  console.log('Setting compact mobile viewport (320px)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 320,
    height: 640,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await evalJs(`
    (() => {
      const el = document.querySelector('.cat-editorial-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()
  `);
  await sleep(800);
  await capture('category_redesign_mobile_320.png');

  // Tablet Viewport test (768px)
  console.log('Setting tablet viewport (768px)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    mobile: false,
  });
  await evalJs(`
    (() => {
      const el = document.querySelector('.cat-editorial-section');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()
  `);
  await sleep(800);
  await capture('category_redesign_tablet_768.png');

  // Reset viewport
  await send('Emulation.clearDeviceMetricsOverride');
  ws.close();
  console.log('Completed all captures successfully!');
}

run().catch(console.error);
