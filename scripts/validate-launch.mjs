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
// dist/ is the deployment root, not the domain root. On GitHub Pages project hosting the public
// site lives under /elsewhere/, so every URL this script reads back out of the build carries a
// prefix that the filesystem does not. Strip it before touching disk or comparing routes.
const basePrefix = (() => {
  try { return new URL(process.env.SITE_URL || 'http://localhost:4321').pathname.replace(/\/+$/, ''); }
  catch { return ''; }
})();
const sitePath = (urlPath) => basePrefix && (urlPath === basePrefix || urlPath.startsWith(`${basePrefix}/`))
  ? urlPath.slice(basePrefix.length) || '/'
  : urlPath;
const distFile = (urlPath) => path.join('dist', sitePath(urlPath));

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
  if (socialPath && !fs.existsSync(distFile(socialPath))) errors.push(`${file} references missing social image ${socialPath}`);
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
if (!robots.includes(`Disallow: ${basePrefix}/curate/`)) errors.push('robots.txt does not disallow /curate/');
const sitemap = fs.existsSync('dist/sitemap.xml') ? read('dist/sitemap.xml') : '';
if (sitemap.includes('/curate/')) errors.push('sitemap.xml exposes /curate/');

// Phase 9 — launch surfaces, discovery and the commercial layer.
const ownerActions = [];
// Normalised to site-relative so both the on-disk lookup below and the route comparison
// further down stay valid whether or not the site is mounted on a subpath.
const sitemapPaths = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+([^<]*)<\/loc>/g)].map((match) => sitePath(match[1]));
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

// Phase 10.2 — every site-absolute link and asset in the built HTML must carry the deployment
// base and must resolve to something that was actually built.
//
// Serving from a repository subpath makes this the failure mode with the widest blast radius and
// the quietest symptom: a forgotten prefix still emits valid HTML, and the page simply loads
// without its photographs. Astro prefixes what it owns — bundled CSS and JS, `astro:assets`
// output, `url()` inside stylesheets — but a hand-written path in markup is passed through
// verbatim, so this checks the built result rather than trusting the source.
const linkErrors = [];
const assetErrors = [];
const externalScheme = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;
const resolvesInBuild = (urlPath) => {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (clean.endsWith('/')) return fs.existsSync(path.join('dist', sitePath(clean), 'index.html'));
  const target = distFile(clean);
  return fs.existsSync(target) && fs.statSync(target).isFile();
};
for (const file of htmlFiles) {
  const html = read(file);
  const references = new Set();
  for (const [, value] of html.matchAll(/(?:href|src)="([^"]*)"/g)) references.add(value);
  // A srcset is a comma-separated list of "url descriptor" pairs; only the url half is a path.
  for (const [, value] of html.matchAll(/srcset="([^"]*)"/g)) {
    for (const candidate of value.split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) references.add(url);
    }
  }
  for (const reference of references) {
    if (!reference || externalScheme.test(reference) || !reference.startsWith('/')) continue;
    const isAsset = /\.[a-z0-9]{2,5}$/i.test(reference.split(/[?#]/)[0]);
    const bucket = isAsset ? assetErrors : linkErrors;
    if (basePrefix && !(reference === basePrefix || reference.startsWith(`${basePrefix}/`))) {
      bucket.push(`${file}: ${reference} is missing the ${basePrefix} deployment base`);
      continue;
    }
    if (!resolvesInBuild(reference)) bucket.push(`${file}: ${reference} was not built`);
  }
}
const report = (label, list) => {
  if (!list.length) return;
  errors.push(`${list.length} ${label}, first ${Math.min(5, list.length)}:\n    ${list.slice(0, 5).join('\n    ')}`);
};
report('broken internal link(s)', linkErrors);
report('broken public asset reference(s)', assetErrors);

// The same omission can hide inside an absolute URL rather than a path — a canonical, an Open
// Graph URL, or a schema.org `url` built from the configured origin without the base. The
// publication owns only its own subpath, so any self-referencing absolute URL must start there.
if (basePrefix && process.env.SITE_URL) {
  const origin = new URL(process.env.SITE_URL).origin;
  const rootScoped = [];
  for (const file of [...htmlFiles, 'dist/sitemap.xml', 'dist/sitemap-images.xml', 'dist/robots.txt'].filter((entry) => fs.existsSync(entry))) {
    for (const [url] of read(file).matchAll(new RegExp(`${origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"'<)\\s]*`, 'g'))) {
      if (!new URL(url).pathname.startsWith(`${basePrefix}/`)) rootScoped.push(`${file}: ${url}`);
    }
  }
  report(`absolute URL(s) pointing outside ${basePrefix}/`, [...new Set(rootScoped)]);
}

if (!fs.existsSync('dist/sitemap-images.xml')) errors.push('Missing dist/sitemap-images.xml');
else {
  const imageSitemap = read('dist/sitemap-images.xml');
  const declared = [...imageSitemap.matchAll(/<image:loc>https?:\/\/[^/]+([^<]*)<\/image:loc>/g)].map((match) => match[1]);
  const missing = declared.filter((asset) => !fs.existsSync(distFile(decodeURIComponent(asset))));
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
// An unset address hides the enquiry path, which is safe. A *placeholder* address is worse than
// unset: every enquiry affordance renders and invites a message that can never arrive. RFC 2606
// and RFC 6761 reserve these names precisely so they can be detected rather than shipped.
else if (/@([^@]*\.)?(example|test|invalid|localhost)$/i.test(process.env.PUBLIC_CONTACT_EMAIL.trim())) {
  ownerActions.push(`PUBLIC_CONTACT_EMAIL is a reserved placeholder address (${process.env.PUBLIC_CONTACT_EMAIL.trim()}): enquiry actions render publicly but mail to it is undeliverable. Set a real address or clear the variable to hide the enquiry path.`);
}
if (!process.env.PUBLIC_CREATOR_NAME) ownerActions.push('PUBLIC_CREATOR_NAME is unset: credit and copyright fall back to "ELSEWHERE" rather than a named creator.');
if (!process.env.SITE_URL || process.env.SITE_URL.includes('localhost')) ownerActions.push('SITE_URL is unset or local: canonical URLs, Open Graph URLs and both sitemaps are not production values.');

if (errors.length) {
  console.error(`Launch validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}

console.log(`Launch validation passed: ${htmlFiles.length} public HTML files, unique canonicals, complete social metadata, private route excluded, sitemap and image sitemap consistent, 0 broken internal links and 0 broken public assets under base "${basePrefix || '/'}".`);
// Owner-supplied values are launch decisions, not software defects: they are reported, never fatal.
if (ownerActions.length) {
  console.warn(`\n${ownerActions.length} owner action(s) required before production launch:`);
  for (const action of ownerActions) console.warn(`- ${action}`);
}
