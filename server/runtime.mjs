import {readFileSync} from 'node:fs';
import {createHash,createHmac,timingSafeEqual} from 'node:crypto';
import {validEmail,ValidationError} from '../shared/domain.mjs';
export const catalog=JSON.parse(readFileSync(new URL('../src/catalog.json',import.meta.url),'utf8'));
export const STRIPE_VERSION='2026-10-28.endive';
export class HttpError extends Error {constructor(status,message,code='request_failed'){super(message);this.status=status;this.code=code;}}
export const sha=value=>createHash('sha256').update(typeof value==='string'?value:JSON.stringify(value)).digest('hex');
export const requestId=value=>{if(typeof value!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))throw new ValidationError('Refresh the form and try again.','requestId');return value.toLowerCase();};
const parse=(value,fallback)=>{try{return JSON.parse(value);}catch{return fallback;}};
const validOrigin=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&u.pathname==='/'&&!u.search&&!u.hash?u.origin:null;}catch{return null;}};
export function settings(env=process.env,productCatalog=catalog){
  const mode=['test','live'].includes(env.AERLOR_COMMERCE_MODE)?env.AERLOR_COMMERCE_MODE:'development';
  const origin=validOrigin(env.AERLOR_SITE_URL)||null;
  const contacts=validEmail(env.AERLOR_CONTACT_EMAIL)?env.AERLOR_CONTACT_EMAIL:null;
  const allowedCountries=parse(env.AERLOR_ALLOWED_COUNTRIES_JSON,[]);
  const shippingRates=parse(env.AERLOR_SHIPPING_RATES_JSON,[]);
  const candidate=parse(env.AERLOR_PRICEBOOK_JSON,[]);
  const prices=[];
  if(Array.isArray(candidate))for(const row of candidate){
    const p=productCatalog.products.find(p=>p.id===row?.id);
    if(!p||p.released!==true||!p.finishes.includes(row.finish)||!/^price_[A-Za-z0-9]+$/.test(row.priceId??'')||!Number.isSafeInteger(row.unitAmount)||row.unitAmount<=0||row.unitAmount>100000000||!['USD','CAD','GBP','EUR','AED'].includes(row.currency)||!Number.isSafeInteger(row.maxQuantity)||row.maxQuantity<1||row.maxQuantity>5000||typeof row.releaseReference!=='string'||row.releaseReference.length<3||!/^stock_[a-zA-Z0-9_-]{3,80}$/.test(row.inventoryKey??''))continue;
    if(prices.some(x=>(x.id===row.id&&x.finish===row.finish)||x.priceId===row.priceId))continue;
    prices.push({id:row.id,finish:row.finish,priceId:row.priceId,unitAmount:row.unitAmount,currency:row.currency,maxQuantity:row.maxQuantity,releaseReference:row.releaseReference,inventoryKey:row.inventoryKey});
  }
  const durable=Boolean(/^https:\/\/[^/]+\.upstash\.io\/?$/.test(env.UPSTASH_REDIS_REST_URL??'')&&env.UPSTASH_REDIS_REST_TOKEN&&String(env.AERLOR_STORE_HMAC_SECRET??'').length>=32);
  const verification=Boolean(env.TURNSTILE_SECRET_KEY&&/^[\w-]{10,100}$/.test(env.AERLOR_TURNSTILE_SITE_KEY??'')&&origin);
  const merchant=Boolean(origin&&contacts&&env.AERLOR_SELLER_NAME&&env.AERLOR_SELLER_ADDRESS&&env.AERLOR_LEGAL_REVISION&&env.AERLOR_TERMS_APPROVED==='true'&&env.AERLOR_TAX_READY==='true'&&env.AERLOR_FULFILLMENT_READY==='true');
  const keyMatches=mode==='live'?/^sk_live_/.test(env.STRIPE_SECRET_KEY??''):mode==='test'?/^sk_test_/.test(env.STRIPE_SECRET_KEY??''):false;
  const destinations=Array.isArray(allowedCountries)&&allowedCountries.length>0&&allowedCountries.length<=30&&allowedCountries.every(v=>/^[A-Z]{2}$/.test(v)&&!['EU','ZZ','XX'].includes(v));
  const shipping=Array.isArray(shippingRates)&&shippingRates.length>0&&shippingRates.length<=5&&shippingRates.every(v=>/^shr_[A-Za-z0-9]+$/.test(v));
  const checkoutEnabled=Boolean(env.AERLOR_COMMERCE_APPROVED==='true'&&merchant&&keyMatches&&env.STRIPE_WEBHOOK_SECRET&&durable&&verification&&destinations&&shipping&&prices.length);
  const inquiryEnabled=Boolean(env.AERLOR_INQUIRIES_APPROVED==='true'&&contacts&&origin&&durable&&verification&&env.RESEND_API_KEY&&env.AERLOR_EMAIL_FROM&&validEmail(env.AERLOR_INQUIRY_TO)&&env.AERLOR_PRIVACY_APPROVED==='true');
  return {env,mode,origin,contactEmail:contacts,prices,allowedCountries:destinations?[...new Set(allowedCountries)]:[],shippingRates:shipping?shippingRates:[],durable,verification,checkoutEnabled,inquiryEnabled,legalRevision:env.AERLOR_LEGAL_REVISION??'',revision:productCatalog.revision};
}
export function publicConfig(s){return {mode:s.checkoutEnabled?s.mode:'development',checkoutEnabled:s.checkoutEnabled,inquiryEnabled:s.inquiryEnabled,contactEmail:s.contactEmail,turnstileSiteKey:s.inquiryEnabled||s.checkoutEnabled?s.env.AERLOR_TURNSTILE_SITE_KEY:null,prices:s.checkoutEnabled?s.prices.map(({id,finish,currency,unitAmount,maxQuantity})=>({id,finish,currency,unitAmount,maxQuantity})):[]};}
export async function providerJson(url,options={},fetcher=fetch){
  let response;try{response=await fetcher(url,{...options,signal:AbortSignal.timeout(12000)});}catch{throw new HttpError(503,'A required service is temporarily unavailable. Please retry with the same selection.','provider_unavailable');}
  const raw=await response.text();if(raw.length>2000000)throw new HttpError(503,'A required service returned an unexpected response.');
  let result;try{result=JSON.parse(raw);}catch{throw new HttpError(503,'A required service returned an unexpected response.');}
  if(!response.ok){const error=new HttpError(response.status===429?429:503,'The request could not be completed by the service. Please retry.','provider_rejected');error.providerStatus=response.status;throw error;}
  return result;
}
export async function stripe(path,s,body,idem,fetcher=fetch){
  const headers={Authorization:`Bearer ${s.env.STRIPE_SECRET_KEY}`,'Stripe-Version':STRIPE_VERSION};
  if(body){headers['Content-Type']='application/x-www-form-urlencoded';if(idem)headers['Idempotency-Key']=idem;}
  return providerJson('https://api.stripe.com/v1/'+path,{method:body?'POST':'GET',headers,body:body?new URLSearchParams(body).toString():undefined},fetcher);
}
export function redisStore(s,fetcher=fetch){
  if(!s.durable)throw new HttpError(503,'The transaction service is not configured.','store_unavailable');
  const command=async parts=>{const result=await providerJson(s.env.UPSTASH_REDIS_REST_URL,{method:'POST',headers:{Authorization:`Bearer ${s.env.UPSTASH_REDIS_REST_TOKEN}`,'Content-Type':'application/json'},body:JSON.stringify(parts)},fetcher);if(result.error)throw new HttpError(503,'The transaction service is temporarily unavailable.');return result.result;};
  return {command,get:async key=>{const value=await command(['GET',key]);return typeof value==='string'?parse(value,null):null;},set:async(key,value,seconds=2592000)=>command(['SET',key,JSON.stringify(value),'EX',seconds]),eval:async(script,keys,args)=>command(['EVAL',script,keys.length,...keys,...args.map(v=>typeof v==='string'?v:JSON.stringify(v))])};
}
export function privateKey(s,value){return createHmac('sha256',s.env.AERLOR_STORE_HMAC_SECRET).update(value).digest('hex');}
export async function limit(s,store,scope,ip,max=12,seconds=600){
  const key=`aerlor:v1:rate:${scope}:${privateKey(s,ip||'unknown')}`;
  const result=await store.eval("local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]); end; return n;",[key],[seconds]);
  if(Number(result)>max)throw new HttpError(429,'Too many requests. Please wait before trying again.','rate_limited');
}
export async function verifyChallenge(token,action,s,fetcher=fetch){
  if(typeof token!=='string'||token.length<8||token.length>2048)throw new HttpError(400,'Please complete the verification and try again.','verification_required');
  const result=await providerJson('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:s.env.TURNSTILE_SECRET_KEY,response:token})},fetcher);
  if(result.success!==true||result.action!==action||result.hostname!==new URL(s.origin).hostname)throw new HttpError(400,'Verification expired or could not be confirmed. Please try again.','verification_failed');
}
export function verifyStripeSignature(raw,header,secret,now=Date.now()){
  if(!Buffer.isBuffer(raw)||typeof header!=='string'||header.length>3000||typeof secret!=='string'||!secret.startsWith('whsec_'))throw new HttpError(400,'Invalid webhook signature.');
  const parts=header.split(',').map(p=>p.split('='));const t=parts.find(p=>p[0]==='t')?.[1];
  if(!/^\d{10,13}$/.test(t??'')||Math.abs(Math.floor(now/1000)-Number(t))>300)throw new HttpError(400,'Invalid webhook timestamp.');
  const expected=createHmac('sha256',secret).update(t+'.').update(raw).digest();
  const ok=parts.filter(p=>p[0]==='v1'&&/^[a-f0-9]{64}$/i.test(p[1]??'')).some(p=>timingSafeEqual(Buffer.from(p[1],'hex'),expected));
  if(!ok)throw new HttpError(400,'Invalid webhook signature.');
  let event;try{event=JSON.parse(raw.toString('utf8'));}catch{throw new HttpError(400,'Invalid webhook payload.');}
  if(!/^evt_[A-Za-z0-9]+$/.test(event?.id??'')||typeof event.type!=='string')throw new HttpError(400,'Invalid webhook event.');
  return event;
}
export function requireOrigin(req,s){
  if(!s.origin)throw new HttpError(503,'This service is not configured.');
  const origin=req.headers?.origin;
  if(origin!==s.origin)throw new HttpError(403,'This request must originate from the AERLOR website.','origin_mismatch');
  if(req.headers?.['sec-fetch-site']&&req.headers['sec-fetch-site']!=='same-origin')throw new HttpError(403,'Cross-site requests are not accepted.');
}
export async function readBody(req,max=24000,raw=false){
  if(Number(req.headers?.['content-length']??0)>max)throw new HttpError(413,'The request is too large.');
  let buffer;
  if(Buffer.isBuffer(req.body))buffer=req.body;
  else if(typeof req.body==='string')buffer=Buffer.from(req.body);
  else if(req.body!==undefined&&!raw)buffer=Buffer.from(JSON.stringify(req.body));
  else {const chunks=[];let size=0;for await(const chunk of req){const part=Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);size+=part.length;if(size>max)throw new HttpError(413,'The request is too large.');chunks.push(part);}buffer=Buffer.concat(chunks);}
  if(buffer.length>max)throw new HttpError(413,'The request is too large.');
  if(raw)return buffer;
  if(!String(req.headers?.['content-type']??'').toLowerCase().startsWith('application/json'))throw new HttpError(415,'Use a JSON request.');
  try{const data=JSON.parse(buffer.toString('utf8'));if(!data||typeof data!=='object'||Array.isArray(data))throw new Error();return data;}catch{throw new HttpError(400,'The request body is not valid JSON.');}
}
export function respond(res,status,data){res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.end(JSON.stringify(data));}
export function errorResponse(res,error){if(error instanceof ValidationError)return respond(res,400,{error:error.message,field:error.field});if(error instanceof HttpError)return respond(res,error.status,{error:error.message,code:error.code});console.error('aerlor_api_failure',{name:error?.name??'Error'});return respond(res,500,{error:'The request could not be completed. Please try again or use the contact email.'});}
export function requestIp(req){return String(req.headers?.['x-vercel-forwarded-for']??req.headers?.['x-forwarded-for']??req.socket?.remoteAddress??'unknown').split(',')[0].trim().slice(0,80);}
