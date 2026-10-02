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

  // 1. Desktop 1440x900
  console.log('1. Setting desktop viewport 1440x900...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  console.log('2. Navigating to http://localhost:3000/...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await sleep(4000);

  // Force scroll to top and disable smooth scroll for crisp frame capture
  await send('Runtime.evaluate', {
    expression: `
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    `
  });
  await sleep(1500);

  // Capture desktop hero
  console.log('3. Capturing desktop homepage hero screenshot...');
  const shot1 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot1.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'homepage_desktop_hero.png'), Buffer.from(shot1.result.data, 'base64'));
    console.log('   ✓ Saved homepage_desktop_hero.png');
  }

  // Scroll down to Category & Best Sellers (around y = 650)
  console.log('4. Scrolling down to Category & Editorial Banner & Best Sellers...');
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo({ top: 620, behavior: 'instant' });
      document.documentElement.scrollTop = 620;
    `
  });
  await sleep(2000);
  const shot2 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot2.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'homepage_desktop_categories_bestsellers.png'), Buffer.from(shot2.result.data, 'base64'));
    console.log('   ✓ Saved homepage_desktop_categories_bestsellers.png');
  }

  // Scroll down to Best Sellers & New Arrivals (around y = 1450)
  console.log('5. Scrolling down to Best Sellers & New Arrivals...');
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo({ top: 1400, behavior: 'instant' });
      document.documentElement.scrollTop = 1400;
    `
  });
  await sleep(2000);
  const shot2b = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot2b.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'homepage_desktop_products_slider.png'), Buffer.from(shot2b.result.data, 'base64'));
    console.log('   ✓ Saved homepage_desktop_products_slider.png');
  }

  // Scroll down to Men & Minimal & Occasion (around y = 2300)
  console.log('6. Scrolling down to Men, Minimal & Occasion...');
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo({ top: 2200, behavior: 'instant' });
      document.documentElement.scrollTop = 2200;
    `
  });
  await sleep(2000);
  const shot3 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot3.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'homepage_desktop_men_minimal_occasions.png'), Buffer.from(shot3.result.data, 'base64'));
    console.log('   ✓ Saved homepage_desktop_men_minimal_occasions.png');
  }

  // Scroll down to Community Stories & Newsletter & Footer (around y = 3300)
  console.log('7. Scrolling down to Community Stories, Newsletter & Footer...');
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo({ top: 3200, behavior: 'instant' });
      document.documentElement.scrollTop = 3200;
    `
  });
  await sleep(2000);
  const shot4 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot4.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'homepage_desktop_social_newsletter_footer.png'), Buffer.from(shot4.result.data, 'base64'));
    console.log('   ✓ Saved homepage_desktop_social_newsletter_footer.png');
  }

  // 8. Mobile 390x844 (iPhone 14)
  console.log('8. Setting mobile viewport 390x844...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
    mobile: true,
  });

  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    `
  });
  await sleep(2000);

  const shot5 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot5.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'homepage_mobile_hero.png'), Buffer.from(shot5.result.data, 'base64'));
    console.log('   ✓ Saved homepage_mobile_hero.png');
  }

  // Scroll mobile down to Categories & Best Sellers
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo({ top: 750, behavior: 'instant' });
      document.documentElement.scrollTop = 750;
    `
  });
  await sleep(1500);

  const shot6 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot6.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'homepage_mobile_bestsellers.png'), Buffer.from(shot6.result.data, 'base64'));
    console.log('   ✓ Saved homepage_mobile_bestsellers.png');
  }

  ws.close();
  console.log('All homepage screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
