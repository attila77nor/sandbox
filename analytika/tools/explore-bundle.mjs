/* One self-contained file, concepts/explore/preview.html, with every exploration page inside it.
   The photograph is embedded, links between pages are rewired, and links to pages that are not designed yet
   open a plain stand-in with a Back button. Open this one file; it needs nothing next to it (only the web fonts). */
import { readFileSync, writeFileSync } from 'node:fs';

const dir = new URL('../concepts/explore/', import.meta.url);
const KEYS = ['oslo', 'oslo-people', 'tabell', 'tabell-people', 'trekant', 'trekant-people', 'tetthet', 'tetthet-people', 'vegg-hvit', 'vegg-marine', 'vegg-zoom'].map((n) => n + '.html');
const TABS = [
  ['Round 1', [['Oslo-lys', 'oslo.html'], ['Tabell', 'tabell.html'], ['Trekanten', 'trekant.html'], ['Tetthet', 'tetthet.html']]],
  ['Round 2, the photograph', [['Hvit', 'vegg-hvit.html'], ['Marine', 'vegg-marine.html'], ['Zoom', 'vegg-zoom.html']]],
];
const PHOTO = 'data:image/jpeg;base64,' + readFileSync(new URL('../assets/photo/tavler.jpg', import.meta.url)).toString('base64');
const AREA = { actuary: 'Actuary', pricing: 'Pricing', 'data-platforms': 'Data platforms', consulting: 'Consulting', 'business-development': 'Business development' };
const SUB = { risk: 'Risk actuary', compliance: 'Compliance', reserving: 'Reserving', 'life-pension': 'Life and pension' };

/* what a link in a page file should become inside the bundle */
function fix(h) {
  if (!h || h[0] === '#' || /^(https?:|mailto:)/.test(h)) return h;
  if (KEYS.includes(h)) return h;
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
const CLICK = `<script>document.addEventListener('click',function(e){if(e.defaultPrevented)return;var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');if(!h)return;if(h.charAt(0)==='#'){e.preventDefault();var t=h.length>1&&document.getElementById(h.slice(1));if(t)t.scrollIntoView({behavior:'smooth'});return;}if(/^(https?:|mailto:)/.test(h))return;e.preventDefault();parent.postMessage({go:h},'*');});</script>`;

const pages = {};
for (const k of KEYS) {
  let s = readFileSync(new URL(k, dir), 'utf8');
  s = s.replace(/(<a\b[^>]*?\shref=")([^"]*)(")/g, (_, a, h, c) => a + fix(h) + c);
  s = s.split('../../assets/photo/tavler.jpg').join('__PHOTO__');
  pages[k] = s.replace('</body>', CLICK + '</body>');
}
const json = JSON.stringify(pages).replace(/<\//g, '<\\/');

const bar = TABS.map(([g, items]) => `<span class="g">${g}</span>${items.map(([n, f]) => `<button type="button" data-p="${f}">${n}</button>`).join('')}`).join('');
write();
function write() {
  writeFileSync(new URL('preview.html', dir), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Analytika – exploration preview</title>
<style>html,body{margin:0;height:100%;background:#14161B}body{display:flex;flex-direction:column}
#bar{flex:none;display:flex;align-items:center;gap:6px;height:38px;padding:0 14px;overflow-x:auto;white-space:nowrap;background:#14161B;color:#EDEFF3;font:400 12.5px/1 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}
#bar .g{margin:0 4px 0 14px;color:#8A90A0;font-size:11.5px}#bar .g:first-child{margin-left:0}
#bar button{appearance:none;background:none;border:0;padding:6px 9px;border-radius:4px;color:#C9CED8;font:inherit;cursor:pointer}
#bar button:hover{color:#fff;background:#232733}#bar button[aria-current]{color:#fff;background:#2B3140}
iframe{flex:1;border:0;width:100%;display:block;background:#fff}</style></head>
<body><div id="bar">${bar}</div><iframe id="f" title="Analytika exploration preview"></iframe>
<script>
var pages=${json},PHOTO=${JSON.stringify(PHOTO)},stack=[],f=document.getElementById('f');
function stand(name){return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{height:100%;margin:0}body{display:grid;place-items:center;background:#F3F3F1;color:#14161B;font:15px/1.5 system-ui,-apple-system,"Segoe UI",Arial,sans-serif}div{text-align:center;padding:24px}b{display:block;font-size:20px;font-weight:500;margin-bottom:.4rem}p{margin:0 0 1.4rem;color:#5C6270}button{font:inherit;padding:.55rem 1.1rem;border:1px solid #BFC4CE;border-radius:4px;background:#fff;cursor:pointer}button:hover{border-color:#14161B}</style></head><body><div><b>'+name.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</b><p>Not designed in this sketch yet.</p><button type="button" onclick="parent.postMessage({back:1},\\'*\\')">Back</button></div></body></html>';}
function src(k){return k.indexOf('ph:')===0?stand(k.slice(3)):(pages[k]||stand(k)).split('__PHOTO__').join(PHOTO);}
function mark(k){var t=k.replace('-people','');[].forEach.call(document.querySelectorAll('#bar button'),function(b){if(b.dataset.p===t)b.setAttribute('aria-current','page');else if(k.indexOf('ph:')!==0)b.removeAttribute('aria-current');});}
function go(k,keep){if(!keep)stack.push(k);f.srcdoc=src(k);mark(k);}
window.addEventListener('message',function(e){if(!e.data)return;if(e.data.go)go(e.data.go);if(e.data.back&&stack.length>1){stack.pop();go(stack[stack.length-1],true);}});
[].forEach.call(document.querySelectorAll('#bar button'),function(b){b.addEventListener('click',function(){stack=[];go(b.dataset.p);});});
var h=decodeURIComponent(location.hash.slice(1));go(pages[h]?h:'vegg-hvit.html');
</script></body></html>`);
  console.log('wrote preview.html');
}
