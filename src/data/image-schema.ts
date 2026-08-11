import { business, site } from '../config/site';

interface CatalogPhoto {
  id: string;
  index: number;
  archiveImage: string;
  viewerImage: string;
  width: number | null;
  height: number | null;
  altText: string;
  caption: string | null;
  destination: string | null;
  /** Owner-confirmed city. Null on all but a handful of frames, and never inferred. */
  place?: string | null;
  region?: string | null;
  year: number | null;
  licensing: 'enquiry' | 'editorial' | 'commercial' | 'unavailable';
}

/**
 * Builds schema.org ImageObject markup for a published photograph.
 *
 * Only verifiable values are emitted. `acquireLicensePage` is a statement that there is a
 * place to ask about using the image — which is true whenever the frame's rights state
 * permits an enquiry and a verified enquiry address exists. It is never emitted for a
 * frame marked unavailable, and no `license` URL is published, because no blanket licence
 * terms exist: every licence is negotiated per photograph and per use.
 */
export const imageObject = (photo: CatalogPhoto, siteUrl: URL, pageUrl: string, representative = false) => {
  const canEnquire = photo.licensing !== 'unavailable' && business.enquiriesEnabled;
  const caption = photo.caption ?? photo.altText ?? null;
  const contentLocation = [photo.place, photo.region, photo.destination]
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index)
    .join(', ') || null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: new URL(photo.archiveImage, siteUrl).href,
    ...(photo.width ? { width: photo.width } : {}),
    ...(photo.height ? { height: photo.height } : {}),
    ...(caption ? { caption } : {}),
    // Phase 10.1 — as precise as the photograph's own record, and no more. Most frames know only a
    // country and say only that. The dedupe matters because a region-level destination (Essaouira,
    // Phu Quoc, La Réunion) carries the same name twice and must not print it twice.
    ...(contentLocation ? { contentLocation: { '@type': 'Place', name: contentLocation } } : {}),
    creator: { '@type': business.creatorIsPerson ? 'Person' : 'Organization', name: business.creator },
    creditText: business.creditText,
    copyrightNotice: business.copyrightNotice,
    ...(photo.year ? { copyrightYear: photo.year } : {}),
    ...(canEnquire ? { acquireLicensePage: new URL(business.licensingPage, siteUrl).href } : {}),
    ...(representative ? { representativeOfPage: true } : {}),
    isPartOf: { '@type': 'WebPage', url: pageUrl, name: site.name },
  };
};

/** Breadcrumbs help search understand the archive's depth without inventing hierarchy. */
export const breadcrumbs = (trail: Array<{ name: string; path: string }>, siteUrl: URL) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: new URL(item.path, siteUrl).href,
  })),
});
