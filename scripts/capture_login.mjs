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
      }, 10000);
      callbacks.set(msgId, (res) => {
        clearTimeout(timer);
        resolve(res);
      });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  // 1. Desktop 1440x900
  console.log('Setting desktop viewport 1440x900...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
    mobile: false,
  });

  console.log('Navigating to http://localhost:3000/login...');
  await send('Page.bringToFront');
  await send('Page.navigate', { url: 'http://localhost:3000/login' });
  await sleep(2500);

  console.log('Capturing desktop login page...');
  const shotDesktop = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  const dataDesktop = shotDesktop?.result?.data || shotDesktop?.data;
  if (dataDesktop) {
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'login_desktop_redesign.png'),
      Buffer.from(dataDesktop, 'base64')
    );
    console.log('✓ Saved login_desktop_redesign.png');
  } else {
    console.log('No dataDesktop, shot was:', JSON.stringify(Object.keys(shotDesktop || {})));
  }

  // 2. Mobile 390x844
  console.log('Setting mobile viewport 390x844...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await sleep(1500);

  console.log('Capturing mobile login page...');
  const shotMobile = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false });
  const dataMobile = shotMobile?.result?.data || shotMobile?.data;
  if (dataMobile) {
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'login_mobile_redesign.png'),
      Buffer.from(dataMobile, 'base64')
    );
    console.log('✓ Saved login_mobile_redesign.png');
  } else {
    console.log('No dataMobile, shot was:', JSON.stringify(Object.keys(shotMobile || {})));
  }

  ws.close();
  console.log('Login captures completed successfully!');
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
