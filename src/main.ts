import type {ProductFinish,StudioController} from './studio-models';

// The product image is the default experience. The optional 3D module loads only on request.
const base=import.meta.env.BASE_URL;
const stage=document.querySelector<HTMLElement>('#product-stage');
const host=document.querySelector<HTMLElement>('#scene-canvas');
const fallback=document.querySelector<HTMLImageElement>('.hero-fallback');
const launch=document.querySelector<HTMLButtonElement>('#view-3d');
const status=document.querySelector<HTMLElement>('#viewer-status');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let finish:ProductFinish='graphite';
let controller:StudioController|undefined;
let active=false;
let loading=false;
let angleX=0,angleY=0;
const finishLabel=(value:ProductFinish)=>value.charAt(0).toUpperCase()+value.slice(1);
function announce(message:string):void{if(status)status.textContent=message;}
function resetView():void{
 active=false;stage?.classList.remove('scene-ready');
 if(stage&&stage.dataset.scene!=='fallback')stage.dataset.scene='static';
 if(launch){launch.textContent='Inspect in 3D ↻';launch.setAttribute('aria-pressed','false');}
 if(host){host.removeAttribute('tabindex');host.removeAttribute('role');host.setAttribute('aria-hidden','true');}
 angleX=0;angleY=0;controller?.setAngle(0,0);
}
function showView():void{
 active=true;stage?.classList.add('scene-ready');if(stage)stage.dataset.scene='ready';
 if(launch){launch.textContent='Close 3D view ×';launch.setAttribute('aria-pressed','true');}
 if(host){host.tabIndex=0;host.setAttribute('role','img');host.removeAttribute('aria-hidden');host.setAttribute('aria-label',`Interactive ${finishLabel(finish)} early hairdryer geometry study. Use arrow keys to change the viewing angle; Escape returns to the product image.`);}
 controller?.setFinish(finish);controller?.render();
 announce('3D geometry study is ready. Use the arrow keys or move the pointer to inspect the design. Escape returns to the product image.');
}
launch?.setAttribute('aria-pressed','false');
launch?.addEventListener('click',async()=>{
 if(!stage||!host||loading)return;
 if(active){resetView();announce('Product image restored.');return;}
 if(controller){showView();return;}
 loading=true;launch.disabled=true;launch.textContent='Loading 3D…';announce('Loading the optional product view.');
 try{
  const {createStudio}=await import('./studio-models');
  controller=createStudio(host,'dryer',finish,'hero');
  controller.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();stage.dataset.scene='fallback';resetView();controller?.dispose();controller=undefined;announce('The 3D view is unavailable. The product image is still available.');},{once:true});
  showView();
 }catch{
  controller?.dispose();controller=undefined;stage.dataset.scene='fallback';resetView();
  announce('The 3D view could not load. You can still explore every product using the original images.');
 }finally{loading=false;launch.disabled=false;}
});
for(const button of document.querySelectorAll<HTMLButtonElement>('[data-finish]'))button.addEventListener('click',()=>{
 const value=button.dataset.finish;if(!['graphite','champagne','pearl'].includes(value??''))return;
 finish=value as ProductFinish;
 document.querySelectorAll('[data-finish]').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));
 const label=finishLabel(finish);const range=finish==='pearl'?'Lite':'Premium';
 const productName=document.querySelector('#hero-product-name');if(productName)productName.textContent=`Hairdryer ${range}`;
 const productLink=document.querySelector<HTMLAnchorElement>('#hero-product-link');if(productLink)productLink.href=`${base}products/hairdryer-${range.toLowerCase()}/`;
 const name=document.querySelector('#finish-name');if(name)name.textContent=label;
 if(fallback){fallback.src=`${base}images/studio/dryer-${finish}-hero.webp`;fallback.alt=`Early AERLOR hairdryer geometry study in ${label}`;}
 stage?.setAttribute('aria-label',`Early AERLOR hairdryer geometry study in ${label.toLowerCase()}`);
 controller?.setFinish(finish);
 if(host&&active)host.setAttribute('aria-label',`Interactive ${label} hairdryer design study. Use arrow keys to change the viewing angle; Escape returns to the product image.`);
});
host?.addEventListener('pointermove',event=>{
 if(!active||reducedMotion.matches||event.pointerType==='touch')return;
 const box=host.getBoundingClientRect();controller?.setAngle((event.clientX-box.left)/box.width-.5,(event.clientY-box.top)/box.height-.5);
});
host?.addEventListener('pointerleave',()=>{if(active&&!reducedMotion.matches)controller?.setAngle(0,0);});
host?.addEventListener('keydown',event=>{
 if(!active)return;
 if(event.key==='Escape'){event.preventDefault();resetView();launch?.focus();return;}
 if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;
 event.preventDefault();
 if(event.key==='Home'){angleX=0;angleY=0;}else{angleX=Math.max(-1,Math.min(1,angleX+(event.key==='ArrowRight'?.2:event.key==='ArrowLeft'?-.2:0)));angleY=Math.max(-1,Math.min(1,angleY+(event.key==='ArrowDown'?.2:event.key==='ArrowUp'?-.2:0)));}
 controller?.setAngle(angleX,angleY);
});
reducedMotion.addEventListener('change',()=>{angleX=0;angleY=0;controller?.setAngle(0,0);});
window.addEventListener('pagehide',event=>{if(!event.persisted){controller?.dispose();controller=undefined;}});
