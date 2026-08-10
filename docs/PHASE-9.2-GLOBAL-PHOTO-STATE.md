# Phase 9.2 — Global photographic state

Every number here was recomputed from `docs/photo-inventory.json`, `data/photo-curation.json` and
the rebuilt `public/data/photo-catalog.json` after the Morocco import. No Phase 8 figure was carried
forward.

## Totals

| | |
| --- | --- |
| Source masters (`assets-source/photos/`) | **636** |
| Stable curation records | **636** |
| Public photographs | **469** |
| Owner-rejected (permanent, owner's word) | **24** |
| Duplicate-family exclusions | **80** |
| Editorial holds (Phase 9.2, reversible, awaiting owner) | **63** |
| Public-eligible but withheld for any reason | **167** |

469 + 167 = 636. Nothing is unaccounted for.

Public photographs fell from 532 to 469 in this phase. That is the intended direction: the work
removed is holiday documentation, not photography.

## Withholding, by kind

Three states withhold a photograph, and they are deliberately separate so that reversing one never
touches another.

| State | Count | Who may change it |
| --- | --- | --- |
| `do-not-publish` | 24 | **Owner only.** Permanent unless the owner reverses it. |
| duplicate family | 80 | Curation; the kept frame stays public. |
| `editorial-hold` | 63 | **Agent proposal awaiting owner confirmation.** |

### The 63 editorial holds

| Reason | Count | What it is |
| --- | --- | --- |
| `private-social` | 43 | Posed or social photographs of travelling companions — recognisable private individuals, no model release, not observed encounters. |
| `accommodation-record` | 16 | One Malaysian hostel: dormitory signage, lounge, grounds. Documentation of a stay, not a photograph of a place. |
| `near-duplicate` | 4 | Frames near-identical to a stronger public one. |

Full per-frame register with reasons: `editorialHold[]` in
[data/public-image-exclusions.json](../data/public-image-exclusions.json).

## Classification coverage

The whole public archive was reviewed frame by frame from eighteen labelled contact sheets. Nothing
below was inferred from filename, capture date, or colour statistics.

| World | Frames | Status |
| --- | --- | --- |
| Urban | 148 | Published filter |
| Ocean | 121 | Published filter |
| People | 77 | Published filter |
| Black & White | 48 | Published filter and dedicated archive |
| Beaches | 32 | Published filter |
| Jungle | 27 | Published filter |
| Detail | 1 | Not exposed; below threshold, deliberately |
| No world assigned | 110 | Honest absence — light studies, flowers, abstractions, interiors |

Before this phase: 435 of 532 public frames carried no world, and three of the five worlds Home
advertised held fewer than eight frames, so the archive did not publish them as filters at all.
Home offered five ways in; the archive could honour two.

All five worlds Home names now clear the eight-frame publication threshold. `src/pages/index.astro`
throws at build time if one of them ever stops clearing it.

## Monochrome

Colour mode was **measured**, not judged: 99th-percentile per-pixel channel spread across a 128px
sample. A true greyscale conversion reads 0; low-saturation colour does not.

| | Before | After |
| --- | --- | --- |
| Frames in the Black & White archive | 36 | **48** |

Twelve genuinely monochrome photographs — nine Japan, three La Réunion, one Malaysia — were
measured at a channel spread of ≤4 and had never been added to the monochrome archive. The
Black & White collection was understating itself by a quarter.

A second defect was found and fixed while doing this: the catalog builder *substituted* curation
worlds for the Phase 7 monochrome marker instead of merging them, so adding any world to a
monochrome frame silently evicted it from the monochrome archive. Twelve frames were lost this way
in the first attempt before the merge was corrected.

## People

| | |
| --- | --- |
| Frames classified as being *about* a person | **77** |
| Frames with a person visible somewhere | higher, and deliberately not the same number |

A human in the background does not make a People photograph. The 77 are frames where a person is
the subject.

## By destination

| Destination | Public | Chapter | Status |
| --- | --- | --- | --- |
| Japan | 204 | 17 frames | Open chapter |
| La Réunion | 101 | 14 frames | **Open chapter (new in 9.2)** |
| Malaysia | 53 | — | Archive only |
| Essaouira, Morocco | 47 | 14 frames | Open chapter |
| Thailand | 32 | — | Archive only |
| Phu Quoc, Vietnam | 18 | — | Archive only |
| Laos | 3 | — | Archive only |
| Unassigned | 11 | — | Archive only |

Counts are now derived from the public catalog inside `scripts/build-photo-catalog.mjs`, and the
build fails if a chapter sequences a frame that is no longer public. Before this phase they were
stored independently and had drifted: the destinations index displayed 216 Japan photographs beside
a link to an archive filter that returned a different number.

## Rights

Unchanged in substance and deliberately conservative. All 469 public photographs read
`licensing: enquiry`. **Zero** claim commercial clearance, because no rights review has happened.
`modelReleaseStatus`, `propertyReleaseStatus` and `rightsNotesInternal` do not appear in any public
artefact; two validators fail the build if that boundary is crossed.
