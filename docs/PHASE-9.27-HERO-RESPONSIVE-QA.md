# Phase 9.27 — hero responsive QA

Rendered in Chromium against the dev server, measured in the page rather than judged from screenshots
where a number was available. Screenshots are local-only under `.playwright-mcp/phase-9.27/`
(gitignored) — QA artefacts are never committed.

## The system under test

The hero is one grammar with per-chapter configuration, held in `data/destinations.json` under
`hero` and passed to the page as custom properties:

| Property | What it does | Default |
| --- | --- | --- |
| `--hero-focal` | `object-position` above 900px | `50% 56%` |
| `--hero-focal-tablet` | 561–900px | inherits desktop |
| `--hero-focal-mobile` | ≤560px | `48% 50%` |
| `--hero-scrim-top` | header band opacity | `.72` |
| `--hero-scrim-bottom` | title gradient opacity | `.74` |
| `--hero-scrim-start` | where that gradient begins | `50%` |
| `--hero-title-scale` | title correction for long names | `1` |

A destination with no `hero` block renders exactly as before, so a new chapter is correct on the day
it is created.

## Viewport sweep

| Width | Japan | Essaouira | La Réunion | Düsseldorf |
| --- | --- | --- | --- | --- |
| 1600 | pass | pass | pass | pass |
| 1440 | pass | pass | pass | pass |
| 1280 | pass | pass | pass | pass |
| 1024 | pass | pass | pass | pass |
| 768 | pass | pass — gulls held, subject intact | pass | pass |
| 430 | pass | pass | pass | pass — 60px title margin |
| 390 | pass | **fixed** — subject restored | pass — horizon above title | pass |
| 320 | pass | pass | pass | pass — 35px title margin, one line |

Checked at every width: horizontal overflow (`scrollWidth > innerWidth`), hero height against
viewport height, title glyph box against the gutter (measured with a Range, not the element box,
which always fills the column and hides an overflow), title/metadata collision, and which derivative
the browser actually chose.

**Result: no horizontal overflow at any width on any chapter. Hero height equals viewport height at
every width tested.**

## Defects found and fixed

| # | Defect | Where | Fix |
| --- | --- | --- | --- |
| 1 | Photograph's subject cropped out of the phone view — the gulls, which are what the frame is about | Essaouira ≤560px | Mobile focal `48% 50%` → `36% 50%` |
| 2 | Title at the gutter with zero margin; the next long name would break | Düsseldorf 390px | `titleScale: 0.94` |
| 3 | Horizon colliding with the title band | La Réunion ≤560px | Mobile focal → `46% 46%` |
| 4 | Tablet inherited the desktop focal with no way to correct it | all, 561–900px | `--hero-focal-tablet` |
| 5 | Title on sunlit wall / open sky at the same scrim as one on dark vegetation | Essaouira, Düsseldorf | Per-chapter `--hero-scrim-bottom` and `--hero-scrim-start` |

## Investigated and deliberately not changed

- **The dark band above the fold.** It looks like a UI bar on some crops. It is the Phase 8.x header
  band that makes the difference-blended wordmark resolve to light on any photograph. Tested on
  Essaouira at 768px by dropping `--hero-scrim-top` from .72 to .42: mean luminance under the wordmark
  moved 53.4 → 54.5 and peak 251.5 → 250.5 out of 255. The band is not what makes that area dark — the
  sky in the photograph is. Reverted; the Phase 8.x fix stands.
- **Hero → content transition.** The cut from photograph to ivory provenance reads as an intentional
  page turn. Left as authored.
- **Home hero.** Untouched. The shared `::before` rule keeps its literal values; only
  `.destination-hero::before` reads the variables.

## Accessibility

- Every hero is a real `<img>` with descriptive alt from the curated `altByFilename` map, not a CSS
  background — the photograph stays in the accessibility tree and in the image sitemap.
- One `<h1>` per chapter, the destination name; heading order unchanged.
- No hero animation, so `prefers-reduced-motion` has nothing to suppress; the opening is complete and
  composed with motion disabled.
- No interactive element was added to the hero, and none was removed: the header remains the only
  focusable content in the first viewport, at its existing contrast and target size.
- Console: 0 errors, 0 warnings across all four chapters.
- Broken assets: 176 image URLs referenced by the four chapters were fetched; **0 failures**.

## Safari and mobile browser chrome

`height: 100svh` is unchanged from the previous phases, which is the unit that survives the iOS
address bar without jumping. Header safe-area padding (`env(safe-area-inset-top)`) is untouched. This
was verified in Chromium at iPhone-class viewports; **real iOS Safari was not available in this
environment**, so that specific verification is best-available rather than complete.
