import fs from 'node:fs';

const endpoint = 'http://127.0.0.1:9223';
const base = process.env.QA_BASE ?? 'http://127.0.0.1:4324';
const catalog = JSON.parse(fs.readFileSync('public/data/photo-catalog.json', 'utf8')).photos;
const ratio = (photo) => photo.width / photo.height;
const candidates = {
  landscape: [...catalog].filter((photo) => ratio(photo) > 1.25).sort((a, b) => b.editorialOrder - a.editorialOrder)[0],
  portrait: [...catalog].filter((photo) => ratio(photo) < .8).sort((a, b) => b.editorialOrder - a.editorialOrder)[0],
  square: [...catalog].sort((a, b) => Math.abs(ratio(a) - 1) - Math.abs(ratio(b) - 1))[0],
  panorama: [...catalog].sort((a, b) => ratio(b) - ratio(a))[0],
  monochrome: catalog.find((photo) => photo.visualWorlds.includes('black-and-white'))
};
const cases = [
  ['viewer-landscape-desktop', candidates.landscape, 1440, 1000],
  ['viewer-portrait-desktop', candidates.portrait, 1440, 1000],
  ['viewer-square-laptop', candidates.square, 1280, 800],
  ['viewer-panorama-tablet', candidates.panorama, 768, 1024],
  ['viewer-monochrome-mobile', candidates.monochrome, 390, 844],
  ['viewer-portrait-small-mobile', candidates.portrait, 320, 700]
];

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
  if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') consoleProblems.push(message.params.args.map((argument) => argument.value ?? argument.description ?? '').join(' '));
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) networkProblems.push(`${message.params.response.status} ${message.params.response.url}`);
});
const send = (method, params = {}) => {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
};
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
};

await Promise.all(['Page.enable', 'Runtime.enable', 'Network.enable'].map((method) => send(method)));
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
const results = [];
for (const [name, photo, width, height] of cases) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: width <= 768 });
  await send('Page.navigate', { url: `${base}/archive/` });
  await new Promise((resolve) => setTimeout(resolve, 900));
  const result = await evaluate(`(async () => {
    while (!document.querySelector('[data-photo-id="${photo.id}"]')) {
      const more = document.querySelector('[data-load-more]');
      if (!more || more.hidden) break;
      more.click();
      await new Promise(r => requestAnimationFrame(r));
    }
    const frame = document.querySelector('[data-photo-id="${photo.id}"]');
    if (!frame) return { error: 'Target frame unavailable' };
    scrollTo(0, Math.max(0, frame.getBoundingClientRect().top + scrollY - innerHeight * .35));
    await new Promise(r => setTimeout(r, 100));
    const scrollBefore = scrollY;
    frame.click();
    const deadline = performance.now() + 10000;
    while (!document.querySelector('[data-viewer-stage]').classList.contains('is-ready') && performance.now() < deadline) await new Promise(r => setTimeout(r, 40));
    const dialog = document.querySelector('[data-photo-viewer]');
    const stage = document.querySelector('[data-viewer-stage]');
    const image = document.querySelector('[data-viewer-image]');
    const d = dialog.getBoundingClientRect(); const s = stage.getBoundingClientRect(); const i = image.getBoundingClientRect();
    const renderedRatio = i.width / i.height; const naturalRatio = image.naturalWidth / image.naturalHeight;
    return {
      photoId: '${photo.id}', filename: '${photo.filename}', sourceDimensions: [${photo.width}, ${photo.height}],
      dialog: { top: d.top, bottom: d.bottom, width: d.width, height: d.height },
      stage: { top: s.top, bottom: s.bottom, left: s.left, right: s.right },
      image: { top: i.top, bottom: i.bottom, left: i.left, right: i.right, width: i.width, height: i.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, currentSrc: image.currentSrc },
      fullImageVisible: i.top >= s.top - .5 && i.bottom <= s.bottom + .5 && i.left >= s.left - .5 && i.right <= s.right + .5 && i.top >= -.5 && i.bottom <= innerHeight + .5,
      aspectRatioPreserved: Math.abs(renderedRatio - naturalRatio) < .002,
      centered: Math.abs((i.left + i.right) / 2 - innerWidth / 2) < 1 && Math.abs((i.top + i.bottom) / 2 - (s.top + s.bottom) / 2) < 1,
      viewerRoleSource: image.currentSrc.includes('/assets-derived/viewer/'),
      highDpiAdequate: image.naturalWidth >= Math.min(${photo.width}, Math.ceil(i.width * devicePixelRatio * .95)) && image.naturalHeight >= Math.min(${photo.height}, Math.ceil(i.height * devicePixelRatio * .95)),
      bodyLocked: getComputedStyle(document.body).position === 'fixed', scrollBefore
    };
  })()`);
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(`/tmp/elsewhere-phase75-${name}.png`, Buffer.from(shot.data, 'base64'));
  const restored = await evaluate(`(async () => {
    const expected = ${result.scrollBefore ?? 0};
    document.querySelector('[data-viewer-close]').click();
    await new Promise(r => setTimeout(r, 100));
    return { closed: !document.querySelector('[data-photo-viewer]').open, scrollRestored: Math.abs(scrollY - expected) < 2, bodyPosition: getComputedStyle(document.body).position };
  })()`);
  results.push({ name, width, height, ...result, ...restored });
}

const report = { candidates: Object.fromEntries(Object.entries(candidates).map(([key, photo]) => [key, { id: photo.id, filename: photo.filename, width: photo.width, height: photo.height }])), results, consoleProblems: [...new Set(consoleProblems)], networkProblems: [...new Set(networkProblems)] };
fs.writeFileSync('/tmp/elsewhere-phase75-viewer-qa.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
socket.close();
