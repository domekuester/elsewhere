# Phase 9.29 — destination hero correction

## What was actually wrong

The four published chapters were never sharing a hero. Japan, Essaouira, La Réunion and Düsseldorf each
render their own photograph and always did.

The repetition was real, but it was one level down. Malaysia, Thailand, Phu Quoc and Laos have no
chapter pages — they appear on `/destinations/` under "IN THE ARCHIVE", and those rows linked to
`/archive/?destination=<slug>`. That is the Archive page, which since Phase 9.28A opens on a full-bleed
photograph of churning water. **Four different places, one generic water image, no name, no dates.**
Clicking "Malaysia" gave you an Archive frame with the word "Archive" over it.

Phase 9.28A introduced that: before it, the same click landed on a typographic page, which was wrong in
a quieter way. The brief's description — "a random archive wave/water image", "one fallback image across
multiple destinations", "Malaysia must use a real Kuala Lumpur image" — is an accurate reading of it.

## The fix

Places with photographs but no chapter are now addressable: **`/archive/place/<slug>/`**, one static
route each, generated from the destination data. Each opens on a photograph from **its own** body of
work, under **its own** name, in the Japan grammar — full-bleed image, title lower-left, place and date
lower-right, the Phase 9.27 scrim and per-breakpoint focal system. The destinations index now links
there. The `?destination=` query path still works for anything that already used it.

These are not chapters and are not presented as such: a chapter is a curated sequence with authored alt
text, and these four do not have one yet. They are the archive, filtered, opening honestly.

## Heroes selected

| Route | Hero | Source | Why it won |
| --- | --- | --- | --- |
| `/archive/place/malaysia/` | `photo-0060` · P1030627.jpg · 4000×3000 | Malaysia | The Kuala Lumpur skyline over the tree canopy — the frame in Malaysia's body of work that reads as KL and still leaves a wide, quiet band for the title. Replaces `photo-0036` (2048px, below the fidelity floor). |
| `/archive/place/thailand/` | `photo-0680` · IMG_8674.jpg · 4000×3000 | Thailand (new folder) | Limestone karsts over a calm bay under heavy cloud. Unmistakably Thailand, empty foreground water for the title. Beat `photo-0005` (red pier), a stronger photograph that crops hard at desktop width. |
| `/archive/place/laos/` | `photo-0659` · IMG_0180.jpg · 4000×3000 | Laos (new folder) | A river bend through mountains past a village. The first frame that lets Laos open at full bleed at all — before the new folder it had three photographs and no landscape. |
| `/archive/place/phu-quoc/` | `photo-0072` · P1200152 Kopie.jpg · 4000×2672 | Phu Quoc | A jetty running into flat yellow light. **Replaces a null `heroPhotoId`** — this destination had no hero record at all. Beat `photo-0009` (the rower), a better photograph with nowhere dark for the title. |

Removed in the process: the Archive's `photo-0182` water frame standing in for all four places. It stays
where it belongs, on `/archive/` only.

### Kuala Lumpur — one thing to confirm

You asked for a real Kuala Lumpur image, and `photo-0060` is one: Petronas, Menara KL and Merdeka 118 are
all in it. But **no Malaysia photograph in the archive carries a confirmed city** — `place` is null on all
57, and the Story 01 pack lists this as a blocking question. So the frame opens the page and the page is
titled **Malaysia**. It is not labelled Kuala Lumpur anywhere. Confirm the city and the caption can follow.

## Root cause removed

- Places resolve their hero from **their own destination record**, never from a surface default.
  `data/destinations.json` → `hero.photoId`; the Archive's own frames live in `data/surface-heroes.json`.
  There is no path by which one image can serve two places.
- `phu-quoc` had `heroPhotoId: null`; every destination with photographs now has a hero record.
- The hero derivative generator covers any destination with an opening, not only published ones.
- A new destination gets a route, a hero and a ladder from data alone.

## Two defects found during QA and fixed

1. **Malaysia's opening said "517 frames".** The client script only applied the initial destination
   filter when a query parameter was present, so a `/archive/place/` page rendered the full archive count
   and grid. Now reads 57 / 47 / 8 / 20 correctly.
2. **Dates read "2024—2024".** Owner ranges recorded as "approximately" now print as a year, or a span of
   years, instead of a false-precision duplicate. Precise ranges still print in full.
3. Hero filenames are sanitised — `P1200152 Kopie.jpg` produced a `%20` in the Open Graph tag that the
   launch validator could not resolve.

## QA

    BUILD:                        PASS   (20 public HTML files, up from 16)
    CONTENT:                      PASS
    OWNER EXCLUSIONS:             PASS   (24 rejected, 0 public references)
    LAUNCH / SEO:                 PASS   (new routes in sitemap, unique canonicals, OG images resolve)
    HERO UNIQUENESS:              13 surfaces, 13 unique images, 0 duplicates
    DESKTOP 1440:                 PASS   all four, title lower-left, metadata lower-right
    MOBILE 390:                   PASS   all four, no overflow, no collision, counts correct
    PHASE 9.27 CHAPTERS:          UNCHANGED — Japan, Essaouira, La Réunion, Düsseldorf identical
    HOME:                         UNCHANGED

Measured at 1440: title at the 46px gutter left, metadata at the 46px gutter right, on every one.

## Still awaiting owner approval

All four new heroes are `AUTO_SELECTED`, not owner-approved. Swapping any of them is one photo ID in
`data/destinations.json` plus `npm run images:heroes` — no CSS.

Still blocked by source or by a question, not by this phase:

- **Chapters.** These four still have no curated sequence or alt text, so they remain archive views
  rather than chapters. Laos is the closest — 8 frames, enough to publish, needing a sequence and a
  consent decision on `photo-0537`.
- **Kuala Lumpur labelling**, above.
- **`photo-0671` / `photo-0668`**, the two frames held in Phase 9.28A.
