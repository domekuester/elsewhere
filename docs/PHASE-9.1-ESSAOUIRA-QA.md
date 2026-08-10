# Phase 9.1 — QA

Everything below was observed in a browser against the production build.

## Build and validation

| Check | Result |
| --- | --- |
| `npm run build` | **PASS** |
| Content validation (636 photos, 10 destinations, 10 journeys) | **PASS** |
| Rights integrity | **PASS** |
| Owner exclusion validation — sources | **PASS** — 24 rejected, 0 references across 32 surfaces |
| Owner exclusion validation — built output | **PASS** — 0 references across 24 built files |
| Privacy / production boundary (`/curate/` absent) | **PASS** |
| Launch validation | **PASS** — 14 HTML files, unique canonicals and titles |
| Sitemap ↔ build consistency | **PASS** — `/destinations/essaouira/` listed and indexable |
| Image sitemap | **PASS** — every declared asset exists, 0 missing |

## Counts

| | Before | After |
| --- | --- | --- |
| Inventory records | 588 | **636** |
| Public photographs | 485 | **532** |
| Essaouira public | — | **47** |
| Essaouira curated | — | **14** (hero + 13) |
| Black & white public | 36 | **36** |
| Japan public | 216 | **216** |
| Owner-rejected public references | 0 | **0** |
| Image sitemap entries | 532 | **626** |

## Rendered QA

**Chapter** — hero renders full-bleed with the title in its shadowed lower left; provenance reads
"Photographed over 7 days in January", computed from the data; 13 sequence frames, all loaded, 0
broken, 0 overflow.

**Destinations index** — two photographic chapter plates (Japan, Essaouira) above a typographic list
of the five destinations still in edit, ordered by archive depth. Japan's portrait hero and
Essaouira's landscape hero both crop cleanly to the square plate.

**Archive** — 532 frames; `?destination=essaouira` filters to 47. Archive numbering continues at
589–636 with no renumbering of existing frames.

**Viewer** — opened from the Essaouira filter, the viewer reports 047 and Next/Previous stayed inside
Essaouira for every step tested; metadata read "Essaouira · 2026" throughout. The destination link
resolved to `/destinations/essaouira/` and the licensing action carried the correct frame reference.
No jump into unrelated destinations.

**Black & White** — 36 frames, 0 Essaouira frames present, no colour leak.

**Regression** — Home, People, Studio, Licensing, Collections unchanged and rendering correctly.

## Viewports

7 widths × 5 routes = **35 combinations**: 1600, 1280, 1024, 768, 430, 390, 320.

- Horizontal overflow: **0**
- Broken images: **0**
- Title wrapping: single line at every width

**Desktop frame widths** (1440px): 38 / 46 / 46 / 46 / 46 / 54 / 38 / 38 / 46 / 62 / 38 / 54 / 46 %
— genuine scale variation rather than a repeating column.

**Mobile frame widths** (390px): 86 / 66 / 59 / 100 / 70 / 79 / 86 / 66 / 59 / 100 / 70 / 79 / 100 %
— six distinct widths with two full-bleed moments. Before the mobile pass this was a near-uniform
79% column, which read as a feed rather than an edit.

## Console

**0 errors** across Home, Destinations, Essaouira, Japan, Archive, Black & White, People,
Collections, Studio, Licensing.

## Accessibility

Alt text written for all 47 frames from the photographs themselves, factual and specific
("A bird crosses the square of cloud framed by an open courtyard light well"), with no travel-brochure
language and no invented detail. It flows to the archive, the viewer, the image sitemap and
ImageObject structured data. Heading order, landmarks, keyboard access and focus behaviour are
inherited unchanged from the existing destination template.

## Performance

Total JavaScript across all routes unchanged at **122 KB**. No library was added. Images use the
existing three-role derivative pipeline with `srcset`/`sizes`; nothing eagerly loads the Essaouira
archive. 144 new derivatives were generated (48 × 3 roles).

## Defects found and fixed during this phase

1. **Ingestion mislabelled every new photograph as monochrome.** `ingest-new-photo-records.mjs`
   hardcoded `categories: ['black-and-white-candidate']` and the exact Phase 7 note that
   `build-photo-catalog.mjs` reads as a confirmed monochrome review. Unfixed, all 48 colour frames
   would have entered the Black & White archive (36 → 84) with colour leaks throughout. Ingestion now
   records only file facts and leaves editorial state empty.

2. **Sequence role classes collided with orientation classes.** `is-portrait` was emitted both as a
   layout role and as an orientation, so every portrait photograph in every chapter silently took the
   narrow right-hand slot regardless of its role. Roles namespaced to `is-seq-*`.

3. **The layout grid grew implicit columns.** A landscape compensation rule resolved to
   `grid-column: 9 / span 6` on a 12-column grid, creating two extra tracks and shrinking every frame
   on the page. Placement is now explicit and orientation-aware. Japan's frames grew from 30–54% to
   38–62% and its page shortened from 9989px to 8387px — the same photographs at the size the layout
   intended.

4. **Chapters tapered at the end.** The closing frame was narrower than the one before it. Any
   chapter's last frame now takes more width than its role allows.

5. **Mobile was a uniform column.** Fixed as described above.

6. **Destination publication was hardcoded to Japan**, and the destination photo filter accepted only
   timeline-confirmed geography, which would have silently dropped every owner-confirmed Essaouira
   frame. Both generalised.

Fixes 2, 3 and 4 change Japan's appearance. They are bug fixes to a shared system rather than a
redesign, and Japan was re-verified after each.

## Not changed

Home hero and sequence · People composition · Black & White curated edit and archive · general
archive semantics and numbering · immersive viewer geometry · native scroll · header and safe-area
handling · Studio · Licensing · owner exclusions · public/private boundary · typography · ultramarine
discipline. No new font, no Morocco palette, no new motion, no dependency.
