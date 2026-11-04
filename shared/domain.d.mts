export interface ProductDefinition {id:string;name:string;code:string;finishes:string[];[key:string]:unknown}
export interface CartItem {id:string;finish:string;quantity:number}
export interface PublicPrice {id:string;finish:string;currency:string;unitAmount:number;maxQuantity?:number}
export interface Inquiry {name:string;email:string;company:string;country:string;rooms:number;role:string;timing:string;collections:string[];message:string;consent:boolean}
export class ValidationError extends Error {field:string;constructor(message:string,field?:string)}
export const CART_VERSION:number;
export const MAX_LINE_QUANTITY:number;
export const MAX_CART_LINES:number;
export const COUNTRIES:string[];
export const ROLES:string[];
export const TIMINGS:string[];
export const COLLECTIONS:string[];
export function cleanText(value:unknown,max?:number):string;
export function validEmail(value:unknown):boolean;
export function validateCart(value:unknown,products:ProductDefinition[],options?:{allowEmpty?:boolean}):CartItem[];
export function readStoredCart(value:unknown,products:ProductDefinition[]):CartItem[];
export function calculateInvestment(input:{rooms:number;cost:number;years:number;occupancy:number}):{total:number;perOccupiedNight:number};
export function summarizeCart(items:CartItem[],prices?:PublicPrice[]):{units:number;subtotal:number|null;currency:string|null;fullyPriced:boolean};
export function validateInquiry(raw:unknown):Inquiry;
export function buildProjectBrief(data:Inquiry,items:CartItem[],products:ProductDefinition[]):string;
export function formatMoney(cents:number,currency?:string):string;
