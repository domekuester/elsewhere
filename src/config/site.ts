// Owner-supplied values arrive through the environment so that nothing about the
// publication's identity, contact details, or legal entity is invented in code.
// Where a value is absent the corresponding surface degrades honestly rather than
// showing a placeholder: see `business.enquiriesEnabled`.
const contactEmail = (import.meta.env.PUBLIC_CONTACT_EMAIL ?? '').trim();
const creatorName = (import.meta.env.PUBLIC_CREATOR_NAME ?? '').trim();
/**
 * Google Search Console site verification token, when the owner has chosen the meta-tag method.
 *
 * ELSEWHERE is published on a GitHub Pages *project path*, so a Search Console Domain property is
 * not available — the owner does not control github.io DNS — and the property must be a URL-prefix
 * one rooted at the deployment path. Of the verification methods that leaves, the meta tag is the
 * one this repository can carry honestly: it is a public token, not a credential, and it verifies
 * exactly the prefix whose homepage serves it. Unset, no tag is emitted; nothing is ever invented.
 *
 * Set it to the `content` value from Search Console's HTML-tag method, not the whole tag.
 */
const searchConsoleVerification = (import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '').trim();

export const site = {
  name: 'ELSEWHERE',
  title: 'Elsewhere — Places, people, moments',
  description: 'An independent visual publication about places, people and the moments that remain.',
  statement: 'The world, as I remember it.',
  locale: 'en',
  searchConsoleVerification,
  defaultShareImage: '/social/home.jpg',
  defaultShareImageAlt: 'Volcanic ridges rising beneath immense sunlit clouds',
  navigation: [
    { label: 'Journey', href: '/journey/' },
    { label: 'Destinations', href: '/destinations/' },
    { label: 'People', href: '/people/' },
    { label: 'Archive', href: '/archive/' },
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
  /**
   * Whether the address may be *printed* on a page, which is a stricter question than whether an
   * enquiry path may exist. RFC 2606 and RFC 6761 reserve these names so a not-yet-configured
   * value can be detected rather than published; `scripts/validate-launch.mjs` reports the same
   * condition as an owner action. Surfaces that offer the address as a fallback check this, so a
   * placeholder is never shown to a visitor as somewhere they could write.
   */
  contactEmailPublishable: Boolean(contactEmail) && !/@([^@]*\.)?(example|test|invalid|localhost)$/i.test(contactEmail),
  copyrightNotice: `© ${creatorName || site.name}. All rights reserved.`,
  /**
   * Rights holder line shown in the footer and used as ImageObject creditText.
   *
   * A named creator is credited alongside the publication. Without one there is only the
   * publication, and repeating its name on both sides of the slash — "ELSEWHERE / ELSEWHERE" —
   * is a configuration artefact rather than a credit, so the fallback is the name by itself.
   */
  creditText: creatorName ? `${creatorName} / ELSEWHERE` : site.name,
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
