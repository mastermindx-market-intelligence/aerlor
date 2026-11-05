import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('./',{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>getComputedStyle(document.body).marginTop==='0px');
 await page.evaluate(async()=>{await document.fonts.ready;});
});

test('homepage explains the product range and buyer path in semantic HTML',async({page})=>{
 await expect(page).toHaveTitle('Better tools. Better stays. | AERLOR');
 await expect(page.locator('h1')).toHaveCount(1);
 await expect(page.locator('h1')).toHaveText('Better tools.Better stays.');
 await expect(page.locator('.hero-description')).toContainText('Hairdryers, illuminated mirrors and styling tools');
 await expect(page.locator('.category-card')).toHaveCount(3);
 await expect(page.locator('.buyer-paths a')).toHaveCount(3);
 await expect(page.locator('h1 em,h2 em')).toHaveCount(0);
 await expect(page.locator('.footer-status')).toContainText('Collection in development');
 await expect(page.locator('meta[name=robots]')).toHaveAttribute('content','noindex,nofollow');
});
test('the primary hotel and product actions lead to real pages',async({page})=>{
 await expect(page.locator('.hero-actions').getByRole('link',{name:'Explore the collection'})).toHaveAttribute('href',/collection\/$/);
 await expect(page.locator('.hero-actions').getByRole('link',{name:'For hotel buyers'})).toHaveAttribute('href',/hospitality\/$/);
 await page.locator('.hero-actions').getByRole('link',{name:'For hotel buyers'}).click();
 await expect(page.locator('h1')).toContainText('An upgrade guests use.');
});
test('the initial experience does not require WebGL or eagerly load the 3D bundle',async({page})=>{
 await expect(page.locator('#product-stage')).toHaveAttribute('data-scene','static');
 await expect(page.locator('.hero-fallback')).toBeVisible();
 const loaded=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>r.name).filter(n=>/studio-models/.test(n)));
 expect(loaded).toEqual([]);
 await expect(page.locator('#scene-canvas canvas')).toHaveCount(0);
});
test('finish selection updates the image and accessible selection state',async({page})=>{
 for(const [name,key]of [['Champagne','champagne'],['Pearl','pearl'],['Graphite','graphite']]){
  const button=page.getByRole('button',{name:`${name} finish`,exact:true});await button.click();
  await expect(button).toHaveAttribute('aria-pressed','true');await expect(page.locator('#finish-name')).toHaveText(name);
  await expect(page.locator('.hero-fallback')).toHaveAttribute('src',new RegExp(`dryer-${key}-hero\\.webp$`));
  await expect(page.locator('[data-finish][aria-pressed=true]')).toHaveCount(1);
 }
});
test('optional 3D inspection is keyboard operable and can return to the static image',async({page})=>{
 await page.getByRole('button',{name:'Inspect in 3D'}).click();
 await expect(page.locator('#product-stage')).toHaveAttribute('data-scene',/ready|fallback/,{timeout:30000});
 if(await page.locator('#product-stage').getAttribute('data-scene')==='fallback'){
  await expect(page.locator('.hero-fallback')).toBeVisible();await expect(page.locator('#viewer-status')).toContainText('could not load');return;
 }
 await expect(page.locator('#scene-canvas canvas')).toHaveCount(1);
 const view=page.locator('#scene-canvas');await view.focus();await page.keyboard.press('ArrowRight');await page.keyboard.press('Home');await page.keyboard.press('Escape');
 await expect(page.locator('#product-stage')).toHaveAttribute('data-scene','static');
 await expect(page.getByRole('button',{name:'Inspect in 3D'})).toBeFocused();
});
test('3D enhancement failure preserves the product image and a useful status',async({page})=>{
 await page.route('**/*studio-models*.js',route=>route.abort());
 await page.getByRole('button',{name:'Inspect in 3D'}).click();
 await expect(page.locator('#product-stage')).toHaveAttribute('data-scene','fallback',{timeout:30000});
 await expect(page.locator('.hero-fallback')).toBeVisible();await expect(page.locator('#viewer-status')).toContainText('could not load');
 await expect(page.getByRole('button',{name:'Inspect in 3D'})).toBeEnabled();
});
test('finish controls retain 44 pixel touch targets',async({page})=>{
 for(const control of await page.locator('[data-finish]').all()){const box=await control.boundingBox();expect(box?.width).toBeGreaterThanOrEqual(44);expect(box?.height).toBeGreaterThanOrEqual(44);}
});
test('mobile navigation restores focus and reaches the full collection',async({page,isMobile})=>{
 test.skip(!isMobile,'Mobile-specific navigation');
 const toggle=page.getByRole('button',{name:'Open menu'});await toggle.click();await expect(page.locator('#mobile-menu')).toBeVisible();
 await page.keyboard.press('Escape');await expect(toggle).toBeFocused();await expect(page.locator('#mobile-menu')).toBeHidden();
 await toggle.click();await page.locator('#mobile-menu').getByRole('link',{name:'All products',exact:true}).click();await expect(page.locator('h1')).toContainText('A complete room.');
});
test('homepage artwork loads without horizontal overflow',async({page})=>{
 await page.evaluate(async()=>{for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(i=>i.decode()));});
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 expect(await page.locator('img').evaluateAll(images=>images.filter(i=>(i as HTMLImageElement).naturalWidth===0).map(i=>i.getAttribute('src')))).toEqual([]);
});
test('homepage and optional viewer pass automated WCAG rules',async({page})=>{
 const baseline=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(baseline.violations).toEqual([]);
 await page.getByRole('button',{name:'Inspect in 3D'}).click();await expect(page.locator('#product-stage')).toHaveAttribute('data-scene',/ready|fallback/,{timeout:30000});
 const viewer=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(viewer.violations).toEqual([]);
});
test('the page remains useful with JavaScript disabled',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const page=await context.newPage();await page.goto(baseURL!);
 await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.hero-fallback')).toBeVisible();await expect(page.locator('.category-card')).toHaveCount(3);
 await expect(page.locator('.noscript-note')).toContainText('without JavaScript');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
});
