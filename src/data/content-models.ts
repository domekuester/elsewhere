import type { ArchivePhotograph, Nullable } from './archive';

export interface EditorialStory {
  id: string;
  slug: string;
  title: string;
  dek: Nullable<string>;
  photoIds: string[];
  relatedDestinationIds: string[];
  relatedPersonIds: string[];
  manualPhotoOrder: string[];
  status: 'draft' | 'published';
  storyType?: 'VISUAL_ESSAY' | 'ENCOUNTER' | 'PLACE_NOTE' | 'MEMORY' | 'SEQUENCE' | 'PHOTO_STORY' | 'SHORT_STORY';
  heroPhotoId?: Nullable<string>;
  ownerNotes?: Nullable<string>;
  editorialStatus?: 'UNREVIEWED' | 'CURATED' | 'NEEDS_INFO' | 'READY' | 'PUBLISHED' | 'HOLD' | 'PRIVATE';
}

export interface StoryFragment {
  id: string;
  slug: string;
  kind: 'fragment' | 'encounter' | 'moment' | 'note';
  text: Nullable<string>;
  time: Nullable<string>;
  photoIds: string[];
  destinationId: Nullable<string>;
  personIds: string[];
  status: 'draft' | 'published';
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  countryCode: Nullable<string>;
  parentId: Nullable<string>;
  manuallyApprovedPhotoIds: string[];
  editorialPhotoOrder: string[];
  status: 'planned' | 'active';
}

export interface Journey {
  id: string;
  slug: string;
  title: Nullable<string>;
  workingTitle: string;
  startDate: Nullable<string>;
  endDate: Nullable<string>;
  destinationIds: string[];
  heroPhotoId: Nullable<string>;
  photoIds: string[];
  storyIds: string[];
  peopleIds: string[];
  fragmentIds: string[];
  editorialSummary: Nullable<string>;
  ownerNotes: Nullable<string>;
  publicationStatus: 'needs-owner-input' | 'ready' | 'published' | 'hold' | 'private';
  manualPhotoOrder: string[];
}

export interface PersonEntry {
  id: string;
  slug: Nullable<string>;
  displayName: Nullable<string>;
  identityStatus: 'KNOWN' | 'FIRST_NAME_ONLY' | 'ANONYMOUS' | 'UNKNOWN';
  classification: Nullable<'PORTRAIT_SUBJECT' | 'ENCOUNTER' | 'TRAVEL_COMPANION' | 'KNOWN_PERSON' | 'ANONYMOUS_PERSON' | 'CROWD_STREET' | 'INCIDENTAL_HUMAN_PRESENCE'>;
  photoIds: string[];
  primaryPhotoId: Nullable<string>;
  destinationIds: string[];
  journeyIds: string[];
  storyIds: string[];
  shortMemory: Nullable<string>;
  quote: Nullable<string>;
  ownerNotes: Nullable<string>;
  privacyStatus: 'PUBLIC' | 'REVIEW' | 'PRIVATE' | 'DO_NOT_PUBLISH' | 'UNKNOWN';
  publicationStatus: 'NEEDS_OWNER_INPUT' | 'READY' | 'PUBLISHED' | 'HOLD' | 'PRIVATE';
}

export type PhotoCatalog = ArchivePhotograph[];
