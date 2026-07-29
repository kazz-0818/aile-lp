#!/usr/bin/env python3
"""Process venue logos: remove backgrounds with soft-edge alpha."""

from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "logos"
ASSETS = Path("/Users/akaikazufumi/.cursor/projects/Users-akaikazufumi-Downloads-System-AiLE/assets")

SOURCES = {
    "green.png": ASSETS / "IMG_9796-a2fc2f0c-9ebf-4b13-a8f9-8d3884a16cb8.png",
    "lilac.png": ASSETS / "LILAC-___-575cc110-ba23-431d-8782-24870199768a.png",
    "blue.png": ASSETS / "IMG_0624-7225f216-d13b-41c5-b755-bf85644fec41.png",
    "brandvox-logo.png": ASSETS / "Brandvox_Logo_Gold-5ef5c045-efe5-4e63-a153-19672200b445.png",
    "brandvox-logo-horizontal.png": ASSETS / "Brandvox_Wide_icon_Gold-783c0416-782d-4389-8026-72e0956c015e.png",
    "finedge-mark.png": ASSETS / "FiNEDGE_logo-6cbbceb2-9e51-4452-b67a-20e0a50156d4.png",
    "laxis.png": ASSETS / "LAXIS____-2200731d-ccaf-43b2-b3b4-4da56426b2b6.png",
}


def clamp(v: float, lo: float = 0.0, hi: float = 255.0) -> int:
    return int(max(lo, min(hi, round(v))))


def dist_rgb(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def remove_white_bg(img: Image.Image, threshold: float = 28.0, softness: float = 18.0) -> Image.Image:
    """Chroma-key near-white pixels to transparent with soft edge."""
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size
    target = (255, 255, 255)

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            d = dist_rgb((r, g, b), target)
            if d <= threshold - softness:
                px[x, y] = (r, g, b, 0)
            elif d < threshold:
                t = (d - (threshold - softness)) / softness
                px[x, y] = (r, g, b, clamp(255 * t))
    return rgba


def remove_navy_bg(
    img: Image.Image,
    bg: tuple[int, int, int] = (13, 1, 63),
    threshold: float = 42.0,
    softness: float = 22.0,
    min_brightness: int = 18,
) -> Image.Image:
    """Remove dark navy background while preserving neon glow pixels."""
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            brightness = max(r, g, b)
            d = dist_rgb((r, g, b), bg)

            # Keep bright / colorful neon pixels even if close to bg in distance
            if brightness >= min_brightness and (r > bg[0] + 8 or g > bg[1] + 8 or b > bg[2] + 8):
                continue

            if d <= threshold - softness:
                px[x, y] = (r, g, b, 0)
            elif d < threshold:
                t = (d - (threshold - softness)) / softness
                # Preserve faint glow: don't fully erase mid-tones
                alpha = clamp(255 * t)
                if brightness > 8:
                    alpha = max(alpha, clamp(brightness * 2.5))
                px[x, y] = (r, g, b, alpha)
            elif brightness <= 12 and d < threshold + 30:
                # Very dark fringe near bg
                t = (d - threshold) / 30.0
                px[x, y] = (r, g, b, clamp(255 * t * 0.6))
    return rgba


def remove_black_bg(
    img: Image.Image,
    bg: tuple[int, int, int] = (0, 0, 0),
    threshold: float = 38.0,
    softness: float = 22.0,
    min_brightness: int = 22,
) -> Image.Image:
    """Remove solid black background while preserving gold / gray logo pixels."""
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            brightness = max(r, g, b)
            d = dist_rgb((r, g, b), bg)

            if brightness >= min_brightness:
                continue

            if d <= threshold - softness:
                px[x, y] = (r, g, b, 0)
            elif d < threshold:
                t = (d - (threshold - softness)) / softness
                px[x, y] = (r, g, b, clamp(255 * t))
            elif brightness <= 15 and d < threshold + 25:
                t = (d - threshold) / 25.0
                px[x, y] = (r, g, b, clamp(255 * max(t, 0) * 0.5))
    return rgba


def trim_transparent(img: Image.Image, pad: int = 8) -> Image.Image:
    bbox = img.getbbox()
    if not bbox:
        return img
    left, top, right, bottom = bbox
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(img.width, right + pad)
    bottom = min(img.height, bottom + pad)
    return img.crop((left, top, right, bottom))


def make_brandvox_horizontal(vertical: Image.Image, target_height: int = 80) -> Image.Image:
    """Compose horizontal lockup: box icon left, BRAND/VOX wordmark right."""
    w, h = vertical.size
    data = list(vertical.getdata())

    def alpha_at(x: int, y: int) -> int:
        return data[y * w + x][3]

    row_sums = [sum(1 for x in range(w) if alpha_at(x, y) > 30) for y in range(h)]
    bands: list[tuple[int, int]] = []
    start: int | None = None
    for y in range(h):
        if row_sums[y] > 5:
            if start is None:
                start = y
        elif start is not None:
            bands.append((start, y))
            start = None
    if start is not None:
        bands.append((start, h))

    icon = vertical.crop((70, bands[0][0], 212, bands[0][1]))
    brand = vertical.crop((12, bands[1][0], 269, bands[1][1]))
    vox = vertical.crop((67, bands[2][0], 212, bands[2][1]))

    gap = 4
    text_w = max(brand.width, vox.width)
    text_h = brand.height + gap + vox.height
    text = Image.new("RGBA", (text_w, text_h), (0, 0, 0, 0))
    text.paste(brand, ((text_w - brand.width) // 2, 0), brand)
    text.paste(vox, ((text_w - vox.width) // 2, brand.height + gap), vox)

    icon = trim_transparent(icon, pad=4)
    text = trim_transparent(text, pad=2)

    h_gap = 8
    target_h = max(icon.height, text.height)
    out_w = icon.width + h_gap + text.width
    out = Image.new("RGBA", (out_w, target_h), (0, 0, 0, 0))
    out.paste(icon, (0, (target_h - icon.height) // 2), icon)
    out.paste(text, (icon.width + h_gap, (target_h - text.height) // 2), text)

    scale = target_height / out.height
    return out.resize((round(out.width * scale), target_height), Image.Resampling.LANCZOS)


def resize_max(img: Image.Image, max_side: int = 512) -> Image.Image:
    w, h = img.size
    if max(w, h) <= max_side:
        return img
    scale = max_side / max(w, h)
    return img.resize((round(w * scale), round(h * scale)), Image.Resampling.LANCZOS)


def alpha_stats(img: Image.Image) -> dict:
    alpha = [p[3] for p in img.getdata()]
    transparent = sum(1 for a in alpha if a == 0)
    partial = sum(1 for a in alpha if 0 < a < 255)
    opaque = sum(1 for a in alpha if a == 255)
    return {
        "transparent": transparent,
        "partial": partial,
        "opaque": opaque,
        "total": len(alpha),
    }


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    processors = {
        "green.png": lambda im: remove_white_bg(im, threshold=30, softness=20),
        "lilac.png": lambda im: remove_white_bg(im, threshold=30, softness=20),
        "blue.png": lambda im: remove_navy_bg(im, threshold=45, softness=24, min_brightness=16),
        "brandvox-logo.png": lambda im: remove_black_bg(im, threshold=38, softness=22, min_brightness=22),
        "brandvox-logo-horizontal.png": lambda im: remove_black_bg(im, threshold=38, softness=22, min_brightness=22),
        "finedge-mark.png": lambda im: remove_black_bg(im, threshold=38, softness=22, min_brightness=22),
        "laxis.png": lambda im: remove_black_bg(im, threshold=38, softness=22, min_brightness=22),
    }

    for name, src in SOURCES.items():
        if not src.exists():
            raise FileNotFoundError(src)
        img = Image.open(src)
        processed = processors[name](img)
        processed = trim_transparent(processed, pad=12)
        processed = resize_max(processed, max_side=512)
        out_path = OUT_DIR / name
        processed.save(out_path, "PNG", optimize=True)
        stats = alpha_stats(processed)
        print(f"{name}: {processed.size} -> {out_path}")
        print(
            f"  alpha: transparent={stats['transparent']} partial={stats['partial']} "
            f"opaque={stats['opaque']} ({100*stats['transparent']/stats['total']:.1f}% transparent)"
        )



if __name__ == "__main__":
    main()
