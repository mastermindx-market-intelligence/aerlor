const form=document.querySelector<HTMLFormElement>('#solutions-brief');
if(form){
 const options=form.querySelector<HTMLSelectElement>('[name=industry]');
 const sector=new URLSearchParams(window.location.search).get('industry');
 if(options&&sector&&[...options.options].some(o=>o.value===sector))options.value=sector;
 const error=form.querySelector<HTMLElement>('#solutions-brief-error');
 const feedback=form.querySelector<HTMLElement>('#solutions-brief-feedback');
 const describe=(name:string):string=>{
  const element=form.elements.namedItem(name);
  return element instanceof HTMLInputElement||element instanceof HTMLSelectElement||element instanceof HTMLTextAreaElement?element.value.trim():'';
 };
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(error)error.textContent='';
  if(feedback)feedback.textContent='';
  if(!form.checkValidity()){
   if(error)error.textContent='Complete the required project fields before downloading your brief.';
   form.querySelector<HTMLInputElement|HTMLSelectElement>(':invalid')?.focus();
   return;
  }
  const categories=[...form.querySelectorAll<HTMLInputElement>('input[name=category]:checked')].map(input=>input.value);
  if(!categories.length){if(error)error.textContent='Select at least one equipment category.';form.querySelector<HTMLInputElement>('input[name=category]')?.focus();return;}
  const industry=options?.selectedOptions[0]?.textContent?.trim()||'Business project';
  const notes=describe('notes');
  const lines=[
   'AERLOR | BUSINESS EQUIPMENT BRIEF',
   '=================================',
   'Created locally: '+new Date().toISOString().slice(0,10),
   'Environment: '+industry,
   'Destination market: '+describe('market'),
   'Estimated units / stations: '+describe('units'),
   'Locations: '+describe('locations'),
   'Project stage: '+describe('stage'),
   'Equipment: '+categories.join(', '),
   '',
   'PROJECT REQUIREMENTS',
   notes||'Not provided',
   '',
   'NEXT STEP',
   'Use this private brief for internal planning. Review intended models, electrical suitability, service terms and commercial proposals before any order.',
   '',
   'AERLOR collection in development. This file was prepared locally and has NOT been sent to AERLOR. No prices, stock or technical approvals are implied.'
  ];
  const blob=new Blob([lines.join('\n')+'\n'],{type:'text/plain;charset=utf-8'});
  const href=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=href;
  a.download='aerlor-'+(options?.value||'project')+'-brief.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(()=>URL.revokeObjectURL(href),2000);
  if(feedback)feedback.textContent='Brief downloaded to your device. Nothing has been sent.';
 });
}
