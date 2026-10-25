/* Round 2: three home pages built on the photograph of five whiteboards (assets/photo/tavler.jpg).
   Minimal top, a gradient down into the photograph, the five boards are the five areas and are clickable.
   People, Products and About us are not on the photograph, so each version answers that differently. */
import { write, logoDefs, LOGO, fonts, SKETCH } from './explore-shared.mjs';
import { AREAS } from './figures.mjs';

const IMG = '../../assets/photo/tavler.jpg', IW = 1914, IH = 822;
/* the five boards, measured on the photograph, in pixels: x0 y0 x1 y1 */
const RECT = [[143, 88, 456, 670], [468, 90, 781, 672], [794, 90, 1117, 672], [1130, 88, 1451, 672], [1463, 88, 1795, 672]];
const SUBS = { actuary: ['Risk actuary', 'Compliance', 'Reserving', 'Life and pension'] };
const A = AREAS.map((a, i) => ({ ...a, rect: RECT[i], cx: ((RECT[i][0] + RECT[i][2]) / 2 / IW) * 100, subs: SUBS[a.id] || ['[Sub-areas still to be defined]'] }));
const pct = (v, d) => ((v / d) * 100).toFixed(3) + '%';
const boardStyle = (r) => `left:${pct(r[0], IW)};top:${pct(r[1], IH)};width:${pct(r[2] - r[0], IW)};height:${pct(r[3] - r[1], IH)}`;
const ALT = 'Black and white photograph of five whiteboards side by side on a wall, covered in hand-drawn mathematics, tables and diagrams, above a long table with laptops and notebooks';

const BASE = `
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--g);color:var(--fg);font:400 13.5px/1.55 var(--sans);overflow-x:hidden}
a{color:inherit;text-decoration:none}
::selection{background:var(--acc);color:var(--g)}
:focus-visible{outline:1.5px solid var(--acc);outline-offset:4px}
ul,ol{margin:0;padding:0;list-style:none}
.logo{display:block;height:clamp(20px,1.9vw,26px);aspect-ratio:5.349}
.hdr{position:relative;z-index:5;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:clamp(18px,2.4vw,30px) var(--gut)}
.hdr nav{display:flex;flex-wrap:wrap;gap:.3rem clamp(14px,1.8vw,26px);font-size:12.5px;letter-spacing:.03em}
.hdr nav a{color:var(--mute);transition:color .2s}
.hdr nav a:hover{color:var(--fg)}
.hdr nav .gap{margin-left:clamp(0px,1.4vw,18px)}
.slogan{margin:0;font:300 clamp(24px,2.3vw,34px)/1.12 var(--serif);letter-spacing:-.012em}
.wall{position:relative;overflow:hidden}
.wall img{display:block;width:100%;height:auto}
.board{position:absolute;display:block;outline:0;transition:box-shadow .35s,background .35s}
.sketch{margin:0;padding:0 var(--gut) 16px;font-size:12px;color:var(--mute)}
.foot{display:flex;justify-content:space-between;gap:1rem;padding:0 var(--gut) 10px;font-size:12px;color:var(--mute)}
.mlist{display:none}
@media (max-width:760px){.mlist{display:block;margin:20px var(--gut) 0}.mlist li{border-top:1px solid var(--rule)}.mlist a{display:block;padding:.7rem 0;font-size:15px}.labs{display:none}}
`;
const head = (title, css, extra = '') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title>${extra}<style>${BASE}${css}</style></head><body>${logoDefs}`;
const mlist = (href) => `<ol class="mlist" aria-label="Areas">${A.map((a) => `<li><a href="${href(a)}">${a.name}</a></li>`).join('')}</ol>`;
/* per-area rules: hovering a board or its label lights both */
const pair = (fn) => A.map((a) => fn(a.id)).join('\n');

/* ---------------------------------------------------------------- 1. white */
const hvitCss = `
:root{--g:#fff;--fg:#10131A;--mute:#5C6270;--rule:#DCDFE5;--acc:#036194;--lg-ink:#10131A;--lg-word:#10131A;--lg-blue:#1B92D0;--lg-deep:#036194;--gut:clamp(20px,3.4vw,48px);--sans:"Schibsted Grotesk","Helvetica Neue",Arial,sans-serif;--serif:"Newsreader",Georgia,serif}
.top{position:relative;z-index:4;padding:clamp(18px,5vh,64px) var(--gut) 0}
.wallwrap{position:relative;margin-top:clamp(-70px,-3.6vw,-30px)}
.wall{-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 30%,#000 82%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 30%,#000 82%,transparent 100%)}
.board:hover,.board:focus-visible{box-shadow:0 0 0 100vmax rgba(255,255,255,.7);outline:1.5px solid var(--acc)}
.labs{position:relative;height:34px;margin-top:-2.2vw}
.labs li{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}
.labs a{display:block;padding:.35rem .5rem;font-size:13px;letter-spacing:.02em;color:var(--mute);transition:color .2s}
.labs a::before{content:"";display:block;width:1px;height:14px;margin:0 auto .35rem;background:var(--rule);transition:background .2s,height .2s}
${pair((id) => `.wallwrap:has(.board[data-id="${id}"]:hover) .labs a[data-id="${id}"],.wallwrap:has(.board[data-id="${id}"]:focus-visible) .labs a[data-id="${id}"],.labs a[data-id="${id}"]:hover{color:var(--acc)}
.wallwrap:has(.board[data-id="${id}"]:hover) .labs a[data-id="${id}"]::before,.labs a[data-id="${id}"]:hover::before{background:var(--acc);height:22px}
.wallwrap:has(.labs a[data-id="${id}"]:hover) .board[data-id="${id}"]{box-shadow:0 0 0 100vmax rgba(255,255,255,.7);outline:1.5px solid var(--acc)}`)}
`;
const hvit = `${head('Analytika – Vegg, hvit (sketch)', hvitCss, fonts('Newsreader:opsz,wght@6..72,300;6..72,400', 'Schibsted+Grotesk:wght@400;500'))}
<header class="hdr"><a href="vegg-hvit.html" aria-label="Analytika, home">${LOGO}</a><nav><a href="../site/people.html">People</a><a href="#wall">Insights</a><a href="../site/products.html">Products</a><a href="../site/about.html">About us</a><a class="gap" href="../site/about.html#join">Join us</a><a href="../site/about.html#contact">Contact</a></nav></header>
<main>
<div class="top"><h1 class="slogan">Uncertainty is our trade.</h1></div>
<div class="wallwrap" id="wall"><figure class="wall" style="margin:0"><img src="${IMG}" alt="${ALT}">${A.map((a) => `<a class="board" data-id="${a.id}" href="../site/insights.html#${a.id}" aria-label="${a.name}" style="${boardStyle(a.rect)}"></a>`).join('')}</figure>
<ul class="labs">${A.map((a) => `<li style="left:${a.cx.toFixed(2)}%"><a data-id="${a.id}" href="../site/insights.html#${a.id}">${a.name}</a></li>`).join('')}</ul></div>
${mlist((a) => `../site/insights.html#${a.id}`)}
</main>
<div class="foot" style="margin-top:clamp(20px,4vh,44px)"><span>Analytika AS · Parkveien 41B, 0258 Oslo</span><span><a href="../site/about.html#join">Join us</a> &nbsp; <a href="../site/about.html#contact">Contact</a></span></div>
${SKETCH('Sketch, round 2 · Insights is the wall itself, so the Insights link only scrolls to it; People, Products and About us sit in the header. Slogan is a placeholder.')}
</body></html>`;

/* ---------------------------------------------------------------- 2. marine, tonal */
const marineCss = `
:root{--g:#0F1B3D;--fg:#E8EEF8;--mute:rgba(232,238,248,.7);--rule:rgba(232,238,248,.24);--acc:#7CC3EA;--lg-ink:#E8EEF8;--lg-word:#E8EEF8;--lg-blue:#7CC3EA;--lg-deep:#7CC3EA;--gut:clamp(20px,3.4vw,48px);--sans:"Hanken Grotesk","Helvetica Neue",Arial,sans-serif;--serif:"Spectral",Georgia,serif}
.top{position:relative;z-index:4;padding:clamp(18px,5vh,64px) var(--gut) 0}
.wallwrap{position:relative;margin-top:clamp(-70px,-3.6vw,-30px)}
.wall{-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 34%,#000 80%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 34%,#000 80%,transparent 100%)}
.wall img{filter:url(#duo)}
.board:hover,.board:focus-visible{box-shadow:0 0 0 100vmax rgba(15,27,61,.62);outline:1.5px solid var(--acc)}
${pair((id) => `body:has(#${id}:target) .board[data-id="${id}"],body[data-sel="${id}"] .board[data-id="${id}"]{box-shadow:0 0 0 100vmax rgba(15,27,61,.62);outline:1.5px solid var(--acc)}`)}
.labs{position:relative;height:34px;margin-top:-2.2vw}
.labs li{position:absolute;top:0;transform:translateX(-50%);white-space:nowrap}
.labs a{display:block;padding:.35rem .5rem;font-size:13px;letter-spacing:.02em;color:var(--mute);transition:color .2s}
.labs a:hover{color:var(--fg)}
${pair((id) => `body:has(#${id}:target) .labs a[data-id="${id}"],body[data-sel="${id}"] .labs a[data-id="${id}"]{color:var(--fg);text-decoration:underline;text-underline-offset:.45em;text-decoration-thickness:1px}`)}
.drawer{display:none;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:clamp(20px,5vw,90px);margin:clamp(34px,7vh,70px) var(--gut) 0;padding-top:1.1rem;border-top:1px solid var(--rule);scroll-margin-top:24px}
.drawer:target,.drawer.on{display:grid;animation:open .6s cubic-bezier(.22,.8,.3,1)}
@keyframes open{from{opacity:0;transform:translateY(10px)}}
.drawer h2{margin:0;font:300 clamp(22px,2vw,28px)/1.15 var(--serif);letter-spacing:-.01em}
.drawer p{margin:.6rem 0 0;color:var(--mute);max-width:40ch}
.drawer li{border-bottom:1px solid var(--rule)}.drawer li:first-child{border-top:1px solid var(--rule)}
.drawer li a,.drawer li span{display:flex;justify-content:space-between;align-items:center;padding:.7rem 0;font-size:15px}
.drawer li a:hover{color:var(--acc)}
.drawer li span{color:var(--mute);font-style:italic}
.fields{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));margin:clamp(40px,9vh,100px) 0 0}
.fields a{display:flex;align-items:flex-end;justify-content:space-between;min-height:clamp(120px,24vh,220px);padding:1.1rem var(--gut) 1.2rem 1.2rem;font:300 clamp(18px,1.7vw,24px)/1 var(--serif);transition:background .35s}
.fields a:nth-child(1){background:#14234A}.fields a:nth-child(2){background:#1A2C5A}.fields a:nth-child(3){background:#213668}.fields a:nth-child(4){background:#294075}
.fields a:hover{background:#34508C}
.fields a i{font-style:normal;font-size:15px;color:var(--mute);transition:transform .3s}
.fields a:hover i{transform:translateX(4px)}
@media (max-width:760px){.fields{grid-template-columns:repeat(2,minmax(0,1fr))}.drawer{display:none!important}}
`;
const duo = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="duo" color-interpolation-filters="sRGB"><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="table" tableValues="0.06 0.30 0.90"/><feFuncG type="table" tableValues="0.10 0.40 0.93"/><feFuncB type="table" tableValues="0.24 0.62 0.98"/></feComponentTransfer></filter></svg>`;
const marine = `${head('Analytika – Vegg, marine (sketch)', marineCss, fonts('Spectral:wght@300;400', 'Hanken+Grotesk:wght@400;500'))}${duo}
<header class="hdr"><a href="vegg-marine.html" aria-label="Analytika, home">${LOGO}</a><nav><a href="../site/about.html#join">Join us</a><a href="../site/about.html#contact">Contact</a></nav></header>
<main>
<div class="top"><h1 class="slogan">Uncertainty is our trade.</h1></div>
<div class="wallwrap" id="wall"><figure class="wall" style="margin:0"><img src="${IMG}" alt="${ALT}">${A.map((a) => `<a class="board" data-id="${a.id}" href="#${a.id}" aria-label="${a.name}" style="${boardStyle(a.rect)}"></a>`).join('')}</figure>
<ul class="labs">${A.map((a) => `<li style="left:${a.cx.toFixed(2)}%"><a data-id="${a.id}" href="#${a.id}">${a.name}</a></li>`).join('')}</ul></div>
${A.map((a) => `<section class="drawer" id="${a.id}" aria-label="${a.name}"><div><h2>${a.name}</h2><p>${a.line}</p></div><ul>${a.subs.map((s) => (a.id === 'actuary' ? `<li><a href="../site/insights-actuary-${{ 'Risk actuary': 'risk', Compliance: 'compliance', Reserving: 'reserving', 'Life and pension': 'life-pension' }[s]}.html">${s}<span aria-hidden="true">→</span></a></li>` : `<li><span>${s}</span></li>`)).join('')}</ul></section>`).join('')}
${mlist((a) => `../site/insights.html#${a.id}`)}
<nav class="fields" aria-label="Pages"><a href="../site/people.html">People<i aria-hidden="true">→</i></a><a href="../site/insights.html">Insights<i aria-hidden="true">→</i></a><a href="../site/products.html">Products<i aria-hidden="true">→</i></a><a href="../site/about.html">About us<i aria-hidden="true">→</i></a></nav>
</main>
<script>(function(){var d=[].slice.call(document.querySelectorAll('.drawer'));function sel(id){d.forEach(function(x){x.classList.toggle('on',x.id===id)});document.body.setAttribute('data-sel',id);var t=document.getElementById(id);if(t)t.scrollIntoView({behavior:'smooth',block:'start'});}
[].forEach.call(document.querySelectorAll('.board,.labs a'),function(a){a.addEventListener('click',function(e){e.preventDefault();sel(a.dataset.id);});});})();</script>
<div class="foot" style="padding-top:18px"><span>Analytika AS · Parkveien 41B, 0258 Oslo</span><span><a href="../site/about.html#join">Join us</a> &nbsp; <a href="../site/about.html#contact">Contact</a></span></div>
${SKETCH('Sketch, round 2 · a board opens its sub-areas below the picture (only Actuary has any so far). The four fields carry People, Insights, Products and About us. Photograph is toned to the logo’s marine in the browser.')}
</body></html>`;

/* ---------------------------------------------------------------- 3. dark, zoom (the look of variant D) */
const zoomCss = `
:root{--g:#0E1014;--fg:#EDEFF3;--mute:rgba(237,239,243,.66);--rule:rgba(237,239,243,.26);--acc:#9CCBE6;--lg-ink:#fff;--lg-word:#fff;--lg-blue:#9CCBE6;--lg-deep:#9CCBE6;--gut:clamp(20px,3.4vw,48px);--sans:"Poppins","Helvetica Neue",Arial,sans-serif;--serif:"Cormorant Garamond",Georgia,serif}
body{font-size:13px}
.home{position:relative;height:100vh;height:100svh;min-height:640px;overflow:hidden}
.home .hdr{position:absolute;left:0;right:0;top:0}
.hdr nav{letter-spacing:.1em;text-transform:uppercase;font-size:11.5px}
.home .slogan{position:absolute;left:var(--gut);top:clamp(70px,11vh,110px);z-index:4;font-size:clamp(26px,2.6vw,38px);transition:opacity .5s}
.wall{position:absolute;left:0;top:clamp(120px,19vh,190px);width:100%;transform-origin:0 0;transition:transform 1s cubic-bezier(.22,.8,.3,1);-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 30%,#000 84%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0,#000 30%,#000 84%,transparent 100%);overflow:visible}
.wall img{filter:brightness(.74) contrast(1.06);transition:filter .8s}
.board{cursor:pointer}
.board:hover,.board:focus-visible{box-shadow:0 0 0 100vmax rgba(14,16,20,.55);outline:1px solid var(--acc)}
.labs{position:absolute;left:0;right:0;z-index:4;transition:opacity .4s}
.labs li{position:absolute;transform:translateX(-50%);white-space:nowrap}
.labs a{display:block;padding:.3rem .5rem;font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);transition:color .2s}
.labs a:hover{color:var(--fg)}
.caps{position:absolute;left:var(--gut);right:var(--gut);bottom:clamp(22px,4.5vh,44px);z-index:4;display:flex;justify-content:center;gap:clamp(24px,5vw,72px);transition:opacity .4s}
.caps a{font:300 clamp(18px,1.6vw,22px)/1 var(--serif);color:var(--mute);transition:color .25s}
.caps a:hover{color:var(--fg)}
.panel{position:absolute;left:58%;top:50%;width:min(34%,460px);transform:translateY(-46%);z-index:6;opacity:0;pointer-events:none;transition:opacity .5s .55s,transform .7s .55s cubic-bezier(.22,.8,.3,1)}
.panel h2{margin:0;font:300 clamp(30px,3vw,46px)/1.05 var(--serif);letter-spacing:-.015em}
.panel p{margin:.8rem 0 1.4rem;color:var(--mute);max-width:36ch}
.panel ul{border-top:1px solid var(--rule)}
.panel li{border-bottom:1px solid var(--rule)}
.panel li a,.panel li span{display:flex;justify-content:space-between;align-items:center;padding:.7rem 0;font-size:13.5px;letter-spacing:.02em}
.panel li a:hover{color:var(--acc)}
.panel li span{color:var(--mute);font-style:italic}
.panel .back{display:inline-block;margin-top:1.6rem;padding:.55rem 1rem;border:1px solid var(--rule);font-size:11.5px;letter-spacing:.1em;text-transform:uppercase;background:none;color:var(--fg);cursor:pointer;font-family:inherit}
.panel .back:hover{border-color:var(--acc);color:var(--acc)}
.home.zoomed .slogan,.home.zoomed .labs,.home.zoomed .caps{opacity:0;pointer-events:none}
.home.zoomed .board{pointer-events:none}
.home.zoomed .board.sel{box-shadow:0 0 0 200vmax rgba(14,16,20,.93);outline:0}
.home.zoomed .panel.on{opacity:1;pointer-events:auto;transform:translateY(-50%)}
@media (max-width:760px){.home{height:auto;min-height:0;overflow:visible}.home .hdr{position:relative}.home .slogan{position:relative;left:auto;top:auto;margin:30px var(--gut) 0}.wall{position:relative;top:0;margin-top:20px}.caps{position:relative;left:auto;right:auto;bottom:auto;margin:30px var(--gut);flex-wrap:wrap}.panel{display:none}}
@media (prefers-reduced-motion:reduce){.wall,.panel{transition:none!important}}
`;
const zoom = `${head('Analytika – Vegg, zoom (sketch)', zoomCss, fonts('Cormorant+Garamond:wght@300;400', 'Poppins:wght@400;500'))}
<div class="home" id="home">
<header class="hdr"><a href="vegg-zoom.html" aria-label="Analytika, home">${LOGO}</a><nav><a href="../site/about.html#join">Join us</a><a href="../site/about.html#contact">Contact</a></nav></header>
<h1 class="slogan">Uncertainty is our trade.</h1>
<figure class="wall" id="wall" style="margin:0"><img src="${IMG}" alt="${ALT}">${A.map((a) => `<a class="board" data-id="${a.id}" href="../site/insights.html#${a.id}" aria-label="${a.name}" style="${boardStyle(a.rect)}"></a>`).join('')}</figure>
<ul class="labs" id="labs" style="top:0">${A.map((a) => `<li style="left:${a.cx.toFixed(2)}%"><a data-id="${a.id}" href="../site/insights.html#${a.id}">${a.name}</a></li>`).join('')}</ul>
<nav class="caps" aria-label="Pages"><a href="../site/people.html">People</a><a href="../site/products.html">Products</a><a href="../site/about.html">About us</a></nav>
${A.map((a) => `<section class="panel" data-id="${a.id}" aria-label="${a.name}"><h2>${a.name}</h2><p>${a.line}</p><ul>${a.subs.map((s) => (a.id === 'actuary' ? `<li><a href="../site/insights-actuary-${{ 'Risk actuary': 'risk', Compliance: 'compliance', Reserving: 'reserving', 'Life and pension': 'life-pension' }[s]}.html">${s}<span aria-hidden="true">→</span></a></li>` : `<li><span>${s}</span></li>`)).join('')}</ul><button class="back" type="button">Back to the wall</button></section>`).join('')}
</div>
${mlist((a) => `../site/insights.html#${a.id}`)}
<div class="foot" style="padding-top:18px"><span>Analytika AS · Parkveien 41B, 0258 Oslo</span><span><a href="../site/about.html#join">Join us</a> &nbsp; <a href="../site/about.html#contact">Contact</a></span></div>
${SKETCH('Sketch, round 2 · click a board and the picture moves in on it; Escape or the button goes back. There is no Insights link: the wall is Insights. The picture is a little soft when zoomed because the file is 1914 px wide.')}
<script>(function(){
var IW=${IW},IH=${IH},R=${JSON.stringify(Object.fromEntries(A.map((a) => [a.id, a.rect])))};
var home=document.getElementById('home'),wall=document.getElementById('wall'),labs=document.getElementById('labs');
function place(){var t=wall.offsetTop,h=wall.offsetHeight;labs.style.top=(t+h*.925)+'px';}
place();addEventListener('resize',place);addEventListener('load',place);
if(matchMedia('(max-width:760px)').matches)return;
function open(id){
  var r=R[id],ww=wall.offsetWidth,wh=wall.offsetHeight,k=ww/IW,bx=r[0]*k,by=r[1]*k,bw=(r[2]-r[0])*k,bh=(r[3]-r[1])*k,vw=home.clientWidth,vh=home.clientHeight;
  var s=Math.min(vw*.36/bw,vh*.80/bh),cx=vw*.30,cy=vh*.52,tx=cx-s*(bx+bw/2),ty=cy-wall.offsetTop-s*(by+bh/2);
  wall.style.transform='translate('+tx+'px,'+ty+'px) scale('+s+')';
  home.classList.add('zoomed');
  [].forEach.call(wall.querySelectorAll('.board'),function(b){b.classList.toggle('sel',b.dataset.id===id);});
  [].forEach.call(document.querySelectorAll('.panel'),function(p){p.classList.toggle('on',p.dataset.id===id);});
  window.scrollTo(0,0);
}
function close(){wall.style.transform='';home.classList.remove('zoomed');}
[].forEach.call(document.querySelectorAll('.board,.labs a'),function(a){a.addEventListener('click',function(e){e.preventDefault();open(a.dataset.id);});});
[].forEach.call(document.querySelectorAll('.back'),function(b){b.addEventListener('click',close);});
addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();</script>
</body></html>`;

write('vegg-hvit.html', hvit);
write('vegg-marine.html', marine);
write('vegg-zoom.html', zoom);
