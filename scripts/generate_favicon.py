#!/usr/bin/env python3
"""Generate favicon assets from public/logos/aile-illust.png."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "logos" / "aile-illust.png"
APP_DIR = ROOT / "app"

# Deep vivid cyan-teal ramp — darker/saturated vs pale brand accent (#00d2ef)
SHADOW = (0, 92, 115)
MID = (0, 128, 152)
HIGH = (0, 158, 178)
LUM_FLOOR = 52
LUM_CEIL = 118


def _lum(r: float, g: float, b: float) -> float:
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def _lerp(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (
        int(a[0] + (b[0] - a[0]) * t),
        int(a[1] + (b[1] - a[1]) * t),
        int(a[2] + (b[2] - a[2]) * t),
    )


def _ramp_color(t: float) -> tuple[int, int, int]:
    t = max(0.0, min(1.0, t))
    if t < 0.5:
        return _lerp(SHADOW, MID, t / 0.5)
    return _lerp(MID, HIGH, (t - 0.5) / 0.5)


def prepare_wing(size: int, padding: float = 0.12) -> Image.Image:
    img = Image.open(SOURCE).convert("RGBA")
    px = img.load()
    w, h = img.size

    wing_lums: list[float] = []
    wing_coords: list[tuple[int, int]] = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if r < 24 and g < 40 and b < 50:
                continue
            wing_coords.append((x, y))
            wing_lums.append(_lum(r, g, b))

    if not wing_coords:
        raise RuntimeError("No visible pixels in source wing image")

    src_min = min(wing_lums)
    src_max = max(wing_lums)
    span = max(src_max - src_min, 1.0)

    for (x, y), src_lum in zip(wing_coords, wing_lums):
        _, _, _, a = px[x, y]
        t = (src_lum - src_min) / span
        nr, ng, nb = _ramp_color(t)
        out_lum = _lum(nr, ng, nb)
        if out_lum < LUM_FLOOR:
            lift = (LUM_FLOOR - out_lum) / LUM_FLOOR
            nr, ng, nb = _lerp((nr, ng, nb), MID, lift * 0.7)
        elif out_lum > LUM_CEIL:
            nr, ng, nb = _lerp(MID, (nr, ng, nb), (out_lum - LUM_CEIL) / (255 - LUM_CEIL))
        px[x, y] = (nr, ng, nb, a)

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if r < 24 and g < 40 and b < 50:
                px[x, y] = (0, 0, 0, 0)

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
    return _sharpen_tab_colors(canvas, size)


def _sharpen_tab_colors(img: Image.Image, size: int) -> Image.Image:
    """After downscale, wing pixels darken — lift small icons for light tab backgrounds."""
    if size > 64:
        return img
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a < 20:
                px[x, y] = (0, 0, 0, 0)
                continue
            lum = _lum(r, g, b)
            if lum < LUM_FLOOR:
                lift = min(1.0, (LUM_FLOOR - lum) / LUM_FLOOR)
                nr, ng, nb = _lerp((r, g, b), MID, lift * 0.9)
                px[x, y] = (nr, ng, nb, a)
    return img


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
