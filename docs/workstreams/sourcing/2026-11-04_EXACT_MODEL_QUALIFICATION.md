# SOURCE-02 | Three-platform qualification decision

**Desk review: 2026-11-04 | Issue #6 | Public-safe evidence only | No approved supplier or product**

## Decision

**No screened candidate has a complete independently verified dossier for AERLOR's proposed 120 V / 60 Hz US guestroom application or for Canadian deployment.** This work identifies three named platforms from three advertised supplier identities and records why each remains on hold. It does not establish that their factories, ownership or designs are independent. No quotation, supplier response, physical sample, lab test or hotel acceptance was obtained.

**First evidence-request priority: Fubaobei YEY-GS8, specifically its advertised US/ALCI configuration.** Its regional protection claim gives a more precise question to verify than the other two candidates. This is a prioritization judgment, not a product-quality ranking or purchase recommendation. Nominal voltage, regional model suffix, certifier record and hotel warranty remain unresolved. All requests are [drafted but unsent](2026-11-04_EVIDENCE_REQUEST_PACK.md).

## 1. Scope and baseline

- Claimed task: [issue #6, SOURCE-02 START](https://github.com/mastermindx-market-intelligence/aerlor/issues/6#issuecomment-6628352329). New files only in `docs/workstreams/sourcing/`; adjacent safety/import questions inform #7 and #8 without claiming their completion.
- Start baseline on GitHub `main`: `632c79717d8bd0657ac8c93fa6397533cbe16ce0`; bootstrap PR #14 was merged. Before publication, `main` advanced externally to `2d6d5fe47c9036d311622e0436ed0ca6878cf61c` with website work. Its delta did not touch sourcing paths or `AGENTS.md`. The still-empty isolated sourcing branch was fast-forwarded to that newer publication base without merging or editing the other lane's work. [Strategy PR #1](https://github.com/mastermindx-market-intelligence/aerlor/pull/1) remained open at inspected head `22554c76f5468c02a138e12c5a008b5598bf8258`.
- Starting evidence: PR #1's [supplier longlist](https://github.com/mastermindx-market-intelligence/aerlor/blob/22554c76f5468c02a138e12c5a008b5598bf8258/docs/research/2026-11-04_ODM_SUPPLIER_LONGLIST.md), [RFQ](https://github.com/mastermindx-market-intelligence/aerlor/blob/22554c76f5468c02a138e12c5a008b5598bf8258/docs/business/ODM_QUALIFICATION_RFQ.md) and [competitive benchmark](https://github.com/mastermindx-market-intelligence/aerlor/blob/22554c76f5468c02a138e12c5a008b5598bf8258/docs/research/2026-11-04_PRODUCT_COMPETITION.md). New model-level source checks below do not elevate those proposals to approvals.
- Evidence dates and retrieval limits are recorded in the [source register](2026-11-04_SOURCE_REGISTER.csv). All accesses are dated 2026-11-04. An undated page is explicitly undated; crawl age is not a publication date.

### Status vocabulary

| Status | Meaning in this dossier |
| --- | --- |
| DOCUMENTED | The cited source actually says or displays the specified information. A documented supplier statement is still a supplier claim. |
| VERIFIED | Independent model-, configuration- and jurisdiction-matched evidence was inspected and supports the specific claim. **No candidate earns overall VERIFIED status.** |
| SUPPLIER-CLAIMED | A first-party product/company page advertises the feature or capability; no independent confirmation. |
| UNVERIFIED / HOLD | Evidence is missing, insufficient, ambiguous or inaccessible. This is not an assertion that certification does not exist. |
| DISQUALIFIED AS SPECIFIED | The observed configuration conflicts with this project's supply target. A differently specified variant is a new evidence case, not automatically disqualified. |
| INFERRED / PROPOSED | Our screening judgment or next-step design, rather than a tested result. |

## 2. Exact-platform comparison

These are distinct **advertised model identifiers**, not three independently approved ODM platforms. The numeric fields below are supplier statements, not measured values. Product URLs are the source/photo-reference locations; no dated specimen or nameplate photo was obtained for any candidate.

| Evidence priority / platform | Advertised manufacturer identity and manufacturing status | Electrical / protection evidence actually found | US / Canada decision |
| --- | --- | --- | --- |
| **1 — Fubaobei YEY-GS8, advertised US/ALCI configuration** | About page identifies **Shenzhen Jixiang Innovation Technology Co., Ltd.** as manufacturer; corporate registration and actual factory control unverified. [S08](https://www.fubaobei.com/about) | Exact page advertises US **1500 W with ALCI**, **50–60 Hz**; voltage/plug set at order stage. No numeric US voltage, regional suffix, protection-device ID or nameplate was established. [S07](https://www.fubaobei.com/product-yey-gs8) | **SUPPLIER-CLAIMED / HOLD** for both countries. Obtain fixed 120 V-compatible variant and matching evidence before sample decision. |
| **2 — Conason P1A** | Site identifies **Shenzhen Conason Technology Co., Ltd.** and calls itself a source factory; no independent factory/registration verification. [S06](https://conason.com/about-us/) | Product text lists **110 V, 220 V**, with generic temperature-control claims. Frequency, input power, exact plug and integral immersion-protection assembly were not established. Do not infer automatic dual voltage or a 120 V rating. [S05](https://conason.com/product/conason-high-speed-hair-dryer-with-110000-rpm-brushless-motor-p1a/) | **SUPPLIER-CLAIMED / HOLD**. The published voltage options do not settle the operating range of a real regional unit. |
| **3 — Chuangyu P6-WIRED** | Supplier terms identify **Dongguan Junwei Electronics Co., Ltd.**; homepage describes in-house manufacture. Neither statement is an official corporate/factory verification. [S02](https://www.mhairdryer.com/) [S03](https://www.mhairdryer.com/terms-en/) | Indexed exact-model page says **220–240 V** and lists CE/RoHS/FCC. Direct product-page retrieval, including its homepage link, returned **404**. Current specification therefore remains unconfirmed. [S01](https://www.mhairdryer.com/product/p6-wired-p6-wired-high-speed-bladeless-hair-dryer-en/) | **UNVERIFIED / HOLD**; the indexed 220–240 V configuration is **DISQUALIFIED AS SPECIFIED** for this 120 V project. Require a live regional datasheet; no inference that a US version exists. |

### Certification and construction evidence

| Platform | Claim versus exact listing/report | Quality, BOM and service evidence | Missing gate |
| --- | --- | --- | --- |
| YEY-GS8 | Product page includes generic UL and other scheme names, with documentation tied to destination/order. **No exact listing/control number, issuing lab, legal listing holder, US/Canada coverage or report was established.** [S07](https://www.fubaobei.com/product-yey-gs8) | Supplier advertises functional testing and selectable concentrator/diffuser packouts. This does not demonstrate controlled BOM, lot traceability, spare filters, safety-critical service procedures or a hotel-use warranty. | Q01–Q16 in request pack, especially regional nameplate, ALCI assembly, certifier record and hotel coverage. |
| P1A | About page makes a general UL claim; it is not a model-matched authorization. **No listing number, lab, holder, current status or Canadian scope was established.** [S06](https://conason.com/about-us/) | Advertised pre-shipment inspection is not audited QA. Product text does not establish spare-part continuity, BOM revision control, failure history or written hotel-use coverage. | Fixed regional SKU, basic electrical data and protection evidence before treating P1A as a North American candidate. |
| P6-WIRED | Homepage advertises ETL/cETL capability; indexed model page does not establish a corresponding listing. **No model-matched lab, number, holder or market scope was established.** [S02](https://www.mhairdryer.com/) [S01](https://www.mhairdryer.com/product/p6-wired-p6-wired-high-speed-bladeless-hair-dryer-en/) | Public B2B terms describe a 12-month specification warranty with wear/misuse/modification exclusions; hotel duty is not expressly settled. Homepage promises spare support; exact parts and enforceable support are unknown. [S03](https://www.mhairdryer.com/terms-en/) | Restore a verifiable live model definition and establish a separate suitable regional configuration first. |

**Shared gaps:** no candidate has independently verified manufacturing independence, frozen BOM, traceable sample, accepted commercial warranty, documented authorized repair route, exact-model safety evidence or legal FTO clearance. No EXW quote or landed cost was collected. No price, contact CRM or confidential supplier document is published here.

### A variant that must not be substituted

The Fubaobei **HD16 sensor** page calls its model **S01 (HD16 sensor version)** and specifies **220–240 V, 50 Hz, 1,400–1,600 W**, with Chinese/EU/UK plug options. That current advertised configuration is **DISQUALIFIED AS SPECIFIED** for this project's 120 V / 60 Hz target. It cannot inherit YEY-GS8's advertised US/ALCI configuration, and the S01 family name cannot establish interchangeable certification. This is a fourth, exclusion-only cross-check, not a fourth independently qualified supplier. [S09](https://www.fubaobei.com/product-hd16-smart-high-speed-hair-dryer)

## 3. Independent evidence checks and their limits

### Product safety and market scope

- **US immersion protection and corrected citation:** the current eCFR places the hand-supported-dryer provision at **16 CFR 1120.3(a)**; paragraph (b) concerns children's outerwear drawstrings. CPSC's FAQ retains an older (b)(1) cross-reference. Use the current regulation for the request. [R08](https://www.ecfr.gov/current/title-16/chapter-II/subchapter-B/part-1120/section-1120.3)
- **Incorporated versus current certification editions:** section 1120.4 specifies UL 859 tenth edition revised through June 3, 2010, and UL 1727 fourth edition revised through June 25, 2010. These are the incorporated references for the immersion-protection provision, not an assertion about the edition appropriate to a new full-product listing. The lab must map both the incorporated provisions and the actual intended-use certification scope. [R09](https://www.ecfr.gov/current/title-16/chapter-II/subchapter-B/part-1120/section-1120.4)
- **Certification nuance:** the CPSC 15(j) rule itself does not create section 14(a) testing/certification requirements. Therefore no universal “CPSC-certified dryer” or GCC obligation is inferred solely from it. Independent lab/mark and hotel-acceptance requirements in this package are AERLOR procurement gates plus whatever other laws actually apply. [R01](https://www.cpsc.gov/FAQ/Hand-Supported-Hair-Dryers)
- **Canada:** Health Canada directs users to recognized Canadian certification marks and provincial/territorial authorities. A US-only listing or a generic UL label is not evidence of the Canadian model's scope. [R02](https://www.canada.ca/en/health-canada/services/home-safety/electrical-products.html)
- **Provincial example:** Technical Safety BC describes acceptable certification/approval marks and field-approval pathways for BC. This is jurisdiction-specific guidance, not automatic clearance for all Canadian hotels or a recommendation to use field evaluation for a mass supply programme. [R03](https://www.technicalsafetybc.ca/regulatory-resources/regulatory-notices/approved-certification-marks-electrical-products)
- **Why protection evidence changes the shortlist:** CPSC's July 3, 2024 recall of Tideway PRO M01 high-speed dryers concerned missing immersion protection. This is an example of the failure mode, **not evidence that any screened supplier made that product**. [R04](https://www.cpsc.gov/Recalls/2024/Focusee-Recalls-Tideway-Hair-Dryers-Due-to-Electrocution-or-Shock-Hazard)

### Registry checks are not negative certification findings

Search-index queries combined P6-WIRED/Chuangyu, P1A/Conason and Dongguan Junwei with certifier domains. Returned results included unrelated products and out-of-domain pages. Consequently those searches **do not prove a complete directory search or absence of certification**. No candidate supplied a file/control number. Exact model, regional suffix and legal holder must be reconciled against the issuer's own record before status can change to VERIFIED. No false “registry clean” result is claimed.

| Actual bounded search attempt on 2026-11-04 | Observed outcome / what it cannot establish |
| --- | --- |
| `"P6-WIRED" (site.intertek.com OR site.intertekconnect.com OR site.ul.com OR site.csagroup.org)` | Unrelated results were returned; no valid certifier record established. |
| `"P1A" "Conason" (site.intertek.com OR site.intertekconnect.com OR site.ul.com OR site.csagroup.org)` | Supplier/irrelevant results were returned; no valid certifier record established. |
| `"Dongguan Junwei Electronics" (site.intertek.com OR site.intertekconnect.com OR site.ul.com OR site.csagroup.org)` | Other-company/product material did not establish a dryer listing. No company identity conclusion drawn from a name match. |
| Domain-restricted retries for `"Conason" "P1A"`, `"Chuangyu" "P6-WIRED"`, and `"Dongguan Junwei Electronics" hair dryer`, using Intertek/Intertekconnect/UL/ULProspector/CSA domains | Out-of-domain results remained. These cannot be represented as issuer-directory queries or exhaustive negative results. |

The issuer pathways were also inspected directly:

| Official route | Actual access outcome | Next evidence operation |
| --- | --- | --- |
| [Intertek Product Directories](https://www.intertek.com/directories/) and its linked ETL Listed search form [R05] | Both readable; form accepts company/model/standard searches. No candidate-specific listing result was obtained. | Once the exact holder and regional model/control number exist, inspect the actual ETL record and confirm its US/Canada scope. Intertek's form advises seeking issuer verification if a claimed product is in doubt. No contact was made. |
| [CSA Group Product Listing](https://www.csagroup.org/testing-certification/product-listing/) [R06] | Search fields/instructions readable; no candidate-specific result obtained. | Search actual manufacturer and listing identifiers and preserve the returned record, not a logo screenshot. |
| [UL Product iQ information route](https://www.ul.com/software/ul-product-iq) [R07] | Not accessible through the web retrieval tool in this session. No account created or account/access change attempted. | Use a legitimately available issuer record or authorized certifier confirmation when candidate identifiers are supplied. The inaccessible page is not a negative listing result. |
| [UL Product iQ public search](https://productiq.ulprospector.com/en/search) [R10] | Separate public search route identified by supporting research and directly read by the session owner; readable without creating an account. No candidate-specific record obtained. | Match model, legal holder and UL file; results may cover components rather than a finished dryer, and abridged output can omit portions of the full record. |

Intertek's certification guide separately describes the listing report, certification agreement, factory assessment and authorization to use its mark. The request therefore distinguishes a supplier-held test report from actual permission to mark the offered product. [R11](https://www.intertek.com/product-certification-marks/etl/guide/)

The Chinese National Enterprise Credit Information Publicity System public portal returned **403** during this session. That access path was stopped. English supplier names remain self-descriptions; no official Chinese registration, Unified Social Credit Code, ownership relationship or production address has been validated. [G01](https://www.gsxt.gov.cn/index.html)

## 4. Falsifiable next decisions

| Decision | Evidence that would permit reassessment | Evidence that keeps the candidate out |
| --- | --- | --- |
| Give YEY-GS8 first document-review priority | One existing regional model with numeric rating/nameplate, protection-device details, independent certifier record and report for that construction; written hotel-use terms. | Supplier only promises documentation with shipment, offers another SKU, or cannot bind the evidence to an existing product. |
| Retain P1A as a comparison lead | Fixed voltage/frequency/power/plug/protection configuration and genuine model-specific record, followed by the same common request fields. | Continuing reliance on the generic “UL” company claim or ambiguous voltage options. |
| Reopen Chuangyu investigation | Working datasheet for an identified North American variant and independently checkable holder/model evidence. | Only the inaccessible indexed 220–240 V listing or a promise to customize without a new configuration dossier. |
| Authorize controlled sample evaluation | Integrator reviews the complete evidence exceptions; qualified lab and broker establish a suitable lawful evaluation route; Chairman authorizes scope and capped cost. | Unknown identity, unresolved protection or import route, unapproved spend, or a demand to put unevaluated samples into guestrooms. |

**Design/FTO remains unverified for all candidates.** Public styling, supplier OEM offers, contract language and patents mentioned by salespeople cannot establish noninfringement. The request pack gives counsel a bounded task concerning the actual design, components, destination and proposed AERLOR branding; it does not provide a legal opinion.

**Import remains unverified for all candidates.** EXW/FOB terms, case size, origin, shipping mode, entry date, valuation, classification and live additional duties must be tied to a specific consignment. No total duty rate or landed economics is asserted. FINANCE-05 receives the blank comparison fields and broker scope, not invented quotations.

## 5. What this delivery establishes

The first sourcing task is delivered as an **evidence-gap decision**, with three specific advertised platforms, one additional incompatible variant, a common 20-question request set and a gated sample/professional-service schedule. It does not fulfill issue #6's later objective of three comparable **received** RFQs or independent factory qualification. Those require authorized external engagement and evidence not available in public pages.

Next safe action: independent document review and integration of this PR. After the Chairman separately authorizes supplier engagement and restricted storage access is verified, use the existing issue #6 owner to request Q01–Q08 from the YEY-GS8 supplier first; do not buy or promise a pilot. Record any received evidence in the dedicated Aerlor Product-and-Suppliers folder, then rerun model-specific review before expanding spend.
