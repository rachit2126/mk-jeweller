import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';
const PORT = 9335;
const USER_DATA_DIR = '/tmp/chrome_nav_test_' + Date.now();

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching headless Chrome on port ' + PORT + '...');
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

  let tabs = null;
  for (let i = 0; i < 15; i++) {
    await sleep(500);
    try {
      const listRes = await fetch(`http://127.0.0.1:${PORT}/json`);
      tabs = await listRes.json();
      if (tabs && tabs.length > 0) break;
    } catch {}
  }
  if (!tabs || tabs.length === 0) {
    throw new Error('Chrome did not initialize on port ' + PORT);
  }
  const wsUrl = tabs[0].webSocketDebuggerUrl;
  console.log('Connecting to CDP at:', wsUrl);

  try {
    const ws = new WebSocket(wsUrl);

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
        callbacks.set(msgId, resolve);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    console.log('Enabling Page & Runtime...');
    await send('Page.enable');
    await send('Runtime.enable');
    await send('DOM.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log('Navigating to http://localhost:3000/...');
    const loadPromise = new Promise((resolve) => {
      const orig = ws.onmessage;
      ws.onmessage = (event) => {
        orig(event);
        try {
          const data = JSON.parse(event.data);
          if (data.method === 'Page.loadEventFired') resolve();
        } catch {}
      };
    });
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await Promise.race([loadPromise, sleep(5000)]);
    await sleep(2500);

    async function captureScreenshot(filename) {
      const res = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
      const filePath = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(filePath, Buffer.from(res.result.data, 'base64'));
      console.log(`Saved screenshot to: ${filePath}`);
    }

    async function evaluate(expression) {
      return await send('Runtime.evaluate', { expression, returnByValue: true });
    }

    // 1. Initial Desktop view
    console.log('Capturing initial desktop view...');
    await captureScreenshot('navbar_desktop_initial.png');

    // 2. Hover over NECKLACES
    console.log('Hovering over NECKLACES...');
    const neckPos = await evaluate(`
      (() => {
        const links = Array.from(document.querySelectorAll('a'));
        const link = links.find(el => el.textContent.trim().toUpperCase() === 'NECKLACES');
        if (!link) return null;
        const rect = link.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()
    `);

    console.log('Necklaces link position:', neckPos.result.value);
    if (neckPos.result.value) {
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: Math.round(neckPos.result.value.x),
        y: Math.round(neckPos.result.value.y),
      });
      await sleep(1200);
      await captureScreenshot('navbar_necklaces_hover.png');

      // 3. Move mouse to hover over EARRINGS in the left category selector of the mega menu
      console.log('Hovering over Earrings in the left category selector...');
      const earringBtnPos = await evaluate(`
        (() => {
          const btn = Array.from(document.querySelectorAll('.category-selector-btn')).find(el => el.textContent.trim().includes('Earrings'));
          if (!btn) return null;
          const rect = btn.getBoundingClientRect();
          return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        })()
      `);

      console.log('Earring selector btn position:', earringBtnPos.result.value);
      if (earringBtnPos.result.value) {
        await send('Input.dispatchMouseEvent', {
          type: 'mouseMoved',
          x: Math.round(earringBtnPos.result.value.x),
          y: Math.round(earringBtnPos.result.value.y),
        });
        await sleep(1000);
        await captureScreenshot('navbar_earrings_selector_hover.png');
      }
    }

    // 4. Mobile Drawer View
    console.log('Testing Mobile Drawer...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 375,
      height: 812,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await sleep(600);

    // Click Hamburger
    await evaluate(`
      (() => {
        const btn = document.querySelector('.mobile-nav-toggle button');
        if (btn) btn.click();
      })()
    `);
    await sleep(600);

    // Expand NECKLACES accordion in mobile drawer
    await evaluate(`
      (() => {
        const btn = Array.from(document.querySelectorAll('button')).find(el => el.textContent.trim().toUpperCase() === 'NECKLACES');
        if (btn) btn.click();
      })()
    `);
    await sleep(600);
    await captureScreenshot('navbar_mobile_drawer_open.png');

    console.log('All tests completed successfully!');
    ws.close();
  } catch (err) {
    console.error('CDP test error:', err);
  } finally {
    try {
      chromeProcess.kill();
    } catch {}
    await sleep(500);
    try {
      fs.rmSync(USER_DATA_DIR, { recursive: true, force: true });
    } catch {}
  }
}

run();
