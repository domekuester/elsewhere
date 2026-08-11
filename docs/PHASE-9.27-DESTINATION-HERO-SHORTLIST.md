# Phase 9.27 — destination hero shortlist

Owner-readable. One block per destination: what opens it now, what it was tested against, and why.

Scores are 0–100 and are not averaged into the decision — they record how a frame behaved in the real
hero layout. A high score does not win a chapter; it explains a choice made by eye.

---

## JAPAN — KEPT

**Selected:** `photo-0372` · P1260490.jpg · a canal running between walls of signage in the last light
**Status:** KEPT — no change
**Owner approval:** PENDING (`AUTO_SELECTED`)

Reviewed against all 204 eligible Japan frames. Nothing else in the chapter does what this does at
full viewport: the canal pulls the eye from the lower-left title straight into the depth of the frame,
the signage gives the top half density without noise, and the last light keeps the whole thing warm
rather than neon. It is also the benchmark the rest of the site is being measured against, and it
survived the comparison.

| Alternative | Why it lost |
| --- | --- |
| `photo-0375` — the same canal at dusk, cooler | Weaker foreground; the walkway that leads into the frame is lost in shadow |
| `photo-0373` — canal with more sky | More sky is less Japan here; the density is the subject |
| `photo-0355` — castle above a formal avenue | A landmark rather than a place; reads as a postcard at this scale |

Photo impact 96 · desktop 95 · tablet 93 · mobile 94 · typography 95 · fidelity 92 · destination fit 96
· brand fit 96 · **final 95**

---

## LA RÉUNION — KEPT

**Selected:** `photo-0442` · P1270181.jpg · cloud gathering over the ridges of an eroded cirque
**Status:** KEPT — mobile focal corrected from `48% 50%` to `46% 46%`
**Owner approval:** PENDING (`AUTO_SELECTED`)

Reviewed against all 101 eligible frames. The island's own scale is the subject and this is the frame
that carries it; the cloud mass gives the upper half weight while the dark vegetation at the bottom
takes the title without a heavy scrim. The mobile focal was raised so the horizon stays above the
title band instead of colliding with it.

| Alternative | Why it lost |
| --- | --- |
| `photo-0453` — sunlit ridges under cloud | Beautiful, but the light is spread evenly; nothing anchors the lower-left |
| `photo-0482` — moon over a breaking wave | Superb frame, wrong job: too quiet to open a chapter about a mountain island |
| `photo-0470` — cloud bank over a peak, blue | Reads close to Düsseldorf's blue at wall scale |

Photo impact 94 · desktop 94 · tablet 92 · mobile 91 · typography 93 · fidelity 93 · destination fit 95
· brand fit 94 · **final 93**

---

## ESSAOUIRA — KEPT, mobile re-framed

**Selected:** `photo-0609` · P1330989.jpg · gulls on an ochre parapet, one casting a hard shadow
**Status:** KEPT — mobile focal moved from `48% 50%` to `36% 50%`; bottom scrim raised to .80
**Owner approval:** PENDING (`AUTO_SELECTED`)

Reviewed against all 47 eligible frames. This is the most distinctive opening in the chapter: light,
wall, bird, and the shadow doing the work. **The defect was the phone.** At 390px the old centre crop
cut the gulls out and left a vertical panel of blank wall — the photograph's subject was missing from
the view most visitors get. Moving the focal left restores the perched gull at the top and keeps the
shadow at the centre. The title sits on a sunlit wall rather than shadow, so the bottom scrim is
carried a little further.

| Alternative | Why it lost |
| --- | --- |
| `photo-0623` — rooftops at golden hour | Wide and handsome, but a townscape; the wall frame is the one people remember |
| `photo-0605` — camels along the beach | Closest to tourism shorthand in the chapter |
| `photo-0628` — a courtyard opening onto sky | Very graphic; too abstract to name a place |

Photo impact 93 · desktop 94 · tablet 93 · mobile 88 (was 71) · typography 92 · fidelity 94 ·
destination fit 92 · brand fit 95 · **final 92**

---

## DÜSSELDORF — KEPT, title corrected

**Selected:** `photo-0656` · P1350974.jpg · red cables running from a white bridge pylon into blue
**Status:** KEPT — title scaled to 0.94; bottom scrim raised to .78 and started at 48%
**Owner approval:** PENDING (`AUTO_SELECTED`)

Reviewed against all 22 eligible frames — the smallest pool on the site, and it still wins clearly.
The image is almost a diagram: three colours, hard geometry, and enough empty blue at the lower left
for the longest name on the site. That name was the problem: at 390px "Düsseldorf" measured the full
text column with no margin. A 6% title correction gives it 60px of air at 430 and 35px at 320 without
making the type look small.

| Alternative | Why it lost |
| --- | --- |
| `photo-0654` — a pale curved wall against teal, moon above | The best negative space in the chapter, but quiet; held as the strongest swap if the owner wants calmer |
| `photo-0646` — tower and river at sunset | The expected Düsseldorf picture; the bridge frame is the better photograph |
| `photo-0641` — geese crossing a bright sky | Too light for a title in white |

Photo impact 92 · desktop 93 · tablet 91 · mobile 92 · typography 90 (was 84) · fidelity 90 ·
destination fit 91 · brand fit 93 · **final 91**

---

# Provisional — chapters that are not open

These have no public page. The heroes below are recorded in `data/destinations.json` as
`PROVISIONAL_NOT_PUBLISHED` so that the choice is waiting when each chapter is curated; no derivative
is generated and nothing is published. **Not owner-reviewed, and one notch less rigorous than the
four above** — a single contact-sheet pass, no full-viewport render.

## MALAYSIA — replacement recommended

**Current `heroPhotoId`:** `photo-0036` — **fails the fidelity floor at 2048 × 1536**, an iPhone 12
mini file that cannot fill a 1440px viewport, let alone a retina one.
**Provisional:** `photo-0122` · P1210749.jpg · a cove with a headland and clear water, 4000 × 2672.

Alternatives: `photo-0163` (headland, jetty and a large cloud, 3937px) and `photo-0060` (a city
skyline above a tree canopy, 4000px — the city counterpart, and the more unusual frame, but Japan
already opens on a city). Against Story 01, the island is the chapter's emotional centre and Kuala
Lumpur its movement, so the island opens it. Note that `photo-0122` is not confirmed as Pulau Kapas —
see `docs/STORY-01-MALAYSIA-PACK.md`; it may open the chapter, but it may not be captioned.

## THAILAND — provisional

`photo-0005` · a red pier running into an orange sunset, 2671 × 3998. Alternatives: `photo-0002`
(a stone head held in tree roots — more specific to the country, less strong at full bleed) and
`photo-0043` (an orange cloud above a temple spire).

## PHU QUOC — provisional

`photo-0009` · a figure rowing a boat, high-key and pale, 2672 × 4000. It would be the only bright
opening on the site, which the set needs. Alternatives: `photo-0072` (a jetty into yellow light),
`photo-0012` (dark graphic steps). Public title stays **PHU QUOC** with **Vietnam** as secondary
context — the existing `parentDestination` hierarchy already says so, and nothing here changes it.

## LAOS — blocked, owner review

**No provisional hero selected.** Laos holds three publication-eligible photographs. Two are
monochrome market frames and the third shows children in a doorway. `validate-content.mjs` requires
five confirmed photographs before a destination may publish, so Laos cannot open regardless of hero
choice, and the strongest single frame (`photo-0537`, a close portrait of an identifiable woman)
raises a consent question that outranks its quality. This is a **source limitation**, reported rather
than papered over.
