import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';

test.beforeEach(async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.goto('./');});

test('essential content is real HTML with a single main heading',async({page})=>{
 await expect(page).toHaveTitle('AERLOR — The art of a better stay');
 await expect(page.locator('h1')).toHaveCount(1);
 await expect(page.locator('h1')).toContainText('better stay.');
 await expect(page.locator('#collection h3')).toHaveCount(2);
 await expect(page.locator('.collection-disclosure')).toContainText('certifications');
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content','noindex,nofollow');
});
test('finish choices update accessible selection and original fallback',async({page})=>{
 for(const [name,file] of [['Graphite','graphite'],['Pearl','pearl'],['Champagne','champagne']]){
  await page.getByRole('button',{name:`${name} finish`,exact:true}).click();
  await expect(page.getByRole('button',{name:`${name} finish`,exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('#finish-name')).toHaveText(name);
  await expect(page.locator('.hero-fallback')).toHaveAttribute('src',new RegExp(`dryer-${file}\\.svg$`));
 }
 await expect(page.locator('[data-finish][aria-pressed="true"]')).toHaveCount(1);
});
test('PRO and LITE have working detail dialogs and close returns focus',async({page})=>{
 for(const product of ['PRO','LITE']){
  const button=page.getByRole('button',{name:`Explore AERLOR ${product}`,exact:true});
  await button.click();
  await expect(page.locator('#product-dialog')).toBeVisible();
  await expect(page.locator('#product-dialog-title')).toContainText(product);
  await expect(page.locator('#detail-specs')).toContainText('In development');
  await page.keyboard.press('Escape');
  await expect(page.locator('#product-dialog')).not.toBeVisible();
  await expect(button).toBeFocused();
 }
});
test('product interest carries into the private pilot planner',async({page})=>{
 await page.getByRole('button',{name:'Explore AERLOR LITE',exact:true}).click();
 await page.getByRole('button',{name:'Include in my pilot brief'}).click();
 await expect(page.locator('#product-dialog')).not.toBeVisible();
 await expect(page.locator('#inquiry-dialog')).toBeVisible();
 await expect(page.getByRole('radio',{name:'LITE',exact:true})).toBeChecked();
 await expect(page.locator('.preview-notice')).toContainText('Nothing is sent');
});
test('required fields do not create a false success',async({page})=>{
 await page.getByRole('button',{name:'Plan a pilot for your property'}).click();
 await page.getByRole('button',{name:'Create my pilot brief'}).click();
 await expect(page.locator('#inquiry-form input:invalid')).toHaveCount(4);
 await expect(page.locator('#form-status')).toBeEmpty();
});
test('planner downloads an honest brief without transmitting personal data',async({page})=>{
 const sent:string[]=[];page.on('request',r=>{if(r.method()==='POST')sent.push(r.url());});
 await page.getByRole('button',{name:'Plan a pilot for your property'}).click();
 await page.getByLabel('Your name',{exact:true}).fill('Alex Test');
 await page.getByLabel('Work email',{exact:true}).fill('alex@example.com');
 await page.getByLabel('Hotel or group',{exact:true}).fill('Example Hotel');
 await page.getByLabel('Country',{exact:true}).fill('Canada');
 await page.getByLabel('Approximate room count').selectOption('50–149');
 await page.getByLabel('What matters most?').fill('Handling and guest experience.');
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'Create my pilot brief'}).click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('AERLOR-property-pilot-brief.txt');
 const file=await download.path();expect(file).toBeTruthy();
 const text=await readFile(file!,'utf8');
 expect(text).toContain('Example Hotel');expect(text).toContain('not been submitted to AERLOR');
 expect(sent).toEqual([]);
 await expect(page.locator('#form-status')).toContainText('Nothing was sent');
 expect(await page.evaluate(()=>localStorage.length+sessionStorage.length)).toBe(0);
});
test('FAQ and privacy disclosure are keyboard operable',async({page})=>{
 const question=page.locator('summary').first();await question.focus();await page.keyboard.press('Enter');
 await expect(page.locator('details').first()).toHaveAttribute('open','');
 await page.getByRole('button',{name:'Privacy & preview notice'}).click();
 await expect(page.locator('#privacy-dialog')).toBeVisible();
 await expect(page.locator('#privacy-dialog')).toContainText('No certification');
 await page.keyboard.press('Escape');await expect(page.locator('#privacy-dialog')).not.toBeVisible();
});
test('mobile navigation opens, navigates and closes',async({page,isMobile})=>{
 test.skip(!isMobile,'Mobile-specific interaction');
 const button=page.getByRole('button',{name:'Open menu'});await button.click();
 await expect(page.locator('#mobile-menu')).toBeVisible();
 await page.locator('#mobile-menu').getByRole('link',{name:'The collection'}).click();
 await expect(page.locator('#mobile-menu')).not.toBeVisible();
 await expect(button).toHaveAttribute('aria-expanded','false');
});
test('has no horizontal overflow and all local imagery resolves',async({page})=>{
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 const broken=await page.locator('img').evaluateAll(images=>images.filter(i=>i instanceof HTMLImageElement&&i.complete&&i.naturalWidth===0).map(i=>(i as HTMLImageElement).src));
 expect(broken).toEqual([]);
});
test('baseline and inquiry dialog pass WCAG A/AA automated checks',async({page})=>{
 await page.evaluate(()=>document.querySelectorAll('.will-reveal').forEach(e=>e.classList.add('is-visible')));
 const baseline=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(baseline.violations).toEqual([]);
 await page.getByRole('button',{name:'Plan a pilot for your property'}).click();
 const form=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
 expect(form.violations).toEqual([]);
});
test('reduced-motion preference suppresses ambient-motion control',async({page})=>{
 await expect(page.locator('#motion-toggle')).toBeHidden();
 expect(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
});
test('static fallback remains usable without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
 const page=await context.newPage();await page.goto(baseURL!);
 await expect(page.locator('h1')).toBeVisible();await expect(page.locator('.hero-fallback')).toBeVisible();
 await expect(page.locator('.noscript-note')).toContainText('without JavaScript');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await context.close();
});
