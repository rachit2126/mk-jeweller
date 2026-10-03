import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/055778b5-b48a-4c44-b4c4-882ce982d4d7';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const storeTab = tabs.find(t => t.url.includes('localhost:3000') && !t.url.includes('admin') && t.type === 'page');

  if (!storeTab) {
    console.error('No store tab found on 9222');
    return;
  }

  console.log('Connecting to:', storeTab.title, storeTab.webSocketDebuggerUrl);
  const ws = new WebSocket(storeTab.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();
  ws.onmessage = (e) => {
    const d = JSON.parse(e.data);
    if (d.id && callbacks.has(d.id)) {
      callbacks.get(d.id)(d);
      callbacks.delete(d.id);
    }
  };

  await new Promise(r => ws.onopen = r);

  function send(method, params = {}) {
    return new Promise(r => {
      const msgId = id++;
      const timer = setTimeout(() => {
        if (callbacks.has(msgId)) {
          callbacks.delete(msgId);
          r({ error: 'timeout' });
        }
      }, 8000);
      callbacks.set(msgId, (res) => {
        clearTimeout(timer);
        r(res);
      });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  async function evalJs(expr) {
    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res.result?.result?.value;
  }

  // 1. Initial State Screenshot
  console.log('1. Capturing Initial Navbar...');
  const shot1 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot1.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'live_navbar_initial.png'), Buffer.from(shot1.result.data, 'base64'));
    console.log('✓ Saved live_navbar_initial.png');
  }

  // 2. Trigger hover on NECKLACES
  console.log('2. Triggering hover on NECKLACES...');
  const hoverRes = await evalJs(`
    (() => {
      const link = Array.from(document.querySelectorAll('.nav-category-link')).find(el => el.textContent.trim().toUpperCase().includes('NECKLACES'));
      if (!link) return { found: false };
      link.parentElement.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      return { found: true, text: link.textContent.trim() };
    })()
  `);
  console.log('Hover result:', hoverRes);

  await sleep(1000);

  // Check if mega menu is now in DOM
  const menuInfo = await evalJs(`
    (() => {
      const menu = document.querySelector('.dynamic-mega-menu-wrapper');
      if (!menu) return { open: false };
      const title = menu.querySelector('h3')?.textContent.trim();
      const subCards = Array.from(menu.querySelectorAll('.subcategory-card')).map(c => c.querySelector('span')?.textContent.trim());
      const popularStyles = Array.from(menu.querySelectorAll('.style-pill')).map(p => p.textContent.trim());
      const featuredTitle = menu.querySelector('.mega-featured-column h4')?.textContent.trim();
      return {
        open: true,
        title,
        subcategories: subCards,
        popularStyles,
        featuredTitle,
      };
    })()
  `);
  console.log('Mega Menu Open Info:', menuInfo);

  const shot2 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot2.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'live_navbar_necklaces_megamenu.png'), Buffer.from(shot2.result.data, 'base64'));
    console.log('✓ Saved live_navbar_necklaces_megamenu.png');
  }

  // 3. Switch to EARRINGS via left category selector
  console.log('3. Hovering over EARRINGS in left selector...');
  const selectRes = await evalJs(`
    (() => {
      const btn = Array.from(document.querySelectorAll('.category-selector-btn')).find(el => el.textContent.trim().includes('Earrings'));
      if (!btn) return { found: false };
      btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      return { found: true };
    })()
  `);
  console.log('Select Earrings result:', selectRes);

  await sleep(800);

  const earringMenuInfo = await evalJs(`
    (() => {
      const menu = document.querySelector('.dynamic-mega-menu-wrapper');
      if (!menu) return { open: false };
      return {
        title: menu.querySelector('h3')?.textContent.trim(),
        subcategories: Array.from(menu.querySelectorAll('.subcategory-card')).map(c => c.querySelector('span')?.textContent.trim()),
      };
    })()
  `);
  console.log('Switched Menu Info:', earringMenuInfo);

  const shot3 = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
  if (shot3.result?.data) {
    fs.writeFileSync(path.join(ARTIFACT_DIR, 'live_navbar_earrings_megamenu.png'), Buffer.from(shot3.result.data, 'base64'));
    console.log('✓ Saved live_navbar_earrings_megamenu.png');
  }

  // 4. Capture Admin CMS
  const adminTab = tabs.find(t => t.url.includes('/admin/navbar') && t.type === 'page');
  if (adminTab) {
    console.log('4. Connecting to Admin CMS tab...');
    const aWs = new WebSocket(adminTab.webSocketDebuggerUrl);
    let aId = 1;
    const aCb = new Map();
    aWs.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.id && aCb.has(d.id)) {
        aCb.get(d.id)(d);
        aCb.delete(d.id);
      }
    };
    await new Promise(r => aWs.onopen = r);

    function aSend(method, params = {}) {
      return new Promise(r => {
        const msgId = aId++;
        aCb.set(msgId, r);
        aWs.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await aSend('Page.enable');
    const shotAdmin = await aSend('Page.captureScreenshot', { format: 'png', fromSurface: true });
    if (shotAdmin.result?.data) {
      fs.writeFileSync(path.join(ARTIFACT_DIR, 'live_admin_navbar_cms.png'), Buffer.from(shotAdmin.result.data, 'base64'));
      console.log('✓ Saved live_admin_navbar_cms.png');
    }
    aWs.close();
  }

  ws.close();
  console.log('Verification finished!');
}

run().catch(console.error);
