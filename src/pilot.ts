export interface PilotInput { [field: string]: string; }
const clean=(value: string | undefined,limit=2000): string=>(value??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,'').trim().slice(0,limit);

/** Local text export only. No network request, browser persistence, or marketing consent is implied. */
export function buildPilotBrief(input: PilotInput): string {
 const rows=[['Name',clean(input.name,100)],['Work email',clean(input.email,200)],['Hotel or group',clean(input.property,160)],['Country',clean(input.country,100)],['Room count',clean(input.rooms,40)],['Concept interest',clean(input.interest,50)]];
 return ['AERLOR / PROPERTY PILOT BRIEF','Considered essentials. Exceptional stays.','',...rows.map(([key,value])=>key+': '+value),'','Priorities / notes',clean(input.message),'','PREVIEW ONLY','This brief was generated locally on your device. It has not been submitted to AERLOR.','It is not an order, quote, sample reservation, or confirmation of availability.','Product forms, finishes, specifications, electrical approvals and pricing remain in development.',''].join('\n');
}
