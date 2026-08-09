const menuButton = document.querySelector<HTMLButtonElement>('[data-menu-button]');
const nav = document.querySelector<HTMLElement>('[data-nav]');
const mobile = matchMedia('(max-width: 900px)');

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
