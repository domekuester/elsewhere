interface CatalogPhoto {
  id: string; index: number; thumbnail: string; archiveImage: string; viewerImage: string; width: number; height: number;
  orientation: string | null; year: number | null; visualWorlds: string[]; destination: string | null; destinationId: string | null; destinationSlug: string | null; destinationPublished: boolean;
  featured: boolean; editorialOrder: number | null; role: string; altText: string;
}

const root = document.querySelector<HTMLElement>('[data-archive-root]');
if (root) {
  const track = (name: string, context?: string) => window.elsewhereTrack?.(name, context);
  const field = root.querySelector<HTMLElement>('[data-archive-field]')!;
  const loadMore = root.querySelector<HTMLButtonElement>('[data-load-more]')!;
  const visibleCount = root.querySelector<HTMLElement>('[data-visible-count]')!;
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
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const pageSize = 24;
  let catalog: CatalogPhoto[] = [];
  let filtered: CatalogPhoto[] = [];
  let shown = pageSize;
  let activeWorld = 'all';
  let activeIndex = 0;
  let touchStartX = 0;
  let viewerOrigin: HTMLElement | null = null;
  let viewerScrollY = 0;
  let imageRequest = 0;

  const frameMarkup = (photo: CatalogPhoto) => `
    <button class="archive-frame is-${photo.orientation ?? 'unknown'}${['hero', 'anchor'].includes(photo.role) ? ' is-selected' : ''}" type="button" data-photo-id="${photo.id}" aria-label="Open frame ${photo.index}">
      <span class="archive-image"><img src="${photo.thumbnail}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" alt="${photo.altText.replaceAll('"', '&quot;')}"></span>
      <span class="archive-label"><b>${String(photo.index).padStart(3, '0')}</b><span>${photo.year ?? 'Undated'}</span></span>
    </button>`;

  const render = () => {
    const visible = filtered.slice(0, shown);
    field.innerHTML = visible.map(frameMarkup).join('');
    visibleCount.textContent = `${visible.length} in view`;
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

  const showViewer = (index: number, origin?: HTMLElement) => {
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
    viewerCurrent.textContent = String(activeIndex + 1).padStart(2, '0');
    viewerTotal.textContent = String(filtered.length).padStart(2, '0');
    const facts = [photo.year, ...photo.visualWorlds.map((world) => world.replaceAll('-', ' ')), photo.destination].filter(Boolean);
    viewerMeta.textContent = facts.length ? facts.join(' · ') : 'Unclassified archive frame';
    viewerDestination.hidden = !photo.destinationPublished;
    if (photo.destinationPublished && photo.destinationSlug) {
      viewerDestination.href = `/destinations/${photo.destinationSlug}/`;
      viewerDestination.firstChild!.textContent = `Open ${photo.destination} `;
    }
    if (!viewer.open) {
      viewerOrigin = origin ?? null;
      viewerScrollY = window.scrollY;
      viewer.showModal();
      viewer.focus({ preventScroll: true });
      document.documentElement.dataset.viewerOpen = '';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${viewerScrollY}px`;
      document.body.style.width = '100%';
      track('viewer_open', photo.id);
      if (origin && !reduceMotion.matches) {
        const rect = origin.getBoundingClientRect();
        viewerStage.animate([
          { clipPath: `inset(${rect.top}px ${innerWidth - rect.right}px ${innerHeight - rect.bottom}px ${rect.left}px)`, transform: 'scale(.985)', opacity: .75 },
          { clipPath: 'inset(0)', transform: 'scale(1)', opacity: 1 }
        ], { duration: 420, easing: 'cubic-bezier(.16, 1, .3, 1)' });
      }
    }
  };

  fetch('/data/photo-catalog.json').then((response) => response.json()).then((data) => {
    const source: CatalogPhoto[] = data.photos;
    const selected = source.filter((photo) => photo.featured).sort((a, b) => Number(a.editorialOrder) - Number(b.editorialOrder));
    const depth = source.filter((photo) => !photo.featured);
    catalog = Array.from({ length: Math.max(selected.length, depth.length) }, (_, index) => [selected[index], depth[index]]).flat().filter(Boolean) as CatalogPhoto[];
    filtered = catalog;
    const requestedDestination = new URLSearchParams(location.search).get('destination');
    if (requestedDestination && [...destinationSelect.options].some((option) => option.value === requestedDestination)) {
      destinationSelect.value = requestedDestination;
      applyFilters();
    } else render();
  });

  field.addEventListener('click', (event) => {
    const frame = (event.target as HTMLElement).closest<HTMLElement>('[data-photo-id]');
    if (!frame) return;
    const index = filtered.findIndex((photo) => photo.id === frame.dataset.photoId);
    showViewer(index, frame.querySelector<HTMLElement>('.archive-image') ?? frame);
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
  viewer.querySelector('[data-viewer-close]')?.addEventListener('click', () => { track('viewer_close'); viewer.close(); });
  viewer.querySelector('[data-viewer-previous]')?.addEventListener('click', () => { track('viewer_previous'); showViewer(activeIndex - 1); });
  viewer.querySelector('[data-viewer-next]')?.addEventListener('click', () => { track('viewer_next'); showViewer(activeIndex + 1); });
  viewer.addEventListener('close', () => {
    delete document.documentElement.dataset.viewerOpen;
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    window.scrollTo({ top: viewerScrollY, behavior: 'instant' });
    viewerImage.removeAttribute('src');
    viewerPreview.removeAttribute('src');
    viewerStage.classList.remove('is-ready');
    viewerOrigin?.focus({ preventScroll: true });
    viewerOrigin = null;
  });
  viewer.addEventListener('click', (event) => { if (event.target === viewer) viewer.close(); });
  viewer.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showViewer(activeIndex - 1);
    if (event.key === 'ArrowRight') showViewer(activeIndex + 1);
  });
  viewer.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
  viewer.addEventListener('touchend', (event) => {
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) > 60) showViewer(activeIndex + (distance < 0 ? 1 : -1));
  }, { passive: true });
}
