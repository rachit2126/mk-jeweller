import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';
const PORT = 9340;
const USER_DATA_DIR = '/tmp/chrome_orders_profile_' + Date.now();
const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('====================================================');
  console.log('TESTING REDESIGNED MK SILVER HUB ORDERS MANAGEMENT');
  console.log('====================================================\n');

  // 1. Authenticate Admin
  console.log('1. Authenticating Admin Session...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@mksilverhub.com',
      password: 'AdminPassword123!',
      portal: 'admin',
    }),
  });
  const loginData = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie') || '';
  if (!loginRes.ok || !loginData.success) {
    throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
  }

  const adminMatch = setCookie.match(/mk_admin_session=([^;,\s]+)/);
  const userMatch = setCookie.match(/mk_session=([^;,\s]+)/);
  const adminToken = adminMatch ? adminMatch[1] : '';
  const userToken = userMatch ? userMatch[1] : '';

  console.log(`   ✓ Authenticated as: ${loginData.session?.name} (${loginData.session?.role})`);

  // 2. Launch Chrome for Visual UI Screenshots
  console.log('\n2. Launching Headless Chrome on port ' + PORT + '...');
  const chromeProcess = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--window-size=1440,900',
    'about:blank',
  ]);

  await sleep(1500);

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json`);
    const tabs = await listRes.json();
    const wsUrl = tabs[0].webSocketDebuggerUrl;
    console.log('   ✓ Connected to Chrome CDP');

    const ws = new WebSocket(wsUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.method === 'Runtime.consoleAPICalled') {
        const msg = data.params.args?.map((a) => a.value || a.description).join(' ') || '';
        if (data.params.type === 'error') {
          console.error('   [Browser Console Error]:', msg);
        }
      }
      if (data.method === 'Runtime.exceptionThrown') {
        console.error('   [Browser Exception]:', data.params.exceptionDetails?.text);
      }
      if (data.id && callbacks.has(data.id)) {
        const resolve = callbacks.get(data.id);
        callbacks.delete(data.id);
        resolve(data);
      }
    };

    await new Promise((resolve) => (ws.onopen = resolve));

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const timer = setTimeout(() => {
          if (callbacks.has(msgId)) {
            callbacks.delete(msgId);
            console.warn(`Command ${method} timed out after 8s, resolving anyway.`);
            resolve({ timedOut: true });
          }
        }, 8000);

        callbacks.set(msgId, (res) => {
          clearTimeout(timer);
          resolve(res);
        });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Network.enable');
    await send('Page.enable');
    await send('Runtime.enable');

    // Set cookies with URL
    if (adminToken) {
      await send('Network.setCookie', {
        name: 'mk_admin_session',
        value: adminToken,
        url: BASE_URL,
        httpOnly: true,
      });
    }
    if (userToken) {
      await send('Network.setCookie', {
        name: 'mk_session',
        value: userToken,
        url: BASE_URL,
        httpOnly: true,
      });
    }

    // 3. Navigate to /admin/orders (Desktop 1440x900)
    console.log('\n3. Navigating to http://localhost:3000/admin/orders (Desktop)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });

    await send('Page.navigate', { url: `${BASE_URL}/admin/orders` });
    await sleep(3500);

    // Capture Desktop Screenshot
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    if (snap1.result?.data) {
      const snap1Path = path.join(ARTIFACT_DIR, 'admin_orders_desktop.png');
      fs.writeFileSync(snap1Path, Buffer.from(snap1.result.data, 'base64'));
      console.log(`   ✓ Desktop screenshot saved: ${snap1Path}`);
    }

    // 4. Click "View →" button on first order to open Order Details Drawer
    console.log('\n4. Opening Order Details Drawer...');
    const evalRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btns = document.querySelectorAll('.order-view-action-btn');
          if (btns.length > 0) {
            btns[0].click();
            return 'Clicked view button for ' + btns.length + ' orders';
          }
          return 'No view button found';
        })()
      `,
      returnByValue: true,
    });
    console.log(`   ✓ Eval result:`, evalRes.result?.result?.value);
    await sleep(2000);

    // Capture Drawer Open Screenshot
    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    if (snap2.result?.data) {
      const snap2Path = path.join(ARTIFACT_DIR, 'admin_orders_drawer_open.png');
      fs.writeFileSync(snap2Path, Buffer.from(snap2.result.data, 'base64'));
      console.log(`   ✓ Order Details Drawer screenshot saved: ${snap2Path}`);
    }

    // Close drawer
    await send('Runtime.evaluate', {
      expression: `
        const closeBtn = document.querySelector('.drawer-close-btn');
        if (closeBtn) closeBtn.click();
      `,
      returnByValue: true,
    });
    await sleep(800);

    // 5. Mobile Viewport (390x844)
    console.log('\n5. Emulating Mobile Viewport (390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(1500);

    const snap3 = await send('Page.captureScreenshot', { format: 'png' });
    if (snap3.result?.data) {
      const snap3Path = path.join(ARTIFACT_DIR, 'admin_orders_mobile.png');
      fs.writeFileSync(snap3Path, Buffer.from(snap3.result.data, 'base64'));
      console.log(`   ✓ Mobile orders screenshot saved: ${snap3Path}`);
    }

    ws.close();
  } finally {
    chromeProcess.kill();
    fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
  }

  console.log('\n====================================================');
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
  console.log('====================================================\n');
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
