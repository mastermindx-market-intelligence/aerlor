import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from '@playwright/test';

// Read-only verification of an exact public artifact. Never submits an inquiry or payment.
const target=process.env.TEST_URL;
if(!target)throw new Error('Set TEST_URL to the actual deployed website URL.');
const url=new URL(target);
if(!['https:','http:'].includes(url.protocol)||url.username||url.password)throw new Error('TEST_URL must be an HTTP(S) URL without embedded credentials.');
if(url.search||url.hash||!url.pathname.endsWith('/'))throw new Error('TEST_URL must be the deployment base URL ending with /, without query or fragment.');
const expectedCommit=process.env.EXPECTED_COMMIT;
if(!expectedCommit||!/^[a-f0-9]{40}$/.test(expectedCommit))throw new Error('Set EXPECTED_COMMIT to the exact 40-character source commit.');
const output=path.resolve(process.env.VERIFY_OUT_DIR||'test-results/deployment');await mkdir(output,{recursive:true});
const report={url:url.href,expectedCommit,checkedAt:new Date().toISOString(),checks:[]};
let browser;
try{
 let published;
 for(let attempt=1;attempt<=8;attempt++){
  const infoUrl=new URL('build-info.json',url);infoUrl.searchParams.set('verify',`${expectedCommit}-${attempt}`);
  try{const response=await fetch(infoUrl,{signal:AbortSignal.timeout(15000),cache:'no-store'});if(response.ok){const body=await response.json();if(body.commit===expectedCommit){published=body;break;}}}catch(error){if(attempt===8)throw error;}
  if(attempt<8)await new Promise(resolve=>setTimeout(resolve,5000));
 }
 assert.ok(published,'The public build-info.json did not match the exact expected commit.');
 assert.equal(published.base,url.pathname,'Published base path must match deployment path.');
 assert.equal(published.designRevision,'precision-r4');
 const showcase=published.kind==='design-showcase';
 if(process.env.VERIFY_KIND)assert.equal(showcase?'design-showcase':'storefront',process.env.VERIFY_KIND);
 if(!showcase){assert.equal(published.pages,33);assert.equal(published.paperFileId,'01M6JNN71ZN4867VJZ83PPXQZ0');}
 report.kind=showcase?'design-showcase':'storefront';report.build=published;
 browser=await chromium.launch({headless:true,args:['--enable-webgl','--enable-unsafe-swiftshader']});
 for(const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['narrow',320,800]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});
  try{
   const page=await context.newPage();const javascriptErrors=[],sameOriginFailures=[];
   page.on('pageerror',error=>javascriptErrors.push(error.message));
   page.on('response',response=>{if(new URL(response.url()).origin===url.origin&&response.status()>=400)sameOriginFailures.push({url:response.url(),status:response.status()});});
   const response=await page.goto(url.href,{waitUntil:'domcontentloaded',timeout:30000});assert.equal(response?.status(),200);
   await page.locator('h1').waitFor({state:'visible',timeout:15000});
   await page.waitForFunction(()=>Array.from(document.querySelectorAll('link[rel=stylesheet]')).filter(link=>new URL(link.href).origin===location.origin).every(link=>Boolean(link.sheet))&&getComputedStyle(document.body).marginTop==='0px');
   if(!showcase){await page.waitForFunction(()=>document.body.dataset.runtimeReady==='true');assert.equal(await page.locator('#product-stage').getAttribute('data-scene'),'static');if(name==='desktop'){await page.locator('#view-3d').click();await page.waitForFunction(()=>['ready','fallback'].includes(document.querySelector('#product-stage')?.getAttribute('data-scene')),null,{timeout:30000});}}
   await page.evaluate(async()=>{document.querySelectorAll('.will-reveal').forEach(el=>el.classList.add('is-visible'));for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,8000))]);});
   const observation=await page.evaluate(()=>({width:innerWidth,horizontalOverflow:document.documentElement.scrollWidth>innerWidth,mainHeadings:document.querySelectorAll('h1').length,scene:document.querySelector('#product-stage')?.getAttribute('data-scene')??null,brokenImages:[...document.images].filter(image=>!image.complete||image.naturalWidth===0).map(image=>image.getAttribute('src')),forms:document.querySelectorAll('form').length,touchTargets:[...document.querySelectorAll('[data-finish]')].map(el=>({width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}))}));
   assert.equal(observation.mainHeadings,1);assert.equal(observation.horizontalOverflow,false);assert.deepEqual(observation.brokenImages,[]);assert.deepEqual(javascriptErrors,[]);assert.deepEqual(sameOriginFailures,[]);
   if(showcase)assert.equal(observation.forms,0,'The Pages showcase must not collect customer data.');
   else{assert.ok(observation.touchTargets.every(x=>x.width>=44&&x.height>=44));if(name==='desktop')assert.equal(observation.scene,'ready');}
   await page.screenshot({path:path.join(output,`${name}-hero.png`)});report.checks.push({name,status:'passed',...observation,javascriptErrors,sameOriginFailures});
  }finally{await context.close();}
 }
 if(!showcase){
  const response=await fetch(new URL('/api/config',url),{signal:AbortSignal.timeout(15000)});assert.equal(response.status,200);assert.match(response.headers.get('cache-control')??'',/no-store/);const config=await response.json();
  assert.equal(typeof config.checkoutEnabled,'boolean');assert.equal(typeof config.inquiryEnabled,'boolean');assert.ok(!JSON.stringify(config).includes('STRIPE_SECRET_KEY'));assert.ok(!JSON.stringify(config).includes('UPSTASH'));
  report.services={configStatus:response.status,checkoutEnabled:config.checkoutEnabled,directInquiryEnabled:config.inquiryEnabled,contactConfigured:typeof config.contactEmail==='string'&&config.contactEmail.includes('@'),mode:config.mode};
  const wrongMethod=await fetch(new URL('/api/checkout',url),{signal:AbortSignal.timeout(15000)});assert.equal(wrongMethod.status,405);
  const paths=['collection/','products/hairdryer-premium/','products/makeup-mirror-premium/','products/curler-lite/','hospitality/wholesale/','pricing/','contact/','cart/','checkout/'];
  for(const pathname of paths){const page=await fetch(new URL(pathname,url),{signal:AbortSignal.timeout(15000)});assert.equal(page.status,200,pathname);assert.match(await page.text(),/<h1[\s>]/);}
  report.routesChecked=paths.length;
  const docs=['aerlor-hospitality-collection.pdf','aerlor-hotel-upgrade-guide.pdf','aerlor-procurement-guide.pdf','aerlor-pilot-toolkit.pdf','hairdryer-lite-specification-brief.pdf','hairdryer-premium-specification-brief.pdf','makeup-mirror-lite-specification-brief.pdf','makeup-mirror-premium-specification-brief.pdf','curler-lite-specification-brief.pdf','curler-premium-specification-brief.pdf'];
  for(const name of docs){const pdf=await fetch(new URL('documents/'+name,url),{signal:AbortSignal.timeout(15000)});assert.equal(pdf.status,200,name);assert.match(pdf.headers.get('content-type')??'',/application\/pdf/);assert.equal(Buffer.from(await pdf.arrayBuffer()).subarray(0,5).toString(),'%PDF-');}
  report.documentsChecked=docs.length;
 }
 const missing=await fetch(new URL(`__aerlor_missing_${expectedCommit.slice(0,12)}__`,url),{signal:AbortSignal.timeout(15000)});assert.equal(missing.status,404);assert.ok((await missing.text()).includes(`href="${url.pathname}"`));report.custom404={status:404,returnPath:url.pathname};report.status='passed';
}catch(error){report.status='failed';report.error=error instanceof Error?error.message:String(error);process.exitCode=1;}
finally{if(browser)await browser.close();await writeFile(path.join(output,'receipt.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));}
