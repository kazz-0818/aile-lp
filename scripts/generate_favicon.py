#!/usr/bin/env python3
"""Generate favicon assets from public/logos/aile-illust.png."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "logos" / "aile-illust.png"
APP_DIR = ROOT / "app"

# Brand accent — readable on light and dark browser tabs
ACCENT = (0, 210, 239)


def prepare_wing(size: int, padding: float = 0.12) -> Image.Image:
    img = Image.open(SOURCE).convert("RGBA")
    px = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            # Key out near-black background
            if r < 24 and g < 40 and b < 50:
                px[x, y] = (0, 0, 0, 0)
                continue
            # Boost dark teal wing toward accent cyan for small-tab readability
            lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            t = max(0.0, min(1.0, 1.0 - lum / 120.0))
            nr = int(r + (ACCENT[0] - r) * (0.35 + 0.45 * t))
            ng = int(g + (ACCENT[1] - g) * (0.35 + 0.45 * t))
            nb = int(b + (ACCENT[2] - b) * (0.35 + 0.45 * t))
            px[x, y] = (nr, ng, nb, a)

    bbox = img.getbbox()
    if not bbox:
        raise RuntimeError("No visible pixels in source wing image")
    cropped = img.crop(bbox)

    pad_px = max(1, int(size * padding))
    inner = size - pad_px * 2
    scale = min(inner / cropped.width, inner / cropped.height)
    new_w = max(1, int(cropped.width * scale))
    new_h = max(1, int(cropped.height * scale))
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ox = (size - new_w) // 2
    oy = (size - new_h) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def main() -> None:
    APP_DIR.mkdir(parents=True, exist_ok=True)

    sizes = [16, 32, 48]
    frames = [prepare_wing(s) for s in sizes]

    ico_path = APP_DIR / "favicon.ico"
    frames[0].save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=frames[1:],
    )

    prepare_wing(32).save(APP_DIR / "icon.png", format="PNG")
    prepare_wing(180).save(APP_DIR / "apple-icon.png", format="PNG")

    print(f"Wrote {ico_path}")
    print(f"Wrote {APP_DIR / 'icon.png'}")
    print(f"Wrote {APP_DIR / 'apple-icon.png'}")


if __name__ == "__main__":
    main()
