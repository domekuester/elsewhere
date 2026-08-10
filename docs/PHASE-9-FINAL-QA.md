# Phase 9 — Final QA

All results below were observed in a real browser against the production build, not inferred.

## Build and validation

| Check | Result |
| --- | --- |
| `npm run build` | **PASS** |
| Content validation (588 photos, 8 destinations, 10 journeys) | **PASS** |
| Rights integrity (new in Phase 9) | **PASS** |
| Owner exclusion validation — sources | **PASS** — 24 rejected, 0 references across 32 surfaces |
| Owner exclusion validation — built output | **PASS** — 0 references across 23 built files |
| Privacy / production boundary (`/curate/` absent) | **PASS** |
| Launch validation | **PASS** — 13 HTML files, unique canonicals and titles, complete social metadata |
| Sitemap ↔ build consistency | **PASS** — every listed route built and indexable |
| Image sitemap asset existence | **PASS** — 532 declarations, 0 missing |

## Routes

13 public routes. `/field-notes/` correctly absent — the corpus is empty and the route emits nothing.

Indexed (11): `/`, `/archive/`, `/archive/black-and-white/`, `/collections/black-and-white/`,
`/people/`, `/destinations/`, `/destinations/japan/`, `/about/`, `/studio/`, `/licensing/`,
`/contact/`.

Noindex (2): `/collections/` (thin index), `/404`. `/curate/` is stripped from the build entirely.

## Rights QA

| Measure | Count |
| --- | --- |
| Public photographs | 485 |
| Licensing enquiry eligible | 485 |
| `ENQUIRY_ONLY` (rights not yet assessed) | 470 |
| `RELEASE_REQUIRED` (people/property present) | 15 |
| `EDITORIAL_AVAILABLE` (owner-confirmed) | 0 |
| `COMMERCIAL_CLEARED` (owner-confirmed) | 0 |
| `NOT_FOR_LICENSE` | 24 (all unpublished) |

Zero cleared photographs is the honest state: no rights review has been performed, so nothing claims
clearance. No public artefact exposes `rightsStatus`, `rightsNotesInternal`, `modelReleaseStatus` or
`propertyReleaseStatus` — asserted by two validators.

## Business flow QA

**Home → Studio → enquiry.** Studio renders three service pillars and exactly one call to action
resolving to `/contact/?type=studio`. Contact loads with "Studio project" preselected.

**Viewer → licensing enquiry.** Opened frame 507 from the archive; the licensing link appeared in the
secondary caption row reading *Licensing enquiry*, with `href=/contact/?type=licensing&photo=507`.
Geometric check confirmed the action does **not** overlap the photograph. Stepping to the next frame
updated the reference to `001` — the enquiry always names the exact photograph.

**Licensing → contact.** Reference `507` arrives in a read-only field; the licensing-specific message
hint appears; subject and body carry the reference.

**Contact form.** No server endpoint. Submitting empty produced 3 inline errors, set `aria-invalid`
on 3 fields, and moved focus to the first invalid control. A hostile photo reference
(`?photo=<script>`) was rejected by the validation pattern and the field stayed hidden.

**Field Notes → destination → affiliate.** Verified with a temporary fixture, then removed: the note
route and index built, both joined the sitemap, `Article` schema emitted, the owner-verified
recommendation rendered with `rel="nofollow sponsored"` and a disclosure block, and the unverified
recommendation did **not** render — its URL appeared nowhere in the output. Final build contains no
Field Notes route.

## Viewports

7 widths × 9 routes = **63 combinations**: 1600, 1280, 1024, 768, 430, 390, 320.

- Horizontal overflow: **0**
- Broken images: **0**

The archive reports two `<img>` elements with no natural width; both are the closed viewer's
placeholder elements, which carry no `src` attribute until a photograph opens. Not broken assets.

## Accessibility

| Check | Result |
| --- | --- |
| Form controls with programmatic labels | 10 / 10 |
| Controls without a visible focus indicator | 0 |
| Landmarks (main, header, footer, nav) | Present on every new page |
| Heading order | No skipped levels |
| Small-print contrast after fix | 5.36:1 (was 3.47:1) — **AA pass** |
| Error messaging | Inline, `aria-invalid`, focus moved to first error |

One real issue found and fixed: two muted greys on the ivory ground (`#7d817d`, `#6d716d`) failed
WCAG AA for body-size text. Both replaced with `#5f635f` across 8 declarations.

## Console

**0 errors** across Home, Archive, Black & White, People, Destinations, Japan, About, Studio,
Licensing, Contact.

Warnings are pre-existing and unrelated to Phase 9: 23 archive derivatives contain a space in the
filename (`… Kopie.jpg`), which is invalid in a `srcset` candidate, so Chrome drops those candidates
and falls back to `src`. Images display correctly. Documented in the Phase 8.45 report; fixing it
means renaming derivatives in the image pipeline.

## Payload

| | Size |
| --- | --- |
| Total JavaScript | 122 KB across all routes |
| Total CSS | 66 KB |

Phase 9 added no libraries, no commerce framework, no analytics vendor script, and no client-side
form runtime. The enquiry script is a single small module loaded only on `/contact/`. Fonts,
images, viewer and archive behaviour are unchanged.

## Owner exclusion regression

**PASS.** All 24 owner-rejected photographs retain 0 public references. The verifier was also
strengthened during Phase 9 — see below.

## Issue found and fixed during Phase 9

Two owner-rejected photographs were still present in the source tree as **renamed** editorial
derivatives:

- `src/assets/photos/water-portrait.jpg` = P1260248 (photo-0351, the Phase 7 rejection)
- `src/assets/photos/bw-stall.jpg` = 1210415-2 (photo-0026, a FAST & YUMMY SHAWARMA rejection)

Neither was referenced by any page, so public references were genuinely zero — but both were one
import away from returning, exactly as `boxing-guard.jpg` had been before Phase 8.45. The Phase 8.45
verifier could not have caught them: it scanned `src/pages` and `src/components` but not
`src/assets`, and matched by filename stem, which a renamed derivative defeats.

Both files were deleted (masters preserved) and
`scripts/verify-owner-photo-exclusions.mjs` now compares `src/assets/photos/` against the rejected
**masters by image content**, so a rejected frame cannot hide under any filename. Verified by
planting a renamed copy of a rejected master — the validator failed as intended — then removing it.

## Protected systems confirmed intact

Home hero · Barlow Condensed + Literata · ultramarine discipline · People composition · Black & White
identity and dedicated archive · Japan destination architecture · general archive and stable archive
numbering · immersive viewer geometry · native scroll · owner exclusions · public/private curation
boundary.

Phase 9 changed the shared header and footer (navigation entries and a secondary commercial row) and
added one text link to the viewer's secondary caption row. No photographic surface was redesigned.
