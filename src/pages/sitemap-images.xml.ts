import type { APIRoute } from 'astro';
import catalogData from '../data/photo-catalog';
import destinationData from '../../data/destinations.json';
import { publishedJourneyStories, storyPhotos } from '../data/journey';
import { surfacePhotoIds } from '../data/surface-photos';
import { publicImage } from '../data/image-schema';
import { absoluteUrl } from '../config/paths';

/**
 * A dedicated image sitemap earns its place here: the archive loads incrementally through
 * JavaScript, so a crawler that does not execute it sees only the opening frames. This declares
 * every published photograph against the page it actually appears on.
 *
 * It lists only photographs already present in the public catalog, which excludes every
 * owner-rejected and private frame by construction, and it reads them through the shared public
 * projection in src/data/image-schema.ts, so nothing here can name a field that markup may not.
 *
 * Only `<image:loc>` is emitted. Google withdrew support for `<image:caption>`, `<image:title>`,
 * `<image:license>` and `<image:geo_location>` in May 2022 and removed them from the specification;
 * a caption or a licence URL published here is read by nothing and merely claims currency the file
 * does not have. Both facts still reach Google — through the page's ImageObject markup, where they
 * are supported and where they can be verified against the photograph they describe.
 *
 * One canonical public representation per photograph: the archive derivative. The responsive
 * ladder around it (thumbnail, viewer) is the same picture at other sizes and is deliberately
 * absent. So are the `astro:assets` crops on Home and the Black & White collection, which are
 * separate build-hashed files of frames the archive already declares.
 */
const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character] as string));

/** Google accepts up to 1,000 `<image:image>` entries per URL. The archive is the only page near it. */
const MAX_IMAGES_PER_URL = 1000;

export const GET: APIRoute = ({ site }) => {
  const photos = catalogData.photos;
  const byId = new Map(photos.map((photo) => [photo.id, photo]));
  const resolve = (ids: readonly string[]) => ids.map((id) => byId.get(id)).filter(Boolean) as typeof photos;

  const entries: Array<[string, typeof photos]> = [
    ['/archive/', photos],
    ['/archive/black-and-white/', photos.filter((photo) => photo.visualWorlds.includes('black-and-white'))],
    // The destination index leads each open chapter on that chapter's own hero frame, drawn from
    // the same archive derivative the chapter itself uses.
    ['/destinations/', resolve(destinationData.destinations
      .filter((destination) => destination.publicationStatus === 'published')
      .map((destination) => destination.heroPhotoId)
      .filter(Boolean))],
  ];

  // A destination either has a published chapter of its own or is addressable through the archive
  // filtered to it. Both are real indexable pages that open on that place's photography, and both
  // were missing their images here — the second one entirely.
  for (const destination of destinationData.destinations) {
    if (destination.publicationStatus === 'published') {
      const sequence = resolve([destination.heroPhotoId, ...destination.manualOrder]
        .filter((id, index, all) => id && all.indexOf(id) === index));
      if (sequence.length) entries.push([`/destinations/${destination.slug}/`, sequence]);
    } else if (destination.photoCount > 0 && destination.hero?.photoId) {
      const place = photos.filter((photo) => photo.destinationSlug === destination.slug);
      if (place.length) entries.push([`/archive/place/${destination.slug}/`, place]);
    }
  }

  // Only PUBLISHED stories are indexable, so only those may appear here.
  for (const story of publishedJourneyStories()) {
    // The opening frame is a hero derivative from its own ladder, not an archive derivative, so
    // the story's canonical archive representations are its body frames.
    const sequence = resolve(storyPhotos(story)
      .map((frame) => frame.id)
      .filter((id, index, all) => all.indexOf(id) === index));
    if (sequence.length) entries.push([`/journey/${story.slug}/`, sequence]);
  }

  // Authored surfaces that render archive derivatives directly, declared once in src/data/surface-photos.ts.
  for (const [path, ids] of Object.entries(surfacePhotoIds)) {
    const sequence = resolve(ids);
    if (sequence.length) entries.push([path, sequence]);
  }

  const urls = entries
    .map(([path, list]) => {
      const locations = [...new Set(list.map((photo) => new URL(publicImage(photo).contentUrl, site).href))]
        .slice(0, MAX_IMAGES_PER_URL);
      if (!locations.length) return '';
      const images = locations.map((location) => `<image:image><image:loc>${escapeXml(location)}</image:loc></image:image>`).join('');
      return `<url><loc>${escapeXml(absoluteUrl(path, site))}</loc>${images}</url>`;
    })
    .filter(Boolean)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
