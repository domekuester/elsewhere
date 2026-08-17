---
name: publication-regression
description: Use when ELSEWHERE visual or frontend changes could affect routes, navigation, privacy, exclusions, image derivatives, SEO, captions, or publication behavior.
---

# Publication Regression

Protect publication integrity before visual polish.

1. Identify affected routes and shared primitives before running checks.
2. Run `node .codex/scripts/flagship-review.mjs --checks` for the lightweight gate; run the full build when risk warrants it.
3. Verify published Journey and Destination routes, Archive, People, B&W, navigation, previous/next, captions, native scrolling, responsive layout, SEO, and derivatives as applicable.
4. Run `npm run validate:exclusions` after any photo, catalog, curation, route, or build-pipeline change.
5. Confirm no private GPS, notes, releases, or internal rights fields enter public output.

Severity: P0 publication-breaking/privacy/rejected-photo/unusable-mobile; P1 destroyed crop, broken hierarchy, overflow, navigation collision, major type defect; P2 meaningful rhythm/scale/spacing refinement; P3 polish. Resolve P0, then P1, then high-value P2.
