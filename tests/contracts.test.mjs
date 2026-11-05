import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {buildPilotBrief} from '../src/pilot.ts';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
test('brief is a local draft, never a false submission receipt',()=>{
 const brief=buildPilotBrief({name:'Alex',email:'alex@example.com',property:'Example Hotel',country:'Canada',rooms:'50-149',interest:'PRO',message:'Trial'});
 assert.match(brief,/Example Hotel/);assert.match(brief,/not been submitted to AERLOR/);assert.match(brief,/not an order/);
});
test('brief bounds and sanitizes user input',()=>{
 const brief=buildPilotBrief({name:'A'.repeat(500),message:'Hello\u0000world'});
 assert.ok(!brief.includes('A'.repeat(101)));assert.ok(!brief.includes('\u0000'));assert.match(brief,/Helloworld/);
});
test('preview is not indexed, has no false trademark registration or live form',()=>{
 const html=read('index.html');
 assert.match(html,/noindex,nofollow/);assert.ok(!html.includes('®'));
 assert.match(html,/Collection in development/);assert.match(html,/design studies/);
 assert.ok(!/<form[^>]+action=/i.test(html));assert.match(read('public/robots.txt'),/Disallow: \//);
});
test('all production visuals are local and explicitly conceptual',()=>{
 for(const asset of ['dryer-champagne.svg','dryer-graphite.svg','dryer-pearl.svg','morning-ritual.svg']){
  assert.ok(existsSync(new URL('../public/images/'+asset,import.meta.url)));
  assert.ok(!/https?:\/\//.test(read('public/images/'+asset).replaceAll('http://www.w3.org/2000/svg','')));
 }
 assert.match(read('index.html'),/design study/);
 for(const family of ['dryer','mirror','curler'])for(const finish of ['graphite','champagne','pearl'])assert.ok(existsSync(new URL('../public/images/studio/'+family+'-'+finish+'-product.webp',import.meta.url)));
});
test('optional product viewer has no tracking, storage or transmission API',()=>{
 const source=read('src/main.ts');
 assert.ok(!/\b(fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage)\b/.test(source));
 assert.ok(!source.includes('innerHTML'));
});
test('the website uses the actual native Paper token export',()=>{
 const variables=css=>Object.fromEntries([...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]));
 assert.deepEqual(variables(read('src/paper-tokens.css')),variables(read('design/paper/native/tokens.css')));
 assert.match(read('src/style.css'),/paper-tokens\.css/);
});
test('native design references are complete and do not expose local machine paths',()=>{
 const manifest=JSON.parse(read('design/paper/native/manifest.json'));
 assert.equal(manifest.artboardCount,15);assert.equal(Object.keys(manifest.pages).length,3);
 for(const board of Object.values(manifest.boards)){
  assert.ok(board.id);assert.ok(existsSync(new URL('../design/paper/native/'+board.screenshot,import.meta.url)));
  const jsx=read('design/paper/native/'+board.jsx);
  assert.ok(jsx.includes('export default function'));assert.ok(!/\/Users\/|paper-asset:\/\//.test(jsx));
 }
});
test('deployment verification rejects ambiguous or credential-bearing targets before network work',()=>{
 const cases=[
  {TEST_URL:'',EXPECTED_COMMIT:'a'.repeat(40),message:/Set TEST_URL/},
  {TEST_URL:'https://user:password@example.com/aerlor/',EXPECTED_COMMIT:'a'.repeat(40),message:/without embedded credentials/},
  {TEST_URL:'https://example.com/aerlor/?preview=1',EXPECTED_COMMIT:'a'.repeat(40),message:/without query or fragment/},
  {TEST_URL:'https://example.com/aerlor/',EXPECTED_COMMIT:'main',message:/exact 40-character source commit/}
 ];
 for(const {message,...env} of cases){
  const result=spawnSync(process.execPath,['scripts/verify-deployment.mjs'],{
   cwd:fileURLToPath(new URL('../',import.meta.url)),env:{...process.env,...env},encoding:'utf8',timeout:10000
  });
  assert.equal(result.status,1);assert.match(result.stderr,message);
 }
});

test('R8 storefront has original and business solutions routes, six product pages and actual PDF assets',()=>{
 const manifest=JSON.parse(read('storefront-pages.json'));assert.equal(manifest.pages.length,42);
 for(const route of ['solutions/','solutions/salons/','solutions/spas/','solutions/fitness/','solutions/residences/','solutions/travel/','solutions/academies/','solutions/studios/','solutions/brief/'])assert.ok(manifest.pages.includes(route+'index.html'),route);
 for(const page of manifest.pages)assert.ok(existsSync(new URL('../'+page,import.meta.url)),page);
 const catalog=JSON.parse(read('src/catalog.json'));assert.equal(catalog.products.length,6);
 const documents=JSON.parse(read('marketing/document-manifest.json'));assert.equal(documents.documents.length,10);
 assert.equal(documents.documents.reduce((sum,doc)=>sum+doc.pages,0),36);
 for(const doc of documents.documents)assert.equal(readFileSync(new URL('../public/documents/'+doc.file,import.meta.url)).subarray(0,5).toString(),'%PDF-');
});
test('GitHub Pages deploys only a non-transactional design showcase',()=>{
 const workflow=read('.github/workflows/site.yml');assert.match(workflow,/path: showcase-dist/);assert.ok(!workflow.includes('path: dist'));assert.match(workflow,/npm run test:server/);
 const source=read('scripts/build-design-showcase.mjs');assert.ok(!source.includes('<form'));assert.ok(!source.includes('data-add'));assert.match(source,/design-showcase/);
});
test('client storage and checkout remain separate from personal data and provider secrets',()=>{
 const source=read('src/storefront.ts');assert.match(source,/JSON.stringify\(\{version:CART_VERSION,items\}\)/);
 for(const key of ['STRIPE_SECRET_KEY','RESEND_API_KEY','UPSTASH_REDIS_REST_TOKEN','TURNSTILE_SECRET_KEY'])assert.ok(!source.includes(key));
 assert.match(read('server/services.mjs'),/price_mismatch/);assert.match(read('server/services.mjs'),/reconciliation_required/);
});

test('the precision theme uses its actual native Paper token export',()=>{
 const vars=css=>Object.fromEntries([...css.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]));
 assert.deepEqual(vars(read('src/precision-tokens.css')),vars(read('design/precision-r4/tokens.css')));
 assert.match(read('src/style.css'),/precision-tokens\.css/);assert.match(read('index.html'),/premium-tech-r5/);
 assert.ok(!read('index.html').includes('Cormorant'));assert.ok(!/<h[12][^>]*>[^<]*<em>/.test(read('index.html')));
});

test('R4 native Paper handoff is complete, editable and public-safe',()=>{
 const m=JSON.parse(read('design/precision-r4/native-manifest.json'));
 assert.equal(m.pageId,'p-4-0');assert.equal(m.artboardCount,9);assert.equal(m.tokenCount,25);assert.equal(m.verification.artboardCount,9);
 for(const board of Object.values(m.boards)){
  assert.ok(existsSync(new URL('../design/precision-r4/'+board.screenshot,import.meta.url)));
  const jsx=read('design/precision-r4/'+board.jsx);assert.match(jsx,/export default function/);assert.ok(!jsx.includes('/Users/'));assert.ok(!jsx.includes('paper-asset://'));
 }
});


test('R5 native design and image provenance are recoverable without private machine paths',()=>{
 const m=JSON.parse(read('design/precision-r5/native-manifest.json'));assert.equal(m.pageId,'p-6-0');assert.equal(m.artboardCount,5);assert.equal(m.nodeCount,530);
 for(const board of Object.values(m.boards)){assert.ok(existsSync(new URL('../design/precision-r5/'+board.screenshot,import.meta.url)));const jsx=read('design/precision-r5/'+board.jsx);assert.match(jsx,/export default function/);assert.ok(!jsx.includes('/Users/'));assert.ok(!jsx.includes('paper-asset://'));}
 assert.match(read('design/precision-r5/README.md'),/4d80d3d781a9e992c7922e3f66c38adc18fa486b/);assert.match(read('products/hairdryer-premium/index.html'),/not production CAD/);
});
