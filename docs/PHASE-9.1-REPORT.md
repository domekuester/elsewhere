# Phase 9.1 — Essaouira / Morocco integration

A recovered archive of 48 photographs became a published chapter. Nothing was invented, no Morocco
cliché was projected onto the work, and no protected system was redesigned.

## What happened

`assets-source/photos/Marocco 2` — the only Morocco folder present — held 48 JPEGs from a Panasonic
DMC-FZ330, captured 8–14 January 2026, with no GPS, no duplicates against the existing 588 records,
and no corrupt files. They were ingested as photo-0589 … photo-0636 without renumbering anything.

47 are published (one burst near-duplicate held), 14 form the chapter at
`/destinations/essaouira/`, and all 47 are browsable at `/archive/?destination=essaouira`.

## The chapter

Hero: **P1330989** — gulls on an ochre parapet, one shadow thrown hard onto the sunlit wall. It won
because the picture is the *shadow*, which makes it observed rather than touristic, and because its
dark lower-left holds the title inside the photograph.

Thirteen frames follow, sequenced as a photo book rather than a grid: arrival, geometry, a hard edge
of razor wire, wit, texture, a courtyard open to cloud as the central breath, shadow, the Atlantic,
scale, presence, light, evening, and a sky of scattered birds to close.

Fourteen is where adding another photograph began weakening the ones already there. Seven dusk
rooftops became two, four cats became one, three beach-rider frames became one.

The camels and the ramparts are in the archive because they were photographed, not because Essaouira
is expected to contain them — and neither leads the chapter.

## The interesting problems

**Ingestion would have destroyed the Black & White archive.** The ingestion script hardcoded
`categories: ['black-and-white-candidate']` plus the exact Phase 7 note that the catalog builder
reads as a confirmed monochrome review. Run unchanged, all 48 colour photographs would have entered
the monochrome archive — 36 frames becoming 84, with colour leaking through a body of work Phase 8.35
built specifically to be pure. Ingestion now records what a file *is* and never what a photograph
*means*.

**Four frames looked monochrome and were not.** Per-pixel channel analysis put their 99th-percentile
channel spread at 32–102, where a true greyscale conversion is 0. They are low-saturation colour.
Black & White gains **nothing** from Essaouira, and stays at 36. That is the truthful answer, not a
missed opportunity.

**Reusing the Japan architecture exposed two real defects in it.** The sequence role `is-portrait`
collided with the orientation class of the same name, so every portrait photograph in every chapter
silently took the narrow right-hand slot regardless of its role. And a landscape compensation rule
resolved to `grid-column: 9 / span 6` on a 12-column grid, creating implicit tracks that shrank every
frame on the page. Both are fixed, both improve Japan: its frames moved from 30–54% to 38–62% of the
viewport and its page shortened from 9989px to 8387px — the same photographs at the size the layout
always intended.

**Mobile was a feed.** Every frame rendered at the same 79% width. It now varies across six widths
from 59% to full-bleed, with two deliberate full-bleed moments.

**Destination publication was hardcoded to Japan**, and the destination photo filter accepted only
timeline-confirmed geography — which would have silently dropped every owner-confirmed Essaouira
frame, since this trip falls outside the owner travel timeline. Both were generalised rather than
special-cased.

## Counts

| | Before | After |
| --- | --- | --- |
| Inventory records | 588 | **636** |
| Public photographs | 485 | **532** |
| Essaouira public | — | **47** |
| Essaouira curated | — | **14** |
| Black & white public | 36 | **36** |
| Japan public | 216 | **216** |
| Image sitemap entries | 532 | **626** |
| Owner-rejected public references | 0 | **0** |

## Rights

Conservative throughout. 34 frames `ENQUIRY_ONLY`, 14 `RELEASE_REQUIRED` (any human presence,
including distant and silhouetted figures), **0 commercially cleared**. Every published frame reads
`licensing: enquiry`, which offers a conversation and promises nothing.

## Compared with Japan

**Stronger in:** colour and light range; graphic invention; variety of subject; a more distinctive
single image (the courtyard); a hero with a better title relationship; mobile art direction.

**Weaker in:** depth behind the edit (47 photographs against 216); no monochrome dimension; no
written voice, since no owner story exists yet.

**Equal in:** sequencing craft, image fidelity, viewer integration, technical correctness, brand fit.

Essaouira is not materially weaker overall. It is a shorter chapter that knows it is short, which is
why it ends on its largest frame rather than trailing off.

## Scorecard

| | |
| --- | --- |
| Photographic edit | 86 |
| Hero | 88 |
| Editorial sequence | 87 |
| Destination index integration | 88 |
| UI craft | 85 |
| UX | 86 |
| Typography | 88 |
| Mobile art direction | 84 |
| Desktop art direction | 86 |
| Image fidelity | 90 |
| Viewer integration | 92 |
| B&W integration | 95 (correctly zero) |
| People integration | 72 (candidates recorded, no placement made) |
| Motion / interaction | 82 |
| Accessibility | 88 |
| Performance | 90 |
| SEO / discovery | 89 |
| Brand fit | 91 |
| Emotional impact | 82 |
| Perceived professional value | 88 |

People scores lowest deliberately: three genuine candidates were identified and none was placed,
because promoting a stranger's direct-gaze portrait is an owner decision, not an agent's.

## Waiting on you

1. **Confirm or swap the hero** — three real alternatives, each with its reason for losing.
2. **The direct portrait (P1330174)** — a recognisable stranger, no release. Published in the archive,
   featured nowhere. Keep, promote, or withdraw.
3. **Five questions about the place** — the chapter is carried entirely by photographs. A few honest
   sentences would give it a voice and unlock a Field Note.

Details in [PHASE-9.1-ESSAOUIRA-CURATION-SHORTLIST.md](PHASE-9.1-ESSAOUIRA-CURATION-SHORTLIST.md)
and [PHASE-9.1-ESSAOUIRA-OWNER-STORY-QUESTIONS.md](PHASE-9.1-ESSAOUIRA-OWNER-STORY-QUESTIONS.md).

## Documents

| Document | Contents |
| --- | --- |
| [Ingestion](PHASE-9.1-MOROCCO-INGESTION.md) | Folder discovery, inventory, duplicate checks, records, geography, architecture |
| [Curation](PHASE-9.1-ESSAOUIRA-CURATION.md) | The edit, the sequence, the design work, what was deliberately not done |
| [Shortlist](PHASE-9.1-ESSAOUIRA-CURATION-SHORTLIST.md) | Owner decisions only |
| [Story questions](PHASE-9.1-ESSAOUIRA-OWNER-STORY-QUESTIONS.md) | Five questions |
| [QA](PHASE-9.1-ESSAOUIRA-QA.md) | Everything verified, and the six defects fixed |
