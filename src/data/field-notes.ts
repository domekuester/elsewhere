import type { Nullable } from './archive';

/**
 * Field Notes are the search-facing editorial layer: real places, actually visited,
 * written from experience and carried by photographs from the archive.
 *
 * Nothing here may be generated. A note that claims a hotel, a meal, a price, a route,
 * or an encounter must describe something the photographer actually did. An empty
 * Field Notes layer is correct until a real note exists; a fabricated one is not.
 */

export type FieldNoteStatus = 'DRAFT' | 'OWNER_REVIEW' | 'PUBLISHED';

export interface AffiliateRecommendation {
  /** What is being recommended, in the author's words. */
  title: string;
  description: string;
  /** The business or service. Never a network, never a category page. */
  partner: string;
  destinationId: Nullable<string>;
  url: string;
  /** True when the link carries a commission. Drives the disclosure requirement. */
  affiliate: boolean;
  /**
   * Only the owner may set this, and only for something genuinely used and willingly
   * recommended. The component refuses to render without it — see AffiliateNote.astro.
   */
  ownerVerified: boolean;
}

export interface FieldNote {
  slug: string;
  title: string;
  /** One sentence. Used as the meta description when seoDescription is absent. */
  summary: string;
  status: FieldNoteStatus;
  /** Must reference a destination id from data/destinations.json. */
  destinationId: Nullable<string>;
  /** Archive photograph ids. The hero and sequence are drawn from the public catalog. */
  heroPhotoId: Nullable<string>;
  photoIds: string[];
  /** Body paragraphs. Plain authored prose; no generated filler. */
  body: string[];
  /** Practical, first-hand context: how to get there, when it is quiet, what it cost. */
  practicalNotes: string[];
  relatedDestinationIds: string[];
  relatedPersonIds: string[];
  recommendations: AffiliateRecommendation[];
  publishedAt: Nullable<string>;
  updatedAt: Nullable<string>;
  seoTitle: Nullable<string>;
  seoDescription: Nullable<string>;
  socialImage: Nullable<string>;
}

/**
 * The authored corpus. Empty by design: Phase 9 delivers the architecture, not the writing.
 * Adding a note here with status 'PUBLISHED' builds its route, adds it to the sitemap and
 * the Field Notes index, and links it from its destination. Drafts build nothing.
 */
export const fieldNotes: FieldNote[] = [];

export const publishedFieldNotes = (): FieldNote[] =>
  fieldNotes
    .filter((note) => note.status === 'PUBLISHED')
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));

export const fieldNotesForDestination = (destinationId: string): FieldNote[] =>
  publishedFieldNotes().filter((note) => note.destinationId === destinationId || note.relatedDestinationIds.includes(destinationId));

/** A recommendation is shown only when the owner has verified it and the link is real. */
export const renderableRecommendations = (note: FieldNote): AffiliateRecommendation[] =>
  note.recommendations.filter((item) => item.ownerVerified && /^https?:\/\/\S+\.\S+/.test(item.url));

/** Disclosure is required whenever any rendered recommendation carries a commission. */
export const requiresAffiliateDisclosure = (note: FieldNote): boolean =>
  renderableRecommendations(note).some((item) => item.affiliate);
