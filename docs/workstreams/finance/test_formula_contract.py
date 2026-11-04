"""NON-COMMERCIAL fixtures: abstract normalized scalars, not prices or duty rates.

Passing tests prove only this reference's stated arithmetic, never source
correctness, actual workbook implementation, viability, or authorization.
Run: python -m unittest discover -s docs/workstreams/finance -p 'test_formula_contract.py' -v
"""

from datetime import date, datetime
from itertools import permutations
import unittest

from formula_contract import (
    CashEvent, accepted_unit_cost, acquisition_cost, break_even_units,
    contribution, deduct_fees, entry_capped_fee, peak_cash,
    supplier_receipts, warranty_cost,
)


class FormulaContractTests(unittest.TestCase):
    def test_supplier_receipts_ignore_resale(self):
        self.assertEqual(supplier_receipts(4, 3, informational_resale_price=5), 12)
        self.assertEqual(supplier_receipts(4, 3, informational_resale_price=900), 12)
        self.assertEqual(supplier_receipts(0, 3), 0)
        with self.assertRaises(ValueError):
            supplier_receipts(4, None, informational_resale_price=5)

    def test_gross_and_cascade_bases_are_distinct(self):
        self.assertEqual(deduct_fees(16, [0.25, 0.5], basis="gross"), 4)
        self.assertEqual(deduct_fees(16, [0.25, 0.5], basis="cascade"), 6)
        self.assertEqual(deduct_fees(16, [], basis="gross"), 16)
        self.assertEqual(deduct_fees(16, [0.75, 0.75], basis="gross"), -8)
        for basis, rates in ((None, []), ("guess", []), ("gross", None), ("gross", [2])):
            with self.subTest(basis=basis, rates=rates), self.assertRaises(ValueError):
                deduct_fees(16, rates, basis=basis)

    def test_entry_fee_floor_middle_cap_and_split(self):
        self.assertEqual(entry_capped_fee(4, 0.5, 3, 8), 3)
        self.assertEqual(entry_capped_fee(10, 0.5, 3, 8), 5)
        self.assertEqual(entry_capped_fee(40, 0.5, 3, 8), 8)
        self.assertEqual(sum(entry_capped_fee(20, 0.5, 3, 8) for _ in range(2)), 16)
        with self.assertRaises(ValueError):
            entry_capped_fee(4, 0.5, 8, 3)
        with self.assertRaises(TypeError):
            entry_capped_fee(4, 0.5, 3)  # No implicit maximum or tariff defaults.

    def test_yield_cost_monotonicity_and_invalid_yield(self):
        self.assertEqual(accepted_unit_cost(24, 8, 6), 4)
        costs = [accepted_unit_cost(24, 8, accepted) for accepted in (8, 6, 4)]
        self.assertEqual(costs, [3, 4, 6])
        for purchased, accepted in ((8, 0), (0, 0), (8, 9)):
            with self.subTest(accepted=accepted), self.assertRaises(ValueError):
                accepted_unit_cost(24, purchased, accepted)

    def test_repeat_replacement_and_rma_are_additional(self):
        additional = warranty_cost(expected_replacements=2, replacement_unit_cost=4,
                                   replacement_freight=1, expected_rmas=1,
                                   rma_service_cost=2)
        self.assertEqual(additional, 12)  # Two extra goods/freights plus one service.
        self.assertEqual(contribution(30, original_product_cost=4, fulfillment_cost=1,
                                      channel_cost=0, acquisition_spend=2,
                                      warranty_rma_cost=additional, refunds=3), 8)

    def test_refund_once_and_negative_contribution_visible(self):
        costs = dict(original_product_cost=4, fulfillment_cost=0, channel_cost=0,
                     acquisition_spend=0, warranty_rma_cost=0)
        self.assertEqual(contribution(10, refunds=2, **costs), 4)
        self.assertEqual(contribution(10, refunds=10, **costs), -4)
        self.assertEqual(contribution(10, refunds=0, **costs)
                         - contribution(10, refunds=2, **costs), 2)

    def test_break_even_and_cac_boundaries(self):
        self.assertEqual(break_even_units(13, 4), 4)
        self.assertEqual(break_even_units(0, 4), 0)
        self.assertEqual(acquisition_cost(12, 3), 4)
        self.assertEqual(acquisition_cost(0, 3), 0)
        for unit in (0, -1):
            with self.assertRaises(ValueError):
                break_even_units(13, unit)
        for spend in (0, 12):
            with self.assertRaises(ValueError):
                acquisition_cost(spend, 0)

    def test_break_even_exact_decimal_boundary(self):
        self.assertEqual(break_even_units(0.14, 0.01), 14)
        self.assertEqual(break_even_units(0.14000000000000004, 0.01), 15)
        self.assertEqual(break_even_units(0.010000000000000002, 0.01), 2)

    def test_explicit_zero_differs_from_missing_or_invalid_negative(self):
        day = date(2000, 1, 1)
        operations = (
            lambda x: supplier_receipts(1, x),
            lambda x: deduct_fees(x, [], basis="gross"),
            lambda x: entry_capped_fee(1, x, 0, 1),
            lambda x: accepted_unit_cost(x, 1, 1),
            lambda x: warranty_cost(expected_replacements=x, replacement_unit_cost=1,
                                    replacement_freight=0, expected_rmas=0,
                                    rma_service_cost=0),
            lambda x: contribution(0, original_product_cost=x, fulfillment_cost=0,
                                   channel_cost=0, acquisition_spend=0,
                                   warranty_rma_cost=0, refunds=0),
            lambda x: break_even_units(x, 1),
            lambda x: acquisition_cost(x, 1),
            lambda x: peak_cash([CashEvent(day, 0, x)], 0).peak_funding,
            lambda x: peak_cash([CashEvent(day, x, 0)], 0).closing_cash,
        )
        for operation in operations:
            self.assertEqual(operation(0), 0)
            for invalid in (None, -1):
                with self.subTest(operation=operation, invalid=invalid), self.assertRaises(ValueError):
                    operation(invalid)

    def test_cash_uses_dates_and_same_day_outflows_first(self):
        first, second, third = date(2000, 1, 1), date(2000, 1, 2), date(2000, 1, 3)
        events = [CashEvent(first, 10, 7), CashEvent(second, 0, 8), CashEvent(third, 6, 0)]
        for ordering in permutations(events):
            result = peak_cash(ordering, opening_cash=2)
            self.assertEqual((result.peak_funding, result.minimum_cash,
                              result.trough_date, result.closing_cash), (5, -5, first, 3))
        combined = peak_cash([CashEvent(first, 10, 7)], 2)
        split = peak_cash([CashEvent(first, 10, 0), CashEvent(first, 0, 7)], 2)
        self.assertEqual(combined, split)
        self.assertEqual(peak_cash([], -2).peak_funding, 2)
        self.assertIsNone(peak_cash([], -2).trough_date)

    def test_delayed_receipts_cannot_reduce_peak_funding(self):
        first, second, third = date(2000, 1, 1), date(2000, 1, 2), date(2000, 1, 3)
        outgoing = [CashEvent(second, 0, 8)]
        early = peak_cash(outgoing + [CashEvent(first, 10, 0)], 2)
        late = peak_cash(outgoing + [CashEvent(third, 10, 0)], 2)
        self.assertEqual((early.peak_funding, late.peak_funding), (0, 6))
        self.assertEqual(early.closing_cash, late.closing_cash)

    def test_earlier_supplier_payment_increases_peak_funding(self):
        first, second, third = date(2000, 1, 1), date(2000, 1, 2), date(2000, 1, 3)
        receipt = [CashEvent(second, 10, 0)]
        early = peak_cash(receipt + [CashEvent(first, 0, 8)], 2)
        late = peak_cash(receipt + [CashEvent(third, 0, 8)], 2)
        self.assertEqual((early.peak_funding, late.peak_funding), (6, 0))
        self.assertEqual(early.trough_date, first)
        self.assertEqual((early.closing_cash, late.closing_cash), (4, 4))

    def test_missing_nonfinite_and_invalid_inputs_fail(self):
        for bad in (None, float("nan"), float("inf"), -float("inf"), True, "3"):
            operations = (
                lambda: supplier_receipts(bad, 1),
                lambda: deduct_fees(1, [bad], basis="gross"),
                lambda: entry_capped_fee(1, bad, 0, 1),
                lambda: accepted_unit_cost(1, 1, bad),
                lambda: warranty_cost(expected_replacements=bad, replacement_unit_cost=1,
                                      replacement_freight=0, expected_rmas=0,
                                      rma_service_cost=0),
                lambda: contribution(1, original_product_cost=bad, fulfillment_cost=0,
                                     channel_cost=0, acquisition_spend=0,
                                     warranty_rma_cost=0, refunds=0),
                lambda: acquisition_cost(1, bad),
                lambda: break_even_units(1, bad),
                lambda: peak_cash([CashEvent(date(2000, 1, 1), bad, 0)], 0),
            )
            for operation in operations:
                with self.subTest(bad=bad, operation=operation), self.assertRaises(ValueError):
                    operation()
        with self.assertRaises(ValueError):
            supplier_receipts(1e308, 1e308)  # Finite inputs may still overflow.
        with self.assertRaises(ValueError):
            peak_cash([CashEvent(datetime(2000, 1, 1), 1, 0)], 0)
        with self.assertRaises(ValueError):
            peak_cash(None, 0)


if __name__ == "__main__":
    unittest.main()
