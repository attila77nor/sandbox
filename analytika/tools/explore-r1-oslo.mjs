/* Round 1, direction "Oslo-lys": the page is lit by the sky over Oslo right now.
   The year's daylight curve (real astronomy for 59.9 N) is the only picture; the four pages sit on its
   two equinoxes and two solstices. The ground colour follows the sun's elevation over Oslo. */
import { write, logoDefs, LOGO, fonts, PEOPLE, AREA_NAMES, SKETCH } from './explore-shared.mjs';

const LAT = 59.9139;
const rad = Math.PI / 180;
const doy = (m, d) => Math.round((Date.UTC(2026, m - 1, d) - Date.UTC(2026, 0, 0)) / 864e5);
const decl = (N) => -Math.asin(0.39779 * Math.cos(rad * (0.98565 * (N + 10) + 1.914 * Math.sin(rad * 0.98565 * (N - 2))))) ; // radians
/* hours with the sun above `alt` degrees; 24 when it never drops below it */
const lenAbove = (N, alt) => {
  const d = decl(N), c = (Math.sin(alt * rad) - Math.sin(LAT * rad) * Math.sin(d)) / (Math.cos(LAT * rad) * Math.cos(d));
  return (24 / Math.PI) * Math.acos(Math.max(-1, Math.min(1, c)));
};
const dayLen = (N) => lenAbove(N, -0.833);
const lightLen = (N) => lenAbove(N, -6); // including civil twilight
const hm = (h) => `${Math.floor(h)} h ${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
const Y0 = 4, Y1 = 24; // hours shown
const yPct = (h) => 100 - ((h - Y0) / (Y1 - Y0)) * 100;
const xPct = (N) => (N / 365) * 100;

const pts = []; for (let N = 1; N <= 365; N += 2) pts.push([xPct(N), yPct(dayLen(N))]);
const P = (arr) => 'M' + arr.map(([x, y]) => `${(x * 10).toFixed(1)} ${(y * 3).toFixed(1)}`).join('L');
const path = P(pts);
const tw = []; for (let N = 1; N <= 365; N += 2) tw.push([xPct(N), yPct(lightLen(N))]);
const twPath = P(tw);
const band = P(pts) + 'L' + tw.slice().reverse().map(([x, y]) => `${(x * 10).toFixed(1)} ${(y * 3).toFixed(1)}`).join('L') + 'Z';
const KEYS = [
  { w: 'People', href: 'oslo-people.html', N: doy(3, 20), date: '20 March', cls: 'br' },
  { w: 'Insights', href: 'insights.html', N: doy(6, 21), date: '21 June', cls: 'c' },
  { w: 'Products', href: 'products.html', N: doy(9, 22), date: '22 September', cls: 'bl' },
  { w: 'About us', href: 'about.html', N: doy(12, 21), date: '21 December', cls: 'c2' },
];
const keys = KEYS.map((k) => { const h = dayLen(k.N); return `<a class="key ${k.cls}" href="${k.href}" style="--x:${xPct(k.N).toFixed(2)}%;--yf:${(yPct(h) / 100).toFixed(4)}"><i class="pt"></i><span class="w">${k.w}</span></a>`; }).join('');
const months = 'JFMAMJJASOND'.split('').map((m, i) => `<span style="left:${xPct(doy(i + 1, 15)).toFixed(2)}%">${m}</span>`).join('');
const noon = yPct(12);

/* ground and ink, from the sun's elevation. Written once and shared by every page. */
const SKY = `<script>(function(){
var LAT=${LAT},LON=10.7522,R=Math.PI/180;
function elev(t){var jd=t/864e5+2440587.5,n=jd-2451545,L=(280.46+.9856474*n)%360,g=((357.528+.9856003*n)%360)*R,lam=(L+1.915*Math.sin(g)+.02*Math.sin(2*g))*R,e=(23.439-4e-7*n)*R,dec=Math.asin(Math.sin(e)*Math.sin(lam)),ra=Math.atan2(Math.cos(e)*Math.sin(lam),Math.cos(lam)),gm=(18.697374558+24.06570982441908*n)%24,lst=((gm*15+LON)%360)*R,ha=lst-ra;return Math.asin(Math.sin(LAT*R)*Math.sin(dec)+Math.cos(LAT*R)*Math.cos(dec)*Math.cos(ha))/R;}
function mix(a,b,t){return a.map(function(v,i){return Math.round(v+(b[i]-v)*t);});}
var NIGHT=[9,17,38],DUSK=[78,106,152],DAY=[236,241,247],INK=[8,14,30],PALE=[236,242,250];
function lum(c){var f=c.map(function(v){v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*f[0]+.7152*f[1]+.0722*f[2];}
function css(c){return 'rgb('+c.join(',')+')';}
function paint(){
  var q=location.search.match(/[?&]at=([^&]+)/),d=q?new Date(decodeURIComponent(q[1])):new Date(),t=d.getTime(),el=elev(t);
  var x=Math.min(1,Math.max(0,(el+12)/24));x=x*x*(3-2*x);
  var bg=x<.5?mix(NIGHT,DUSK,x*2):mix(DUSK,DAY,(x-.5)*2),dark=lum(bg)>.2,fg=dark?INK:PALE;
  var r=document.documentElement.style;
  r.setProperty('--bg',css(bg));r.setProperty('--fg',css(fg));
  r.setProperty('--mute','rgba('+fg.join(',')+',.66)');r.setProperty('--rule','rgba('+fg.join(',')+',.26)');
  r.setProperty('--acc',dark?'#036194':'#7CC3EA');
  r.setProperty('--lg-ink',css(fg));r.setProperty('--lg-word',css(fg));
  window.__sky={t:t,el:el,d:d};
  document.dispatchEvent(new Event('sky'));
}
paint();setInterval(paint,6e4);document.addEventListener('visibilitychange',paint);
})();</script>`;

/* today's marker and the readout (only a convenience; the page works without it) */
const TODAY = `<script>document.addEventListener('sky',function(){
var s=window.__sky,m=document.getElementById('today');if(!m)return;
var d=s.d,jan=Date.UTC(d.getUTCFullYear(),0,0),N=Math.round((Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate())-jan)/864e5);
var R=Math.PI/180,dec=-Math.asin(.39779*Math.cos(R*(.98565*(N+10)+1.914*Math.sin(R*.98565*(N-2))))),c=(Math.sin(-.833*R)-Math.sin(${LAT}*R)*Math.sin(dec))/(Math.cos(${LAT}*R)*Math.cos(dec)),h=24/Math.PI*Math.acos(Math.max(-1,Math.min(1,c)));
m.style.setProperty('--x',(N/365*100).toFixed(2)+'%');m.style.setProperty('--yf',((100-(h-${Y0})/${Y1 - Y0}*100)/100).toFixed(4));
var tf=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Oslo',hour:'2-digit',minute:'2-digit'}).format(d);
document.getElementById('now').textContent='Oslo '+tf+' · sun '+(s.el>=0?'':'−')+Math.abs(s.el).toFixed(0)+'° · '+Math.floor(h)+' h '+('0'+Math.round((h%1)*60)).slice(-2)+' min of daylight today';
m.hidden=false;});if(window.__sky)document.dispatchEvent(new Event('sky'));</script>`;

const CSS = `
:root{--bg:#ECF1F7;--fg:#08101E;--mute:rgba(8,14,30,.66);--rule:rgba(8,14,30,.26);--acc:#036194;--lg-ink:#08101E;--lg-word:#08101E;--lg-blue:#1B92D0;--lg-deep:#1B92D0;
  --gut:clamp(20px,3.4vw,48px);--sans:"Schibsted Grotesk","Helvetica Neue",Arial,sans-serif;--serif:"Newsreader",Georgia,serif}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;min-height:100vh;min-height:100svh;background:var(--bg);color:var(--fg);font:400 13.5px/1.55 var(--sans);transition:background-color 1.2s,color 1.2s;overflow-x:hidden}
a{color:inherit;text-decoration:none}
::selection{background:var(--acc);color:var(--bg)}
:focus-visible{outline:1.5px solid var(--acc);outline-offset:5px;border-radius:2px}
ul,ol{margin:0;padding:0;list-style:none}
.logo{display:block;height:clamp(20px,1.9vw,26px);aspect-ratio:5.349}
.hdr{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:clamp(18px,2.6vw,32px) var(--gut)}
.hdr nav{display:flex;flex-wrap:wrap;gap:.3rem clamp(14px,1.8vw,26px);font-size:12.5px;letter-spacing:.03em}
.hdr nav a{color:var(--mute);transition:color .2s}
.hdr nav a:hover,.hdr nav a[aria-current]{color:var(--fg)}
.hdr nav a[aria-current]{text-decoration:underline;text-underline-offset:.45em;text-decoration-thickness:1px}
.hdr nav .gap{margin-left:clamp(0px,1.4vw,18px)}
.sketch{margin:0;padding:0 var(--gut) 18px;font-size:12px;color:var(--mute)}
.foot{display:flex;justify-content:space-between;gap:1rem;padding:0 var(--gut) 14px;font-size:12px;color:var(--mute)}
.foot a:hover{color:var(--fg)}

/* home */
.home{min-height:100vh;min-height:100svh;display:flex;flex-direction:column}
.lede{padding:clamp(40px,9vh,110px) var(--gut) 0}
.slogan{margin:0;font:300 clamp(26px,2.6vw,38px)/1.12 var(--serif);letter-spacing:-.012em}
.areas{margin:1.15rem 0 0;display:flex;flex-wrap:wrap;gap:.2rem 1.5rem;font-size:12px;letter-spacing:.05em;color:var(--mute)}
.areas a:hover{color:var(--fg);text-decoration:underline;text-underline-offset:.4em;text-decoration-thickness:1px}
.plot{position:relative;flex:1;min-height:340px;margin:clamp(20px,5vh,60px) var(--gut) 0}
.plot svg{position:absolute;inset:0;width:100%;height:calc(100% - 26px);overflow:visible}
.plot .curve{fill:none;stroke:var(--fg);stroke-width:1.4;vector-effect:non-scaling-stroke;stroke-linecap:round;stroke-linejoin:round}
.plot .ref{stroke:var(--rule);stroke-width:1;stroke-dasharray:2 5;vector-effect:non-scaling-stroke}
.plot .ax{stroke:var(--rule);stroke-width:1;vector-effect:non-scaling-stroke}
.plot .band{fill:var(--fg);opacity:.06;stroke:none}
.plot .twl{fill:none;stroke:var(--fg);stroke-width:1;stroke-dasharray:1 4;stroke-linecap:round;vector-effect:non-scaling-stroke;opacity:.75}
.plot .noon.top24{top:0}
.plot .mo{position:absolute;left:0;right:0;bottom:0;height:22px;font-size:12px;color:var(--mute);letter-spacing:.06em}
.plot .mo span{position:absolute;transform:translateX(-50%)}
.plot .noon{position:absolute;left:0;top:calc((100% - 26px) * ${(noon / 100).toFixed(4)} + 4px);font-size:12px;color:var(--mute)}
.key{position:absolute;left:var(--x);top:calc((100% - 26px) * var(--yf));display:block;white-space:nowrap}
.key .pt{position:absolute;left:0;top:0;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:var(--bg);border:1.4px solid var(--fg);transition:background .25s,transform .25s,border-color .25s}
.key .w{position:absolute;bottom:14px;font:300 clamp(19px,1.7vw,24px)/1 var(--serif);letter-spacing:-.005em;color:var(--fg);transition:color .25s}
.key.br .w{bottom:auto;top:12px;left:8px}.key.bl .w{bottom:auto;top:12px;right:8px}.key.c .w{left:0;transform:translateX(-50%)}.key.c2 .w{left:0;transform:translateX(-72%)}
.key:hover .pt,.key:focus-visible .pt{background:var(--acc);border-color:var(--acc);transform:scale(1.6)}
.key:hover .w,.key:focus-visible .w{color:var(--acc)}
#today{position:absolute;left:var(--x);top:calc((100% - 26px) * var(--yf))}
#today .pt{position:absolute;width:9px;height:9px;margin:-4.5px 0 0 -4.5px;border-radius:50%;background:var(--acc)}
#today .pt::after{content:"";position:absolute;inset:-7px;border-radius:50%;border:1px solid var(--acc);opacity:.55}
.readout{display:flex;justify-content:space-between;gap:1rem;padding:0 var(--gut) 8px;font-size:12px;color:var(--mute);letter-spacing:.02em}
@media (prefers-reduced-motion:no-preference){.plot svg{clip-path:inset(-10px 100% -10px 0);animation:draw 2.8s cubic-bezier(.22,.7,.3,1) .2s forwards}@keyframes draw{to{clip-path:inset(-10px -10px -10px 0)}}}
@media (max-width:760px){.key .w{font-size:17px}.key.c2 .w{transform:translateX(-90%)}.readout{flex-direction:column}}

/* people */
.page{padding:clamp(26px,6vh,64px) var(--gut) 8vh}
.page h1{margin:0;font:300 clamp(26px,2.6vw,38px)/1.12 var(--serif);letter-spacing:-.012em}
.page .sub{margin:.8rem 0 0;max-width:52ch;color:var(--mute)}
.al{position:relative;height:90px;margin:clamp(90px,18vh,190px) 0 0}
.al::before{content:"";position:absolute;left:0;right:0;top:50%;height:1px;background:var(--fg)}
.al li{position:absolute;left:var(--x);top:50%;transform:translate(-50%,-50%)}
.al a{display:block;position:relative;padding:10px}
.al .dot{display:block;width:11px;height:11px;border-radius:50%;background:var(--fg);transition:background .25s,transform .25s}
.al .open .dot{background:var(--bg);border:1.2px dashed var(--fg)}
.al a:hover .dot,.al a:focus-visible .dot{background:var(--acc);transform:scale(1.45)}
.al .tip{position:absolute;bottom:calc(100% + 4px);left:50%;transform:translateX(-50%);display:none;white-space:nowrap;padding:.4rem .7rem;background:var(--bg);border:1px solid var(--rule);font-size:12.5px}
.al a:hover .tip,.al a:focus-visible .tip{display:block}
.al .yr{position:absolute;top:calc(100% - 2px);left:50%;transform:translateX(-50%);font-size:12px;color:var(--mute)}
.alist{margin:clamp(56px,10vh,110px) 0 0;columns:3;column-gap:2.4rem;max-width:960px;font-size:13px;counter-reset:n}
.alist li{break-inside:avoid;padding:.22rem 0;border-top:1px solid var(--rule);counter-increment:n;display:flex;gap:1rem}
.alist li::before{content:counter(n,decimal-leading-zero);width:1.6rem;color:var(--mute);font-variant-numeric:tabular-nums}
.alist a:hover{text-decoration:underline;text-underline-offset:.3em;text-decoration-thickness:1px}
@media (max-width:760px){.alist{columns:1}.al{overflow:visible}}
`;

const head = (title) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>${fonts('Newsreader:opsz,wght@6..72,300;6..72,400', 'Schibsted+Grotesk:wght@400;500')}${SKY}<style>${CSS}</style></head><body>${logoDefs}`;

const nav = (cur) => `<nav>${[['People', 'people'], ['Insights', 'insights'], ['Products', 'products'], ['About us', 'about']].map(([w, k]) => `<a href="${k === 'people' ? 'oslo-people' : k}.html"${k === cur ? ' aria-current="page"' : ''}>${w}</a>`).join('')}<a class="gap" href="about.html#join">Join us</a><a href="about.html#contact">Contact</a></nav>`;

const home = `${head('Analytika – Oslo-lys (sketch)')}
<div class="home">
<header class="hdr"><a href="oslo.html" aria-label="Analytika, home">${LOGO}</a><nav><a href="about.html#join">Join us</a><a href="about.html#contact">Contact</a></nav></header>
<main>
<div class="lede"><h1 class="slogan">Uncertainty is our trade.</h1>
<p class="areas">${AREA_NAMES.map((a) => `<a href="insights.html">${a}</a>`).join('')}</p></div>
</main>
<div class="plot" role="group" aria-label="Hours of daylight in Oslo through the year. People, Insights, Products and About us sit on the two equinoxes and the two solstices.">
<svg viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true"><path class="band" d="${band}"/><path class="ref" d="M0 ${(noon * 3).toFixed(1)}H1000"/><path class="twl" d="${twPath}"/><path class="ax" d="M0 300H1000"/><path class="curve" d="${path}"/></svg>
<span class="noon">12 h</span><span class="noon top24">24 h</span>
${keys}
<span id="today" hidden><i class="pt"></i></span>
<div class="mo" aria-hidden="true">${months}</div>
</div>
<div class="readout"><span id="now">Oslo · 59.9° N</span><span>Daylight in Oslo through the year, and the light before and after it. The four pages sit on the equinoxes and solstices.</span></div>
<div class="foot"><span>Analytika AS · Parkveien 41B, 0258 Oslo</span><span><a href="about.html#join">Join us</a> &nbsp; <a href="about.html#contact">Contact</a></span></div>
${SKETCH('Sketch, round 1 · the ground follows the sun over Oslo; add ?at=2026-06-21T22:00Z to preview another moment. Slogan and areas are placeholders.')}
</div>${TODAY}</body></html>`;

const arrivals = PEOPLE.map((n, i) => `<li style="--x:${(3 + (i / (PEOPLE.length + 3)) * 94).toFixed(2)}%"><a href="#" aria-label="${n}"><span class="dot"></span><span class="tip">${n}</span>${i === 8 ? '<span class="yr">2019</span>' : ''}${i === 20 ? '<span class="yr">2026</span>' : ''}</a></li>`).join('');
const opens = [0, 1, 2].map((i) => `<li class="open" style="--x:${(3 + ((PEOPLE.length + i + 1) / (PEOPLE.length + 3)) * 94).toFixed(2)}%"><a href="about.html#join" aria-label="Open role"><span class="dot"></span><span class="tip">Open</span></a></li>`).join('');
const people = `${head('People – Analytika – Oslo-lys (sketch)')}
<header class="hdr"><a href="oslo.html" aria-label="Analytika, home">${LOGO}</a>${nav('people')}</header>
<main class="page"><h1>People</h1><p class="sub">In the order they arrived. Open circles are the roles we have not filled.</p>
<ol class="al" aria-label="People in order of arrival (positions illustrative)">${arrivals}${opens}</ol>
<ol class="alist">${PEOPLE.map((n) => `<li><a href="#">${n}</a></li>`).join('')}</ol></main>
${SKETCH('Sketch, round 1 · names are those used in earlier sketches; order of arrival is illustrative, only 2019 and 2026 are known.')}</body></html>`;

write('oslo.html', home);
write('oslo-people.html', people);
