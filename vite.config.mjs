import {defineConfig} from 'vite';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
const base=process.env.BASE_PATH||'/aerlor/';
if(!/^\/[a-zA-Z0-9/_-]*$/.test(base)||!base.endsWith('/'))throw new Error('BASE_PATH must be a slash-delimited pathname.');
function commit(){
 const supplied=process.env.VERCEL_GIT_COMMIT_SHA||process.env.GITHUB_SHA;
 if(supplied&&/^[a-f0-9]{40}$/.test(supplied))return supplied;
 try{return execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();}catch{return null;}
}
export default defineConfig({
 base,
 plugins:[{name:'aerlor-static-release',async closeBundle(){
  const path='dist/404.html';const source=await readFile(path,'utf8');
  await writeFile(path,source.replace('href="/aerlor/"',`href="${base}"`));
  await writeFile('dist/build-info.json',JSON.stringify({commit:commit(),base,designRevision:'native-paper-r2',paperFileId:'01M6JNN71ZN4867VJZ83PPXQZ0'},null,2)+'\n');
 }}],
 build:{target:'es2022',sourcemap:false},
 server:{port:5187,strictPort:true},preview:{port:4187,strictPort:true}
});
