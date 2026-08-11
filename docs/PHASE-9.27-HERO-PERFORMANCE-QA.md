# Phase 9.27 — hero performance QA

## The problem

The hero is the LCP element of every destination page. Before this phase it was a bare
`<img src={hero.viewerImage}>` with no `srcset`: every device downloaded the 3200px viewer
derivative. A 390px phone fetched 2.1 MB to paint Essaouira.

The viewer role could not simply be shrunk — it exists for the immersive full-screen reader and has to
stay at 3200. So the hero got its own role.

## The hero ladder

`scripts/generate-hero-derivatives.mjs` → `public/assets-derived/hero/`, manifest at
`HERO-PIPELINE.json`. Run via `npm run images:heroes`, and as the last step of `npm run images:derive`.

Widths 768 / 1152 / 1536 / 2048 / 2560. Quality ramps down as width grows — 86, 85, 83, 80, 77 —
because a 768px hero is near 1:1 in the hand while a 2560px one is always downscaled into a cropped,
partly scrimmed backdrop. Chroma stays 4:4:4 throughout: several heroes carry saturated colour detail
(red bridge cables, Dotonbori signage) that subsampling smears. ICC profiles are kept and no sharpening
or grading is applied, per the existing pipeline policy.

Only published chapters generate derivatives. Provisional heroes for unopened chapters would be
unreferenced weight in `public/`.

## `sizes` is not a layout width

A full-bleed `object-fit: cover` box paints the photograph wider than the viewport whenever the image
is less tall than the screen. The painted width is `max(viewportWidth, viewportHeight × aspectRatio)`:
a landscape frame on a 390 × 844 phone paints about 1263px — 324vw. `sizes="100vw"` would under-request
by a factor of three and deliver a visibly soft hero.

    sizes="(max-width: 560px) 165vw, (max-width: 900px) 150vw, 100vw"

These sit deliberately below the widest case. Matching a 3× phone exactly would ship the 2560px file to
paint a cropped backdrop that a scrim covers half of. As written, a 2× phone lands on 1536 and a 3×
phone on 2048.

## Delivered weight

| Chapter | Before, every viewport | 390 @2x | 390 @3x | 768 @2x | 1440 @1x | 1440 @2x |
| --- | --- | --- | --- | --- | --- | --- |
| Japan | 1379 KB | 504 KB | 698 KB | 877 KB | 504 KB | 877 KB |
| Essaouira | 2141 KB | 266 KB | 425 KB | 603 KB | 266 KB | 603 KB |
| La Réunion | 1377 KB | 304 KB | 430 KB | 555 KB | 304 KB | 555 KB |
| Düsseldorf | 2385 KB | 593 KB | 939 KB | 1339 KB | 593 KB | 1339 KB |

**Phone at 3× across the four chapters: 7282 KB → 2492 KB, 66% lighter** — and sharper, because the
delivered pixels now match what is painted instead of being an arbitrary 3200px file scaled down.

Düsseldorf stays the heaviest at every step: fine diagonal cables over a smooth blue gradient is close
to the worst case for JPEG, and dropping chroma would damage the one thing the frame is about.

## Loading strategy

- `loading="eager"` and `fetchpriority="high"` on the hero only. It is in the initial HTML, so the
  preload scanner finds it immediately and a `<link rel=preload>` would add nothing.
- No global hero preloading. Each page prioritises its own hero and nothing else.
- Every frame in the sequence below the fold keeps `loading="lazy"` and `decoding="async"`.
- `width` and `height` remain on the hero `<img>`, so the aspect ratio is known before the image
  arrives and the first viewport does not shift.

## Verification

- `npm run build` — PASS, 17 pages, 16 public HTML files.
- `npm run validate:content` — PASS, including the new hero-block rules.
- `npm run validate:exclusions` — PASS, now across **four** derivative directories: `hero` was added
  to the audited roles, and `destination.hero.photoId` to the audited references. 0 owner-rejected
  public references.
- `npm run validate:launch` — PASS.
- Built output: hero markup carries `srcset`, `sizes`, `fetchpriority`, real alt text and the inline
  art-direction properties on all four chapters; 20 hero derivatives present in `dist`.
- 176 referenced image URLs fetched, 0 broken.
