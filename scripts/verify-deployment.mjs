import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

// Read-only verification of the deployed artifact. No form submissions or credentials.
const target = process.env.TEST_URL;
if (!target) throw new Error('Set TEST_URL to the actual deployed website URL.');
const url = new URL(target);
if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) {
  throw new Error('TEST_URL must be an HTTP(S) URL without embedded credentials.');
}
if (url.search || url.hash || !url.pathname.endsWith('/')) {
  throw new Error('TEST_URL must be the deployment base URL ending with /, without query or fragment.');
}
const expectedCommit = process.env.EXPECTED_COMMIT;
if (!expectedCommit || !/^[a-f0-9]{40}$/.test(expectedCommit)) {
  throw new Error('Set EXPECTED_COMMIT to the exact 40-character source commit.');
}
const output = path.resolve(process.env.VERIFY_OUT_DIR || 'test-results/deployment');
await mkdir(output, { recursive: true });
const report = { url: url.href, expectedCommit, checkedAt: new Date().toISOString(), checks: [] };
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let browser;
try {
  // A successful deploy job can precede CDN propagation. Retry only this exact target.
  let published;
  for (let attempt = 1; attempt <= 8; attempt++) {
    const infoUrl = new URL('build-info.json', url);
    infoUrl.searchParams.set('verify', `${expectedCommit}-${attempt}`);
    try {
      const response = await fetch(infoUrl, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
      if (response.ok) {
        const body = await response.json();
        if (body.commit === expectedCommit) { published = body; break; }
      }
    } catch (error) {
      if (attempt === 8) throw error;
    }
    if (attempt < 8) await sleep(5000);
  }
  assert.ok(published, 'The public build-info.json did not match the expected commit within the propagation window.');
  assert.equal(published.base, url.pathname, 'Published base path must match the deployment path.');
  assert.equal(published.designRevision, 'native-paper-r2');
  assert.equal(published.paperFileId, '01M6JNN71ZN4867VJZ83PPXQZ0');
  report.build = published;

  browser = await chromium.launch({ headless: true, args: ['--enable-webgl', '--enable-unsafe-swiftshader'] });
  for (const [name, width, height] of [['desktop', 1440, 1000], ['tablet', 768, 1024], ['mobile', 390, 844], ['narrow', 320, 800]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
    try {
      const page = await context.newPage();
      const javascriptErrors = [];
      const sameOriginFailures = [];
      page.on('pageerror', error => javascriptErrors.push(error.message));
      page.on('response', response => {
        if (new URL(response.url()).origin === url.origin && response.status() >= 400) {
          sameOriginFailures.push({ url: response.url(), status: response.status() });
        }
      });
      const response = await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 30000 });
      assert.equal(response?.status(), 200, `${name}: homepage did not return HTTP 200.`);
      await page.locator('h1').waitFor({ state: 'visible', timeout: 15000 });
      await page.waitForFunction(() => ['ready', 'fallback'].includes(document.querySelector('#product-stage')?.getAttribute('data-scene')), null, { timeout: 25000 });
      await page.evaluate(async () => {
        document.querySelectorAll('.will-reveal').forEach(element => element.classList.add('is-visible'));
        const images = [...document.images];
        images.forEach(image => { image.loading = 'eager'; });
        await Promise.all(images.map(image => image.decode().catch(() => undefined)));
        await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 8000))]);
      });
      const observation = await page.evaluate(() => ({
        width: innerWidth,
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
        mainHeadings: document.querySelectorAll('h1').length,
        scene: document.querySelector('#product-stage')?.getAttribute('data-scene'),
        brokenImages: [...document.images].filter(image => !image.complete || image.naturalWidth === 0).map(image => image.getAttribute('src')),
        touchTargets: [...document.querySelectorAll('[data-finish]')].map(element => ({ width: element.getBoundingClientRect().width, height: element.getBoundingClientRect().height }))
      }));
      assert.equal(observation.mainHeadings, 1, `${name}: expected one main heading.`);
      assert.equal(observation.horizontalOverflow, false, `${name}: horizontal overflow.`);
      assert.deepEqual(observation.brokenImages, [], `${name}: broken artwork.`);
      assert.deepEqual(javascriptErrors, [], `${name}: JavaScript exception.`);
      assert.deepEqual(sameOriginFailures, [], `${name}: failed site asset request.`);
      assert.ok(observation.touchTargets.every(control => control.width >= 44 && control.height >= 44), `${name}: finish touch target is too small.`);
      if (name === 'desktop') assert.equal(observation.scene, 'ready', 'Desktop WebGL enhancement did not initialize.');
      await page.screenshot({ path: path.join(output, `${name}-hero.png`) });
      report.checks.push({ name, status: 'passed', ...observation, javascriptErrors, sameOriginFailures });
    } finally { await context.close(); }
  }
  const missing = await fetch(new URL(`__aerlor_missing_${expectedCommit.slice(0, 12)}__`, url), { signal: AbortSignal.timeout(15000) });
  assert.equal(missing.status, 404, 'A missing route must return HTTP 404, not a false homepage success.');
  const missingHtml = await missing.text();
  assert.ok(missingHtml.includes(`href="${url.pathname}"`), 'The custom 404 must return to the correct deployment base.');
  report.custom404 = { status: missing.status, returnPath: url.pathname };
  report.status = 'passed';
} catch (error) {
  report.status = 'failed';
  report.error = error instanceof Error ? error.message : String(error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  await writeFile(path.join(output, 'receipt.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
}
