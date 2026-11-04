# AERLOR | Parallel Session Handoff Directory
**2026-11-04 | Version 1.0 | Source: GitHub `mastermindx-market-intelligence/aerlor`**

These are **ready-to-paste assignments**, not evidence that any worker or ChatGPT session has started. Each must load [AGENTS.md](../../AGENTS.md) and [PROJECT_BOOTSTRAP](../PROJECT_BOOTSTRAP.md), check current source/PR/issue status, claim its own task, and execute under the connected tools it actually has.

## Choose a lane

| ID | Role | First valuable output | GitHub/public write owner | Private working area |
| --- | --- | --- | --- | --- |
| MARKET-01 | Procurement/GT-M researcher | Buyer authority and live project spec decision path | `docs/workstreams/market/` | Aerlor Drive `01-Market-and-Distribution` |
| SOURCE-02 | Product sourcing and safety research | Exact-model compliance and 3 independently verifiable ODM candidates | `docs/workstreams/sourcing/` | Aerlor Drive `02-Product-and-Suppliers` |
| DESIGN-03 | Industrial, room and packaging designer | A manufacturable human-centered product/packout specification | `design/packaging/` + `docs/workstreams/design/` | Aerlor Drive `03-Design-Packaging-and-Brand` |
| SITE-04 | Web and brand implementation | Honest B2B concept UX, source-coded on isolated PR | `src/`, `index.html`, `public/`, `tests/` | Aerlor Drive design folder if needed |
| FINANCE-05 | Commercial economics/legal analyst | Confidential channel terms, true landed-cost/risk and entity decision | `docs/workstreams/finance/` for nonsecret outputs | Aerlor Drive `04-Finance-Legal-and-Confidential` |
| REVIEW-06 | Independent QA/evidence reviewer | Evidence and readiness audit against buyer, lab, brand and web claims | `docs/workstreams/review/` | Aerlor Drive source archive if needed |
| INTEGRATOR | CEO integration owner | Cross-lane judgment, Chairman escalations, PR integration | `docs/coordination/` and PR review | Notion company HQ |

- [01 — Market / distribution](01-market-distribution.md)
- [02 — Sourcing / compliance](02-sourcing-compliance.md)
- [03 — Industrial design / packaging](03-product-packaging-design.md)
- [04 — Brand / web](04-brand-website.md)
- [05 — Finance / legal](05-finance-legal.md)
- [06 — Independent review](06-review-integration.md)

## How to open multiple sessions manually

Open **separate chats** (or use an actually available authorized session/worker launch tool), one per lane. Paste the text under each role file's **Launch prompt**; read its exact role file and source pointers. Cross-session memory is not assumed. At most one writer per target path/branch; avoid all six agents editing the same README or `AGENTS.md`.

Before work, each session reports/records:
1. ID and bounded task/issue, source commit, target paths, and relevant access.
2. Which file/branch/Drive doc it will own; what another session must not edit.
3. What it will verify and how completion is observed.
4. Any external action requiring Chairman approval.

**Do not ask a session to “own the whole company”.** Give a bounded lane and measurable task. An agent with no GitHub write access may produce a ready-to-apply patch, but must never claim its document was saved.

## Lock/claim etiquette

No custom locking service is invented. Use existing **GitHub issues and PRs**: record in a relevant issue comment the lane, branch and owned paths; read issue comments before taking it. The integrator resolves collisions. Separate Notion and Drive pages/docs can each have one active writer; don't update shared Notion HQ wholesale while another session edits it.

## Return format

```text
AERLOR SESSION RETURN
Session lane:
Mission/issue and observable done condition:
Baseline branch/40-character Git SHA:
Documents/source URLs inspected:
Files and branches written, commit SHA/PR URL:
Private Drive/Notion work product URL (only for permitted readers):
Documented findings; explicit assumptions/unknowns:
Checks actually performed and their results:
Contact/action status: NOT SENT / SENT (with evidence) / NOT AUTHORIZED:
Conflicts/stop conditions and Chairman decision required:
Next exact in-scope action and integration owner:
```

Handoff consumers must **read the actual source** before treating a “finished” report as verified.

## Scheduling and background execution

A saved brief does **not** launch a ChatGPT session. Notion Custom Agent discovery in this connection was access-gated on 2026-11-04; do not assert Notion sessions are running. The existing Subagent Fabric, when available, is a separate bounded execution capability subject to its own admission and owner rules; no agent inherits it just because the tool is listed.

Project links:
- [GitHub repo](https://github.com/mastermindx-market-intelligence/aerlor)
- [Strategy PR #1](https://github.com/mastermindx-market-intelligence/aerlor/pull/1)
- [Notion HQ](https://app.notion.com/p/40ea491acd7a81dfb599e4c7585e52ac?pvs=204)
- [Private Aerlor Drive](https://drive.google.com/drive/folders/1yYsYi5Evu0AE2fTHixoTw5OCvdKNW-Bh)
