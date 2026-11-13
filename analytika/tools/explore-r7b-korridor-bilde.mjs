/* Round 7, second version: the hall page with a real picture. Atle supplied a better picture (assets/photo/korridor-chatgpt.png: a high
   hall in brown light, one man looking up at the triangle of the logo, which glows in the black void). It replaces the drawn hall of
   explore-r7-korridor.mjs (kept as forside-korridor.html). The frame, the nav, the headline "Analytika" and the five areas are the same.
   The picture is brown, so the cool palettes are made with a CSS hue-rotate on the picture (and on the blurred copy that glows around the
   screen); the original is one of the four choices. A group of people can be put around the man (the man in the picture stays one of them).
   The page is one file: the picture is embedded once, through a CSS variable. */
import { readFileSync } from 'node:fs';
import { write, logoDefs, SKETCH } from './explore-shared.mjs';

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

/* people, drawn in the picture's own coordinates (1586 x 992); the man in the picture stands at x 793, feet on y 812, 76 tall */
const SYM = `
<symbol id="pa" viewBox="0 0 12 32"><ellipse cx="6" cy="3.1" rx="2.05" ry="2.55"/><rect x="5.2" y="5.2" width="1.6" height="2.2" rx=".6"/><path d="M3.2 8.2C3.7 7.3 4.8 7 6 7s2.3.3 2.8 1.2l.4 9.4H2.8z"/><rect x="1.35" y="8.4" width="1.7" height="9.8" rx=".85" transform="rotate(3 2.2 8.4)"/><rect x="8.95" y="8.4" width="1.7" height="9.8" rx=".85" transform="rotate(-3 9.8 8.4)"/><rect x="2.9" y="17" width="2.9" height="14.6" rx="1.1" transform="rotate(1.5 4.3 17)"/><rect x="6.2" y="17" width="2.9" height="14.6" rx="1.1" transform="rotate(-1.5 7.6 17)"/></symbol>
<symbol id="pb" viewBox="0 0 12 32"><ellipse cx="6" cy="3.2" rx="2" ry="2.5"/><circle cx="6" cy="1.2" r="1.3"/><rect x="5.2" y="5.2" width="1.6" height="2.2" rx=".6"/><path d="M3.4 8.3C3.8 7.4 4.9 7 6 7s2.2.4 2.6 1.3l.5 3.2L11 25H1L2.9 11.5z"/><rect x="1.8" y="9" width="1.5" height="9" rx=".75" transform="rotate(4 2.5 9)"/><rect x="8.7" y="9" width="1.5" height="9" rx=".75" transform="rotate(-4 9.5 9)"/><rect x="3.7" y="24" width="2" height="7.6" rx=".9"/><rect x="6.3" y="24" width="2" height="7.6" rx=".9"/></symbol>
<symbol id="pc" viewBox="0 0 15 32"><ellipse cx="6" cy="3.1" rx="2.05" ry="2.55"/><rect x="5.2" y="5.2" width="1.6" height="2.2" rx=".6"/><path d="M3.2 8.2C3.7 7.3 4.8 7 6 7s2.3.3 2.8 1.2l.4 9.4H2.8z"/><rect x="1.35" y="8.4" width="1.7" height="9.8" rx=".85" transform="rotate(3 2.2 8.4)"/><rect x="8.95" y="8.4" width="1.7" height="9.8" rx=".85" transform="rotate(-3 9.8 8.4)"/><rect x="2.9" y="17" width="2.9" height="14.6" rx="1.1"/><rect x="6.2" y="17" width="2.9" height="14.6" rx="1.1"/><rect x="9.9" y="14.4" width="4.2" height="5.6" rx="1.1"/></symbol>
<symbol id="pd" viewBox="0 0 12 32"><ellipse cx="6.2" cy="3.1" rx="2.05" ry="2.55"/><rect x="5.4" y="5.2" width="1.6" height="2.2" rx=".6"/><path d="M2.9 8.4C3.4 7.4 4.7 7 6.1 7s2.7.4 3.2 1.4l.6 4.4-1 .5-.6-3.2.1 7.9H3.1l.1-7.9-.6 3.2-1-.5z"/><rect x="2.9" y="17" width="2.9" height="14.6" rx="1.1"/><rect x="6.3" y="17" width="2.9" height="14.6" rx="1.1"/></symbol>`;
/* [symbol, feet x, feet y, height]: a loose group around the man, a few further back (smaller) */
const CROWD = [['pb', 722, 806, 71], ['pa', 755, 817, 79], ['pc', 832, 818, 80], ['pd', 866, 808, 73], ['pa', 686, 799, 66], ['pb', 905, 802, 67], ['pa', 772, 773, 53], ['pd', 826, 768, 51], ['pa', 951, 795, 62]];
const person = ([id, x, y, h]) => { const w = h * (id === 'pc' ? 15 : 12) / 32; return `<use href="#${id}" x="${(x - w / 2).toFixed(1)}" y="${y - h}" width="${w.toFixed(1)}" height="${h}"/>`; };
const people = `<svg class="people" viewBox="0 0 1586 992" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><filter id="ps" x="-50%" y="-300%" width="200%" height="700%"><feGaussianBlur stdDeviation="2.2"/></filter>${SYM}</defs>
<g fill="#000" opacity=".4" filter="url(#ps)">${CROWD.map(([, x, y, h]) => `<ellipse cx="${x}" cy="${y}" rx="${(h * 0.2).toFixed(1)}" ry="${(h * 0.045).toFixed(1)}"/>`).join('')}</g>
<g fill="#0b0807">${CROWD.map(person).join('')}</g></svg>`;

const css = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-300-normal.woff2')}) format("woff2");font-weight:300;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:block}
:root{--ph:url(${PHOTO});--ink:#14161B}
${Object.entries(PALS).map(([k, p]) => `.frame[data-pal="${k}"]{--tone:${p.tone};--accent:${p.accent}}`).join('\n')}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;min-height:100vh;display:grid;place-content:center;gap:18px;padding:clamp(14px,3vw,40px);background:#F7F7F7;color:var(--ink);font:400 14px/1.5 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.frame{container-type:inline-size;width:min(94vw,1180px);aspect-ratio:936/702;margin:0}
.shot{position:relative;width:100%;height:100%;overflow:hidden;border-radius:1.3cqw;background:#0b0b0d;color:#fff}
/* the light around the screen: a dim, heavily blurred copy of the picture */
.glow{position:absolute;inset:-14%;background:var(--ph) center/cover;filter:blur(44px) brightness(.62) saturate(1.1) var(--tone);transform:scale(1.1)}
.shot::after{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(130% 95% at 50% 45%,rgba(8,8,10,0) 35%,rgba(8,8,10,.6) 100%)}
.bezel{position:absolute;left:5.02%;top:11.97%;width:89.96%;height:75.93%;border-radius:2.56cqw;background:rgba(255,255,255,.12);box-shadow:inset 0 0 0 1px rgba(255,255,255,.34),0 1.4cqw 4cqw rgba(0,0,0,.35);z-index:1}
.screen{position:absolute;left:5.98%;top:13.39%;width:88.03%;height:73.22%;border-radius:1.7cqw;overflow:hidden;background:#000;z-index:2}
.pic{position:absolute;inset:0;background:var(--ph) center/cover;filter:var(--tone)}
.people{position:absolute;inset:0;width:100%;height:100%}
.frame[data-crowd="en"] .people{display:none}
.nav,h1,.areas{z-index:3}
.nav{position:absolute;left:10.47%;right:10.47%;top:15.4%;height:3.56%;display:flex;align-items:center;justify-content:space-between}
.lock{display:block;width:9.94cqw;aspect-ratio:5.349;--lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff}
.nav nav{display:flex;align-items:center;gap:1.7cqw;font-size:max(12px,.98cqw);letter-spacing:.01em;color:rgba(255,255,255,.88)}
.nav nav a{transition:color .15s ease-out}.nav nav a:hover{color:#fff}
.nav .cta{display:grid;place-items:center;height:3.7cqw;padding:0 1.3cqw;margin-left:.9cqw;background:var(--accent);color:#fff;font-size:max(12px,.86cqw);letter-spacing:.06em;transition:filter .15s ease-out}
.nav .cta:hover{filter:brightness(1.12)}
h1{position:absolute;left:0;right:0;top:calc(30% - 3cqw);margin:0;text-align:center;font:300 5.6cqw/1.1 "Hanken Grotesk",sans-serif;letter-spacing:-.012em;color:#fff;text-wrap:balance}
.areas{position:absolute;left:8%;right:8%;top:82.2%;margin:0;display:flex;flex-wrap:wrap;justify-content:center;gap:.3em 3.4cqw;font-size:max(12px,1.04cqw);letter-spacing:.09em;color:rgba(255,255,255,.84)}
.areas a{transition:color .15s ease-out}.areas a:hover{color:#fff}
:focus-visible{outline:1.5px solid #fff;outline-offset:3px}
.opt{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 8px;font-size:13px;color:#5C616C}
.opt .g{margin-left:12px}
.opt button{background:none;border:1px solid transparent;border-radius:4px;padding:5px 11px;font:inherit;color:inherit;cursor:pointer}
.opt button:hover{color:var(--ink)}.opt button[aria-pressed=true]{color:var(--ink);border-color:var(--ink)}
.sketch{margin:0;text-align:center;font-size:12px;color:#5C616C}
@media (max-width:640px){.nav nav a:not(.cta){display:none}h1{font-size:9cqw;top:calc(28% - 5cqw)}.areas{top:80%;gap:.3em 4cqw}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, korridoren med bilde (sketch)</title><style>${css}</style></head><body>${logoDefs}
<figure class="frame" data-pal="blaa" data-crowd="gruppe"><div class="shot"><div class="glow" aria-hidden="true"></div><div class="bezel" aria-hidden="true"></div>
<div class="screen"><div class="pic" role="img" aria-label="A high, dark hall with a group of people and the triangle of the Analytika logo glowing in the dark at the far end"></div>${people}</div>
<header class="nav"><a href="forside-korridor-bilde.html" aria-label="Analytika, home"><svg class="lock" aria-hidden="true"><use href="#lg-full"/></svg></a><nav aria-label="Pages">${NAV.map((n) => `<a href="../site/${n.toLowerCase().replace(' ', '')}.html">${n}</a>`).join('')}<a class="cta" href="../site/about.html#contact">CONTACT</a></nav></header>
<h1>Analytika</h1>
<p class="areas" aria-label="Areas">${AREAS.map((a, i) => `<a href="../site/insights.html#${IDS[i]}">${a}</a>`).join('')}</p>
</div></figure>
<div class="opt" role="group" aria-label="Visning"><span>Palett</span>${Object.entries(PALS).map(([k, p]) => `<button type="button" data-pal="${k}" aria-pressed="${k === 'blaa'}">${p.name}</button>`).join('')}<span class="g">Folk</span>${[['en', 'Én mann'], ['gruppe', 'Gruppe']].map(([v, l]) => `<button type="button" data-crowd="${v}" aria-pressed="${v === 'gruppe'}">${l}</button>`).join('')}</div>
${SKETCH('Sketch, round 7 · the hall page with the picture Atle supplied (brown originally; the blue, grey and lilac palettes are a colour shift on it). The glowing triangle in the void is the picture’s own. Pages behind it are not designed in this style.')}
<script>(function(){var f=document.querySelector('.frame');
function press(sel,attr,v){[].forEach.call(document.querySelectorAll(sel),function(x){x.setAttribute('aria-pressed',x.dataset[attr]===v?'true':'false');});}
[].forEach.call(document.querySelectorAll('.opt button[data-pal]'),function(b){b.addEventListener('click',function(){f.dataset.pal=b.dataset.pal;press('.opt button[data-pal]','pal',b.dataset.pal);});});
[].forEach.call(document.querySelectorAll('.opt button[data-crowd]'),function(b){b.addEventListener('click',function(){f.dataset.crowd=b.dataset.crowd;press('.opt button[data-crowd]','crowd',b.dataset.crowd);});});
var q=location.hash.slice(1);if(q&&${JSON.stringify(Object.keys(PALS))}.indexOf(q)>-1){f.dataset.pal=q;press('.opt button[data-pal]','pal',q);}})();</script>
</body></html>`;

write('forside-korridor-bilde.html', html);
