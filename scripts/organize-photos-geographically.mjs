import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, relative } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const root = process.cwd();
const sourceRoot = join(root, 'assets-source', 'photos');
const organizedRoot = join(root, 'assets-source', 'photos-organized');
const baselinePath = join(root, '.photo-geo-cache', 'baseline.json');
const geoManifestPath = join(root, 'docs', 'photo-geo-manifest.json');
const reportPath = join(root, 'docs', 'PHOTO-GEO-REPORT.md');
const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
const photoInventory = JSON.parse(await readFile(join(root, 'docs', 'photo-inventory.json'), 'utf8'));
const inventoryByPath = new Map(photoInventory.photos.map((photo) => [photo.sourcePath, photo]));

const sha256 = (path) => new Promise((resolve, reject) => {
  const hash = createHash('sha256');
  createReadStream(path).on('data', (chunk) => hash.update(chunk)).on('error', reject).on('end', () => resolve(hash.digest('hex')));
});

const slug = (value) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'root';

const exists = async (path) => {
  try { await access(path); return true; } catch { return false; }
};

const buildUnknownPath = (photo) => {
  const sourceRelativeToPhotoRoot = relative(sourceRoot, join(root, photo.sourcePath));
  const sourceDir = dirname(sourceRelativeToPhotoRoot);
  return join(organizedRoot, '_UNSORTED', slug(sourceDir), photo.filename);
};

// No reverse-geocoding dependency is used in this collection because the verified
// baseline contains no coordinates. Country directories must derive from actual
// geocoded records; an empty set therefore produces no country directories.
const records = baseline.photos.map((photo) => {
  const hasGps = photo.latitude != null && photo.longitude != null;
  if (hasGps) {
    throw new Error(`GPS exists for ${photo.sourcePath}, but no reviewed offline reverse-geocoder is configured. Refusing to guess or organize it.`);
  }
  const inventoryPhoto = inventoryByPath.get(photo.sourcePath);
  return {
    id: `geo-${photo.sha256.slice(0, 16)}`,
    filename: photo.filename,
    sourcePath: photo.sourcePath,
    organizedPath: relative(root, buildUnknownPath(photo)),
    sha256: photo.sha256,
    bytes: photo.bytes,
    format: photo.extension,
    captureDate: photo.captureDate,
    latitude: photo.latitude,
    longitude: photo.longitude,
    altitude: photo.altitude,
    camera: photo.camera,
    lens: photo.lens,
    orientation: inventoryPhoto?.orientation ?? photo.orientation,
    country: null,
    countryCode: null,
    region: null,
    place: null,
    territory: null,
    locationConfidence: 'unknown',
    locationEvidence: 'No embedded GPS coordinates. No GPS-confirmed adjacent sequence exists, so SUPPORTED status cannot be established.',
    publicLocation: {
      country: null,
      region: null,
      place: null,
      exactCoordinatesApproved: false,
    },
  };
});

await mkdir(organizedRoot, { recursive: true });
let cloned = 0;
let reused = 0;
for (const record of records) {
  const source = join(root, record.sourcePath);
  let destination = join(root, record.organizedPath);
  await mkdir(dirname(destination), { recursive: true });
  if (await exists(destination)) {
    const existingHash = await sha256(destination);
    if (existingHash === record.sha256) {
      reused += 1;
      continue;
    }
    const extension = extname(destination);
    const stem = basename(destination, extension);
    destination = join(dirname(destination), `${stem}--${record.sha256.slice(0, 8)}${extension}`);
    if (await exists(destination)) throw new Error(`Collision-safe destination already exists: ${relative(root, destination)}`);
    record.organizedPath = relative(root, destination);
    record.organizationNote = 'Mirror filename received a hash suffix because a different file occupied the collision target. Original filename and source were unchanged.';
  }
  await execFileAsync('cp', ['-c', '-p', source, destination]);
  cloned += 1;
  if ((cloned + reused) % 50 === 0 || cloned + reused === records.length) console.log(`Mirrored ${cloned + reused}/${records.length}`);
}

const geoManifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  privacy: {
    rawCoordinatesAreInternal: true,
    publicCoordinatesDefault: 'hidden',
    note: 'Public consumers must use publicLocation. Exact coordinates require explicit approval per image.',
  },
  organization: {
    method: 'APFS clone-on-write copy using cp -c -p',
    destructive: false,
    sourceRoot: relative(root, sourceRoot),
    organizedRoot: relative(root, organizedRoot),
    preservesOriginals: true,
    preservesBytes: true,
    preservesTimestamps: true,
    filenameCollisionStrategy: 'Preserve the relative source-set directory. If a conflicting different file still exists, add the first 8 SHA-256 characters to the mirror filename only.',
  },
  summary: {
    total: records.length,
    confirmed: records.filter((record) => record.locationConfidence === 'confirmed').length,
    supported: records.filter((record) => record.locationConfidence === 'supported').length,
    unknown: records.filter((record) => record.locationConfidence === 'unknown').length,
  },
  countries: [],
  photos: records,
};

await writeFile(geoManifestPath, `${JSON.stringify(geoManifest, null, 2)}\n`);

const unsortedRows = records.map((record) => `| \`${record.filename}\` | \`${record.sourcePath}\` | ${record.locationEvidence} |`).join('\n');
const report = `# Photo Geo Report\n\nGenerated: ${geoManifest.generatedAt}\n\n## Summary\n\n- Total photographs: **${records.length}**\n- GPS confirmed: **${geoManifest.summary.confirmed}**\n- Supported: **${geoManifest.summary.supported}**\n- Unknown: **${geoManifest.summary.unknown}**\n- Unsorted: **${geoManifest.summary.unknown}**\n\n## Country distribution\n\nNo countries were assigned. The complete collection lacks embedded GPS coordinates, and no GPS-confirmed sequence exists from which SUPPORTED status could be established. Creating country totals would therefore require guessing, which this workflow explicitly refuses.\n\n- **_UNSORTED — ${geoManifest.summary.unknown}**\n\n## Reverse-geocoding method\n\nNo reverse-geocoding API, dependency, or geographic dataset was added. The independent EXIF audit found zero latitude/longitude pairs, so a reverse-geocoder would have no inputs. When GPS-bearing photographs are added later, the pipeline should use a versioned offline boundary dataset or a reproducible free geocoder with cached responses. France must be resolved beyond the country boundary so overseas departments such as La Réunion receive meaningful territory/region paths.\n\n## Organization method\n\nThe organized tree is a non-destructive APFS clone-on-write mirror created with \`cp -c -p\`. This preserves file bytes, metadata, and timestamps without recompression while avoiding an immediate second 4.60 GB physical allocation. Clone destinations are independent on write. Original masters remain in \`assets-source/photos/\`.\n\nUnknown images are stored under \`assets-source/photos-organized/_UNSORTED/<source-set>/\`. Retaining a source-set subdirectory prevents basename collisions. A different file occupying the same final path would receive a short SHA-256 suffix in the mirror only; no source filename would change.\n\n## Privacy\n\nRaw coordinates are internal manifest data. Public website consumers must use the separate \`publicLocation\` object, which omits exact coordinates unless an individual image is explicitly approved.\n\n## Unsorted reasons\n\nEvery image is listed because each remains uncertain.\n\n| Filename | Source | Reason |\n|---|---|---|\n${unsortedRows}\n`;
await writeFile(reportPath, report);

console.log(JSON.stringify({ cloned, reused, total: records.length, manifest: relative(root, geoManifestPath), report: relative(root, reportPath) }, null, 2));
