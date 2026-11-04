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
 assert.match(html,/Nothing is sent to AERLOR/);assert.match(html,/not a final specification/);
 assert.ok(!/<form[^>]+action=/i.test(html));assert.match(read('public/robots.txt'),/Disallow: \//);
});
test('all production visuals are local and explicitly conceptual',()=>{
 for(const asset of ['dryer-champagne.svg','dryer-graphite.svg','dryer-pearl.svg','morning-ritual.svg']){
  assert.ok(existsSync(new URL('../public/images/'+asset,import.meta.url)));
  assert.ok(!/https?:\/\//.test(read('public/images/'+asset).replaceAll('http://www.w3.org/2000/svg','')));
 }
 assert.match(read('index.html'),/DESIGN CONCEPT/);
});
test('public client has no tracking, storage or transmission API',()=>{
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
