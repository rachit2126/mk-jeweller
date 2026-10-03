async function test() {
  const tabsRes = await fetch('http://127.0.0.1:9222/json/list');
  const tabs = await tabsRes.json();
  const storeTab = tabs.find(t => t.url.includes('localhost:3000') && !t.url.includes('admin') && t.type === 'page');

  if (!storeTab) {
    console.log('No store tab found:', tabs);
    return;
  }

  console.log('Connecting to:', storeTab.title, storeTab.url);
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
      callbacks.set(msgId, r);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  await send('Runtime.enable');

  // Evaluate links
  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const links = Array.from(document.querySelectorAll('.nav-category-link'));
        return {
          url: window.location.href,
          count: links.length,
          labels: links.map(l => l.textContent.trim())
        };
      })()
    `,
    returnByValue: true
  });

  console.log('Eval response:', JSON.stringify(evalRes));
  ws.close();
}

test().catch(console.error);
