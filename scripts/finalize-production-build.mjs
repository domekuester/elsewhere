import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const privateRoute = path.join(dist, 'curate');

if (fs.existsSync(privateRoute)) fs.rmSync(privateRoute, { recursive: true, force: true });

const assets = path.join(dist, '_astro');
if (fs.existsSync(assets)) {
  for (const file of fs.readdirSync(assets)) {
    if (file.startsWith('curate.astro_')) fs.rmSync(path.join(assets, file), { force: true });
  }
}

console.log('Production boundary enforced: /curate/ and its route bundle are absent from dist/.');
