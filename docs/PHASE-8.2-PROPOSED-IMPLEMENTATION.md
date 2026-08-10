# Phase 8.2 — Proposed implementation plan

Status: plan only. No Phase 8.2 change has been implemented.

## Change budget

### Must change

Japan variable-length sequence layout; sparse Archive filter gating; public process-copy cleanup; viewer focus restoration; scroll-cue orientation; lighthouse alt; Archive accessible naming and staged alt architecture.

### Should change

Responsive sources for catalog-driven images; 980–1100 worlds collision; People H1 rag; owner-approved Japan/repetition edit; deliberate cross-platform typography.

### Optional

Wide-screen text anchoring; mobile header transition; B&W density; viewer label consistency; 320px image-width floor.

### Do not touch

Home hero/photo-title composition; homepage People composition; native scroll; viewer contain/center geometry; broad motion vocabulary; ultramarine accent density; owner-rejected photographs.

## Batch A — P0 structural repairs

### A1 · Variable-length destination sequence

- **Likely files:** `src/styles/global.css`, `src/pages/destinations/[slug].astro`, optionally destination layout metadata in `data/destinations.json` or a new typed editorial layout field.
- **Plan:** replace the fixed four-selector assumption with a resilient repeating pattern or explicit layout-role system plus intentional fallback. Keep mobile's authored flex sequence. Do not hard-code frames 5–10.
- **Risk:** medium; layout order and captions can regress at intermediate widths.
- **Expected visual effect:** all Japan frames regain editorial scale and rhythm.
- **Expected technical effect:** destination sequence length can grow without collapse.
- **QA:** full chapter at 1600/1440/1280/1100/1024/980/768/430/390/320; screenshot every frame; overflow, captions, lazy loading, crop, CLS.
- **Owner decision:** not for structural fallback; required before photo removals/order changes.

### A2 · Archive filter gating

- **Likely files:** `src/pages/archive/index.astro`, `src/scripts/archive.ts`, possibly a shared threshold/config module.
- **Plan:** hide world filters below an editorial minimum; retain All, Year, Frame, Place, and Another frame. Define reinstatement as explicit editorial readiness, not `count > 0`.
- **Risk:** low.
- **Expected visual effect:** simpler, more credible filter row.
- **Expected technical effect:** controls cannot advertise one- or two-result categories.
- **QA:** filter counts, empty states, destination query parameter, keyboard/pressed states, incremental loading, mobile horizontal rail.
- **Owner decision:** no for temporary gating; yes for taxonomy and reviewed classifications.

## Batch B — Public copy and trust cleanup

- **Likely files:** `src/pages/index.astro`, `src/components/SiteFooter.astro`, `src/pages/collections/index.astro`, `src/pages/destinations/[slug].astro`, `src/pages/destinations/index.astro`, `src/components/DestinationBrowser.astro`, `src/pages/archive/index.astro`.
- **Plan:** remove story-development paragraph, Working title, and future roadmap. Translate necessary states such as unconfirmed geography and open/in-edit status into concise publication voice. Never invent a fact or memory.
- **Risk:** low technical; medium editorial if facts are accidentally narrowed.
- **Expected visual effect:** fewer trust-breaking disclaimers; quieter pages.
- **Expected technical effect:** none.
- **QA:** public-text search, metadata/schema review, page rhythm after deletions, link destinations, no blank containers.
- **Owner decision:** approve final voice where more than deletion is required.

## Batch C — Archive depth and classification

- **Likely files:** private curation export, `data/photo-curation.json`, catalog-generation scripts, public catalog as generated output only.
- **Plan:** owner reviews classifications in coherent batches. Treat worlds as curated editorial collections, not exhaustive automated labels. Reinstate a filter only when its sequence has credible breadth and quality; threshold is a guardrail, not the editorial criterion.
- **Risk:** high editorial/privacy risk; low code risk.
- **Expected visual effect:** deeper, credible discovery.
- **Expected technical effect:** richer relationships without machine guesses.
- **QA:** owner approval, false-positive audit, privacy/location boundary, catalog regeneration, filter counts and sequence quality.
- **Owner decision:** required for every promoted classification.

## Batch D — Typography portability

- **Likely files:** `src/styles/global.css`, `src/layouts/BaseLayout.astro`, local font assets only if licensed, preload declarations.
- **Plan:** first capture macOS, Windows, and Android-equivalent comparisons for hero, People, Archive, destination index, and mobile headings. Owner chooses: licensed/subset self-hosted pair, or deliberately tuned platform-equivalent stacks. Use `size-adjust`/metric overrides and no external font service by default.
- **Risk:** medium–high: licensing, CLS, payload, changed wrapping, and brand drift.
- **Expected visual effect:** consistent condensed/serif tension across platforms.
- **Expected technical effect:** controlled font loading and fallback metrics.
- **QA:** cold/warm font load, offline fallback, CLS, all required viewports, Windows/Android/macOS screenshots, privacy and license verification.
- **Owner decision:** required before implementation.

## Batch E — Owner-approved photographic re-edit

### E1 · Japan

- **Likely files:** `data/destinations.json`, focal metadata, no masters.
- **Plan:** present owner with current hero plus 2–4 reviewed alternatives and a Home-duplication map. Choose hero composition and a color-led, unseen chapter sequence. Decide whether appended B&W frames belong here.
- **Risk:** high; this changes the flagship edit.
- **Expected visual effect:** Japan rewards the click and reads as place, not a recycled annex.
- **QA:** source-at-scale review, focal crops at every viewport, sequence rhythm, no owner-rejected imagery.
- **Owner decision:** required.

### E2 · Home/People/B&W repetition and optional edits

- **Likely files:** relevant Astro imports and editorial data after approval.
- **Plan:** protect the homepage People spread. Review the People hero/B&W opener and only harmful duplicate anchors. Separately compare keep/remove/replace for the second mountain beat and Buddha slot; compare current/tightened/expanded B&W proofs.
- **Risk:** high editorial risk.
- **Expected visual effect:** deeper navigation introduces more unseen photography without destroying continuity.
- **QA:** cross-surface usage map, full sequence screenshots, mobile focal review, owner approval.
- **Owner decision:** required.

## Batch F — Accessibility and focus

### F1 · Viewer focus

- **Likely files:** `src/scripts/archive.ts`.
- **Plan:** maintain separate `focusOrigin` (button) and `geometryOrigin` (image span). Restore focus after Close button, Escape, and backdrop close.
- **Risk:** low.
- **QA:** Tab→open→Escape, Enter/Space activation, click→close, previous/next→close, scroll restoration, 500-item position continuity.

### F2 · Alt and control-name architecture

- **Likely files:** `public/data/photo-catalog.json` only as generated output, `scripts/build-photo-catalog.mjs`, private curation schema/export, authored Astro alts, Archive templates/scripts.
- **Plan:** correct known wrong alts; create a human-review status/queue; support truthful visual descriptions and intentional empty alt where decorative. Do not generate poetic scene claims. Ensure Archive button accessible names include useful photo content rather than only frame number.
- **Risk:** medium: invented descriptions and verbosity are both accessibility failures.
- **QA:** duplicate/empty/unique counts, screen-reader naming sample, factual spot review against masters, no private location leakage.
- **Owner decision:** owner/photo-editor approval for descriptive content batches.

## Batch G — Responsive and Retina polish

- **Likely files:** `src/pages/archive/index.astro`, `src/scripts/archive.ts`, `src/pages/destinations/[slug].astro`, `src/styles/global.css`, `src/pages/people/index.astro`.
- **Plan:** emit existing THUMB/ARCHIVE/VIEWER roles as responsive candidates with accurate `sizes`; fix scroll cue; neutralize world-4 offset at 980–1100; remove People H1 width conflict; correct viewer casing/counter. Prototype mobile transparent header separately and ship only if every hero passes contrast.
- **Risk:** low–medium; wrong `sizes` can cause oversized transfers or softness.
- **Expected visual effect:** sharper DPR2 grid, cleaner intermediate layouts, corrected first-viewport cue.
- **Expected technical effect:** smaller mobile transfers and appropriate high-DPI selection.
- **QA:** DPR1/DPR2 currentSrc and natural/rendered ratios, network transfer, no double downloads, 980/1024/1100 collision, 430/390/320 crops, header contrast, focus modality.
- **Owner decision:** only for mobile header appearance.

## Dependency and delivery order

1. A1 structural Japan fallback and A2 filter gating.
2. B trust-copy deletion/translation.
3. F1 viewer focus and safe G defects (scroll cue, H1, collision).
4. F2 alt/accessibility architecture before bulk description work.
5. G responsive image sources.
6. Owner review for D typography and E photographic edits.
7. C classification curation over multiple reviewed exports.
8. Full master QA and launch re-score.

## Phase 8.2 acceptance gate

- No public code change before owner approves the scoped Phase 8.2 list.
- All routes and viewports in AGENTS.md plus 1600/1440/1280/1100/1024/980/768/430/390/320.
- Keyboard, visible focus, viewer restoration, menu containment, reduced motion.
- No console errors/warnings, broken images, layout shift, horizontal overflow, or missing derivatives.
- Crop review protects faces, hands, eyes, horizons, and focal subjects.
- DPR source selection verified technically, not by derivative dimensions alone.
- Owner-rejected young-man and all FAST & YUMMY SHAWARMA frames remain at zero public references.
- Native scroll remains native and immediate.

STOP. This document authorizes no implementation.
