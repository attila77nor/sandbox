/* Round 12: a redo, for Analytika, of https://www.arttechreport.com/ (the ART+TECH Report 2023, a Webflow report page by MoreSleep for Superteam Germany).
   What the reference is, measured at 1440 x 900: a field of saturated blue (47,35,242) with a "bento" of thin-outlined rounded panels, three chips in the
   middle that are the title (bold condensed / serif pill / bold condensed), a fixed bar with the same chips small, a pill button and a menu button; then an
   introduction in a panel, a sociodemographic block of panels, a methodology panel, and, on white, "key findings": a heading, nine numbered cards, and nine
   chapters in turn (a grey rounded panel with a chart, a coloured number tag in front of a bold condensed heading, a sub-heading, a small text), a large
   serif quotation between them; a download block with two big blue buttons and a black footer of panels with a credits table. Type: Instrument Sans with a
   width axis (condensed 75), Instrument Serif, Space Mono, DM Sans (ours: Archivo with its width axis, Cormorant Garamond, Space Mono, Hanken Grotesk;
   the detector flags Instrument Sans as overused too). Scroll: Lenis and Webflow interactions.
   What is ours: our blue a notch deeper (#1678AB, so that white small text reads: 4.9:1) as the field, marine, deep blue and light blues as the five chapter colours; the three title chips are the words we
   always use ("Consulting", "Business", "Development"); the nine findings are the five areas (one chapter each, with the drafts of their one-line
   descriptions from the earlier rounds); the survey charts are replaced by mathematical figures that claim nothing (a run-off triangle, a loss distribution
   with its quantiles, a data flow, a plan, a dot grid) and are marked as illustrations; the quotations are the five theses of the About sketch; the
   download block is "Join us" and "Meet the people", the credits are the contact details. Serif: Cormorant Garamond (Instrument Serif is flagged by
   Impeccable's detector). No Lenis: the scroll is the browser's own.
   Following the Modern Web Guidance guides: scroll-entry-exit-effects (view() timelines under @supports with a reduced-motion guard and an
   IntersectionObserver fallback), scroll-progress-indicator (scroll() timeline, scroll listener fallback), dialog (the menu is a modal dialog opened with an
   invoker command, closedby any, scroll contained), improve-text-layout-and-legibility (balance on headings, pretty on text).
   One file: fonts and logo embedded. */
import { readFileSync } from 'node:fs';
import { write, logoDefs } from './explore-shared.mjs';

const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('../assets/vendor/fonts/' + f, import.meta.url)).toString('base64');
const IDS = ['actuary', 'pricing', 'data-platforms', 'consulting', 'business-development'];
const NAMES = ['Actuary', 'Pricing', 'Data platforms', 'Consulting', 'Business development'];

/* ---------------------------------------------------------------- the bento of the hero: rectangles of the reference (x0 y0 x1 y1, radius) in its 1440 x 900 frame */
const HERO = [
  [30, 74, 548, 231, '30px'], [30, 238, 133, 893, '14px'], [140, 238, 548, 893, '190px 190px 14px 14px'],
  [554, 74, 1061, 168, '47px'], [1068, 74, 1410, 168, '14px'], [554, 175, 890, 466, '14px 14px 14px 190px'],
  [897, 175, 1410, 466, '190px 14px 14px 14px'], [554, 473, 1410, 893, '24px'],
];
const pct = (v, o, s) => ((v - o) / s * 100).toFixed(3) + '%';
const heroCells = HERO.map(([x0, y0, x1, y1, r], i) => `<i class="cell" style="left:${pct(x0, 30, 1380)};top:${pct(y0, 74, 819)};width:${((x1 - x0) / 1380 * 100).toFixed(3)}%;height:${((y1 - y0) / 819 * 100).toFixed(3)}%;border-radius:${r};--d:${(0.18 + i * 0.07).toFixed(2)}s"></i>`).join('');

/* ---------------------------------------------------------------- the five chapters */
const COLS = [
  { a: '#8FD0F3', t: '#14213D', dk: '#1B92D0' }, // actuary: light blue
  { a: '#1B92D0', t: '#0A1F3A', dk: '#036194' }, // pricing: our blue
  { a: '#B9C4DE', t: '#14213D', dk: '#4D5E8C' }, // data platforms: grey-blue
  { a: '#036194', t: '#FFFFFF', dk: '#024A72' }, // consulting: deep blue
  { a: '#1E3363', t: '#FFFFFF', dk: '#14213D' }, // business development: marine
];
const SUBS = ['Reserving, risk and compliance.', 'Advanced tariffs and pricing models.', 'Warehouses, pipelines and analytics.', 'Programs, projects and delivery.', 'New ideas, funded and built.'];
const BODY = [
  'Four fields: risk actuary, compliance, reserving, and life and pension. Building and reviewing the models that decide how much capital an insurer has to hold, making the Solvency II framework work from day to day, and an independent view on whether the reserves are sufficient.',
  'Tariff development and analytics for insurers: the rating factors, the models behind them, and what a change in them does to the portfolio.',
  'Data warehouses and machine learning: the platforms that claims, policy and portfolio data run on, and the models that sit on top of them.',
  'Business consulting and project management: from the first plan to the delivery, for the insurer’s own programs.',
  'Analytika Ventures builds products from ideas that start inside the firm, and funds them: Indie, N Models, Triangles and AI.',
];
const QUOTES = ['Smart people do their best work when they are trusted.', 'Plain words beat clever ones.', 'We would rather build it than describe it.', 'A good idea deserves backing, not a meeting.', 'It is allowed to be fun.'];

/* the five figures; no data, nothing is claimed, each says that it is an illustration */
const f1 = () => { // a run-off (development) triangle
  let s = '';
  for (let r = 0; r < 7; r++) for (let c = 0; c < 7 - r; c++) {
    const k = (r + c) / 6, i = r + c;
    s += `<rect class="g" style="--i:${i}" x="${14 + c * 56}" y="${14 + r * 56}" width="50" height="50" rx="11" fill="currentColor" fill-opacity="${(0.22 + 0.78 * (1 - k)).toFixed(2)}"/>`;
  }
  return `<svg viewBox="0 0 400 400" role="img" aria-label="A run-off triangle, drawn as a grid of rounded cells. An illustration.">${s}</svg>`;
};
const f2 = () => { // a loss distribution and its quantiles
  const pdf = (x) => Math.exp(-0.5 * x * x), X = (z) => 200 + z * 78, Y = (z) => 250 - pdf(z) * 190;
  let d = `M ${X(-2.6)} 250`;
  for (let z = -2.6; z <= 2.61; z += 0.1) d += ` L ${X(z).toFixed(1)} ${Y(z).toFixed(1)}`;
  const area = d + ` L ${X(2.6)} 250 Z`;
  const qs = [-1.64, -1.28, -0.84, -0.52, -0.25, 0, 0.25, 0.52, 0.84, 1.28, 1.64];
  const lines = qs.map((z, i) => `<line class="g" style="--i:${i}" x1="${X(z).toFixed(1)}" x2="${X(z).toFixed(1)}" y1="250" y2="${Y(z).toFixed(1)}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>`).join('');
  return `<svg viewBox="0 0 400 300" role="img" aria-label="A bell-shaped loss distribution with vertical lines at its quantiles. An illustration."><path d="${area}" fill="currentColor" fill-opacity=".14"/><path class="draw" d="${d}" fill="none" stroke="currentColor" stroke-width="2.4" pathLength="1"/>${lines}<path d="M 20 250 H 380" stroke="currentColor" stroke-opacity=".35" stroke-width="1.5"/></svg>`;
};
const f3 = () => { // a data flow: sources, a platform, uses
  const L = ['CLAIMS', 'POLICIES', 'PORTFOLIO', 'MARKET'], R = ['PRICING', 'RESERVING', 'REPORTING', 'MODELS'];
  const y = (i) => 46 + i * 84;
  let s = '';
  for (let i = 0; i < 4; i++) for (const j of [i, (i + 1) % 4]) s += `<path class="draw" style="--i:${i + j}" d="M 150 ${y(i)} C 235 ${y(i)}, 235 ${y(j)}, 320 ${y(j)}" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1.6" pathLength="1"/>`;
  const pill = (x, i, t) => `<g class="g" style="--i:${i}"><rect x="${x}" y="${y(i) - 17}" width="118" height="34" rx="17" fill="currentColor" fill-opacity=".2" stroke="currentColor" stroke-width="1.4"/><text x="${x + 59}" y="${y(i) + 4}" text-anchor="middle" font-family="Space Mono, monospace" font-size="12" fill="currentColor" letter-spacing=".04em">${t}</text></g>`;
  return `<svg viewBox="0 0 470 340" role="img" aria-label="Four sources joined by curved lines to four uses. An illustration.">${s}${L.map((t, i) => pill(32, i, t)).join('')}${R.map((t, i) => pill(320, i, t)).join('')}</svg>`;
};
const f4 = () => { // a plan: bars on a time axis
  const rows = [['SCOPE', 0, 90], ['PLAN', 60, 130], ['DELIVER', 150, 190], ['HAND OVER', 290, 90]];
  let s = '';
  rows.forEach(([t, x, w], i) => { const y = 36 + i * 70; s += `<text x="10" y="${y - 10}" font-family="Space Mono, monospace" font-size="12" fill="currentColor" letter-spacing=".04em">${t}</text><rect class="bar" style="--i:${i}" x="${10 + x}" y="${y}" width="${w}" height="34" rx="17" fill="currentColor" fill-opacity="${(0.32 + i * 0.2).toFixed(2)}"/>`; });
  return `<svg viewBox="0 0 400 320" role="img" aria-label="Four horizontal bars of a project plan. An illustration.">${s}<path d="M 10 312 H 390" stroke="currentColor" stroke-opacity=".35" stroke-width="1.5"/></svg>`;
};
const f5 = () => { // a grid of dots, one column filling from the bottom
  let s = '';
  for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) {
    const on = c === 2, i = 5 - r;
    s += `<circle ${on ? `class="g on" style="--i:${i}"` : ''} cx="${46 + c * 74}" cy="${44 + r * 64}" r="${on ? 24 : 20}" fill="currentColor" fill-opacity="${on ? 1 : 0.16}"/>`;
  }
  return `<svg viewBox="0 0 400 380" role="img" aria-label="A grid of dots in which one column fills from the bottom. An illustration.">${s}</svg>`;
};
const FIGS = [f1, f2, f3, f4, f5];
const CAPS = ['Run-off triangle', 'Loss distribution and its quantiles', 'From data to use', 'A plan in four phases', 'From idea to funded'];

const chapter = (i) => {
  const c = COLS[i];
  const rev = i % 2 === 1;
  return `<section class="ch" id="${IDS[i]}" data-nav="light" style="--a:${c.a};--at:${c.t};--dk:${c.dk}">
<div class="ch-main${rev ? ' rev' : ''}">
<div class="viz rv" role="group" aria-label="${CAPS[i]}"><span class="mono cap">${CAPS[i]}</span>${FIGS[i]()}<span class="mono ill">Illustration</span></div>
<div class="txt"><h2 class="cond"><span class="tag" aria-hidden="true">0${i + 1}</span><span class="sr">${i + 1}. </span>${NAMES[i]}</h2><h3 class="cond rv">${SUBS[i]}</h3><p class="rv">${BODY[i]}</p></div>
</div>
<blockquote class="q rv"><span class="mono">[ 0${i + 1} ]</span><p>${QUOTES[i]}</p></blockquote>
</section>`;
};

const cards = NAMES.map((n, i) => `<a class="card rv" href="#${IDS[i]}" style="--a:${COLS[i].a}"><span class="n">0${i + 1}</span><span class="mono">${n}</span><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`).join('');

/* 21 dots in six rows: the people, as in the triangle sketch */
const people = (() => { let s = ''; let k = 0; for (let r = 0; r < 6; r++) for (let c = 0; c <= r; c++) { s += `<circle class="g" style="--i:${k++}" cx="${200 + (c - r / 2) * 44}" cy="${28 + r * 42}" r="11" fill="currentColor"/>`; } return `<svg viewBox="0 0 400 270" role="img" aria-label="Twenty-one dots in six rows, one for each person.">${s}</svg>`; })();

const css = `
@font-face{font-family:"Archivo";src:url(${FONT('archivo-variable-latin-wdth-normal.woff2')}) format("woff2");font-weight:100 900;font-stretch:62% 125%;font-style:normal;font-display:block}
@font-face{font-family:"Space Mono";src:url(${FONT('space-mono-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:"Cormorant Garamond";src:url(${FONT('cormorant-garamond-latin-500-normal.woff2')}) format("woff2");font-weight:500;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-400-normal.woff2')}) format("woff2");font-weight:400;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-600-normal.woff2')}) format("woff2");font-weight:600;font-style:normal;font-display:block}
:root{--blue:#1678AB;--marine:#1E3363;--ink:#14213D;--soft:#5F6B80;--panel:#F1F4F8;--line:rgba(255,255,255,.3);--g:30px;--ease:cubic-bezier(.22,1,.36,1)}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
@media (prefers-reduced-motion:no-preference){html{scroll-behavior:smooth}}
body{margin:0;background:#fff;color:var(--ink);font:400 16px/1.55 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
:focus-visible{outline:2px solid currentColor;outline-offset:3px}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.cond{font-family:"Archivo","Arial Narrow",sans-serif;font-stretch:68%;font-weight:700;text-transform:uppercase;letter-spacing:-.005em;margin:0;text-wrap:balance}
.mono{font-family:"Space Mono",ui-monospace,monospace;font-size:12px;line-height:1.35;letter-spacing:.04em;text-transform:uppercase}
.serif{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500}
/* scroll progress (the guide: a scroll() timeline, a scroll listener where it is missing) */
#progress{position:fixed;z-index:60;left:0;top:0;width:100%;height:3px;background:#0B1B3A;transform:scaleX(0);transform-origin:0 50%;pointer-events:none}
@media (prefers-reduced-motion:no-preference){@supports (animation-timeline:scroll()){@keyframes grow-progress{from{transform:scaleX(0)}to{transform:scaleX(1)}}#progress{animation:grow-progress auto linear;animation-timeline:scroll()}}}
/* the bar */
.nav{position:fixed;z-index:50;top:20px;left:var(--g);right:var(--g);height:40px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;color:#fff;--chip:rgba(255,255,255,.1);transition:color .25s ease-out}
.nav.light{color:var(--ink);--chip:rgba(20,33,61,.08)}
.nav .logo{display:block;width:34px;aspect-ratio:1.07;--lg-ink:currentColor;--lg-blue:currentColor;--lg-deep:currentColor;--lg-word:currentColor}
.nav .logo svg{display:block;width:100%;height:100%}
.nav .chips{display:flex;gap:2px;height:40px;align-items:center}
.nav .chips span{display:grid;place-items:center;height:38px;padding:0 12px;border-radius:5px;background:var(--chip);font-size:19px;line-height:1;transition:background-color .25s ease-out}
.nav .chips .mid{border-radius:999px;height:40px;font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:24px;letter-spacing:0;padding:0 14px}
.nav .right{display:flex;justify-content:flex-end;gap:2px}
.nav .pill,.nav .menu-btn{display:grid;place-items:center;height:40px;background:var(--chip);transition:background-color .25s ease-out,transform .15s ease-out}
.nav .pill{padding:0 20px;border-radius:999px;font-size:19px}
.nav .menu-btn{width:58px;border-radius:5px}
.nav .pill:hover,.nav .menu-btn:hover{filter:brightness(.94)}.nav .pill:active,.nav .menu-btn:active{transform:scale(.97)}
.nav .menu-btn svg{width:18px;height:18px}
/* the blue block */
.blue{position:relative;background:var(--blue);color:#fff}
.hero{position:relative;height:100vh;height:100svh;min-height:640px;overflow:hidden}
.bento{position:absolute;left:var(--g);right:var(--g);top:74px;bottom:7px}
.cell{position:absolute;display:block;border:1px solid var(--line)}
.hero .cell{animation:fade .9s var(--ease) both;animation-delay:var(--d)}
@keyframes fade{from{opacity:0;scale:.985}}
.title{position:absolute;left:50%;top:50%;translate:-50% -50%;display:flex;gap:5px;white-space:nowrap}
.title h1{display:contents;margin:0;font-size:54px}
@media (max-width:1280px){.title h1{font-size:46px}}
@media (max-width:1000px){.title h1{font-size:38px}}
@media (max-width:600px){.title h1{font-size:32px}}
.title span{display:grid;place-items:center;height:1.37em;padding:0 .46em;border-radius:8px;background:rgba(255,255,255,.16);font-size:inherit;line-height:1;animation:rise .9s var(--ease) both}
.title span:nth-child(2){border-radius:999px;font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-stretch:100%;letter-spacing:0;animation-delay:.12s;padding:0 .68em}
.title span:nth-child(3){animation-delay:.24s}
@keyframes rise{from{opacity:0;translate:0 26px}}
.lab{position:absolute;top:50%;translate:0 -50%;color:#fff}
.lab.l{left:var(--g)}.lab.r{right:var(--g)}
.intro,.people,.method{padding:0 var(--g)}
.intro{padding-top:90px}
.grid-i{display:grid;grid-template-columns:repeat(12,1fr);grid-template-rows:186px 100px minmax(380px,auto);gap:6px;grid-template-areas:"a a a a a a a b b b b b" "l l l l t t t t t t t t" "p p q q t t t t t t t t"}
.grid-i>*{border:1px solid var(--line);border-radius:14px}
.grid-i .a{grid-area:a;border-radius:90px}.grid-i .b{grid-area:b}.grid-i .gp{grid-area:p}.grid-i .gq{grid-area:q;border-radius:150px 150px 14px 14px}
.grid-i .l{grid-area:l;display:grid;place-items:center}
.grid-i .t{grid-area:t;padding:40px}
.grid-i .t p{margin:0 0 1.3em;font-size:clamp(19px,1.67vw,24px);line-height:1.32;max-width:36em;text-wrap:pretty}
.grid-i .t p:last-child{margin:0}
.people{padding-top:clamp(70px,9vw,130px);padding-bottom:6px}
.people h2{font-size:clamp(48px,5.6vw,80px);line-height:.92;color:#fff;margin:0 0 clamp(22px,3vw,44px)}
.grid-p{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,minmax(220px,auto));gap:6px}
.pn{position:relative;border-radius:26px;background:rgba(255,255,255,.04);border:1px solid var(--line);padding:28px;display:flex;flex-direction:column;gap:14px}
.pn .mono{opacity:.95}
.pn.big{grid-column:1/3;grid-row:1/3;align-items:center;justify-content:space-between}
.pn.big svg{width:min(100%,420px);color:#fff}
.pn .num{font-size:clamp(72px,9vw,128px);line-height:.85;color:#fff}
.pn .chips2{display:flex;flex-wrap:wrap;gap:6px}
.pn .chips2 span{padding:6px 12px;border-radius:999px;background:rgba(0,28,64,.3);font-size:14px}
.pn p{margin:0;font-size:clamp(18px,1.7vw,24px);line-height:1.3}
.method{padding-top:6px;padding-bottom:clamp(60px,8vw,120px)}
.grid-m{display:grid;grid-template-columns:repeat(12,1fr);gap:6px}
.grid-m .lbl{grid-column:1/13;display:grid;place-items:center;height:64px;border:1px solid var(--line);border-radius:14px}
.grid-m .wp{grid-column:1/13;background:#fff;color:var(--ink);border-radius:26px;padding:44px;display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(20px,3vw,48px)}
.grid-m h3{margin:0 0 10px;font-size:13px;color:var(--soft)}
.grid-m p{margin:0 0 .9em;font-size:15px;line-height:1.55;text-wrap:pretty}
/* white */
.white{background:#fff}
.kf{padding:clamp(80px,11vw,160px) var(--g) 0;text-align:center}
.kf h2{font-size:clamp(56px,8vw,112px);line-height:.9;color:var(--ink)}
.kf .mono{display:block;margin:20px auto 0;max-width:38em;color:var(--soft);text-wrap:balance}
.cards{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-top:clamp(36px,5vw,70px);text-align:left}
.card{grid-column:span 2;position:relative;min-height:clamp(150px,16vw,236px);border-radius:26px;background:var(--panel);padding:clamp(16px,1.8vw,26px);display:flex;flex-direction:column;justify-content:space-between;transition:background-color .2s ease-out,transform .25s var(--ease)}
.card:nth-child(n+4){grid-column:span 3}
.card .n{font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:clamp(34px,3.2vw,46px);line-height:1}
.card .mono{display:block}
.card svg{position:absolute;right:20px;top:22px;width:18px;height:18px;opacity:.5;transition:translate .25s var(--ease),opacity .2s ease-out}
.card:hover{background:color-mix(in srgb,var(--a) 30%,#fff);transform:translateY(-3px)}
.card:hover svg{translate:4px 0;opacity:1}
.ch{padding:clamp(70px,10vw,150px) var(--g) 0}
.ch-main{display:grid;grid-template-columns:minmax(0,41fr) minmax(0,59fr);gap:clamp(24px,5vw,100px);align-items:start}
.ch-main.rev{grid-template-columns:minmax(0,59fr) minmax(0,41fr)}
.ch-main.rev .viz{order:2}
.viz{position:relative;aspect-ratio:590/605;border-radius:26px;background:var(--panel);color:var(--dk);display:grid;place-items:center;padding:64px 48px}
.viz svg{width:100%;height:auto;max-height:100%;overflow:visible}
.viz .cap{position:absolute;left:0;right:0;top:clamp(20px,2.4vw,34px);text-align:center;color:var(--ink);padding:0 20px}
.viz .ill{position:absolute;left:0;right:0;bottom:clamp(18px,2vw,28px);text-align:center;color:var(--soft)}
.txt{padding-top:clamp(0px,1vw,12px)}
.txt h2{font-size:clamp(46px,5.3vw,76px);line-height:.92}
.tag{display:inline-grid;place-items:center;vertical-align:top;width:3.95em;height:2.2em;margin:0 .3em 0 0;background:var(--a);color:var(--at);font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-stretch:100%;font-size:.37em;letter-spacing:0;border-radius:3px;position:relative;top:.06em}
.txt h3{font-size:clamp(20px,1.8vw,26px);line-height:1.02;margin:clamp(36px,5.6vw,92px) 0 clamp(20px,2.4vw,34px) clamp(0px,10vw,144px);max-width:11em}
.txt p{margin:0 0 0 clamp(0px,10vw,144px);max-width:27em;font-size:15px;line-height:1.6;color:var(--soft);text-wrap:pretty}
.q{margin:clamp(70px,9vw,130px) auto 0;max-width:820px;text-align:center}
.q .mono{display:block;color:var(--soft)}
.q p{margin:16px 0 0;font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:clamp(26px,2.5vw,36px);line-height:1.32;text-wrap:balance}
.q p::before{content:"\\201C\\00a0"}.q p::after{content:"\\00a0\\201D"}
.join{padding:clamp(100px,13vw,200px) var(--g) clamp(80px,9vw,140px);display:flex;justify-content:center;gap:6px;flex-wrap:wrap}
.join a{display:grid;place-items:center;height:clamp(86px,9vw,130px);padding:0 clamp(32px,5vw,80px);background:var(--blue);color:#fff;font-size:clamp(34px,4vw,56px);line-height:1;transition:filter .2s ease-out,transform .25s var(--ease)}
.join a:first-child{border-radius:999px 14px 14px 999px}.join a:last-child{border-radius:14px 999px 999px 14px}
.join a:hover{filter:brightness(.92)}.join a:active{transform:scale(.985)}
/* black */
.foot{position:relative;background:#171717;color:#fff;border-radius:26px 26px 0 0;padding:30px var(--g) 36px;margin-top:0}
.foot .grid-f{display:grid;grid-template-columns:366fr 1008fr;gap:6px;grid-template-rows:100px minmax(360px,auto)}
.foot .grid-f>*{border:1px solid rgba(255,255,255,.2);border-radius:14px}
.foot .tile{display:flex;align-items:center;justify-content:space-between;padding:20px 44px;font-size:14px}
.foot .arch{grid-column:1;grid-row:2;border-radius:100px 100px 14px 14px}
.foot .table{grid-column:2;grid-row:1/3;padding:44px;display:grid;grid-template-columns:1fr 1fr;gap:clamp(20px,3vw,48px)}
.foot dl{display:grid;grid-template-columns:minmax(80px,200px) 1fr;gap:18px 20px;margin:0;align-content:start}
.foot dt{color:rgba(255,255,255,.6);padding-top:7px}
.foot dd{margin:0;text-transform:none;letter-spacing:0;font-family:"Cormorant Garamond",Georgia,serif;font-weight:500;font-size:clamp(19px,1.7vw,24px);line-height:1.25}
.foot dd a:hover{text-decoration:underline;text-underline-offset:.2em}
.foot .thanks p{margin:0 0 1.1em;font-size:14px;line-height:1.55;max-width:26em;text-wrap:pretty}
.foot .strip{display:grid;grid-template-columns:302fr 224fr 302fr 224fr 302fr;gap:6px;margin-top:6px;height:65px}
.foot .strip>*{display:grid;place-items:center;border:1px solid rgba(255,255,255,.2);border-radius:14px;font-size:12px}
.foot .strip .r{border-radius:999px}
.foot .strip a{transition:background-color .2s ease-out}.foot .strip a:hover{background:rgba(255,255,255,.08)}
.foot .strip .big{font-size:19px}
/* the menu: a modal dialog (the guide: invoker command, closedby any, scroll contained) */
dialog#menu{inset:0;width:100%;height:100%;max-width:none;max-height:none;margin:0;padding:0;border:0;background:#171717;color:#fff;overflow:auto;opacity:0;translate:0 14px;transition:opacity .3s ease-out,translate .45s var(--ease),overlay .3s,display .3s;transition-behavior:allow-discrete}
dialog#menu[open]{opacity:1;translate:0 0}
@starting-style{dialog#menu[open]{opacity:0;translate:0 14px}}
dialog:modal{overscroll-behavior:contain}
dialog::backdrop{overflow:hidden;overscroll-behavior:contain}
.menu-in{min-height:100%;padding:20px var(--g) var(--g);display:grid;grid-template-rows:auto 1fr auto;gap:30px}
.menu-top{display:flex;justify-content:space-between;align-items:center;height:40px}
.menu-top .logo{display:block;width:34px;aspect-ratio:1.07;--lg-ink:#fff;--lg-blue:#fff;--lg-deep:#fff}
.menu-top .logo svg{display:block;width:100%;height:100%}
.menu-top button{display:grid;place-items:center;height:40px;padding:0 22px;border-radius:999px;background:rgba(255,255,255,.14);font-size:19px;transition:filter .15s ease-out}
.menu-top button:hover{filter:brightness(1.2)}
.menu-list{display:grid;align-content:center;gap:2px}
.menu-list a{display:flex;align-items:baseline;gap:20px;padding:6px 0;font-size:clamp(48px,9vw,128px);line-height:.95;border-top:1px solid rgba(255,255,255,.14);transition:color .2s ease-out,padding-left .3s var(--ease)}
.menu-list a .mono{font-size:12px;color:rgba(255,255,255,.55);font-stretch:100%}
.menu-list a:hover{padding-left:20px;color:#8FD0F3}
.menu-areas{display:flex;flex-wrap:wrap;gap:6px}
.menu-areas a{padding:8px 16px;border-radius:999px;background:rgba(255,255,255,.12);font-size:14px;transition:background-color .2s ease-out}
.menu-areas a:hover{background:rgba(255,255,255,.22)}
/* motion on the figures and the text: view() timelines where they exist, a class from an observer where they do not (the guide) */
.g,.bar,.draw{transform-box:fill-box}
@media (prefers-reduced-motion:no-preference){
  @supports ((animation-timeline:view()) and (animation-range:entry)){
    @keyframes rv{from{opacity:0;translate:0 36px}}
    @keyframes pop{from{opacity:0;scale:.5}}
    @keyframes bar{from{scale:0 1;opacity:0}}
    @keyframes grow{from{scale:1 0}}
    @keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
    .rv{animation:rv linear both;animation-timeline:view();animation-range:entry 0% entry 55%}
    .viz .g{animation:pop linear both;transform-origin:center;animation-timeline:view();animation-range:entry calc(5% + var(--i,0)*2.6%) entry calc(40% + var(--i,0)*2.6%)}
    .viz line.g{animation-name:grow;transform-origin:bottom}
    .viz .bar{animation:bar linear both;transform-origin:left center;animation-timeline:view();animation-range:entry calc(10% + var(--i,0)*7%) entry calc(50% + var(--i,0)*7%)}
    .viz .draw{stroke-dasharray:1;animation:draw linear both;animation-timeline:view();animation-range:entry 5% entry 70%}
    .pn .g{animation:pop linear both;transform-origin:center;animation-timeline:view();animation-range:entry calc(0% + var(--i,0)*1.6%) entry calc(30% + var(--i,0)*1.6%)}
  }
  @supports not ((animation-timeline:view()) and (animation-range:entry)){
    .rv,.viz .g,.viz .bar,.pn .g{opacity:0;transition:opacity .7s var(--ease),translate .7s var(--ease),scale .7s var(--ease);transition-delay:calc(var(--i,0)*45ms)}
    .rv{translate:0 36px}.viz .g,.pn .g{scale:.5;transform-origin:center}.viz .bar{scale:0 1;transform-origin:left center}.viz line.g{scale:1 0;transform-origin:bottom}
    .rv.in,.in .g,.in .bar{opacity:1;translate:none;scale:none}
    .viz .draw{stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 1.4s var(--ease)}.in .draw{stroke-dashoffset:0}
  }
}
@media (max-width:900px){
  :root{--g:16px}
  .nav{top:12px;grid-template-columns:auto 1fr auto;gap:8px}
  .nav .chips{display:none}.nav .pill{padding:0 16px}
  .bento{top:64px}
  .bento{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(5,1fr);gap:6px}
  .hero .cell{position:static!important;width:auto!important;height:auto!important;border-radius:14px!important}
  .hero .cell:nth-child(n+7){display:none}.hero .cell:nth-child(2),.hero .cell:nth-child(5){border-radius:999px!important}.hero .cell:nth-child(1){grid-column:1/3}
  .title{flex-direction:column;align-items:center;gap:4px}
  .lab{top:auto;bottom:22px;translate:none}
  .grid-i{grid-template-columns:1fr;grid-template-rows:auto;grid-template-areas:"l" "t" "a" "b";}
  .grid-i .a,.grid-i .b{min-height:80px}.grid-i .gp,.grid-i .gq{display:none}.grid-i .l{height:64px}
  .grid-p{grid-template-columns:1fr;grid-template-rows:auto}.pn.big{grid-column:auto;grid-row:auto}
  .grid-m .wp{grid-template-columns:1fr}
  .cards{grid-template-columns:1fr 1fr}.card,.card:nth-child(n+4){grid-column:span 1}.card:last-child{grid-column:1/3}
  .ch-main,.ch-main.rev{grid-template-columns:1fr}.ch-main.rev .viz{order:0}
  .viz{aspect-ratio:auto;min-height:360px;padding:56px 20px}
  .grid-i .t{padding:24px}.pn{padding:20px}.grid-m .wp{padding:24px}.foot .table{padding:24px}
  .txt h3,.txt p{margin-left:0}
  .foot .grid-f{grid-template-columns:1fr;grid-template-rows:auto}.foot .arch{display:none}.foot .table{grid-column:1;grid-row:auto;grid-template-columns:1fr}
  .foot .strip{grid-template-columns:1fr 1fr;height:auto}.foot .strip .r{display:none}.foot .strip>*{height:56px}
}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, rapporten (sketch)</title><style>${css}</style></head><body>${logoDefs}
<div id="progress" aria-hidden="true"></div>
<header class="nav" id="nav">
<a class="logo" href="forside-rapport.html" aria-label="Analytika, home"><svg aria-hidden="true"><use href="#lg-mark"/></svg></a>
<div class="chips cond" aria-hidden="true"><span>Consulting</span><span class="mid">Business</span><span>Development</span></div>
<div class="right"><a class="pill cond" href="../site/about.html#join">Join us</a><button type="button" class="menu-btn" command="show-modal" commandfor="menu" aria-label="Menu"><svg viewBox="0 0 18 18" aria-hidden="true"><path d="M3 6.5h12M3 11.5h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg></button></div>
</header>
<dialog id="menu" aria-label="Menu" closedby="any"><div class="menu-in">
<div class="menu-top"><a class="logo" href="forside-rapport.html" aria-label="Analytika, home"><svg aria-hidden="true"><use href="#lg-mark"/></svg></a><button type="button" class="cond" command="close" commandfor="menu" autofocus>Close</button></div>
<nav class="menu-list cond" aria-label="Pages"><a href="../site/people.html"><span class="mono">01</span>People</a><a href="../site/insights.html"><span class="mono">02</span>Insights</a><a href="../site/products.html"><span class="mono">03</span>Products</a><a href="../site/about.html"><span class="mono">04</span>About us</a><a href="../site/about.html#join"><span class="mono">05</span>Join us</a></nav>
<nav class="menu-areas" aria-label="Areas">${NAMES.map((n, i) => `<a href="#${IDS[i]}" data-close>${n}</a>`).join('')}</nav>
</div></dialog>

<main>
<div class="blue" data-nav="dark">
<section class="hero" data-nav="dark" aria-label="Introduction">
<div class="bento" aria-hidden="true">${heroCells}</div>
<div class="title cond"><h1><span>Consulting</span><span>Business</span><span>Development</span></h1></div>
<div class="lab l mono">Analytika · Oslo</div><div class="lab r mono">Five areas</div>
</section>
<section class="intro" data-nav="dark" aria-label="About">
<div class="grid-i"><i class="a"></i><i class="b"></i><div class="l mono">About</div><i class="gp"></i><i class="gq"></i>
<div class="t"><p>Analytika AS is an Oslo firm of actuaries, pricing specialists, data engineers and consultants. We work for the insurers of Norway, and some abroad.</p><p>The work falls in five areas: Actuary, Pricing, Data platforms, Consulting and Business development. Each has a chapter below.</p><p>The firm was started so that smart people would have a place to get better at what they love.</p></div></div>
</section>
<section class="people" data-nav="dark" aria-label="People">
<h2 class="cond">People</h2>
<div class="grid-p">
<div class="pn big rv"><span class="mono">Twenty-one people, one dot each</span>${people}<span class="mono">Arrival order is not shown</span></div>
<div class="pn rv"><span class="mono">Areas</span><div class="chips2">${NAMES.map((n) => `<span>${n}</span>`).join('')}</div></div>
<div class="pn rv"><span class="mono">Office</span><p>Parkveien 41B<br>0258 Oslo</p></div>
</div>
</section>
<section class="method" data-nav="dark" aria-label="How we work">
<div class="grid-m"><div class="lbl mono">How we work</div>
<div class="wp"><div><h3 class="mono">Analytika AS</h3><p>Oslo. A firm that does actuarial, pricing, data and project work for insurers.</p><p>Started so that smart people would have a place to get better at what they love.</p></div><div><h3 class="mono">How we work</h3><p>Plainly. We say what we mean, build before we describe, and back the ideas our people believe in.</p></div><div><h3 class="mono">Who we work for</h3><p>The insurers of Norway, and some abroad. We do not list them. They know who they are.</p></div></div></div>
</section>
</div>

<div class="white">
<section class="kf" data-nav="light" aria-label="The five areas"><h2 class="cond">The five areas</h2><span class="mono">One chapter for each, in the order below.</span><div class="cards">${cards}</div></section>
${NAMES.map((_, i) => chapter(i)).join('\n')}
<section class="join" data-nav="light" aria-label="Join us"><a class="cond" href="../site/about.html#join">Join us</a><a class="cond" href="../site/people.html">Meet the people</a></section>
</div>
</main>

<footer class="foot" data-nav="dark">
<div class="grid-f"><div class="tile mono"><span>Contact</span><span>@</span></div><i class="arch"></i>
<div class="table"><dl class="mono"><dt>Firm</dt><dd class="serif">Analytika AS</dd><dt>Address</dt><dd class="serif">Parkveien 41B<br>0258 Oslo</dd><dt>E-mail</dt><dd class="serif"><a href="mailto:info@analytika.no">info@analytika.no</a></dd><dt>Areas</dt><dd class="serif">${NAMES.join(', ')}</dd><dt>People</dt><dd class="serif"><a href="../site/people.html">Meet the people</a></dd></dl>
<div class="thanks"><p>The wording on this page comes from drafts in earlier rounds of the Analytika sketches. It is not final.</p><p>The figures are illustrations. They show a method, not a result.</p><p>The page follows the structure of the ART+TECH Report 2023 (arttechreport.com), made for Analytika as a sketch.</p></div></div></div>
<div class="strip mono"><span>© Analytika AS</span><i class="r"></i><a class="cond big" href="../site/about.html">About us</a><i class="r"></i><a href="../site/about.html#contact">Contact</a></div>
</footer>

<script>(function(){
var nav=document.getElementById('nav');
/* the bar turns dark on white and light on blue: the section under it decides */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)nav.classList.toggle('light',e.target.dataset.nav==='light');});},{rootMargin:'-40px 0px -'+(Math.max(0,innerHeight-80))+'px 0px'});
[].forEach.call(document.querySelectorAll('[data-nav]'),function(s){if(s.id||s.tagName==='SECTION'||s.tagName==='FOOTER')io.observe(s);});
/* the fallbacks the guides ask for */
var view=CSS.supports('(animation-timeline: view()) and (animation-range: entry)'),calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!view&&!calm){var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target);}});},{threshold:.25});[].forEach.call(document.querySelectorAll('.rv,.viz,.pn'),function(el){ro.observe(el);});}
if(!CSS.supports('animation-timeline','scroll()')){var p=document.getElementById('progress');addEventListener('scroll',function(){var s=document.documentElement.scrollHeight-innerHeight;p.style.transform='scaleX('+(s>0?scrollY/s:0)+')';},{passive:true});}
/* invoker commands where the browser has none */
var m=document.getElementById('menu');
if(!('commandForElement' in HTMLButtonElement.prototype)){[].forEach.call(document.querySelectorAll('[commandfor=menu]'),function(b){b.addEventListener('click',function(){if(b.getAttribute('command')==='close')m.close();else m.showModal();});});}
if(!('closedBy' in HTMLDialogElement.prototype)){m.addEventListener('click',function(e){var r=m.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)m.close();});}
[].forEach.call(document.querySelectorAll('[data-close]'),function(a){a.addEventListener('click',function(){m.close();});});
})();</script>
</body></html>`;

write('forside-rapport.html', html);
