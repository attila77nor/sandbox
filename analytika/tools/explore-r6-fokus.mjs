/* Round 6: the landing page built with the new skills (gsap-core, gsap-timeline, gsap-scrolltrigger, gsap-performance,
   transitions-dev, transitions-polish, make-interfaces-feel-better).
   The idea is a camera focus pull. The room arrives out of focus and focus lands on the work desk, the boards stay soft in
   the background. Scrolling lets the focus slip away and the picture dissolves into white. Pointing at a board pulls focus
   to it, and one label travels between the boards. The photographs are the ones from the crop analysis (1.2x, work desk).
   GSAP and ScrollTrigger are inlined, so the page is still one file (plus the web font). */
import { readFileSync } from 'node:fs';
import { write, logoDefs, fonts, SKETCH } from './explore-shared.mjs';

const vendor = (f) => { const s = readFileSync(new URL('../assets/vendor/gsap/' + f, import.meta.url), 'utf8'); if (/<\/script/i.test(s)) throw new Error(f + ' contains a script end tag'); return s; };

const IW = 1672, IH = 941;
const BOARD_IDS = [['actuary', 'Actuary'], ['pricing', 'Pricing'], ['data-platforms', 'Data platforms'], ['consulting', 'Consulting'], ['business-development', 'Business development']];
const RECTS = [[567, 380, 654, 469], [661, 380, 749, 469], [756, 380, 844, 469], [851, 380, 939, 469], [945, 380, 1028, 469]];
const PH = '../../assets/photo/ekte-kontor-v5-';
const SRC = { sharp: PH + 'neutral.jpg', soft: PH + 'dof-alle-sterk.jpg', lett: PH + 'dof-s1-lett.jpg', middels: PH + 'dof-s1-middels.jpg', sterk: PH + 'dof-s1-sterk.jpg' };
const ROWS = [['People', '../site/people.html'], ['Insights', '../site/insights.html'], ['Products', '../site/products.html'], ['About us', '../site/about.html']];
const ARROW = '<svg class="arr" viewBox="0 0 76 12" aria-hidden="true" focusable="false"><path d="M0 6h74M69 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* the same framing as the crop analysis' winner, and the part that must stay in view (boards plus the sign over them) */
const CFG = { IW, IH, Z: 1.2, FX: 667, FY: 542, TX: 0.5, TY: 0.5, wall: { x: 797, y: 322, h: 104 }, R: Object.fromEntries(BOARD_IDS.map(([id], i) => [id, RECTS[i]])), VAR: { ingen: SRC.sharp, lett: SRC.lett, middels: SRC.middels, sterk: SRC.sterk } };
CFG.KP = [Math.min(...RECTS.map((r) => r[0])) - 24, Math.min(RECTS[0][1] - 24, Math.round(CFG.wall.y - 0.38 * CFG.wall.h)), Math.max(...RECTS.map((r) => r[2])) + 24, Math.max(...RECTS.map((r) => r[3])) + 24];

const CSS = `
/* transitions-dev: the shared motion scale (the tokens this page uses) and the two snippets, texts reveal and tooltip */
:root{--duration-stagger:40ms;--duration-micro:80ms;--duration-quick:150ms;--duration-fast:250ms;--duration-medium:350ms;--duration-very-slow:500ms;--distance-base:8px;
  --ease-smooth-out:cubic-bezier(0.22,1,0.36,1);--ease-in-out:ease-in-out;--ease-out:ease-out;
  --stagger-dur:500ms;--stagger-distance:12px;--stagger-stagger:40ms;--stagger-blur:3px;--stagger-ease:cubic-bezier(0.22,1,0.36,1);
  --tt-in-dur:150ms;--tt-out-dur:50ms;--tt-scale:0.98;--tt-delay:80ms;--tt-in-ease:ease-out;--tt-out-ease:ease-out;--tt-move-dur:160ms;--tt-move-ease:cubic-bezier(0.22,1,0.36,1);--tt-bg:#ffffff;--tt-fg:#2f2f2f;
  --ink:#14161B;--mute:#575C67;--rule:rgba(20,22,27,.09);--acc:#036194;--gut:clamp(20px,3.6vw,56px);--sans:"Hanken Grotesk","Helvetica Neue",Arial,sans-serif;
  --lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:#fff;color:var(--ink);font:400 14px/1.55 var(--sans);overflow-x:hidden;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
a{color:inherit;text-decoration:none}
::selection{background:var(--ink);color:#fff}
:focus-visible{outline:1.5px solid #fff;outline-offset:4px}
.rows :focus-visible,.foot :focus-visible{outline-color:var(--acc)}
ul,ol{margin:0;padding:0;list-style:none}

/* the photograph, fixed: the soft frame under, the work-desk frame over it. Opacity is the only thing that moves. */
.photo{position:fixed;inset:0;z-index:0;background:#2a2c31;overflow:hidden}
.photo img{position:absolute;display:block;max-width:none;object-fit:fill}
.photo .fin{position:absolute;inset:0}
.js .photo .fin{opacity:0}
.veil{position:fixed;inset:0;z-index:2;background:#fff;opacity:0;pointer-events:none}

/* the five boards: hotspots over the picture. The sharp version of each board sits inside it and fades in when it is pointed at. */
.boards{position:fixed;inset:0;z-index:1;pointer-events:none}
.boards::before{content:"";position:absolute;inset:0;background:rgba(8,10,14,.42);opacity:0;transition:opacity var(--duration-quick) var(--ease-out)}
.boards.lit::before{opacity:1;transition-duration:var(--duration-fast)}
.board{position:absolute;display:block;pointer-events:auto;outline:0}
.board .sh{position:absolute;inset:0;background:var(--sharp) no-repeat;filter:contrast(1.04);opacity:0;pointer-events:none;transition:opacity var(--duration-quick) var(--ease-out)}
.board:hover .sh,.board:focus-visible .sh{opacity:1;transition-duration:var(--duration-fast)}
body.past .board{pointer-events:none}

/* transitions-dev, tooltip: one label for all five boards, it fades in after 80 ms and travels from board to board. Below the boards, since the title sits above. */
.t-tt{position:absolute;left:0;top:0;box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;width:0;overflow:hidden;
  translate:var(--tt-x,0px) var(--tt-y,0px);scale:var(--tt-scale);transform-origin:50% 0;padding:8px 12px;border-radius:8px;background:var(--tt-bg);color:var(--tt-fg);
  font-size:12.5px;line-height:1.2;letter-spacing:.02em;white-space:nowrap;box-shadow:0 0 0 1px rgba(0,0,0,.06),0 2px 6px 0 rgba(0,0,0,.05),0 4px 42px 0 rgba(0,0,0,.06);
  opacity:0;pointer-events:none;
  transition:opacity var(--tt-out-dur) var(--tt-out-ease),scale var(--tt-out-dur) var(--tt-out-ease),translate var(--tt-move-dur) var(--tt-move-ease),width var(--tt-move-dur) var(--tt-move-ease)}
.t-tt[data-show="true"]{opacity:1;scale:1;
  transition:opacity var(--tt-in-dur) var(--tt-in-ease) var(--tt-delay),scale var(--tt-in-dur) var(--tt-in-ease) var(--tt-delay),translate var(--tt-move-dur) var(--tt-move-ease),width var(--tt-move-dur) var(--tt-move-ease)}
.t-tt-text{white-space:nowrap}

/* the first screen */
.top{position:absolute;z-index:3;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:center;padding:clamp(18px,2.4vw,30px) var(--gut);color:#fff;pointer-events:none}
.top a{position:relative;pointer-events:auto}
.top a::after{content:"";position:absolute;inset:-8px}            /* hit area of at least 44 px around the 30-38 px mark */
.mark{display:block;width:clamp(30px,2.6vw,38px);aspect-ratio:1.07}
.js .top .mark-link{opacity:0;transition:opacity var(--duration-very-slow) var(--ease-in-out)}
.js .top.is-shown .mark-link{opacity:1}
.hero{position:relative;z-index:3;height:100vh;height:100svh;min-height:480px;pointer-events:none}
.lift{position:absolute;inset:0;pointer-events:none}                /* GSAP moves and fades this on scroll; the title inside is positioned from the photograph's own coordinates */
.t-stagger{position:static}
.hero h1{position:absolute;left:0;top:0;translate:-50% -50%;margin:0;font:600 clamp(40px,5.4vw,80px)/1 var(--sans);letter-spacing:-.04em;white-space:nowrap;color:#fff;text-wrap:balance;
  text-shadow:0 2px 30px rgba(0,0,0,.5),0 0 3px rgba(0,0,0,.2)}
/* transitions-dev, texts reveal: the title rises into place with a short blur, once */
.t-stagger-line{display:block;opacity:0;transform:translateY(var(--stagger-distance));filter:blur(var(--stagger-blur));
  transition:opacity var(--stagger-dur) var(--stagger-ease),transform var(--stagger-dur) var(--stagger-ease),filter var(--stagger-dur) var(--stagger-ease);will-change:transform,opacity,filter}
.t-stagger.is-shown .t-stagger-line{opacity:1;transform:translateY(0);filter:blur(0)}
html:not(.js) .t-stagger-line{opacity:1;transform:none;filter:none}
.areasline{display:none}
.dissolve{position:relative;z-index:3;height:90vh;height:90svh;pointer-events:none}

/* the four rows. Hover is a plain colour change (150 ms); the arrow moves 8 px, nothing else. */
.rows{position:relative;z-index:4}
.row{position:relative;display:flex;align-items:center;gap:clamp(16px,4vw,64px);min-height:clamp(104px,17vh,168px);padding:0 var(--gut);border-top:1px solid var(--rule);transition:background-color var(--duration-quick) var(--ease-out)}
.row:nth-child(1){background:#fff;border-top:0}.row:nth-child(2){background:#F5F5F6}.row:nth-child(3){background:#EBECEE}.row:nth-child(4){background:#E1E2E5}
.row:hover,.row:focus-visible{background:#D5D7DB}
.row .n{flex:none;width:2.2rem;font-size:12px;color:var(--mute);font-variant-numeric:tabular-nums}
.row .w{flex:1;font:400 clamp(20px,1.9vw,26px)/1.1 var(--sans);letter-spacing:-.012em;text-wrap:balance}
.row .arr{flex:none;width:clamp(54px,5.4vw,76px);height:12px;color:var(--mute);transition:transform var(--duration-fast) var(--ease-smooth-out),color var(--duration-quick) var(--ease-out)}
.row:hover .arr,.row:focus-visible .arr{transform:translateX(var(--distance-base,8px));color:var(--ink)}
.row .lm{flex:none;width:clamp(34px,3.2vw,46px);aspect-ratio:1.07;margin-right:clamp(10px,3vw,48px);--lg-ink:#1E3363;--lg-word:#1E3363;--lg-blue:#1B92D0;--lg-deep:#036194}
.foot{position:relative;z-index:4;display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem 1rem;padding:32px 48px 12px;background:#E1E2E5;font-size:12.5px;color:#5C616C}
.foot a:hover{color:var(--ink)}
.sketch{position:relative;z-index:4;margin:0;padding:6px var(--gut) 16px;background:#E1E2E5;font-size:12px;color:#5C616C}
@media (max-width:760px){.foot{padding:24px 20px 12px}
  .areasline{display:flex;flex-wrap:wrap;gap:.2rem 1.1rem;position:absolute;left:var(--gut);right:var(--gut);bottom:clamp(22px,5vh,44px);font-size:12.5px;letter-spacing:.04em;color:rgba(255,255,255,.9);text-shadow:0 1px 10px rgba(0,0,0,.55);pointer-events:auto}}
/* reduced motion: the picture is simply there, the title is simply there; scrolling still fades the photograph to white */
@media (prefers-reduced-motion:reduce){.t-stagger-line,.t-tt,.top .mark-link,.boards::before,.board .sh,.row,.row .arr{transition:none !important}}
`;

const SCRIPT = String.raw`(function(){
var C=__CFG__,IW=C.IW,IH=C.IH,Z=C.Z,ph=document.getElementById('ph'),soft=document.getElementById('soft'),box=ph.parentNode.parentNode,
  boardsEl=document.getElementById('boards'),bs=[].slice.call(document.querySelectorAll('.board')),h1=document.querySelector('.hero h1'),
  stagger=document.querySelector('.t-stagger'),topEl=document.querySelector('.top'),lift=document.querySelector('.lift'),veil=document.querySelector('.veil'),fin=document.querySelector('.fin');

/* framing: the photograph is placed from its own coordinates; the zoom is lowered where it would push the boards or the sign out of view */
function lay(){
  var vw=box.clientWidth,vh=box.clientHeight,s0=Math.max(vw/IW,vh/IH),z=vw<760?1:Z,fx=vw<760?(C.KP[0]+C.KP[2])/2:C.FX,KP=C.KP;
  if(z>1){var q=[vw*C.TX/(fx-KP[0]),vw*(1-C.TX)/(KP[2]-fx),vh*C.TY/(C.FY-KP[1]),vh*(1-C.TY)/(KP[3]-C.FY)].filter(function(v){return v>0&&isFinite(v);}).map(function(v){return v/s0;});z=Math.max(1,Math.min.apply(null,[z].concat(q)));}
  var s=s0*z,ox=vw*C.TX-fx*s,oy=vh*C.TY-C.FY*s;ox=Math.min(0,Math.max(vw-IW*s,ox));oy=Math.min(0,Math.max(vh-IH*s,oy));
  [ph,soft].forEach(function(im){im.style.left=ox+'px';im.style.top=oy+'px';im.style.width=(IW*s)+'px';im.style.height=(IH*s)+'px';});
  h1.style.left=(ox+C.wall.x*s)+'px';h1.style.top=(oy+C.wall.y*s)+'px';h1.style.fontSize=Math.max(34,C.wall.h*s*.6)+'px';
  bs.forEach(function(b){var r=C.R[b.dataset.id],x0=ox+r[0]*s,y0=oy+r[1]*s;
    b.style.left=x0+'px';b.style.top=y0+'px';b.style.width=((r[2]-r[0])*s)+'px';b.style.height=((r[3]-r[1])*s)+'px';
    var sh=b.querySelector('.sh');sh.style.backgroundSize=(IW*s)+'px '+(IH*s)+'px';sh.style.backgroundPosition=(ox-x0)+'px '+(oy-y0)+'px';});
}
lay();addEventListener('resize',lay);ph.addEventListener('load',lay);soft.addEventListener('load',lay);

/* transitions-dev, tooltip: one label shared by the boards */
var tip=document.getElementById('tt'),tipText=tip.querySelector('.t-tt-text');
function hideTip(){tip.setAttribute('data-show','false');tip.setAttribute('aria-hidden','true');boardsEl.classList.remove('lit');}
function placeTip(b){
  var showing=tip.getAttribute('data-show')==='true',cs;tipText.textContent=b.getAttribute('aria-label')||'';cs=getComputedStyle(tip);
  var w=Math.ceil(tipText.scrollWidth+parseFloat(cs.paddingLeft)+parseFloat(cs.paddingRight)),r=b.getBoundingClientRect(),
      x=Math.min(Math.max(r.left+r.width/2-w/2,8),innerWidth-w-8),y=r.bottom+10;
  if(!showing){tip.style.transition='none';tip.style.width=w+'px';tip.style.setProperty('--tt-x',x+'px');tip.style.setProperty('--tt-y',y+'px');void tip.offsetWidth;tip.style.transition='';}
  else{tip.style.width=w+'px';tip.style.setProperty('--tt-x',x+'px');tip.style.setProperty('--tt-y',y+'px');}
  tip.setAttribute('data-show','true');tip.setAttribute('aria-hidden','false');boardsEl.classList.add('lit');
}
bs.forEach(function(b){
  b.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'||e.pointerType==='pen')placeTip(b);});
  b.addEventListener('focus',function(){placeTip(b);});b.addEventListener('blur',hideTip);
});
boardsEl.addEventListener('pointerleave',hideTip);

/* GSAP: the focus pull on arrival, the focus slipping away on scroll, the rows rising in */
var intro=null,mm=gsap.matchMedia();gsap.registerPlugin(ScrollTrigger);
function ready(){
  var dec=[ph,soft].map(function(i){return i.decode?i.decode().catch(function(){}):Promise.resolve();});
  return Promise.all(dec).then(function(){return Promise.race([document.fonts?document.fonts.ready:0,new Promise(function(r){setTimeout(r,1200);})]);});
}
mm.add({calm:'(prefers-reduced-motion: no-preference)',still:'(prefers-reduced-motion: reduce)'},function(ctx){
  var still=ctx.conditions.still;
  /* scroll, top of the page first so the triggers refresh in page order */
  var tl=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:'.hero',start:'top top',end:function(){return '+='+Math.round(innerHeight*1.25);},scrub:still?true:0.5,invalidateOnRefresh:true,
    onUpdate:function(self){document.body.classList.toggle('past',self.progress>0.15);}}});
  tl.to(lift,{opacity:0,y:still?0:-12,duration:0.3},0)
    .to(ph,{opacity:0,duration:0.5,ease:'power1.inOut'},0.08)
    .to(veil,{opacity:1,duration:0.6,ease:'power1.inOut'},0.62);
  if(still){gsap.set(fin,{opacity:1});stagger.classList.add('is-shown');topEl.classList.add('is-shown');return;}
  /* the rows: each row's content rises in, 80 ms apart (transitions-dev's step for a few large items), once */
  var parts=function(r){return [].slice.call(r.children);};
  gsap.set('.row > *',{opacity:0,y:12,filter:'blur(3px)'});
  var reveal=function(rows){var t=gsap.timeline({defaults:{ease:'power3.out',duration:0.5}});rows.forEach(function(r,i){if(r._in)return;r._in=1;t.to(parts(r),{opacity:1,y:0,filter:'blur(0px)',clearProps:'filter'},i*0.08);});};
  ScrollTrigger.batch('.row',{start:'top 92%',once:true,onEnter:reveal,onLeave:reveal});
  /* arrival: the room is out of focus, focus lands on the work desk; the title follows, then the mark */
  intro=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'}});
  intro.to(fin,{opacity:1,duration:1.1},0.1).add(function(){stagger.classList.add('is-shown');},0.65).add(function(){topEl.classList.add('is-shown');},1.0);
  ready().then(function(){intro.play();});
});
function replay(){if(!intro)return;scrollTo(0,0);stagger.classList.remove('is-shown');topEl.classList.remove('is-shown');gsap.set(fin,{opacity:0});void stagger.offsetHeight;intro.restart();}

/* messages from the preview bar: zoom, blur strength, replay */
addEventListener('message',function(e){var d=e.data;if(!d)return;
  if(d.zoom){Z=d.zoom==='own'?C.Z:+d.zoom;lay();}
  if(d.blur&&C.VAR[d.blur])ph.src=C.VAR[d.blur];
  if(d.replay)replay();});
})();`;

const page = () => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, fokus (sketch)</title>
<script>document.documentElement.className='js'</script>${fonts('Hanken+Grotesk:wght@400;500;600')}<style>${CSS}</style></head><body>${logoDefs}
<div class="photo" aria-hidden="true"><img id="soft" src="${SRC.soft}" alt=""><div class="fin"><img id="ph" src="${SRC.middels}" alt=""></div></div>
<div class="boards" id="boards" style="--sharp:url(${SRC.sharp})">${BOARD_IDS.map(([id, name]) => `<a class="board" data-id="${id}" href="../site/insights.html#${id}" aria-label="${name}"><span class="sh"></span></a>`).join('')}<span class="t-tt" id="tt" role="tooltip" aria-hidden="true" data-show="false"><span class="t-tt-text"></span></span></div>
<div class="veil" aria-hidden="true"></div>
<header class="top"><a class="mark-link" href="forside-fokus.html" aria-label="Analytika, home"><svg class="mark" aria-hidden="true"><use href="#lg-mark"/></svg></a></header>
<main>
<section class="hero" aria-label="Analytika"><div class="lift"><div class="t-stagger"><h1 class="t-stagger-line">Analytika</h1></div></div>
<p class="areasline" aria-label="Areas">${BOARD_IDS.map(([id, name]) => `<a href="../site/insights.html#${id}">${name}</a>`).join('')}</p></section>
<div class="dissolve" aria-hidden="true"></div>
<nav class="rows" id="pages" aria-label="Pages">${ROWS.map(([w, h], i) => `<a class="row" href="${h}"><span class="n">0${i + 1}</span><span class="w">${w}</span>${i === 3 ? '<svg class="lm" aria-hidden="true"><use href="#lg-mark"/></svg>' : ''}${ARROW}</a>`).join('')}</nav>
</main>
<div class="foot"><span>Analytika AS · Parkveien 41B, 0258 Oslo</span><span><a href="../site/about.html#join">Join us</a> &nbsp; <a href="../site/about.html#contact">Contact</a></span></div>
${SKETCH('Sketch, round 6 · built with the new skills: GSAP timeline and ScrollTrigger (arrival and scroll), transitions.dev (texts reveal, tooltip, motion tokens) and the make-interfaces-feel-better rules. The room arrives out of focus and focus lands on the work desk; scrolling lets it slip away into white; pointing at a board pulls focus to it. Rows are a first guess; every page behind them is still to be designed.')}
<script>${vendor('gsap.min.js')}</script><script>${vendor('ScrollTrigger.min.js')}</script>
<script>${SCRIPT.replace('__CFG__', JSON.stringify(CFG))}</script>
</body></html>`;

write('forside-fokus.html', page());
