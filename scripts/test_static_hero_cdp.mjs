import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const storeTab = tabs.find(t => t.url === 'http://localhost:3000/' && t.type === 'page');

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

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const fp = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(fp, Buffer.from(res.result.data, 'base64'));
    console.log(`✓ Saved screenshot: ${filename}`);
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  // Reload page to get fresh server components and DB data
  console.log('Reloading page...');
  await send('Page.reload', { ignoreCache: true });
  await sleep(2500);

  // Scroll to top
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  await sleep(500);

  // 1. Desktop Viewport (1440x900)
  console.log('Testing Desktop (1440x900)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false
  });
  await sleep(1000);
  await capture('hero_static_desktop_1440.png');

  // Check hero metrics
  const desktopHeroInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      const hero = document.querySelector('.static-hero-root');
      const trust = document.querySelector('section[aria-label*="Hallmark"]');
      const heading = document.querySelector('.static-hero-heading');
      return {
        heroHeight: hero ? hero.offsetHeight : null,
        trustHeight: trust ? trust.offsetHeight : null,
        headingText: heading ? heading.innerText : null,
      };
    })()`,
    returnByValue: true
  });
  console.log('Desktop Hero Info:', desktopHeroInfo.result?.value);

  // 2. Mobile Viewport: 390x844 (iPhone 14)
  console.log('Testing Mobile (390x844)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(1000);
  await capture('hero_static_mobile_390.png');

  // 3. Mobile Viewport: 375x667 (iPhone SE)
  console.log('Testing Mobile (375x667)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(800);
  await capture('hero_static_mobile_375.png');

  // 4. Mobile Viewport: 430x932 (iPhone 14 Pro Max)
  console.log('Testing Mobile (430x932)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 430,
    height: 932,
    deviceScaleFactor: 2,
    mobile: true
  });
  await sleep(800);
  await capture('hero_static_mobile_430.png');

  // Reset viewport to default
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1470,
    height: 835,
    deviceScaleFactor: 2,
    mobile: false
  });

  console.log('All hero tests completed successfully!');
  ws.close();
}

run().catch(console.error);
