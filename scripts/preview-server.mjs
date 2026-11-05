import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {Readable} from 'node:stream';
import {createHandler} from '../server/http.mjs';
const root=resolve(import.meta.dirname,'../dist');
const port=Number(process.env.PORT||4194);const base=process.env.BASE_PATH||'/aerlor/';
const api=Object.fromEntries(['config','checkout','inquiry','order','webhook'].map(name=>['/api/'+name,createHandler(name)]));
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.pdf':'application/pdf','.txt':'text/plain; charset=utf-8'};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,`http://127.0.0.1:${port}`);
  if(api[url.pathname]){
   const request=new Request(url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Readable.toWeb(req),duplex:'half'});
   const response=await api[url.pathname](request);res.writeHead(response.status,Object.fromEntries(response.headers.entries()));res.end(Buffer.from(await response.arrayBuffer()));return;
  }
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end('Method not allowed');return;}
  if(url.pathname===base.slice(0,-1)&&base!=='/'){res.writeHead(308,{Location:base});res.end();return;}
  if(!url.pathname.startsWith(base)){res.writeHead(404);res.end('Not found');return;}
  const relative=decodeURIComponent(url.pathname.slice(base.length));let file=resolve(root,relative||'index.html');
  if(file!==root&&!file.startsWith(root+sep)){res.writeHead(404);res.end('Not found');return;}
  let status=200;
  try{const info=await stat(file);if(info.isDirectory()){if(!url.pathname.endsWith('/')){res.writeHead(308,{Location:url.pathname+'/'+url.search});res.end();return;}file=resolve(file,'index.html');}await stat(file);}catch{file=resolve(root,'404.html');status=404;}
  const data=await readFile(file);res.writeHead(status,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(500,{'Content-Type':'text/plain'});res.end('Preview request failed');}
});
server.listen(port,'127.0.0.1',()=>console.log(`AERLOR preview: http://127.0.0.1:${port}${base}`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(()=>process.exit(0)));
