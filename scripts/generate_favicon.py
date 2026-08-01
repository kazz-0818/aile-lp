#!/usr/bin/env python3
"""Generate favicon assets from public/logos/aile-illust.png.

Renders the wing on a solid brand tile with a bright cyan ramp so the icon
stays visible on both light and dark browser tab backgrounds at 16–32px.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "logos" / "aile-illust.png"
APP_DIR = ROOT / "app"

# Brand palette
BG = (5, 5, 8)  # site body background (#050508)
PLATE = (0, 45, 58)  # deep teal plate behind wing
WING_SHADOW = (0, 170, 195)
WING_MID = (0, 210, 239)  # brand accent #00d2ef
WING_HIGH = (180, 245, 255)
LUM_FLOOR = 140
LUM_CEIL = 245


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
        return _lerp(WING_SHADOW, WING_MID, t / 0.5)
    return _lerp(WING_MID, WING_HIGH, (t - 0.5) / 0.5)


def _is_wing_pixel(r: int, g: int, b: int, a: int) -> bool:
    if a < 32:
        return False
    if r < 24 and g < 40 and b < 50:
        return False
    return True


def _extract_wing_mask() -> tuple[Image.Image, list[float]]:
    """Return an RGBA wing-only image and per-pixel luminance values."""
    img = Image.open(SOURCE).convert("RGBA")
    px = img.load()
    w, h = img.size

    wing_lums: list[float] = []
    wing_coords: list[tuple[int, int]] = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if not _is_wing_pixel(r, g, b, a):
                px[x, y] = (0, 0, 0, 0)
                continue
            wing_coords.append((x, y))
            wing_lums.append(_lum(r, g, b))

    if not wing_coords:
        raise RuntimeError("No visible pixels in source wing image")

    src_min = min(wing_lums)
    src_max = max(wing_lums)
    span = max(src_max - src_min, 1.0)

    for (x, y), src_lum in zip(wing_coords, wing_lums):
        t = (src_lum - src_min) / span
        nr, ng, nb = _ramp_color(t)
        px[x, y] = (nr, ng, nb, 255)

    return img, wing_lums


def _draw_tile(size: int, radius_ratio: float = 0.22) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)
    margin = max(0, int(size * 0.04))
    radius = max(1, int(size * radius_ratio))
    draw.rounded_rectangle(
        (margin, margin, size - margin - 1, size - margin - 1),
        radius=radius,
        fill=(*PLATE, 255),
    )
    return canvas


def prepare_icon(size: int, wing_src: Image.Image, padding: float = 0.16) -> Image.Image:
    wing_only = wing_src.copy()
    bbox = wing_only.getbbox()
    if not bbox:
        raise RuntimeError("No visible pixels in wing mask")
    cropped = wing_only.crop(bbox)

    canvas = _draw_tile(size)
    pad_px = max(1, int(size * padding))
    inner = size - pad_px * 2
    scale = min(inner / cropped.width, inner / cropped.height)
    new_w = max(1, int(cropped.width * scale))
    new_h = max(1, int(cropped.height * scale))
    resized = cropped.resize((new_w, new_h), Image.Resampling.LANCZOS)

    # Force full opacity after downscale — semi-transparent anti-aliasing
    # makes small tab icons disappear on dark tab strips.
    px = resized.load()
    for y in range(new_h):
        for x in range(new_w):
            r, g, b, a = px[x, y]
            if a < 48:
                px[x, y] = (0, 0, 0, 0)
                continue
            lum = _lum(r, g, b)
            if lum < LUM_FLOOR:
                lift = min(1.0, (LUM_FLOOR - lum) / LUM_FLOOR)
                r, g, b = _lerp((r, g, b), WING_MID, lift)
            elif lum > LUM_CEIL:
                r, g, b = _lerp(WING_MID, (r, g, b), min(1.0, (lum - LUM_CEIL) / (255 - LUM_CEIL)))
            px[x, y] = (r, g, b, 255)

    ox = (size - new_w) // 2
    oy = (size - new_h) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas.convert("RGBA")


def _analyze(img: Image.Image, label: str) -> None:
    px = img.load()
    w, h = img.size
    opaque = semi = transparent = 0
    rs: list[int] = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                transparent += 1
            elif a == 255:
                opaque += 1
                rs.append(r)
            else:
                semi += 1
    total = w * h
    print(
        f"  {label} {w}x{h}: opaque={opaque} ({100 * opaque / total:.1f}%), "
        f"semi={semi}, transparent={transparent}"
    )


def main() -> None:
    APP_DIR.mkdir(parents=True, exist_ok=True)
    wing_src, _ = _extract_wing_mask()

    sizes = [16, 32, 48]
    frames = [prepare_icon(s, wing_src) for s in sizes]

    ico_path = APP_DIR / "favicon.ico"
    frames[0].save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in sizes],
        append_images=frames[1:],
    )

    prepare_icon(32, wing_src).save(APP_DIR / "icon.png", format="PNG")
    prepare_icon(180, wing_src, padding=0.14).save(APP_DIR / "apple-icon.png", format="PNG")

    print(f"Wrote {ico_path} ({ico_path.stat().st_size} bytes)")
    print(f"Wrote {APP_DIR / 'icon.png'} ({(APP_DIR / 'icon.png').stat().st_size} bytes)")
    print(f"Wrote {APP_DIR / 'apple-icon.png'} ({(APP_DIR / 'apple-icon.png').stat().st_size} bytes)")
    print("Asset stats:")
    for size, frame in zip(sizes, frames):
        _analyze(frame, f"ico-{size}")
    _analyze(Image.open(APP_DIR / "icon.png"), "icon.png")
    _analyze(Image.open(APP_DIR / "apple-icon.png"), "apple-icon.png")


if __name__ == "__main__":
    main()
