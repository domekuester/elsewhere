import fs from 'node:fs';
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, text) => fs.writeFileSync(file, `${text.trim()}\n`);
const inventory = read('docs/photo-inventory.json');
const curation = read('data/photo-curation.json');
const journeys = read('data/journeys.json');
const destinations = read('data/destinations.json').destinations;
const stories = read('data/story-candidates.json').candidates;
const people = read('data/people-review.json').entries;
const questions = read('data/owner-questions.json').questions;
const catalog = read('public/data/photo-catalog.json').photos;
const assignments = Object.values(curation.assignments);
const journeyById = new Map(journeys.journeys.map((journey) => [journey.id, journey]));

let storyDoc = '# Story candidates\n\nThese are timestamp-based review proposals, not factual narratives. Subject, event and meaning remain unknown until owner review.\n';
for (const candidate of stories) {
  storyDoc += `\n## ${candidate.id}\n\n- Photos: ${candidate.filenames.map((name) => `\`${name}\``).join(', ')}\n- Capture range: ${candidate.captureDateStart} → ${candidate.captureDateEnd}\n- Visual/editorial reason: ${candidate.visualReason}\n- Existing categories: ${candidate.existingVisualWorlds.length ? candidate.existingVisualWorlds.join(', ') : 'none assigned'}\n- Confirmed destination: ${candidate.destinationIds.length ? candidate.destinationIds.join(', ') : 'none'}\n- Possible format: ${candidate.potentialStoryFormat}\n- Owner input needed: ${candidate.ownerInformationNeeded}\n`;
}
write('docs/STORY-CANDIDATES.md', storyDoc);

let queueDoc = '# Owner input queue\n\nThe queue is intentionally short. Boundary questions that unlock several photographs come before individual story or People prompts. The development Curation Studio stores answers locally, allows Open/Answered/Deferred states, and exports `owner-answers.json`. Answers remain source material and never publish automatically.\n';
for (const priority of ['HIGH_IMPACT', 'MEDIUM_IMPACT', 'LOW_IMPACT']) {
  const items = questions.filter((question) => question.priority === priority);
  if (!items.length) continue;
  queueDoc += `\n## ${priority.replace('_', ' ')} — ${items.length}\n`;
  for (const question of items) queueDoc += `\n### ${question.id}: ${question.title}\n\n${question.question}\n\n- Type: ${question.type}\n- Photographs unlocked: ${question.subjectIds.length}\n- Status: ${question.status}\n`;
}
write('docs/OWNER-INPUT-QUEUE.md', queueDoc);

const autoAssigned = assignments.filter((item) => item.locationConfidence === 'CONFIRMED_OWNER_RANGE').length;
const transition = assignments.filter((item) => item.locationConfidence === 'TRANSITION_DAY_REVIEW').length;
const outside = journeys.outsidePhotos.length;
const countRows = [
  ['Malaysia 2024', 'malaysia-2024'], ['Thailand 2024', 'thailand-2024'], ['Laos 2024/25', 'laos-2024-2025'], ['Thailand 2025 #1', 'thailand-2025-part-1'], ['Phu Quoc / Vietnam 2025', 'vietnam-phu-quoc-2025'], ['Malaysia 2025 #1', 'malaysia-2025-part-1'], ['Japan 2025', 'japan-2025'], ['Thailand 2025 #2', 'thailand-2025-part-2'], ['Malaysia 2025 #2', 'malaysia-2025-part-2'], ['La Réunion 2025', 'la-reunion-2025']
];
let timelineReport = `# Phase 5 timeline classification report\n\n- Total photos: **${inventory.photos.length}**\n- Capture date available: **${inventory.photos.filter((photo) => photo.capture?.date).length}**\n- Capture date missing: **${inventory.photos.filter((photo) => !photo.capture?.date).length}**\n- Auto-assigned by owner timeline: **${autoAssigned}**\n- Transition day review: **${transition}**\n- Outside known timeline: **${outside}**\n- Destination unassigned: **${assignments.filter((item) => !item.destinationId).length}**\n\n## Exact journey counts\n\n| Journey | Photographs |\n| --- | ---: |\n`;
for (const [label, id] of countRows) timelineReport += `| ${label} | ${journeyById.get(id).photoIds.length} |\n`;
timelineReport += `\n## Editorial findings\n\n- Strongest destination archive: **Japan** — 212 confirmed frames and five existing curated frames across Urban, Ocean, Detail, Black & White and People.\n- Destination closest to a second flagship chapter: **La Réunion** — 146 confirmed frames, the current homepage hero, and edited Jungle/Ocean anchors; broader human/detail review is still required.\n- Strongest B&W destination: **Japan** — three confirmed monochrome editorial frames in the current catalog.\n- Strongest People review priorities: \`P1260248.jpg\`, \`P1260122.jpg\`, \`1200794-2.jpg\`, \`IMG_8992.jpg\`, then transition-day \`P1260635.jpg\`. Identity and relationship remain unknown.\n- Strongest story candidates: **story-candidate-10** and **story-candidate-12** because each contains an existing edited Japan frame; **story-candidate-01** is a valuable La Réunion burst but first requires near-duplicate reduction.\n- Photographs still requiring manual destination review: **${transition}** across three transition boundaries.\n`;
write('docs/PHASE-5-TIMELINE-CLASSIFICATION-REPORT.md', timelineReport);

const visibility = Object.fromEntries(['public','private','hold'].map((state) => [state, assignments.filter((item) => item.visibility === state).length]));
const worldAssigned = catalog.filter((photo) => photo.visualWorlds.length).length;
const bw = catalog.filter((photo) => photo.colorMode === 'black-and-white').length;
const publishedDestinations = destinations.filter((destination) => destination.publicationStatus === 'published').length;
const highQuestions = questions.filter((question) => question.priority === 'HIGH_IMPACT').length;
const report = `# Phase 5 report\n\n## Real content state\n\n| Measure | Count |\n| --- | ---: |\n| Total photographs | ${inventory.photos.length} |\n| Public visibility | ${visibility.public ?? 0} |\n| Private visibility | ${visibility.private ?? 0} |\n| Hold | ${visibility.hold ?? 0} |\n| Unreviewed publication state | ${assignments.filter((item) => item.publicationStatus === 'UNREVIEWED').length} |\n| Destination confirmed | ${autoAssigned} |\n| Destination unassigned | ${assignments.filter((item) => !item.destinationId).length} |\n| Visual world assigned | ${worldAssigned} |\n| Black & White confirmed | ${bw} |\n| People candidates | ${people.length} |\n| People reviewed | ${people.filter((item) => item.privacyStatus !== 'UNKNOWN').length} |\n| Story candidates | ${stories.length} |\n| Journeys | ${journeys.journeys.length} |\n| Published destinations | ${publishedDestinations} |\n| Published stories | 0 |\n| Owner questions | ${questions.length} |\n| High-impact owner questions | ${highQuestions} |\n\n## Implemented\n\nThe owner timeline now assigns destination, country, region where confirmed, journey, source and confidence to every clear capture date without touching masters. Transition photographs remain null. The public catalog exposes only approved-safe geographic fields; exact GPS, source paths and owner notes remain absent.\n\nThe Curation Studio now includes factual dashboard counts, journey/date filtering, filename search, multi-select and batch destination assignment, People classification/privacy, captions, owner notes, publication states, a visual journey timeline, People review and prioritized owner questions. It still writes only browser-local state and explicit JSON exports.\n\nThe Archive now filters by confirmed destination and the viewer links to a destination only when that destination has a published chapter. Japan is the first real public destination page; other places remain in edit rather than receiving thin routes. Content validation runs automatically before every production build.\n\n## Editorial assessment\n\nJapan is the strongest launch body. La Réunion should be developed next. Story candidates 10 and 12 deserve first contact-sheet review. People work must begin with privacy/relationship classification, not public copy. Malaysia's and Thailand's repeated visits are structurally preserved as several journeys under one destination.\n\n## Still unknown\n\nNine transition-day destinations; every person identity and privacy decision; journey titles and introductions; story meaning; public captions; specific cities/places; and 514 visual-world classifications require owner/editor input. Nothing unknown was filled with prose.\n\n## Recommended next step\n\nResolve the three high-impact transition questions, then review Japan story candidates 10 and 12 and the first four People questions. That small set unlocks a truthful journey chapter, one short sequence, and the first consent-aware encounter without requiring all 530 photographs to be completed.\n`;
write('docs/PHASE-5-REPORT.md', report);

console.log('Generated Phase 5 candidate, owner-question, timeline, and final reports.');
