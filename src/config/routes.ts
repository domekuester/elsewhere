import destinationData from '../../data/destinations.json';
import { publishedFieldNotes } from '../data/field-notes';
import { business } from './site';

/**
 * The single source of truth for what search engines are invited to index.
 *
 * A route belongs here only when it carries genuine content. Thin, private, draft, and
 * enquiry-gated surfaces are absent by construction rather than excluded by a deny-list,
 * so a new internal route cannot leak into the sitemap by being forgotten.
 */
export interface IndexableRoute {
  path: string;
  /** Relative weight within the site. Used only for sitemap priority. */
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export const indexableRoutes = (): IndexableRoute[] => [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/archive/', priority: 0.9, changefreq: 'weekly' },
  { path: '/archive/black-and-white/', priority: 0.8, changefreq: 'weekly' },
  { path: '/collections/black-and-white/', priority: 0.8, changefreq: 'monthly' },
  { path: '/people/', priority: 0.7, changefreq: 'monthly' },
  { path: '/destinations/', priority: 0.8, changefreq: 'monthly' },
  // Only destinations that passed the publication threshold have a page to index.
  // Places with photographs but no chapter are addressable through the archive, and each opens on
  // its own photography, so they are real indexable pages rather than a query string.
  ...destinationData.destinations
    .filter((destination) => destination.publicationStatus !== 'published' && destination.photoCount > 0 && destination.hero?.photoId)
    .map((destination) => ({ path: `/archive/place/${destination.slug}/`, priority: 0.6, changefreq: 'monthly' as const })),
  ...destinationData.destinations
    .filter((destination) => destination.publicationStatus === 'published')
    .map((destination) => ({ path: `/destinations/${destination.slug}/`, priority: 0.9, changefreq: 'monthly' as const })),
  { path: '/about/', priority: 0.7, changefreq: 'yearly' },
  { path: '/studio/', priority: 0.8, changefreq: 'monthly' },
  { path: '/licensing/', priority: 0.7, changefreq: 'yearly' },
  // Contact is only reachable, and only indexable, once a verified address exists.
  ...(business.enquiriesEnabled ? [{ path: business.contactPage, priority: 0.5, changefreq: 'yearly' as const }] : []),
  // Drafts build no route, so nothing here can point at an unpublished note.
  ...(publishedFieldNotes().length > 0 ? [{ path: '/field-notes/', priority: 0.8, changefreq: 'weekly' as const }] : []),
  ...publishedFieldNotes().map((note) => ({ path: `/field-notes/${note.slug}/`, priority: 0.7, changefreq: 'monthly' as const })),
];

/**
 * Crawling and indexing are different controls and must not be conflated.
 *
 * `disallowRoutes` blocks crawling in robots.txt. Only genuinely private tooling belongs
 * here: /curate/ is additionally stripped from the production build entirely.
 *
 * Thin pages such as the /collections/ index are kept out of search with a `noindex` meta
 * tag on the page instead. Blocking them in robots.txt would stop crawlers ever reading
 * that tag, and a prefix rule would also block /collections/black-and-white/, which is a
 * real indexable page.
 */
export const disallowRoutes = ['/curate/'];
