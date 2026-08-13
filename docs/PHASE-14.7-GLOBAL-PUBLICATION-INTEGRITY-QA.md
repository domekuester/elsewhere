# Phase 14.7 — global publication integrity

Two owner-reported problems, both real, both fixed. Then the whole public site was re-verified.

---

## Problem 1 — Japan discoverability

**Root cause.** `journeyStoryForDestination()` renders the house "Read the story →" link, but it was
wired only into the **archive-place** template. Malaysia, Thailand, Laos and Phu Quoc are reachable
that way because none of them is a published destination chapter. Japan is the first destination
that is both a published chapter *and* has a published Story, so it gets `/destinations/japan/` and
**no `/archive/place/japan/` page is generated** — the only route that had ever carried the link was
never built for it.

Japan was genuinely published and reachable at `/journey/japan/` and from `/journey/`, but invisible
from its own destination page. My Phase 14.6 report checked destination templates, found no link on
any of them, and wrongly concluded no pattern existed. It exists; it was in the other template.

**Fix** (applied in 14.6A, verified again here): the destination template now resolves
`journeyStoryForDestination(destination.id)` and renders the same `editorial-link` "Read the story →"
inside the existing provenance block. No new component, no banner, no carousel. It appears only where
a published Story exists — Japan shows it; La Réunion, Essaouira and Düsseldorf correctly do not. Any
future destination that gains a Story picks it up automatically, so the gap cannot recur.

## Problem 2 — internal photo metadata rendered publicly

The owner was right that this was not one sentence. There were **two** separate leaks.

**Leak A — the provenance sentence.** `src/pages/destinations/[slug].astro` printed:

> "Country confirmed by the owner's travel timeline. Cities and regions remain intentionally unassigned."

on Japan and La Réunion. Data-model vocabulary in a reader-facing position. Its own sibling string
for region-level chapters already used the house public register, "the photographer's travel record",
so the country-level string was simply the odd one out. Both now read:

> "Country confirmed by the photographer's travel record. Individual cities and regions are not named."

**Leak B — the curatorial taxonomy under every destination photograph.** This is what the owner meant
by "throughout the website". The destination figcaption rendered:

```
{index} {photo.year} · {photo.visualWorlds.join(', ')}
```

producing captions like **"02  2025 · urban"**, **"11  2025 · ocean, people"**, **"08  2025 · black
and white, urban"** under photographs on **all four published destination pages** — Japan, La Réunion,
Essaouira and Düsseldorf. `visualWorlds` is an internal curatorial facet
(`visualWorldConfidence: CURATORIAL_ASSIGNMENT`) whose real job is driving archive filters and counts.
Printed beneath a picture it read exactly as the owner described: a database record attached to a
photograph.

**Shared fix.** The taxonomy is removed from the public caption at the single shared render point.
The caption keeps its sequence number and year. The field is untouched in the data and still drives
archive filtering, the People count and the black-and-white image sitemap — it simply no longer
renders as prose. No per-photograph string was edited and no ID was hardcoded.

### Legitimate captions preserved

Every remaining rendered caption on the site is hand-authored. Verified by extracting all 56 distinct
figcaption strings and classifying them:

- **Journey stories:** "Kuala Lumpur · 2024", "George Town, Penang · 2024", "Pulau Kapas · 2024",
  "Krabi · 2024", "Koh Phayam · 2025", "Koh Chang · 2025", "Nong Khiaw, Laos · 2024"
- **Home:** "A bright interruption", "A small form in the living world", "Gesture before movement"
- **People:** "Work · Thailand", "Last light · La Réunion", "Attention · Japan", "Waiting · Japan", …
- **Black & White:** "Presence", "Distance", "Stillness", "City weather", "Toward light", …
- **About:** "Some places resist categories"

Captions containing internal vocabulary: **0**. Captions printing the taxonomy: **0**.

---

## Verification

### Japan

| Check | Result |
| --- | --- |
| `/journey/japan/` direct | 200, `<h1>Japan</h1>`, kicker "The Journey — 05", 29 photographs, `index, follow` |
| `/journey/` lists all five | malaysia, thailand, laos, phu-quoc, japan |
| Clicking Japan on the index | navigates to `/journey/japan/`, Story renders |
| Japan Destination → story | "Read the story →" → `/journey/japan/` |
| Phu Quoc → next | `/journey/japan/` |
| Japan → previous | `/journey/phu-quoc/`; no next; no Story 06 anywhere |

Fact lock — all thirteen verified in the rendered page: Renjun in English · fashion designer · mother
of Shinku · Keiji-san as boss and operator · bike to the lighthouse, not the far north · occasional
meal invitations · Kotaro flute · Sami flags · Hanako drum · onsen frequent · onsen unnamed ·
supermarket · Journey 10 present. Stale wording from before the corrections: **0**.

### Full site — 25 public routes, rendered at 1440 and 390 (50 renders)

| Check | Result |
| --- | --- |
| Horizontal overflow | **0** |
| Broken images | **0** |
| Broken internal links | **0** |
| Reader-facing internal metadata | **0** |
| Taxonomy captions | **0** |
| `h1` anomalies | **0** |
| Owner-rejected public references | **0** (canonical register: 35) |
| Source masters served / modified | **0 / 0** |
| `<img>` missing an alt attribute | **0** of 335 |
| Site-caused console errors | **0** |

Surfaces: Home, Journey index, all five Stories, Destinations index, four destination chapters,
Archive + four place archives + B&W archive, Collections, People, Studio, Licensing, About, Contact,
404 — all pass. 404 returns a real 404 with a route home and no stack trace.

Mobile navigation at 390: toggle opens, six links visible and legible, closes cleanly, no trapped
scroll state, page scroll still works afterwards. Native scrolling intact (`scroll-behavior: auto`,
no scroll-hijacking library). Header seams: **0** — the header is transparent and absolutely
positioned, with readability coming from each hero's own scrim.

Geography corrections intact: the two Thailand frames rescued from Phu Quoc still carry
`OWNER_CONFIRMED`; Nong Khiaw is not mislabelled Luang Prabang; all 203 public Japan photographs sit
inside the Japan window.

---

## Known harmless warnings

Two font-preload warnings (`barlow-condensed-regular.woff2`, `literata-italic.woff2`). Investigated
in 14.6: both preloads are correctly formed, both files are fetched and reach `status: "loaded"`, and
both faces are genuinely used — Literata italic *is* the ELSEWHERE wordmark. A Chromium heuristic
false positive under `font-display: swap`. Documented, unchanged.

---

## Pre-launch configuration — owner action required

These are configuration values, not bugs. None blocks Japan; all block production launch.

1. **`PUBLIC_CONTACT_EMAIL` is a placeholder** — `enquiries@elsewhere.example`, an RFC 2606 reserved
   domain. Because the variable is *set*, every enquiry affordance across Studio, Licensing, Contact
   and the viewer renders publicly and invites mail that cannot arrive. An unset value would be safer.
   Set a real address, or clear it to hide the enquiry path. The launch validator now detects this
   (added in 14.6).
2. **`SITE_URL` is `http://localhost:4321`** — canonicals, Open Graph URLs and both sitemaps are not
   production values.
3. **`PUBLIC_CREATOR_NAME` is unset** — credit and copyright fall back to "ELSEWHERE".
4. **Legal identity** — no legal/privacy route exists in the current route set. Not fabricated here;
   flagged for the owner to decide what is required.

---

# Phase 14.7A — the leak I kept missing

The owner checked again and the internal copy was still there. My previous sweeps were false
positives, and the reason is worth recording: I searched for the strings I *expected* ("intentionally
unassigned", "owner timeline") instead of reading what the page actually said. The real text says
"owner **travel** timeline" and "owner-confirmed", which my term lists never matched. Worse, I wrote
the Japan provenance paragraphs myself in Phase 14 and then looked past them in my own screenshots
for six phases, because the other four published stories had the same block and I read it as
intentional design.

It was not design. It was working notes printed next to the photographs.

## Three root causes

**1 — `<section class="journey-provenance">`, on all five Journey stories.**
The template rendered `story.provenance[]`: how the chapter was sourced, which names carry permission,
what was checked against public sources, what was deliberately left unnamed. Editorial method, privacy
review and research verification, published as body copy under every story hero.

*Fix:* the section is no longer emitted. `provenance` stays in `journey.ts` as the internal audit
trail it always was — six arrays, untouched.

**2 — `<section class="destination-provenance">`, on all four destination chapters.**
Two paragraphs: a location-confidence note ("Country confirmed by the photographer's travel record…")
and an inventory sentence ("203 photographs belong to this destination period. This chapter is a
curated passage through them."). The second is publication-system language — how many rows the
chapter drew from and how it was assembled.

*Fix:* neither paragraph is emitted. The band survives only when it has something real to carry —
the link into the Journey chapter — and is skipped entirely on destinations without a published
story, so no empty band is left behind. The old CSS rules were removed rather than left dangling.

**3 — `/destinations/` index kicker read "Place index · owner-confirmed".**
*Fix:* "Place index".

## Not a CSS cheat

None of this is hidden with `display: none`. The strings are absent from the generated HTML, so they
are gone for search engines, screen readers and view-source as well as for the eye. Verified by
grepping the built output, not the source.

## Verification

| Check | Result |
| --- | --- |
| "trusted owner travel timeline" in built HTML | 0 pages |
| "owner-confirmed" | 0 |
| "with owner permission" | 0 |
| "held pending explicit image consent" | 0 |
| "checked against public sources" | 0 |
| "deliberately unnamed" | 0 |
| "photographs belong to this" | 0 |
| "curated passage through them" | 0 |
| `journey-provenance` / `destination-provenance` anywhere in `dist/` | 0 |
| Rendered sweep, 25 routes × 1440 and 390 | 0 leaks, 0 overflow, 0 broken images, 0 empty bands |

**Collateral damage: none.** All five stories keep their prose (Malaysia 905 words, Thailand 938,
Laos 1,046, Phu Quoc 709, Japan 1,990) and their photographs. All 28 authored captions survive —
"Kuala Lumpur · 2024", "Nong Khiaw, Laos · 2024", "A bright interruption", "Work · Thailand",
"Presence" and the rest. `src/data/journey.ts` was not modified.

Japan navigation re-verified after the change: index lists all five, destination links to the story,
Phu Quoc → Japan, Japan → Phu Quoc, no Story 06, 29 photographs, `index, follow`.

The Japan story now runs hero → "Japan was a dream long before I was old enough to fly anywhere on my
own." The destination page runs hero → "Read the story →" → photographs.
