#!/usr/bin/env python3
"""Which crop of the office photograph is best, if something up close is in focus and the five boards sit soft behind it?

Needs Pillow and numpy only.  Usage: crop-analysis.py [PHOTO] [OUTDIR]
It scores every crop (zoom 1.0-2.6, every 10 px of position) on a handful of plain, visible criteria,
checks how stable the winners are when the weights are shaken, and measures how much blur the five boards
can take before they stop being five recognisable boards.  Writes crop-analysis.json and the overview images.
Subject and board boxes are measured by eye in the 1672 x 941 photograph (see SUBJECTS and BOARDS)."""
import json, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

PHOTO = sys.argv[1] if len(sys.argv) > 1 else '../assets/photo/ekte-kontor-v5-neutral.jpg'
OUT = sys.argv[2] if len(sys.argv) > 2 else '../concepts/utsnitt'
rng = np.random.default_rng(7)

im = Image.open(PHOTO).convert('L')
IW, IH = im.size
L = np.asarray(im, dtype=np.float64) / 255.0
# linear luminance for contrast ratios (the photograph is neutral grey, so sRGB decoding is enough)
LIN = np.where(L <= 0.04045, L / 12.92, ((L + 0.055) / 1.055) ** 2.4)

BOARDS = [(567, 380, 654, 469), (661, 380, 749, 469), (756, 380, 844, 469), (851, 380, 939, 469), (945, 380, 1028, 469)]
BX0, BY0, BX1, BY1 = 567, 380, 1028, 469
SUBJECTS = {  # x0 y0 x1 y1, photograph pixels
    'arbeidsbordet (nede til venstre)': (130, 606, 720, 824),
    'pulten med skjerm og hjelm (til høyre)': (1283, 498, 1672, 786),
    'spisebordet (midtgrunn)': (835, 505, 1132, 697),
    'ingen forgrunn (bare tavlene)': None,
}
ASPECT = 1.6          # reference screen 16:10; other shapes are checked afterwards
REF_W = 1440          # reference screen width in px, for the resolution criterion

def integral(a):
    s = np.zeros((a.shape[0] + 1, a.shape[1] + 1)); s[1:, 1:] = a.cumsum(0).cumsum(1); return s
def box(S, x0, y0, x1, y1):
    return S[y1, x1] - S[y0, x1] - S[y1, x0] + S[y0, x0]
I1, I2 = integral(LIN), integral(LIN ** 2)
def p90(x0, y0, x1, y1):
    """mean + 1.28 std of the linear luminance in a box, close to its 90th percentile"""
    n = (x1 - x0) * (y1 - y0); m = box(I1, x0, y0, x1, y1) / n; v = max(box(I2, x0, y0, x1, y1) / n - m * m, 0)
    return m + 1.28 * np.sqrt(v), m, np.sqrt(v)
def white_contrast(x0, y0, x1, y1):
    return 1.05 / (p90(x0, y0, x1, y1)[0] + 0.05)

gy, gx = np.gradient(L); EDGE = np.hypot(gx, gy); IE = integral(EDGE); EDGE_MEAN = EDGE.mean()
def trap(v, a, b, c, d):
    """0 below a, rises to 1 at b, stays 1 until c, falls to 0 at d"""
    if v <= a or v >= d: return 0.0
    if v < b: return (v - a) / (b - a)
    if v <= c: return 1.0
    return (d - v) / (d - c)

# ---------- criteria for one crop ----------
CRIT = ['tavler_størrelse', 'forgrunn_plassering', 'forgrunn_størrelse', 'avstand_tavle_forgrunn', 'oppløsning', 'tittel_over_tavlene', 'tittel_fri_plass', 'kanter', 'liv']
BASE_W = np.array([.20, .18, .10, .10, .14, .10, .06, .04, .08])

def crop_rect(z, cx, cy, aspect=ASPECT):
    h = IH / z; w = h * aspect
    if w > IW: w = IW; h = w / aspect
    x0 = min(max(cx - w / 2, 0), IW - w); y0 = min(max(cy - h / 2, 0), IH - h)
    return x0, y0, w, h

def criteria(z, cx, cy, subj, aspect=ASPECT):
    x0, y0, w, h = crop_rect(z, cx, cy, aspect); x1, y1 = x0 + w, y0 + h
    m = 0.03 * w
    if BX0 < x0 + m or BX1 > x1 - m or BY0 < y0 + 0.06 * h or BY1 > y1 - 0.03 * h:   # boards must be wholly inside, with some air
        return None
    c = {}
    span = (BX1 - BX0) / w
    c['tavler_størrelse'] = trap(span, 0.20, 0.30, 0.46, 0.60)       # 'in the background' but still recognisable
    if subj is None:
        c['forgrunn_plassering'] = c['forgrunn_størrelse'] = c['avstand_tavle_forgrunn'] = 0.0
    else:
        sx0, sy0, sx1, sy1 = subj; ix0, iy0, ix1, iy1 = max(sx0, x0), max(sy0, y0), min(sx1, x1), min(sy1, y1)
        inside = max(ix1 - ix0, 0) * max(iy1 - iy0, 0) / ((sx1 - sx0) * (sy1 - sy0))
        if inside < .75: return None
        u, v = ((ix0 + ix1) / 2 - x0) / w, ((iy0 + iy1) / 2 - y0) / h
        d = min(np.hypot(u - a, v - b) for a in (1 / 3, 2 / 3) for b in (1 / 3, 2 / 3))
        c['forgrunn_plassering'] = np.exp(-(d / .2) ** 2) * inside ** 2
        c['forgrunn_størrelse'] = trap(((ix1 - ix0) * (iy1 - iy0)) / (w * h), .02, .07, .22, .40)
        c['avstand_tavle_forgrunn'] = trap((max(sy0, y0) - BY1) / h, .02, .15, 1, 1.01) if sy0 > BY1 else 0.0
    s = REF_W / w                                                    # screen px per photograph px
    c['oppløsning'] = trap(-s, -2.1, -1.35, 0, 1) if s > 1.35 else 1.0   # sharp up to 1.35x, gone at 2.1x
    # a title sign just above the boards, centred on them: needs white-text contrast of at least 3:1
    tw, th = 0.30 * w, 0.085 * h; tx = (BX0 + BX1) / 2 - tw / 2; ty = BY0 - 0.04 * h - th
    if ty >= y0 + 0.02 * h:
        cr = white_contrast(int(tx), int(ty), int(tx + tw), int(ty + th)); c['tittel_over_tavlene'] = float(np.clip((cr - 2) / 2.5, 0, 1))
    else:
        c['tittel_over_tavlene'] = 0.0
    # any calm place at all for a title of the same size (not over boards or the focus subject)
    best = 0.0
    for fx in np.linspace(0.04, 0.96 - 0.30, 9):
        for fy in np.linspace(0.04, 0.88, 9):
            bx0, by0 = int(x0 + fx * w), int(y0 + fy * h); bx1, by1 = int(bx0 + tw), int(by0 + th)
            if bx1 > x1 or by1 > y1: continue
            if not (bx1 < BX0 or bx0 > BX1 or by1 < BY0 - 4 or by0 > BY1 + 4): continue
            if subj and not (bx1 < subj[0] or bx0 > subj[2] or by1 < subj[1] or by0 > subj[3]): continue
            best = max(best, white_contrast(bx0, by0, bx1, by1))
    c['tittel_fri_plass'] = float(np.clip((best - 2) / 2.5, 0, 1))
    # the crop edge should not slice through busy detail
    bw = max(int(.012 * w), 3); strips = [(x0, y0, x1, y0 + bw), (x0, y1 - bw, x1, y1), (x0, y0, x0 + bw, y1), (x1 - bw, y0, x1, y1)]
    e = np.mean([box(IE, int(a), int(b), int(c_), int(d_)) / ((int(c_) - int(a)) * (int(d_) - int(b))) for a, b, c_, d_ in strips]) / EDGE_MEAN
    c['kanter'] = float(np.clip(1.5 - e, 0, 1))
    inner = box(IE, int(x0), int(y0), int(x1), int(y1)) / (int(x1 - x0) * int(y1 - y0)) / EDGE_MEAN
    c['liv'] = float(np.clip((inner - 0.8) / 0.9, 0, 1))             # more small things = more 'someone works here'
    return np.array([c[k] for k in CRIT]), (x0, y0, w, h)

# ---------- search ----------
ZOOMS = [round(z, 2) for z in np.arange(1.0, 2.61, 0.1)]
def search(subj):
    rows = []
    for z in ZOOMS:
        _, _, w, h = crop_rect(z, IW / 2, IH / 2)
        for cx in range(int(w / 2), IW - int(w / 2) + 1, 10):
            for cy in range(int(h / 2), IH - int(h / 2) + 1, 10):
                r = criteria(z, cx, cy, subj)
                if r is not None: rows.append((z, cx, cy, r[0], r[1]))
    return rows

def iou(a, b):
    ax0, ay0, aw, ah = a; bx0, by0, bw, bh = b
    iw = max(min(ax0 + aw, bx0 + bw) - max(ax0, bx0), 0); ih = max(min(ay0 + ah, by0 + bh) - max(ay0, by0), 0)
    return iw * ih / (aw * ah + bw * bh - iw * ih)

def top_distinct(rows, W, n=4, thr=.55):
    sc = np.array([r[3] @ W for r in rows]); order = np.argsort(-sc); chosen = []
    for i in order:
        if all(iou(rows[i][4], rows[j][4]) < thr for j in chosen): chosen.append(i)
        if len(chosen) == n: break
    return chosen, sc

result = {'photo': PHOTO, 'size': [IW, IH], 'criteria': CRIT, 'weights': BASE_W.tolist(), 'archetypes': {}}
all_best = {}
for name, subj in SUBJECTS.items():
    rows = search(subj)
    if not rows: result['archetypes'][name] = {'crops': [], 'candidates': 0}; continue
    W = BASE_W.copy()
    if subj is None: W[[1, 2, 3]] = 0
    W = W / W.sum()
    chosen, sc = top_distinct(rows, W)
    # robustness: shake the weights, see how often each winner's neighbourhood wins
    draws = 400; wins = np.zeros(len(chosen)); top3 = np.zeros(len(chosen))
    M = np.array([r[3] for r in rows])
    for _ in range(draws):
        Wr = BASE_W * np.exp(rng.normal(0, .55, len(CRIT)))
        if subj is None: Wr[[1, 2, 3]] = 0
        Wr /= Wr.sum(); s = M @ Wr; o = np.argsort(-s)[:40]
        grp = [next((k for k, j in enumerate(chosen) if iou(rows[i][4], rows[j][4]) >= .55), None) for i in o]
        if grp[0] is not None: wins[grp[0]] += 1
        seen = []
        for g in grp:
            if g is not None and g not in seen: seen.append(g)
            if len(seen) == 3: break
        for g in seen: top3[g] += 1
    crops = []
    for k, i in enumerate(chosen):
        z, cx, cy, c, (x0, y0, w, h) = rows[i]
        # same crop on other screen shapes: still valid (boards inside, subject inside)?
        shapes = {}
        for label, a in (('4:3', 4 / 3), ('16:9', 16 / 9), ('21:9', 21 / 9)):
            r = criteria(z, cx, cy, subj, a); shapes[label] = None if r is None else round(float(r[0] @ W), 3)
        crops.append({'score': round(float(sc[i]), 3), 'zoom': z, 'focus': [cx, cy], 'rect16x10': [round(x0), round(y0), round(w), round(h)],
                      'board_span_pct': round(100 * (BX1 - BX0) / w, 1), 'screen_px_per_photo_px_1440': round(REF_W / w, 2),
                      'criteria': {k: round(float(v), 2) for k, v in zip(CRIT, c)},
                      'wins_pct': round(100 * wins[k] / draws), 'top3_pct': round(100 * top3[k] / draws), 'other_shapes': shapes})
    curve = []
    for z in ZOOMS:
        zr = [r for r in rows if r[0] == z]
        if not zr: curve.append({'zoom': z, 'valid': 0}); continue
        b = max(zr, key=lambda r: r[3] @ W); _, _, w_, h_ = crop_rect(z, b[1], b[2])
        curve.append({'zoom': z, 'valid': len(zr), 'best': round(float(b[3] @ W), 3), 'focus': [b[1], b[2]], 'board_span_pct': round(100 * (BX1 - BX0) / w_, 1),
                      'weakest': CRIT[int(np.argmin(np.where(W > 0, b[3], 9)))]})
    result['archetypes'][name] = {'candidates': len(rows), 'crops': crops, 'zoom_curve': curve}
    all_best[name] = (rows, chosen, W)
    print(f'\n{name}: {len(rows)} valid crops')
    print('  zoom: valid crops / best score / boards % of width / weakest criterion of the best')
    print('   ' + '  '.join(f"{c['zoom']}:{c['valid']}/{c.get('best', '-')}/{c.get('board_span_pct', '-')}/{c.get('weakest', '-')[:8]}" for c in curve if c['zoom'] in (1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2)))
    for c in crops:
        print(f"  score {c['score']:.3f}  zoom {c['zoom']}  focus {c['focus']}  boards {c['board_span_pct']}% of width  {c['screen_px_per_photo_px_1440']} px/px  wins {c['wins_pct']}%  top3 {c['top3_pct']}%  shapes {c['other_shapes']}")

# ---------- how much blur can the five boards take? ----------
def gauss1d(sig):
    r = int(np.ceil(sig * 4)); x = np.arange(-r, r + 1); k = np.exp(-x * x / (2 * sig * sig)); return k / k.sum()
def blur_img(a, sig):
    if sig <= 0: return a
    k = gauss1d(sig); p = len(k) // 2
    t = np.pad(a, ((0, 0), (p, p)), mode='reflect'); t = np.apply_along_axis(lambda v: np.convolve(v, k, 'valid'), 1, t)
    t = np.pad(t, ((p, p), (0, 0)), mode='reflect'); return np.apply_along_axis(lambda v: np.convolve(v, k, 'valid'), 0, t)
band = L[392:458, 540:1056]; ids = {}
def patches(sig, ref_sig=2.0):
    big = L[360:490, 540:1056]
    def cut(a): return [Image.fromarray((a[BOARDS[i][1] - 360 + 6:BOARDS[i][3] - 360 - 6, BOARDS[i][0] - 540 + 6:BOARDS[i][2] - 540 - 6] * 255).astype('uint8')).resize((40, 40), Image.LANCZOS) for i in range(5)]
    return [np.asarray(p, float) for p in cut(blur_img(big, sig))], [np.asarray(p, float) for p in cut(blur_img(big, ref_sig))]
def ncc(a, b):
    a = a - a.mean(); b = b - b.mean(); return float((a * b).sum() / (np.sqrt((a * a).sum() * (b * b).sum()) + 1e-9))
def blur_report(sig):
    prof = L[392:458, 520:1076].mean(0); pb = blur_img(prof[None, :], sig)[0] if sig > 0 else prof
    gaps = [(657, 654, 661), (752, 749, 756), (847, 844, 851), (942, 939, 945)]
    ret = []
    for g, a, b in gaps:
        gi = g - 520; bi = (a - 520 - 30, b - 520 + 30)
        side = (prof[(a - 520 - 40):(a - 520 - 15)].mean() + prof[(b - 520 + 15):(b - 520 + 40)].mean()) / 2
        sharp_c = side - prof[gi - 1:gi + 2].mean(); blur_c = (pb[(a - 520 - 40):(a - 520 - 15)].mean() + pb[(b - 520 + 15):(b - 520 + 40)].mean()) / 2 - pb[gi - 1:gi + 2].mean()
        ret.append(min(blur_c / sharp_c, 1.0) if sharp_c > 0 else 0)   # capped: blur also removes dark strokes beside the gap
    blurred, ref = patches(sig)
    M = np.array([[ncc(blurred[i], ref[j]) for j in range(5)] for i in range(5)])
    acc = int(sum(M[i].argmax() == i for i in range(5))); marg = float(np.mean([M[i, i] - np.max(np.delete(M[i], i)) for i in range(5)]))
    return {'sigma': sig, 'gap_contrast_kept': round(float(np.mean(ret)), 2), 'identified': acc, 'identity_margin': round(marg, 2)}
result['blur'] = [blur_report(s) for s in (0, 1, 1.5, 2, 3, 4, 5, 6, 8, 10, 14)]
print('\nBlur on the five boards (sigma in photograph px; multiply by ~1.4 for screen px at 1440 wide):')
for b in result['blur']: print(f"  sigma {b['sigma']:>4}: gaps keep {b['gap_contrast_kept']*100:>4.0f}% of their contrast, {b['identified']}/5 drawings identified, margin {b['identity_margin']:+.2f}")

# ---------- images ----------
import os; os.makedirs(OUT, exist_ok=True)
json.dump(result, open(os.path.join(OUT, 'crop-analysis.json'), 'w'), ensure_ascii=False, indent=1)
try: FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17); FONTS = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
except Exception: FONT = FONTS = ImageFont.load_default()
COL = [(255, 214, 10), (60, 200, 255), (255, 120, 120), (150, 255, 150), (255, 160, 60)]
base = Image.open(PHOTO).convert('RGB')
# 1. the winners over the photograph, one panel per kind of foreground
names = [n for n in SUBJECTS if result['archetypes'][n]['crops']]
panels = []
for name in names:
    p = base.copy(); d = ImageDraw.Draw(p, 'RGBA'); sub = SUBJECTS[name]
    if sub: d.rectangle(sub, outline=(255, 255, 255, 255), width=2)
    d.rectangle((BX0, BY0, BX1, BY1), outline=(255, 255, 255, 255), width=2)
    for k, c in enumerate(result['archetypes'][name]['crops']):
        x0, y0, w, h = c['rect16x10']; col = COL[k]
        d.rectangle((x0, y0, x0 + w, y0 + h), outline=col + (255,), width=4)
        d.rectangle((x0 + 6, y0 + 6, x0 + 250, y0 + 28), fill=(0, 0, 0, 190)); d.text((x0 + 10, y0 + 8), f"{k + 1}  {c['zoom']}×  {c['score']:.2f}  vant {c['wins_pct']}%", fill=col + (255,), font=FONTS)
    d.rectangle((0, IH - 34, 760, IH), fill=(0, 0, 0, 200)); d.text((10, IH - 28), name, fill=(255, 255, 255, 255), font=FONT)
    panels.append(p.resize((836, 470), Image.LANCZOS))
sheet = Image.new('RGB', (836 * 2 + 30, 470 * 2 + 30), (20, 22, 27))
for i, p in enumerate(panels[:4]): sheet.paste(p, (10 + (i % 2) * 846, 10 + (i // 2) * 480))
sheet.save(os.path.join(OUT, 'utsnitt-oversikt.jpg'), quality=90)

# 2. the score as a map: where the centre of a crop should sit, per zoom, for the work desk
rows, chosen, W = all_best[names[0]]
tiles = []
for z in (1.2, 1.4, 1.6, 1.8, 2.0, 2.2):
    g = np.zeros((IH // 10 + 1, IW // 10 + 1))
    for r in rows:
        if r[0] == z: g[r[2] // 10, r[1] // 10] = r[3] @ W
    mx = max(max((r[3] @ W for r in rows)), 1e-6)
    t = Image.fromarray((np.clip(g / mx, 0, 1) * 255).astype('uint8')).resize((IW // 4, IH // 4), Image.NEAREST).convert('RGB')
    base4 = base.resize((IW // 4, IH // 4)); a = np.asarray(base4, float) * .45; b = np.asarray(t, float)
    heat = np.zeros_like(a); heat[..., 0] = b[..., 0]; heat[..., 1] = b[..., 0] * .75; heat[..., 2] = b[..., 0] * .1
    tt = Image.fromarray(np.clip(np.where(b > 0, a + heat * .8, a), 0, 255).astype('uint8')); ImageDraw.Draw(tt).text((8, 6), f'{z}×', fill=(255, 255, 255), font=FONT); tiles.append(tt)
hm = Image.new('RGB', (418 * 3 + 40, 235 * 2 + 30), (20, 22, 27))
for i, t in enumerate(tiles): hm.paste(t, (10 + (i % 3) * 428, 10 + (i // 3) * 245))
hm.save(os.path.join(OUT, 'utsnitt-score-kart.jpg'), quality=90)

# 3. the five boards at each blur strength, at the scale of the 1.2x page (1.15 screen px per photograph px)
levels = [(0, 'ingen'), (2.5, 'lett  2,5'), (4.5, 'middels  4,5'), (7, 'sterk  7'), (10, 'for sterk  10')]
box_ = (500, 366, 1096, 484); sc_ = 1.15; tw, th = int((box_[2] - box_[0]) * sc_), int((box_[3] - box_[1]) * sc_)
strip = Image.new('RGB', (tw + 190, (th + 8) * len(levels) + 8), (20, 22, 27)); dd = ImageDraw.Draw(strip)
for i, (sg, lab) in enumerate(levels):
    t = (base.filter(ImageFilter.GaussianBlur(sg)) if sg else base).crop(box_).resize((tw, th), Image.LANCZOS)
    strip.paste(t, (180, 8 + i * (th + 8))); dd.text((10, 8 + i * (th + 8) + th // 2 - 8), lab, fill=(235, 238, 243), font=FONT)
strip.save(os.path.join(OUT, 'utsnitt-uskarphet.jpg'), quality=90)
print('\nwrote', os.path.abspath(OUT))
