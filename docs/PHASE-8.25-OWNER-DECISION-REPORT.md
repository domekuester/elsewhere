# Phase 8.25 — Owner decision report

Date: 10 August 2026

## Photographic repetition

**Harmful repetitions before:** 12  
**Harmful repetitions after:** 0  
**Photographs replaced:** 12  
**New Japan photographs introduced:** 11

Counts refer to distinct photographs repeated in prominent editorial roles, not recurrence inside the deep Archive.

### Exact public usage map

| Photograph / group | Before | After | Classification |
| --- | --- | --- | --- |
| `P1260635.jpg` worker | Home world feature + People encounter | Home only; People now uses `IMG_8992.jpg` | HARMFUL → resolved |
| `P1230481.jpg`, `P1230676.jpg`, `P1230662.jpg`, `P1230972.jpg` | Home anchors + Japan chapter | Home/Archive only | HARMFUL → resolved |
| `P1260122.jpg`, `P1240171.jpg`, `P1240815.jpg`, `P1250928.jpg`, `P1260197.jpg`, `P1260426.jpg`, `P1260472-2.jpg` | Black & White edit + Japan chapter | Black & White/Home teaser/related use only | HARMFUL → resolved |
| Market-woman portrait | Protected Home People spread + Black & White edit + Archive | Unchanged | ACCEPTABLE signature bridge |
| Home Black & White preview images | Home teaser + Black & White collection | Unchanged | EXPECTED collection preview |
| Archive recurrence | Home/deeper editorial use + deep Archive | Unchanged | EXPECTED archive depth |
| `IMG_8992.jpg` craftsperson | Archive + new People encounter | Unchanged outside new People use | EXPECTED deep discovery |
| New Japan edit | Japan hero/sequence + Archive; hero also supplies Japan social card | 11-image curated chapter | EXPECTED destination continuity |

### Japan depth

The previous chapter reused four Home anchors and seven Black & White frames. The replacement edit uses eleven Japan-confirmed photographs not previously exposed in the destination chapter: `P1230482.jpg`, `P1230535.jpg`, `P1230541.jpg`, `P1230620.jpg`, `P1230826.jpg`, `P1230865.jpg`, `P1230927.jpg`, `P1230928.jpg`, `P1230942.jpg`, `P1240747.jpg`, and `P1240787.jpg`.

The Phase 8.2 variable-length architecture is unchanged. The new sequence mixes portrait, landscape, color, and monochrome material without adding frames or dumping the 212-frame archive. At 1440px all ten sequence frames loaded; measured widths were 430–774px, with zero accidental postage stamps and zero broken images.

### People depth

The duplicated worker image was removed from the deeper People encounter and replaced with the already-public, Japan-confirmed `IMG_8992.jpg`. The replacement uses responsive thumbnail/archive derivatives and a factual alt description. The Home People spread, including the market-woman portrait, is unchanged.

### Protected photography

- **People homepage composition preserved:** YES
- **Hero preserved:** YES
- Black & White edit preserved: YES
- Owner-rejected young-man photograph public references: 0
- FAST & YUMMY SHAWARMA public references: 0

## Typography options

**Typography Option A:** Current system — exact Apple/macOS baseline, zero payload, weak portability.  
**Typography Option B:** Archivo Narrow + Libre Baskerville — legally self-hostable and closest in concept, but the untuned proof changes People wrapping and clips a small-screen Destinations sample.  
**Typography Option C:** Barlow Condensed + Literata — legally self-hostable, strongest character and layout stability of the alternatives, with a more vertical mobile hero and higher unoptimized payload.  
**Typography production change:** NOT YET — OWNER DECISION REQUIRED

Full licensing, metrics, performance, strengths, weaknesses, and recommendations are documented in `docs/PHASE-8.25-TYPOGRAPHY-OPTIONS.md`.

## QA

Rendered QA used installed Chrome 152 after the in-app Browser again failed before navigation because its runtime sandbox metadata was unavailable.

- Surfaces: Home, Archive, People, Black & White, Destinations, complete Japan, viewer, mobile navigation, and 404.
- Production viewports: 1600, 1440, 1280, 1100, 1024, 980, 768, 430, 390, 320.
- Typography proofs: A/B/C at 1440 and 390.
- Homepage protected composition intact: PASS.
- People homepage composition intact: PASS.
- Japan exposes new photography: PASS.
- Harmful prominent repetition reduced: PASS — 12 to 0.
- Viewer open/advance/close and image load: PASS.
- Mobile menu focus containment/restoration: PASS.
- Horizontal overflow on production pages: 0.
- Broken public assets: 0.
- Relevant console errors: 0.
- **Native scroll preserved:** YES — no smoothing, lerp, pinning, scrub, or scroll dependency was introduced.
- Launch/privacy validation: PASS — unique canonicals, complete social metadata, private curation route excluded.
- **Build:** PASS.
- **Console:** PASS.

## Owner review boundary

Photography cleanup is implemented. Production fonts, font variables, font files, and production typography metrics are unchanged. The owner must choose A, B, or C before any typography adoption work begins.
