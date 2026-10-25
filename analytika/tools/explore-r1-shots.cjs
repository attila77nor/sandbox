/* Screenshots for round 1 (concepts/explore/img/). Run: node explore-r1-shots.cjs [outdir] */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const dir = 'file://' + path.resolve(__dirname, '../concepts/explore');
const out = process.argv[2] || path.resolve(__dirname, '../concepts/explore/img');
fs.mkdirSync(out, { recursive: true });
const shots = [
  ['oslo.html?at=2026-06-21T11:00Z', 'oslo-day', 3600],
  ['oslo.html?at=2026-06-21T22:00Z', 'oslo-white-night', 3600],
  ['oslo.html?at=2026-12-15T15:30Z', 'oslo-winter', 3600],
  ['oslo-people.html?at=2026-12-15T11:00Z', 'oslo-people', 900],
  ['tabell.html', 'tabell', 1500],
  ['tabell-people.html', 'tabell-people', 1200],
  ['trekant.html', 'trekant', 6500],
  ['trekant-people.html', 'trekant-people', 1200],
  ['tetthet.html', 'tetthet', 900, true],
  ['tetthet-people.html', 'tetthet-people', 900],
];
(async () => {
  const b = await chromium.launch();
  const errs = [];
  for (const [file, name, wait, full] of shots) {
    for (const [tag, vp] of [['', { width: 1440, height: 900 }], ['-mobile', { width: 390, height: 844 }]]) {
      if (tag && !process.env.MOBILE) continue;
      const ctx = await b.newContext({ viewport: vp, isMobile: !!tag, hasTouch: !!tag });
      const p = await ctx.newPage();
      p.on('pageerror', (e) => errs.push(name + ': ' + e.message));
      await p.goto(`${dir}/${file}`, { waitUntil: 'load' });
      await p.waitForTimeout(wait);
      await p.screenshot({ path: path.join(out, name + tag + '.png'), fullPage: !!tag || !!full });
      if (tag) console.log(name, 'scrollWidth', await p.evaluate(() => document.documentElement.scrollWidth));
      await ctx.close();
    }
  }
  console.log('errors:', errs);
  await b.close();
})();
