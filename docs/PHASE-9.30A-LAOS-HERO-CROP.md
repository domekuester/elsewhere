# Phase 9.30A — Laos hero focal correction

The owner kept `photo-0663` and rejected the crop. This pass changed the crop and nothing else.

## The defect

`photo-0663` is 2306 × 3074 — a portrait frame in a `100svh` band. `object-fit: cover` therefore
shows only a slice of the frame's height, and how large that slice is depends on the *viewport
height*, not the width:

| Hero box  | Share of the frame visible |
|-----------|----------------------------|
| 1920 × 800 | 31% |
| 1600 × 900 | 42% |
| 1440 × 900 | 47% |
| 1024 × 768 | 56% |
| 768 × 1024 | 100% (the frame is 4:3; nothing is cropped) |

The vertical focal decides which slice. Measured on the master, the composition sits at:

    monks' heads   38.5%      car roofline  47.7%
    shoulders      44.0%      number plate  65.7%
    bumper         73.2%      sandals       75.2%

At the previous `50% 62%` the window opened at 35.8% on a 1600 × 900 box — 2.7 points of clearance
above the heads — and at 38.2% on 1600 × 820, which is *below* the heads. That is why the desktop
hero beheaded the monks on shorter windows while looking acceptable on a tall one. It was never a
grade problem or a photograph problem.

## The correction

    focal.desktop   50% 62%  →  50% 50%
    focal.tablet    50% 60%  →  50% 54%
    focal.mobile    52% 58%  →  52% 52%
    overlay.bottom  0.76     →  0.62
    overlay.bottomStart 46%  →  54%

`50%` is the highest desktop value that never crowds the heads at any tested size. Rendered from
1920 × 800 down to 1024 × 640, the window opens between 21.9% and 34.4% of the frame — the heads
always have 13–30% of the hero height above them, and the car is always present from roofline to
number plate. The cost is the lower bumper valance and the sandals, which carry nothing; the gain is
the temple roofs, wires and sky that identify the street. Above `53%` the heads start touching the
header band on any window shorter than ~820px, so the value is bounded from above by the shortest
viewport, not by the prettiest one.

Horizontal focal is inert on desktop: a portrait source in a landscape box is scaled to fill the
width, so the whole frame width is always visible. On mobile the relationship inverts — the frame is
scaled to fill the height and about 62% of its width survives — so `52%` is a genuine horizontal
decision, and it is the value that keeps both monks whole while retaining the plate and the star.
The vertical part of the mobile value has no effect at phone aspect ratios and exists only for the
short-and-wide case.

The bottom scrim was cut because the title now lands on the black flank of the car, which already
provides the contrast. Measured against the actual pixels behind the ink, `LAOS` keeps a contrast
ratio between 13.9:1 and 19.5:1 at every tested size, so the extra 0.14 of darkness was only costing
the robes their presence.

## Not changed

The photograph, the master file, the hero derivatives, the grade (`null` — this hero has never been
graded), the title position and scale, the top scrim, and every other destination hero.

## QA

Rendered in the real `.destination-hero` box at 1920 × 800, 1600 × 900, 1600 × 820, 1440 × 900,
1440 × 789, 1280 × 800, 1280 × 720, 1100 × 740, 1024 × 768, 1024 × 640, 980 × 800, 900 × 700,
768 × 1024, 768 × 700, 430 × 932, 390 × 844, 375 × 812 and 320 × 568.

    BUILD:              PASS  (21 pages, 20 public HTML files)
    CONTENT:            PASS  (686 photos, 12 destinations)
    OWNER EXCLUSIONS:   PASS  (24 rejected, 0 public references)
    LAUNCH / SEO:       PASS
    CONSOLE / NETWORK:  clean across every rendered size
    HEADS:              visible with headroom at all 18 sizes
    MERCEDES:           roofline through number plate at all 18 sizes
    OTHER HEROES:       0 modified

Laos is `in-edit`, so `/destinations/laos/` does not build. QA rendered the published Japan chapter
and substituted the Laos photograph, focal variables, scrim and title into the live hero at runtime —
same markup, same CSS, same `100svh` box. Screenshots are local only and were not added to the repo.

The hero remains `AUTO_SELECTED`. Only the owner can make it `OWNER_APPROVED`.
