import type { APIRoute } from 'astro';
import catalogData from '../../public/data/photo-catalog.json';
import destinationData from '../../data/destinations.json';

/**
 * A dedicated image sitemap earns its place here: the archive loads incrementally through
 * JavaScript, so a crawler that does not execute it sees only the opening frames. This
 * declares every published photograph against the page it actually appears on.
 *
 * It lists only photographs already present in the public catalog, which excludes every
 * owner-rejected and private frame by construction.
 */
const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[character] as string));

export const GET: APIRoute = ({ site }) => {
  const photos = catalogData.photos;
  const imageTag = (photo: typeof photos[number]) => {
    const caption = [photo.altText, [photo.destination, photo.year].filter(Boolean).join(' · ')].filter(Boolean)[0];
    return [
      '<image:image>',
      `<image:loc>${new URL(photo.archiveImage, site).href}</image:loc>`,
      caption ? `<image:title>${escapeXml(`Frame ${String(photo.index).padStart(3, '0')}${photo.destination ? ` · ${photo.destination}` : ''}`)}</image:title>` : '',
      caption ? `<image:caption>${escapeXml(caption)}</image:caption>` : '',
      '</image:image>',
    ].join('');
  };

  const entries: Array<[string, typeof photos]> = [
    ['/archive/', photos],
    ['/archive/black-and-white/', photos.filter((photo) => photo.visualWorlds.includes('black-and-white'))],
  ];

  for (const destination of destinationData.destinations) {
    if (destination.publicationStatus !== 'published') continue;
    const sequence = [destination.heroPhotoId, ...destination.manualOrder]
      .filter((id, index, all) => id && all.indexOf(id) === index)
      .map((id) => photos.find((photo) => photo.id === id))
      .filter(Boolean) as typeof photos;
    if (sequence.length) entries.push([`/destinations/${destination.slug}/`, sequence]);
  }

  const urls = entries
    .filter(([, list]) => list.length > 0)
    .map(([path, list]) => `<url><loc>${new URL(path, site).href}</loc>${list.map(imageTag).join('')}</url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
