# Phase 8.45 — Owner photo purge, Thailand correction, archive cleanup

Implementation phase. Fifteen owner-rejected photographs removed from the public publication, two
photographs corrected to Thailand privately, exclusion state moved into the canonical data layer, and
a reusable verification script added. No redesign; no prior Phase 8 work undone.

## Resolving archive numbers to stable records

The owner supplied display numbers. These were resolved before anything was changed:

- The three-digit archive number is `photo.index`, a **stable photographic id** derived from the position of the photograph in `docs/photo-inventory.json` — not a filtered display position. The public archive already contained gaps (85 before this phase) from earlier exclusions and duplicate families.
- Because it is a stable id, **no surviving photograph was renumbered.** Public gaps grew from 85 to 100.
- Each number was resolved to its record, then **visually verified** against the owner's descriptions using the actual thumbnails, and the immediate neighbours of each target were also inspected to rule out an off-by-one. All fifteen matched.

| # | Stable id | Filename | Verified against owner description |
| --- | --- | --- | --- |
| 041 | photo-0041 | IMG_8166.jpg | Ornate Thai temple staircase ✓ |
| 042 | photo-0042 | IMG_8172.jpg | Thai temple architecture ✓ |
| 058 | photo-0058 | P1020289.jpg | Urban tower block ✓ |
| 097 | photo-0097 | P1210519.jpg | Posed beach group ✓ |
| 098 | photo-0098 | P1210520.jpg | Posed beach group ✓ |
| 099 | photo-0099 | P1210521.jpg | Posed beach group ✓ |
| 101 | photo-0101 | P1210526.jpg | Posed beach group ✓ |
| 107 | photo-0107 | P1210624.jpg | Walking figure on beach ✓ |
| 141 | photo-0141 | P1210854.jpg | Beach sparring sequence ✓ |
| 142 | photo-0142 | P1210856.jpg | Boxing glove sequence ✓ |
| 143 | photo-0143 | P1210857.jpg | Boxing glove sequence ✓ |
| 144 | photo-0144 | P1210858.jpg | Boxing glove sequence ✓ |
| 149 | photo-0149 | P1210881.jpg | Beach frame ✓ |
| 152 | photo-0152 | P1210900.jpg | Beach frame ✓ |
| 155 | photo-0155 | P1210909.jpg | Close beach portrait ✓ |

Only the fifteen listed frames were excluded. Visually adjacent members of the same sequences
(100, 102, 106, 145, 148, 150, 151, 153, 154, 156) remain public, since no additional exclusions
were inferred from the descriptions.

## Where the exclusion lives

Enforcement is in the data layer, not in markup:

- `data/public-image-exclusions.json` → `ownerRejected[]` gained the 15 records, each carrying stable id, archive index, filename, publication state, reason category, and phase. Existing entries were normalised to the same shape without changing their meaning.
- `data/photo-curation.json` → each rejected photograph now carries `visibility: "do-not-publish"`, `publicationStatus: "PRIVATE"`, `ownerDecision: "OWNER_REJECTED"`, `ownerDecisionSource: "OWNER_CONFIRMATION"`, and all candidate flags cleared.

`PRIVATE` + `do-not-publish` is the project's pre-existing persistent state, already asserted by
`scripts/validate-content.mjs`. No competing status system was introduced; owner intent is carried by
the separate `ownerDecision` field.

## Owner geographic correction — 041 and 042

Both frames were captured 2024-10-09, inside the Malaysia → Thailand transition window
(the timeline places the boundary at approximately 2024-10-10), and had been auto-assigned to Malaysia.
The owner confirms Thailand. Their curation records now read:

```
destinationId: "thailand"   country: "Thailand"   countryCode: "TH"
journeyId: "thailand-2024"
locationSource: "OWNER_CONFIRMATION"
locationConfidence: "OWNER_CONFIRMED"
destinationConfidence: "OWNER_CONFIRMED"
```

They remain `do-not-publish`. Correct geography does not grant publication: public Thailand count is
unchanged at 32, they are absent from the Thailand destination data, and they produce no public
Thailand references.

## Public surface purge

The public catalog is generated, and every public surface reads from it, so the fifteen left all of
them at once. One surface referenced a rejected photograph directly:

- **People page** used `src/assets/photos/boxing-guard.jpg`, which is frame 143 (P1210857) — an owner-rejected photograph — imported as a local editorial derivative and therefore invisible to the id-based curation layer. Removed, and the derivative file deleted (master preserved). The stale copies in the Astro image cache were purged too.
- **Replacement:** the `.encounter-vendor` slot is one third of an authored three-part composition; leaving it empty would have left a visible hole in a protected layout. It now holds frame 432 (P1270057-2, La Réunion), an approved public archive photograph whose derivative had already been prepared in an earlier phase but never placed. Caption "Last light · La Réunion". **This is the one editorial judgement call in the phase — if you would rather the slot were empty or held a different frame, it is a one-line change.**
- Frame 432 was registered in `src/data/editorial-selection.ts` so the curation layer now knows it is publicly used. This closes the gap that let an unregistered photograph sit on a public page.
- **Home**: the closing sequence uses frame 145 (P1210859), which is *not* rejected, so it stays. Its alt text was corrected — it described white gloves while the photograph shows red gloves (the two boxing derivatives had crossed alt texts).

Verified as having zero references: Home, General Archive, Black & White Archive, People, Destinations
index, Japan destination, Collections, Black & White collection, 404, sitemap, public photo catalog,
all generated JSON, and all thumbnail/archive/viewer derivative directories.

## Viewer

The viewer is dialog-based and builds its sequence from the public catalog, so there are no per-photo
URLs to reach and Next/Previous cannot address a removed frame. Confirmed in the browser by opening the
frame immediately before each removal cluster and stepping forward and back:

| Opened | Next → | Skipped |
| --- | --- | --- |
| 040 | 043 | 041, 042 |
| 057 | 059 | 058 |
| 096 | 100 → 102 | 097, 098, 099, 101 |
| 106 | 108 | 107 |
| 140 | 146 | 141, 142, 143, 144 |
| 148 | 150 | 149 |
| 151 | 153 | 152 |
| 154 | 156 | 155 |

Previous mirrored each traversal correctly and returned to the opening frame.

## Archive

Reflows naturally — 485 frames render with 0 empty shells, 0 broken thumbnails, and no stale numbering.
Gaps close in sequence (…038, 039, 040, 056, 057…). Archive numbers unchanged for every survivor.

## Counts

| Measure | Before | After |
| --- | --- | --- |
| Public photographs | 500 | **485** |
| Black & white public | 36 | **36** (none of the fifteen were monochrome) |
| Thailand public | 32 | **32** |
| Malaysia public | 103 | **88** |
| Owner exclusions total | 9 | **24** |
| Public archive-number gaps | 85 | 100 |
| Replacement photographs used | — | **1** |

Destination counts were recalculated by the generator: `photoCount` and `confirmedPhotoCount` now
count publishable photography only.

## Future-agent safety

- `scripts/classify-owner-timeline.mjs`: `OWNER_CONFIRMATION` added to the stronger-location set, so owner-confirmed geography is no longer overwritten by timeline inference; confidence fields are likewise preserved. Owner-rejected ids have their publication state re-applied on every regeneration.
- `scripts/build-photo-catalog.mjs`: throws if an owner-rejected filename ever appears in the editorial selection.
- `scripts/verify-owner-photo-exclusions.mjs` (`npm run validate:exclusions`) checks every canonical rejection for publication state, and for zero references in the public catalog, source pages and components, editorial selection, destination hero/manualOrder/featured lists, derivative directories, and — with `--built` — the built output. It also asserts destination counts match publishable photography.
- `npm run build` now runs the check before the build (sources) and again after (`--built`).
- `AGENTS.md` carries the rule.

## Regeneration test

`npm run content:classify` (timeline classification → destinations → journeys → story candidates →
people review → date clusters → owner questions → public catalog) was run after the exclusions were
applied. None of the fifteen returned; 041 and 042 kept Thailand and their rejected state.

## Validation

| Check | Result |
| --- | --- |
| `npm run build` | PASS |
| Content validation | PASS |
| Privacy / production boundary (`/curate/` absent from `dist/`) | PASS |
| Owner exclusion validation (sources + built output) | PASS — 24 rejected, 0 public references |
| Browser console errors | 0 across Home, Archive, B&W Archive, People, Destinations, Japan |
| Broken public assets | 0 |
| Mobile 390px | No horizontal overflow; People composition intact |

## Pre-existing issue found, not fixed

23 archive derivatives have a space in the filename (`… Kopie.jpg`). Spaces are invalid in a `srcset`
candidate, so Chrome logs "Dropped srcset candidate" warnings and falls back to `src`. Images still
display and no errors are raised. This predates Phase 8.45 and is unrelated to the exclusions; fixing
it means renaming derivatives in the image pipeline, which is outside this phase's scope.

## Files changed

```
data/public-image-exclusions.json          15 new owner rejections; entries normalised
data/photo-curation.json                   publication state + Thailand correction
data/destinations.json                     regenerated; counts recalculated
data/journeys.json                         regenerated
data/story-candidates.json                 regenerated
data/date-clusters.json                    regenerated
data/owner-questions.json                  regenerated
data/people-review.json                    regenerated
public/data/photo-catalog.json             500 → 485 public photographs
public/assets-derived/{thumbnails,archive,viewer}/   15 derivative sets removed each
src/pages/people/index.astro               rejected frame replaced
src/pages/index.astro                      alt text corrected
src/data/editorial-selection.ts            replacement registered
src/assets/photos/boxing-guard.jpg         deleted (rejected frame; master preserved)
scripts/build-photo-catalog.mjs            re-selection guard
scripts/classify-owner-timeline.mjs        owner decisions survive regeneration
scripts/verify-owner-photo-exclusions.mjs  new
package.json                               validate:exclusions wired into build
AGENTS.md                                  owner exclusion rule
docs/OWNER-PHOTO-EXCLUSIONS.md             canonical register
docs/PHASE-8.45-CLAUDE-OWNER-PHOTO-PURGE.md this report
```

Masters in `assets-source/photos/` were not touched.
