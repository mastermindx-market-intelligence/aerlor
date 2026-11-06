import {e,url,subnav,crumb} from './r4/ui.mjs';

const retailImages={
 'Porcelain White':'retail/product-porcelain.png',
 'Stone':'retail/product-stone.png',
 'Graphite':'retail/product-graphite.png',
 'Champagne':'studio/dryer-signature-champagne.webp'
};
const img=(src,alt,extra='')=>`<img src="${url('images/'+src)}" alt="${e(alt)}" ${extra}>`;
const views=[
 {key:'product',thumbnail:'retail/thumb-porcelain.jpg',label:'Product',src:retailImages['Porcelain White'],alt:'AERLOR Premium hairdryer, porcelain-white design study',caption:'Porcelain White · preproduction product visualization'},
 {key:'outlet',thumbnail:'retail/thumb-outlet.jpg',label:'Outlet detail',src:'retail/macro-outlet.png',alt:'Independent macro design study of the circular outlet and brushed-metal finish',caption:'The circular outlet · original detail study'},
 {key:'controls',thumbnail:'retail/thumb-controls.jpg',label:'Controls detail',src:'retail/macro-controls.png',alt:'Independent macro study of the AERLOR hairdryer control and slim handle',caption:'The controls · original detail study'},
 {key:'intake',thumbnail:'retail/thumb-intake.jpg',label:'Intake detail',src:'retail/macro-intake.png',alt:'Independent macro study of the hairdryer handle intake surface',caption:'The intake · original detail study'},
 {key:'in-use',label:'In use',src:'retail/ritual-model.jpg',alt:'Lifestyle visualization of a woman using a white AERLOR hairdryer in a bright modern bathroom',caption:'The daily ritual · lifestyle visualization'}
];
const finishes=[
 {name:'Porcelain White',tone:'#F3F4F5'},
 {name:'Stone',tone:'#BFB5A8'},
 {name:'Graphite',tone:'#42474D'},
 {name:'Champagne',tone:'#BFA898'}
];
const detail=(src,title,num,caption)=>`<article class="retail-detail-card">
 <div class="retail-detail-photo">${img(src,caption,'width="928" height="1120" loading="lazy"')}</div>
 <div class="retail-detail-caption"><span>${num} / MATERIAL STUDY</span><h3>${title}</h3></div>
</article>`;

export function retailPremiumPage(p,studyMarkup=''){
 const active=p.finish in retailImages?p.finish:'Porcelain White';
 const first=views[0];
 const thumbnails=views.map((v,i)=>`<button type="button" class="retail-thumb" data-retail-view="${v.key}" aria-label="${v.label} view" aria-pressed="${i===0?'true':'false'}" title="${v.label}">
 ${img(v.thumbnail??v.src,'','width="100" height="116" loading="lazy"')}<span>${v.label}</span></button>`).join('');
 const swatches=finishes.filter(f=>p.finishes.includes(f.name)).map(f=>`<button class="retail-swatch" type="button" data-retail-swatch="${e(f.name)}" aria-label="${e(f.name)} finish" aria-pressed="${f.name===active?'true':'false'}" title="${e(f.name)}"><span style="background:${f.tone}"></span></button>`).join('');
 const options=p.finishes.map(f=>`<option value="${e(f)}" ${f===active?'selected':''}>${e(f)}</option>`).join('');
 const specRows=p.specs.map(([key,value,status])=>`<tr><th scope="row">${e(key)}</th><td>${e(value)}</td><td><span class="spec-status ${e(status)}">${e(status)}</span></td></tr>`).join('');
 return `<link rel="stylesheet" href="/src/r8-retail.css">
 ${subnav(p.name,[['Overview','#product-overview'],['Design','#design-details'],['Technology','#technology'],['Finishes','#finishes'],['Specifications','#specifications']])}
 ${crumb(p.name)}
 <section class="retail-pdp" id="product-overview" data-product-page="${e(p.id)}" data-retail-root>
  <div class="retail-gallery">
   <div class="retail-stage" data-retail-stage>
    <div class="retail-gallery-eyebrow"><span class="retail-indicator"></span> THE OBJECT / 001</div>
    ${img(retailImages[active],first.alt,'class="retail-stage-image" data-gallery-image width="928" height="1120" fetchpriority="high"')}
    <button type="button" class="retail-zoom" data-retail-zoom aria-label="Explore in detail — View larger product image">Explore in detail <span aria-hidden="true">↗</span></button>
    <span class="retail-gallery-counter" data-retail-counter>01 / 05</span>
   </div>
   <div class="retail-thumbnails" role="group" aria-label="Product gallery">${thumbnails}</div>
   <div class="retail-gallery-footer"><p id="gallery-caption" role="status">${e(first.caption)}</p><div class="retail-gallery-arrows"><button type="button" data-retail-step="-1" aria-label="Previous product image">←</button><button type="button" data-retail-step="1" aria-label="Next product image">→</button></div></div>
  </div>
  <div class="retail-purchase">
   <p class="retail-eyebrow">AERLOR / HAIRCARE <span>EDITION 01</span></p>
   <h1>${e(p.name)}<span class="retail-heading-stop">.</span></h1>
   <p class="retail-lead">Everything you need. Nothing you don't.</p>
   <p class="retail-description">A compact silhouette, a considered finish, and a place in your daily ritual.</p>
   <div class="retail-price"><div><span class="retail-price-value" data-price="${e(p.id)}">$329 <small>USD*</small></span><p>Indicative retail concept. Not currently for sale.</p></div><span class="retail-status"><span></span> In development</span></div>
   <div class="retail-selection"><div class="retail-choice-header"><h2>Choose your finish</h2><output data-retail-finish-label>${e(active)}</output></div>
    <div class="retail-swatches" role="group" aria-label="Choose a product finish">${swatches}</div>
    <select class="retail-sr-only" data-product-finish aria-hidden="true" tabindex="-1" aria-label="Selected finish">${options}</select>
    <p class="retail-selection-hint">Concept colorways. Final finishes may change.</p>
   </div>
   <div class="retail-quantity-line"><label for="retail-quantity">Quantity</label><div class="retail-quantity-control"><button type="button" data-retail-qty="-1" aria-label="Decrease quantity">−</button><input id="retail-quantity" type="number" data-product-quantity min="1" max="5000" step="1" inputmode="numeric" value="1"><button type="button" data-retail-qty="1" aria-label="Increase quantity">+</button></div></div>
   <button type="button" class="retail-add" data-add="${e(p.id)}"><span>Add to your project</span><span aria-hidden="true">↗</span></button>
   <p class="retail-cta-note">Saves your selection only. No order or payment is created.</p>
   <div class="retail-buy-links"><a href="${url('contact/')}">Ask about availability <span aria-hidden="true">↗</span></a><a href="#specifications">Explore specifications <span aria-hidden="true">↗</span></a></div>
   <a class="retail-business-link" href="${url('hospitality/wholesale/')}"><span>For hotels, salons &amp; professionals</span><strong>Request a quote <span aria-hidden="true">↗</span></strong></a>
  </div>
 </section>
 <dialog class="retail-lightbox" data-retail-dialog aria-label="Enlarged product image"><button type="button" class="retail-lightbox-close" data-retail-dialog-close aria-label="Close enlarged image">✕</button>${img(retailImages[active],first.alt,'data-retail-dialog-image width="928" height="1120"')}<p data-retail-dialog-caption>${e(first.caption)}</p></dialog>

 <section class="retail-ritual" id="design-details" aria-labelledby="retail-ritual-title">
  ${img('retail/ritual-model.jpg','Lifestyle concept of a woman styling her hair with the porcelain-white AERLOR dryer','class="retail-ritual-image" width="1360" height="768" loading="lazy"')}
  <div class="retail-ritual-content"><p class="retail-eyebrow">02 / THE RITUAL</p><h2 id="retail-ritual-title">A better kind<br>of everyday.</h2><p>Good design doesn't ask for attention.<br>It makes the familiar feel exceptional.</p><a href="#technology">See the design <span aria-hidden="true">↘</span></a></div>
  <span class="retail-visual-note">Lifestyle visualization · design concept</span>
 </section>

 <section class="retail-technology" id="technology" aria-labelledby="retail-tech-title">
  <div class="retail-tech-intro"><div><p class="retail-eyebrow">03 / DETAILS IN FOCUS</p><h2 id="retail-tech-title">Precision,<br>made visible.</h2></div><p>Beautiful from across the room.<br>Even more compelling up close.</p></div>
  <article class="retail-tech-feature"><div class="retail-tech-photo">${img('retail/macro-outlet.png','New optical macro study of the circular brushed-metal outlet','width="928" height="1120" loading="lazy"')}</div><div class="retail-tech-copy"><span>01 / THE SIGNATURE</span><h3>An unmistakable circle.</h3><p>A clean, sculptural exterior with carefully considered material contrast.</p><small>Original visual design study</small></div></article>
  <div class="retail-tech-duo">
   ${detail('retail/macro-controls.png','Designed to feel considered.','02','Close-up concept study of the control interface and smooth slim grip')}
   ${detail('retail/macro-intake.png','Thoughtful from every angle.','03','Original close-up concept study of the textured handle intake')}
  </div>
  <p class="retail-tech-disclaimer">Optical and mechanical imagery illustrates a proposed design, not verified production engineering or performance.</p>
 </section>

 <section class="retail-finishes" id="finishes" aria-labelledby="retail-finishes-title">
  <div class="retail-section-head"><div><p class="retail-eyebrow">04 / EXPRESS YOUR STYLE</p><h2 id="retail-finishes-title">The right finish<br>for your space.</h2></div><p>One considered silhouette, explored in three distinctly different expressions.</p></div>
  <div class="retail-finish-grid">
   ${['Porcelain White','Stone','Graphite'].map((f,i)=>`<button type="button" class="retail-finish-card" data-retail-select-finish="${f}"><span class="retail-finish-media">${img(retailImages[f],`${f} AERLOR Premium hairdryer product concept`,'width="928" height="1120" loading="lazy"')}</span><span class="retail-finish-meta"><strong>${f}</strong><span>0${i+1} / 03</span></span></button>`).join('')}
  </div>
  <p class="retail-finishes-note">Colors and proportions are preproduction design studies. Final released options will be confirmed.</p>
 </section>

 ${studyMarkup}

 <section class="retail-information" id="specifications" aria-labelledby="retail-spec-title">
  <div class="retail-info-intro"><p class="retail-eyebrow">05 / PRODUCT INFORMATION</p><h2 id="retail-spec-title">Every detail,<br>considered.</h2><p>See what is defined, what is proposed, and what needs independent validation before release.</p><div class="product-utility"><a href="${url('documents/'+p.document)}" download>Download product brief ↗</a></div></div>
  <div class="retail-info-content">
   <details class="retail-disclosure" open><summary>Development specifications <span aria-hidden="true">+</span></summary><div class="retail-spec-wrap" role="region" aria-label="Scrollable product specifications" tabindex="0"><table><caption class="retail-sr-only">${e(p.name)} development specifications</caption><thead><tr><th scope="col">Detail</th><th scope="col">Current concept</th><th scope="col">Status</th></tr></thead><tbody>${specRows}</tbody></table></div></details>
   <details class="retail-disclosure"><summary>Which finishes are planned? <span aria-hidden="true">+</span></summary><p>Porcelain White, Stone, Graphite and Champagne are currently visual concepts. No colorway is presented as an available production SKU.</p></details>
   <details class="retail-disclosure"><summary>What comes in the box? <span aria-hidden="true">+</span></summary><p>Packaging and included attachments are being developed. Final pack contents will be published after the production configuration is approved.</p></details>
   <details class="retail-disclosure"><summary>When will it be available? <span aria-hidden="true">+</span></summary><p>Timing has not been confirmed. The current site lets you save a concept selection or ask the team about progress.</p></details>
   <details class="retail-disclosure"><summary>Is the displayed retail price final? <span aria-hidden="true">+</span></summary><p>No. The displayed figure is an indicative concept target, not a quotation or invitation to purchase.</p></details>
   <details class="retail-disclosure"><summary>Can professional buyers request it? <span aria-hidden="true">+</span></summary><p>Hotels, salons and other professional buyers can prepare a project brief. Supply, certification and all commercial terms require separate approval.</p></details>
  </div>
 </section>
 <section class="retail-business" id="room-planning"><div><p class="retail-eyebrow">AERLOR / PROFESSIONAL</p><h2>Considered for<br>the spaces we share.</h2><p>Build a thoughtful product standard for hotels, salons and other professional environments.</p><a href="${url('hospitality/wholesale/')}">Explore professional solutions <span aria-hidden="true">↗</span></a></div><div class="retail-business-art">${img('retail/product-graphite.png','AERLOR Graphite dryer design study','width="928" height="1120" loading="lazy"')}</div></section>
 <script type="module" src="/src/r8-retail.ts"></script>`;
}
