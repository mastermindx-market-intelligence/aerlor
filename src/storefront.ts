import catalog from './catalog.json';
import { CART_VERSION, MAX_LINE_QUANTITY, ValidationError, validateCart, readStoredCart, calculateInvestment, summarizeCart, validateInquiry, buildProjectBrief, formatMoney, validEmail } from '../shared/domain.mjs';
import type { CartItem, PublicPrice, Inquiry } from '../shared/domain.mjs';

type Runtime = { checkoutEnabled:boolean; inquiryEnabled:boolean; mode:'development'|'test'|'live'; contactEmail:string|null; turnstileSiteKey:string|null; prices:PublicPrice[] };
type Turnstile = {render:(target:HTMLElement,options:Record<string,unknown>)=>string; reset:(id:string)=>void; remove:(id:string)=>void};
declare global {interface Window {turnstile?:Turnstile}}
const products = catalog.products;
const base = import.meta.env.BASE_URL;
const STORAGE_KEY = 'aerlor-project-v1';
const runtime:Runtime = {checkoutEnabled:false,inquiryEnabled:false,mode:'development',contactEmail:null,turnstileSiteKey:null,prices:[]};
const $ = <T extends Element=HTMLElement>(selector:string):T|null => document.querySelector<T>(selector);
const make = <K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,className?:string):HTMLElementTagNameMap[K] => {
  const el=document.createElement(tag);if(text!==undefined)el.textContent=text;if(className)el.className=className;return el;
};
const route = (path:string):string => `${base}${path.replace(/^\//,'')}`;
let items:CartItem[]=[];
let toastTimer:number|undefined;
try {items=readStoredCart(localStorage.getItem(STORAGE_KEY),products);}catch{/* Storage can be denied without breaking the bag. */}

function saveCart(next:CartItem[]):void {
  items=validateCart(next,products,{allowEmpty:true});
  try {localStorage.setItem(STORAGE_KEY,JSON.stringify({version:CART_VERSION,items}));}catch{/* Memory fallback. No personal data is persisted. */}
  updateCounts();renderCart();renderCheckout();
}
function updateCounts():void {
  const count=items.reduce((n,item)=>n+item.quantity,0);
  document.querySelectorAll('[data-cart-count]').forEach(el=>{el.textContent=String(count);});
  document.querySelector('.bag-link')?.setAttribute('aria-label',`Your project bag, ${count} items`);
}
function showToast(message:string):void {
  const toast=$('#cart-notice');if(!toast)return;
  window.clearTimeout(toastTimer);toast.replaceChildren(make('span',message));
  const view=make('a','View project bag');view.href=route('cart/');toast.append(view);
  const close=make('button','×');close.type='button';close.setAttribute('aria-label','Dismiss notification');close.addEventListener('click',()=>{toast.hidden=true;});toast.append(close);toast.hidden=false;
  toastTimer=window.setTimeout(()=>{toast.hidden=true;},6500);
}
function imageFor(id:string,finish:string):string {
  const p=products.find(p=>p.id===id);
  if(!p)return 'studio/dryer-pearl-product.webp';
  const chosen=p.finishes.includes(finish)?finish:p.finish;
  if(id==='dryer-premium')return chosen==='Champagne'?'studio/dryer-signature-champagne.webp':'campaign/travel-case.webp';
  return `studio/${p.studioFamily}-${chosen.toLowerCase()}-product.webp`;
}

function addProduct(id:string,finish?:string,quantity=1):void {
  const p=products.find(p=>p.id===id);if(!p)return;
  try {saveCart([...items,{id,finish:finish??p.finish,quantity}]);showToast(`${p.name} added to your project.`);}catch(error){showToast(error instanceof Error?error.message:'Please check the quantity.');}
}
for(const button of document.querySelectorAll<HTMLButtonElement>('[data-add]'))button.addEventListener('click',()=>{
  const page=button.closest('[data-product-page]');
  const quantity=page?.querySelector<HTMLInputElement>('[data-product-quantity]');
  if(quantity&&!quantity.reportValidity())return;
  const finish=page?.querySelector<HTMLSelectElement>('[data-product-finish]')?.value;
  addProduct(button.dataset.add??'',finish,quantity?Number(quantity.value):1);
});
for(const button of document.querySelectorAll<HTMLButtonElement>('[data-bundle]'))button.addEventListener('click',()=>{
  const set=products.filter(p=>p.tier===button.dataset.bundle).map(p=>({id:p.id,finish:p.finish,quantity:1}));
  try{saveCart([...items,...set]);showToast(`The ${button.dataset.bundle} three-piece room concept is in your project bag.`);}catch(error){showToast(error instanceof Error?error.message:'Please review your selection.');}
});
function setProductGallery(view='product'):void {
  const id=document.body.dataset.productId??'';
  const p=products.find(p=>p.id===id);if(!p)return;
  const selected=$<HTMLSelectElement>('[data-product-finish]')?.value??p.finish;
  const image=$<HTMLImageElement>('[data-gallery-image]');
  const button=$<HTMLButtonElement>(`[data-gallery-view="${view}"]`);
  const src=view==='product'?imageFor(id,selected):button?.dataset.gallerySrc;
  if(!src||!image)return;
  image.src=route('images/'+src);
  const labels:Record<string,string>={product:`${selected} / ${selected==='Graphite'&&id==='dryer-premium'?'presentation concept':'product design study'}`,detail:`${id==='dryer-premium'?'Champagne':p.finish} / exterior design detail`,'in-room':'Champagne / room-placement visualization',presentation:'Champagne / proposed presentation kit'};
  const caption=labels[view]??'Product design visualization';
  image.alt=`${p.name}: ${caption}`;
  const label=$('#gallery-caption');if(label)label.textContent=caption;
  const stage=image.closest<HTMLElement>('.product-gallery');if(stage)stage.dataset.photo=String(view==='in-room'||view==='presentation');
  document.querySelectorAll<HTMLButtonElement>('[data-gallery-view]').forEach(control=>control.setAttribute('aria-pressed',String(control===button)));
}
$<HTMLSelectElement>('[data-product-finish]')?.addEventListener('change',()=>{setProductGallery();updatePrices();});
for(const control of document.querySelectorAll<HTMLButtonElement>('[data-gallery-view]'))control.addEventListener('click',()=>setProductGallery(control.dataset.galleryView));
window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){items=readStoredCart(event.newValue,products);updateCounts();renderCart();renderCheckout();}});

// Shared navigation works on the homepage and every product or procurement route.
if(document.body.dataset.legacy!=='true'){
  const toggle=$<HTMLButtonElement>('.menu-toggle');const menu=$('#mobile-menu');
  const close=(restore=false):void=>{if(!toggle||!menu)return;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open menu');menu.hidden=true;if(restore)toggle.focus();};
  toggle?.addEventListener('click',()=>{if(!menu)return;const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close menu':'Open menu');menu.hidden=!open;});
  menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>close()));
  window.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu&&!menu.hidden)close(true);});
  window.matchMedia('(min-width: 961px)').addEventListener('change',event=>{if(event.matches)close();});
}
const navDisclosure=$<HTMLDetailsElement>('.nav-disclosure');
document.addEventListener('click',event=>{if(navDisclosure?.open&&event.target instanceof Node&&!navDisclosure.contains(event.target))navDisclosure.open=false;});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&navDisclosure?.open){navDisclosure.open=false;navDisclosure.querySelector('summary')?.focus();}});

function updateFilters():void {
  const family=$<HTMLButtonElement>('[data-family-filter][aria-pressed=true]')?.dataset.familyFilter??'all';
  const tier=$<HTMLSelectElement>('#tier-filter')?.value??'all';let count=0;
  document.querySelectorAll<HTMLElement>('[data-catalog-card]').forEach(card=>{const visible=(family==='all'||card.dataset.family===family)&&(tier==='all'||card.dataset.tier===tier);card.hidden=!visible;if(visible)count++;});
  const label=$('#filter-count');if(label)label.textContent=`${count} collection ${count===1?'concept':'concepts'}`;
}
for(const button of document.querySelectorAll<HTMLButtonElement>('[data-family-filter]'))button.addEventListener('click',()=>{document.querySelectorAll('[data-family-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));updateFilters();});
$<HTMLSelectElement>('#tier-filter')?.addEventListener('change',updateFilters);
const filterQuery=new URLSearchParams(location.search);
const requestedTier=filterQuery.get('tier');
const tierSelect=$<HTMLSelectElement>('#tier-filter');
if(tierSelect&&requestedTier&&['Lite','Premium'].includes(requestedTier))tierSelect.value=requestedTier;
const requestedFamily=filterQuery.get('family');
if(requestedFamily&&['hairdryers','mirrors','curlers'].includes(requestedFamily))document.querySelectorAll<HTMLButtonElement>('[data-family-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.familyFilter===requestedFamily)));
updateFilters();


function updateInvestment():void {
  const form=$<HTMLFormElement>('#investment-form');if(!form)return;
  const error=$('#investment-error');
  try{
    const data=new FormData(form);const result=calculateInvestment({rooms:Number(data.get('rooms')),cost:Number(data.get('cost')),years:Number(data.get('years')),occupancy:Number(data.get('occupancy'))});
    const total=$('[data-investment-total]'),night=$('[data-investment-night]');
    if(total)total.textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(result.total);
    if(night)night.textContent=new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:3}).format(result.perOccupiedNight);
    if(error)error.textContent='';form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid'));
  }catch(err){if(error)error.textContent=err instanceof Error?err.message:'Check the planning assumptions.';if(err instanceof ValidationError)form.querySelector(`[name="${err.field}"]`)?.setAttribute('aria-invalid','true');}
}
$<HTMLFormElement>('#investment-form')?.addEventListener('input',updateInvestment);
$<HTMLFormElement>('#investment-form')?.addEventListener('submit',event=>{event.preventDefault();updateInvestment();});
updateInvestment();

function downloadText(name:string,text:string):void {
  const objectUrl=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const anchor=make('a');anchor.href=objectUrl;anchor.download=name;document.body.append(anchor);anchor.click();anchor.remove();window.setTimeout(()=>URL.revokeObjectURL(objectUrl),10000);
}
function cartBrief():string {
  return ['AERLOR / PROJECT SELECTION','Development concepts. Not an order, reservation or binding quote.','',...items.map(item=>`${item.quantity} x ${products.find(p=>p.id===item.id)?.name} / ${item.finish}`),'','Confirm the exact model, market approvals, price, tax, freight, lead time and commercial terms before any purchase.'].join('\n');
}
document.querySelectorAll('[data-download-cart]').forEach(button=>button.addEventListener('click',()=>downloadText('AERLOR-project-selection.txt',cartBrief())));
$('#clear-cart')?.addEventListener('click',()=>{saveCart([]);showToast('Your project bag is now empty.');});
function cartLine(item:CartItem,editable:boolean):HTMLElement {
  const p=products.find(p=>p.id===item.id)!;const line=make('article',undefined,'cart-line');
  const image=make('img');image.className='cart-line-image';image.src=route('images/'+imageFor(item.id,item.finish));image.alt=`${p.name} design study`;image.width=105;image.height=125;line.append(image);
  const content=make('div');const heading=make('h2');const a=make('a',p.name);a.href=route('products/'+p.slug+'/');heading.append(a);content.append(heading,make('p',`${item.finish} · ${p.code}`));
  if(editable){
    const controls=make('div',undefined,'cart-line-controls');const label=make('label','Quantity ');const input=make('input');input.type='number';input.min='1';input.max=String(MAX_LINE_QUANTITY);input.step='1';input.value=String(item.quantity);input.setAttribute('aria-label',`${p.name} ${item.finish} quantity`);
    input.addEventListener('change',()=>{if(!input.reportValidity()){input.value=String(item.quantity);return;}const next=items.map(x=>x.id===item.id&&x.finish===item.finish?{...x,quantity:Number(input.value)}:x);try{saveCart(next);const focused=$<HTMLInputElement>(`input[aria-label="${p.name} ${item.finish} quantity"]`);focused?.focus({preventScroll:true});}catch(error){input.value=String(item.quantity);showToast(error instanceof Error?error.message:'Please check the quantity.');}});
    label.append(input);const remove=make('button','Remove');remove.type='button';remove.setAttribute('aria-label',`Remove ${p.name} ${item.finish}`);remove.addEventListener('click',()=>{saveCart(items.filter(x=>!(x.id===item.id&&x.finish===item.finish)));showToast(`${p.name} removed.`);});controls.append(label,remove);content.append(controls);
  }else content.append(make('p',`Quantity: ${item.quantity}`));
  line.append(content);const price=runtime.prices.find(x=>x.id===item.id&&x.finish===item.finish);line.append(make('span',price?formatMoney(price.unitAmount*item.quantity,price.currency):'Price on request','cart-line-price'));return line;
}
function renderCart():void {
  const container=$('#cart-items');if(!container)return;container.replaceChildren(...items.map(item=>cartLine(item,true)));
  const empty=$('#cart-empty'),summary=$('#cart-summary'),clear=$('#clear-cart');if(empty)empty.hidden=items.length>0;if(summary)summary.hidden=items.length===0;if(clear)clear.hidden=items.length===0;
  const totals=summarizeCart(items,runtime.prices);const units=$('#cart-units'),subtotal=$('#cart-subtotal');if(units)units.textContent=String(totals.units);if(subtotal)subtotal.textContent=totals.subtotal!==null?formatMoney(totals.subtotal,totals.currency??'USD'):'Price on request';
}
function updatePrices():void {
  for(const el of document.querySelectorAll<HTMLElement>('[data-price]')){
    const id=el.dataset.price;const p=products.find(p=>p.id===id);const chosen=document.body.dataset.productId===id?$<HTMLSelectElement>('[data-product-finish]')?.value:p?.finish;
    const price=runtime.prices.find(x=>x.id===id&&x.finish===chosen);if(price)el.textContent=formatMoney(price.unitAmount,price.currency);
  }
  for(const el of document.querySelectorAll<HTMLElement>('[data-availability]'))if(runtime.checkoutEnabled&&runtime.prices.some(p=>p.id===el.dataset.availability))el.textContent=runtime.mode==='test'?'Test checkout only':'Available for approved destinations';
}

async function jsonRequest(path:string,body?:unknown):Promise<Record<string,unknown>> {
  const response=await fetch(path,{method:body===undefined?'GET':'POST',credentials:'omit',headers:body===undefined?{Accept:'application/json'}:{'Content-Type':'application/json',Accept:'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)});
  const text=await response.text();if(text.length>100000)throw new Error('The service returned an unexpected response. Please try again.');
  let result:Record<string,unknown>;try{result=JSON.parse(text) as Record<string,unknown>;}catch{throw new Error('The service is temporarily unavailable. Your selection is safe.');}
  if(!response.ok)throw new Error(typeof result.error==='string'?result.error:'The request could not be completed. Please try again.');
  return result;
}
const runtimeReady=(async()=>{
  try{
    const raw=await jsonRequest('/api/config');
    runtime.mode=raw.mode==='live'?'live':raw.mode==='test'?'test':'development';
    runtime.checkoutEnabled=raw.checkoutEnabled===true;runtime.inquiryEnabled=raw.inquiryEnabled===true;
    runtime.contactEmail=validEmail(raw.contactEmail)?String(raw.contactEmail):null;
    runtime.turnstileSiteKey=typeof raw.turnstileSiteKey==='string'&&/^[\w-]{10,100}$/.test(raw.turnstileSiteKey)?raw.turnstileSiteKey:null;
    if(Array.isArray(raw.prices))runtime.prices=raw.prices.filter((p):p is PublicPrice=>Boolean(p&&typeof p==='object'&&products.some(x=>x.id===p.id&&x.finishes.includes(p.finish))&&Number.isSafeInteger(p.unitAmount)&&p.unitAmount>0&&/^[A-Z]{3}$/.test(p.currency)&&Number.isSafeInteger(p.maxQuantity)&&p.maxQuantity>0));
  }catch{/* Fail closed. A static preview never pretends a backend exists. */}
  document.body.dataset.runtime=runtime.mode;document.body.dataset.runtimeReady='true';
  if(runtime.mode==='test'){const banner=make('div','Test commerce environment. No live orders or real payments.','quiet-note');banner.setAttribute('role','status');$('main')?.prepend(banner);}
  if(runtime.contactEmail){const a=$<HTMLAnchorElement>('[data-contact-email]');if(a){a.href=`mailto:${runtime.contactEmail}`;a.textContent=runtime.contactEmail;a.hidden=false;}const loading=$('[data-contact-loading]');if(loading)loading.hidden=true;}
  updatePrices();renderCart();renderCheckout();setupInquiryMode();
})();

let turnstileScript:Promise<void>|undefined;
async function verificationWidget(target:HTMLElement,action:string,onToken:(token:string)=>void):Promise<string|null>{
  if(!runtime.turnstileSiteKey)return null;
  if(!turnstileScript)turnstileScript=new Promise<void>((resolve,reject)=>{if(window.turnstile){resolve();return;}const script=make('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.defer=true;script.addEventListener('load',()=>resolve(),{once:true});script.addEventListener('error',()=>reject(new Error('Verification could not load. Please retry or use email.')),{once:true});document.head.append(script);});
  await turnstileScript;if(!window.turnstile)throw new Error('Verification is unavailable.');
  return window.turnstile.render(target,{sitekey:runtime.turnstileSiteKey,action,theme:'light',callback:(token:string)=>onToken(token),'expired-callback':()=>onToken(''),'error-callback':()=>onToken('')});
}
let inquiryToken='';let inquiryWidget:string|null=null;
async function setupInquiryMode():Promise<void>{
  const submit=$<HTMLButtonElement>('[data-project-submit]');if(!submit)return;
  submit.textContent=runtime.inquiryEnabled?'Send my project inquiry ↗':'Prepare my project brief ↗';
  if(runtime.inquiryEnabled){const target=$('#verification-widget');if(target)try{inquiryWidget=await verificationWidget(target,'inquiry',token=>{inquiryToken=token;});}catch(error){const status=$('#project-error');if(status)status.textContent=error instanceof Error?error.message:'Verification could not load.';}}
}
function inquiryData(form:HTMLFormElement):Inquiry {
  const data=new FormData(form);return validateInquiry({...Object.fromEntries(data.entries()),collections:data.getAll('collections'),consent:data.get('consent')==='on'});
}
function showFormError(error:unknown,form:HTMLFormElement):void {
  const box=$('#project-error');if(box)box.textContent=error instanceof Error?error.message:'Please check the project details.';
  if(error instanceof ValidationError&&error.field){const field=form.elements.namedItem(error.field);if(field instanceof HTMLElement){field.setAttribute('aria-invalid','true');field.setAttribute('aria-describedby','project-error');field.focus();return;}}
  box?.focus();
}
function makeMailto(email:string,data:Inquiry,brief:string):{href:string;shortened:boolean} {
  const prefix=`mailto:${email}?subject=${encodeURIComponent(`AERLOR project inquiry — ${data.company}`)}&body=`;let body=brief;let shortened=false;
  while(prefix.length+encodeURIComponent(body).length>1900){body=body.slice(0,Math.max(0,body.length-120));shortened=true;}
  if(shortened){body+='\n\n[Brief shortened for email compatibility. Please attach the complete downloaded project brief.]';while(prefix.length+encodeURIComponent(body).length>2200)body=body.slice(0,-80);}
  return {href:prefix+encodeURIComponent(body),shortened};
}
const projectForm=$<HTMLFormElement>('#project-form');let inquiryId:string|null=null;let inquiryFingerprint='';
projectForm?.addEventListener('input',event=>{const field=event.target;if(field instanceof HTMLElement){field.removeAttribute('aria-invalid');field.removeAttribute('aria-describedby');}const status=$('#project-status'),error=$('#project-error'),delivery=$('#project-delivery');if(status)status.textContent='';if(error)error.textContent='';if(delivery)delivery.hidden=true;});
projectForm?.addEventListener('submit',async event=>{
  event.preventDefault();const submit=$<HTMLButtonElement>('[data-project-submit]');const error=$('#project-error'),status=$('#project-status');if(error)error.textContent='';
  try{
    const data=inquiryData(projectForm);const brief=buildProjectBrief(data,items,products);await runtimeReady;
    if(!runtime.inquiryEnabled){
      if(runtime.contactEmail){const email=$<HTMLAnchorElement>('#email-project');const draft=makeMailto(runtime.contactEmail,data,brief);if(email)email.href=draft.href;const delivery=$('#project-delivery');if(delivery)delivery.hidden=false;if(status)status.textContent=draft.shortened?'Your brief is ready. Save a complete copy, then attach it to the email draft. Nothing has been sent.':'Your brief is ready. Open the email draft below, review it and send it from your email app. Nothing has been sent yet.';}
      else{downloadText('AERLOR-property-project-brief.txt',brief);if(status)status.textContent='Your full brief has been prepared for download. Direct inquiry delivery is not connected on this preview. Nothing has been sent.';}
      return;
    }
    if(!inquiryToken)throw new Error('Please complete the verification before sending your inquiry.');
    const fingerprint=JSON.stringify({data,items});if(fingerprint!==inquiryFingerprint){inquiryFingerprint=fingerprint;inquiryId=crypto.randomUUID();}
    if(submit)submit.disabled=true;
    const result=await jsonRequest('/api/inquiry',{...data,items,website:(new FormData(projectForm).get('website')??''),verificationToken:inquiryToken,requestId:inquiryId});
    if(result.accepted!==true||typeof result.reference!=='string')throw new Error('Delivery was not confirmed. Please retry or use the email contact.');
    if(status)status.textContent=`Your inquiry was accepted for delivery. Reference ${result.reference}. This is not an order or a sample reservation.`;
    inquiryToken='';if(inquiryWidget)window.turnstile?.reset(inquiryWidget);
  }catch(err){showFormError(err,projectForm);if(runtime.inquiryEnabled&&inquiryWidget){inquiryToken='';window.turnstile?.reset(inquiryWidget);}}
  finally{if(submit)submit.disabled=false;}
});
$('[data-save-brief]')?.addEventListener('click',()=>{if(!projectForm)return;try{const data=inquiryData(projectForm);downloadText('AERLOR-property-project-brief.txt',buildProjectBrief(data,items,products));const status=$('#project-status');if(status)status.textContent='Your complete project brief has been prepared for download. Nothing was sent.';}catch(error){showFormError(error,projectForm);}});

let checkoutToken='';let checkoutWidget:string|null=null;let checkoutWidgetStarted=false;let checkoutId:string|null=null;let checkoutFingerprint='';
function purchaseEligible():boolean {
  return runtime.checkoutEnabled&&items.length>0&&items.every(item=>runtime.prices.some(p=>p.id===item.id&&p.finish===item.finish&&item.quantity<=(p.maxQuantity??0)))&&summarizeCart(items,runtime.prices).fullyPriced;
}
function renderCheckout():void {
  const container=$('#checkout-lines');if(!container)return;
  container.replaceChildren(...items.map(item=>cartLine(item,false)));
  const readiness=$('#checkout-readiness'),button=$<HTMLButtonElement>('#checkout-button'),consent=$<HTMLInputElement>('#checkout-consent');
  const ready=purchaseEligible();
  if(readiness){readiness.classList.toggle('ready',ready);readiness.textContent=items.length===0?'Your bag is empty. Choose a product before reviewing a purchase.':ready?`${runtime.mode==='test'?'Test checkout is available for this selection. No live payment will be created.':'Your selection is eligible for secure checkout. Shipping and applicable tax are confirmed by the payment provider before payment.'}`:'Purchasing is not open for this selection. The collection is in development, and unapproved or unpriced products cannot be charged. Your selection can be used for a written project proposal.';}
  if(button)button.disabled=!ready||!consent?.checked||!checkoutToken;
  if(ready&&!checkoutWidgetStarted){checkoutWidgetStarted=true;const target=$('#checkout-verification');if(target)void verificationWidget(target,'checkout',token=>{checkoutToken=token;renderCheckout();}).then(id=>{checkoutWidget=id;}).catch(err=>{const error=$('#checkout-error');if(error)error.textContent=err instanceof Error?err.message:'Verification is unavailable.';});}
}
$('#checkout-consent')?.addEventListener('change',renderCheckout);
$('#checkout-button')?.addEventListener('click',async()=>{
  const button=$<HTMLButtonElement>('#checkout-button'),error=$('#checkout-error');if(error)error.textContent='';
  if(!purchaseEligible()||!$<HTMLInputElement>('#checkout-consent')?.checked||!checkoutToken)return;
  try{
    if(button)button.disabled=true;
    const fingerprint=JSON.stringify(items);if(fingerprint!==checkoutFingerprint){checkoutFingerprint=fingerprint;checkoutId=crypto.randomUUID();}
    const result=await jsonRequest('/api/checkout',{items,consent:true,requestId:checkoutId,verificationToken:checkoutToken});
    if(typeof result.url!=='string')throw new Error('Secure checkout could not be opened.');
    const target=new URL(result.url);if(target.protocol!=='https:'||target.hostname!=='checkout.stripe.com'||target.username||target.password)throw new Error('The checkout destination could not be verified.');
    location.assign(target.href);
  }catch(err){if(error)error.textContent=err instanceof Error?err.message:'Checkout could not be opened. Your bag is unchanged.';checkoutToken='';if(checkoutWidget)window.turnstile?.reset(checkoutWidget);renderCheckout();}
});
async function orderStatus():Promise<void>{
  const target=$('#order-result');if(!target)return;const params=new URLSearchParams(location.search);
  if(params.get('cancelled')==='1'){target.textContent='Checkout was cancelled. No payment is confirmed by this page. Your project selection is still available in your bag.';target.className='order-warning';return;}
  const session=params.get('session_id');
  if(!session||!/^cs_(test_|live_)?[A-Za-z0-9]{12,220}$/.test(session)){target.textContent='There is no valid checkout reference to verify. A completed payment is never inferred from a page visit.';return;}
  try{const result=await jsonRequest('/api/order?session_id='+encodeURIComponent(session));if(result.paymentStatus==='paid'&&result.verified===true){target.textContent='Payment confirmed by the provider. Order processing follows the verified payment event. This is not a shipping confirmation. Keep the payment provider’s receipt for your reference.';target.className='order-paid';}else if(result.paymentStatus==='unpaid'||result.paymentStatus==='processing'){target.textContent='Payment is not yet confirmed. Some payment methods take time to settle. Please use the payment provider’s receipt or contact the team before attempting another payment.';target.className='order-warning';}else{target.textContent='The payment reference could not be confirmed as a completed order. Contact the team before attempting another payment.';}}
  catch{target.textContent='Payment verification is temporarily unavailable. This does not indicate that a charge failed. Please check your provider receipt or contact the team before paying again.';}
}
updateCounts();renderCart();renderCheckout();void orderStatus();
