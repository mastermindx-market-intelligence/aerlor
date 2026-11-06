# Broker and restricted-workbook handoff

**2026-11-04 | FINANCE-05 / issue #8 | Request specification: UNSENT**

This is a public-safe field specification. Populate it only in the dedicated, permission-verified Aerlor finance workspace. No broker engagement, request transmission, customs filing, quoted cost or company economics is represented as completed. The supporting authorities and their limits are in [the evidence note](IMPORT_EVIDENCE_2026-11-04.md).

## 1. The question to resolve

For one precisely identified product/configuration, origin and anticipated entry, what costs are payable by the actual importing and selling entities, under which authorities and commercial terms, on what dates? Return an itemized worksheet and supporting evidence, rather than one unexplained total tariff percentage or a marketplace delivered-price screenshot.

**Receiving owner:** integrator assigns the private finance writer; SOURCE-02 supplies the exact product dossier; a qualified licensed customs broker provides import treatment. The Chairman separately authorizes any paid engagement or outward communication.

## 2. Required private inputs and evidence

| Group | Required fields | Evidence / acceptance condition |
| --- | --- | --- |
| Product | Exact manufacturer model, BOM/revision, materials, functions, wattage, voltage, accessories and packaging configuration | Match the quoted, classified and tested product. A generic dryer family or render is insufficient. SOURCE-02 owns the product facts. |
| Transaction parties | Seller, buyer, importer of record, consignee, related-party relationships and contract chain | Actual authorized entity records, held privately. A brand name or GitHub organization is not an importer identity. Issue #13 owns entity decisions. |
| Origin | Manufacturing country, supporting production facts and broker's origin rationale | Distinguish origin from shipment route, invoice currency, brand positioning and seller domicile. No assumed preferential origin. |
| Entry scope | Destination jurisdiction, planned entry/withdrawal date, transport mode, port, entry type and shipment/entry count | Recheck if any scope element changes. A US worksheet does not cover Canada. Separate any bonded/FTZ, sample, repair or special treatment. |
| Classification | Proposed full classification, applicable notes/rulings and explanation for the exact configuration | Broker determination tied to the current schedule revision; record the retrieved revision and date. A six-digit research heading is insufficient for filing. |
| Valuation | Invoice amount/currency, broker-selected FX basis, packing, assists, selling commissions, relevant royalties/proceeds, included-item flags and supported exclusions | Build a valuation bridge. Include each amount only once. Ask the broker whether transaction value is acceptable and which alternative method is needed if it is not. |
| Duty components | Authority, provision, applicability, assessment base, rate type, rate/amount, effective period, interaction with other provisions | One row per component. Cover ordinary duties, applicable Chapter 99 provisions, exclusions and other trade remedies; record positive and negative applicability determinations with reasons. Do not sum incomparable bases. |
| Exclusions | Exact provision, product description match, origin match, validity and any transit/entry deadline | Source + broker confirmation. Expired or merely plausible exclusions cannot reduce the evidenced result. |
| Processing fees | Entry-level MPF applicability/base/minimum/maximum and fiscal year; HMF mode/port/exemption review; other government charges | Apply caps/floors at the proper entry scope before allocating to units. Reconcile government charges with the broker invoice and avoid duplicate pass-throughs. |
| Logistics | Named Incoterm/place/version, supplier invoice inclusions, origin handling, freight, insurance, broker service, bond, destination handling, exam/storage contingencies and inland delivery | Written scope for who pays each line. Separate quoted charges from contingencies. Incoterms do not supply payment dates or title-transfer terms. |
| Product/service costs | Inspection, packout, accepted-unit yield, warehousing, fulfillment, initial delivery, warranty/RMA, replacement stock, recoveries and disposal | Exact scope and unit basis; unknown failure rates or recoveries remain assumptions. Avoid charging the same defect through both yield loss and an extra reserve. |
| Commercial deductions | Channel route, actual sell-in, invoice discounts, retroactive rebates, referral/GPO fees, license basis, commissions, returns and payment fees | Contract or explicit scenario assumption for each base and timing. Hotel resale price does not establish manufacturer receipts. |
| Fixed commitments | Samples, lab/FTO, tooling, setup, insurance, channel onboarding and ongoing overhead | Separate one-time, recurring and incremental costs. Evidence must distinguish a quote from an authorized commitment. Allocation is not a second cash outflow. |
| Cash | Supplier deposits and balance milestones, transit/stock days, customer deposit/application, invoices, DSO, refunds, rebate settlement, payables, taxes and available funding | Dated cash events and inventory/receivable/payable roll-forwards; no assumed supplier credit against prepaid stock. |

The importer identity, quotes, commercial documents, counterparties, receipts, numerical scenarios and completed worksheet all remain restricted. This public template intentionally supplies none of those facts.

## 3. Evidence state rules

Every private input needs `value`, `unit/currency`, `basis`, `scope`, `status`, `source reference`, `source/access dates`, `validity`, and `responsible reviewer`. Keep facts and scenarios in separate columns or tabs.

| Status | Meaning | Permitted use |
| --- | --- | --- |
| UNKNOWN / BROKER UNVERIFIED | Required evidence is missing or not applied to the exact entry | Block an evidenced total; do not coerce blank to zero. |
| ASSUMED | Deliberately chosen sensitivity input | Labeled scenario only; never promoted by formula success. |
| SUPPLIER CLAIMED / QUOTED | A specific party supplied a statement or offer | Use within its stated scope/expiry; it is not independent validation or a binding company acceptance. |
| DOCUMENTED PUBLIC RULE | An official source was retrieved | Rule existence is documented; exact-product applicability can remain unresolved. |
| BROKER CONFIRMED INPUT | A qualified broker applied current authority to the documented entry facts | Retain the private signed/reviewed worksheet and recheck changed facts; this is not product safety or launch approval. |
| TESTED | A specified calculation or observation was actually checked | Record the test, version and result; it does not establish an untested commercial input. |
| APPROVED / CONTRACTED | A real authorized decision or executed agreement exists | Record exact scope/date/evidence separately. Neither state is created by this package. |

A documented zero is different from an unknown. For a non-applicable charge, record the reason and evidence; do not silently delete the row. Preserve raw quotes and avoid overwriting historical inputs when refreshing rates.

## 4. Workbook integration checklist after access is available

1. Verify the dedicated Aerlor account/folder and restrictive permissions. Inspect the original workbook's actual tabs, formulas, sources and version before changing anything. Create a separately named working copy and record its ID; do not overwrite another writer's artifact.
2. Inventory existing logic first. Map each input and output to [the model contract](MODEL_VALIDATION_CONTRACT.md). Record actual defects or missing coverage; this session makes no claim about defects in the inaccessible workbook.
3. Use distinct input, calculation, output, scenario and evidence areas. Make editable assumptions visually distinct; add source comments, units, dates, basis and validation. Formula cells should be distinguishable from inputs, with unknowns displayed explicitly.
4. Reconcile direct hotel, portfolio, stocking distributor, GPO/referral and amenities/licensed economics. A documented royalty-only arrangement needs its own treatment, not inventory costs invented for an unperformed supply role.
5. Run the synthetic reference cases and the stress matrix against actual workbook cells. Keep the mapping, input snapshots, observed values and expected results in restricted Drive. A Python pass without spreadsheet readback is insufficient.
6. Produce separate labels for `SCENARIO`, `INPUTS EVIDENCED`, `CALCULATIONS CHECKED` and the actual decision status. No numerical threshold here grants authority to spend, file, promise availability or install a product.

## 5. Readiness and decisions

| Next action | Evidence required before it | Decision owner |
| --- | --- | --- |
| Audit the existing private workbook | Authorized dedicated-folder access and a named single writer | Integrator / Drive administrator |
| Request broker or specialist work | Approved representation, exact question, private attachments and quoted/capped scope if paid | Chairman; no request sent here |
| Prepare a sample/lab budget | Exact candidate dossier, test scope, itemized costs and source of funds | SOURCE-02 + FINANCE-05 prepare; Chairman decides |
| Evaluate a paid pilot | Qualified purchaser requirements, exact-market safety, entity/insurance/warranty evidence and reconciled cash requirements | Relevant lane owners prepare; Chairman decides |
| Consider commercial stock | Actual purchase/activation terms, current import worksheet, downside economics, peak cash coverage and supplier/service obligations | Integrator presents; Chairman decides |

**Current state:** preparation delivered; private workbook access and exact-entry commercial evidence remain unresolved. No capital amount is proposed or authorized from unverified data.
