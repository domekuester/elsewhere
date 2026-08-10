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
  const publicAllowed = !publicExclusions.has(photo.id) && !['private', 'do-not-publish'].includes(assignment.visibility ?? 'hold');
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
  const visualWorlds = assignment.visualWorlds?.length
    ? assignment.visualWorlds
    : (manual?.worlds ?? (reviewedMonochrome ? ['black-and-white'] : []));
  const year = photo.capture?.date ? Number(photo.capture.date.slice(0, 4)) : null;
  const reviewedAlt = (typeof assignment.altText === 'string' ? assignment.altText.trim() : '') || confirmedAltByFilename.get(photo.filename.toLowerCase()) || '';
  const temporaryFacts = [destination?.name, photo.orientation, Number.isFinite(year) ? String(year) : null].filter(Boolean);
  const altText = reviewedAlt || (manual ? `A selected ${manual.worlds[0].replaceAll('-', ' ')} photograph from the Elsewhere archive.` : '');
  return {
    id: photo.id,
    index: index + 1,
    filename: photo.filename,
    thumbnail: `/assets-derived/thumbnails/${thumbName}`,
    archiveImage: `/assets-derived/archive/${archiveName}`,
    viewerImage: `/assets-derived/viewer/${archiveName}`,
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

console.log(`Indexed ${catalog.length} photographs; published ${publicCatalog.length} after ${publicExclusions.size} editorial exclusions.`);
