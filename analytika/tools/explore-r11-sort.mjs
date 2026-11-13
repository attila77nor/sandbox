/* Round 11, page 1: a recreation, made ours, of a reference Atle sent (a design studio's front page: a black field, a small-caps menu spread across
   the whole width, one huge white glyph hanging under the menu at the left, a three-line headline at the bottom left, the last line underlined).
   Measured on the reference (frame 871 x 491): menu text about 1.1 vw, the glyph 243 x 94 at (12, 36), headline cap height 26 (4.1 vw) with a line
   pitch of 1.05, left margin 16, underline 9 below the baseline.
   What is ours: the glyph is the logo's mark, a triangle of dots (the reference's letter D is not ours), white; the menu is the wordmark and our pages;
   the headline is the two area names that are the whole message of the site, two lines instead of three (no slogan); the five areas stand at the
   bottom right in the menu's own small caps. The field is our marine (the black of the reference is the second choice, two dots at the top right).
   One file, no pictures: fonts embedded, the logo from lib.mjs. */
import { readFileSync } from 'node:fs';
import { write, logoDefs, NAV, AREA_NAMES } from './explore-shared.mjs';
import { logoWordDef } from './lib.mjs';

const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('../assets/vendor/fonts/' + f, import.meta.url)).toString('base64');
const IDS = ['actuary', 'pricing', 'data-platforms', 'consulting', 'business-development'];

const css = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-500-normal.woff2')}) format("woff2");font-weight:500;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-600-normal.woff2')}) format("woff2");font-weight:600;font-style:normal;font-display:block}
:root{--gx:clamp(16px,1.55vw,30px);--nav:clamp(12px,.98vw,15px)}
.page{--bg:#1E3363;--fg:#fff}
.page[data-t="sort"]{--bg:#070707}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:#070707;color:#fff;font:600 var(--nav)/1.2 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.page{position:relative;height:100vh;height:100svh;min-height:540px;overflow:hidden;background:var(--bg);color:var(--fg);transition:background-color .35s ease-out}
.top{position:absolute;z-index:2;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;padding:max(11px,1.05vw) var(--gx);text-transform:uppercase;letter-spacing:.03em}
.top a{padding:4px 0;text-decoration:underline;text-decoration-color:transparent;text-underline-offset:.35em;text-decoration-thickness:1px;transition:text-decoration-color .15s ease-out}
.top a:hover{text-decoration-color:currentColor}
.top .home{display:block;padding:0;--lg-word:#fff;width:calc(var(--nav)*7.6);aspect-ratio:8.246}
.top .home svg{display:block;width:100%;height:100%}
/* the big glyph under the menu: the logo's mark, the triangle of dots, white */
.mark{position:absolute;z-index:1;left:var(--gx);top:max(48px,4.1vw);width:min(29vw,38svh);aspect-ratio:1.07;--lg-ink:#fff;--lg-blue:#fff;--lg-deep:#fff}
.mark svg{display:block;width:100%;height:100%}
/* the headline, bottom left; the last line is underlined, as in the reference */
h1{position:absolute;z-index:1;left:var(--gx);bottom:max(26px,3.1vw);margin:0;font-weight:600;font-size:clamp(30px,4.05vw,78px);line-height:1.05;letter-spacing:-.03em}
h1 span{display:block}
h1 a{text-decoration:underline;text-decoration-thickness:.052em;text-underline-offset:.2em;text-decoration-skip-ink:none}
.areas{position:absolute;z-index:1;right:var(--gx);bottom:max(26px,3.1vw);margin:0;display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.3em clamp(16px,2vw,32px);text-transform:uppercase;letter-spacing:.03em;padding-bottom:.55em}
.areas a{text-decoration:underline;text-decoration-color:transparent;text-underline-offset:.35em;text-decoration-thickness:1px;transition:text-decoration-color .15s ease-out}
.areas a:hover{text-decoration-color:currentColor}
:focus-visible{outline:1.5px solid currentColor;outline-offset:3px}
/* the two choices of field, tucked under the menu (a sketch control, not for the real page) */
.sw{position:absolute;z-index:3;right:var(--gx);top:max(44px,3.5vw);display:flex;gap:8px}
.sw button{width:16px;height:16px;border-radius:50%;border:1px solid rgba(255,255,255,.7);padding:0;cursor:pointer}
.sw button[data-t=marine]{background:#1E3363}.sw button[data-t=sort]{background:#070707}
.sw button[aria-pressed=true]{outline:1.5px solid #fff;outline-offset:2px}
@keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
h1 span{animation:up .6s cubic-bezier(.22,1,.36,1) both}h1 span+span{animation-delay:.08s}
@media (max-width:700px){
  .top .link{display:none}.top .link.join{display:block}
  .mark{top:64px;width:min(54vw,34svh)}
  h1{bottom:max(112px,19svh);font-size:clamp(28px,9vw,44px)}
  .areas{left:var(--gx);right:var(--gx);justify-content:flex-start;gap:.35em 18px;bottom:24px;padding-bottom:0}
  .sw{top:60px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, svart flate (sketch)</title><style>${css}</style></head><body>${logoDefs}${logoWordDef}
<main class="page" data-t="marine">
<header class="top"><a class="home" href="forside-sort.html" aria-label="Analytika, home"><svg aria-hidden="true"><use href="#lg-word"/></svg></a>${NAV.map(([n, f]) => `<a class="link" href="../site/${f}.html">${n}</a>`).join('')}<a class="link join" href="../site/about.html#join">Join us</a></header>
<div class="mark" role="img" aria-label="Analytika"><svg aria-hidden="true"><use href="#lg-mark"/></svg></div>
<h1><span>Consulting.</span><span><a href="../site/insights.html#business-development">Business development.</a></span></h1>
<nav class="areas" aria-label="Areas">${AREA_NAMES.map((a, i) => `<a href="../site/insights.html#${IDS[i]}">${a}</a>`).join('')}</nav>
<div class="sw" role="group" aria-label="Flate"><button type="button" data-t="marine" aria-pressed="true" aria-label="Marine" title="Marine"></button><button type="button" data-t="sort" aria-pressed="false" aria-label="Svart" title="Svart"></button></div>
</main>
<script>(function(){var p=document.querySelector('.page'),b=[].slice.call(document.querySelectorAll('.sw button'));
function set(t){p.dataset.t=t;b.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.t===t?'true':'false');});}
b.forEach(function(x){x.addEventListener('click',function(){set(x.dataset.t);});});
if(location.hash==='#sort')set('sort');})();</script>
</body></html>`;

write('forside-sort.html', html);
