import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const inventory = JSON.parse(fs.readFileSync(path.join(root, 'docs/photo-inventory.json'), 'utf8'));
const outputDir = path.join(root, '.photo-inventory-cache/review-sheets');
fs.mkdirSync(outputDir, { recursive: true });

const columns = 6;
const rows = 6;
const cellWidth = 320;
const cellHeight = 250;
const imageHeight = 210;
const perSheet = columns * rows;

for (let offset = 0; offset < inventory.photos.length; offset += perSheet) {
  const number = String(Math.floor(offset / perSheet) + 1).padStart(2, '0');
  const sheetPath = path.join(outputDir, `sheet-${number}.jpg`);
  if (fs.existsSync(sheetPath)) continue;
  const batch = inventory.photos.slice(offset, offset + perSheet);
  const composite = [];
  for (const [position, photo] of batch.entries()) {
    const left = (position % columns) * cellWidth;
    const top = Math.floor(position / columns) * cellHeight;
    const image = await sharp(path.join(root, photo.sourcePath))
      .rotate()
      .resize(cellWidth, imageHeight, { fit: 'contain', background: '#111111' })
      .jpeg({ quality: 82 })
      .toBuffer();
    const label = Buffer.from(`<svg width="${cellWidth}" height="40"><rect width="100%" height="100%" fill="#111"/><text x="8" y="25" fill="#fff" font-family="Arial" font-size="16">${photo.id} · ${photo.filename.replaceAll('&', '&amp;')}</text></svg>`);
    composite.push({ input: image, left, top });
    composite.push({ input: label, left, top: top + imageHeight });
  }
  await sharp({ create: { width: columns * cellWidth, height: rows * cellHeight, channels: 3, background: '#111111' } })
    .composite(composite)
    .jpeg({ quality: 88 })
    .toFile(sheetPath);
  console.log(`Wrote review sheet ${number}`);
}

const sheets = fs.readdirSync(outputDir).filter((name) => /^sheet-\d+\.jpg$/.test(name)).sort();
const overviewWidth = 480;
const overviewHeight = 375;
const overviewColumns = 4;
const overviewRows = Math.ceil(sheets.length / overviewColumns);
const overviewComposite = await Promise.all(sheets.map(async (name, index) => ({
  input: await sharp(path.join(outputDir, name)).resize(overviewWidth, overviewHeight).jpeg({ quality: 88 }).toBuffer(),
  left: (index % overviewColumns) * overviewWidth,
  top: Math.floor(index / overviewColumns) * overviewHeight
})));
await sharp({ create: { width: overviewColumns * overviewWidth, height: overviewRows * overviewHeight, channels: 3, background: '#111111' } })
  .composite(overviewComposite)
  .jpeg({ quality: 90 })
  .toFile(path.join(outputDir, 'overview.jpg'));
console.log('Wrote review overview');
