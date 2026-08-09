# ELSEWHERE Flagship Pass Report

## Outcome

The first preview has been refined into an authored editorial homepage built around a selective sequence of real archive photography. It no longer reads as a conventional hero followed by repeated cards or a generic portfolio grid. The page now moves through opening, silence, visual worlds, human intimacy, small detail, environmental scale, geographic possibility, story, ocean, reflection, and continuation.

## Major weaknesses found

- The first pass had a competent visual foundation but insufficient change of scale and emotional register after the hero.
- Category entry points behaved too similarly and risked reading as a filter grid.
- Destination examples visually implied geographic assignments that the metadata could not support.
- People was not yet treated as the emotional center of the publication.
- Motion targeted first-pass selectors and lacked complete mobile menu state management.
- The page ended without a strong editorial continuation.
- The archive lacked a typed contract for incomplete metadata and separate private/public location.
- Inner-route navigation fragments were initially homepage-relative.

## Major changes made

- Re-edited the homepage from the real 530-image archive and created non-destructive web derivatives for selected frames.
- Rebuilt the opening around `P1300187.jpg` and the personal statement “The world, as I remember it.”
- Replaced uniform category treatment with five non-identical visual-world compositions.
- Built a full People encounter chapter, intimate detail pause, environmental chapter, story split, ocean interruption, and loose closing archive.
- Replaced photographic country cards with a text-only destination index explicitly marked as under review.
- Added `/destinations/` and a designed `404` route without fabricating destination content.
- Added a typed archive photograph model with nullable metadata and separated private/public location.
- Refined mobile navigation, focus return, Escape handling, scroll locking, responsive crops, and small-screen typography.
- Expanded metadata with robots, OpenGraph URL, and Twitter title/description foundations.

## Photographs selected

The homepage uses `P1300187.jpg`, `P1210572.jpg`, `IMG_6647.jpg`, `P1230481.jpg`, `1170554.jpg`, `P1230676.jpg`, `P1230972.jpg`, `P1040004.jpg`, `P1260248.jpg`, and `P1310083.jpg`, plus the existing cirque derivative. The complete rationale, crop direction, and sequence relationships are recorded in `HOMEPAGE-IMAGE-EDIT.md`. No stock or generated photography appears in the implementation.

## Typography and palette

The system pairs a condensed informational display voice, old-style editorial serif, and clear humanist UI sans using dependency-free system stacks for this preview. Final licensed font selection remains open. Obsidian and Gallery Ivory control chapter pacing; Electric Ultramarine is restricted to memory marks, numbers, focus, links, and direction. Burnt Copper remains unused rather than competing with the photographs.

## Signature ELSEWHERE elements

1. A short ultramarine memory mark introduces remembered fragments and editorial paths.
2. The visual-world index uses changing ratios, offsets, and typographic relationships rather than repeated cards.

## Motion decisions

Motion is limited to hero settling, photographic clip reveals, subtle scale, restrained parallax, premise entry, memory-mark drawing, and quiet menu transitions. It is disabled at initialization for reduced-motion users. No content depends on animation for visibility or access.

## Responsive decisions

Desktop uses asymmetry, large negative space, horizontal relationships, and hover nuance. Tablet and mobile switch to an editorial vertical sequence, full-screen index, portrait-forward crops, shorter environmental frames, restructured destination rows, and a one-column footer. Exact viewport tests completed at 1440×1000, 1280×800, 768×1024, 390×844, and 320×700 with no horizontal overflow.

## Browser and accessibility QA

The current homepage, individual sections, mobile index, and full-page rhythm were inspected in local headless Google Chrome because the in-app browser bridge was unavailable. All 14 homepage images loaded at desktop and mobile sizes with no broken resources. Chrome reported zero runtime exceptions. The mobile menu opened with correct ARIA state and scroll lock; Escape closed it and returned focus to the trigger. Focus styles, semantic landmarks, heading hierarchy, alt text, skip link, touch targets, and reduced-motion output were reviewed. The route-level navigation links were normalized so they continue to work from `/destinations/`.

## Performance verification

- Astro production build passes and generates three static pages.
- The homepage ships one eager, high-priority hero and 13 lazy images.
- Astro generates 50 responsive WebP derivatives across actual display widths; raw masters are not publicly shipped.
- Compiled CSS is approximately 17.9 KB and the GSAP/Lenis motion bundle is approximately 133 KB before transfer compression.
- Layout dimensions are intrinsic through Astro image metadata, preventing image-area collapse.
- No React runtime, UI library, webfont request, or unnecessary island is shipped.

The largest generated files are high-width options in responsive source sets, not unconditional downloads. A production CDN should add immutable caching and may introduce AVIF alongside WebP after representative-device quality testing.

## Exploration and destination architecture

The homepage now establishes two independent discovery systems: visual worlds and verified geography. `/destinations/` is intentionally text-led until the archive is reviewed. The typed photograph contract can connect photographs to people, places, journeys, stories, and collections without encoding those relationships in filenames.

## Remaining provisional content

- Destination names are structural examples only; photographs remain unassigned until verified.
- The featured-story body explicitly states that context is still being written.
- People identities and encounter narratives await owner-supplied context and consent decisions.
- Final brand name, production domain, licensed typefaces, authored social image, and sitemap integration remain pending.
- Category links currently lead to authored homepage chapters; full collection routes are the next implementation layer.

## Recommended next phase

Build one complete vertical slice rather than many placeholders: the People index, one consent-reviewed person/encounter page, and its related visual-world and story paths. In parallel, formalize Astro content collection schemas from `src/data/archive.ts`, approve public location rules, confirm the production domain, and run Lighthouse/WebPageTest against a deployed CDN build on a real mid-range phone connection.

## Final creative-director test

The homepage is no longer structurally interchangeable with a starter template; photography dominates, the first viewport has a clear authored statement, visual rhythm changes every one to two screens, mobile is separately composed, destination uncertainty is honest, and the page ends with a designed continuation rather than a dead end. The remaining provisional elements are content limitations, not hidden design claims.
