import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';
import exifr from 'exifr';

const DIR = 'assets-source/photos/Düsseldorf';
const entries = fs.readdirSync(DIR).filter((f) => !f.startsWith('.'));
const rows = [];
for (const file of entries) {
  const full = path.join(DIR, file);
  const stat = fs.statSync(full);
  const buffer = fs.readFileSync(full);
  const sha = crypto.createHash('sha256').update(buffer).digest('hex');
  let meta = null, exif = null, err = null;
  try { meta = await sharp(full).metadata(); } catch (e) { err = String(e.message); }
  try { exif = await exifr.parse(full, { gps: true, tiff: true, exif: true }); } catch { exif = null; }
  // Monochrome measurement: 99th-percentile per-pixel channel spread. A true greyscale
  // conversion reads 0; low-saturation colour does not.
  let mono = null;
  if (meta) {
    const { data, info } = await sharp(full).resize(128, 128, { fit: 'inside' }).raw().toBuffer({ resolveWithObject: true });
    const spreads = [];
    for (let i = 0; i < data.length; i += info.channels) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      spreads.push(Math.max(r, g, b) - Math.min(r, g, b));
    }
    spreads.sort((a, b) => a - b);
    mono = { p50: spreads[Math.floor(spreads.length * 0.5)], p99: spreads[Math.floor(spreads.length * 0.99)], max: spreads[spreads.length - 1] };
  }
  rows.push({
    file, bytes: stat.size, sha256: sha,
    width: meta?.width ?? null, height: meta?.height ?? null,
    orientation: meta ? (meta.width > meta.height ? 'landscape' : meta.width < meta.height ? 'portrait' : 'square') : null,
    format: meta?.format ?? null, hasICC: Boolean(meta?.icc), density: meta?.density ?? null,
    captureDate: exif?.DateTimeOriginal ? new Date(exif.DateTimeOriginal).toISOString() : null,
    camera: exif?.Model ?? null, lens: exif?.LensModel ?? null,
    iso: exif?.ISO ?? null, fNumber: exif?.FNumber ?? null, exposure: exif?.ExposureTime ?? null,
    focalLength: exif?.FocalLength ?? null,
    gps: (exif?.latitude != null || exif?.longitude != null) ? { lat: exif.latitude, lon: exif.longitude } : null,
    monoSpread: mono, error: err,
  });
}
rows.sort((a, b) => (a.captureDate ?? '').localeCompare(b.captureDate ?? '') || a.file.localeCompare(b.file));
fs.writeFileSync('.tmp-9.25/dusseldorf-inventory.json', JSON.stringify(rows, null, 1));

console.log('TOTAL ENTRIES (excl. dotfiles):', entries.length);
console.log('IMAGE FILES:', rows.filter((r) => r.format).length);
console.log('  jpeg:', rows.filter((r) => r.format === 'jpeg').length, '| png:', rows.filter((r) => r.format === 'png').length, '| raw/other:', rows.filter((r) => r.format && !['jpeg', 'png'].includes(r.format)).length);
console.log('UNREADABLE:', rows.filter((r) => r.error).length);
console.log('ORIENTATION:', rows.reduce((m, r) => ({ ...m, [r.orientation]: (m[r.orientation] ?? 0) + 1 }), {}));
console.log('WITH EXIF CAPTURE DATE:', rows.filter((r) => r.captureDate).length, '/', rows.length);
console.log('WITH GPS:', rows.filter((r) => r.gps).length);
console.log('CAMERAS:', [...new Set(rows.map((r) => r.camera))]);
console.log('DUPLICATE FILENAMES:', entries.length - new Set(entries).size);
console.log('DUPLICATE SHA256 WITHIN FOLDER:', rows.length - new Set(rows.map((r) => r.sha256)).size);
console.log('TRUE MONOCHROME (p99<=4):', rows.filter((r) => r.monoSpread && r.monoSpread.p99 <= 4).map((r) => r.file));
console.log('');
console.log('date'.padEnd(21), 'file'.padEnd(20), 'dims'.padEnd(12), 'orient'.padEnd(10), 'iso'.padEnd(6), 'mono_p99');
for (const r of rows) {
  console.log((r.captureDate ?? 'none').slice(0, 19).padEnd(21), r.file.padEnd(20), `${r.width}x${r.height}`.padEnd(12), (r.orientation ?? '-').padEnd(10), String(r.iso ?? '-').padEnd(6), String(r.monoSpread?.p99 ?? '-'));
}
