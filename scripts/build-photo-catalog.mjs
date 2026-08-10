import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'docs/photo-inventory.json'), 'utf8'));
const existingCurationPath = path.join(root, 'data/photo-curation.json');
const existingCuration = fs.existsSync(existingCurationPath) ? JSON.parse(fs.readFileSync(existingCurationPath, 'utf8')) : { assignments: {} };
const destinationPath = path.join(root, 'data/destinations.json');
const destinationData = fs.existsSync(destinationPath) ? JSON.parse(fs.readFileSync(destinationPath, 'utf8')) : { destinations: [] };
const destinations = new Map(destinationData.destinations.map((destination) => [destination.id, destination]));
const exclusionsPath = path.join(root, 'data/public-image-exclusions.json');
const exclusions = fs.existsSync(exclusionsPath) ? JSON.parse(fs.readFileSync(exclusionsPath, 'utf8')) : { ownerRejected: [], duplicateFamilies: [] };
const publicExclusions = new Set([
  ...exclusions.ownerRejected.map((item) => item.photoId),
  ...exclusions.duplicateFamilies.flatMap((family) => family.excludeIds)
]);
const ownerRejectedFilenames = new Set(exclusions.ownerRejected.map((item) => item.filename.toLowerCase()));
// Mirrors PUBLIC_LICENSING in src/data/rights.ts. Publication permission and licensing
// permission are separate: only an owner-confirmed state may describe real availability,
// and an unassessed photograph may be asked about without anything being offered.
const publicLicensing = {
  ENQUIRY_ONLY: 'enquiry',
  EDITORIAL_AVAILABLE: 'editorial',
  RELEASE_REQUIRED: 'enquiry',
  COMMERCIAL_CLEARED: 'commercial',
  NOT_FOR_LICENSE: 'unavailable'
};
const selectionSource = fs.readFileSync(path.join(root, 'src/data/editorial-selection.ts'), 'utf8');
const curated = new Map();
const confirmedAltByFilename = new Map([
  ['p1260122.jpg', 'A breakwater lighthouse beneath a long grey sky.']
]);
let editorialOrder = 0;
for (const match of selectionSource.matchAll(/\{ filename: '([^']+)', derivative: '([^']+)', role: '([^']+)', world: '([^']+)'[^}]+monochrome: (true|false), peoplePresent: (true|false)/g)) {
  curated.set(match[1].toLowerCase(), { derivative: match[2], role: match[3], worlds: [match[4]], colorMode: match[5] === 'true' ? 'black-and-white' : 'color', peoplePresent: match[6] === 'true', editorialOrder: ++editorialOrder });
}

// Owner rejections are authoritative: an editorial selection may never reintroduce one.
const reselected = [...curated.keys()].filter((filename) => ownerRejectedFilenames.has(filename));
if (reselected.length) throw new Error(`Owner-rejected photographs present in editorial selection: ${reselected.join(', ')}`);

const publicThumbDir = path.join(root, 'public/assets-derived/thumbnails');
fs.mkdirSync(publicThumbDir, { recursive: true });
const allowedDerivativeNames = new Set();

const catalog = inventory.photos.map((photo, index) => {
  const thumbName = `${String(index + 1).padStart(4, '0')}-${path.parse(photo.filename).name}.jpg`;
  const targetThumb = path.join(publicThumbDir, thumbName);
  const manual = curated.get(photo.filename.toLowerCase());
  const assignment = existingCuration.assignments?.[photo.id] ?? {};
  const reviewedMonochrome = photo.editorial?.categories?.includes('black-and-white-candidate')
    && photo.editorial?.notes?.includes('visually reviewed in Phase 7');
  const assignedMonochrome = assignment.visualWorlds?.includes('black-and-white');
  // `editorial-hold` is an agent-proposed withholding awaiting owner confirmation, recorded in
  // data/public-image-exclusions.json under `editorialHold`. It is deliberately a separate state
  // from `do-not-publish`, which only the owner sets, so that reversing one never touches the other.
  const publicAllowed = !publicExclusions.has(photo.id) && !['private', 'do-not-publish', 'editorial-hold'].includes(assignment.visibility ?? 'hold');
  const archiveName = `${String(index + 1).padStart(4, '0')}-${path.parse(photo.filename).name}.jpg`;
  const targetArchive = path.join(root, 'public/assets-derived/archive', archiveName);
  const targetViewer = path.join(root, 'public/assets-derived/viewer', archiveName);
  if (publicAllowed) allowedDerivativeNames.add(archiveName);
  if (!publicAllowed) {
    if (fs.existsSync(targetThumb)) fs.unlinkSync(targetThumb);
    if (fs.existsSync(targetArchive)) fs.unlinkSync(targetArchive);
    if (fs.existsSync(targetViewer)) fs.unlinkSync(targetViewer);
  }
  const destination = destinations.get(assignment.destinationId ?? assignment.destination);
  // Worlds from the three sources are merged, never substituted. A curation assignment that adds
  // 'people' to a Phase 7 monochrome frame must not silently evict it from the monochrome archive.
  const visualWorlds = [...new Set([
    ...(assignment.visualWorlds ?? []),
    ...(manual?.worlds ?? []),
    ...(reviewedMonochrome ? ['black-and-white'] : []),
  ])];
  const year = photo.capture?.date ? Number(photo.capture.date.slice(0, 4)) : null;
  const reviewedAlt = (typeof assignment.altText === 'string' ? assignment.altText.trim() : '') || confirmedAltByFilename.get(photo.filename.toLowerCase()) || '';
  const temporaryFacts = [destination?.name, photo.orientation, Number.isFinite(year) ? String(year) : null].filter(Boolean);
  const altText = reviewedAlt || (manual ? `A selected ${manual.worlds[0].replaceAll('-', ' ')} photograph from the Elsewhere archive.` : '');
  return {
    id: photo.id,
    index: index + 1,
    filename: photo.filename,
    // Percent-encoded because some masters carry a space in their filename, and a raw space in a
    // srcset candidate is a parse error: the browser silently drops the high-resolution entries and
    // renders those frames at thumbnail size on every surface. Disk names are untouched.
    thumbnail: `/assets-derived/thumbnails/${encodeURIComponent(thumbName)}`,
    archiveImage: `/assets-derived/archive/${encodeURIComponent(archiveName)}`,
    viewerImage: `/assets-derived/viewer/${encodeURIComponent(archiveName)}`,
    width: photo.dimensions?.width ?? null,
    height: photo.dimensions?.height ?? null,
    aspectRatio: photo.aspectRatio ?? null,
    orientation: photo.orientation ?? null,
    captureDate: photo.capture?.date ?? null,
    year: Number.isFinite(year) ? year : null,
    camera: photo.capture?.cameraModel ?? null,
    lens: photo.capture?.lens === 'N/A' ? null : (photo.capture?.lens ?? null),
    colorMode: manual?.colorMode ?? ((reviewedMonochrome || assignedMonochrome) ? 'black-and-white' : null),
    dominantColor: photo.editorial?.dominantColors?.[0] ?? null,
    visualWorlds,
    peoplePresent: manual?.peoplePresent ?? (assignment.peopleCandidate ? true : null),
    destination: destination?.name ?? null,
    destinationId: destination?.id ?? null,
    destinationSlug: destination?.slug ?? null,
    destinationPublished: destination?.publicationStatus === 'published',
    country: assignment.country ?? destination?.country ?? null,
    countryCode: assignment.countryCode ?? destination?.countryCode ?? null,
    region: assignment.region ?? destination?.region ?? null,
    place: null,
    journeyId: assignment.journeyId ?? null,
    locationSource: assignment.locationSource ?? null,
    locationConfidence: assignment.locationConfidence ?? null,
    role: manual?.role ?? 'archive',
    featured: Boolean(manual),
    editorialOrder: manual?.editorialOrder ?? null,
    public: publicAllowed,
    altText,
    altReviewStatus: reviewedAlt ? 'owner-reviewed' : (manual ? 'editorial-candidate' : 'needs-review'),
    accessibleLabel: `Open frame ${String(index + 1).padStart(3, '0')}${reviewedAlt ? `: ${reviewedAlt}` : (temporaryFacts.length ? ` · ${temporaryFacts.join(' · ')}` : '')}`,
    caption: assignment.publicCaption ?? null,
    // Public-safe rights projection only. Release status and internal rights notes never leave the private layer.
    licensing: publicLicensing[assignment.rightsStatus] ?? 'enquiry',
    publicationStatus: assignment.publicationStatus ?? 'UNREVIEWED',
    approvalStatus: manual ? 'editorially-selected' : (reviewedMonochrome ? 'phase7-monochrome-reviewed' : (assignedMonochrome ? 'curatorially-assigned' : (assignment.destinationId ? 'owner-timeline-assigned' : 'unassigned')))
  };
});

for (const role of ['thumbnails', 'archive', 'viewer']) {
  const directory = path.join(root, 'public/assets-derived', role);
  if (!fs.existsSync(directory)) continue;
  for (const file of fs.readdirSync(directory)) {
    if (/\.jpe?g$/i.test(file) && !allowedDerivativeNames.has(file)) fs.unlinkSync(path.join(directory, file));
  }
}

const publicCatalog = catalog.filter((photo) => photo.public);
const output = { schemaVersion: 2, generatedAt: new Date().toISOString(), count: publicCatalog.length, privacy: 'Public-safe catalog. Exact coordinates, private notes, source paths, and private photographs are intentionally excluded.', photos: publicCatalog };
fs.mkdirSync(path.join(root, 'public/data'), { recursive: true });
fs.writeFileSync(path.join(root, 'public/data/photo-catalog.json'), `${JSON.stringify(output, null, 2)}\n`);

const curationPath = path.join(root, 'data/photo-curation.json');
fs.mkdirSync(path.dirname(curationPath), { recursive: true });
if (!fs.existsSync(curationPath)) {
  const assignments = Object.fromEntries(catalog.map((photo) => [photo.id, {
    destination: null,
    visualWorlds: photo.visualWorlds,
    role: photo.role,
    visibility: 'hold',
    featured: photo.featured,
    storyCandidate: false,
    peopleCandidate: photo.peoplePresent === true,
    printCandidate: false,
    focalX: 50,
    focalY: 50,
    mobileFocalX: 50,
    mobileFocalY: 50
  }]));
  fs.writeFileSync(curationPath, `${JSON.stringify({ schemaVersion: 1, updatedAt: null, assignments }, null, 2)}\n`);
}

// Destination counts appear beside links into the archive filtered to that destination, so they are
// derived from the published catalog rather than stored independently: an exclusion or a hold must
// never leave a page stating a number that the next page contradicts.
const publicByDestination = new Map();
for (const photo of publicCatalog) {
  if (!photo.destinationId) continue;
  if (!publicByDestination.has(photo.destinationId)) publicByDestination.set(photo.destinationId, []);
  publicByDestination.get(photo.destinationId).push(photo.id);
}
let countsChanged = false;
for (const destination of destinationData.destinations) {
  const photoIds = publicByDestination.get(destination.id) ?? [];
  const orphaned = (destination.manualOrder ?? []).filter((id) => !photoIds.includes(id));
  if (orphaned.length) throw new Error(`${destination.id} sequences photographs that are no longer public: ${orphaned.join(', ')}`);
  if (destination.confirmedPhotoCount !== photoIds.length) countsChanged = true;
  destination.photoIds = photoIds;
  destination.photoCount = photoIds.length;
  destination.confirmedPhotoCount = photoIds.length;
}
if (countsChanged) fs.writeFileSync(destinationPath, `${JSON.stringify(destinationData, null, 2)}\n`);

console.log(`Indexed ${catalog.length} photographs; published ${publicCatalog.length} after ${publicExclusions.size} editorial exclusions.`);
