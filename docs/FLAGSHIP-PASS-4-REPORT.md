# Flagship Pass IV report

## Outcome

ELSEWHERE now has a platform layer beneath the established experience. Home remains a finite editorial sequence; `/archive/` exposes all 530 indexed photographs progressively; the immersive viewer makes a selected frame the visual environment; and `/curate/` provides a safe local classification workflow.

## 1. Visual changes

The public addition is a contemporary contact sheet on Gallery Ivory with honest ratios, large editorial pauses, frame indexing and very restrained Ultramarine. Already curated frames receive scale; unassigned frames do not receive invented significance. The viewer moves into Obsidian and removes almost all interface around the photograph. The footer now points toward archive depth rather than looping back to Home.

Black & White remains its own quiet room. The Archive opening was corrected after screenshot review so it moves through the previously documented colour edit before entering monochrome; it no longer accidentally opens as an all-black-and-white grid.

## 2. Architectural changes

- Added a generated public-safe photo catalog and separate editorial assignment file.
- Added explicit story, fragment, and destination object contracts with ID references and manual ordering.
- Added desktop/mobile focal-point assignment fields.
- Split navigation behavior from cinematic GSAP/Lenis motion so Archive and Curation do not load homepage motion code.
- Strengthened `AGENTS.md` and added a documentation index.

## 3. Archive architecture

`/archive/` implements dynamic confirmed-world, year, and orientation filtering, 24-frame incremental batches, native lazy loading, stable intrinsic dimensions, numbered contact-sheet language, and `Another frame` serendipity. The full public catalog contains 530 records. Initial DOM count is 24; verified continuation count is 48.

## 4. Image indexing and derivatives

- Master JPEG count verified: **530**.
- Public photo objects indexed: **530**.
- Thumbnail derivatives available: **530**, approximately 22 MB total; average 34.8 KB, maximum 117 KB.
- Archive-view derivatives generated: **530**, approximately 132 MB total; average 260 KB, maximum 920 KB.
- Total implemented public derivative files: **1,060**.

Only rendered thumbnails load during index browsing. A single 1600px archive derivative loads when its viewer opens. No master was modified or shipped directly by the Archive.

## 5. Black & White

Six genuine monochrome photographs remain editorially confirmed. No CSS grayscale or destructive conversion is used. Technical monochrome detection remains a future candidate-generation tool rather than an automatic classification source.

## 6. Curation Studio

Development route: `/curate/`.

It displays all 530 optimized thumbnails, large preview, assignment filters, visual worlds, manual destination, role, visibility, featured and candidate flags, Arrow/1–6/H/E/A shortcuts, local persistence, and explicit JSON export. Browser testing confirmed a role edit persisted locally. There is no write endpoint.

The production build emits only a 4 KB, no-index not-found shell at `/curate/`; it contains no catalog IDs, curation grid, controls or client studio script. It is absent from navigation and no sitemap integration includes it.

## 7. Immersive Viewer

Status: implemented and verified. Native `dialog` provides focus containment and Escape handling; Arrow keys, controls, touch swipe and accessible live sequence numbers are supported. Metadata is limited to confirmed year/world/destination values. The active 1600px frame uses `object-fit: contain`, never a destructive crop.

## 8. Signature interaction

The single Pass IV signature is **Archive frame → immersive photograph**. The selected frame expands spatially into the viewer using the Web Animations API and the established ELSEWHERE easing. Reduced-motion enters instantly. Next/previous changes remain quiet instead of becoming a carousel spectacle.

## 9. Destinations

Destinations remain a separate discovery axis. Public catalog destinations are still `null`; no photographs were assigned geographically. The Curation Studio provides the manual assignment workflow, while destination objects support approved photo IDs and explicit editorial order overrides.

## 10. Mobile QA

Rendered QA covered 1440×1000, 1280×800, 1024×768, 768×1024, 390×844 and 320×700. Home, Archive, People, Black & White and Destinations had correct titles/H1s, zero horizontal overflow and zero broken visible images. Archive mobile uses an asymmetric vertical sequence; its viewer preserves both landscape and portrait compositions and supports swipe/Arrow navigation. Mobile navigation remains keyboard-operable.

## 11. Performance

The static build completes in approximately 1.2 seconds on the current machine. Archive HTML is about 19 KB; public catalog metadata is about 464 KB uncompressed. Archive-specific behavior is emitted as a small inline module. The 130 KB GSAP/Lenis module is no longer referenced by Archive or Curation. No React runtime, UI library, map SDK, font download, or new dependency was added.

The next scaling threshold is several thousand records: split `photo-catalog.json` into generated static chunks before its metadata transfer becomes significant.

## 12. Accessibility

Verified: semantic main/section landmarks, meaningful filter labels, pressed state, native dialog semantics, visible control focus, Escape with focus return, Arrow navigation, readable metadata, reduced-motion bypass, no reveal-dependent content, stable image dimensions and touch controls. Cross-page GSAP warnings were eliminated; final Archive console review reported zero errors and zero warnings.

## Screenshot mismatch ledger

| Mismatch found | Correction |
| --- | --- |
| Archive opened with six monochrome frames, reading as a duplicate B&W collection | Reused only the documented Pass III edit and added explicit editorial order across colour and monochrome |
| Homepage-only GSAP selectors emitted warnings on Archive | Scoped motion initialization and removed GSAP/Lenis from Archive entirely |
| Viewer initially focused the wordmark, creating a distracting focus box | Focus moved to the dialog container while preserving focus trapping and visible focus on controls |
| Mobile Black & White filter wrapped into three lines | Made filter items non-shrinking in the horizontal filter rail |
| Full viewer received a browser focus border on mobile | Removed dialog-container outline; actual interactive controls retain visible focus |

## 13. Remaining provisional content

Most of the 530 frames remain intentionally unassigned by world, destination, role, visibility and alt description. Destination identity, People identities/consent, story fragments, captions, print status and focal coordinates await human curation. Only the prior documented homepage selection is treated as editorially confirmed.

Archive delivery currently uses broadly compatible JPEG derivatives. AVIF/WebP archive negotiation, catalog chunking, persistent URL state for filters/viewer, canonical selected-photo pages and production domain/sitemap should follow after the owner completes an initial curation pass.

## 14. Recommended next phase

Use `/curate/` to approve one complete destination set and 40–60 archive frames across all six worlds. Then build one verified destination page and one small real story fragment from those assignments. This tests the entire publishing loop—classification, ordering, public metadata, internal links and canonical editorial depth—without diluting the homepage.

## 15. Preview

Development server: `http://127.0.0.1:4322/`

Archive: `http://127.0.0.1:4322/archive/`

Local Curation Studio: `http://127.0.0.1:4322/curate/`
