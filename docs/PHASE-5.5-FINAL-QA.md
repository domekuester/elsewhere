# Phase 5.5 — Final QA Gate

Date: 9 August 2026

## Gate result

**PHASE 6 READY**

The public edit contains 472 of 530 indexed masters. Phase 5.5 now has enforced owner-rejection handling, one representative per same-source export family, three additional near-duplicate editorial exclusions, verified derivatives, and a rendered responsive QA record. Master photography was not altered.

## Required counts

| Gate | Result |
| --- | ---: |
| OWNER-REJECTED IMAGE REFERENCES FOUND BEFORE QA | 0 public references |
| OWNER-REJECTED IMAGE REFERENCES AFTER QA | 0 |
| EXACT DUPLICATE USES FOUND | 0 |
| EXACT DUPLICATE USES RESOLVED | 0 newly required; 54 alternate exports were already excluded and re-verified |
| NEAR-DUPLICATE GROUPS REVIEWED | 7 |
| PHOTOS REPLACED | 0 |
| PHOTOS REMOVED FROM PUBLIC EDIT | 3 |
| HOMEPAGE SEQUENCE CHANGES | 0 |
| PEOPLE RESULT | PASS |
| BLACK & WHITE RESULT | PASS |
| DESTINATION IMAGE RESULT | PASS |
| ARCHIVE RESULT | CHANGED |
| MOBILE CROP RESULT | PASS |
| BROKEN IMAGE REFERENCES | 0 |
| BROWSER CONSOLE ERRORS | 0 |
| BUILD | PASS |

## Owner-rejected image

The rejected photograph remains `P1210572.jpg` (`photo-0105`; former working derivative `people-laughing.jpg`). Public code, generated catalog, authored selections, destination relationships, collection surfaces, viewer entry points, and public derivatives contain no reference to it. It remains only as an untouched master and in private factual/curation history with `PRIVATE` and `do-not-publish` states. Historical records were not falsified or deleted.

Public references before QA: **0**. Public references after QA: **0**.

## Duplicate and sequence decisions

The master SHA audit found no byte-identical duplicate groups. Thirty-three same-source filename families were already represented by one public frame, with 54 alternate exports excluded. Seven potentially near-identical sequence relationships were then inspected from readable master previews:

- `P1210804.jpg` kept over `P1210798.jpg`: stronger human gesture and more resolved scene.
- `P1250930.jpg` kept over `P1250929.jpg`: cleaner hand/sun alignment and tonal separation.
- `P1240866.jpg` kept over `P1240865.jpg`: clearer subject separation, colour, and web-scale legibility.
- `P1260187/P1260188`, `P1230819/P1230821`, `P1260453/P1260454`, and `P1270987/P1270989` remain available because their changes in scale, gesture, or framing make them distinct editorial instruments rather than redundant frames.

The final corrected audit reports 472 public photographs, zero exact duplicate groups, and zero unresolved rapid-sequence candidates.

## Editorial review

- **Home:** all 17 photographs are unique within the page. The sequence retains clear hero, anchor, editorial, detail, monochrome, and quiet roles. No image was changed merely to manufacture activity during QA.
- **People:** the working food-vendor hero respects the subject and creates a specific human encounter. The supporting chef and boxer photographs change gesture and distance without repeating the same beat.
- **Black & White:** the sequence uses genuine monochrome files, not CSS conversion. Its full-bleed opening, human anchor, and quieter asymmetrical frames create a distinct room while retaining ELSEWHERE's design language.
- **Destinations:** the public index communicates only owner-timeline-confirmed country-level relationships. Japan is the sole open chapter and uses an exclusive five-frame sequence; the remaining destinations stay in editorial review rather than exposing thin or falsely precise pages.
- **Archive:** one representative per duplicate-export family is shown. Three redundant near-sequence frames were additionally removed. The first 24-frame incremental edit contains no repeated IDs or sources.

Cross-page reuse is limited to deliberate discovery continuity: a homepage teaser may lead into its collection or Archive context. It is not repeated within a single rendered route, and deeper Japan content reveals a separate edit.

## Technical image verification

A pixel audit discovered 185 public photographs whose archive and thumbnail derivatives were unusable solid-black outputs from the legacy conversion path. `scripts/repair-black-derivatives.py` regenerated only those 370 affected files from read-only masters through a Quick Look intermediate, then verified them. The final derivative audit covers 472 archive images plus 472 thumbnails:

- missing/unreadable derivatives: **0**
- black/unusable derivatives: **0**
- empty files: **0**
- public derived files: **944**

The duplicate audit now reads the verified public derivatives rather than the obsolete black thumbnail cache. No source master was modified.

## Rendered browser verification

Rendered QA covered Home at 1440, 1280, 768, 390, and 320 pixels; People desktop/mobile; Black & White desktop/mobile; Destinations; Archive desktop/mobile; and Japan desktop/mobile. It exercised Archive frame opening, Arrow Right navigation, closing, and image loading. Reduced-motion rendering was separately used for complete-page review.

Results across all 14 viewport/route cases:

- horizontal overflow: **0**
- broken images: **0**
- repeated image sources within a route: **0**
- rejected-image references: **0**
- framework error overlays: **0**
- console warnings/errors: **0**
- HTTP responses at or above 400: **0**

The destination-index headline collision found during screenshot review was corrected by constraining the editorial display scale; no destination imagery or information architecture was redesigned. Archive screenshots initially appeared to contain an empty runway because off-screen `content-visibility` frames are intentionally not painted by Chrome's single-shot full-page capture. Layout inspection confirmed all 24 opening frames occupy the contact sheet; normal scrolling reveals them progressively as intended.

## Validation and public safety

- Content validation: PASS — 530 photographs, 8 destination records, 10 journeys, 14 story candidates, 9 People candidates.
- Public catalog: 472 photographs.
- Public rejected-image references: 0.
- Public raw/private location leakage: none found by existing content validation.
- Build: PASS.

## Important changes made during this gate

1. Removed three weaker near-duplicate frames from public generation and recorded the stronger editorial representatives.
2. Repaired both public derivative classes for 185 photographs without touching master files.
3. Corrected the perceptual audit to compare verified derivatives.
4. Fixed the rendered Destinations headline collision.
5. Added a repeatable 14-case rendered QA script with viewer interaction and console/network checks.
6. Re-verified the rejected photograph as absent from every public payload and route.

No material Phase 5.5 issue remains open.
