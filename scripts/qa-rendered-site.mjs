import fs from 'node:fs';

const endpoint = 'http://127.0.0.1:9223';
const base = 'http://127.0.0.1:4323';
const target = await fetch(`${endpoint}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }); });

let commandId = 0;
const pending = new Map();
const consoleProblems = [];
const networkProblems = [];
socket.addEventListener('message', (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(new Error(message.error.message)) : resolve(message.result);
    return;
  }
  if (message.method === 'Runtime.exceptionThrown') consoleProblems.push(message.params.exceptionDetails?.text ?? 'Runtime exception');
  if (message.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(message.params.type)) {
    consoleProblems.push(message.params.args.map((argument) => argument.value ?? argument.description ?? '').join(' '));
  }
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) {
    networkProblems.push(`${message.params.response.status} ${message.params.response.url}`);
  }
});

function send(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function evaluate(expression) {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}

await Promise.all(['Page.enable', 'Runtime.enable', 'Log.enable', 'Network.enable'].map((method) => send(method)));
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });

const cases = [
  ['home-desktop', '/', 1440, 1000, true],
  ['home-laptop', '/', 1280, 800, false],
  ['home-tablet', '/', 768, 1024, false],
  ['home-mobile', '/', 390, 844, true],
  ['home-small-mobile', '/', 320, 700, false],
  ['people-desktop', '/people/', 1440, 1000, false],
  ['people-mobile', '/people/', 390, 844, false],
  ['black-white', '/collections/black-and-white/', 1440, 1000, false],
  ['black-white-mobile', '/collections/black-and-white/', 390, 844, false],
  ['destinations', '/destinations/', 1440, 1000, false],
  ['archive-desktop', '/archive/', 1440, 1000, false],
  ['archive-mobile', '/archive/', 390, 844, false],
  ['japan-desktop', '/destinations/japan/', 1440, 1000, false],
  ['japan-mobile', '/destinations/japan/', 390, 844, false],
];

const results = [];
for (const [name, route, width, height, fullPage] of cases) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 768 });
  await send('Page.navigate', { url: `${base}${route}` });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await evaluate(`(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += Math.max(innerHeight * .8, 500)) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 35));
    }
    scrollTo(0, 0); await new Promise(r => setTimeout(r, 120));
  })()`);
  const state = await evaluate(`(() => {
    const images = [...document.images];
    const sources = images.map(image => image.currentSrc || image.src);
    return {
      title: document.title,
      bodyLength: document.body.innerText.trim().length,
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      imageCount: images.length,
      brokenImages: images.filter(image => image.hasAttribute('src') && image.complete && image.naturalWidth === 0).map(image => image.currentSrc || image.src),
      duplicateSources: [...new Set(sources.filter((source, index) => sources.indexOf(source) !== index))],
      rejectedReference: document.documentElement.innerHTML.includes('P1210572') || document.documentElement.innerHTML.includes('photo-0105') || document.documentElement.innerHTML.includes('people-laughing'),
      frameworkOverlay: Boolean(document.querySelector('vite-error-overlay, astro-dev-overlay, nextjs-portal'))
      ,metadata: {
        canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
        ogImage: document.querySelector('meta[property="og:image"]')?.content ?? null,
        twitterImage: document.querySelector('meta[name="twitter:image"]')?.content ?? null,
        robots: document.querySelector('meta[name="robots"]')?.content ?? null,
        jsonLdCount: document.querySelectorAll('script[type="application/ld+json"]').length
      }
      ,archiveLayout: document.querySelector('[data-archive-field]') ? {
        fieldHeight: Math.round(document.querySelector('[data-archive-field]').getBoundingClientRect().height),
        frameCount: document.querySelectorAll('[data-archive-field] .archive-frame').length,
        lastFrameBottom: Math.round([...document.querySelectorAll('[data-archive-field] .archive-frame')].at(-1).getBoundingClientRect().bottom + scrollY)
      } : null
    };
  })()`);
  results.push({ name, route, width, height, ...state });

  if (['home-desktop', 'home-mobile', 'people-desktop', 'black-white', 'destinations', 'archive-desktop', 'japan-desktop'].includes(name)) {
    let screenshotParams = { format: 'png', captureBeyondViewport: true };
    if (fullPage) {
      const metrics = await send('Page.getLayoutMetrics');
      screenshotParams.clip = { x: 0, y: 0, width, height: Math.ceil(metrics.cssContentSize.height), scale: 1 };
    }
    const shot = await send('Page.captureScreenshot', screenshotParams);
    fs.writeFileSync(`/tmp/elsewhere-phase6-${name}.png`, Buffer.from(shot.data, 'base64'));
  }
}

await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: `${base}/archive/` });
await new Promise((resolve) => setTimeout(resolve, 1000));
const viewerInteraction = await evaluate(`(async () => {
  const frame = document.querySelector('[data-photo-id]');
  frame.click(); await new Promise(r => setTimeout(r, 300));
  const dialog = document.querySelector('[data-photo-viewer]');
  const before = document.querySelector('[data-viewer-current]').textContent;
  dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  await new Promise(r => setTimeout(r, 200));
  const after = document.querySelector('[data-viewer-current]').textContent;
  dialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  dialog.close();
  return { opened: before !== '', advanced: before !== after, closed: !dialog.open, imageLoaded: document.querySelector('[data-viewer-image]').naturalWidth > 0 };
})()`);

await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
await send('Page.navigate', { url: `${base}/` });
await new Promise((resolve) => setTimeout(resolve, 700));
const mobileMenuInteraction = await evaluate(`(async () => {
  const button = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');
  const inertBefore = nav.inert;
  button.click(); await new Promise(r => setTimeout(r, 80));
  const opened = button.getAttribute('aria-expanded') === 'true' && nav.hasAttribute('data-open') && !nav.inert;
  const focusMovedInside = nav.contains(document.activeElement);
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  await new Promise(r => setTimeout(r, 80));
  return { inertBefore, opened, focusMovedInside, closed: button.getAttribute('aria-expanded') === 'false' && nav.inert, focusReturned: document.activeElement === button };
})()`);

const report = { results, viewerInteraction, mobileMenuInteraction, consoleProblems: [...new Set(consoleProblems)], networkProblems: [...new Set(networkProblems)] };
fs.writeFileSync('/tmp/elsewhere-final-rendered-qa.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
socket.close();
