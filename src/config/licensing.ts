// Configuration for the licensing enquiry form. One place decides whether the funnel is live,
// so no page, script or validator has to re-derive it from an environment variable of its own.
//
// A Formspree form ID is public integration configuration — it travels in the page and identifies
// an endpoint, not an account. It is treated as configuration rather than as a secret, and it is
// still never invented: an absent or malformed ID disables submission instead of shipping a form
// that posts nowhere.

import { business } from './site';

const formId = (import.meta.env.PUBLIC_FORMSPREE_LICENSING_FORM_ID ?? '').trim();
const requested = (import.meta.env.PUBLIC_LICENSING_ENABLED ?? '').trim().toLowerCase();

/**
 * Formspree form IDs are short alphanumeric hashes (`mrbgwkjd`, `xqadleqz`). The shape check
 * catches a truncated paste; the placeholder list catches the more dangerous case of a value that
 * looks structurally valid because someone copied the documentation instead of their dashboard.
 */
const PLACEHOLDER_IDS = new Set([
  'yourformid', 'your_form_id', 'formid', 'form_id', 'xxxxxxxx', 'abcdefgh',
  'changeme', 'placeholder', 'example', 'todo', 'test', 'mrbgwkjd', 'meekngvn',
]);
const validFormId = /^[A-Za-z][A-Za-z0-9]{5,23}$/.test(formId) && !PLACEHOLDER_IDS.has(formId.toLowerCase());

// Enablement is derived rather than declared, matching how `business.enquiriesEnabled` reads a
// verified address: supplying a real form ID is the act of enabling the feature. PUBLIC_LICENSING_ENABLED
// exists as an explicit override in both directions — 'false' takes a configured funnel back off
// the public site without deleting the ID, and 'true' asserts that the ID must be valid.
const disabledByOwner = requested === 'false' || requested === '0' || requested === 'off';
const assertedByOwner = requested === 'true' || requested === '1' || requested === 'on';

// Asserting the feature is on while the ID cannot work is a configuration error, not a state to
// degrade quietly from: the owner has said the funnel should be live and it would not be. An
// *unset* flag with no valid ID is the ordinary pre-setup state and simply keeps submission off,
// so a deployment that has not been configured yet still builds and still publishes.
if (assertedByOwner && !validFormId) {
  throw new Error(
    'PUBLIC_LICENSING_ENABLED is set but PUBLIC_FORMSPREE_LICENSING_FORM_ID is missing or malformed. ' +
    'Set the form ID from the Formspree dashboard (the value in https://formspree.io/f/<id>), or clear ' +
    'PUBLIC_LICENSING_ENABLED to keep licensing submission disabled.',
  );
}

const submissionEnabled = validFormId && !disabledByOwner;
/**
 * Local review of the finished form without a configured endpoint. `import.meta.env.DEV` is
 * statically false in `astro build`, so the preview branch and every element inside it are
 * eliminated from the production bundle rather than merely hidden in it.
 */
const previewMode = Boolean(import.meta.env.DEV) && !submissionEnabled;

export const licensing = {
  /** True only when a real endpoint exists and the owner has not switched the funnel off. */
  submissionEnabled,
  /** The documented Formspree AJAX endpoint. Empty string when submission is disabled. */
  endpoint: submissionEnabled ? `https://formspree.io/f/${formId}` : '',
  previewMode,
  /** Whether the page renders a form at all, as opposed to the plain enquiry link. */
  formRendered: submissionEnabled || previewMode,
  /** Kept short on purpose: further detail is collected once an enquiry turns out to be real. */
  intendedUses: [
    { id: 'editorial', label: 'Editorial' },
    { id: 'commercial', label: 'Commercial / advertising' },
    { id: 'publishing', label: 'Book / publishing' },
    { id: 'digital', label: 'Website / digital' },
    { id: 'film', label: 'Film / television' },
    { id: 'other', label: 'Other' },
  ],
} as const;

/**
 * Whether a licensing enquiry can actually be made, by either route.
 *
 * The single condition every funnel entry is gated on. A viewer action that leads to a licensing
 * page with no way to enquire is worse than no action at all, so the link and its destination
 * answer the same question rather than each testing a variable of its own.
 */
export const licensingEnquiryOffered = licensing.formRendered || business.enquiriesEnabled;
