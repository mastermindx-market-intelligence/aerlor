/** Pure rules shared by the storefront, server and tests. No network or persistence. */
export const CART_VERSION = 1;
export const MAX_LINE_QUANTITY = 5000;
export const MAX_CART_LINES = 30;
export const COUNTRIES = ['CA','US','GB','EU','AE','OTHER'];
export const ROLES = ['Owner / asset manager','General manager / operations','Procurement','Designer / specifier','Distributor / partner','Other'];
export const TIMINGS = ['Exploring options','Next 3 months','3–6 months','6–12 months','More than 12 months'];
export const COLLECTIONS = ['Hairdryers','Mirrors','Curlers'];
export class ValidationError extends Error {
  constructor(message, field = '') { super(message); this.name='ValidationError'; this.field=field; }
}
export function cleanText(value, max=100) {
  if(typeof value!=='string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').trim().slice(0,max);
}
export function validEmail(value) {
  return typeof value==='string' && value.length<=200 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]{2,}$/.test(value) && !/[\r\n]/.test(value);
}
export function validateCart(value, products, {allowEmpty=false}={}) {
  if(!Array.isArray(value)||value.length>MAX_CART_LINES)throw new ValidationError('Choose a valid product selection.','items');
  if(!allowEmpty&&value.length===0)throw new ValidationError('Your project bag is empty.','items');
  const result=[];const positions=new Map();
  for(const raw of value){
    if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new ValidationError('A product selection is invalid.','items');
    const product=products.find(p=>p.id===raw.id);
    if(!product)throw new ValidationError('A selected product is not in this collection.','items');
    if(typeof raw.finish!=='string'||!product.finishes.includes(raw.finish))throw new ValidationError('Choose an available finish direction.','finish');
    if(!Number.isSafeInteger(raw.quantity)||raw.quantity<1||raw.quantity>MAX_LINE_QUANTITY)throw new ValidationError(`Quantities must be whole numbers from 1 to ${MAX_LINE_QUANTITY}.`,'quantity');
    const key=product.id+'|'+raw.finish;
    if(positions.has(key)){
      const item=result[positions.get(key)];item.quantity+=raw.quantity;
      if(item.quantity>MAX_LINE_QUANTITY)throw new ValidationError('The combined quantity is too large.','quantity');
    }else{positions.set(key,result.length);result.push({id:product.id,finish:raw.finish,quantity:raw.quantity});}
  }
  return result.sort((a,b)=>(a.id+'|'+a.finish).localeCompare(b.id+'|'+b.finish));
}
export function readStoredCart(value, products) {
  try {
    if(typeof value!=='string'||value.length>24000)return [];
    const parsed=JSON.parse(value);
    if(parsed?.version!==CART_VERSION)return [];
    return validateCart(parsed.items,products,{allowEmpty:true});
  } catch{return [];}
}
export function calculateInvestment({rooms,cost,years,occupancy}) {
  if(!Number.isSafeInteger(rooms)||rooms<1||rooms>100000)throw new ValidationError('Enter a whole room count from 1 to 100,000.','rooms');
  if(!Number.isFinite(cost)||cost<=0||cost>100000)throw new ValidationError('Enter a per-room equipment budget above zero, up to 100,000.','cost');
  if(!Number.isSafeInteger(years)||years<1||years>20)throw new ValidationError('Choose a planning life from 1 to 20 whole years.','years');
  if(!Number.isFinite(occupancy)||occupancy<1||occupancy>100)throw new ValidationError('Enter occupancy from 1% to 100%.','occupancy');
  return {total:rooms*cost,perOccupiedNight:cost/(365*years*(occupancy/100))};
}
export function summarizeCart(items, prices=[]) {
  let units=0,subtotal=0,currency=null,fullyPriced=items.length>0;
  for(const item of items){
    units+=item.quantity;
    const price=prices.find(p=>p.id===item.id&&p.finish===item.finish);
    if(!price||!Number.isSafeInteger(price.unitAmount)||price.unitAmount<=0||typeof price.currency!=='string'){fullyPriced=false;continue;}
    if(currency!==null&&currency!==price.currency){fullyPriced=false;continue;}
    currency=price.currency;subtotal+=price.unitAmount*item.quantity;
    if(!Number.isSafeInteger(subtotal))throw new ValidationError('The selection exceeds the supported amount.');
  }
  return {units,subtotal:fullyPriced?subtotal:null,currency:fullyPriced?currency:null,fullyPriced};
}
export function validateInquiry(raw) {
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new ValidationError('Complete the project form.');
  const data={name:cleanText(raw.name,100),email:cleanText(raw.email,200),company:cleanText(raw.company,160),country:cleanText(raw.country,8),rooms:Number(raw.rooms),role:cleanText(raw.role,80),timing:cleanText(raw.timing,80),collections:Array.isArray(raw.collections)?raw.collections.filter(v=>COLLECTIONS.includes(v)):[],message:cleanText(raw.message,3000),consent:raw.consent===true};
  if(!data.name||/[\r\n]/.test(data.name))throw new ValidationError('Please enter your name.','name');
  if(!validEmail(data.email))throw new ValidationError('Please enter a valid work email.','email');
  if(!data.company)throw new ValidationError('Please enter your hotel, group or studio.','company');
  if(!COUNTRIES.includes(data.country))throw new ValidationError('Choose the destination market.','country');
  if(!Number.isSafeInteger(data.rooms)||data.rooms<1||data.rooms>100000)throw new ValidationError('Enter a whole room count from 1 to 100,000.','rooms');
  if(!ROLES.includes(data.role))throw new ValidationError('Choose your role.','role');
  if(!TIMINGS.includes(data.timing))throw new ValidationError('Choose your project timing.','timing');
  if(!data.consent)throw new ValidationError('Please confirm that you agree to share your project inquiry.','consent');
  return data;
}
export function buildProjectBrief(data, items, products) {
  const lines=['AERLOR / PROPERTY PROJECT BRIEF','Prepared on your device. Not an order or binding quote.','',`Name: ${data.name}`,`Email: ${data.email}`,`Hotel / group / studio: ${data.company}`,`Destination market: ${data.country}`,`Rooms: ${data.rooms}`,`Role: ${data.role}`,`Timing: ${data.timing}`,`Collections: ${data.collections.join(', ')||'To discuss'}`,'','PRODUCT SELECTION'];
  if(items.length===0)lines.push('No products selected yet.');
  for(const item of items){const p=products.find(p=>p.id===item.id);lines.push(`${item.quantity} x ${p?.name||item.id} / ${item.finish} (${p?.code||item.id})`);}
  lines.push('','PROJECT NOTES',data.message||'To discuss.','','Please confirm exact-model specifications, market approvals, written pricing, tax, freight, availability and service terms before any order.','Preparing this brief does not send it. Review and send it using the delivery option you choose.');
  return lines.join('\n');
}
export function formatMoney(cents,currency='USD') {
  if(!Number.isSafeInteger(cents)||cents<0)return 'Price on request';
  try{return new Intl.NumberFormat('en',{style:'currency',currency,currencyDisplay:'code'}).format(cents/100);}catch{return 'Price on request';}
}
