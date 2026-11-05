type GalleryView='product'|'outlet'|'controls'|'intake'|'in-use';
const root=document.querySelector<HTMLElement>('[data-retail-root]');
if(root){
 const stage=root.querySelector<HTMLElement>('[data-retail-stage]');
 const image=root.querySelector<HTMLImageElement>('[data-gallery-image]');
 const caption=document.getElementById('gallery-caption');
 const counter=root.querySelector<HTMLElement>('[data-retail-counter]');
 const finishLabel=root.querySelector<HTMLOutputElement>('[data-retail-finish-label]');
 const selected=root.querySelector<HTMLSelectElement>('[data-product-finish]');
 const quantity=root.querySelector<HTMLInputElement>('[data-product-quantity]');
 const thumbnails=[...root.querySelectorAll<HTMLButtonElement>('[data-retail-view]')];
 const swatches=[...root.querySelectorAll<HTMLButtonElement>('[data-retail-swatch]')];
 const dialog=document.querySelector<HTMLDialogElement>('[data-retail-dialog]');
 const dialogImage=dialog?.querySelector<HTMLImageElement>('[data-retail-dialog-image]');
 const dialogCaption=dialog?.querySelector<HTMLElement>('[data-retail-dialog-caption]');
 const zoom=root.querySelector<HTMLButtonElement>('[data-retail-zoom]');
 const sources:Record<string,string>={
  'Porcelain White':'retail/product-porcelain.png',
  'Stone':'retail/product-stone.png',
  'Graphite':'retail/product-graphite.png',
  'Champagne':'studio/dryer-signature-champagne.webp'
 };
 const gallery:{view:GalleryView;src:string;caption:string;alt:string}[]=[
  {view:'product',src:sources['Porcelain White'],caption:'Porcelain White · preproduction product visualization',alt:'AERLOR Premium hairdryer, porcelain-white product concept'},
  {view:'outlet',src:'retail/macro-outlet.png',caption:'The circular outlet · original detail study',alt:'Close-up concept study of the distinctive round metal outlet'},
  {view:'controls',src:'retail/macro-controls.png',caption:'The controls · original detail study',alt:'Close-up of the proposed tactile controls and slim handle'},
  {view:'intake',src:'retail/macro-intake.png',caption:'The intake · original detail study',alt:'Independent product study of the textured handle intake'},
  {view:'in-use',src:'retail/ritual-model.jpg',caption:'The daily ritual · lifestyle visualization',alt:'Woman using the proposed AERLOR white dryer in a bright bathroom'}
 ];
 const thumbSources:Record<string,string>={
  'Porcelain White':'retail/thumb-porcelain.jpg',
  'Stone':'retail/thumb-stone.jpg',
  'Graphite':'retail/thumb-graphite.jpg',
  'Champagne':'studio/dryer-signature-champagne.webp'
 };
 const productThumbnail=root.querySelector<HTMLImageElement>('[data-retail-view="product"] img');
 const route=(src:string)=>`${import.meta.env.BASE_URL}images/${src}`;
 const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
 let current:GalleryView='product';
 let selectedFinish=selected?.value||'Porcelain White';
 const currentItem=()=>gallery.find(v=>v.view===current)??gallery[0];
 function setView(view:GalleryView):void{
  const item=gallery.find(v=>v.view===view);
  if(!item||!image||!stage)return;
  current=view;
  const path=view==='product'?sources[selectedFinish]??sources['Porcelain White']:item.src;
  const nextCaption=view==='product'?`${selectedFinish} · preproduction product visualization`:item.caption;
  const nextAlt=view==='product'?`AERLOR Premium hairdryer in ${selectedFinish}, preproduction design visualization`:item.alt;
  stage.dataset.media=view;
  if(image.getAttribute('src')!==route(path)){
   if(!reducedMotion.matches)stage.classList.add('is-switching');
   image.src=route(path);
  }
  image.alt=nextAlt;
  if(caption)caption.textContent=nextCaption;
  if(counter)counter.textContent=`${String(gallery.indexOf(item)+1).padStart(2,'0')} / ${String(gallery.length).padStart(2,'0')}`;
  thumbnails.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.retailView===view)));
  if(dialogImage)dialogImage.src=route(path);
  if(dialogImage)dialogImage.alt=nextAlt;
  if(dialogCaption)dialogCaption.textContent=nextCaption;
 }
 image?.addEventListener('load',()=>stage?.classList.remove('is-switching'));
 image?.addEventListener('error',()=>stage?.classList.remove('is-switching'));
 function chooseFinish(name:string,dispatch=true):void{
  if(!sources[name]||!selected||![...selected.options].some(opt=>opt.value===name))return;
  selectedFinish=name;selected.value=name;
  if(productThumbnail)productThumbnail.src=route(thumbSources[name]??sources[name]);
  if(finishLabel)finishLabel.textContent=name;
  swatches.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.retailSwatch===name)));
  if(dispatch)selected.dispatchEvent(new Event('change',{bubbles:true}));
  setView('product');
 }
 thumbnails.forEach(button=>button.addEventListener('click',()=>setView(button.dataset.retailView as GalleryView)));
 swatches.forEach(button=>button.addEventListener('click',()=>chooseFinish(button.dataset.retailSwatch??'')));
 selected?.addEventListener('change',()=>{selectedFinish=selected.value;chooseFinish(selectedFinish,false);queueMicrotask(()=>setView('product'));});
 root.querySelectorAll<HTMLButtonElement>('[data-retail-step]').forEach(button=>button.addEventListener('click',()=>{
  const next=(gallery.findIndex(v=>v.view===current)+(button.dataset.retailStep==='-1'?-1:1)+gallery.length)%gallery.length;
  setView(gallery[next].view);
 }));
 root.querySelector('.retail-thumbnails')?.addEventListener('keydown',event=>{
  if(!(event instanceof KeyboardEvent)||!['ArrowLeft','ArrowRight'].includes(event.key))return;
  const active=document.activeElement as HTMLElement|null;
  if(!active?.matches('[data-retail-view]'))return;
  event.preventDefault();
  const next=(thumbnails.indexOf(active as HTMLButtonElement)+(event.key==='ArrowRight'?1:-1)+thumbnails.length)%thumbnails.length;
  thumbnails[next].focus();setView(thumbnails[next].dataset.retailView as GalleryView);
 });
 root.querySelectorAll<HTMLButtonElement>('[data-retail-select-finish]').forEach(button=>button.addEventListener('click',()=>{
  chooseFinish(button.dataset.retailSelectFinish??'');
  root.scrollIntoView({behavior:reducedMotion.matches?'auto':'smooth',block:'start'});
 }));
 root.querySelectorAll<HTMLButtonElement>('[data-retail-qty]').forEach(button=>button.addEventListener('click',()=>{
  if(!quantity)return;
  const currentValue=Number.isFinite(quantity.valueAsNumber)?quantity.valueAsNumber:1;
  const next=Math.min(5000,Math.max(1,currentValue+(button.dataset.retailQty==='-1'?-1:1)));
  quantity.value=String(next);quantity.dispatchEvent(new Event('change',{bubbles:true}));
 }));
 zoom?.addEventListener('click',()=>{if(!dialog||!dialogImage)return;const item=currentItem();const src=current==='product'?sources[selectedFinish]:item.src;dialogImage.src=route(src);dialogImage.alt=image?.alt??item.alt;if(dialogCaption)dialogCaption.textContent=caption?.textContent??item.caption;dialog.showModal();dialog.querySelector<HTMLButtonElement>('[data-retail-dialog-close]')?.focus();});
 dialog?.querySelector<HTMLButtonElement>('[data-retail-dialog-close]')?.addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('close',()=>zoom?.focus());
 dialog?.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
}
