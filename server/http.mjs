import {createServices} from './services.mjs';
import {HttpError} from './runtime.mjs';
import {ValidationError} from '../shared/domain.mjs';
const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer'};
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
async function rawBody(request,max){
  if(Number(request.headers.get('content-length')||0)>max)throw new HttpError(413,'The request is too large.');
  if(!request.body)return Buffer.alloc(0);
  const reader=request.body.getReader();const parts=[];let size=0;
  try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel();throw new HttpError(413,'The request is too large.');}parts.push(Buffer.from(value));}}finally{reader.releaseLock();}
  return Buffer.concat(parts);
}
function sameOrigin(request,origin){
  if(!origin)throw new HttpError(503,'This service is not configured.');
  if(request.headers.get('origin')!==origin)throw new HttpError(403,'This request must originate from the AERLOR website.','origin_mismatch');
  const site=request.headers.get('sec-fetch-site');if(site&&site!=='same-origin')throw new HttpError(403,'Cross-site requests are not accepted.');
}
export function createHandler(action,dependencies){
  return async function handle(request){
    try{
      const services=createServices(dependencies);const method=request.method;
      const expected=action==='config'||action==='order'?'GET':'POST';
      if(method!==expected){const response=json({error:'Method not allowed.'},405);response.headers.set('Allow',expected);return response;}
      if(action==='config')return json(services.config());
      const ip=String(request.headers.get('x-vercel-forwarded-for')||request.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim().slice(0,80);
      if(action==='order')return json(await services.order(new URL(request.url).searchParams.get('session_id'),ip));
      if(action==='webhook')return json(await services.webhook(await rawBody(request,1000000),request.headers.get('stripe-signature')));
      // Disabled services return a clear, non-success response without collecting the request body.
      if(action==='checkout'&&!services.settings.checkoutEnabled)throw new HttpError(503,'Purchasing is not open for this collection. Use your selection for a project quote.','commerce_unavailable');
      if(action==='inquiry'&&!services.settings.inquiryEnabled)throw new HttpError(503,'Direct submission is not connected. Use the email draft or download your project brief.','inquiry_unavailable');
      sameOrigin(request,services.settings.origin);
      if(!String(request.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))throw new HttpError(415,'Use a JSON request.');
      let data;try{data=JSON.parse((await rawBody(request,24000)).toString('utf8'));}catch(error){if(error instanceof HttpError)throw error;throw new HttpError(400,'The request body is not valid JSON.');}
      if(!data||typeof data!=='object'||Array.isArray(data))throw new HttpError(400,'The request body is not valid JSON.');
      if(action==='checkout')return json(await services.checkout(data,ip));
      if(action==='inquiry')return json(await services.inquiry(data,ip));
      return json({error:'Not found.'},404);
    }catch(error){
      if(error instanceof ValidationError)return json({error:error.message,field:error.field},400);
      if(error instanceof HttpError)return json({error:error.message,code:error.code},error.status);
      console.error('aerlor_api_failure',{name:error?.name||'Error'});
      return json({error:'The request could not be completed. Please retry or contact the team.'},500);
    }
  };
}
