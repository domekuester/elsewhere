# Phase 9 — Business architecture

How the commercial layer is built, why it is shaped this way, and where each part lives in the code.

## Four layers, one brand

| Layer | Route | State |
| --- | --- | --- |
| **Publication** | `/`, `/archive/`, `/people/`, `/destinations/`, `/collections/black-and-white/` | Live. Unchanged by Phase 9 except for footer and navigation. |
| **Studio** | `/studio/` | Live. Three offerings, one combined commission, one enquiry action. |
| **Licensing** | `/licensing/` | Live. Rights desk, enquiry per photograph. |
| **Editions** | — | Foundation only. No public route. Print interest arrives through `/contact/`. |

They share one design system: Barlow Condensed and Literata, the ivory/obsidian ground, ultramarine
reserved for interaction. There are no sub-brands, no separate headers, and no template shift when a
visitor crosses from the archive into the Studio.

## Where the commercial layer sits

Primary navigation is `Explore · People · Destinations · About · Studio`. Studio is last. Licensing and
Contact live in a secondary footer row. Nothing commercial appears on Home, inside the immersive
viewer's photographic space, in People, or in Black & White.

The only commercial affordance inside the photographic experience is a single text link in the
viewer's secondary caption row, beside the destination link, reading *Licensing enquiry*.

## Rights architecture

`src/data/rights.ts` is the contract. Publication permission and licensing permission are separate
axes and are stored separately.

```
publicationStatus  →  may this photograph appear on the site
rightsStatus       →  what may be offered when someone asks to use it
```

| `rightsStatus` | Meaning | Public projection |
| --- | --- | --- |
| `ENQUIRY_ONLY` | Published, copyright held, third-party rights not yet assessed | `enquiry` |
| `EDITORIAL_AVAILABLE` | Owner-confirmed for editorial use | `editorial` |
| `RELEASE_REQUIRED` | Identifiable people, property, artwork or marks present or suspected | `enquiry` |
| `COMMERCIAL_CLEARED` | Owner-confirmed, releases held | `commercial` |
| `NOT_FOR_LICENSE` | Owner-excluded from licensing | `unavailable` |

Alongside it: `modelReleaseStatus`, `propertyReleaseStatus` (`UNKNOWN` / `NOT_REQUIRED` / `REQUIRED` /
`HELD`) and `rightsNotesInternal`. **None of these three ever leave the private layer.** The public
catalog receives one derived field, `licensing`, and `scripts/validate-content.mjs` plus
`scripts/validate-launch.mjs` both fail the build if a private rights field appears in any public
artefact.

### The distinction that matters

An **enquiry** is a question. A **licence** is an offer. Every published photograph can be asked
about; only an owner-confirmed state describes what is actually available. Uncertainty therefore
never resolves into a commercial claim — it resolves into a conversation. `COMMERCIAL_CLEARED` cannot
be set while either release status is still `UNKNOWN`; validation rejects it.

### Current state

| | Count |
| --- | --- |
| Published photographs | 485 |
| `ENQUIRY_ONLY` | 470 |
| `RELEASE_REQUIRED` | 15 |
| `EDITORIAL_AVAILABLE` | 0 |
| `COMMERCIAL_CLEARED` | 0 |
| `NOT_FOR_LICENSE` (all unpublished) | 24 |

Zero cleared photographs is the correct and honest launch state. Nothing has been reviewed for
releases yet, so nothing claims to be cleared. Promoting frames is owner work, not automation.

## Enquiry system

One form at `/contact/`, seven intents (`studio`, `photography`, `digital`, `licensing`, `print`,
`editorial`, `other`), prefilled from the query string.

There is **no server endpoint**. `src/scripts/enquiry.ts` validates in the browser and hands a
composed message to the visitor's own mail client. Nothing to POST to, nothing to rate-limit, no
data in transit, no spam surface. The photo reference is validated against `^[A-Za-z0-9-]{1,32}$`
before it is used.

A licensing enquiry always carries the exact photograph. The viewer writes the frame's stable
three-digit archive reference into the link, the contact form displays it read-only, and it appears
in the message subject and body.

**Superseded for licensing by Phase 16A.** Licensing enquiries now have their own destination at
`/licensing/`, posting to Formspree, with the photograph resolved through the published catalog.
The viewer's licensing action leads there rather than to `/contact/`. See
[PHASE-16A-LICENSING-REVENUE-ENGINE.md](PHASE-16A-LICENSING-REVENUE-ENGINE.md). The `mailto:`
composition in `enquiry.ts` still serves `/contact/`'s other six intents, and still serves
licensing when no Formspree form id is configured.

## Enquiry gating

Every enquiry affordance depends on `PUBLIC_CONTACT_EMAIL`. Without it:

- `EnquiryAction` renders nothing, so Studio, Licensing and About show no call to action
- the viewer's licensing link is not emitted at all
- `/contact/` is `noindex` and drops out of the sitemap and footer
- `npm run build` reports it as an owner action

This is deliberate: an unverified address must never be invented, and a dead form is worse than no
form. See [PHASE-9-OWNER-ACTION-QUEUE.md](PHASE-9-OWNER-ACTION-QUEUE.md).

## Field Notes and affiliate architecture

`src/data/field-notes.ts` holds the content model and an **empty** corpus. Phase 9 delivers the
architecture, not the writing.

- `PUBLISHED` notes build a route, join both sitemaps, and link to their destination.
- `DRAFT` and `OWNER_REVIEW` notes build nothing — there is no draft URL to leak.
- The index is a catch-all route that emits nothing while the corpus is empty, so the site never
  shows an empty section or a "coming soon".

`AffiliateNote.astro` refuses to render a recommendation unless `ownerVerified === true` and the URL
is real. Commission links carry `rel="nofollow sponsored"`, a visible *Commission link* marker, and
trigger a disclosure block. Affiliate content is confined to Field Notes; it cannot appear in the
viewer, People, Black & White, or the general archive.

This chain was verified end to end with a temporary fixture — routes, sitemap entries, `Article`
schema, verified-only rendering, and disclosure — and the fixture was removed. The corpus is empty.

## Analytics

`src/scripts/analytics.ts` emits named events on an internal bus. **Nothing leaves the browser
unless `PUBLIC_ANALYTICS_PROVIDER` is set.** No cookies, no identifiers, no user-entered content —
event context is only ever a route, a slug, or a public archive reference.

Events: `navigation_open`, `archive_open`, `archive_more`, `destination_open`, `people_open`,
`black_white_open`, `viewer_open`, `viewer_next`, `viewer_previous`, `viewer_close`, `studio_open`,
`studio_inquiry_click`, `licensing_open`, `licensing_inquiry_click`, `print_inquiry_click`,
`field_note_open`, `affiliate_click`, `outbound_click`, `contact_email_click`, `enquiry_submit`.

Plausible and Umami bridges are implemented and dormant. Provider choice is an owner decision.

## Advertising

Not implemented, by design. If it is ever introduced it must not appear in the immersive viewer, in
People, in Black & White, or between homepage photographic moments — only inside Field Notes and
utility content, and only when traffic makes it worth the cost to the reading experience.

## Files

```
src/config/site.ts                     site + business config, env-gated identity
src/config/routes.ts                   indexable route registry; crawl vs index separation
src/data/rights.ts                     rights contract
src/data/field-notes.ts                Field Notes + affiliate model (corpus empty)
src/data/image-schema.ts               ImageObject + breadcrumb builders
src/components/EnquiryAction.astro     gated enquiry call to action
src/components/AffiliateNote.astro     owner-verified recommendations only
src/pages/{about,studio,licensing,contact}.astro
src/pages/field-notes/[...page].astro  index, builds only when a note exists
src/pages/field-notes/[slug].astro     published notes only
src/pages/sitemap.xml.ts               registry-driven
src/pages/sitemap-images.xml.ts        532 image declarations
src/scripts/enquiry.ts                 endpoint-free enquiry composition
src/scripts/analytics.ts               event bus + dormant provider bridge
```
