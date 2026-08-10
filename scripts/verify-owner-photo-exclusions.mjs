// Owner photo exclusions are authoritative. This verifies that every canonically
// rejected photograph carries the correct publication state and has zero public
// references across data, source surfaces, generated output, and the built site.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));

const exclusions = read('data/public-image-exclusions.json');
const curation = read('data/photo-curation.json');
const destinations = read('data/destinations.json');
const rejected = exclusions.ownerRejected;
const rejectedIds = new Set(rejected.map((item) => item.photoId));
const failures = [];
const fail = (photoId, message) => failures.push(`${photoId}: ${message}`);

// Public surfaces that must never reference a rejected photograph, by stable id or by filename.
const publicSurfaces = [
  'public/data/photo-catalog.json',
  'src/data/editorial-selection.ts',
  ...fs.readdirSync(path.join(root, 'src/pages'), { recursive: true })
    .map((entry) => path.join('src/pages', entry))
    .filter((entry) => /\.(astro|ts)$/.test(entry)),
  ...fs.readdirSync(path.join(root, 'src/components'))
    .map((entry) => path.join('src/components', entry))
    .filter((entry) => entry.endsWith('.astro')),
].filter((entry) => fs.existsSync(path.join(root, entry)));

const surfaceText = new Map(publicSurfaces.map((entry) => [entry, fs.readFileSync(path.join(root, entry), 'utf8')]));

// `--built` additionally audits dist/. Without it only the sources are checked, so a stale
// build from before an exclusion cannot block the build that is about to replace it.
const auditBuiltOutput = process.argv.includes('--built');
const distDirectory = path.join(root, 'dist');
const distFiles = auditBuiltOutput && fs.existsSync(distDirectory)
  ? fs.readdirSync(distDirectory, { recursive: true })
    .map((entry) => path.join(distDirectory, entry))
    .filter((entry) => /\.(html|json|js|xml|txt)$/.test(entry) && fs.statSync(entry).isFile())
  : [];
const distText = new Map(distFiles.map((file) => [path.relative(root, file), fs.readFileSync(file, 'utf8')]));

const derivativeDirectories = ['thumbnails', 'archive', 'viewer'].map((role) => path.join(root, 'public/assets-derived', role));

for (const item of rejected) {
  const { photoId, filename } = item;
  const stem = path.parse(filename).name;
  const assignment = curation.assignments?.[photoId];

  if (!assignment) fail(photoId, 'missing curation record');
  else {
    if (assignment.visibility !== 'do-not-publish') fail(photoId, `visibility is "${assignment.visibility}", expected "do-not-publish"`);
    if (assignment.publicationStatus !== 'PRIVATE') fail(photoId, `publicationStatus is "${assignment.publicationStatus}", expected "PRIVATE"`);
    if (assignment.ownerDecision !== 'OWNER_REJECTED') fail(photoId, `ownerDecision is "${assignment.ownerDecision}", expected "OWNER_REJECTED"`);
    if (assignment.featured) fail(photoId, 'still marked featured');
    if (assignment.peopleCandidate) fail(photoId, 'still marked peopleCandidate');
    if (assignment.storyCandidate) fail(photoId, 'still marked storyCandidate');
  }

  for (const [surface, text] of surfaceText) {
    if (text.includes(photoId)) fail(photoId, `referenced by stable id in ${surface}`);
    if (text.includes(filename) || text.includes(stem)) fail(photoId, `referenced by filename in ${surface}`);
  }

  for (const [file, text] of distText) {
    if (text.includes(photoId) || text.includes(stem)) fail(photoId, `referenced in built output ${file}`);
  }

  for (const directory of derivativeDirectories) {
    if (!fs.existsSync(directory)) continue;
    const leaked = fs.readdirSync(directory).filter((file) => file.includes(stem));
    if (leaked.length) fail(photoId, `public derivative still present: ${path.relative(root, path.join(directory, leaked[0]))}`);
  }

  for (const destination of destinations.destinations) {
    if (destination.heroPhotoId === photoId) fail(photoId, `used as ${destination.id} hero`);
    if ((destination.manualOrder ?? []).includes(photoId)) fail(photoId, `present in ${destination.id} manualOrder`);
    if ((destination.featuredPhotoIds ?? []).includes(photoId)) fail(photoId, `present in ${destination.id} featuredPhotoIds`);
  }
}

// A rejected photograph may keep its factual destination truth, but must never raise a publishable count.
for (const destination of destinations.destinations) {
  const publishable = destination.photoIds.filter((id) => {
    const assignment = curation.assignments?.[id];
    return !rejectedIds.has(id) && assignment && !['private', 'do-not-publish'].includes(assignment.visibility ?? 'hold');
  }).length;
  if (destination.confirmedPhotoCount !== publishable) {
    failures.push(`${destination.id}: confirmedPhotoCount ${destination.confirmedPhotoCount} does not match ${publishable} publishable photographs`);
  }
}

if (failures.length) {
  console.error(`Owner exclusion verification FAILED (${failures.length} problem${failures.length === 1 ? '' : 's'}):`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Owner exclusion verification PASS — ${rejected.length} rejected photographs, 0 public references across ${surfaceText.size} source surfaces, ${auditBuiltOutput ? `${distText.size} built files` : 'built output not audited (pass --built)'}, and ${derivativeDirectories.length} derivative directories.`);
