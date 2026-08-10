// Publication permission and licensing permission are separate concepts.
// A photograph can be right for an authored publication and still be unsuitable
// for commercial licensing. `publicationStatus` answers "may this appear on the
// site". `rightsStatus` answers "what may be offered when someone asks to use it".

export type RightsStatus =
  /** Public, copyright held, third-party rights not yet assessed. An enquiry may be made; nothing is offered. */
  | 'ENQUIRY_ONLY'
  /** Owner-confirmed: suitable for editorial use. Commercial use still requires a separate conversation. */
  | 'EDITORIAL_AVAILABLE'
  /** Identifiable people, property, artwork or marks are present or suspected. Commercial use blocked pending a release. */
  | 'RELEASE_REQUIRED'
  /** Owner-confirmed: releases held, commercial use may be offered. */
  | 'COMMERCIAL_CLEARED'
  /** Owner-confirmed: never offer this photograph for licensing. */
  | 'NOT_FOR_LICENSE';

export type ReleaseStatus = 'UNKNOWN' | 'NOT_REQUIRED' | 'REQUIRED' | 'HELD';

/** The only rights information the public site ever sees. */
export type PublicLicensing = 'enquiry' | 'editorial' | 'commercial' | 'unavailable';

export interface PhotoRights {
  rightsStatus: RightsStatus;
  modelReleaseStatus: ReleaseStatus;
  propertyReleaseStatus: ReleaseStatus;
  /** Private. Never serialised into any public catalog, page, or structured data. */
  rightsNotesInternal: string | null;
}

export const PUBLIC_LICENSING: Record<RightsStatus, PublicLicensing> = {
  ENQUIRY_ONLY: 'enquiry',
  EDITORIAL_AVAILABLE: 'editorial',
  RELEASE_REQUIRED: 'enquiry',
  COMMERCIAL_CLEARED: 'commercial',
  NOT_FOR_LICENSE: 'unavailable',
};

/**
 * An enquiry is a question, not an offer. Every licensable state may be asked about;
 * only owner-confirmed states describe what is actually available. Uncertainty never
 * produces a commercial claim.
 */
export const canEnquire = (licensing: PublicLicensing): boolean => licensing !== 'unavailable';

/** Only owner-confirmed clearance may ever be described as commercially available. */
export const isCommerciallyOffered = (licensing: PublicLicensing): boolean => licensing === 'commercial';

/** Public wording per state. Never promises availability that has not been confirmed. */
export const LICENSING_LABEL: Record<PublicLicensing, string> = {
  enquiry: 'Licensing enquiry',
  editorial: 'Licensing enquiry',
  commercial: 'Licensing enquiry',
  unavailable: '',
};
