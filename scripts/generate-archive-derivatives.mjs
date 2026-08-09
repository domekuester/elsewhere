import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'docs/photo-inventory.json'), 'utf8'));
const curation = JSON.parse(fs.readFileSync(path.join(root, 'data/photo-curation.json'), 'utf8'));
const exclusions = JSON.parse(fs.readFileSync(path.join(root, 'data/public-image-exclusions.json'), 'utf8'));
const publicExclusions = new Set([
  ...exclusions.ownerRejected.map((item) => item.photoId),
  ...exclusions.duplicateFamilies.flatMap((family) => family.excludeIds)
]);
const outputDir = path.join(root, 'public/assets-derived/archive');
fs.mkdirSync(outputDir, { recursive: true });

let generated = 0;
let reused = 0;
for (const [index, photo] of inventory.photos.entries()) {
  const safeName = `${String(index + 1).padStart(4, '0')}-${path.parse(photo.filename).name}.jpg`;
  const target = path.join(outputDir, safeName);
  const visibility = curation.assignments?.[photo.id]?.visibility ?? 'hold';
  if (publicExclusions.has(photo.id) || ['private', 'do-not-publish'].includes(visibility)) {
    if (fs.existsSync(target)) fs.unlinkSync(target);
    continue;
  }
  if (fs.existsSync(target) && fs.statSync(target).size > 10_000) {
    reused += 1;
    continue;
  }
  const source = path.join(root, photo.sourcePath);
  const result = spawnSync('sips', ['-Z', '1600', '-s', 'format', 'jpeg', '-s', 'formatOptions', '78', source, '--out', target], { stdio: 'ignore' });
  if (result.status !== 0) throw new Error(`Derivative failed: ${photo.filename}`);
  generated += 1;
  if (generated % 50 === 0) console.log(`Generated ${generated} archive derivatives…`);
}
console.log(`Archive derivatives ready: ${generated} generated, ${reused} reused.`);
