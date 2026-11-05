import {readFileSync} from 'node:fs';
import {randomUUID,createHmac} from 'node:crypto';
import {RESERVE_STOCK,LINK_SESSION,RELEASE_STOCK,RECORD_PAYMENT,INQUIRY_START,createServices} from '../server/services.mjs';
export const NOW=1793782800000;
const clone=value=>structuredClone(value);
export class TestStore {
  values=new Map();pending=new Set();fulfillment=new Set();
  async get(key){return this.values.has(key)?clone(this.values.get(key)):null;}
  async set(key,value){this.values.set(key,clone(value));return 'OK';}
  async eval(script,keys,args){
    if(script.includes("local n=redis.call('INCR'")){const n=(this.values.get(keys[0])||0)+1;this.values.set(keys[0],n);return n;}
    if(script===RESERVE_STOCK){const prior=this.values.get(keys[0]);if(prior)return JSON.stringify(prior.cartHash!==args[1]?{status:'conflict'}:{status:'existing',record:prior});const record=JSON.parse(args[0]);if(record.inventory.some(x=>(this.values.get(x.key)??-1)<x.quantity))return JSON.stringify({status:'insufficient'});for(const x of record.inventory)this.values.set(x.key,this.values.get(x.key)-x.quantity);this.values.set(keys[0],record);this.pending.add(record.requestId);return JSON.stringify({status:'reserved',record});}
    if(script===LINK_SESSION){const r=this.values.get(keys[0]);if(!r)return 0;if(['creating','open'].includes(r.state)){Object.assign(r,{sessionId:args[0],checkoutUrl:args[1],expiresAt:Number(args[2]),state:'open'});return 1;}return 0;}
    if(script===RELEASE_STOCK){const r=this.values.get(keys[0]);if(!r||['paid','released','rejected','payment-review'].includes(r.state))return 0;for(const x of r.inventory)this.values.set(x.key,this.values.get(x.key)+x.quantity);Object.assign(r,{state:args[0],releaseReason:args[1],updatedAt:Number(args[2])});this.pending.delete(r.requestId);return 1;}
    if(script===RECORD_PAYMENT){const r=this.values.get(keys[0]);if(!r)return 'missing';if(['paid','payment-review'].includes(r.state))return 'duplicate';const prior=r.state;Object.assign(r,{state:['released','rejected'].includes(prior)?'payment-review':'paid',paymentStatus:'paid',sessionId:args[0],paidAt:Number(args[1]),fulfillment:['released','rejected'].includes(prior)?'inventory_review_required':'awaiting_operator'});this.pending.delete(r.requestId);this.fulfillment.add(r.requestId);return r.state;}
    if(script===INQUIRY_START){const r=this.values.get(keys[0]);if(r)return JSON.stringify(r.fingerprint!==args[1]?{status:'conflict'}:{status:'existing',record:r});this.values.set(keys[0],JSON.parse(args[0]));return JSON.stringify({status:'created'});}
    throw new Error('Unrecognized atomic operation in test adapter.');
  }
}
export function fixture(overrides={}){
  const productCatalog=JSON.parse(readFileSync(new URL('../src/catalog.json',import.meta.url),'utf8'));productCatalog.products[0].released=true;
  const prices=[{id:'dryer-lite',finish:'Pearl',priceId:'price_testFixtureDryer',unitAmount:9900,currency:'USD',maxQuantity:100,releaseReference:'TEST-FIXTURE-NOT-A-COMMERCIAL-APPROVAL',inventoryKey:'stock_testDryer'}];
  const env={AERLOR_COMMERCE_MODE:'test',AERLOR_COMMERCE_APPROVED:'true',AERLOR_SITE_URL:'https://aerlor.example',AERLOR_CONTACT_EMAIL:'contact@example.com',AERLOR_SELLER_NAME:'Test fixture only',AERLOR_SELLER_ADDRESS:'Not a real seller',AERLOR_LEGAL_REVISION:'test',AERLOR_TERMS_APPROVED:'true',AERLOR_TAX_READY:'true',AERLOR_FULFILLMENT_READY:'true',STRIPE_SECRET_KEY:'sk_test_unit_fixture_not_a_real_credential',STRIPE_WEBHOOK_SECRET:'whsec_unit_fixture_not_a_real_credential',UPSTASH_REDIS_REST_URL:'https://fixture.upstash.io',UPSTASH_REDIS_REST_TOKEN:'fixture-not-a-real-token',AERLOR_STORE_HMAC_SECRET:'fixture-only-hmac-material-at-least-thirty-two-characters',TURNSTILE_SECRET_KEY:'fixture-not-a-real-secret',AERLOR_TURNSTILE_SITE_KEY:'fixture_site_key_12345',AERLOR_ALLOWED_COUNTRIES_JSON:'["US","CA"]',AERLOR_SHIPPING_RATES_JSON:'["shr_testFixtureShipping"]',AERLOR_PRICEBOOK_JSON:JSON.stringify(prices),AERLOR_INQUIRIES_APPROVED:'true',RESEND_API_KEY:'fixture-not-a-real-key',AERLOR_EMAIL_FROM:'Test <noreply@example.com>',AERLOR_INQUIRY_TO:'contact@example.com',AERLOR_PRIVACY_APPROVED:'true',...overrides};
  const store=new TestStore();store.values.set('aerlor:v1:stock:stock_testDryer',10);
  const state={calls:[],sessions:new Map(),idempotency:new Map(),createFailure:null,createUnknown:false,badPrice:false,badChallenge:false,badDestination:false,emailFailure:false,emails:0};
  const ok=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json'}});
  const fetcher=async(url,options={})=>{
    const u=new URL(url);state.calls.push({path:u.pathname,method:options.method||'GET'});
    if(u.hostname==='challenges.cloudflare.com'){const input=JSON.parse(options.body);return ok({success:!state.badChallenge,hostname:state.badChallenge?'attacker.example':'aerlor.example',action:input.response.startsWith('checkout')?'checkout':'inquiry'});}
    if(u.hostname==='api.resend.com'){if(state.emailFailure)return ok({error:'simulated'},500);const key=options.headers['Idempotency-Key'];if(!state.idempotency.has(key)){state.idempotency.set(key,{id:'email_fixture_id_12345'});state.emails++;}return ok(state.idempotency.get(key));}
    if(u.hostname!=='api.stripe.com')throw new Error('No real network calls are permitted by this fixture.');
    if(u.pathname.startsWith('/v1/prices/'))return ok({id:prices[0].priceId,active:true,type:'one_time',unit_amount:state.badPrice?1:9900,currency:'usd',livemode:false});
    if(u.pathname.startsWith('/v1/shipping_rates/'))return ok({id:'shr_testFixtureShipping',active:true,type:'fixed_amount',fixed_amount:{currency:'usd',amount:1000},livemode:false});
    if(u.pathname==='/v1/account')return ok({charges_enabled:true});
    if(u.pathname==='/v1/checkout/sessions'&&options.method==='POST'){
      if(state.createFailure)return ok({error:'simulated'},state.createFailure);
      const idem=options.headers['Idempotency-Key'];if(state.idempotency.has(idem))return ok(state.idempotency.get(idem));
      const body=new URLSearchParams(options.body);state.lastCheckout=Object.fromEntries(body);const id='cs_test_'+randomUUID().replaceAll('-','');const quantity=Number(body.get('line_items[0][quantity]'));const session={id,mode:'payment',livemode:false,status:'open',payment_status:'unpaid',amount_subtotal:9900*quantity,currency:'usd',expires_at:Number(body.get('expires_at')),metadata:{aerlor_request_id:body.get('metadata[aerlor_request_id]'),aerlor_cart_hash:body.get('metadata[aerlor_cart_hash]'),aerlor_revision:body.get('metadata[aerlor_revision]'),aerlor_mode:'test'},line_items:{has_more:false,data:[{price:{id:prices[0].priceId},quantity}]},url:state.badDestination?'https://attacker.example/pay':'https://checkout.stripe.com/c/pay/'+id};state.sessions.set(id,session);state.idempotency.set(idem,session);if(state.createUnknown){state.createUnknown=false;throw new Error('simulated network timeout after provider accepted');}return ok(session);
    }
    if(u.pathname.startsWith('/v1/checkout/sessions/')){const id=u.pathname.split('/').pop();return state.sessions.has(id)?ok(state.sessions.get(id)):ok({error:'missing'},404);}
    throw new Error('Unexpected provider route '+u.pathname);
  };
  const dependencies={env,productCatalog,fetcher,store,clock:()=>NOW};
  const service=createServices(dependencies);
  return {env,productCatalog,store,state,fetcher,dependencies,service};
}
export const checkoutBody=()=>({requestId:randomUUID(),items:[{id:'dryer-lite',finish:'Pearl',quantity:2}],consent:true,verificationToken:'checkout-fixture-token'});
export const inquiryBody=()=>({requestId:randomUUID(),name:'Alex Morgan',email:'alex@example.com',company:'Example Hotel',country:'CA',rooms:100,role:'Procurement',timing:'Exploring options',collections:['Hairdryers'],message:'A test project.',consent:true,items:[],verificationToken:'inquiry-fixture-token',website:''});
export function eventFor(type,session,env,{id='evt_'+randomUUID().replaceAll('-',''),time=NOW}={}){const event={id,type,livemode:false,data:{object:{id:session.id}}};const raw=Buffer.from(JSON.stringify(event));const t=Math.floor(time/1000);const signature='t='+t+',v1='+createHmac('sha256',env.STRIPE_WEBHOOK_SECRET).update(String(t)+'.').update(raw).digest('hex');return {raw,signature,event};}
