#!/usr/bin/env python3
"""Fake a shallow depth of field on the office photograph: one place stays sharp, everything farther away goes soft.
Needs Pillow and numpy.  Usage: photo-dof.py IN OUT --focus X0,Y0,X1,Y1 --sigma S [--up PX] [--side PX] [--down PX] [--front F] [--grain STD]

The sharp zone is the box given by --focus.  Blur grows with the distance from that box, reaching SIGMA (in photograph
pixels) --up pixels above it and --side pixels to the sides, and FRONT x SIGMA below it (things nearer the camera than the
focus plane go a little soft too).  It is a depth ramp, not a real depth map, so use it to judge a crop, not as a final image.
Film grain is put back on the blurred parts, since blur takes it away and the smooth areas would look pasted in."""
import argparse
import numpy as np
from PIL import Image, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('dst')
ap.add_argument('--focus', required=True)
ap.add_argument('--sigma', type=float, required=True)
ap.add_argument('--up', type=float, default=140); ap.add_argument('--side', type=float, default=240); ap.add_argument('--down', type=float, default=150)
ap.add_argument('--front', type=float, default=0.45)
ap.add_argument('--grain', type=float, default=2.2)
ap.add_argument('--quality', type=int, default=84)
ap.add_argument('--seed', type=int, default=11)
a = ap.parse_args()

im = Image.open(a.src).convert('L'); W, H = im.size; src = np.asarray(im, dtype=np.float32)
x0, y0, x1, y1 = (float(v) for v in a.focus.split(','))
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
dx = np.maximum(np.maximum(x0 - xx, xx - x1), 0) / a.side
dyu = np.maximum(y0 - yy, 0) / a.up
dyd = np.maximum(yy - y1, 0) / a.down
d = np.clip(np.sqrt(dx ** 2 + dyu ** 2 + dyd ** 2), 0, 1)
ease = d * d * (3 - 2 * d)
nearer = np.clip((yy - y1) / a.down, 0, 1); nearer = nearer * nearer * (3 - 2 * nearer)
amount = a.sigma * ease * (1 - (1 - a.front) * nearer)          # blur radius at every pixel, in photograph px; eases to FRONT x as things get nearer

ladder = sorted({0.0, a.sigma} | {s_ for s_ in (0.8, 1.5, 2.5, 4.0, 6.0, 9.0, 13.0) if s_ < a.sigma})
stack = [src if s == 0 else np.asarray(im.filter(ImageFilter.GaussianBlur(s)), dtype=np.float32) for s in ladder]
pos = np.interp(amount, ladder, np.arange(len(ladder))); lo = np.clip(np.floor(pos).astype(int), 0, len(ladder) - 2); f = pos - lo
S = np.stack(stack)
out = (1 - f) * np.take_along_axis(S, lo[None], 0)[0] + f * np.take_along_axis(S, (lo + 1)[None], 0)[0]

# grain back on the blurred parts: fine noise, strongest in the mid-tones, as in photo-neutral.py
rng = np.random.default_rng(a.seed)
n = np.asarray(Image.fromarray(((rng.standard_normal((H, W)) * 40) + 128).clip(0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.6)), dtype=np.float32) - 128
n *= a.grain / n.std()
lum = out / 255.0; n *= (0.45 + 0.55 * np.sin(np.pi * np.clip(lum, 0, 1)) ** 0.7)
blurred = np.clip(amount / 1.2, 0, 1)                           # 0 where untouched, 1 where well blurred
out = out + n * blurred
Image.fromarray(np.clip(out, 0, 255).astype('uint8')).save(a.dst, quality=a.quality, optimize=True, subsampling=0)
print(f'{a.dst}: sigma {a.sigma} on boards, focus box {a.focus}, ladder {ladder}')
