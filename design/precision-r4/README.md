# R4 native Paper handoff — Precision hospitality

[Open the R4 Paper page](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-4-0) · [Design rationale](DESIGN_DECISIONS.md) · [Live website](https://aerlor.vercel.app/)

**File:** `01M6JNN71ZN4867VJZ83PPXQZ0`
**Page:** `p-4-0`, `03 / R4 / Precision hospitality`
**Observed:** nine artboards, 2,740 native nodes and 25 R4 tokens. Native tokens hash: `f27aa63e`.

## Native artboards

| Board | Native ID | Width | Purpose |
| --- | --- | --- | --- |
| Initial home direction | `1BE-0` | 1440 | Direction authored in Paper before the implementation rewrite |
| Home / desktop | `1ON-0` | 1440 | Full product-led homepage |
| Home / mobile | `1CJ-0` | 390 | Full mobile hierarchy and navigation |
| Collection / desktop | `211-0` | 1440 | Category filters and six-product presentation |
| Product / desktop | `29P-0` | 1440 | Premium dryer, product action and technical brief |
| Product / mobile | `2M6-0` | 390 | Premium mirror, responsive buying panel and specification |
| Hotels / desktop | `2Y9-0` | 1440 | Owner, procurement and operations journey |
| Project / desktop | `3B1-0` | 1440 | Wholesale brief and inquiry workflow |
| Foundations | `3L5-0` | 1440 | Palette, typography, controls and design principles |

The old R2 pages remain preserved. R4 is a dedicated page, not an overwrite of the earlier design history.

## What is editable

Navigation, headings, body text, forms, tables, cards, buttons and layout frames are native Paper elements. Original rendered product studies are image assets. No entire website page was flattened into an image to masquerade as an editable design.

Initial direction and tokens were authored natively. After implementation, the final browser layouts were reconciled into the native file using bounded component groups. This is a deliberate design/code reconciliation workflow, not a claim that all 33 routes were generated from nine JSX files.

## Exported assets

- `tokens.css` is the actual native R4 export. The implementation copy is `src/precision-tokens.css`, checked for drift.
- `reference-jsx/` contains native JSX readbacks with repo-relative image references and no machine paths. They are design references, not a replacement for the application's responsive logic or event handlers.
- `screenshots/` contains native screenshots of every artboard.
- `native-manifest.json` records the IDs, route associations and readback verification.
- Selected section screenshots make typography, product detail, specification and form review easier without zooming out a long artboard.

## Visual review

The native direction, desktop and mobile home layouts, category cards, product overview, mobile specification table, project form and foundations were visually inspected. Secondary label contrast was aligned with the browser fixes. The project consent label was explicitly wrapped and re-rendered; it does not extend beyond its form container.

The live site has separate browser acceptance. Paper verifies the design artifact; it does not prove responsive behavior, email delivery, checkout or deployment.

## Product status

The models and images are original presentation studies, not validated production CAD or evidence of material, thermal, electrical or performance specifications. A sophisticated technology aesthetic does not imply unverified smart sensors, connected functions or competitive equivalence.
