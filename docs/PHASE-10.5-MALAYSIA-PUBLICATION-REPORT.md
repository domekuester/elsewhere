# Phase 10.5 — THE JOURNEY / Malaysia, published

Story 01 is live at `/journey/malaysia/` on the owner's explicit instruction.

| | |
| --- | --- |
| Story | Malaysia · *The Journey — 01* · 2024 — 2025 |
| Status | **`PUBLISHED`** (`publishedAt: 2026-08-11`) |
| Canonical | `/journey/malaysia/` — unchanged from review, no redirect |
| Journey index | **public** at `/journey/` |
| Malaysia entry | **active** — *Read the story →* on `/archive/place/malaysia/` |
| Home entry | **active** — *Read the Malaysia story →* in the existing story-feature block |
| Robots | `index, follow, max-image-preview:large` |
| Sitemap | `/journey/` and `/journey/malaysia/` |
| Open Graph | `article`, purpose-made 1200×630 card |
| Social image | `photo-0056` → `/social/journey-malaysia.jpg` |
| Story photographs | 22 (1 hero + 21) |
| Identifiable people | **0** — all nine still uncleared, still refused at build time |
| False geographic claims | **0** |
| Owner-rejected references | **0** |

## Blocker check, before flipping

Every frame confirmed Malaysia · zero owner-rejected or held frames · zero uncleared people · zero
non-public frames · two frames carry a city and both are owner-confirmed George Town. Build, content,
privacy, exclusion and launch validation all green.

The three open items from Phase 10.4 are optional owner preferences with safe defaults in force —
not factual or privacy problems. Not blockers.

## What publication changed

Four things, and nothing else:

1. `status` → `PUBLISHED`, `publishedAt` set. This alone turned on the index, the sitemap entries,
   the indexable robots tag and all three links, because every one of them is gated on
   `publishedJourneyStories()`.
2. **A social card was made.** Every published chapter has a purpose-made 1200×630 crop in
   `public/social/`; the story had none and would have fallen back to a 4:3 hero derivative that
   platforms crop unpredictably. `journey-malaysia.jpg` is a centred 1.91:1 crop of the opener,
   centred 4% high because the vanishing point sits above the middle. The corridor, the columns and
   the small figure at the end all survive at card size.
3. **The meta description was rewritten** as a sentence from the story rather than a keyword list:
   *"A fourth long journey that starts in the one country I already knew: Kuala Lumpur, George Town,
   and an island I found by accident in 2016 and keep going back to."* 159 characters, no
   superlative, no itinerary.
4. **Two presentation defects were fixed** — see below.

## Two defects found and fixed

**The index read as a list of one.** The entry was a small 4:3 thumbnail beside a headline, which
with a single published story looks like the first row of a table that has more rows coming. It is
now a wide chapter frame with the title beneath it — a contents page in a photo book rather than an
article listing. It stacks unchanged when Story 02 arrives.

**Two links collided on Home.** The story-feature block now carries two destinations, and as
inline-flex elements they sat on one line where the first link's arrow read as belonging to the
second. Each is now on its own line. No new section, no new photograph, no card.

## Story copy

**Unchanged.** Phase 10.4 froze it and nothing in this pass touched a sentence. The full published
text was read end to end from the built HTML as a proofread: no typos, no broken grammar, no
duplicated content, no rendering defect.

## Discovery architecture

Three entry points, all live:

- `/archive/place/malaysia/` → the story. The layered route this was designed for: photographs
  first, the story discovered under the index intro rather than advertised above it.
- `/journey/` → the story. Where the series lives.
- Home → the story. One line in a block that already existed.

**Not added:** *Journey* in the primary navigation. One story does not justify a global category;
revisit at three or four. **Not added:** any "next story" affordance. Story 02 does not exist and the
ending stays quiet — the closing aside offers Malaysia's photographs and the series, nothing else.

## Journey vs Destination

`/archive/place/malaysia/` opens on a photograph and hands you 59 frames with filters — *what is
there*. `/journey/malaysia/` opens on a photograph and hands you 22 frames and 896 words in a fixed
order — *why it matters*. Different shapes, different pace, one link between them in each direction.

## QA

    BUILD:                 PASS   23 pages, 22 public HTML files
    CONTENT:               PASS   689 photos, 12 destinations
    PRIVACY:               PASS   no source paths, GPS, owner notes or review data in public output
    OWNER EXCLUSIONS:      PASS   24 rejected, 0 public references, 33 built files audited
    LAUNCH / SEO:          PASS   unique canonicals, complete social metadata, sitemaps consistent
    BROKEN ASSETS:         0
    BROKEN LINKS:          0      /journey/, /journey/malaysia/, /archive/place/malaysia/, /, /archive/ all 200
    DIRECT URL ACCESS:     PASS   200, correct canonical, correct metadata
    CONSOLE / NETWORK:     clean
    HORIZONTAL OVERFLOW:   0 at 1600, 1440, 1280, 1100, 1024, 980, 768, 430, 390, 375, 320
    MISSING ALT:           0 of 22
    REDUCED MOTION:        0 hidden elements
    HEADINGS:              h1 → h2 ×3
    HEADER (Phase 10.2):   no regression — veil profile still smooth, no seam
    NATIVE SCROLL:         untouched

**Performance**, measured against the built output rather than the dev server:

| | requests | total | LCP | CLS |
| --- | --- | --- | --- | --- |
| 1440 × 900 | 10 | 1123 KB | 184 ms (hero, 195 KB) | 0 |
| 390 × 844 @3× | 10 | 1525 KB | 140 ms (hero, 299 KB) | 0 |

**One honest caveat.** `photo-0060`, the full-bleed frame directly under the hero, is 552 KB and the
browser starts it during first paint despite `loading="lazy"` — it sits just below the fold, so
Chrome preloads it. It does not affect LCP and it is the correct file for a photograph displayed at
full viewport width, but it is the single largest object on the page. Reducing it would mean giving
the story's full-bleed frames their own derivative ladder, the way heroes have one. That is a
pipeline change, not a publication change, and it was not made here.

## Two probe false positives, investigated

`/archive/place/malaysia/` reported 2 "broken images" and 21 "missing alt". Both were artefacts of a
crude check: the two are the empty `<img>` placeholders inside the closed PhotoViewer, and the 21
archive-grid images carry `alt=""` by design because their accessible name is on the wrapping link
(*"Open frame 022 · Malaysia · portrait · 2025"*). Neither is a defect and neither was caused by
this phase.

## Not touched

Every destination hero, the Laos crop, the Home hero and photographic sequence, People, Black &
White, the viewer, the archive grid, navigation, fonts, native scroll, the owner exclusion system,
Studio and Licensing. The removed Thailand frame remains Thailand's, and remains out of Malaysia.
