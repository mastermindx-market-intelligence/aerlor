import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
mkdirSync('design/previews',{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--enable-unsafe-swiftshader']});
const results=[];
for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844],['narrow',320,780]]){
 const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4187/aerlor/',{waitUntil:'networkidle'});
 await page.evaluate(()=>document.fonts.ready);
 await page.waitForTimeout(1400);
 await page.screenshot({path:`design/previews/${label}-hero.png`});
 await page.screenshot({path:`design/previews/${label}-full.png`,fullPage:true});
 results.push({label,width,scene:await page.locator('#product-stage').getAttribute('data-scene'),horizontalOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors});
 await page.close();
}
writeFileSync('design/previews/browser-observation.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
await browser.close();
