#!/usr/bin/env python3
"""Turn a warm-toned black-and-white photograph into neutral greys, lift the clarity a little and add film grain.
Needs Pillow and numpy.  Usage: photo-neutral.py IN OUT [--grain STD] [--lift GAMMA] [--ref REFERENCE.png]
STD is the grain strength as the standard deviation (in 0-255 levels) of the fine noise on a flat wall.
The first whiteboard photograph (assets/photo/tavler-original.png) measures about 2.2 there."""
import sys, argparse
import numpy as np
from PIL import Image, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('dst')
ap.add_argument('--grain', type=float, default=2.2)
ap.add_argument('--lift', type=float, default=0.88, help='gamma below 1 brightens the mid-tones')
ap.add_argument('--scale', type=float, default=1.0)
ap.add_argument('--seed', type=int, default=7)
a = ap.parse_args()

im = Image.open(a.src).convert('RGB')
if a.scale != 1.0:
    im = im.resize((round(im.width * a.scale), round(im.height * a.scale)), Image.LANCZOS)
rgb = np.asarray(im).astype(np.float64) / 255
# neutral luminance (Rec. 709), so no colour cast is left at all
L = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
# levels: black point and white point from the picture itself, then a gentle lift and S-curve
lo, hi = np.percentile(L, 0.4), np.percentile(L, 99.6)
L = np.clip((L - lo) / (hi - lo), 0, 1) ** a.lift
L = L + 0.10 * np.sin(2 * np.pi * (L - 0.5) * 0.5) * (1 - np.abs(2 * L - 1)) * 2  # soft S-curve
L = np.clip(L, 0, 1)
g = Image.fromarray((L * 255).round().astype('uint8'))
# clarity: broad local contrast, then fine sharpening
g = g.filter(ImageFilter.UnsharpMask(radius=28 * a.scale, percent=28, threshold=0))
g = g.filter(ImageFilter.UnsharpMask(radius=1.1 * a.scale, percent=70, threshold=2))
L = np.asarray(g).astype(np.float64)
# film grain: soft noise, strongest in the mid-tones, weaker in deep shadow and pure white
rng = np.random.default_rng(a.seed)
n = rng.standard_normal(L.shape)
n = np.asarray(Image.fromarray(((n * 40) + 128).clip(0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.65 * a.scale))).astype(np.float64) - 128
n /= n.std()
w = 0.55 + 0.45 * (1 - (np.abs(L / 255 - 0.5) * 2) ** 2)
# measure the fine noise the picture already has on its flattest area and add only what is missing to reach the target
blur = np.asarray(Image.fromarray(L.astype('uint8')).filter(ImageFilter.GaussianBlur(3 * a.scale))).astype(np.float64)
hf = L - blur
tile = 64
best = min(((hf[y:y + tile, x:x + tile].std(), y, x) for y in range(0, L.shape[0] - tile, tile) for x in range(0, L.shape[1] - tile, tile) if 60 < L[y:y + tile, x:x + tile].mean() < 200), default=(0, 0, 0))
have = best[0]
add = np.sqrt(max(a.grain ** 2 - have ** 2, 0.0))
out = np.clip(L + n * w * add * 1.0, 0, 255)
Image.fromarray(out.round().astype('uint8')).save(a.dst, quality=92, optimize=True, progressive=True, subsampling=0)
chk = out - np.asarray(Image.fromarray(out.round().astype('uint8')).filter(ImageFilter.GaussianBlur(3 * a.scale))).astype(np.float64)
y, x = best[1], best[2]
print(f'{a.dst}: flat-area noise {have:.2f} -> {chk[y:y+tile, x:x+tile].std():.2f} (target {a.grain})  mean grey {out.mean():.0f}  size {Image.open(a.dst).size}')
