/* One file that shows everything we have made: ../oversikt.html.
   An overview of thumbnails grouped by page type; a click opens the page inside the same file (nothing else is needed),
   and links inside the pages keep working. Pages that are not designed yet open a plain stand-in with a Back button.
   Rebuild after the explore-* scripts, and run oversikt-thumbs.cjs first if a page has changed. */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { basename } from 'node:path';
import { SECTIONS, SUBS, ITEMS, HISTORY, EXPAND, PHOTOS, INSPIRATION, DOCS } from './oversikt-data.mjs';

const concepts = JSON.parse(readFileSync(new URL('concepts/thumbs/concepts.json', new URL('../', import.meta.url))));
/* every sketch inside the multi-sketch files becomes an item of its own */
const CONCEPT_ITEMS = EXPAND.flatMap((ex) => (concepts[ex.file] || []).map((c) => ({ section: ex.section, sub: ex.sub, status: ex.status, fav: c.fav, title: c.title, text: c.text, round: ex.round, group: ex.group, file: ex.file, id: `${ex.id}-${c.i}`, scroll: { sel: 'section.concept', i: c.i } })));
const ALL = [...ITEMS, ...CONCEPT_ITEMS, ...HISTORY];

const root = new URL('../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');
const b64 = (p, mime = 'image/jpeg') => `data:${mime};base64,` + readFileSync(new URL(p, root)).toString('base64');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const STATUS = { valgt: 'Valgt', alternativ: 'Alternativ', tidligere: 'Tidligere', avvist: 'Avvist' };

/* ---------- page keys and link rewriting ---------- */
const keyOf = (it) => `${it.group}/${basename(it.file)}`;
const sets = {};
for (const it of ALL) (sets[it.group] ||= new Set()).add(basename(it.file));
const AREA = { actuary: 'Actuary', pricing: 'Pricing', 'data-platforms': 'Data platforms', consulting: 'Consulting', 'business-development': 'Business development' };
const SUB = { risk: 'Risk actuary', compliance: 'Compliance', reserving: 'Reserving', 'life-pension': 'Life and pension' };
/* links in the explore pages to pages that are not designed yet become stand-ins */
function standIn(h) {
  let m;
  if ((m = h.match(/insights-actuary-([a-z-]+)\.html$/))) return 'ph:Actuary › ' + SUB[m[1]];
  if ((m = h.match(/insights\.html#([a-z-]+)$/))) return 'ph:Insights › ' + (AREA[m[1]] || m[1]);
  if (/insights\.html$/.test(h)) return 'ph:Insights';
  if (/products\.html$/.test(h)) return 'ph:Products';
  if (/about\.html#join$/.test(h)) return 'ph:Join us';
  if (/about\.html#contact$/.test(h)) return 'ph:Contact';
  if (/about\.html$/.test(h)) return 'ph:About us';
  if (/people\.html$/.test(h)) return 'ph:People';
  return 'ph:' + h;
}
function mapHref(h, group) {
  if (!h || h[0] === '#' || /^(https?:|mailto:)/.test(h)) return h;
  if (group === 'explore') return sets.explore.has(h) ? 'explore/' + h : standIn(h);
  if (group === 'site' || group.startsWith('hist-')) { const m = h.match(/^([a-z-]+\.html)(#.*)?$/); return m && sets[group].has(m[1]) ? group + '/' + h : standIn(h); }
  if (group === 'taste' || group === 'lib') { const m = h.match(/^\.\.\/site\/(.+)$/); return m ? 'site/' + m[1] : h; }
  return h;
}
const CLICK = `<script>document.addEventListener('click',function(e){if(e.defaultPrevented)return;var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');if(!h)return;if(h.charAt(0)==='#'){e.preventDefault();var t=h.length>1&&document.getElementById(h.slice(1));if(t)t.scrollIntoView({behavior:'smooth'});return;}if(/^(https?:|mailto:)/.test(h))return;e.preventDefault();parent.postMessage({go:h},'*');});</script>`;
const OWN_CLICK = /<script>document\.addEventListener\('click',function\(e\)\{var a=e\.target\.closest\('a\[href\]'\);if\(!a\|\|window\.parent===window\)[\s\S]*?<\/script>/;

const pages = {}, alias = {};
const photoFull = {};
for (const it of ALL) {
  const k = keyOf(it);
  if (it.same) { alias[k] = keyOf(ALL.find((x) => x.id === it.same)); continue; }
  if (pages[k]) continue;
  let s = read(it.file);
  s = s.replace(OWN_CLICK, '');
  s = s.replace(/(<a\b[^>]*?\shref=")([^"]*)(")/g, (_, a, h, c) => a + mapHref(h, it.group) + c);
  s = s.replace(/\.\.\/\.\.\/assets\/photo\/([\w.-]+)/g, (_, n) => { photoFull[n] ||= b64('assets/photo/' + n); return '__PH:' + n + '__'; });
  pages[k] = /<\/body>/.test(s) ? s.replace('</body>', CLICK + '</body>') : s + CLICK;
}
for (const ph of PHOTOS) if (ph.full) photoFull[basename(ph.file)] ||= b64(ph.file);

/* ---------- the overview ---------- */
const STATUS_LABEL = (it) => [it.round, STATUS[it.status], it.fav ? 'fremhevet av Claude den gang' : ''].filter(Boolean).join(' · ');
const order = []; // what the viewer can open, in order: { k, t, s, r, sec, nav, sc }
const addOrder = (it, sec, nav = true) => order.push({ k: keyOf(it), t: it.title, s: STATUS[it.status], r: it.round || '', sec, nav, sc: it.scroll || null, z: it.zoom ? 1 : 0, b: it.blur ? 1 : 0, p: it.replay ? 1 : 0 }) - 1;
const card = (it, n, thumb) => {
  const body = `<img src="${thumb}" alt=""><span class="t">${esc(it.title)}</span>${it.text ? `<span class="x">${esc(it.text)}</span>` : ''}<span class="s" data-s="${it.status}" data-f="${it.fav ? 1 : 0}">${STATUS_LABEL(it)}</span>`;
  return n === null ? `<div class="card" data-s="${it.status}">${body}</div>` : `<button type="button" class="card" data-s="${it.status}" data-n="${n}">${body}</button>`;
};
const subOrder = Object.keys(SUBS);
const TREE = [], ptree = [], dtree = [];
let total = 0;
const sectionHtml = SECTIONS.map((sec) => {
  const its = ALL.filter((i) => i.section === sec.id);
  if (!its.length) return '';
  total += its.length;
  const tsec = { id: sec.id, title: sec.title, subs: [] }; TREE.push(tsec);
  const subs = subOrder.filter((k) => its.some((i) => i.sub === k)).map((k) => {
    const mine = its.filter((i) => i.sub === k), meta = SUBS[k];
    const tsub = { key: k, title: meta.title, items: [] }; tsec.subs.push(tsub);
    const cards = mine.map((it) => { const n = addOrder(it, sec.id); tsub.items.push({ n, it }); return card(it, n, b64('concepts/thumbs/' + (it.same || it.id) + '.jpg')); }).join('');
    let whole = '';
    if (meta.page) { const n = addOrder({ group: 'old', file: meta.page, title: meta.title + ' (hele siden)', status: 'tidligere', round: mine[0].round }, sec.id, false); whole = `<button type="button" class="whole" data-n="${n}">Åpne hele siden</button>`; }
    return `<div class="sub"><div class="subh"><h3>${esc(meta.title)}</h3><p>${esc(meta.note || '')}</p>${whole}</div><div class="grid">${cards}</div></div>`;
  }).join('');
  return `<section id="${sec.id}"><h2>${sec.title}<span>${its.length} ${its.length === 1 ? 'side' : 'sider'}</span></h2>${subs}</section>`;
}).join('');

const photoCards = PHOTOS.map((ph) => {
  let n = null;
  if (ph.full) n = order.push({ k: 'photo:' + basename(ph.file), t: ph.title, s: STATUS[ph.status], r: '', sec: 'bilder', nav: true, sc: null }) - 1;
  if (n !== null) ptree.push({ n, it: { ...ph, round: '' } });
  return card({ ...ph, round: '' }, n, b64('concepts/thumbs/photo-' + ph.id + '.jpg'));
}).join('');
const inspo = INSPIRATION.map((g) => {
  const files = readdirSync(new URL('inspiration/' + g.dir + '/', root)).filter((f) => /\.(png|webp|jpe?g)$/i.test(f)).sort();
  return `<div class="ig"><h3>${esc(g.title)}${g.note ? `<span>${esc(g.note)}</span>` : ''}</h3><div class="thumbs">${files.map((f) => `<img src="${b64('concepts/thumbs/inspo-' + g.dir + '-' + f.replace(/\.[^.]+$/, '') + '.jpg')}" alt="${esc(f)}" title="${esc(f)}">`).join('')}</div></div>`;
}).join('');

const docMap = {};
const docCards = DOCS.map((d) => {
  const content = d.kind === 'svg' ? 'data:image/svg+xml;base64,' + readFileSync(new URL(d.file, root)).toString('base64') : read(d.file);
  docMap[d.id] = { kind: d.kind, content };
  const n = order.push({ k: 'doc:' + d.id, t: d.title, s: '', r: '', sec: 'dokumenter', nav: true, sc: null }) - 1;
  dtree.push({ n, it: { title: d.title, status: '', round: '' } });
  const face = d.kind === 'svg' ? `<span class="face logo"><img src="${content}" alt=""></span>` : `<span class="face"><span>${esc(d.file)}</span></span>`;
  return `<button type="button" class="card doc" data-n="${n}">${face}<span class="t">${esc(d.title)}</span><span class="x">${esc(d.text)}</span></button>`;
}).join('');


/* the list on the left: every page, grouped by page type and round, newest round first; the thumbnails are copied from the cards by the script */
const rlabel = (it) => [STATUS[it.status], it.round].filter(Boolean).join(' · ');
const ri = ({ n, it }) => `<button type="button" class="ri" data-n="${n}" data-s="${it.status || ''}"><img alt=""><span class="rt">${esc(it.title)}<span class="rs">${esc(rlabel(it))}</span></span></button>`;
const flat = (list) => `<div class="rflat">${list.map(ri).join('')}</div>`;
const treeHtml = TREE.filter((t) => t.subs.length).map((t, ti) => {
  const count = t.subs.reduce((a, s) => a + s.items.length, 0);
  return `<details data-sec="${t.id}"${ti === 0 ? ' open' : ''}><summary>${t.title}<span>${count}</span></summary>${t.subs.map((s, si) => `<details${ti === 0 && si === 0 ? ' open' : ''}><summary>${esc(s.title)}<span>${s.items.length}</span></summary>${s.items.map(ri).join('')}</details>`).join('')}</details>`;
}).join('')
  + `<details><summary>Bilder<span>${ptree.length}</span></summary>${flat(ptree)}</details><details><summary>Dokumenter<span>${dtree.length}</span></summary>${flat(dtree)}</details>`;

const today = new Date().toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
const CSS = `
:root{--ink:#14161B;--mute:#5C616C;--rule:#DCDEE3;--bg:#fff;--gut:clamp(20px,3.6vw,56px)}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:400 14px/1.55 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif}
button{font:inherit;color:inherit}
a{color:inherit}
::selection{background:var(--ink);color:#fff}
:focus-visible{outline:1.5px solid #036194;outline-offset:3px}
[hidden]{display:none!important}
header.top{padding:clamp(24px,4vw,44px) var(--gut) 0}
h1{margin:0;font-family:inherit;font-weight:600;font-size:clamp(22px,2.2vw,30px);line-height:1.1;letter-spacing:-.025em}
.lede{margin:.5rem 0 0;max-width:62ch;color:var(--mute)}
.chips{display:flex;flex-wrap:wrap;gap:.3rem 1.3rem;margin:1.4rem 0 0;font-size:13px}
.chips a{color:var(--mute);text-decoration:none}.chips a:hover{color:var(--ink);text-decoration:underline;text-underline-offset:.35em}
.now{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px 36px;margin:clamp(28px,4vw,44px) var(--gut) 0;padding-top:16px;border-top:1px solid var(--ink)}
.now h2{margin:0 0 .35rem;font-family:inherit;font-weight:600;font-size:13px;line-height:1.3;letter-spacing:.01em}
.now p,.now li{margin:0;font-size:13.5px;color:var(--mute)}
.now ul{margin:0;padding:0;list-style:none}.now li{padding:.2rem 0;border-top:1px solid var(--rule)}.now li:first-child{border-top:0}
section{margin:clamp(34px,5vw,60px) var(--gut) 0}
section>h2,.ig h3{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;margin:0 0 18px;padding-top:12px;border-top:1px solid var(--rule);font-family:inherit;font-weight:600;font-size:18px;line-height:1.2;letter-spacing:-.012em}
section>h2 span,.ig h3 span{font-weight:400;font-size:12.5px;color:var(--mute);letter-spacing:0}
.sub{margin:0 0 clamp(28px,4vw,46px)}
.subh{display:flex;flex-wrap:wrap;align-items:baseline;gap:.2rem 1rem;margin:0 0 14px}
.subh h3{margin:0;font-family:inherit;font-weight:600;font-size:15px;line-height:1.3}
.subh p{margin:0;font-size:12.5px;color:var(--mute)}
.whole{margin-left:auto;background:none;border:0;padding:0;font-size:12.5px;color:var(--mute);text-decoration:underline;text-underline-offset:.3em;cursor:pointer}
.whole:hover{color:var(--ink)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:30px 22px}
.card{display:flex;flex-direction:column;align-items:flex-start;background:none;border:0;padding:0;text-align:left;cursor:pointer}
div.card{cursor:default}
.card img{display:block;width:100%;aspect-ratio:1440/900;object-fit:cover;object-position:top;border:1px solid var(--rule);transition:border-color .2s,transform .3s}
button.card:hover img{border-color:var(--ink)}
.card[data-s="valgt"] img{border-color:var(--ink);box-shadow:0 0 0 1px var(--ink)}
.card .t{margin-top:.65rem;font-size:14px;font-weight:500;letter-spacing:-.005em}
.card .x{margin-top:.12rem;font-size:12.5px;line-height:1.45;color:var(--mute)}
.card .s{margin-top:.4rem;font-size:12px;color:var(--mute)}
.card .s[data-s="valgt"]{color:var(--ink);font-weight:600}
.card .s[data-f="1"]{color:var(--ink)}
.card .s[data-s="avvist"]{text-decoration:line-through;text-decoration-color:#9AA0AB}
.card .face{display:grid;place-items:center;width:100%;aspect-ratio:1440/900;border:1px solid var(--rule);background:#F6F6F4;color:var(--mute);font-size:12.5px;text-align:center;padding:12px}
.card .face.logo{background:#fff;padding:18%}.card .face.logo img{border:0;aspect-ratio:auto;width:100%;height:auto;max-height:100%;object-fit:contain}
button.card.doc:hover .face{border-color:var(--ink)}
.thumbs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.thumbs img{display:block;width:100%;height:110px;object-fit:cover;border:1px solid var(--rule)}
.ig{margin:0 0 30px}
.ig h3{font-size:15px}
.files{margin:clamp(34px,5vw,60px) var(--gut) 0;padding:16px 0 40px;border-top:1px solid var(--rule);font-size:12.5px;color:var(--mute)}
.files p{margin:.2rem 0}.files b{color:var(--ink);font-weight:500}
#app{display:flex;height:100vh;overflow:hidden}
#main{flex:1;min-width:0;position:relative;overflow:auto}
#viewer{position:absolute;inset:0;display:flex;flex-direction:column;background:#14161B}
#vbar{flex:none;display:flex;align-items:center;gap:6px;height:42px;padding:0 12px;white-space:nowrap;position:relative;z-index:6;color:#EDEFF3;font:400 12.5px/1 "Hanken Grotesk",system-ui,sans-serif}
#vbar button{appearance:none;background:none;border:0;padding:7px 10px;border-radius:4px;color:#C9CED8;cursor:pointer}
#vbar button:hover:not(:disabled){color:#fff;background:#262B38}
#vbar button:disabled{opacity:.35;cursor:default}
#vbar .home{color:#fff;background:#2B3140}
#vbar .ttl{margin:0 4px 0 10px;font-weight:500;color:#fff;min-width:0;overflow:hidden;text-overflow:ellipsis}
#vbar .meta{margin-left:4px;color:#8A90A0}
#vbar .gap{flex:1}
#vbar .zl{margin:0 4px 0 0;color:#8A90A0}#vbar button.z{padding:7px 7px}#vbar button.z[aria-pressed=true]{color:#fff;background:#2B3140}
#frame{flex:1;border:0;width:100%;display:block;background:#fff}

#rail{flex:none;width:318px;display:flex;flex-direction:column;overflow:hidden;border-right:1px solid var(--rule);background:#FAFAF9}
.rhead{flex:none;display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding:14px 16px 12px;border-bottom:1px solid var(--rule)}
.rhead b{font-weight:600;font-size:15px;letter-spacing:-.012em}
.rhead button{background:none;border:0;padding:4px 0;font-size:12.5px;color:var(--mute);text-decoration:underline;text-underline-offset:.3em;cursor:pointer}.rhead button:hover{color:var(--ink)}
#tree{flex:1;overflow:auto;padding-bottom:40px}
#tree details{border-top:1px solid var(--rule)}#tree>details:first-child{border-top:0}
#tree summary{list-style:none;cursor:pointer;display:flex;align-items:baseline;justify-content:space-between;gap:10px;padding:10px 16px;font-weight:600;font-size:13.5px;line-height:1.3}
#tree summary::-webkit-details-marker{display:none}
#tree summary::before{content:"›";flex:none;width:.8em;color:var(--mute);transition:transform .15s}
#tree details[open]>summary::before{transform:rotate(90deg)}
#tree summary span{margin-left:auto;font-weight:400;font-size:12px;color:var(--mute)}
#tree details details{border-top:0}
#tree details details>summary{padding:7px 16px 7px 28px;font-weight:500;font-size:12.5px;color:#3B404B}
.ri{display:flex;gap:10px;align-items:center;width:100%;padding:5px 16px 5px 28px;background:none;border:0;text-align:left;cursor:pointer}
.ri:hover{background:#F0F0EE}.ri[aria-current]{background:#E6E8EC}
.ri img{flex:none;width:58px;height:36px;object-fit:cover;object-position:top;border:1px solid var(--rule);background:#fff}
.ri .rt{font-size:12.5px;line-height:1.28}.ri .rs{display:block;font-size:11.5px;color:var(--mute)}
.ri[data-s="valgt"] .rs{color:var(--ink);font-weight:600}.ri[data-s="avvist"] .rt{text-decoration:line-through;text-decoration-color:#9AA0AB}
.rflat .ri{padding-left:16px}
.tools{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;align-items:center;gap:6px 6px;margin:0;padding:10px var(--gut);background:rgba(255,255,255,.96);border-bottom:1px solid var(--rule);font-size:12.5px}
.tools .tl{margin:0 4px 0 0;color:var(--mute)}.tools .gap{flex:1}.tools .mobile-only{display:none}
.tools button{background:none;border:1px solid transparent;border-radius:4px;padding:5px 9px;color:var(--mute);cursor:pointer}
.tools button:hover{color:var(--ink)}.tools button[aria-pressed=true]{color:var(--ink);border-color:var(--ink)}
.tools button i{font-style:normal;margin-left:.35em;color:var(--mute)}
#home.dense .grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:20px 14px}
#home.dense .card .x,#home.dense .card .s{display:none}#home.dense .card .t{font-size:12.5px;margin-top:.45rem}
#vbar .vsp{position:relative}
#vpop{position:absolute;right:0;top:calc(100% + 8px);z-index:10;display:grid;gap:8px;min-width:250px;padding:12px;background:#1B1F29;border:1px solid #2B3140;border-radius:8px;box-shadow:0 8px 30px rgba(0,0,0,.35);white-space:normal}
#vpop .row{display:flex;flex-wrap:wrap;align-items:center;gap:4px}
#vbar .zl{width:64px}
#brail{display:none}
@media (max-width:900px){#rail{display:none}#brail{display:inline-block}.tools .mobile-only{display:inline-block}body.rail-open #rail{display:flex;position:fixed;inset:0 auto 0 0;z-index:30;width:min(340px,88vw);box-shadow:0 0 40px rgba(0,0,0,.35)}}
@media (max-width:820px){.now{grid-template-columns:1fr}}
`;

const html = `<!doctype html>
<html lang="nb"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – oversikt</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&display=swap">
<style>${CSS}</style></head><body>
<div id="app">
<aside id="rail" aria-label="Alle sider"><div class="rhead"><b>Analytika</b><button type="button" id="rhome">Oversikt</button></div><nav id="tree">${treeHtml}</nav></aside>
<div id="main">
<div id="home">
<header class="top"><h1>Analytika, oversikt over det vi har laget</h1>
<p class="lede">Listen til venstre har alt, gruppert etter sidetype og runde, nyeste øverst. Klikk en rute eller en linje for å åpne siden her i filen; lenkene inne i sidene virker. ${total} sider og skisser, pluss bilder, dokumenter og inspirasjon. Oppdatert ${today}.</p></header>
<div class="tools"><button type="button" id="brail2" class="mobile-only">☰ Alle sider</button><span class="tl">Vis</span>${[['alle', 'Alle'], ['valgt', 'Valgt'], ['alternativ', 'Alternativ'], ['tidligere', 'Tidligere'], ['avvist', 'Avvist']].map(([v, l]) => `<button type="button" class="flt" data-f="${v}" aria-pressed="${v === 'alle'}">${l}<i></i></button>`).join('')}<span class="gap"></span><span class="tl">Størrelse</span><button type="button" class="den" data-d="stor" aria-pressed="true">Stor</button><button type="button" class="den" data-d="tett" aria-pressed="false">Tett</button></div>
<div class="now">
<div><h2>Nå</h2><p>Siste runde (6): forsiden med ordet «Analytika» satt på seks måter, bygget med GSAP og transitions.dev. Bildet er kontoret fra ChatGPT, og utsnittet er valgt av utsnittsanalysen (1,2–1,4×).</p></div>
<div><h2>Valgt tidligere</h2><ul><li>Forsiden med rommet: bildet over hele skjermen, scroll tones til hvitt, fire grå rader, de fem tavlene som områder</li></ul></div>
<div><h2>Åpent</h2><ul><li>Hvordan «Analytika» skal stå (A–F)</li><li>Bildet: kontoret eller rommet, og om ekte foto kommer</li><li>People, Insights, Products og About us er ikke tegnet i ny stil</li></ul></div>
</div>
${sectionHtml}
<section id="bilder"><h2>Bilder<span>${PHOTOS.length} bilder</span></h2><div class="grid">${photoCards}</div></section>
<section id="dokumenter"><h2>Dokumenter<span>${DOCS.length} filer</span></h2><div class="grid">${docCards}</div></section>
<section id="inspirasjon"><h2>Inspirasjon<span>fra mappen inspiration/</span></h2>${inspo}</section>
<div class="files"><p><b>Denne siden</b> analytika/oversikt.html, bygget av tools/oversikt.mjs. Den er hele porteføljen i én fil.</p><p><b>Bilder</b> analytika/assets/photo/ og analytika/inspiration/</p><p><b>Designkontekst</b> analytika/PRODUCT.md</p></div>
</div>
<div id="viewer" hidden><div id="vbar"><button type="button" id="brail" title="Vis listen over sider">☰</button><button type="button" class="home" id="bhome">← Oversikt</button><span class="ttl" id="vttl"></span><span class="meta" id="vmeta"></span><span class="gap"></span><span id="rb" hidden><button type="button" class="rp" id="brp" title="Spill av åpningen på nytt">↻ Spill av</button></span><span class="vsp" id="vo" hidden><button type="button" id="bvo" aria-expanded="false" aria-controls="vpop">Visning ▾</button><div id="vpop" hidden><div class="row" id="zb" hidden><span class="zl">Zoom</span>${[['own', 'Sidens egen'], ['1.0', '1,0×'], ['1.2', '1,2×'], ['1.4', '1,4×'], ['1.6', '1,6×'], ['1.8', '1,8×']].map(([v, l]) => `<button type="button" class="z" data-z="${v}" aria-pressed="${v === 'own'}">${l}</button>`).join('')}</div><div class="row" id="bb" hidden><span class="zl">Uskarphet</span>${[['ingen', 'Ingen'], ['lett', 'Lett'], ['middels', 'Middels'], ['sterk', 'Sterk']].map(([v, l]) => `<button type="button" class="z bl" data-b="${v}" aria-pressed="${v === 'middels'}">${l}</button>`).join('')}</div></div></span><button type="button" id="bprev" title="Forrige (←)">‹</button><button type="button" id="bnext" title="Neste (→)">›</button></div><iframe id="frame" title="Side"></iframe></div>
</div></div>
<script>
var pages=${JSON.stringify(pages).replace(/<\//g, '<\\/')},alias=${JSON.stringify(alias)},P=${JSON.stringify(photoFull)},order=${JSON.stringify(order)};
var home=document.getElementById('home'),viewer=document.getElementById('viewer'),frame=document.getElementById('frame'),stack=[],homeY=0,pos=-1;
function stand(n){return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{height:100%;margin:0}body{display:grid;place-items:center;background:#F3F3F1;color:#14161B;font:15px/1.5 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}div{text-align:center;padding:24px}b{display:block;font-size:20px;font-weight:500;margin-bottom:.4rem}p{margin:0 0 1.4rem;color:#5C6270}button{font:inherit;padding:.55rem 1.1rem;border:1px solid #BFC4CE;border-radius:4px;background:#fff;cursor:pointer}button:hover{border-color:#14161B}</style></head><body><div><b>'+n.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</b><p>Not designed in this sketch yet.</p><button type="button" onclick="parent.postMessage({back:1},\\'*\\')">Back</button></div></body></html>';}
var D=${JSON.stringify(docMap).replace(/<\//g, '<\\/')};
function docPage(n){var d=D[n];if(!d)return stand(n);if(d.kind==='svg')return '<!doctype html><html><body style="margin:0;height:100vh;display:grid;place-items:center;background:#fff"><img src="'+d.content+'" style="width:min(70vw,900px);height:auto"></body></html>';var t=d.content.replace(/&/g,'&amp;').replace(/</g,'&lt;');return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#FAFAF8;color:#14161B;font:15px/1.6 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}main{max-width:84ch;margin:0 auto;padding:32px 24px 80px}pre{margin:0;white-space:pre-wrap;word-wrap:break-word;font:inherit}</style></head><body><main><pre>'+t+'</pre></main></body></html>';}
function photoPage(n){return '<!doctype html><html><body style="margin:0;height:100vh;display:grid;place-items:center;background:#111"><img src="'+(P[n]||'')+'" style="max-width:100%;max-height:100vh;display:block"></body></html>';}
function src(f){if(f.indexOf('ph:')===0)return stand(f.slice(3));if(f.indexOf('photo:')===0)return photoPage(f.slice(6));if(f.indexOf('doc:')===0)return docPage(f.slice(4));f=alias[f]||f;var s=pages[f];return s?s.replace(/__PH:([A-Za-z0-9_.-]+)__/g,function(m,n){return P[n]||'';}):stand(f);}
var tok=0,zoomV=null,blurV=null;function sendZoom(){if(zoomV)try{frame.contentWindow.postMessage({zoom:zoomV},'*');}catch(e){}if(blurV)try{frame.contentWindow.postMessage({blur:blurV},'*');}catch(e){}}
function press(sel,attr,v){[].forEach.call(document.querySelectorAll(sel),function(x){x.setAttribute('aria-pressed',x.dataset[attr]===v?'true':'false');});}
function load(k,sc){var f=k,h='';if(k.indexOf('ph:')!==0&&k.indexOf('#')>0){f=k.slice(0,k.indexOf('#'));h=k.slice(k.indexOf('#')+1);}
  var t=++tok;
  frame.onload=function(){if(t!==tok)return;sendZoom();try{var d=frame.contentDocument;if(sc){var e=d.querySelectorAll(sc.sel)[sc.i];if(e)e.scrollIntoView();return;}if(!h)return;frame.contentWindow.postMessage({open:h},'*');var el=d.getElementById(h);if(el)el.scrollIntoView();}catch(x){}};
  frame.srcdoc=src(f).replace('<head>','<head><meta name="ov-token" content="'+t+'">');
  if(sc){var tries=0;(function poll(){if(t!==tok)return;try{var d=frame.contentDocument,m=d&&d.querySelector('meta[name="ov-token"]');if(m&&m.content===String(t)){var e=d.querySelectorAll(sc.sel)[sc.i];if(e){e.scrollIntoView();return;}}}catch(x){}if(tries++<120)setTimeout(poll,40);})();}}
function peers(o){return order.filter(function(x){return x.sec===o.sec&&x.nav;});}
var main=document.getElementById('main'),rail=document.getElementById('rail'),vpop=document.getElementById('vpop'),bvo=document.getElementById('bvo');
function closePop(){vpop.hidden=true;bvo.setAttribute('aria-expanded','false');}
/* the left list: the open page is marked, its groups are opened, and the row is scrolled into view */
function mark(n){[].forEach.call(rail.querySelectorAll('.ri[aria-current]'),function(x){x.removeAttribute('aria-current');});
  if(n==null)return;var r=rail.querySelector('.ri[data-n="'+n+'"]');if(!r)return;r.setAttribute('aria-current','true');
  for(var p=r.parentNode;p&&p!==rail;p=p.parentNode)if(p.tagName==='DETAILS')p.open=true;
  r.scrollIntoView({block:'nearest'});}
function bar(){var o=order[pos];if(!o)return;
  document.getElementById('zb').hidden=!o.z;document.getElementById('bb').hidden=!o.b;document.getElementById('rb').hidden=!o.p;document.getElementById('vo').hidden=!(o.z||o.b);closePop();
  document.getElementById('vttl').textContent=o.t;document.getElementById('vmeta').textContent=[o.r,o.s].filter(Boolean).join(' · ');
  var same=peers(o),i=same.indexOf(o);document.getElementById('bprev').disabled=!o.nav||i<=0;document.getElementById('bnext').disabled=!o.nav||i>=same.length-1;mark(pos);}
function openAt(i){pos=i;zoomV=null;blurV=null;press('#vbar button.z:not(.bl)','z','own');press('#vbar button.bl','b','middels');stack=[order[i].k];load(order[i].k,order[i].sc);bar();}
function openN(n){if(viewer.hidden){homeY=main.scrollTop;home.hidden=true;viewer.hidden=false;}openAt(n);}
function step(d){var o=order[pos],same=peers(o),j=same.indexOf(o)+d;if(j>=0&&j<same.length)openAt(order.indexOf(same[j]));}
function back(){viewer.hidden=true;home.hidden=false;frame.srcdoc='';main.scrollTop=homeY;mark(null);document.body.classList.remove('rail-open');}
[].forEach.call(document.querySelectorAll('button.card,button.whole'),function(b){b.addEventListener('click',function(){openN(+b.dataset.n);});});
[].forEach.call(rail.querySelectorAll('.ri'),function(r){var c=document.querySelector('#home button.card[data-n="'+r.dataset.n+'"] img'),im=r.querySelector('img');if(c)im.src=c.src;else im.remove();
  r.addEventListener('click',function(){openN(+r.dataset.n);document.body.classList.remove('rail-open');});});
document.getElementById('bhome').addEventListener('click',back);
document.getElementById('rhome').addEventListener('click',function(){if(!viewer.hidden)back();else main.scrollTop=0;document.body.classList.remove('rail-open');});
[].forEach.call(document.querySelectorAll('#brail,#brail2'),function(b){b.addEventListener('click',function(){document.body.classList.toggle('rail-open');});});
bvo.addEventListener('click',function(e){e.stopPropagation();var open=vpop.hidden;vpop.hidden=!open;bvo.setAttribute('aria-expanded',open?'true':'false');});
document.addEventListener('click',function(e){if(!vpop.hidden&&!vpop.contains(e.target))closePop();});
[].forEach.call(document.querySelectorAll('#vbar button.z:not(.bl)'),function(b){b.addEventListener('click',function(){zoomV=b.dataset.z;press('#vbar button.z:not(.bl)','z',zoomV);sendZoom();});});
[].forEach.call(document.querySelectorAll('#vbar button.bl'),function(b){b.addEventListener('click',function(){blurV=b.dataset.b;press('#vbar button.bl','b',blurV);sendZoom();});});
document.getElementById('brp').addEventListener('click',function(){try{frame.contentWindow.postMessage({replay:1},'*');}catch(e){}});
document.getElementById('bprev').addEventListener('click',function(){step(-1);});
document.getElementById('bnext').addEventListener('click',function(){step(1);});
/* the filter and the size of the cards, on the overview and in the list */
function applyFilter(f){
  [].forEach.call(home.querySelectorAll('.card'),function(c){c.hidden=f!=='alle'&&c.dataset.s!==f;});
  [].forEach.call(home.querySelectorAll('.sub'),function(s){s.hidden=f!=='alle'&&!s.querySelector('.card:not([hidden])');});
  [].forEach.call(home.querySelectorAll('section'),function(s){s.hidden=f!=='alle'&&!s.querySelector('.card:not([hidden])');});
  [].forEach.call(rail.querySelectorAll('.ri'),function(r){r.hidden=f!=='alle'&&r.dataset.s!==f;});
  [].slice.call(rail.querySelectorAll('details')).reverse().forEach(function(d){d.hidden=f!=='alle'&&!d.querySelector('.ri:not([hidden])');});
  press('.tools .flt','f',f);}
[].forEach.call(document.querySelectorAll('.tools .flt'),function(b){var n=b.dataset.f==='alle'?home.querySelectorAll('.card[data-s]').length:home.querySelectorAll('.card[data-s="'+b.dataset.f+'"]').length;b.querySelector('i').textContent=n;b.addEventListener('click',function(){applyFilter(b.dataset.f);});});
[].forEach.call(document.querySelectorAll('.tools .den'),function(b){b.addEventListener('click',function(){home.classList.toggle('dense',b.dataset.d==='tett');press('.tools .den','d',b.dataset.d);});});
window.addEventListener('keydown',function(e){if(viewer.hidden)return;if(e.key==='Escape'){if(!vpop.hidden)closePop();else back();}else if(e.key==='ArrowLeft')step(-1);else if(e.key==='ArrowRight')step(1);});
window.addEventListener('message',function(e){if(!e.data)return;if(e.data.go){stack.push(e.data.go);load(e.data.go);}if(e.data.back){if(stack.length>1){stack.pop();load(stack[stack.length-1]);}else back();}});
</script></body></html>`;

writeFileSync(new URL('oversikt.html', root), html);
console.log('wrote oversikt.html', (html.length / 1e6).toFixed(1) + ' MB,', Object.keys(pages).length, 'pages,', order.length, 'openable cards');
