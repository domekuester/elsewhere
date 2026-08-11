# Phase 10 — THE JOURNEY / Malaysia

The first story. Also the first time the publication speaks in the first person.

*Revised by Phase 10.1 (a geographic correction and a George Town ingest) and Phase 10.3 (the Kapas
memory and a voice pass). Both are documented at the bottom.*

| | |
| --- | --- |
| URL | `/journey/malaysia/` |
| Status | `OWNER_REVIEW` — builds, `noindex`, not in the sitemap, linked from nowhere |
| Title | Malaysia · kicker *The Journey — 01* · *2024 — 2025* |
| Words | 910 body + 25 standfirst |
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
| [`PHASE-10-MALAYSIA-PHOTO-EDIT.md`](PHASE-10-MALAYSIA-PHOTO-EDIT.md) | The 22 frames, their roles, and what was left out |
| [`PHASE-10-MALAYSIA-OWNER-QUESTIONS.md`](PHASE-10-MALAYSIA-OWNER-QUESTIONS.md) | Two questions and one decision |
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
surface inside a photographic publication, and an ivory page would put a bright mount around every
frame. The cost is that long-form body text had to be tuned for a dark ground: a softened
ink (#d6d7d2, 13.4:1), a 1.78 line-height, and the measure held at 36rem — 576px, about 66
characters, at every width above 700px.

## The writing

910 words. It was 640 until Phase 10.3, when the owner answered the two questions the piece was
built around a gap in — how he ended up on Kapas in 2016, and what an ordinary day there is. Every
one of the added words is his.

Nothing was invented. No dish, restaurant, friend, encounter, dialogue, route or weather event that
the owner did not describe. Six beats are *voice* rather than testimony — they add no fact, they
restate something already said in his register — and all six are listed by name in the German and
English documents so they can be struck individually.

The blunt lines the earlier packs asked to protect all survived: *the city smells* · *Not pretty.
Impressive.* · *The reef looked good. Intact.* · *the people on Kapas are great.* Phase 10.3 adds
four that deserve the same protection: *Kapas was an accident.* · *We never made it to the
Perhentians.* · *Nobody asked them to.* · *That is basically it. And that is exactly why I keep going
back.*

Three em dashes in 910 words. No *hidden gem*, *vibrant tapestry*, *melting pot*, *bustling*, *where
tradition meets modernity*, *off the beaten path*, *timeless*, *authentic*, *journey of discovery*,
*postcard-perfect*, *sun-drenched*, *culinary paradise*. *Rhythm*, *stillness*, *layers*, *texture*,
*presence* and *memory* appear zero times. No paragraph closes on a manufactured insight.

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
- **One caption in twenty-two frames.** Only `photo-0689` carries one, because it is the only frame
  whose city can be proved. Everything else states nothing the text does not already carry.

## QA

    BUILD:                  PASS   22 pages, 21 public HTML files
    CONTENT:                PASS   689 photos, 12 destinations, 88 People candidates
    OWNER EXCLUSIONS:       PASS   24 rejected, 0 public references, 32 built files audited
    PRIVACY:                PASS   no place/GPS/private note on any story surface
    LAUNCH / SEO:           PASS   unique canonicals, complete social metadata, sitemap consistent
    BROKEN ASSETS:          0
    CONSOLE / NETWORK:      clean at every width tested
    HORIZONTAL OVERFLOW:    0 at every width tested
    MISSING ALT:            0 of 22
    REDUCED MOTION:         0 hidden elements — the whole page is present
    KEYBOARD:               every stop has a visible 2px focus ring; skip link first
    HEADINGS:               h1 → h2 ×3, no level skipped

Rendered and read end to end at **1600, 1440, 1280, 1024, 768, 430, 390 and 320**. The reading column measures
576px (≈66 characters) at every width above 700px and 280–390px below it. Screenshots are local only
and were not added to the repository.

Performance: the hero is the LCP element and is served from the hero ladder — 195 KB at 1440, 298 KB
at 390/DPR 3, the same treatment every chapter hero gets. Initial load is 136 KB of markup, CSS and
fonts plus two images; the rest are lazy. The page is 25,700 px tall at 1440 and pays for it a
screen at a time.

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

---

# Phase 10.3 — the Kapas memory, and the voice pass

The owner told the story of 2016 and described an ordinary day on the island. Those were the two
questions the piece had been built around a gap in. This is what they changed.

## The story went from 640 words to 910, and all 270 are his

**How it happened.** 2016, a flight to Malaysia with a friend, and a fixed plan: two weeks on the
Perhentians. Kuala Lumpur to Terengganu, a night on the mainland, and Kapas sitting there off the
coast. He suggested going over to look. They found LongSha Campsite and stayed the whole two weeks.
They never made it to the Perhentians.

That last sentence is the chapter. A story about a country he returns to now contains the moment the
returning started, and it started by a plan falling apart in the first twenty-four hours.

**What a day is.** Waking in the tent to the sea, coffee, a swim, a hammock, bays with nobody on
them. The boat across to Marang for the market and the supermarket, and cooking something cheap. The
fire, the hammocks or the kitchen area in the evening. People coming over from Terengganu at
weekends and inviting you to eat. Beach cleanups, the turtle sanctuary, helping around the camp. And
the rain — properly — and digging trenches so the tents don't flood.

Kapas grew from two paragraphs to eleven. It is now the longest section in the story, which is
correct: it is the part that explains why any of the rest is happening.

## What this fixed, structurally

Before, the island was asserted rather than shown. *I found Pulau Kapas by accident in 2016* and *the
people on Kapas are great* asked the reader to take two large claims on trust. Now the accident is a
sequence of events and the people are a specific thing they do — they invite you to eat, and nobody
asked them to. The affection is earned by concrete detail rather than announced.

It also gave the section a shape it did not have: **how it happened → what it is → what a day is →
why it holds.**

## Research

Only spellings. *Pulau Kapas*, *LongSha Campsite*, *Marang*, *Terengganu*, *Perhentians*, *George
Town* and *Penang* were checked against public sources and the owner's spelling was correct in every
case. Prices, boat times, distances and camp facilities are all publicly available; none of them are
in the story, because none of them came from him.

Sources consulted for spelling only:
[longshacampingandboatservices.com](https://longshacampingandboatservices.com/) ·
[Tripadvisor](https://www.tripadvisor.com/Hotel_Review-g304001-d10021922-Reviews-LongSha_Campsite-Pulau_Kapas_Terengganu.html)

## The voice pass

Four lines were rewritten after reading the whole thing aloud:

| Was | Now | Why |
| --- | --- | --- |
| *It still impresses me that it all works side by side.* | *And it all works side by side, which I have never quite got used to.* | *Impressive/impresses* twice in three paragraphs blunted *Not pretty. Impressive.* |
| *Call it love at first sight. It did not take long, anyway.* | *Call it love at first sight. It didn't take long.* | The trailing *anyway* was hedging a line that should land. |
| *You help around the camp because it is there to be done and you are there anyway.* | *You help around the camp, because it needs doing and you are there anyway.* | Written, not spoken. |
| *the day stops being divided up* | *you stop dividing the day up* | Passive, and it made him a bystander in his own sentence. |

## Photographs

One out, one in, count unchanged at 22. `photo-0108` (a fourth cloud-over-water frame) left;
`photo-0059` — a heavy grey bank over dark open water — arrived directly under *And it rains.
Properly.* The storm paragraph had no picture, and this is the only frame in the Malaysia pool that
reads as weather rather than as good light. It is also the first landscape frame anywhere in the
story's reading column, which breaks up a long portrait run.

`photo-0122`, the cove, now lands immediately after the sentence about seeing the island from the
coast — the thing he saw, right after he says he saw it.

## What did not change

The opening (*Not the first time. That is more or less the point.*), the standfirst, the closing two
lines, the Kuala Lumpur section, the George Town section and its two frames, the hero, the closer,
the block system, the layout, the header work from 10.2, and the publication state.

## QA

    BUILD:               PASS   22 pages, 21 public HTML files
    CONTENT:             PASS   689 photos
    PRIVACY:             PASS
    OWNER EXCLUSIONS:    PASS   24 rejected, 0 public references
    LAUNCH / SEO:        PASS
    BROKEN ASSETS:       0
    CONSOLE / NETWORK:   clean
    HORIZONTAL OVERFLOW: 0
    MISSING ALT:         0 of 22
    IDENTIFIABLE PEOPLE: 0, still enforced by build-time check
    REDUCED MOTION:      0 hidden elements
    STATUS:              OWNER_REVIEW — unchanged, nothing published
