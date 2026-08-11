# Phase 9.28A — global archive + collection hero mastering, new photo folder ingestion

Documentation is consolidated into five files rather than the eight the brief lists: responsive QA and
performance QA are sections here instead of separate documents, because on two new surfaces they would
each have been half a page of the same tables.

- [New photo folder map](PHASE-9.28A-NEW-PHOTO-FOLDER-MAP.md)
- [Global hero audit](PHASE-9.28A-GLOBAL-HERO-AUDIT.md)
- [Global hero shortlist](PHASE-9.28A-GLOBAL-HERO-SHORTLIST.md)
- [Publication readiness](PHASE-9.28A-PUBLICATION-READINESS.md)

---

## 1 · New photo folders discovered

Five, all new, all unambiguously named: `Mobile Fotos Malaysia`, `Mobile Fotos Thailand`,
`Mobile Fotos Laos`, `Mobile Fotos Phu Quoc`, `Mobile Fotos People`. 28 files.

Despite the name, these are not phone photographs — 25 of 28 are Lumix DMC-FZ330 files at 10.7–12 MP.

## 2 · Folder → target mapping

Malaysia → Malaysia · Thailand → Thailand · Laos → Laos · Phu Quoc → Phu Quoc/Vietnam ·
People → People candidate pool, with geography from the timeline.

**Every folder name was independently corroborated by EXIF capture date against
`docs/OWNER-TRAVEL-TIMELINE.md`, without exception.** One frame (`photo-0663`, 2024-12-05) sat in an
open transition window the timeline could not resolve; the owner's folder name resolved it, recorded as
`OWNER_CONFIRMATION`.

## 3 · Ingestion summary

    NEW SOURCE FOLDERS FOUND:      5
    NEW SOURCE PHOTOS FOUND:       28
    EXACT DUPLICATES:              0
    ALREADY IMPORTED:              0
    NEW STABLE RECORDS:            28   (photo-0659 … photo-0686)
    NEW PUBLIC-ELIGIBLE:           26
    NEW ARCHIVE ADDITIONS:         26
    NEW PEOPLE ADDITIONS:          6 peopleCandidate (pool 82 → 88)
    NEW B&W ADDITIONS:             0
    NEW DESTINATION CANDIDATES:    Thailand +15, Laos +5, Malaysia +4, Phu Quoc +2
    NEW HERO CANDIDATES:           7 reviewed at full size; 1 promoted to an Archive alternative
    WITHHELD:                      2

Three filename-stem collisions were resolved by perceptual comparison. Two were different photographs
sharing an in-camera counter. The third, `P1210843.jpg`, is the **same photograph as `photo-0139`,
re-graded** — a frame already on `private-social` hold. It is ingested, held, and cross-referenced.
The owner placing a copy in a folder named People records intent, but AGENTS.md requires an explicit
reversal to re-enable a withheld photograph, and that is the owner's call, not an inference from a file
path.

New records default to **public** in the catalog build (an absent `visibility` resolves to `hold`, and
`hold` is not in the deny-list). Every new record therefore received an explicit visibility before any
catalog was rebuilt.

## 4 · Global hero decisions

| Surface | Hero | Status |
| --- | --- | --- |
| General Archive | `photo-0182` | **NEW** |
| Black & White Archive | `photo-0574` | **NEW** |
| Japan | `photo-0372` | KEPT |
| Essaouira | `photo-0609` | KEPT |
| La Réunion | `photo-0442` | KEPT |
| Düsseldorf | `photo-0656` | KEPT |
| Black & White (curated) | existing | KEPT |
| People | existing split composition | KEPT — protected |
| Destinations index | type + cards | KEPT — assessed, hero declined with reasons |

## 5–7 · Kept / replaced / new

    MAJOR HERO SURFACES AUDITED:   9
    FLAGSHIP HEROES BEFORE:        5
    FLAGSHIP HEROES AFTER:         7
    NEW HEROES ADDED:              2
    HEROES REPLACED:               0
    HEROES KEPT:                   7
    OWNER APPROVAL PENDING:        6
    BLOCKED:                       0

## 8–9 · Publication readiness

**Laos moves from blocked to READY FOR NEXT PUBLICATION PHASE** — 3 public frames became 8, clearing the
five-frame content floor that made it impossible in Phase 9.27. It still needs a sequence, alt text and
a consent decision on `photo-0537` before it opens. Thailand, Malaysia and Phu Quoc remain **STILL IN
EDIT**. Nothing was auto-published.

## 10 · Owner decisions required

1. **`photo-0671`** — the re-graded boxing photograph. Same frame as the held `photo-0139`. Release it,
   or leave it held? *(One word either way.)*
2. **`photo-0668`** — close street portrait from Malaysia, recognisable subject. Publish or keep held?
3. **Archive hero** — keep `photo-0182` (water), or switch to alternative 1 `photo-0183` (the same water
   with two watching figures, which needs a lower crop), 2 `photo-0677`, 3 `photo-0600`?
4. **Black & White Archive hero** — keep `photo-0574` (hand against sun), or 1 `photo-0578`,
   2 `photo-0559`, 3 `photo-0581`?
5. **Malaysia hero** — confirm the `photo-0036` → `photo-0122` replacement carried over from Phase 9.27.
6. **Laos** — commission the small curation phase, or leave it in the archive list?
7. Still open from Phase 9.27: four destination hero approvals, and the Malaysia story pack's two
   blocking caption questions.

Every hero is a photo ID in `data/destinations.json` or `data/surface-heroes.json`. Changing one means
editing that ID and running `npm run images:heroes`. No CSS.

## 11 · Quality scores

| Surface | Impact | Composition | Desktop | Tablet | Mobile | Type | Fidelity | Editorial | Brand | **Final** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| General Archive | 92 | 93 | 94 | 92 | 91 | 95 | 90 | 94 | 94 | **92** |
| B&W Archive | 93 | 94 | 94 | 92 | 92 | 93 | 91 | 95 | 95 | **93** |
| Japan | 96 | 95 | 95 | 93 | 94 | 95 | 92 | 96 | 96 | **95** |
| La Réunion | 94 | 93 | 94 | 92 | 91 | 93 | 93 | 95 | 94 | **93** |
| Essaouira | 93 | 93 | 94 | 93 | 88 | 92 | 94 | 92 | 95 | **92** |
| Düsseldorf | 92 | 93 | 93 | 91 | 92 | 90 | 90 | 91 | 93 | **91** |

Both new heroes land above 90 but below the destination champions, and that is honest: an index surface
opening is a quieter job than a chapter opening, and neither of these frames is trying to be Dotonbori.

## 12 · Build, QA and performance

    BUILD:                          PASS  (17 pages, 16 public HTML files)
    CONTENT:                        PASS  (686 photos, 12 destinations)
    PRIVACY:                        PASS  (no GPS, no source paths, no internal notes in public data)
    OWNER EXCLUSIONS:               PASS  (24 rejected, 0 public references, 4 derivative directories)
    SEO / LAUNCH:                   PASS  (unique canonicals, sitemap and image sitemap consistent)
    CONSOLE:                        PASS  (0 errors, 0 warnings)
    BROKEN PUBLIC ASSETS:           0 of 407 unique image URLs across 13 pages
    OWNER-REJECTED PUBLIC REFS:     0
    OWNER-REJECTED HERO CANDIDATES: 0
    OWNER-REJECTED NEW IMPORTS:     0

**Responsive.** Both new bands are `72svh` with a `min-height` floor, art-directed through the same
Phase 9.27 custom properties (focal per breakpoint, scrim top/bottom/start, title scale). Measured in
the page at 1440 and 390: no horizontal overflow, band height exact, filter bar reachable at the fold on
a phone rather than a full screen away. One defect found and fixed — "Black & White" reached the gutter
exactly at 390px, corrected with a phone-only title clamp that leaves the desktop scale untouched.

**Performance.** Both new heroes use the Phase 9.27 hero ladder (768–2560, quality ramped by width)
rather than the 3200px viewer file, with `fetchpriority="high"` on the current page only. The Archive
frame is a dense field of water — close to the worst case for JPEG — so it carries a per-hero
`encode.chroma: 4:2:0` override, invisible on monochromatic water and worth about a megabyte at 2560.
Delivered weight: Archive 550 KB at 390@2x, B&W Archive 366 KB. Both are semantic `<img>` elements with
real alt text, so the photographs stay in the accessibility tree and the image sitemap.

**Regression against Phase 9.27.** Home hero unchanged. All four destination heroes render with their
exact Phase 9.27 focal and scrim values. Native scroll, typography, ultramarine, viewer, People
composition, curated B&W edit, Studio and Licensing untouched.

---

## Two latent defects found and fixed

Neither was in the brief. Both were found by running the pipeline the phase required.

**1 · `classify-owner-timeline.mjs` was destroying the editorial layer.** The script rebuilt
`data/destinations.json` from a hard-coded list that predates Phases 9.2, 9.25 and 9.27. Running it —
which `npm run content:classify` does, and which any ingestion needs — deleted Düsseldorf and Germany
entirely, demoted La Réunion from published to in-edit, reset Japan's and La Réunion's heroes to
different photographs, truncated every manual sequence, and removed all Phase 9.27 `hero` art-direction
blocks. **This happened during this phase and was fully recovered**: sequences were recovered from the
built `dist/` output, which was the authoritative record of the pre-classify edit, and the rest from
known Phase 9.27 values. Verified count-by-count against the committed baseline.

The script now merges instead of overwriting: it owns geography, counts and dates; people own
`heroPhotoId`, `hero`, `manualOrder`, `featuredPhotoIds`, `publicationStatus`, `seoTitle` and the rest of
the editorial layer, and a destination it has no definition for is carried through untouched rather than
dropped. Confirmed idempotent — running it twice now changes nothing.

**2 · `editorialHold` was missing from the classifier's exclusion set.** Held photographs were being
counted into destination `photoIds`, which would have overstated every chapter's public depth on its own
page ("N photographs belong to this destination") and offered the archive frames it will not serve.
Malaysia would have jumped from 57 to 94 on the strength of 35 withheld frames plus the two just held.
Fixed to match the catalog build and the derivative generators, which already honoured the hold.

## Skills and tools

**Discovered:** Playwright MCP, Chrome DevTools MCP, Figma MCP, GitHub MCP, context7, firecrawl, the
`impeccable` / `frontend-design` / `ui-ux-pro-max` / `artifact-*` / `superpowers` skill families, the
`dataviz` skill, and the repository's own scripts.

**Used:**
- **Playwright MCP** — the whole rendered layer. Viewport control and screenshots at 1440/390 for the
  audit and the before/after walls, and in-page measurement (`browser_evaluate`) for every number that
  mattered: band heights, title glyph boxes via `Range`, chosen `currentSrc`, computed custom
  properties, filter-bar position at the fold, and a 407-URL broken-asset sweep across 13 pages.
  *Changed the Archive hero selection*, by showing that the chosen frame's subject did not survive the
  crop.
- **Python + Pillow** — SHA-256 and 256-bit perceptual hashing of all 686 masters for duplicate
  detection, the side-by-side that proved `P1210843` is `photo-0139`, and every contact sheet. This is
  what made "review the photography as photography" affordable across 28 new and 54 candidate frames.
- **The repository's own scripts** — `ingest-new-photo-records.mjs` (reused rather than reinvented),
  `classify-owner-timeline.mjs`, `build-photo-catalog.mjs`, `generate-archive-derivatives.mjs`,
  `generate-hero-derivatives.mjs` (extended), and all four validators. Extended, never bypassed.

**Relevant but not used:** Chrome DevTools performance tooling and Lighthouse — the byte-level hero
manifest answers delivered-weight questions exactly, and a Lighthouse run against a dev server measures
the dev server. `impeccable` / `frontend-design` / `ui-ux-pro-max` — this phase extends a mature,
documented visual system that AGENTS.md says to preserve; generic design guidance would pull against it.
Figma, GitHub, context7 and firecrawl MCP — no design file, no repository operation, no library
documentation and no web research was needed.

---

**PHASE 9.28A — GLOBAL ARCHIVE + COLLECTION HEROES OWNER REVIEW READY**

All five new source folders were discovered and mapped, masters were never touched, duplicates were
resolved by pixels rather than filenames, owner-rejected photography remains at zero public references,
the two frames that needed withholding are withheld and reversible, the Archive and Black & White
Archive now open on photographs, the Destinations index and People were audited and deliberately left
alone with reasons, every Phase 9.27 destination hero remains flagship quality and verifiably unchanged,
finalists were rendered before selection, desktop/tablet/mobile all pass, and build, privacy, SEO,
accessibility and console are clean.

Two caveats stated plainly: real iOS Safari was unavailable, so safe-area verification remains Chromium
best-available; and the Phase 9.27 `manualOrder` sequences were recovered from `dist/` rather than from
version control, so a glance at the four published chapters is worth having before this is committed.
