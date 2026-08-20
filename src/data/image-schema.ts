import { business, site } from '../config/site';
import { absoluteUrl } from '../config/paths';
import { licensingEnquiryOffered } from '../config/licensing';
import { licensingEnquiryPath } from './licensing';

/**
 * The one public-safe projection every image discovery surface is built from.
 *
 * Two consumers read it — the ImageObject markup embedded in a page, and /sitemap-images.xml —
 * and both see the same narrowed record. That is the point: a field the projection does not name
 * cannot reach Google, whichever surface is asked. The catalog carries far more per photograph
 * (capture date, camera, curation state, the frame's source filename), and none of it belongs in
 * discovery metadata, so this is a construction rather than a delete-list. Internal provenance —
 * `locationConfidence`, `locationSource`, private notes, coordinates, release status — never
 * reaches the published catalog at all; see scripts/build-photo-catalog.mjs.
 */

/** The catalog fields this module reads. A structural subset — the record carries far more. */
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
  public?: boolean;
  licensing: 'enquiry' | 'editorial' | 'commercial' | 'unavailable';
}

/** Everything a discovery surface may say about a photograph. Nothing else exists here. */
export interface PublicImage {
  /** Canonical public identifier, stable across archive re-ordering: `photo-0372`. */
  publicPhotoId: string;
  /** The public derivative a page actually renders, base-corrected. Never a source master. */
  contentUrl: string;
  width: number | null;
  height: number | null;
  /** Reviewed alt text or an owner caption. Null while a frame is still awaiting alt review. */
  caption: string | null;
  /** Only geography the catalog already publishes, at the precision the record carries. */
  contentLocation: string | null;
  year: number | null;
  /**
   * Whether licensing metadata may be published for this frame at all.
   *
   * Three conditions, all required: the photograph is public, its rights state is not the
   * owner-confirmed NOT_FOR_LICENSE, and an enquiry route actually exists. False removes both
   * `license` and `acquireLicensePage`, so a frame that may not be offered never carries a
   * licensing signal, and a deployment with no enquiry route never advertises one.
   */
  licensable: boolean;
}

/**
 * Location, at exactly the precision the photograph's own record carries and no more.
 *
 * A region-level destination (Essaouira, Phu Quoc, La Réunion) repeats its own name, so the parts
 * are de-duplicated. A frame whose place is unassigned says nothing rather than inventing a country.
 */
const contextOf = (photo: CatalogPhoto): string | null =>
  [photo.place, photo.region, photo.destination]
    .filter((value): value is string => Boolean(value))
    .filter((value, position, all) => all.indexOf(value) === position)
    .join(', ') || null;

/** Narrows one catalog record to the public projection. The only place the projection is built. */
export const publicImage = (photo: CatalogPhoto, alt?: string): PublicImage => ({
  publicPhotoId: photo.id,
  contentUrl: photo.archiveImage,
  width: photo.width,
  height: photo.height,
  caption: (alt ?? photo.caption ?? photo.altText ?? '').trim() || null,
  contentLocation: contextOf(photo),
  year: photo.year,
  licensable: photo.public !== false && photo.licensing !== 'unavailable' && licensingEnquiryOffered,
});

/**
 * Builds schema.org ImageObject markup for a published photograph.
 *
 * Only verifiable values are emitted, and every URL is absolute and production-scoped because the
 * markup is read away from the page it was served on.
 *
 * `license` and `acquireLicensePage` are the pair Google reads for image licensing, and they say
 * two different true things. `license` points at /licensing/, which is where the rights governing
 * these photographs are described: copyright is held, selected frames may be licensed, terms are
 * agreed per photograph and per use. `acquireLicensePage` points at the same page carrying this
 * frame's public id, so the enquiry opens on the photograph the visitor arrived from. Neither
 * asserts availability, neither claims a release, and an enquiry grants no rights — the page says
 * so in its own words. A frame the owner has marked NOT_FOR_LICENSE emits neither property.
 */
export const imageObject = (photo: CatalogPhoto, siteUrl: URL, pageUrl: string, representative = false) => {
  const image = publicImage(photo);
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: new URL(image.contentUrl, siteUrl).href,
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
    ...(image.caption ? { caption: image.caption } : {}),
    // Phase 10.1 — as precise as the photograph's own record, and no more. Most frames know only a
    // country and say only that.
    ...(image.contentLocation ? { contentLocation: { '@type': 'Place', name: image.contentLocation } } : {}),
    creator: { '@type': business.creatorIsPerson ? 'Person' : 'Organization', name: business.creator },
    creditText: business.creditText,
    copyrightNotice: business.copyrightNotice,
    ...(image.year ? { copyrightYear: image.year } : {}),
    ...(image.licensable
      ? {
          license: absoluteUrl(business.licensingPage, siteUrl),
          acquireLicensePage: absoluteUrl(licensingEnquiryPath(image.publicPhotoId), siteUrl),
        }
      : {}),
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
    item: absoluteUrl(item.path, siteUrl),
  })),
});
