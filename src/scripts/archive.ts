import { withBase } from '../config/paths';
import { licensingEnquiryPath } from '../data/licensing';

interface CatalogPhoto {
  id: string; index: number; thumbnail: string; archiveImage: string; viewerImage: string; width: number; height: number;
  orientation: string | null; year: number | null; visualWorlds: string[]; destination: string | null; destinationId: string | null; destinationSlug: string | null; destinationPublished: boolean;
  featured: boolean; editorialOrder: number | null; role: string; altText: string; accessibleLabel: string; caption: string | null;
  /** Public-safe rights projection. 'unavailable' means never offer an enquiry for this frame. */
  licensing: 'enquiry' | 'editorial' | 'commercial' | 'unavailable';
}

const root = document.querySelector<HTMLElement>('[data-archive-root]');
if (root) {
  const track = (name: string, context?: string) => window.elsewhereTrack?.(name, context);
  const field = root.querySelector<HTMLElement>('[data-archive-field]')!;
  const loadMore = root.querySelector<HTMLButtonElement>('[data-load-more]')!;
  const visibleCount = root.querySelector<HTMLElement>('[data-visible-count]')!;
  const totalCount = root.querySelector<HTMLElement>('[data-total-count]')!;
  const progressEnd = root.querySelector<HTMLElement>('[data-progress-end]')!;
  const progressTotal = root.querySelector<HTMLElement>('[data-progress-total]')!;
  const yearSelect = root.querySelector<HTMLSelectElement>('[data-filter-year]')!;
  const orientationSelect = root.querySelector<HTMLSelectElement>('[data-filter-orientation]')!;
  const destinationSelect = root.querySelector<HTMLSelectElement>('[data-filter-destination]')!;
  const worldButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-filter-world]')];
  const viewer = document.querySelector<HTMLDialogElement>('[data-photo-viewer]')!;
  const viewerStage = viewer.querySelector<HTMLElement>('[data-viewer-stage]')!;
  const viewerPreview = viewer.querySelector<HTMLImageElement>('[data-viewer-preview]')!;
  const viewerImage = viewer.querySelector<HTMLImageElement>('[data-viewer-image]')!;
  const viewerCurrent = viewer.querySelector<HTMLElement>('[data-viewer-current]')!;
  const viewerTotal = viewer.querySelector<HTMLElement>('[data-viewer-total]')!;
  const viewerMeta = viewer.querySelector<HTMLElement>('[data-viewer-meta]')!;
  const viewerDestination = viewer.querySelector<HTMLAnchorElement>('[data-viewer-destination]')!;
  const viewerLicensing = viewer.querySelector<HTMLAnchorElement>('[data-viewer-licensing]');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pageSize = 24;
  let catalog: CatalogPhoto[] = [];
  let filtered: CatalogPhoto[] = [];
  let shown = pageSize;
  let activeWorld = root.dataset.initialWorld ?? 'all';
  // A /archive/place/<slug>/ page is served already filtered to that place; the control has to agree
  // with what the page is showing, or the first interaction would silently widen the view.
  const initialDestination = root.dataset.initialDestination ?? null;
  // Which archive surface a licensing enquiry started on. The three routes that mount this viewer
  // — /archive/, /archive/black-and-white/ and /archive/place/<slug>/ — are answering different
  // questions, and an enquiry is worth more when the owner knows which one produced it.
  const funnelSection = initialDestination ? `place-${initialDestination}`
    : root.dataset.initialWorld === 'black-and-white' ? 'black-and-white' : 'archive';
  let activeIndex = 0;
  let touchStartX = 0;
  let viewerFocusOrigin: HTMLElement | null = null;
  let viewerScrollY = 0;
  let imageRequest = 0;
  let idleTimer = 0;
  let closeTimer = 0;

  const derivativeWidth = (photo: CatalogPhoto, longEdge: number) => Math.min(photo.width, photo.orientation === 'portrait' ? Math.round(longEdge * photo.width / photo.height) : longEdge);
  const archiveSizes = (photo: CatalogPhoto) => ['hero', 'anchor'].includes(photo.role) ? '(min-width: 901px) 42vw, (min-width: 561px) 58vw, 100vw' : photo.orientation === 'landscape' ? '(min-width: 901px) 34vw, (min-width: 561px) 50vw, 100vw' : '(min-width: 901px) 25vw, (min-width: 561px) 50vw, 44vw';

  const frameMarkup = (photo: CatalogPhoto) => `
    <button class="archive-frame is-${photo.orientation ?? 'unknown'}${['hero', 'anchor'].includes(photo.role) ? ' is-selected' : ''}" type="button" data-photo-id="${photo.id}" aria-label="${photo.accessibleLabel.replaceAll('"', '&quot;')}">
      <span class="archive-image"><img src="${photo.thumbnail}" srcset="${photo.thumbnail} ${derivativeWidth(photo, 960)}w, ${photo.archiveImage} ${derivativeWidth(photo, 1800)}w" sizes="${archiveSizes(photo)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" alt="${photo.altText.replaceAll('"', '&quot;')}"></span>
      <span class="archive-label" aria-hidden="true"><b>${String(photo.index).padStart(3, '0')}</b><span>${photo.year ?? 'Undated'}</span></span>
    </button>`;

  const preloadAdjacent = () => {
    if (filtered.length < 2) return;
    [-1, 1].forEach((offset) => {
      const adjacent = filtered[(activeIndex + offset + filtered.length) % filtered.length];
      if (adjacent) new Image().src = adjacent.viewerImage;
    });
  };

  const wakeViewer = () => {
    viewer.classList.remove('is-idle');
    window.clearTimeout(idleTimer);
    if (viewer.open && !matchMedia('(pointer: coarse)').matches) {
      idleTimer = window.setTimeout(() => viewer.classList.add('is-idle'), 2600);
    }
  };

  const render = () => {
    const visible = filtered.slice(0, shown);
    field.innerHTML = visible.map(frameMarkup).join('');
    visibleCount.textContent = `${visible.length} in view`;
    // The masthead count and the progress row must never disagree: a filtered archive that still
    // claims the full total is telling the visitor something untrue about what they are looking at.
    totalCount.textContent = String(filtered.length);
    progressEnd.textContent = String(visible.length).padStart(3, '0');
    progressTotal.textContent = String(filtered.length).padStart(3, '0');
    loadMore.hidden = visible.length >= filtered.length;
  };

  const applyFilters = () => {
    const year = yearSelect.value;
    const orientation = orientationSelect.value;
    const destination = destinationSelect.value;
    filtered = catalog.filter((photo) =>
      (activeWorld === 'all' || photo.visualWorlds.includes(activeWorld)) &&
      (year === 'all' || String(photo.year) === year) &&
      (orientation === 'all' || photo.orientation === orientation)
      && (destination === 'all' || photo.destinationId === destination)
    );
    shown = pageSize;
    render();
  };

  const showViewer = (index: number, focusOrigin?: HTMLElement, geometryOrigin?: HTMLElement) => {
    activeIndex = (index + filtered.length) % filtered.length;
    const photo = filtered[activeIndex];
    if (!photo) return;
    const request = ++imageRequest;
    viewerStage.classList.remove('is-ready');
    viewerStage.setAttribute('aria-busy', 'true');
    viewerPreview.src = photo.thumbnail;
    viewerPreview.width = photo.width;
    viewerPreview.height = photo.height;
    viewerImage.removeAttribute('src');
    viewerImage.width = photo.width;
    viewerImage.height = photo.height;
    viewerImage.alt = photo.altText;
    viewerImage.src = photo.viewerImage;
    const revealFullImage = () => {
      if (request !== imageRequest) return;
      viewerStage.classList.add('is-ready');
      viewerStage.setAttribute('aria-busy', 'false');
    };
    if (viewerImage.complete) viewerImage.decode().then(revealFullImage).catch(revealFullImage);
    else {
      viewerImage.addEventListener('load', () => viewerImage.decode().then(revealFullImage).catch(revealFullImage), { once: true });
      viewerImage.addEventListener('error', revealFullImage, { once: true });
    }
    viewerCurrent.textContent = String(activeIndex + 1).padStart(3, '0');
    viewerTotal.textContent = String(filtered.length).padStart(3, '0');
    const facts = [photo.caption, photo.destination, photo.year].filter(Boolean);
    viewerMeta.textContent = facts.join(' · ');
    viewerMeta.closest<HTMLElement>('.viewer-caption')!.classList.toggle('has-no-meta', facts.length === 0 && !photo.destinationPublished);
    viewerDestination.hidden = !photo.destinationPublished;
    if (photo.destinationPublished && photo.destinationSlug) {
      viewerDestination.href = withBase(`/destinations/${photo.destinationSlug}/`);
      viewerDestination.firstChild!.textContent = `Open ${photo.destination} `;
    }
    if (viewerLicensing) {
      // A licensing enquiry must name the exact photograph, so the frame's canonical public id
      // travels with it and is resolved back through the published catalog on arrival. `from`
      // records which archive surface the enquiry started on; it is a label, never a URL.
      // `#enquiry` lands on the form rather than on the top of the licensing page.
      viewerLicensing.hidden = photo.licensing === 'unavailable';
      viewerLicensing.href = withBase(licensingEnquiryPath(photo.id, { from: funnelSection, anchor: true }));
      viewerLicensing.dataset.analyticsContext = photo.id;
    }
    if (!viewer.open) {
      viewerFocusOrigin = focusOrigin ?? null;
      viewerScrollY = window.scrollY;
      viewer.showModal();
      viewer.focus({ preventScroll: true });
      document.documentElement.dataset.viewerOpen = '';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${viewerScrollY}px`;
      document.body.style.width = '100%';
      track('viewer_open', photo.id);
      if (geometryOrigin && !reduceMotion.matches) {
        const rect = geometryOrigin.getBoundingClientRect();
        viewerStage.animate([
          { clipPath: `inset(${rect.top}px ${innerWidth - rect.right}px ${innerHeight - rect.bottom}px ${rect.left}px)`, transform: 'scale(.985)', opacity: .75 },
          { clipPath: 'inset(0)', transform: 'scale(1)', opacity: 1 }
        ], { duration: 420, easing: 'cubic-bezier(.16, 1, .3, 1)' });
      }
    }
    preloadAdjacent();
    wakeViewer();
  };

  // The catalog is served as a static file and stores site-relative derivative paths, so the
  // deployment base is applied once here rather than at each of the three URLs' render sites.
  fetch(withBase('/data/photo-catalog.json')).then((response) => response.json()).then((data) => {
    const source: CatalogPhoto[] = (data.photos as CatalogPhoto[]).map((photo) => ({
      ...photo,
      thumbnail: withBase(photo.thumbnail),
      archiveImage: withBase(photo.archiveImage),
      viewerImage: withBase(photo.viewerImage),
    }));
    const selected = source.filter((photo) => photo.featured).sort((a, b) => Number(a.editorialOrder) - Number(b.editorialOrder));
    const depth = source.filter((photo) => !photo.featured);
    catalog = Array.from({ length: Math.max(selected.length, depth.length) }, (_, index) => [selected[index], depth[index]]).flat().filter(Boolean) as CatalogPhoto[];
    filtered = activeWorld === 'all' ? catalog : catalog.filter((photo) => photo.visualWorlds.includes(activeWorld));
    // Home's world cards and the destination index both arrive here with an intent in the URL.
    // Whatever is requested must also be visible in the controls, or the page would filter itself
    // without ever telling the visitor why.
    const params = new URLSearchParams(location.search);
    let requested = false;
    const requestedWorld = params.get('world');
    const worldButton = requestedWorld && worldButtons.find((button) => button.dataset.filterWorld === requestedWorld);
    if (worldButton) {
      activeWorld = requestedWorld!;
      worldButtons.forEach((item) => { item.classList.toggle('is-active', item === worldButton); item.setAttribute('aria-pressed', String(item === worldButton)); });
      requested = true;
    }
    if (initialDestination && [...destinationSelect.options].some((option) => option.value === initialDestination)) {
      destinationSelect.value = initialDestination;
      requested = true;
    }
    const requestedDestination = params.get('destination');
    if (requestedDestination && [...destinationSelect.options].some((option) => option.value === requestedDestination)) {
      destinationSelect.value = requestedDestination;
      requested = true;
    }
    if (requested) applyFilters();
    else render();
  });

  field.addEventListener('click', (event) => {
    const frame = (event.target as HTMLElement).closest<HTMLElement>('[data-photo-id]');
    if (!frame) return;
    const index = filtered.findIndex((photo) => photo.id === frame.dataset.photoId);
    showViewer(index, frame, frame.querySelector<HTMLElement>('.archive-image') ?? frame);
  });
  loadMore.addEventListener('click', () => { shown += pageSize; render(); track('archive_more', String(shown)); });
  worldButtons.forEach((button) => button.addEventListener('click', () => {
    activeWorld = button.dataset.filterWorld ?? 'all';
    worldButtons.forEach((item) => { item.classList.toggle('is-active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    applyFilters();
  }));
  yearSelect.addEventListener('change', applyFilters);
  orientationSelect.addEventListener('change', applyFilters);
  destinationSelect.addEventListener('change', applyFilters);
  root.querySelector('[data-random-frame]')?.addEventListener('click', () => showViewer(Math.floor(Math.random() * filtered.length)));
  const closeViewer = () => {
    if (!viewer.open || viewer.classList.contains('is-closing')) return;
    track('viewer_close');
    window.clearTimeout(idleTimer);
    viewer.classList.remove('is-idle');
    if (reduceMotion.matches) viewer.close();
    else {
      viewer.classList.add('is-closing');
      closeTimer = window.setTimeout(() => viewer.close(), 160);
    }
  };
  viewer.querySelector('[data-viewer-close]')?.addEventListener('click', closeViewer);
  viewer.querySelector('[data-viewer-previous]')?.addEventListener('click', () => { track('viewer_previous'); showViewer(activeIndex - 1); });
  viewer.querySelector('[data-viewer-next]')?.addEventListener('click', () => { track('viewer_next'); showViewer(activeIndex + 1); });
  viewer.addEventListener('close', () => {
    window.clearTimeout(closeTimer);
    window.clearTimeout(idleTimer);
    viewer.classList.remove('is-closing', 'is-idle');
    delete document.documentElement.dataset.viewerOpen;
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo({ top: viewerScrollY, behavior: 'instant' });
    viewerImage.removeAttribute('src');
    viewerPreview.removeAttribute('src');
    viewerStage.classList.remove('is-ready');
    viewerFocusOrigin?.focus({ preventScroll: true });
    viewerFocusOrigin = null;
  });
  viewer.addEventListener('cancel', (event) => { event.preventDefault(); closeViewer(); });
  viewer.addEventListener('click', (event) => { wakeViewer(); if (event.target === viewer) closeViewer(); });
  viewer.addEventListener('pointermove', wakeViewer, { passive: true });
  viewer.addEventListener('keydown', (event) => {
    wakeViewer();
    if (event.key === 'Escape') { event.preventDefault(); closeViewer(); }
    if (event.key === 'ArrowLeft') showViewer(activeIndex - 1);
    if (event.key === 'ArrowRight') showViewer(activeIndex + 1);
  });
  viewer.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  viewer.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) > 60) showViewer(activeIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
}
