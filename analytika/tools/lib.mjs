import { readFileSync } from 'node:fs';
const logoSvg = readFileSync(new URL('../assets/logo/logo.svg', import.meta.url), 'utf8');
// ---------- logo: split mark and wordmark, recolour through CSS variables ----------
const pathRe = /<path\b[^>]*\/>/g;
const paths = logoSvg.match(pathRe);
const parsed = paths.map((p) => {
  const d = p.match(/ d="([^"]+)"/)[1];
  const nums = d.match(/-?\d+(\.\d+)?/g).map(Number);
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const fill = p.match(/fill="rgb\(([^)]+)\)"/)[1];
  return { d, minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys), fill };
});
const colour = (fill, isWord) => {
  if (fill.startsWith('11.79')) return isWord ? 'var(--lg-word,#1E3363)' : 'var(--lg-ink,#1E3363)';
  if (fill.startsWith('10.59')) return 'var(--lg-blue,#1B92D0)';
  return 'var(--lg-deep,#036194)';
};
const WORD_FROM = 740;
const markP = parsed.filter((p) => p.maxX < WORD_FROM);
const wordP = parsed.filter((p) => p.minX >= WORD_FROM);
const box = (list) => {
  const x0 = Math.min(...list.map((p) => p.minX)), x1 = Math.max(...list.map((p) => p.maxX));
  const y0 = Math.min(...list.map((p) => p.minY)), y1 = Math.max(...list.map((p) => p.maxY));
  return { x0, y0, w: x1 - x0, h: y1 - y0 };
};
const fb = box(parsed), mb = box(markP);
const mk = (list) => list.map((p) => `<path style="fill:${colour(p.fill, p.minX >= WORD_FROM)}" d="${p.d}"/>`).join('');
const logoDefs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="lg-full" viewBox="${fb.x0} ${fb.y0} ${fb.w} ${fb.h}">${mk(parsed)}</symbol>
<symbol id="lg-mark" viewBox="${mb.x0} ${mb.y0} ${mb.w} ${mb.h}">${mk(markP)}</symbol>
</defs></svg>`;
console.log('logo aspect full', (fb.w / fb.h).toFixed(3), 'mark', (mb.w / mb.h).toFixed(3), 'paths', parsed.length, 'mark paths', markP.length, 'word paths', wordP.length);

// ---------- contours: marching squares over a synthetic height field ----------
const W = 1000, H = 625, NX = 200, NY = 125;
function height(x, y) {
  const g = (cx, cy, sx, sy, a) => a * Math.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2));
  let h = 0;
  h += g(650, 330, 230, 170, 1.0);
  h += g(830, 200, 110, 90, 0.75);
  h += g(540, 430, 100, 80, 0.6);
  h += g(760, 485, 120, 70, 0.65);
  h += g(915, 395, 90, 110, 0.7);
  h += g(610, 215, 90, 80, 0.55);
  h += g(300, 160, 150, 110, 0.32);
  h += g(130, 540, 170, 100, 0.25);
  h += 0.03 * Math.sin(x * 0.021 + 1.3) * Math.cos(y * 0.027 + 0.4);
  h += 0.018 * Math.sin(x * 0.047 + y * 0.031);
  return h;
}
const cw = W / (NX - 1), ch = H / (NY - 1);
const grid = [];
for (let j = 0; j < NY; j++) { const row = []; for (let i = 0; i < NX; i++) row.push(height(i * cw, j * ch)); grid.push(row); }
const flat = grid.flat();
const vmin = Math.min(...flat), vmax = Math.max(...flat);

function contour(level) {
  const pts = new Map();
  const adj = new Map();
  const edgePt = (kind, i, j, a, b, xa, ya, xb, yb) => {
    const id = `${kind}:${i}:${j}`;
    if (!pts.has(id)) { const t = (level - a) / (b - a); pts.set(id, [xa + (xb - xa) * t, ya + (yb - ya) * t]); }
    return id;
  };
  const link = (a, b) => { (adj.get(a) || adj.set(a, []).get(a)).push(b); (adj.get(b) || adj.set(b, []).get(b)).push(a); };
  for (let j = 0; j < NY - 1; j++) for (let i = 0; i < NX - 1; i++) {
    const tl = grid[j][i], tr = grid[j][i + 1], br = grid[j + 1][i + 1], bl = grid[j + 1][i];
    const x0 = i * cw, x1 = (i + 1) * cw, y0 = j * ch, y1 = (j + 1) * ch;
    const c = (tl >= level ? 8 : 0) | (tr >= level ? 4 : 0) | (br >= level ? 2 : 0) | (bl >= level ? 1 : 0);
    if (c === 0 || c === 15) continue;
    const top = () => edgePt('h', i, j, tl, tr, x0, y0, x1, y0);
    const bottom = () => edgePt('h', i, j + 1, bl, br, x0, y1, x1, y1);
    const left = () => edgePt('v', i, j, tl, bl, x0, y0, x0, y1);
    const right = () => edgePt('v', i + 1, j, tr, br, x1, y0, x1, y1);
    const centerHigh = (tl + tr + br + bl) / 4 >= level;
    switch (c) {
      case 1: case 14: link(left(), bottom()); break;
      case 2: case 13: link(bottom(), right()); break;
      case 3: case 12: link(left(), right()); break;
      case 4: case 11: link(top(), right()); break;
      case 6: case 9: link(top(), bottom()); break;
      case 7: case 8: link(top(), left()); break;
      case 5: if (centerHigh) { link(top(), left()); link(right(), bottom()); } else { link(top(), right()); link(left(), bottom()); } break;
      case 10: if (centerHigh) { link(top(), right()); link(left(), bottom()); } else { link(top(), left()); link(right(), bottom()); } break;
    }
  }
  const seen = new Set();
  const lines = [];
  const walk = (start) => {
    const line = [start]; seen.add(start);
    let prev = null, cur = start;
    for (;;) {
      const next = (adj.get(cur) || []).find((n) => n !== prev && !seen.has(n));
      if (!next) break;
      line.push(next); seen.add(next); prev = cur; cur = next;
    }
    // close loops
    const first = line[0], last = line[line.length - 1];
    if (line.length > 2 && (adj.get(last) || []).includes(first)) line.push(first);
    return line;
  };
  for (const [id, nb] of adj) if (nb.length === 1 && !seen.has(id)) lines.push(walk(id));
  for (const id of adj.keys()) if (!seen.has(id)) lines.push(walk(id));
  return lines.map((l) => 'M' + l.map((id) => pts.get(id).map((v) => v.toFixed(1)).join(' ')).join('L')).join('');
}
const LEVELS = 34;
let idx = '', reg = '';
for (let k = 1; k <= LEVELS; k++) {
  const level = vmin + ((vmax - vmin) * k) / (LEVELS + 1);
  const d = contour(level);
  if (!d) continue;
  if (k % 5 === 0) idx += `<path d="${d}"/>`; else reg += `<path d="${d}"/>`;
}
const contours = `<g class="d-reg" fill="none">${reg}</g><g class="d-idx" fill="none">${idx}</g>`;
console.log('contour bytes', contours.length);


export { logoDefs, contours };
