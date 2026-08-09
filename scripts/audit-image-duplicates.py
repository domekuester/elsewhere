#!/usr/bin/env python3
"""Read-only duplicate candidate audit for the ELSEWHERE master archive.

Exact matches use SHA-256. Near-duplicate candidates use a conservative
difference hash over inventory thumbnails and are suggestions for human review,
never automatic deletions or classifications.
"""

from __future__ import annotations

import hashlib
import json
import re
from datetime import datetime
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
INVENTORY = ROOT / "docs" / "photo-inventory.json"
PUBLIC_CATALOG = ROOT / "public" / "data" / "photo-catalog.json"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def difference_hash(path: Path) -> int:
    with Image.open(path) as source:
        image = ImageOps.exif_transpose(source).convert("L").resize((9, 8), Image.Resampling.LANCZOS)
        pixels = list(image.getdata())
    value = 0
    for row in range(8):
        for column in range(8):
            value = (value << 1) | (pixels[row * 9 + column] > pixels[row * 9 + column + 1])
    return value


def hamming(left: int, right: int) -> int:
    return bin(left ^ right).count("1")


def parse_date(value: str | None) -> datetime | None:
    return datetime.fromisoformat(value.replace("Z", "+00:00")) if value else None


def variant_base(filename: str) -> str:
    stem = Path(filename).stem
    return re.sub(r"-(?:2|3|4|5|Enhanced-NR(?:-2)?)$", "", stem, flags=re.IGNORECASE)


def main() -> None:
    inventory = json.loads(INVENTORY.read_text())
    photos = inventory["photos"]
    public_catalog = json.loads(PUBLIC_CATALOG.read_text())
    public_assets = {
        photo["id"]: ROOT / "public" / photo["archiveImage"].lstrip("/")
        for photo in public_catalog["photos"]
    }
    records = []
    exact_groups: dict[str, list[dict]] = {}

    for photo in photos:
        master = ROOT / photo["sourcePath"]
        # Public derivatives are color-managed and verified. The legacy
        # inventory thumbnails can decode as solid black for part of the set.
        visual_source = public_assets.get(photo["id"])
        record = {
            "id": photo["id"],
            "filename": photo["filename"],
            "captureDate": photo.get("capture", {}).get("date"),
            "orientation": photo.get("orientation"),
            "variantBase": variant_base(photo["filename"]),
            "sha256": sha256(master),
            "dhash": difference_hash(visual_source) if visual_source else None,
        }
        records.append(record)
        exact_groups.setdefault(record["sha256"], []).append(record)

    exact = [
        [{"id": item["id"], "filename": item["filename"]} for item in group]
        for group in exact_groups.values()
        if len(group) > 1
    ]

    variant_groups: dict[tuple[str, str | None], list[dict]] = {}
    for record in records:
        variant_groups.setdefault((record["variantBase"], record["captureDate"]), []).append(record)
    near_families = [
        {
            "variantBase": group[0]["variantBase"],
            "captureDate": group[0]["captureDate"],
            "photos": [{"id": item["id"], "filename": item["filename"]} for item in group],
        }
        for group in variant_groups.values()
        if len(group) > 1
    ]

    sequence_candidates = []
    for index, left in enumerate(records):
        if left["dhash"] is None:
            continue
        for right in records[index + 1 :]:
            if right["dhash"] is None:
                continue
            if left["orientation"] != right["orientation"]:
                continue
            if left["variantBase"] == right["variantBase"]:
                continue
            left_date = parse_date(left["captureDate"])
            right_date = parse_date(right["captureDate"])
            seconds = abs((right_date - left_date).total_seconds()) if left_date and right_date else None
            if seconds is None or seconds > 10:
                continue
            distance = hamming(left["dhash"], right["dhash"])
            if distance > 5:
                continue
            sequence_candidates.append(
                {
                    "left": {"id": left["id"], "filename": left["filename"]},
                    "right": {"id": right["id"], "filename": right["filename"]},
                    "dhashDistance": distance,
                    "captureDeltaSeconds": seconds,
                    "reviewPriority": "HUMAN_REVIEW",
                }
            )

    sequence_candidates.sort(key=lambda item: (item["dhashDistance"], item["captureDeltaSeconds"]))
    print(json.dumps({"photoCount": len(records), "publicPhotoCount": len(public_assets), "exactDuplicateGroups": exact, "sameSourceVariantFamilies": near_families, "rapidSequenceCandidates": sequence_candidates}, indent=2))


if __name__ == "__main__":
    main()
