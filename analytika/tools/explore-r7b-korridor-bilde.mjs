/* Round 7, second version: the hall page with a real picture, full screen. Atle supplied a better picture (assets/photo/korridor-chatgpt.png: a
   high hall in brown light, one man looking up at the triangle of the logo, which glows in the black void). It fills the whole screen with no
   frame around it (the device frame and the glow of the first version were taken away), and there is one man, no group. The nav and the five areas lie over the picture (no big headline: the logo triangle in the picture is the logo; "Analytika" is only in the nav and for screen readers); the picture is dark where they sit. The drawn hall of explore-r7-korridor.mjs is kept as
   forside-korridor.html. The picture is brown, so the cool palettes are a CSS hue-rotate on it; the original is one of the four choices (a small
   control at the bottom right). The page is one file: the picture is embedded once, through a CSS variable. */
import { readFileSync } from 'node:fs';
import { write, logoDefs } from './explore-shared.mjs';

const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('../assets/vendor/fonts/' + f, import.meta.url)).toString('base64');
const PHOTO = 'data:image/jpeg;base64,' + readFileSync(new URL('../assets/photo/korridor-1586.jpg', import.meta.url)).toString('base64');
const AREAS = ['Actuary', 'Pricing', 'Data platforms', 'Consulting', 'Business development'];
const IDS = ['actuary', 'pricing', 'data-platforms', 'consulting', 'business-development'];
const NAV = ['People', 'Insights', 'Products', 'About us'];
/* the picture is brown (hue about 28 degrees); hue-rotate moves it to the palette's hue */
const PALS = {
  blaa: { name: 'Varm blå', tone: 'hue-rotate(204deg) saturate(.95)', accent: '#5666B2' },
  graa: { name: 'Blågrå', tone: 'hue-rotate(184deg) saturate(.5)', accent: '#4F6F96' },
  lilla: { name: 'Lilla', tone: 'hue-rotate(238deg) saturate(.8)', accent: '#7358A8' },
  brun: { name: 'Original (brun)', tone: 'hue-rotate(0deg)', accent: '#A9694C' },
};

const css = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-300-normal.woff2')}) format("woff2");font-weight:300;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:block}
:root{--ph:url(${PHOTO});--gut:clamp(20px,3.6vw,56px)}
${Object.entries(PALS).map(([k, p]) => `.page[data-pal="${k}"]{--tone:${p.tone};--accent:${p.accent}}`).join('\n')}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:#000;color:#fff;font:400 14px/1.5 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.page{position:relative;height:100vh;height:100svh;min-height:520px;overflow:hidden}
/* the picture fills the whole screen; the triangle and the man stay in the middle column when the sides are cropped */
.pic{position:absolute;inset:0;background:var(--ph) 50% 54%/cover no-repeat;filter:var(--tone)}
.shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(to bottom,rgba(0,0,0,.55),rgba(0,0,0,0) 22%),linear-gradient(to top,rgba(0,0,0,.5),rgba(0,0,0,0) 20%)}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.top{position:absolute;z-index:2;left:0;right:0;top:0;display:flex;align-items:center;justify-content:space-between;padding:clamp(18px,2.4vw,30px) var(--gut)}
.lock{display:block;width:clamp(128px,11vw,176px);aspect-ratio:5.349;--lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff}
.top nav{display:flex;align-items:center;gap:clamp(14px,1.8vw,26px);font-size:13px;letter-spacing:.02em;color:rgba(255,255,255,.88)}
.top nav a{transition:color .15s ease-out}.top nav a:hover{color:#fff}
.cta{display:grid;place-items:center;height:36px;padding:0 16px;margin-left:6px;background:var(--accent);color:#fff;font-size:12px;letter-spacing:.06em;transition:filter .15s ease-out}
.cta:hover{filter:brightness(1.12)}
.areas{position:absolute;z-index:2;left:var(--gut);right:var(--gut);bottom:clamp(22px,4.2vh,44px);margin:0;display:flex;flex-wrap:wrap;justify-content:center;gap:.4em clamp(18px,2.8vw,44px);font-size:13px;letter-spacing:.09em;color:rgba(255,255,255,.86)}
.areas a{transition:color .15s ease-out}.areas a:hover{color:#fff}
:focus-visible{outline:1.5px solid #fff;outline-offset:3px}
/* a small control for the palette, tucked into the corner (this is a sketch; it would not be on the real page) */
.opt{position:absolute;z-index:3;right:12px;bottom:12px;display:flex;align-items:center;gap:2px;padding:3px;border-radius:8px;background:rgba(0,0,0,.45);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);font-size:12px;color:rgba(255,255,255,.7)}
.opt span{padding:0 6px}
.opt button{background:none;border:0;border-radius:5px;padding:5px 8px;font:inherit;color:inherit;cursor:pointer;white-space:nowrap}
.opt button:hover{color:#fff}.opt button[aria-pressed=true]{color:#fff;background:rgba(255,255,255,.16)}
@media (max-width:760px){.top nav a:not(.cta){display:none}.opt span{display:none}.opt{right:auto;left:50%;transform:translateX(-50%);bottom:calc(clamp(22px,4.2vh,44px) + 74px)}.areas{bottom:clamp(22px,4.2vh,44px);gap:.3em 18px;letter-spacing:.05em}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, korridoren med bilde (sketch)</title><style>${css}</style></head><body>${logoDefs}
<main class="page" data-pal="blaa">
<div class="pic" role="img" aria-label="A high, dark hall with one man looking up at the triangle of the Analytika logo, glowing in the dark at the far end"></div><div class="shade" aria-hidden="true"></div>
<header class="top"><a href="forside-korridor-bilde.html" aria-label="Analytika, home"><svg class="lock" aria-hidden="true"><use href="#lg-full"/></svg></a><nav aria-label="Pages">${NAV.map((n) => `<a href="../site/${n.toLowerCase().replace(' ', '')}.html">${n}</a>`).join('')}<a class="cta" href="../site/about.html#contact">CONTACT</a></nav></header>
<h1 class="sr">Analytika</h1>
<nav class="areas" aria-label="Areas">${AREAS.map((a, i) => `<a href="../site/insights.html#${IDS[i]}">${a}</a>`).join('')}</nav>
<div class="opt" role="group" aria-label="Palett"><span>Palett</span>${Object.entries(PALS).map(([k, p]) => `<button type="button" data-pal="${k}" aria-pressed="${k === 'blaa'}">${p.name}</button>`).join('')}</div>
</main>
<script>(function(){var f=document.querySelector('.page'),b=[].slice.call(document.querySelectorAll('.opt button'));
function set(k){f.dataset.pal=k;b.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.pal===k?'true':'false');});}
b.forEach(function(x){x.addEventListener('click',function(){set(x.dataset.pal);});});
var q=location.hash.slice(1);if(q&&${JSON.stringify(Object.keys(PALS))}.indexOf(q)>-1)set(q);})();</script>
</body></html>`;

write('forside-korridor-bilde.html', html);
