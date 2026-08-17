# Phase 15.2 — ELSEWHERE flagship transformation

Date: 17 August 2026  
Status: owner visual review  
Evidence: matched Phase 15.1 BEFORE captures and Phase 15.2 AFTER captures in `artifacts/visual-review/`.

## Phase 15.1 priorities addressed

The pass implements ten bounded interventions from F01–F12 without replacing the existing identity:

1. Explicit movement scoring for long-form Journey chapters.
2. Larger, spatially distinct chapter thresholds.
3. A mobile-specific scale score for Journey images.
4. Preserved pair relationships through unequal grouped mobile stacks.
5. Orientation-honest Journey folios, including a distinct contained Phu Quoc folio.
6. Role-accurate responsive image selection across audited flagship surfaces.
7. A Destination body-of-work threshold using existing approved photographic-index copy.
8. A human, unequal deeper-People sequence using explicit presentation roles.
9. Publication navigation that exposes Journey and Archive, plus contextual page endings.
10. A denser two-column/anchor rhythm for Archive mobile and larger mobile interaction targets.

No story prose, photograph, approved photo order, source master, focal point, route, font family, palette, or SEO structure was changed.

## Major visual changes

### Journey

Japan is the stress test for a shared long-form grammar. Its eight movements now carry explicit presentation roles (`reading`, `left`, `right`, `expansion`, `encounter`, `quiet`, and `closing`) in story data. These roles change spacing, lateral centre of gravity, threshold scale, and frame placement while leaving every block in the same order. The 29-frame V3.1 sequence remains intact.

At 390–430px, related pairs remain visually grouped as unequal stacks rather than dissolving into unrelated full-width frames. Chapter thresholds are smaller than the first implementation pass but materially stronger than the Phase 15.1 labels. No prose is overlaid on photography.

### Journey index

The five chapters now read as an authored contents sequence rather than repeated panoramic cards. Landscape covers use editorial folios, Laos and Japan retain their portrait composition, and Phu Quoc uses a contained-plate arrangement that breaks the mirror alternation. Chronology, metadata, standfirsts, links, and ordering are unchanged.

### Destination

The former near-empty ivory bridge is now a photographic-body threshold using the existing public `photographicIndex` sentence and Journey link. The dark sequence remains image-led and distinct from Journey prose. Responsive image requests now follow the actual sequence role and the intentionally wider closing frame.

### People

The split hero and opening encounter sequence are unchanged. Only “Further encounters” was re-composed. Six explicit roles—gesture, proximity, threshold, environment, intimate, and closing—produce unequal scale and space without reordering or inventing group labels. Mobile uses a deliberate sequence rather than a two-width feed.

### Archive and B&W

Archive desktop and the viewer are preserved. Mobile now uses editorial doublets punctuated by full-width landscape/selected anchors, reducing the initial 24-frame page from roughly 13,000–14,500px to about 9,200–10,000px. The SSR and client-appended `sizes` contracts match.

B&W’s opening and sequence remain untouched. Its existing monochrome Archive ending now appears once rather than being followed by a duplicate global Archive continuation.

### Home and navigation

Home’s strongest opening and full sequence remain intact. Only image-delivery contracts for exceptional large roles were corrected. The primary navigation now names the publication accurately: Journey, Destinations, People, Archive, About, Studio. B&W remains a contextual collection rather than crowding the primary line. The mobile index retains its focus trap, Escape handling, and focus return.

## Before / after scorecard

Scores are judgment bands supported by rendered comparison, not measurements disguised as precision.

| Category | Before | After | Observation |
| --- | ---: | ---: | --- |
| Photographic authority | 84 | 90 | Portrait folios survive; large roles receive adequate candidates; no serious crop failures observed. |
| Editorial design | 81 | 88 | Journey, Destination, People, Archive, and B&W now perform different editorial jobs. |
| Typography | 85 | 88 | Fonts are preserved; chapter thresholds and Destination statements carry clearer authored hierarchy. |
| Layout rhythm | 76 | 87 | Japan gains explicit act-level expansion/release; mobile pairs remain relationships; Archive gains useful density. |
| Originality | 83 | 88 | The movement score and orientation-aware folios feel specific to ELSEWHERE without decorative gimmicks. |
| Brand coherence | 83 | 88 | Shared type, ground, spacing logic, and quiet chrome remain, while page composition is less cloned. |
| Mobile quality | 78 | 85 | Journey and Archive are materially more authored; the fixed header remains a future refinement opportunity. |
| Responsive crops | 88 | 92 | No subject-destroying crop found across the final matrix; approved focal positions remain unchanged. |
| Navigation / UX | 80 | 88 | Journey is first-class, Archive is named directly, exits are contextual, and mobile interactions remain sound. |
| Accessibility | 88 | 90 | Reading order and semantics remain intact; unlabeled movement sections were avoided; key mobile targets are 44px. |
| Performance | 90 | 90 | No new dependency, script, animation, or source asset; incremental Archive rendering remains. |
| Technical quality | 92 | 93 | Shared contracts and explicit roles replace route CSS hiding; build and publication gates pass. |
| **Overall flagship score** | **80** | **87** | Materially closer to a world-class independent publication; owner art-direction review remains appropriate. |

## Components and architecture

Refined shared components and contracts:

- `SiteFooter.astro`: explicit contextual-continuation control.
- `site.ts`: publication-first navigation hierarchy.
- `journey.ts`: optional presentation-only movement score.
- Journey templates: movement wrappers, role-aware folios, and correct derivative descriptors.
- Destination template: body-of-work threshold and role-accurate image sizing.
- People template: explicit encounter presentation roles.
- Archive SSR/client templates: matching mobile density and image-size contracts.
- Home image components: exceptional-role responsive sizing.
- `global.css`: namespaced Journey, People, Destination, Archive, navigation, and touch-target refinements.

No new public dependency or JavaScript visual system was added. Page-specific CSS hiding and `!important` chains were not introduced.

## Responsive decisions

- Core comparison: 1440 and 390.
- Additional evidence: 1024, 768, and 430 for Home, Japan Journey, and Archive.
- Journey pairs: unequal grouped stack at small mobile; staggered two-column composition above 560px.
- Journey portraits: natural-ratio containment instead of universal panorama.
- Archive: two-column portrait doublets; landscape and selected frames span both columns.
- People: explicit role sizes on desktop and independent width score on mobile.
- Final metrics: zero horizontal-overflow surfaces; zero serious crop failures; zero audited image slots over 8% undersupplied.

## Motion decisions

No motion was introduced. Native scroll remains. No smooth-scroll ownership, scroll hijacking, parallax, cursor effect, or page transition was added. Existing reduced-motion rendering continues to expose complete compositions.

## Performance and accessibility impact

Performance risk is low: no new dependencies, no new client-side layout code, no new photographs, and no expanded initial Archive DOM. Correct `sizes` values may request a larger existing candidate for genuinely large frames and a smaller candidate for mobile Archive portraits; this is the intended fidelity/payload trade.

Accessibility remains structurally sound. Mobile navigation focus enters the menu, Escape closes it, and focus returns. Archive viewer focus containment and return pass. Journey movement wrappers are neutral `div` elements so the prelude does not create an unnamed document section. Mobile editorial/footer/filter targets receive a 44px minimum without adding visual chrome.

## Validation and regression status

- Production build: PASS — 27 generated pages.
- Content validation: PASS — 716 photographs, 12 destinations, 10 journeys, 14 story candidates, 97 People candidates.
- Owner exclusions: PASS — 35 rejected photographs, **0 public references**, including built output.
- Launch validation: PASS — 26 public HTML files, unique canonicals, social metadata, sitemap and image sitemap consistency, private curation route excluded.
- Render matrix: PASS — no horizontal overflow, console warning/error, network error, or visible broken photograph.
- Archive viewer: PASS — contained image, focus inside, Escape close, focus return.
- Native scrolling / no forced smooth scroll: PASS.
- Journey prose altered: 0.
- Approved Journey photo order altered: 0.
- Source masters modified: 0.
- New dependencies: 0.

The launch gate continues to report the three known owner configuration actions: real `PUBLIC_CONTACT_EMAIL`, `PUBLIC_CREATOR_NAME`, and production `SITE_URL`. They are not visual regressions and no values were invented.

## Remaining visual opportunities

1. Owner-review the Japan movement score at full reading speed, especially the Sado expansion, Agui quiet movement, and closing Osaka sequence.
2. Consider a later contextual mobile-header response during very long reading; the current fixed 76px band remains reliable but visually constant.
3. Edit Home only after the owner confirms the downstream Journey/Destination/People identities. Its current opening and core rhythm remain among the publication’s strongest work.
4. Do not propagate Japan’s exact score to other stories. Use the same primitives but author each chapter’s role sequence independently.
5. Keep B&W’s current cadence and Archive desktop/viewer protected.

## Owner review route

1. `/journey/` — read the five folios as one contents sequence.
2. `/journey/japan/` — experience the complete desktop chapter, then repeat at 390–430px.
3. `/destinations/japan/` — compare the photographic-body threshold against the Journey.
4. `/people/` — continue past the opening into the re-authored deeper encounters.
5. `/archive/` at 390px — assess density, touch, and viewer behavior.
6. `/collections/black-and-white/` and `/` — confirm that protected identities still feel unmistakably ELSEWHERE.

The transformation is intentionally static-first. It creates a stronger publication through composition, sequence, scale, silence, and delivery fidelity rather than spectacle.
