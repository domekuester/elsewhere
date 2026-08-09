# ELSEWHERE image pipeline

## Immutable source

`assets-source/photos/` contains master material and is never modified. `.photo-inventory-cache/` is regenerable internal review material. `public/assets-derived/` contains regenerable public delivery assets. Editorial exclusions are read before generation; owner-rejected work cannot re-enter public output through a rebuild.

## Implemented delivery roles

| Role | Maximum dimension | JPEG quality | Chroma | Use |
| --- | ---: | ---: | --- | --- |
| THUMB | 960 px | 84 | 4:2:0 | Archive/contact-sheet index |
| ARCHIVE / DISPLAY | 1800 px | 86 | 4:4:4 | Medium editorial frames and destination sequences |
| VIEWER / HERO | 3200 px | 90 | 4:4:4 | Immersive viewer and destination chapter hero |

All roles use decoded orientation, `fit: inside`, and `withoutEnlargement`. Embedded ICC profiles are retained. No global visual filter, artificial sharpening, or source upscaling is applied. `public/assets-derived/PIPELINE.json` records the reproducible settings.

The catalog exposes a separate `thumbnail`, `archiveImage`, and `viewerImage`. The viewer never reuses the contact-sheet or archive role. It first displays a temporary contained thumbnail preview, then reveals the decoded viewer asset. The main image remains `object-fit: contain`, centered inside the usable dynamic viewport.

## Commands and validation

- `npm run images:derive` regenerates all three roles from read-only masters, removes forbidden derivatives, and rebuilds the public catalog.
- `npm run images:repair-inventory` decodes missing master dimensions and rebuilds the catalog.
- `npm run validate:content` verifies every public role exists at its expected dimension, rejects private fields, and proves owner-rejected assets have no public derivative.
- `scripts/build-photo-catalog.mjs` removes orphan JPEG derivatives so old filenames or prior selections cannot remain directly reachable.

The current public catalog contains 500 photographs and exactly 500 files in each delivery role. Archive rendering remains incremental at 24 frames. Viewer assets are fetched only after intent; no mass viewer preload occurs.

## Performance and fidelity policy

Photography is the product. A high-density display receives enough decoded pixels for the rendered slot where the master permits it, while index browsing remains substantially lighter. The largest viewer files are exceptional high-detail frames; only one is loaded at a time. Curated Astro surfaces continue to produce responsive WebP candidates with explicit sizes.
