/* Round 11, page 2: a recreation, made ours, of a reference Atle sent (a media company's case page: a stack of full-size "pages" fanned in the dark,
   the front one light with a dotted grid and three words of three kinds of type, a small player on top, a blue halftone page and a muted page with
   a huge word peeking out behind it). Measured on the reference (canvas 982 x 735): front card 885 x 509 at (49, 113), the blue card the same layout
   at 0.79 and turned 3.3 degrees clockwise, the third card at 0.82 and turned 3.2 degrees the other way, a dot grid of 22 px, the player 221 x 54.
   The three cards are one component, as in the reference, so the pages behind are real copies of the layout, not pictures.
   What is ours: our marine, blue and greys; the words are the two names the whole site rests on ("Consulting", "Business", "development": bold,
   italic serif slightly out of focus, bold, the way "The Culture Index" is set); the player steps through the five areas (title, the next area on the
   blue page, progress); the blue halftone is dots like the logo's; the third card carries the wordmark, cut off by the edge; the round button
   joins us (an arrow, a tooltip); the five areas stand small at the bottom left of the front card. One file: fonts and logo embedded, no pictures. */
import { readFileSync } from 'node:fs';
import { write, logoDefs, AREA_NAMES } from './explore-shared.mjs';
import { logoWordDef } from './lib.mjs';

const FONT = (f) => 'data:font/woff2;base64,' + readFileSync(new URL('../assets/vendor/fonts/' + f, import.meta.url)).toString('base64');
const IDS = ['actuary', 'pricing', 'data-platforms', 'consulting', 'business-development'];
const u = (n) => `calc(var(--u)*${n})`;
const sz = (n, floor = 12) => `max(${floor}px,${u(n)})`;

/* the halftone of the blue card: a grid of 22 px, the dot grows towards the lower edge and round two places (the reference has two clusters of big dots) */
const halftone = () => {
  const dots = [];
  for (let j = 0; j < 12; j++) {
    const y = 11 + j * 22;
    for (let i = 0; i < 41; i++) {
      const x = 11 + i * 22.2;
      const grow = Math.min(1.15, Math.pow(y / 92, 1.4));
      const gx = Math.max(Math.exp(-(((x - 300) / 150) ** 2)), 0.95 * Math.exp(-(((x - 842) / 85) ** 2)), 0.55 * Math.exp(-(((x - 190) / 70) ** 2)));
      const r = Math.min(11.1, 1.2 + 10.4 * grow * (0.2 + 0.8 * gx));
      dots.push(`<circle cx="${x.toFixed(1)}" cy="${y}" r="${r.toFixed(2)}"/>`);
    }
  }
  return `<svg class="halftone" viewBox="0 0 885 270" preserveAspectRatio="none" aria-hidden="true"><g fill="#1E3363">${dots.join('')}</g></svg>`;
};
/* small dots on the third card (the reference has confetti in six colours; ours is in our colours only) */
const confetti = () => {
  let s = 20261113;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const cols = ['#1E3363', '#1B92D0', '#036194', '#FFFFFF', '#C9D0DA'];
  const out = [];
  for (let i = 0; i < 58; i++) out.push(`<circle cx="${(10 + rnd() * 865).toFixed(1)}" cy="${(70 + rnd() * 150).toFixed(1)}" r="${(1.3 + rnd() * 1.1).toFixed(2)}" fill="${cols[Math.floor(rnd() * cols.length)]}"/>`);
  return `<svg class="confetti" viewBox="0 0 885 509" aria-hidden="true">${out.join('')}</svg>`;
};

const IC = {
  prev: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.6 1.4v7.2M8.6 1.5v7L3.2 5z" fill="currentColor"/></svg>',
  next: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M8.4 1.4v7.2M1.4 1.5v7L6.8 5z" fill="currentColor"/></svg>',
  menu: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2 3.4h6M2 6.6h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" fill="none"/></svg>',
  arrow: '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M2.4 7.6l5.2-5.2M3.4 2.4h4.2v4.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
};
const player = (title, live) => `<div class="player"${live ? ' role="group" aria-label="Areas"' : ''}><span class="tile"><svg aria-hidden="true"><use href="#lg-mark"/></svg></span>${live ? `<a class="ttl t" data-k="main" href="../site/insights.html#${IDS[0]}">${title}</a>` : `<span class="ttl t" data-k="next">${title}</span>`}<span class="sub">ANALYTIKA</span>${live ? `<button type="button" class="pb prev" aria-label="Previous area">${IC.prev}</button><button type="button" class="pb next" aria-label="Next area">${IC.next}</button><a class="pb menu" href="../site/insights.html" aria-label="All areas">${IC.menu}</a>` : `<span class="pb prev">${IC.prev}</span><span class="pb next">${IC.next}</span><span class="pb menu">${IC.menu}</span>`}<span class="prog"><i data-prog style="width:${live ? 20 : 40}%"></i></span></div>`;
const head = (live, title) => `<a class="logo" href="forside-kort.html"${live ? ' aria-label="Analytika, home"' : ''}><svg aria-hidden="true"><use href="#lg-full"/></svg></a>${player(title, live)}<a class="share" href="../site/about.html#join"${live ? ' aria-label="Join us"' : ''}>${IC.arrow}${live ? '<span class="tip" role="tooltip">Join us</span>' : ''}</a>`;

const css = `
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-500-normal.woff2')}) format("woff2");font-weight:500;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-700-normal.woff2')}) format("woff2");font-weight:700;font-style:normal;font-display:block}
@font-face{font-family:"Hanken Grotesk";src:url(${FONT('hanken-grotesk-latin-900-normal.woff2')}) format("woff2");font-weight:900;font-style:normal;font-display:block}
@font-face{font-family:"Bodoni Moda";src:url(${FONT('bodoni-moda-latin-500-italic.woff2')}) format("woff2");font-weight:500;font-style:italic;font-display:block}
:root{--u:min(calc(100vw/982),calc(100svh/735));--ink:#1E3363;--paper:#F3F4F6;--bg:#0B1224;--blue:#1B92D0}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:500 ${sz(11)}/1.25 "Hanken Grotesk","Helvetica Neue",Arial,sans-serif;-webkit-font-smoothing:antialiased;overflow:hidden}
a{color:inherit;text-decoration:none}
button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer}
.sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.page{height:100vh;height:100svh;min-height:520px;display:grid;place-items:center}
.stage{position:relative;width:${u(982)};height:${u(735)};overflow:hidden}
.card{position:absolute;width:${u(885)};height:${u(509)};border-radius:${u(7)};overflow:hidden}
.main{z-index:3;left:${u(49)};top:${u(113)};background-color:var(--paper);background-image:radial-gradient(circle,#D5D9E0 0,#D5D9E0 ${u(1)},transparent ${u(1.5)});background-size:${u(22.2)} ${u(22)};background-position:${u(10)} ${u(12)};box-shadow:0 ${u(1)} ${u(2)} rgba(0,0,0,.2),0 ${u(22)} ${u(60)} rgba(0,0,0,.5)}
.blue{z-index:1;left:${u(104)};top:${u(25)};transform-origin:0 0;transform:rotate(3.3deg) scale(.79);background:var(--blue)}
.third{z-index:1;left:${u(169.5)};top:${u(560)};transform-origin:0 0;transform:rotate(-3.2deg) scale(.82);background:linear-gradient(#495B8B,#8091B5)}
.halftone{position:absolute;left:0;top:0;width:100%;height:${u(270)}}
.confetti{position:absolute;inset:0;width:100%;height:100%}
.word{position:absolute;left:${u(22)};top:${u(140)};width:${u(841)};aspect-ratio:8.246;--lg-word:#fff}
.word svg{display:block;width:100%;height:100%}
/* the header of a page: the logo, the player, the round button */
.logo{position:absolute;left:${u(23)};top:${u(23)};width:${u(96)};aspect-ratio:5.349}
.logo svg{display:block;width:100%;height:100%}
.blue .logo{--lg-ink:#fff;--lg-blue:#fff;--lg-deep:#fff;--lg-word:#fff}
.player{position:absolute;left:${u(317.5)};top:${u(12)};width:${u(250)};height:${u(62)};border-radius:${u(12)};background:#fff;box-shadow:0 ${u(1)} ${u(2)} rgba(20,30,60,.08),0 ${u(8)} ${u(22)} rgba(20,30,60,.12)}
.tile{position:absolute;left:${u(12)};top:${u(11)};width:${u(26)};height:${u(26)};border-radius:${u(6)};background:#EEF1F5;display:grid;place-items:center}
.tile svg{width:${u(17)};height:${u(16)}}
.ttl{position:absolute;left:${u(48)};top:${u(9)};font-weight:700;font-size:${sz(12, 12)};line-height:1.15;color:#10193A;white-space:nowrap}
.sub{position:absolute;left:${u(48)};top:${u(27)};font-weight:700;font-size:${sz(9)};letter-spacing:.09em;color:#5B6478;line-height:1.2}
.pb{position:absolute;top:${u(10)};width:${u(27)};height:${u(27)};border-radius:50%;border:1px solid #E1E5EB;display:grid;place-items:center;color:#10193A;transition:background-color .15s ease-out,transform .15s ease-out}
.pb svg{width:${u(10)};height:${u(10)};display:block}
.pb.prev{right:${u(78)}}.pb.next{right:${u(46)}}.pb.menu{right:${u(14)}}
button.pb:hover,a.pb:hover{background:#F1F3F7}
button.pb:active{transform:scale(.94)}
.pb::after{content:"";position:absolute;inset:-6px}
.prog{position:absolute;left:${u(12)};right:${u(12)};bottom:${u(9)};height:1px;background:#E3E6EC}
.prog i{position:absolute;left:0;top:-.5px;height:2px;background:#10193A;transition:width .35s cubic-bezier(.22,1,.36,1)}
.share{position:absolute;right:${u(23)};top:${u(23)};width:${u(22)};height:${u(22)};border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center}
.share svg{width:${u(11)};height:${u(11)}}
.share::after{content:"";position:absolute;inset:-10px}
.blue .share{background:#fff;color:var(--ink)}
.tip{position:absolute;right:calc(100% + ${u(8)});top:50%;padding:${u(5)} ${u(9)};border-radius:${u(6)};background:var(--ink);color:#fff;font-size:${sz(10)};font-weight:700;white-space:nowrap;opacity:0;transform:translateY(-50%) translateX(4px);filter:blur(3px);pointer-events:none;transition:opacity .15s ease-out,transform .15s ease-out,filter .15s ease-out}
.share:hover .tip,.share:focus-visible .tip{opacity:1;transform:translateY(-50%);filter:blur(0)}
/* the three words */
.w{position:absolute;margin:0;font-weight:900;line-height:1;letter-spacing:-.035em;white-space:nowrap;color:var(--ink)}
.w1{left:${u(21)};top:${u(80)};font-size:${u(108)}}
.w2{left:0;right:0;top:${u(190)};text-align:center;font:italic 500 ${u(142)}/1 "Bodoni Moda","Cormorant Garamond",Georgia,serif;letter-spacing:-.01em;filter:blur(${u(2.1)});transition:filter .5s ease-out}
.main:hover .w2{filter:blur(0)}
.w3{right:${u(21)};top:${u(364)};font-size:${u(108)}}
.areas{position:absolute;left:${u(23)};bottom:${u(22)};margin:0;display:flex;flex-wrap:wrap;gap:.25em ${u(16)};font-size:${sz(10.5)};font-weight:500;color:#4D5870;max-width:${u(540)}}
.areas a{text-decoration:underline;text-decoration-color:transparent;text-underline-offset:.3em;transition:text-decoration-color .15s ease-out,color .15s ease-out}
.areas a:hover{color:var(--ink);text-decoration-color:currentColor}
.t{transition:opacity .2s ease-out,filter .2s ease-out,transform .2s ease-out;display:block}
.t.out{opacity:0;filter:blur(3px);transform:translateY(3px)}
:focus-visible{outline:2px solid #1B92D0;outline-offset:2px}
@media (max-width:700px){
  :root{--u:calc(100vw/480)}
  .stage{width:100vw;height:100svh}
  .card{width:${u(440)}}
  .main{left:${u(20)};top:13svh;height:66svh}
  .blue{left:${u(36)};top:4svh;height:60svh;transform:rotate(3.3deg) scale(.88)}
  .third{left:${u(46)};top:67svh;height:50svh;transform:rotate(-3.2deg) scale(.88)}
  .word{left:${u(10)};top:17svh;width:${u(420)}}
  .player{left:${u(16)};top:${u(52)};width:auto;right:${u(16)}}
  .logo{left:${u(16)};top:${u(18)};width:${u(104)}}
  .share{right:${u(16)};top:${u(15)}}
  .halftone{width:${u(440)};height:${u(150)}}
  .w1{left:${u(14)};top:${u(132)};font-size:${u(68)}}
  .w2{top:50%;transform:translateY(-54%);font-size:${u(92)}}
  .w3{right:${u(14)};top:auto;bottom:${u(84)};font-size:${u(68)}}
  .blue .player{display:none}
  .areas{left:${u(16)};right:${u(16)};bottom:${u(14)};max-width:none;gap:.3em ${u(12)};font-size:12px}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – forside, kortstokken (sketch)</title><style>${css}</style></head><body>${logoDefs}${logoWordDef}
<main class="page"><div class="stage">
<div class="card blue" aria-hidden="true" inert>${halftone()}${head(false, AREA_NAMES[1])}</div>
<div class="card third" aria-hidden="true" inert>${confetti()}<div class="word"><svg aria-hidden="true"><use href="#lg-word"/></svg></div></div>
<article class="card main">
${head(true, AREA_NAMES[0])}
<h1 class="sr">Consulting. Business development.</h1>
<div class="w w1" aria-hidden="true">Consulting</div><div class="w w2" aria-hidden="true">Business</div><div class="w w3" aria-hidden="true">development</div>
<nav class="areas" aria-label="Areas">${AREA_NAMES.map((a, i) => `<a href="../site/insights.html#${IDS[i]}">${a}</a>`).join('')}</nav>
<span class="sr" aria-live="polite" data-live></span>
</article>
</div></main>
<script>(function(){var A=${JSON.stringify(AREA_NAMES)},I=${JSON.stringify(IDS)},i=0,n=A.length;
var main=document.querySelector('[data-k=main]'),next=document.querySelector('[data-k=next]'),bar=document.querySelector('.main [data-prog]'),bar2=document.querySelector('.blue [data-prog]'),live=document.querySelector('[data-live]');
function swap(el,txt,href){el.classList.add('out');setTimeout(function(){el.textContent=txt;if(href)el.setAttribute('href',href);el.classList.remove('out');},150);}
function go(d){i=(i+d+n)%n;swap(main,A[i],'../site/insights.html#'+I[i]);swap(next,A[(i+1)%n]);bar.style.width=((i+1)/n*100)+'%';bar2.style.width=(((i+1)%n+1)/n*100)+'%';live.textContent=A[i];}
document.querySelector('.main button.prev').addEventListener('click',function(){go(-1);});
document.querySelector('.main button.next').addEventListener('click',function(){go(1);});})();</script>
</body></html>`;

write('forside-kort.html', html);
