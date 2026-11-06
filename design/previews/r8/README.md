# AERLOR R8 — Business Solutions / verified web implementation

**Design source:** [R6 Paper Solutions page](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-7-0)
**Implementation branch:** `work/site/solutions-r8-hardening-20261104`
**Source base:** `887862f50f1d2444bfbf8b90df646290222713cf` (main before this branch)

## Scope

- Replace hotel-only desktop navigation with a fully navigable, keyboard-accessible **Solutions** disclosure, showing four core sectors plus four specialty sectors; keep the Products menu separate.
- Add a usable, expanded mobile Solutions list with accessible disclosure semantics.
- Expand the 33-route storefront to **42 routes**, preserving every original commerce, product, document and hotel route.
- Add the cross-industry Solutions index and dedicated industry pages for salons, spas, fitness clubs, residences, travel, academies and studios.
- Preserve existing `/hospitality/` as the hotel buyer's dedicated industry destination.
- Offer a local-only project planner at `/solutions/brief/` with industry deep linking, required-field validation, downloadable UTF-8 brief, no personal identifier fields, no server submission and no misleading receipt.
- Match the Paper premium technology identity: Inter, graphite/white contrast, restrained silver-gray, original AERLOR design-study images.

## Design provenance and visual QA

Screenshots below were captured in headless Chromium against this branch's own isolated preview on port 4197, not the production storefront. They are baseline review artifacts, not evidence that the branch was deployed.

| Screenshot | View |
| --- | --- |
| `solutions-desktop.png` | Full business-solutions desktop landing |
| `solutions-mobile.png` | 390px landing and sector directory |
| `salons-desktop.png` | Full desktop salon buyer journey |
| `salons-mobile.png` | 390px salon flow |
| `navigation-mega-desktop.png` | Desktop Solutions disclosure expanded |
| `navigation-open-mobile.png` | Mobile Solutions disclosure expanded |
| `planner-desktop.png` | Local-only business brief |

Screenshots were reviewed for hierarchy, spacing, typography, clipping and mobile layout; automated tests verified no horizontal overflow across all 42 routes and at 320px across existing inner pages.

## Real implementation references

- `scripts/solutions-pages.mjs` — sector data, layouts, copy and brief page
- `scripts/r4/ui.mjs` — shared navigation, footer and stylesheet
- `src/solutions.css` — desktop/mobile styles and reduced-motion handling
- `src/solutions-brief.ts` — local project brief behavior
- `src/storefront.ts` — multiple accessible desktop nav disclosures
- `scripts/build-storefront.mjs` — all nine additional generated routes
- `tests/solutions.spec.ts` — industry links, menu focus, local-only proof, responsive checks, WCAG

## Verified in the isolated local branch

- `npm ci --no-audit --no-fund` — completed
- `npm run build` — completed (42 HTML pages generated)
- `npm run test:contracts` — 14 passed
- `npm run test:server` — 39 passed
- `TEST_URL=http://127.0.0.1:4197/aerlor/ npx playwright test tests/solutions.spec.ts --project=desktop --project=mobile` — 10 passed, 2 intentionally skipped (platform-specific tests)
- `TEST_URL=http://127.0.0.1:4197/aerlor/ npx playwright test tests/storefront.spec.ts --project=desktop --project=mobile` — 36 passed
- `TEST_URL=http://127.0.0.1:4197/aerlor/ npx playwright test tests/solutions.spec.ts --config playwright.webkit.config.ts --project=desktop --project=mobile` — 10 passed, 2 intentional platform skips
- `TEST_URL=http://127.0.0.1:4197/aerlor/ npx playwright test tests/storefront.spec.ts --config playwright.webkit.config.ts --project=desktop --project=mobile` — 36 passed
- Automated accessibility tests on Solutions, salon and brief screens returned zero serious or critical WCAG 2A/AA/2.1AA violations in Chromium and WebKit

## Remaining commercial gates

These concept pages do **not** announce product availability or constitute a real received sales inquiry. Contact, contract, exact SKU performance and commercial-use approvals, market-specific electrical evidence, pricing, stock, privacy policy and a legitimate lead endpoint remain separate release prerequisites. The local project brief intentionally sends nothing and stores no personal data. Product images remain preproduction design visualizations, not proof of production hardware or active partnerships.

## Other concurrent site work

Open PR #23 contains separate campaign-imagery edits; this branch does not modify those campaign assets or claim to include that unmerged PR. Rebase/merge review must reconcile against #23 if it merges first.
