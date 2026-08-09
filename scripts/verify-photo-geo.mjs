import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.cwd();
const baseline = JSON.parse(await readFile(join(root, '.photo-geo-cache', 'baseline.json'), 'utf8'));
const manifest = JSON.parse(await readFile(join(root, 'docs', 'photo-geo-manifest.json'), 'utf8'));

const sha256 = (path) => new Promise((resolve, reject) => {
  const hash = createHash('sha256');
  createReadStream(path).on('data', (chunk) => hash.update(chunk)).on('error', reject).on('end', () => resolve(hash.digest('hex')));
});

const baselineByPath = new Map(baseline.photos.map((photo) => [photo.sourcePath, photo]));
const failures = [];
let verified = 0;
let distinctInodes = 0;

for (const photo of manifest.photos) {
  const before = baselineByPath.get(photo.sourcePath);
  if (!before) {
    failures.push(`${photo.sourcePath}: missing from pre-organization baseline`);
    continue;
  }
  const source = join(root, photo.sourcePath);
  const organized = join(root, photo.organizedPath);
  try {
    const [sourceStat, organizedStat, sourceHash, organizedHash] = await Promise.all([
      stat(source), stat(organized), sha256(source), sha256(organized),
    ]);
    if (sourceHash !== before.sha256) failures.push(`${photo.sourcePath}: source hash changed after organization`);
    if (organizedHash !== before.sha256) failures.push(`${photo.organizedPath}: organized hash differs from source baseline`);
    if (sourceStat.size !== organizedStat.size || sourceStat.size !== before.bytes) failures.push(`${photo.sourcePath}: byte-size mismatch`);
    if (Math.abs(sourceStat.mtimeMs - organizedStat.mtimeMs) > 1) failures.push(`${photo.organizedPath}: modification timestamp was not preserved`);
    if (sourceStat.ino !== organizedStat.ino) distinctInodes += 1;
    verified += 1;
  } catch (error) {
    failures.push(`${photo.sourcePath}: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (verified % 50 === 0 || verified === manifest.photos.length) console.log(`Verified ${verified}/${manifest.photos.length}`);
}

const sourcePaths = new Set(baseline.photos.map((photo) => photo.sourcePath));
const manifestSourcePaths = new Set(manifest.photos.map((photo) => photo.sourcePath));
const manifestOrganizedPaths = new Set(manifest.photos.map((photo) => photo.organizedPath));
if (manifest.photos.length !== baseline.totalImages) failures.push(`Manifest record count ${manifest.photos.length} differs from baseline ${baseline.totalImages}`);
if (sourcePaths.size !== manifestSourcePaths.size) failures.push('Not every baseline source path appears exactly once in the geo manifest');
if (manifestOrganizedPaths.size !== manifest.photos.length) failures.push('Organized paths are not unique');

const result = {
  generatedAt: new Date().toISOString(),
  passed: failures.length === 0,
  baselineImageCount: baseline.totalImages,
  manifestRecordCount: manifest.photos.length,
  verifiedSourceFiles: verified,
  verifiedOrganizedFiles: verified,
  distinctSourceAndMirrorInodes: distinctInodes,
  sourceHashesUnchanged: !failures.some((failure) => failure.includes('source hash changed')),
  organizedHashesMatchSource: !failures.some((failure) => failure.includes('organized hash differs')),
  timestampsPreserved: !failures.some((failure) => failure.includes('timestamp')),
  organizedPathsUnique: manifestOrganizedPaths.size === manifest.photos.length,
  allLocationsExplicitlyClassified: manifest.photos.every((photo) => ['confirmed', 'supported', 'unknown'].includes(photo.locationConfidence)),
  failures,
};

const report = `# Photo Organization Verification\n\nGenerated: ${result.generatedAt}\n\n**Result: ${result.passed ? 'PASS' : 'FAIL'}**\n\n- Baseline master images: **${result.baselineImageCount}**\n- Geo manifest records: **${result.manifestRecordCount}**\n- Verified source files: **${result.verifiedSourceFiles}**\n- Verified organized files: **${result.verifiedOrganizedFiles}**\n- Source hashes unchanged: **${result.sourceHashesUnchanged ? 'yes' : 'no'}**\n- Every mirror hash matches its original: **${result.organizedHashesMatchSource ? 'yes' : 'no'}**\n- Modification timestamps preserved: **${result.timestampsPreserved ? 'yes' : 'no'}**\n- Unique organized paths: **${result.organizedPathsUnique ? 'yes' : 'no'}**\n- Separate source/mirror inodes: **${result.distinctSourceAndMirrorInodes}/${result.manifestRecordCount}**\n- Every record has an explicit confidence classification: **${result.allLocationsExplicitlyClassified ? 'yes' : 'no'}**\n\nHash equality proves that the image bitstreams—including embedded metadata—were not recompressed or modified. The original source directory remains the master.\n\n## Failures\n\n${failures.length ? failures.map((failure) => `- ${failure}`).join('\n') : 'None.'}\n`;

await writeFile(join(root, 'docs', 'PHOTO-ORGANIZATION-VERIFICATION.md'), report);
console.log(JSON.stringify(result, null, 2));
if (!result.passed) process.exitCode = 1;
