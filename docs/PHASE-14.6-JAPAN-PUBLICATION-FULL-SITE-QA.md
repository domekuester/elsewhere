# Phase 14.6 — Japan publication + full ELSEWHERE site QA

**Japan: PUBLISHED** (13 August 2026). Story 05 is live at `/journey/japan/`, indexable, in the
sitemap, and joined to the series. The whole public site was then audited for regressions.

---

## Japan publication proof

The state change was one field: `status: 'OWNER_REVIEW' → 'PUBLISHED'`, `publishedAt: '2026-08-13'`,
through the existing Journey state model. No new architecture.

All 21 publication conditions verified against the built output:

| # | Condition | Result |
| --- | --- | --- |
| 1 | Japan story state | `PUBLISHED` |
| 2 | `/journey/japan/` renders | yes, `<h1>Japan</h1>` |
| 3 | Robots | `index, follow, max-image-preview:large` |
| 4 | Canonical | present and correct |
| 5 | In `sitemap.xml` | yes |
| 6 | Journey index shows 01–05 | all five linked |
| 7 | Phu Quoc → Japan | `rel="next"` |
| 8 | Japan → Phu Quoc | `rel="prev"` |
| 9 | No Story 06 / "coming soon" | none |
| 10 | 29 photographs load | 29/29, count tag reads 29 |
| 11 | Journey 10 / Kotaro tarai-bune | `photo-0716` present at the tarai-bune passage |
| 12 | Phase 14.4 fact corrections | all seven intact |
| 13 | Onsen unnamed | "the onsen in Ogi"; no venue named |
| 14 | Owner-rejected public references | 0 |
| 15 | Source masters exposed | 0 |
| 16 | People-held frames rendered | 0 |
| 17 | `OWNER_REVIEW` leakage | none |
| 18 | Open Graph image | `/social/journey-japan.jpg`, owner photography |
| 19 | Structured data | valid JSON-LD |
| 20 | Alt handling | every `<img>` carries an alt attribute |
| 21 | Kicker | `The Journey — 05` |

**Journey series is now 01 Malaysia → 02 Thailand → 03 Laos → 04 Phu Quoc → 05 Japan.** Japan has no
`next`, and none was fabricated.

### Japan responsive crop audit at publication

Measured at **1600, 1440, 1280, 1024, 768, 430, 390**. Every width: 29/29 images load, 0 broken,
0 horizontal overflow. Only four of 29 frames crop at all (`display: full`), and all four are
controlled:

| Frame | 1600 | 1440 | 1280 | 1024 | 768 | 430 | 390 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| photo-0198 hero (focal `50% 62%` / `50% 58%`) | 38% | 43% | 48% | 60% | 80% | 73% | 67% |
| photo-0224 storm sky | 86% | 96% | 100% | 100% | 100% | 100% | 100% |
| photo-0713 northern headland (focal `50% 46%` / `46% 50%`) | 86% | 96% | 100% | 100% | 100% | 100% | 100% |
| photo-0345 Agui corridor | 38% | 43% | 48% | 60% | 80% | 100% | 100% |

**Important subjects lost to crop: 0.** The two frames that crop hardest are the hero and the temple
corridor, both centred compositions verified visually. The remaining 25 frames are `wide`, `inset`
or `pair`, which are `object-fit: contain` and cannot crop.

---

## Full site audit

**25 public routes** discovered from the build (not a guessed list) and audited.

### Static audit — every route

| Check | Result |
| --- | --- |
| Distinct public image URLs referenced | 725 |
| Broken images | **0** |
| Broken internal links | **0** |
| Owner-rejected public references | **0** (canonical register: 35 rejected) |
| Source master / private path leaks | **0** |
| Duplicate canonicals | **0** |
| Duplicate titles | **0** |
| Missing/short descriptions, missing og:image | **0** |
| `<img>` tags total | 335 |
| Genuinely missing an alt attribute | **0** |

### Rendered audit — 25 routes × 1440 and 390 (50 renders)

| Check | Result |
| --- | --- |
| Horizontal overflow | **0** at both widths, every route |
| Broken images | 0 real (see note) |
| `h1` anomalies | **0** — exactly one per page |
| Header present | all routes |

*Note on the archive family:* two `<img>` elements on `/archive/`, `/archive/black-and-white/` and
each `/archive/place/*/` report as "broken". They are the immersive viewer's `viewer-preview` and
`viewer-image` slots, which carry **no `src` attribute at all** until a frame is opened. Pre-existing
architecture, not a regression and not a broken asset.

### Surface results

| Surface | Result |
| --- | --- |
| Home | PASS |
| Journey index | PASS |
| Journey stories 01–05 | **5 / 5 PASS** |
| Destinations index | PASS |
| Destination pages (japan, la-reunion, essaouira, dusseldorf) | **4 / 4 PASS** |
| Archive + 4 place archives + B&W archive | PASS |
| Collections + Black & White collection | PASS |
| People | PASS |
| Studio | PASS |
| Licensing | PASS |
| About | PASS |
| Contact | renders; **address is a placeholder — see owner decisions** |
| 404 | PASS — returns 404, titled "Not found — Elsewhere", no stack trace, home recovery link present |

### Header integration

Sampled across nine representative light and dark heroes (Home, Japan Destination, all five Journey
stories, Düsseldorf, Essaouira). The header is `position: absolute` with
`background-color: rgba(0,0,0,0)`, no gradient of its own and no `mix-blend-mode` — readability comes
from each hero's own scrim. **Visible header seams: 0**, by construction. Verified visually against
Essaouira, the brightest hero on the site: navigation stays legible across both sky and sunlit wall.

### Scrolling

`scroll-behavior: auto` on both root and body, no Lenis or scroll-hijacking library active, and a
programmatic scroll lands immediately. **Native scrolling intact.**

### Geography regression

Provenance-based, no visual country guessing.

- Public catalog provenance: 439 `OWNER_TRAVEL_TIMELINE`, 95 `OWNER_CONFIRMATION`, 1 `OWNER_CORRECTION_REVIEW`.
- **Thailand frames rescued from Phu Quoc remain Thailand** — `photo-0034` and `photo-0035` are dated
  26 March 2025 (inside the Phu Quoc window) but carry `OWNER_CONFIRMATION` / `OWNER_CONFIRMED` with
  the Phase 13.2 note "Thailand, not Phu Quoc or Vietnam". Explicit owner confirmation outranks the
  timeline, so this is correct and the correction survived. They are the only two public photographs
  outside their destination's owner range.
- **Nong Khiaw is not mislabelled Luang Prabang** — `photo-0659` is `place: Nong Khiaw`,
  `photo-0703` is `place: Luang Prabang`; both names appear correctly in the Laos Story.
- **Japan: no contamination** — all 203 public Japan photographs fall inside 12 May – 27 June 2025.
- 10 public photographs carry no destination; they also carry no country or place claim, so they
  assert nothing.

### Console

Site-caused errors: **0** across all sampled routes. The one error recorded during the session was my
own deliberate 404 probe.

---

## Known harmless warnings

**Two font-preload warnings** (`barlow-condensed-regular.woff2`, `literata-italic.woff2`) — investigated
rather than assumed:

- Both preloads are correct: `as="font"`, `type="font/woff2"`, `crossorigin` present.
- Both files are genuinely fetched via the preload and reach `status: "loaded"`.
- Both faces are genuinely used: Barlow Condensed is the display face; **Literata italic is the
  ELSEWHERE wordmark itself** (`.wordmark`, `.footer-wordmark`), on every page.
- `literata-regular` is served from cache (transferSize 0).

This is a known Chromium heuristic false positive: with `font-display: swap`, text layout can settle
after the "used within a few seconds of load" window. Removing the preloads would delay first paint
of the wordmark and headings for no benefit. **Documented, not changed** — typography stays Barlow
Condensed + Literata as established.

---

## Fixes made during QA

**1 — `scripts/validate-launch.mjs`: detect a placeholder contact address.**

`PUBLIC_CONTACT_EMAIL` is set to `enquiries@elsewhere.example`, an RFC 2606 reserved placeholder
domain. The architecture behaves correctly — a *set* value enables the enquiry path — but the result
is that Studio, Licensing, Contact and the viewer enquiry link all render publicly and invite a
message to an undeliverable address. An unset value would have been safer than this one.

The validator checked only for *unset*, so nothing caught it. It now also fails a reserved
placeholder domain (`.example`, `.test`, `.invalid`, `.localhost`) and reports it as an owner action.
Launch validation now surfaces three owner actions instead of two. No site behaviour changed.

Everything else that could have been "improved" was left alone.

---

## Unresolved owner decisions

**1 — Contact address before production launch.** Set a real `PUBLIC_CONTACT_EMAIL`, or clear it to
hide the enquiry path entirely. This does not affect Japan's publication; it affects going live.

**2 — `PUBLIC_CREATOR_NAME` is unset.** Credit and copyright fall back to "ELSEWHERE" rather than a
named creator. Pre-existing, previously reported.

**3 — `SITE_URL` is local.** Canonicals, Open Graph URLs and both sitemaps currently carry
`http://localhost:4321`. Correct for local review; must be the production origin before launch.
Pre-existing, previously reported.

**4 — No Destination → Journey link exists anywhere.** Journey stories link *out* to their
destination (Japan → `/destinations/japan/`; the others → `/archive/place/…`), but no published
destination page links *back* to its story — not Japan, and not La Réunion, Essaouira or Düsseldorf
either. There is no established pattern to copy, so building one would be new design, which this
phase excludes. Flagged as a genuine editorial decision rather than invented.

**5 — Open Japan Story questions remain open** and are unaffected by publication: the held work
photographs including Keiji-san (q1), the dog that may be Asti (q2), Hanako's name (q3), Keiji-san's
surname (q4), the Agui temple's identity (q5), the Taiko context (q6), whether any 28 May frame is
inside HANAYA (q7), the missing bell photograph (q8), the three people on the hillside (q9), and now
the onsen's identity. None blocks publication; all would improve the chapter.

---

## Validation

```
Content validation      PASS — 716 photos, 12 destinations, 10 journeys, 97 People candidates
Owner exclusions        PASS — 35 rejected, 0 public references, 37 built files, 4 derivative dirs
Launch validation       PASS — 26 public HTML files, unique canonicals, complete social metadata,
                               private route excluded, sitemap and image sitemap consistent
Build                   PASS
Broken assets           0
```

`/curate/` remains absent from `dist/`. No source master was read for anything but rendering; none
was modified, moved or deleted. No image was generated.


---

# Phase 14.6A — Japan discoverability repair + public metadata leak

The owner's browser review after 14.6 found two things this report had got wrong. Both are fixed.

## What I got wrong in 14.6

I checked destination pages for a `/journey/…` link, found none on any of them, and concluded no
Destination → Journey pattern existed. The pattern does exist — it just lives in a different
template. `journeyStoryForDestination()` has always rendered a house "Read the story →" link on
`/archive/place/<slug>/`, which is where Malaysia, Thailand, Laos and Phu Quoc are reachable,
because none of those four is a published destination chapter.

**Japan is the first destination that is both a published chapter and has a published Story.** It
gets `/destinations/japan/` and therefore no `/archive/place/japan/` page — so the only route that
had ever carried the link was never generated for it. Japan was published and reachable at
`/journey/japan/` and from `/journey/`, but invisible from its own destination page.

I also failed to flag a sentence I had seen in my own screenshot.

## Fix 1 — internal metadata leaking as public copy

`src/pages/destinations/[slug].astro` rendered, on Japan and La Réunion:

> "Country confirmed by the owner's travel timeline. Cities and regions remain intentionally unassigned."

That is data-model vocabulary — "the owner", "travel timeline", "intentionally unassigned" — in a
reader-facing position. Its own sibling string, used for region-level chapters, already said
"the photographer's travel record", which is the house public register. The country-level string was
the odd one out.

Both strings now read in that register, with no new travel copy invented:

> "Country confirmed by the photographer's travel record. Individual cities and regions are not named."

Public instances of the leaked sentence: **0**. This also fixed La Réunion.

## Fix 2 — Destination → Journey link

`journeyStoryForDestination()` is now resolved in the destination template and rendered as the same
`editorial-link` "Read the story →" used on the archive-place route, inside the existing provenance
block. No new component, no banner, no card. It appears only where a published Story exists, so
Japan shows it and La Réunion, Essaouira and Düsseldorf correctly do not.

## Full-site leak sweep

Scanned every built HTML page for internal vocabulary (`owner timeline`, `location confidence`,
`storyCandidate`, `OWNER_REVIEW`, `internalNotes`, `sourcePath`, `CONFIRMED_OWNER_RANGE`,
`do-not-publish`, `assets-source`, and 20 more), excluding inline scripts and JSON-LD.

**Other reader-facing leaks found: 0.** The only match, "provenance", occurs solely as CSS class
names (`destination-provenance`, `journey-provenance`) and inside the accessible label
"How this story is sourced", which is correct public language.

## Proof

| Check | Result |
| --- | --- |
| `/journey/japan/` direct | 200, `<h1>Japan</h1>`, kicker "The Journey — 05", 29 photographs |
| `/journey/` lists all five | malaysia, thailand, laos, phu-quoc, japan |
| Clicked Japan on the index | navigated to `/journey/japan/`, Story rendered |
| Japan Destination → story | "Read the story →" → `/journey/japan/` → 200, kicker 05 |
| Phu Quoc → next | "Next · The Journey — 05 Japan" |
| Japan → previous | "Previous · The Journey — 04 Phu Quoc" |
| Japan next | none; no Story 06 anywhere |
| Leaked sentence | absent from every page |
| 390px | 0 overflow on all four routes; story link visible on Japan Destination |
| Broken internal links / images | 0 / 0 |

Japan Story copy: unchanged. Japan photo sequence: unchanged — `src/data/journey.ts` was not
touched in this phase.
