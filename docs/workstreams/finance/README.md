# FINANCE-05 — Import evidence and model validation

**2026-11-04 | Issue #8 | Public-safe methods and research | Proposal**

This package prepares the inputs and checks needed to reconcile AERLOR's restricted channel-economics workbook. It does **not** contain the workbook, supplier quotes, buyer prices, company financial results, a customs filing, or a verified total duty rate. It completes one bounded preparation task within [issue #8](https://github.com/mastermindx-market-intelligence/aerlor/issues/8); it does not close that issue or the FINANCE-05 lane.

## What the integrator can use now

| Artifact | Use |
| --- | --- |
| [Import evidence](IMPORT_EVIDENCE_2026-11-04.md) | Primary-source findings, effective dates and limits on product-specific applicability. |
| [Broker and workbook handoff](BROKER_AND_WORKBOOK_HANDOFF.md) | Unsent request specification, required private inputs, evidence states and exact receiving-owner actions. |
| [Model validation contract](MODEL_VALIDATION_CONTRACT.md) | Five channel routes, calculation boundaries, cash timing and stress acceptance criteria. |
| [Formula reference](formula_contract.py) and [tests](test_formula_contract.py) | Dependency-free mathematical checks with synthetic, abstract units only. No tariff or company defaults. |
| [Session return](SESSION_RETURN.md) | Baseline, completed verification, access limitation, unresolved gates and next action. |

The main new safeguards are separate customs valuation and landed-cost ledgers, entry-date-specific public fee evidence, explicit sell-in and fee bases, separate physical rejection/refund/replacement treatment, and event-based cash exposure. Passing the reference tests proves those example calculations only. It does not prove that an inaccessible spreadsheet implements them or that a commercial order is viable.

## Scope and custody

- Claimed task: [FINANCE-05 START on #8](https://github.com/mastermindx-market-intelligence/aerlor/issues/8#issuecomment-6628366974).
- Base `main`: `632c79717d8bd0657ac8c93fa6397533cbe16ce0`; branch `work/finance/import-evidence-controls-20261104`.
- Strategy PR #1 inspected at `22554c76f5468c02a138e12c5a008b5598bf8258`; it was open and unmerged at intake. Its existing workbook was described in the private company navigation, but not inspected in this session.
- Owned public write scope: `docs/workstreams/finance/` only. Other lanes, shared coordination files, website source and PR #1 remain under their existing owners.
- Both dedicated Aerlor Drive root and finance-folder metadata requests returned `NOT_FOUND` through the available connection. Permission inspection and private-workbook read/write were therefore blocked. An empty folder-list result is **not** evidence that the finance folder is empty.
- No account switch, alternative-host access, permission change, public sharing, or upload of restricted material was attempted. This follows root `AGENTS.md`'s access-denial instruction.

## Reproduce the mathematical checks

From the repository root with Python 3.10 or later:

```bash
python -m unittest discover -s docs/workstreams/finance -p 'test_*.py' -v
```

No network, credentials, third-party packages or company data are needed. Public statutory numbers appear only in the dated evidence note, not as calculator defaults. The reference module is a comparison aid for the future private workbook; it is not wired into the website, deployment, CI admission or any approval system.

## Next receiving action

The integrator should arrange a connection authorized for the **existing dedicated Aerlor finance folder**, verify permissions, then assign one writer to audit a copy of the existing workbook. Preserve the original, reconcile all five channels against this contract, and record actual cell-level results privately. Qualified broker, sourcing, purchaser and legal evidence are still required. No outreach, spending or launch authorization is granted by this package.
