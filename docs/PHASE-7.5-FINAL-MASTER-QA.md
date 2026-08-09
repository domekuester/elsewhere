# Phase 7.5 — Final Master Quality Gate

Date: 9 August 2026

## Gate result

**PHASE 7.5 — GITHUB READY**

The rendered publication, public catalog, derivative pipeline, and regeneration paths pass the final photography-quality gate. The 588 untouched masters produce a 500-photograph public archive after explicit owner rejections and one-frame-per-variant editorial control.

## Required numbers

| Measure | Result |
| --- | ---: |
| REJECTED YOUNG-MAN IMAGE REFERENCES | 0 |
| FAST & YUMMY SHAWARMA IMAGES FOUND | 7 source frames |
| FAST & YUMMY SHAWARMA IMAGES PUBLIC AFTER QA | 0 |
| NEW B&W PHOTOS FOUND | 58 |
| NEW B&W PHOTOS REVIEWED | 58 |
| NEW B&W PHOTOS SELECTED | 8 |
| OLD B&W PUBLIC IMAGES REPLACED | 8; lighthouse retained |
| EXACT DUPLICATE GROUPS | 0 byte-identical groups |
| NEAR-DUPLICATE GROUPS | 61 reviewed: 54 same-source/alternate-export families plus 7 rapid-frame groups |
| PUBLIC PHOTOS REMOVED | 29 during Phase 7.5 |
| PUBLIC PHOTOS REPLACED | 0 during this gate |
| HOMEPAGE PHOTOS CHANGED | 0 during this gate; the Phase 7 17-frame edit passed unchanged |
| IMAGE PIPELINE ISSUES FOUND | 4 systemic issues |
| LOW-RES / WRONG-DERIVATIVE USES FIXED | 1,053 direct role uses: 526 index thumbnails, 526 viewer opens, 1 destination hero |
| VIEWER LANDSCAPE | PASS |
| VIEWER PORTRAIT | PASS |
| VIEWER MOBILE | PASS |
| FULL IMAGE VISIBLE IN VIEWER | PASS |
| ORIGINAL ASPECT RATIO PRESERVED | PASS |
| RETINA / HIGH-DPI QUALITY | PASS |
| BLACK & WHITE | PASS / CHANGED |
| PEOPLE | PASS |
| ARCHIVE | PASS / CHANGED |
| DESTINATIONS | PASS / CHANGED |
| TYPOGRAPHY | PASS |
| SCROLL FEEL | PASS |
| MOTION | PASS / CHANGED |
| MOBILE | PASS / CHANGED |
| REDUCED MOTION | PASS |
| BROKEN ASSETS | 0 |
| CONSOLE ERRORS | 0 |
| BUILD | PASS |

## Owner-rejected photography

The previously rejected young-man photograph is `P1260248.jpg` (`photo-0351`). It remains an untouched master and a private factual record, but has `visibility: do-not-publish` and `publicationStatus: PRIVATE`. Public references and public derivatives are zero.

Visual inspection found seven—not three—FAST & YUMMY SHAWARMA source frames: `1210412-2.jpg`, `1210412.jpg`, `1210415-2.jpg`, `1210415-3.jpg`, `1210415-4.jpg`, `1210415.jpg`, and `1210417.jpg` (`photo-0024` through `photo-0030`). The whole business-photo family is marked owner-rejected, `PRIVATE`, and `do-not-publish`. All seven are absent from Home, Archive, destinations, collections, story generation, viewer data, the public catalog, public derivatives, and production output.

This exclusion is structural. `classify-owner-timeline.mjs`, `build-photo-catalog.mjs`, and `generate-archive-derivatives.mjs` all read the same exclusion policy. Regeneration filters rejected IDs before destination, journey, story, People, public-catalog, and derivative output. Content and launch validation fail if an owner-rejected asset resurfaces.

## Duplicate and photographic edit

The byte-hash audit reports zero exact duplicate groups. It reports 54 same-source or alternate-export families, including the newly added monochrome exports. Seven earlier rapid-frame groups were also reviewed photographically.

One public representative is now enforced for every same-frame family. The selected monochrome exports `1200794-3.jpg` and `P1260472-2.jpg` outrank their older variants because they belong to the authored Black & White sequence. For the other new color/monochrome pairs, the established color frame remains the general Archive representative. No same-source variant family now has more than one public member, and the rapid-sequence audit reports zero unresolved candidates.

The public catalog moved from 529 photographs before this gate to 500: seven shawarma frames plus 22 additional same-frame variants were removed from public eligibility. No homepage replacement was necessary after rendered review; its 17 photographs remain unique and its large/intimate, human/environment, color/monochrome rhythm remains strong.

## Black & White, People, and destinations

All 58 newly detected monochrome-presented files were reviewed in the Phase 7 contact-sheet edit. Eight entered the nine-image authored Black & White room; `P1260122.jpg` remains the lighthouse opening. The former eight weak public selections were retired. The collection page renders nine unique genuine monochrome files with no CSS conversion and passed desktop/mobile visual review.

People passed without a new substitution: its worker, chef/encounter, boxing, and street-presence sequence remains specific and respectful, with no rejected photograph. Destination relationships remain owner-timeline-backed. Japan uses a 3200 px hero role and 1800 px sequence roles; rejected business material is not eligible for Malaysia or Urban merely because the date is confirmed.

## Fidelity pipeline findings and fixes

Four systemic defects explained the owner's softness report:

1. ~520 px internal review thumbnails were copied into Retina archive cells.
2. A 1600 px, quality-78 archive JPEG was reused for every immersive viewer opening.
3. The Japan chapter hero also used the archive role rather than a hero/viewer role.
4. The 58 new monochrome inventory records lacked dimensions because their EXIF omitted those tags.

The implemented pipeline now creates 960 px quality-84 thumbnails, 1800 px quality-86 4:4:4 archive/display images, and 3200 px quality-90 4:4:4 viewer/hero images. All 1,500 current derivatives retain ICC profiles, preserve decoded orientation, and use `withoutEnlargement`. Missing dimensions were decoded from all 58 masters; missing inventory dimensions are now zero, and future ingestion uses the same fallback.

Representative browser/source checks proved 2×-DPR adequacy. For example, `P1280352.jpg` renders from a 3200×2137 viewer asset, while the portrait `P1210859.jpg` renders from 2138×3200. No CSS sharpening or global image filter was added.

## Immersive viewer

The viewer is now an explicit fixed `100dvh` layer. A centered usable stage reserves control/caption space; both preview and full image use contained sizing with intrinsic dimensions and original aspect ratio. A small contained preview gives way to the decoded high-fidelity viewer role. Underlying scroll is locked and the exact previous scroll position is restored on close.

Automated 2×-DPR geometry checks covered:

- 1440×1000 landscape and portrait
- 1280×800 near-square
- 768×1024 wide landscape
- 390×844 monochrome portrait
- 320×700 portrait

Every case reported full image visible, no clipping, viewport centering, original aspect ratio preserved, viewer-role source selected, high-DPI adequacy, body lock, close success, and scroll restoration. Close, previous, next, Escape, arrow keys, and touch swipe remain supported. Mobile previous/next controls were moved out of the metadata line after screenshot review exposed overlap.

## Motion, scroll, typography, and rendered QA

Native scrolling remains in control; Lenis is not imported or initialized. There is no scrubbed parallax or pinned sequence. Motion is limited to short, one-time reveals and a 420 ms viewer entry; reduced-motion users receive complete static composition. This materially removes the former delayed/mushy input feel.

The Phase 7 display/editorial/UI typography passed at 1440, 1280, 768, 390, and 320 pixels without overflow. Screenshot review confirmed the hero, People, Black & White, Archive, destination index, Japan, and mobile compositions retain the established premium hierarchy.

Final rendered QA covered 14 route/viewport cases plus six dedicated viewer cases. Results: zero horizontal overflow, zero broken images, zero duplicate sources within rendered routes, zero owner-rejected references, zero framework overlays, zero console errors/warnings, and zero failed network responses. The production boundary removes `/curate/` and its bundle from `dist`.

## Verification commands

- `npm run audit:images` — 588 masters, 500 public photographs, 0 exact duplicate groups, 0 unresolved rapid-sequence candidates.
- `npm run validate:content` — PASS, including all 1,500 derivative role files and exclusion persistence.
- `npm run build` — PASS, 9 Astro routes built; private curation route removed from production.
- `npm run validate:launch` — PASS, 8 public HTML files, unique canonicals, complete social metadata, private route excluded.
- Rendered Chrome QA — PASS at all required desktop, laptop, tablet, 390 px, and 320 px surfaces.

Local preview: `http://127.0.0.1:4324/`
