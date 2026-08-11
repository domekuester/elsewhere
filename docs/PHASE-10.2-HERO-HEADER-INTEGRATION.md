# Phase 10.2 — hero / header optical integration

The owner saw a dark horizontal band across the top of a bright hero and could locate the point where
it ended. This removes it.

## Root cause

Not the gradient. `mix-blend-mode: difference` on `.site-header`.

The header inverted its ink against the photograph. Difference blending only resolves to *light*
type while the backdrop sits below roughly 70/255; over a bright cloud at 230 that needs about .70 of
black behind it. So the hero carried a band held at a near-constant **.72 → .68 for the first 46%**
of its height, and only then ramped to nothing. The band was not serving contrast. It was serving the
blend mode.

Three separate things then made it visible:

1. **A flat slab.** Alpha barely moved for the top ~95px, so that region read as a rectangle rather
   than as a gradient. Measured on Home, the sky was crushed from luminance **220 to 24** and held
   there.
2. **A Mach band at the endpoint.** The ramp was linear and stopped dead, so the first derivative
   jumped from −0.006/px to 0. The eye finds that discontinuity even when the value itself is small.
3. **A UI-shaped height.** The band was exactly `2.1 × (header-safe-top + header-row + header-bottom)`,
   so its edge landed on a header measurement and read as a header.

No border, no box-shadow, no `backdrop-filter` on the header — those were checked and there were
none. Four copies of the same gradient existed (`.hero`, `.destination-hero`, `.journey-hero`,
`.archive-opening`), which is why the defect was uniform across the site.

## What changed

| | Before | After |
| --- | --- | --- |
| Header background (desktop) | none, but `mix-blend-mode: difference` | none, `mix-blend-mode: normal` over photographs |
| Header background (mobile) | `rgba(11,12,13,.94)` always | transparent over the opening, solid once past it |
| Header ink | inverted by blend | `var(--ivory)` + `--header-ink-shadow` |
| Veil peak | `.72` (Home), `--hero-scrim-top` elsewhere | `.60` (Home), `--hero-scrim-top × .62` elsewhere |
| Veil shape | flat to 46%, then linear to 0 | 8 stops tracing `peak × (1 − t)^2.6` |
| Veil depth | `2.1 × header block` ≈ 205px | `--header-veil-depth`, 24rem desktop / 19rem mobile |
| Border / box-shadow / backdrop-filter | none | none |
| Copies of the rule | 4 | 1 |

The blend mode is **kept as the default** and switched off only inside
`body:has(.hero, .destination-hero, .journey-hero, .archive-opening)`. That matters: the blend is
what turns the wordmark dark by itself on the ivory prose pages, and a browser without `:has()`
therefore degrades to exactly the behaviour that shipped before this change rather than to invisible
type.

## The veil curve

`alpha = peak × (1 − t)^2.6`, approximated with eight stops. Both the value and its slope reach zero,
so there is no endpoint to find. Measured directly, with the photograph replaced by flat white and
the ink hidden:

    y:     0     20     40     60     80    100    120    160    200    240    280    320    380
    alpha  .588  .513   .443   .378   .323   .273   .225   .148   .091   .047   .024   .008   0

    steepest slope        1.9 levels/px, at y=21 — at the top, where it belongs
    monotone              yes, across the whole depth
    beyond y=240          changes are 1 level or less, i.e. 8-bit quantisation

The old curve, for comparison, sat at .72 until y≈95 and then fell 0.68 → 0 over 110px into a hard
stop. The new one is already down to .27 by y=100 and is still gently releasing at y=320.

## What the photograph got back

Mean luminance of a sky column, before → after:

| | y=0 | y=40 | y=80 | y=120 | y=160 |
| --- | --- | --- | --- | --- | --- |
| Home (the stress case) | 25 → 44 | 24 → 48 | 26 → 56 | 80 → 134 | 151 → 183 |
| Düsseldorf | 60 → 115 | 67 → 145 | 64 → 148 | 84 → 142 | 123 → 150 |
| Japan | 41 → 78 | 45 → 95 | 44 → 101 | 71 → 119 | 104 → 127 |

Roughly double the sky, through the whole band. Below y≈200 the new veil is fractionally *heavier*
(1–12 levels on a 215-level sky, under 5%) because the tail now runs longer at very low density —
that is the price of having no endpoint, and it is paid where nothing can see it.

## Readability

The type now carries part of the work. `--header-ink-shadow` is a hairline dark edge that hugs the
glyph (`0 0 1px` at .85) plus a wide, very low pool (`0 0 16px` at .42). At 11.8px the edge reads as
slightly denser ink rather than as an effect, and it is what buys the veil the right to be this
light.

Contrast of ivory ink against the photograph behind it, at 1440, measured by hiding the header and
sampling each ink rectangle:

| Hero | wordmark | weakest nav item |
| --- | --- | --- |
| Home | 4.26 | 2.88 |
| Japan | 7.76 | 7.11 |
| Düsseldorf | 7.27 | 7.24 |
| Essaouira | 7.92 | 7.54 |
| Malaysia | 5.33 | 3.78 |
| Laos | 16.43 | 4.83 |
| Journey / Malaysia | 15.48 | 15.97 |
| Archive | 9.26 | 12.22 |
| Black & White | 11.50 | 3.69 |

**Home is the one that is genuinely tight**, and it is stated rather than hidden: 2.88 from the veil
alone on the palest nav item. That figure ignores the ink shadow, which a ratio cannot model, and the
frame reads confidently at 1:1 — but it is the reason Home carries its own higher veil.

## Per-hero control

Reused, not invented. Every opening already carried `--hero-scrim-top` from Phase 9.27, and each now
derives `--header-veil` from it at `× .62`, so the relative art direction of every chapter survives
at a little over half the density. Home has no data-driven hero config and declares `--header-veil:
.6` directly — it is measurably the brightest opening on the site, the only one with a near-white
cloud bank running directly under the navigation.

## Mobile

The mobile header is `position: fixed`, so it has to be solid once arbitrary content passes beneath
it — but not while it is still sitting on the opening photograph. `data-over-opening` is toggled by
an **IntersectionObserver on the opening element**, not a scroll listener: nothing runs on the scroll
thread and native scrolling is untouched. The menu forces the solid state regardless, because the
panel needs a lid.

    at the top        background transparent, ivory ink + shadow, cloud runs to the top edge
    at the boundary   background transparent (the observer has not fired yet)
    scrolled past     background rgba(11,12,13,.94)

`background-color` and `text-shadow` both transition over .32s, and the ink colour is ivory in both
states, so there is nothing to pop. The crossfade happens against the bottom edge of the photograph.

## QA

    BUILD:               PASS   22 pages, 21 public HTML files
    CONTENT:             PASS   689 photos
    PRIVACY:             PASS
    OWNER EXCLUSIONS:    PASS   24 rejected, 0 public references
    LAUNCH / SEO:        PASS
    BROKEN ASSETS:       0
    CONSOLE:             clean at every width and on every hero
    VISIBLE SEAM:        0 — verified visually and by an isolated veil profile
    REDUCED MOTION:      0 hidden elements
    KEYBOARD:            unchanged, every stop focus-visible

Rendered at 1600, 1440, 1280, 1100, 1024, 430, 390, 375 and 320 across Home, Japan, Düsseldorf,
Essaouira, La Réunion, Malaysia, Thailand, Laos, Phu Quoc, Archive, Black & White Archive and the
Malaysia Journey.

Non-photographic pages — About, Studio, Licensing, Destinations index, People, the Black & White
collection — keep the difference blend and were checked to be pixel-unchanged.

**Safari:** not tested natively. Driving Safari needs `safaridriver` enabled by the user, which is
not available here. Everything above is Chromium. The two things that would differ in WebKit are
alpha compositing of a long low-density gradient and `:has()` support (Safari 15.4+); no
`backdrop-filter` is involved anywhere, which removes the usual WebKit compositing-seam risk.
**This is a Chromium result, not a Safari one.**

## Not touched

Photography of any kind — no hero replaced, recropped, refocused or regraded. THE JOURNEY layout, the
Malaysia story sequence, the George Town correction, the Laos crop, People, Black & White, the viewer,
archive composition, the image pipeline, SEO architecture, fonts, spacing, and native scroll.
