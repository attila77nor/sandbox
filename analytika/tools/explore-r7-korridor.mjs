/* Round 7: a recreation, for Analytika, of a hero shot Atle sent as a reference (a dark laptop screen set in a glowing
   architectural hall, one tiny figure standing in the light, a white headline, a nav bar). The composition is kept: the same
   frame, the same pilasters and light strips on the floor, the same nav and headline places. Changed on request: a cool
   palette instead of the copper one (three to choose from), a group of people instead of the one man, the Analytika logo in
   white filling the black void at the end of the hall, the headline is only "Analytika", and the five areas sit at the bottom.
   The picture is one inline SVG (coordinates are those of the reference shot, 936 x 702, measured from the reference image),
   the text is HTML on top of it, so it stays sharp at any size. Colours are a ramp of CSS variables per palette (--l0 ... --l95,
   hue and saturation set by the palette, lightness taken from the reference), so the palette can change without redrawing. */
import { readFileSync } from 'node:fs';
import { write, logoDefs, SKETCH } from './explore-shared.mjs';

const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('../assets/vendor/fonts/' + f, import.meta.url)).toString('base64');
const AREAS = ['Actuary', 'Pricing', 'Data platforms', 'Consulting', 'Business development'];
const NAV = ['People', 'Insights', 'Products', 'About us'];

/* three palettes, hue and saturation for the shadows (h0, s0) and the highlights (h1, s1); lightness is the reference's */
const PALS = {
  varm: { name: 'Varm blå', h0: 228, s0: 0.19, h1: 252, s1: 0.12, accent: '#5666B2' },
  graa: { name: 'Blågrå', h0: 213, s0: 0.15, h1: 208, s1: 0.1, accent: '#4F6F96' },
  lilla: { name: 'Lilla', h0: 262, s0: 0.2, h1: 280, s1: 0.13, accent: '#7358A8' },
};
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const hsl = (p, L) => { const k = clamp((L - 8) / 82, 0, 1), h = p.h0 + (p.h1 - p.h0) * k, s = (p.s0 + (p.s1 - p.s0) * k) * (L < 8 ? 0.35 + (L / 8) * 0.65 : 1); return `hsl(${h.toFixed(1)} ${(s * 100).toFixed(1)}% ${L}%)`; };
const ramp = (p) => Array.from({ length: 96 }, (_, L) => `--l${L}:${hsl(p, L)}`).join(';') + `;--accent:${p.accent}`;
const L = (n) => `var(--l${n})`;
const stop = (o, l, a = 1) => `<stop offset="${o}" style="stop-color:${L(l)};stop-opacity:${a}"/>`;

/* people: a few silhouettes (12 wide, 32 tall, feet on y = 32) */
const SYM = `
<symbol id="pa" viewBox="0 0 12 32"><ellipse cx="6" cy="3.1" rx="2.05" ry="2.55"/><rect x="5.2" y="5.2" width="1.6" height="2.2" rx=".6"/><path d="M3.2 8.2C3.7 7.3 4.8 7 6 7s2.3.3 2.8 1.2l.4 9.4H2.8z"/><rect x="1.35" y="8.4" width="1.7" height="9.8" rx=".85" transform="rotate(3 2.2 8.4)"/><rect x="8.95" y="8.4" width="1.7" height="9.8" rx=".85" transform="rotate(-3 9.8 8.4)"/><rect x="2.9" y="17" width="2.9" height="14.6" rx="1.1" transform="rotate(1.5 4.3 17)"/><rect x="6.2" y="17" width="2.9" height="14.6" rx="1.1" transform="rotate(-1.5 7.6 17)"/></symbol>
<symbol id="pb" viewBox="0 0 12 32"><ellipse cx="6" cy="3.2" rx="2" ry="2.5"/><circle cx="6" cy="1.2" r="1.3"/><rect x="5.2" y="5.2" width="1.6" height="2.2" rx=".6"/><path d="M3.4 8.3C3.8 7.4 4.9 7 6 7s2.2.4 2.6 1.3l.5 3.2L11 25H1L2.9 11.5z"/><rect x="1.8" y="9" width="1.5" height="9" rx=".75" transform="rotate(4 2.5 9)"/><rect x="8.7" y="9" width="1.5" height="9" rx=".75" transform="rotate(-4 9.5 9)"/><rect x="3.7" y="24" width="2" height="7.6" rx=".9"/><rect x="6.3" y="24" width="2" height="7.6" rx=".9"/></symbol>
<symbol id="pc" viewBox="0 0 15 32"><ellipse cx="6" cy="3.1" rx="2.05" ry="2.55"/><rect x="5.2" y="5.2" width="1.6" height="2.2" rx=".6"/><path d="M3.2 8.2C3.7 7.3 4.8 7 6 7s2.3.3 2.8 1.2l.4 9.4H2.8z"/><rect x="1.35" y="8.4" width="1.7" height="9.8" rx=".85" transform="rotate(3 2.2 8.4)"/><rect x="8.95" y="8.4" width="1.7" height="9.8" rx=".85" transform="rotate(-3 9.8 8.4)"/><rect x="2.9" y="17" width="2.9" height="14.6" rx="1.1"/><rect x="6.2" y="17" width="2.9" height="14.6" rx="1.1"/><rect x="9.9" y="14.4" width="4.2" height="5.6" rx="1.1"/><path d="M9.2 8.2L11.6 14.4" stroke="#000" stroke-width=".7" fill="none"/></symbol>
<symbol id="pd" viewBox="0 0 12 32"><ellipse cx="6.2" cy="3.1" rx="2.05" ry="2.55"/><rect x="5.4" y="5.2" width="1.6" height="2.2" rx=".6"/><path d="M2.9 8.4C3.4 7.4 4.7 7 6.1 7s2.7.4 3.2 1.4l.6 4.4-1 .5-.6-3.2.1 7.9H3.1l.1-7.9-.6 3.2-1-.5z"/><rect x="2.9" y="17" width="2.9" height="14.6" rx="1.1"/><rect x="6.3" y="17" width="2.9" height="14.6" rx="1.1"/></symbol>`;
/* [symbol, feet x, feet y, height]: a loose group at the middle of the lit floor, a few further back */
const CROWD = [
  ['pb', 414, 503, 29], ['pa', 432, 499, 28], ['pc', 447, 505, 30], ['pa', 463, 498, 27.5], ['pd', 478, 504, 29.5], ['pb', 494, 499, 28], ['pa', 509, 505, 30], ['pd', 526, 500, 28],
  ['pa', 455, 477, 20.5], ['pb', 482, 476, 20], ['pa', 372, 507, 29], ['pb', 566, 506, 28.5],
];
const person = ([id, x, y, h]) => { const w = h * (id === 'pc' ? 15 : 12) / 32; return `<use href="#${id}" x="${(x - w / 2).toFixed(1)}" y="${(y - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h}"/>`; };
const reflection = ([id, x, y, h]) => { const w = h * (id === 'pc' ? 15 : 12) / 32; return `<use href="#${id}" x="${(x - w / 2).toFixed(1)}" y="${(y - h).toFixed(1)}" width="${w.toFixed(1)}" height="${h}" transform="translate(0 ${(2 * y).toFixed(1)}) scale(1 -1)"/>`; };

/* one pilaster pair, drawn for the left; the right is the mirror image */
const side = `
<rect x="56" y="94" width="77" height="420" fill="url(#gBlk)"/>
<rect x="133" y="144" width="76" height="366" fill="url(#gSlab)"/><rect x="133" y="144" width="76" height="366" fill="url(#gSlabH)"/>
<polygon points="209,144 276,166 276,468 209,510" fill="url(#gSide)"/>
<rect x="276" y="166" width="28" height="302" fill="url(#gSlab2)"/>
<polygon points="304,172 330,176 330,462 304,468" fill="url(#gSide2)"/>`;

const svg = `<svg class="art" viewBox="0 0 936 702" role="img" aria-label="Analytika: a group of people in a long, softly lit hall" preserveAspectRatio="xMidYMid slice">
<defs>
<filter id="b1" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="1"/></filter>
<filter id="b15" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="2.2"/></filter>
<filter id="b2" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2.4"/></filter>
<filter id="b5" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="b40" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7" result="n"/><feColorMatrix type="matrix" values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  .9 .9 .9 0 -.55"/></filter>
<clipPath id="scr"><rect x="56" y="94" width="824" height="514" rx="16"/></clipPath>
<linearGradient id="gBg" x1="0" y1="0" x2="0" y2="1">${stop(0, 9)}${stop(0.3, 11)}${stop(0.7, 16)}${stop(1, 18)}</linearGradient>
<linearGradient id="gBlk" x1="0" y1="0" x2="1" y2="0">${stop(0, 1)}${stop(0.55, 3)}${stop(1, 9)}</linearGradient>
<linearGradient id="gSlab" x1="0" y1="0" x2="0" y2="1">${stop(0, 3)}${stop(0.16, 7)}${stop(0.32, 17)}${stop(0.49, 38)}${stop(0.65, 56)}${stop(0.81, 72)}${stop(1, 86)}</linearGradient>
<linearGradient id="gSlabH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>
<linearGradient id="gSide" x1="0" y1="0" x2="0" y2="1">${stop(0, 0)}${stop(0.4, 4)}${stop(0.7, 8)}${stop(0.9, 11)}${stop(1, 30)}</linearGradient>
<linearGradient id="gSlab2" x1="0" y1="0" x2="0" y2="1">${stop(0, 0)}${stop(0.45, 4)}${stop(0.62, 18)}${stop(0.84, 33)}${stop(1, 60)}</linearGradient>
<linearGradient id="gSide2" x1="0" y1="0" x2="0" y2="1">${stop(0, 0)}${stop(0.6, 1)}${stop(1, 8)}</linearGradient>
<linearGradient id="gFloorC" x1="0" y1="0" x2="1" y2="0">${stop(0, 92)}${stop(0.5, 80)}${stop(1, 92)}</linearGradient>
<linearGradient id="gFloorD" x1="0" y1="0" x2="0" y2="1">${stop(0, 78)}${stop(0.1, 62)}${stop(0.3, 40)}${stop(0.6, 14)}${stop(1, 0)}</linearGradient>
<linearGradient id="gFloorB" x1="0" y1="0" x2="1" y2="0">${stop(0, 28)}${stop(0.5, 44)}${stop(1, 28)}</linearGradient>
<linearGradient id="gFloorA" x1="0" y1="0" x2="1" y2="0">${stop(0, 52)}${stop(0.5, 40)}${stop(1, 52)}</linearGradient>
<linearGradient id="gUnder" x1="0" y1="0" x2="0" y2="1">${stop(0, 60, 0.95)}${stop(0.25, 44, 0.9)}${stop(0.6, 24, 0.7)}${stop(1, 14, 0.4)}</linearGradient>
<linearGradient id="gFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="mRefl" maskUnits="userSpaceOnUse" x="300" y="500" width="320" height="50"><rect x="300" y="500" width="320" height="50" fill="url(#gFade)"/></mask>
<linearGradient id="gFeatherX" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".16" stop-color="#fff" stop-opacity="1"/><stop offset=".84" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="mFloorD" maskUnits="userSpaceOnUse" x="120" y="500" width="696" height="90"><rect x="120" y="500" width="696" height="90" fill="url(#gFeatherX)"/></mask>
<radialGradient id="gBloom" cx=".5" cy=".5" r=".5">${stop(0, 74, 0.55)}${stop(1, 74, 0)}</radialGradient>
${SYM}
</defs>

<!-- the room around the screen: dark above, a glow at both sides, dark brown-ish (here blue-ish) below -->
<rect width="936" height="702" fill="url(#gBg)"/>
<g filter="url(#b40)"><ellipse cx="-20" cy="300" rx="210" ry="340" fill="${L(30)}"/><ellipse cx="956" cy="300" rx="210" ry="340" fill="${L(30)}"/>
<ellipse cx="-30" cy="520" rx="190" ry="150" fill="${L(70)}"/><ellipse cx="966" cy="520" rx="190" ry="150" fill="${L(70)}"/>
<ellipse cx="468" cy="640" rx="560" ry="70" fill="${L(18)}"/></g>
<rect x="0" y="606" width="936" height="96" fill="url(#gUnder)"/>
<rect x="47" y="96" width="842" height="533" rx="26" fill="#000" opacity=".22" filter="url(#b5)" transform="translate(0 6)"/>

<!-- the device: a glassy bezel and the screen -->
<rect x="47" y="84" width="842" height="533" rx="24" fill="${L(62)}" fill-opacity=".2"/>
<rect x="47.5" y="84.5" width="841" height="532" rx="23.5" fill="none" stroke="${L(84)}" stroke-opacity=".45"/>
<rect x="56" y="94" width="824" height="514" rx="16" fill="${L(1)}"/>
<g clip-path="url(#scr)">
 <rect x="56" y="94" width="824" height="514" fill="#000"/>
 <g filter="url(#b15)">${side}</g>
 <g transform="translate(936 0) scale(-1 1)" filter="url(#b15)">${side}</g>
 <!-- the floor: dark base and the light strips, far to near -->
 <polygon points="133,510 804,510 624,414 312,414" fill="${L(5)}"/>
 <line x1="338" y1="414.5" x2="598" y2="414.5" stroke="${L(30)}" stroke-width="1.6" opacity=".55" filter="url(#b1)"/>
 <polygon points="292,430 644,430 664,449 272,449" fill="url(#gFloorA)" filter="url(#b1)"/>
 <polygon points="250,454 686,454 710,479 226,479" fill="url(#gFloorB)" filter="url(#b1)"/>
 <polygon points="146,484 790,484 804,514 132,514" fill="url(#gFloorC)" filter="url(#b2)"/>
 <rect x="120" y="506" width="696" height="74" fill="url(#gFloorD)" mask="url(#mFloorD)" filter="url(#b2)"/>
 <ellipse cx="468" cy="545" rx="480" ry="62" fill="${L(26)}" opacity=".55" filter="url(#b40)" style="mix-blend-mode:screen"/>
 <ellipse cx="468" cy="500" rx="360" ry="30" fill="url(#gBloom)" filter="url(#b5)"/>
 <ellipse cx="170" cy="500" rx="60" ry="120" fill="url(#gBloom)" opacity=".5" filter="url(#b5)"/><ellipse cx="766" cy="500" rx="60" ry="120" fill="url(#gBloom)" opacity=".5" filter="url(#b5)"/>
 <!-- the logo, white, fills the black void at the end of the hall -->
 <use href="#lg-full" x="314" y="338" width="308" height="57.6" style="--lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff" filter="url(#b5)" opacity=".16"/>
 <use href="#lg-full" x="314" y="338" width="308" height="57.6" style="--lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff"/>
 <!-- the people -->
 <g mask="url(#mRefl)" opacity=".3" fill="#000" filter="url(#b1)">${CROWD.map(reflection).join('')}</g>
 <g fill="#000" opacity=".4" filter="url(#b1)">${CROWD.map(([, x, y]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="1.6"/>`).join('')}</g>
 <g fill="${L(1)}">${CROWD.map(person).join('')}</g>
</g>
<rect width="936" height="702" filter="url(#grain)" opacity=".16" style="mix-blend-mode:soft-light"/>
</svg>`;

const CSS = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-300-normal.woff2')}) format("woff2");font-weight:300;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:block}
${Object.entries(PALS).map(([k, p]) => `.frame[data-pal="${k}"]{${ramp(p)}}`).join('\n')}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;min-height:100vh;display:grid;place-content:center;gap:18px;padding:clamp(14px,3vw,40px);background:#F7F7F7;color:#14161B;font:400 14px/1.5 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.frame{container-type:inline-size;width:min(94vw,1180px);aspect-ratio:936/702}
.shot{position:relative;width:100%;height:100%;overflow:hidden;border-radius:1.3cqw;background:#101012;color:#fff}
.art{position:absolute;inset:0;width:100%;height:100%;display:block}
.nav{position:absolute;left:10.47%;right:10.47%;top:15.4%;height:3.56%;display:flex;align-items:center;justify-content:space-between}
.lock{display:block;width:9.94cqw;aspect-ratio:5.349;--lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff}
.nav nav{display:flex;align-items:center;gap:1.7cqw;font-size:max(12px,.98cqw);letter-spacing:.01em;color:rgba(255,255,255,.86)}
.nav nav a{transition:color .15s ease-out}.nav nav a:hover{color:#fff}
.nav .cta{display:grid;place-items:center;height:3.7cqw;padding:0 1.3cqw;margin-left:.9cqw;background:var(--accent);color:#fff;font-size:max(12px,.86cqw);letter-spacing:.06em;transition:filter .15s ease-out}
.nav .cta:hover{filter:brightness(1.12)}
h1{position:absolute;left:0;right:0;top:calc(33.4% - 3.1cqw);margin:0;text-align:center;font:300 5.6cqw/1.1 "Hanken Grotesk",sans-serif;letter-spacing:-.012em;color:#fff;text-wrap:balance}
.areas{position:absolute;left:8%;right:8%;top:82.2%;margin:0;display:flex;flex-wrap:wrap;justify-content:center;gap:.3em 3.4cqw;font-size:max(12px,1.04cqw);letter-spacing:.09em;color:rgba(255,255,255,.82)}
.areas a{transition:color .15s ease-out}.areas a:hover{color:#fff}
:focus-visible{outline:1.5px solid #fff;outline-offset:3px}
.pal{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 8px;font-size:13px;color:#5C616C}
.pal button{background:none;border:1px solid transparent;border-radius:4px;padding:5px 11px;font:inherit;color:inherit;cursor:pointer}
.pal button:hover{color:#14161B}.pal button[aria-pressed=true]{color:#14161B;border-color:#14161B}
.sketch{margin:0;text-align:center;font-size:12px;color:#5C616C}
@media (max-width:640px){.nav nav a:not(.cta){display:none}h1{font-size:9cqw;top:calc(33% - 5cqw)}.areas{top:80%;gap:.3em 4cqw}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, korridoren (sketch)</title><style>${CSS}</style></head><body>${logoDefs}
<figure class="frame" data-pal="varm" style="margin:0"><div class="shot">${svg}
<header class="nav"><a href="forside-korridor.html" aria-label="Analytika, home"><svg class="lock" aria-hidden="true"><use href="#lg-full"/></svg></a><nav aria-label="Pages">${NAV.map((n) => `<a href="../site/${n.toLowerCase().replace(' ', '')}.html">${n}</a>`).join('')}<a class="cta" href="../site/about.html#contact">CONTACT</a></nav></header>
<h1>Analytika</h1>
<p class="areas" aria-label="Areas">${AREAS.map((a, i) => `<a href="../site/insights.html#${['actuary', 'pricing', 'data-platforms', 'consulting', 'business-development'][i]}">${a}</a>`).join('')}</p>
</div></figure>
<div class="pal" role="group" aria-label="Palett"><span>Palett</span>${Object.entries(PALS).map(([k, p]) => `<button type="button" data-pal="${k}" aria-pressed="${k === 'varm'}">${p.name}</button>`).join('')}</div>
${SKETCH('Sketch, round 7 · a recreation of a reference shot for Analytika: the same hall, a group of people instead of one, the logo in the void, three cool palettes. Rows and pages behind it are not designed in this style.')}
<script>(function(){var f=document.querySelector('.frame'),b=[].slice.call(document.querySelectorAll('.pal button'));
function set(k){f.dataset.pal=k;b.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.pal===k?'true':'false');});}
b.forEach(function(x){x.addEventListener('click',function(){set(x.dataset.pal);});});
addEventListener('message',function(e){if(e.data&&e.data.pal)set(e.data.pal);});
var q=location.hash.slice(1);if(q&&${JSON.stringify(Object.keys(PALS))}.indexOf(q)>-1)set(q);})();</script>
</body></html>`;

write('forside-korridor.html', html);
