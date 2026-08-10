// Privacy-conscious by construction: the page emits named events on an internal bus and
// nothing leaves the browser unless the owner has configured a provider. No cookies are set,
// no identifiers are generated, and no user-entered content is ever included in an event.
// Event context is always a route, a slug, or a public archive reference.

type ElsewhereEvent = {
  name: string;
  path: string;
  context?: string;
};

declare global {
  interface Window {
    elsewhereTrack?: (name: string, context?: string) => void;
    plausible?: (name: string, options?: { props?: Record<string, string> }) => void;
    umami?: { track: (name: string, data?: Record<string, string>) => void };
  }
}

window.elsewhereTrack = (name, context) => {
  const detail: ElsewhereEvent = { name, path: location.pathname, ...(context ? { context } : {}) };
  document.dispatchEvent(new CustomEvent<ElsewhereEvent>('elsewhere:analytics', { detail }));
};

document.addEventListener('click', (event) => {
  const link = (event.target as HTMLElement).closest<HTMLElement>('[data-analytics-event]');
  if (!link) return;
  window.elsewhereTrack?.(link.dataset.analyticsEvent ?? 'link_open', link.dataset.analyticsContext);
});

// Outbound links are business signals: which partner, publication, or profile pulled a visitor away.
document.addEventListener('click', (event) => {
  const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="http"]');
  if (!anchor || anchor.dataset.analyticsEvent) return;
  const destination = new URL(anchor.href);
  if (destination.host === location.host) return;
  const name = anchor.dataset.affiliate === 'true' ? 'affiliate_click' : 'outbound_click';
  window.elsewhereTrack?.(name, destination.host);
});

// Provider bridge. Absent configuration this subscriber never runs and the bus stays local.
const provider = import.meta.env.PUBLIC_ANALYTICS_PROVIDER;
if (provider === 'plausible' || provider === 'umami') {
  document.addEventListener('elsewhere:analytics', (event) => {
    const { name, context } = (event as CustomEvent<ElsewhereEvent>).detail;
    const properties = context ? { context } : undefined;
    if (provider === 'plausible') window.plausible?.(name, properties ? { props: properties } : undefined);
    else window.umami?.track(name, properties);
  });
}

export {};
