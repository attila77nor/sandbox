/* Round 3: the landing page. The photograph fills the screen, "Analytika" is the only text on it.
   Scrolling dissolves the photograph into white, and four rows in a white-to-grey scale carry the pages.
   The five boards stay clickable (each is an area). */
import { write, logoDefs, fonts, SKETCH, PHOTO } from './explore-shared.mjs';

const BOARD_IDS = [['actuary', 'Actuary'], ['pricing', 'Pricing'], ['data-platforms', 'Data platforms'], ['consulting', 'Consulting'], ['business-development', 'Business development']];
/* the three photographs, each with the five boards measured in pixels (x0 y0 x1 y1) */
const PHOTOS = {
  tavler: { src: PHOTO.src, w: PHOTO.w, h: PHOTO.h, boards: PHOTO.boards.map(([id, n, r]) => [id, n, r]) },
  rom: { src: '../../assets/photo/rom-v2-neutral.jpg', w: 1672, h: 941, boards: BOARD_IDS.map(([id, n], i) => [id, n, [[598, 295, 726, 483], [735, 295, 856, 483], [866, 295, 992, 483], [1003, 295, 1120, 483], [1131, 295, 1257, 483]][i]]) },
  ekte: { src: '../../assets/photo/ekte-kontor-v4-neutral.jpg', w: 1672, h: 941, boards: BOARD_IDS.map(([id, n], i) => [id, n, [[567, 380, 654, 469], [661, 380, 749, 469], [756, 380, 844, 469], [851, 380, 939, 469], [945, 380, 1028, 469]][i]]) },
  /* the same photograph cropped 1.3x closer around the boards (origin 154,138): a test of 'come a bit closer' without asking ChatGPT */
  ekte13: { src: '../../assets/photo/ekte-kontor-v4-neutral-utsnitt.jpg', w: 1286, h: 724, boards: BOARD_IDS.map(([id, n], i) => [id, n, [[413, 242, 500, 331], [507, 242, 595, 331], [602, 242, 690, 331], [697, 242, 785, 331], [791, 242, 874, 331]][i]]) },
  /* the lived-in version (v5): the camera did not move, so the boards sit exactly where they did in v4 */
  liv: { src: '../../assets/photo/ekte-kontor-v5-neutral.jpg', w: 1672, h: 941, boards: BOARD_IDS.map(([id, n], i) => [id, n, [[567, 380, 654, 469], [661, 380, 749, 469], [756, 380, 844, 469], [851, 380, 939, 469], [945, 380, 1028, 469]][i]]) },
  kontor: { src: '../../assets/photo/kontor-v3-neutral.jpg', w: 1672, h: 941, boards: BOARD_IDS.map(([id, n], i) => [id, n, [[143, 199, 411, 561], [421, 201, 693, 561], [703, 199, 978, 561], [987, 198, 1260, 561], [1270, 198, 1559, 563]][i]]) },
};
const ROWS = [['People', '../site/people.html'], ['Insights', '../site/insights.html'], ['Products', '../site/products.html'], ['About us', '../site/about.html']];
const NAV = [...ROWS, ['Join us', '../site/about.html#join'], ['Contact', '../site/about.html#contact']];
const ARROW = '<svg class="arr" viewBox="0 0 76 12" aria-hidden="true" focusable="false"><path d="M0 6h74M69 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

const TITLE_CSS = {
  /* huge and centred, a soft dark glow behind the letters so they read on whatever is under them */
  center: '.hero h1{left:50%;top:50%;bottom:auto;right:auto;transform:translate(-50%,-50%);font-size:clamp(56px,13vw,210px);letter-spacing:-.045em;text-align:center;white-space:nowrap;text-shadow:0 2px 44px rgba(0,0,0,.55),0 0 4px rgba(0,0,0,.22)}',
  /* the same, but the letters are the photograph inverted: white on dark parts, dark on bright parts */
  'center-diff': '.hero{z-index:auto}.hero h1{z-index:2;left:50%;top:50%;bottom:auto;right:auto;transform:translate(-50%,-50%);font-size:clamp(56px,13vw,210px);letter-spacing:-.045em;text-align:center;white-space:nowrap;mix-blend-mode:difference}',
  /* a sign on the far wall above the boards; position and size come from the photograph's own coordinates */
  wall: '.hero h1{left:0;top:0;bottom:auto;right:auto;transform:translate(-50%,-50%);white-space:nowrap;letter-spacing:-.04em;text-shadow:0 2px 30px rgba(0,0,0,.5),0 0 3px rgba(0,0,0,.2)}',
};
const css = (c) => `
:root{--ink:#14161B;--mute:#575C67;--rule:rgba(20,22,27,.09);--acc:#036194;--gut:clamp(20px,3.6vw,56px);--sans:"Hanken Grotesk","Helvetica Neue",Arial,sans-serif;--dim:${c.dim};
  ${c.ink === 'dark' ? '--lg-ink:#1E3363;--lg-word:#1E3363;--lg-blue:#1B92D0;--lg-deep:#036194' : '--lg-ink:#fff;--lg-word:#fff;--lg-blue:#fff;--lg-deep:#fff'}}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:#fff;color:var(--ink);font:400 14px/1.55 var(--sans);overflow-x:hidden}
a{color:inherit;text-decoration:none}
::selection{background:var(--ink);color:#fff}
:focus-visible{outline:1.5px solid #fff;outline-offset:4px}
.rows :focus-visible,.foot :focus-visible{outline-color:var(--acc)}
ul,ol{margin:0;padding:0;list-style:none}

/* the photograph: fixed behind everything, covering the screen */
.photo{position:fixed;inset:0;z-index:0;background:#2a2c31}
.photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 45%;filter:brightness(var(--dim)) contrast(1.04)}
.boards{position:fixed;inset:0;z-index:1;pointer-events:none}
.board{position:absolute;display:block;pointer-events:auto;outline:0;transition:box-shadow .4s}
.board .lab{position:absolute;left:50%;bottom:calc(100% + 10px);transform:translateX(-50%);white-space:nowrap;font-size:12.5px;letter-spacing:.06em;color:#fff;opacity:0;transition:opacity .3s;pointer-events:none}
.board.in .lab{bottom:auto;top:10px;color:var(--ink)}
.board:hover,.board:focus-visible{box-shadow:0 0 0 100vmax rgba(8,10,14,.42)}
.board:hover .lab,.board:focus-visible .lab{opacity:1}
body.past .board{pointer-events:none}

/* the first screen */
.top{position:absolute;z-index:3;left:0;right:0;top:0;display:flex;justify-content:space-between;align-items:center;padding:clamp(18px,2.4vw,30px) var(--gut);color:#fff}
.mark{display:block;width:clamp(30px,2.6vw,38px);aspect-ratio:1.07}
.top nav{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.3rem clamp(14px,1.8vw,26px);font-size:12.5px;letter-spacing:.03em}
.top nav a{opacity:.82;transition:opacity .2s}.top nav a:hover{opacity:1}
.top nav .gap{margin-left:clamp(0px,1.4vw,18px)}
.hero{position:relative;z-index:2;height:100vh;height:100svh;min-height:480px;pointer-events:none}
.hero h1,.cue,.areasline{opacity:calc(1 - var(--s,0) * 2)}
.hero h1{position:absolute;${c.titleSide === 'right' ? 'right' : 'left'}:var(--gut);bottom:clamp(36px,9vh,96px);margin:0;font:600 clamp(40px,5.4vw,80px)/1 var(--sans);letter-spacing:-.035em;color:#fff;pointer-events:auto}
${TITLE_CSS[c.titleMode] || ''}
.areasline{display:none}
.cue{position:absolute;right:var(--gut);bottom:clamp(40px,9.5vh,100px);width:20px;color:#fff;opacity:.8;pointer-events:auto}
.cue svg{display:block;width:20px;height:44px}

/* the photograph dissolves into white as the page rises over it */
.dissolve{position:relative;z-index:2;height:90vh;height:90svh;background:linear-gradient(to bottom,rgba(255,255,255,0) 0%,rgba(255,255,255,.12) 18%,rgba(255,255,255,.45) 45%,rgba(255,255,255,.82) 72%,#fff 100%);pointer-events:none}
.rows{position:relative;z-index:2}
.row{position:relative;display:flex;align-items:center;gap:clamp(16px,4vw,64px);min-height:clamp(104px,17vh,168px);padding:0 var(--gut);border-top:1px solid var(--rule);transition:background .35s}
.row:nth-child(1){background:#fff;border-top:0}.row:nth-child(2){background:#F5F5F6}.row:nth-child(3){background:#EBECEE}.row:nth-child(4){background:#E1E2E5}
.row:hover,.row:focus-visible{background:#D5D7DB}
.row .n{flex:none;width:2.2rem;font-size:12px;color:var(--mute);font-variant-numeric:tabular-nums}
.row .w{flex:1;font:400 clamp(20px,1.9vw,26px)/1.1 var(--sans);letter-spacing:-.012em}
.row .arr{flex:none;width:clamp(54px,5.4vw,76px);height:12px;color:var(--mute);transition:transform .4s cubic-bezier(.22,.8,.3,1),color .3s}
.row:hover .arr,.row:focus-visible .arr{transform:translateX(8px);color:var(--ink)}
.row .lm{flex:none;width:clamp(34px,3.2vw,46px);aspect-ratio:1.07;margin-right:clamp(10px,3vw,48px);--lg-ink:#1E3363;--lg-word:#1E3363;--lg-blue:#1B92D0;--lg-deep:#036194}
.foot{position:relative;z-index:2;display:flex;justify-content:space-between;flex-wrap:wrap;gap:.5rem 1rem;padding:32px 48px 12px;background:#E1E2E5;font-size:12.5px;color:#5C616C}
.foot a:hover{color:var(--ink)}
.sketch{position:relative;z-index:2;margin:0;padding:6px var(--gut) 16px;background:#E1E2E5;font-size:12px;color:#5C616C}
@media (max-width:760px){.foot{padding:24px 20px 12px}.top nav a:nth-child(-n+4){display:none}.top nav .gap{margin-left:0}
  .areasline{display:flex;flex-wrap:wrap;gap:.2rem 1.1rem;position:absolute;left:var(--gut);right:var(--gut);bottom:clamp(22px,5vh,44px);font-size:12.5px;letter-spacing:.04em;color:rgba(255,255,255,.9);text-shadow:0 1px 10px rgba(0,0,0,.55);pointer-events:auto}
  .hero h1{bottom:clamp(70px,14vh,120px)}.cue{display:none}}
`;

const page = (c, ph = PHOTOS[c.photo]) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, ${c.photo} (sketch)</title>${fonts('Hanken+Grotesk:wght@400;500;600')}<style>${css(c)}</style></head><body>${logoDefs}
<div class="photo" aria-hidden="true"><img id="ph" src="${ph.src}" alt=""></div>
<div class="boards" id="boards">${ph.boards.map(([id, name]) => `<a class="board" data-id="${id}" href="../site/insights.html#${id}" aria-label="${name}"><span class="lab">${name}</span></a>`).join('')}</div>
<header class="top"><a href="${c.file}" aria-label="Analytika, home"><svg class="mark" aria-hidden="true"><use href="#lg-mark"/></svg></a>${c.menu ? `<nav>${NAV.map(([w, h], i) => `<a${i === 4 ? ' class="gap"' : ''} href="${h}">${w}</a>`).join('')}</nav>` : ''}</header>
<main>
<section class="hero" aria-label="Analytika"><h1>Analytika</h1>
<p class="areasline" aria-label="Areas">${ph.boards.map(([id, name]) => `<a href="../site/insights.html#${id}">${name}</a>`).join('')}</p>
${c.cue ? `<a class="cue" href="#pages" aria-label="Scroll to the pages"><svg viewBox="0 0 20 44" aria-hidden="true"><path d="M10 0v40M3 33l7 8 7-8" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg></a>` : ''}</section>
<div class="dissolve" aria-hidden="true"></div>
<nav class="rows" id="pages" aria-label="Pages">${ROWS.map(([w, h], i) => `<a class="row" href="${h}"><span class="n">0${i + 1}</span><span class="w">${w}</span>${i === 3 ? '<svg class="lm" aria-hidden="true"><use href="#lg-mark"/></svg>' : ''}${ARROW}</a>`).join('')}</nav>
</main>
<div class="foot"><span>Analytika AS · Parkveien 41B, 0258 Oslo</span><span><a href="../site/about.html#join">Join us</a> &nbsp; <a href="../site/about.html#contact">Contact</a></span></div>
${SKETCH(c.note)}
<script>(function(){
var IW=${ph.w},IH=${ph.h},R=${JSON.stringify(Object.fromEntries(ph.boards.map(([id, , r]) => [id, r])))},ph=document.getElementById('ph'),box=ph.parentNode,bs=[].slice.call(document.querySelectorAll('.board'));
${c.zoom ? `var Z=${c.zoom},FX=${c.focus[0]},FY=${c.focus[1]},TX=${c.target[0]},TY=${c.target[1]},h1=document.querySelector('.hero h1');
function lay(){var vw=box.clientWidth,vh=box.clientHeight,z=vw<760?1:Z,s=Math.max(vw/IW,vh/IH)*z,ox=vw*TX-FX*s,oy=vh*TY-FY*s;ox=Math.min(0,Math.max(vw-IW*s,ox));oy=Math.min(0,Math.max(vh-IH*s,oy));
  ph.style.cssText='max-width:none;object-fit:fill;position:absolute;left:'+ox+'px;top:'+oy+'px;width:'+(IW*s)+'px;height:'+(IH*s)+'px';
  ${c.titleMode === 'wall' ? `h1.style.left=(ox+${c.wall.x}*s)+'px';h1.style.top=(oy+${c.wall.y}*s)+'px';h1.style.fontSize=Math.max(34,${c.wall.h}*s*.6)+'px';` : ''}` : `function lay(){var vw=box.clientWidth,vh=box.clientHeight,s=Math.max(vw/IW,vh/IH),ox=(vw-IW*s)*.5,oy=vh*.45-IH*s*.45;`}
  bs.forEach(function(b){var r=R[b.dataset.id],x0=ox+r[0]*s,y0=oy+r[1]*s,x1=ox+r[2]*s,y1=oy+r[3]*s;
    b.style.left=x0+'px';b.style.top=y0+'px';b.style.width=(x1-x0)+'px';b.style.height=(y1-y0)+'px';b.classList.toggle('in',y0<44);});}
lay();addEventListener('resize',lay);ph.addEventListener('load',lay);${c.zoom ? "addEventListener('message',function(e){if(e.data&&e.data.zoom){Z=+e.data.zoom;lay();}});" : ''}
function sc(){document.body.classList.toggle('past',scrollY>innerHeight*.35);document.documentElement.style.setProperty('--s',Math.min(1,scrollY/innerHeight).toFixed(3));}sc();addEventListener('scroll',sc,{passive:true});
})();</script>
</body></html>`;
const NOTE = 'Rows are a first guess; every page behind them is still to be designed. Point at a board to see its area.';
write('forside.html', page({ file: 'forside.html', photo: 'tavler', dim: 0.68, ink: 'light', titleSide: 'left', menu: true, cue: true, note: 'Sketch, round 3 · the first whiteboard photograph, dimmed evenly so the title reads. ' + NOTE }));
write('forside-rom.html', page({ file: 'forside-rom.html', photo: 'rom', dim: 1, ink: 'dark', titleSide: 'right', menu: false, cue: false, note: 'Sketch, round 3 · the room photograph, not dimmed: the title sits on the calm parquet at the bottom right and the mark is dark on the bright window. ' + NOTE }));
write('forside-ekte.html', page({ file: 'forside-ekte.html', photo: 'ekte', dim: 1, ink: 'light', titleSide: 'left', menu: false, cue: false, note: 'Sketch, round 3 · the office photograph tidied by ChatGPT, not dimmed: the title sits bottom left on the dark desk (10.7:1) and the mark is white. ' + NOTE }));
write('forside-ekte-naer.html', page({ file: 'forside-ekte-naer.html', photo: 'ekte13', dim: 1, ink: 'light', titleSide: 'left', menu: false, cue: false, note: 'Sketch, round 3 · the office photograph cropped 1.3x closer (a simulation: the boards span 40% of the width and the hotspots are 108 px). The paintings on the walls fall mostly outside the frame. ' + NOTE }));
/* round 4: the lived-in office (v5). Zoom 1.5 puts the boards at about 46% of the width; the zoom buttons in preview.html change it live. */
const LIV = { photo: 'liv', dim: 1, ink: 'light', menu: false, cue: false, zoom: 1.5, focus: [797, 425], target: [0.5, 0.40], wall: { x: 780, y: 318, h: 118 } };
const LNOTE = 'Rows are a first guess; every page behind them is still to be designed. Point at a board to see its area.';
write('forside-liv-skilt.html', page({ ...LIV, file: 'forside-liv-skilt.html', titleMode: 'wall', note: 'Sketch, round 4 · the title as a sign on the far wall above the boards, white with a soft dark glow. ' + LNOTE }));
write('forside-liv-senter.html', page({ ...LIV, file: 'forside-liv-senter.html', titleMode: 'center', note: 'Sketch, round 4 · the title huge and centred, white with a soft dark glow. ' + LNOTE }));
write('forside-liv-diff.html', page({ ...LIV, file: 'forside-liv-diff.html', titleMode: 'center-diff', note: 'Sketch, round 4 · the title huge and centred as the photograph inverted: white over dark, dark over bright. ' + LNOTE }));
write('forside-liv-venstre.html', page({ ...LIV, file: 'forside-liv-venstre.html', zoom: 1, focus: [836, 470], target: [0.5, 0.5], titleMode: 'left', note: 'Sketch, round 4 · as before: white title bottom left, no zoom. The dark sweater on the chair still gives it a calm place. ' + LNOTE }));
write('forside-kontor.html', page({ file: 'forside-kontor.html', photo: 'kontor', dim: 0.68, ink: 'light', titleSide: 'left', menu: false, cue: false, note: 'Sketch, round 3 · the office photograph. Papers and chairs reach pure white everywhere, so it has to be dimmed evenly for the title to read. ' + NOTE }));
