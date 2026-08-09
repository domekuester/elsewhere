import fs from 'node:fs';

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const inventory = read('docs/photo-inventory.json');
const curation = read('data/photo-curation.json');
const destinations = read('data/destinations.json').destinations;
const journeys = read('data/journeys.json').journeys;
const stories = read('data/story-candidates.json').candidates;
const people = read('data/people-review.json').entries;
const publicCatalog = read('public/data/photo-catalog.json').photos;
const exclusions = read('data/public-image-exclusions.json');
const excludedIds = new Set([
  ...exclusions.ownerRejected.map((item) => item.photoId),
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
  if (destination.publicationStatus === 'published' && (!destination.heroPhotoId || destination.confirmedPhotoCount < 5)) errors.push(`Published destination ${destination.id} fails content threshold`);
  if (destination.confirmedPhotoCount === 0 && destination.publicationStatus !== 'planned') errors.push(`Destination ${destination.id} has zero photos but is ${destination.publicationStatus}`);
}
for (const journey of journeys) for (const id of journey.photoIds) if (!photoIds.has(id)) errors.push(`${journey.id} references missing photo ${id}`);
for (const story of stories) for (const id of story.photoIds) if (!photoIds.has(id)) errors.push(`${story.id} references missing photo ${id}`);
for (const person of people) if (!photoIds.has(person.photoId)) errors.push(`${person.id} references missing photo ${person.photoId}`);

const forbiddenPublicKeys = ['privateLocation', 'privateMetadata', 'internalNotes', 'ownerNotes', 'sourcePath', 'latitude', 'longitude', 'gps'];
for (const photo of publicCatalog) {
  for (const key of forbiddenPublicKeys) if (key in photo) errors.push(`Public photo ${photo.id} exposes ${key}`);
  const assignment = curation.assignments[photo.id];
  if (assignment && ['private', 'do-not-publish'].includes(assignment.visibility)) errors.push(`Private photo ${photo.id} appears in public catalog`);
  if (excludedIds.has(photo.id)) errors.push(`Editorially excluded photo ${photo.id} appears in public catalog`);
}
const privateIds = new Set(Object.entries(curation.assignments).filter(([, item]) => ['private', 'do-not-publish'].includes(item.visibility)).map(([id]) => id));
const expectedPublicCount = inventory.photos.length - new Set([...privateIds, ...excludedIds]).size;
if (publicCatalog.length !== expectedPublicCount) errors.push(`Public catalog count ${publicCatalog.length} does not match visibility policy ${expectedPublicCount}`);
for (const family of exclusions.duplicateFamilies) {
  if (!photoIds.has(family.keepId)) errors.push(`Duplicate family keeps missing photo ${family.keepId}`);
  for (const id of family.excludeIds) if (!photoIds.has(id)) errors.push(`Duplicate family excludes missing photo ${id}`);
}
if (stories.length > 20) warnings.push('Story candidate queue exceeds 20; prioritize before adding more.');

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}
console.log(`Content validation passed: ${inventory.photos.length} photos, ${destinations.length} destinations, ${journeys.length} journeys, ${stories.length} story candidates, ${people.length} People candidates.`);
for (const warning of warnings) console.warn(`Warning: ${warning}`);
