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
test('product galleries change views accessibly and preserve the selected order configuration',async({page})=>{
 await product(page);await page.getByRole('button',{name:'Detail view',exact:true}).click();await expect(page.locator('[data-gallery-image]')).toHaveAttribute('src',/dryer-signature-detail\.webp$/);await expect(page.getByRole('button',{name:'Detail view',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'In the room view',exact:true}).click();await expect(page.locator('#gallery-caption')).toContainText('room-placement');await expect(page.locator('[data-product-finish]')).toHaveValue('Champagne');
 await page.locator('[data-product-finish]').selectOption('Graphite');await expect(page.locator('[data-gallery-image]')).toHaveAttribute('src',/travel-case\.webp$/);await expect(page.locator('#gallery-caption')).toContainText('Graphite');await expect(page.getByRole('button',{name:'Product view',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.getByRole('button',{name:'Presentation view',exact:true}).click();await expect(page.locator('#gallery-caption')).toContainText('Champagne');await expect(page.locator('[data-product-finish]')).toHaveValue('Graphite');
});
test('optional geometry study is not represented as the production product',async({page})=>{
 await product(page);await expect(page.locator('.r5-model-study')).toContainText('not production CAD');await expect(page.locator('#product-stage')).toHaveAttribute('data-scene','static');await expect(page.locator('#scene-canvas canvas')).toHaveCount(0);
 for(const [label,key]of [['Champagne','champagne'],['Pearl','pearl'],['Graphite','graphite']]){const button=page.getByRole('button',{name:`${label} finish`,exact:true});await button.click();await expect(button).toHaveAttribute('aria-pressed','true');await expect(page.locator('.hero-fallback')).toHaveAttribute('src',new RegExp(`dryer-${key}-hero\\.webp$`));}
});
test('optional 3D inspection supports keyboard controls and focus return',async({page})=>{
 await product(page);await page.getByRole('button',{name:'Inspect in 3D'}).click();await expect(page.locator('#product-stage')).toHaveAttribute('data-scene',/ready|fallback/,{timeout:30000});
 if(await page.locator('#product-stage').getAttribute('data-scene')==='fallback'){await expect(page.locator('.hero-fallback')).toBeVisible();return;}
 await expect(page.locator('#scene-canvas canvas')).toHaveCount(1);await page.locator('#scene-canvas').focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('Home');await page.keyboard.press('Escape');await expect(page.locator('#product-stage')).toHaveAttribute('data-scene','static');await expect(page.getByRole('button',{name:'Inspect in 3D'})).toBeFocused();
});
test('3D enhancement failure preserves a useful static product study',async({page})=>{
 await product(page);await page.route('**/*studio-models*.js',route=>route.abort());await page.getByRole('button',{name:'Inspect in 3D'}).click();await expect(page.locator('#product-stage')).toHaveAttribute('data-scene','fallback',{timeout:30000});await expect(page.locator('.hero-fallback')).toBeVisible();await expect(page.locator('#viewer-status')).toContainText('could not load');
});
test('finish and gallery controls have usable touch targets',async({page})=>{await product(page);for(const el of await page.locator('[data-finish],[data-gallery-view]').all()){const box=await el.boundingBox();expect(box?.width).toBeGreaterThanOrEqual(44);expect(box?.height).toBeGreaterThanOrEqual(44);}});
test('mobile navigation restores focus and reaches the collection',async({page,isMobile})=>{
 test.skip(!isMobile,'Mobile-specific interaction');const toggle=page.getByRole('button',{name:'Open menu'});await toggle.click();await expect(page.locator('#mobile-menu')).toBeVisible();await page.keyboard.press('Escape');await expect(toggle).toBeFocused();await expect(page.locator('#mobile-menu')).toBeHidden();await toggle.click();await page.locator('#mobile-menu').getByRole('link',{name:'All products',exact:true}).click();await expect(page.locator('h1')).toContainText('A complete room.');
});
test('homepage artwork loads without overflow at the current viewport',async({page})=>{await page.evaluate(async()=>{for(const im of document.images)im.loading='eager';await Promise.all([...document.images].map(im=>im.decode()));});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);});
test('homepage, product page and optional viewer pass automated WCAG rules',async({page})=>{
 test.setTimeout(90000);const baseline=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(baseline.violations).toEqual([]);await product(page);const pdp=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(pdp.violations).toEqual([]);await page.getByRole('button',{name:'Inspect in 3D'}).click();await expect(page.locator('#product-stage')).toHaveAttribute('data-scene',/ready|fallback/,{timeout:30000});const viewer=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(viewer.violations).toEqual([]);
});
test('brand and product content remain usable without JavaScript',async({browser,baseURL})=>{const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto(baseURL!);await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.r5-signature')).toBeVisible();await expect(page.locator('.category-card')).toHaveCount(3);await expect(page.locator('.noscript-note')).toContainText('without JavaScript');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();});
