# Phase 15.3A — ELSEWHERE flagship refinement

Date: 17 August 2026  
Status: owner visual review  
Evidence: `artifacts/visual-review/phase-15-3a/before/` and `after/`

## Outcome

This pass moves ELSEWHERE from the Phase 15.2 score band of 87 to an evidence-supported 90. It does not claim 95. The remaining distance is primarily art-direction judgment on real devices and owner-led editorial calibration, not missing visual effects.

The work concentrates on four high-leverage systems: mobile navigation presence, the Journey table of contents, Japan's approved image relationships, and contextual entrances/endings. Home, Destination, People, Archive, and Black & White were all reviewed; proven compositions were retained where change would have been activity rather than improvement.

## Scorecard

| Category | Before | After | Evidence |
| --- | ---: | ---: | --- |
| Photographic authority | 90 | 91 | Existing crops and focal positions remain intact; pair scale now follows subject density. |
| Editorial design | 88 | 91 | Five explicit Journey folios replace mechanical alternation; Home has one coherent Journey doorway. |
| Typography | 88 | 89 | The established type relationship is unchanged; folio composition gives hierarchy more room to work. |
| Layout rhythm | 87 | 91 | Japan's pairs now score compact, dialogue, stacked, and closing relationships instead of one repeated treatment. |
| Originality | 88 | 91 | Index composition derives from each chapter's photographic orientation and narrative position. |
| Brand coherence | 88 | 90 | Entrances and exits are clearer while the obsidian, ivory, ultramarine, and type system remain disciplined. |
| Mobile quality | 85 | 90 | The header yields on downward reading and returns on upward intent; folios and pair behaviors are authored at 390–430px. |
| Responsive crops | 92 | 92 | No focal point, crop, source, or approved image order changed. No subject-destroying crop was observed. |
| Navigation / UX | 88 | 92 | Persistent mobile chrome no longer occupies every reading frame; menu focus, Escape, and focus return still pass. |
| Accessibility | 90 | 90 | Reading order, touch targets, focus containment, semantics, and reduced-motion behavior remain intact. |
| Performance | 90 | 90 | No dependency or asset was added; one small passive, requestAnimationFrame-batched scroll-direction check was introduced. |
| Technical quality | 93 | 94 | Presentation choices live in typed editorial data instead of nth-child CSS or photo reordering. |
| **Overall flagship score** | **87** | **90** | A material refinement, but not an honest 95+ claim. |

## Major interventions

### Global mobile navigation

Problem: the fixed header remained visually present throughout long mobile reading, placing interface chrome over a publication that depends on uninterrupted looking.

Response: after the opening area, the header yields on a deliberate downward movement and returns on upward movement. Opening the menu, focusing the header, reaching the top, or leaving the mobile breakpoint always restores it. Scrolling remains native.

Why better: orientation remains one gesture away without making every photograph share the frame with navigation. Interaction QA records `hiddenAfterDown: true`, `visibleAfterUp: true`, and `scrollBehavior: auto`.

### Journey index

Problem: orientation-aware imagery had solved destructive crops, but alternating odd/even layouts still exposed a repeatable component pattern.

Response: each published chapter now carries a typed folio role: opening, landscape-right, portrait-left, contained, or closing. Desktop scale, alignment, and silence follow those roles; mobile has its own width and alignment score.

Why better: chronology remains exact while the index reads as five chapters in one authored contents sequence, not five instances of one card.

### Japan long-form Journey

Problem: all approved pairs used one asymmetric grammar even though the hand/flag transition, figure/landscape exchange, community scenes, domestic interior, and dense closing frames have different visual jobs.

Response: presentation-only pair roles were added without changing a photograph, source, crop, block, or sequence position. The simple ferry pair stays side-by-side on mobile; mixed-format pairs become unequal dialogues; the domestic pair compresses; the dense closing relationship expands.

Why better: pair behavior now responds to legibility and narrative weight. The V3.1 sequence remains hero plus 28 body photographs in its approved order.

### Home entrance to Journey

Problem: the sunset feature offered competing Archive and first-story actions, weakening its role in the overall publication sequence.

Response: the photograph and title remain; the block is now one restrained entrance to the Journey index.

Why better: Home moves from world-building into narrative discovery with a single intention, while Archive still receives its own later ending.

### Destination continuation

Problem: the closing language was generic across every body of work.

Response: the ending names the current destination and describes the Archive as the continuation beyond the edit. No place claim or new editorial fact is introduced.

Why better: Destination closes contextually and remains distinct from Journey's previous/next chapter logic.

## Deliberately preserved

- All photographs, source masters, focal metadata, publication permissions, and owner exclusions.
- Every Journey block, sentence, image, and approved image order.
- Japan's movement structure, designed absences, hero crop, full-bleed focal points, and chapter thresholds.
- Home's opening sequence and photographic world-building.
- Destination's dark body-of-work cadence and photographic-index copy.
- People's hero, first three encounters, deeper order, and privacy boundary.
- Archive desktop contact-sheet layout, incremental 24-frame rendering, filters, and viewer behavior.
- Black & White's opening and dark-room cadence.
- Barlow Condensed, Literata, the restrained palette, native scroll, and the absence of decorative motion.

## QA

- Production build: pass, 27 pages.
- Content validation: pass, 716 photographs, 12 destinations, 10 journeys.
- Owner exclusions: pass, 35 rejected photographs and 0 public references across source and built output.
- Launch validation: pass, 26 public HTML files; existing contact/creator/SITE_URL owner configuration warnings remain.
- Browser matrix: Home, Journey index, Japan, Destination Japan, Archive, People, and Black & White at 1440 and 390; Home/Japan/Archive at 1024, 768, and 430; Home/Journey index at 1280.
- Horizontal overflow: 0 audited surfaces.
- Console/network errors: 0.
- Archive viewer: open, image load, contain fit, Escape close, and focus return pass.
- Mobile menu: focus entry, inert state, Escape close, and focus return pass.
- Reduced motion: complete content, no GSAP/motion dependency, native scroll.
- Broken photographs: 0. The audit sees two intentionally empty viewer image elements before activation; visible captures and network checks show no missing asset.
- Metadata/privacy leak: no internal owner notes, provenance, source paths, or exclusion rationale found in the built public layer.

## Honest remaining gap to 95+

The site should not be pushed further by adding effects. A 95+ verdict requires owner review of the folio and pair decisions on real phones, calibrated typographic optical review on the physical displays that matter, and a photography-by-photography art-direction approval of the most consequential Destination and People scale roles. Those are judgment gates, not code volume. Archive and Black & White should remain protected until that evidence identifies a concrete weakness.

No commit or push was made.
