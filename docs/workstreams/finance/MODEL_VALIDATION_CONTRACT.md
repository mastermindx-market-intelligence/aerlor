# Five-channel model validation contract

**2026-11-04 | Public mathematical specification | Proposal for the restricted workbook owner**

This document defines calculation behavior, not AERLOR prices, forecasts, accounting policy or permission to transact. Financial values and actual spreadsheet outputs belong only in the dedicated restricted workspace. The existing workbook was inaccessible; no claim is made that it passes, fails or already contains any requirement below.

## 1. Separate roles, evidence and arithmetic

| Route | Commercial amount to model | Critical distinction |
| --- | --- | --- |
| Direct hotel | Contractual invoice to the actual purchasing entity | Proposed retail positioning is not a hotel purchase price. |
| Portfolio/operator | Actual property orders under the arrangement | Total portfolio rooms are not orders; model onboarding once and property delivery costs separately. |
| Stocking distributor | Contractual manufacturer sell-in | End-hotel resale price is an informational field; changing it alone must not change manufacturer proceeds. |
| GPO/referral | Invoice to the actual buyer plus specified program deductions/fees | Network size creates neither invoice quantity nor a conversion rate. Record who pays each fee and its basis. |
| Amenities/licensed | Product-supply proceeds **or** a separately selected licensing role | A supplier paying a royalty and a pure licensor receiving royalties have different obligations; do not silently combine the two. |

The initial common formula applies to product-supply roles. A pure-licensor agreement needs a distinct private calculation and qualified accounting treatment. Channel names alone do not determine obligations or revenue recognition.

For each input, carry unit/currency, basis, date, scope, source and evidence state as specified in [the handoff](BROKER_AND_WORKBOOK_HANDOFF.md). Required `null`, nonfinite values or incompatible units block a valid calculation. Assumptions can support a clearly labeled scenario; passing arithmetic never upgrades their evidence state. Public reference code validates scalar arithmetic only, not source authenticity, scope or currencies.

## 2. Receipts and deductions

Let `Q` be billable shipped units, `P` contractual sell-in per unit and `B = Q × P`. Each deduction is an explicit amount or `rate × named_base`. Keep the basis dependency acyclic and state whether the input price already includes a discount.

- Same original base: `net = B × (1 − sum(rates)) − fixed_deductions`.
- Sequential reductions: `net = B × product(1 − rate_i) − fixed_deductions`.

These are alternative contract structures. Use neither indiscriminately for every fee. Mixed arrangements need separate, named bases in the private workbook. Avoid subtracting a distributor discount a second time from an already-net sell-in price. Separate collected taxes from commercial proceeds and ask the accountant to determine financial-statement classification.

Customer refunds reduce retained receipts once. Return freight, handling and replacement obligations are separate service costs. A deduction settled after the original invoice also needs its own dated cash event.

## 3. Lot cost and usable units

Define `C_lot` as the non-duplicated acquisition-cost bridge and `U` as usable units from purchased quantity `N`:

`unit_acquisition_cost = C_lot / U`, with `N > 0` and `0 < U <= N`.

Rejected units increase the cost allocated to usable stock. Do not also expense the same physical rejection through a second yield reserve. Zero usable units is a failed lot requiring visible loss treatment, not a zero-cost result. Planned service stock and samples can be usable units allocated to another purpose; they are not automatically manufacturing defects. Do not infer actual rejection or recovery rates from synthetic tests.

The customs-value bridge and inventory-cost bridge remain separate. Sources S04–S08 in [the import evidence](IMPORT_EVIDENCE_2026-11-04.md) support the distinction. For an applicable bounded ad valorem entry fee:

`entry_fee = min(cap, max(floor, customs_value × rate))`.

Apply this only to a confirmed applicable charge, with explicit current parameters and the correct entry scope. Sum the results for separately charged entries before allocating them. Specific, compound, content-based or replacement duty formulas require their own broker-confirmed bases; the bounded-fee helper is not a tariff engine.

## 4. Warranty, returns and contribution

Model expected replacement/RMA **event counts** per original sale, which may exceed one if repeat replacements are included:

`incremental_service = expected_replacements × replacement_event_cost + expected_RMAs × RMA_event_cost − collectible_recoveries`.

Replacement-event cost includes the additional replacement unit and its outbound handling/delivery. RMA-event cost includes return freight, inspection/handling and disposition. Original product cost belongs in initial product cost exactly once. Refunds already deducted from retained receipts must not be charged again as lost revenue. Recoveries need evidence and settlement dates; a returned unit is not automatically new saleable stock.

`order_contribution = retained_receipts − initial_product_cost − incremental_service − fulfillment − other_variable_obligations`.

Keep negative results visible. This is a defined commercial comparison measure, not automatically accounting gross profit. Fixed launch/lab/FTO/tooling/onboarding/insurance overhead must remain separately identified and charged once. For a constant positive contribution `c` and fixed cost `F`, `break_even_units = ceil(F / c)`. Nonpositive `c` has no finite break-even under those assumptions. Tiered pricing, MOQ, order fees and entry caps require evaluating the actual quantity-dependent function instead.

Acquisition cost per acquired account requires an explicitly observed or assumed denominator. With zero acquired accounts it is undefined; spend does not disappear. Do not count the same acquisition spend as both variable sales cost and a separate fixed deduction.

## 5. Cash and funding

Construct operating cash events with dates: supplier deposits/balances, product and inspection, freight/customs/taxes, warehousing, customer deposits and final receipts, commissions/rebates, refunds, replacements and evidenced recoveries. Apply customer deposits against the final receivable so they are not collected twice. Record supplier deposits separately from any remaining amount eligible for payment terms.

`cash_t = opening_cash + cumulative(operating_receipts − operating_payments)`.

`peak_external_need = max(0, −minimum(cash_t))`, **before financing draws**.

The public helper uses the conservative convention of same-day outflows before inflows when intraday settlement order is unknown; record that choice. A monthly cash total can conceal the payment needed before a later receipt. A DIO/DSO/DPO summary does not replace this event schedule. Outstanding payables, receivables, warranty tails and taxes beyond the visible horizon must remain visible or the scenario must be flagged incomplete.

A recoverable tax may create cash exposure without being a permanent economic cost. Its recoverability and timing require actual evidence. Financing availability, interest, FX, discounting, corporate taxes and accounting inventory capitalization are not supplied by the reference helper; the private model must address them when material.

## 6. Stress acceptance matrix

The eventual spreadsheet audit must record actual cell ranges, scenario input values, expected results, observed outputs and version privately. Tests of the standalone reference functions are explicitly narrower.

| Perturbation / edge | Required behavior | Verification route |
| --- | --- | --- |
| Missing, `NaN` or infinite scalar | Reject; no silent zero | Reference tests + actual-cell audit |
| Same-base versus cascading deductions | Distinct independently checked results | Reference tests + contract/cell mapping |
| End-hotel resale-only change | Manufacturer receipts unchanged | Reference tests + distributor-tab audit |
| Fewer usable units at fixed lot cost | Higher allocated unit cost; failed lot rejected | Reference tests + inventory reconciliation |
| Split entries with active fee floors/caps | Recalculate at each entry, not one blended per-unit fee | Reference tests + broker schedule reconciliation |
| Repeated replacements | Counts above one permitted; incremental costs grow | Reference tests + warranty cohort audit |
| Refund plus service handling | Refund subtracted once, handling separately | Reference tests + returns reconciliation |
| Zero/negative contribution or zero acquisitions | No invented finite break-even or zero CAC | Reference tests + scenario output review |
| Later customer receipt or earlier supplier deposit | Economic total may stay the same while peak cash worsens | Reference tests + dated bank/terms schedule |
| Lower sell-in, higher duty/freight, worse yield/failure, slower conversion | Directional impacts transparent; combinations remain loss-capable | Private workbook stress cases after real inputs are available |
| Changed SKU/origin/entry date, expired exclusion or quote | Revalidate affected evidence; no automatic carry-forward | Manual evidence gate; not implemented by scalar helpers |
| Mixed currency, recoverable tax, fee-base cycles, truncated cash horizon | Explicit conversion/recovery/dependency/horizon treatment | Manual workbook audit; not implemented by scalar helpers |
| Any arithmetic pass | Commercial, product and capital approval unchanged | Manual decision register; code creates no approval state |

## 7. Definition of completion for the next private step

The restricted model is reconciled only when its five-channel formulas, input evidence, units, stress cases and cash event reconciliation have been checked in the actual workbook and the results saved privately. Report which inputs remain assumptions. Broker confirmation, entity/insurance, product safety, funded purchaser terms and Chairman decisions are separate gates. This public specification and its synthetic tests meet none of those gates by themselves.
