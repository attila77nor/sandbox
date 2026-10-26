/* Thumbnails for the overview (concepts/thumbs/): a screenshot of the top of every page, plus the photographs
   and the inspiration images, resized. Needs Playwright, and python3 with Pillow for the resizing.
   Run: node oversikt-thumbs.cjs */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');

(async () => {
  const { ITEMS, PHOTOS, INSPIRATION } = await import('./oversikt-data.mjs');
  const root = path.resolve(__dirname, '..');
  const out = path.join(root, 'concepts/thumbs');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'thumbs-'));
  fs.mkdirSync(out, { recursive: true });
  const jobs = []; // [src, dst, width, quality]
  const b = await chromium.launch(); const errs = [];
  for (const it of ITEMS) {
    if (it.same) continue;
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(it.id + ': ' + e.message));
    await p.goto('file://' + path.join(root, it.file) + (it.thumbSuffix || ''), { waitUntil: 'load' });
    await p.waitForTimeout(it.waitMs || 1600);
    const png = path.join(tmp, it.id + '.png');
    await p.screenshot({ path: png });
    jobs.push([png, path.join(out, it.id + '.jpg'), 560, 74]);
    await ctx.close();
  }
  await b.close();
  for (const ph of PHOTOS) jobs.push([path.join(root, ph.file), path.join(out, 'photo-' + ph.id + '.jpg'), 560, 76]);
  for (const g of INSPIRATION) {
    const files = fs.readdirSync(path.join(root, 'inspiration', g.dir)).filter((f) => /\.(png|webp|jpe?g)$/i.test(f)).sort();
    files.forEach((f) => jobs.push([path.join(root, 'inspiration', g.dir, f), path.join(out, 'inspo-' + g.dir + '-' + f.replace(/\.[^.]+$/, '') + '.jpg'), 360, 70]));
  }
  const code = `import sys, json\nfrom PIL import Image\nfor src, dst, w, q in json.load(open(sys.argv[1])):\n    im = Image.open(src).convert('RGB')\n    h = max(1, round(im.height * w / im.width))\n    im.resize((w, min(h, 2 * w)), Image.LANCZOS).save(dst, quality=q, optimize=True, progressive=True)\n`;
  const jf = path.join(tmp, 'jobs.json'); fs.writeFileSync(jf, JSON.stringify(jobs));
  const r = spawnSync('python3', ['-I', '-c', code, jf], { stdio: 'inherit' });
  console.log('thumbnails:', jobs.length, 'python exit', r.status, 'page errors:', errs);
})();
