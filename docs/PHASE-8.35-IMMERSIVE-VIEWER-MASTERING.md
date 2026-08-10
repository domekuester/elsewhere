# Phase 8.35 — Immersive Viewer Mastering

## Preserved core

The viewer remains a black, contained viewing room with centered photography, correct aspect ratio, complete composition, scroll locking, and the existing spatial opening relationship.

## Refinements

- viewer-specific high-resolution derivatives remain distinct from archive thumbnails
- only previous and next viewer sources are preloaded
- count and controls use quieter editorial styling
- secondary desktop chrome recedes after 2.6 seconds and returns on pointer or keyboard activity
- mobile controls remain continuously visible
- empty captions remain silent; no placeholder copy is shown
- metadata is limited to confirmed caption, destination, and year
- close uses a short opacity exit, then restores the exact scroll position and initiating focus
- Escape, arrows, buttons, backdrop, and swipe behavior share the same active collection

## Context

Black & White Archive viewer count is `036`, general Archive viewer count is `500`, and navigation stays inside the entry context. The implementation does not preload the complete archive.
