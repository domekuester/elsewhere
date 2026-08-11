# Phase 11 — THE JOURNEY / Thailand, Story 02

The story of a man who did not like Thailand, went back, and could not keep the opinion.

| | |
| --- | --- |
| Story | Thailand · *The Journey — 02* · 2024 — 2025 |
| URL | `/journey/thailand/` |
| Status | **`PUBLISHED`** on 12 August 2026 |
| German master | 1,150 words · [`STORY-02-THAILAND-DE-MASTER.md`](STORY-02-THAILAND-DE-MASTER.md) |
| English body | 841 words + 34-word standfirst |
| Photographs | 20 (1 hero + 19), from a Thailand pool of 54 |
| New owner files | 7 found, **5 used**, 2 held for a people decision |
| Hero | `photo-0043` — a gold cloud over a scaffolded pagoda spire |
| People named | Arty, Dori, Pinong, Max, Jam, A, Sakai, Wilmer |
| People shown | **1 anonymous beach frame** — owner-selected for Koh Phayam |
| Owner questions | 5 |

The pack, the fact-check record and the editorial reasoning are folded into this document rather than
duplicated into a separate one.

## What the story is

Not *Thailand is beautiful*. The engine is a change of mind: he had been before, it had never worked,
he felt like a wallet, and he had seen a side of the tourism he did not like. Then Krabi refused to
cooperate with his expectations, a month at a reception desk gave him colleagues instead of vendors,
and by the end the old opinion was hard to defend.

The self-correction is the part that makes it worth reading, and it is his: *I had mostly been in the
places where exactly that happens, and sometimes with the wrong people.*

## Structure

    old Thailand → the Workaway search on Kapas → KRABI → Tiger Cave → TONSAI → the people →
    the temporary family → KOH PHAYAM → and the rest of it → the change

Four place markers, not eleven. Bangkok, Koh Chang, Ayutthaya and Kanchanaburi get one line each
under a single marker, because eleven headings would have turned a story into an itinerary.

## Timeline — answered rather than assumed

The owner's telling runs continuously, but the dates do not. **Krabi and Tonsai are October–December
2024. Koh Phayam and Koh Chang are February 2025, with Laos in between.**

This is one story, because it is one change of mind — and the line under the hero says exactly that
rather than pretending the trip ran straight through. Splitting it would have cut the story in half
at the point where it works.

## Research — verification only

Confirmed and used: **Arty Momma Rasta Bar** (Krabi Town), **Workaway**, **Tonsai Beach**, **Ao
Nang**, **Wat Tham Suea / Tiger Cave Temple**, **Koh Phayam**, **Ranong**, **Khao Soi**,
**Ayutthaya**, **Kanchanaburi**, **River Khwae**, **Yellow House Internet & Tour** (legible in his own
photograph).

**The step count is the one place I refused to be precise.** Sources give 1,237 historically and 1,260
after a rebuilt section. The story says *more than 1,200*, which is his own wording and is true under
either figure.

**Not verified: Sweet Kitchen** on Koh Phayam. It stays as his memory with no address or detail
attached.

Nothing from a review, a blog or a tourism page entered the prose. Research checked names; it did not
write anything.

## The cost of the people rule

**The story names eight people and shows none of those named people.** Eleven earlier Thailand
frames with identifiable people remain `storyCandidate: false`, and the build refuses all of them.
The one exception is the owner-selected Koh Phayam surfer frame, whose beachgoers remain anonymous.

For Malaysia that was a small loss. Here it works against the story, because the story's whole
argument is that Thailand stopped being a country and became a list of people. The named Tonsai
circle still remains unseen, including the man outside Yellow House.

Nothing was substituted. No stranger stands in for Wilmer. It is the first owner question, and it is
the one that would change the story most.

## Handled carefully

**Sex tourism** — one sentence, his experience, no scene, no moral, no claim about the country: *There
was a side of the tourism I saw on those trips that I did not like either. I will leave it at that.*

**The wallet** — kept, because it is his image and softening it would have made him diplomatic
instead of honest. Framed as how he felt, not as what Thai people do.

**Max and Jam** — Max teaches climbing and runs the climbing context around the story. His repeated
offers of time remain warm and important without turning the passage into a discussion of money.
Jam works for Max, the owner did a climbing course with him, and he is remembered as warm, grounded
and easy to talk to without overstating the closeness.

**Jam's family** — not in the story. It would not improve it.

**The elephants** — one line saying he photographed it and decided he did not want those pictures in
this. The photographs are excluded from the story, the hero candidates, the social image and every
selection sheet.

**The old friend** on Koh Phayam stays *an old friend*.

## Voice

Written in German first, then re-created in English. Four beats are phrasing rather than fact and are
listed by name in the German master so they can be struck: the stairs joke, *I still do not know when
she slept*, the 7-Eleven, and *Before I was a customer. This time I was just there.*

Two em dashes in 841 words. No *rhythm*, *stillness*, *layers*, *texture*, *presence*. No "not X but
Y". No travel philosophy: the ending is *Apparently I just had to come back*, and it stops there.

**841 words is shorter than the 1,400–2,400 the brief suggested**, and shorter than Malaysia's 896
despite covering more ground. That is deliberate. The four secondary places are one line each by
design, and padding the Tonsai section would have meant inventing evenings the owner did not describe.
If he wants it longer, the material has to come from him.

## QA

    BUILD:                 PASS   24 pages, 22 public HTML files
    CONTENT:               PASS   699 photos
    PRIVACY:               PASS
    OWNER EXCLUSIONS:      PASS   24 rejected, 0 public references
    LAUNCH / SEO:          PASS
    BROKEN ASSETS:         0
    CONSOLE / NETWORK:     clean
    HORIZONTAL OVERFLOW:   0 at 1600, 1440, 1280, 1100, 1024, 768, 430, 390, 320
    MISSING ALT:           0 of 19
    IDENTIFIABLE PEOPLE:   0, refused at build time
    REDUCED MOTION:        0 hidden elements
    HEADINGS:              h1 → h2 ×4
    STATUS:                OWNER_REVIEW — Malaysia untouched and still published

## Two pipeline findings

`scripts/generate-archive-derivatives.mjs` now reports four public photographs whose source masters
have gone from the folders: `photo-0664` (Malaysia), and `photo-0676`, `photo-0677` and `photo-0683`
(Thailand). `photo-0676` and `photo-0677` are not losses — they have the same subjects and capture
dates as `Koh Chang 01.jpg` and `Phayam 01.jpg`, so the owner replaced them with his own edits. The
story uses the new ones. This pre-existing pipeline warning does not affect `Phayam 02.jpg`.

## Phase 11.1 — factual correction and Koh Phayam recut

The German master and English publication copy distinguish Max's generosity from Jam's role: Jam
works for Max and was the instructor for the owner's course. `Phayam 02.jpg` was ingested as stable
`photo-0700` at 3000 × 4000 and placed directly after the bungalow sentence. It replaces the Story
reference to `photo-0064`, a second sunset that no longer had a distinct job. Thailand remains
`OWNER_REVIEW`.

Phase 11.1 validation: build, content/privacy and owner-exclusion checks pass with 700 stable photo
records; the built Thailand HTML contains the corrected English facts and one `photo-0700`
reference; broken assets are 0. Browser visual QA was not run because the in-app Playwright/browser
endpoint was unavailable in this session.

## Phase 11.2 — voice refinement and Phayam 03

The Max/Jam passage is quieter and more natural in both languages: Max's generosity remains the
point, Jam's working connection stays clear, and neither payment nor an exaggerated friendship
carries the sentence. `Phayam 03.jpg` is stable `photo-0701` at 3898 × 6412. It follows the list of
swimming, exploring, photography, scooter, sunset and beer, then hands the section to its final
sentence. No existing Koh Phayam frame was removed; the subsection now moves through atmosphere,
the bungalow and the human rhythm of the beach. Thailand remains `OWNER_REVIEW`.

Phase 11.2 validation: build, content/privacy and owner-exclusion checks pass with 701 stable photo
records; the built Thailand HTML contains the refined English copy and one `photo-0701` reference;
broken assets are 0. Browser visual/console QA was not rerun because the in-app browser endpoint
remained unavailable in this session.

## Phase 11.3 — published

Published on 12 August 2026 after the owner's visual approval. The Story copy and 20-photo edit are
locked. Publication activates Thailand on `/journey/`, Malaysia → Thailand and Thailand → Malaysia
series navigation, the Thailand archive-to-Story link, indexable robots, sitemap inclusion, Article
metadata and a 1200 × 630 crop of the approved hero at `/social/journey-thailand.jpg`. Thailand's
destination chapter remains `in-edit`; no destination route was fabricated. Home remains restrained
and continues to use its single Malaysia Journey entry.

Production validation passes with 701 photo records, 24 owner rejections and 0 public references,
0 broken assets, 0 broken internal links and no public private-data or owner-review leakage.
Automated browser QA was not run because the Playwright/browser MCP endpoint was unavailable.
