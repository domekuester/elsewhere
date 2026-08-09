export type Nullable<T> = T | null;
export type EditorialRole = 'hero' | 'anchor' | 'editorial' | 'support' | 'detail' | 'archive';
export type ContentConfidence = 'CONFIRMED_METADATA' | 'CONFIRMED_OWNER' | 'CONFIRMED_EXISTING_DATA' | 'CURATORIAL_ASSIGNMENT' | 'LIKELY' | 'UNCONFIRMED' | 'NEEDS_OWNER_INPUT' | 'UNKNOWN' | 'CONFIRMED_OWNER_RANGE' | 'OWNER_APPROXIMATE_RANGE' | 'TRANSITION_DAY_REVIEW';
export type MetadataSource = 'EXIF' | 'APPLE_PHOTOS' | 'OWNER' | 'OWNER_TRAVEL_TIMELINE' | 'FILE_STRUCTURE' | 'EXISTING_MANIFEST' | 'CURATION_STUDIO' | 'VISUAL_EDITORIAL_REVIEW';

export interface PublicLocation {
  country: Nullable<string>;
  region: Nullable<string>;
  place: Nullable<string>;
}

export interface PrivateLocation {
  latitude: Nullable<number>;
  longitude: Nullable<number>;
}

export interface ArchivePhotograph {
  id: string;
  filename: string;
  originalFilename: string;
  slug: string;
  orientation: Nullable<'landscape' | 'portrait' | 'square' | 'panorama'>;
  aspectRatio: Nullable<number>;
  width: Nullable<number>;
  height: Nullable<number>;
  captureDate: Nullable<string>;
  year: Nullable<number>;
  camera: Nullable<string>;
  lens: Nullable<string>;
  category: Nullable<'people' | 'beaches' | 'urban' | 'jungle' | 'ocean'>;
  subcategories: string[];
  destination: Nullable<string>;
  destinationId?: Nullable<string>;
  destinationConfidence?: ContentConfidence;
  locationSource?: Nullable<MetadataSource>;
  place: Nullable<string>;
  people: string[];
  journey: Nullable<string>;
  story: Nullable<string>;
  mood: Nullable<string>;
  dominantColor: Nullable<string>;
  heroScore: Nullable<number>;
  editorialScore: Nullable<number>;
  editorialRole: Nullable<EditorialRole>;
  emotionalIntensity: Nullable<number>;
  visualRhythmUse: Nullable<'expansion' | 'intimacy' | 'transition' | 'pause' | 'continuity'>;
  monochrome: Nullable<boolean>;
  peoplePresent: Nullable<boolean>;
  public: boolean;
  publicationStatus?: 'UNREVIEWED' | 'CURATED' | 'NEEDS_INFO' | 'READY' | 'PUBLISHED' | 'HOLD' | 'PRIVATE';
  featured: boolean;
  altText: Nullable<string>;
  caption: Nullable<string>;
  privateLocation: PrivateLocation;
  publicLocation: PublicLocation;
}

export type PublicationKind = 'journey' | 'destination' | 'place' | 'person' | 'collection' | 'story' | 'field-note';
