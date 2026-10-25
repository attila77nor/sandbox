/* Screenshots for round 3 (concepts/explore/img/): the landing at three scroll positions. Run: node explore-r3-shots.cjs [outdir] */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = process.argv[2] || path.resolve(__dirname, '../concepts/explore/img');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const b = await chromium.launch(); const errs = [];
  const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../concepts/explore/forside.html'), { waitUntil: 'load' }); await p.waitForTimeout(1500);
  for (const [name, f] of [['forside-topp', 0], ['forside-overgang', 0.62], ['forside-rader', 99]]) {
    await p.evaluate((v) => window.scrollTo(0, v === 99 ? document.body.scrollHeight : innerHeight * v), f); await p.waitForTimeout(600);
    await p.screenshot({ path: path.join(out, name + '.png') });
  }
  console.log('errors:', errs); await b.close();
})();
