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
  const adminTab = tabs.find(t => t.url.includes('/admin/navbar') && t.type === 'page');

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

  async function evalJs(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res.result?.value;
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

  // 1. Reload Storefront Tab to pick up the new navbar & pre-rendered SSR
  console.log('Reloading storefront tab...');
  await send('Page.reload');
  await sleep(3000);

  // 2. Capture clean initial state
  console.log('Capturing initial navbar...');
  await capture('navbar_final_desktop_clean.png');

  // 3. Find NECKLACES category link and hover
  const neckPos = await evalJs(`
    (() => {
      const links = Array.from(document.querySelectorAll('.nav-category-link'));
      const link = links.find(el => el.textContent.trim().toUpperCase().includes('NECKLACES'));
      if (!link) return null;
      const rect = link.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    })()
  `);

  console.log('Necklaces position:', neckPos);
  if (neckPos) {
    console.log('Dispatching mouseMoved over NECKLACES...');
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: Math.round(neckPos.x),
      y: Math.round(neckPos.y),
    });
    await sleep(900);
    await capture('navbar_final_necklaces_mega_menu.png');

    // 4. Hover over EARRINGS in the left selector inside the floating card
    const earringBtnPos = await evalJs(`
      (() => {
        const btn = Array.from(document.querySelectorAll('.category-selector-btn')).find(el => el.textContent.trim().includes('Earrings'));
        if (!btn) return null;
        const rect = btn.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      })()
    `);

    console.log('Earrings in left selector position:', earringBtnPos);
    if (earringBtnPos) {
      console.log('Dispatching mouseMoved over EARRINGS in selector...');
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: Math.round(earringBtnPos.x),
        y: Math.round(earringBtnPos.y),
      });
      await sleep(900);
      await capture('navbar_final_earrings_mega_menu.png');
    }
  }

  ws.close();

  // 5. Connect to Admin Navbar tab if available and capture
  if (adminTab) {
    console.log('Connecting to Admin Navbar tab...');
    const adminWs = new WebSocket(adminTab.webSocketDebuggerUrl);
    let aId = 1;
    const aCallbacks = new Map();

    adminWs.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.id && aCallbacks.has(data.id)) {
        const res = aCallbacks.get(data.id);
        aCallbacks.delete(data.id);
        res(data);
      }
    };

    await new Promise(r => adminWs.onopen = r);

    function aSend(method, params = {}) {
      return new Promise(r => {
        const msgId = aId++;
        aCallbacks.set(msgId, r);
        adminWs.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await aSend('Page.enable');
    console.log('Reloading Admin Navbar tab...');
    await aSend('Page.reload');
    await sleep(2500);

    const aRes = await aSend('Page.captureScreenshot', { format: 'png' });
    if (aRes.result?.data) {
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'navbar_final_admin_live_preview.png'), Buffer.from(aRes.result.data, 'base64'));
      console.log('✓ Saved navbar_final_admin_live_preview.png');
    }

    adminWs.close();
  }

  console.log('All verification captures completed successfully!');
}

run().catch(console.error);
