import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { logoDefs } from './lib.mjs';
import { galton } from './art.mjs';

const here = new URL('.', import.meta.url).pathname;
const outDir = new URL('../concepts/site', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });
const photo = 'data:image/jpeg;base64,' + readFileSync(`${here}/hero-crop.jpg`).toString('base64');

/* ------------------------------------------------------------------ css */
let CSS = `
:root{--paper:#F5F7FA;--ink:#1E3363;--soft:#5B6784;--rule:rgba(30,51,99,.28);--blue:#1B92D0;--gut:clamp(20px,4vw,56px);
  --f:"Schibsted Grotesk","Helvetica Neue",Arial,sans-serif;--word:clamp(1.35rem,2.3vw,2.4rem)}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--ink);font:400 17px/1.5 var(--f);overflow-x:hidden}
::selection{background:var(--blue);color:#fff}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit}
:focus-visible{outline:2px solid var(--blue);outline-offset:4px;border-radius:2px}
ul,ol{margin:0;padding:0;list-style:none}
.logo{display:block;aspect-ratio:5.34}
.ph{display:flex;align-items:center;justify-content:center;border:1px dashed var(--rule);color:var(--soft);font-size:.85rem;text-align:center}

/* shared header and footer */
.hdr{position:relative;z-index:6;display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:clamp(16px,2.4vw,32px) var(--gut)}
.hdr .logo{height:clamp(22px,2.2vw,30px)}
.hdr nav{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.4rem clamp(14px,2vw,28px);font-size:.95rem;font-weight:500}
.hdr nav a[aria-current]{text-decoration:underline;text-underline-offset:.35em;text-decoration-thickness:1px}
.hdr nav .gap{margin-left:clamp(0px,1.4vw,18px)}
.top{position:absolute;left:0;right:0;top:0;color:#fff;--lg-word:#fff;--lg-ink:#fff}
footer{position:relative;z-index:2;background:var(--ink);color:#EEF2F8;padding:2rem var(--gut);display:flex;justify-content:space-between;gap:1rem;flex-wrap:wrap;font-size:.95rem}
footer a{margin-left:1.6rem;font-weight:500}

/* landing: hero */
.hero{position:relative;height:100vh;height:100svh;min-height:620px;overflow:hidden}
.hero-bg,.hero-fade{position:absolute;left:0;right:0;top:0;height:66%}
.hero-bg{background-size:cover;background-position:center 30%}
.hero-fade{background:linear-gradient(to bottom,rgba(14,24,52,.5) 0,rgba(14,24,52,0) 20%,rgba(245,247,250,0) 36%,rgba(245,247,250,.8) 76%,#F5F7FA 100%)}
.slogan{position:absolute;left:var(--gut);right:var(--gut);top:57%;margin:0;font-size:clamp(2.6rem,6.2vw,6.6rem);font-weight:300;letter-spacing:-.03em;line-height:1;text-wrap:balance}
.areas{position:absolute;left:var(--gut);right:var(--gut);bottom:clamp(36px,6.5vh,64px);padding:1.1rem 0 0;display:flex;justify-content:space-between;gap:.8rem 1.6rem;border-top:1px solid var(--rule)}
.areas a{font-size:clamp(.88rem,1.05vw,1.1rem);font-weight:500}
.areas a:hover{text-decoration:underline;text-underline-offset:.3em;text-decoration-thickness:1px}
.start{position:absolute;left:50%;bottom:0;width:0;height:0}

/* landing: a vertical centre line, a 90-degree branch to each word, words on alternate sides */
main.land{position:relative}
.thread{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:1;overflow:visible}
.thread path{fill:none;stroke-linecap:butt;stroke-linejoin:miter}
.thread .rail{stroke:rgba(30,51,99,.2);stroke-width:1}
.thread .prog{stroke:var(--ink);stroke-width:1.5}
.thread .jn{fill:var(--ink)}
.sec{position:relative;z-index:2;min-height:min(46vh,420px)}
.node{position:absolute;left:var(--nx);top:var(--ny);width:var(--d,22px);height:var(--d,22px);margin:calc(var(--d,22px)/-2) 0 0 calc(var(--d,22px)/-2);border-radius:50%;border:1.5px solid var(--ink);background:var(--paper);transition:background .35s,transform .35s,border-color .35s}
.node.on{background:var(--ink)}
.blk{position:absolute;top:var(--ny);transform:translateY(-50%);display:block;font-size:var(--word);font-weight:400;letter-spacing:-.01em;line-height:1;color:var(--soft);transition:color .3s;white-space:nowrap}
.sec.left .blk{right:calc(100% - var(--nx) + 28px);text-align:right}
.sec.right .blk{left:calc(var(--nx) + 28px)}
.blk:hover,.blk:focus-visible{color:var(--ink)}
.sec:has(.blk:hover) .node,.sec:has(.blk:focus-visible) .node{background:var(--blue);border-color:var(--blue);transform:scale(1.35)}
.people{--nx:30%;--ny:11vh;--d:24px}
.insights{--nx:70%;--ny:11vh;--d:18px}
.insights .node{border-color:var(--blue)}
.insights .node.on{background:var(--blue)}
.products{--nx:30%;--ny:11vh}
.cluster{position:absolute;left:var(--nx);top:var(--ny);width:0;height:0}
.cluster i{position:absolute;display:block;border-radius:50%;border:1.5px solid var(--ink);background:var(--paper);transition:background .35s,border-color .35s}
.cluster i:nth-child(1){width:20px;height:20px;left:-22px;top:-14px}
.cluster i:nth-child(2){width:12px;height:12px;left:6px;top:-26px;border-color:var(--blue)}
.cluster i:nth-child(3){width:16px;height:16px;left:8px;top:2px}
.cluster i:nth-child(4){width:10px;height:10px;left:-10px;top:14px;border-color:var(--blue)}
.cluster.on i{background:var(--ink)}
.cluster.on i:nth-child(2),.cluster.on i:nth-child(4){background:var(--blue)}
.products:has(.blk:hover) .cluster i,.products:has(.blk:focus-visible) .cluster i{background:var(--blue);border-color:var(--blue)}
.products:has(.blk:hover) .cluster i:nth-child(2){transition-delay:.08s}.products:has(.blk:hover) .cluster i:nth-child(3){transition-delay:.16s}.products:has(.blk:hover) .cluster i:nth-child(4){transition-delay:.24s}
.about{--nx:70%;--ny:11vh;--mw:clamp(72px,6.5vw,100px);min-height:min(34vh,320px)}
.mark-wrap{display:block;position:absolute;left:var(--nx);top:var(--ny);width:var(--mw);transform:translateY(-50%)}
.mark{display:block;width:100%;aspect-ratio:1.07}
.mark-anchor{position:absolute;left:0;top:50%;width:0;height:0}
.sec.right.about .blk{left:calc(var(--nx) + var(--mw) + 22px)}

/* inner pages */
.page{padding:0 var(--gut) 12vh}
.page-title{margin:clamp(28px,6vh,64px) 0 0;font-size:var(--word);font-weight:400;letter-spacing:-.01em;line-height:1}
.dummy{margin:.9rem 0 0;font-size:.9rem;color:var(--soft)}
.page h2{margin:clamp(40px,7vh,72px) 0 1rem;font-size:clamp(1.15rem,1.5vw,1.5rem);font-weight:500;letter-spacing:-.01em;padding-top:1.1rem;border-top:1px solid var(--rule)}
.note{margin:1.4rem 0 0;padding:1rem 1.2rem;border:1px dashed var(--rule);color:var(--soft);font-size:.92rem;max-width:62ch}
.big{margin:2.4rem 0 0;max-width:30ch;font-size:clamp(1.5rem,2.6vw,2.6rem);font-weight:300;line-height:1.15;letter-spacing:-.02em;text-wrap:balance}
.logos{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.logos .ph{height:70px}
.roles li a{display:flex;justify-content:space-between;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--rule);font-size:1.15rem;font-weight:500}
.roles li a:hover{text-decoration:underline;text-underline-offset:.25em;text-decoration-thickness:1px}
.roles li a span{color:var(--soft);font-weight:400;font-size:.92rem}
.contact p{margin:0 0 .3rem}

/* people: the arrival line */
.al{position:relative;margin:clamp(120px,24vh,230px) 0 0;height:60px}
.al::before{content:"";position:absolute;left:0;right:0;top:50%;height:1.5px;background:var(--ink)}
.al li{position:absolute;left:var(--x);top:50%;transform:translate(-50%,-50%)}
.al a{display:block;position:relative}
.al .dot{display:block;width:var(--s,16px);height:var(--s,16px);border-radius:50%;background:var(--c,var(--ink));transition:transform .25s,background .25s}
.al a:hover .dot,.al a:focus-visible .dot{background:var(--blue);transform:scale(1.3)}
.al .open .dot{background:var(--paper);border:1.4px dashed var(--ink);width:20px;height:20px}
.al .tip{position:absolute;bottom:calc(100% + 16px);left:50%;transform:translateX(-50%);display:none;align-items:center;gap:.7rem;white-space:nowrap;padding:.55rem .9rem .55rem .6rem;background:var(--paper);border:1px solid var(--rule);font-size:.95rem;font-weight:500;z-index:5}
.al a:hover .tip,.al a:focus-visible .tip{display:flex}
.al .pic{display:block;width:34px;height:34px;border-radius:50%;background:linear-gradient(150deg,#C9CEDA,#8792A8);animation:develop 1.4s ease-out}
@keyframes develop{from{filter:grayscale(1) brightness(1.7) contrast(.5);opacity:.2}to{filter:none;opacity:1}}
.al .yr{position:absolute;top:calc(100% + 14px);left:50%;transform:translateX(-50%);font-size:.85rem;color:var(--soft);white-space:nowrap;text-align:center}
.al .yr b{display:block;color:var(--ink);font-size:1rem;font-weight:600}
.al .edge{position:absolute;top:calc(50% + 22px);font-size:.85rem;color:var(--soft)}
.alist{margin:clamp(60px,12vh,120px) 0 0;padding-top:1rem;border-top:1px solid var(--rule);font-size:.92rem;line-height:1.8;color:var(--soft)}
.alist a:hover{color:var(--ink);text-decoration:underline;text-underline-offset:.25em}

/* insights: area symbols, sub-areas, detail pages */
.areas5{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));margin:2.4rem 0 0;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)}
.area{appearance:none;background:none;border:0;border-left:1px solid var(--rule);text-align:left;cursor:pointer;padding:1.7rem 1.3rem 1.5rem;position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start}
.area:first-child{border-left:0;padding-left:0}
.area svg{display:block;width:72px;height:72px;margin-bottom:1.1rem}
.area .n{display:block;font-size:1.12rem;font-weight:500}
.area .d{display:block;margin-top:.3rem;font-size:.88rem;line-height:1.35;color:var(--soft)}
.area::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--blue);transform:scaleX(0);transform-origin:left;transition:transform .3s}
.area:first-child::after{left:0}
.area[aria-expanded="true"]::after,.area:hover::after{transform:scaleX(1)}
.ic{fill:none;stroke:var(--ink);stroke-width:1.4;stroke-linecap:round;stroke-linejoin:round}
.ic .a{stroke:var(--blue)}
.ic .fl{fill:var(--blue);stroke:none}
.ic .fl.soft{opacity:.14}
.ic .dash{stroke-dasharray:2.5 2.8;stroke:rgba(30,51,99,.55)}
.ic .tk{stroke:rgba(30,51,99,.4)}
.ic .pp{fill:var(--paper)}
.sub{padding:clamp(24px,4vh,40px) 0 0}
.sub[hidden]{display:none}
.subrows li a{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) auto;gap:.3rem 2rem;align-items:baseline;padding:1.15rem 0;border-bottom:1px solid var(--rule)}
.subrows b{font-weight:400;font-size:clamp(1.25rem,1.8vw,1.8rem);letter-spacing:-.01em}
.subrows span{color:var(--soft)}
.subrows em{font-style:normal;font-weight:500;text-decoration:underline;text-underline-offset:.25em;text-decoration-thickness:1px}
.subrows li a:hover b{color:var(--blue)}
.crumbs{margin:1.6rem 0 0;font-size:.9rem;color:var(--soft)}
.crumbs a{text-decoration:underline;text-underline-offset:.25em;text-decoration-thickness:1px}
.crumbs i{font-style:normal;margin:0 .5rem}
.dl{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:.5rem 3rem;padding:1.4rem 0;border-top:1px solid var(--rule)}
.dl:last-of-type{border-bottom:1px solid var(--rule)}
.dl b{font-weight:500;font-size:1.12rem}
.dl p{margin:0;color:var(--soft);max-width:48ch}
.back{display:inline-block;margin-top:2rem;font-weight:500;text-decoration:underline;text-underline-offset:.25em;text-decoration-thickness:1px}

/* about: wall labels */
.walls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(28px,5vw,72px);margin-top:clamp(120px,32vh,320px)}
.walls+.walls{margin-top:clamp(72px,14vh,140px)}
.lab{border-top:1px solid var(--ink);padding-top:1.1rem;font-size:.95rem;line-height:1.55;scroll-margin-top:2rem}
.lab b{display:block;font-weight:600}
.lab .m{display:block;margin-bottom:.9rem;color:var(--soft)}
.lab p{margin:0;max-width:34ch}
.lab .c{display:block;margin-top:1rem;color:var(--soft);font-size:.85rem}
.lab .roles{margin-top:.2rem}
.lab .roles a{display:block;padding:.45rem 0;border-bottom:1px solid var(--rule)}
.lab .roles a:first-child{border-top:1px solid var(--rule)}
.lab .roles a:hover{color:var(--blue)}
.lab .roles span{display:block;color:var(--soft);font-size:.85rem}
.lab address{font-style:normal}
.exnote{margin:clamp(56px,10vh,110px) 0 0;font-size:.85rem;color:var(--soft)}

/* products: white, fog, mountain, white */
body.prod{background:var(--paper)}
.photo-fixed{position:fixed;left:0;right:0;bottom:0;height:90vh;z-index:0;background-size:cover;background-position:center bottom;transform-origin:50% 100%;will-change:transform;-webkit-mask-image:linear-gradient(to bottom,transparent 0,#000 34%);mask-image:linear-gradient(to bottom,transparent 0,#000 34%)}
.prod .hdr{position:absolute;left:0;right:0;top:0}
.prod main{position:relative;z-index:1}
.clear{position:relative;z-index:1;background:var(--paper)}
.clear::before,.clear::after{content:"";position:absolute;left:0;right:0;height:14vh;pointer-events:none}
.clear::before{top:-14vh;background:linear-gradient(to top,var(--paper),rgba(245,247,250,0))}
.clear::after{bottom:-14vh;background:linear-gradient(to bottom,var(--paper),rgba(245,247,250,0))}
.clear.first{min-height:66vh;padding:clamp(130px,24vh,230px) var(--gut) 0}
.clear.first::after{height:34vh;bottom:-34vh}
.view{height:62vh;position:relative;z-index:0}
.view.end{height:40vh}
.logos5{display:flex;justify-content:center;flex-wrap:wrap;gap:1.6rem clamp(14px,3vw,48px)}
.lg{display:block;text-align:center;width:clamp(120px,12vw,170px)}
.lg .ph{height:64px;transition:border-color .25s,color .25s}
.lg .nm{display:block;margin-top:.7rem;font-size:.95rem;font-weight:500}
.lg:hover .ph,.lg:focus-visible .ph{border-color:var(--ink);color:var(--ink)}
.lg.spare{opacity:.55;cursor:default}
.prodsec{padding:clamp(64px,12vh,120px) var(--gut);display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:2rem clamp(24px,5vw,80px);align-items:start}
.prodsec .head{display:flex;align-items:center;gap:1rem}
.prodsec .ph{width:56px;height:56px;flex:none}
.prodsec h2{margin:0;font-size:clamp(1.3rem,2vw,2rem);font-weight:400;letter-spacing:-.015em;line-height:1.1;border:0;padding:0}
.prodsec .tag{margin:.7rem 0 0;color:var(--soft)}
.prodsec .body p{margin:0 0 1.1rem;max-width:40rem;font-size:1.06rem}

@media (hover:none){.blk{color:var(--ink)}}
@media (max-width:900px){
  .areas5{grid-template-columns:repeat(2,minmax(0,1fr))}
  .area,.area:first-child{border-left:0;padding-left:0;border-top:1px solid var(--rule)}
  .area:nth-child(-n+2){border-top:0}
}
@media (max-width:760px){
  .areas{flex-wrap:wrap;justify-content:flex-start}
  .hero{min-height:640px}
  .hero-bg,.hero-fade{height:56%}
  .slogan{top:50%;font-size:clamp(2.4rem,11.2vw,3.4rem)}
  .areas{bottom:28px}
  .sec{min-height:auto;padding:9vh var(--gut) 3vh}
  .sec .node{left:30px;top:calc(9vh + .9rem);--d:20px}
  .sec .cluster{left:30px;top:calc(9vh + .9rem)}
  .sec .blk,.sec.left .blk,.sec.right .blk{position:relative;left:auto;right:auto;top:auto;transform:none;text-align:left;padding-left:52px;font-size:1.6rem;color:var(--ink)}
  .about .mark-wrap{position:absolute;left:12px;top:calc(9vh + .9rem);transform:translateY(-50%);width:36px}
  .sec.right.about .blk{left:auto;padding-left:52px}
  .about{min-height:auto}
  .prodsec{grid-template-columns:1fr}
  .clear.first{padding-top:120px}
  .dl{grid-template-columns:1fr}
  .walls{grid-template-columns:1fr;margin-top:56px;gap:44px}
  .walls+.walls{margin-top:44px}
  .subrows li a{grid-template-columns:1fr}
  .areas5{grid-template-columns:1fr}
  .area:nth-child(2){border-top:1px solid var(--rule)}
  .al{height:auto;margin-top:2.4rem;padding-left:34px}
  .al::before{left:8px;right:auto;top:0;bottom:0;width:1.5px;height:auto}
  .al li{position:relative;left:auto;top:auto;transform:none;padding:.45rem 0}
  .al a{display:flex;align-items:center;gap:.9rem}
  .al .dot{position:absolute;left:-34px;top:50%;margin:calc(var(--s,16px)/-2) 0 0 0;width:var(--s,14px);height:var(--s,14px)}
  .al .tip{position:static;display:flex;transform:none;border:0;padding:0;background:none}
  .al .pic,.al .yr,.al .edge{display:none}
  footer{flex-direction:column}
  footer a{margin:0 1.4rem 0 0}
}
@media (prefers-reduced-motion:reduce){.node,.cluster i,.blk,.al .dot,.area::after{transition:none}.photo-fixed{transform:none!important}.al .pic{animation:none}}
`;


/* ---- variant D skin: dark ground, serif display, tracked small caps ---- */
CSS = CSS.replaceAll('rgba(245,247,250,', 'rgba(16,18,22,').replaceAll('#F5F7FA', '#101216').replaceAll('rgba(30,51,99,', 'rgba(237,239,243,');
CSS += `
:root{--paper:#101216;--ink:#EDEFF3;--soft:#9AA3B5;--rule:rgba(237,239,243,.26);--blue:#9CCBE6;--fs:"Cormorant Garamond",Georgia,serif;--fp:"Poppins","Helvetica Neue",Arial,sans-serif;--f:"Poppins","Helvetica Neue",Arial,sans-serif;--word:clamp(1.9rem,3.1vw,3.2rem);--lg-word:#fff;--lg-ink:#C9D3E6;--lg-blue:#9CCBE6;--lg-deep:#4DB1E3}
body{font:300 15.5px/1.7 var(--fp)}
::selection{background:var(--blue);color:#101216}
.hdr nav{font-family:var(--fp);font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;font-weight:400;gap:.4rem clamp(16px,2vw,32px)}
.hdr nav .gap{margin-left:clamp(8px,1.6vw,24px)}
footer{background:#0A0B0E;color:var(--soft);border-top:1px solid var(--rule);font-size:.8rem;letter-spacing:.04em}
footer a{color:var(--ink);font-weight:400;font-size:.7rem;letter-spacing:.16em;text-transform:uppercase}
.page-title,.slogan,.blk,.big,.prodsec h2,.page h2{font-family:var(--fs);font-weight:400}
.page-title{letter-spacing:0}
.page h2{font-size:clamp(1.5rem,2vw,2rem);letter-spacing:0}
.big{letter-spacing:-.005em;font-size:clamp(1.9rem,3.2vw,3.2rem)}
.blk{letter-spacing:0;font-weight:400}
.subrows b{font-family:var(--fs);font-weight:400;font-size:clamp(1.6rem,2.3vw,2.4rem);letter-spacing:0}
.prodsec h2{font-size:clamp(1.8rem,2.6vw,2.6rem);letter-spacing:0}
.area .n{font-family:var(--fp);font-weight:400;font-size:.74rem;letter-spacing:.14em;text-transform:uppercase}
.area .d{font-size:.82rem}
.lab b{font-family:var(--fp);font-weight:500;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase}
.dl b{font-weight:500;font-size:.78rem;letter-spacing:.1em;text-transform:uppercase}
.logos5 .nm,.lg .nm{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;font-weight:400}
.crumbs{font-size:.78rem}
.hero{background:#101216}
.hero-art{position:absolute;inset:0}
.hero-art svg{width:100%;height:100%;display:block}
.hero-fade{height:100%;background:linear-gradient(to bottom,rgba(6,8,12,.4) 0,rgba(6,8,12,0) 22%,rgba(16,18,22,0) 58%,rgba(16,18,22,.9) 88%,#101216 100%)}
.slogan{left:0;right:0;top:25%;text-align:center;font-size:clamp(3.6rem,9.4vw,10rem);font-weight:400;letter-spacing:-.01em;line-height:.98;text-shadow:0 0 3rem rgba(0,0,0,.5)}
.hero .mid{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:clamp(18px,2.4vw,40px);font-family:var(--fp);font-size:.7rem;letter-spacing:.16em;text-transform:uppercase;white-space:nowrap}
.top .hmid{position:absolute;left:50%;transform:translateX(-50%);display:flex;gap:clamp(18px,2.6vw,42px);white-space:nowrap}
.top .hmid a{margin:0}
.cta{position:absolute;left:0;right:0;bottom:calc(clamp(36px,6.5vh,64px) + 5.2rem);display:flex;justify-content:center;align-items:center;gap:1.6rem;font-family:var(--fp);font-size:.7rem;letter-spacing:.16em;text-transform:uppercase}
.cta .btn{border:1px solid var(--blue);padding:1.1rem 2.6rem;background:rgba(6,8,12,.25);transition:background .25s}
.cta .btn:hover{background:rgba(156,203,230,.16)}
.cta .pl{width:3.4rem;height:3.4rem;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center}
.cta .pl i{display:block;width:.6rem;height:.6rem;border-right:2px solid #101216;border-bottom:2px solid #101216;transform:rotate(45deg) translate(-.1rem,-.1rem)}
.areas{border-top:0;justify-content:center;gap:.8rem clamp(20px,3vw,48px);padding-top:0}
.areas a{font-family:var(--fp);font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;font-weight:400;color:rgba(255,255,255,.86)}
.photo-fixed{background:none!important}
.photo-fixed svg{width:100%;height:100%;display:block}
@media (max-width:760px){
  .top .hmid{display:none}
  .slogan{top:20%;font-size:clamp(3.2rem,15vw,4.8rem)}
  .cta{bottom:calc(28px + 8rem);flex-wrap:wrap;gap:1rem}
  .cta .btn{padding:.9rem 1.6rem}
  .areas{gap:.6rem 1.4rem}
}
`;

/* ------------------------------------------------------------ fragments */
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Poppins:wght@300;400;500&display=swap">`;
const LOGO = '<svg class="logo" role="img" aria-label="Analytika"><use href="#lg-full"/></svg>';
const CLICK = `<script>document.addEventListener('click',function(e){var a=e.target.closest('a[href]');if(!a||window.parent===window)return;var h=a.getAttribute('href');if(h.charAt(0)==='#'&&h.length>1){e.preventDefault();var t=document.getElementById(h.slice(1));if(t)t.scrollIntoView({behavior:'smooth'});return;}if(/^(index|people|insights|products|about|insights-[a-z-]+)\\.html(#.*)?$/.test(h)){e.preventDefault();parent.postMessage({go:h},'*');}});</script>`;

const nav = (cur) => {
  const l = (href, label, key) => `<a href="${href}"${cur === key ? ' aria-current="page"' : ''}>${label}</a>`;
  return `<nav>${l('people.html', 'People', 'people')}${l('insights.html', 'Insights', 'insights')}${l('products.html', 'Products', 'products')}${l('about.html', 'About us', 'about')}<a class="gap" href="about.html#join">Join us</a><a href="about.html#contact">Contact</a></nav>`;
};
const FOOT = `<footer><span>Analytika AS · Parkveien 41B, 0258 Oslo</span><span><a href="about.html#join">Join us</a><a href="about.html#contact">Contact</a></span></footer>`;

const shell = (title, body, extra = '', bodyClass = '') => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>${FONTS}<style>${CSS}</style></head><body class="${bodyClass}">
${logoDefs}
${body}
${CLICK}${extra}
</body></html>`;

const inner = (key, title, content, extra = '') => shell(`${title} – Analytika (dummy)`,
  `<header class="hdr"><a href="index.html" aria-label="Analytika, home">${LOGO}</a>${nav(key)}</header>
<main class="page"><h1 class="page-title">${title}</h1><p class="dummy">Dummy page: structure and placeholders only, nothing here is final copy.</p>${content}</main>${FOOT}`, extra);

/* ----------------------------------------------------------------- index */
const THREAD = `<script>
(function(){
  var main=document.getElementById('main'),svg=main.querySelector('.thread');
  var anchors=[].slice.call(main.querySelectorAll('[data-a]'));
  var full=!!window.__FULL||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS='http://www.w3.org/2000/svg',trunk=[],cum=[],tlen=1,stubs=[],jns=[],pts=[],tprog=null;
  function mk(tag,cls){var e=document.createElementNS(NS,tag);e.setAttribute('class',cls);svg.appendChild(e);return e;}
  function center(el){var r=el.getBoundingClientRect(),m=main.getBoundingClientRect();return {x:r.left+r.width/2-m.left,y:r.top+r.height/2-m.top};}
  function d(a){return 'M'+a.map(function(p){return p[0].toFixed(1)+' '+p[1].toFixed(1);}).join('L');}
  function build(){
    var m=main.getBoundingClientRect();if(!m.width)return;
    svg.setAttribute('viewBox','0 0 '+m.width+' '+m.height);while(svg.firstChild)svg.removeChild(svg.firstChild);
    pts=anchors.map(center);var wide=m.width>760,s=pts[0],last=pts[pts.length-1],tx=wide?s.x:30;
    trunk=wide?[[tx,s.y],[tx,last.y]]:[[s.x,s.y],[s.x,s.y+36],[tx,s.y+36],[tx,last.y]];
    cum=[0];for(var i=1;i<trunk.length;i++)cum.push(cum[i-1]+Math.hypot(trunk[i][0]-trunk[i-1][0],trunk[i][1]-trunk[i-1][1]));
    tlen=cum[cum.length-1];
    var rail=mk('path','rail'),all=d(trunk);stubs=[];jns=[];
    for(var k=1;k<pts.length;k++){
      if(wide){var sd=d([[tx,pts[k].y],[pts[k].x,pts[k].y]]);all+=sd;var sp=mk('path','prog');sp.setAttribute('d',sd);var L=Math.abs(pts[k].x-tx);sp.style.strokeDasharray=L;sp.style.strokeDashoffset=L;stubs.push({el:sp,len:L,y:pts[k].y});var c=mk('circle','jn');c.setAttribute('cx',tx);c.setAttribute('cy',pts[k].y);c.setAttribute('r',3.5);c.style.opacity=0;jns.push(c);}
    }
    rail.setAttribute('d',all);
    tprog=mk('path','prog');tprog.setAttribute('d',d(trunk));tprog.style.strokeDasharray=tlen;
    update();
  }
  function trunkAt(y){
    var run=0;for(var i=1;i<trunk.length;i++){var p=trunk[i-1],q=trunk[i],sl=cum[i]-cum[i-1];
      if(q[1]===p[1]){if(y>=p[1])run=cum[i];else break;}
      else if(y>=q[1])run=cum[i];else{if(y>p[1])run=cum[i-1]+sl*(y-p[1])/(q[1]-p[1]);break;}}
    return run;
  }
  function update(){
    if(!tprog)return;
    var m=main.getBoundingClientRect(),y=full?1e9:(-m.top+window.innerHeight*.62);
    tprog.style.strokeDashoffset=tlen-trunkAt(y);
    stubs.forEach(function(s,i){var f=Math.max(0,Math.min(1,(y-s.y)/140+.15));if(y<s.y)f=0;s.el.style.strokeDashoffset=s.len*(1-f);jns[i].style.opacity=y>=s.y?1:0;});
    anchors.forEach(function(a,i){a.classList.toggle('on',i>0&&y>=pts[i].y+40);});
  }
  var raf=0;function sched(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;update();});}
  window.addEventListener('scroll',sched,{passive:true});
  window.addEventListener('resize',build);
  (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(build);
  window.addEventListener('load',build);
  build();
})();
</script>`;

const index = shell('Analytika – landing page sketch', `
<main id="main" class="land">
  <header class="hdr top"><a href="index.html" aria-label="Analytika, home">${LOGO}</a><nav class="hmid"><a href="people.html">People</a><a href="insights.html">Insights</a><a href="products.html">Products</a><a href="about.html">About us</a></nav><nav><a href="about.html#join">Join us</a><a href="about.html#contact">Contact</a></nav></header>
  <section class="hero" aria-label="Introduction">
    <div class="hero-art">${galton('gh')}</div>
    <div class="hero-fade"></div>
    <h1 class="slogan">Uncertainty<br>is our trade.</h1>
    <div class="cta"><a class="btn" href="people.html">Meet the people</a><a class="pl" href="#s-people" aria-label="Explore"><i></i></a><a href="#s-people">Explore</a></div>
    <ul class="areas"><li><a href="insights.html#actuary">Actuary</a></li><li><a href="insights.html#pricing">Pricing</a></li><li><a href="insights.html#data-platforms">Data platforms</a></li><li><a href="insights.html#consulting">Consulting</a></li><li><a href="insights.html#business-development">Business development</a></li></ul>
    <i class="start" data-a></i>
  </section>
  <section class="sec left people" id="s-people"><i class="node" data-a></i><a class="blk" href="people.html">People</a></section>
  <section class="sec right insights"><i class="node" data-a></i><a class="blk" href="insights.html">Insights</a></section>
  <section class="sec left products"><div class="cluster" data-a><i></i><i></i><i></i><i></i></div><a class="blk" href="products.html">Products</a></section>
  <section class="sec right about"><span class="mark-wrap"><svg class="mark" aria-hidden="true"><use href="#lg-mark"/></svg><i class="mark-anchor" data-a></i></span><a class="blk" href="about.html">About us</a></section>
  ${FOOT}
  <svg class="thread" aria-hidden="true"></svg>
</main>`, THREAD);

/* ---------------------------------------------------------------- people */
const radii = [13, 19, 24, 10, 16, 22, 9, 15, 26, 12, 18, 21, 8, 14, 23, 11, 17, 25, 12, 20, 16];
const cols = ['#E6ECF6', '#9CCBE6', '#E6ECF6', '#4DB1E3', '#E6ECF6', '#9CCBE6', '#C9D3E6'];
const alpha = ['Are Flataker Viken', 'Arturas Mecuta', 'Atle Melve', 'Bendik Bull', 'Bård Støve', 'Eigminas Dagys', 'Eivind Borg', 'Ellen Skrimstad', 'Fredrik Bergflødt', 'Harald Hasner', 'Håvard Vilming', 'Kjell Andreas Solberg', 'Lars Aga Reisæter', 'Laura Dage', 'Martin Osvik', 'Pernille Kiil', 'Sandra Brännstam', 'Sindre Ones', 'Tom Milenin', 'Vytautas Audzijonis', 'Thuvaragi Saravani'];
const inc = [30, 44, 26, 38, 22, 46, 28, 34, 40, 24, 42, 30, 36, 26, 44, 32, 28, 38, 34, 30, 40].map((v) => v * 0.88);
let acc = 0; const xs = inc.map((v) => (acc += v)); const total = xs[xs.length - 1];
const pos = (i) => (5 + (xs[i] / total) * 62).toFixed(2);
const fIdx = alpha.indexOf('Fredrik Bergflødt'), tIdx = alpha.indexOf('Thuvaragi Saravani');
const dotsHtml = alpha.map((n, i) => `<li style="--x:${pos(i)}%"><a href="#" aria-label="${n}"><span class="dot" style="--s:${Math.round(8 + radii[i] * 0.55)}px;--c:${cols[i % 7]}"></span><span class="tip"><i class="pic"></i>${n}</span>${i === fIdx ? '<span class="yr"><b>2019</b></span>' : ''}${i === tIdx ? '<span class="yr"><b>2026</b></span>' : ''}</a></li>`).join('');
const openHtml = [0, 1, 2, 3].map((i) => `<li class="open" style="--x:${(75 + i * 6.2).toFixed(1)}%"><a href="about.html#join" aria-label="Open role"><span class="dot"></span><span class="tip">[open role]</span></a></li>`).join('');
const sortedNames = [...alpha].sort((a, b) => a.localeCompare(b, 'nb'));
const people = inner('people', 'People',
  `<ol class="al" aria-label="People, in the order they joined (positions are illustrative)">${dotsHtml}${openHtml}<li style="--x:0%"><span class="edge" style="left:0;transform:none">[founded]</span></li></ol>
<p class="note" style="margin-top:6.5rem">[Dummy: dots are placed in illustrative order. Only two arrival years are known (2019 and 2026). The four open circles are the open roles. Hovering a dot will show the portrait “developing”.]</p>
<p class="alist">${sortedNames.map((n) => `<a href="#">${n}</a>`).join(' · ')}</p>`);

/* ------------------------------------------------------- insights: icons */
const TK = '<path class="tk" d="M4 12V4h8M60 4h8v8M68 60v8h-8M12 68H4v-8"/>';
const ICON = {
  actuary: `<svg class="ic" viewBox="0 0 72 72" aria-hidden="true">${TK}<path d="M12 10v50h50"/><path d="M12 16h10v6h8v8h8v8h8v10h8v8h8"/><path class="a" d="M12 14C32 14 44 26 62 58"/><path class="tk" d="M26 17v10M42 33v10M52 45v10"/></svg>`,
  pricing: `<svg class="ic" viewBox="0 0 72 72" aria-hidden="true">${TK}<path d="M12 10v50h50"/><path class="fl soft" d="M12 60 62 10C56 48 40 60 12 60Z"/><path class="dash" d="M12 60 62 10"/><path class="a" d="M12 60C40 60 56 48 62 10"/><circle class="pp a" cx="45" cy="49" r="2"/><circle class="pp a" cx="55.6" cy="33.8" r="2"/></svg>`,
  data: `<svg class="ic" viewBox="0 0 72 72" aria-hidden="true">${TK}<circle class="dash" cx="36" cy="36" r="25"/><path d="M36 36 61 36M36 36 48.5 57.7M36 36 23.5 57.7M36 36 11 36M36 36 23.5 14.3M36 36 48.5 14.3"/><rect class="pp" x="58" y="33" width="7" height="7"/><rect class="pp" x="45" y="54" width="7" height="7"/><rect class="pp" x="20" y="54" width="7" height="7"/><rect class="pp" x="7.5" y="33" width="7" height="7"/><rect class="pp a" x="20" y="10.8" width="7" height="7"/><rect class="pp" x="45" y="10.8" width="7" height="7"/><rect class="pp a" x="30" y="30" width="12" height="12"/></svg>`,
  consulting: `<svg class="ic" viewBox="0 0 72 72" aria-hidden="true">${TK}<path d="M12 36 34 20M12 36 34 52M34 20 58 12M34 20 58 28M34 52 58 44M34 52 58 60"/><path class="a" d="M12 36 34 20 58 28"/><circle class="pp" cx="12" cy="36" r="3.2"/><circle class="pp a" cx="34" cy="20" r="3.2"/><circle class="pp" cx="34" cy="52" r="3.2"/><rect class="pp" x="55.5" y="9.5" width="5" height="5"/><rect class="fl" x="55.5" y="25.5" width="5" height="5"/><rect class="pp" x="55.5" y="41.5" width="5" height="5"/><rect class="pp" x="55.5" y="57.5" width="5" height="5"/></svg>`,
  business: `<svg class="ic" viewBox="0 0 72 72" aria-hidden="true">${TK}<path d="M12 10v50h50"/><path class="dash" d="M12 14h50"/><path class="a" d="M12 58C32 58 38 14 62 14"/><path class="dash" d="M25.5 51.7 45.5 20.3"/><circle class="fl" cx="35.5" cy="36" r="3"/></svg>`,
};
const AREAS = [
  ['actuary', 'Actuary', 'Reserving, risk and compliance.', ICON.actuary],
  ['pricing', 'Pricing', 'Advanced tariffs and pricing models.', ICON.pricing],
  ['data-platforms', 'Data platforms', 'Warehouses, pipelines and analytics.', ICON.data],
  ['consulting', 'Consulting', 'Programs, projects and delivery.', ICON.consulting],
  ['business-development', 'Business development', 'New ideas, funded and built.', ICON.business],
];
const ACT = [
  ['risk', 'Risk actuary', 'Capital, models and the risk framework.', 'Capital modelling', 'Building and reviewing the models that decide how much capital an insurer has to hold.', 'Solvency II in practice', 'Making the framework work day to day, from the risk assessment to governance.', 'Risk frameworks', 'A framework people actually use, and proof of where it shaped a decision.', 'Regulatory reporting', 'Quantitative and narrative reporting to the supervisor, prepared and checked.'],
  ['compliance', 'Compliance', 'Documentation, requirements and independent review.', 'Governing documentation', 'Checking that policies and processes say what the company does, and the other way round.', 'New requirements', 'Mapping a new rule to the organisation and to what has to change.', 'Independent review', 'A second pair of eyes on methods, assumptions and processes before the supervisor looks.', 'Outsourced function', 'Taking on parts of the function for companies that do not need a full-time team.'],
  ['reserving', 'Reserving', 'Whether the reserves are enough, and why.', 'Adequacy of reserves', 'An independent view on whether reserves are sufficient, for life and non-life.', 'Technical provisions', 'Independent recalculation, reconciled to the company’s own figures.', 'Methods and assumptions', 'Whether the methods are reasonable and the assumptions explained.', 'Development triangles', 'The workhorse of non-life reserving, built, explained and kept up to date.'],
  ['life-pension', 'Life and pension', 'An area we are building.', '[Engagement type 1]', '[To be generated from the firm’s files: what the work was, and what came out of it.]', '[Engagement type 2]', '[To be generated from the firm’s files.]', '[Engagement type 3]', '[To be generated from the firm’s files.]', '[Engagement type 4]', '[To be generated from the firm’s files.]'],
];
const subRows = ACT.map(([s, n, d]) => `<li><a href="insights-actuary-${s}.html"><b>${n}</b><span>${d}</span><em>Open</em></a></li>`).join('');
const INS_JS = `<script>
(function(){
  var btns=[].slice.call(document.querySelectorAll('.area'));
  function show(id,toggle){btns.forEach(function(b){var on=b.getAttribute('data-area')===id,was=b.getAttribute('aria-expanded')==='true',next=on&&(toggle?!was:true);b.setAttribute('aria-expanded',next);var p=document.getElementById('p-'+b.getAttribute('data-area'));if(p)p.hidden=!next;});}
  btns.forEach(function(b){b.addEventListener('click',function(){show(b.getAttribute('data-area'),true);});});
  window.addEventListener('message',function(e){if(e.data&&e.data.open)show(e.data.open,false);});
  if(location.hash.length>1)show(location.hash.slice(1),false);
})();
</script>`;
const insights = inner('insights', 'Insights',
  `<div class="areas5">${AREAS.map(([id, n, d, svg]) => `<button class="area" id="a-${id}" data-area="${id}" aria-expanded="false" aria-controls="p-${id}">${svg}<span class="n">${n}</span><span class="d">${d}</span></button>`).join('')}</div>
<section class="sub" id="p-actuary" hidden aria-label="Actuary"><ul class="subrows">${subRows}</ul></section>
${AREAS.slice(1).map(([id, n]) => `<section class="sub" id="p-${id}" hidden aria-label="${n}"><p class="note">[Sub-areas for ${n} are not drawn yet.]</p></section>`).join('')}
<p class="note" style="margin-top:3rem">[Open decision: the text on the detail pages is drafted with AI from internal material without client data, then reviewed and signed by a named person.]</p>`, INS_JS);

const subPages = Object.fromEntries(ACT.map(([s, n, d, t1, p1, t2, p2, t3, p3, t4, p4]) => [`insights-actuary-${s}.html`, shell(`${n} – Analytika (dummy)`,
  `<header class="hdr"><a href="index.html" aria-label="Analytika, home">${LOGO}</a>${nav('insights')}</header>
<main class="page"><p class="crumbs" style="margin-top:clamp(20px,4vh,40px)"><a href="insights.html">Insights</a><i>/</i><a href="insights.html#actuary">Actuary</a><i>/</i>${n}</p>
<h1 class="page-title" style="margin-top:1.4rem">${n}</h1><p class="dummy">Dummy page. The descriptions below are examples of what will be generated from the firm’s files and reviewed by a named person.</p>
<div style="margin-top:2.4rem">${[[t1, p1], [t2, p2], [t3, p3], [t4, p4]].map(([t, p]) => `<div class="dl"><b>${t}</b><p>${p}</p></div>`).join('')}</div>
<a class="back" href="insights.html#actuary">Back to Actuary</a></main>${FOOT}`)]));

/* -------------------------------------------------------------- products */
const prods = [['indie', 'Indie'], ['n-models', 'N Models'], ['triangles', 'Triangles'], ['ai', 'AI']];
const PROD_JS = `<script>
(function(){
  var ph=document.querySelector('.photo-fixed');if(!ph||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  function u(){var max=document.documentElement.scrollHeight-window.innerHeight,p=max>0?window.scrollY/max:0;ph.style.transform='scale('+(1+p*.1).toFixed(4)+')';}
  window.addEventListener('scroll',function(){requestAnimationFrame(u);},{passive:true});u();
})();
</script>`;
const products = shell('Products – Analytika (dummy)', `
<div class="photo-fixed" aria-hidden="true">${galton('gp')}</div>
<header class="hdr"><a href="index.html" aria-label="Analytika, home">${LOGO}</a>${nav('products')}</header>
<main>
  <section class="clear first" aria-label="Products">
    <div class="logos5">
      ${prods.map(([id, n]) => `<a class="lg" href="#${id}"><span class="ph">[logo]</span><span class="nm">${n}</span></a>`).join('')}
      <span class="lg spare" aria-hidden="true"><span class="ph">[logo 5]</span><span class="nm">&nbsp;</span></span>
    </div>
  </section>
  ${prods.map(([id, n]) => `<div class="view" aria-hidden="true"></div>
  <section class="clear prodsec" id="${id}">
    <div><div class="head"><span class="ph">[logo]</span><h2>${n}</h2></div><p class="tag">[One line on what ${n} is.]</p></div>
    <div class="body"><p>[Dummy description. A short paragraph on what ${n} does, who uses it and what it replaces. Replace with real copy.]</p><p>[Second paragraph: how it works, what it needs from the customer, and what the result looks like.]</p></div>
  </section>`).join('\n  ')}
  <div class="view end" aria-hidden="true"></div>
</main>
${FOOT}`, PROD_JS, 'prod');

/* ----------------------------------------------------------------- about */
const about = shell('About us – Analytika', `<header class="hdr"><a href="index.html" aria-label="Analytika, home">${LOGO}</a>${nav('about')}</header>
<main class="page"><h1 class="page-title">About us</h1>
<div class="walls">
  <section class="lab" aria-labelledby="l1"><b id="l1">Analytika AS</b><span class="m">Oslo, founded [year]. [N] people.</span><p>A firm that does actuarial, pricing, data and project work for insurers. Started so that smart people would have a place to get better at what they love.</p><span class="c">Courtesy of all [N] of us.</span></section>
  <section class="lab" aria-labelledby="l2"><b id="l2">How we work</b><span class="m">Plainly.</span><p>We say what we mean, build before we describe, and back the ideas our own people believe in.</p><span class="c">Ongoing.</span></section>
  <section class="lab" aria-labelledby="l3"><b id="l3">Who we work for</b><span class="m">All of them.</span><p>The insurers of Norway, and some abroad. We do not list them. They know who they are.</p><span class="c">Not for sale.</span></section>
</div>
<div class="walls">
  <section class="lab" id="join" aria-labelledby="l4"><b id="l4">Join us</b><span class="m">Four open roles. [To be confirmed.]</span><div class="roles"><a href="#">Pricing actuary</a><a href="#">Compliance expert</a><a href="#">Life insurance actuary</a><a href="#">New business lead</a></div><span class="c">Until filled.</span></section>
  <section class="lab" id="contact" aria-labelledby="l5"><b id="l5">Contact</b><span class="m">Oslo.</span><address><p>Analytika AS<br>Parkveien 41B, 0258 Oslo<br>info@analytika.no</p></address><span class="c">Open weekdays. [To be confirmed.]</span></section>
</div>
<p class="exnote">[Example wording only. The real text replaces this.]</p></main>${FOOT}`);

/* ----------------------------------------------------------------- write */
const pages = { 'index.html': index, 'people.html': people, 'insights.html': insights, ...subPages, 'products.html': products, 'about.html': about };
for (const [f, html] of Object.entries(pages)) writeFileSync(`${outDir}/${f}`, html);

const json = JSON.stringify(pages).replace(/<\//g, '<\\/');
writeFileSync(`${outDir}/preview.html`, `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – clickable preview</title>
<style>html,body{margin:0;height:100%;background:#F5F7FA}iframe{border:0;width:100%;height:100%;display:block}</style></head>
<body><iframe id="f" title="Analytika site preview"></iframe>
<script>
var pages=${json};
function go(h){var p=h.split('#'),file=p[0]||'index.html',f=document.getElementById('f');
  f.onload=function(){try{if(p[1]){f.contentWindow.postMessage({open:p[1]},'*');var el=f.contentDocument.getElementById(p[1]);if(el)el.scrollIntoView();}}catch(e){}};
  f.srcdoc=pages[file]||pages['index.html'];}
window.addEventListener('message',function(e){if(e.data&&e.data.go)go(e.data.go);});
go('index.html');
</script></body></html>`);
console.log('wrote', Object.keys(pages).length, 'pages + preview.html to', outDir);
