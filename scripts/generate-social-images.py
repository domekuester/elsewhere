#!/usr/bin/env python3
"""Generate regenerable 1200×630 social crops from public-safe derivatives."""

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "social"
OUTPUT.mkdir(parents=True, exist_ok=True)

IMAGES = {
    "home.jpg": ("public/assets-derived/archive/0507-P1300187.jpg", (0.50, 0.48)),
    "archive.jpg": ("public/assets-derived/archive/0183-P1230676.jpg", (0.50, 0.48)),
    "people.jpg": ("src/assets/photos/people-vendor.jpg", (0.50, 0.17)),
    "black-and-white.jpg": ("public/assets-derived/archive/0331-P1260122.jpg", (0.50, 0.48)),
    "japan.jpg": ("public/assets-derived/archive/0177-P1230482.jpg", (0.50, 0.58)),
    "about.jpg": ("src/assets/photos/cirque-portrait.jpg", (0.50, 0.42)),
    "studio.jpg": ("public/assets-derived/archive/0443-P1270203.jpg", (0.50, 0.42)),
    "licensing.jpg": ("public/assets-derived/archive/0176-P1230481.jpg", (0.50, 0.45)),
    "contact.jpg": ("public/assets-derived/archive/0182-P1230662.jpg", (0.50, 0.50)),
    # Essaouira: the chapter hero crops cleanly to a wide card, keeping the gull and its shadow.
    "essaouira.jpg": ("public/assets-derived/archive/0609-P1330989.jpg", (0.50, 0.55)),
    # La Réunion: the chapter hero is already the right shape; without a card it fell back to an
    # uncropped 1800px derivative, which is not a social image.
    "la-reunion.jpg": ("public/assets-derived/archive/0442-P1270181.jpg", (0.50, 0.50)),
    # Düsseldorf: the hero crops to a band of pylon, cables and blue that stays legible at card size.
    "dusseldorf.jpg": ("public/assets-derived/archive/0656-P1350974.jpg", (0.50, 0.40)),
    # THE JOURNEY, story 01. The story opener is a 4:3 corridor of columns with the sea and a small
    # figure at the far end; a centred 1.91:1 crop keeps the corridor and the figure and loses only
    # ceiling and floor, which is where that photograph carries nothing. Centred slightly high
    # because the vanishing point sits just above the middle.
    "journey-malaysia.jpg": ("public/assets-derived/archive/0056-P1000442.jpg", (0.50, 0.46)),
    # THE JOURNEY, story 02. The scaffolded pagoda spire remains on the right while the wide crop
    # keeps the gold cloud as the subject. This is a technical social crop of the approved hero.
    "journey-thailand.jpg": ("public/assets-derived/archive/0043-IMG_8541.jpg", (0.50, 0.45)),
    # THE JOURNEY, story 03. The approved monks-and-Mercedes hero is a portrait frame; this wide
    # crop keeps both monks' heads, the robes and the car, matching the protected Story focal logic.
    "journey-laos.jpg": ("public/assets-derived/archive/0663-P1110394 Kopie.jpg", (0.50, 0.48)),
}

for filename, (source, centering) in IMAGES.items():
    with Image.open(ROOT / source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        crop = ImageOps.fit(image, (1200, 630), method=Image.Resampling.LANCZOS, centering=centering)
        crop.save(OUTPUT / filename, "JPEG", quality=88, optimize=True, progressive=True)

print(f"Generated {len(IMAGES)} social images in {OUTPUT.relative_to(ROOT)}.")
