import fs from 'node:fs';

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const inventory = read('docs/photo-inventory.json');
const timeline = read('data/owner-travel-timeline.json');
const curation = read('data/photo-curation.json');
const exclusions = read('data/public-image-exclusions.json');
// `editorialHold` belongs here with the other two. A held frame is withheld from publication, so
// counting it into a destination's photoIds overstates the public body of work on the chapter page
// ("N photographs belong to this destination") and offers the archive a photograph it will not serve.
// The catalog build and the derivative generators already honour the hold; this one did not.
const editorialExcludedIds = new Set([
  ...exclusions.ownerRejected.map((item) => item.photoId),
  ...exclusions.duplicateFamilies.flatMap((family) => family.excludeIds),
  ...exclusions.editorialHold.map((item) => item.photoId)
]);
const ownerRejectedIds = new Set(exclusions.ownerRejected.map((item) => item.photoId));
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
  // Explicit owner confirmation outranks timeline inference and must survive every regeneration.
  const hasStrongerLocation = ['GPS', 'APPLE_PHOTOS', 'OWNER_CONFIRMATION'].includes(assignment.locationSource);
  assignment.captureDate = photo.capture?.date ?? null;
  assignment.originalFilename = photo.filename;
  if (!hasStrongerLocation) {
    assignment.destinationConfidence = result.confidence;
    assignment.locationConfidence = result.confidence;
  }
  // Owner photo exclusions are authoritative. Automated curation never re-enables a rejected frame.
  if (ownerRejectedIds.has(photo.id)) {
    assignment.visibility = 'do-not-publish';
    assignment.publicationStatus = 'PRIVATE';
    assignment.ownerDecision = 'OWNER_REJECTED';
    assignment.ownerDecisionSource = 'OWNER_CONFIRMATION';
    assignment.featured = false;
    assignment.storyCandidate = false;
    assignment.peopleCandidate = false;
    assignment.printCandidate = false;
  }
  if (result.status === 'assigned' && !hasStrongerLocation) {
    assignment.destination = result.period.destinationId;
    assignment.destinationId = result.period.destinationId;
    assignment.country = result.period.country;
    assignment.countryCode = result.period.countryCode;
    assignment.region = result.period.region;
    assignment.journeyId = result.period.journeyId;
    assignment.locationSource = 'OWNER_TRAVEL_TIMELINE';
    assignment.locationSourceAttribution = 'OWNER';
    if (!editorialExcludedIds.has(photo.id) && !['private', 'do-not-publish'].includes(assignment.visibility)) {
      journeyPhotos.get(result.period.journeyId).push(photo.id);
    }
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

// Geography states that carry real owner authority. A photograph reaches a destination through
// a confirmed timeline range or through explicit owner confirmation, never through inference.
const trustedGeography = new Set(['CONFIRMED_OWNER_RANGE', 'OWNER_CONFIRMED']);
// Publishing a destination chapter is an editorial decision made by a person. Destinations are
// listed here deliberately; a chapter never publishes itself by crossing a photo count.
const publishedDestinations = new Set(['japan', 'essaouira']);

const destinationDefinitions = [
  { id: 'malaysia', slug: 'malaysia', name: 'Malaysia', displayName: 'Malaysia', country: 'Malaysia', countryCode: 'MY', region: null, parentDestination: null },
  { id: 'thailand', slug: 'thailand', name: 'Thailand', displayName: 'Thailand', country: 'Thailand', countryCode: 'TH', region: null, parentDestination: null },
  { id: 'laos', slug: 'laos', name: 'Laos', displayName: 'Laos', country: 'Laos', countryCode: 'LA', region: null, parentDestination: null },
  { id: 'vietnam', slug: 'vietnam', name: 'Vietnam', displayName: 'Vietnam', country: 'Vietnam', countryCode: 'VN', region: null, parentDestination: null },
  { id: 'phu-quoc', slug: 'phu-quoc', name: 'Phu Quoc', displayName: 'Phu Quoc\nVietnam', country: 'Vietnam', countryCode: 'VN', region: 'Phu Quoc', parentDestination: 'vietnam' },
  { id: 'japan', slug: 'japan', name: 'Japan', displayName: 'Japan', country: 'Japan', countryCode: 'JP', region: null, parentDestination: null },
  { id: 'morocco', slug: 'morocco', name: 'Morocco', displayName: 'Morocco', country: 'Morocco', countryCode: 'MA', region: null, parentDestination: null },
  { id: 'essaouira', slug: 'essaouira', name: 'Essaouira', displayName: 'Essaouira\nMorocco', country: 'Morocco', countryCode: 'MA', region: 'Essaouira', parentDestination: 'morocco' },
  { id: 'france', slug: 'france', name: 'France', displayName: 'France', country: 'France', countryCode: 'FR', region: null, parentDestination: null },
  { id: 'la-reunion', slug: 'la-reunion', name: 'La Réunion', displayName: 'La Réunion', country: 'France', countryCode: 'FR', region: 'La Réunion', parentDestination: 'france' }
];

// Phase 9.28A. This script used to rebuild data/destinations.json from the list above and nothing
// else, which silently deleted every editorial decision later phases had written by hand: a chapter
// created after this list (Düsseldorf), a chapter published after this list (La Réunion), the chosen
// hero of an open chapter, its manual sequence, and the Phase 9.27 `hero` art-direction block. The
// file is co-owned — this script owns geography and counts, people own the edit — so it now merges
// instead of overwriting. Derived fields below are recomputed; everything else is carried forward.
const existingDestinations = new Map((read('data/destinations.json').destinations ?? []).map((item) => [item.id, item]));
const editorialKeys = ['shortIntroduction', 'editorialStatus', 'heroPhotoId', 'hero', 'featuredPhotoIds', 'manualOrder', 'storyIds', 'peopleIds', 'collectionIds', 'relatedDestinations', 'seoTitle', 'seoDescription', 'publicationStatus'];

const assignments = Object.entries(curation.assignments);
const destinations = destinationDefinitions.map((destination) => {
  const photoIds = assignments.filter(([id, value]) => value.destinationId === destination.id && trustedGeography.has(value.locationConfidence) && !editorialExcludedIds.has(id) && !['private', 'do-not-publish'].includes(value.visibility)).map(([id]) => id);
  const journeyIds = timeline.periods.filter((period) => period.destinationId === destination.id).map((period) => period.journeyId);
  const featured = catalog.photos.filter((photo) => photoIds.includes(photo.id) && photo.featured).sort((a, b) => Number(a.editorialOrder) - Number(b.editorialOrder));
  const publicationStatus = publishedDestinations.has(destination.id) && featured.length >= 5 ? 'published' : photoIds.length ? 'in-edit' : 'planned';
  // Dates are reported, never invented. An owner-supplied travel period is authoritative; where no
  // period exists the observed capture range is used and labelled as such.
  const period = timeline.periods.find((item) => item.destinationId === destination.id);
  const captureDates = photoIds.map((id) => curation.assignments[id]?.captureDate).filter(Boolean).sort();
  const dateRange = period
    ? { start: period.ownerStart, end: period.ownerEnd, source: 'OWNER_TRAVEL_TIMELINE' }
    : captureDates.length
      ? { start: captureDates[0].slice(0, 10), end: captureDates.at(-1).slice(0, 10), source: 'CAPTURE_METADATA' }
      : null;
  // What this script may decide on its own, for a destination it is meeting for the first time.
  const generated = {
    ...destination, dateRange, shortIntroduction: null,
    editorialStatus: featured.length ? 'CURATED' : 'NEEDS_INFO',
    heroPhotoId: featured.find((photo) => ['hero', 'anchor'].includes(photo.role))?.id ?? null,
    featuredPhotoIds: featured.map((photo) => photo.id), journeyIds, storyIds: [], peopleIds: [], collectionIds: [], relatedDestinations: [],
    photoCount: photoIds.length, confirmedPhotoCount: photoIds.length, photoIds,
    manualOrder: featured.map((photo) => photo.id),
    seoTitle: publicationStatus === 'published' ? `${destination.name} photographs — Elsewhere` : null,
    seoDescription: null, publicationStatus,
  };
  const previous = existingDestinations.get(destination.id);
  if (!previous) return generated;
  // Geography, counts and dates are this script's to recompute. The edit is not.
  const merged = { ...generated };
  for (const key of editorialKeys) if (previous[key] !== undefined) merged[key] = previous[key];
  return merged;
});
// A destination this script has no definition for was created by hand in a later phase. Keep it
// exactly as it is rather than deleting it, and keep the file in its established order.
for (const [id, item] of existingDestinations) if (!destinations.some((entry) => entry.id === id)) destinations.push(item);
const definedOrder = destinationDefinitions.map((item) => item.id);
destinations.sort((a, b) => {
  const ai = definedOrder.indexOf(a.id); const bi = definedOrder.indexOf(b.id);
  return (ai === -1 ? Number.MAX_SAFE_INTEGER : ai) - (bi === -1 ? Number.MAX_SAFE_INTEGER : bi);
});
write('data/destinations.json', { schemaVersion: 1, source: 'OWNER_TRAVEL_TIMELINE', destinations });

const journeys = timeline.periods.map((period) => {
  const photoIds = journeyPhotos.get(period.journeyId);
  const featured = catalog.photos.filter((photo) => photoIds.includes(photo.id) && photo.featured).sort((a, b) => Number(a.editorialOrder) - Number(b.editorialOrder));
  return { id: period.journeyId, slug: period.journeyId, title: null, workingTitle: period.workingTitle, startDate: period.ownerStart, endDate: period.ownerEnd, dateConfidence: period.rangeConfidence, destinationIds: [period.destinationId], heroPhotoId: featured.find((photo) => ['hero', 'anchor'].includes(photo.role))?.id ?? null, photoIds, storyIds: [], peopleIds: [], fragmentIds: [], featuredCollectionIds: [], editorialSummary: null, ownerNotes: null, publicationStatus: 'needs-owner-input', manualPhotoOrder: featured.map((photo) => photo.id), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
});
write('data/journeys.json', { schemaVersion: 1, source: 'OWNER_TRAVEL_TIMELINE', journeys, transitionPhotos, outsidePhotos });

// Timestamp continuity proposes review groups; it never assigns narrative meaning.
const sorted = inventory.photos
  .filter((photo) => !editorialExcludedIds.has(photo.id) && !['private', 'do-not-publish'].includes(curation.assignments[photo.id]?.visibility))
  .sort((a, b) => Date.parse(a.capture.date) - Date.parse(b.capture.date));
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
