interface CurationPhoto { id: string; index: number; filename: string; thumbnail: string; archiveImage: string; captureDate: string | null; visualWorlds: string[]; role: string; featured: boolean; peoplePresent: boolean | null; destinationId: string | null; journeyId: string | null; }
interface Assignment { destination: string | null; destinationId?: string | null; country?: string | null; countryCode?: string | null; region?: string | null; journeyId?: string | null; locationSource?: string | null; locationConfidence?: string; visualWorlds: string[]; role: string; visibility: string; publicationStatus?: string; peopleClassification?: string | null; privacyStatus?: string; publicCaption?: string | null; internalNotes?: string | null; featured: boolean; storyCandidate: boolean; peopleCandidate: boolean; printCandidate: boolean; focalX: number; focalY: number; mobileFocalX: number; mobileFocalY: number; }

const studio = document.querySelector<HTMLElement>('[data-curation-root]');
if (studio) {
  const photos: CurationPhoto[] = JSON.parse(document.querySelector('#curation-catalog')?.textContent ?? '[]');
  const baseline = JSON.parse(document.querySelector('#curation-baseline')?.textContent ?? '{}') as Record<string, Assignment>;
  const saved = JSON.parse(localStorage.getItem('elsewhere-curation-v2') ?? '{}') as Record<string, Assignment>;
  const defaults = (photo: CurationPhoto): Assignment => ({ destination: photo.destinationId, destinationId: photo.destinationId, journeyId: photo.journeyId, visualWorlds: photo.visualWorlds, role: photo.role, visibility: 'hold', publicationStatus: 'UNREVIEWED', peopleClassification: null, privacyStatus: 'UNKNOWN', publicCaption: null, internalNotes: null, featured: photo.featured, storyCandidate: false, peopleCandidate: photo.peoplePresent === true, printCandidate: false, focalX: 50, focalY: 50, mobileFocalX: 50, mobileFocalY: 50 });
  const assignmentFor = (photo: CurationPhoto): Assignment => ({ ...defaults(photo), ...(baseline[photo.id] ?? {}), ...(saved[photo.id] ?? {}) });
  const grid = studio.querySelector<HTMLElement>('[data-curation-grid]')!;
  const buttons = [...grid.querySelectorAll<HTMLButtonElement>('[data-curation-photo]')];
  const active = studio.querySelector<HTMLElement>('.curation-active')!;
  const empty = studio.querySelector<HTMLElement>('.curation-empty')!;
  const preview = studio.querySelector<HTMLImageElement>('[data-curation-preview]')!;
  const filename = studio.querySelector<HTMLElement>('[data-curation-filename]')!;
  const position = studio.querySelector<HTMLElement>('[data-curation-position]')!;
  const worldInputs = [...studio.querySelectorAll<HTMLInputElement>('[data-edit-world]')];
  const destination = studio.querySelector<HTMLSelectElement>('[data-edit-destination]')!;
  const role = studio.querySelector<HTMLSelectElement>('[data-edit-role]')!;
  const visibility = studio.querySelector<HTMLSelectElement>('[data-edit-visibility]')!;
  const publication = studio.querySelector<HTMLSelectElement>('[data-edit-publication]')!;
  const peopleClass = studio.querySelector<HTMLSelectElement>('[data-edit-people-class]')!;
  const privacy = studio.querySelector<HTMLSelectElement>('[data-edit-privacy]')!;
  const caption = studio.querySelector<HTMLTextAreaElement>('[data-edit-caption]')!;
  const notes = studio.querySelector<HTMLTextAreaElement>('[data-edit-notes]')!;
  const featured = studio.querySelector<HTMLInputElement>('[data-edit-featured]')!;
  const story = studio.querySelector<HTMLInputElement>('[data-edit-story]')!;
  const people = studio.querySelector<HTMLInputElement>('[data-edit-people]')!;
  const print = studio.querySelector<HTMLInputElement>('[data-edit-print]')!;
  const batchPanel = studio.querySelector<HTMLElement>('[data-curation-batch]')!;
  const batchToggle = studio.querySelector<HTMLButtonElement>('[data-batch-toggle]')!;
  const batchCount = studio.querySelector<HTMLElement>('[data-batch-count]')!;
  const batchDestination = studio.querySelector<HTMLSelectElement>('[data-batch-destination]')!;
  const selected = new Set<string>();
  const ownerAnswers = JSON.parse(localStorage.getItem('elsewhere-owner-answers-v1') ?? '{}') as Record<string, { answer: string; status: string }>;
  let batchMode = false;
  let current = -1;
  let lastSelectedIndex = -1;

  const persist = () => localStorage.setItem('elsewhere-curation-v2', JSON.stringify(saved));
  const inferredJourney = (destinationId: string, captureDate: string | null) => {
    if (!captureDate) return null;
    const day = captureDate.slice(0, 10);
    const options: Record<string, Array<[string, string, string]>> = {
      malaysia: [['2024-08-20','2024-10-09','malaysia-2024'],['2025-04-15','2025-05-11','malaysia-2025-part-1'],['2025-07-14','2025-07-14','malaysia-2025-part-2']],
      thailand: [['2024-10-11','2024-12-02','thailand-2024'],['2025-01-16','2025-03-11','thailand-2025-part-1'],['2025-06-28','2025-07-12','thailand-2025-part-2']],
      laos: [['2024-12-06','2025-01-13','laos-2024-2025']],
      'phu-quoc': [['2025-03-15','2025-04-13','vietnam-phu-quoc-2025']], japan: [['2025-05-13','2025-06-26','japan-2025']], 'la-reunion': [['2025-07-16','2025-08-31','la-reunion-2025']]
    };
    return options[destinationId]?.find(([start, end]) => day >= start && day <= end)?.[2] ?? null;
  };
  const update = () => {
    if (current < 0) return;
    const photo = photos[current];
    const currentAssignment = assignmentFor(photo);
    saved[photo.id] = { ...currentAssignment, destination: destination.value || null, destinationId: destination.value || null, journeyId: destination.value ? (currentAssignment.journeyId ?? inferredJourney(destination.value, photo.captureDate)) : null, visualWorlds: worldInputs.filter((input) => input.checked).map((input) => input.value), role: role.value, visibility: visibility.value, publicationStatus: publication.value, peopleClassification: peopleClass.value || null, privacyStatus: privacy.value, publicCaption: caption.value.trim() || null, internalNotes: notes.value.trim() || null, featured: featured.checked, storyCandidate: story.checked, peopleCandidate: people.checked, printCandidate: print.checked };
    persist();
    const button = buttons.find((item) => item.dataset.curationPhoto === photo.id);
    button?.classList.toggle('is-assigned', saved[photo.id].visualWorlds.length > 0 || Boolean(saved[photo.id].destinationId));
  };
  const open = (index: number) => {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    const assignment = assignmentFor(photo);
    empty.hidden = true; active.hidden = false;
    preview.src = photo.archiveImage; filename.textContent = photo.filename; position.textContent = `${photo.index} / ${photos.length} · ${photo.captureDate?.slice(0, 10) ?? 'date unknown'}`;
    worldInputs.forEach((input) => { input.checked = assignment.visualWorlds.includes(input.value); });
    destination.value = assignment.destinationId ?? assignment.destination ?? ''; role.value = assignment.role; visibility.value = assignment.visibility;
    publication.value = assignment.publicationStatus ?? 'UNREVIEWED'; peopleClass.value = assignment.peopleClassification ?? ''; privacy.value = assignment.privacyStatus ?? 'UNKNOWN'; caption.value = assignment.publicCaption ?? ''; notes.value = assignment.internalNotes ?? '';
    featured.checked = assignment.featured; story.checked = assignment.storyCandidate; people.checked = assignment.peopleCandidate; print.checked = assignment.printCandidate;
    buttons.forEach((button) => button.classList.toggle('is-current', button.dataset.curationPhoto === photo.id));
  };
  const updateBatchState = () => {
    batchCount.textContent = String(selected.size);
    buttons.forEach((button) => button.classList.toggle('is-batch-selected', selected.has(button.dataset.curationPhoto ?? '')));
  };
  grid.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-curation-photo]'); if (!button) return;
    const index = photos.findIndex((photo) => photo.id === button.dataset.curationPhoto);
    if (batchMode) {
      if ((event as MouseEvent).shiftKey && lastSelectedIndex >= 0) for (let i = Math.min(index, lastSelectedIndex); i <= Math.max(index, lastSelectedIndex); i++) selected.add(photos[i].id);
      else if (selected.has(photos[index].id)) selected.delete(photos[index].id); else selected.add(photos[index].id);
      lastSelectedIndex = index; updateBatchState();
    } else open(index);
  });
  [...worldInputs, destination, role, visibility, publication, peopleClass, privacy, featured, story, people, print].forEach((control) => control.addEventListener('change', update));
  [caption, notes].forEach((control) => control.addEventListener('change', update));
  studio.querySelector('[data-curation-previous]')?.addEventListener('click', () => { update(); open(current - 1); });
  studio.querySelector('[data-curation-next]')?.addEventListener('click', () => { update(); open(current + 1); });
  const applyFilters = () => {
    const review = (studio.querySelector('[data-curation-filter]') as HTMLSelectElement).value;
    const world = (studio.querySelector('[data-curation-world]') as HTMLSelectElement).value;
    const destinationFilter = (studio.querySelector('[data-curation-destination-filter]') as HTMLSelectElement).value;
    const journeyFilter = (studio.querySelector('[data-curation-journey-filter]') as HTMLSelectElement).value;
    const search = (studio.querySelector('[data-curation-search]') as HTMLInputElement).value.trim().toLowerCase();
    let visible = 0;
    buttons.forEach((button, index) => {
      const assignment = assignmentFor(photos[index]);
      const assigned = assignment.visualWorlds.length > 0 || Boolean(assignment.destinationId);
      const match = (review === 'all' || (review === 'unassigned' ? !assigned : assigned)) && (world === 'all' || assignment.visualWorlds.includes(world)) && (destinationFilter === 'all' || (destinationFilter === 'unassigned' ? !assignment.destinationId : assignment.destinationId === destinationFilter)) && (journeyFilter === 'all' || assignment.journeyId === journeyFilter) && (!search || photos[index].filename.toLowerCase().includes(search));
      button.hidden = !match; if (match) visible += 1;
    });
    studio.querySelector<HTMLElement>('[data-curation-visible]')!.textContent = String(visible);
  };
  studio.querySelectorAll('.curation-tools select').forEach((select) => select.addEventListener('change', applyFilters));
  studio.querySelector('[data-curation-search]')?.addEventListener('input', applyFilters);
  batchToggle.addEventListener('click', () => { batchMode = !batchMode; batchToggle.setAttribute('aria-pressed', String(batchMode)); batchToggle.textContent = batchMode ? 'Selecting…' : 'Batch select'; batchPanel.hidden = !batchMode; if (!batchMode) { selected.clear(); updateBatchState(); } });
  studio.querySelector('[data-batch-clear]')?.addEventListener('click', () => { selected.clear(); updateBatchState(); });
  studio.querySelector('[data-batch-apply]')?.addEventListener('click', () => {
    const destinationId = batchDestination.value; if (!destinationId || !selected.size) return;
    for (const photo of photos.filter((item) => selected.has(item.id))) {
      const assignment = assignmentFor(photo);
      saved[photo.id] = destinationId === 'unknown' ? { ...assignment, destination: null, destinationId: null, journeyId: null, locationConfidence: 'UNKNOWN', locationSource: 'CURATION_STUDIO' } : { ...assignment, destination: destinationId, destinationId, journeyId: inferredJourney(destinationId, photo.captureDate), locationConfidence: 'CONFIRMED_OWNER', locationSource: 'CURATION_STUDIO' };
    }
    persist(); selected.clear(); updateBatchState(); applyFilters();
  });
  studio.querySelectorAll<HTMLElement>('[data-filter-journey]').forEach((button) => button.addEventListener('click', () => { const select = studio.querySelector('[data-curation-journey-filter]') as HTMLSelectElement; select.value = button.dataset.filterJourney ?? 'all'; applyFilters(); document.querySelector('#photos')?.scrollIntoView({ behavior: 'smooth' }); }));
  studio.querySelectorAll<HTMLElement>('[data-open-photo]').forEach((button) => button.addEventListener('click', () => { const index = photos.findIndex((photo) => photo.id === button.dataset.openPhoto); if (index >= 0) { open(index); document.querySelector('#photos')?.scrollIntoView({ behavior: 'smooth' }); } }));
  studio.querySelector('[data-export-curation]')?.addEventListener('click', () => {
    update();
    const complete = Object.fromEntries(photos.map((photo) => [photo.id, assignmentFor(photo)]));
    const blob = new Blob([JSON.stringify({ schemaVersion: 2, updatedAt: new Date().toISOString(), metadataSources: ['EXISTING_MANIFEST','OWNER_TRAVEL_TIMELINE','CURATION_STUDIO'], assignments: complete }, null, 2)], { type: 'application/json' });
    const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'photo-curation.json' }); link.click(); URL.revokeObjectURL(link.href);
  });
  studio.querySelectorAll<HTMLElement>('[data-question-id]').forEach((item) => {
    const id = item.dataset.questionId!;
    const answer = item.querySelector<HTMLTextAreaElement>('[data-question-answer]')!;
    const status = item.querySelector<HTMLSelectElement>('[data-question-status]')!;
    answer.value = ownerAnswers[id]?.answer ?? ''; status.value = ownerAnswers[id]?.status ?? 'OPEN';
    const save = () => { ownerAnswers[id] = { answer: answer.value.trim(), status: status.value }; localStorage.setItem('elsewhere-owner-answers-v1', JSON.stringify(ownerAnswers)); };
    answer.addEventListener('change', save); status.addEventListener('change', save);
  });
  studio.querySelector('[data-export-answers]')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ schemaVersion: 1, updatedAt: new Date().toISOString(), answers: ownerAnswers }, null, 2)], { type: 'application/json' });
    const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'owner-answers.json' }); link.click(); URL.revokeObjectURL(link.href);
  });
  document.addEventListener('keydown', (event) => {
    if ((event.target as HTMLElement).matches('select, input, textarea')) return;
    if (!batchMode && event.key === 'ArrowRight') open(current + 1); if (!batchMode && event.key === 'ArrowLeft') open(current - 1);
    const world = ['1','2','3','4','5','6'].indexOf(event.key); if (world >= 0 && current >= 0) { worldInputs[world].checked = !worldInputs[world].checked; update(); }
    if (event.key.toLowerCase() === 'h') { role.value = 'hero'; update(); }
    if (event.key.toLowerCase() === 'e') { role.value = 'editorial'; update(); }
    if (event.key.toLowerCase() === 'a') { role.value = 'archive'; update(); }
  });
}
