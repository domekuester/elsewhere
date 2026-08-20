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

// Phase 16B.1 — Google image discovery. Everything below is asserted against the built output,
// because the failure modes here are all silent: a deprecated tag is ignored rather than rejected,
// a structured-data URL that 404s still validates as JSON, and a licensing property attached to
// the wrong frame reads as perfectly well-formed markup.
const publishedCatalog = fs.existsSync('dist/data/photo-catalog.json')
  ? JSON.parse(read('dist/data/photo-catalog.json')).photos
  : [];
const catalogById = new Map(publishedCatalog.map((photo) => [photo.id, photo]));
const productionOrigin = (() => {
  try { return new URL(process.env.SITE_URL || 'http://localhost:4321').origin; } catch { return ''; }
})();
const expectsProductionUrls = Boolean(productionOrigin) && !productionOrigin.includes('localhost');

if (fs.existsSync('dist/sitemap-images.xml')) {
  const imageSitemap = read('dist/sitemap-images.xml');

  // Google withdrew these in May 2022 and removed them from the image sitemap specification.
  // Publishing them costs bytes on every crawl and claims a currency the file does not have.
  for (const tag of ['image:caption', 'image:title', 'image:license', 'image:geo_location']) {
    if (imageSitemap.includes(`<${tag}`)) errors.push(`Image sitemap uses the deprecated <${tag}> tag`);
  }

  // Well-formedness, without taking on an XML parser to assert four things.
  if (!imageSitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) errors.push('Image sitemap has no XML declaration');
  if (!imageSitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) errors.push('Image sitemap is missing the sitemap namespace');
  if (!imageSitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) errors.push('Image sitemap is missing the image namespace');
  const unescaped = imageSitemap.replace(/&(amp|lt|gt|apos|quot|#\d+);/g, '');
  if (unescaped.includes('&')) errors.push('Image sitemap contains an unescaped ampersand');
  for (const [open, close] of [['<url>', '</url>'], ['<image:image>', '</image:image>'], ['<image:loc>', '</image:loc>']]) {
    const opened = imageSitemap.split(open).length - 1;
    const closed = imageSitemap.split(close).length - 1;
    if (opened !== closed) errors.push(`Image sitemap has ${opened} ${open} and ${closed} ${close}`);
  }

  // The catalog stores derivative paths already percent-encoded, because they are also served
  // verbatim to the archive's client loader. Compare on both forms rather than assuming either.
  const derivativeRoots = new Set(publishedCatalog.flatMap((photo) => {
    let decoded = photo.archiveImage;
    try { decoded = decodeURIComponent(photo.archiveImage); } catch { /* leave as stored */ }
    return [photo.archiveImage, decoded];
  }));
  for (const [, loc, body] of imageSitemap.matchAll(/<url><loc>([^<]+)<\/loc>(.*?)<\/url>/g).map((match) => [null, match[1], match[2]])) {
    const page = sitePath(new URL(loc).pathname);
    // An image entry is a claim that a crawler can reach this page and find these images on it.
    if (!sitemapPaths.includes(page)) errors.push(`Image sitemap lists ${page}, which is not an indexable page in sitemap.xml`);
    if (expectsProductionUrls && new URL(loc).origin !== productionOrigin) errors.push(`Image sitemap page ${loc} is not on the production origin`);
    const locations = [...body.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1]);
    if (locations.length > 1000) errors.push(`Image sitemap declares ${locations.length} images for ${page}; Google reads at most 1,000`);
    if (new Set(locations).size !== locations.length) errors.push(`Image sitemap repeats an image URL within ${page}`);
    for (const location of locations) {
      const url = new URL(location);
      if (expectsProductionUrls && url.origin !== productionOrigin) errors.push(`Image sitemap declares ${location}, which is not on the production origin`);
      // One canonical public representation per photograph: the archive derivative. A thumbnail,
      // a viewer file or a build-hashed crop is the same picture at another size.
      const asset = sitePath(url.pathname);
      if (!derivativeRoots.has(asset) && !derivativeRoots.has(sitePath(decodeURIComponent(url.pathname)))) {
        errors.push(`Image sitemap declares ${asset}, which is not a published archive derivative`);
      }
    }
  }
}

// Every ImageObject in the built HTML, checked against the registry it claims to describe.
const imageObjectErrors = [];
const flattenSchema = (node) => (Array.isArray(node) ? node.flatMap(flattenSchema) : node && typeof node === 'object' ? [node, ...flattenSchema(node['@graph'] ?? [])] : []);
let imageObjectCount = 0;
for (const file of htmlFiles) {
  const html = read(file);
  for (const [, raw] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let parsed;
    try { parsed = JSON.parse(raw); } catch { errors.push(`${file} contains invalid JSON-LD`); continue; }
    for (const node of flattenSchema(parsed)) {
      if (node['@type'] !== 'ImageObject') continue;
      imageObjectCount += 1;
      const absolute = (value, label) => {
        if (typeof value !== 'string') { imageObjectErrors.push(`${file}: ImageObject ${label} is not a URL`); return null; }
        let url;
        try { url = new URL(value); } catch { imageObjectErrors.push(`${file}: ImageObject ${label} "${value}" is not absolute`); return null; }
        if (expectsProductionUrls && url.origin !== productionOrigin) imageObjectErrors.push(`${file}: ImageObject ${label} ${value} is not on the production origin`);
        return url;
      };
      const content = absolute(node.contentUrl, 'contentUrl');
      if (content) {
        const asset = sitePath(decodeURIComponent(content.pathname));
        if (!fs.existsSync(distFile(asset))) imageObjectErrors.push(`${file}: ImageObject contentUrl ${asset} was not built`);
        if (asset.startsWith('/assets-source/')) imageObjectErrors.push(`${file}: ImageObject contentUrl ${asset} is a source master`);
      }
      // Google needs at least one of creator, creditText, copyrightNotice or license to read the
      // node as photo metadata at all.
      if (!node.creator && !node.creditText && !node.copyrightNotice && !node.license) {
        imageObjectErrors.push(`${file}: ImageObject ${node.contentUrl} carries no creator, credit, copyright or licence`);
      }
      if (node.license) absolute(node.license, 'license');
      if (node.acquireLicensePage) {
        const acquire = absolute(node.acquireLicensePage, 'acquireLicensePage');
        if (acquire) {
          const page = sitePath(acquire.pathname);
          if (!fs.existsSync(path.join('dist', page, 'index.html'))) imageObjectErrors.push(`${file}: acquireLicensePage ${page} was not built`);
          // The frame an enquiry link names has to be one the registry will actually resolve:
          // published, and not an owner-confirmed NOT_FOR_LICENSE.
          const requested = acquire.searchParams.get('photo');
          if (requested) {
            const photo = catalogById.get(requested);
            if (!photo) imageObjectErrors.push(`${file}: acquireLicensePage names ${requested}, which is not in the published catalog`);
            else if (!photo.public || photo.licensing === 'unavailable') imageObjectErrors.push(`${file}: acquireLicensePage names ${requested}, which may not be licensed`);
          }
        }
      }
      // Licensing metadata is a rights claim. It may exist only where an enquiry is genuinely possible.
      if ((node.license || node.acquireLicensePage) && !fs.existsSync('dist/licensing/index.html')) {
        imageObjectErrors.push(`${file}: ImageObject publishes licensing metadata with no licensing page in the build`);
      }
    }
  }
}
report('ImageObject error(s)', [...new Set(imageObjectErrors)]);

// Internal editorial and location provenance must not reach any public surface — not the HTML, and
// not the JSON the archive and the licensing resolver fetch at runtime. Searching the built output
// rather than the source is the point: a field can leak through a spread, a serialiser or a data
// file without any page ever naming it.
const publicOutputFiles = [];
const walkPublic = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walkPublic(absolute);
    else if (/\.(html|json|xml|txt|js)$/i.test(entry.name)) publicOutputFiles.push(absolute);
  }
};
walkPublic('dist');
// Quoted keys for words that legitimately appear in editorial prose; bare tokens for the rest,
// which are camelCase field names no sentence contains.
const privateTokens = [
  'locationConfidence', 'locationSource', 'destinationConfidence', 'ownerNotes', 'researchNotes',
  'privacyNotes', 'internalNotes', 'privateLocation', 'sourcePath', 'sourceMaster',
  'rightsNotesInternal', 'modelReleaseStatus', 'propertyReleaseStatus', 'privacyStatus',
  'peopleClassification', 'assets-source',
];
// Editorial workflow state is the curation studio's private record, not a public field: how far
// through review a frame is, and why it was selected. Checked as JSON keys so editorial prose
// using the same English words is not mistaken for a leak.
const quotedPrivateTokens = [
  'provenance', 'latitude', 'longitude', 'gpsLatitude', 'gpsLongitude',
  'publicationStatus', 'approvalStatus', 'altReviewStatus', 'heroScore', 'editorialScore',
];
const leaks = [];
for (const file of publicOutputFiles) {
  const contents = read(file);
  for (const token of privateTokens) if (contents.includes(token)) leaks.push(`${file}: ${token}`);
  for (const token of quotedPrivateTokens) if (new RegExp(`"${token}"\\s*:`, 'i').test(contents)) leaks.push(`${file}: "${token}" key`);
}
report('private metadata leak(s) in public output', leaks);

// A production build must never ship a development origin in a URL a crawler will follow.
if (expectsProductionUrls) {
  const localhostUrls = [];
  for (const file of publicOutputFiles) {
    if (/https?:\/\/(localhost|127\.0\.0\.1)/.test(read(file))) localhostUrls.push(file);
  }
  report('file(s) containing a localhost URL', localhostUrls);
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

// Phase 16A — the licensing funnel, checked in the built output rather than in its source.
//
// A form that posts to a placeholder, or a page that names a price nobody has set, are the two
// ways this feature could ship something untrue. Both are cheap to assert and expensive to notice
// by eye. The rights and privacy half of the funnel is covered by scripts/validate-licensing.mjs,
// which runs the resolver the browser runs before the build starts.
const licensingHtml = fs.existsSync('dist/licensing/index.html') ? read('dist/licensing/index.html') : '';
if (!licensingHtml) errors.push('Missing dist/licensing/index.html');
else {
  const endpoint = licensingHtml.match(/https:\/\/formspree\.io\/f\/([A-Za-z0-9]+)/)?.[1];
  const placeholders = ['YOUR_FORM_ID', 'yourformid', 'xxxxxxxx', 'changeme', 'placeholder', 'lorem ipsum', 'example.com'];
  const found = placeholders.filter((token) => licensingHtml.toLowerCase().includes(token.toLowerCase()));
  if (found.length) errors.push(`Licensing page contains public placeholder text: ${found.join(', ')}`);
  if (endpoint && !/^[A-Za-z][A-Za-z0-9]{5,23}$/.test(endpoint)) errors.push(`Licensing page posts to a malformed Formspree endpoint: ${endpoint}`);
  // Reserved-domain addresses (RFC 2606 / RFC 6761) are placeholders by definition; offering one
  // as a fallback invites a message that can never arrive.
  const placeholderEmail = licensingHtml.match(/[\w.+-]+@[\w.-]*\.(?:example|test|invalid|localhost)\b/i);
  if (placeholderEmail) errors.push(`Licensing page publishes a reserved placeholder address: ${placeholderEmail[0]}`);
  // A form element that posts nowhere is worse than the enquiry link it replaced.
  if (/data-licensing-form/.test(licensingHtml) && !endpoint) errors.push('Licensing page renders an enquiry form with no Formspree endpoint');
  // Preview affordances exist only under `astro dev` and must never reach a build.
  if (licensingHtml.includes('licensing-preview-note')) errors.push('Licensing page ships the local preview notice');
  // No price is invented anywhere: the owner learns what the work is worth from real enquiries.
  const priceClaim = licensingHtml.match(/(?:€|\$|£)\s?\d|\bfrom\s+(?:€|\$|£)/i);
  if (priceClaim) errors.push(`Licensing page states a price (${priceClaim[0]}) that no rights record supports`);
  // Rights are asserted per frame by the owner, never by a page making a blanket claim.
  for (const claim of ['model released', 'property released', 'fully cleared', 'royalty-free', 'pre-cleared for all']) {
    if (licensingHtml.toLowerCase().includes(claim)) errors.push(`Licensing page claims blanket clearance: "${claim}"`);
  }
}

if (!process.env.PUBLIC_FORMSPREE_LICENSING_FORM_ID) ownerActions.push('PUBLIC_FORMSPREE_LICENSING_FORM_ID is unset: the Licensing page renders its enquiry link instead of the licensing enquiry form.');
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

console.log(`Launch validation passed: ${htmlFiles.length} public HTML files, ${imageObjectCount} valid ImageObject nodes, unique canonicals, complete social metadata, private route excluded, sitemap and image sitemap consistent, 0 broken internal links and 0 broken public assets under base "${basePrefix || '/'}".`);
// Owner-supplied values are launch decisions, not software defects: they are reported, never fatal.
if (ownerActions.length) {
  console.warn(`\n${ownerActions.length} owner action(s) required before production launch:`);
  for (const action of ownerActions) console.warn(`- ${action}`);
}
