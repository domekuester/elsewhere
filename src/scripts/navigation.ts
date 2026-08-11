const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-button]');
const nav = document.querySelector<HTMLElement>('[data-nav]');
const mobile = matchMedia('(max-width: 900px)');
const homeLink = document.querySelector<HTMLAnchorElement>('[data-home-link]');

// Phase 10.2 — the mobile header is `position: fixed`, so it needs a solid background once page
// content is passing beneath it, and no background at all while it is still sitting on the opening
// photograph. This watches the opening itself rather than listening to scroll: nothing runs on the
// scroll thread, and native scrolling is untouched.
const opening = document.querySelector('.hero, .destination-hero, .journey-hero, .archive-opening');
if (opening) {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const root = document.documentElement;
  root.setAttribute('data-over-opening', '');
  new IntersectionObserver(
    ([entry]) => root.toggleAttribute('data-over-opening', entry.isIntersecting),
    { rootMargin: `-${Math.round(header?.offsetHeight ?? 76)}px 0px 0px 0px` },
  ).observe(opening);
}

const syncMenuAvailability = () => {
  if (!nav) return;
  nav.inert = mobile.matches && menuButton?.getAttribute('aria-expanded') !== 'true';
};

const setMenu = (open: boolean) => {
  menuButton?.setAttribute('aria-expanded', String(open));
  nav?.toggleAttribute('data-open', open);
  document.documentElement.toggleAttribute('data-menu-open', open);
  if (nav) nav.inert = mobile.matches && !open;
  menuButton?.setAttribute('aria-label', open ? 'Close index' : 'Open index');
  if (open) window.setTimeout(() => nav?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true }), 50);
};

menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
homeLink?.addEventListener('click', (event) => {
  if (location.pathname !== '/') return;
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: 'instant' });
  if (location.hash) history.replaceState(history.state, '', `${location.pathname}${location.search}`);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuButton.focus();
  }
  if (event.key === 'Tab' && menuButton?.getAttribute('aria-expanded') === 'true' && nav) {
    const focusable = [menuButton, ...nav.querySelectorAll<HTMLAnchorElement>('a')].filter(Boolean) as HTMLElement[];
    const first = focusable[0];
    const last = focusable.at(-1)!;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

mobile.addEventListener('change', () => { if (!mobile.matches) setMenu(false); syncMenuAvailability(); });
syncMenuAvailability();
