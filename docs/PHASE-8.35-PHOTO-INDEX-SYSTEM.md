# Phase 8.35 — Photo Index System

## Meaning

The three-digit value is the stable public archive index stored as `photo.index`. It is not the current filtered position and does not change when filters, incremental loading, or viewer context change.

## Presentation

- Barlow Condensed with tabular numerals
- neutral near-black index and lower-contrast year
- shared baseline beneath the image edge
- ultramarine appears only on hover or keyboard focus
- compact mobile spacing
- `aria-hidden="true"` because the photograph button already has a useful accessible label

The previous always-bright-blue number treatment is removed. Ultramarine remains a signature interaction cue rather than repeated debugging-like metadata.
