import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { basename, extname, join, relative } from 'node:path';
import exifr from 'exifr';

const root = process.cwd();
const sourceRoot = join(root, 'assets-source', 'photos');
const cacheRoot = join(root, '.photo-geo-cache');
const docsRoot = join(root, 'docs');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.heic', '.avif', '.webp']);

const walk = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const groups = await Promise.all(entries.map(async (entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return groups.flat();
};

const sha256 = (path) => new Promise((resolve, reject) => {
  const hash = createHash('sha256');
  createReadStream(path).on('data', (chunk) => hash.update(chunk)).on('error', reject).on('end', () => resolve(hash.digest('hex')));
});

const toIso = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.valueOf()) ? null : date.toISOString();
};

const normalizeNumber = (value) => typeof value === 'number' && Number.isFinite(value) ? value : null;
const files = (await walk(sourceRoot)).sort((a, b) => a.localeCompare(b, 'en'));
const images = files.filter((path) => imageExtensions.has(extname(path).toLowerCase()));
const nonImages = files.filter((path) => !imageExtensions.has(extname(path).toLowerCase()));

await mkdir(cacheRoot, { recursive: true });
await mkdir(docsRoot, { recursive: true });

const records = [];
for (let i = 0; i < images.length; i += 1) {
  const path = images[i];
  const fileStat = await stat(path);
  let metadata = {};
  let gps = null;
  let metadataError = null;
  try {
    metadata = await exifr.parse(path, {
      tiff: true, exif: true, gps: true, interop: true,
      translateValues: true, reviveValues: true, mergeOutput: true,
    }) ?? {};
    gps = await exifr.gps(path);
  } catch (error) {
    metadataError = error instanceof Error ? error.message : String(error);
  }
  const latitude = normalizeNumber(gps?.latitude ?? metadata.latitude);
  const longitude = normalizeNumber(gps?.longitude ?? metadata.longitude);
  records.push({
    filename: basename(path),
    sourcePath: relative(root, path),
    extension: extname(path).slice(1).toUpperCase(),
    bytes: fileStat.size,
    modifiedAt: fileStat.mtime.toISOString(),
    sha256: await sha256(path),
    captureDate: toIso(metadata.DateTimeOriginal ?? metadata.CreateDate ?? metadata.ModifyDate),
    latitude,
    longitude,
    altitude: normalizeNumber(metadata.GPSAltitude),
    camera: [metadata.Make, metadata.Model].filter(Boolean).join(' ') || null,
    lens: metadata.LensModel ?? metadata.Lens ?? null,
    orientation: metadata.Orientation ?? null,
    metadataError,
  });
  if ((i + 1) % 50 === 0 || i + 1 === images.length) console.log(`Audited ${i + 1}/${images.length}`);
}

const groupBy = (items, keyFn) => {
  const groups = new Map();
  for (const item of items) {
    const key = keyFn(item);
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return [...groups.entries()].filter(([, group]) => group.length > 1);
};

const filenameDuplicates = groupBy(records, (record) => record.filename.toLocaleLowerCase('en'))
  .map(([filename, group]) => ({ filename, paths: group.map((record) => record.sourcePath) }));
const contentDuplicates = groupBy(records, (record) => record.sha256)
  .map(([hash, group]) => ({ sha256: hash, paths: group.map((record) => record.sourcePath) }));
const formatCounts = Object.fromEntries([...new Set(records.map((record) => record.extension))].sort().map((format) => [format, records.filter((record) => record.extension === format).length]));
const gpsCount = records.filter((record) => record.latitude != null && record.longitude != null).length;
const errorRecords = records.filter((record) => record.metadataError);

const baseline = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourceRoot: relative(root, sourceRoot),
  totalFilesystemFiles: files.length,
  totalImages: records.length,
  nonImageFiles: nonImages.map((path) => relative(root, path)),
  imageFormats: formatCounts,
  filesWithGps: gpsCount,
  filesWithoutGps: records.length - gpsCount,
  duplicateFilenames: filenameDuplicates,
  duplicateFiles: contentDuplicates,
  metadataExtractionErrors: errorRecords.map(({ filename, sourcePath, metadataError }) => ({ filename, sourcePath, error: metadataError })),
  photos: records,
};

await writeFile(join(cacheRoot, 'baseline.json'), `${JSON.stringify(baseline, null, 2)}\n`);

const duplicateSection = contentDuplicates.length
  ? contentDuplicates.map((candidate, index) => `### Content duplicate group ${index + 1}\n\nSHA-256: \`${candidate.sha256}\`\n\n${candidate.paths.map((path) => `- \`${path}\``).join('\n')}`).join('\n\n')
  : 'No byte-identical image files were found.';
const filenameSection = filenameDuplicates.length
  ? filenameDuplicates.map((candidate) => `- **${candidate.filename}**\n${candidate.paths.map((path) => `  - \`${path}\``).join('\n')}`).join('\n')
  : 'No duplicate image basenames were found (case-insensitive comparison).';

const report = `# Photo Organization — Before\n\nGenerated: ${baseline.generatedAt}\n\n## Safety baseline\n\n- Master source: \`${baseline.sourceRoot}/\`\n- Total filesystem files: **${baseline.totalFilesystemFiles}**\n- Image files: **${baseline.totalImages}**\n- Non-image files: **${nonImages.length}** (${nonImages.map((path) => `\`${relative(root, path)}\``).join(', ') || 'none'})\n- Image formats: ${Object.entries(formatCounts).map(([format, count]) => `**${format}: ${count}**`).join(', ')}\n- Files with GPS: **${baseline.filesWithGps}**\n- Files without GPS: **${baseline.filesWithoutGps}**\n- Metadata extraction errors: **${errorRecords.length}**\n- Duplicate filename groups: **${filenameDuplicates.length}**\n- Byte-identical duplicate groups: **${contentDuplicates.length}**\n- Integrity method: SHA-256 over every image file\n\nNo source file was modified during this audit.\n\n## Duplicate filenames\n\n${filenameSection}\n\n## Duplicate file candidates\n\n${duplicateSection}\n\n## Metadata extraction errors\n\n${errorRecords.length ? errorRecords.map((record) => `- \`${record.sourcePath}\`: ${record.metadataError}`).join('\n') : 'No EXIF extraction errors were recorded.'}\n\n## Complete filename list\n\n${records.map((record) => `- \`${record.sourcePath}\``).join('\n')}\n`;
await writeFile(join(docsRoot, 'PHOTO-ORGANIZATION-BEFORE.md'), report);

console.log(JSON.stringify({ images: records.length, gps: gpsCount, duplicateFilenameGroups: filenameDuplicates.length, duplicateContentGroups: contentDuplicates.length, errors: errorRecords.length }, null, 2));
