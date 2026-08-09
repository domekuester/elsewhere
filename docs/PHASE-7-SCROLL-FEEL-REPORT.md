# Phase 7 — scroll feel report

## Problem

Lenis used a 1.05-second interpolation with a reduced wheel multiplier. Combined with scrubbed hero parallax and long reveal durations, the interface visibly lagged behind physical input.

## Implemented repair

- Removed Lenis from the public runtime; wheel and touch input now use native browser scrolling.
- Removed the scrubbed hero parallax.
- Changed global anchor scrolling from `smooth` to `auto`.
- Reduced hero text entrance from 1.2s to 0.82s and image settling from 2s to 1.25s.
- Reduced photographic reveals from 1.15/1.5s to 0.72/0.95s.
- Moved reveal thresholds from 88% to 94% so imagery responds sooner.
- Reduced premise and memory-marker delays and staggers.
- Preserved the existing deferred motion loader and complete reduced-motion composition.

Lenis remains installed for project compatibility but is not imported, initialized, or shipped by the current public motion module. Motion is an enhancement; Archive intentionally ships with page motion disabled.
