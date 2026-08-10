# Phase 9.2 — Global curation report

## Method

The complete public archive was rendered as eighteen labelled contact sheets — every public frame,
with its catalog index, destination and existing classification — and reviewed frame by frame.
Every editorial decision below comes from looking at photographs. Nothing was inferred from
filename, capture date, folder, or colour statistics.

Two measurements were made mechanically because they are facts rather than judgements: per-pixel
channel spread to identify true greyscale, and rendered frame width to measure scale rhythm.

## The usage map, and what was harmful

A photograph appearing in Home's teaser and again inside its own destination is expected. A
photograph appearing deep in the archive is not duplication. What was harmful was **repeated
prominent exposure**, and there was a great deal of it.

| Photograph | Appeared as | Verdict | Resolved |
| --- | --- | --- | --- |
| `P1230676` Japan, figures above churning water | Home's Ocean chapter (full-bleed) · Japan chapter hero · Japan index card | **HARMFUL** ×3 | Home keeps it; Japan re-cut around it |
| `P1230481` Tokyo street | Home's Urban world card · Studio · Licensing | **HARMFUL** ×3 | Home keeps it; Studio and Licensing re-shot from the archive |
| `P1270203` La Réunion cirque | Home's environment section · Studio hero · About | **HARMFUL** ×3 | Home keeps it; Studio and About re-shot |
| Japan's other 10 chapter frames | Chapter · Home or Black & White | **HARMFUL** | Chapter re-cut; zero overlap remains |
| `IMG_6647` storm beach | Home's Beaches card · Studio | ACCEPTABLE | Studio re-shot anyway |
| `P1230972` shell in hand | Home's detail pause · About | ACCEPTABLE | Kept |
| Home teasers appearing inside the archive | Home · Archive depth | EXPECTED | Kept |

The rule this restores: **Home teases, deeper pages reveal.** Every one of the 45 photographs across
the three destination chapters is now new to a visitor who has read the homepage.

## Frames withdrawn

63 photographs moved to `editorial-hold` — a reversible, documented state that is deliberately not
the owner's rejection register.

**43 private-social.** Posed portraits of travelling companions, group photographs with drinks on a
night beach, a friends' beach workout, a fashion-style shoot in an orange dress with five
near-identical frames. Recognisable private individuals, no model releases, and — the editorial
point — not observed encounters. The owner has already rejected exactly this category of photograph
by hand in an earlier phase; these are the ones that survived.

**16 accommodation-record.** One hostel: `DORM ROOM sleep well like cat`, `PLEASE DON'T WALK LIKE AN
ELEPHANT`, `WELCOME TO CAPTAINS LONGHOUSE`, the lounge rug, the covered walkway. This is a record of
a stay. The beach and sea frames from the same place stayed public.

**4 near-duplicate.** Three near-identical hands reaching at the same sunset; one duplicate portrait
behind glass. One of each kept.

Every one of these can be restored by deleting a line from `editorialHold[]` and rebuilding.

## Frames introduced

**Japan, 17 new chapter frames** — Dōtonbori at dusk, a back street with the sun through it, a
graffiti lane, a wet stone alley, a temple corridor, bands of light on a dark floor, a torii above
stone stairs, bamboo, three people in a round *tarai-bune*, a ridge path above the sea, two in a
boat, a man on black rock, a festival performer, a lighthouse in orange flowers, a sea stack, and a
monochrome shrine on a shingle shore to close.

**La Réunion, 14 new chapter frames** — the cirque under cloud, ridges, a ravine, a stair into mist,
a dim forest, a river over black rock, a white dormer in a red roof, a monochrome church spire, an
abandoned house, the moon over a wave, figures on concrete blocks in a green sea, the breakwater
lighthouse, a wave folding on rock, and a surfer on a pale shoreline to close.

**People, 6 new frames** — a dancer mid-step in a straw hat, two women working over pans, a man with
a cigarette in a doorway, a woman at a table under a red rug, a man drinking from a fountain, a
woman against black rock. Four countries, none used elsewhere.

**Studio, 4 new frames** and **Licensing** and **About**, one each — all from the archive, none
shared with Home.

## Black & White

Twelve measured-monochrome frames were missing from a collection that described itself as *the*
monochrome body of work. It now holds 48. The curated Black & White edit was reviewed image by
image and **not changed**: every featured frame still earns its place, and no clearly stronger
approved frame exists. Changing it for novelty would have been the wrong call.

Essaouira still contributes **zero** frames to Black & White. Phase 9.1 measured its four
monochrome-looking frames at a channel spread of 32–102 — low-saturation colour, not greyscale.
That remains the truthful answer.

## Home

Deliberately small. The homepage is strong and was protected.

| Change | Class | Why |
| --- | --- | --- |
| Destination list now derives from the data | **MUST CHANGE** | A hardcoded array had silently omitted Essaouira from Home for all of Phase 9.1. Two of three open chapters were invisible. |
| Destination list copy rewritten | **MUST CHANGE** | It read "Assignments come from the owner's travel timeline; transition days remain outside the destination edit until reviewed" — internal curation process on the homepage. |
| Every listed place is now a link | **MUST CHANGE** | Places with real counts led nowhere. |
| Five world cards now open the archive filtered to that world | **STRONG IMPROVEMENT** | They scrolled to other parts of Home; two of them to sections about something else. |
| "Visual journal" kicker → "From the archive" | **STRONG IMPROVEMENT** | It named a section of the publication that does not exist. |
| Top-of-hero graduated darkening | **MUST CHANGE** | Header legibility — see the UX report. |
| Hero photograph, hero title, People composition, section order, premise, ocean chapter, closing sequence | **DO NOT TOUCH** | Reviewed and left alone. |

## Archive

- Three worlds that Home advertised — People, Beaches, Jungle — did not exist as archive filters
  because they held 3, 7 and 5 frames against an eight-frame publication threshold. All five now
  clear it honestly, on the strength of the review rather than by lowering the threshold.
- The masthead count no longer contradicts the progress row when a filter is applied.
- `?world=` now works as an entry point, and activates the matching control so the visitor can see
  why they are looking at a subset.
