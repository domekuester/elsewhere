# ELSEWHERE flagship design studio

Use this guide for future visual audit and refinement work. `AGENTS.md` remains authoritative; this file routes visual work without duplicating the full constitution.

## Start

Read `docs/README.md` and the relevant current system documents. Map the target with `code_mapper`. Inspect the current rendered page before proposing visual changes. Load the narrow skills that match the task; do not run every specialist by default.

## Review loop

1. Understand the page's editorial purpose and authoritative content.
2. Capture current desktop and mobile states as BEFORE.
3. Name the visible problem and explain its consequence.
4. Propose two or three treatments with trade-offs.
5. Choose the smallest high-impact intervention.
6. Implement in isolation through shared primitives.
7. Capture equivalent AFTER states.
8. Ask whether photography, hierarchy, distinction, and clarity improved—and whether anything became gimmicky.
9. Run publication regression checks.
10. Proceed only after evidence supports the change.

Never recurate an approved sequence, restore an excluded image, expose private metadata, modify a source master, rewrite owner narrative, or turn a publication surface into a generic web pattern without explicit owner permission.

## Screenshot discipline

Store generated evidence under `artifacts/visual-review/<review-id>/before/`, `after/`, and `reports/`; never under `public/`. Match route, viewport, scroll position, content state, motion preference, and browser when comparing.

Major-template widths: 1440, 1280, 1024, 768, 430, 390. Representative routes:

- Home `/`
- Journey index `/journey/`
- Long Journey `/journey/malaysia/`
- Destination `/destinations/japan/`
- Archive `/archive/`
- People `/people/`
- B&W `/collections/black-and-white/`
- Mobile navigation on `/`

Scope route/width coverage to the affected template, but never omit both desktop and mobile for public visual changes.

## Severity

- P0 — publication-breaking: broken layout, private exposure, rejected photo resurfaced, unusable mobile.
- P1 — major: destroyed crop, broken hierarchy, overflow, navigation collision, major typography defect.
- P2 — meaningful refinement: spacing, scale, rhythm, repetition, weak transition.
- P3 — polish: minor optical alignment or tiny spacing inconsistency.

Prioritize P0, P1, then high-value P2. Do not exhaust effort on P3 while editorial opportunities remain.

## Flagship threshold

Flagship means the photography feels irreplaceable; rhythm and typography feel authored; desktop and mobile compositions hold; interaction is quiet; navigation is clear; performance and accessibility remain excellent; and nothing competes unnecessarily with the photographs. Large images, animation, or expensive-looking styling alone do not qualify.

Pages share a language, not a layout. Consistency comes from typography, spacing logic, color, navigation, editorial principles, and photographic treatment. Destination, Journey, Archive, People, B&W, and Home may keep distinct tempos.

Motion is allowed only for orientation, continuity, photographic reveal, or editorial pacing. No scroll hijacking or forced smooth scrolling. Reduced motion must expose the complete composition.

## Scorecard

Score only after writing observations. Use bands rather than fake precision: 90–100 flagship; 75–89 strong but unresolved; 60–74 substantial opportunity; below 60 not ready. Give each category an observation, evidence, and next action:

- Photographic authority
- Editorial design
- Typography
- Layout rhythm
- Originality
- Brand coherence
- Mobile quality
- Responsive crops
- Navigation / UX
- Accessibility
- Performance
- Technical quality
- Overall flagship score

The overall score is an editorial judgment, not a mathematical average. A P0 or unresolved P1 prevents flagship status regardless of score.

## Commands

- Setup/lightweight checks: `node .codex/scripts/flagship-review.mjs --checks`
- Prepare a review workspace: `node .codex/scripts/flagship-review.mjs --prepare <review-id>`
- Existing rendered QA: `scripts/qa-rendered-site.mjs` requires a local server and Chrome remote debugging; follow its `QA_BASE` and `QA_PHASE` environment variables.
- Full publication gate when warranted: `npm run build`
