/* Round 1, direction "Trekanten": the Galton lattice as the firm. Six rows of the triangle hold exactly 21 dots,
   one per person, in the order they arrived; the seventh row holds the open places. A ball falls through once. */
import { write, logoDefs, LOGO, fonts, PEOPLE, AREA_NAMES, SKETCH } from './explore-shared.mjs';

/* rows 0..5 are the 21 people, row 6 is the open row; rows 7 and 8 are faint pegs that fade out */
function tri({ dx, dy, r, pad, names = false }) {
  const rows = 9;
  const W = 8 * dx + 2 * pad, H = (rows - 1) * dy + 2 * pad;
  const X = (k, j) => W / 2 + (j - k / 2) * dx, Y = (k) => pad + k * dy;
  let g = '', i = 0;
  for (let k = 0; k < rows; k++) for (let j = 0; j <= k; j++) {
    const x = X(k, j).toFixed(1), y = Y(k).toFixed(1);
    if (k <= 5) {
      const n = PEOPLE[i];
      g += `<a href="people.html" class="p" data-i="${i}" aria-label="${n}"><circle cx="${x}" cy="${y}" r="${r}"/><circle class="hit" cx="${x}" cy="${y}" r="${r + 9}"/><text class="nm" x="${(+x + r + 9).toFixed(1)}" y="${(+y + 4).toFixed(1)}">${n}</text></a>`;
      i++;
    } else if (k === 6 && j >= 2 && j <= 4) {
      g += `<a href="about.html#join" class="o" data-o="${j}" aria-label="Open place"><circle cx="${x}" cy="${y}" r="${r}"/><circle class="hit" cx="${x}" cy="${y}" r="${r + 9}"/><text class="nm" x="${(+x + r + 9).toFixed(1)}" y="${(+y + 4).toFixed(1)}">Open</text></a>`;
    } else {
      g += `<circle class="peg" cx="${x}" cy="${y}" r="2.4" style="opacity:${Math.max(0, 0.55 - Math.max(0, k - 6) * 0.2).toFixed(2)}"/>`;
    }
  }
  return { svg: `<svg class="tri" viewBox="0 0 ${W} ${H}" aria-label="One dot per person, in the order they arrived; open circles are places not yet taken">${g}<circle class="ball" r="${(r * 0.46).toFixed(1)}" cx="${X(0, 0).toFixed(1)}" cy="${(Y(0) - 70).toFixed(1)}"/></svg>`, X, Y, W, H, dy };
}

const CSS = `
:root{--paper:#F5F7FA;--ink:#1E3363;--soft:#5A6786;--rule:rgba(30,51,99,.2);--blue:#1B92D0;--deep:#036194;--lg-ink:#1E3363;--lg-word:#1E3363;--lg-blue:#1B92D0;--lg-deep:#036194;
  --gut:clamp(20px,3.4vw,48px);--sans:"Hanken Grotesk","Helvetica Neue",Arial,sans-serif;--serif:"Spectral",Georgia,serif}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;min-height:100vh;min-height:100svh;background:var(--paper);color:var(--ink);font:400 13.5px/1.55 var(--sans);overflow-x:hidden}
a{color:inherit;text-decoration:none}
::selection{background:var(--blue);color:#fff}
:focus-visible{outline:1.5px solid var(--deep);outline-offset:5px;border-radius:2px}
ul,ol{margin:0;padding:0;list-style:none}
.logo{display:block;height:clamp(20px,1.9vw,26px);aspect-ratio:5.349}
.hdr{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:clamp(18px,2.6vw,32px) var(--gut)}
.hdr nav{display:flex;flex-wrap:wrap;gap:.3rem clamp(14px,1.8vw,26px);font-size:12.5px;letter-spacing:.03em}
.hdr nav a{color:var(--soft);transition:color .2s}
.hdr nav a:hover,.hdr nav a[aria-current]{color:var(--ink)}
.hdr nav a[aria-current]{text-decoration:underline;text-underline-offset:.45em;text-decoration-thickness:1px}
.hdr nav .gap{margin-left:clamp(0px,1.4vw,18px)}
.sketch{margin:0;padding:0 var(--gut) 16px;font-size:12px;color:var(--soft)}
.foot{display:flex;justify-content:space-between;gap:1rem;padding:0 var(--gut) 10px;font-size:12px;color:var(--soft)}

.stage{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,.9fr);gap:2rem;padding:0 var(--gut);min-height:calc(100svh - 150px)}
.lede{align-self:start;padding-top:clamp(36px,10vh,120px)}
.slogan{margin:0;font:300 clamp(26px,2.6vw,38px)/1.12 var(--serif);letter-spacing:-.012em}
.areas{margin:1.15rem 0 0;display:flex;flex-wrap:wrap;gap:.2rem 1.5rem;font-size:12px;letter-spacing:.05em;color:var(--soft)}
.areas a:hover{color:var(--ink);text-decoration:underline;text-underline-offset:.4em;text-decoration-thickness:1px}
.legend{align-self:end;margin:0;padding-bottom:3vh;max-width:36ch;font-size:12.5px;color:var(--soft)}
.treewrap{grid-row:1/3;grid-column:2;display:flex;justify-content:flex-end;align-items:flex-start}
.tri{display:block;width:min(100%,600px);height:auto;overflow:visible}
.tri .p circle:not(.hit){fill:var(--ink);transition:fill .5s,transform .3s;transform-box:fill-box;transform-origin:center}
.tri .o circle:not(.hit){fill:var(--paper);stroke:var(--ink);stroke-width:1.3;stroke-dasharray:3 3;transition:fill .5s,stroke .5s}
.tri .hit{fill:transparent}
.tri .peg{fill:var(--ink)}
.tri a{cursor:pointer}
.tri .p:hover circle:not(.hit),.tri .p:focus-visible circle:not(.hit),.tri .p.on circle:not(.hit){fill:var(--blue);transform:scale(1.22)}
.tri .o:hover circle:not(.hit),.tri .o.on circle:not(.hit){fill:var(--blue);stroke:var(--blue)}
.tri .nm{fill:var(--ink);font:400 12.5px var(--sans);opacity:0;pointer-events:none;paint-order:stroke;stroke:var(--paper);stroke-width:5px;stroke-linejoin:round;transition:opacity .2s}
.tri a:hover .nm,.tri a:focus-visible .nm,.tri a.on .nm{opacity:1}
.tri .ball{fill:var(--deep);opacity:0;transition:transform .46s cubic-bezier(.42,0,.9,.7),opacity .2s}
.tri .p.flash circle:not(.hit){fill:var(--blue)}
@media (max-width:860px){.stage{display:block;min-height:0}.treewrap{margin-top:36px}.legend{margin-top:20px}}

/* people */
.pg{display:grid;grid-template-columns:minmax(260px,.8fr) minmax(0,1fr);gap:clamp(24px,5vw,90px);padding:clamp(26px,6vh,64px) var(--gut) 8vh}
.pg h1{margin:0;font:300 clamp(26px,2.6vw,38px)/1.12 var(--serif);letter-spacing:-.012em}
.pg .sub{margin:.8rem 0 1.8rem;max-width:44ch;color:var(--soft)}
.alist{counter-reset:n;max-width:380px}
.alist li{display:flex;gap:1rem;border-top:1px solid var(--rule);counter-increment:n}
.alist li:last-child{border-bottom:1px solid var(--rule)}
.alist li::before{content:counter(n,decimal-leading-zero);width:1.6rem;padding:.3rem 0;color:var(--soft);font-variant-numeric:tabular-nums}
.alist a{flex:1;padding:.3rem 0;transition:color .2s}
.alist li.on a,.alist a:hover{color:var(--deep)}
.alist .yr{padding:.3rem 0;color:var(--soft)}
.alist .open a{color:var(--soft);font-style:italic}
@media (max-width:860px){.pg{display:block}}
`;

const head = (title) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>${fonts('Spectral:wght@300;400', 'Hanken+Grotesk:wght@400;500')}<style>${CSS}</style></head><body>${logoDefs}`;
const nav = (cur) => `<nav>${[['People', 'people'], ['Insights', 'insights'], ['Products', 'products'], ['About us', 'about']].map(([w, k]) => `<a href="${k}.html"${k === cur ? ' aria-current="page"' : ''}>${w}</a>`).join('')}<a class="gap" href="about.html#join">Join us</a><a href="about.html#contact">Contact</a></nav>`;

/* the single ball: R L R L R L from the apex lands on the middle open place */
const DROP = `<script>(function(){
var svg=document.querySelector('.tri'),b=svg.querySelector('.ball');if(!b)return;
if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var path=[[0,0],[1,1],[2,1],[3,2],[4,2],[5,3],[6,3]],P=svg.querySelectorAll('a'),idx=0,rows=[];
function dotAt(k,j){var n=k*(k+1)/2+j;return k<=5?svg.querySelector('.p[data-i="'+n+'"]'):svg.querySelector('.o[data-o="'+j+'"]');}
var c0=dotAt(0,0).querySelector('circle'),x0=+c0.getAttribute('cx'),y0=+c0.getAttribute('cy');
b.style.transition='none';b.style.transform='translate(0,0)';b.getBoundingClientRect();b.style.opacity=1;
var go=function(i){if(i>=path.length){b.style.opacity=0;return;}var d=dotAt(path[i][0],path[i][1]),c=d.querySelector('circle'),x=+c.getAttribute('cx')-x0,y=+c.getAttribute('cy')-y0;
b.style.transition='transform .46s cubic-bezier(.42,0,.9,.7),opacity .2s';b.style.transform='translate('+x+'px,'+y+'px)';
setTimeout(function(){d.classList.add('flash');if(d.classList.contains('o')){d.classList.add('on');}else{setTimeout(function(){d.classList.remove('flash');},1100);}go(i+1);},470);};
setTimeout(function(){go(0);},700);
})();</script>`;

const T1 = tri({ dx: 74, dy: 64, r: 10.5, pad: 40 });
const home = `${head('Analytika – Trekanten (sketch)')}
<header class="hdr"><a href="trekant.html" aria-label="Analytika, home">${LOGO}</a>${nav('')}</header>
<main class="stage">
<div class="lede"><h1 class="slogan">Uncertainty is our trade.</h1>
<p class="areas">${AREA_NAMES.map((a) => `<a href="insights.html">${a}</a>`).join('')}</p></div>
<p class="legend">Each dot is one of us, in the order we arrived. The open circles are places not yet taken.</p>
<div class="treewrap">${T1.svg}</div>
</main>
<div class="foot"><span>Analytika AS · Parkveien 41B, 0258 Oslo</span><span><a href="about.html#join">Join us</a> &nbsp; <a href="about.html#contact">Contact</a></span></div>
${SKETCH('Sketch, round 1 · 21 names as in earlier sketches, order illustrative; open places are placeholders. Slogan and areas are placeholders.')}
${DROP}</body></html>`;

const T2 = tri({ dx: 66, dy: 57, r: 9.5, pad: 36 });
const list = PEOPLE.map((n, i) => `<li data-i="${i}"><a href="#">${n}</a><span class="yr">${i === 8 ? '2019' : i === 20 ? '2026' : ''}</span></li>`).join('') + [0, 1, 2].map((j) => `<li class="open" data-o="${j + 2}"><a href="about.html#join">Open</a></li>`).join('');
const people = `${head('People – Analytika – Trekanten (sketch)')}
<header class="hdr"><a href="trekant.html" aria-label="Analytika, home">${LOGO}</a>${nav('people')}</header>
<main class="pg"><div><h1>People</h1><p class="sub">In the order we arrived. The triangle grows one row at a time.</p><ol class="alist">${list}</ol></div>
<div class="treewrap" style="grid-row:auto;grid-column:auto;justify-content:center">${T2.svg}</div></main>
${SKETCH('Sketch, round 1 · names as in earlier sketches; order of arrival is illustrative, only 2019 and 2026 are known. Hover a name or a dot.')}
<script>(function(){var svg=document.querySelector('.tri'),lis=[].slice.call(document.querySelectorAll('.alist li'));
function dot(li){return li.dataset.i!==undefined?svg.querySelector('.p[data-i="'+li.dataset.i+'"]'):svg.querySelector('.o[data-o="'+li.dataset.o+'"]');}
lis.forEach(function(li){var d=dot(li);function on(v){d.classList.toggle('on',v);li.classList.toggle('on',v);}
li.addEventListener('mouseenter',function(){on(true)});li.addEventListener('mouseleave',function(){on(false)});
d.addEventListener('mouseenter',function(){on(true)});d.addEventListener('mouseleave',function(){on(false)});});})();</script>
</body></html>`;

write('trekant.html', home);
write('trekant-people.html', people);
