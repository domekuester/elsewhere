type ElsewhereEvent = {
  name: string;
  path: string;
  context?: string;
};

declare global {
  interface Window {
    elsewhereTrack?: (name: string, context?: string) => void;
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

export {};
