# Photography Manifest

## Inventory status

The source library contains **530 readable photographs** across **4.60 GB**. The inventory was generated without moving, renaming, recompressing, or otherwise modifying a master file.

- 408 portrait images
- 120 landscape images
- 2 near-square images
- 523 images captured with a Panasonic DMC-FZ330
- 4 images captured with an iPhone 12 mini
- 3 images without a readable camera model
- Capture dates are present for all 530 records, spanning 20 August 2024 to 28 August 2025
- No embedded GPS coordinates were found
- No EXIF read failures were recorded

The machine-readable source of truth is [`photo-inventory.json`](./photo-inventory.json). Every record includes filename, source path, byte size, dimensions, orientation, aspect ratio, capture date, camera, lens, focal length, aperture, ISO, exposure time, GPS status, dominant color names, and a separate editorial-review object.

## Editorial findings

The archive is unusually portrait-led: 77% of the files are vertical. That is a strategic advantage rather than a limitation. Mobile layouts should give portrait photographs greater authority, while desktop compositions can create rhythm through vertical sequences, diptychs, narrow crops, and occasional panoramic release.

Several coherent visual chapters appeared during the contact-sheet review:

1. Southeast Asian street life, food culture, temples, coastlines, and informal encounters.
2. A sustained beach-boxing encounter with strong gestures and expressive portraits.
3. Japanese cities, spiritual architecture, coasts, details, and quieter observational photographs.
4. A volcanic-island chapter with portraits, dramatic cirques, cloud systems, ocean, rainbows, surf, birds, and sunset.

Destination labels remain blank whenever the image itself and embedded metadata cannot establish a place responsibly. A small Phase 1 selection has been human-reviewed and marked with explicit confidence and evidence. The remaining images retain `needs-human-review`; this is intentional and preferable to fabricated classification.

## Phase 1 hero shortlist

| ID | Filename | Role | Why it matters |
|---|---|---|---|
| photo-0507 | P1300187.jpg | Opening hero | Wide, elemental volcanic landscape with generous sky and strong tonal depth |
| photo-0443 | P1270203.jpg | Journey portrait | Monumental vertical cirque composition; ideal for long-scroll continuity |
| photo-0432 | P1270057-2.jpg | People chapter | Direct, emotionally warm portrait with strong mobile presence |
| photo-0183 | P1230676.jpg | Ocean collection | Graphic blue field and silhouettes; changes pace without weakening photography |
| photo-0145 | P1210859.jpg | Encounter feature | Direct gaze and glove framing create a memorable people-led story |
| photo-0529 | P1310083.jpg | Editorial story | A human figure held within saturated evening light |

## Inventory workflow

Run from the repository root:

```bash
node scripts/build-photo-inventory.mjs
python3 scripts/enrich-photo-inventory.py
node scripts/curate-phase-one-selection.mjs
python3 scripts/build-contact-sheets.py
```

The generated `.photo-inventory-cache/` directory is a disposable review cache. It contains reduced thumbnails and contact sheets only. Production assets belong in the Astro image pipeline and must always be generated separately from the masters.

## Next curation pass

The next pass should review the archive journey by journey, confirm locations with the photographer, identify people who may be named or require consent handling, and add authored alt text. Destination inference from visual appearance should never be promoted to fact without confirmation.
