# ELSEWHERE Motion System

## Direction

Motion behaves like an edit: reveal the frame, settle the image, then allow text to arrive. It should never delay access to content or make scrolling feel owned by the interface.

## Current vocabulary

- Hero title rises once, after the photograph is visible.
- Hero photography settles from `1.025` scale in 1.25 seconds. It does not drift after input.
- Editorial photographs open through a vertical clip reveal while their image scale settles from `1.045`.
- Premise copy enters in a short stagger.
- Ultramarine memory marks draw from left to right.
- Hover movement is limited to a subtle `1.025` image scale and directional link shifts.
- Mobile menu uses opacity and vertical movement, not elastic or spring effects.
- Archive selection uses one signature spatial transition: the chosen frame expands into the immersive viewer, preserving the feeling of entering that photograph.
- Viewer next/previous changes are immediate and quiet; the photograph, not a carousel animation, remains dominant.

GSAP and ScrollTrigger are used only for photographic sequencing. Phase 7 removed Lenis from the public runtime after owner feedback identified perceptible input latency. Wheel, touch, anchors, and keyboard now use native browser scrolling.

## Reduced motion

When `prefers-reduced-motion: reduce` is active, GSAP and ScrollTrigger are not initialized. CSS animation and transition durations collapse, native scrolling remains available, and no content begins hidden. The complete page was visually verified in this mode at desktop and mobile sizes.

## Performance guardrails

- No infinite animation.
- No scroll-jacking or pinned narrative chapters.
- No per-frame layout properties.
- Transform, opacity, scale, and clip-path are the only animated visual properties.
- Below-fold assets retain native lazy loading.
- Future page transitions must preserve focus, browser history, reduced motion, and image loading priority.

## Motion budget

| Class | Purpose | Budget |
| --- | --- | --- |
| Essential | menu state, viewer entry/exit, focus continuity | 0–720ms; never blocks access |
| Supportive | photographic reveal and title arrival | 450–950ms; transform/opacity/clip only |
| Decorative | memory-line draw or rare ambient accent | at most one visible motif per chapter |

Primary easing is `cubic-bezier(.16, 1, .3, 1)`. Staggers remain under 120ms per item and must not turn an image sequence into a queue. No animation owns scrolling. The archive viewer uses the Web Animations API instead of adding another library; reduced-motion bypasses the spatial transition and opens the native dialog immediately.
