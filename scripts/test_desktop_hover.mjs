import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';
const PORT = 9338;
const USER_DATA_DIR = '/tmp/chrome_test_hover_' + Date.now();

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching Chrome...');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,900',
    'about:blank',
  ]);

  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await sleep(400);
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      tabs = await res.json();
      if (tabs && tabs.length > 0) break;
    } catch {}
  }
  if (!tabs) throw new Error('Chrome failed to start');

  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 960,
    deviceScaleFactor: 1,
    mobile: false,
  });

  console.log('Loading home page...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  // Wait for Dev server compilation and full render
  await sleep(4500);

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    const fp = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(fp, Buffer.from(res.result.data, 'base64'));
    console.log(`Saved screenshot: ${filename}`);
  }

  async function evalJs(expr) {
    return (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;
  }

  // Check category links in DOM
  const linksInfo = await evalJs(`
    (() => {
      const links = Array.from(document.querySelectorAll('.nav-category-link'));
      return links.map(l => ({ text: l.textContent.trim(), rect: l.getBoundingClientRect() }));
    })()
  `);
  console.log('Category links found:', linksInfo ? linksInfo.map(l => l.text) : 'none');

  await capture('desktop_navbar_initial.png');

  // Find Necklaces position
  const neckLink = linksInfo?.find(l => l.text.toUpperCase().includes('NECKLACES'));
  if (neckLink) {
    console.log('Hovering over NECKLACES at:', neckLink.rect.x, neckLink.rect.y);
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: Math.round(neckLink.rect.x + neckLink.rect.width / 2),
      y: Math.round(neckLink.rect.y + neckLink.rect.height / 2),
    });
    await sleep(800);
    await capture('desktop_necklaces_mega_menu.png');

    // Inside mega menu: hover over Earrings in the left selector
    const earringBtn = await evalJs(`
      (() => {
        const btn = Array.from(document.querySelectorAll('.category-selector-btn')).find(el => el.textContent.trim().includes('Earrings'));
        if (!btn) return null;
        const rect = btn.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()
    `);

    if (earringBtn) {
      console.log('Hovering over EARRINGS in selector at:', earringBtn.x, earringBtn.y);
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: Math.round(earringBtn.x),
        y: Math.round(earringBtn.y),
      });
      await sleep(800);
      await capture('desktop_earrings_mega_menu.png');
    }
  }

  // Capture Admin Navigation CMS
  console.log('Navigating to Admin Navigation CMS...');
  await send('Page.navigate', { url: 'http://localhost:3000/admin/navbar' });
  await sleep(4000);
  await capture('desktop_admin_navbar_preview.png');

  console.log('Finished all captures!');
  ws.close();
  chrome.kill();
  await sleep(400);
  try { fs.rmSync(USER_DATA_DIR, { recursive: true, force: true }); } catch {}
}

run().catch(console.error);
