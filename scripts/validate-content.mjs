import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const inventory = read('docs/photo-inventory.json');
const curation = read('data/photo-curation.json');
const destinations = read('data/destinations.json').destinations;
const journeys = read('data/journeys.json').journeys;
const stories = read('data/story-candidates.json').candidates;
const people = read('data/people-review.json').entries;
const publicCatalog = read('public/data/photo-catalog.json').photos;
const exclusions = read('data/public-image-exclusions.json');
const ownerRejectedIds = new Set(exclusions.ownerRejected.map((item) => item.photoId));
const excludedIds = new Set([
  ...ownerRejectedIds,
  ...exclusions.duplicateFamilies.flatMap((family) => family.excludeIds)
]);
const photoIds = new Set(inventory.photos.map((photo) => photo.id));
const destinationIds = new Set(destinations.map((destination) => destination.id));
const journeyIds = new Set(journeys.map((journey) => journey.id));
const errors = [];
const warnings = [];

const duplicateValues = (items, field) => items.map((item) => item[field]).filter(Boolean).filter((value, index, all) => all.indexOf(value) !== index);
for (const slug of duplicateValues(destinations, 'slug')) errors.push(`Duplicate destination slug: ${slug}`);
for (const slug of duplicateValues(journeys, 'slug')) errors.push(`Duplicate journey slug: ${slug}`);

for (const [photoId, assignment] of Object.entries(curation.assignments)) {
  if (!photoIds.has(photoId)) errors.push(`Curation references missing photo: ${photoId}`);
  if (assignment.destinationId && !destinationIds.has(assignment.destinationId)) errors.push(`${photoId} references missing destination ${assignment.destinationId}`);
  if (assignment.journeyId && !journeyIds.has(assignment.journeyId)) errors.push(`${photoId} references missing journey ${assignment.journeyId}`);
  if (assignment.locationConfidence === 'TRANSITION_DAY_REVIEW' && assignment.destinationId) errors.push(`${photoId} is transition-review but has destination ${assignment.destinationId}`);
  if (assignment.publicationStatus === 'PUBLISHED' && ['private', 'do-not-publish'].includes(assignment.visibility)) errors.push(`${photoId} is published with private visibility`);
}
for (const destination of destinations) {
  for (const id of [...destination.photoIds, ...destination.featuredPhotoIds, ...destination.manualOrder]) if (!photoIds.has(id)) errors.push(`${destination.id} references missing photo ${id}`);
  for (const id of [...destination.photoIds, ...destination.featuredPhotoIds, ...destination.manualOrder]) if (excludedIds.has(id)) errors.push(`${destination.id} includes editorially excluded photo ${id}`);
  if (destination.publicationStatus === 'published' && (!destination.heroPhotoId || destination.confirmedPhotoCount < 5)) errors.push(`Published destination ${destination.id} fails content threshold`);
  if (destination.confirmedPhotoCount === 0 && destination.publicationStatus !== 'planned') errors.push(`Destination ${destination.id} has zero photos but is ${destination.publicationStatus}`);
  // Phase 9.27 hero art direction. The hero is the loudest surface on the site, so its frame has to
  // belong to this destination, has to be publishable, and — once the chapter is open — has to be the
  // same frame the rest of the system already points at.
  const hero = destination.hero;
  if (hero) {
    if (!photoIds.has(hero.photoId)) errors.push(`${destination.id} hero references missing photo ${hero.photoId}`);
    if (excludedIds.has(hero.photoId)) errors.push(`${destination.id} hero uses editorially excluded photo ${hero.photoId}`);
    if (!destination.photoIds.includes(hero.photoId)) errors.push(`${destination.id} hero ${hero.photoId} does not belong to that destination`);
    if (!['AUTO_SELECTED', 'OWNER_APPROVED', 'OWNER_REPLACED', 'PROVISIONAL_NOT_PUBLISHED'].includes(hero.status)) errors.push(`${destination.id} hero has unknown status ${hero.status}`);
    if (destination.publicationStatus === 'published' && hero.photoId !== destination.heroPhotoId) errors.push(`${destination.id} hero ${hero.photoId} disagrees with heroPhotoId ${destination.heroPhotoId}`);
    if (destination.publicationStatus === 'published' && hero.status === 'PROVISIONAL_NOT_PUBLISHED') errors.push(`${destination.id} is published but its hero is still marked provisional`);
    for (const [breakpoint, value] of Object.entries(hero.focal ?? {})) {
      if (!/^\d{1,3}% \d{1,3}%$/.test(value)) errors.push(`${destination.id} hero focal ${breakpoint} is not an "x% y%" pair: ${value}`);
    }
  }
}
for (const journey of journeys) for (const id of journey.photoIds) if (!photoIds.has(id)) errors.push(`${journey.id} references missing photo ${id}`);
for (const story of stories) for (const id of story.photoIds) if (!photoIds.has(id)) errors.push(`${story.id} references missing photo ${id}`);
for (const person of people) if (!photoIds.has(person.photoId)) errors.push(`${person.id} references missing photo ${person.photoId}`);

// Three states withhold a photograph from the public catalog, and they are deliberately distinct.
// `do-not-publish` is the owner's word and only the owner may set or clear it; `private` predates
// this phase; `editorial-hold` is an agent proposal recorded in data/public-image-exclusions.json
// under `editorialHold`, awaiting owner confirmation and reversible without touching the other two.
const WITHHELD_VISIBILITY = ['private', 'do-not-publish', 'editorial-hold'];

const forbiddenPublicKeys = ['privateLocation', 'privateMetadata', 'internalNotes', 'ownerNotes', 'sourcePath', 'latitude', 'longitude', 'gps'];
for (const photo of publicCatalog) {
  for (const key of forbiddenPublicKeys) if (key in photo) errors.push(`Public photo ${photo.id} exposes ${key}`);
  const assignment = curation.assignments[photo.id];
  if (assignment && WITHHELD_VISIBILITY.includes(assignment.visibility)) errors.push(`Withheld photo ${photo.id} (${assignment.visibility}) appears in public catalog`);
  if (excludedIds.has(photo.id)) errors.push(`Editorially excluded photo ${photo.id} appears in public catalog`);
  for (const [role, asset] of Object.entries({ thumbnail: photo.thumbnail, archive: photo.archiveImage, viewer: photo.viewerImage })) {
    if (!asset) { errors.push(`Public photo ${photo.id} has no ${role} derivative`); continue; }
    // Catalog URLs are percent-encoded so that a master filename containing a space cannot break a
    // srcset candidate. The filesystem wants the decoded name back.
    const localPath = path.join('public', decodeURIComponent(asset));
    if (!fs.existsSync(localPath)) { errors.push(`Public photo ${photo.id} references missing ${role} derivative ${asset}`); continue; }
    const metadata = await sharp(localPath).metadata();
    const actualMax = Math.max(metadata.width ?? 0, metadata.height ?? 0);
    const sourceMax = Math.max(photo.width ?? 0, photo.height ?? 0);
    const expectedMax = Math.min(sourceMax, { thumbnail: 960, archive: 1800, viewer: 3200 }[role]);
    if (actualMax < expectedMax - 2) errors.push(`${photo.id} ${role} derivative is undersized: ${actualMax}px; expected ${expectedMax}px`);
  }
}
for (const rejected of exclusions.ownerRejected) {
  const assignment = curation.assignments[rejected.photoId];
  if (!assignment || assignment.visibility !== 'do-not-publish' || assignment.publicationStatus !== 'PRIVATE') errors.push(`Owner-rejected ${rejected.photoId} is not persistently PRIVATE/do-not-publish`);
  const index = inventory.photos.findIndex((photo) => photo.id === rejected.photoId);
  if (index >= 0) {
    const derivativeName = `${String(index + 1).padStart(4, '0')}-${path.parse(rejected.filename).name}.jpg`;
    for (const role of ['thumbnails', 'archive', 'viewer']) if (fs.existsSync(path.join('public/assets-derived', role, derivativeName))) errors.push(`Owner-rejected ${rejected.photoId} retains public ${role} derivative`);
  }
}
// The editorial-hold register and the curation layer must agree in both directions, and a held
// frame must retain no publicly fetchable derivative — the same guarantee owner rejections get.
const heldRegister = exclusions.editorialHold ?? [];
const heldInCuration = new Set(Object.entries(curation.assignments).filter(([, item]) => item.visibility === 'editorial-hold').map(([id]) => id));
for (const held of heldRegister) {
  if (!heldInCuration.has(held.photoId)) errors.push(`Editorial hold ${held.photoId} is registered but not held in curation`);
  if (exclusions.ownerRejected.some((item) => item.photoId === held.photoId)) errors.push(`Editorial hold ${held.photoId} duplicates an owner rejection; the owner register is authoritative`);
  const index = inventory.photos.findIndex((photo) => photo.id === held.photoId);
  if (index >= 0) {
    const derivativeName = `${String(index + 1).padStart(4, '0')}-${path.parse(inventory.photos[index].filename).name}.jpg`;
    for (const role of ['thumbnails', 'archive', 'viewer']) if (fs.existsSync(path.join('public/assets-derived', role, derivativeName))) errors.push(`Editorially held ${held.photoId} retains public ${role} derivative`);
  }
}
for (const id of heldInCuration) if (!heldRegister.some((held) => held.photoId === id)) errors.push(`${id} is held in curation with no entry in the editorial hold register`);

const privateIds = new Set(Object.entries(curation.assignments).filter(([, item]) => WITHHELD_VISIBILITY.includes(item.visibility)).map(([id]) => id));
const expectedPublicCount = inventory.photos.length - new Set([...privateIds, ...excludedIds]).size;
if (publicCatalog.length !== expectedPublicCount) errors.push(`Public catalog count ${publicCatalog.length} does not match visibility policy ${expectedPublicCount}`);
for (const family of exclusions.duplicateFamilies) {
  if (!photoIds.has(family.keepId)) errors.push(`Duplicate family keeps missing photo ${family.keepId}`);
  for (const id of family.excludeIds) if (!photoIds.has(id)) errors.push(`Duplicate family excludes missing photo ${id}`);
}
if (stories.length > 20) warnings.push('Story candidate queue exceeds 20; prioritize before adding more.');

// Rights integrity. Licensing permission is separate from publication permission, and
// uncertainty must never resolve into a commercial claim.
const rightsStates = new Set(['ENQUIRY_ONLY', 'EDITORIAL_AVAILABLE', 'RELEASE_REQUIRED', 'COMMERCIAL_CLEARED', 'NOT_FOR_LICENSE']);
const releaseStates = new Set(['UNKNOWN', 'NOT_REQUIRED', 'REQUIRED', 'HELD']);
const publicLicensingByRights = { ENQUIRY_ONLY: 'enquiry', EDITORIAL_AVAILABLE: 'editorial', RELEASE_REQUIRED: 'enquiry', COMMERCIAL_CLEARED: 'commercial', NOT_FOR_LICENSE: 'unavailable' };
for (const [photoId, assignment] of Object.entries(curation.assignments)) {
  if (!rightsStates.has(assignment.rightsStatus)) errors.push(`${photoId} has invalid rightsStatus ${assignment.rightsStatus}`);
  if (!releaseStates.has(assignment.modelReleaseStatus)) errors.push(`${photoId} has invalid modelReleaseStatus ${assignment.modelReleaseStatus}`);
  if (!releaseStates.has(assignment.propertyReleaseStatus)) errors.push(`${photoId} has invalid propertyReleaseStatus ${assignment.propertyReleaseStatus}`);
  if (assignment.rightsStatus === 'COMMERCIAL_CLEARED' && (assignment.modelReleaseStatus === 'UNKNOWN' || assignment.propertyReleaseStatus === 'UNKNOWN')) {
    errors.push(`${photoId} claims COMMERCIAL_CLEARED while a release status is still UNKNOWN`);
  }
  // Owner rejection is an editorial decision about the photograph itself, so it also ends licensing.
  // Duplicate-family exclusions are only about which export represents a frame; they carry no rights meaning.
  if (ownerRejectedIds.has(photoId) && assignment.rightsStatus !== 'NOT_FOR_LICENSE') errors.push(`Owner-rejected ${photoId} must be NOT_FOR_LICENSE, found ${assignment.rightsStatus}`);
}
const forbiddenRightsKeys = ['rightsStatus', 'rightsNotesInternal', 'modelReleaseStatus', 'propertyReleaseStatus'];
// The rights denylist above caught the fields it was written for and nothing else, so
// `locationSource` and `locationConfidence` — internal provenance describing how a place was
// decided and how sure the owner is of it — shipped in the public catalog undetected. A denylist
// only ever finds what someone already thought of. The allowlist below is the actual boundary:
// every key in the public projection must be named here, so a new internal field cannot reach
// `public/data/photo-catalog.json` by being added to the projection object and forgotten. Adding a
// genuinely public field means adding it here too, which is the point — the failure is the review.
const publicPhotoKeys = new Set([
  'id', 'index', 'filename', 'thumbnail', 'archiveImage', 'viewerImage',
  'width', 'height', 'aspectRatio', 'orientation',
  'captureDate', 'year', 'camera', 'lens', 'colorMode', 'dominantColor',
  'visualWorlds', 'peoplePresent',
  'destination', 'destinationId', 'destinationSlug', 'destinationPublished',
  'country', 'countryCode', 'region', 'place', 'journeyId',
  'role', 'featured', 'editorialOrder', 'public',
  'altText', 'altReviewStatus', 'accessibleLabel', 'caption',
  'licensing', 'publicationStatus', 'approvalStatus'
]);
// Named explicitly so the failure says what leaked rather than only that something did.
const forbiddenProvenanceKeys = [
  'locationSource', 'locationConfidence', 'locationSourceAttribution',
  'ownerNotes', 'researchNotes', 'privacyNotes', 'selectionNotes', 'internalNotes',
  'provenance', 'sourcePath', 'sourceMaster', 'privateLocation',
  'gps', 'GPS', 'latitude', 'longitude', 'coordinates',
  'visibility', 'privacyStatus', 'peopleClassification'
];
for (const photo of publicCatalog) {
  for (const key of forbiddenRightsKeys) if (key in photo) errors.push(`Public photo ${photo.id} exposes private rights field ${key}`);
  for (const key of forbiddenProvenanceKeys) if (key in photo) errors.push(`Public photo ${photo.id} exposes internal field ${key}`);
  for (const key of Object.keys(photo)) if (!publicPhotoKeys.has(key)) errors.push(`Public photo ${photo.id} carries unrecognised field ${key} — add it to publicPhotoKeys if it is genuinely public, or stop projecting it`);
  const expected = publicLicensingByRights[curation.assignments[photo.id]?.rightsStatus];
  if (photo.licensing !== expected) errors.push(`Public photo ${photo.id} licensing "${photo.licensing}" contradicts rights state (expected "${expected}")`);
  if (photo.licensing === 'unavailable') errors.push(`Public photo ${photo.id} is NOT_FOR_LICENSE but publicly listed`);
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}
console.log(`Content validation passed: ${inventory.photos.length} photos, ${destinations.length} destinations, ${journeys.length} journeys, ${stories.length} story candidates, ${people.length} People candidates.`);
for (const warning of warnings) console.warn(`Warning: ${warning}`);
