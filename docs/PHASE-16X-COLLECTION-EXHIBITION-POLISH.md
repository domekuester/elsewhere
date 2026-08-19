# Phase 16X — collection and exhibition polish

Two passes. The first put every plate on a rail. The second, recorded at the end of this document,
fixed what the first pass left: orphan rows, pairs that did not read as pairs, and a category name
that arrived after its photograph rather than before it.

An art-direction pass on the grouped photographic surfaces, from four points of owner review.
It changed no photograph's content and removed no orientation; it replaced the systems that were
producing accidents.

## The two rails

Every grouped photographic surface is built on the same twelve-column grid. Before this phase, the
plates on that grid started wherever each rule happened to say. Measured on Home's world wall at
1440px, the five plates started at x = 0, 803, 115, 688 and 229 and ended at 545, 1348, 545, 1233
and 1118. No two shared an edge, and the misses were small — 115px between two left edges, 9px
between two labels.

That is the mechanism behind "jumbled". A large offset reads as intent. A 9px offset reads as a
mistake, and several of them read as an accident.

Every plate is now flush to one of two rails:

- **left rail** — grid column 1
- **right rail** — grid column 13

Nothing starts at column 2, 3, 5 or 7 any more. Width comes from a declared ladder of column
spans, so a difference in width is a step rather than a near-miss. Proportion comes from the
photograph: a landscape frame takes a landscape plate.

Vertical offset was eleven ad-hoc margins (12rem, 7rem, -2rem, 9rem on the world wall; 14, 3, 16,
10, 20, 12, 22rem across the Black & White collection). It is now `row-gap` plus two tokens:

```css
--drop: clamp(3rem, 6vw, 7rem);
--drop-deep: clamp(6rem, 10vw, 11rem);
```

Two plates in a row cannot drift out of line the way independent margins could.

Surfaces on the rails: `.worlds-sequence`, `.closing-photos`, `.monochrome-room`,
`.bw-sequence`, `.encounter-sequence`, `.people-deeper-grid`, `.destination-sequence`.

## The plate rule

A category label used to belong to its photograph by proximity alone, and proximity is what the
old offsets destroyed: at 1440 the world wall's "PEOPLE" label sat in open black with a beach
above-right of it and a jungle below-right, touching neither.

Every plate now carries a hairline rule **exactly as wide as the plate**, with the label or caption
beneath it. Two identical measurements are a relationship the eye reads without being told. On
hover or keyboard focus the rule and the folio turn ultramarine together, so the plate and its
label respond as one object.

Applied to: world labels, closing-sequence captions, encounter captions, Black & White captions,
People captions, destination-chapter captions.

## The folio

Every ordinal on the site was set at .64rem in `--ultramarine`. Three problems compounded:

1. Ultramarine is declared in `global.css` as an interaction cue and nothing else, so a static
   number wearing it read as a link that could not be clicked.
2. At .64rem in the UI face, the glyphs are below the size at which type reads as type. What the
   eye registered was a small blue dot, not a number.
3. On the obsidian ground the pair measured **2.96:1** — under 4.5:1, so the orientation the
   ordinals were meant to provide was the hardest thing on the page to read.

`.folio` replaces all of them: Barlow Condensed (the face of the headings it indexes), tabular
figures so a column of ordinals aligns down the page, .14em tracking, .82rem. Ink comes from
`--folio-ink`, declared once per ground — **6.15:1** on obsidian, **4.63:1** on ivory. It turns
ultramarine only while the thing it belongs to is hovered or focused.

## The Ocean duplicate

Home presented Ocean twice, and the second time was at the very end.

- The world wall showed `ocean-current` — churning cobalt water, no subject.
- Four sections later, `.ocean-chapter` showed `ocean-silhouettes` full-bleed at
  `object-position: 50% 38%`, a crop that cut the two silhouetted figures out of the frame
  entirely and left a screen of churning cobalt water.

Both frames are from the same crossing. The crop is what turned the second photograph into the
first one, under the same word ("Ocean") and almost the same line of copy ("Scale. Distance.
Perpetual motion." / "Scale, movement, distance.").

`ocean-silhouettes` is now the wall's closing plate at 4:5 with `object-position: 50% 100%`, which
keeps its figures. The redundant full-bleed section is deleted. `ocean-current` retires from Home.
Home now ends on the story feature and the closing sequence.

## Also corrected

Home's destination deck read "Three chapters are open" while the list beneath it printed four
`chapter open` rows — Düsseldorf opened after the sentence was written. The count is now derived
from the same data the list is built from.

## Verification

`npm run build` passes: content, exclusions (35 rejected photographs, 0 public references),
licensing, and launch validation (26 public HTML files, 0 broken internal links, 0 broken public
assets).

Rendered QA at 320, 390, 1024, 1440 and 1920: zero horizontal overflow, zero broken images, zero
console errors, rail conformance confirmed on every grouped surface, and every caption rule
measured equal to its plate.


---

# Phase 16X.2 — the exhibition master pass

The first pass fixed the horizontal scatter. Measured again at 1728 it had three faults left, all of
them structural rather than cosmetic.

## What the second measurement found

| | |
|---|---|
| Wall, row 3 | Ocean alone: 929px of photograph against 688px of empty black — a row 43% unoccupied — and 1161px tall, taller than a 1080 screen |
| Ending, row 2 | the last photograph alone, 688px of empty ivory beside it; Home finished on a hole |
| B&W, row 2 | `distance` alone at 40% fill, 964px of empty black |
| Wall, row 1 | the two labels 224px apart vertically (913 and 689), because each hung under its own plate — so a "pair" never read as a pair |
| Wall header | "WHAT REMAINS." at x=332 of a 1348px field — the largest type in the section, on no rail, directly above plates flush to column 1 and column 13 |

## The three structural changes

**The wall is a spread over a suite.** Two rows, both rail to rail, no orphan:

    row 1   People 5 columns · a book gutter · Beaches 6 columns
    row 2   Urban · Jungle · Ocean — three 4-column plates, tight gutters

The tallest plate is 817px at 1728, which fits a screen. The section fell from 3600px to 1850px.
Three portrait frames of similar character hung identically is the oldest way there is of saying
*these belong together*, and the asymmetric spread above it keeps the section from reading as a grid.

**The label leads the plate.** A category index should name the door before it shows what is behind
it. The rule opens the block at the exact width of the photograph, the chapter mark and the category
sit on one line, the deck follows, then the picture. Because the labels now open each card rather
than close it, the two names in a row land on one line by construction — measured identical at 1728,
1440 and 1024 — rather than by luck. It is also the right source order for a screen reader and a
keyboard user: heading, description, then the image it opens.

**The ending is a graduated suite on a common floor.** One row, rail to rail, three plates at three,
four and five columns, bottom-aligned so the captions land on a single line. The sequence rises —
210, 323 and 681px tall at 1440 — and stops on its largest frame at the right rail; the footer's
full-width statement takes it from there. Below 1200px the suite squares up to three equal plates,
because a three-column plate falls to about 220px there and the smallest photograph starts to look
starved rather than quiet.

## The folio, second version

`01 —— PEOPLE`. The numeral is set immediately before the title it indexes and joined to it by a
short rule, so it reads as one typographic unit — the section-opener idiom of a printed monograph —
instead of a number parked three centimetres away in a margin. The margin form survives only where a
folio genuinely indexes a list. The entry arrow moved from the far end of the rule, 700px from the
word it belonged to, onto the title's cap line beside it, and is measured off the title's own size so
the optical relationship holds at every width the heading clamps through.

## Also in this pass

- **Black & White reads as facing spreads.** Rows are stated rather than inferred, so each spread is
  a decision: the man in the doorway faces the boat under the enormous sky, the city weather faces
  the smile in the mirror, the hand reaching for the sun faces the figure looking up. Spread gutters
  alternate one and two columns.
- **The collection's closing work hangs alone with its label beside it** — the caption bottom-aligned
  to the foot of the photograph, at a distance, under its own rule. This is the one declared
  exception in the system, and it exists only above 1100px, where the void it replaces exists.
- **The section threshold sits on the rails it introduces.** Kicker and headline open on the left
  rail, the deck closes on the right — the header grammar `.people-deeper` already used.

## Deliberately not changed

- **The drop under Beaches.** A 4:3 landscape hung from the same top rail as a 4:5 portrait ends
  186px higher at 1440. Equalising them means cropping a horizon photograph toward square, which is
  damaging a photograph to serve a layout. Two works on a common top rail with different drops is
  how a wall is hung.
- **The monochrome room's sticky text rail.** It looks emptier than the wall in a static full-section
  capture, but the copy travels beside the plates while scrolling. It is deliberately a different
  grammar; making all four Home collection surfaces share one would flatten the publication.
