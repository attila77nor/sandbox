/* Round 8: a recreation, for Analytika, of a web page Atle sent as a reference (party.tokyo-style: a flat saturated colour, a light
   card with a stair-stepped colour shape cut into it, a big bold word, thin lines that turn from vector letters into pixel letters,
   a dark pill menu at the bottom). Changed on request: our colours (the brand blue as the ground and the cut-out, marine for the
   pills, deep blue for the bands), the pixel shape is an actuarial graph (three to choose from: a survival curve, a claims
   development curve, a development triangle), "Analytika" instead of the party word, our five areas instead of the thin lines,
   and the logo in white on the blue. The picture is SVG in the reference's own coordinates (936 x 702, measured from the
   reference); the type is HTML, with the pixel letters drawn from a 5 x 7 bitmap font so they stay crisp at any size. */
import { readFileSync } from 'node:fs';
import { write, logoDefs, SKETCH } from './explore-shared.mjs';

const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('../assets/vendor/fonts/' + f, import.meta.url)).toString('base64');
const AREAS = ['Actuary', 'Pricing', 'Data platforms', 'Consulting', 'Business development'];
/* P = a pixel letter, R = a regular letter. The pixel part shifts from line to line, as on the reference. */
const MODES = ['PPPPPRR', 'PRPPRRR', 'PPPPRRRRRRRRRR', 'RPPPPRRRRR', 'PPPPPPPPRRRRRRRRRRRR'];
const NAV = ['People', 'Insights', 'Products', 'About us', 'Contact'];

/* a 5 x 7 bitmap font, capitals only */
const BITS = {
  A: '01110 10001 10001 11111 10001 10001 10001', B: '11110 10001 10001 11110 10001 10001 11110', C: '01110 10001 10000 10000 10000 10001 01110',
  D: '11110 10001 10001 10001 10001 10001 11110', E: '11111 10000 10000 11110 10000 10000 11111', F: '11111 10000 10000 11110 10000 10000 10000',
  G: '01110 10001 10000 10111 10001 10001 01111', I: '01110 00100 00100 00100 00100 00100 01110', L: '10000 10000 10000 10000 10000 10000 11111',
  M: '10001 11011 10101 10101 10001 10001 10001', N: '10001 11001 10101 10011 10001 10001 10001', O: '01110 10001 10001 10001 10001 10001 01110',
  P: '11110 10001 10001 11110 10000 10000 10000', R: '11110 10001 10001 11110 10100 10010 10001', S: '01111 10000 10000 01110 00001 00001 11110',
  T: '11111 00100 00100 00100 00100 00100 00100', U: '10001 10001 10001 10001 10001 10001 01110', V: '10001 10001 10001 10001 10001 01010 00100',
  Y: '10001 10001 01010 00100 00100 00100 00100',
};
const glyph = (ch) => {
  const rows = BITS[ch].split(' '); let d = '';
  rows.forEach((r, y) => { for (let x = 0; x < 5;) { if (r[x] === '1') { let w = 1; while (r[x + w] === '1') w++; d += `M${x} ${y}h${w}v1h${-w}z`; x += w; } else x++; } });
  return `<svg class="p" viewBox="0 0 5 7" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
};
const line = (word, modes) => {
  let i = 0, out = '';
  for (const ch of word) { out += ch === ' ' ? '<span class="sp"></span>' : (modes[i] === 'P' && BITS[ch] ? glyph(ch) : `<span class="r">${ch}</span>`); if (ch !== ' ') i++; }
  return out;
};

/* the grid: the card is 842 x 475 in shot coordinates, 23 x 13 cells */
const COLS = 23, ROWS = 13, CW = 842 / COLS, CH = 475 / ROWS;
const BLUE = '#1B92D0', DEEP = '#036194', MARINE = '#1E3363', LIGHT = '#7DC6EC', WHITE = '#FFFFFF';   // LIGHT: a tint of our blue, so black text stays readable over the band
const cellsOf = {
  /* the area ABOVE a survival curve, stepping down from the top left to the bottom right; a band in a light tint of the blue along the edge, censoring ticks in white */
  overlevelse() {
    const s = [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 12, 12, 11, 10, 10, 8, 7, 5, 3, 1, 0]; // grey cells counted from the bottom
    const c = [];
    for (let x = 0; x < COLS; x++) for (let y = 0; y < ROWS - s[x]; y++) { const edge = ROWS - s[x] - 1 - y; c.push([x, y, edge <= 1 ? LIGHT : BLUE]); }
    [[14, 0], [16, 0], [18, 0], [20, 0]].forEach(([x]) => { const y = ROWS - s[x] - 3; if (y >= 0) { const k = c.find((q) => q[0] === x && q[1] === y); if (k) k[2] = WHITE; } });
    return c;
  },
  /* the area UNDER a cumulative claims development curve, rising to the right; the band along the top edge in a light tint of the blue */
  utvikling() {
    const h = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 8, 8, 9, 10, 11, 11, 12, 12]; // blue cells counted from the bottom
    const c = [];
    for (let x = 0; x < COLS; x++) for (let y = ROWS - h[x]; y < ROWS; y++) c.push([x, y, y - (ROWS - h[x]) <= 1 ? LIGHT : BLUE]);
    [[6, 0], [10, 0], [14, 0], [18, 0], [21, 0]].forEach(([x]) => { const y = ROWS - h[x] + 2; const k = c.find((q) => q[0] === x && q[1] === y); if (k) k[2] = WHITE; });
    return c;
  },
  /* the lower right half of a run-off triangle, 12 x 12 cells, shaded by size: the part still to be estimated */
  trekant() {
    const c = [], n = 12;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i + j >= n - 1) { const t = (i + j - (n - 1)) / (n - 1); c.push([COLS - n + j, ROWS - n + i, t < 0.34 ? BLUE : t < 0.67 ? '#1782B9' : DEEP]); }
    return c;
  },
};
const NOTCH = [[0, 0, BLUE], [1, 0, BLUE]];
const pathOf = (cells) => { const by = {}; cells.forEach(([x, y, col]) => (by[col] ||= []).push([x, y])); return Object.entries(by).map(([col, list]) => {
  const rows = {}; list.forEach(([x, y]) => (rows[y] ||= []).push(x)); let d = '';
  for (const [y, xs] of Object.entries(rows)) { xs.sort((a, b) => a - b); for (let i = 0; i < xs.length;) { let j = i; while (xs[j + 1] === xs[j] + 1) j++; d += `M${(47 + xs[i] * CW).toFixed(2)} ${(114 + y * CH).toFixed(2)}h${((j - i + 1) * CW).toFixed(2)}v${CH.toFixed(2)}h${(-(j - i + 1) * CW).toFixed(2)}z`; i = j + 1; } }
  return `<path fill="${col}" d="${d}"/>`; }).join(''); };

const SHAPES = Object.fromEntries(Object.entries(cellsOf).map(([k, f]) => [k, { cells: f(), label: { overlevelse: 'Overlevelseskurve', utvikling: 'Utviklingskurve', trekant: 'Utviklingstrekant' }[k] }]));

const shotSvg = `<svg class="art" viewBox="0 0 936 702" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
<defs><filter id="sh" x="-10%" y="-10%" width="120%" height="125%"><feGaussianBlur stdDeviation="14"/></filter></defs>
<rect width="936" height="702" fill="${BLUE}"/>
<rect x="47" y="126" width="842" height="475" rx="10" fill="#0B4F8A" opacity=".35" filter="url(#sh)"/>
<rect x="47" y="114" width="842" height="475" rx="10" fill="#F1F2F4"/>
<g shape-rendering="crispEdges">${Object.entries(SHAPES).map(([k, s]) => `<g class="g-${k}">${pathOf(s.cells)}</g>`).join('')}<g>${pathOf(NOTCH)}</g></g>
</svg>`;

const css = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-500-normal.woff2')}) format("woff2");font-weight:500;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-700-normal.woff2')}) format("woff2");font-weight:700;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:block}
:root{--blue:${BLUE};--deep:${DEEP};--marine:${MARINE};--ink:#14161B}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;min-height:100vh;display:grid;place-content:center;gap:18px;padding:clamp(14px,3vw,40px);background:#F7F7F7;color:var(--ink);font:400 14px/1.5 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.frame{container-type:inline-size;width:min(94vw,1180px);aspect-ratio:936/702;margin:0}
.shot{position:relative;width:100%;height:100%;overflow:hidden;border-radius:1.2cqw;background:var(--blue)}
.art{position:absolute;inset:0;width:100%;height:100%;display:block}
.art [class^="g-"]{display:none}
.frame[data-shape="overlevelse"] .g-overlevelse,.frame[data-shape="utvikling"] .g-utvikling,.frame[data-shape="trekant"] .g-trekant{display:inline}
/* the type: positions are the reference's, in percent of the shot */
.type{position:absolute;left:8%;top:17.5%;margin:0;padding:0;list-style:none;color:var(--ink)}
.type h1{margin:0;font:700 7cqw/1 "Hanken Grotesk",sans-serif;letter-spacing:-.018em;text-transform:uppercase}
.type ul{margin:3.4cqw 0 0;padding:0;list-style:none;font:500 4.9cqw/1 "Hanken Grotesk",sans-serif;text-transform:uppercase}
.type li{display:flex;align-items:flex-end;margin:0 0 2.5cqw;white-space:nowrap;letter-spacing:.012em;height:.7em}
.type li:last-child{margin-bottom:0}
.type .r{display:block;line-height:.7em;height:.7em;overflow:visible;margin-right:.02em}
.type .p{display:block;height:.7em;width:.5em;fill:currentColor;margin-right:.1em;shape-rendering:crispEdges}
.type .sp{display:block;width:.42em}
.logo{position:absolute;left:5.03%;top:5.7%;width:20.5%;display:block;aspect-ratio:5.349;--lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff}
.pills{position:absolute;right:4.2%;bottom:16.6%;display:flex;gap:.6cqw;align-items:center}
.pill{display:flex;align-items:center;height:4.6cqw;border-radius:99px;background:var(--marine);box-shadow:0 0 0 1px rgba(255,255,255,.14);color:#fff;font-size:max(12px,1.02cqw);font-weight:500;letter-spacing:.03em;text-transform:uppercase}
.pill.nav{gap:2.1cqw;padding:0 2.3cqw}
.pill.cta{padding:0 1.8cqw}
.pill a{transition:opacity .15s ease-out}.pill a:hover{opacity:.7}
:focus-visible{outline:2px solid #fff;outline-offset:3px}
.opt{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 8px;font-size:13px;color:#5C616C}
.opt button{background:none;border:1px solid transparent;border-radius:4px;padding:5px 11px;font:inherit;color:inherit;cursor:pointer}
.opt button:hover{color:var(--ink)}.opt button[aria-pressed=true]{color:var(--ink);border-color:var(--ink)}
.sketch{margin:0;text-align:center;font-size:12px;color:#5C616C}
@media (max-width:640px){.pills{display:none}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, pikslene (sketch)</title><style>${css}</style></head><body>${logoDefs}
<figure class="frame" data-shape="overlevelse"><div class="shot">${shotSvg}
<div class="type"><h1>Analytika</h1><ul aria-label="Areas">${AREAS.map((a, i) => `<li><span class="sr">${a}</span><span style="display:flex;align-items:flex-end" aria-hidden="true">${line(a.toUpperCase(), MODES[i])}</span></li>`).join('')}</ul></div>
<svg class="logo" role="img" aria-label="Analytika"><use href="#lg-full"/></svg>
<div class="pills"><nav class="pill nav" aria-label="Pages">${NAV.map((n) => `<a href="../site/${n.toLowerCase().replace(' ', '')}.html">${n}</a>`).join('')}</nav><a class="pill cta" href="../site/about.html#join">Join us</a></div>
</div></figure>
<div class="opt" role="group" aria-label="Graf"><span>Graf</span>${Object.entries(SHAPES).map(([k, s]) => `<button type="button" data-shape="${k}" aria-pressed="${k === 'overlevelse'}">${s.label}</button>`).join('')}</div>
${SKETCH('Sketch, round 8 · a recreation of a reference page for Analytika: our blue, the pixel shape is an actuarial graph (three to choose from), our five areas in the thin lines, the logo in white on the blue above the card. Pages behind it are not designed in this style.')}
<script>(function(){var f=document.querySelector('.frame'),b=[].slice.call(document.querySelectorAll('.opt button'));
function set(k){f.dataset.shape=k;b.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.shape===k?'true':'false');});}
b.forEach(function(x){x.addEventListener('click',function(){set(x.dataset.shape);});});
addEventListener('message',function(e){if(e.data&&e.data.shape)set(e.data.shape);});
var q=location.hash.slice(1);if(q&&${JSON.stringify(Object.keys(SHAPES))}.indexOf(q)>-1)set(q);})();</script>
</body></html>`;

write('forside-pixel.html', html);
