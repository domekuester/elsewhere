# Story 05 — Japan photographic edit

**PHOTO_SEQUENCE_VERSION: V3.1** (Phase 14.3 tarai-bune correction; V3 was Phase 14.2). V2 (Phase 14.1) and V1
(Phase 14) are both superseded — the current sequence is the one in the *Phase 14.2* section at the
end of this file, and the V2 table below is retained only as the record of how the edit got there.
**Status:** OWNER_REVIEW · **Selected:** 29 (1 hero + 28 in sequence) · **Source masters modified:** 0
**Story copy:** LOCKED. Verified byte-identical to the pre-14.1 prose (40 blocks, 9,961 characters,
sha256 `cf34a4087deef535…`). Only photo references, alt text and display modes changed.

---

## Why V2 exists

The owner approved the writing and rejected the picture edit. His diagnosis: the sequence leaned on
**place** where the Story is about **lived experience**, and he has stronger material than a generic
lighthouse, a repeated bridge, an isolated bird and several similar rocky coasts.

V2 is a rebuild, not a swap. **12 frames are new, 15 were dropped, 16 carried over** — and the ones
that carried over were re-tested against the Story rather than inherited.

## Owner-rejected in Phase 14.1 — Story 05 only

The owner supplied eleven visible archive numbers. These resolve 1:1 to stable photo IDs (the
archive index equals the ID number), and five of them are independently confirmed by the owner's own
descriptions in the brief — 195 "Hangiri", 212 "narrow historic alley", 264 "lighthouse", 277
"wooden urban/building", 289 "bird-over-water" — each of which matches the resolved master exactly.
Nothing was guessed.

| # | Stable ID | Source master | Capture | Was in V1 Story? | V1 role | Reason |
| --- | --- | --- | --- | --- | --- | --- |
| 195 | photo-0195 | P1230834.jpg | 16 May 2025 | no (people-held) | — | OWNER REJECTED FROM STORY EDIT |
| 212 | photo-0212 | P1240278.jpg | 22 May 2025 | **yes** | Shukunegi lane, `wide` | OWNER REJECTED FROM STORY EDIT |
| 229 | photo-0229 | P1240454.jpg | 23 May 2025 | **yes** | red bridge, `pair` left | OWNER REJECTED FROM STORY EDIT |
| 230 | photo-0230 | P1240460-Enhanced-NR.jpg | 23 May 2025 | **yes** | boats under shelter, `full` | OWNER REJECTED FROM STORY EDIT |
| 231 | photo-0231 | P1240551.jpg | 23 May 2025 | no | — | OWNER REJECTED FROM STORY EDIT |
| 232 | photo-0232 | P1240557.jpg | 23 May 2025 | no | — | OWNER REJECTED FROM STORY EDIT |
| 233 | photo-0233 | P1240560.jpg | 23 May 2025 | no | — | OWNER REJECTED FROM STORY EDIT |
| 260 | photo-0260 | P1240900.jpg | 29 May 2025 | no | — | OWNER REJECTED FROM STORY EDIT |
| 264 | photo-0264 | P1240944-Enhanced-NR.jpg | 29 May 2025 | **yes** | lighthouse, `pair` left | OWNER REJECTED FROM STORY EDIT |
| 277 | photo-0277 | P1250207.jpg | 7 Jun 2025 | no | — | OWNER REJECTED FROM STORY EDIT |
| 289 | photo-0289 | P1250536.jpg | 8 Jun 2025 | no | — | OWNER REJECTED FROM STORY EDIT |

**Four of the eleven were in the published V1 sequence; seven were not.** The owner appears to have
reviewed the archive presentation as well as the Story, so the other seven read as "do not use these
either". All eleven are treated identically.

**Scope — corrected in Phase 14.1A.** These were first recorded as a Story-05-only editorial
exclusion. The owner then corrected the scope: all eleven are **global public rejections**. They now
sit in `ownerRejected[]` (register 24 → 35), are `do-not-publish` / `PRIVATE` / `NOT_FOR_LICENSE` in
curation, have had all 33 public derivatives deleted, and appear on no public surface anywhere.
The rejection is version-scoped: it blocks the edited export, its derivatives and any renamed copy
of it, while the private original is preserved untouched for a future owner re-edit. Full detail in
`OWNER-PHOTO-EXCLUSIONS.md` → *Phase 14.1A*.

The V2 sequence below is unaffected: it never used any of the eleven, so the global rejection
required no change to the Story.

## No-derivative-workaround set

A rejected frame must not come back as a different file of the same moment. The Story-05 exclusion
set is content-based, not filename-based: rejected captures, plus their duplicate-family members,
plus every frame within four minutes of a rejected capture (burst neighbours), plus deliberate
motif substitutes.

- **Duplicate family:** photo-0211 (`P1240278-2.jpg`, the alternate derivative of rejected 0212).
- **Burst neighbours:** photo-0227, photo-0228 (same 06:39 red-bridge burst as 0229/0230);
  photo-0234; photo-0259, photo-0261, photo-0263, photo-0265, photo-0266 (same 09:01–09:12
  lighthouse-and-flowers run as 0260/0264).
- **Motif substitutes refused on principle:** photo-0262 (the same white lighthouse, six minutes
  later — the Story does not get a replacement lighthouse for the rejected one); photo-0287 (the
  other hawk frame); photo-0225, photo-0226 (the same coastal-garden walk as 0231/0232/0233);
  photo-0273, photo-0274, photo-0275, photo-0276 (the same 7 June village-signage session as 0277,
  and the substitute alley); photo-0205 (the same stone lantern as a kept frame, one minute apart).

Verified against the rendered page: **owner-rejected captures publicly used in Story 05: 0.
Same-capture or burst derivatives: 0. Motif substitutes: 0.**

## Archive search — done again from the filesystem

The search was not limited to the previous selection or to a stale manifest.

- **702 image files** on disk under `assets-source/photos/` were enumerated at execution time and
  reconciled against `docs/photo-inventory.json` (706 entries). **0 files on disk are missing from
  the inventory**, so no owner additions were waiting undiscovered.
- **250 masters** fall inside the trusted Japan window (12 May – 27 June 2025). **204** are public in
  the catalog; the other **46** are alternate derivatives already held by the duplicate register
  (`-2`, `-3`, `-Enhanced-NR` siblings) and were not reintroduced.
- All **204 public Japan frames** were re-reviewed as capture-ordered contact sheets, then the
  shortlist was re-examined in themed sheets at large size (Agui, interiors, craft, weather,
  transit, Tokyo, water/north). Nothing was selected from a filename.

## Three passes

**Pass 1 — recall.** All 204 public Japan frames, in capture order, no ranking.
**Pass 2 — story.** Every survivor had to earn a named role. Frames that were only pretty were cut:
the Ōno-game rock (0304, 0306), the fenced flower headlands (0280, 0297), the sea stack and plaque
(0311), the monument (0288), both bird frames (0253, 0254), the moon (0271), the pink departure sky
(0324, 0327) and the cloud bands (0335, 0336).
**Pass 3 — sequence.** Built against the locked text, then cut ~20% again: dropped photo-0237 and
photo-0272 (a second and third quiet interior/texture), photo-0346 (bamboo as filler before the bell
passage), photo-0186/0187 (the cairns), photo-0218 (the mikoshi) and photo-0375 (a second Dōtonbori
canal frame, too close to the Destination Japan hero).

## The hero — re-tested, unchanged

**`photo-0198` — three empty tarai-bune moored along a stone quay, low grey sky, 16 May 2025.**

The hero was not treated as protected. It was re-opened against the whole archive and kept, because
it passes the brief's own test better than anything else available: it is the work rather than the
scenery, it is Sado, it is quiet, it names no landmark, it is nothing like the Destination Japan
hero (`photo-0372`, the Osaka canal), and the owner did not reject it.

Alternatives re-tested and rejected: `photo-0203` (the black-and-white lantern in the surf — bolder,
but committing the opening to monochrome misdescribes a colour story, and it is already featured on
the Destination page); `photo-0201` (the hauled-out ship — better inside the sequence, where the
text explains it); `photo-0286` (the northern coast — exactly the "best Japan photograph" answer the
Journey is not supposed to give); `photo-0328` (the ferry doorway — too much of an ending to open
with, and it now closes the Sado act instead).

Hero focal `50% 62%` desktop / `50% 58%` mobile keeps all three boats and the quay inside the crop
band at both sizes; verified in the browser at 1440 and 390. Four derivative widths (768–2048; the
2560 rung is skipped because the master is 2507px wide) plus one 1200×630 social crop.

## The V2 sequence

Location confidence is `CONFIRMED_OWNER_RANGE` (country and journey) for every frame; the
sub-location column records how the finer placement was reached. Privacy class **INCIDENTAL** means
a human presence that is not identifiable and is not the subject. No frame carries a caption — every
image speaks through alt text, and the text supplies geography in the owner's own words.

| # | ID | Master | Date | Display | Role | Sub-location & basis | Privacy | Why it beats V1 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H | 0198 | P1230869.jpg | 16 May | hero | WORK | Sado — owner route + date | none | unchanged; re-tested and still the only frame that is the work itself |
| 1 | 0166 | P1230340.jpg | 13 May | wide | THRESHOLD | Tokyo — owner + date cluster | none | **new.** An old timber shop wedged between two modern blocks, directly under the line "whatever is left of another century between two office towers". Replaces 0165 (Skytree + truck), which was a skyline, not a sentence |
| 2 | 0168 | P1230352.jpg | 13 May | inset | TRANSIT / HUMAN | Tokyo — same cluster | INCIDENTAL (figure from behind, small) | kept: one person walking away is the only human note in the Tokyo act |
| 3 | 0178 | P1230535.jpg | 13 May | full | MOVEMENT | Tokyo — same cluster | none | kept: sun down a street with a cyclist — the day ending, not a monument |
| 4 | 0181 | P1230638.jpg | 15 May | pair L | TRANSIT / HUMAN | crossing — 15 May ferry cluster | INCIDENTAL (hand only) | **new.** A hand reaching past the rail over moving water. Replaces 0184 (a flag) with actual human presence, which is what the brief asked for |
| 5 | 0185 | P1230705.jpg | 15 May | pair R | TRANSIT | crossing — same cluster | INCIDENTAL (passenger, distant, back turned) | kept, and re-alted: the passenger at the far end is now acknowledged rather than described as empty |
| 6 | 0243 | P1240747.jpg | 28 May | inset | HOME | Sado — interior session | none | **new.** Light through a wooden balustrade, placed at the tatami-and-futon paragraph. Gives the reader interiority without claiming to be HANAYA (see below) |
| 7 | 0201 | P1230927.jpg | 20 May | wide | CRAFT | Sado, Shukunegi — shipbuilding site | none | **new.** A wooden ship hauled out under a flat grey sky. Opens "The boats" with craft and weather instead of the rejected red-bridge frame |
| 8 | 0223 | P1240385.jpg | 22 May | wide | PLACE / CRAFT | Sado, Shukunegi — same session | none | promoted from `inset` to `wide`: the ship-crest curtain now carries Shukunegi in place of the rejected alley, and says trade rather than scenery |
| 9 | 0216 | P1240332.jpg | 22 May | inset | CRAFT / DETAIL | Sado, Shukunegi — same session | none | **new.** Roped timber close up — the intimate craft frame the boat thread was missing |
| 10 | 0258 | P1240870.jpg | 29 May | wide | WATER | Sado — coast session | none | **new.** Turquoise into deep blue, seen straight down. Replaces the anemone (0256), which was the most processed frame in the set |
| 11 | 0224 | P1240390.jpg | 22 May | full | WEATHER | Sado — coast session | none | kept: the storm cloud, full bleed |
| 12 | 0203 | P1230935-2.jpg | 20 May | wide | WEATHER / HUMAN STRUCTURE | Sado — coast session | none | **new.** A stone lantern and two benches taking the surf. Owner's own monochrome master. The island being not friendly, with something human standing in it |
| 13 | 0202 | P1230928.jpg | 20 May | inset | WEATHER / QUIET | Sado — same session | none | kept: a seawall path to a shuttered building. Bleak, not pretty |
| 14 | 0200 | P1230916.jpg | 20 May | wide | MOVEMENT | Sado — coast path | none | kept: the racing bike |
| 15 | 0286 | P1250468.jpg | 8 Jun | full | MOVEMENT / PLACE | Sado, north — 8 Jun cluster | none | kept: the one big northern landscape, and it has the road in it |
| 16 | 0268 | P1240982.jpg | 1 Jun | inset | ORDINARY | Sado — village above the sea | none | kept: village roofs and power lines, under "villages where nothing happens after half past six" |
| 17 | 0312 | P1250824.jpg | 8 Jun | pair L | COMMUNITY | Sado — 8 Jun cluster | none | kept: stone figures somebody keeps supplying with flowers |
| 18 | 0323 | P1260040-Enhanced-NR.jpg | 13 Jun | pair R | QUIET | Sado — last Sado date | none | kept: the mainland, far off |
| 19 | 0328 | P1260095.jpg | 16 Jun | full | FAREWELL | leaving — departure-day cluster | none | **new.** The port seen through the ferry's salt-marked glass, from inside. Replaces 0327 (pink alpenglow). Leaving, not scenery |
| 20 | 0332 | P1260124.jpg | 16 Jun | wide | BETWEEN | Naoetsu — **owner-confirmed** lighthouse arrival | none | **new.** The small red lighthouse far out on flat water, replacing 0333's monumental centred version. The text names the red lighthouse, so one stays — the quiet one |
| 21 | 0334 | P1260140.jpg | 16 Jun | inset | BETWEEN / ORDINARY | Jōetsu — same day, after the lighthouse | none | kept: a brick church at dusk, on the walk. Ordinary Japan, off any route |
| 22 | 0337 | P1260176.jpg | 17 Jun | wide | AGUI | Agui — temple cluster | none | kept: the temple with its garden lantern |
| 23 | 0345 | P1260208.jpg | 17 Jun | full | TEMPLE | Agui — same cluster | none | kept: the corridor |
| 24 | 0344 | P1260190.jpg | 17 Jun | pair L | BELL-ADJACENT | Agui — same cluster | none | **new.** A small household shrine with fresh flowers in front of it. Somebody tends this daily. Replaces 0343 (a gilt lantern detail), which was decoration |
| 25 | 0339 | P1260181.jpg | 17 Jun | pair R | HOME | Agui — same cluster | none | kept, and re-alted to name what matters: the wall clock, the paper calendar, the worn sofas. The room where they ate and talked |
| 26 | 0341 | P1260186.jpg | 17 Jun | wide | TEMPLE / QUIET | Agui — same cluster | none | **new.** The altar hall with the mat laid out in front of it, closing the six-o'clock passage. Replaces 0346 (bamboo), which was filler |
| 27 | 0363 | P1260442.jpg | 26 Jun | wide | EXIT | Osaka — 26 Jun signage cluster | none | **new.** A spray-painted lane with a bicycle in warm light. Replaces 0375 (a second canal view too close to the Destination hero). A city two friends walked through |

**Distribution:** Tokyo 3 · crossing 2 · **Sado 14 including the hero (50%)** · leaving and the walk
3 · Agui 5 · Osaka 1. Sado is by far the largest block; Agui is the distinct second movement.

## Human presence without identifiable people

All 36 Japan frames containing a recognisable person remain `storyCandidate: false` in
`data/people-review.json`, and the template fails the build rather than render one. That still holds
in V2, so the Story shows a place of work without the workers.

What changed is that V2 stops pretending the Story is unpeopled. It now carries a hand over the
water, a passenger in a ferry saloon, a figure walking away over a bridge, a stand with its curtain
out, roped timber, boats tied and waiting, flowers somebody replaced, a clock and a calendar on a
wall, a mat laid out in front of an altar, and a bicycle left against a railing. **Identifiable
private people publicly shown: 0.**

Still held, and still the single biggest available improvement: photo-0193 and photo-0566 (almost
certainly Keiji-san), photo-0190/0194/0195 (a tarai-bune under way with guests), photo-0189 (the
landing stand), photo-0191 (the Shukunegi たらい舟 はんぎり banner), photo-0278 (the only Taiko
frame in the archive), photo-0558 (a workshop doorway). Owner question 1 is unchanged.

## Findings the owner should know

- **HANAYA: no verifiable photograph exists.** The 28 May interior session (photo-0237 to
  photo-0248) is Sado interior architecture, but nothing in it identifies the guesthouse and no
  owner confirmation attaches it. photo-0243 is therefore used for interiority and is *not*
  captioned or alt-texted as HANAYA. If any of those frames is actually inside HANAYA, saying so
  would let the Story name it.
- **The bell: not photographed.** The entire Agui cluster (17–19 June) was examined at full size.
  There is no bonshō, no shōrō, no hanging striker beam and no bell tower anywhere in the archive.
  photo-0217 does show a bell-like object, but it is from 22 May on Sado and placing it near the
  Agui passage would assert something false. The six-o'clock passage is carried by text, closed by
  the altar hall (photo-0341).
- **Asti: still unresolved.** photo-0563 (a tight monochrome frame of a dark dog's face, 27 May,
  Sado) remains unpublished pending owner identification. Owner question 2 is unchanged.
- **Renjun: no image, deliberately.** Nothing was fabricated, generated, substituted or sourced
  externally. Nothing follows the "no proper photograph of Renjun" paragraph until the Story has
  moved to Osaka. That gap is the only place in any Journey chapter where an image is withheld on
  purpose rather than for want of one.

## Repetition audit

| Motif | V1 | V2 | Note |
| --- | --- | --- | --- |
| generic coast / headland | 5 | 2 (0286, 0203) | within the 2–3 budget; 0203 is weather, not scenery |
| bridge | 2 (0229, 0230) | **0** | both rejected; no substitute bridge introduced |
| historic alley / old building | 3 | 1 (0223) | 0212 rejected, no substitute alley |
| wildlife | 0 in Story (0289 rejected in archive) | 0 | no bird, no animal |
| lighthouse | 2 (0264, 0333) | 1 (0332) | the quiet one only, because the locked text names it |
| tarai-bune / hangiri thread | 2 (0230 + hero) | 4 roles (hero boats, 0201 shipbuilding, 0216 timber detail, 0223 the trade) | different roles, not repeated boats |
| interior / domestic | 2 | 3 (0243, 0339, 0344) | the deficit V1 had |
| weather | 2 | 4 (0224, 0203, 0202, 0201) | the deficit V1 had |
| Tokyo | 3 | 3 | unchanged count, better frames |
| Agui / temple | 5 | 5 | same count, one decoration swapped for one lived detail |
| mountains at distance | 2 (0323, 0327) | 1 (0323) | 0327 cut |
| Ōno-game / postcard rock | 0 in Story | 0 | never entered |

Full-bleed frames land at five points only — Tokyo at dusk, the storm, the northern coast, the ferry
doorway, the temple corridor — and never adjacent to each other.

## Prior prominent use

Four of 28 also appear in the Destination Japan featured set (0178, 0203, 0243, 0363); none is the
Destination hero (`photo-0372`, deliberately not reused). **Zero** overlap with Home, People or the
Black & White collection.

## Treatment

No creative regrading, HDR, dehaze, LUT, synthetic film, generative fill, sky replacement or object
removal. No AI enhancement, no AI upscaling, no image generation. No colour-to-monochrome
conversion: photo-0202 and photo-0203 are monochrome because the owner's masters are monochrome.
The `-Enhanced-NR` filenames are the owner's own Lightroom denoise on his own masters. Only
responsive JPEG derivatives were produced.

`assets-source/photos/` was read only. **0 source masters modified. 0 files renamed, moved or
deleted. 0 EXIF writes.**

---

# PHASE 14.2 — OWNER MOBILE JOURNEY SET

**PHOTO_SEQUENCE_VERSION: V3.** Supersedes V2. 29 frames (1 hero + 28 in sequence).
**Story copy: LOCKED and verified** — the rendered narrative is character-identical to the pre-14.1
baseline (8,115 characters, whitespace-normalised, sha256 `67bd20cc5d57dc55…`). Two `text` blocks
were split so photographs could land on the right paragraph; no word, sentence, order or chapter
label changed.

## The nine owner selections

Source folder: **`assets-source/photos/Mobile Fotos Japan/`** (found on disk; the owner's own
capitalisation is mixed — `Journey 01–03, 05` and `journey 04, 06–09` — and was handled as-is, with
no renaming asked for or performed). All nine are Panasonic DMC-FZ330 files carrying his own
Lightroom edit, with capture dates inside the trusted 12 May – 27 June 2025 Japan window. Ingested
through `scripts/ingest-new-photo-records.mjs`, which **appends** — 706 existing records kept their
ids and their derivative filenames.

| # | Source | Stable ID | Dimensions | Subject | Location | Confidence | Role | Story position | Display | Desktop focal | Mobile focal | Privacy |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `Journey 01.jpg` | photo-0707 | 2615×3923 portrait | Steps climbing between street lamps to a glass tower | Tokyo | HIGH — owner route + 13 May cluster | THRESHOLD | opens the Story, under the arrival/konbini paragraph | `wide` | n/a (contained) | n/a | no people |
| 2 | `Journey 02.jpg` | photo-0708 | 2627×3933 portrait | Asakusa shopping street, lanterns, a woman walking through the crowd | Tokyo, Asakusa | HIGH — owner + 13 May 11:28 cluster | HUMAN / DAILY LIFE | closes Tokyo, under "the streets in front of it, the people" | `wide` | n/a | n/a | **incidental street subjects**, public place |
| 3 | `Journey 03.jpg` | photo-0709 | 2672×4000 portrait | Flag over the bow of the ferry, open water, low headland | Niigata–Sado crossing | HIGH — owner route + 15 May cluster | TRANSIT | pair-right with photo-0181, after the motorway paragraph | `pair` | n/a | n/a | no people |
| 4 | `journey 04.jpg` | photo-0710 | 2132×3198 portrait | Dancer in a wide straw hat turning in a lily meadow | Sado | HIGH — 8 June cluster | COMMUNITY | pair-right with photo-0711, after the taiko paragraph | `pair` | n/a | n/a | **public performance** |
| 5 | `Journey 05.jpg` | photo-0711 | 3729×2797 landscape | Three taiko drummers in happi coats among orange lilies | Sado | HIGH — 8 June cluster | TAIKO | pair-left, directly under "I also got to try taiko" | `pair` | n/a | n/a | **public performance** |
| 6 | `journey 06.jpg` | photo-0712 | 2672×4000 portrait | Three people on a green hillside with their arms raised | Sado | HIGH — 8 June cluster | HUMAN / COMPANIONS | under "Sometimes we all went together" | `wide` | n/a | n/a | **people known to the owner** — see owner question 9 |
| 7 | `journey 07.jpg` | photo-0713 | 3904×2608 landscape | A steep green headland rising out of the sea beside a shingle beach | Northern Sado | HIGH — 8 June cluster | PLACE / MOVEMENT | full bleed, under the racing-bike / island-landscape paragraph | `full` | `50% 46%` | `46% 50%` | no people |
| 8 | `journey 08.jpg` | photo-0714 | 2927×3903 portrait | Tiered castle roofs against heavy cloud, monochrome | Nagoya | HIGH — 21 June cluster | BETWEEN | under "After that, on to Nagoya" | `wide` | n/a | n/a | no people |
| 9 | `journey 09.jpg` | photo-0715 | 2603×3905 portrait | Evening crowd under a covered shopping street, one phone raised | Osaka | HIGH — 26 June cluster | EXIT | pair-right with photo-0363, closing the Story | `pair` | n/a | n/a | **incidental street subjects**, public place |

**All nine are used. None was appended to the end; each sits on the paragraph it belongs to.**

Five of the nine carry identifiable people. They are registered in `data/people-review.json` with
`storyCandidate: true` and `publicationStatus: OWNER_SELECTED_FOR_STORY`, because the owner selected
these exact frames for this Story — that is the image decision, recorded rather than assumed. This
is what finally gives Story 05 the human presence it had been missing: until now every person in the
Japan archive was held, and the chapter showed a place of work with the workers removed.

Owner edits preserved: no HDR, dehaze, regrade, saturation, contrast, film emulation, denoise,
sharpening, object removal or sky replacement. Technical web derivatives only (thumbnail 960,
archive 1800, viewer 3200). **Zero images generated.** `journey 08` stays monochrome because his
master is monochrome.

## The five removed frames

| Screenshot | Stable ID | Source | Was | Removed | Reason |
| --- | --- | --- | --- | --- | --- |
| A — cyclist / sunset | photo-0178 | `P1230535.jpg` | Tokyo closer, `full` | YES | OWNER JOURNEY REJECT / BAD SUBJECT CROP |
| B — wood / diagonal light | photo-0243 | `P1240747.jpg` | after the HANAYA paragraph, `inset` | YES | OWNER JOURNEY REJECT |
| C — blue/cyan abstract | photo-0258 | `P1240870.jpg` | under the clear-water line, `wide` | YES | OWNER JOURNEY REJECT |
| D — industrial / harbour | photo-0328 | `P1260095.jpg` | farewell closer, `full` | YES | OWNER JOURNEY REJECT |
| E — red lighthouse | photo-0332 | `P1260124.jpg` | Naoetsu arrival, `wide` | YES | OWNER JOURNEY REJECT |

Story-05 scope only: none was added to the global `ownerRejected[]` register, none was deleted, and
all five remain exactly as they were in the Archive and on the Destination Japan page. **No
same-capture alternate, alternate crop, renamed export or near-identical burst sibling of any of the
five was used as a replacement** — verified against the rendered page (0 present).

Frame A was the crop failure. It was `display: full`, and `object-fit: cover` at `max-height: 92svh`
cut the cyclist out of the composition. No further crop of that capture is used anywhere in the
Story.

## Other changes made by this recut

Dropped as newly redundant (not owner-rejected): **photo-0168** (a figure walking away on a bridge —
Journey 02 now carries Tokyo's human note far better), **photo-0185** (the ferry saloon — Journey 03
is the owner's crossing frame), **photo-0286** (green headlands — journey 07 is the owner's northern
coast). Retained: 19 incumbents that still do work the nine do not.

Two paragraphs that had no photograph now have none by design rather than by accident: the HANAYA
paragraph (no verified guesthouse photograph exists) and the clear-water line. The farewell now ends
in silence — the flute-and-drums lines, the crying, the forgotten song, and no image at all until
the walk.

Distribution: Tokyo 3 · crossing 2 · **Sado 15 including the hero (52%)** · between 2 · Agui 5 ·
Osaka 2.

## Hero — unchanged

`photo-0198` was re-tested against all nine. None displaces it: `Journey 03` and `journey 07` are the
only candidates with hero scale, and both are better used inside the sequence where the text explains
them, while the hero's job — the work, waiting, nobody in it — is still done best by the boats. The
replacement threshold was treated as high and not met.

## Crop control — the component fix

Body frames had no crop control at all. Only the hero did. That is why a container could cut the
cyclist out of Frame A: `display: full` is the one mode that crops (`wide` and `inset` are
`object-fit: contain` and show the whole frame), and it always cropped dead centre.

`JourneyPhoto` now takes an optional `focal: { desktop, mobile }`, applied as `object-position`
through two CSS custom properties, mobile resolved separately because that crop is tightest. It is
inert on `wide` and `inset`. Nine lines of template, two CSS declarations, no component redesign and
no global CSS rewrite.

Measured across **1600, 1440, 1280, 1024, 768, 430 and 390**: of 29 frames only three ever crop —
the hero (focal-controlled), photo-0224 (a storm sky, nothing to lose) and photo-0713 (focal
`50% 46%` desktop / `46% 50%` mobile, holding 78–100% of the frame and keeping the summit, both
flanks and the waterline). **Eight of the nine new photographs never crop at any width.**
Horizontal overflow 0 and broken images 0 at every width.

The tightest non-hero crop is photo-0345, the Agui corridor, at 35% of frame at 1600px. It survives
because its subject is centred, and it was verified visually; focal support now exists for it if the
owner wants that crop steered.

---

# PHASE 14.3 — TARAI-BUNE PHOTO CORRECTION

**PHOTO_SEQUENCE_VERSION: V3.1.** One frame swapped. 29 frames unchanged in total. Narrative copy
changes: **0** (verified against the pre-14.1 baseline again).

## The problem

The paragraph that explains the boats — *"Tarai-bune. On Sado people also call them hangiri, because
they look like barrels cut in half… They are not cute. They are craft."* — was illustrated by
**photo-0201** (`P1230927.jpg`), a masted wooden vessel hauled out on a dock. It is a good
photograph and it belongs to Shukunegi's shipbuilding world, but it shows the wrong kind of boat
directly under a paragraph defining a very specific one. A reader would have taken the masted ship
to *be* the tarai-bune.

## The correction

| | |
| --- | --- |
| **Source** | `assets-source/photos/Mobile Fotos Japan/journey 10.jpg` |
| **Stable ID** | photo-0716 |
| **Dimensions** | 2315×3472, portrait |
| **Capture** | 16 May 2025, Panasonic DMC-FZ330, owner's Lightroom edit preserved |
| **Subject** | Kotaro standing to scull a tarai-bune with a single oar, a guest in an orange life jacket seated in front of him, flat water and the boat's reflection — **owner-confirmed** |
| **Location** | Ogi / Shukunegi, Sado. HIGH confidence: owner-confirmed subject, inside the trusted Japan window, in the 16 May tarai-bune cluster |
| **Story position** | body frame 6, immediately after the tarai-bune / hangiri paragraph — the position photo-0201 held |
| **Display** | `wide` (`object-fit: contain`) |
| **Desktop crop** | none — whole frame, verified at 1440 |
| **Mobile crop** | none — whole frame, verified at 390 |
| **Caption** | none. The text already explains the boat; a caption would only restate it |
| **Privacy** | Kotaro is named in the Story text by owner permission and the owner explicitly asked for this photograph. Registered in `data/people-review.json` as `KNOWN_TO_OWNER` / `OWNER_SELECTED` / `storyCandidate: true` / `publicationStatus: OWNER_APPROVED_FOR_STORY`. No further personal detail is published |

`wide` was chosen deliberately over `full`: it is a contained mode, so the person, the oar, the hull
and its bamboo binding cannot be cropped at any width. Verified by measurement at both widths —
`object-fit: contain`, whole frame rendered, and by rendered screenshots of the frame itself.

This is now the third photograph in the boat thread that shows the actual vessel — the hero
(`photo-0198`, three empty tarai-bune at the quay), this one (the boat in use, with the person who
runs it) and `photo-0223` (the trade's ship-crest curtain in Shukunegi). The thread finally has a
working boat with a person in it.

## Scope of the removal

**photo-0201 was removed from Story 05 only.** It was not added to `ownerRejected[]`, its private
master is untouched, all three of its public derivatives remain on disk, and it is still public in
the Archive exactly as before. No other Japan photograph was altered. No replacement generic boat
photograph was introduced anywhere.
