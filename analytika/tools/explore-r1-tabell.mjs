/* Round 1, direction "Tabell": the page is a printed actuarial table, set the way a statistical yearbook sets one.
   The figures are the illustrative Gompertz law from figures.mjs (not Analytika data) and are labelled as such. */
import { write, logoDefs, LOGO, fonts, PEOPLE, AREA_NAMES, SKETCH, S, ex } from './explore-shared.mjs';

const RADIX = 100000;
const l = (x) => RADIX * S(x);
const grp = (n) => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const rowsHtml = [];
for (let x = 40; x <= 109; x++) {
  const lx = l(x), d = lx - l(x + 1), qx = d / lx;
  rowsHtml.push(`<tr${x % 5 === 0 ? ' class="g"' : ''}${x === 65 ? ' data-default' : ''}><th scope="row">${x}</th><td>${grp(lx)}</td><td>${grp(d)}</td><td>${qx.toFixed(5)}</td><td>${ex(x).toFixed(1)}</td></tr>`);
}

const CSS = `
:root{--paper:#F1F1EC;--ink:#1A2540;--soft:#5D6478;--rule:rgba(26,37,64,.2);--acc:#036194;--lg-ink:#1E3363;--lg-word:#1E3363;--lg-blue:#1B92D0;--lg-deep:#036194;
  --gut:clamp(20px,3.4vw,48px);--f:"Source Serif 4","Iowan Old Style",Georgia,serif}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--paper);color:var(--ink);font:400 13.5px/1.5 var(--f);font-optical-sizing:auto;font-variant-numeric:lining-nums tabular-nums;overflow-x:hidden}
a{color:inherit;text-decoration:none}
::selection{background:var(--acc);color:var(--paper)}
:focus-visible{outline:1.5px solid var(--acc);outline-offset:4px;border-radius:1px}
ul,ol{margin:0;padding:0;list-style:none}
.logo{display:block;height:22px;aspect-ratio:5.349}
.wrap{display:grid;grid-template-columns:minmax(300px,31%) minmax(0,1fr);column-gap:clamp(36px,6vw,110px);padding:0 var(--gut)}
.rail{position:sticky;top:0;align-self:start;height:100vh;height:100svh;display:flex;flex-direction:column;padding:clamp(22px,3.2vw,38px) 0 22px}
.ttl{margin:clamp(56px,13vh,140px) 0 0;font:400 clamp(20px,1.75vw,25px)/1.22 var(--f);letter-spacing:-.003em;max-width:19ch;text-wrap:balance}
.ttl .tn{display:block;margin-bottom:.45rem;font-size:12px;letter-spacing:.08em;font-variant-caps:all-small-caps;color:var(--soft)}
.note{margin:.9rem 0 0;max-width:34ch;font-size:12.5px;color:var(--soft);font-style:italic}
.areas{margin:1.6rem 0 0;max-width:34ch;font-size:13px;line-height:1.6}
.rail nav{margin-top:auto;padding-top:1.4rem}
.contents{margin:0;border-top:1.4px solid var(--ink);max-width:360px}
.contents li{border-bottom:1px solid var(--rule)}
.contents a{display:flex;justify-content:space-between;align-items:baseline;padding:.52rem 0;font-size:17px;line-height:1.2;transition:color .2s,padding .25s}
.contents a span{font-size:12px;color:var(--soft);transition:color .2s}
.contents a:hover,.contents a[aria-current]{color:var(--acc);padding-left:.4rem}
.contents .sm a{font-size:13px;padding:.4rem 0}
.addr{margin:1.1rem 0 0;font-size:12px;color:var(--soft)}
.tbl{padding:clamp(22px,3.2vw,38px) 0 12vh;max-width:820px}
.tbl table{width:100%;border-collapse:collapse;font-size:12.5px}
.tbl thead th{position:sticky;top:0;background:var(--paper);padding:.7rem 0 .5rem;font-weight:400;text-align:right;border-top:1.4px solid var(--ink);border-bottom:1px solid var(--ink);z-index:2}
.tbl thead th:first-child{text-align:left}
.tbl thead small{display:block;font-size:12px;font-style:italic;color:var(--soft);font-weight:400}
.tbl i{font-style:italic}.tbl sub{font-size:.72em;vertical-align:-.28em;line-height:0}
.tbl tbody th,.tbl tbody td{padding:.2rem 0;font-weight:400;text-align:right;transition:color .15s}
.tbl tbody th{text-align:left}
.tbl tr.g th,.tbl tr.g td{padding-top:.95rem}
.tbl tbody tr{cursor:default}
.tbl tbody tr.hl th,.tbl tbody tr.hl td{color:var(--acc);box-shadow:inset 0 -1px 0 var(--acc)}
.tbl tfoot td{padding:.7rem 0 0;border-top:1.4px solid var(--ink);font-size:12px;color:var(--soft);text-align:left;font-style:italic}
.tbl .src{margin:1.4rem 0 0;font-size:12px;color:var(--soft);max-width:60ch}
.sketch{margin:.6rem 0 0;font-size:12px;color:var(--soft);max-width:34ch}
.open td,.open th{color:var(--soft);font-style:italic}
.open th{border-bottom:1px dashed var(--rule)}
/* people */
.tbl.people table{max-width:640px}
.tbl.people td.nm{text-align:left}
.tbl.people thead th.nm{text-align:left}
.tbl.people tbody tr:hover th,.tbl.people tbody tr:hover td{color:var(--acc)}
@media (max-width:860px){.wrap{display:block}.rail{position:static;height:auto}.ttl{margin-top:36px}.contents{margin-top:28px}.tbl{padding-top:32px}.sketch{max-width:none}}
`;

const head = (title) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>${fonts('Source+Serif+4:ital,opsz,wght@0,8..60,300..600;1,8..60,300..600')}<style>${CSS}</style></head><body>${logoDefs}`;

const contents = (cur) => `<nav aria-label="Contents"><ul class="contents">${[['People', 'people'], ['Insights', 'insights'], ['Products', 'products'], ['About us', 'about']].map(([w, k]) => `<li><a href="${k}.html"${k === cur ? ' aria-current="page"' : ''}>${w}</a></li>`).join('')}<li class="sm"><a href="about.html#join">Join us</a></li><li class="sm"><a href="about.html#contact">Contact</a></li></ul></nav>`;

const home = `${head('Analytika – Tabell (sketch)')}
<div class="wrap">
<aside class="rail"><a href="tabell.html" aria-label="Analytika, home">${LOGO}</a>
<h1 class="ttl"><span class="tn">Table 1.</span>Uncertainty is our trade.</h1>
<p class="note">Survival table after Gompertz. Illustrative figures, not Analytika data.</p>
<p class="areas">${AREA_NAMES.join(', ')}.</p>
${contents('')}
<p class="addr">Analytika AS · Parkveien 41B, 0258 Oslo</p>
${SKETCH('Sketch, round 1 · slogan and areas are placeholders. Hover a row.')}
</aside>
<main class="tbl"><table aria-label="Illustrative survival table">
<thead><tr><th scope="col">Age <small><i>x</i></small></th><th scope="col"><i>l</i><sub><i>x</i></sub><small>alive of 100 000 at birth</small></th><th scope="col"><i>d</i><sub><i>x</i></sub><small>dying within the year</small></th><th scope="col"><i>q</i><sub><i>x</i></sub><small>probability of dying</small></th><th scope="col"><i>e</i><sub><i>x</i></sub><small>years still to live</small></th></tr></thead>
<tbody>${rowsHtml.join('')}</tbody>
<tfoot><tr><td colspan="5">The table stops at 110.</td></tr></tfoot></table></main>
</div>
<script>(function(){var rows=[].slice.call(document.querySelectorAll('tbody tr')),d=document.querySelector('tr[data-default]');
function on(r){rows.forEach(function(x){x.classList.toggle('hl',x===r)});}on(d);
rows.forEach(function(r){r.addEventListener('mouseenter',function(){on(r)});});
document.querySelector('tbody').addEventListener('mouseleave',function(){on(d)});})();</script>
</body></html>`;

const arrivals = [...PEOPLE.map((n, i) => `<tr><th scope="row">${i + 1}</th><td class="nm"><a href="#">${n}</a></td><td>${i === 8 ? '2019' : i === 20 ? '2026' : ''}</td></tr>`), ...[0, 1, 2].map((i) => `<tr class="open"><th scope="row">${PEOPLE.length + i + 1}</th><td class="nm"><a href="about.html#join">Open</a></td><td></td></tr>`)].join('');
const people = `${head('People – Analytika – Tabell (sketch)')}
<div class="wrap">
<aside class="rail"><a href="tabell.html" aria-label="Analytika, home">${LOGO}</a>
<h1 class="ttl"><span class="tn">Table 2.</span>People, in the order they arrived.</h1>
<p class="note">Open rows are roles we have not filled.</p>
${contents('people')}
<p class="addr">Analytika AS · Parkveien 41B, 0258 Oslo</p>
${SKETCH('Sketch, round 1 · names are those used in earlier sketches; order of arrival is illustrative, only 2019 and 2026 are known.')}
</aside>
<main class="tbl people"><table aria-label="People in order of arrival">
<thead><tr><th scope="col">No.</th><th class="nm" scope="col">Name</th><th scope="col">Joined</th></tr></thead>
<tbody>${arrivals}</tbody></table></main>
</div></body></html>`;

write('tabell.html', home);
write('tabell-people.html', people);
