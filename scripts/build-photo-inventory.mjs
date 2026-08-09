import { readdir, stat, mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, relative, extname, basename, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import exifr from 'exifr';

const root = process.cwd();
const sourceRoot = join(root, 'assets-source', 'photos');
const cacheRoot = join(root, '.photo-inventory-cache');
const thumbsRoot = join(cacheRoot, 'thumbs');
const docsRoot = join(root, 'docs');

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return paths.flat();
};

const rational = (value) => {
  if (value == null) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'object' && 'numerator' in value && 'denominator' in value) {
    return value.denominator ? value.numerator / value.denominator : null;
  }
  return null;
};

const isoDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
};

await mkdir(thumbsRoot, { recursive: true });
await mkdir(docsRoot, { recursive: true });

const files = (await walk(sourceRoot))
  .filter((path) => ['.jpg', '.jpeg', '.png', '.tif', '.tiff'].includes(extname(path).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, 'en'));

const previousPath = join(docsRoot, 'photo-inventory.json');
let previousByPath = new Map();
try {
  const previous = JSON.parse(await readFile(previousPath, 'utf8'));
  previousByPath = new Map(previous.photos.map((photo) => [photo.sourcePath, photo]));
} catch {}

const photos = [];
for (let index = 0; index < files.length; index += 1) {
  const path = files[index];
  const sourcePath = relative(root, path);
  const fileStat = await stat(path);
  let metadata = {};
  try {
    metadata = await exifr.parse(path, {
      tiff: true, exif: true, gps: true, interop: true, ifd1: false,
      translateValues: true, reviveValues: true, mergeOutput: true,
    }) ?? {};
  } catch (error) {
    metadata = { _readError: error.message };
  }

  const width = metadata.ExifImageWidth ?? metadata.ImageWidth ?? null;
  const height = metadata.ExifImageHeight ?? metadata.ImageHeight ?? null;
  const ratio = width && height ? width / height : null;
  const orientation = ratio == null ? 'unknown' : ratio > 1.05 ? 'landscape' : ratio < 0.95 ? 'portrait' : 'square';
  const previous = previousByPath.get(sourcePath);
  const thumbName = `${String(index + 1).padStart(4, '0')}-${basename(path).replace(/[^a-z0-9.-]+/gi, '-')}`;
  const thumbPath = join(thumbsRoot, thumbName);
  try {
    await stat(thumbPath);
  } catch {
    execFileSync('sips', ['-Z', '520', path, '--out', thumbPath], { stdio: 'ignore' });
  }

  photos.push({
    id: `photo-${String(index + 1).padStart(4, '0')}`,
    filename: basename(path),
    sourcePath,
    sourceSet: relative(sourceRoot, dirname(path)) || '.',
    file: {
      bytes: fileStat.size,
      megabytes: Number((fileStat.size / 1024 / 1024).toFixed(2)),
      format: extname(path).slice(1).toUpperCase(),
    },
    dimensions: { width, height },
    orientation,
    aspectRatio: ratio ? Number(ratio.toFixed(4)) : null,
    capture: {
      date: isoDate(metadata.DateTimeOriginal ?? metadata.CreateDate ?? metadata.ModifyDate),
      cameraMake: metadata.Make ?? null,
      cameraModel: metadata.Model ?? null,
      lens: metadata.LensModel ?? metadata.Lens ?? null,
      focalLengthMm: rational(metadata.FocalLength),
      aperture: rational(metadata.FNumber),
      iso: metadata.ISO ?? null,
      exposureSeconds: rational(metadata.ExposureTime),
    },
    gps: metadata.latitude != null && metadata.longitude != null
      ? { latitude: metadata.latitude, longitude: metadata.longitude, altitudeMeters: rational(metadata.GPSAltitude) }
      : null,
    editorial: previous?.editorial ?? {
      status: 'needs-human-review',
      visualSubject: null,
      probableDestination: null,
      categories: [],
      humansVisible: null,
      heroPotential: null,
      supportingPotential: null,
      mood: [],
      dominantColors: [],
      notes: null,
    },
    technical: {
      metadataReadError: metadata._readError ?? null,
      thumbnailPath: relative(root, thumbPath),
    },
  });
}

const manifest = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourcePolicy: 'Master source files. Never modify, move, rename, or serve directly in production.',
  sourceRoot: relative(root, sourceRoot),
  photoCount: photos.length,
  photos,
};

await writeFile(previousPath, `${JSON.stringify(manifest, null, 2)}\n`);
await writeFile(join(cacheRoot, 'thumb-index.json'), `${JSON.stringify(photos.map(({ id, filename, sourcePath, technical }) => ({ id, filename, sourcePath, thumbnailPath: technical.thumbnailPath })), null, 2)}\n`);
console.log(`Wrote ${photos.length} records to ${relative(root, previousPath)}`);
