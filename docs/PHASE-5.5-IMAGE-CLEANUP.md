# Phase 5.5 — Image Cleanup

## Outcome

The public edit now contains **472 of 530 indexed masters**. Fifty-eight records are intentionally excluded from public presentation: one owner-rejected photograph, 54 redundant alternate exports across 33 same-source families, and three weaker near-duplicate frames selected during final visual review. No master photograph was moved, renamed, recompressed, or deleted.

## Owner-rejected photograph

- **Removed:** `P1210572.jpg` (`photo-0105`; former working derivative `people-laughing.jpg`).
- **Previous surfaces:** two early homepage People moments; after its initial retirement it was unintentionally reintroduced by the Phase 4 generated Archive catalog and could therefore be opened in the immersive viewer.
- **Replacement:** the homepage People anchor remains `P1260248.jpg`; the People landing hero is now `P1210660-2.jpg`, and `P1210854.jpg` adds a distinct gesture within its sequence.
- **Complete public removal:** it is marked `PRIVATE` / `do-not-publish`, excluded by the catalog generator, removed from destination and journey editorial relationships, absent from authored selections, and its public and working derivatives are deleted. It remains only as an untouched master and internal factual inventory record.

The catalog generator and content validator now enforce this exclusion, so regeneration cannot silently publish it again.

## Duplicate audit

The read-only audit command is `npm run audit:images`.

- Exact byte-identical master groups: **0**
- Same-source filename/capture-time variant families: **33**
- Redundant public variants hidden: **54**
- Near-duplicate sequence relationships visually reviewed: **7**
- Weaker near-duplicate frames hidden after review: **3**

The public representative choices are recorded in `data/public-image-exclusions.json`. The kept filenames are:

`1200794-2.jpg`, `1210412-2.jpg`, `1210415-2.jpg`, `IMG_9830-2.jpg`, `P1210177 Kopie.jpg`, `P1210297.jpg`, `P1210660-2.jpg`, `P1210692.jpg`, `P1230352.jpg`, `P1230472-2.jpg`, `P1230819-2.jpg`, `P1230935-2.jpg`, `P1240278.jpg`, `P1240451-Enhanced-NR-2.jpg`, `P1240750.jpg`, `P1260071.jpg`, `P1260105-2.jpg`, `P1260453-2.jpg`, `P1260473-2.jpg`, `P1270020-2.jpg`, `P1270024-2.jpg`, `P1270031-4.jpg`, `P1270034-2.jpg`, `P1270038-2.jpg`, `P1270040-2.jpg`, `P1270045-2.jpg`, `P1270057-2.jpg`, `P1270058-2.jpg`, `P1270257.jpg`, `P1270449-2.jpg`, `P1270514-2.jpg`, `P1280330.jpg`, and `P1300824.jpg`.

The representative was selected using capture identity, usable resolution, visible composition, gesture, crop flexibility, and editorial utility. Variants are hidden only from public presentation; their masters remain available for later owner comparison. The final visual review retained four sequence pairs because they depict materially distinct scale, gesture, or framing. It removed `P1210798.jpg` in favour of `P1210804.jpg`, `P1250929.jpg` in favour of `P1250930.jpg`, and `P1240865.jpg` in favour of `P1240866.jpg`.

## Homepage sequence refinement

- The Ocean world index now uses `P1230662.jpg`, reserving `P1230676.jpg` for the later full-bleed human-against-water climax.
- The closing sequence no longer repeats the Black & White artisan or Urban street frame.
- Its new rhythm is colour/detail/human gesture: `P1280352.jpg` → `P1040004.jpg` → `P1210859.jpg`.
- The large hero, mountain, Ocean, People, and Black & White image moments remain intact.
- No photograph is repeated within the homepage edit.

## People, Black & White, and destinations

- People now opens with `P1210660-2.jpg`, a working encounter rather than reusing the homepage water portrait. The smaller sequence gains `P1210854.jpg` and retains worker and motorcycle frames.
- Black & White keeps its existing confirmed sequence. Its homepage threshold intentionally previews three collection photographs; no CSS monochrome conversion or weak substitute was introduced.
- Japan now has an exclusive five-frame destination edit led by `P1230620.jpg`, followed by `P1230638.jpg`, `P1250177.jpg`, `P1250557.jpg`, and `P1260492.jpg`. This rewards deeper exploration instead of replaying homepage frames. The first browser review rejected two technically black derivatives before publication.
- The Archive remains deep but now shows one public representative for each duplicate-export family.

## Remaining review

The final review retained both frames in `P1260187/P1260188`, `P1230819/P1230821`, `P1260453/P1260454`, and `P1270987/P1270989`: each pair changes scale, human gesture, or narrative information enough to justify separate archive roles. The corrected perceptual audit now reports no unresolved rapid-sequence candidates among the public 472-frame catalog.

Historical audit and inventory documents continue to mention `P1210572.jpg` because they record source truth. They are not public site payloads or selection lists and must not be rewritten to pretend the master never existed.
