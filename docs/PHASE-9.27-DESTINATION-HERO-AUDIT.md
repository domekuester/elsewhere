# Phase 9.27 — destination hero audit

The state of every destination's first viewport before this phase, and what it needed.

## The list is shorter than it looks

`src/pages/destinations/[slug].astro` builds a page only for `publicationStatus === 'published'`.
Twelve destinations exist in `data/destinations.json`; **four** have a public page.

| Destination | Status | Public page | Photographs | Class |
| --- | --- | --- | --- | --- |
| Japan | published | yes | 204 | **A** — flagship hero already |
| La Réunion | published | yes | 101 | **A** — flagship hero already |
| Essaouira | published | yes | 47 | **B** — hero strong, mobile crop below standard |
| Düsseldorf | published | yes | 22 | **B** — hero strong, title at the gutter edge |
| Malaysia | in-edit | no | 53 | **E** — not public; see below |
| Thailand | in-edit | no | 32 | **E** — not public |
| Phu Quoc | in-edit | no | 18 | **E** — not public |
| Laos | in-edit | no | 3 | **E** — not public, and cannot be |
| Vietnam, Morocco, France, Germany | planned | no | 0 | **E** — parent records only |

So the quality hierarchy the phase set out to remove is real, but it is not between heroes. All four
open chapters already share one full-bleed grammar: `height: 100svh`, photograph behind a
difference-blended header, wordmark top-left, navigation top-right, title lower-left with the
ultramarine mark, date lower-right. **No destination was missing a hero.** The gap is that Malaysia,
Thailand, Phu Quoc and Laos appear on `/destinations/` as four text rows under "IN THE ARCHIVE",
with no photograph and no page to enter — which is exactly what a visitor reads as a lower tier.

Opening those four is a curation phase, not a hero phase: each needs a manual sequence, per-frame alt
text and a provenance decision, which is what Phase 9.1 did for Essaouira and Phase 9.25 for
Düsseldorf. AGENTS.md forbids shipping a route with no real content, and this phase was told not to
fabricate a destination implementation. They are therefore **reported as a dependency, not built** —
with provisional heroes chosen and stored so the work is waiting when their phase starts.

## What was actually wrong with the four open chapters

1. **The hero had no `srcset`.** Every viewport downloaded the 3200px viewer derivative: 1.3–2.4 MB
   to paint a 390px phone. This is the page's LCP element.
2. **One `object-position` for every chapter.** `50% 56%` on desktop and `48% 50%` below 560px, applied
   to a sunlit wall, a night canal, a cirque and a bridge pylon alike. Essaouira lost its gulls
   entirely in the mobile crop — the subject of the photograph was cropped out of the phone view.
3. **No focal point at tablet width.** 561–900px inherited the desktop value.
4. **One scrim strength for every chapter.** A fixed top band and a fixed bottom gradient from 50%,
   regardless of whether the title fell on dark vegetation or bright sky.
5. **Düsseldorf's title reached the gutter.** At 390px the longest name on the site measured exactly
   the full text column with zero margin. Not an overflow, but no room either, and the next long
   destination name would have broken it.
6. **No owner control.** Re-cropping a hero meant editing `global.css`.

## What was already right, and was left alone

- The four chosen photographs. Each was tested against its full chapter (374 eligible frames reviewed
  across the four) and each won — see the shortlist document.
- `height: 100svh`, the header safe-area work, and the difference-blend header band from Phase 8.x.
  The band was tested at reduced strength on Essaouira and made no measurable difference to wordmark
  luminance (max 251 vs 250 of 255), because the sky behind it is already dark. It stays as authored.
- The cut from photograph to ivory provenance. It reads as an intentional page turn, not as a
  generic white section, so it was not "improved".

## Method

Selection did not happen from thumbnails alone. All 374 publication-eligible frames in the four open
chapters were reviewed as contact sheets, finalists were compared against the incumbent, and the
winner was then rendered in the real hero layout at 1600 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 320
before the decision was fixed. Rejected, held and duplicate-family frames were removed from the pool
before review, not filtered out after it.
