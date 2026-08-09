from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, math

ROOT = Path.cwd()
CACHE = ROOT / '.photo-inventory-cache'
OUT = CACHE / 'contact-sheets'
OUT.mkdir(parents=True, exist_ok=True)
items = json.loads((CACHE / 'thumb-index.json').read_text())
cols, rows = 5, 5
cell_w, cell_h, label_h = 300, 240, 34
font = ImageFont.load_default(size=15)

for sheet_no in range(math.ceil(len(items) / (cols * rows))):
    subset = items[sheet_no * cols * rows:(sheet_no + 1) * cols * rows]
    sheet = Image.new('RGB', (cols * cell_w, rows * (cell_h + label_h)), '#111214')
    draw = ImageDraw.Draw(sheet)
    for i, item in enumerate(subset):
        thumb = Image.open(ROOT / item['thumbnailPath']).convert('RGB')
        thumb.thumbnail((cell_w, cell_h), Image.Resampling.LANCZOS)
        x = (i % cols) * cell_w
        y = (i // cols) * (cell_h + label_h)
        px = x + (cell_w - thumb.width) // 2
        py = y + (cell_h - thumb.height) // 2
        sheet.paste(thumb, (px, py))
        label = f"{item['id']}  {item['filename']}"
        draw.text((x + 8, y + cell_h + 8), label[:42], fill='#f2f0ea', font=font)
    sheet.save(OUT / f'contact-{sheet_no + 1:02d}.jpg', quality=88, optimize=True)

print(f"Wrote {math.ceil(len(items)/(cols*rows))} contact sheets to {OUT.relative_to(ROOT)}")
