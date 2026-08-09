from pathlib import Path
from PIL import Image
from collections import Counter
import json, colorsys

ROOT = Path.cwd()
manifest_path = ROOT / 'docs' / 'photo-inventory.json'
manifest = json.loads(manifest_path.read_text())

def color_name(rgb):
    r, g, b = [v / 255 for v in rgb]
    h, s, v = colorsys.rgb_to_hsv(r, g, b)
    if v < .18: return 'obsidian'
    if v < .34 and s < .20: return 'charcoal'
    if v > .82 and s < .12: return 'soft white'
    if s < .15: return 'stone grey'
    deg = h * 360
    if deg < 18 or deg >= 345: return 'rust red' if v < .7 else 'coral'
    if deg < 45: return 'burnt copper' if v < .65 else 'amber'
    if deg < 70: return 'ochre'
    if deg < 155: return 'forest green' if v < .55 else 'leaf green'
    if deg < 195: return 'deep mineral' if v < .55 else 'turquoise'
    if deg < 250: return 'ocean blue' if v > .45 else 'midnight blue'
    if deg < 290: return 'violet'
    if deg < 345: return 'magenta'
    return 'neutral'

for photo in manifest['photos']:
    path = ROOT / photo['sourcePath']
    try:
        with Image.open(path) as im:
            w, h = im.size
            ratio = w / h
            photo['dimensions'] = {'width': w, 'height': h}
            photo['aspectRatio'] = round(ratio, 4)
            photo['orientation'] = 'landscape' if ratio > 1.05 else 'portrait' if ratio < .95 else 'square'
            sample = im.convert('RGB')
            sample.thumbnail((72, 72), Image.Resampling.LANCZOS)
            quantized = sample.quantize(colors=5, method=Image.Quantize.MEDIANCUT).convert('RGB')
            counts = Counter(quantized.getdata())
            names = []
            for rgb, _ in counts.most_common(5):
                name = color_name(rgb)
                if name not in names:
                    names.append(name)
                if len(names) == 3: break
            photo['editorial']['dominantColors'] = names
    except Exception as error:
        photo['technical']['pixelReadError'] = str(error)

manifest_path.write_text(json.dumps(manifest, indent=2) + '\n')
print(f"Enriched {len(manifest['photos'])} photo records with dimensions and palette names")
