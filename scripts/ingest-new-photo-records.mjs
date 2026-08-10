import { readdir, stat, mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, relative, extname, basename, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import exifr from 'exifr';
import sharp from 'sharp';

const root = process.cwd();
const sourceRoot = join(root, 'assets-source', 'photos');
const inventoryPath = join(root, 'docs', 'photo-inventory.json');
const cacheRoot = join(root, '.photo-inventory-cache');
const thumbsRoot = join(cacheRoot, 'thumbs');

const walk = async (directory) => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => {
  const item = join(directory, entry.name);
  return entry.isDirectory() ? walk(item) : [item];
}))).flat();

const numeric = (value) => {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && value.denominator) return value.numerator / value.denominator;
  return null;
};

const isoDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
};

const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
const knownPaths = new Set(inventory.photos.map((photo) => photo.sourcePath));
const files = (await walk(sourceRoot))
  .filter((file) => ['.jpg', '.jpeg'].includes(extname(file).toLowerCase()))
  .filter((file) => !knownPaths.has(relative(root, file)))
  .sort((a, b) => a.localeCompare(b, 'en'));

await mkdir(thumbsRoot, { recursive: true });
let nextId = Math.max(...inventory.photos.map((photo) => Number(photo.id.replace('photo-', '')))) + 1;

for (const file of files) {
  const sourcePath = relative(root, file);
  const fileStat = await stat(file);
  let metadata = {};
  try {
    metadata = await exifr.parse(file, { tiff: true, exif: true, gps: true, translateValues: true, reviveValues: true, mergeOutput: true }) ?? {};
  } catch (error) {
    metadata = { _readError: error.message };
  }

  const decoded = await sharp(file).metadata();
  const width = metadata.ExifImageWidth ?? metadata.ImageWidth ?? decoded.autoOrient?.width ?? decoded.width ?? null;
  const height = metadata.ExifImageHeight ?? metadata.ImageHeight ?? decoded.autoOrient?.height ?? decoded.height ?? null;
  const aspectRatio = width && height ? width / height : null;
  const id = `photo-${String(nextId).padStart(4, '0')}`;
  const thumbName = `${String(nextId).padStart(4, '0')}-${basename(file).replace(/[^a-z0-9.-]+/gi, '-')}`;
  const thumbPath = join(thumbsRoot, thumbName);
  execFileSync('sips', ['-Z', '520', file, '--out', thumbPath], { stdio: 'ignore' });

  inventory.photos.push({
    id,
    filename: basename(file),
    sourcePath,
    sourceSet: relative(sourceRoot, dirname(file)) || '.',
    file: { bytes: fileStat.size, megabytes: Number((fileStat.size / 1024 / 1024).toFixed(2)), format: extname(file).slice(1).toUpperCase() },
    dimensions: { width, height },
    orientation: aspectRatio == null ? 'unknown' : aspectRatio > 1.05 ? 'landscape' : aspectRatio < .95 ? 'portrait' : 'square',
    aspectRatio: aspectRatio ? Number(aspectRatio.toFixed(4)) : null,
    capture: {
      date: isoDate(metadata.DateTimeOriginal ?? metadata.CreateDate ?? null),
      cameraMake: metadata.Make ?? null,
      cameraModel: metadata.Model ?? null,
      lens: metadata.LensModel ?? metadata.Lens ?? null,
      focalLengthMm: numeric(metadata.FocalLength),
      aperture: numeric(metadata.FNumber),
      iso: metadata.ISO ?? null,
      exposureSeconds: numeric(metadata.ExposureTime),
    },
    gps: metadata.latitude != null && metadata.longitude != null ? { latitude: metadata.latitude, longitude: metadata.longitude, altitudeMeters: numeric(metadata.GPSAltitude) } : null,
    // Ingestion records what the file is, never what the photograph means. Editorial state stays
    // empty until a human reviews it: a category or colour claimed here would flow straight into
    // the public catalog and, in the case of 'black-and-white-candidate', into the monochrome archive.
    editorial: {
      status: 'needs-human-review', visualSubject: null, probableDestination: null, categories: [], humansVisible: null,
      heroPotential: null, supportingPotential: null, mood: [], dominantColors: [], notes: null,
    },
    technical: { metadataReadError: metadata._readError ?? null, thumbnailPath: relative(root, thumbPath) },
  });
  nextId += 1;
}

inventory.photoCount = inventory.photos.length;
inventory.generatedAt = new Date().toISOString();
await writeFile(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);
await writeFile(join(cacheRoot, 'thumb-index.json'), `${JSON.stringify(inventory.photos.map(({ id, filename, sourcePath, technical }) => ({ id, filename, sourcePath, thumbnailPath: technical.thumbnailPath })), null, 2)}\n`);
console.log(`Appended ${files.length} new photo records without renumbering ${inventory.photos.length - files.length} existing records.`);
