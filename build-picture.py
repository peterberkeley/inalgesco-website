#!/usr/bin/env python3
"""Wrap content <img> tags in <picture> with AVIF and WebP sources.

    python3 build-images.py && python3 build-picture.py

Run build-images.py first; this only offers variants that exist on disk.
Idempotent: an <img> that already carries a srcset is left alone.

The first version of this walked the matches forward while rewriting the same
string, so every offset after the first was stale and it spliced <picture>
blocks into the middle of attributes. Hence the reverse walk below, and the
validation at the end that refuses to write a file it has broken.
"""
import pathlib
import re
import sys

WIDTHS = [480, 960, 1600]
SIZES = "(min-width: 1180px) 1100px, 92vw"
SKIP = {"inalgesco-logo.png", "favicon-32.png", "favicon-180.png"}
root = pathlib.Path(__file__).parent


def srcset_for(stem, ext):
    have = [w for w in WIDTHS if (root / f"{stem}-{w}.{ext}").exists()]
    return ", ".join(f"{stem}-{w}.{ext} {w}w" for w in have) if have else None


def broken(html):
    """Cheap structural checks that catch exactly the damage this can do."""
    if re.search(r'="[^"]*<', html):
        return "a tag was spliced inside an attribute"
    if re.search(r"</picture>[A-Za-z]", html):
        return "a </picture> is glued to text"
    if html.count("<picture>") != html.count("</picture>"):
        return "unbalanced picture tags"
    srcs = re.findall(r'<img[^>]*src="([^"]+)"', html)
    dupes = {s for s in srcs if srcs.count(s) > 1}
    if dupes:
        return "duplicated image(s): " + ", ".join(sorted(dupes))
    return None


total = 0
for page in sorted(root.glob("*.html")):
    original = page.read_text()
    html = original
    # REVERSE: rewriting from the end keeps every earlier offset valid.
    for m in reversed(list(re.finditer(r"<img\b[^>]*>", html))):
        tag = m.group(0)
        src = re.search(r'src="([^"]+)"', tag)
        if not src or src.group(1) in SKIP or "srcset=" in tag:
            continue
        stem, _, ext = src.group(1).rpartition(".")
        jpg = srcset_for(stem, "jpg")
        if not jpg:
            continue
        indent = re.search(r"([ \t]*)$", html[: m.start()]).group(1)
        img = tag.replace(src.group(0), f'{src.group(0)} srcset="{jpg}" sizes="{SIZES}"', 1)
        block = ["<picture>"]
        for fmt in ("avif", "webp"):
            ss = srcset_for(stem, fmt)
            if ss:
                block.append(f'{indent}  <source type="image/{fmt}" srcset="{ss}" sizes="{SIZES}">')
        block.append(f"{indent}  {img}")
        block.append(f"{indent}</picture>")
        html = html[: m.start()] + "\n".join(block) + html[m.end():]
        total += 1

    if html != original:
        why = broken(html)
        if why:
            print(f"  REFUSING to write {page.name}: {why}", file=sys.stderr)
            sys.exit(1)
        page.write_text(html)
        print(f"  {page.name}: wrapped")

print(f"  {total} image(s) wrapped")
