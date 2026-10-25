/* Round 1, direction "Tetthet": black and white only. A field of vertical lines whose spacing follows a probability
   distribution: the lines crowd where the density is high, so the density is read as light and dark, not as a chart.
   Four canvases, four real distributions (normal, Gompertz, lognormal, exponential). Black and white, like the photograph to come. */
import { write, logoDefs, LOGO, fonts, PEOPLE, AREA_NAMES, SKETCH, GA, GB } from './explore-shared.mjs';

/* --- the maths; these functions are also embedded verbatim in the page --- */
function qnorm(p) { // Acklam's inverse normal CDF
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239],
    b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1],
    c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783],
    d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416], pl = 0.02425;
  let q, r;
  if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - pl) { q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  q = p - 0.5; r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}
const QUANT = {
  normal: (p) => qnorm(p),
  lognormal: (p) => Math.exp(0.62 * qnorm(p)),
  exp: (p) => -Math.log(1 - p),
  gompertz: (p) => Math.log(1 - (GA / GB) * Math.log(1 - p)) / GA,
};
/* n lines at the quantiles, scaled so the field runs a little past both edges */
function positions(kind, n, gap) {
  const raw = []; for (let i = 0; i < n; i++) raw.push(QUANT[kind]((i + 0.5) / n));
  let lo = raw[0], hi = raw[n - 1];
  let xs = raw.map((v) => (v - lo) / (hi - lo));
  for (let i = 1; i < n; i++) xs[i] = Math.max(xs[i], xs[i - 1] + gap); // never let two lines touch
  hi = xs[n - 1];
  return xs.map((v) => -0.08 + (1.16 * v) / hi);
}
/* one path, n lines; each line leans with a shared wave whose amplitude follows the local spacing, so no two lines meet */
function field(xs, W, H, amp, pan, cycles, steps) {
  let d = '';
  for (let i = 0; i < xs.length; i++) {
    const s = ((xs[Math.min(xs.length - 1, i + 1)] - xs[Math.max(0, i - 1)]) / 2) * W, a = Math.min(amp * s, 14);
    for (let k = 0; k <= steps; k++) {
      const y = (k / steps) * H, x = (xs[i] + pan) * W + a * Math.sin((k / steps) * cycles * 2 * Math.PI);
      d += (k ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(0);
    }
  }
  return d;
}

const CANVASES = [
  { key: 'people', page: 'People', kind: 'normal', cap: 'normal', n: 70 },
  { key: 'insights', page: 'Insights', kind: 'gompertz', cap: 'Gompertz', n: 70 },
  { key: 'products', page: 'Products', kind: 'lognormal', cap: 'lognormal', n: 70 },
  { key: 'about', page: 'About us', kind: 'exp', cap: 'exponential', n: 70 },
];
const W = 1000, H = 560;
const cv = (kind, n, cls, amp = 0.3, gap = 0.0075) => `<svg class="cv ${cls}" data-kind="${kind}" data-n="${n}" data-gap="${gap}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${field(positions(kind, n, gap), W, H, amp, 0, 2.2, 28)}"/></svg>`;

const CSS = `
:root{--paper:#F6F6F3;--ink:#0B0B0C;--soft:#626264;--rule:rgba(11,11,12,.22);--acc:#1B92D0;--lg-ink:#0B0B0C;--lg-word:#0B0B0C;--lg-blue:#0B0B0C;--lg-deep:#0B0B0C;
  --gut:clamp(20px,3.4vw,48px);--f:"Schibsted Grotesk","Helvetica Neue",Arial,sans-serif}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:400 13.5px/1.55 var(--f);overflow-x:hidden}
a{color:inherit;text-decoration:none}
::selection{background:var(--ink);color:var(--paper)}
:focus-visible{outline:1.5px solid var(--acc);outline-offset:5px}
ul,ol{margin:0;padding:0;list-style:none}
.logo{display:block;height:clamp(20px,1.9vw,26px);aspect-ratio:5.349}
.hdr{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:clamp(18px,2.6vw,32px) var(--gut)}
.hdr nav{display:flex;flex-wrap:wrap;gap:.3rem clamp(14px,1.8vw,26px);font-size:12.5px;letter-spacing:.03em}
.hdr nav a{color:var(--soft);transition:color .2s}
.hdr nav a:hover,.hdr nav a[aria-current]{color:var(--ink)}
.hdr nav a[aria-current]{text-decoration:underline;text-underline-offset:.45em;text-decoration-thickness:1px}
.hdr nav .gap{margin-left:clamp(0px,1.4vw,18px)}
.sketch{margin:0;padding:0 var(--gut) 16px;font-size:12px;color:var(--soft)}
.foot{display:flex;justify-content:space-between;gap:1rem;padding:0 var(--gut) 10px;font-size:12px;color:var(--soft)}
.lede{display:flex;justify-content:space-between;align-items:baseline;gap:2rem;flex-wrap:wrap;padding:clamp(22px,6vh,64px) var(--gut) 0}
.slogan{margin:0;font:400 clamp(20px,1.8vw,26px)/1.2 var(--f);letter-spacing:-.012em}
.areas{margin:0;display:flex;flex-wrap:wrap;gap:.2rem 1.5rem;font-size:12px;letter-spacing:.05em;color:var(--soft)}
.areas a:hover{color:var(--ink);text-decoration:underline;text-underline-offset:.4em;text-decoration-thickness:1px}
.hero{margin:clamp(18px,3.4vh,34px) var(--gut) 0;position:relative;height:clamp(280px,46vh,520px)}
.cv{display:block;width:100%;height:100%;overflow:hidden}
.cv path{fill:none;stroke:var(--ink);stroke-width:1.1;vector-effect:non-scaling-stroke;stroke-linejoin:round}
.cap{margin:.7rem var(--gut) 0;display:flex;justify-content:space-between;gap:1rem;font-size:12px;color:var(--soft)}
.four{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(14px,2vw,28px);margin:clamp(48px,10vh,110px) var(--gut) 0}
.four a{display:block}
.four .cv{height:clamp(160px,30vh,300px)}
.four .t{display:flex;justify-content:space-between;align-items:baseline;margin-top:.8rem;border-top:1px solid var(--rule);padding-top:.55rem}
.four .t b{font-weight:500;font-size:15px;letter-spacing:-.005em}
.four .t span{font-size:12px;color:var(--soft)}
.four a:hover .t b,.four a:focus-visible .t b{text-decoration:underline;text-underline-offset:.3em;text-decoration-thickness:1px}
@media (min-width:761px){.cv.narrow{display:none}}
@media (max-width:760px){.cv.wide{display:none}}
@media (max-width:860px){.four{grid-template-columns:repeat(2,minmax(0,1fr))}}

/* people */
.pg{padding:clamp(26px,6vh,64px) var(--gut) 8vh}
.pg h1{margin:0;font:400 clamp(20px,1.8vw,26px)/1.2 var(--f);letter-spacing:-.012em}
.pg .sub{margin:.6rem 0 0;max-width:52ch;color:var(--soft)}
.lines{position:relative;margin:clamp(40px,9vh,90px) 0 0;height:clamp(220px,38vh,380px)}
.lines svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.lines line{stroke:var(--ink);stroke-width:1.1;vector-effect:non-scaling-stroke}
.lines .op{stroke-dasharray:3 4}
.lines .ln{cursor:pointer}
.lines .ln .hit{stroke:transparent;stroke-width:16}
.lines .ln:hover line:not(.hit),.lines .ln.on line:not(.hit){stroke:var(--acc);stroke-width:2.2}
.lines .nm{position:absolute;bottom:calc(100% + 8px);transform:translateX(-50%);white-space:nowrap;font-size:12.5px;opacity:0;pointer-events:none;transition:opacity .15s;background:var(--paper);padding:.1rem .4rem}
.lines .nm.show{opacity:1}
.alist{margin:clamp(48px,9vh,90px) 0 0;columns:3;column-gap:2.4rem;max-width:960px;font-size:13px;counter-reset:n}
.alist li{break-inside:avoid;padding:.22rem 0;border-top:1px solid var(--rule);counter-increment:n;display:flex;gap:1rem}
.alist li::before{content:counter(n,decimal-leading-zero);width:1.6rem;color:var(--soft);font-variant-numeric:tabular-nums}
.alist a:hover,.alist li.on a{text-decoration:underline;text-underline-offset:.3em;text-decoration-thickness:1px}
.alist .open a{color:var(--soft);font-style:italic}
@media (max-width:760px){.alist{columns:1}}
`;

const head = (title) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>${fonts('Schibsted+Grotesk:wght@400;500')}<style>${CSS}</style></head><body>${logoDefs}`;
const nav = (cur) => `<nav>${[['People', 'people'], ['Insights', 'insights'], ['Products', 'products'], ['About us', 'about']].map(([w, k]) => `<a href="${k}.html"${k === cur ? ' aria-current="page"' : ''}>${w}</a>`).join('')}<a class="gap" href="about.html#join">Join us</a><a href="about.html#contact">Contact</a></nav>`;

/* pointer: the field pans a little and the lines lean further; everything eases, nothing loops */
const JS = `<script>(function(){
${qnorm.toString()}
var GA=${GA},GB=${GB},QUANT={normal:function(p){return qnorm(p)},lognormal:function(p){return Math.exp(.62*qnorm(p))},exp:function(p){return -Math.log(1-p)},gompertz:function(p){return Math.log(1-(GA/GB)*Math.log(1-p))/GA}};
${positions.toString()}
${field.toString()}
if(matchMedia('(prefers-reduced-motion:reduce)').matches||!matchMedia('(hover:hover)').matches)return;
var W=${W},H=${H};
[].forEach.call(document.querySelectorAll('.cv'),function(svg){
  var kind=svg.dataset.kind,n=+svg.dataset.n,xs=positions(kind,n,+svg.dataset.gap),p=svg.querySelector('path'),host=svg.closest('.hero,a')||svg;
  var pan=0,amp=.3,tp=0,ta=.3,raf=0,big=svg.classList.contains('big');
  function tick(){pan+=(tp-pan)*.07;amp+=(ta-amp)*.07;p.setAttribute('d',field(xs,W,H,amp,pan,2.2,28));
    if(Math.abs(tp-pan)>.0004||Math.abs(ta-amp)>.002)raf=requestAnimationFrame(tick);else raf=0;}
  function go(){if(!raf)raf=requestAnimationFrame(tick);}
  host.addEventListener('pointermove',function(e){var r=svg.getBoundingClientRect();tp=((e.clientX-r.left)/r.width-.5)*(big?.12:.06);ta=big?.7:.6;go();});
  host.addEventListener('pointerleave',function(){tp=0;ta=.3;go();});
});
})();</script>`;

const home = `${head('Analytika – Tetthet (sketch)')}
<header class="hdr"><a href="tetthet.html" aria-label="Analytika, home">${LOGO}</a>${nav('')}</header>
<main>
<div class="lede"><h1 class="slogan">Uncertainty is our trade.</h1>
<p class="areas">${AREA_NAMES.map((a) => `<a href="insights.html">${a}</a>`).join('')}</p></div>
<div class="hero" role="img" aria-label="Vertical lines placed at the quantiles of a normal distribution: they crowd in the middle and thin out towards the edges">${cv('normal', 220, 'big wide', 0.3, 0.002)}${cv('normal', 70, 'big narrow', 0.3, 0.0075)}</div>
<p class="cap"><span>Normal distribution. Each line sits at a quantile, so the lines crowd where the probability is.</span><span>Move the pointer.</span></p>
<section class="four" aria-label="Pages">${CANVASES.map((c) => `<a href="${c.key}.html">${cv(c.kind, c.n, '')}<span class="t"><b>${c.page}</b><span>${c.cap}</span></span></a>`).join('')}</section>
</main>
<div class="foot" style="margin-top:clamp(40px,8vh,90px)"><span>Analytika AS · Parkveien 41B, 0258 Oslo</span><span><a href="about.html#join">Join us</a> &nbsp; <a href="about.html#contact">Contact</a></span></div>
${SKETCH('Sketch, round 1 · black and white only, so a black-and-white photograph can sit beside it. Slogan and areas are placeholders.')}
${JS}</body></html>`;

const N = PEOPLE.length, OP = 3;
const lineX = (i) => ((i + 0.5) / (N + OP)) * 1000;
const lines = [...PEOPLE.map((n, i) => ({ n, i, op: false })), ...[0, 1, 2].map((j) => ({ n: 'Open', i: N + j, op: true }))].map((o) => `<g class="ln${o.op ? '' : ''}" data-i="${o.i}"><line class="${o.op ? 'op' : ''}" x1="${lineX(o.i).toFixed(1)}" y1="0" x2="${lineX(o.i).toFixed(1)}" y2="400"/><line class="hit" x1="${lineX(o.i).toFixed(1)}" y1="0" x2="${lineX(o.i).toFixed(1)}" y2="400"/></g>`).join('');
const people = `${head('People – Analytika – Tetthet (sketch)')}
<header class="hdr"><a href="tetthet.html" aria-label="Analytika, home">${LOGO}</a>${nav('people')}</header>
<main class="pg"><h1>People</h1><p class="sub">One line each, in the order we arrived. Dashed lines are places not yet taken.</p>
<div class="lines"><svg viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>${[...PEOPLE, 'Open', 'Open', 'Open'].map((n, i) => `<span class="nm" data-i="${i}" style="left:${(lineX(i) / 10).toFixed(2)}%">${n}</span>`).join('')}</div>
<ol class="alist">${PEOPLE.map((n, i) => `<li data-i="${i}"><a href="#">${n}</a></li>`).join('')}${[0, 1, 2].map((j) => `<li class="open" data-i="${N + j}"><a href="about.html#join">Open</a></li>`).join('')}</ol></main>
${SKETCH('Sketch, round 1 · names as in earlier sketches; order of arrival is illustrative, only 2019 and 2026 are known. Hover a line or a name.')}
<script>(function(){var g=[].slice.call(document.querySelectorAll('.ln')),nm=[].slice.call(document.querySelectorAll('.nm')),li=[].slice.call(document.querySelectorAll('.alist li'));
function set(i,v){g[i].classList.toggle('on',v);nm[i].classList.toggle('show',v);li[i].classList.toggle('on',v);}
g.forEach(function(e,i){e.addEventListener('mouseenter',function(){set(i,true)});e.addEventListener('mouseleave',function(){set(i,false)});});
li.forEach(function(e,i){e.addEventListener('mouseenter',function(){set(i,true)});e.addEventListener('mouseleave',function(){set(i,false)});});})();</script>
</body></html>`;

write('tetthet.html', home);
write('tetthet-people.html', people);
