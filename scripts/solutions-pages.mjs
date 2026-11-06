import {url,e,arrow,small,eye,link} from './r4/ui.mjs';

/*
 * Commercial solutions. All visuals are owned concept assets, not installations.
 * Every buyer claim is a specification question, not an invented performance result.
 */
export const sectors=[
  {
    slug:'salons', name:'Salons & Stylists', category:'PROFESSIONAL HAIRCARE',
    headline:'Good design belongs<br>behind the chair.',
    description:'The right equipment should make sense in the hands of the stylist and in the space around them. Start with station layout, handling, power access and a workable service plan.',
    image:'campaign/studio-detail.webp', scene:'solutions/salon-station-study.svg',
    card:'campaign/colors-lineup.webp', imageAlt:'AERLOR hairdryer in Champagne, preproduction design study',
    sceneAlt:'Illustrative salon station layout showing vanity, chair, tool rest, power point and working clearance',sceneCaption:'CONCEPTUAL STATION DIAGRAM — NOT A SITE OR ELECTRICAL DRAWING',
    cue:'THE PROFESSIONAL STATION', sectionHeading:'Consider the whole station.', sectionLead:'Every appointment involves more than the hairdryer. Think about the reach from chair to counter, the available outlets and the way a tool is returned between clients.',
    pillars:[
      ['In the stylist’s hand','Evaluate controls, grip and balance with the people who will actually use the proposed sample.'],
      ['On the salon floor','Plan positioning, cable paths, storage and the electrical layout before deciding quantities.'],
      ['Across the business','Create a repeatable process for cleaning, equipment checks, warranty support and replacement.']
    ],
    editorialTitle:'The work happens<br>between appointments.',
    editorialBody:'The most useful salon specification begins with an ordinary working day. Watch where the dryer rests, how often it changes hands and what it takes to keep each station ready.',
    technical:[
      'Assess the proposed model with working stylists under real station conditions.',
      'Review power, outlet position, cord routing and local electrical requirements.',
      'Obtain the exact model’s commercial-use and replacement terms in writing.'
    ],
    buyer:'Salon owners, independent stylists and purchasing managers',
    size:'Styling stations', focus:'Stylist handling, station fit, service',
    support:'From a single independent studio to a multi-location salon group.',
    keyQuestion:'Is the dryer approved for full-time professional salon use?',
    keyAnswer:'Commercial-duty suitability has not been established for a released AERLOR model. An approved sample, measured operating evidence and a written professional-use warranty should precede a salon order.'
  },
  {
    slug:'spas', name:'Spas & Wellness', category:'WELLNESS SPACES',
    headline:'The ritual extends<br>beyond the treatment.',
    description:'Consider the moment a guest moves from a treatment room to the mirror. A well-planned getting-ready space should feel as deliberate as the rest of the visit.',
    image:'campaign/vanity-editorial.webp', scene:'campaign/ritual-model.webp',card:'campaign/portrait-editorial.webp',
    imageAlt:'Refined vanity with AERLOR preproduction personal-care equipment',
    sceneAlt:'Editorial wellness design study with AERLOR haircare equipment',
    cue:'THE FINAL MOMENT',sectionHeading:'Give the finishing ritual its place.',sectionLead:'Guests need intuitive access, comfortable space and practical support. The operating team needs a setup it can manage consistently.',
    pillars:[
      ['Changing suites','Review mirrors, counter space, outlet placement and the privacy of the grooming area.'],
      ['Treatment-adjacent spaces','Coordinate tools and storage with staff routines and the intended guest journey.'],
      ['Destination wellness','Define the equipment schedule by room type rather than assuming every area needs the same arrangement.']
    ],
    editorialTitle:'Calm on the surface.<br>Considered underneath.',
    editorialBody:'What guests see is a clean, quiet preparation space. What operators manage is placement, electrical safety, cleaning and replacement. Both belong in the brief.',
    technical:['Obtain approval for use around relevant wet-zone boundaries.','Confirm cleaning, storage and staff inspection requirements.','Verify electrical, warranty and service suitability of the proposed exact model.'],
    buyer:'Spa directors, wellness operators and hotel spa procurement',
    size:'Vanity stations and changing rooms',focus:'Wet-area fit, guest journey, staff routines',
    support:'Plan the guest-facing detail alongside the operational routine.',
    keyQuestion:'Can the dryer be installed near showers or wet changing areas?',
    keyAnswer:'Do not assume wet-area suitability. Electrical and placement restrictions depend on the exact certified model, jurisdiction and site conditions, and must be cleared by the relevant engineer.'
  },
  {
    slug:'fitness',name:'Fitness & Private Clubs',category:'MEMBER FACILITIES',
    headline:'From the workout<br>back into the day.',
    description:'A useful finishing area respects members’ time and facilities teams’ workload. Specify the grooming station for real traffic, shared use and practical care.',
    image:'campaign/kit-flatlay.webp',scene:'campaign/filter-detail.webp',card:'studio/dryer-graphite-hero.webp',
    imageAlt:'AERLOR haircare kit design concept arranged on a neutral surface',
    sceneAlt:'Close-up product-design study of hairdryer detailing',
    cue:'THE MEMBER JOURNEY',sectionHeading:'Think beyond the changing room.',sectionLead:'A shared grooming area has different expectations from a private guest suite. Traffic flow, outlet placement and routine inspection are part of the experience.',
    pillars:[
      ['Member vanity zones','Plan the number and placement of stations for the expected use pattern.'],
      ['Private suites','Create a refined equipment presentation without compromising clear operating instructions.'],
      ['Club networks','Define a common specification and service model, adjusted for each facility’s infrastructure.']
    ],
    editorialTitle:'A smooth exit<br>is part of the service.',
    editorialBody:'From the mirror to the storage position, small decisions affect how quickly a member can get ready and how easily staff can reset the space.',
    technical:['Confirm electrical and wet-area placement with facilities engineering.','Plan shared-use cleaning, inspection and storage routines.','Check written service, replacement and commercial warranty coverage.'],
    buyer:'Club operators, fitness groups and facilities teams',
    size:'Member grooming positions',focus:'Shared use, facility fit, replacement',
    support:'Specify member amenities around the practical needs of the club.',
    keyQuestion:'Can equipment be left available for unsupervised member use?',
    keyAnswer:'That decision requires exact-model safety evidence, a site-specific risk review, operating instructions and management approval. A concept image is not evidence of unsupervised-use suitability.'
  },
  {
    slug:'residences',name:'Luxury Residences',category:'RESIDENTIAL PROGRAMS',
    headline:'The detail that<br>feels like home.',
    description:'For furnished residences and amenity suites, personal-care equipment should complement the interior and work for the resident long after the initial handover.',
    image:'campaign/vanity-flatlay.webp',scene:'campaign/model-suite.webp',card:'campaign/model-suite.webp',
    imageAlt:'AERLOR premium vanity collection arranged for a residential concept',
    sceneAlt:'Editorial portrait with AERLOR hairdryer in a furnished-room concept',
    cue:'THE FURNISHED INTERIOR',sectionHeading:'Specify what stays with the residence.',sectionLead:'The right placement, finish and ongoing support need to survive more than a design presentation.',
    pillars:[['Furnished units','Consider counter space, sockets, storage and a consistent equipment schedule.'],['Residential amenities','Plan shared preparation suites for the intended access and cleaning model.'],['Developer portfolios','Coordinate quantities, destination electrical requirements and handover expectations.']],
    editorialTitle:'A design detail.<br>An everyday essential.',
    editorialBody:'Good residential specification is as much about maintenance and future replacement as it is about the first impression.',
    technical:['Match the proposed unit to residential electrical requirements.','Confirm furniture clearance, storage and handover documentation.','Review after-handover warranty, replacement and purchasing terms.'],
    buyer:'Developers, furnishing teams and managed residences',size:'Units and amenity rooms',focus:'Interior fit, handover, lifecycle',
    support:'One coordinated specification across furnished living spaces.',
    keyQuestion:'Can we specify a consistent finish across an entire development?',
    keyAnswer:'Finish consistency can be a design requirement, but production availability, color tolerances, quantity and replacement matching must be confirmed against a released SKU and written offer.'
  },
  {
    slug:'travel',name:'Cruise & Travel',category:'TRAVEL HOSPITALITY',
    headline:'Considered for<br>the journey.',
    description:'From passenger cabins to premium lounges, travel environments need equipment choices that respect the operator’s electrical, space and service requirements.',
    image:'campaign/travel-case.webp',scene:'campaign/unboxing-kit.webp',card:'campaign/travel-case.webp',
    imageAlt:'AERLOR haircare travel-case concept on a neutral backdrop',
    sceneAlt:'AERLOR presentation and packaging design study',
    cue:'THE TRAVEL ENVIRONMENT',sectionHeading:'Different routes. Different constraints.',sectionLead:'A space aboard a vessel is not interchangeable with a standard hotel room. Start with the operator’s requirements.',
    pillars:[['Passenger cabins','Review dimensions, storage and permitted electrical equipment.'],['Premium lounges','Plan vanity access and equipment care within the lounge operating model.'],['Fleet purchasing','Document the relevant vessel or site standard before discussing rollout.']],
    editorialTitle:'Premium presentation.<br>Precise constraints.',
    editorialBody:'In travel hospitality, the installation environment dictates the specification. The product and the operating plan need to be reviewed together.',
    technical:['Obtain vessel or operator-specific electrical and fire requirements.','Verify storage, securing and any equipment-handling requirements.','Document the exact model’s permitted use and written warranty terms.'],
    buyer:'Cruise operators, specifiers and travel-facility teams',size:'Cabins and amenity positions',focus:'Operator approval, storage, site rules',
    support:'A design-led conversation grounded in the actual operating environment.',
    keyQuestion:'Is a standard hotel dryer suitable for cruise ships?',
    keyAnswer:'Not by default. Vessel rules, operator specifications, electrical systems and fire requirements can differ. The relevant authority must accept the exact proposed unit.'
  },
  {
    slug:'academies',name:'Beauty Academies',category:'EDUCATION & TRAINING',
    headline:'A better setup<br>for the next generation.',
    description:'Thoughtful station planning for beauty education: repeatable layouts, supervised handling and clear equipment stewardship for student practice.',
    image:'campaign/colors-lineup.webp',scene:'campaign/studio-detail.webp',card:'campaign/colors-lineup.webp',
    imageAlt:'AERLOR dryer concepts in multiple finishes',
    sceneAlt:'AERLOR hairdryer close-up preproduction design study',
    cue:'THE TRAINING STATION',sectionHeading:'Make room for the learning.',sectionLead:'An instructional environment needs enough equipment, clear station standards and a workable maintenance plan.',
    pillars:[['Individual practice','Evaluate controls, handling and outlets against the teaching exercises.'],['Instructor demonstrations','Plan work surfaces, visibility and shared equipment storage.'],['Institutional use','Document quantities, checks, responsibility and replacement policies.']],
    editorialTitle:'Repeatability matters<br>in a learning space.',
    editorialBody:'The equipment plan should support a real curriculum and responsible supervision—not just look appealing in a classroom photograph.',
    technical:['Confirm supervised training requirements and equipment suitability.','Test station ergonomics against actual classroom exercises.','Clarify institutional-use warranty and replacement terms in writing.'],
    buyer:'Education buyers, academy managers and program directors',size:'Teaching stations',focus:'Supervision, station repeatability, service',
    support:'A consistent equipment plan for hands-on learning.',
    keyQuestion:'Is this equipment approved for institutional teaching?',
    keyAnswer:'No education-specific duty classification has been verified for a released model. A teaching site should evaluate a sample, use requirements and written warranty conditions before procurement.'
  },
  {
    slug:'studios',name:'Studios & Backstage',category:'CREATIVE PRODUCTION',
    headline:'Ready before<br>the camera rolls.',
    description:'The preparation room is a working space. Plan haircare tools around artist workflow, flexible layouts, power access and accountable kit management.',
    image:'campaign/portrait-editorial.webp',scene:'campaign/pink-model.webp',card:'campaign/pink-model.webp',
    imageAlt:'Editorial AERLOR haircare portrait concept',
    sceneAlt:'AERLOR pink-finish hairdryer in an editorial model concept',
    cue:'THE CREATIVE WORKSTATION',sectionHeading:'Give the team a reliable setup to evaluate.',sectionLead:'Production prep rooms are often temporary or frequently rearranged. Specify by workflow rather than visual appearance alone.',
    pillars:[['Hair and makeup rooms','Plan counter position, handling, electrical access and tool storage.'],['Shared production kits','Define who manages each kit and how equipment is inspected.'],['Location work','Document transport, site requirements and replacement needs.']],
    editorialTitle:'Every detail counts<br>before the first take.',
    editorialBody:'A well-planned workspace lets artists focus on the work. Establish the practical requirements before choosing the equipment.',
    technical:['Confirm location-specific electrical access and approved use.','Review setup, movement, storage and team responsibility.','Verify professional-use, transport and service conditions before purchasing.'],
    buyer:'Production managers, stylists and studio purchasing',size:'Makeup workstations and kits',focus:'Mobility, kit controls, professional use',
    support:'Purposeful equipment planning for production teams.',
    keyQuestion:'Will the equipment be suitable for frequent travel and location work?',
    keyAnswer:'Transit and professional-use suitability need real sample evaluation and written supplier support. The concept has not been validated for a specific production duty cycle.'
  }
];

const productConcepts=[
  {name:'Hairdryer Lite',label:'EVERYDAY EQUIPMENT CONCEPT',image:'studio/dryer-pearl-product.webp',path:'products/hairdryer-lite/',note:'A restrained finish for coordinated programs.'},
  {name:'Hairdryer Premium',label:'SIGNATURE EQUIPMENT CONCEPT',image:'studio/dryer-graphite-product.webp',path:'products/hairdryer-premium/',note:'A more distinctive visual direction.'}
];
const image=(path,alt,cls='',opts='loading="lazy"')=>`<img class="${cls}" src="/images/${path}" alt="${e(alt)}" width="1200" height="1200" ${opts}>`;
const sectorLink=(s,text='Explore this space')=>`<a href="${url('solutions/'+s.slug+'/')}" class="sol-inline-link">${text} <span aria-hidden="true">↗</span></a>`;
const piece=(label,heading,copy)=>`<article class="sol-principle"><span>${label}</span><h3>${heading}</h3><p>${copy}</p></article>`;
const faq=(entries)=>`<div class="sol-answers">${entries.map(([q,a])=>`<details><summary><span>${q}</span><svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M5 11h12M11 5v12" stroke="currentColor" stroke-width="1.4"/></svg></summary><p>${a}</p></details>`).join('')}</div>`;

const featured=[{name:'Hotels & Resorts',path:'hospitality/',image:'campaign/vanity-editorial.webp',alt:'Haircare design study at a hospitality vanity',subtitle:'Guestrooms · openings · property portfolios',code:'01'},
 {name:'Salons & Stylists',path:'solutions/salons/',image:'solutions/salon-station-study.svg',alt:'Illustrative concept for a professional salon workstation',subtitle:'Stylist stations · independent studios · groups',code:'02'},
 {name:'Spas & Wellness',path:'solutions/spas/',image:'campaign/ritual-model.webp',alt:'Wellness haircare concept photograph',subtitle:'Changing suites · vanity areas · wellness',code:'03'},
 {name:'Fitness & Private Clubs',path:'solutions/fitness/',image:'campaign/kit-flatlay.webp',alt:'Premium haircare equipment set design study',subtitle:'Member facilities · locker-room vanities',code:'04'}];

function featuredCard(item,i){
 return `<a class="sol-featured-card sol-featured-card--${i+1}" href="${url(item.path)}">
  <div class="sol-featured-card-image">${image(item.image,item.alt)}<span>CONCEPT VISUAL</span></div>
  <div class="sol-featured-card-copy"><span class="sol-index">${item.code} / CORE ENVIRONMENT</span><div class="sol-featured-card-name"><h3>${item.name}</h3><span aria-hidden="true">↗</span></div><p>${item.subtitle}</p></div>
 </a>`;
}

export function solutionsHome(){
 return `
 <section class="sol-hub-hero" aria-labelledby="sol-hub-title">
   <div class="sol-hub-copy">
     <p class="sol-overline">AERLOR <span aria-hidden="true">/</span> BUSINESS SOLUTIONS</p>
     <h1 id="sol-hub-title">A better way<br>to get ready.<br><span>Everywhere.</span></h1>
     <p class="sol-hero-description">A guest suite. A styling chair. A quiet moment at the mirror. Explore personal-care technology designed to be considered alongside the spaces people use it in.</p>
     <div class="sol-actions"><a class="button button-light" href="#industries">Explore the environments ${arrow}</a><a class="sol-hero-link" href="${url('solutions/brief/')}">Plan a business project <span aria-hidden="true">↗</span></a></div>
     <div class="sol-hero-facts"><span>01 / A CONSIDERED PRODUCT RANGE</span><span>02 / SECTOR-SPECIFIC PLANNING</span></div>
   </div>
   <div class="sol-hub-image">
     ${image('campaign/model-suite.webp','Editorial design visualization of AERLOR hairdryer being held at a vanity','', 'fetchpriority="high"')}
     <div class="sol-hub-image-tag"><span>THE MOMENT OF PREPARATION</span><span>Design study / AERLOR</span></div>
   </div>
 </section>
 <section class="sol-intro-rail" aria-label="What guides the collection">
   <div><span>01</span><strong>Consider the people.</strong><p>How the equipment is handled and experienced.</p></div>
   <div><span>02</span><strong>Understand the space.</strong><p>The room layout, power and placement.</p></div>
   <div><span>03</span><strong>Plan the operation.</strong><p>Cleaning, service and replacement realities.</p></div>
 </section>
 <section class="sol-section sol-industries" id="industries">
   <div class="sol-heading-row"><div><p class="sol-overline">01 / WHERE WE FIT</p><h2>Not one standard.<br><em>One philosophy.</em></h2></div><p>Each environment has a different reason to care. Choose the setting that resembles yours to see what a useful specification should consider.</p></div>
   <div class="sol-featured-grid">${featured.map(featuredCard).join('')}</div>
 </section>
 <section class="sol-specification-story">
   <div class="sol-specification-art">
     ${image('campaign/filter-detail.webp','Close-up study of AERLOR hairdryer detailing and components')}
     <div class="sol-specification-art-label"><span>AERLOR / DETAIL STUDY</span><span>01 — 03</span></div>
   </div>
   <div class="sol-specification-copy"><p class="sol-overline">02 / GOOD DESIGN NEEDS A REAL BRIEF</p><h2>What looks effortless<br>takes consideration.</h2><p>Appearance matters. So do the questions customers rarely see: which outlet is available, who maintains the tool and what happens when a unit needs replacing.</p>
     <div class="sol-specification-items">
       ${piece('01 / THE EXPERIENCE','Fit the routine.','Define how and where the equipment is actually used.')}
       ${piece('02 / THE SITE','Check the conditions.','Confirm placement, electrical requirements and approval with the right people.')}
       ${piece('03 / THE PROGRAM','Plan beyond delivery.','Discuss quantities, sample evaluation, support and replacement terms.')}
     </div>
     ${sectorLink(sectors[0],'Explore the salon approach')}
   </div>
 </section>
 <section class="sol-specialty sol-section">
   <div class="sol-heading-row"><div><p class="sol-overline">03 / BEYOND THE EXPECTED</p><h2>More places.<br>More possibilities.</h2></div><p>From a furnished residence to a production dressing room, we can start with the environment before discussing equipment.</p></div>
   <div class="sol-specialty-list">${sectors.slice(3).map((s,i)=>`<a href="${url('solutions/'+s.slug+'/')}"><span class="sol-specialty-index">0${i+5}</span><strong>${s.name}</strong><span>${s.support}</span><span class="sol-specialty-arrow" aria-hidden="true">↗</span></a>`).join('')}</div>
 </section>
 <section class="sol-product-intro sol-section">
   <div class="sol-heading-row"><div><p class="sol-overline">04 / THE COLLECTION</p><h2>One visual language.<br>Different applications.</h2></div><p>Explore the current design directions. Final technical specifications and approved market variants are established before commercial supply.</p></div>
   <div class="sol-product-editorial">
     <div class="sol-product-large">${image('campaign/colors-lineup.webp','Three AERLOR hairdryer finish concepts arranged together')}<span>THE AERLOR HAIRCARE LANGUAGE — DESIGN STUDY</span></div>
     <div class="sol-product-copy"><p class="sol-overline">DESIGNED TO WORK TOGETHER</p><h3>Essentials, carefully considered.</h3><p>Hairdryers lead the collection, alongside illuminated mirror and styling concepts. Choose the combination that makes sense for the environment rather than adding equipment simply because it is available.</p>${link('Explore the products','collection/')}</div>
   </div>
 </section>
 <section class="sol-faq sol-section">
   <div class="sol-heading-row"><div><p class="sol-overline">05 / BEFORE YOU SPECIFY</p><h2>Useful answers,<br>before the first order.</h2></div><p>Clear questions are better than premature promises. Here is what a buyer should establish at this stage.</p></div>
   ${faq([
    ['Are AERLOR products available for wholesale orders?','The collection is in development. A commercial order requires approved exact models, jurisdiction-specific documentation, a seller, pricing, stock and agreed supply terms.'],
    ['Can we review samples or request a custom finish?','Sample access, finishes, customization and minimum order quantities depend on the finalized model and supplier offer. They are not represented as available at this stage.'],
    ['Why create a brief before asking for a price?','The meaningful price depends on intended model, quantity, market, site conditions and service requirements. The brief records those factors without pretending a quotation has been issued.'],
    ['Does the planner submit my details?','No. The current planner is a private tool that downloads a project brief directly to your device. It does not transmit the information to AERLOR.']
   ])}
 </section>
 <section class="sol-bottom-cta">
   <div><p class="sol-overline">AERLOR / YOUR NEXT SPACE</p><h2>Begin with your space.<br>Build the brief from there.</h2><p>Capture the essentials, share them with your own team and start the right specification conversation.</p></div>
   ${link('Prepare a project brief','solutions/brief/','button-light')}
 </section>`;
}

function specificationProducts(s){
 return `<section class="sol-equipment-gallery sol-section" aria-labelledby="sol-equipment-heading">
 <div class="sol-heading-row"><div><p class="sol-overline">03 / EQUIPMENT DIRECTIONS</p><h2 id="sol-equipment-heading">Explore the design.<br>Specify the reality.</h2></div><p>The collection below is preproduction. Professional, hotel or institutional suitability must be evaluated and accepted for the exact released model.</p></div>
 <div class="sol-equipment-items">${productConcepts.map(p=>`<a href="${url(p.path)}" class="sol-equipment-card"><div class="sol-equipment-media">${image(p.image,'AERLOR '+p.name+' concept render')}<span>DESIGN CONCEPT</span></div><div class="sol-equipment-details"><div><span class="sol-index">${p.label}</span><h3>${p.name}</h3><p>${p.note}</p></div><span class="sol-equipment-arrow" aria-hidden="true">↗</span></div></a>`).join('')}</div>
 <div class="sol-equipment-footnote"><span>* FINISH AND CONFIGURATION CONCEPTS ONLY</span><a href="${url('compare/')}">Compare the collection <span aria-hidden="true">↗</span></a></div>
 </section>`;
}

export function sectorPage(s){
 const related=sectors.filter(x=>x.slug!==s.slug).slice(0,3);
 return `
 <section class="sol-sector-hero sol-sector--${s.slug}">
  <div class="sol-sector-hero-copy">
    <p class="sol-overline">AERLOR <span aria-hidden="true">/</span> ${s.category}</p>
    <h1>${s.headline}</h1>
    <p class="sol-hero-description">${e(s.description)}</p>
    <div class="sol-actions">${link('Plan your setup','solutions/brief/?industry='+s.slug)}${small('View the collection','collection/hairdryers/')}</div>
    <div class="sol-hero-caption"><span>${s.cue}</span><span>DESIGN IN DEVELOPMENT</span></div>
  </div>
  <figure class="sol-sector-hero-visual">${image(s.image,s.imageAlt,'', 'fetchpriority="high"')}<figcaption><span>01 / AERLOR VISUAL STUDY</span><span>Preproduction concept, not a customer installation</span></figcaption></figure>
 </section>
 <section class="sol-compact-rail"><span>THE RIGHT SPECIFICATION CONSIDERS</span><div><strong>01 / WORKFLOW</strong><strong>02 / PLACEMENT</strong><strong>03 / SITE APPROVAL</strong><strong>04 / SUPPORT</strong></div></section>
 <section class="sol-section sol-pillar-section">
  <div class="sol-heading-row"><div><p class="sol-overline">01 / ${s.cue}</p><h2>${s.sectionHeading}</h2></div><p>${e(s.sectionLead)}</p></div>
  <div class="sol-pillars">${s.pillars.map(([title,desc],i)=>`<article><span>0${i+1} / ${s.cue}</span><h3>${title}</h3><p>${desc}</p></article>`).join('')}</div>
 </section>
 <section class="sol-editorial-story">
  <figure>${image(s.scene,s.sceneAlt)}<figcaption>${s.sceneCaption||'AERLOR / EDITORIAL DESIGN STUDY — NOT A VERIFIED INSTALLATION'}</figcaption></figure>
  <div><p class="sol-overline">02 / AN EVERYDAY POINT OF VIEW</p><h2>${s.editorialTitle}</h2><p>${s.editorialBody}</p><div class="sol-editorial-rule"><span>01 / LOOK</span><span>02 / EVALUATE</span><span>03 / SPECIFY</span></div></div>
 </section>
 ${specificationProducts(s)}
 <section class="sol-engineering">
  <div><p class="sol-overline">04 / A MORE USEFUL CHECKLIST</p><h2>Consider the site.<br>Then the equipment.</h2><p>Good procurement starts with evidence relevant to the real environment. These checks belong in any conversation about a proposed model.</p></div>
  <ol>${s.technical.map((t,i)=>`<li><span>0${i+1}</span><p>${e(t)}</p></li>`).join('')}</ol>
 </section>
 <section class="sol-buyer">
  <div><p class="sol-overline">05 / COMMERCIAL PLANNING</p><h2>One location.<br>Or an entire program.</h2><p>${s.support}</p><p>Build a private equipment brief you can use with your team. The draft isn't submitted and it isn't a quote.</p></div>
  <div class="sol-buyer-action"><div class="sol-buyer-action-top"><span class="sol-index">BUSINESS BUYER BRIEF</span><span>↗</span></div><h3>Start with the real requirements.</h3><dl><div><dt>Intended buyer</dt><dd>${s.buyer}</dd></div><div><dt>Project unit</dt><dd>${s.size}</dd></div><div><dt>Focus</dt><dd>${s.focus}</dd></div></dl>${link('Create your business brief','solutions/brief/?industry='+s.slug)}<p>Private local download. No personal details are transmitted.</p></div>
 </section>
 <section class="sol-faq sol-section"><div class="sol-heading-row"><div><p class="sol-overline">06 / COMMON QUESTIONS</p><h2>Clarity before<br>commitment.</h2></div><p>Product development is not the same as a released commercial offering. These answers define what needs to be verified.</p></div>
 ${faq([
  [s.keyQuestion,s.keyAnswer],
  ['Can we purchase or receive an evaluation unit today?','Availability, sample terms, shipping and pricing have not been established for a released commercial model. Use the brief to define what you would need to evaluate.'],
  ['How should an initial rollout be planned?','Document actual use, site approvals, quantities and a sample acceptance protocol. Commercial procurement and any larger deployment follow only after evidence and written terms.']
 ])}</section>
 <section class="sol-cross-nav sol-section"><div><p class="sol-overline">EXPLORE OTHER ENVIRONMENTS</p><h2>More ways to specify AERLOR.</h2></div><div>${related.map(s2=>`<a href="${url('solutions/'+s2.slug+'/')}"><span>${s2.name}</span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>
 `;
}

export function businessBriefPage(){
 const options=[['','Choose your environment'],['hotels','Hotels & Resorts'],...sectors.map(s=>[s.slug,s.name]),['other','Another business environment']].map(([v,l])=>`<option value="${e(v)}">${e(l)}</option>`).join('');
 return `<section class="sol-brief-intro"><div class="sol-brief-intro-copy"><p class="sol-overline">AERLOR / PROJECT PLANNING</p><h1>A more useful<br>starting point.</h1><p>No sales script. No arbitrary quantity assumption. A practical brief for the people who will specify the actual equipment.</p><div class="sol-brief-trust"><span>PRIVATE BY DESIGN</span><span>NO TRANSMISSION</span><span>NO ACCOUNT REQUIRED</span></div></div><div class="sol-brief-intro-visual">${image('campaign/studio-detail.webp','AERLOR dryer preproduction product visualization','', 'fetchpriority="high"')}<div>VISUAL STUDY / PREPRODUCTION</div></div></section>
 <section class="sol-brief-workspace">
  <div class="sol-brief-form-intro"><p class="sol-overline">01 / YOUR PROJECT</p><h2>Build the brief.</h2><p>A few details help define the right questions. Your answers stay in this browser and are not saved or submitted.</p></div>
  <div class="sol-brief-layout"><form id="solutions-brief" class="sol-brief-form" novalidate>
   <div class="sol-form-header"><div><span class="sol-index">YOUR ENVIRONMENT</span><h3>The essentials.</h3></div><span>01 — 03</span></div>
   <div class="sol-form-grid"><label>Business environment <select name="industry" required>${options}</select></label><label>Country or market <select name="market" required><option value="">Choose a market</option><option>United States</option><option>Canada</option><option>United Kingdom</option><option>European Union</option><option>Other market</option></select></label></div>
   <div class="sol-form-grid"><label>Estimated units or stations <input name="units" type="number" min="1" max="100000" required inputmode="numeric" placeholder="e.g. 20"></label><label>Number of locations <input name="locations" type="number" min="1" max="10000" required inputmode="numeric" placeholder="e.g. 2"></label></div>
   <label>Project stage <select name="stage" required><option value="">Choose your project stage</option><option>Exploring options</option><option>New opening or build-out</option><option>Renovation or refresh</option><option>Existing equipment replacement</option><option>Planning a multi-site rollout</option></select></label>
   <div class="sol-form-divider"><span class="sol-index">THE COLLECTION</span><span>02 — 03</span></div>
   <fieldset><legend>Which equipment would you like to explore?</legend><div class="sol-checkboxes"><label><input type="checkbox" name="category" value="Hairdryers"> Hairdryers</label><label><input type="checkbox" name="category" value="Mirrors"> Illuminated mirrors</label><label><input type="checkbox" name="category" value="Styling tools"> Styling tools</label></div></fieldset>
   <label>Most important consideration <select name="priority" required><option value="">Choose the main consideration</option><option>Styling and handling workflow</option><option>Product appearance and finish</option><option>Electrical and site integration</option><option>Budget and purchasing approach</option><option>Maintenance and replacement support</option></select></label>
   <div class="sol-form-divider"><span class="sol-index">ADDITIONAL REQUIREMENTS</span><span>03 — 03</span></div>
   <label>What does your team need to know? <textarea name="notes" maxlength="2000" rows="5" placeholder="Current equipment, intended placement, power needs, operating constraints or questions you want the supplier to answer."></textarea></label>
   <div class="sol-form-error" id="solutions-brief-error" role="alert" aria-live="assertive"></div>
   <div class="sol-form-actions"><button type="submit" class="button button-dark" data-download-brief>Download my project brief ${arrow}</button><button type="button" class="sol-copy-brief" data-copy-brief>Copy brief text</button></div>
   <p class="sol-brief-feedback" id="solutions-brief-feedback" role="status" aria-live="polite"></p><p class="sol-brief-disclosure">No submission or delivery takes place. This tool generates a local text document. Product pricing, technical approval, stock and commercial supply remain unconfirmed.</p>
  </form>
  <aside class="sol-preview" aria-label="Live project brief preview">
   <div class="sol-preview-top"><span class="sol-overline">LIVE PROJECT PREVIEW</span><span class="sol-preview-live">LOCAL ONLY</span></div>
   <h3>Good questions<br>make better briefs.</h3><p>As you fill out the planner, the essentials appear here.</p>
   <dl class="sol-preview-values"><div><dt>Environment</dt><dd data-preview="industry">Not selected</dd></div><div><dt>Market</dt><dd data-preview="market">Not selected</dd></div><div><dt>Equipment positions</dt><dd data-preview="units">—</dd></div><div><dt>Locations</dt><dd data-preview="locations">—</dd></div><div><dt>Project stage</dt><dd data-preview="stage">Not selected</dd></div><div><dt>Collection</dt><dd data-preview="categories">Not selected</dd></div><div><dt>First priority</dt><dd data-preview="priority">Not selected</dd></div></dl>
   <div class="sol-preview-checklist"><span class="sol-index">QUESTIONS TO RESOLVE</span><ul data-preview-questions><li>Confirm the exact intended use and equipment category.</li><li>Review site and market requirements.</li><li>Establish written commercial and service terms.</li></ul></div>
   <div class="sol-preview-note"><strong>AERLOR / CONCEPT STAGE</strong><p>Preparing a brief does not establish product suitability, availability, a price, or a received enquiry.</p></div>
  </aside></div>
 </section>`;
}

export const solutionRoutes=[
  {path:'solutions',title:'Business Solutions',description:'Thoughtful AERLOR equipment planning for hotel, salon, wellness, club and other commercial spaces.',content:solutionsHome()},
  ...sectors.map(s=>({path:'solutions/'+s.slug,title:s.name+' | AERLOR Solutions',description:s.description,content:sectorPage(s)})),
  {path:'solutions/brief',title:'Business Project Planner',description:'Build a private local AERLOR equipment specification brief for your environment.',content:businessBriefPage()}
];
