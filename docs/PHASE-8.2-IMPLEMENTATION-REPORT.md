# Phase 8.2 — Implementation report

Date: 10 August 2026

## Claude findings implemented

- C-01: variable-length Japan layout.
- C-02: truthful Archive filter gating.
- C-04: public process-language cleanup.
- C-06: staged alt-review architecture and removal of duplicated generic alt text.
- C-07: viewer focus restoration.
- C-09: responsive catalog image candidates and sizes.
- C-10: hero Scroll arrow orientation.
- C-14: 980–1100 World 04 offset repair.
- C-16: lighthouse alt correction.
- C-18: People H1 width conflict removal.
- C-19: future-collections roadmap removal.
- CODEX-NEW-01: content-aware Archive control names.

## Partial findings implemented

- C-03 typography: current macOS identity and fallback stacks were preserved; no font was imported because Phase 8.1 requires an owner licensing/strategy decision. Wrapping/navigation QA passed in the current strategy.
- C-05 repetition: usage was audited, but no photographic edit changed without owner approval.
- C-08 Japan hero: source, crop, and current treatment were documented; the hero was not changed.
- C-11 People: the Home link promise now reads “See the first encounters”; no people were added.
- C-17 wide-screen anchoring: existing concept retained; no speculative redesign.
- C-20: counter/casing-safe scope implemented; mobile header left unchanged.

## Findings deferred to owner

See `docs/PHASE-8.2-OWNER-DECISIONS.md`. Japan photography/reuse, typography strategy, People expansion, and mobile header treatment also remain owner-gated partial findings.

## Japan fix

The destination sequence now cycles through wide, portrait, quiet, anchor, offset, and closing roles. Roles repeat for any sequence length and include orientation-aware widening for landscape images. Mobile retains the authored alternating sequence.

**Japan sequence frames:** 10  
**Accidental postage-stamp frames:** 0  
**Large/editorial frame system:** PASS  
**Desktop:** PASS  
**Tablet:** PASS  
**Mobile:** PASS

Measured frame widths ranged from 478–860px at 1600, 293–527px at 980, 229–413px at 768, and 246–320px at 320. No horizontal overflow occurred.

## Archive discovery fix

**Public photos:** 500  
**World-classified:** 23  
**Unclassified:** 477  
**Visible world filters:** All; Black and white  
**Filter result counts:** All 500; Black and white 10

Hidden sparse counts: People 2, Beaches 1, Urban 1, Jungle 5, Ocean 3. Place/year/orientation discovery remains intact. The threshold reads generated catalog data, so legitimate Curation Studio exports can restore a collection without template changes.

## Public copy cleanup

Removed or translated the confirmed process phrases from Home, footer, Collections, Destinations, the destination chapter, and Archive. Final public-source and `dist/` search returned no matches for the agreed phrases. “The archive is always unfinished” was not present and no intentional process-language exception was needed.

## Image reuse changes

**Major public hero/anchor reuse before:** 11 cross-surface repeated uses identified in the Phase 8 audit (market woman ×3 plus eight Japan/Home-or-B&W repeats).  
**After:** 11.

The number is unchanged because Phase 8.1 explicitly requires owner selection before photographic replacement/removal. The homepage People composition remains protected. Archive recurrence remains expected and is not counted as harmful duplication.

## Typography portability

**macOS intended rendering:** PASS  
**Cross-platform fallback strategy:** PARTIAL / OWNER DECISION REQUIRED  
**Mobile headline wrapping:** PASS  
**Navigation:** PASS  
**Hero relationship preserved:** YES

No external service, unlicensed font, or new payload was introduced. This means portability has not yet improved beyond the existing ordered fallback stacks.

## Accessibility

**Viewer focus restoration:** PASS  
**Keyboard viewer navigation:** PASS  
**Alt-text strategy:** PASS (staged architecture; authored review remains)  
**Reduced motion:** PASS  
**Focus indicators:** PASS

The catalog now records `altReviewStatus`; 478 unreviewed images use empty alt inside factually labelled buttons, 21 selected images retain editorial candidates, and the lighthouse has a confirmed factual description. No poetic or location-inventing descriptions were generated.

## Retina / responsive

Catalog-driven Archive and destination images now provide accurate responsive candidate widths from existing role derivatives. The viewer continues to use the high-quality viewer derivative. Scroll cue, People heading, World 04 intermediate layout, and counter padding were corrected.

## Protected elements verified

- Home hero photograph: unchanged.
- Hero title relationship: unchanged.
- Homepage People composition: unchanged.
- Viewer contain/center/aspect-ratio geometry: unchanged.
- Ultramarine signature system: unchanged.
- Owner-rejected photography: zero public references.
- FAST & YUMMY SHAWARMA: zero public references.

## Scroll preservation

**NATIVE/DIRECT SCROLL FEEL PRESERVED: YES**

No scroll library initialization, smoothing, lerp, pinning, or scrub behavior was added. Reduced-motion pages remain complete.

## Performance

No JavaScript dependency was added. Archive remains incrementally rendered at 24 frames. Responsive sources reuse existing derivatives and prevent fixed one-size transfer behavior. Hero priority and viewer geometry are unchanged.

## QA

Rendered QA used installed Chrome 152 after the in-app Browser failed before navigation with the same missing sandbox-policy metadata recorded in Phase 8.1.

Viewports: 1600, 1440, 1280, 1100, 1024, 980, 768, 430, 390, 320.  
Surfaces: Home, Archive, People, Black & White, Destinations, complete Japan chapter, La Réunion through the destination index/Archive (no public chapter exists), landscape and portrait viewer paths, mobile navigation, and generated 404.

- Build: PASS.
- Content validation: PASS — 588 photos, 8 destinations, 10 journeys, 14 story candidates, 15 People candidates.
- Launch/privacy validation: PASS — eight public HTML files, unique canonicals, social metadata complete, `/curate/` excluded from production.
- Broken public assets: 0.
- Relevant console errors: 0.
- Framework overlays: 0.
- Horizontal overflow: 0 on tested surfaces.
- Viewer open/next/close: PASS.
- Viewer focus returned to launcher: PASS.
- Mobile menu focus containment/restoration: PASS.
- Rejected image public references: 0.
- FAST & YUMMY SHAWARMA public references: 0.

## Independent post-implementation score

| Category | Phase 8.1 | Post-implementation |
| --- | ---: | ---: |
| First impression | 82 | 84 |
| Photographic edit | 73 | 73 |
| Homepage sequence | 79 | 81 |
| Typography | 73 | 73 |
| Black & White | 76 | 76 |
| People | 66 | 69 |
| Destinations | 52 | 76 |
| Archive | 63 | 77 |
| Viewer | 85 | 89 |
| Image fidelity | 74 | 82 |
| Scroll feel | 91 | 91 |
| Motion | 83 | 83 |
| Mobile | 78 | 81 |
| Brand distinctiveness | 80 | 80 |
| Emotional impact | 75 | 77 |
| Editorial voice | 62 | 80 |
| Perceived performance | 87 | 88 |
| Accessibility | 61 | 78 |
| Premium brand value | 74 | 80 |

**Claude Phase 8:** 72 / 100  
**Codex Phase 8.1:** 74 / 100  
**Codex post-implementation:** 81 / 100

The improvement is visibly real on Japan, Archive, public copy, viewer keyboard return, and high-density image delivery. The score is not higher because photographic repetition and cross-platform typography remain unresolved owner decisions, while 499 catalog descriptions still await authored review or deliberate decorative classification.

## Readiness judgment

Both P0 defects are corrected, and the implemented engineering/trust scope passes. Full owner-review readiness is withheld because the user’s final gate also requires harmful repetition to be reduced and typography portability to be improved; Phase 8.1 explicitly prohibits making either choice without owner direction.
