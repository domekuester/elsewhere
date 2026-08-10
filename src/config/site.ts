// Owner-supplied values arrive through the environment so that nothing about the
// publication's identity, contact details, or legal entity is invented in code.
// Where a value is absent the corresponding surface degrades honestly rather than
// showing a placeholder: see `business.enquiriesEnabled`.
const contactEmail = (import.meta.env.PUBLIC_CONTACT_EMAIL ?? '').trim();
const creatorName = (import.meta.env.PUBLIC_CREATOR_NAME ?? '').trim();

export const site = {
  name: 'ELSEWHERE',
  title: 'Elsewhere — Places, people, moments',
  description: 'An independent visual publication about places, people and the moments that remain.',
  statement: 'The world, as I remember it.',
  locale: 'en',
  defaultShareImage: '/social/home.jpg',
  defaultShareImageAlt: 'Volcanic ridges rising beneath immense sunlit clouds',
  navigation: [
    { label: 'Explore', href: '/archive/' },
    { label: 'People', href: '/people/' },
    { label: 'Destinations', href: '/destinations/' },
    { label: 'About', href: '/about/' },
    { label: 'Studio', href: '/studio/' },
  ],
  // Commercial routes live at the edges, never in the primary photographic path.
  secondaryNavigation: [
    { label: 'Studio', href: '/studio/' },
    { label: 'Licensing', href: '/licensing/' },
    { label: 'Contact', href: '/contact/' },
  ],
} as const;

export const business = {
  /** Attribution used in credits, copyright notices and ImageObject schema. */
  creator: creatorName || site.name,
  /** True only when a real name has been supplied; schema uses Person vs Organization accordingly. */
  creatorIsPerson: Boolean(creatorName),
  contactEmail,
  /**
   * Every enquiry path — Studio, Licensing, print interest, the viewer action — depends on a
   * verified public address. Without one the actions are not rendered and the routes are
   * noindexed, rather than shipping a dead form or an invented address.
   */
  enquiriesEnabled: Boolean(contactEmail),
  copyrightNotice: `© ${creatorName || site.name}. All rights reserved.`,
  /** Rights holder line shown in the footer and used as ImageObject creditText. */
  creditText: `${creatorName || site.name} / ELSEWHERE`,
  licensingPage: '/licensing/',
  contactPage: '/contact/',
  /** Enquiry types offered on the contact route. One form, several intents. */
  enquiryTypes: [
    { id: 'studio', label: 'Studio project' },
    { id: 'photography', label: 'Photography' },
    { id: 'digital', label: 'Website or digital experience' },
    { id: 'licensing', label: 'Photography licensing' },
    { id: 'print', label: 'Print interest' },
    { id: 'editorial', label: 'Editorial or press' },
    { id: 'other', label: 'Something else' },
  ],
} as const;

export type EnquiryType = (typeof business.enquiryTypes)[number]['id'];
