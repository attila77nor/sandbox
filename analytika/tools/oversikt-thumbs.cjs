/* Thumbnails for the overview (concepts/thumbs/): a screenshot of the top of every page, one image per sketch in the
   files that hold several (section.concept), plus the photographs and the inspiration images, resized.
   Also writes concepts/thumbs/concepts.json with each sketch's title and text, read from the page itself.
   Needs Playwright, and python3 with Pillow for the resizing.   Run: node oversikt-thumbs.cjs */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');

(async () => {
  const { ITEMS, HISTORY, EXPAND, PHOTOS, INSPIRATION } = await import('./oversikt-data.mjs');
  const root = path.resolve(__dirname, '..');
  const out = path.join(root, 'concepts/thumbs');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'thumbs-'));
  fs.mkdirSync(out, { recursive: true });
  const jobs = []; // [src, dst, width, quality]
  const concepts = {};
  const b = await chromium.launch(); const errs = [];
  const open = async (file, suffix = '') => {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(file + ': ' + e.message));
    await p.goto('file://' + path.join(root, file) + suffix, { waitUntil: 'load' });
    return [ctx, p];
  };
  for (const it of [...ITEMS, ...HISTORY]) {
    if (it.same) continue;
    const [ctx, p] = await open(it.file, it.thumbSuffix || '');
    await p.waitForTimeout(it.waitMs || 1600);
    const png = path.join(tmp, it.id + '.png');
    await p.screenshot({ path: png });
    jobs.push([png, path.join(out, it.id + '.jpg'), 520, 72]);
    await ctx.close();
  }
  for (const ex of EXPAND) {
    const [ctx, p] = await open(ex.file);
    await p.waitForTimeout(1500);
    const blocks = p.locator('section.concept');
    const n = await blocks.count();
    concepts[ex.file] = [];
    for (let i = 0; i < n; i++) {
      const blk = blocks.nth(i);
      const info = await blk.evaluate((el) => {
        const cap = el.querySelector('.cap'); const h = cap && cap.querySelector('h2');
        const raw = h ? h.innerText.replace(/\s+/g, ' ').trim() : '';
        const pTxt = cap && cap.querySelector('p') ? cap.querySelector('p').innerText.replace(/\s+/g, ' ').trim() : '';
        return { raw, p: pTxt };
      });
      const fav = /favorittvalg/i.test(info.raw);
      const title = info.raw.replace(/\s*Mitt favorittvalg\s*/i, '').trim();
      let text = info.p; if (text.length > 200) text = text.slice(0, 200).replace(/\s+\S*$/, '') + '…';
      concepts[ex.file].push({ i, title, text, fav });
      const stage = blk.locator('.stage').first();
      const png = path.join(tmp, `${ex.id}-${i}.png`);
      await ((await stage.count()) ? stage : blk).screenshot({ path: png });
      jobs.push([png, path.join(out, `${ex.id}-${i}.jpg`), 520, 72]);
    }
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(path.join(out, 'concepts.json'), JSON.stringify(concepts, null, 1));
  for (const ph of PHOTOS) jobs.push([path.join(root, ph.file), path.join(out, 'photo-' + ph.id + '.jpg'), 520, 74]);
  for (const g of INSPIRATION) {
    const files = fs.readdirSync(path.join(root, 'inspiration', g.dir)).filter((f) => /\.(png|webp|jpe?g)$/i.test(f)).sort();
    files.forEach((f) => jobs.push([path.join(root, 'inspiration', g.dir, f), path.join(out, 'inspo-' + g.dir + '-' + f.replace(/\.[^.]+$/, '') + '.jpg'), 340, 68]));
  }
  const code = `import sys, json\nfrom PIL import Image\nfor src, dst, w, q in json.load(open(sys.argv[1])):\n    im = Image.open(src).convert('RGB')\n    h = max(1, round(im.height * w / im.width))\n    im.resize((w, min(h, 2 * w)), Image.LANCZOS).save(dst, quality=q, optimize=True, progressive=True)\n`;
  const jf = path.join(tmp, 'jobs.json'); fs.writeFileSync(jf, JSON.stringify(jobs));
  const r = spawnSync('python3', ['-I', '-c', code, jf], { stdio: 'inherit' });
  console.log('thumbnails:', jobs.length, 'python exit', r.status, 'sketches per file:', Object.fromEntries(Object.entries(concepts).map(([k, v]) => [path.basename(k), v.length])), 'page errors:', errs);
})();
