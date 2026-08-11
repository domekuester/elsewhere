# Phase 10 — THE JOURNEY / Malaysia

The first story. Also the first time the publication speaks in the first person.

*Revised by Phase 10.1 — a geographic correction and a George Town ingest. See the section at the
bottom.*

| | |
| --- | --- |
| URL | `/journey/malaysia/` |
| Status | `OWNER_REVIEW` — builds, `noindex`, not in the sitemap, linked from nowhere |
| Title | Malaysia · kicker *The Journey — 01* · *2024 — 2025* |
| Words | 640 body + 25 standfirst |
| Photographs | 22 (1 hero + 21), from a pool of 59 |
| Opener | `photo-0056` — a covered walkway between columns, sea on both sides |
| Closer | `photo-0057` — sun through cloud over a bay, a boat on the sand, a jetty running out |
| Identifiable people | **0**, by build-time check |
| Cities claimed by a photograph | **2**, both owner-confirmed George Town |

## The package

| Document | What it is |
| --- | --- |
| [`PHASE-10-MALAYSIA-DE-FINAL.md`](PHASE-10-MALAYSIA-DE-FINAL.md) | German master — the truth layer |
| [`PHASE-10-MALAYSIA-EN-FINAL.md`](PHASE-10-MALAYSIA-EN-FINAL.md) | The English text that is on the page |
| [`PHASE-10-MALAYSIA-PHOTO-EDIT.md`](PHASE-10-MALAYSIA-PHOTO-EDIT.md) | The 20 frames, their roles, and what was left out |
| [`PHASE-10-MALAYSIA-OWNER-QUESTIONS.md`](PHASE-10-MALAYSIA-OWNER-QUESTIONS.md) | Four questions and one decision |
| [`PHASE-10-THE-JOURNEY-SYSTEM.md`](PHASE-10-THE-JOURNEY-SYSTEM.md) | The reusable system |

## What was built

`src/data/journey.ts` holds a content model and the story as structured blocks — seven block types
(`lede`, `text`, `chapter`, `lines`, `photo`, `pair`, `pause`), each one used. Prose is data. A
paragraph can be rewritten, a joke cut, a photograph swapped or the sequence reordered by editing one
array; the page component never knows what the story says.

`src/pages/journey/[slug].astro` renders it. `src/pages/journey/[...page].astro` is the series index,
which does not exist until a story is published. `data/surface-heroes.json` carries the opening
photograph, so the story hero gets the same derivative ladder as a destination hero rather than the
3200px viewer file.

Three surfaces link to a published story — Home, the place's archive page, and the index — and all
three are gated on `publishedJourneyStories()`. Nothing was added to the global navigation. One story
is not a category.

## Three decisions worth your disagreement

**George Town now has two photographs, and only because the owner supplied them.** Until Phase 10.1
not one Malaysia frame carried a city, three frames only *looked* like a lower old-town street, and
the section was text only rather than illustrated with a guess. That restraint was the right call and
it is what made the correction cheap: nothing had to be un-said, only added.

**No portraits.** Nine Malaysia frames contain identifiable people, and every one is
`storyCandidate: false` in `data/people-review.json`. Being public in a grid of 57 is a weaker
permission than being one of twenty photographs in a piece of writing. The build now refuses to
render them — a check, not a convention. It cost the edit the street-food stall and the best human
frame in the city, and the whole list is one yes away from going back in.

**The story is dark.** Field Notes are ivory because they are reading surfaces. This is a reading
surface inside a photographic publication, and an ivory page would put a bright mount around all
twenty frames. The cost is that long-form body text had to be tuned for a dark ground: a softened
ink (#d6d7d2, 13.4:1), a 1.78 line-height, and the measure held at 36rem — 576px, about 66
characters, at every width above 700px.

## The writing

640 words. The pack targeted 600–900 and the owner's account honestly carries the lower end. The
missing 200 words are not missing style; they are questions 3 and 4 — how he actually ended up on
Kapas in 2016, and what an ordinary day there looks like. Both are the emotional centre of the
chapter and both currently get one sentence each.

Nothing was invented. No dish, restaurant, friend, encounter, dialogue, route or weather event that
the owner did not describe. Three sentences are *voice* rather than testimony — they add no fact,
they restate something already said in his register — and all three are listed by name in the German
and English documents so they can be struck individually.

The four blunt lines the previous pack asked to protect all survived: *the city smells* · *Not
pretty. Impressive.* · *The reef looked good. Intact.* · *the people on Kapas are great.*

Three em dashes in 640 words. No *hidden gem*, *vibrant tapestry*, *melting pot*, *bustling*, *where
tradition meets modernity*, *off the beaten path*, *timeless*, *authentic*, *journey of discovery*,
*postcard-perfect*. No paragraph closes on a manufactured insight.

## Chronology

The story opens on 21 August 2024, runs through Kuala Lumpur, crosses to George Town in October 2024,
spends April–May 2025 on the island and closes on 22 August 2024 — the day after the opener. Narrative
order beats capture order twice, deliberately: the piece is explicitly about a country visited three
times across two years and never claims to be one continuous trip.

## Deliberate omissions

- **No viewer.** Story photographs do not open the immersive viewer; a full-screen overlay mid-sequence
  destroys the reading. The global viewer was not touched.
- **No new motion.** The existing `data-photo-reveal` clip-path reveal, nothing else. Native scroll
  untouched — no smooth-scroll, no scroll-jacking, no pinning.
- **No practical content.** No where to stay, what to eat, how to get there. That is a Field Note.
- **No captions.** Twenty frames, no captions, because none of them carries a fact worth stating that
  the text does not already carry. The caption slot exists in the model for when one does.

## QA

    BUILD:                  PASS   22 pages, 21 public HTML files
    CONTENT:                PASS   686 photos, 12 destinations, 88 People candidates
    OWNER EXCLUSIONS:       PASS   24 rejected, 0 public references, 32 built files audited
    PRIVACY:                PASS   no place/GPS/private note on any story surface
    LAUNCH / SEO:           PASS   unique canonicals, complete social metadata, sitemap consistent
    BROKEN ASSETS:          0
    CONSOLE / NETWORK:      clean at every width tested
    HORIZONTAL OVERFLOW:    0 at every width tested
    MISSING ALT:            0 of 20
    REDUCED MOTION:         0 hidden elements — the whole page is present
    KEYBOARD:               every stop has a visible 2px focus ring; skip link first
    HEADINGS:               h1 → h2 ×3, no level skipped

Rendered and read at **1600, 1440, 1280, 1024, 768, 430, 390 and 320**. The reading column measures
576px (≈66 characters) at every width above 700px and 280–390px below it. Screenshots are local only
and were not added to the repository.

Performance: the hero is the LCP element and is served from the hero ladder — 195 KB at 1440, 298 KB
at 390/DPR 3, the same treatment every chapter hero gets. Initial load is 136 KB of markup, CSS and
fonts plus two images; the other 18 frames are lazy. The page is 22,800 px tall at 1440 and pays for
it a screen at a time.

## Not touched

Japan, Düsseldorf, Essaouira, La Réunion, Thailand, Phu Quoc and Laos heroes · the Home photographic
sequence (one gated link was added to the existing story-feature block, nothing else) · People ·
Black & White · the archive grid · navigation · fonts · scroll · the viewer.

## To publish

Set `status: 'PUBLISHED'` on the Malaysia story in `src/data/journey.ts`. That one field turns on the
sitemap entry, the index page, the Home link and the archive link, and switches the page from
`noindex` to indexable. Verified by building in both states.

## Working tree

Not committed. `data/destinations.json` also carries the uncommitted Phase 9.30A Laos hero
correction.

---

# Phase 10.1 — geographic truth correction

The owner reviewed the rendered story and found a photograph that is not Malaysia, and supplied three
that are more precisely Malaysia than anything else in the archive.

## The wrong frame

`photo-0040` — *a lit market at night under a long lens-shaped cloud* — is **Thailand**, on the
owner's word. It was the story's closer.

Capture date 8 October 2024, which sits inside the Malaysia 2024 range in the owner travel timeline
(20 Aug – 9 Oct), so automatic classification had it right by the calendar and wrong by the fact. The
timeline knows where he was on a date; it cannot know that a particular evening was already over the
border.

**This is not a rejection.** The photograph is valid work and stays public. What changed:

| | Before | After |
| --- | --- | --- |
| `destinationId` | `malaysia` | `thailand` |
| `journeyId` | `malaysia-2024` | `thailand-2024` |
| `locationSource` | `OWNER_TRAVEL_TIMELINE` | `OWNER_CONFIRMATION` |
| `locationConfidence` | `CONFIRMED_OWNER_RANGE` | `OWNER_CONFIRMED` |
| Malaysia frame count | 57 | 59 (−1 here, +3 George Town) |
| Thailand frame count | 47 | 48 |

`OWNER_CONFIRMATION` is a state `classify-owner-timeline.mjs` already understands as outranking the
timeline, so the correction survives every future regeneration rather than being silently reverted the
next time the classifier runs. Verified by re-running it.

Malaysia story references to the frame: **0**. Thailand archive references: intact.

## The three George Town files

Found at `assets-source/photos/Mobile Fotos Malaysia/` — spelled `Georgtown`, and in the Malaysia
folder rather than the Thailand one the owner remembered. Neither the spelling nor the folder is the
authority; the owner's statement is.

| Source file | ID | Size | Capture |
| --- | --- | --- | --- |
| `Georgtown 01.jpg` | `photo-0687` | 3024 × 4032 | 4 Oct 2024, 09:26 |
| `Georgtown 02.jpg` | `photo-0688` | 3024 × 4032 | 4 Oct 2024, 08:06 |
| `Georgtown.jpg` | `photo-0689` | 3024 × 4032 | 4 Oct 2024, 07:41 |

All three iPhone 12 mini, no GPS, genuinely new (not duplicates of anything in the 686-record
inventory). Ingested through `scripts/ingest-new-photo-records.mjs`, which appends without
renumbering. **The masters were not moved, renamed, recompressed or touched.** The corrected
geography lives in the metadata layer, which is the point of having one.

Recorded as `country: Malaysia`, `region: Penang`, `place: George Town`,
`locationSource: OWNER_CONFIRMATION`, `locationConfidence: OWNER_CONFIRMED`. No coordinates were
invented; no street or business was named.

**`place` reached the public catalog for the first time.** `scripts/build-photo-catalog.mjs` had it
hardcoded to `null`, correctly, for as long as no photograph had a confirmed city. It now reads an
explicit owner assignment and still resolves to `null` for the other 686 frames — by absence, not by
rule. `imageObject` builds `contentLocation` from place, region and country, so these two frames
publish *George Town, Penang, Malaysia* and every other frame on the site publishes exactly what it
published before (checked against Essaouira, which could have printed its own name twice and does
not).

## Selection

`photo-0688` leads and `photo-0689` closes the section; `photo-0687` stays in the archive. The
reasoning is in [`PHASE-10-MALAYSIA-PHOTO-EDIT.md`](PHASE-10-MALAYSIA-PHOTO-EDIT.md).

## The recut

Not a swap in place. The George Town moment was rebuilt:

    …0084 lantern shop (inset)
    …0023 KL tower at dusk            ← moved up, was after the text
    "And then Kuala Lumpur is mostly movement. Airport. City. Friends…"
    photo-0688                        ← George Town arrives before it is named
    GEORGE TOWN                       ← the marker
    three paragraphs
    photo-0689 · "George Town, Penang · 2024"
    (pause)
    PULAU KAPAS…

The KL tower moving above the "movement" line turns that line into the hinge between two cities
rather than a caption for the tower, and stops two portrait frames from different cities sitting back
to back. The tonal jump does the rest: orange dusk concrete, then hard blue George Town daylight.

## Prose changed in one place

The provenance line under the hero said *the photographs are confirmed to Malaysia and no further*.
That is now false, so it reads *Two of the photographs carry a confirmed city; the rest are confirmed
to Malaysia and no further, and stay unassigned rather than guessed.* The narrative itself was not
touched — no sentence depended on George Town being unillustrated.

## QA after the correction

    BUILD:                  PASS   22 pages, 21 public HTML files
    CONTENT:                PASS   689 photos (686 + 3), 12 destinations
    OWNER EXCLUSIONS:       PASS   24 rejected, 0 public references
    PRIVACY:                PASS   no GPS in the catalog; `place` carries only owner-confirmed cities
    LAUNCH / SEO:           PASS
    THAILAND FRAME IN MALAYSIA STORY:   0 references
    THAILAND FRAME IN THAILAND ARCHIVE: present
    BROKEN ASSETS:          0
    CONSOLE / NETWORK:      clean at every width
    HORIZONTAL OVERFLOW:    0 at every width
    MISSING ALT:            0 of 22
    REDUCED MOTION:         0 hidden elements
    KEYBOARD:               every stop focus-visible
    HEADINGS:               h1 → h2 ×3

Re-rendered end to end at 1600, 1440, 1280, 1024, 768, 430, 390 and 320.

The story remains `OWNER_REVIEW`. Nothing was published.
