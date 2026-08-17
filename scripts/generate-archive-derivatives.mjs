import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'docs/photo-inventory.json'), 'utf8'));
const curation = JSON.parse(fs.readFileSync(path.join(root, 'data/photo-curation.json'), 'utf8'));
const exclusions = JSON.parse(fs.readFileSync(path.join(root, 'data/public-image-exclusions.json'), 'utf8'));
const publicExclusions = new Set([
  ...exclusions.ownerRejected.map((item) => item.photoId),
  ...exclusions.duplicateFamilies.flatMap((family) => family.excludeIds)
]);

// Phase 10.3 — the viewer tier carries 72% of the published payload, and GitHub Pages refuses to
// publish a site larger than 1 GB. Its quality moved 90 → 86 and nothing else changed: the 3200px
// long edge is retained, so a viewer on a 1440px retina display still receives more pixels than it
// can show, and 4:4:4 chroma is retained, which is what actually protects saturated colour edges.
//
// Measured on a 14-frame sample chosen from the pixels rather than from tags — the largest files,
// the darkest frames, the highest-detail frames, portraits, monochrome, foliage, architecture and
// smooth sky: luma SSIM 0.970 average and 0.937 worst case, 39.4 dB PSNR, mean chroma ΔE 1.17.
// Side-by-side 1:1 crops and full-frame views at 1440px showed no visible artefacts, banding, or
// loss of shadow detail. 4:2:0 would have saved more but tripled chroma error (ΔE max 39), which
// on this archive's saturated frames is a visible cost; it was rejected for that reason.
const roles = [
  { name: 'thumbnails', max: 960, quality: 84, chromaSubsampling: '4:2:0' },
  { name: 'archive', max: 1800, quality: 86, chromaSubsampling: '4:4:4' },
  { name: 'viewer', max: 3200, quality: 86, chromaSubsampling: '4:4:4' }
];
const outputRoot = path.join(root, 'public/assets-derived');
for (const role of roles) fs.mkdirSync(path.join(outputRoot, role.name), { recursive: true });

let generated = 0;
let removed = 0;
const publicPhotos = [];

for (const [index, photo] of inventory.photos.entries()) {
  const baseName = `${String(index + 1).padStart(4, '0')}-${path.parse(photo.filename).name}.jpg`;
  const visibility = curation.assignments?.[photo.id]?.visibility ?? 'hold';
  // Must stay identical to the withheld set in scripts/build-photo-catalog.mjs and
  // scripts/validate-content.mjs. Regeneration is exactly the moment a withheld photograph could
  // silently return, so `editorial-hold` has to be honoured here too — not only in the catalog.
  const publicAllowed = !publicExclusions.has(photo.id) && !['private', 'do-not-publish', 'editorial-hold'].includes(visibility);
  if (!publicAllowed) {
    for (const role of roles) {
      const target = path.join(outputRoot, role.name, baseName);
      if (fs.existsSync(target)) { fs.unlinkSync(target); removed += 1; }
    }
    continue;
  }
  publicPhotos.push({ photo, baseName });
}

// Masters live outside git and are read-only to this project, so one can disappear from the source
// folder between runs — a reorganisation, a rename, a card that was tidied up. When that happened the
// whole pipeline threw on the missing file and nothing downstream regenerated. A vanished master is
// worth knowing about, not worth halting on: the frame is skipped, its existing derivatives are left
// exactly as they are, and it is named loudly at the end.
const missingMasters = publicPhotos.filter((item) => !fs.existsSync(path.join(root, item.photo.sourcePath)));
const renderable = publicPhotos.filter((item) => fs.existsSync(path.join(root, item.photo.sourcePath)));

let cursor = 0;
const workers = Array.from({ length: 4 }, async () => {
  while (cursor < renderable.length) {
    const current = renderable[cursor++];
    const source = path.join(root, current.photo.sourcePath);
    for (const role of roles) {
      const target = path.join(outputRoot, role.name, current.baseName);
      await sharp(source)
        .rotate()
        .resize({ width: role.max, height: role.max, fit: 'inside', withoutEnlargement: true })
        .keepIccProfile()
        .jpeg({ quality: role.quality, chromaSubsampling: role.chromaSubsampling, mozjpeg: true })
        .toFile(target);
      generated += 1;
    }
    if (cursor % 50 === 0) console.log(`Processed ${cursor}/${renderable.length} public photographs…`);
  }
});

await Promise.all(workers);
fs.writeFileSync(path.join(outputRoot, 'PIPELINE.json'), `${JSON.stringify({
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  colorPolicy: 'Embedded ICC profiles retained; no visual filters or artificial sharpening.',
  roles: Object.fromEntries(roles.map(({ name, max, quality, chromaSubsampling }) => [name, { maxDimension: max, jpegQuality: quality, chromaSubsampling, withoutEnlargement: true }]))
}, null, 2)}\n`);
console.log(`Role-correct derivatives ready: ${generated} generated across ${renderable.length} photographs; ${removed} forbidden derivatives removed.`);
if (missingMasters.length) {
  console.warn(`\nWARNING — ${missingMasters.length} public photograph(s) have no source master and were skipped.`);
  console.warn('Existing derivatives were left untouched, so the site still serves them, but they can no longer be regenerated:');
  for (const item of missingMasters) console.warn(`  ${item.photo.id}  ${item.photo.sourcePath}`);
}
