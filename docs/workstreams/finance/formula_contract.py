"""Public mathematical reference; accompanying fixtures are non-commercial.

Amounts use one abstract normalized unit, normally with binary floating-point
arithmetic; break-even uses exact rationals from input strings as documented.
There is no accounting/currency rounding. This is not an AERLOR workbook,
tariff schedule, currency engine, evidence verifier, or approval mechanism.
Callers must separately verify scope, source evidence, applicability, currency,
fee/refund duplication, and completeness of operating cash events. No defaults
represent actual rates, commercial terms, financing, or company performance.
"""

from dataclasses import dataclass
from datetime import date
from fractions import Fraction
from math import ceil, isfinite
from numbers import Real


def _number(value, name, minimum=0):
    if isinstance(value, bool) or not isinstance(value, Real):
        raise ValueError(f"{name} requires an explicit real number")
    try:
        value = float(value)
    except (OverflowError, ValueError) as exc:
        raise ValueError(f"{name} must be finite") from exc
    if not isfinite(value) or (minimum is not None and value < minimum):
        raise ValueError(f"{name} must be finite and >= {minimum}")
    return value


def supplier_receipts(units, sell_in_price, *, informational_resale_price=None):
    """Supplier's own price is mandatory; downstream resale cannot set receipts."""
    units, price = _number(units, "units"), _number(sell_in_price, "sell-in price")
    if informational_resale_price is not None:
        _number(informational_resale_price, "informational resale price")
    return _number(units * price, "receipts")


def deduct_fees(gross, rates, *, basis):
    """Choose same-gross or sequential bases explicitly; rates are fractions."""
    gross = _number(gross, "gross")
    if basis not in ("gross", "cascade") or rates is None:
        raise ValueError("explicit rates and basis='gross' or 'cascade' required")
    rates = tuple(_number(rate, "fee rate") for rate in rates)
    if any(rate > 1 for rate in rates):
        raise ValueError("each deduction fraction must be <= 1")
    if basis == "gross":
        return _number(gross * (1 - sum(rates)), "net receipts", minimum=None)
    for rate in rates:
        gross *= 1 - rate
    return _number(gross, "net receipts")


def entry_capped_fee(base, rate, minimum, maximum):
    """One entry only. Applicability and every parameter require external proof."""
    base, rate = _number(base, "base"), _number(rate, "rate")
    minimum, maximum = _number(minimum, "minimum"), _number(maximum, "maximum")
    if minimum > maximum:
        raise ValueError("minimum cannot exceed maximum")
    uncapped = _number(base * rate, "uncapped fee")
    return min(maximum, max(minimum, uncapped))


def accepted_unit_cost(lot_cost, purchased_units, accepted_units):
    """Allocate the stated lot cost across accepted units, excluding failed yield."""
    cost = _number(lot_cost, "lot cost")
    purchased = _number(purchased_units, "purchased units")
    accepted = _number(accepted_units, "accepted units")
    if not 0 < accepted <= purchased:
        raise ValueError("require 0 < accepted units <= purchased units")
    return _number(cost / accepted, "accepted unit cost")


def warranty_cost(*, expected_replacements, replacement_unit_cost,
                  replacement_freight, expected_rmas, rma_service_cost):
    """Additional cost per original sale; expected repeat-event counts may exceed 1.

    Excludes original product cost and refunds. RMA service includes only its
    additional handling/freight; recovered stock or supplier credits are unmodeled.
    """
    replacements = _number(expected_replacements, "expected replacements")
    stock = _number(replacement_unit_cost, "replacement unit cost")
    freight = _number(replacement_freight, "replacement freight")
    rmas = _number(expected_rmas, "expected RMAs")
    service = _number(rma_service_cost, "RMA service cost")
    return _number(replacements * (stock + freight) + rmas * service, "warranty cost")


def contribution(receipts_before_refunds, *, original_product_cost,
                 fulfillment_cost, channel_cost, acquisition_spend,
                 warranty_rma_cost, refunds):
    """Same-scope totals; refunds are deducted here exactly once by caller contract.

    Original goods and incremental warranty costs are separate. Negative results
    remain visible. This cannot detect costs/refunds already embedded in inputs.
    """
    receipts = _number(receipts_before_refunds, "receipts", minimum=None)
    costs = (original_product_cost, fulfillment_cost, channel_cost,
             acquisition_spend, warranty_rma_cost, refunds)
    total = sum(_number(cost, "cost or refund") for cost in costs)
    return _number(receipts - total, "contribution", minimum=None)


def break_even_units(fixed_cost, unit_contribution):
    """Constant contribution only; quantity-dependent schedules are unmodeled.

    After numeric validation, str(input) defines an exact rational value. Thus
    decimal literals use their displayed decimal values, avoiding binary division
    crossing an integer boundary. No tolerance erases a genuinely higher input.
    """
    _number(fixed_cost, "fixed cost")
    unit = _number(unit_contribution, "unit contribution", minimum=None)
    if unit <= 0:
        raise ValueError("nonpositive unit contribution has no finite break-even")
    return ceil(Fraction(str(fixed_cost)) / Fraction(str(unit_contribution)))


def acquisition_cost(spend, acquired_customers):
    spend = _number(spend, "acquisition spend")
    customers = _number(acquired_customers, "acquired customers")
    if customers == 0:
        raise ValueError("CAC undefined with zero acquired customers")
    return _number(spend / customers, "acquisition cost")


@dataclass(frozen=True)
class CashEvent:
    when: date
    inflow: float
    outflow: float


@dataclass(frozen=True)
class CashResult:
    peak_funding: float
    minimum_cash: float
    trough_date: date | None
    closing_cash: float


def peak_cash(events, opening_cash):
    """Dated operating events only; caller must exclude financing draws/repayments.

    Same-day convention: aggregate ALL outflows before ALL inflows. Earliest
    strict trough wins; None means opening cash is the trough. No event omissions,
    duplicate events, beyond-horizon obligations, or currency mismatches are
    detected. The result is an arithmetic funding gap, not financial viability.
    """
    cash = _number(opening_cash, "opening cash", minimum=None)
    trough, trough_date, days = cash, None, {}
    if events is None:
        raise ValueError("explicit event collection required")
    for event in events:
        if not isinstance(event, CashEvent) or type(event.when) is not date:
            raise ValueError("each event requires a calendar date and amounts")
        outgoing, incoming = days.setdefault(event.when, [0.0, 0.0])
        days[event.when] = [
            _number(outgoing + _number(event.outflow, "outflow"), "daily outflow"),
            _number(incoming + _number(event.inflow, "inflow"), "daily inflow"),
        ]
    for when, (outgoing, incoming) in sorted(days.items()):
        cash = _number(cash - outgoing, "cash after outflows", minimum=None)
        if cash < trough:
            trough, trough_date = cash, when
        cash = _number(cash + incoming, "cash after inflows", minimum=None)
    return CashResult(max(0.0, -trough), trough, trough_date, cash)
