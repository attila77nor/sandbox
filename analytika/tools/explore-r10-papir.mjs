/* Round 10: a recreation, for Analytika, of a reference page Atle sent (an inkless-packaging workshop: warm board with a fine grain, a debossed dark
   box with raised letters, big letters pressed into the board, a thin nav strip with dashed links, tactile buttons). The technique is kept: the
   letters are real text, the pressed-in look is an SVG inner-shadow filter, the raised look is a soft drop shadow, the board is a flat colour with
   two grain layers and a light patch. Made ours, as Atle usually asks: our blue (or a light grey, with marine) as the board; only "Consulting" and
   "Business Development" as the words (raised and pressed in); the five areas as a small list at the bottom right; the logo (white on the blue,
   marine on the grey) in the nav and the triangle of it pressed into the board at the bottom left; no slogan and no paragraph that claims anything. */
import { readFileSync } from 'node:fs';
import { write, logoDefs, SKETCH } from './explore-shared.mjs';

const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('../assets/vendor/fonts/' + f, import.meta.url)).toString('base64');
const AREAS = ['Actuary', 'Pricing', 'Data platforms', 'Consulting', 'Business development'];
const IDS = ['actuary', 'pricing', 'data-platforms', 'consulting', 'business-development'];
const NAV = [['People', 'people'], ['Insights', 'insights'], ['Products', 'products'], ['About us', 'about']];
/* surface = the board; raised = the raised letters (the board's own colour, a lighter blue on the blue so they read); dark = the debossed box; deep = the letters pressed in; ink = small text; btn = the buttons; logo = the logo */
const THEMES = {
  blaa: { name: 'Blå', raised: '#8FD0F3', surface: '#1B92D0', dark: '#0A3752', deep: '#06496F', ink: '#04233A', btn: '#2AA3DF', logo: '#FFFFFF', patch: '.22' },
  graa: { name: 'Grå med marine', raised: '#E3E6EB', surface: '#E3E6EB', dark: '#1E3363', deep: '#53628B', ink: '#1B2540', btn: '#EEF0F4', logo: '#1E3363', patch: '.5' },
};
const grain = (seed, freq, a, b) => `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${seed}'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${a} ${b}'/></filter><rect width='320' height='320' filter='url(#n)'/></svg>`)}")`;
const speck = (seed) => `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='1' seed='${seed}'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 9 -6.6'/></filter><rect width='360' height='360' filter='url(#n)'/></svg>`)}")`;

const css = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-500-normal.woff2')}) format("woff2");font-weight:500;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-700-normal.woff2')}) format("woff2");font-weight:700;font-style:normal;font-display:block}
${Object.entries(THEMES).map(([k, t]) => `.frame[data-t="${k}"]{--surface:${t.surface};--raised:${t.raised};--dark:${t.dark};--deep:${t.deep};--ink:${t.ink};--btn:${t.btn};--logo:${t.logo};--patch:${t.patch}}`).join('\n')}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;min-height:100vh;display:grid;place-content:center;gap:18px;padding:clamp(14px,3vw,40px);background:#F7F7F7;color:#14161B;font:400 14px/1.5 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.frame{container-type:inline-size;width:min(94vw,1180px);aspect-ratio:936/702;margin:0}
/* the board: a flat colour, a light patch at the top left, a fine grain and sparse flecks */
.paper{position:relative;width:100%;height:100%;overflow:hidden;border-radius:1.2cqw;background:var(--surface);color:var(--ink)}
.paper::before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(34% 38% at 21% 27%,rgba(255,255,255,var(--patch)),rgba(255,255,255,0) 100%),linear-gradient(to bottom,rgba(0,0,0,0) 90%,rgba(0,0,0,.14) 100%)}
.paper::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:4;background-image:${grain(4, '.85', '.9', '-.32')},${speck(11)};opacity:.34;mix-blend-mode:multiply}
/* the nav strip, with a groove under it */
.nav{position:absolute;left:0;right:0;top:0;height:5.7%;display:flex;align-items:center;justify-content:space-between;padding:0 3.6cqw 0 6cqw;box-shadow:0 1px 0 rgba(0,0,0,.18),0 2px 0 rgba(255,255,255,.28);z-index:3}
.lock{display:block;width:10.5cqw;aspect-ratio:5.349;--lg-ink:var(--logo);--lg-word:var(--logo);--lg-blue:var(--logo);--lg-deep:var(--logo)}
.nav nav{display:flex;align-items:center;gap:1.9cqw;font-size:max(12px,.95cqw);font-weight:500;letter-spacing:.01em}
.dl{border-bottom:1px dashed currentColor;padding-bottom:1px;transition:border-bottom-style .1s}
.dl:hover{border-bottom-style:solid}
/* tactile buttons: raised, and pressed in while held */
.btn{display:inline-grid;place-items:center;height:3.7cqw;min-height:34px;padding:0 1.5cqw;border-radius:.55cqw;background:var(--btn);color:var(--ink);font-size:max(12px,.95cqw);font-weight:700;letter-spacing:.01em;box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 .7cqw 1.3cqw rgba(0,0,0,.24),0 .12cqw .25cqw rgba(0,0,0,.2);transition:box-shadow .12s ease-out,transform .12s ease-out}
.btn:hover{transform:translateY(-1px)}
.btn:active{transform:translateY(1px);box-shadow:inset 0 .25cqw .6cqw rgba(0,0,0,.28),0 1px 0 rgba(255,255,255,.35)}
/* the words: one phrase raised out of a pressed-in box, one phrase pressed into the board */
h1{margin:0;font:700 8.8cqw/.92 "Hanken Grotesk",sans-serif;letter-spacing:-.012em;text-transform:uppercase}
.raised{position:absolute;left:13.9%;top:11.7%;margin:0;z-index:2}
.raised span{display:inline-block;padding:.13em .24em .15em;background:var(--dark);border-radius:.45cqw;color:var(--raised);box-shadow:inset 0 .35cqw .9cqw rgba(0,0,0,.6),inset 0 -1px 0 rgba(255,255,255,.1),0 1px 0 rgba(255,255,255,.4);text-shadow:0 -1px 0 rgba(255,255,255,.35),.3cqw .55cqw .7cqw rgba(0,0,0,.5)}
.pressed{position:absolute;left:6.2%;top:46.5%;z-index:2;line-height:1.04}
.pressed span{display:block;color:var(--deep);filter:url(#inset);line-height:1.04}
.mark{position:absolute;left:6.4%;bottom:7.2%;width:11.5cqw;aspect-ratio:1.07;z-index:2;--lg-ink:var(--deep);--lg-word:var(--deep);--lg-blue:var(--deep);--lg-deep:var(--deep);filter:url(#inset)}
/* the five areas, bottom right */
.side{position:absolute;left:66.2%;bottom:6.6%;right:4.4%;z-index:3;display:grid;gap:2cqw}
.areas{margin:0;padding:0;list-style:none;display:grid;gap:.45cqw;font-size:max(12px,1.12cqw);font-weight:500;line-height:1.25}
.acts{display:flex;align-items:center;gap:1.8cqw;font-size:max(12px,.95cqw);font-weight:700}
:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.opt{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 8px;font-size:13px;color:#5C616C}
.opt button{background:none;border:1px solid transparent;border-radius:4px;padding:5px 11px;font:inherit;color:inherit;cursor:pointer}
.opt button:hover{color:#14161B}.opt button[aria-pressed=true]{color:#14161B;border-color:#14161B}
.sketch{margin:0;text-align:center;font-size:12px;color:#5C616C}
@media (max-width:700px){.frame{aspect-ratio:10/15}.nav{height:56px;padding:0 5cqw}.nav nav a:not(.btn){display:none}.lock{width:30cqw}.btn{min-height:34px;height:34px;padding:0 14px}
  h1{font-size:11cqw}.raised{left:6%;top:92px}.pressed{left:6%;top:37%}.mark{display:none}.side{left:6%;right:6%;bottom:5%}.areas{font-size:13px}.acts{font-size:13px}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

const filters = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<filter id="inset" x="-6%" y="-6%" width="112%" height="118%" color-interpolation-filters="sRGB">
<feComponentTransfer in="SourceAlpha" result="inv"><feFuncA type="table" tableValues="1 0"/></feComponentTransfer>
<feGaussianBlur in="inv" stdDeviation="2.4" result="bl"/><feOffset in="bl" dx="2.2" dy="3.2" result="off"/>
<feFlood flood-color="#000" flood-opacity=".52" result="c"/><feComposite in="c" in2="off" operator="in" result="sh"/><feComposite in="sh" in2="SourceAlpha" operator="in" result="inner"/>
<feOffset in="SourceAlpha" dx="1.6" dy="2.2" result="o2"/><feFlood flood-color="#fff" flood-opacity=".4" result="c2"/><feComposite in="c2" in2="o2" operator="in" result="h0"/><feComposite in="h0" in2="SourceAlpha" operator="out" result="hl"/>
<feMerge><feMergeNode in="hl"/><feMergeNode in="SourceGraphic"/><feMergeNode in="inner"/></feMerge></filter></defs></svg>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, papir (sketch)</title><style>${css}</style></head><body>${logoDefs}${filters}
<figure class="frame" data-t="blaa"><div class="paper">
<header class="nav"><a href="forside-papir.html" aria-label="Analytika, home"><svg class="lock" aria-hidden="true"><use href="#lg-full"/></svg></a>
<nav aria-label="Pages">${NAV.map(([n, h]) => `<a class="dl" href="../site/${h}.html">${n}</a>`).join('')}<a class="dl" href="../site/about.html#contact">Contact</a><a class="dl" href="forside-papir.html" aria-label="Norsk">NO</a><a class="btn" href="../site/about.html#join">Join us</a></nav></header>
<h1 class="raised"><span>Consulting.</span></h1>
<h1 class="pressed"><span>Business</span><span>Development.</span></h1>
<svg class="mark" aria-hidden="true"><use href="#lg-mark"/></svg>
<div class="side"><ul class="areas" aria-label="Areas">${AREAS.map((a, i) => `<li><a class="dl" href="../site/insights.html#${IDS[i]}">${a}</a></li>`).join('')}</ul><div class="acts"><a class="btn" href="../site/about.html#join">Join us</a><a class="dl" href="../site/insights.html">See the areas</a></div></div>
</div></figure>
<div class="opt" role="group" aria-label="Flate"><span>Flate</span>${Object.entries(THEMES).map(([k, t]) => `<button type="button" data-t="${k}" aria-pressed="${k === 'blaa'}">${t.name}</button>`).join('')}</div>
${SKETCH('Sketch, round 10 · a recreation of a reference page for Analytika: the pressed-in and raised letters made with an SVG filter and shadows, our blue (or grey with marine), only Consulting and Business Development, the five areas at the bottom right, the triangle pressed into the board. Pages behind it are not designed in this style.')}
<script>(function(){var f=document.querySelector('.frame'),b=[].slice.call(document.querySelectorAll('.opt button'));
function set(k){f.dataset.t=k;b.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.t===k?'true':'false');});}
b.forEach(function(x){x.addEventListener('click',function(){set(x.dataset.t);});});
var q=location.hash.slice(1);if(q&&${JSON.stringify(Object.keys(THEMES))}.indexOf(q)>-1)set(q);})();</script>
</body></html>`;

write('forside-papir.html', html);
