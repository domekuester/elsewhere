import fs from 'node:fs';
import path from 'node:path';

const errors = [];
const read = (file) => fs.readFileSync(file, 'utf8');

// Astro loads .env through Vite, so this script reads it too rather than reporting owner
// actions for values the build actually had.
if (fs.existsSync('.env')) {
  for (const line of read('.env').split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}
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

// Phase 9 — launch surfaces, discovery and the commercial layer.
const ownerActions = [];
const sitemapPaths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((match) => match[1]);
for (const route of sitemapPaths) {
  const file = route === '/' ? 'dist/index.html' : path.join('dist', route, 'index.html');
  if (!fs.existsSync(file)) { errors.push(`sitemap lists ${route} but ${file} was not built`); continue; }
  if (/<meta name="robots" content="[^"]*noindex/.test(read(file))) errors.push(`sitemap lists ${route} but the page is noindex`);
}

// A page kept out of search must say so on the page, not merely be absent from the sitemap.
for (const file of htmlFiles) {
  const html = read(file);
  const route = `/${path.relative('dist', path.dirname(file))}/`.replace('/./', '/');
  const listed = sitemapPaths.includes(route) || (route === '//' && sitemapPaths.includes('/'));
  const noindexed = /<meta name="robots" content="[^"]*noindex/.test(html);
  if (!listed && !noindexed && !file.endsWith('404.html')) errors.push(`${route} is neither in the sitemap nor noindexed`);
}

if (!fs.existsSync('dist/sitemap-images.xml')) errors.push('Missing dist/sitemap-images.xml');
else {
  const imageSitemap = read('dist/sitemap-images.xml');
  const declared = [...imageSitemap.matchAll(/<image:loc>https?:\/\/[^/]+([^<]*)<\/image:loc>/g)].map((match) => match[1]);
  const missing = declared.filter((asset) => !fs.existsSync(path.join('dist', decodeURIComponent(asset))));
  if (missing.length) errors.push(`Image sitemap declares ${missing.length} missing asset(s), first: ${missing[0]}`);
  if (forbiddenTokens.some((token) => imageSitemap.includes(token))) errors.push('Image sitemap contains an owner-rejected photograph reference');
}

// Private rights information must never reach the built site in any form.
const privateRightsKeys = ['rightsNotesInternal', 'modelReleaseStatus', 'propertyReleaseStatus'];
for (const file of [...htmlFiles, 'dist/data/photo-catalog.json'].filter((entry) => fs.existsSync(entry))) {
  const contents = read(file);
  for (const key of privateRightsKeys) if (contents.includes(key)) errors.push(`${file} exposes private rights field ${key}`);
}

// No page may claim commercial clearance that the rights layer has not confirmed.
const catalogFile = 'dist/data/photo-catalog.json';
if (fs.existsSync(catalogFile)) {
  const published = JSON.parse(read(catalogFile)).photos;
  const unavailable = published.filter((photo) => photo.licensing === 'unavailable');
  if (unavailable.length) errors.push(`${unavailable.length} published photograph(s) are marked not-for-license`);
}

if (!process.env.PUBLIC_CONTACT_EMAIL) ownerActions.push('PUBLIC_CONTACT_EMAIL is unset: Studio, Licensing, Contact and viewer enquiry actions are hidden and /contact/ is noindexed.');
if (!process.env.PUBLIC_CREATOR_NAME) ownerActions.push('PUBLIC_CREATOR_NAME is unset: credit and copyright fall back to "ELSEWHERE" rather than a named creator.');
if (!process.env.SITE_URL || process.env.SITE_URL.includes('localhost')) ownerActions.push('SITE_URL is unset or local: canonical URLs, Open Graph URLs and both sitemaps are not production values.');

if (errors.length) {
  console.error(`Launch validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}

console.log(`Launch validation passed: ${htmlFiles.length} public HTML files, unique canonicals, complete social metadata, private route excluded, sitemap and image sitemap consistent.`);
// Owner-supplied values are launch decisions, not software defects: they are reported, never fatal.
if (ownerActions.length) {
  console.warn(`\n${ownerActions.length} owner action(s) required before production launch:`);
  for (const action of ownerActions) console.warn(`- ${action}`);
}
