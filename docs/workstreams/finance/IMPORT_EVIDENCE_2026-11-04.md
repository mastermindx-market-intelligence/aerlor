# Import evidence: rule existence versus exact-entry applicability

**Accessed 2026-11-04 | FINANCE-05 / #8 | United States research scope**

## Finding

The two CBP bulletins cited in the earlier [issue #8 checkpoint](https://github.com/mastermindx-market-intelligence/aerlor/issues/8#issuecomment-6626005268) are real and were retrieved. They support a change in the cited duty regimes, **not an all-in rate for an AERLOR product**. USITC's current information page confirms a more recent HTS revision, and the fiscal-year fee schedule must also match the entry date. Product classification, origin, valuation, additional-duty interactions and exclusions still need the exact-model broker worksheet required by AERLOR's project instructions.

No supplier quote, actual entry date, broker conclusion, company cost or validated commercial scenario was available to this task. Nothing below is an instruction to file a customs entry or an approval to import.

## Source register

All sources below were accessed on 2026-11-04. Publication/effectiveness dates are shown only where observed. Source paraphrases are deliberately narrow; public rules are not private transaction evidence.

| ID / primary source | Date and observed fact | Model implication / remaining limit |
| --- | --- | --- |
| S01 — [CBP CSMS #67834313](https://content.govdelivery.com/accounts/USDHSCBP/bulletins/40b11c9) | Issued February 22, 2026. Ends collection of the specified IEEPA duties for entries/warehouse withdrawals on or after February 24, 2026 at 12:00 a.m. Eastern. Explicitly leaves other duties, including Sections 232 and 301, unaffected. | Do not carry forward an obsolete IEEPA assumption; equally, do not infer that all additional duties disappeared. It does not determine this SKU's complete current duty stack. |
| S02 — [CBP CSMS #69326983](https://content.govdelivery.com/accounts/USDHSCBP/bulletins/421d887) | Issued July 23, 2026; describes Section 301 forced-labor-related duties effective July 24. China heading 9903.05.31 carries an additional 12.5% subject to specified exceptions. The bulletin includes product/exemption provisions and Chapter 98/99 filing instructions. | This is a conditional component in a dated regime. Neither the country label nor the headline percentage establishes its application to a particular dryer, exclusion or future entry. Recheck subsequent changes. |
| S03 — [USITC Harmonized Tariff Information](https://www.usitc.gov/harmonized_tariff_information) | The retrieved announcement says 2026 HTS Revision 22 was published October 30, 2026. | Pin the reviewed schedule and applicable notes. A revision announcement is not a product classification ruling or proof that all additional duties were reconciled. |
| S04 — [19 U.S.C. 1401a](https://uscode.house.gov/us/usc/119-118/t19/s1401a/) | The retrieved House text states currency through Public Law 119-120, October 7, 2026. Transaction value includes specified additions when not already included and sufficiently evidenced; international shipment transport/insurance is excluded from the defined price paid/payable. The statute also addresses limitations and other valuation methods. | Maintain a separate customs-value bridge. Do not apply duties mechanically to factory price or to the entire landed-cost total. Obtain broker review of assists, packing, royalties, related parties and exclusions. |
| S05 — [19 CFR 24.23](https://www.ecfr.gov/current/title-19/chapter-I/part-24/section-24.23) | eCFR displayed currency through November 2, 2026. Provides the formal-entry MPF mechanism and exceptions, and explicitly says listed fixed dollar amounts are base-year amounts subject to fiscal-year adjustment. | Calculate the applicable fee at entry scope; do not use the unadjusted CFR floor/cap as current values or apply them separately to each product unit. |
| S06 — [Official Federal Register PDF, 91 FR 48398–48400](https://www.govinfo.gov/content/pkg/FR-2026-07-31/pdf/2026-15530.pdf) | Published July 31, 2026, effective October 1, 2026. Table 2 and footnotes list FY2027 formal-entry MPF minimum $34.58, maximum $670.86, with the ad valorem rate unchanged at 0.3464%. Table and footnotes were visually checked against the PDF. | These are public government fee parameters, not AERLOR commercial inputs. Broker must confirm applicability, value basis, entry count and any exemption/surcharge. Refresh for the actual entry; they are not calculator defaults. |
| S07 — [19 CFR 24.24](https://www.ecfr.gov/current/title-19/chapter-I/part-24/section-24.24) | eCFR displayed currency through November 2, 2026. Describes the 0.125% harbor fee for covered commercial-vessel cargo/ports, subject to exemptions and special rules. | Keep transport mode, port and exemption review. Do not add an ocean-port fee automatically to every air or other shipment. |
| S08 — [International Trade Administration: Know Your Incoterms](https://www.trade.gov/know-your-incoterms) | Retrieved page explains cost/risk responsibilities and named places/version. It also says Incoterms do not determine payment timing or title transfer. No publication date was shown. | A delivered quote needs an inclusions bridge to prevent double-counting freight/duties. Obtain actual deposit, balance, credit and title terms separately; do not infer them from EXW/FOB/DDP labels. |

## Changes to the decision process

1. **Three separate ledgers:** customs valuation, acquisition/landed economics, and dated cash. A tooling assist can affect customs value without becoming a second supplier payment. A prepaid acquisition can create cash exposure before inventory is sold.
2. **Component-level import treatment:** preserve authority, tariff provision, assessment basis, effective date and exemption rationale for each row. A blank rate is unresolved; a documented zero needs its own evidence.
3. **Per-entry calculation:** use the appropriate fee schedule for each actual entry, apply its applicable floor/cap, then allocate. Shipment splitting can alter fees even if the product quantity is unchanged.
4. **No automatic price advice:** the private financial case still depends on actual sell-in, costs, service obligations and cash timing. This evidence package establishes no acceptable selling price or capital requirement.

These are proposed model controls inferred from S01–S08 and the existing operating-model requirements; they are not assertions about the inaccessible workbook's current formulas.

## Retrieval and interpretation limits

- The USITC information page was readable. The dynamic `https://hts.usitc.gov/` page returned no readable lines in the parent's retrieval, and a direct Revision 22 detail-page request failed. Neither outcome was treated as proof of a zero rate or absent provision.
- The CBP customer-service article on invoice value returned a loading/CSS page on direct open. Search snippets were not used as the accepted authority; the primary statute S04 supports the valuation distinction.
- The FY2027 notice was checked using the official `govinfo.gov` PDF rather than relying solely on a third-party summary or the FederalRegister.gov informational rendering.
- The earlier research heading `8516.31` remains a candidate classification context, not an assigned AERLOR classification. No exact-model classification opinion, comprehensive current Chapter 99 reconciliation or exclusion eligibility was established here.
- The package does not validate Canadian tariff, tax, certification or importer treatment. A Canada scenario requires its own authorities and qualified review; a Canadian seller does not itself settle US origin or tariff treatment.

## Required next evidence

Use [the unsent broker-input specification](BROKER_AND_WORKBOOK_HANDOFF.md) to prepare one exact-SKU, exact-entry worksheet in restricted Drive. SOURCE-02 supplies product and origin evidence; the authorized finance owner reconciles the private workbook; the broker confirms import treatment. Refresh this dated source register when the contemplated entry changes. The integrator must keep #8 open until its actual restricted-model and broker acceptance conditions are met.
