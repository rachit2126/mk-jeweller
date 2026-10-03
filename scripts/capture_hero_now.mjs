import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

async function captureScreens() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const storeTab = tabs.find(t => t.url === 'http://localhost:3000/' && t.type === 'page');
  const ws = new WebSocket(storeTab.webSocketDebuggerUrl);
  let msgId = 1;
  const cbs = new Map();
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && cbs.has(d.id)) {
      cbs.get(d.id)(d);
      cbs.delete(d.id);
    }
  };
  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise(r => {
      const id = msgId++;
      cbs.set(id, r);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  // Desktop 1440
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 960,
    deviceScaleFactor: 2,
    mobile: false
  });
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await new Promise(r => setTimeout(r, 800));

  const s1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'hero_static_desktop_1440.png'), Buffer.from(s1.result.data, 'base64'));
  console.log('✓ Saved desktop screenshot');

  // Mobile 390
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await new Promise(r => setTimeout(r, 800));

  const s2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'hero_static_mobile_390.png'), Buffer.from(s2.result.data, 'base64'));
  console.log('✓ Saved mobile screenshot');

  // Reset
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1470,
    height: 835,
    deviceScaleFactor: 2,
    mobile: false
  });

  ws.close();
}
captureScreens().catch(console.error);
