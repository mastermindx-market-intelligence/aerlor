import {validateCart,validateInquiry,buildProjectBrief,summarizeCart,ValidationError} from '../shared/domain.mjs';
import {catalog,settings,publicConfig,HttpError,sha,requestId,stripe,redisStore,limit,verifyChallenge,verifyStripeSignature,privateKey,providerJson} from './runtime.mjs';

// All stock and order transitions are atomic. No process-local inventory or payment truth.
export const RESERVE_STOCK=`
local prior=redis.call('GET',KEYS[1]);
if prior then local p=cjson.decode(prior); if p.cartHash~=ARGV[2] then return cjson.encode({status='conflict'}); end; return cjson.encode({status='existing',record=p}); end;
local rec=cjson.decode(ARGV[1]);
for _,line in ipairs(rec.inventory) do local n=tonumber(redis.call('GET',line.key) or '-1'); if n<line.quantity then return cjson.encode({status='insufficient'}); end; end;
for _,line in ipairs(rec.inventory) do redis.call('DECRBY',line.key,line.quantity); end;
redis.call('SET',KEYS[1],ARGV[1]); redis.call('ZADD',KEYS[2],rec.createdAt,rec.requestId);
return cjson.encode({status='reserved',record=rec});`;
export const LINK_SESSION=`
local raw=redis.call('GET',KEYS[1]); if not raw then return 0; end; local r=cjson.decode(raw);
if r.state=='creating' or r.state=='open' then r.sessionId=ARGV[1];r.checkoutUrl=ARGV[2];r.expiresAt=tonumber(ARGV[3]);r.state='open';redis.call('SET',KEYS[1],cjson.encode(r));return 1;end;return 0;`;
export const RELEASE_STOCK=`
local raw=redis.call('GET',KEYS[1]);if not raw then return 0;end;local r=cjson.decode(raw);
if r.state=='paid' or r.state=='released' or r.state=='rejected' or r.state=='payment-review' then return 0;end;
for _,line in ipairs(r.inventory) do redis.call('INCRBY',line.key,line.quantity);end;
r.state=ARGV[1];r.releaseReason=ARGV[2];r.updatedAt=tonumber(ARGV[3]);redis.call('SET',KEYS[1],cjson.encode(r));redis.call('ZREM',KEYS[2],r.requestId);return 1;`;
export const RECORD_PAYMENT=`
local raw=redis.call('GET',KEYS[1]);if not raw then return 'missing';end;local r=cjson.decode(raw);
if r.state=='paid' or r.state=='payment-review' then return 'duplicate';end;
local prior=r.state;r.state='paid';r.paymentStatus='paid';r.sessionId=ARGV[1];r.paidAt=tonumber(ARGV[2]);r.fulfillment='awaiting_operator';
if prior=='released' or prior=='rejected' then r.state='payment-review';r.fulfillment='inventory_review_required';end;
redis.call('SET',KEYS[1],cjson.encode(r));redis.call('ZREM',KEYS[2],r.requestId);redis.call('ZADD',KEYS[3],ARGV[2],r.requestId);return r.state;`;
export const INQUIRY_START=`
local old=redis.call('GET',KEYS[1]);if old then local r=cjson.decode(old);if r.fingerprint~=ARGV[2] then return cjson.encode({status='conflict'});end;return cjson.encode({status='existing',record=r});end;
redis.call('SET',KEYS[1],ARGV[1],'EX',172800);return cjson.encode({status='created'});`;
const decoded=value=>typeof value==='string'?JSON.parse(value):value;
const orderKey=id=>`aerlor:v1:order:${id}`;
const pending='aerlor:v1:pending';const fulfillment='aerlor:v1:fulfillment';
const failClosed=()=>{throw new HttpError(503,'Purchasing is not open for this collection. Your selection can be used for a project quote.','commerce_unavailable');};
export function createServices({env=process.env,productCatalog=catalog,fetcher=fetch,store:providedStore,clock=()=>Date.now()}={}){
  const s=settings(env,productCatalog);const getStore=()=>providedStore??redisStore(s,fetcher);
  const config=()=>publicConfig(s);
  async function checkout(body,ip){
    if(!s.checkoutEnabled)failClosed();
    const id=requestId(body.requestId);if(body.consent!==true)throw new ValidationError('Review the purchasing terms before continuing.','consent');
    const items=validateCart(body.items,productCatalog.products);const rows=items.map(item=>{const price=s.prices.find(p=>p.id===item.id&&p.finish===item.finish);if(!price||item.quantity>price.maxQuantity)throw new HttpError(409,'This selection is not currently eligible for online purchase.','selection_unavailable');return {...item,...price};});
    const totals=summarizeCart(items,s.prices);if(!totals.fullyPriced||totals.subtotal===null)throw new HttpError(409,'The selected items cannot be purchased together.');
    const store=getStore();await limit(s,store,'checkout',ip,12,600);await verifyChallenge(body.verificationToken,'checkout',s,fetcher);
    const cartHash=sha({rows,legalRevision:s.legalRevision,revision:s.revision,origin:s.origin,countries:s.allowedCountries,shipping:s.shippingRates});
    if(totals.subtotal>99999999)throw new HttpError(409,'This selection requires a written wholesale quote.','quote_required');
    const prior=await store.get(orderKey(id));
    if(prior){
      if(prior.cartHash!==cartHash)throw new HttpError(409,'This request reference belongs to a different selection. Refresh checkout.','idempotency_conflict');
      if(prior.state==='paid'||prior.state==='payment-review')throw new HttpError(409,'A payment is already recorded for this request. Contact support rather than paying again.');
      if(prior.state==='released'||prior.state==='rejected'||clock()>prior.createdAt+23*60*60*1000)throw new HttpError(409,'This checkout reference is no longer active. Review your bag before starting again.');
      if(prior.sessionId&&prior.checkoutUrl){const live=await stripe('checkout/sessions/'+encodeURIComponent(prior.sessionId),s,undefined,undefined,fetcher);if(live.status==='open'&&live.payment_status==='unpaid')return {url:prior.checkoutUrl,reference:id};throw new HttpError(409,'This checkout session is no longer open. Check your payment status before trying again.');}
    }
    // Price IDs, amounts, currency and availability come from the server, then are corroborated by Stripe.
    for(const row of rows){const p=await stripe('prices/'+encodeURIComponent(row.priceId),s,undefined,undefined,fetcher);if(p.id!==row.priceId||p.active!==true||p.type!=='one_time'||p.unit_amount!==row.unitAmount||p.currency?.toUpperCase()!==row.currency||p.livemode!==(s.mode==='live'))throw new HttpError(409,'An approved price has changed. Please request an updated quote.','price_mismatch');}
    for(const rateId of s.shippingRates){const rate=await stripe('shipping_rates/'+encodeURIComponent(rateId),s,undefined,undefined,fetcher);if(rate.id!==rateId||rate.active!==true||rate.type!=='fixed_amount'||rate.fixed_amount?.currency?.toUpperCase()!==totals.currency||rate.livemode!==(s.mode==='live'))throw new HttpError(409,'The delivery rate needs confirmation before checkout.','shipping_mismatch');}
    if(s.mode==='live'){const account=await stripe('account',s,undefined,undefined,fetcher);if(account.charges_enabled!==true)throw new HttpError(503,'The merchant account is not ready to accept payment.');}
    const inventoryMap=new Map();for(const row of rows){const key='aerlor:v1:stock:'+row.inventoryKey;inventoryMap.set(key,(inventoryMap.get(key)||0)+row.quantity);}
    const record={requestId:id,cartHash,state:'creating',createdAt:clock(),items:rows,inventory:[...inventoryMap].map(([key,quantity])=>({key,quantity})),subtotal:totals.subtotal,currency:totals.currency,legalRevision:s.legalRevision,mode:s.mode};
    const reserved=decoded(await store.eval(RESERVE_STOCK,[orderKey(id),pending],[JSON.stringify(record),cartHash]));
    if(reserved.status==='conflict')throw new HttpError(409,'This checkout reference belongs to another selection.');
    if(reserved.status==='insufficient')throw new HttpError(409,'The requested quantity is not available for online checkout. Please request a project quote.','insufficient_stock');
    const active=reserved.record;
    if(!['creating','open'].includes(active.state))throw new HttpError(409,'This checkout is already resolved. Check the order status before trying again.');
    if(clock()>active.createdAt+20*60*1000&&!active.sessionId)throw new HttpError(409,'This checkout needs reconciliation before another payment attempt. Contact the team with your reference.','reconciliation_required');
    const bodyParams={mode:'payment',success_url:`${s.origin}/order/?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${s.origin}/order/?cancelled=1`,client_reference_id:id,'metadata[aerlor_request_id]':id,'metadata[aerlor_cart_hash]':cartHash,'metadata[aerlor_revision]':s.revision,'metadata[aerlor_mode]':s.mode,'automatic_tax[enabled]':'true',billing_address_collection:'required','consent_collection[terms_of_service]':'required','custom_text[terms_of_service_acceptance][message]':`I agree to the [AERLOR purchasing terms](${s.origin}/terms/).`,expires_at:String(Math.floor(active.createdAt/1000)+3600)};
    rows.forEach((row,i)=>{bodyParams[`line_items[${i}][price]`]=row.priceId;bodyParams[`line_items[${i}][quantity]`]=String(row.quantity);});
    s.allowedCountries.forEach((country,i)=>{bodyParams[`shipping_address_collection[allowed_countries][${i}]`]=country;});
    s.shippingRates.forEach((rate,i)=>{bodyParams[`shipping_options[${i}][shipping_rate]`]=rate;});
    let session;
    try{session=await stripe('checkout/sessions',s,bodyParams,'aerlor-checkout-'+id,fetcher);}catch(error){
      // Only a definite 4xx rejection proves this create attempt made no session. Network/5xx uncertainty keeps the reservation.
      if(error.providerStatus>=400&&error.providerStatus<500&&error.providerStatus!==409&&error.providerStatus!==429&&reserved.status==='reserved')await store.eval(RELEASE_STOCK,[orderKey(id),pending],['rejected','provider_rejected',clock()]);
      throw error;
    }
    let destination;try{destination=new URL(session.url);}catch{throw new HttpError(503,'Secure checkout did not return a verified destination.');}
    if(!/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(session.id??'')||destination.protocol!=='https:'||destination.hostname!=='checkout.stripe.com'||session.livemode!==(s.mode==='live')||session.mode!=='payment')throw new HttpError(503,'Secure checkout could not be verified.');
    await store.eval(LINK_SESSION,[orderKey(id)],[session.id,session.url,session.expires_at]);
    return {url:session.url,reference:id};
  }
  async function inquiry(body,ip){
    if(!s.inquiryEnabled)throw new HttpError(503,'Direct submission is not connected. Please use the email draft or download your project brief.','inquiry_unavailable');
    if(body.website)throw new HttpError(400,'The inquiry could not be verified.');
    const id=requestId(body.requestId);const data=validateInquiry(body);const items=validateCart(body.items??[],productCatalog.products,{allowEmpty:true});
    const store=getStore();await limit(s,store,'inquiry',ip,5,600);await verifyChallenge(body.verificationToken,'inquiry',s,fetcher);
    const fingerprint=privateKey(s,JSON.stringify({data,items}));const key='aerlor:v1:inquiry:'+id;const reference='AR-'+id.slice(0,8).toUpperCase();
    const start=decoded(await store.eval(INQUIRY_START,[key],[JSON.stringify({fingerprint,state:'sending',reference,createdAt:clock()}),fingerprint]));
    if(start.status==='conflict')throw new HttpError(409,'This request reference belongs to a different inquiry. Refresh the form.');
    if(start.record?.state==='accepted')return {accepted:true,reference};
    const text=buildProjectBrief(data,items,productCatalog.products).replace('Prepared on your device. Not an order or binding quote.','Received through the AERLOR project inquiry form. Not an order or binding quote.').replace('Preparing this brief does not send it. Review and send it using the delivery option you choose.','The sender consented to project-related contact only. Do not subscribe them to marketing.');
    const result=await providerJson('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${s.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':'aerlor-inquiry-'+id},body:JSON.stringify({from:s.env.AERLOR_EMAIL_FROM,to:[s.env.AERLOR_INQUIRY_TO],reply_to:data.email,subject:`AERLOR ${reference} | ${data.company.replace(/[\r\n]+/g,' ')}`,text})},fetcher);
    if(typeof result.id!=='string'||result.id.length<8)throw new HttpError(503,'Inquiry delivery was not confirmed. Please retry with the same form.');
    await store.set(key,{fingerprint,state:'accepted',reference,providerId:result.id,acceptedAt:clock()},172800);
    return {accepted:true,reference};
  }
  async function order(sessionId,ip){
    if(!s.checkoutEnabled)throw new HttpError(503,'Payment verification is not connected. Please use your provider receipt or contact the team.');
    if(!/^cs_(test_|live_)?[A-Za-z0-9]{12,220}$/.test(sessionId??''))throw new ValidationError('The checkout reference is not valid.');
    const store=getStore();await limit(s,store,'order',ip,40,600);
    const session=await stripe('checkout/sessions/'+encodeURIComponent(sessionId),s,undefined,undefined,fetcher);
    const id=session.metadata?.aerlor_request_id;if(!id||session.livemode!==(s.mode==='live')||session.mode!=='payment')throw new HttpError(404,'This checkout reference could not be verified.');
    const record=await store.get(orderKey(id));if(!record||record.sessionId!==session.id||record.cartHash!==session.metadata.aerlor_cart_hash)throw new HttpError(404,'This checkout reference could not be verified.');
    return {verified:true,paymentStatus:session.payment_status==='paid'?'paid':session.status==='complete'?'processing':'unpaid'};
  }
  async function webhook(raw,signature){
    if(!s.checkoutEnabled)throw new HttpError(503,'The payment webhook is not configured.');
    const event=verifyStripeSignature(raw,signature,s.env.STRIPE_WEBHOOK_SECRET,clock());
    if(event.livemode!==(s.mode==='live'))throw new HttpError(400,'The payment environment does not match.');
    const accepted=['checkout.session.completed','checkout.session.async_payment_succeeded','checkout.session.async_payment_failed','checkout.session.expired'];
    if(!accepted.includes(event.type))return {received:true,ignored:true};
    const eventSession=event.data?.object;if(!/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(eventSession?.id??''))throw new HttpError(400,'Invalid checkout event.');
    const store=getStore();const eventKey='aerlor:v1:event:'+event.id;if(await store.get(eventKey))return {received:true,duplicate:true};
    const session=await stripe('checkout/sessions/'+encodeURIComponent(eventSession.id)+'?expand[]=line_items',s,undefined,undefined,fetcher);
    const id=session.metadata?.aerlor_request_id;if(!id||session.metadata.aerlor_mode!==s.mode||session.livemode!==(s.mode==='live')||session.mode!=='payment')return {received:true,ignored:true};
    const record=await store.get(orderKey(id));
    if(!record||record.cartHash!==session.metadata.aerlor_cart_hash||(record.sessionId&&record.sessionId!==session.id))throw new HttpError(409,'The payment requires order reconciliation.');
    const lines=session.line_items?.data;if(!Array.isArray(lines)||session.line_items?.has_more)throw new HttpError(409,'The payment line items require reconciliation.');
    const expected=record.items.map(r=>({price:r.priceId,quantity:r.quantity})).sort((a,b)=>a.price.localeCompare(b.price));
    const observed=lines.map(l=>({price:typeof l.price==='string'?l.price:l.price?.id,quantity:l.quantity})).sort((a,b)=>String(a.price).localeCompare(String(b.price)));
    if(JSON.stringify(expected)!==JSON.stringify(observed)||session.amount_subtotal!==record.subtotal||session.currency?.toUpperCase()!==record.currency)throw new HttpError(409,'The payment totals require reconciliation.');
    let outcome='pending';
    if(session.payment_status==='paid')outcome=await store.eval(RECORD_PAYMENT,[orderKey(id),pending,fulfillment],[session.id,clock()]);
    else if(event.type==='checkout.session.expired'&&session.status==='expired'){await store.eval(RELEASE_STOCK,[orderKey(id),pending],['released','session_expired',clock()]);outcome='released';}
    else if(event.type==='checkout.session.async_payment_failed'){await store.eval(RELEASE_STOCK,[orderKey(id),pending],['released','async_payment_failed',clock()]);outcome='released';}
    else if(session.payment_status!=='unpaid')throw new HttpError(409,'Payment state requires review.');
    await store.set(eventKey,{eventId:event.id,requestId:id,outcome,processedAt:clock()},2592000);
    return {received:true,outcome};
  }
  return {config,checkout,inquiry,order,webhook,settings:s};
}
