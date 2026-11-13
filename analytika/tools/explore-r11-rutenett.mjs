/* Round 11, page 3: a recreation, made ours, of a reference Atle sent (an investment firm's front page, shown in a browser window: a light page with a
   thin square grid, a few blue squares with logos in it, and one sentence in two lines at the centre, the second line blue, over a plain menu with a
   language menu and a blue button). Measured on the reference's page (920 wide): 11 columns of square cells (83.6), the menu 43 high, the blue squares at
   (1,0) (2,1) (1,3) (9,3) (5,4), the sentence cell 7 x 2 at (3,1), text 4.1 vw, line pitch 1.31, one blue for squares, line and button.
   What is ours: the five blue squares are the five areas (Actuary, Pricing, Data platforms, Consulting, Business development), where the reference has
   five logos; the two lines are "Consulting" and "Business development"; the menu is our logo and pages, the language menu has the Norwegian flag and
   the button says "Join us". Deep blue (our #036194, not the brand blue: white 12 px text on #1B92D0 is 3.3:1) or marine as the one colour. The browser
   window and the navy around it are the reference's screenshot, not the page, so they are not here (the lesson of the hall page). One file. */
import { readFileSync } from 'node:fs';
import { write, logoDefs, NAV, AREA_NAMES } from './explore-shared.mjs';

const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('../assets/vendor/fonts/' + f, import.meta.url)).toString('base64');
const IDS = ['actuary', 'pricing', 'data-platforms', 'consulting', 'business-development'];
/* [column, row] of each area's square on the desktop grid (1-based) and on the phone grid (4 columns) */
const POS = [[[2, 1], [1, 2]], [[3, 2], [4, 3]], [[2, 4], [2, 6]], [[10, 4], [4, 7]], [[6, 5], [1, 8]]];

const css = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-500-normal.woff2')}) format("woff2");font-weight:500;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-700-normal.woff2')}) format("woff2");font-weight:700;font-style:normal;font-display:block}
:root{--ink:#11182E;--bg:#F5F5F6;--line:#DDE1E7;--accent:#036194;--cols:11;--cell:calc(100vw/var(--cols));--navh:clamp(52px,4.7vw,80px);--gx:clamp(16px,4.2vw,72px)}
.page[data-t="marine"]{--accent:#1E3363}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:400 13px/1.4 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.page{position:relative;height:100vh;height:100svh;min-height:520px;overflow:hidden;background:var(--bg)}
.nav{position:absolute;z-index:3;left:0;right:0;top:0;height:var(--navh);display:flex;align-items:center;gap:clamp(18px,2.2vw,34px);padding:0 var(--gx);background:#F8F8F9}
.nav .home{display:block;width:clamp(104px,8.4vw,136px);aspect-ratio:5.349;margin-right:clamp(0px,1.2vw,20px)}
.nav .home svg{display:block;width:100%;height:100%}
.nav a.l{position:relative;padding:6px 0;transition:color .15s ease-out}
.nav a.l:hover{color:var(--accent)}
.nav .sp{flex:1}
.lang{display:flex;align-items:center;gap:6px;padding:6px 4px;font-size:12px;color:#4B5368}
.lang svg{display:block}
.lang .ch{width:9px;height:9px}
.btn{display:grid;place-items:center;height:clamp(30px,2.4vw,38px);padding:0 clamp(14px,1.3vw,20px);border-radius:3px;background:var(--accent);color:#fff;font-size:12px;font-weight:500;letter-spacing:.01em;transition:filter .15s ease-out,transform .15s ease-out}
.btn:hover{filter:brightness(1.14)}.btn:active{transform:scale(.97)}
/* the grid: lines in the background, the squares and the centre cell placed on it */
.grid{position:absolute;left:0;right:0;top:var(--navh);bottom:0;display:grid;grid-template-columns:repeat(var(--cols),1fr);grid-auto-rows:var(--cell);background-image:linear-gradient(to right,var(--line) 1px,transparent 1px),linear-gradient(to bottom,var(--line) 1px,transparent 1px);background-size:var(--cell) var(--cell)}
.cell{grid-column:var(--c);grid-row:var(--r);position:relative;margin:1px 0 0 1px;display:grid;place-items:center;padding:6px;background:var(--accent);color:#fff;text-align:center;font-size:13px;font-weight:700;line-height:1.2;letter-spacing:.005em;text-wrap:balance;transition:filter .15s ease-out;animation:in .5s cubic-bezier(.22,1,.36,1) both;animation-delay:calc(var(--i)*70ms + 120ms)}
.cell:hover{filter:brightness(1.16)}
.hero{grid-column:4/span 7;grid-row:2/span 2;margin:1px 0 0 1px;background:var(--bg);border:1px solid color-mix(in srgb,var(--accent) 12%,transparent);display:grid;place-content:center;padding:clamp(12px,1.6vw,28px);text-align:center}
h1{margin:0;font-weight:500;font-size:clamp(26px,4.1vw,80px);line-height:1.3;letter-spacing:-.012em}
h1 span{display:block}h1 .b{color:var(--accent)}
:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
@keyframes in{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}
/* two choices of the one colour, tucked into the corner (a sketch control, not for the real page) */
.sw{position:absolute;z-index:4;right:12px;bottom:12px;display:flex;gap:8px;padding:6px 8px;border-radius:8px;background:rgba(255,255,255,.85);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);box-shadow:0 0 0 1px rgba(17,24,46,.1)}
.sw button{width:16px;height:16px;border-radius:50%}
.sw button[data-t=deep]{background:#036194}.sw button[data-t=marine]{background:#1E3363}
.sw button[aria-pressed=true]{outline:1.5px solid var(--ink);outline-offset:2px}
@media (max-width:700px){
  :root{--cols:4;--navh:56px;--gx:16px}
  .nav a.l,.lang{display:none}
  .nav .home{margin-right:0;width:112px}
  .nav .sp{display:block}
  .cell{grid-column:var(--mc);grid-row:var(--mr);font-size:12px;padding:4px}
  .hero{grid-column:1/span 4;grid-row:4/span 2}
  h1{font-size:clamp(24px,8.6vw,44px)}
  .sw{bottom:8px;right:8px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
`;

const flag = '<svg width="20" height="14" viewBox="0 0 22 16" aria-hidden="true"><rect width="22" height="16" rx="1.5" fill="#BA0C2F"/><path d="M0 8h22M8 0v16" stroke="#fff" stroke-width="4"/><path d="M0 8h22M8 0v16" stroke="#00205B" stroke-width="2"/></svg>';
const chev = '<svg class="ch" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.6l3 3 3-3" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, rutenettet (sketch)</title><style>${css}</style></head><body>${logoDefs}
<main class="page" data-t="deep">
<header class="nav"><a class="home" href="forside-rutenett.html" aria-label="Analytika, home"><svg aria-hidden="true"><use href="#lg-full"/></svg></a>${NAV.map(([n, f]) => `<a class="l" href="../site/${f}.html">${n}</a>`).join('')}<span class="sp"></span><a class="lang" href="forside-rutenett.html" aria-label="Language: Norwegian">${flag}${chev}</a><a class="btn" href="../site/about.html#join">Join us</a></header>
<div class="grid">
<div class="hero"><h1><span>Consulting</span><span class="b">Business development</span></h1></div>
${AREA_NAMES.map((a, i) => `<a class="cell" style="--c:${POS[i][0][0]};--r:${POS[i][0][1]};--mc:${POS[i][1][0]};--mr:${POS[i][1][1]};--i:${i}" href="../site/insights.html#${IDS[i]}">${a}</a>`).join('')}
</div>
<div class="sw" role="group" aria-label="Farge"><button type="button" data-t="deep" aria-pressed="true" aria-label="Dyp blå" title="Dyp blå"></button><button type="button" data-t="marine" aria-pressed="false" aria-label="Marine" title="Marine"></button></div>
</main>
<script>(function(){var p=document.querySelector('.page'),b=[].slice.call(document.querySelectorAll('.sw button'));
function set(t){p.dataset.t=t;b.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.t===t?'true':'false');});}
b.forEach(function(x){x.addEventListener('click',function(){set(x.dataset.t);});});
if(location.hash==='#marine')set('marine');})();</script>
</body></html>`;

write('forside-rutenett.html', html);
