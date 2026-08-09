import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const inventoryPath = path.join(root, 'docs/photo-inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
let repaired = 0;

for (const photo of inventory.photos) {
  if (photo.dimensions?.width && photo.dimensions?.height) continue;
  const metadata = await sharp(path.join(root, photo.sourcePath)).metadata();
  const width = metadata.autoOrient?.width ?? metadata.width ?? null;
  const height = metadata.autoOrient?.height ?? metadata.height ?? null;
  if (!width || !height) throw new Error(`Unable to decode dimensions for ${photo.filename}`);
  photo.dimensions = { width, height };
  photo.aspectRatio = Number((width / height).toFixed(4));
  photo.orientation = photo.aspectRatio > 1.05 ? 'landscape' : photo.aspectRatio < .95 ? 'portrait' : 'square';
  repaired += 1;
}

fs.writeFileSync(inventoryPath, `${JSON.stringify(inventory, null, 2)}\n`);
console.log(`Repaired decoded dimensions for ${repaired} inventory records.`);
