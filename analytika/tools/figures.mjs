/* Shared pieces: the five maths figures (one per area), the illustrative Gompertz law, logo defs. */
import { logoDefs } from './lib.mjs';
export { logoDefs };

export const AREAS = [
  { id: 'actuary', name: 'Actuary', line: 'Risk actuary, compliance, reserving, life and pension.' },
  { id: 'pricing', name: 'Pricing', line: 'Pricing and analytics for insurers.' },
  { id: 'data-platforms', name: 'Data platforms', line: 'Platforms that keep insurance data in one place.' },
  { id: 'consulting', name: 'Consulting', line: 'Business consulting and project management.' },
  { id: 'business-development', name: 'Business development', line: 'Ventures and investments, and funding for our own people’s ideas.' },
];
export const WORDS = [
  ['People', '../site/people.html'],
  ['Insights', '../site/insights.html'],
  ['Products', '../site/products.html'],
  ['About us', '../site/about.html'],
];

/* illustrative Gompertz law: mu(x) = B c^x, S(x) = exp(-(B/ln c)(c^x - 1)) */
export const GB = 2.4e-5, GA = 0.092;
export const S = (x) => Math.exp(-(GB / GA) * (Math.exp(GA * x) - 1));
export const q = (x) => 1 - S(x + 1) / S(x);
export const ex = (x) => { let s = 0; for (let t = 0; t < 1400; t++) s += S(x + t * 0.05) / S(x) * 0.05; return s; };

const f1 = (n) => n.toFixed(1);
const poly = (pts) => 'M' + pts.map(([x, y]) => `${f1(x)} ${f1(y)}`).join('L');

/* five figures on a 240 x 160 canvas, one stroke language (set by .fig CSS) */
export function figure(id) {
  const P = (d, extra = '') => `<path d="${d}" ${/dash|hatch/.test(extra) ? '' : 'pathLength="1"'} ${extra}/>`;
  if (id === 'actuary') {
    const pts = []; for (let x = 0; x <= 100; x += 2) pts.push([20 + 2.04 * x, 140 - 114 * S(x)]);
    return P('M20 20V140H224') + P(poly(pts)) + P(`M${f1(20 + 2.04 * 80)} ${f1(140 - 114 * S(80))}V140`, 'class="dash"');
  }
  if (id === 'pricing') {
    const pts = []; for (let p = 0; p <= 1.001; p += 0.04) pts.push([60 + 120 * p, 140 - 120 * Math.pow(p, 2.4)]);
    let h = ''; for (let p = 0.1; p < 0.95; p += 0.1) h += `M${f1(60 + 120 * p)} ${f1(140 - 120 * p)}V${f1(140 - 120 * Math.pow(p, 2.4))}`;
    return P('M60 20V140H180') + P('M60 140L180 20', 'class="dash"') + P(poly(pts)) + P(h, 'class="hatch"');
  }
  if (id === 'data-platforms') {
    let s = '';
    for (let k = 0; k < 6; k++) {
      const a = (-90 + 60 * k) * Math.PI / 180, x = 120 + 56 * Math.cos(a), y = 80 + 56 * Math.sin(a);
      const x0 = 120 + 11 * Math.cos(a), y0 = 80 + 11 * Math.sin(a), x1 = 120 + 47 * Math.cos(a), y1 = 80 + 47 * Math.sin(a);
      s += P(`M${f1(x0)} ${f1(y0)}L${f1(x1)} ${f1(y1)}`) + `<circle cx="${f1(x)}" cy="${f1(y)}" r="8" pathLength="1"/>`;
    }
    return s + '<circle cx="120" cy="80" r="11" pathLength="1"/>';
  }
  if (id === 'consulting') {
    const nodes = [[96, 40], [96, 120]], leaves = [[18, 40], [62, 40], [98, 120], [142, 120]];
    let s = '<rect x="20" y="74" width="12" height="12" pathLength="1"/>';
    nodes.forEach(([x, y]) => { s += P(`M32 80L${x - 7} ${y}`) + `<circle cx="${x}" cy="${y}" r="7" pathLength="1"/>`; });
    leaves.forEach(([y], i) => { const n = nodes[i < 2 ? 0 : 1]; s += P(`M${n[0] + 7} ${n[1]}L176 ${y}M176 ${y}H210`); });
    return s;
  }
  const pts = []; for (let t = 0; t <= 10.01; t += 0.4) pts.push([20 + 20.4 * t, 140 - 106 / (1 + Math.exp(-1.1 * (t - 5)))]);
  return P('M20 20V140H224') + P('M20 34H224', 'class="dash"') + P(poly(pts)) + `<circle cx="122" cy="87" r="4" pathLength="1"/>` + P('M122 87V140M20 87H122', 'class="dash"');
}
export const fig = (id, cls = '') => `<svg class="fig ${cls}" viewBox="0 0 240 160" aria-hidden="true" focusable="false">${figure(id)}</svg>`;

/* live survival-curve instrument (server-rendered at age 65; script keeps it live) */
export function survival(W, H, age = 65) {
  const L = 34, R = W - 14, T = 14, B = H - 30;
  const X = (x) => L + (R - L) * x / 100, Y = (s) => B - (B - T) * s;
  const pts = []; for (let x = 0; x <= 100; x++) pts.push([X(x), Y(S(x))]);
  return `<svg class="surv" id="surv" viewBox="0 0 ${W} ${H}" role="img" aria-label="Survival curve">
<path class="ax" d="M${L} ${T}V${B}H${R}"/>
<path class="cv" d="${poly(pts)}"/>
<path class="mk-line dash" id="mkline" d="M${f1(X(age))} ${f1(Y(S(age)))}V${B}"/>
<circle class="mk" id="mkdot" cx="${f1(X(age))}" cy="${f1(Y(S(age)))}" r="6"/>
<text class="lab" x="${L - 8}" y="${T + 4}" text-anchor="end">1</text>
<text class="lab" x="${L - 8}" y="${B}" text-anchor="end">0</text>
<text class="lab" x="${X(0)}" y="${H - 8}" text-anchor="middle">0</text>
<text class="lab" x="${X(50)}" y="${H - 8}" text-anchor="middle">50</text>
<text class="lab" x="${X(100)}" y="${H - 8}" text-anchor="middle">100</text>
</svg>`;
}
export const survScript = (W, H) => `<script>
(function(){
  var B=${GB},A=${GA},W=${W},H=${H},L=34,R=W-14,T=14,Bt=H-30;
  function S(x){return Math.exp(-(B/A)*(Math.exp(A*x)-1));}
  function ex(x){var s=0,t;for(t=0;t<1400;t++)s+=S(x+t*.05)/S(x)*.05;return s;}
  var r=document.getElementById('age'),svg=document.getElementById('surv');if(!r||!svg)return;
  var o={age:document.getElementById('o-age'),s:document.getElementById('o-s'),q:document.getElementById('o-q'),e:document.getElementById('o-e')};
  function go(){var x=+r.value,px=L+(R-L)*x/100,py=Bt-(Bt-T)*S(x);
    document.getElementById('mkdot').setAttribute('cx',px);document.getElementById('mkdot').setAttribute('cy',py);
    document.getElementById('mkline').setAttribute('d','M'+px+' '+py+'V'+Bt);
    o.age.textContent=x;o.s.textContent=S(x).toFixed(3);o.q.textContent=(1-S(x+1)/S(x)).toFixed(4);o.e.textContent=ex(x).toFixed(1);
    r.setAttribute('aria-valuetext','Age '+x);}
  r.addEventListener('input',go);go();
})();
</script>`;

export const FONT_LINK = (fam) => `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=${fam}&display=swap" rel="stylesheet">`;

export const FIG_CSS = `
.fig{display:block;width:100%;height:auto;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;overflow:visible}
.fig .dash{stroke-dasharray:3 6;stroke-width:1.8;opacity:.7}
.fig .hatch{stroke-width:1.6;opacity:.45}
@keyframes drawin{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.fig path:not(.dash):not(.hatch),.fig circle,.fig rect{stroke-dasharray:1;stroke-dashoffset:0}
.draw-on:hover .fig path:not(.dash):not(.hatch),.draw-on:focus-visible .fig path:not(.dash):not(.hatch),.draw-on:hover .fig circle,.draw-on:focus-visible .fig circle,.draw-on:hover .fig rect{animation:drawin .9s cubic-bezier(.22,.8,.3,1) both}
@media (prefers-reduced-motion:reduce){.draw-on:hover .fig *{animation:none!important}}
`;
