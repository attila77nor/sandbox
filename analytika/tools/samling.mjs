/* One scrollable file with the designs Atle picked, to share: ../forsider-samlet.html.
   Every design is shown as its landing page only (Atle asked for that after seeing a version with the sub-pages; `pages` of a design may hold more than one
   page, and links, labels and the index then follow along). The pages are the real ones (nothing is redrawn), each in its own frame, loaded when it comes into view so that the animation plays when it is seen.
   - Pages that react to scrolling (ScrollTrigger, scroll listeners, long pages with fixed parts) are "driven": the frame stays in place and the file's own
     scroll is passed on to it, so the page behaves as if it were scrolled by hand. Plain pages just flow (the frame is as tall as the page).
   - Links between the pages of a design scroll to the page; a link to a page that was never made in that design shows a short note.
   - Every embedded picture and font is stored once (identical data: strings are replaced by a token and put back when a frame is filled).
   Needs Playwright (measures every page once at build time). Run: NODE_PATH=$(npm root -g) node samling.mjs */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const b64 = (p) => 'data:' + (p.endsWith('.png') ? 'image/png' : 'image/jpeg') + ';base64,' + readFileSync(new URL(p, root)).toString('base64');
const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('assets/vendor/fonts/' + f, root)).toString('base64');

/* ------------------------------------------------------------------ what is in the file (Atle's picks, in his order) */
const F = (file, label, names = []) => ({ kind: 'file', file, label, names: [file.split('/').pop(), ...names] });
const C = (file, i, label) => ({ kind: 'concept', file, i, label, names: [] });
const DESIGNS = [
  { title: 'Kortstokken', note: 'Tre ord i tre skrifter på et kort, en liten spiller som blar gjennom de fem områdene, og to sider bak kortet.', pages: [F('concepts/explore/forside-kort.html', 'Forside')] },
  { title: 'Rutenettet', note: 'Lys side med tynt rutenett. De fem områdene er blå ruter, og to linjer står i midten.', pages: [F('concepts/explore/forside-rutenett.html', 'Forside')] },
  { title: 'Papir', note: 'Bokstaver presset inn i og hevet ut av et ark med fint korn, og knapper som trykkes inn.', pages: [F('concepts/explore/forside-papir.html', 'Forside')] },
  { title: 'Studio', note: 'Kontoret mørklagt bak et slør, med lysspill over og et glassfelt nederst til høyre.', pages: [F('concepts/explore/forside-studio.html', 'Forside')] },
  { title: 'Pikselsiden', note: 'Aktuargraf som blir til piksler, på flat blå flate.', pages: [F('concepts/explore/forside-pixel.html', 'Forside')] },
  { title: 'Hallen', note: 'Bildet over hele skjermen: én mann i en høy hall som ser opp mot trekanten fra logoen.', pages: [F('concepts/explore/forside-korridor-bilde.html', 'Forside')] },
  { title: 'Ordet som vindu', note: 'Logotypen som et vindu mot kontoret. Vinduet åpnes til bildet fyller skjermen.', pages: [F('concepts/explore/forside-tittel-vindu.html', 'Forside')] },
  { title: 'Vinduet følger scroll', note: 'Samme vindu, men åpningen følger scrollen. Scroll videre, og bildet går over i radene.', pages: [F('concepts/explore/forside-vindu-skroll.html', 'Forside')] },
  { title: 'Det virkelige kontoret', note: 'Kontoret over hele skjermen. Scrollen tones mot hvitt, og tavlene er områdene.', pages: [F('concepts/explore/forside-ekte.html', 'Forside')] },
  { title: 'Vegg, hvit', note: 'Hvit bunn, og bildet av tavlene toner opp fra hvitt. Tavlene dimmer hverandre når du peker.', pages: [F('concepts/explore/vegg-hvit.html', 'Forside')] },
  { title: 'Oslo-lys', note: 'Siden lyses av himmelen over Oslo akkurat nå.', pages: [F('concepts/explore/oslo.html', 'Forside')] },
  { title: 'Trekanten', note: 'Galton-gitteret som firmaet: seks rader er 21 prikker, én per person. En kule faller gjennom.', pages: [F('concepts/explore/trekant.html', 'Forside')] },
  { title: 'Tetthet', note: 'Svart og hvitt. Linjer ved kvantilene til en fordeling, tettere der sannsynligheten er høy.', pages: [F('concepts/explore/tetthet.html', 'Forside')] },
  { title: 'Fjellskissen', note: 'Fjellbildet som toner til hvitt og fire ord langs en linje. Siden er lang, og linjen tegnes mens du scroller.', pages: [F('concepts/landing.html', 'Forside')] },
  { title: 'Statements', note: 'Hver påstand får en hel flate: «No fancy jargon. No fluff.» i stort format.', pages: [C('concepts/index.html', 4, 'Forside')] },
  { title: 'Brun, lag', note: 'Umber og terrakotta, tynn skrift, fjellbildet i brun tone. Seksjonene er fire lag oppå hverandre.', pages: [C('concepts/variants.html', 2, 'Forside')] },
  { title: 'Fotoserif', note: 'Fullt mørkt foto, stor luftig serif midt på, små luftige versaler i menyen og en tynn omriss-knapp.', pages: [C('concepts/variants.html', 3, 'Forside')] },
  { title: 'Fargeblokker', note: 'Grå flate, rolig serif-overskrift og flate fargeblokker i logoens farger.', pages: [C('concepts/variants.html', 4, 'Forside')] },
  { title: 'Galton-brettet', note: 'Kulene faller tilfeldig, men haugen blir alltid en klokkekurve.', pages: [C('concepts/photo-concepts.html', 0, 'Forside')] },
];
/* ------------------------------------------------------------------ page sources */
const OWN_CLICK = /<script>document\.addEventListener\('click',function\(e\)\{var a=e\.target\.closest\('a\[href\]'\);if\(!a\|\|window\.parent===window\)[\s\S]*?<\/script>/;
const concept = (file, i) => {
  const s = read(file);
  const head = s.slice(0, s.indexOf('<body'));
  const defs = (s.slice(s.indexOf('<body')).match(/<svg width="0" height="0"[\s\S]*?<\/svg>/g) || []).filter((d) => s.indexOf(d) < s.indexOf('<section class="concept">')).join('');
  const starts = [...s.matchAll(/<section class="concept">/g)].map((m) => m.index);
  const end = s.indexOf('</section>', starts[i]);
  let inner = s.slice(starts[i] + '<section class="concept">'.length, end);
  const cap = inner.indexOf('<div class="cap">'); if (cap >= 0) inner = inner.slice(0, cap);
  if (inner.includes('<div class="pair">')) { const second = inner.indexOf('<div class="scroll">', inner.indexOf('<div class="scroll">') + 1); if (second > 0) inner = inner.slice(0, second) + '</div>'; } // the first screen only, not the sections sketch below it
  const css = '<style>html,body{margin:0;background:var(--page,#E8E9EC)}.scroll{overflow:visible!important;border-radius:0!important;box-shadow:none!important;display:grid;place-items:center}.pair{display:block!important}.stage{min-width:0!important;width:min(100vw,160svh)!important;margin:0 auto!important;box-shadow:none!important}</style>';
  return head.replace('</head>', css + '</head>') + '<body>' + defs + inner + '</body></html>';
};
const PHOTO_SKIP = /ekte-kontor-v5-dof-s1-(lett|sterk)\.jpg/g; // only listed in the config of the window pages, never shown

const assets = {}; // hash -> data uri
const tokenise = (s) => s.replace(/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]{1500,}/g, (u) => { const h = createHash('sha1').update(u).digest('hex').slice(0, 12); assets[h] = u; return `__A:${h}__`; });

const SCROLLY = /scrollY|pageYOffset|scrollTop|ScrollTrigger|IntersectionObserver|addEventListener\(['"]scroll/;
const pages = [];
let pid = 0;
for (const [di, d] of DESIGNS.entries()) {
  for (const p of d.pages) {
    let s = p.kind === 'concept' ? concept(p.file, p.i) : read(p.file);
    s = s.replace(OWN_CLICK, '').replace(PHOTO_SKIP, '');
    s = s.replace(/\.\.\/\.\.\/assets\/photo\/([\w.-]+)/g, (_, n) => b64('assets/photo/' + n));
    const scripts = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
    p.scrolly = p.kind === 'concept' || SCROLLY.test(scripts);
    p.fixed = /position:\s*fixed/.test(s);
    const id = pid++;
    const click = `<script>(function(){var P=${id},T={'people':'people.html','meet the people':'people.html','insights':'insights.html','products':'products.html','about us':'about.html','join us':'about.html#join','contact':'about.html#contact'};function key(a){return (a.textContent||'').replace(/\\s+/g,' ').trim().toLowerCase();}[].forEach.call(document.querySelectorAll('a,.btn'),function(a){var h=a.tagName==='A'?a.getAttribute('href'):null;if((h===null||h==='#')&&T[key(a)])a.style.cursor='pointer';});document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a,.btn');if(!a)return;var h=a.tagName==='A'?a.getAttribute('href'):null;if(a.tagName==='A')e.preventDefault();if(h===null||h===''||h==='#'){var k=key(a);if(T[k]){e.preventDefault();parent.postMessage({s:'go',p:P,h:T[k]},'*');}return;}if(/^(https?:|mailto:)/.test(h)){parent.postMessage({s:'ext',p:P,h:h},'*');return;}if(h.charAt(0)==='#'){var t=document.getElementById(h.slice(1));if(t)parent.postMessage({s:'y',p:P,y:t.getBoundingClientRect().top+window.scrollY},'*');return;}parent.postMessage({s:'go',p:P,h:h},'*');},true);})();</script>`;
    s = /<\/body>/i.test(s) ? s.replace(/<\/body>/i, click + '</body>') : s + click;
    pages.push({ id, d: di, label: p.label, names: p.names, full: s, scrolly: p.scrolly, fixed: p.fixed });
  }
}

/* ------------------------------------------------------------------ measure every page once (height in screens, background, flow or driven) */
const sub = (s) => s.replace(/__A:([0-9a-f]{12})__/g, (_, h) => assets[h] || '');
const { chromium } = require('playwright');
const browser = await chromium.launch();
const VW = 1440, VH = 856;
for (const p of pages) {
  const html = tokenise(p.full);
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH } });
  const pg = await ctx.newPage();
  await pg.setContent(sub(html), { waitUntil: 'load' });
  await pg.waitForTimeout(p.scrolly ? 2600 : 1200);
  const m = await pg.evaluate(() => ({ h: document.documentElement.scrollHeight, bg: getComputedStyle(document.body).backgroundColor, hbg: getComputedStyle(document.documentElement).backgroundColor }));
  let safe = true;
  if (!p.scrolly && m.h > VH + 4) { await pg.setViewportSize({ width: VW, height: m.h }); await pg.waitForTimeout(500); const h2 = await pg.evaluate(() => document.documentElement.scrollHeight); safe = Math.abs(h2 - m.h) < 6; }
  const clear = (c) => !c || /rgba\(0, 0, 0, 0\)|transparent/.test(c);
  p.bg = clear(m.bg) ? (clear(m.hbg) ? '#ffffff' : m.hbg) : m.bg;
  p.ratio = +(m.h / VH).toFixed(3);
  p.mode = p.scrolly || !safe || (p.fixed && m.h > VH + 4) ? 'drive' : 'flow';
  p.html = tokenise(p.full); delete p.full;
  console.log(String(p.id).padStart(2), p.mode.padEnd(5), 'x' + p.ratio.toFixed(2), p.bg.padEnd(22), p.label);
  await ctx.close();
}
await browser.close();

/* ------------------------------------------------------------------ the shell */
const pad = (n) => String(n + 1).padStart(2, '0');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const meta = DESIGNS.map((d, i) => ({ n: pad(i), title: d.title, note: d.note, pages: pages.filter((p) => p.d === i).map((p) => p.id) }));
const pageMeta = pages.map((p) => ({ id: p.id, d: p.d, label: p.label, names: p.names, mode: p.mode, bg: p.bg, r: p.ratio }));
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

const sections = DESIGNS.map((d, di) => `<article class="design" data-d="${di}" id="d${di}" tabindex="-1" aria-label="${esc(d.title)}">${pages.filter((p) => p.d === di).map((p) => `<section class="pg" data-p="${p.id}" data-mode="${p.mode}" style="--bg:${p.bg};--r:${p.ratio}" aria-label="${esc(d.title + ': ' + p.label)}"><div class="pin"></div></section>`).join('')}</article>`).join('\n');
const list = meta.map((m, i) => `<li><a href="#d${i}" data-go="${i}"><b>${m.n}</b><span class="lt">${esc(m.title)}</span><span class="ln">${esc(m.note)}</span>${m.pages.length > 1 ? `<span class="lp">${m.pages.length} sider: ${esc(pageMeta.filter((p) => p.d === i).map((p) => p.label.replace('Insights › ', '')).filter((l, k, a) => a.indexOf(l) === k).join(', '))}</span>` : ''}</a></li>`).join('');

const CSS = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-600-normal.woff2')}) format("woff2");font-weight:600;font-display:block}
:root{--ink:#14161B;--mute:#5C616C;--rule:#DCDEE3;--bar:44px;--vh:calc(100vh - var(--bar));--vh:calc(100svh - var(--bar))}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-padding-top:var(--bar);scroll-snap-type:y proximity;background:#fff}
body{margin:0;color:var(--ink);font:400 13px/1.5 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
a{color:inherit}
:focus-visible{outline:1.5px solid #036194;outline-offset:2px}
[hidden]{display:none!important}
#bar{position:sticky;top:0;z-index:20;height:var(--bar);display:flex;align-items:center;gap:16px;padding:0 clamp(12px,2vw,24px);background:#fff;border-bottom:1px solid var(--rule)}
#bar .brand{font-weight:600;letter-spacing:-.01em;white-space:nowrap}
#bar .now{flex:1;min-width:0;display:flex;align-items:baseline;gap:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#bar .now b{font-weight:600;color:#1B92D0;font-variant-numeric:tabular-nums}
#bar .now .nt{font-weight:600}
#bar .now .np{color:var(--mute);overflow:hidden;text-overflow:ellipsis}
#bar .btns{display:flex;align-items:center;gap:2px}
#bar .btns button{height:28px;padding:0 10px;border-radius:6px;color:var(--ink);transition:background-color .15s ease-out}
#bar .btns button:hover{background:#EEF0F3}
#bar .btns button:active{transform:scale(.97)}
.cover{min-height:var(--vh);padding:clamp(28px,6vw,72px) clamp(16px,4vw,56px) 48px;scroll-snap-align:start}
.cover h1{margin:0;font-weight:600;font-size:clamp(24px,3vw,38px);line-height:1.1;letter-spacing:-.025em}
.cover .lede{margin:.8rem 0 0;max-width:64ch;color:var(--mute);font-size:14px}
.lst{list-style:none;margin:clamp(24px,4vw,44px) 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,330px),1fr));gap:0 clamp(20px,3vw,48px);counter-reset:n}
.lst li{border-top:1px solid var(--rule)}
.lst li a{display:grid;grid-template-columns:34px 1fr;column-gap:8px;padding:11px 0 12px;text-decoration:none}
.lst li a:hover .lt{text-decoration:underline;text-underline-offset:.3em}
.lst li b{grid-row:1/4;font-weight:600;color:#1B92D0;font-variant-numeric:tabular-nums}
.lst .lt{font-weight:600}.lst .ln{color:var(--mute);font-size:12.5px;line-height:1.45}.lst .lp{font-size:12px;color:#036194;margin-top:2px}
.pg{position:relative;height:calc(var(--vh)*var(--r));min-height:var(--vh);background:var(--bg,#fff);scroll-snap-align:start}
.pg .pin{height:100%}
.pg[data-mode=drive] .pin{position:sticky;top:var(--bar);height:var(--vh)}
.pg iframe{display:block;width:100%;height:100%;border:0;background:var(--bg,#fff)}
.pg.ld::after{content:"";position:absolute;left:50%;top:calc(var(--bar) + var(--vh)/2);width:18px;height:18px;margin:-9px;border-radius:50%;border:2px solid rgba(128,128,128,.35);border-top-color:rgba(128,128,128,.9);animation:sp .8s linear infinite;pointer-events:none}
@keyframes sp{to{transform:rotate(360deg)}}
dialog#idx{inset:0 0 0 auto;margin:0;padding:0;width:min(100%,420px);max-width:none;height:100svh;max-height:100svh;border:0;border-left:1px solid var(--rule);background:#fff;color:var(--ink);box-shadow:-12px 0 32px rgba(20,22,27,.08);overflow:auto;overscroll-behavior:contain;opacity:0;translate:24px 0;transition:translate .25s cubic-bezier(.22,1,.36,1),opacity .2s ease-out,overlay .25s,display .25s;transition-behavior:allow-discrete}
dialog#idx[open]{opacity:1;translate:0 0}
@starting-style{dialog#idx[open]{opacity:0;translate:24px 0}}
dialog#idx::backdrop{background:rgba(20,22,27,0);transition:background-color .25s ease-out,overlay .25s,display .25s;transition-behavior:allow-discrete}
dialog#idx[open]::backdrop{background:rgba(20,22,27,.16)}
@starting-style{dialog#idx[open]::backdrop{background:rgba(20,22,27,0)}}
.idx-h{position:sticky;top:0;z-index:1;display:flex;align-items:center;justify-content:space-between;height:var(--bar);padding:0 clamp(14px,2vw,22px);background:#fff;border-bottom:1px solid var(--rule);font-weight:600}
.idx-h button{height:28px;padding:0 10px;border-radius:6px;font-weight:400}.idx-h button:hover{background:#EEF0F3}
#idx nav{padding:0 clamp(14px,2vw,22px) 28px}
#idx .lst{display:block;margin:0}
.lst a:is(:target-current,.target-current) .lt{text-decoration:underline;text-decoration-thickness:1.5px;text-underline-offset:.3em}
.lst a:is(:target-current,.target-current) b::after{content:" ●";font-size:8px;vertical-align:2px}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
#toast{margin:0;border:0;inset:auto auto 20px 50%;translate:-50% 0;max-width:min(92vw,460px);padding:6px 6px 6px 14px;border-radius:8px;background:var(--ink);color:#fff;font:inherit;font-size:12.5px;display:none;align-items:center;gap:10px;opacity:0;transform:translateY(8px);transition:opacity .2s ease-out,transform .2s ease-out,overlay .2s,display .2s;transition-behavior:allow-discrete}
#toast:popover-open,#toast.fb.on{display:flex;opacity:1;transform:none}
@starting-style{#toast:popover-open{opacity:0;transform:translateY(8px)}}
#toast.fb{position:fixed;z-index:40}
#toast button{flex:none;width:28px;height:28px;border-radius:6px;color:#fff;font-size:17px;line-height:1}
#toast button:hover{background:rgba(255,255,255,.16)}
@media (max-width:640px){#bar .brand{display:none}#bar .btns .rp{display:none}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}html{scroll-snap-type:none}}
`;

const JS = `
(function(){
var D=${json(meta)},PM=${json(pageMeta)},A=${json(assets)},H=${json(Object.fromEntries(pages.map((p) => [p.id, p.html])))};
var BAR=function(){return document.getElementById('bar').offsetHeight;};
var els=[].slice.call(document.querySelectorAll('.pg')),byId={};
els.forEach(function(e){var id=+e.dataset.p;byId[id]=e;e.pin=e.firstChild;e.pm=PM[id];e.lastY=-1;});
var toast=document.getElementById('toast'),toastTxt=document.getElementById('toast-t'),live=document.getElementById('live'),toastT,POP='popover' in HTMLElement.prototype;
if(!POP)toast.classList.add('fb');
function toastShow(){if(POP){if(!toast.matches(':popover-open'))toast.showPopover();}else toast.classList.add('on');}
function toastHide(){clearTimeout(toastT);if(POP){if(toast.matches(':popover-open'))toast.hidePopover();}else toast.classList.remove('on');}
function toastArm(){clearTimeout(toastT);toastT=setTimeout(toastHide,6500);}
function say(t){
  if(document.getElementById('idx').open)return;
  toastTxt.textContent=t;toastShow();toastArm();
  if(document.ariaNotify)document.ariaNotify(t);else{live.textContent='';setTimeout(function(){live.textContent=t;},60);}
}
toast.addEventListener('focusin',function(){clearTimeout(toastT);});toast.addEventListener('focusout',toastArm);
toast.addEventListener('mouseenter',function(){clearTimeout(toastT);});toast.addEventListener('mouseleave',toastArm);
toast.querySelector('button').addEventListener('click',function(){if(!POP)toastHide();});
function fill(id){return H[id].replace(/__A:([0-9a-f]{12})__/g,function(m,k){return A[k]||'';});}
function load(pg){
  if(pg.frame)return;pg.classList.add('ld');
  var f=document.createElement('iframe');f.title=pg.getAttribute('aria-label');f.setAttribute('scrolling','no');
  f.onload=function(){pg.classList.remove('ld');after(pg);};
  pg.frame=f;f.srcdoc=fill(pg.pm.id);pg.pin.appendChild(f);
}
function unload(pg){if(!pg.frame)return;pg.frame.remove();pg.frame=null;pg.lastY=-1;pg.classList.remove('ld');}
function measure(pg){
  var f=pg.frame;if(!f)return;
  try{var vh=innerHeight-BAR();if(pg.pm.mode==='flow')pg.style.height=vh+'px';
    var d=f.contentDocument,h=Math.max(d.documentElement.scrollHeight,(d.body&&d.body.scrollHeight)||0);
    pg.style.height=Math.max(h,vh)+'px';
  }catch(e){}
  sync();
}
function after(pg){
  [0,400,1200,3000].forEach(function(t){setTimeout(function(){measure(pg);},t);});
  try{var w=pg.frame.contentWindow;if(w.ResizeObserver){var ro=new w.ResizeObserver(function(){measure(pg);});ro.observe(pg.frame.contentDocument.documentElement);}}catch(e){}
  if(pg.hash){var h=pg.hash;pg.hash=null;setTimeout(function(){toHash(pg,h);},700);}
}
function sync(){
  var bar=BAR();
  els.forEach(function(pg){
    if(pg.pm.mode!=='drive'||!pg.frame)return;
    var r=pg.getBoundingClientRect(),H=pg.offsetHeight,vh=pg.pin.clientHeight,y=Math.max(0,Math.min(H-vh,bar-r.top));
    if(Math.abs(y-pg.lastY)>.5){try{pg.frame.contentWindow.scrollTo(0,y);}catch(e){}pg.lastY=y;}
  });
}
/* load a page when its top reaches the upper 70 % of the screen; drop it again when it is far away (it then starts over when it comes back) */
var near=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)load(e.target);});},{rootMargin:'0px 0px -30% 0px'});
var far=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)unload(e.target);});},{rootMargin:'250% 0px 250% 0px'});
els.forEach(function(e){near.observe(e);far.observe(e);});
/* the label in the top bar */
var nn=document.getElementById('nn'),nt=document.getElementById('nt'),np=document.getElementById('np'),cur=null;
function current(){
  var mid=BAR()+(innerHeight-BAR())*.4,best=null;
  els.forEach(function(pg){var r=pg.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid)best=pg;});
  if(!best){var c=document.getElementById('cover').getBoundingClientRect();if(c.bottom>mid){cur=null;nn.textContent='';nt.textContent='Innhold';np.textContent='';mark(-1);}return;}
  if(best===cur)return;cur=best;var m=PM[best.pm.id],d=D[m.d],sib=d.pages.length;
  nn.textContent=d.n;nt.textContent=d.title;np.textContent=sib>1?(d.pages.indexOf(m.id)+1)+' av '+sib+' · '+m.label:'';
  mark(m.d);
}
/* the list marks the design you are in (:target-current is not used: the label above and the mark must name the same design) */
function mark(di){[].forEach.call(document.querySelectorAll('.lst a[data-go]'),function(a){var on=+a.dataset.go===di;a.classList.toggle('target-current',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
var tick=false;function onScroll(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;sync();current();});}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',function(){els.forEach(function(pg){if(pg.frame)measure(pg);});onScroll();});
/* moving around */
function top(el){return el.getBoundingClientRect().top+scrollY-BAR();}
function goDesign(i){i=Math.max(0,Math.min(D.length-1,i));var a=document.getElementById('d'+i);byId[D[i].pages[0]].scrollIntoView({behavior:'smooth',block:'start'});if(a)a.focus({preventScroll:true});}
function designNow(){return cur?PM[cur.pm.id].d:-1;}
document.getElementById('next').onclick=function(){goDesign(designNow()+1);};
document.getElementById('prev').onclick=function(){var d=designNow();if(d<=0){scrollTo({top:0,behavior:'smooth'});}else goDesign(d-1);};
document.getElementById('replay').onclick=function(){var pg=cur;if(!pg)return;scrollTo(0,top(pg));unload(pg);load(pg);};
var idx=document.getElementById('idx'),ib=document.getElementById('index');
function openIdx(){if(!idx.open)idx.showModal();ib.setAttribute('aria-expanded','true');}
function closeIdx(){if(idx.open)idx.close();}
idx.addEventListener('close',function(){ib.setAttribute('aria-expanded','false');});
ib.onclick=function(){if(idx.open)closeIdx();else openIdx();};
document.getElementById('idx-x').onclick=closeIdx;
idx.addEventListener('click',function(e){var r=idx.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeIdx();});
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-go]');if(a){e.preventDefault();closeIdx();goDesign(+a.dataset.go);}});
/* what the pages say: a link inside a page, a link to an anchor, an outside link */
var NAMES={'people.html':'People','insights.html':'Insights','products.html':'Products','about.html':'About us'};
function toHash(pg,id){
  try{var el=pg.frame.contentDocument.getElementById(id);if(el){var y=el.getBoundingClientRect().top+pg.frame.contentWindow.scrollY;scrollTo({top:top(pg)+(pg.pm.mode==='drive'?y:y),behavior:'smooth'});return;}}catch(e){}
  pg.scrollIntoView({behavior:'smooth',block:'start'});
}
addEventListener('message',function(e){
  /* only our own frames are listened to: the frames are srcdoc documents (origin "null" from a file), so the origin cannot tell them apart; the sender window can */
  var m=e.data;if(!m||typeof m!=='object'||typeof m.s!=='string')return;
  var pg=byId[m.p];if(!pg||!pg.frame||e.source!==pg.frame.contentWindow)return;
  if(m.s==='ext'){try{var u=new URL(String(m.h));if(/^(https?|mailto):$/.test(u.protocol))window.open(u.href,'_blank','noopener');}catch(x){}return;}
  if(m.s==='y'){if(isFinite(m.y))scrollTo({top:top(pg)+m.y,behavior:'smooth'});return;}
  if(m.s==='go'&&typeof m.h==='string'){
    var parts=m.h.split('#'),base=parts[0].split('/').pop(),hash=parts[1]||'',d=D[PM[m.p].d],hit=null;
    if(!base){return;}
    d.pages.forEach(function(id){if(PM[id].names.indexOf(base)>-1)hit=id;});
    if(!hit){var nm=hash==='join'?'Join us':hash==='contact'?'Contact':(NAMES[base]||base.replace(/\\.html$/,''));say('«'+nm+'» er ikke med: bare forsidene er tatt med.');return;}
    var t=byId[hit];if(hash){if(t.frame)toHash(t,hash);else{t.hash=hash;t.scrollIntoView({behavior:'smooth',block:'start'});}}else t.scrollIntoView({behavior:'smooth',block:'start'});
  }
});
onScroll();
})();
`;

const html = `<!doctype html>
<html lang="no"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forslag til forsider</title><style>${CSS}</style></head><body>
<header id="bar"><span class="brand">Analytika · forslag</span><div class="now"><b id="nn"></b><span class="nt" id="nt">Innhold</span><span class="np" id="np"></span></div><div class="btns"><button type="button" id="prev" aria-label="Forrige design" title="Forrige design">‹</button><button type="button" id="next" aria-label="Neste design" title="Neste design">›</button><button type="button" id="replay" class="rp" title="Last siden på nytt, så animasjonen spilles av igjen">Spill av igjen</button><button type="button" id="index" aria-expanded="false" aria-controls="idx">Oversikt</button></div></header>
<main>
<section class="cover" id="cover"><h1>Forslag til forsider</h1><p class="lede">${DESIGNS.length} forsider. Scroll nedover. Sidene er de ekte, og animasjonen spilles av når siden kommer til syne. «Spill av igjen» øverst starter siden du står på på nytt. Noen eldre skisser henter skrifter fra Google Fonts og trenger nett for å se riktig ut.</p><ol class="lst">${list}</ol></section>
${sections}
</main>
<dialog id="idx" aria-label="Oversikt"><div class="idx-h"><span>Oversikt</span><button type="button" id="idx-x" autofocus aria-label="Lukk oversikten">Lukk</button></div><nav aria-label="Designene"><ol class="lst">${list}</ol></nav></dialog>
<div role="region" aria-label="Meldinger"><div id="toast" popover="manual"><span id="toast-t"></span><button type="button" popovertarget="toast" popovertargetaction="hide" aria-label="Lukk melding">×</button></div></div>
<div id="live" class="sr" aria-live="polite"></div>
<script>${JS}</script>
</body></html>`;

writeFileSync(new URL('forsider-samlet.html', root), html);
console.log('wrote forsider-samlet.html', (html.length / 1e6).toFixed(1) + ' MB', 'pages', pages.length, 'assets', Object.keys(assets).length);
