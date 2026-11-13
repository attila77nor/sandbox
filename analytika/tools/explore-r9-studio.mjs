/* Round 9: a recreation, for Analytika, of a hero shot Atle sent as a reference (a dark, soft-edged frame with a long-exposure
   photograph, a small dark pill at the top, a big bold white headline at the bottom left, a small glass card at the bottom right).
   Changed on request: the picture is a darkened photograph of our office behind a thin veil (three strengths); the headline is
   "Consulting. Business Development."; the card at the bottom right holds only the triangle of the logo, in white; the five areas
   sit in the lower part of the outer frame. The pill at the top keeps its place: the mark, the word "Analytika" in place of the
   reference's slogan (we use no slogan) and a grid button that opens the pages of the site. Positions are the reference's
   (922 x 650 here, the reference is 922 x 630 and the lower margin is made roomier for the areas). The photograph is embedded,
   so the page is one file. */
import { readFileSync } from 'node:fs';
import { write, logoDefs, SKETCH } from './explore-shared.mjs';
import { logoWordDef } from './lib.mjs';

const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('../assets/vendor/fonts/' + f, import.meta.url)).toString('base64');
const PHOTO = 'data:image/jpeg;base64,' + readFileSync(new URL('../assets/photo/ekte-kontor-v5-neutral-1400.jpg', import.meta.url)).toString('base64');
const AREAS = ['Actuary', 'Pricing', 'Data platforms', 'Consulting', 'Business development'];
const IDS = ['actuary', 'pricing', 'data-platforms', 'consulting', 'business-development'];
const PAGES = [['People', 'people'], ['Insights', 'insights'], ['Products', 'products'], ['About us', 'about'], ['Contact', 'about.html#contact']];
const GRID = '<svg viewBox="0 0 12 12" aria-hidden="true" focusable="false"><path d="M1 1h4v4H1zM7 1h4v4H7zM1 7h4v4H1zM7 7h4v4H7z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>';

const css = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-500-normal.woff2')}) format("woff2");font-weight:500;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-700-normal.woff2')}) format("woff2");font-weight:700;font-style:normal;font-display:block}
:root{--warm:#F3F1EC;--ink:#14161B;--ph:url(${PHOTO})}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;min-height:100vh;display:grid;place-content:center;gap:18px;padding:clamp(14px,3vw,40px);background:#F7F7F7;color:var(--ink);font:400 14px/1.5 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.frame{container-type:inline-size;width:min(94vw,1180px);aspect-ratio:922/650;margin:0}
.shot{position:relative;width:100%;height:100%;overflow:hidden;border-radius:1.2cqw;background:#121316;color:var(--warm)}
/* the outer frame: a dim, heavily blurred copy of the photograph, so the light bleeds out around the screen as on the reference */
.glow{position:absolute;inset:-12%;background:var(--ph) center/cover;filter:blur(46px) brightness(.5) contrast(1.2);transform:scale(1.15)}
.shot::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(120% 90% at 50% 40%,rgba(10,11,13,0) 30%,rgba(10,11,13,.55) 100%)}
/* the screen */
.screen{position:absolute;left:13.77%;top:14.3%;width:73.1%;height:77.5%;border-radius:1.1cqw;overflow:hidden;background:#0d0e10;box-shadow:0 0 0 1px rgba(255,255,255,.1),0 3cqw 8cqw rgba(0,0,0,.45);z-index:1}
.photo{position:absolute;inset:0;background:var(--ph) 34% 58%/cover;filter:brightness(.62) contrast(1.08)}
/* the veil: a thin, slightly cool, slightly blurring glass over the photograph; --v is its strength */
.veil{position:absolute;inset:0;background:rgba(18,24,38,calc(var(--v)*.07));backdrop-filter:blur(calc(var(--v)*1.5px)) brightness(.92);-webkit-backdrop-filter:blur(calc(var(--v)*1.5px)) brightness(.92)}
.shade{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,9,11,.78) 0%,rgba(8,9,11,.42) 34%,rgba(8,9,11,0) 66%),linear-gradient(to bottom,rgba(8,9,11,.55),rgba(8,9,11,0) 26%)}
.frame[data-veil="ingen"]{--v:0}.frame[data-veil="lett"]{--v:3}.frame[data-veil="sterk"]{--v:7}
/* the pill at the top */
.pill{position:absolute;left:32.2%;top:1.7%;width:35.6%;height:5.8%;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:0 2%;border-radius:.9cqw;background:rgba(15,16,19,.78);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 0 0 1px rgba(255,255,255,.07);z-index:3}
.pill .mk{display:block;width:1.6cqw;aspect-ratio:1.07;--lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff}
.pill .wd{display:block;width:6.6cqw;aspect-ratio:8.246;--lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff}
.menu{justify-self:end;position:relative}
.menu summary{list-style:none;display:grid;place-items:center;width:2.6cqw;height:2.6cqw;margin:-.4cqw -.5cqw;color:var(--warm);cursor:pointer;border-radius:.5cqw;opacity:.9;transition:opacity .15s ease-out}
.menu summary::-webkit-details-marker{display:none}.menu summary:hover,.menu[open] summary{opacity:1}
.menu summary svg{width:1.1cqw;height:1.1cqw}
.menu .panel{position:absolute;right:-1.6cqw;top:calc(100% + 1.3cqw);display:grid;min-width:13cqw;padding:.6cqw;border-radius:.9cqw;background:rgba(15,16,19,.9);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 0 0 1px rgba(255,255,255,.08),0 2cqw 5cqw rgba(0,0,0,.4)}
.menu .panel a{padding:.7cqw 1cqw;border-radius:.5cqw;font-size:max(12px,1.1cqw);transition:background-color .15s ease-out}
.menu .panel a:hover{background:rgba(255,255,255,.08)}
/* the headline */
h1{position:absolute;left:3.7%;bottom:3%;margin:0;z-index:2;font:700 8.1cqw/.96 "Hanken Grotesk",sans-serif;letter-spacing:-.045em;color:var(--warm)}
h1 span{display:block}
.frame[data-lines="to"] h1{font-size:6.1cqw}
.frame[data-lines="to"] h1 span:nth-child(n+2){display:inline}
.frame[data-lines="to"] h1 span:nth-child(2)::after{content:" "}
/* the mark, in a small glass tile where the reference has its status card */
.tile{position:absolute;right:3.9%;bottom:3.4%;width:13.5%;aspect-ratio:1;display:grid;place-items:center;border-radius:.9cqw;background:rgba(18,19,23,.55);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 0 0 1px rgba(255,255,255,.1);z-index:2}
.tile svg{display:block;width:46%;aspect-ratio:1.07;--lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff}
/* the areas, in the lower part of the outer frame */
.areas{position:absolute;left:0;right:0;bottom:2.2%;z-index:2;display:flex;flex-wrap:wrap;justify-content:center;gap:.3em 2.6cqw;margin:0;font-size:max(12px,1.15cqw);letter-spacing:.08em;color:rgba(243,241,236,.78)}
.areas a{transition:color .15s ease-out}.areas a:hover{color:#fff}
:focus-visible{outline:1.5px solid #fff;outline-offset:3px}
.opt{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 8px;font-size:13px;color:#5C616C}
.opt .g{margin-left:12px}
.opt button{background:none;border:1px solid transparent;border-radius:4px;padding:5px 11px;font:inherit;color:inherit;cursor:pointer}
.opt button:hover{color:var(--ink)}.opt button[aria-pressed=true]{color:var(--ink);border-color:var(--ink)}
.sketch{margin:0;text-align:center;font-size:12px;color:#5C616C}
@media (max-width:640px){h1{font-size:9.6cqw}.frame[data-lines="to"] h1{font-size:7cqw}.tile{width:15%}.areas{gap:.3em 1.6cqw;font-size:12px;letter-spacing:.04em}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, studio (sketch)</title><style>${css}</style></head><body>${logoDefs}${logoWordDef}
<figure class="frame" data-veil="lett" data-lines="tre"><div class="shot"><div class="glow" aria-hidden="true"></div>
<div class="screen"><div class="photo" role="presentation"></div><div class="veil" aria-hidden="true"></div><div class="shade" aria-hidden="true"></div>
<header class="pill"><a href="forside-studio.html" aria-label="Analytika, home"><svg class="mk" aria-hidden="true"><use href="#lg-mark"/></svg></a><svg class="wd" role="img" aria-label="Analytika"><use href="#lg-word"/></svg>
<details class="menu"><summary aria-label="Pages">${GRID}</summary><nav class="panel" aria-label="Pages">${PAGES.map(([n, h]) => `<a href="../site/${h.includes('.') ? h : h + '.html'}">${n}</a>`).join('')}</nav></details></header>
<h1><span>Consulting.</span><span class="b">Business</span><span>Development.</span></h1>
<a class="tile" href="forside-studio.html" aria-label="Analytika"><svg aria-hidden="true"><use href="#lg-mark"/></svg></a>
</div>
<nav class="areas" aria-label="Areas">${AREAS.map((a, i) => `<a href="../site/insights.html#${IDS[i]}">${a}</a>`).join('')}</nav>
</div></figure>
<div class="opt" role="group" aria-label="Visning"><span>Slør</span>${['ingen', 'lett', 'sterk'].map((v) => `<button type="button" data-veil="${v}" aria-pressed="${v === 'lett'}">${v[0].toUpperCase() + v.slice(1)}</button>`).join('')}<span class="g">Overskrift</span>${[['tre', 'Tre linjer'], ['to', 'To linjer']].map(([v, l]) => `<button type="button" data-lines="${v}" aria-pressed="${v === 'tre'}">${l}</button>`).join('')}</div>
${SKETCH('Sketch, round 9 · a recreation of a reference hero for Analytika: our office photograph, darkened, behind a thin veil; only Consulting and Business Development as the headline; the triangle of the logo where the reference has its status card; the five areas in the lower frame. Pages behind it are not designed in this style.')}
<script>(function(){var f=document.querySelector('.frame');
function press(sel,attr,v){[].forEach.call(document.querySelectorAll(sel),function(x){x.setAttribute('aria-pressed',x.dataset[attr]===v?'true':'false');});}
[].forEach.call(document.querySelectorAll('.opt button[data-veil]'),function(b){b.addEventListener('click',function(){f.dataset.veil=b.dataset.veil;press('.opt button[data-veil]','veil',b.dataset.veil);});});
[].forEach.call(document.querySelectorAll('.opt button[data-lines]'),function(b){b.addEventListener('click',function(){f.dataset.lines=b.dataset.lines;press('.opt button[data-lines]','lines',b.dataset.lines);});});
document.addEventListener('click',function(e){var m=document.querySelector('.menu');if(m&&m.open&&!m.contains(e.target))m.open=false;});
addEventListener('keydown',function(e){var m=document.querySelector('.menu');if(e.key==='Escape'&&m&&m.open)m.open=false;});})();</script>
</body></html>`;

write('forside-studio.html', html);
