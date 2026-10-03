import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

async function main() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const storeTab = tabs.find(t => t.url.startsWith('http://localhost:3000') && !t.url.includes('/admin') && t.type === 'page');

  if (!storeTab) {
    console.error('Storefront tab not found');
    return;
  }

  console.log('Connecting to tab:', storeTab.id, storeTab.webSocketDebuggerUrl);
  const ws = new WebSocket(storeTab.webSocketDebuggerUrl);
  let id = 1;
  const callbacks = new Map();

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    if (data.id && callbacks.has(data.id)) {
      const cb = callbacks.get(data.id);
      callbacks.delete(data.id);
      cb(data);
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

  await send('Page.enable');
  await send('Runtime.enable');

  // Desktop Capture (1440 x 900)
  console.log('Configuring desktop (1440x900)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });

  // Scroll to absolute top
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({ top: 0, left: 0, behavior: "instant" })'
  });
  await new Promise(r => setTimeout(r, 600));

  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  const desktopPath = path.join(ARTIFACT_DIR, 'hero_static_desktop_verified.png');
  fs.writeFileSync(desktopPath, Buffer.from(shot1.result.data, 'base64'));
  console.log('✓ Saved:', desktopPath);

  // Mobile Capture (390 x 844 - iPhone 14)
  console.log('Configuring mobile (390x844)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo({ top: 0, left: 0, behavior: "instant" })'
  });
  await new Promise(r => setTimeout(r, 600));

  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  const mobilePath = path.join(ARTIFACT_DIR, 'hero_static_mobile_verified.png');
  fs.writeFileSync(mobilePath, Buffer.from(shot2.result.data, 'base64'));
  console.log('✓ Saved:', mobilePath);

  // Reset to default
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1470,
    height: 835,
    deviceScaleFactor: 2,
    mobile: false
  });

  ws.close();
  console.log('Done capturing!');
}

main().catch(err => {
  console.error('Fatal error:', err);
});
