# Phase 9.1 — The Essaouira chapter

The editorial reasoning behind the chapter, and the design work it required.

## Reading the archive first

All 48 photographs were reviewed as a body of work before any role was assigned. What is actually
present, counted rather than assumed:

- **Medina architecture and geometry** — lanes, arches, walls meeting sky, courtyards. The largest group.
- **Rooftops at dusk** — seven frames. The single biggest redundancy risk in the set.
- **The Atlantic** — a working fishing boat, rock and surf, gulls over water.
- **The beach** — riders, camels, surfers walking, all observed at distance.
- **Cats** — four frames. Genuinely charming, but four is a motif, not a chapter.
- **Street and market** — crowds, a stall, one direct portrait.
- **Birds** — a recurring presence rather than a subject: on parapets, masts, across dusk skies.

No souk interior, no blue doors, no fortress interiors, no staged craft. Nothing was classified that
is not visible in the frame, and no Morocco cliché was projected onto the set. The camels and the
ramparts are in the archive because they were photographed, not because Essaouira is expected to
contain them — and neither leads the chapter.

## The hero

**P1330989** (photo-0609) — gulls along an ochre parapet, one casting a hard shadow onto the sunlit
wall, deep blue above.

It won on the criteria that matter for this slot: it is landscape, so it holds a full-bleed opening;
its lower left falls into shadow, so the title sits in the photograph rather than on top of it; the
warm wall against blue carries the place without describing it; and the picture is the *shadow*,
which makes it observed rather than touristic. It also contrasts sharply with Japan's cold blue hero
on the destinations index.

Three genuine alternatives are recorded in the shortlist for the owner. They lost for specific
reasons, not by a small margin — see [PHASE-9.1-ESSAOUIRA-CURATION-SHORTLIST.md](PHASE-9.1-ESSAOUIRA-CURATION-SHORTLIST.md).

## The sequence

Fourteen frames including the hero. Not a target — the point at which adding another photograph
started weakening the ones already there. The seven dusk rooftops became two; the four cats became
one; the three beach-rider frames became one.

| | Frame | Beat |
| --- | --- | --- |
| Hero | P1330989 | Arrival — wall, bird, shadow |
| 01 | P1330200 | Entering: a lane closing on an arch |
| 02 | P1350375 | Geometry: two corners against blue |
| 03 | P1340012 | The edge: razor wire on an orange wall |
| 04 | P1350409 | Wit: a cat, a bird, and nothing else |
| 05 | P1340602 | Texture: bicycle, battered door, cat beneath |
| 06 | P1350244 | **The breath** — a courtyard open to cloud |
| 07 | P1340187 | Shadow: a vaulted passage |
| 08 | P1330742 | The Atlantic, quietly: a boat and its birds |
| 09 | P1340662 | Scale: rock, surf, one small figure |
| 10 | P1330959 | Presence: surfers crossing the sand |
| 11 | P1330816 | Light: a man and two camels in haze |
| 12 | P1350144 | Evening over the roofs |
| 13 | P1340866 | Closing: birds scattered across a dusk sky |

The chapter deliberately turns hard at 03 — razor wire on a wall, immediately after two clean
architectural frames. A chapter made only of beautiful surfaces would be a brochure. It then relaxes
into wit and texture before the courtyard, which is the quietest and strangest photograph in the set
and earns the middle of the sequence.

Every frame answers *why here*. P1350409 (cat, bird, blue) follows the razor wire because the set
needs air after it. P1330742 follows the passage because a dark interior should open onto water. The
closing frame is the only one with no architecture and no ground.

## Design work this required

The chapter reuses the Japan destination architecture rather than inventing a layout. Doing so
surfaced two real defects in that shared system, both fixed:

**1. Role and orientation class collision.** Sequence roles were emitted as `is-wide`, `is-portrait`,
`is-quiet`… alongside the orientation class `is-${photo.orientation}`. The role `is-portrait` and the
orientation `is-portrait` are the same token, so *every portrait photograph* silently took the narrow
right-hand slot regardless of its assigned role. Roles are now namespaced `is-seq-*`.

**2. Implicit grid tracks.** The landscape compensation rule resolved to `grid-column: 9 / span 6` on
a 12-column grid — columns 9 to 15. The grid created two implicit tracks, and every frame on the page
became narrower as a result. Placement rules now state explicit start and end columns and are paired
with orientation, so a landscape and a portrait frame in the same role get different, deliberate widths.

Both fixes improve Japan as well. Frame widths there moved from 30–54% to 38–62% of the viewport and
the page shortened from 9989px to 8387px: the same photographs, presented at the size the layout was
always meant to give them.

**3. A chapter that tapered.** The closing frame was smaller than the one before it, so the sequence
ended on a diminuendo. Any chapter's last frame now takes more width than its role would allow.

**4. Mobile monotony.** At 390px every frame rendered at the same 79% width — a feed, not an edit.
Widths now vary from 59% to full-bleed across six distinct values, with two deliberate full-bleed
moments: the anchor and the closing frame.

None of this introduced a new visual language. No new font, no Morocco palette, no new motion, no
library. The chapter's character comes from the photographs, their order, and their scale.

## Destinations index

With two published chapters, a list of text rows no longer did the work of an entrance. Open chapters
were lifted into a photographic layer of square plates; everything still being edited remains a quiet
typographic index beneath them. Ordering is by archive depth, which is the logic the index already
used, now derived from the data instead of a hardcoded array.

Square plates were chosen because Japan's hero is portrait and Essaouira's is landscape; a 4:3 card
cropped Japan's subjects off the bottom edge. The index reads better than it did before Essaouira
existed, which was the requirement.

## What was deliberately not done

**Home is unchanged.** Nothing in this set is stronger than what Home already carries, and the brief's
own rule applies: Home teases, deeper pages reveal. A visitor entering Essaouira meets 47 photographs
they have not seen.

**People is unchanged.** Three genuine People candidates were recorded (P1330174, P1330816, P1330959)
but the protected homepage composition was not touched. P1330174 is a direct-gaze portrait of an
identifiable stranger with no release; it belongs in the archive and in an owner decision, not in a
featured position chosen by an agent.

**Black & White gained nothing.** Four frames read as near-monochrome, but per-pixel channel analysis
shows all four are low-saturation colour, not greyscale conversions (99th-percentile channel spread
32–102, where a true conversion is 0). Adding them would have been a colour leak into an archive that
Phase 8.35 built specifically to be pure. The B&W count stays at 36.

**No Field Note was written.** The architecture exists; the writing needs the owner's memory of the
place, not an agent's research.

**No copy was invented.** The chapter carries one factual provenance line, computed from the data:
seven days, January, place confirmed by the photographer, dates taken from the photographs. There is
no invented memory, encounter, or atmosphere. The photographs carry the chapter, which is what the
brief asked for and what the archive can actually support.
