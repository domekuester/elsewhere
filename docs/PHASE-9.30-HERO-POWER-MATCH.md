# Phase 9.30 — destination hero power match

## What actually separates the benchmark heroes

Measured rather than assumed. Every hero derivative sampled for mean luminance, standard deviation,
2nd–98th percentile range and mean saturation:

| Hero | meanL | stdev | range | saturation |
| --- | --- | --- | --- | --- |
| Japan | 49.3 | 44.1 | 151 | **0.37** |
| Düsseldorf | 111.1 | 43.4 | 174 | **0.82** |
| Essaouira | 125.0 | 53.1 | 183 | **0.52** |
| *benchmark average* | *95.2* | *46.9* | *169* | ***0.57*** |
| La Réunion (before) | 91.9 | 67.0 | 212 | 0.22 |
| Malaysia (before) | 123.9 | 64.7 | 185 | 0.22 |
| Thailand (before) | 107.7 | 52.7 | 190 | 0.22 |
| Laos (before) | 82.2 | 73.5 | 193 | 0.19 |

**The weaker heroes were not flat.** Laos had a *higher* global contrast and a *wider* tonal range than
all three benchmarks. The intuition that it looked flat was right; the reason was wrong.

Two things actually separate them:

1. **Colour presence.** The benchmark heroes average 0.57 saturation and each has a colour identity you
   could name — Düsseldorf's red-on-blue, Essaouira's ochre, Japan's warm signage. The weak set sat at
   0.19–0.22: muted greens and greys.
2. **One unmistakable subject.** Japan has a canal driving into a wall of signs. Laos had a village a few
   hundred pixels wide inside a hazy valley. Global contrast came from sky-versus-mountain, not from
   anything you were meant to look at.

That diagnosis decided the treatment: **Laos needed a different photograph, not a grade.** Malaysia and
Thailand needed haze correction, which is a real optical problem, not a look.

## Decisions

| Destination | Action | Hero | Reasoning |
| --- | --- | --- | --- |
| **Laos** | **REPLACED** | `photo-0659` → **`photo-0663`** | Two monks in saffron walking past a black Mercedes in late light. Colour identity, a single clear subject, depth down the pavement. Now measures 64.7 / 44.4 / 167 / **0.35** — almost exactly Japan's 49.3 / 44.1 / 151 / 0.37. |
| **Malaysia** | **MASTERED** | `photo-0060` kept | Haze lift `linear(1.13, −13)` + 5% colour. Long lens across humid city air; the veil is atmosphere between camera and subject, not the photograph. stdev 64.7 → 73.1, range 185 → 209, saturation 0.22 → 0.29. |
| **Thailand** | **MASTERED** | `photo-0680` kept | The same correction at half strength, `linear(1.08, −8)` + 4%. The scene is genuinely monochromatic teal and stays that way; only the haze in front of the karsts comes back. stdev 52.7 → 56.9. |
| **Phu Quoc** | kept, ungraded | `photo-0072` | Already at 0.48 saturation and 251 range — the widest on the site. Nothing to fix. |
| **La Réunion** | kept, ungraded | `photo-0442` | Lowest saturation left on the site at 0.22, and deliberately so: it is a cloud-covered volcanic cirque. stdev 67 and range 212 give it plenty of force without inventing colour that was never in the light. |
| **Japan / Düsseldorf / Essaouira** | untouched | unchanged | Benchmarks. No grade, no crop change, byte-identical. |

## What "mastering" means here, precisely

Grades live in `data/destinations.json` under `hero.grade` and are applied **only when the hero
derivative is generated**. Source masters are never touched. Deleting the block restores the untouched
frame on the next `npm run images:heroes`. Each grade carries a `gradeNote` saying why.

Two operations, both restrained:

- `linear(a, b)` — a black-point and density correction. This is the printer's move: take back the veil,
  restore separation.
- `modulate({ saturation })` — 4–5%, enough to undo what haze removed, not enough to recolour a place.

**Rejected during testing:** a local-contrast (CLAHE) variant and a stronger colour variant for Malaysia.
Both were rendered in the real hero crop and compared side by side; both began showing an HDR signature
in the cloud edges and pushed the greens acidic. Neither shipped. The comparison sheet is at
`.playwright-mcp/phase-9.29/malaysia-grade-options.jpg`.

Nothing was added, removed, extended or generated in any photograph.

## Final ranking after the pass

1. **Japan** — still the standard.
2. **Düsseldorf** — the most graphic.
3. **Laos** — the biggest change in the phase; now genuinely in the benchmark league.
4. **Essaouira** — the most distinctive light.
5. **Phu Quoc** — strongest colour of the place pages.
6. **Malaysia** — much improved; a wide skyline is inherently a quieter opening than a street.
7. **Thailand** — improved; atmospheric by nature.
8. **La Réunion** — visually strong, deliberately the most desaturated.

## QA

    BUILD:                 PASS   (20 public HTML files)
    CONTENT:               PASS
    OWNER EXCLUSIONS:      PASS   (24 rejected, 0 public references)
    LAUNCH / SEO:          PASS
    HERO UNIQUENESS:       10 heroes, 10 unique photographs, 0 duplicates
    DESKTOP 1440:          PASS   title lower-left, metadata lower-right on all
    MOBILE 390:            PASS   Laos in particular is stronger on mobile than desktop —
                                  the portrait source shows the whole street, heads and sky
    BENCHMARKS:            UNCHANGED — Japan, Düsseldorf, Essaouira ungraded and identical
    HOME:                  UNCHANGED

Before/after at `.playwright-mcp/phase-9.29/before-after-1440.jpg` (gitignored, local QA only).

## One judgement call to check

The Laos desktop crop takes the tops of the monks' heads — a portrait frame in a wide band. They are
walking away and unidentifiable either way, and the robes and the car carry the composition, so it reads
as deliberate rather than clipped. Mobile shows the full frame. If you would rather keep their heads at
desktop, the fix is a lower `hero.focal.desktop` value; say the word.

All three changed heroes remain `AUTO_SELECTED`, not owner-approved.
