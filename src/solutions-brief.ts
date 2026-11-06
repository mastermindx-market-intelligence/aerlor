/**
 * AERLOR private business planner.
 * Never sends, persists, or silently transmits project data.
 */
const rootForm=document.querySelector<HTMLFormElement>('#solutions-brief');
if(rootForm){
  const form=rootForm;
  const fields={
    industry:form.querySelector<HTMLSelectElement>('select[name=industry]'),
    market:form.querySelector<HTMLSelectElement>('select[name=market]'),
    units:form.querySelector<HTMLInputElement>('input[name=units]'),
    locations:form.querySelector<HTMLInputElement>('input[name=locations]'),
    stage:form.querySelector<HTMLSelectElement>('select[name=stage]'),
    priority:form.querySelector<HTMLSelectElement>('select[name=priority]'),
    notes:form.querySelector<HTMLTextAreaElement>('textarea[name=notes]')
  };
  const industryParam=new URLSearchParams(window.location.search).get('industry');
  if(industryParam&&fields.industry&&[...fields.industry.options].some(x=>x.value===industryParam))fields.industry.value=industryParam;
  const error=form.querySelector<HTMLElement>('#solutions-brief-error');
  const feedback=form.querySelector<HTMLElement>('#solutions-brief-feedback');
  const copyButton=form.querySelector<HTMLButtonElement>('[data-copy-brief]');
  const display=(key:keyof typeof fields):string=>{
    const el=fields[key];
    if(!el)return '';
    return el instanceof HTMLSelectElement?el.selectedOptions[0]?.textContent?.trim()||'':el.value.trim();
  };
  const selectedCategories=()=>[...form.querySelectorAll<HTMLInputElement>('input[name=category]:checked')].map(input=>input.value);
  const questionsBySector:Record<string,string[]>={
    hotels:['What exact room and market approvals are required?','How does the product fit housekeeping and room maintenance?','What pilot, service and replacement terms apply?'],
    salons:['Does the proposed sample suit the stylist workflow?','Are power, controls, cord reach and station layout appropriate?','What professional-use warranty and replacement terms apply?'],
    spas:['What wet-area placement approvals are necessary?','How are the tools cleaned, stored and inspected?','What model and site evidence must engineering approve?'],
    fitness:['How will shared stations be managed and inspected?','Does the electrical setup suit the locker-room location?','What commercial-use service terms apply?'],
    residences:['Which room types and locations need equipment?','What are the handover and replacement requirements?','Are models approved for the destination market?'],
    travel:['What operator-specific electrical and fire rules apply?','Where will equipment be stored and handled?','What exact-model approval is required before use?'],
    academies:['What teaching exercises and supervision are expected?','What station layout and equipment count are required?','Which institutional-use warranty terms apply?'],
    studios:['Which locations and workstations need equipment?','How will kits be transported and checked?','What professional-use and service conditions apply?'],
    other:['What is the exact intended environment?','What site and electrical approvals will be needed?','What support and supply conditions are required?']
  };
  const blank='Not selected';
  function updatePreview():void{
    const preview=(key:string,value:string)=>{
      const node=form.parentElement?.querySelector<HTMLElement>('[data-preview="'+key+'"]');
      if(node)node.textContent=value||blank;
    };
    preview('industry',fields.industry?.value?display('industry'):blank);
    preview('market',fields.market?.value?display('market'):blank);
    preview('units',fields.units?.value?Number(fields.units.value).toLocaleString('en-US'):'—');
    preview('locations',fields.locations?.value?Number(fields.locations.value).toLocaleString('en-US'):'—');
    preview('stage',fields.stage?.value?display('stage'):blank);
    preview('categories',selectedCategories().join(', ')||blank);
    preview('priority',fields.priority?.value?display('priority'):blank);
    const list=form.parentElement?.querySelector<HTMLElement>('[data-preview-questions]');
    if(list){
      const questions=questionsBySector[fields.industry?.value||'other']||questionsBySector.other;
      list.replaceChildren(...questions.map(question=>{
        const li=document.createElement('li');li.textContent=question;return li;
      }));
    }
  }
  form.addEventListener('change',updatePreview);
  form.addEventListener('input',updatePreview);
  updatePreview();

  function validate():boolean{
    if(error)error.textContent='';
    if(feedback)feedback.textContent='';
    if(!form.checkValidity()){
      if(error)error.textContent='Complete the required project fields before preparing your brief.';
      form.querySelector<HTMLInputElement|HTMLSelectElement>(':invalid')?.focus();
      return false;
    }
    if(selectedCategories().length===0){
      if(error)error.textContent='Select at least one equipment category.';
      form.querySelector<HTMLInputElement>('input[name=category]')?.focus();
      return false;
    }
    return true;
  }
  function makeBrief():string{
    const questions=questionsBySector[fields.industry?.value||'other']||questionsBySector.other;
    return [
      'AERLOR / BUSINESS EQUIPMENT BRIEF',
      '=================================',
      'Prepared locally: '+new Date().toISOString().slice(0,10),
      '',
      '01 / PROJECT',
      'Environment: '+display('industry'),
      'Destination market: '+display('market'),
      'Estimated units / stations: '+display('units'),
      'Locations: '+display('locations'),
      'Project stage: '+display('stage'),
      '',
      '02 / EQUIPMENT',
      'Categories: '+selectedCategories().join(', '),
      'Main consideration: '+display('priority'),
      '',
      '03 / REQUIREMENTS',
      display('notes')||'No additional notes',
      '',
      '04 / QUESTIONS TO RESOLVE',
      ...questions.map((q,i)=>(i+1)+'. '+q),
      '',
      '05 / NEXT STEP',
      'Evaluate the proposed exact model and use. Verify market/site requirements, service, release evidence and written terms before ordering.',
      '',
      'This is a private planning document, not a quote or a received enquiry.',
      'AERLOR collection in development. No product, pricing, stock or suitability claim is established.',
      'Nothing has been transmitted to AERLOR.'
    ].join('\n')+'\n';
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!validate())return;
    const blob=new Blob([makeBrief()],{type:'text/plain;charset=utf-8'});
    const href=URL.createObjectURL(blob);
    const a=document.createElement('a');
    a.href=href;
    a.download='aerlor-'+(fields.industry?.value||'project')+'-brief.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(()=>URL.revokeObjectURL(href),2000);
    if(feedback)feedback.textContent='Brief downloaded to your device. Nothing has been sent.';
  });
  copyButton?.addEventListener('click',async()=>{
    if(!validate())return;
    try{
      await navigator.clipboard.writeText(makeBrief());
      if(feedback)feedback.textContent='Brief copied to your clipboard. Nothing has been sent.';
    }catch{
      if(error)error.textContent='Clipboard access is unavailable. Use Download my project brief instead.';
    }
  });
}
