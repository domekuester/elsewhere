# Phase 9.2 — Final QA

All results below were produced by running the checks, not by reading source. Where a check found
nothing, that is stated as a result rather than as an assumption.

## Build and validation

```
npm run build
```

| Gate | Result |
| --- | --- |
| Content validation | **PASS** — 636 photos, 10 destinations, 10 journeys, 14 story candidates, 19 People candidates |
| Owner exclusion validation (source) | **PASS** — 24 rejected, 0 public references across 32 source surfaces |
| Astro build | **PASS** — 16 pages |
| Production boundary | **PASS** — `/curate/` and its bundle absent from `dist/` |
| Owner exclusion validation (built) | **PASS** — 0 public references across 25 built files and 3 derivative directories |
| Launch validation | **PASS** — 15 public HTML files, unique canonicals, complete social metadata, private route excluded, sitemap and image sitemap consistent |
| Broken public assets | **0** |
| Relevant console errors | **0** |

Two owner-configuration items are reported by the launch validator and are not software failures:
`PUBLIC_CREATOR_NAME` and `SITE_URL` are unset.

## Rendered sweep — Chromium

16 routes × 10 viewports (1600, 1440, 1280, 1100, 1024, 980, 768, 430, 390, 320) at DPR 2, each
page fully scrolled to trigger every lazy image and reveal.

| Check | Result |
| --- | --- |
| Horizontal overflow | **0 routes at any width** |
| Broken images (`naturalWidth === 0`) | **0** |
| Images without an `alt` attribute | **0** |
| Failed network requests | **0** |
| Console errors | **0**, excluding the 404 route |

The 404 route logs one console entry at every width: the browser reporting that the document itself
returned HTTP 404. That is the page working correctly.

One benign edge case at 390 and 320: the `black and white` filter extends past the viewport inside
`.archive-filter-group`, which is a horizontal scroller (scrollWidth 391 vs clientWidth 350). It is
reachable by swiping and its partial visibility is the affordance.

## Rendered sweep — WebKit / Safari

Explicitly run because the previous header defects were Safari-specific. 13 routes × 2 profiles
(desktop 1440 at DPR 2, and an iPhone 14 device profile exercising the safe-area header work).

**Clean across 26 page loads**: no overflow, header and wordmark on-screen and intact at every
route, no console errors.

## Accessibility

14 routes × 2 modes (default and `prefers-reduced-motion: reduce`).

| Check | Result |
| --- | --- |
| Exactly one `h1` per page | **PASS**, all 28 loads |
| Heading level jumps | **0** |
| `main#main` and header landmarks | **PASS** |
| Images without `alt` | **0** |
| Reveal-animated elements still hidden after a full scroll under reduced motion | **0** |
| Touch targets below 24×24 | **0**, excluding one documented inline-text exception |

Reduced motion exposes complete, composed pages with no hidden content — verified by measuring
computed opacity on every `[data-photo-reveal]` element after scrolling each page end to end.

The single remaining sub-24px target is the mailto link inside a sentence on the contact form,
exempt under WCAG 2.2 SC 2.5.8's inline-text exception.

## Interaction

| Path | Result |
| --- | --- |
| Wordmark → Home | PASS |
| Desktop navigation, mobile menu | PASS |
| Destination entry from Home, index card, and archived-place row | PASS |
| Archive world filter, year, format, place | PASS |
| `?world=` and `?destination=` deep links activate their controls | PASS |
| Black & White entry from Home, People, and destination chapters | PASS |
| Viewer open, next, previous, keyboard arrows, close | PASS |
| Viewer focus return to originating frame | PASS |
| Viewer scroll restoration and body-lock release | PASS |
| Studio and Licensing enquiry paths | PASS (gated on `PUBLIC_CONTACT_EMAIL`, correctly hidden while unset) |
| Browser back and forward | PASS |

## Image fidelity

| Check | Result |
| --- | --- |
| Derivative pipeline | thumbnails 960px q84, archive 1800px q86 4:4:4, viewer 3200px q90 4:4:4, no enlargement, ICC retained |
| `srcset` width descriptors match files on disk | **verified** (e.g. a 2132×3198 master: 640w / 1200w / 2132w claimed, 640×960 / 1200×1800 / 2132×3198 measured) |
| Viewer serves the viewer derivative | **verified** — 2138×3200 loaded and revealed, thumbnail used only as the decode-time preview |
| Thumbnail used at large size anywhere | **none found** |
| Undersized derivatives | **0** (validator checks every public frame against its expected long edge) |
| Upscaling | none; `withoutEnlargement` throughout |
| LCP treatment | one eager `fetchpriority="high"` image per page, lazy below the fold |

### Defect found and fixed

22 public photographs whose master filename contains a space produced `srcset` candidates
containing a raw space, which is a parse error. Chrome dropped every high-resolution candidate for
those frames and rendered them at thumbnail size on every surface — archive, chapters, People,
business pages. Catalog URLs are now percent-encoded; on-disk names are untouched. The content
validator decodes before checking the filesystem.

## Performance

No dependency was added in this phase, in the site or in its build. Client JavaScript is unchanged
apart from three small additions to the archive script: query-parameter intent, a total-count
binding, and nothing else.

Chapter pages became **shorter** while their photographs became **larger**, because the scale work
replaced repetition with rhythm:

| Page | Before | After |
| --- | --- | --- |
| Japan chapter | 13,198px (15 frames) | **11,465px** (16 frames, larger) |
| La Réunion chapter | 10,981px | **9,640px** |

The public catalog shrank from 532 to 469 entries, so the archive ships less. Home, Archive, Viewer
and mobile were re-measured after every change and none degraded.

## Privacy and public/private boundary

| Check | Result |
| --- | --- |
| `rightsNotesInternal`, `modelReleaseStatus`, `propertyReleaseStatus` in `dist/` | **absent** |
| `internalNotes`, `sourcePath`, `assets-source`, `privateLocation` in `dist/` | **absent** |
| `ownerRejected` / `editorialHold` registers in `dist/` | **absent** |
| GPS, latitude, longitude in the public catalog | **absent** |
| `/curate/` in `dist/`, sitemap, or robots-indexed content | **absent** |
| Owner questions, curation data, draft content in public output | **absent** |

## Owner exclusion deep audit

The canonical validator passes against source and built output. Its content-based check — a 16×16
greyscale signature comparison, added in Phase 9 after two owner-rejected photographs were found
hiding in `src/assets/` under different filenames — still passes: a rejected frame cannot return
under any name.

A second-layer check was added this phase for the new editorial-hold state, giving held frames the
same guarantee owner rejections get:

- the hold register and the curation layer must agree in both directions;
- a held frame may not duplicate an owner rejection, because the owner's register is authoritative;
- a held frame must retain **no** publicly fetchable derivative.

Verified: **63 held frames, 0 lingering derivatives.** Masters are untouched and every hold is
reversible by deleting its register entry and rebuilding.

## SEO and discovery

| Check | Result |
| --- | --- |
| Page sitemap | 13 URLs, includes the new La Réunion chapter, excludes `/curate/` |
| Image sitemap | 561 image entries across 5 pages (469 archive + 48 monochrome + 44 chapter frames) |
| Canonicals | unique across all 15 public HTML files |
| Open Graph and social metadata | complete on every page |
| Structured data | CollectionPage, BreadcrumbList and per-frame ImageObject with truthful credit and copyright |
| Thin pages added | **none** |
| Tag pages or generated articles added | **none** |

Search-entry sanity was checked by loading Japan, La Réunion, Essaouira, Black & White, People,
Studio and Licensing directly: each carries its own heading, its own explanation, and its own way
onward without requiring Home first.

## Tooling used

Discovered by inspecting the environment, then classified before use.

### Must use — and used

| Capability | What it contributed |
| --- | --- |
| `AGENTS.md`, `PRODUCT.md`, Phase 8/9/9.1 docs, `docs/OWNER-PHOTO-EXCLUSIONS.md`, `docs/OWNER-TRAVEL-TIMELINE.md` | The constitution. Every protected system, every rule about invention, and the owner's authority over exclusions came from here. |
| Project validators — `validate:content`, `validate:exclusions`, `validate:launch`, `finalize-production-build` | The build gate. Two of them caught this phase's own regressions before anything shipped, and two were extended to understand the new state. |
| `scripts/build-photo-catalog.mjs` | The single source of the public catalog. Three defects were fixed inside it rather than worked around downstream. |
| **Vision on the actual photographs** | The core of the phase. Eighteen generated contact sheets covering all 469 public frames, reviewed image by image. Every editorial judgement here — what is a People photograph, which chapter frames to choose, what is a holiday snapshot — came from looking. |
| `sharp` (already a project dependency) | Built the contact sheets and proof sheets; measured per-pixel channel spread to identify true greyscale; verified derivative dimensions against `srcset` claims. |
| Playwright (Chromium + WebKit) | All rendered QA. 160 page/viewport combinations, 26 WebKit loads, 28 accessibility loads, viewer interaction, chapter scale measurement. Installed **outside the project** so `package.json` gained nothing. |

### Useful — and used

| Capability | What it contributed |
| --- | --- |
| Playwright MCP browser | Interactive inspection while iterating: header contrast crops, hero candidates at full-bleed, viewer internals. |
| Node scripting | Inventory arithmetic, cross-surface usage mapping, destination count reconciliation. |

### Relevant but not used, and why

| Capability | Why not |
| --- | --- |
| Chrome DevTools MCP, Lighthouse audit | Performance was assessed by measurement that answers the actual question — page height, frame scale, derivative resolution, catalog size, dependency count. A Lighthouse score against a dev server would have added a number without adding knowledge, and the brief is explicit that photography must not be optimised away to chase one. |
| `frontend-design`, `impeccable`, `ui-ux-pro-max`, `design-dna` | This phase was explicitly not a redesign. A design-generation skill would have pulled toward novelty exactly where the brief demands restraint. |
| GSAP, Three.js, motion skills | The existing motion system is minimal and correct. Adding a motion library would have been the "fake expensiveness" the brief prohibits. |
| Figma MCP | No design file exists; the publication is the design source of truth. |
| Context7 | No library API questions arose. Astro, sharp and the DOM were used as the project already uses them. |
| Firecrawl, WebSearch, WebFetch | Nothing about this phase is answerable from the internet. Every fact is in the archive. |
| Subagents | Not requested, and the work was one continuous editorial judgement that does not decompose. |

### Not relevant

React performance skills (no React island), diagramming, dataviz, artifact publishing, slides,
skill-creator, cron and scheduling.
