import {test,expect, type Page} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {readFile} from 'node:fs/promises';
import catalog from '../src/catalog.json' with {type:'json'};
import pagesManifest from '../storefront-pages.json' with {type:'json'};
const config={checkoutEnabled:false,inquiryEnabled:false,mode:'development',contactEmail:'contact@example.com',turnstileSiteKey:null,prices:[]};
const navigate=async(page:Page,path:string)=>{
 await page.goto('./'+path,{waitUntil:'domcontentloaded'});
 await expect(page.locator('body')).toHaveAttribute('data-runtime-ready','true');
 // A cached module can finish before WebKit applies the route's render-blocking CSS.
 // Assert the real presentation boundary before taking geometry measurements.
 await page.waitForFunction(()=>Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]')).filter(link=>new URL(link.href).origin===location.origin).every(link=>Boolean(link.sheet))&&getComputedStyle(document.body).marginTop==='0px');
 await page.evaluate(async()=>{await document.fonts.ready;await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));});
};
async function fillProject(page:Page){
 await page.getByLabel('Your name',{exact:true}).fill('Alex Morgan');await page.getByLabel('Work email',{exact:true}).fill('alex@example.com');await page.getByLabel('Hotel, group or studio',{exact:true}).fill('Example Hotel');await page.getByLabel('Country',{exact:true}).selectOption('CA');await page.getByLabel('Number of rooms',{exact:true}).fill('120');await page.getByLabel('Your role',{exact:true}).selectOption('Procurement');await page.getByLabel('Project timing',{exact:true}).selectOption('Exploring options');await page.getByLabel('Hairdryers',{exact:true}).check();await page.locator('[name=message]').fill('A coordinated guestroom pilot.');await page.locator('[name=consent]').check();
}
test.beforeEach(async({page})=>{await page.emulateMedia({reducedMotion:'reduce'});await page.route('**/api/config',route=>route.fulfill({json:config}));});

test('all 33 routes have real content, correct titles and no runtime errors',async({page})=>{
 test.setTimeout(180000);const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
 for(const file of pagesManifest.pages){const path=file==='index.html'?'':file.replace(/index\.html$/,'');await navigate(page,path);await expect(page.locator('h1')).toHaveCount(1);await expect(page.locator('main')).toBeVisible();await expect(page.locator('h1')).not.toBeEmpty();await expect(page).toHaveTitle(/AERLOR/);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);}
 expect(errors).toEqual([]);
});
test('collection filters combine product family and Lite/Premium without stale counts',async({page})=>{
 await navigate(page,'collection/');await expect(page.locator('[data-catalog-card]:visible')).toHaveCount(6);
 await page.getByRole('button',{name:'Mirrors',exact:true}).click();await expect(page.locator('[data-catalog-card]:visible')).toHaveCount(2);await page.locator('#tier-filter').selectOption('Premium');await expect(page.locator('[data-catalog-card]:visible')).toHaveCount(1);await expect(page.locator('#filter-count')).toHaveText('1 collection concept');await expect(page.locator('[data-catalog-card]:visible h3')).toContainText('Makeup Mirror Premium');
 await page.getByRole('button',{name:'All products',exact:true}).click();await expect(page.locator('[data-catalog-card]:visible')).toHaveCount(3);
});
test('every product has a status-labelled specification, PDF and correct purchase boundary',async({page})=>{
 test.setTimeout(90000);for(const p of catalog.products){await navigate(page,'products/'+p.slug+'/');await expect(page.locator('h1')).toContainText(p.tier);await expect(page.locator('#specifications tbody tr')).toHaveCount(8);await expect(page.locator('#specifications')).toContainText('unverified');await expect(page.locator('[data-add]').first()).toHaveText(/Add to your project/);await expect(page.locator('.product-utility a[download]')).toHaveAttribute('href',new RegExp(p.document.replaceAll('.','\\.')));}
});
test('a selected finish and quantity persist across pages as product data only',async({page})=>{
 await navigate(page,'products/makeup-mirror-premium/');await page.locator('[data-product-finish]').selectOption('Graphite');await expect(page.locator('[data-gallery-image]')).toHaveAttribute('src',/mirror-graphite-product\.webp$/);await page.locator('[data-product-quantity]').fill('3');await page.locator('[data-add]').first().click();await expect(page.locator('#cart-notice')).toContainText('added');await navigate(page,'cart/');await expect(page.locator('.cart-line')).toHaveCount(1);await expect(page.locator('.cart-line')).toContainText('Graphite');await expect(page.locator('#cart-units')).toHaveText('3');await expect(page.locator('#cart-subtotal')).toHaveText('Price on request');
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('aerlor-project-v1')||'null'));expect(stored).toEqual({version:1,items:[{id:'mirror-premium',finish:'Graphite',quantity:3}]});
 await page.getByRole('spinbutton',{name:'Makeup Mirror Premium Graphite quantity'}).fill('5');await page.getByRole('spinbutton',{name:'Makeup Mirror Premium Graphite quantity'}).blur();await expect(page.locator('#cart-units')).toHaveText('5');await page.getByRole('button',{name:'Remove Makeup Mirror Premium Graphite'}).click();await expect(page.locator('#cart-empty')).toBeVisible();
});
test('room bundle adds one item from each family and can be cleared',async({page})=>{
 await navigate(page,'products/hairdryer-lite/');await page.locator('[data-bundle=Lite]').click();await navigate(page,'cart/');await expect(page.locator('.cart-line')).toHaveCount(3);await expect(page.locator('#cart-units')).toHaveText('3');await page.locator('#clear-cart').click();await expect(page.locator('#cart-empty')).toBeVisible();
});
test('malformed stored selection is discarded and no script is executed',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('aerlor-project-v1',JSON.stringify({version:1,items:[{id:'<img src=x onerror=alert(1)>',finish:'Pearl',quantity:1}]}));});await navigate(page,'cart/');await expect(page.locator('#cart-empty')).toBeVisible();await expect(page.locator('.cart-line')).toHaveCount(0);
});
test('project form validates, prepares a real email draft and never falsely reports delivery',async({page})=>{
 const posts:string[]=[];page.on('request',req=>{if(req.method()==='POST')posts.push(req.url());});await navigate(page,'hospitality/wholesale/');await page.locator('[data-project-submit]').click();await expect(page.locator('#project-error')).toContainText('name');await expect(page.locator('[name=name]')).toBeFocused();await fillProject(page);await page.locator('[data-project-submit]').click();await expect(page.locator('#project-status')).toContainText('Nothing has been sent');await expect(page.locator('#project-delivery')).toBeVisible();const href=await page.locator('#email-project').getAttribute('href');expect(href).toMatch(/^mailto:contact@example\.com\?/);expect(decodeURIComponent(href!)).toContain('Example Hotel');expect(posts).toEqual([]);expect(await page.evaluate(()=>localStorage.getItem('aerlor-project-v1'))).toBeNull();
});
test('project brief download preserves the whole request without persisting personal details',async({page})=>{
 await navigate(page,'contact/');await fillProject(page);const downloadPromise=page.waitForEvent('download');await page.locator('[data-save-brief]').click();const download=await downloadPromise;const text=await readFile((await download.path())!,'utf8');expect(text).toContain('Example Hotel');expect(text).toContain('Preparing this brief does not send it');expect(text).toContain('Not an order');await expect(page.locator('#project-status')).toContainText('Nothing was sent');expect(await page.evaluate(()=>Object.values(localStorage).join(' '))).not.toContain('alex@example.com');
});
test('unconnected backend leaves checkout disabled and never initiates a payment request',async({page})=>{
 const posts:string[]=[];page.on('request',req=>{if(req.method()==='POST')posts.push(req.url());});await navigate(page,'products/hairdryer-lite/');await page.locator('[data-add]').first().click();await navigate(page,'checkout/');await expect(page.locator('#checkout-readiness')).toContainText('Purchasing is not open');await page.locator('#checkout-consent').check();await expect(page.locator('#checkout-button')).toBeDisabled();expect(posts).toEqual([]);
});
test('provider-eligible checkout uses verified redirect and never collects card details locally',async({page})=>{
 await page.unroute('**/api/config');await page.route('**/api/config',route=>route.fulfill({json:{...config,mode:'test',checkoutEnabled:true,turnstileSiteKey:'test_site_key_12345',prices:[{id:'dryer-lite',finish:'Pearl',unitAmount:9900,currency:'USD',maxQuantity:100}]}}));
 await page.route('https://challenges.cloudflare.com/turnstile/**',route=>route.fulfill({contentType:'application/javascript',body:"window.turnstile={render:function(t,o){setTimeout(function(){o.callback('checkout-test-token')},10);return 'widget';},reset:function(){},remove:function(){}};"}));
 let payload:unknown;await page.route('**/api/checkout',async route=>{payload=route.request().postDataJSON();await route.fulfill({json:{url:'https://checkout.stripe.com/c/pay/cs_test_browserfixture12345',reference:'test'}});});await page.route('https://checkout.stripe.com/**',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html><title>Provider test fixture</title><body>Hosted payment boundary</body></html>'}));
 await navigate(page,'products/hairdryer-lite/');await page.locator('[data-add]').first().click();await navigate(page,'checkout/');await page.locator('#checkout-consent').check();await expect(page.locator('#checkout-button')).toBeEnabled();await expect(page.locator('input[name=card_number]')).toHaveCount(0);await page.locator('#checkout-button').click();await expect(page).toHaveURL(/^https:\/\/checkout\.stripe\.com\//);expect(payload).toMatchObject({items:[{id:'dryer-lite',finish:'Pearl',quantity:1}],consent:true,verificationToken:'checkout-test-token'});expect(JSON.stringify(payload)).not.toContain('unitAmount');
});
test('returning to order page without a valid provider reference never claims payment',async({page})=>{
 await navigate(page,'order/?success=1');await expect(page.locator('#order-result')).toContainText('no valid checkout reference');await navigate(page,'order/?cancelled=1');await expect(page.locator('#order-result')).toContainText('cancelled');
});
test('investment calculator uses honest input math and rejects zero occupancy',async({page})=>{
 await navigate(page,'pricing/');await expect(page.locator('[data-investment-total]')).toHaveText('$9,900');await page.locator('[name=rooms]').fill('200');await expect(page.locator('[data-investment-total]')).toHaveText('$19,800');await expect(page.locator('[data-investment-night]')).toContainText('$0.12');await page.locator('[name=occupancy]').fill('0');await expect(page.locator('#investment-error')).toContainText('occupancy');
});
test('resource PDFs are real files and embedded viewers offer accessible alternatives',async({page,request,baseURL})=>{
 test.setTimeout(90000);for(const doc of pagesManifest.documents){const response=await request.get(new URL('documents/'+doc.file,baseURL).href);expect(response.status()).toBe(200);expect(response.headers()['content-type']).toContain('application/pdf');expect((await response.body()).subarray(0,5).toString()).toBe('%PDF-');}
 for(const p of catalog.products){const response=await request.get(new URL('documents/'+p.document,baseURL).href);expect(response.status()).toBe(200);expect((await response.body()).subarray(0,5).toString()).toBe('%PDF-');}
 await navigate(page,'resources/hotel-upgrade-guide/');await expect(page.locator('iframe')).toHaveAttribute('title',/PDF preview/);await expect(page.getByRole('link',{name:'Download the PDF'})).toHaveAttribute('download','');
});
test('primary marketing and transactional pages pass automated WCAG checks',async({page})=>{
 test.setTimeout(180000);for(const route of ['collection/','products/makeup-mirror-premium/','hospitality/','hospitality/wholesale/','pricing/','cart/','checkout/','contact/']){await navigate(page,route);const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),route).toEqual([]);}
});
test('all inner pages reflow at 320 pixels without horizontal scrolling',async({page})=>{
 test.setTimeout(180000);await page.setViewportSize({width:320,height:800});for(const file of pagesManifest.pages.filter(file=>file!=='index.html')){await navigate(page,file.replace(/index\.html$/,''));expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),file).toBe(true);}
});
test('hotel anecdotes are attributed and do not masquerade as AERLOR customer outcomes',async({page})=>{
 await navigate(page,'journal/the-getting-ready-gap/');await expect(page.locator('.source-notes article')).toHaveCount(6);await expect(page.locator('.editorial-article')).toContainText('not AERLOR customers or partners');await expect(page.locator('.evidence-caption')).toContainText('not AERLOR reviews');
});

test('fallback typography stays usable when external fonts are blocked',async({page})=>{
 test.setTimeout(90000);await page.route('https://fonts.googleapis.com/**',route=>route.abort());await page.route('https://fonts.gstatic.com/**',route=>route.abort());
 for(const path of ['hospitality/groups/','products/makeup-mirror-premium/','hospitality/wholesale/','pricing/']){await navigate(page,path);await expect(page.locator('h1')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),path).toBe(true);}
});
