import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
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
