#!/usr/bin/env python3
"""Repair solid-black public derivatives without touching photo masters.

Some wide-gamut/source JPEGs decode as black through the original sips-only
pipeline. macOS Quick Look renders those sources correctly. This script finds
only unusable public derivatives, asks Quick Look for an intermediate PNG, and
writes fresh archive and thumbnail JPEGs from that render.
"""

from __future__ import annotations

import json
import shutil
import subprocess
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "public/data/photo-catalog.json").read_text())
INVENTORY = json.loads((ROOT / "docs/photo-inventory.json").read_text())
BY_ID = {photo["id"]: photo for photo in INVENTORY["photos"]}


def is_unusable(path: Path) -> bool:
    if not path.exists():
        return True
    try:
        with Image.open(path) as image:
            sample = image.convert("RGB")
            sample.thumbnail((64, 64))
            maximum = max(channel[1] for channel in sample.getextrema())
            # A genuinely low-key frame may have a near-zero mean while still
            # containing meaningful highlights. Solid-black failures do not.
            return maximum < 5
    except Exception:
        return True


def save_jpeg(source_png: Path, target: Path, max_size: int, quality: int) -> None:
    with Image.open(source_png) as image:
        rendered = image.convert("RGB")
        rendered.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
        target.parent.mkdir(parents=True, exist_ok=True)
        temporary = target.with_suffix(".repairing.jpg")
        rendered.save(temporary, "JPEG", quality=quality, optimize=True, progressive=True)
        temporary.replace(target)


targets = []
for photo in CATALOG["photos"]:
    archive = ROOT / "public" / photo["archiveImage"].lstrip("/")
    thumbnail = ROOT / "public" / photo["thumbnail"].lstrip("/")
    if is_unusable(archive) or is_unusable(thumbnail):
        source = ROOT / BY_ID[photo["id"]]["sourcePath"]
        targets.append((photo, source, archive, thumbnail))

if not targets:
    print("No black or unreadable public derivatives found.")
    raise SystemExit(0)

work = Path(tempfile.mkdtemp(prefix="elsewhere-derivative-repair-"))
try:
    # Keep batches modest and prevent basename collisions inside Quick Look output.
    for offset in range(0, len(targets), 40):
        batch = targets[offset : offset + 40]
        batch_dir = work / f"batch-{offset // 40:02d}"
        batch_dir.mkdir()
        command = ["qlmanage", "-t", "-s", "1800", "-o", str(batch_dir)]
        command.extend(str(source) for _, source, _, _ in batch)
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        for photo, source, archive, thumbnail in batch:
            preview = batch_dir / f"{source.name}.png"
            if not preview.exists():
                raise RuntimeError(f"Quick Look produced no preview for {photo['filename']}")
            save_jpeg(preview, archive, 1600, 82)
            save_jpeg(preview, thumbnail, 560, 76)
        print(f"Repaired {min(offset + len(batch), len(targets))}/{len(targets)} derivatives…")
finally:
    shutil.rmtree(work, ignore_errors=True)

remaining = []
for photo, _, archive, thumbnail in targets:
    if is_unusable(archive) or is_unusable(thumbnail):
        remaining.append(photo["filename"])
if remaining:
    raise RuntimeError(f"Derivative repair verification failed: {remaining}")

print(f"Derivative repair complete: {len(targets)} public photographs restored.")
