# ELSEWHERE image pipeline

## Immutable source

`assets-source/photos/` contains master material and is never modified. `.photo-inventory-cache/` is regenerable internal review material. `public/assets-derived/` contains regenerable web delivery assets.

## Implemented classes

- **THUMB** — 530 lightweight contact-sheet files copied from the existing inventory cache to `public/assets-derived/thumbnails/`; approximately 22 MB in aggregate, requested progressively.
- **ARCHIVE** — 530 JPEG derivatives capped at 1600px and quality 78 in `public/assets-derived/archive/`; approximately 132 MB in aggregate, fetched only after a viewer selection.
- **DISPLAY/HERO** — curated public surfaces continue to use Astro image processing with responsive WebP widths and explicit sizes.

`scripts/build-photo-catalog.mjs` builds the privacy-safe index and seeds curation assignments. `scripts/generate-archive-derivatives.mjs` creates/resumes archive delivery files. Both preserve masters.

## Budgets

- Above fold: one genuine hero image on Home; Archive initially requests at most 24 thumbnails.
- Hero target: generally below 500 KB per delivered responsive candidate.
- Archive thumbnail target: generally below 120 KB; average is materially lower.
- Viewer: one 1600px frame at a time; no preloading of 530 large files.
- Initial custom JavaScript: keep archive/viewer enhancement below 25 KB compressed; do not add a UI framework.
- Fonts: current system font stacks avoid blocking font downloads.

Future AVIF/WebP archive variants should be generated in the same pipeline when deployment storage/edge negotiation is chosen. The current JPEG derivatives maximize local reproducibility and broad decoding reliability.
