import {defineConfig} from 'vite';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const base=process.env.BASE_PATH||'/aerlor/';
if(!/^\/[a-zA-Z0-9/_-]*$/.test(base)||!base.endsWith('/'))throw new Error('BASE_PATH must be a slash-delimited pathname.');
const manifest=JSON.parse(readFileSync(new URL('./storefront-pages.json',import.meta.url),'utf8'));
const input=Object.fromEntries(manifest.pages.map(path=>[path.replace(/\/index\.html$/,'').replaceAll('/','-').replace('.html',''),resolve(import.meta.dirname,path)]));
function commit(){const supplied=process.env.VERCEL_GIT_COMMIT_SHA||process.env.GITHUB_SHA;if(supplied&&/^[a-f0-9]{40}$/.test(supplied))return supplied;try{return execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();}catch{return null;}}
export default defineConfig({
 base,
 plugins:[{name:'aerlor-static-release',async closeBundle(){
  const path='dist/404.html';const source=await readFile(path,'utf8');await writeFile(path,source.replace('href="/aerlor/"',`href="${base}"`));
  await writeFile('dist/build-info.json',JSON.stringify({commit:commit(),base,designRevision:'precision-r4',paperPageId:'p-4-0',paperFileId:'01M6JNN71ZN4867VJZ83PPXQZ0',pages:manifest.pages.length,commerceMode:'server-gated'},null,2)+'\n');
 }}],
 build:{target:'es2022',sourcemap:false,rollupOptions:{input}},
 server:{port:5194,strictPort:true},preview:{port:4194,strictPort:true}
});
