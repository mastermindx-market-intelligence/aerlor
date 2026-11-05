import {chromium} from '@playwright/test';
import {writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve(import.meta.dirname,'../..'),out=resolve(root,'public/images/studio');mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--enable-unsafe-swiftshader']});
try{const page=await browser.newPage({viewport:{width:1600,height:1600}});await page.goto('http://127.0.0.1:5194/aerlor/design/precision-r4/studio.html');await page.waitForFunction(()=>window.studioReady===true);const list=[];
 for(const family of ['dryer','mirror','curler'])for(const finish of ['graphite','champagne','pearl'])list.push({family,finish,view:'product'});
 list.push({family:'dryer',finish:'pearl',view:'detail'},{family:'mirror',finish:'pearl',view:'detail'},{family:'curler',finish:'pearl',view:'detail'},{family:'dryer',finish:'champagne',view:'hero'},{family:'dryer',finish:'pearl',view:'hero'},{family:'dryer',finish:'graphite',view:'hero'},{family:'dryer',finish:'graphite',view:'detail'},{family:'mirror',finish:'graphite',view:'detail'},{family:'curler',finish:'graphite',view:'detail'},{family:'dryer',finish:'graphite',view:'rear'});
 for(const item of list){const png=resolve(out,`${item.family}-${item.finish}-${item.view}.png`);if(existsSync(png)&&!process.argv.includes('--force'))continue;const data=await page.evaluate(async args=>window.renderProduct(args.family,args.finish,args.view,1600,1600),item);const file=`${item.family}-${item.finish}-${item.view}.png`;writeFileSync(resolve(out,file),Buffer.from(data.split(',')[1],'base64'));console.log(file);}
}finally{await browser.close();}

// Convert approved PNG assets to WebP with scripts/r4/export-web-assets.py after rendering.
