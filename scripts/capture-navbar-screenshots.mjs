import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = '/Users/apple/.gemini/antigravity-ide/brain/f4d27af0-618c-4d27-8ff8-ea0fe7b7e43d';
const PORT = 9333;
const USER_DATA_DIR = '/tmp/chrome_test_profile_' + Date.now();

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

  chromeProcess.stderr.on('data', (d) => {
    // console.log('chrome err:', d.toString());
  });

  await sleep(1500);

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json`);
    const tabs = await listRes.json();
    const wsUrl = tabs[0].webSocketDebuggerUrl;
    console.log('Connecting to CDP at:', wsUrl);

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
      deviceScaleFactor: 2,
      mobile: false,
    });

    console.log('Navigating to http://localhost:3000/...');
    await send('Page.navigate', { url: 'http://localhost:3000/' });
    await sleep(2500);

    async function captureScreenshot(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
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

    // 2. Open SHOP Mega Menu
    console.log('Opening SHOP mega menu...');
    await evaluate(`
      const shopBtn = Array.from(document.querySelectorAll('a')).find(el => el.textContent.trim().startsWith('SHOP'));
      if (shopBtn) shopBtn.click();
    `);
    await sleep(800);
    await captureScreenshot('navbar_shop_mega_menu.png');

    // Close SHOP
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await sleep(300);

    // 3. Open COLLECTIONS Mega Menu
    console.log('Opening COLLECTIONS mega menu...');
    await evaluate(`
      const colBtn = Array.from(document.querySelectorAll('a')).find(el => el.textContent.trim().startsWith('COLLECTIONS'));
      if (colBtn) colBtn.click();
    `);
    await sleep(800);
    await captureScreenshot('navbar_collections_mega_menu.png');

    // Close COLLECTIONS
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await sleep(300);

    // 4. Open SEARCH Overlay
    console.log('Clicking Search icon...');
    await evaluate(`
      const searchBtn = document.querySelector('.nav-icon-search');
      if (searchBtn) searchBtn.click();
    `);
    await sleep(800);
    await captureScreenshot('navbar_search_overlay.png');

    // Close SEARCH
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await sleep(300);

    // 5. Open ACCOUNT Dropdown
    console.log('Clicking Account icon...');
    await evaluate(`
      const accountBtn = document.querySelector('.nav-icon-account');
      if (accountBtn) accountBtn.click();
    `);
    await sleep(800);
    await captureScreenshot('navbar_account_dropdown.png');

    // Close ACCOUNT
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await sleep(300);

    // 6. Open WISHLIST Preview
    console.log('Clicking Wishlist icon...');
    await evaluate(`
      const wishlistBtn = document.querySelector('.nav-icon-wishlist');
      if (wishlistBtn) wishlistBtn.click();
    `);
    await sleep(800);
    await captureScreenshot('navbar_wishlist_preview.png');

    // Close WISHLIST
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await sleep(300);

    // 7. Open CART Preview
    console.log('Clicking Bag icon...');
    await evaluate(`
      const bagBtn = document.querySelector('.nav-icon-bag');
      if (bagBtn) bagBtn.click();
    `);
    await sleep(800);
    await captureScreenshot('navbar_cart_preview.png');

    // Close CART
    await evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));`);
    await sleep(300);

    // 8. Mobile View and Drawer
    console.log('Switching to mobile viewport 390x844...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await sleep(800);
    await captureScreenshot('navbar_mobile_header.png');

    console.log('Opening mobile drawer...');
    await evaluate(`
      const hamburger = document.querySelector('.mobile-nav-toggle button');
      if (hamburger) hamburger.click();
    `);
    await sleep(800);
    await captureScreenshot('navbar_mobile_drawer_closed_acc.png');

    console.log('Opening Shop accordion in mobile drawer...');
    await evaluate(`
      const shopAcc = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim().startsWith('SHOP'));
      if (shopAcc) shopAcc.click();
    `);
    await sleep(800);
    await captureScreenshot('navbar_mobile_drawer_open_acc.png');

    console.log('All tests completed successfully!');
    ws.close();
  } catch (err) {
    console.error('Error during screenshot capture:', err);
  } finally {
    chromeProcess.kill();
  }
}

run();
