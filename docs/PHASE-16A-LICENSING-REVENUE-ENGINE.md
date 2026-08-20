# Phase 16A — Licensing revenue engine

The first real revenue path: **photograph → licensing interest → qualified enquiry → the owner
prices and negotiates by hand.** No pricing, no checkout, no accounts, no automatic delivery.
Phase 16A builds the destination and finds out whether real visitors ask.

The publication comes first. Nothing here puts a sales affordance over a photograph, into a Journey
layout, or onto Home, People or Black & White.

## Architecture

| Concern | Where |
| --- | --- |
| Public photo projection and reference resolution | [src/data/licensing.ts](../src/data/licensing.ts) |
| Feature gate, Formspree endpoint, intended-use list | [src/config/licensing.ts](../src/config/licensing.ts) |
| The conversion destination | [src/pages/licensing.astro](../src/pages/licensing.astro) |
| Form lifecycle and photo resolution in the browser | [src/scripts/licensing.ts](../src/scripts/licensing.ts) |
| Funnel entry in the archive viewer | [src/components/PhotoViewer.astro](../src/components/PhotoViewer.astro), [src/scripts/archive.ts](../src/scripts/archive.ts) |
| Rights and privacy gate | [scripts/validate-licensing.mjs](../scripts/validate-licensing.mjs) |
| Built-output gate | [scripts/validate-launch.mjs](../scripts/validate-launch.mjs) |

There is **one registry**. `public/data/photo-catalog.json` is the published catalog the archive
already fetches; `src/data/licensing.ts` narrows a record from it to the eleven public values the
enquiry needs. No second list of licensable photographs exists, and none should be created.

`src/data/licensing.ts` deliberately imports nothing from Astro. The same function runs in the
browser, and under plain Node in the validator, so the tested code is the shipped code.

## Entry surfaces

**Primary — the archive viewer.** The `Enquire about licensing` action already lived in the
viewer's secondary caption row; Phase 16A points it at the licensing page, carries the frame's
canonical id, and records which archive surface the enquiry started on. One implementation at the
shared abstraction serves all three routes that mount the viewer — `/archive/`,
`/archive/black-and-white/` and `/archive/place/<slug>/`.

```
/elsewhere/licensing/?photo=photo-0687&from=archive#enquiry
```

`from` is one of `archive`, `black-and-white`, `place-<slug>`. It is a label recorded with the
enquiry — **never** turned into a URL.

The action is suppressed for any frame whose rights state is `unavailable`, and is not emitted at
all unless an enquiry can actually be made.

**Secondary — the licensing page**, reachable from the footer, Contact and About, and directly.

Nothing else gained a licensing affordance. Journey, Destination, People, Black & White and Home
have no image-detail surface that could carry one without becoming a shop, so they have none.

### Mobile

The viewer's caption links were hidden below 560px, which meant the funnel's primary entry did not
exist on a phone. The licensing action now returns on its own line under the caption, with a 39px
hit area, clear of the photograph and of the navigation controls. The destination link stays hidden;
one action is the point.

## The photograph identifier

| | |
| --- | --- |
| Canonical public id | `photo-0687` — the catalog's own id, stable across archive re-ordering |
| Public reference | `687` — the three digits printed beneath the frame, and what the page's copy tells visitors to quote |

Both resolve. A hand-written `?photo=687` and a viewer-generated `?photo=photo-0687` reach the same
frame. No private filename, source path or archive path is ever used as an identifier.

## The public projection

```ts
{ id, reference, src, publicImage, width, height, alt, publicContext, returnPath, returnLabel, enquiryAllowed }
```

Built by construction, not by deletion: a field added to the catalog cannot appear on the licensing
surface unless it is added here too, and `validate-licensing.mjs` asserts the exact key set.

- `publicContext` is `place, region, destination`, de-duplicated — the same rule `imageObject`
  already applies to `contentLocation`. A frame whose place is unassigned shows nothing rather than
  a guessed country.
- `alt` uses reviewed alt text where it exists, otherwise states the frame's reference and its
  published place. It never describes what the photograph depicts on the strength of a guess.
- `returnPath` is derived from the record — a published destination's chapter, or the archive
  filtered to that place. It is never built from a query value.

## Form

Provider: **Formspree**. Integration: the documented AJAX contract — `POST` of a `FormData` body to
`https://formspree.io/f/<id>` with `Accept: application/json`, success recognised by `{ next }` and
refusal by `{ error }` or `{ errors: [...] }`. This is exactly what `@formspree/core` does
internally; taking the contract directly adds no dependency and leaves ELSEWHERE owning every
pixel and every state, which the library's own rendering and default styles would not.

The `action` attribute points at the same endpoint, so the form is a real working POST without
JavaScript, and the script sets `noValidate` itself — without JS the browser's native validation runs.

### Fields

| Field | Name | Required |
| --- | --- | --- |
| Your name | `name` | yes |
| Email | `email` | yes |
| Company or publication | `company` | no |
| Intended use | `intended_use` | yes |
| Where will it appear? | `publication_or_destination` | no |
| Photograph or page reference | `photograph_reference` | no — shown only when no frame was carried in |
| Project details | `message` | yes |

Intended use: Editorial · Commercial / advertising · Book / publishing · Website / digital ·
Film / television · Other.

Deliberately absent: phone, postal address, legal entity, territory matrix, circulation, licence
term, budget, tax id. Those are questions for an enquiry that turns out to be real.

### Sent with every submission

`_subject` (`ELSEWHERE licensing enquiry — photo-0687`, or the generic form), `_gotcha` (honeypot),
and when a frame was carried in: `photo_id`, `photo_reference`, `photo_context`, `photo_public_url`,
`source_page`, `source_section`. Every value is public. The email field is named `email` so
Formspree uses it for reply-to.

### States

`IDLE → SUBMITTING → SUCCESS | FIELD ERROR | GENERAL ERROR`, with a status region that is
`role="status" aria-live="polite"`.

- **Submitting** disables the button, sets `aria-busy`, shows `Sending…`, and a re-entrancy guard
  drops any further submit. Three rapid submits produce exactly one request.
- **Success** replaces the form, moves focus to the heading, and offers a return to the photograph.
  It promises no response time, because none has been given.
- **Errors** never discard what was typed. Field-level messages from Formspree are shown against
  the field and focus moves there; a general provider failure gets ELSEWHERE's own calm sentence
  rather than the provider's wording, and focus moves to the status.

Accessibility: real labels, `aria-invalid`, error elements associated through `aria-describedby`
while invalid, visible focus, correct input types, and errors cleared as soon as they are addressed.

### Spam

Formspree's supported `_gotcha` honeypot, hidden from layout, from the accessibility tree and from
the tab order. Formspree's own automated protections do the rest; no CAPTCHA was added.

## Rights and privacy

Publication permission is checked before licensing permission. A photograph that may not appear at
all cannot acquire an enquiry action by being named in a URL.

- The query string is a lookup request, never content. Values are matched against
  `^[A-Za-z0-9-]{1,32}$` and resolved through the registry; unknown, private, excluded and
  not-for-license references all return null and the page becomes a general enquiry.
- Every value written into the page goes through `textContent` / `setAttribute`.
- `modelReleaseStatus`, `propertyReleaseStatus`, `rightsNotesInternal`, GPS, private notes,
  provenance and source paths are absent from the projection by construction, and their absence is
  asserted per photograph.
- Nothing claims clearance. The CTA asks; only an owner-confirmed rights state describes real
  availability, and the launch validator fails the build on a blanket clearance claim, an invented
  price, or a public placeholder.

**A bug this phase found and fixed:** `hidden` was being defeated by author `display` rules — the
browser's `[hidden] { display: none }` sits in the user-agent sheet and lost to
`.contact-field { display: grid }` and to the viewer's mobile licensing rule. The viewer hides its
licensing action for a not-for-license frame by setting exactly that attribute, so on a phone that
action would have rendered anyway. `[hidden] { display: none !important }` is now a global reset;
it also fixes the Contact page's photograph-reference field, which had never actually hidden.

## Configuration

| Variable | Effect |
| --- | --- |
| `PUBLIC_FORMSPREE_LICENSING_FORM_ID` | The `<id>` from `https://formspree.io/f/<id>`. Public integration configuration, not a credential. Present and well-formed ⇒ the enquiry form is live. |
| `PUBLIC_LICENSING_ENABLED` | Optional override. `false` takes a configured funnel off the site without deleting the id. `true` asserts it must be live, and a missing or malformed id then **fails the build** instead of degrading quietly. |

Enablement is derived rather than declared, matching `business.enquiriesEnabled`: supplying a real
form id is the act of enabling the feature. Unset with no id is the ordinary pre-setup state — the
build passes, the site deploys, and the Licensing page renders its enquiry link instead of a form
that posts nowhere.

Malformed and documentation-placeholder ids (`YOUR_FORM_ID`, `mrbgwkjd`, …) are rejected.

### Local owner review

Under `npm run dev` with no form id configured, the complete form renders with a preview notice and
a mock submission. `import.meta.env.DEV` is statically false in `astro build`, so the branch, its
notice and its mock are eliminated from the production bundle — and the launch validator fails the
build if the notice ever appears in built HTML.

```
npm run dev
/licensing/?photo=687#enquiry              # success state
/licensing/?photo=687&preview=error        # general error state
/licensing/?photo=687&preview=invalid      # field error state
/licensing/                                # generic enquiry
```

## Measurement hooks (no analytics)

No provider was installed. Stable semantic hooks are in place for Phase 16B:
`data-licensing-action="open"` on the viewer entry, `"form"` and `"submit"` on the form and its
button, and `"success"` / `"error"` / `"invalid"` set on the outcome elements. The project's
existing internal event bus also emits `licensing_photo_selected`, `licensing_enquiry_submit` and
`licensing_enquiry_success`; it has no subscriber unless the owner configures one.

## Testing

`npm run validate:licensing` — 20 checks over 535 published photographs, 115 registered exclusions
and 181 non-public photographs, run before every build:

- every published photograph resolves by both its canonical id and its archive reference
- no owner-rejected, excluded, private or non-public photograph resolves to a licensing CTA
- a not-for-license or non-public frame never resolves, asserted as a rule rather than read off
  today's data
- hostile and unknown references (`<script>`, traversal, SQL, over-length, unknown ids) fall back
- the projection exposes only its declared keys, carries no private value, invents no location,
  and produces only safe in-site return paths
- `PUBLIC_LICENSING_ENABLED` is never asserted without a usable form id

`npm run validate:launch` additionally checks the built output for a form with no endpoint, a
malformed endpoint, a shipped preview notice, a public placeholder, a reserved-domain address, an
invented price, and blanket clearance claims.

Browser QA at 1440 and 390, against a production build served under `/elsewhere/`, with Formspree
intercepted so no real submission left the browser: generic enquiry, photo-specific enquiry,
unknown/hostile reference, required-field validation, invalid email, successful submission,
Formspree field error, Formspree server error, network failure, triple-submit protection, the
return-to-photograph link, and the un-configured fallback state. 23 routes, 667 links and assets,
0 broken, 0 site-caused console errors, no horizontal overflow.

## Owner actions

1. Create one Formspree form for ELSEWHERE licensing enquiries and set its notification address in
   the Formspree dashboard. No credentials are needed here.
2. Copy the form id — the `<id>` in the endpoint `https://formspree.io/f/<id>`.
3. Add it as the GitHub repository variable `PUBLIC_FORMSPREE_LICENSING_FORM_ID`
   (Settings → Secrets and variables → Actions → Variables). It is a **variable**, not a secret.
   For local review, the same key in `.env`.
4. `PUBLIC_CONTACT_EMAIL` is currently the reserved placeholder `enquiries@elsewhere.example`. It
   is never printed as a fallback while it stays reserved, but every other enquiry affordance on
   the site still renders and points at an address that cannot receive mail. Set a real address or
   clear the variable.
5. There is **no Privacy page on the site**, and licensing enquiries are transmitted through
   Formspree, a third party. See "Privacy — outstanding owner action" below.

## Privacy — outstanding owner action

The site has no privacy, imprint or terms route. Licensing enquiries now leave the browser and are
processed by a third party, so a privacy notice is required before the funnel is published in the
EU. It is not written here, because most of what it must state is owner information that cannot be
invented.

Per Formspree's own privacy policy, a submission gives them **more than the form fields**: they
record "your IP address, browser type, domain names, access times and referring website addresses",
and state no fixed retention period for submissions. The form's consent line was corrected in 16A.2
accordingly — it no longer claims that nothing else is collected, because that was not true.

The minimum a notice has to state, and who can supply each part:

| Fact | Source |
| --- | --- |
| Controller identity, postal address, contact address | **Owner only** — legal identity, never invented here |
| That licensing enquiries are processed by Formspree Inc. (US) as a service provider | Established |
| What is submitted: name, email, optional company, intended use, optional destination, project details, and the public photograph reference | Established — see the field table above |
| That Formspree additionally records IP address, browser type, access time and referrer | Formspree's privacy policy |
| Legal basis, retention period, and the data subject's rights | **Owner / their legal advice** |
| Whether a DPA and an EU transfer mechanism are in place with Formspree | **Owner** — request from team@formspree.io |

The technical funnel is not blocked by this. It ships disabled until a form id is configured, and
the owner controls both switches independently.

## Deliberately not in this phase

Google Image licensing structured data, Search Console, conversion measurement, analytics
providers, fixed prices, checkout, automatic delivery, print fulfilment. The architecture keeps
Phase 16C's fixed-price licences possible — the projection and the rights states extend without the
publication layer changing — but none of it is built. Phase 16B connects measurement now that the
destination and the public ids are stable.
