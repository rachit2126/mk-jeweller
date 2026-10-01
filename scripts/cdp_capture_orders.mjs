import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const listRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await listRes.json();
  const adminTab = tabs.find((t) => t.url?.includes('localhost:3000')) || tabs[0];
  console.log('Connecting to existing Chrome tab:', adminTab.title, adminTab.url);

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
  await send('Runtime.enable');

  // 1. Desktop 1440x900
  console.log('1. Setting desktop viewport 1440x900...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  console.log('2. Navigating to /admin/orders...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/orders' });
  await sleep(3500);

  // Capture desktop screenshot
  console.log('3. Capturing desktop orders screenshot...');
  const shot1 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot1.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'admin_orders_desktop.png'), Buffer.from(shot1.result.data, 'base64'));
    console.log('   ✓ Saved admin_orders_desktop.png');
  }

  // 4. Open Drawer
  console.log('4. Clicking "View →" to open Order Details Drawer...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btn = document.querySelector('.order-view-action-btn');
        if (btn) btn.click();
      })()
    `,
  });
  await sleep(1500);

  const shot2 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot2.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'admin_orders_drawer_open.png'), Buffer.from(shot2.result.data, 'base64'));
    console.log('   ✓ Saved admin_orders_drawer_open.png');
  }

  // Close drawer
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const closeBtn = document.querySelector('.drawer-close-btn');
        if (closeBtn) closeBtn.click();
      })()
    `,
  });
  await sleep(600);

  // 5. Mobile 390x844
  console.log('5. Setting mobile viewport 390x844...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Page.reload');
  await sleep(3000);

  const shot3 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot3.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'admin_orders_mobile.png'), Buffer.from(shot3.result.data, 'base64'));
    console.log('   ✓ Saved admin_orders_mobile.png');
  }

  // Reset viewport to normal desktop
  await send('Emulation.clearDeviceMetricsOverride');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/orders' });

  ws.close();
  console.log('All screenshots captured successfully!');
}

run().catch(console.error);
