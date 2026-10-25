const { chromium } = require('playwright');
const path = require('path');
const base = process.env.SHOTS || '/tmp';
const dir = 'file://' + path.resolve(__dirname, '../concepts/site');
(async () => {
  const b = await chromium.launch();
  const errs = [];
  const open = async (file, vp, init = false) => {
    const ctx = await b.newContext({ viewport: vp, isMobile: vp.width < 500, hasTouch: vp.width < 500 });
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errs.push(file + ': ' + e.message));
    if (init) await p.addInitScript(() => { window.__FULL = true; });
    await p.goto(`${dir}/${file}`, { waitUntil: 'load' });
    await p.waitForTimeout(1300);
    return [ctx, p];
  };
  let [ctx, p] = await open('index.html', { width: 1440, height: 900 }, true);
  await p.screenshot({ path: `${base}/site-index-desktop.png`, fullPage: true });
  console.log('index-desktop', await p.evaluate(() => document.documentElement.scrollHeight));
  await ctx.close();
  [ctx, p] = await open('index.html', { width: 390, height: 844 }, true);
  await p.screenshot({ path: `${base}/site-index-mobile.png`, fullPage: true });
  await ctx.close();

  [ctx, p] = await open('people.html', { width: 1440, height: 900 });
  await p.screenshot({ path: `${base}/site-people.png`, fullPage: true });
  await p.locator('.al li a').nth(8).hover();
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${base}/site-people-hover.png`, clip: { x: 0, y: 150, width: 1440, height: 520 } });
  await ctx.close();
  [ctx, p] = await open('people.html', { width: 390, height: 844 });
  await p.screenshot({ path: `${base}/site-people-mobile.png`, fullPage: true });
  await ctx.close();

  [ctx, p] = await open('insights.html', { width: 1440, height: 900 });
  await p.screenshot({ path: `${base}/site-insights-closed.png`, clip: { x: 0, y: 0, width: 1440, height: 560 } });
  await p.locator('.area[data-area="actuary"]').click();
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${base}/site-insights-open.png`, fullPage: true });
  await ctx.close();
  [ctx, p] = await open('insights-actuary-risk.html', { width: 1440, height: 900 });
  await p.screenshot({ path: `${base}/site-insights-detail.png`, fullPage: true });
  await ctx.close();
  [ctx, p] = await open('insights.html', { width: 390, height: 844 });
  await p.screenshot({ path: `${base}/site-insights-mobile.png`, fullPage: true });
  await ctx.close();

  for (const n of ['about']) {
    [ctx, p] = await open(`${n}.html`, { width: 1440, height: 900 });
    await p.screenshot({ path: `${base}/site-${n}.png`, fullPage: true });
    await ctx.close();
  }
  [ctx, p] = await open('about.html', { width: 390, height: 844 });
  await p.screenshot({ path: `${base}/site-about-mobile.png`, fullPage: true });
  await ctx.close();
  // products: viewport shots at several scroll positions
  [ctx, p] = await open('products.html', { width: 1440, height: 900 });
  const tops = await p.evaluate(() => ['indie', 'n-models', 'triangles', 'ai'].map((id) => document.getElementById(id).offsetTop));
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  const stops = [['top', 0], ['into-photo', tops[0] - 640], ['indie', tops[0] - 150], ['gap2', tops[1] - 600], ['triangles', tops[2] - 150], ['end', total]];
  let i = 0;
  for (const [name, y] of stops) {
    await p.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y);
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${base}/prod-${i}-${name}.png` });
    i++;
  }
  await ctx.close();

  // clickable preview
  ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  p = await ctx.newPage();
  p.on('pageerror', (e) => errs.push('preview: ' + e.message));
  const fr = () => p.frameLocator('#f');
  const out = [];
  for (const [word, kind] of [['People', 'title'], ['Insights', 'title'], ['Products', 'logos'], ['About us', 'title']]) {
    await p.goto(`${dir}/preview.html`, { waitUntil: 'load' });
    await p.waitForTimeout(900);
    await fr().locator('.blk', { hasText: word }).first().scrollIntoViewIfNeeded();
    await fr().locator('.blk', { hasText: word }).first().click();
    await p.waitForTimeout(900);
    const t = kind === 'title' ? await fr().locator('h1.page-title').first().textContent() : await fr().locator('.logos5 .nm').first().textContent();
    out.push(word + ' -> ' + t);
  }
  // Insights flow inside the preview
  await p.goto(`${dir}/preview.html`, { waitUntil: 'load' });
  await p.waitForTimeout(900);
  await fr().locator('.areas a', { hasText: 'Actuary' }).click();
  await p.waitForTimeout(1000);
  const open1 = await fr().locator('#p-actuary').evaluate((e) => !e.hidden);
  out.push('landing area link Actuary -> panel open: ' + open1);
  await fr().locator('.subrows a', { hasText: 'Risk actuary' }).click();
  await p.waitForTimeout(900);
  out.push('Risk actuary -> ' + (await fr().locator('h1.page-title').first().textContent()));
  await fr().locator('.back').click();
  await p.waitForTimeout(900);
  out.push('back to Actuary -> panel open: ' + (await fr().locator('#p-actuary').evaluate((e) => !e.hidden)));
  await fr().locator('nav a', { hasText: 'About us' }).click();
  await p.waitForTimeout(800);
  await fr().locator('nav a', { hasText: 'Join us' }).first().click();
  await p.waitForTimeout(1200);
  out.push('Join us anchor -> #join top at ' + (await fr().locator('#join').evaluate((e) => Math.round(e.getBoundingClientRect().top))) + 'px');
  // products logo click
  await fr().locator('nav a', { hasText: 'Products' }).click();
  await p.waitForTimeout(900);
  await fr().locator('.lg', { hasText: 'Triangles' }).click();
  await p.waitForTimeout(1500);
  out.push('logo Triangles -> section top at ' + (await fr().locator('#triangles').evaluate((e) => Math.round(e.getBoundingClientRect().top))) + 'px');
  console.log(out.join('\n'));
  console.log('errors:', JSON.stringify(errs));
  await b.close();
})();
