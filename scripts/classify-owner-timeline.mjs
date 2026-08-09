import fs from 'node:fs';

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const inventory = read('docs/photo-inventory.json');
const timeline = read('data/owner-travel-timeline.json');
const curation = read('data/photo-curation.json');
const migrateExistingArchiveVisibility = (curation.schemaVersion ?? 1) < 3;
const catalog = read('public/data/photo-catalog.json');
const publicByFilename = new Map(catalog.photos.map((photo) => [photo.filename.toLowerCase(), photo]));

const inside = (day, range) => range && day >= range[0] && day <= range[1];
const classify = (captureDate) => {
  if (!captureDate) return { status: 'missing', confidence: 'UNKNOWN' };
  const day = captureDate.slice(0, 10);
  const period = timeline.periods.find((item) => day >= item.clearStart && day <= item.clearEnd);
  if (period) return { status: 'assigned', confidence: 'CONFIRMED_OWNER_RANGE', period, day };
  const adjacent = timeline.periods.filter((item) => inside(day, item.transitionBefore) || inside(day, item.transitionAfter));
  if (adjacent.length) return { status: 'transition', confidence: 'TRANSITION_DAY_REVIEW', adjacent, day };
  return { status: 'outside', confidence: 'UNKNOWN', day };
};

const journeyPhotos = new Map(timeline.periods.map((period) => [period.journeyId, []]));
const transitionPhotos = [];
const outsidePhotos = [];

for (const photo of inventory.photos) {
  const result = classify(photo.capture?.date ?? null);
  const assignment = curation.assignments[photo.id] ?? {};
  if (migrateExistingArchiveVisibility && assignment.visibility === 'hold') assignment.visibility = 'public';
  const hasStrongerLocation = ['GPS', 'APPLE_PHOTOS'].includes(assignment.locationSource);
  assignment.captureDate = photo.capture?.date ?? null;
  assignment.originalFilename = photo.filename;
  assignment.destinationConfidence = result.confidence;
  assignment.locationConfidence = result.confidence;
  if (result.status === 'assigned' && !hasStrongerLocation) {
    assignment.destination = result.period.destinationId;
    assignment.destinationId = result.period.destinationId;
    assignment.country = result.period.country;
    assignment.countryCode = result.period.countryCode;
    assignment.region = result.period.region;
    assignment.journeyId = result.period.journeyId;
    assignment.locationSource = 'OWNER_TRAVEL_TIMELINE';
    assignment.locationSourceAttribution = 'OWNER';
    journeyPhotos.get(result.period.journeyId).push(photo.id);
  } else if (result.status === 'transition' && !hasStrongerLocation) {
    assignment.destination = null;
    assignment.destinationId = null;
    assignment.country = null;
    assignment.countryCode = null;
    assignment.region = null;
    assignment.journeyId = null;
    assignment.locationSource = 'OWNER_TRAVEL_TIMELINE';
    assignment.locationSourceAttribution = 'OWNER';
    assignment.transitionCandidateJourneyIds = [...new Set(result.adjacent.map((item) => item.journeyId))];
    transitionPhotos.push({ photoId: photo.id, filename: photo.filename, captureDate: photo.capture.date, candidateJourneyIds: assignment.transitionCandidateJourneyIds });
  } else if (result.status === 'outside') {
    outsidePhotos.push({ photoId: photo.id, filename: photo.filename, captureDate: photo.capture?.date ?? null });
  }
  assignment.visualWorldConfidence = assignment.visualWorlds?.length ? 'CURATORIAL_ASSIGNMENT' : 'UNKNOWN';
  assignment.publicationStatus ??= assignment.visibility === 'private' ? 'PRIVATE' : 'UNREVIEWED';
  assignment.publicCaption ??= null;
  assignment.internalNotes ??= null;
  assignment.altTextCandidate ??= publicByFilename.get(photo.filename.toLowerCase())?.altText ?? null;
  assignment.altTextStatus ??= 'NEEDS_OWNER_INPUT';
  curation.assignments[photo.id] = assignment;
}

curation.schemaVersion = 3;
curation.updatedAt = new Date().toISOString();
curation.metadataSources = ['EXISTING_MANIFEST', 'OWNER_TRAVEL_TIMELINE', 'CURATION_STUDIO'];
write('data/photo-curation.json', curation);

const destinationDefinitions = [
  { id: 'malaysia', slug: 'malaysia', name: 'Malaysia', displayName: 'Malaysia', country: 'Malaysia', countryCode: 'MY', region: null, parentDestination: null },
  { id: 'thailand', slug: 'thailand', name: 'Thailand', displayName: 'Thailand', country: 'Thailand', countryCode: 'TH', region: null, parentDestination: null },
  { id: 'laos', slug: 'laos', name: 'Laos', displayName: 'Laos', country: 'Laos', countryCode: 'LA', region: null, parentDestination: null },
  { id: 'vietnam', slug: 'vietnam', name: 'Vietnam', displayName: 'Vietnam', country: 'Vietnam', countryCode: 'VN', region: null, parentDestination: null },
  { id: 'phu-quoc', slug: 'phu-quoc', name: 'Phu Quoc', displayName: 'Phu Quoc\nVietnam', country: 'Vietnam', countryCode: 'VN', region: 'Phu Quoc', parentDestination: 'vietnam' },
  { id: 'japan', slug: 'japan', name: 'Japan', displayName: 'Japan', country: 'Japan', countryCode: 'JP', region: null, parentDestination: null },
  { id: 'france', slug: 'france', name: 'France', displayName: 'France', country: 'France', countryCode: 'FR', region: null, parentDestination: null },
  { id: 'la-reunion', slug: 'la-reunion', name: 'La Réunion', displayName: 'La Réunion', country: 'France', countryCode: 'FR', region: 'La Réunion', parentDestination: 'france' }
];

const assignments = Object.entries(curation.assignments);
const destinations = destinationDefinitions.map((destination) => {
  const photoIds = assignments.filter(([, value]) => value.destinationId === destination.id && value.locationConfidence === 'CONFIRMED_OWNER_RANGE').map(([id]) => id);
  const journeyIds = timeline.periods.filter((period) => period.destinationId === destination.id).map((period) => period.journeyId);
  const featured = catalog.photos.filter((photo) => photoIds.includes(photo.id) && photo.featured).sort((a, b) => Number(a.editorialOrder) - Number(b.editorialOrder));
  const publicationStatus = destination.id === 'japan' && featured.length >= 5 ? 'published' : photoIds.length ? 'in-edit' : 'planned';
  return { ...destination, shortIntroduction: null, editorialStatus: featured.length ? 'CURATED' : 'NEEDS_INFO', heroPhotoId: featured.find((photo) => ['hero', 'anchor'].includes(photo.role))?.id ?? null, featuredPhotoIds: featured.map((photo) => photo.id), journeyIds, storyIds: [], peopleIds: [], collectionIds: [], relatedDestinations: [], photoCount: photoIds.length, confirmedPhotoCount: photoIds.length, photoIds, manualOrder: featured.map((photo) => photo.id), seoTitle: publicationStatus === 'published' ? `${destination.name} photographs — Elsewhere` : null, seoDescription: null, publicationStatus };
});
write('data/destinations.json', { schemaVersion: 1, source: 'OWNER_TRAVEL_TIMELINE', destinations });

const journeys = timeline.periods.map((period) => {
  const photoIds = journeyPhotos.get(period.journeyId);
  const featured = catalog.photos.filter((photo) => photoIds.includes(photo.id) && photo.featured).sort((a, b) => Number(a.editorialOrder) - Number(b.editorialOrder));
  return { id: period.journeyId, slug: period.journeyId, title: null, workingTitle: period.workingTitle, startDate: period.ownerStart, endDate: period.ownerEnd, dateConfidence: period.rangeConfidence, destinationIds: [period.destinationId], heroPhotoId: featured.find((photo) => ['hero', 'anchor'].includes(photo.role))?.id ?? null, photoIds, storyIds: [], peopleIds: [], fragmentIds: [], featuredCollectionIds: [], editorialSummary: null, ownerNotes: null, publicationStatus: 'needs-owner-input', manualPhotoOrder: featured.map((photo) => photo.id), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
});
write('data/journeys.json', { schemaVersion: 1, source: 'OWNER_TRAVEL_TIMELINE', journeys, transitionPhotos, outsidePhotos });

// Timestamp continuity proposes review groups; it never assigns narrative meaning.
const sorted = [...inventory.photos].sort((a, b) => Date.parse(a.capture.date) - Date.parse(b.capture.date));
const groups = [];
let group = [];
for (const photo of sorted) {
  const previous = group.at(-1);
  const gap = previous ? (Date.parse(photo.capture.date) - Date.parse(previous.capture.date)) / 60000 : Infinity;
  if (!previous || (gap <= 30 && photo.capture.date.slice(0, 10) === previous.capture.date.slice(0, 10))) group.push(photo);
  else { if (group.length >= 4) groups.push(group); group = [photo]; }
}
if (group.length >= 4) groups.push(group);
const storyCandidates = groups.sort((a, b) => b.length - a.length).slice(0, 14).map((photos, index) => {
  const curations = photos.map((photo) => curation.assignments[photo.id]);
  const destinationsInGroup = [...new Set(curations.map((item) => item.destinationId).filter(Boolean))];
  const worlds = [...new Set(curations.flatMap((item) => item.visualWorlds ?? []))];
  const duration = Math.round((Date.parse(photos.at(-1).capture.date) - Date.parse(photos[0].capture.date)) / 60000);
  return { id: `story-candidate-${String(index + 1).padStart(2, '0')}`, status: 'STORY_CANDIDATE', photoIds: photos.map((photo) => photo.id), filenames: photos.map((photo) => photo.filename), captureDateStart: photos[0].capture.date, captureDateEnd: photos.at(-1).capture.date, visualReason: `${photos.length} consecutive frames captured within ${duration} minutes. Temporal continuity suggests a sequence worth human review; subject and event are not inferred.`, existingVisualWorlds: worlds, destinationIds: destinationsInGroup, potentialStoryFormat: photos.length <= 5 ? 'SEQUENCE' : 'VISUAL_ESSAY', ownerInformationNeeded: 'Do these frames show one event, subject, place observation, or unrelated moments taken close together?', editorialStatus: 'NEEDS_OWNER_INPUT', publicationStatus: 'UNPUBLISHED' };
});
write('data/story-candidates.json', { schemaVersion: 1, generatedFrom: 'CAPTURE_TIME_SEQUENCE', candidates: storyCandidates });

const peoplePhotos = catalog.photos.filter((photo) => photo.peoplePresent === true || curation.assignments[photo.id]?.peopleCandidate);
const peopleReview = peoplePhotos.map((photo, index) => ({ id: `people-review-${String(index + 1).padStart(2, '0')}`, photoId: photo.id, filename: photo.filename, captureDate: photo.captureDate, destinationId: curation.assignments[photo.id]?.destinationId ?? null, journeyId: curation.assignments[photo.id]?.journeyId ?? null, classification: null, identityStatus: 'UNKNOWN', displayName: null, privacyStatus: 'UNKNOWN', peoplePageCandidate: Boolean(curation.assignments[photo.id]?.peopleCandidate), storyCandidate: false, ownerNotes: null, shortMemory: null, publicationStatus: 'NEEDS_OWNER_INPUT' }));
write('data/people-review.json', { schemaVersion: 1, entries: peopleReview });

// Shooting clusters support review/navigation only; they do not create geographic truth.
const dateClusterGroups = [];
let dateCluster = [];
for (const photo of sorted) {
  const previous = dateCluster.at(-1);
  const gapDays = previous ? (Date.parse(photo.capture.date) - Date.parse(previous.capture.date)) / 86400000 : Infinity;
  if (!previous || gapDays <= 7) dateCluster.push(photo);
  else { dateClusterGroups.push(dateCluster); dateCluster = [photo]; }
}
if (dateCluster.length) dateClusterGroups.push(dateCluster);
const dateClusters = dateClusterGroups.map((photos, index) => ({ id: `date-cluster-${String(index + 1).padStart(2, '0')}`, startDate: photos[0].capture.date, endDate: photos.at(-1).capture.date, photoCount: photos.length, photoIds: photos.map((photo) => photo.id), cameraModels: [...new Set(photos.map((photo) => photo.capture.cameraModel).filter(Boolean))], destinationIds: [...new Set(photos.map((photo) => curation.assignments[photo.id].destinationId).filter(Boolean))], purpose: 'REVIEW_ASSIST', geographicConfidence: 'NOT_A_GEOGRAPHIC_SOURCE' }));
write('data/date-clusters.json', { schemaVersion: 1, generatedFrom: 'CAPTURE_DATE_GAPS_MAX_7_DAYS', clusters: dateClusters });

const boundaryGroups = new Map();
for (const photo of transitionPhotos) {
  const key = photo.candidateJourneyIds.join('--');
  if (!boundaryGroups.has(key)) boundaryGroups.set(key, []);
  boundaryGroups.get(key).push(photo);
}
const questions = [...boundaryGroups.entries()].map(([key, photos], index) => ({ id: `owner-question-boundary-${String(index + 1).padStart(2, '0')}`, priority: 'HIGH_IMPACT', type: 'DESTINATION_UNKNOWN', subjectIds: photos.map((photo) => photo.photoId), title: `${photos.length} photograph${photos.length === 1 ? '' : 's'} on a travel boundary`, question: `Which side of the ${key.replaceAll('--', ' → ')} transition do these photographs belong to?`, context: { filenames: photos.map((photo) => photo.filename), captureDates: photos.map((photo) => photo.captureDate), candidateJourneyIds: photos[0].candidateJourneyIds }, status: 'OPEN' }));
for (const entry of peopleReview.filter((item) => item.peoplePageCandidate).slice(0, 4)) questions.push({ id: `owner-question-${entry.id}`, priority: 'MEDIUM_IMPACT', type: 'PERSON_UNKNOWN', subjectIds: [entry.photoId], title: `People review: ${entry.filename}`, question: 'Is this a known person, travel companion, meaningful encounter, anonymous subject, crowd/street photograph, or incidental human presence? What privacy state should apply?', context: { captureDate: entry.captureDate, destinationId: entry.destinationId }, status: 'OPEN' });
for (const candidate of storyCandidates.slice(0, 5)) questions.push({ id: `owner-question-${candidate.id}`, priority: 'MEDIUM_IMPACT', type: 'STORY_CONTEXT_NEEDED', subjectIds: candidate.photoIds, title: `${candidate.photoIds.length}-frame sequence`, question: candidate.ownerInformationNeeded, context: { candidateId: candidate.id, captureDateStart: candidate.captureDateStart, captureDateEnd: candidate.captureDateEnd }, status: 'OPEN' });
write('data/owner-questions.json', { schemaVersion: 1, questions });

const counts = Object.fromEntries(journeys.map((journey) => [journey.id, journey.photoIds.length]));
console.log(JSON.stringify({ total: inventory.photos.length, captureDateAvailable: inventory.photos.filter((photo) => photo.capture?.date).length, autoAssigned: Object.values(counts).reduce((sum, count) => sum + count, 0), transitionReview: transitionPhotos.length, outsideTimeline: outsidePhotos.length, journeys: counts, dateClusters: dateClusters.length, storyCandidates: storyCandidates.length, peopleCandidates: peopleReview.length, ownerQuestions: questions.length }, null, 2));
