import fs from 'node:fs';
import path from 'node:path';

const errors = [];
const read = (file) => fs.readFileSync(file, 'utf8');
const exclusions = JSON.parse(read('data/public-image-exclusions.json'));
const forbiddenTokens = exclusions.ownerRejected.flatMap((item) => [item.photoId, item.filename, path.parse(item.filename).name]);
const htmlFiles = [];
const walk = (directory) => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    entry.isDirectory() ? walk(absolute) : entry.name.endsWith('.html') && htmlFiles.push(absolute);
  }
};

walk('dist');
if (!fs.existsSync('dist/sitemap.xml')) errors.push('Missing dist/sitemap.xml');
if (!fs.existsSync('dist/robots.txt')) errors.push('Missing dist/robots.txt');
if (fs.existsSync('dist/curate')) errors.push('Private /curate/ route exists in production output');
if (fs.existsSync('dist/_astro') && fs.readdirSync('dist/_astro').some((file) => file.startsWith('curate.astro_'))) errors.push('Private curation bundle exists in production output');

const canonicalValues = new Map();
const titleValues = new Map();
for (const file of htmlFiles) {
  const html = read(file);
  const is404 = file.endsWith('404.html');
  if (!is404 && !/<link rel="canonical" href="[^"]+">/.test(html)) errors.push(`${file} has no canonical URL`);
  if (!is404 && !/<meta property="og:image" content="[^"]+">/.test(html)) errors.push(`${file} has no Open Graph image`);
  if (!is404 && !/<meta name="twitter:image" content="[^"]+">/.test(html)) errors.push(`${file} has no Twitter image`);
  if (!is404 && !/<meta name="description" content="[^"].+?">/.test(html)) errors.push(`${file} has no meta description`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  if (canonical) {
    if (canonicalValues.has(canonical)) errors.push(`Duplicate canonical ${canonical}: ${canonicalValues.get(canonical)} and ${file}`);
    canonicalValues.set(canonical, file);
  }
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (title && !is404) {
    if (titleValues.has(title)) errors.push(`Duplicate title ${title}: ${titleValues.get(title)} and ${file}`);
    titleValues.set(title, file);
  }
  const socialPath = html.match(/<meta property="og:image" content="https?:\/\/[^/]+(\/[^\"]+)">/)?.[1];
  if (socialPath && !fs.existsSync(path.join('dist', socialPath))) errors.push(`${file} references missing social image ${socialPath}`);
  if (forbiddenTokens.some((token) => html.includes(token))) errors.push(`${file} contains an owner-rejected photograph reference`);
}

for (const item of exclusions.ownerRejected) {
  const inventory = JSON.parse(read('docs/photo-inventory.json'));
  const index = inventory.photos.findIndex((photo) => photo.id === item.photoId);
  if (index < 0) continue;
  const derivativeName = `${String(index + 1).padStart(4, '0')}-${path.parse(item.filename).name}.jpg`;
  for (const role of ['thumbnails', 'archive', 'viewer']) if (fs.existsSync(path.join('dist/assets-derived', role, derivativeName))) errors.push(`Production exposes ${item.photoId} ${role} derivative`);
}

const robots = fs.existsSync('dist/robots.txt') ? read('dist/robots.txt') : '';
if (!robots.includes('Disallow: /curate/')) errors.push('robots.txt does not disallow /curate/');
const sitemap = fs.existsSync('dist/sitemap.xml') ? read('dist/sitemap.xml') : '';
if (sitemap.includes('/curate/')) errors.push('sitemap.xml exposes /curate/');

if (errors.length) {
  console.error(`Launch validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}

console.log(`Launch validation passed: ${htmlFiles.length} public HTML files, unique canonicals, complete social metadata, private route excluded.`);
