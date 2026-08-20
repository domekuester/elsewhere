/**
 * The public projection a licensing enquiry is allowed to see.
 *
 * The published catalog (`public/data/photo-catalog.json`) is the one registry. This module does
 * not copy it, extend it, or hold a second list of licensable frames — it narrows a catalog record
 * to the handful of already-public values the enquiry UI needs, and drops everything else on the
 * floor. A field that is not named in `PublicLicensingPhoto` cannot reach the licensing surface,
 * which is why the projection is a construction rather than a delete-list.
 *
 * Deliberately free of Astro imports: the same function resolves a photograph in the browser, in
 * the page build, and in `scripts/validate-licensing.mjs` under plain Node. Paths come out exactly
 * as the catalog stores them (site-absolute, no deployment base); every caller applies `withBase`.
 */

/** The catalog fields this module reads. A structural subset — the record carries far more. */
export interface LicensingCatalogPhoto {
  id: string;
  index: number;
  thumbnail: string;
  archiveImage: string;
  width: number | null;
  height: number | null;
  altText: string;
  caption: string | null;
  destination: string | null;
  destinationId: string | null;
  destinationSlug: string | null;
  destinationPublished: boolean;
  region: string | null;
  place: string | null;
  year: number | null;
  public: boolean;
  licensing: 'enquiry' | 'editorial' | 'commercial' | 'unavailable';
}

/** Everything the licensing UI and the enquiry payload may contain. Nothing else exists here. */
export interface PublicLicensingPhoto {
  /** Canonical public identifier, stable across archive re-ordering: `photo-0372`. */
  id: string;
  /** The reference printed beneath the frame in the archive, and spoken about on the page: `372`. */
  reference: string;
  src: string;
  /** Full-width public derivative. Used as the enquiry's `photo_public_url`, never as a download. */
  publicImage: string;
  width: number | null;
  height: number | null;
  alt: string;
  /** Only geography the catalog already publishes. Null when the frame's place is unassigned. */
  publicContext: string | null;
  /** A real public page the photograph can be seen on, derived from the record, never from a query. */
  returnPath: string;
  /** Public label for that page, so the link can name where it goes. */
  returnLabel: string;
  /** False only for owner-confirmed NOT_FOR_LICENSE frames. An enquiry is a question, not an offer. */
  enquiryAllowed: boolean;
}

/**
 * Where an enquiry about one photograph begins.
 *
 * The single place this URL is spelled, so the viewer's action, the ImageObject `acquireLicensePage`
 * and any future entry point cannot drift apart. It carries the frame's canonical public id and
 * nothing else: the page treats that id as a request to look something up in the published catalog,
 * never as content, and an id it cannot resolve degrades to the general enquiry.
 */
export const licensingEnquiryPath = (
  photoId: string,
  options: { from?: string; anchor?: boolean } = {},
): string => {
  const query = new URLSearchParams({ photo: photoId });
  if (options.from) query.set('from', options.from);
  return `/licensing/?${query.toString()}${options.anchor ? '#enquiry' : ''}`;
};

/** Query values are untrusted input. Anything outside this shape is not looked up at all. */
const REFERENCE_PATTERN = /^[A-Za-z0-9-]{1,32}$/;
const SLUG_PATTERN = /^[a-z0-9-]{1,64}$/;

/** The archive prints a three-digit reference; `photo-0372` is the identifier behind it. */
export const publicReference = (index: number): string => String(index).padStart(3, '0');

/**
 * Location, at exactly the precision the photograph's own record carries and no more.
 *
 * Mirrors the rule `imageObject` already applies to `contentLocation`: a region-level destination
 * repeats its own name, so the parts are de-duplicated. A frame whose place is unassigned returns
 * null and the UI says nothing rather than inventing a country.
 */
const contextOf = (photo: LicensingCatalogPhoto): string | null =>
  [photo.place, photo.region, photo.destination]
    .filter((value): value is string => Boolean(value))
    .filter((value, position, all) => all.indexOf(value) === position)
    .join(', ') || null;

/**
 * Where "return to the photograph" goes.
 *
 * Derived from the catalog record, never from the `from` query value, so a crafted URL cannot turn
 * this into an arbitrary link. A published destination has a chapter of its own; everything else
 * opens the archive filtered to that place, which is a route the archive already understands.
 */
const returnRoute = (photo: LicensingCatalogPhoto): { path: string; label: string } => {
  if (photo.destinationPublished && photo.destinationSlug && SLUG_PATTERN.test(photo.destinationSlug)) {
    return { path: `/destinations/${photo.destinationSlug}/`, label: photo.destination ?? 'the destination' };
  }
  if (photo.destinationId && SLUG_PATTERN.test(photo.destinationId)) {
    return { path: `/archive/?destination=${photo.destinationId}`, label: photo.destination ?? 'the archive' };
  }
  return { path: '/archive/', label: 'the archive' };
};

/**
 * Alt text for the selected-photograph confirmation.
 *
 * Reviewed alt text is used when it exists. Otherwise the frame is described by the two facts that
 * are certainly true of it — its reference and its published place — rather than by a guess at what
 * it depicts. Most of the archive is still awaiting alt review, and a fabricated description would
 * be worse than a factual one.
 */
const licensingAlt = (photo: LicensingCatalogPhoto, context: string | null, reference: string): string =>
  photo.altText.trim() || photo.caption?.trim() || `Archive frame ${reference}${context ? `, ${context}` : ''}.`;

/** Narrows one catalog record to the public projection. The only place the projection is built. */
export const licensingProjection = (photo: LicensingCatalogPhoto): PublicLicensingPhoto => {
  const reference = publicReference(photo.index);
  const publicContext = contextOf(photo);
  const { path, label } = returnRoute(photo);
  return {
    id: photo.id,
    reference,
    src: photo.thumbnail,
    publicImage: photo.archiveImage,
    width: photo.width,
    height: photo.height,
    alt: licensingAlt(photo, publicContext, reference),
    publicContext,
    returnPath: path,
    returnLabel: label,
    enquiryAllowed: photo.licensing !== 'unavailable',
  };
};

/**
 * Resolves an untrusted photograph reference through the public registry.
 *
 * Returns null — never a partial record, never an error — for anything that is not a published,
 * licensable photograph. The caller's only correct response to null is the generic enquiry, so an
 * unknown, private, excluded or not-for-license reference degrades to the same harmless state as
 * opening the page directly.
 *
 * Accepts the canonical `photo-0372` and the three-digit archive reference `372` that the page's
 * own copy tells visitors to quote, so a link written by hand resolves the same way as one the
 * viewer generated.
 */
export const resolveLicensingPhoto = (
  photos: readonly LicensingCatalogPhoto[],
  requested: string | null | undefined,
): PublicLicensingPhoto | null => {
  if (!requested) return null;
  const value = requested.trim();
  if (!REFERENCE_PATTERN.test(value)) return null;
  const normalised = value.toLowerCase();
  const numeric = /^\d{1,6}$/.test(normalised) ? Number(normalised) : null;

  const match = photos.find((photo) =>
    photo.id.toLowerCase() === normalised || (numeric !== null && photo.index === numeric));

  // Publication permission is checked before licensing permission: a frame that may not appear at
  // all can never acquire an enquiry action by being named in a URL.
  if (!match || !match.public || match.licensing === 'unavailable') return null;
  return licensingProjection(match);
};
