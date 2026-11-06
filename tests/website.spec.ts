import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function settled(page:import('@playwright/test').Page){await page.waitForFunction(()=>getComputedStyle(document.body).marginTop==='0px');await page.evaluate(async()=>{await document.fonts.ready;});}
async function product(page:import('@playwright/test').Page){await page.goto('./products/hairdryer-premium/',{waitUntil:'domcontentloaded'});await settled(page);}
test.beforeEach(async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./',{waitUntil:'domcontentloaded'});await settled(page);});
test('homepage presents the three-category collection with clear product and hotel paths',async({page})=>{
 await expect(page).toHaveTitle('The essentials. Reimagined. | AERLOR');await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('h1')).toHaveText('The essentials.Reimagined.');
 await expect(page.locator('.hero-description')).toContainText('Hairdryers, illuminated mirrors and styling tools');await expect(page.locator('.category-card')).toHaveCount(3);
await expect(page.locator('.r5-hero .hero-actions a')).toHaveCount(2);
 await expect(page.locator('h1 em,h2 em')).toHaveCount(0);await expect(page.locator('.footer-status')).toContainText('Collection in development');await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex,nofollow');
});
test('primary navigation sends buyers to real collection and hotel pages',async({page})=>{
 await expect(page.locator('.r5-hero .hero-actions').getByRole('link',{name:'Explore products'})).toHaveAttribute('href',/collection\/$/);
 await page.locator('.r5-hero .hero-actions').getByRole('link',{name:'For hotels',exact:true}).click();await expect(page.locator('h1')).toContainText('The room is beautiful.');
 await expect(page.getByRole('link',{name:'Plan your property',exact:true})).toHaveAttribute('href',/hospitality\/wholesale\/$/);
});
test('homepage product presentation never requires WebGL or eager 3D loading',async({page})=>{
 await expect(page.locator('.r5-signature')).toBeVisible();await expect(page.locator('canvas')).toHaveCount(0);expect(await page.evaluate(()=>performance.getEntriesByType('resource').some(r=>/studio-models/.test(r.name)))).toBe(false);
});
test('retail flagship uses original gallery studies and preserves the selected concept',async({page})=>{
 await product(page);
 const retail=page.locator('[data-retail-root]');
 await expect(retail.locator('[data-gallery-image]')).toHaveAttribute('src',/retail\/product-porcelain\.png$/);
 await expect(retail.locator('.retail-thumb img')).toHaveCount(5);
 await expect.poll(()=>retail.locator('.retail-thumb img').evaluateAll(els=>els.every(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0))).toBe(true);
 await retail.getByRole('button',{name:'Outlet detail view'}).click();
 await expect(retail.locator('[data-gallery-image]')).toHaveAttribute('src',/retail\/macro-outlet\.png$/);
 await retail.getByRole('button',{name:'Controls detail view'}).click();
 await expect(retail.locator('[data-gallery-image]')).toHaveAttribute('src',/retail\/macro-controls\.png$/);
 await retail.getByRole('button',{name:'Intake detail view'}).click();
 await expect(retail.locator('[data-gallery-image]')).toHaveAttribute('src',/retail\/macro-intake\.png$/);
 await retail.getByRole('button',{name:'In use view'}).click();
 await expect(retail.locator('[data-gallery-image]')).toHaveAttribute('src',/retail\/ritual-model\.jpg$/);
 await expect(page.locator('#gallery-caption')).toContainText('lifestyle visualization');
 await retail.getByRole('button',{name:'Stone finish'}).click();
 await expect(retail.locator('[data-gallery-image]')).toHaveAttribute('src',/retail\/product-stone\.png$/);
 await expect(retail.locator('[data-product-finish]')).toHaveValue('Stone');
 await expect(retail.locator('[data-retail-view=product] img')).toHaveAttribute('src',/retail\/thumb-stone\.jpg$/);
 await retail.getByRole('button',{name:'Graphite finish'}).click();
 await expect(retail.locator('[data-gallery-image]')).toHaveAttribute('src',/retail\/product-graphite\.png$/);
 await expect(retail.locator('[data-product-finish]')).toHaveValue('Graphite');
 await expect(retail.getByRole('button',{name:'Graphite finish'})).toHaveAttribute('aria-pressed','true');
 await retail.getByRole('button',{name:'Increase quantity'}).click();
 await expect(retail.locator('[data-product-quantity]')).toHaveValue('2');
 await retail.getByRole('button',{name:'Add to your project'}).click();
 await expect(page.locator('#cart-notice')).toContainText('added to your project');
 await page.goto('./cart/',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.cart-line')).toContainText('Graphite');
});
for(const [finish,key] of [['Stone','stone'],['Graphite','graphite']] as const){
 test(`finish discovery selects ${finish} and preserves it in the project bag`,async({page})=>{
  await product(page);
  const retail=page.locator('[data-retail-root]');
  const cards=page.locator('[data-retail-select-finish]');
  await expect(cards).toHaveCount(3);
  await expect(retail.locator('[data-retail-select-finish]')).toHaveCount(0);
  await expect(retail.locator('[data-product-finish]')).toHaveValue('Porcelain White');
  await retail.getByRole('button',{name:'Outlet detail view'}).click();
  await expect(retail.locator('[data-retail-stage]')).toHaveAttribute('data-media','outlet');
  await retail.getByRole('button',{name:'Increase quantity'}).click();
  await expect(retail.locator('[data-product-quantity]')).toHaveValue('2');

  await page.locator(`[data-retail-select-finish="${finish}"]`).click();

  await expect(retail.locator('[data-product-finish]')).toHaveValue(finish);
  await expect(retail.locator('[data-retail-finish-label]')).toHaveText(finish);
  await expect(retail.locator(`[data-retail-swatch="${finish}"]`)).toHaveAttribute('aria-pressed','true');
  await expect(retail.locator('[data-retail-stage]')).toHaveAttribute('data-media','product');
  await expect(retail.locator('[data-retail-view="product"]')).toHaveAttribute('aria-pressed','true');
  await expect(retail.locator('[data-gallery-image]')).toHaveAttribute('src',new RegExp(`retail/product-${key}[.]png$`));
  await expect(retail.locator('[data-retail-view="product"] img')).toHaveAttribute('src',new RegExp(`retail/thumb-${key}[.]jpg$`));
  await expect(page.locator('#gallery-caption')).toHaveText(`${finish} · preproduction product visualization`);
  await expect.poll(()=>retail.locator('[data-gallery-image],[data-retail-view="product"] img').evaluateAll(images=>images.length===2&&images.every(image=>(image as HTMLImageElement).complete&&(image as HTMLImageElement).naturalWidth>0))).toBe(true);
  await expect(retail).toBeInViewport();
  await expect(retail.locator('[data-product-quantity]')).toHaveValue('2');
  await retail.getByRole('button',{name:'Add to your project'}).click();
  await expect(page.locator('#cart-notice')).toContainText('added to your project');
  await page.goto('./cart/',{waitUntil:'domcontentloaded'});
  const line=page.locator('.cart-line');
  await expect(line).toHaveCount(1);
  await expect(line).toContainText(finish);
  await expect(line.getByRole('spinbutton')).toHaveValue('2');
  await expect(line.locator('.cart-line-image')).toHaveAttribute('src',new RegExp(`retail/product-${key}[.]png$`));
  await page.reload({waitUntil:'domcontentloaded'});
  await expect(line).toHaveCount(1);
  await expect(line).toContainText(finish);
  await expect(line.getByRole('spinbutton')).toHaveValue('2');
 });
}
test('retail lightbox opens and closes with keyboard focus restored',async({page})=>{
 await product(page);
 const zoom=page.getByRole('button',{name:'View larger product image'});
 await zoom.click();
 await expect(page.getByRole('dialog',{name:'Enlarged product image'})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog',{name:'Enlarged product image'})).not.toBeVisible();
 await expect(zoom).toBeFocused();
});
test('optional geometry study is not represented as the production product',async({page})=>{
 await product(page);await expect(page.locator('.r5-model-study')).toContainText('not production CAD');await expect(page.locator('#product-stage')).toHaveAttribute('data-scene','static');await expect(page.locator('#scene-canvas canvas')).toHaveCount(0);
 for(const [label,key]of [['Champagne','champagne'],['Pearl','pearl'],['Graphite','graphite']]){const button=page.locator('.r5-model-study').getByRole('button',{name:`${label} finish`,exact:true});await button.click();await expect(button).toHaveAttribute('aria-pressed','true');await expect(page.locator('.hero-fallback')).toHaveAttribute('src',new RegExp(`dryer-${key}-hero\\.webp$`));}
});
test('optional 3D inspection supports keyboard controls and focus return',async({page})=>{
 await product(page);await page.getByRole('button',{name:'Inspect in 3D'}).click();await expect(page.locator('#product-stage')).toHaveAttribute('data-scene',/ready|fallback/,{timeout:30000});
 if(await page.locator('#product-stage').getAttribute('data-scene')==='fallback'){await expect(page.locator('.hero-fallback')).toBeVisible();return;}
 await expect(page.locator('#scene-canvas canvas')).toHaveCount(1);await page.locator('#scene-canvas').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('Home');await page.keyboard.press('Escape');await expect(page.locator('#product-stage')).toHaveAttribute('data-scene','static');await expect(page.getByRole('button',{name:'Inspect in 3D'})).toBeFocused();
});
test('3D enhancement failure preserves a useful static product study',async({page})=>{
 await product(page);await page.route('**/*studio-models*.js',route=>route.abort());await page.getByRole('button',{name:'Inspect in 3D'}).click();await expect(page.locator('#product-stage')).toHaveAttribute('data-scene','fallback',{timeout:30000});await expect(page.locator('.hero-fallback')).toBeVisible();await expect(page.locator('#viewer-status')).toContainText('could not load');
});
test('finish and gallery controls have usable touch targets',async({page})=>{await product(page);for(const el of await page.locator('[data-finish],[data-retail-view],[data-retail-swatch]').all()){const box=await el.boundingBox();expect(box?.width).toBeGreaterThanOrEqual(44);expect(box?.height).toBeGreaterThanOrEqual(44);}});
test('mobile navigation restores focus and reaches the collection',async({page,isMobile})=>{
 test.skip(!isMobile,'Mobile-specific interaction');const toggle=page.getByRole('button',{name:'Open menu'});await toggle.click();await expect(page.locator('#mobile-menu')).toBeVisible();await page.keyboard.press('Escape');await expect(toggle).toBeFocused();await expect(page.locator('#mobile-menu')).toBeHidden();await toggle.click();await page.locator('#mobile-menu').getByRole('link',{name:'All products',exact:true}).click();await expect(page.locator('h1')).toContainText('A complete room.');
});
test('homepage artwork loads without overflow at the current viewport',async({page})=>{await page.evaluate(async()=>{for(const im of document.images)im.loading='eager';await Promise.all([...document.images].map(im=>im.decode()));});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);});
test('homepage, product page and optional viewer pass automated WCAG rules',async({page})=>{
 test.setTimeout(90000);const baseline=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(baseline.violations).toEqual([]);await product(page);const pdp=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(pdp.violations).toEqual([]);await page.getByRole('button',{name:'Inspect in 3D'}).click();await expect(page.locator('#product-stage')).toHaveAttribute('data-scene',/ready|fallback/,{timeout:30000});const viewer=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(viewer.violations).toEqual([]);
});
test('brand and product content remain usable without JavaScript',async({browser,baseURL})=>{const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto(baseURL!);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.r5-signature')).toBeVisible();await expect(page.locator('.category-card')).toHaveCount(3);await expect(page.locator('.noscript-note')).toContainText('without JavaScript');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();});
