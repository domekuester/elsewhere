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
}

for filename, (source, centering) in IMAGES.items():
    with Image.open(ROOT / source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        crop = ImageOps.fit(image, (1200, 630), method=Image.Resampling.LANCZOS, centering=centering)
        crop.save(OUTPUT / filename, "JPEG", quality=88, optimize=True, progressive=True)

print(f"Generated {len(IMAGES)} social images in {OUTPUT.relative_to(ROOT)}.")
