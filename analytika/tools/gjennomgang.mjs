/* The ten designs Atle picked, one at a time, in one file: ../forsider-ti.html.
   No scrolling from one design to the next (they ran into each other, and he wanted a clear feel for each): one design fills the screen, ‹ › or the arrow
   keys or a number moves to the next, and clicking the current number plays it again. Each design is the real page in a frame of its own, loaded when it is
   shown so that its animation starts then. A page that scrolls on its own (the window that follows the scroll, the mountain sketch) scrolls inside its frame.
   Nothing to choose from: the colour, veil, light and palette controls of the earlier rounds are taken out (Papir stands in the grey with marine that he
   screenshotted), the pages' own notes about our process are taken out of the two framed pages, and those two are fitted to the screen.
   Needs Playwright (reads each page's background once). Run: NODE_PATH=$(npm root -g) node gjennomgang.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('assets/vendor/fonts/' + f, root)).toString('base64');

/* a framed page (body centred, a frame of a fixed ratio, our controls and notes below it) made to fit the screen with nothing under the frame */
const fit = (ratio) => `<style>body{min-height:100svh!important;padding:clamp(10px,2svh,24px)!important;gap:0!important}.frame{width:min(94vw,1180px,calc((100svh - 2*clamp(10px,2svh,24px))*${ratio}))!important}</style>`;
const cut = (s, re) => s.replace(re, '');
const OPT = /<div class="opt"[\s\S]*?<\/div>/;
const NOTE = /<p class="sketch">[\s\S]*?<\/p>/;
const concept = (file, i) => {
  const s = read(file);
  const head = s.slice(0, s.indexOf('<body'));
  const defs = (s.slice(s.indexOf('<body')).match(/<svg width="0" height="0"[\s\S]*?<\/svg>/g) || []).filter((d) => s.indexOf(d) < s.indexOf('<section class="concept">')).join('');
  const starts = [...s.matchAll(/<section class="concept">/g)].map((m) => m.index);
  const end = s.indexOf('</section>', starts[i]);
  let inner = s.slice(starts[i] + '<section class="concept">'.length, end);
  const cap = inner.indexOf('<div class="cap">'); if (cap >= 0) inner = inner.slice(0, cap);
  if (inner.includes('<div class="pair">')) { const second = inner.indexOf('<div class="scroll">', inner.indexOf('<div class="scroll">') + 1); if (second > 0) inner = inner.slice(0, second) + '</div>'; } // the first screen only
  const css = '<style>html,body{margin:0;background:var(--page,#E8E9EC)}.scroll{overflow:visible!important;border-radius:0!important;box-shadow:none!important;display:grid;place-items:center}.pair{display:block!important}.stage{min-width:0!important;width:min(100vw,160svh)!important;margin:0 auto!important;box-shadow:none!important}</style>';
  return head.replace('</head>', css + '</head>') + '<body>' + defs + inner + '</body></html>';
};

const DESIGNS = [
  { title: 'Papir', src: () => cut(cut(read('concepts/explore/forside-papir.html'), OPT), NOTE).replace('data-t="blaa"', 'data-t="graa"').replace('</head>', fit(936 / 702) + '</head>') },
  { title: 'Studio', src: () => cut(cut(cut(read('concepts/explore/forside-studio.html'), OPT), NOTE), /<details class="menu">[\s\S]*?<\/details>/).replace('</head>', fit(922 / 650) + '</head>') },
  { title: 'Hallen', src: () => cut(read('concepts/explore/forside-korridor-bilde.html'), OPT) },
  { title: 'Vinduet følger scroll', src: () => read('concepts/explore/forside-vindu-skroll.html') },
  { title: 'Oslo-lys', src: () => read('concepts/explore/oslo.html') },
  { title: 'Trekanten', src: () => read('concepts/explore/trekant.html') },
  { title: 'Tetthet', src: () => read('concepts/explore/tetthet.html') },
  { title: 'Fjellskissen', src: () => read('concepts/landing.html') },
  { title: 'Brun, lag', src: () => concept('concepts/variants.html', 2) },
  { title: 'Galton-brettet', src: () => concept('concepts/photo-concepts.html', 0) },
];

/* ------------------------------------------------------------------ pages */
const assets = {};
const tokenise = (s) => s.replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]{1500,}/g, (u) => { const h = createHash('sha1').update(u).digest('hex').slice(0, 12); assets[h] = u; return `__A:${h}__`; });
const sub = (s) => s.replace(/__A:([0-9a-f]{12})__/g, (_, h) => assets[h] || '');
const photo = (s) => s.replace(/\.\.\/\.\.\/assets\/photo\/([\w.-]+)/g, (_, n) => 'data:image/jpeg;base64,' + readFileSync(new URL('assets/photo/' + n, root)).toString('base64'));
const UNUSED = /ekte-kontor-v5-dof-s1-(lett|sterk)\.jpg/g; // only listed in the config of the window page, never shown
/* a click on a link must not navigate the frame away from its page */
const CLICK = '<script>document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a");if(a)e.preventDefault();},true);</script>';

const { chromium } = require('playwright');
const browser = await chromium.launch();
const pages = [];
for (const d of DESIGNS) {
  let s = photo(d.src()).replace(UNUSED, '');
  s = /<\/body>/i.test(s) ? s.replace(/<\/body>/i, CLICK + '</body>') : s + CLICK;
  s = tokenise(s);
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 856 } });
  const pg = await ctx.newPage();
  await pg.setContent(sub(s), { waitUntil: 'load' });
  await pg.waitForTimeout(900);
  const m = await pg.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, hbg: getComputedStyle(document.documentElement).backgroundColor }));
  const clear = (c) => !c || /rgba\(0, 0, 0, 0\)|transparent/.test(c);
  d.bg = clear(m.bg) ? (clear(m.hbg) ? '#ffffff' : m.hbg) : m.bg;
  d.html = s;
  console.log(d.title.padEnd(24), d.bg);
  await ctx.close();
}
await browser.close();

/* ------------------------------------------------------------------ the shell: a thin bar, nothing else */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const meta = DESIGNS.map((d) => ({ t: d.title, bg: d.bg }));
const nums = DESIGNS.map((d, i) => `<button type="button" data-i="${i}" aria-label="${i + 1}. ${esc(d.title)}">${i + 1}</button>`).join('');

const CSS = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-600-normal.woff2')}) format("woff2");font-weight:600;font-display:block}
:root{--ink:#14161B;--mute:#5C616C;--rule:#DCDEE3;--bar:44px}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;overflow:hidden;color:var(--ink);background:#fff;font:400 13px/1.4 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
:focus-visible{outline:1.5px solid #036194;outline-offset:2px}
#bar{height:var(--bar);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;padding:0 clamp(12px,2vw,24px);background:#fff;border-bottom:1px solid var(--rule)}
#ttl{display:flex;align-items:baseline;gap:10px;min-width:0;white-space:nowrap}
#ttl b{font-weight:600;color:#1B92D0;font-variant-numeric:tabular-nums}
#ttl span{font-weight:600;overflow:hidden;text-overflow:ellipsis}
#nums{display:flex;gap:2px}
#nums button{min-width:30px;height:28px;padding:0 6px;border-radius:6px;color:var(--mute);font-variant-numeric:tabular-nums;transition:background-color .15s ease-out,color .15s ease-out}
#nums button:hover{background:#EEF0F3;color:var(--ink)}
#nums button[aria-current=true]{color:var(--ink);font-weight:600;box-shadow:inset 0 -2px 0 #1B92D0;border-radius:6px 6px 0 0}
#cnt{display:none;color:var(--mute);font-variant-numeric:tabular-nums}
#arrows{display:flex;justify-content:flex-end;gap:2px}
#arrows button{width:34px;height:28px;border-radius:6px;font-size:18px;line-height:1;transition:background-color .15s ease-out,transform .15s ease-out}
#arrows button:hover:not(:disabled){background:#EEF0F3}
#arrows button:active:not(:disabled){transform:scale(.95)}
#arrows button:disabled{opacity:.3;cursor:default}
#stage{height:calc(100% - var(--bar));background:#fff}
#stage iframe{display:block;width:100%;height:100%;border:0}
@media (max-width:760px){#nums{display:none}#cnt{display:block}#bar{grid-template-columns:1fr auto auto}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

const JS = `
(function(){
var D=${json(meta)},A=${json(assets)},H=${json(DESIGNS.map((d) => d.html))};
var stage=document.getElementById('stage'),n=document.getElementById('n'),t=document.getElementById('t'),cnt=document.getElementById('cnt'),prev=document.getElementById('prev'),next=document.getElementById('next'),btns=[].slice.call(document.querySelectorAll('#nums button')),i=-1;
function fill(k){return H[k].replace(/__A:([0-9a-f]{12})__/g,function(m,h){return A[h]||'';});}
function show(k){
  k=Math.max(0,Math.min(D.length-1,k));
  var old=stage.firstChild;if(old)old.remove();
  stage.style.background=D[k].bg;
  var f=document.createElement('iframe');f.title=D[k].t;
  f.onload=function(){try{f.contentWindow.addEventListener('keydown',keys);}catch(e){}};
  f.srcdoc=fill(k);stage.appendChild(f);
  i=k;n.textContent=String(k+1).padStart(2,'0');t.textContent=D[k].t;cnt.textContent=(k+1)+' / '+D.length;
  btns.forEach(function(b,j){if(j===k)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
  prev.disabled=k===0;next.disabled=k===D.length-1;
  document.title='Analytika: '+(k+1)+' '+D[k].t;
  try{history.replaceState(null,'','#'+(k+1));}catch(e){}
}
function keys(e){if(e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'&&i<D.length-1)show(i+1);else if(e.key==='ArrowLeft'&&i>0)show(i-1);}
document.addEventListener('keydown',keys);
prev.onclick=function(){show(i-1);};next.onclick=function(){show(i+1);};
btns.forEach(function(b){b.onclick=function(){show(+b.dataset.i);};});
var h=parseInt(location.hash.slice(1),10);show(h>=1&&h<=D.length?h-1:0);
})();
`;

const html = `<!doctype html>
<html lang="no"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika: forsider</title><style>${CSS}</style></head><body>
<header id="bar"><div id="ttl"><b id="n"></b><span id="t"></span></div><nav id="nums" aria-label="Forsider">${nums}</nav><span id="cnt"></span><div id="arrows"><button type="button" id="prev" aria-label="Forrige" title="Forrige (←)">‹</button><button type="button" id="next" aria-label="Neste" title="Neste (→)">›</button></div></header>
<main id="stage"></main>
<script>${JS}</script>
</body></html>`;

writeFileSync(new URL('forsider-ti.html', root), html);
console.log('wrote forsider-ti.html', (html.length / 1e6).toFixed(1) + ' MB', 'assets', Object.keys(assets).length);
