#!/usr/bin/env python3
"""Generate responsive image variants.

    python3 build-images.py

Every content photograph was being served at its full size to every device, so
a phone downloaded a 1600px 526KB JPEG to paint it 375px wide. This writes
three widths in three formats next to each original and leaves the original
alone as the final fallback.

Re-runnable: existing variants are skipped unless the source is newer.
"""
import pathlib
import re
import sys
from PIL import Image

WIDTHS = [480, 960, 1600]
# The logo is a flat lockup at its display size and the favicons are icons;
# neither benefits from a variant ladder.
SKIP = {"inalgesco-logo.png", "favicon-32.png", "favicon-180.png"}

root = pathlib.Path(__file__).parent
sources = set()
for page in root.glob("*.html"):
    sources |= set(re.findall(r'<(?:img|video)[^>]*(?:src|poster)="([^"]+\.(?:jpg|png))"', page.read_text()))

made = skipped = 0
for name in sorted(sources):
    if name in SKIP:
        continue
    src = root / name
    if not src.exists():
        print("  missing:", name, file=sys.stderr)
        continue
    stem, _ = name.rsplit(".", 1)
    with Image.open(src) as im:
        im = im.convert("RGB")
        for w in WIDTHS:
            if w > im.width:          # never upscale
                continue
            h = round(im.height * w / im.width)
            resized = im.resize((w, h), Image.LANCZOS)
            for ext, opts in (("avif", {"quality": 55}),
                              ("webp", {"quality": 76, "method": 6}),
                              ("jpg",  {"quality": 80, "optimize": True, "progressive": True})):
                out = root / f"{stem}-{w}.{ext}"
                if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
                    skipped += 1
                    continue
                resized.save(out, **opts)
                made += 1

print(f"  {made} variants written, {skipped} already current")
