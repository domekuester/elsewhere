const loadMotion = () => import('./motion');

if ('requestIdleCallback' in window) {
  window.requestIdleCallback(loadMotion, { timeout: 900 });
} else {
  window.setTimeout(loadMotion, 250);
}
