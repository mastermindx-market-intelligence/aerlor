# Contour R1 / Three packaging configurations

**PROPOSAL · 2026-11-04 · All dimensions/materials/weights TBD · Not a production dieline or print release**

## 1. Architecture decision

Develop one protective **unit module** for the exact dryer, cord/protection plug, selected accessories and instructions. Use it in a six-unit hotel carton; study a twelve-unit, two-layer alternative only if measured weight, handling, damage protection and buyer replenishment needs support it. Develop a separate future retail presentation. Keep reusable room storage outside the disposable transport system.

| Configuration | Proposed construction | Buyer/use decision | Current proof |
| --- | --- | --- | --- |
| **HOTEL-6 / HOTEL-12** | Replaceable paper-based unit protection; divided corrugated case; perimeter-supported optional interlayer | Six vs twelve units, accessories in every room vs separate pool, receiving route | Layout concept and arithmetic only |
| **RETAIL-FUTURE** | Restrained printed sleeve and folding tray/engineered insert, with a separate protective parcel shipper if required | Genuine future consumer channel, verified SKU/claims/warranty and actual retail program | Presentation concept only; no launch or price |
| **ROOM-COLD / LOAN-LATER** | Removable cleanable tray with distinct device, accessory and loose cord/plug positions; optional storage cover; later loan case separately gated | Actual room fit and staff process; adjacent-tool demand | Workflow/label concept only; no heat rating or guest trial |

All CAD, tool dimensions, grammage, corrugation/flute, compression strength, adhesives, coatings, abrasion liners, moisture barriers and friction materials remain TBD. Paperboard or pulp is a preferred exploration, not a proven recyclable solution or a certified environmental claim [SRC-08]. Reusable room parts may require a different material; their cleaning, heat and durability properties must be tested.

## 2. HOTEL-6 / HOTEL-12: unit protection and load path

### Unit module proposal

Use a folded-board cradle or molded-fiber insert only after abrasion, dust, impact and humidity testing supports it. Support robust housing regions identified by the engineer; do not load controls, grille, filter latch, delicate nozzle surfaces or the cord strain relief. A smooth protective contact layer may be needed for both finishes. Material fibers must not enter openings. The module contains separate restrained positions for:

- the dryer, **unplugged and fully cooled** before packing;
- the actual loosely coiled cord and full protection-plug envelope, separated from the finish;
- the agreed accessory set, isolated from the housing and each other;
- approved instructions and unit identification readable during receiving.

A diffuser may determine the module's largest dimension. Do not design the case around the dryer alone then omit or crush a diffuser later. If diffusion is supplied through a request pool, its replenishment pack and accessible guest request process require a separate buyer decision; convenience and inclusivity must be evaluated with MARKET-01.

The six-unit concept is **three columns × two rows × one layer**. Twelve units use the same protected modules in **three × two × two**. The proposed interlayer spans structural supports/dividers and the perimeter; its loads must bypass appliances, plugs and controls. This load path is a requirement to prove, not a validated structural model. No carrying handle cut-out is assumed because it can change strength and expose contents. Choose the count after ergonomic handling and shipping trials, not solely cube utilization.

### Parameterized dimensions; never use the rendering to measure

Define the measured **external** protected-module envelope as `L_u, W_u, H_u` in one declared unit. This envelope already includes the actual product, accessory set, cord/plug and unit protection. Do not add cushioning a second time. Record mass `m_u` including all unit-module contents. Define divider thickness `t_xy`, interlayer thickness `t_z`, total case assembly clearances `a_L, a_W, a_H`, and preliminary side-wall allowance `b` with the packaging engineer.

For columns `c=3`, rows `r=2`, layers `k=1` or `2`:

```text
Case inner length = c * L_u + (c - 1) * t_xy + a_L
Case inner width  = r * W_u + (r - 1) * t_xy + a_W
Case inner height = k * H_u + (k - 1) * t_z  + a_H
Preliminary outer axis = inner axis + 2 * b
Gross case mass = (c * r * k) * m_u + measured case/partition/tape/document tare
```

All values in [packout-inputs.json](packout-inputs.json) are intentionally unknown. [packout_model.py](packout_model.py) refuses to calculate a carton from missing measurements. Even with complete numerical inputs, its only output state is **CONCEPT_LAYOUT_ONLY**. The allowance formula does not replace actual scored/cut board geometry, closure overlap, compression, tolerances, bulge or the converter's drawings. Gross weight and a selected shipment route remain required for test selection. No carton purchase, pallet quantity or freight quote may be based on a fixture value.

### Receiving → stock → room

At receiving, reconcile order/model/market/count and actual serial/lot list, inspect damage and identify a traceable case. Damaged or mismatched units go to a segregated inspection route, not straight into rooms. Preserve unit identity when cases are split into room stock. Record receipt and any distribution damage in restricted operational records. Unbox only into an approved workflow; transfer cold/dry units into the reusable room system and retain approved instructions.

Use a case manifest listing the actual serials, or an explicit rule with exceptions if a contiguous range is truly guaranteed; a first/last serial range alone can hide substitutions. A replenishment case is not automatically a guest retail pack. Transport protective parts need not become guest-visible room clutter.

## 3. RETAIL-FUTURE: honest presentation, separate transport

Study an uncoated-looking paper sleeve over a folding tray with a molded-fiber or folded-board insert. Keep a large quiet wordmark, finish identification and a factual contents list. The opening sequence is sleeve → instruction/identity card → protected dryer → separately retained cord/plug and attachments. Provide finger access without pulling on the cord, hot surfaces or fragile nozzles. A diffuser needs its own volume and visible inventory cue.

The appearance of a rigid luxury box is not a reason to select magnets, flocking, foam or permanent mixed-material lamination. Any closure and material choice must survive handling while allowing a practical disposal route. If barrier or abrasion layers prove necessary, specify them honestly and evaluate disassembly; do not claim “plastic free,” “100% recyclable” or an unqualified recycled percentage before evidence and review [SRC-08].

The retail pack requires its own fitted shipper or a tested ship-in-own-container design [SRC-12]. It is **not parcel-ready simply because it fits inside the HOTEL case**. Returns must protect the actual cord/protection plug and accessories too. Consumer claims, seller identity, territory instructions, warranty, identifiers and photography wait for a genuine approved retail program. No MSRP, discount, retail availability, launch date or certification graphic is proposed here.

## 4. ROOM-COLD / LOAN-LATER: storage and staff workflow

The room insert is a removable open tray concept with a visible dryer position, accessory position and a cord/plug channel. Exact geometry, base grip, wipeability, moisture resistance and material are TBD. Use actual room measurements and manufacturer clearances; confirm the tray can be removed and cleaned, the unit can be lifted without pulling the cord, and no drawer/door traps the cord or plug.

The room tray is **not a powered dock, charging station, thermal mat, hot-tool stand or approved cooling station**. Its guest-facing concept instruction is: “Switch off and unplug. Follow the product instructions. Store only when fully cool and dry.” This wording requires exact-SKU safety/editorial approval before use. Never instruct guests to infer safety from a cool-air setting or a timer. The storage bag is optional and cold/dry only; do not cover an operating or hot appliance.

The later loan case has removable inventory partitions and a distinct return status. Returned/uninspected items never share the clean/ready compartment or pool. Log asset ID, completeness and service state; do not put guest details in public artifacts. Keep damaged/wet/uncertain items out of service, under the hotel's approved procedure, without staff improvising electrical diagnosis. Styling irons and curlers require their own authorized cooldown and heat-safe handling plan before any case design can be approved.

Housekeeping instructions must identify who is allowed to clean which parts, the manufacturer's methods and approved chemical/contact-time/drying requirements, acceptance signs and escalation route. This packet specifies no disinfectant, makes no sanitization claim and transfers no competitor filter-cleaning interval to AERLOR.

## 5. Label information architecture

All rectangles in the diagrams are **reserved zones**, not production marks. No scannable barcode, assigned GTIN, serial, country of origin, company address or safety mark is fabricated.

| Zone | Required information once verified | Owner / release evidence |
| --- | --- | --- |
| A: product and market | Exact product model/SKU, actual rating/territory and finish; approved contents | SOURCE-02 and engineering master record; no mixed voltage/market cartons without an explicit controlled configuration |
| B: unit traceability | Unique serial where supported; batch/lot and a documented relation to product/packaging revision | Manufacturer traceability evidence; failed/missing serial or wrong label is a hold |
| C: trade-item ID | Correctly allocated GTIN at applicable each/case hierarchy; approved UPC/EAN or other carrier when required | Authorized GS1/company master-data owner; retailer/distributor specifications [SRC-07] |
| D: logistics ID | SSCC only where the shipping/buyer system requires it, plus human-readable logistical data | Authorized allocation and ASN/customer integration; not a substitute product SKU [SRC-07, SRC-11] |
| E: legal/safety/origin | Approved warnings, languages, manufacturer/importer/seller as required, actual origin and genuine authorized conformity marks | Qualified legal/regulatory/brand reviewers; no “Made in USA” or decorative certification logos |
| F: receiving and transport | Count, actual gross/net mass and dimensions, order/receipt reference, approved handling and material-disposal text | Measured packed sample, converter and logistics acceptance |

SKU, GTIN, serial, lot and logistics unit identity serve different purposes. The schema must keep them separate. A generic QR code does not replace a required barcode or warning. If used for care instructions, its destination and content require verification and must not silently collect guest data.

## 6. Converter and print handoff

The SVGs contain schematic solid cut-edge and dashed fold representations, reserved glue/label zones and named panels. They are not closed cutter paths. A packaging converter must create the actual production dieline from the measured module and board/process; supply a dimensioned structural drawing, 1:1 dieline, materials specification, print proof and assembled blank sample for review.

The production handoff must explicitly resolve:

- structural revision, units, inside/outside dimensions, board grade/caliper/flute and flute/grain direction;
- score allowances, closure design, glue/tape zones, tolerance stack, protective clearance and load paths;
- artwork orientation for each panel; separate cut, crease, perforation and glue layers; bleed, safety margins and quiet zones specified by converter/barcode rules;
- approved physical color standards, number of ink passes, trapping/overprint and coating constraints; screen HEX swatches are not press values;
- label adhesion/durability and barcode verification at final print/substrate/size, with scanning after handling;
- country/language variant and authorized safety-mark artwork, final legal text, signed versioned print proof;
- sample approval, incoming lot identification and change-control rules for materials, insert geometry, closure and artwork.

Do not pick arbitrary bleed, paper weight, barcode size or print tolerance just to make a drawing look finished. These values depend on the selected process and must be recorded by the responsible supplier/engineer. No supplier quote or proprietary dieline is placed in this public packet.

## 7. Quality and qualification plan

### Packout inspection proposal

Require at least: correct model/territory/finish; undamaged product and cordset; matching readable serial/lot; exact accessory/instruction count; seated protection module; separated cord/plug; no loads on controls/filter; closed case with correct count; version-correct labels; barcode check where applicable; measured weight consistent with the approved configuration. Define incoming, in-process and outgoing sampling with the qualified quality owner; no arbitrary AQL or “zero defects proven” claim is set here.

**Hold conditions:** wrong electrical market or identity, damaged cord/plug/casing, missing required protection/instructions, missing accessory defined by the packout, unapproved packaging substitutions, identity mismatch, or unreadable essential label. Record disposition and corrective action before release. Functional/electrical tests remain under the approved manufacturing/lab procedure, not the packaging operator's improvisation.

### Choose transport tests from the real route

ISTA distinguishes small-parcel, mixed less-than-truckload and unitized-load environments [SRC-06]. The engineer/lab must choose the current procedure for the actual shipping unit and route; an unopened full pallet and a single case replenishment shipment may need different evidence. A master carton is not a pallet just because it contains twelve dryers. No test times, drop heights, force limits or equipment parameters are copied or invented here.

Record the product/packaging BOM revision, sample quantity and preparation, route, conditioning, orientation, actual mass, test standard/version, prescribed sequence, predeclared damage/functional/label acceptance and final report. Inspect finish abrasion, cracked parts, displaced attachments, plug damage, module movement, wet/softened board, damaged labels and incomplete counts. Post-transit electrical/functional acceptance must use the qualified product procedure. Extend testing to humidity/warehouse stacking and the actual cleanability/return handling conditions when warranted.

Require a traceable approved report before any transit-tested claim. A successful mockup fit or arithmetic check proves neither protective performance nor recyclability. No physical test was run in this session.

## 8. Release sequence

1. Receive exact product/plug/accessory dimensions, weights, care instructions and allowed support surfaces.
2. Confirm buyer receiving route, case count, stockroom limits and room/storage workflows.
3. Fill the parameter model and commission converter samples only under separate authorization.
4. Conduct competent ergonomic, room-fit, abrasion, cleaning and distribution qualification; revise failures.
5. Approve final structural drawing, labels/claims, material specification and production packout QC through named owners.
6. Integrator/Chairman authorizes any commercial/physical pilot after all product/legal/commercial gates. A documentation PR does not release tooling, purchase packaging or install a product.
