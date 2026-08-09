# ELSEWHERE archive system

## Visual model

`/archive/` is a contemporary contact sheet: an ivory photographic index with frame numbers, honest aspect ratios, selective emphasis only for already curated frames, and an obsidian immersive viewer. It avoids equal-sized cards and uncontrolled Pinterest masonry.

The archive is intentionally not the homepage. It offers depth while Home remains a finite edit.

## Discovery

The current filters are generated from reliable available data: confirmed editorial worlds, capture year, and orientation. Unsupported classifications remain hidden. `Another frame` provides controlled serendipity without inventing relationships.

Initial related-photo intelligence is explicit: same confirmed visual world, destination, year, story, or collection. No visual-similarity claim is made.

## Progressive loading

- 530 records are indexed.
- 24 frames render initially.
- A further 24 render per explicit continuation.
- Contact-sheet images use dedicated 520px-class thumbnails, native lazy loading, stable intrinsic dimensions, `content-visibility`, and containment hints.
- The full catalog metadata transfers once; image bytes are requested only for rendered frames.

At several thousand images, split the generated JSON into static page chunks. The UI contract and URL remain unchanged.

## Immersive viewer

The viewer uses an accessible native `dialog`, 1600px archive derivatives, previous/next controls, Arrow keys, Escape, touch swipe, focus management, live sequence status, and only confirmed metadata. The signature interaction animates the selected frame's geometry into the viewer with the Web Animations API. Reduced-motion users enter immediately.
