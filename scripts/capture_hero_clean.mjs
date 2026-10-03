import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const storeTab = tabs.find(t => t.url.startsWith('http://localhost:3000') && !t.url.includes('/admin') && t.type === 'page');

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
    if (data.id) console.log('Received response for id:', data.id);
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

  async function capture(filename) {
    try {
      const res = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
      if (res.error) {
        console.error('Capture error:', res.error);
        return;
      }
      if (!res.result?.data) {
        console.error('No data in result:', res);
        return;
      }
      const fp = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(fp, Buffer.from(res.result.data, 'base64'));
      console.log(`✓ Saved screenshot: ${filename}`);
    } catch (err) {
      console.error('Capture exception:', err);
    }
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  // Reset viewport to desktop standard 1440x900
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });
  await sleep(400);

  // Scroll to absolute top
  await send('Runtime.evaluate', {
    expression: 'document.documentElement.scrollTop = 0; document.body.scrollTop = 0; window.scrollTo(0, 0);'
  });
  await sleep(600);

  console.log('Capturing desktop hero...');
  await capture('hero_static_final_desktop.jpg');

  // Switch to mobile viewport (iPhone 14: 390x844)
  console.log('Switching to mobile viewport 390x844...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(400);

  await send('Runtime.evaluate', {
    expression: 'document.documentElement.scrollTop = 0; document.body.scrollTop = 0; window.scrollTo(0, 0);'
  });
  await sleep(600);

  console.log('Capturing mobile hero...');
  await capture('hero_static_final_mobile.jpg');

  // Switch back to normal
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1470,
    height: 835,
    deviceScaleFactor: 2,
    mobile: false
  });

  ws.close();
  console.log('Finished capturing!');
}

run().catch(console.error);
