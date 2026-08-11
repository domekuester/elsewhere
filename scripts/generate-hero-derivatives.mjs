// Phase 9.27 — dedicated destination-hero derivatives.
//
// A destination hero is the largest photograph on the site and the page's LCP element. Before this
// script the hero reused the 3200px viewer derivative at every viewport, so a 390px phone downloaded
// a 2.3 MB file to paint a 390px-wide box. The viewer role cannot simply be shrunk: it exists for the
// immersive full-screen reader and has to stay at 3200.
//
// So heroes get their own ladder. The widths are chosen for a full-bleed `object-fit: cover` box,
// where the rendered width is max(viewportWidth, viewportHeight * imageAspectRatio) and therefore
// routinely exceeds 100vw — a landscape frame on a tall phone renders about three times wider than
// the screen. Quality ramps down as width grows (see below): a cover-cropped backdrop is never
// inspected at 1:1, and this file is on the critical path.
//
// Sources stay untouched: this reads assets-source masters and writes only into public/assets-derived.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const inventory = read('docs/photo-inventory.json');
const destinations = read('data/destinations.json').destinations;
const curation = read('data/photo-curation.json');
const exclusions = read('data/public-image-exclusions.json');

// Identical guard to scripts/generate-archive-derivatives.mjs. A hero is the most prominent surface
// on the site, so an owner-rejected or withheld frame reaching this script would be the worst
// possible leak — it is refused here as well as in selection.
const forbidden = new Set([
  ...exclusions.ownerRejected.map((item) => item.photoId),
  ...exclusions.duplicateFamilies.flatMap((family) => family.excludeIds),
  ...exclusions.editorialHold.map((item) => item.photoId),
]);

// Quality ramps down as the file grows. A 768px hero is displayed at close to 1:1 on a phone and has
// to hold up; a 2560px one is always downscaled by the browser into a cropped, partly scrimmed
// backdrop, where a lower quality is invisible and the saved megabyte is not. Chroma stays 4:4:4
// throughout — several heroes carry saturated colour detail (red bridge cables, signage) that
// subsampling smears.
const WIDTHS = [768, 1152, 1536, 2048, 2560];
const QUALITY_BY_WIDTH = { 768: 86, 1152: 85, 1536: 83, 2048: 80, 2560: 77 };
const outputDir = path.join(root, 'public/assets-derived/hero');
fs.mkdirSync(outputDir, { recursive: true });

const byId = new Map(inventory.photos.map((photo, index) => [photo.id, { photo, index }]));
// Provisional heroes for chapters that are not published yet are deliberately skipped: they would be
// unreferenced weight in the public directory until their chapter actually opens.
const surfaceHeroes = read('data/surface-heroes.json').surfaces ?? {};
const wanted = [
  // Published chapters, plus any destination that has an addressable /archive/place/<slug>/ opening.
  // Both render a full-bleed hero, so both need the ladder rather than the 3200px viewer file.
  ...destinations
    .filter((destination) => destination.photoCount > 0 && (destination.publicationStatus === 'published' || destination.hero?.photoId))
    .map((destination) => ({ slug: destination.slug, photoId: destination.hero?.photoId ?? destination.heroPhotoId, grade: destination.hero?.grade })),
  // Phase 9.28A: the Archive and the Black & White Archive open photographically too, and their
  // heroes need the same ladder rather than the 3200px viewer file.
  ...Object.entries(surfaceHeroes).map(([slug, hero]) => ({ slug, photoId: hero.photoId, encode: hero.encode, grade: hero.grade })),
].filter((entry) => entry.photoId);

const written = [];
const manifest = {};
for (const { slug, photoId, encode, grade } of wanted) {
  if (forbidden.has(photoId)) throw new Error(`Hero ${photoId} (${slug}) is excluded from publication and must never be rendered.`);
  const entry = byId.get(photoId);
  if (!entry) throw new Error(`Hero ${photoId} (${slug}) is not in the photo inventory.`);
  const visibility = curation.assignments?.[photoId]?.visibility ?? 'hold';
  if (['private', 'do-not-publish', 'editorial-hold'].includes(visibility)) throw new Error(`Hero ${photoId} (${slug}) is withheld (${visibility}).`);

  const baseName = `${String(entry.index + 1).padStart(4, '0')}-${path.parse(entry.photo.filename).name}`.replace(/[^a-zA-Z0-9._-]+/g, '-');
  const source = path.join(root, entry.photo.sourcePath);
  const sourceWidth = entry.photo.dimensions.width;
  const sourceHeight = entry.photo.dimensions.height;
  const sources = [];
  for (const width of WIDTHS) {
    if (width > sourceWidth) continue;
    const target = path.join(outputDir, `${baseName}-${width}.jpg`);
    // Phase 9.30 — optional page-presentation mastering, applied to the hero derivative only.
    // The master on disk is never touched, the grade lives in data next to the hero it belongs to,
    // and deleting the block restores the untouched frame on the next run. These are the corrections
    // a printer would make for a specific reproduction — black point, density, a little local
    // contrast — not a reinterpretation of the photograph.
    let pipeline = sharp(source).rotate().resize({ width, withoutEnlargement: true });
    if (grade) {
      if (grade.linear) pipeline = pipeline.linear(grade.linear[0], grade.linear[1]);
      if (grade.gamma) pipeline = pipeline.gamma(grade.gamma);
      if (grade.brightness || grade.saturation) pipeline = pipeline.modulate({ brightness: grade.brightness ?? 1, saturation: grade.saturation ?? 1 });
      if (grade.clahe) pipeline = pipeline.clahe({ width: grade.clahe.width ?? 64, height: grade.clahe.height ?? 64, maxSlope: grade.clahe.maxSlope ?? 2 });
    }
    await pipeline
      .keepIccProfile()
      .jpeg({ quality: (encode?.quality ?? 0) || QUALITY_BY_WIDTH[width], chromaSubsampling: encode?.chroma ?? '4:4:4', mozjpeg: true })
      .toFile(target);
    sources.push({ width, height: Math.round((width / sourceWidth) * sourceHeight), bytes: fs.statSync(target).size, url: `/assets-derived/hero/${baseName}-${width}.jpg` });
    written.push(target);
  }
  manifest[slug] = { photoId, baseName, sourceWidth, sourceHeight, chroma: encode?.chroma ?? '4:4:4', grade: grade ?? null, sources };
  console.log(`${slug}: ${sources.length} hero derivatives from ${entry.photo.filename} (${sources.map((s) => `${s.width}px ${(s.bytes / 1024).toFixed(0)}KB`).join(', ')})`);
}

// Anything left over belongs to a hero that has since been replaced. Removing it keeps the public
// directory an exact mirror of the current edit rather than an accumulating pile of old choices.
const keep = new Set(written.map((file) => path.basename(file)));
let removed = 0;
for (const file of fs.readdirSync(outputDir)) {
  if (file === 'HERO-PIPELINE.json' || keep.has(file)) continue;
  fs.unlinkSync(path.join(outputDir, file));
  removed += 1;
}

fs.writeFileSync(path.join(outputDir, 'HERO-PIPELINE.json'), `${JSON.stringify({
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  role: 'destination-hero',
  widths: WIDTHS,
  jpegQualityByWidth: QUALITY_BY_WIDTH,
  chromaSubsampling: '4:4:4',
  colorPolicy: 'Embedded ICC profiles retained; no visual filters or artificial sharpening.',
  heroes: manifest,
}, null, 2)}\n`);
console.log(`Hero derivatives ready: ${written.length} written, ${removed} stale removed.`);
