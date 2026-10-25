/* Screenshots for round 2 (concepts/explore/img/). Run: node explore-r2-shots.cjs [outdir] */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const E = 'file://' + path.resolve(__dirname, '../concepts/explore') + '/';
const out = process.argv[2] || path.resolve(__dirname, '../concepts/explore/img');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch(); const errs = [];
  const open = async (f, w = 1440, h = 900) => { const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage(); p.on('pageerror', (e) => errs.push(f + ' ' + e.message)); await p.goto(E + f, { waitUntil: 'load' }); await p.waitForTimeout(1300); return p; };
  let p = await open('vegg-hvit.html'); await p.screenshot({ path: path.join(out, 'vegg-hvit.png') });
  await p.locator('.board[data-id="data-platforms"]').hover(); await p.waitForTimeout(600); await p.screenshot({ path: path.join(out, 'vegg-hvit-hover.png') });
  p = await open('vegg-marine.html'); await p.screenshot({ path: path.join(out, 'vegg-marine.png') });
  p = await open('vegg-marine.html#pricing'); await p.waitForTimeout(1500); await p.screenshot({ path: path.join(out, 'vegg-marine-apen.png') });
  p = await open('vegg-zoom.html'); await p.screenshot({ path: path.join(out, 'vegg-zoom.png') });
  await p.locator('.board[data-id="actuary"]').click(); await p.waitForTimeout(2300); await p.screenshot({ path: path.join(out, 'vegg-zoom-aktuar.png') });
  console.log('errors:', errs); await b.close();
})();
