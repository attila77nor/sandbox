/* The library wall with five chalkboards, drawn as a stand-in for the black-and-white photograph that will replace it.
   Every formula and curve on the boards is correct mathematics. Output: concepts/library/index.html */
import { writeFileSync, mkdirSync } from 'node:fs';
import { logoDefs, AREAS, WORDS, S, q, FONT_LINK } from './figures.mjs';

const mulberry = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const rnd = mulberry(11);
const f1 = (n) => n.toFixed(1);
const poly = (pts) => 'M' + pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L');

/* ---------- books ---------- */
function bay(x0, y0, x1, y1, pitch) {
  let s = `<rect x="${x0}" y="${y0}" width="${x1 - x0}" height="${y1 - y0}" fill="#050608"/>`;
  for (let y = y0; y + pitch <= y1 + 0.5; y += pitch) {
    const yb = y + pitch - 7; let x = x0 + 2;
    while (x < x1 - 9) {
      if (rnd() < 0.045) { x += 9 + rnd() * 14; continue; }
      const w = Math.min(11 + rnd() * 20, x1 - 2 - x), h = (pitch - 20) * (0.72 + rnd() * 0.28), L = Math.round(30 + rnd() * 62);
      const c = `rgb(${L},${L},${L + 3})`, c2 = `rgb(${L + 40},${L + 40},${L + 44})`;
      s += `<rect x="${f1(x)}" y="${f1(yb - h)}" width="${f1(w)}" height="${f1(h)}" fill="${c}"/>`;
      s += `<rect x="${f1(x)}" y="${f1(yb - h * 0.86)}" width="${f1(w)}" height="2.6" fill="${c2}" opacity=".55"/>`;
      if (rnd() < 0.4) s += `<rect x="${f1(x + w * 0.2)}" y="${f1(yb - h * 0.62)}" width="${f1(w * 0.6)}" height="${f1(h * 0.2)}" fill="${c2}" opacity=".6"/>`;
      s += `<rect x="${f1(x)}" y="${f1(yb - h)}" width="1.6" height="${f1(h)}" fill="#fff" opacity=".08"/>`;
      x += w + 0.4;
    }
    s += `<rect x="${x0}" y="${yb}" width="${x1 - x0}" height="7" fill="#0b0c10"/><rect x="${x0}" y="${yb}" width="${x1 - x0}" height="1.6" fill="#fff" opacity=".12"/>`;
  }
  return s;
}

/* ---------- chalk work (everything on the boards is correct mathematics) ---------- */
const T = (x, y, str, size = 18, extra = '') => {
  size = size * 1.12;
  const parts = str.split(/(_\{[^}]*\}|\^\{[^}]*\})/).filter(Boolean).map((p) => {
    if (p.startsWith('_{')) return `<tspan dy="${size * 0.22}" font-size="${size * 0.68}">${p.slice(2, -1)}</tspan><tspan dy="${-size * 0.22}"> </tspan>`.replace('<tspan dy="' + (-size * 0.22) + '"> </tspan>', `<tspan dy="${-size * 0.22}" font-size="1">.</tspan>`);
    if (p.startsWith('^{')) return `<tspan dy="${-size * 0.38}" font-size="${size * 0.68}">${p.slice(2, -1)}</tspan><tspan dy="${size * 0.38}" font-size="1">.</tspan>`;
    return p;
  }).join('');
  return `<text x="${x}" y="${y}" font-size="${size}" ${extra} xml:space="preserve">${parts}</text>`;
};
const C = (d, extra = '') => `<path class="ch" d="${d}" pathLength="1" ${extra}/>`;
const D = (d) => `<path class="dsh" d="${d}"/>`;

const boardArt = [
  () => { // Actuary
    const pts = []; for (let x = 0; x <= 100; x += 2) pts.push([30 + 2.04 * x, 262 - 176 * S(x)]);
    let t = T(16, 36, 'l(x+1) = l(x) (1 - q(x))', 19) + C('M30 262V78M24 86L30 76L36 86M30 262H244M236 256L246 262L236 268') + C(poly(pts));
    t += D(`M${f1(30 + 2.04 * 80)} ${f1(262 - 176 * S(80))}V262`) + `<circle class="ch" cx="${f1(30 + 2.04 * 80)}" cy="${f1(262 - 176 * S(80))}" r="3.5" pathLength="1"/>`;
    t += T(38, 76, 'S(x)', 15) + T(26, 280, '0', 13) + T(124, 280, '50', 13) + T(222, 280, '100', 13);
    t += T(22, 312, 'x', 14) + T(76, 312, 'l(x)', 14) + T(160, 312, 'q(x)', 14);
    [60, 70, 80, 90].forEach((a, i) => { const y = 336 + i * 22; t += T(22, y, String(a), 15) + T(70, y, String(Math.round(100000 * S(a))), 15) + T(160, y, q(a).toFixed(4), 15); });
    return t + T(16, 440, 'e(x) = (1/l(x)) sum l(x+k)', 15);
  },
  () => { // Pricing
    const pts = []; for (let p = 0; p <= 1.001; p += 0.04) pts.push([34 + 190 * p, 268 - 190 * Math.pow(p, 2.2)]);
    let h = ''; for (let p = 0.07; p < 0.97; p += 0.045) h += `M${f1(34 + 190 * p)} ${f1(268 - 190 * p)}V${f1(268 - 190 * Math.pow(p, 2.2))}`;
    let t = T(16, 36, 'ln(m) = b_{0} + b_{1}x_{1} + b_{2}x_{2}', 18) + C('M34 78V268H224') + D('M34 268L224 78') + C(poly(pts)) + `<path class="ch hatch" d="${h}"/>`;
    t += T(150, 178, 'A', 18) + T(188, 236, 'B', 18) + T(20, 84, '1', 13) + T(222, 286, 'p', 14) + T(40, 70, 'L(p)', 14);
    return t + T(16, 316, 'L(p) = p^{2.2}', 19) + T(16, 344, 'G = A/(A+B) = (k-1)/(k+1)', 16) + T(16, 368, '  = 1.2 / 3.2 = 0.375', 16) + T(16, 420, 'P = P_{0} e^{b1 x1} e^{b2 x2}', 16);
  },
  () => { // Data platforms
    let t = '';
    const lab = ['policy', 'claims', 'market', 'finance', 'reins.', 'ext.'];
    for (let k = 0; k < 6; k++) {
      const a = (-90 + 60 * k) * Math.PI / 180, x = 130 + 84 * Math.cos(a), y = 170 + 84 * Math.sin(a);
      t += C(`M${f1(130 + 16 * Math.cos(a))} ${f1(170 + 16 * Math.sin(a))}L${f1(130 + 74 * Math.cos(a))} ${f1(170 + 74 * Math.sin(a))}`) + `<circle class="ch" cx="${f1(x)}" cy="${f1(y)}" r="9" pathLength="1"/>`;
      const dx = Math.cos(a) * 24, dy = Math.sin(a) * 22 + 5; t += T(x + dx - (Math.cos(a) < -0.1 ? 24 : Math.cos(a) > 0.1 ? 0 : 14), y + dy, lab[k], 13);
    }
    t += `<circle class="ch" cx="130" cy="170" r="16" pathLength="1"/>` + T(118, 175, 'core', 12);
    return t + T(16, 300, 'K(1,6):  |V| = 7,  |E| = 6', 18) + T(16, 326, 'diam = 2', 18) + T(16, 372, 'all pairs: 7 x 6 / 2 = 21 links', 16) + T(16, 398, 'via the hub: 6 links', 16);
  },
  () => { // Consulting
    let t = `<rect class="ch" x="26" y="196" width="13" height="13" pathLength="1"/>`;
    const A = [112, 138], B = [112, 270], leaves = [[208, 92], [208, 180], [208, 232], [208, 312]];
    t += C(`M39 202L${A[0] - 9} ${A[1] + 3}`) + C(`M39 204L${B[0] - 9} ${B[1] - 3}`) + `<circle class="ch" cx="${A[0]}" cy="${A[1]}" r="9" pathLength="1"/><circle class="ch" cx="${B[0]}" cy="${B[1]}" r="9" pathLength="1"/>`;
    t += C(`M${A[0] + 8} ${A[1] - 4}L${leaves[0][0]} ${leaves[0][1]}`) + C(`M${A[0] + 8} ${A[1] + 4}L${leaves[1][0]} ${leaves[1][1]}`) + C(`M${B[0] + 8} ${B[1] - 4}L${leaves[2][0]} ${leaves[2][1]}`) + C(`M${B[0] + 8} ${B[1] + 4}L${leaves[3][0]} ${leaves[3][1]}`);
    t += T(A[0] - 4, A[1] - 16, 'A', 16) + T(B[0] - 4, B[1] + 28, 'B', 16);
    t += T(150, 100, '.6', 13) + T(150, 168, '.4', 13) + T(150, 244, '.5', 13) + T(150, 304, '.5', 13);
    t += T(214, 96, '100', 15) + T(214, 184, '-20', 15) + T(214, 236, '70', 15) + T(214, 316, '20', 15);
    return t + T(16, 372, 'EV(A) = .6(100) + .4(-20) = 52', 15) + T(16, 396, 'EV(B) = .5(70) + .5(20) = 45', 15) + C('M18 410Q60 400 108 410Q70 428 40 426') + T(20, 424, 'choose A', 18);
  },
  () => { // Business development
    const pts = []; for (let t = 0; t <= 10.01; t += 0.4) pts.push([30 + 20.4 * t, 262 - 166 / (1 + Math.exp(-1.1 * (t - 5)))]);
    let t = T(16, 36, 'N(t) = K/(1 + e^{-r(t-t0)})', 18) + C('M30 262V78M24 86L30 76L36 86M30 262H244M236 256L246 262L236 268') + D('M30 96H244') + C(poly(pts));
    t += `<circle class="ch" cx="132" cy="179" r="4" pathLength="1"/>` + D('M132 179V262M30 179H132') + T(6, 100, 'K', 14) + T(0, 183, 'K/2', 13) + T(124, 280, 't_{0}', 14) + T(226, 280, 't', 14) + T(38, 76, 'N(t)', 14);
    return t + T(16, 330, 'dN/dt = r N (1 - N/K)', 19) + T(16, 366, 'fastest growth at N = K/2', 17) + T(16, 400, 'then it saturates at K', 17);
  },
];

function wall() {
  const bx0 = 238, step = 336, by = 175;
  let s = `<svg class="wallsvg" viewBox="0 0 2100 900" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A traditional library. On the far wall hang five blackboards covered in hand-written calculations, one for each of our five areas of work.">
<defs>
<radialGradient id="spot" cx="50%" cy="38%" r="62%"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="tbl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b1e24"/><stop offset="1" stop-color="#07080b"/></linearGradient>
<radialGradient id="pool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx="50%" cy="46%" r="72%"><stop offset=".45" stop-color="#05070b" stop-opacity="0"/><stop offset="1" stop-color="#05070b" stop-opacity=".92"/></radialGradient>
<filter id="chalk" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="1.7"/><feGaussianBlur stdDeviation=".28"/></filter>
<filter id="smudge"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="9"/><feColorMatrix type="saturate" values="0"/></filter>
</defs>
<rect width="2100" height="900" fill="#07090d"/>
${bay(0, 0, 226, 655, 82)}${bay(1874, 0, 2100, 655, 82)}${bay(226, 0, 1874, 158, 79)}
<rect x="226" y="158" width="1648" height="497" fill="#0a0c10"/>
<rect x="0" y="655" width="2100" height="115" fill="#0a0b0e"/>`;
  for (let x = 40; x < 2100; x += 150) s += `<rect x="${x}" y="676" width="116" height="72" fill="#0d0f13"/><rect x="${x}" y="676" width="116" height="1.5" fill="#fff" opacity=".07"/>`;
  s += `<path d="M0 770H2100V900H0Z" fill="url(#tbl)"/><rect y="770" width="2100" height="2.2" fill="#fff" opacity=".14"/>`;
  s += `<ellipse cx="330" cy="816" rx="300" ry="44" fill="url(#pool)"/><ellipse cx="330" cy="772" rx="36" ry="7" fill="#17191e"/><rect x="326" y="706" width="8" height="66" fill="#2b2e34"/><path d="M276 712Q330 636 384 712Z" fill="#1f2228"/><path d="M290 708Q330 656 370 708" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2"/>`;
  s += `<path d="M1000 800L1110 784L1110 814L990 830Z" fill="#c9ccd1" opacity=".38"/><path d="M1110 784L1220 800L1230 830L1110 814Z" fill="#c9ccd1" opacity=".3"/><path d="M1110 784V814" stroke="#000" stroke-opacity=".5" stroke-width="2"/>`;
  for (let i = 0; i < 5; i++) {
    const x = bx0 + i * step;
    s += `<g class="bd bd${i + 1}" style="--k:${i}">
<rect x="${x - 36}" y="${by - 30}" width="352" height="560" fill="url(#spot)"/>
<path d="M${x + 84} ${by - 10}L${x - 24} ${by + 150}L${x + 304} ${by + 150}L${x + 196} ${by - 10}Z" fill="url(#cone)"/>
<rect x="${x + 70}" y="${by - 20}" width="140" height="8" fill="#7a7e86"/><rect x="${x + 70}" y="${by - 20}" width="140" height="2" fill="#fff" opacity=".4"/>
<rect x="${x}" y="${by}" width="280" height="480" fill="#23262c"/><rect x="${x}" y="${by}" width="280" height="3" fill="#fff" opacity=".16"/>
<rect x="${x + 10}" y="${by + 10}" width="260" height="460" fill="#0c0e11"/>
<g filter="url(#smudge)" opacity=".5"><rect x="${x + 28}" y="${by + 70}" width="190" height="20" fill="#fff" opacity=".07" transform="rotate(-5 ${x + 120} ${by + 80})"/><rect x="${x + 40}" y="${by + 300}" width="170" height="26" fill="#fff" opacity=".06" transform="rotate(4 ${x + 120} ${by + 310})"/></g>
<g class="chalk" transform="translate(${x + 10} ${by + 10})" filter="url(#chalk)">${boardArt[i]()}</g>
<rect x="${x - 6}" y="${by + 478}" width="292" height="11" fill="#2d3036"/><rect x="${x + 36}" y="${by + 470}" width="28" height="7" rx="3" fill="#cfd2d6" opacity=".8"/><rect x="${x + 200}" y="${by + 466}" width="42" height="12" fill="#3b3e44"/>
<rect class="off" x="${x - 36}" y="${by - 30}" width="352" height="560" fill="#07090d"/>
</g>
<rect x="${x + 280}" y="${by}" width="56" height="480" fill="#08090c" opacity="${i < 4 ? 1 : 0}"/>`;
  }
  s += `<rect width="2100" height="900" fill="url(#vig)"/><rect width="2100" height="900" filter="url(#grain)" opacity=".2" style="mix-blend-mode:overlay"/></svg>`;
  return s;
}

const hits = AREAS.map((a, i) => `<a class="hit" data-b="${i + 1}" href="../site/insights.html#${a.id}" aria-label="${a.name}" style="left:${(238 + i * 336) / 21}%;top:${175 / 9}%;width:${280 / 21}%;height:${480 / 9}%"></a>`).join('');

const hasRules = [1, 2, 3, 4, 5].map((n) => `.stage:has([data-b="${n}"]:is(:hover,:focus-visible)) .bd:not(.bd${n}){opacity:.22}
.stage:has([data-b="${n}"]:is(:hover,:focus-visible)) .bd${n} .ch{animation:drawin 1.1s cubic-bezier(.22,.8,.3,1) both}
.stage:has(.idx [data-b="${n}"]:is(:hover,:focus-visible)) .idx li:not(:has([data-b="${n}"])) a{color:var(--muted)}`).join('\n');

const css = `
:root{--bg:#0a0d14;--surface:#131824;--ink:#e9edf3;--muted:#98a1b2;--accent:#5a9bfc;--accent-ink:#0a0d14;--m:20px;--g:14px;
--small:clamp(.875rem,.85rem + .1vw,.9375rem);--body:clamp(1rem,.96rem + .15vw,1.125rem);--lead:clamp(1.25rem,1.1rem + .7vw,1.625rem);
--f:"TikTok Sans",system-ui,sans-serif;--lg-word:#fff;--lg-ink:#E8EEF7;--lg-blue:#5a9bfc;--lg-deep:#9cc3fb}
*{box-sizing:border-box;margin:0}
html{scrollbar-gutter:stable both-edges;background:var(--bg);color:var(--ink);font-family:var(--f);font-size:100%;-webkit-text-size-adjust:100%}
body{background:var(--bg);font-size:1rem;line-height:1.45;overflow-x:hidden}
a{color:inherit;text-decoration:none}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.logo{display:block;aspect-ratio:5.34}
.band{display:grid;grid-template-columns:repeat(7,1fr);gap:var(--g);padding:20px var(--m) 0;align-items:start;font-size:1rem}
.band .nm{grid-column:1/2}.band .nm .logo{height:20px}
.band h1{grid-column:2/4;font:inherit;font-weight:400;font-size:var(--lead);line-height:1.2;letter-spacing:-.01em}
.idx{grid-column:4/7;list-style:none;padding:0}
.idx a{display:block;line-height:1.5;transition:color .2s}
.idx a:hover,.idx a:focus-visible{color:var(--accent)}
.band .btn{grid-column:7/8;justify-self:end}
.btn{display:inline-block;background:var(--accent);color:var(--accent-ink);font-weight:600;padding:.6rem 1.05rem;transition:transform .2s,background .2s;white-space:nowrap}
.btn:hover{background:#7bb0ff;transform:translateY(-2px)}
.btn:active{transform:none}
.wall{position:relative;margin-top:44px;overflow:hidden;background:#05070b}
.wall-in{position:relative;width:100%;aspect-ratio:2100/900}
.wallsvg{position:absolute;inset:0;width:100%;height:100%;display:block;transform-origin:50% 42%;animation:drift 46s ease-in-out infinite alternate}
@keyframes drift{from{transform:scale(1)}to{transform:scale(1.035)}}
.hit{position:absolute;display:block;z-index:2;cursor:pointer}
.hit:focus-visible{outline:2px solid var(--accent);outline-offset:6px}
.bd{transition:opacity .28s}
.band>*{animation:rise .8s cubic-bezier(.22,.8,.3,1) both}
.band>*:nth-child(2){animation-delay:.1s}.band>*:nth-child(3){animation-delay:.2s}.band>*:nth-child(4){animation-delay:.5s}
.idx li{animation:rise .8s cubic-bezier(.22,.8,.3,1) both;animation-delay:calc(var(--j)*70ms + 250ms)}
@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.bd .ch{animation:drawin 1.6s cubic-bezier(.22,.8,.3,1) both;animation-delay:calc(var(--k)*160ms + 600ms)}
.bd .off{animation:lightup 1.5s ease-out both;animation-delay:calc(var(--k)*160ms + 200ms)}
@keyframes lightup{from{opacity:.94}to{opacity:0}}
.chalk text{fill:#e8e5dc;font-family:"Caveat","Segoe Print",cursive;font-weight:500}
.chalk .ch{fill:none;stroke:#e8e5dc;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1;stroke-dashoffset:0}
.chalk .ch.hatch{stroke-width:1.5;opacity:.5;stroke-dasharray:none}
.chalk .dsh{fill:none;stroke:#e8e5dc;stroke-width:1.7;stroke-dasharray:3 6;stroke-linecap:round;opacity:.75}
@keyframes drawin{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
${hasRules}
.words{padding:clamp(96px,14vh,150px) var(--m) clamp(80px,10vh,120px)}
h2{font-weight:800;font-stretch:150%;text-transform:uppercase;letter-spacing:-.01em;line-height:1;font-size:clamp(1.75rem,1.3rem + 1.7vw,2.75rem);margin-bottom:clamp(28px,4vh,48px)}
.wl{list-style:none;padding:0;display:grid;grid-template-columns:repeat(7,1fr);gap:var(--g)}
.wl li{grid-column:3/8}
.wl a{display:flex;justify-content:space-between;align-items:center;padding:.5em 0;font-size:clamp(1.5rem,1rem + 2.1vw,2.75rem);font-weight:400;line-height:1.2;letter-spacing:-.01em;transition:color .2s,padding .25s}
.wl a:hover,.wl a:focus-visible{color:var(--accent);padding-left:.4em}
.arr{width:.9em;height:.9em;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:transform .25s}
.wl a:hover .arr{transform:translateX(6px)}
.close{padding:0 var(--m) 28px}
.close .logo{width:100%;height:auto}
.close p{margin-top:22px;font-size:var(--small);color:var(--muted)}
.js .rise{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.22,.8,.3,1),transform .7s cubic-bezier(.22,.8,.3,1);transition-delay:calc(var(--i,0)*80ms)}
.js .rise.in{opacity:1;transform:none}
@media (max-width:760px){
 .band{grid-template-columns:1fr 1fr;row-gap:18px}
 .band .nm{grid-column:1/2}.band .btn{grid-column:2/3;grid-row:1}
 .band h1{grid-column:1/3}.idx{grid-column:1/3}
 .wall{overflow-x:auto;scroll-snap-type:x proximity;-webkit-overflow-scrolling:touch}
 .wall-in{width:1320px;aspect-ratio:2100/900}
 .hit{scroll-snap-align:center}
 .wl li{grid-column:1/8}
}
@media (prefers-reduced-motion:reduce){.band>*,.idx li{animation:none}.wallsvg{animation:none}.bd .off{animation:none;opacity:0}.js .rise{opacity:1;transform:none;transition:none}.chalk .ch{animation:none!important}}
`;

const ARROW = '<svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Analytika – concept 2, the library wall</title>
${FONT_LINK('TikTok+Sans:wdth,wght@75..150,300..900')}
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500&display=swap" rel="stylesheet">
<style>${css}</style></head><body>
${logoDefs}
<div class="stage">
<header class="band">
<a class="nm" href="#" aria-label="Analytika, home"><svg class="logo" role="img" aria-label="Analytika"><use href="#lg-full"/></svg></a>
<h1>Uncertainty is our trade.</h1>
<ul class="idx">${AREAS.map((a, i) => `<li style="--j:${i}"><a data-b="${i + 1}" href="../site/insights.html#${a.id}">${a.name}</a></li>`).join('')}</ul>
<a class="btn" href="../site/people.html">Meet the people</a>
</header>
<section class="wall" aria-label="The library wall"><div class="wall-in">${wall()}${hits}</div></section>
</div>
<section class="words" aria-labelledby="h-words">
<h2 id="h-words" class="rise">Read on</h2>
<ul class="wl">${WORDS.map(([w, h], i) => `<li class="rise" style="--i:${i}"><a href="${h}"><span>${w}</span>${ARROW}</a></li>`).join('')}</ul>
</section>
<footer class="close"><svg class="logo" role="img" aria-label="Analytika"><use href="#lg-full"/></svg><p>Analytika AS · Parkveien 41B, Oslo</p></footer>
<script>document.documentElement.classList.add('js');(function(){var els=[].slice.call(document.querySelectorAll('.rise'));if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return;}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});els.forEach(function(e){io.observe(e);});})();</script>
</body></html>`;

mkdirSync(new URL('../concepts/library', import.meta.url), { recursive: true });
writeFileSync(new URL('../concepts/library/index.html', import.meta.url), html);
console.log('wrote concepts/library/index.html', html.length);
