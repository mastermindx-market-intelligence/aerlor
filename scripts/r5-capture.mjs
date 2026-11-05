import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
const out=resolve(import.meta.dirname,'../design/previews/r5');mkdirSync(out,{recursive:true});
const base=process.env.CAPTURE_URL||'http://127.0.0.1:4194/aerlor/';
const browser=await chromium.launch({headless:true});const results=[];
try{for(const [name,path,width,height]of [['home-desktop','',1440,1000],['home-mobile','',390,844],['home-narrow','',320,800],['product-desktop','products/hairdryer-premium/',1440,1000],['product-mobile','products/hairdryer-premium/',390,844],['hotels-desktop','hospitality/',1440,1000],['hotels-mobile','hospitality/',390,844],['project-desktop','hospitality/wholesale/',1440,1000],['collection-desktop','collection/',1440,1000]]){
 const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto(new URL(path,base).href,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>getComputedStyle(document.body).marginTop==='0px');
 await page.evaluate(async()=>{await document.fonts.ready;for(const im of document.images)im.loading='eager';await Promise.all([...document.images].map(im=>im.decode().catch(()=>{})));});
 await page.screenshot({path:resolve(out,name+'.png')});await page.screenshot({path:resolve(out,name+'-full.png'),fullPage:true});
 results.push({name,path,status:response?.status(),...await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,heading:document.querySelector('h1')?.textContent,fonts:getComputedStyle(document.querySelector('h1')).fontFamily,brokenImages:[...document.images].filter(im=>!im.naturalWidth).map(im=>im.getAttribute('src'))})),errors});await context.close();
}}finally{await browser.close();}
writeFileSync(resolve(out,'browser-review.json'),JSON.stringify({checkedAt:new Date().toISOString(),base,results},null,2)+'\n');console.log(JSON.stringify(results,null,2));
