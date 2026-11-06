# AERLOR R9 — Editorial Business Solutions

## Verified design lineage

- Native editable Paper: [R9 Solutions + Professional](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-9-1), within existing AERLOR file `01M6JNN71ZN4867VJZ83PPXQZ0`.
- Earlier R6 Solutions designs are retained at [p-7-0](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-7-0); R9 is the new editorial and professional design direction, not a replacement of historical file content.
- R9 native artboards:
  - `5HR-1` — Business Solutions desktop flagship
  - `5HS-1` — Salons & Stylists desktop
  - `5HT-1` — Private Business Planner desktop
  - `5HU-1` — Solutions mobile 390px
  - `5HV-1` — Salons mobile 390px

## What materially changed

R8 proved the information architecture and functional routes but many sectors inherited the same generic layout and product photography. R9 makes the visitor's **use environment** the organizing principle:

1. Photo-led hero with consumer-grade production value and dedicated business intent.
2. Four differentiated core-sector cards and four specialty avenues; original salon station diagram rather than fake salon installation photos.
3. Three practical planning principles and an editorial product-detail section on the Solutions homepage.
4. Seven tailored vertical stories with distinct headlines, buyer problems, usage contexts, examples, potential evaluation questions and next steps.
5. Lite and Premium design-concept galleries with links to existing product pages. Final specs and commercial suitability remain subject to proof.
6. Expanded accessible FAQs and real purchasing/engineering gates; no invented partners, specifications, pricing, or stock.
7. A redesigned private buyer planner: step-oriented form, live preview, industry-specific evaluation questions, validation, downloadable .txt or explicit clipboard copy. No remote POST, personal-data fields, persistence or implied delivery.
8. Original in-repository `public/images/solutions/salon-station-study.svg`, an SVG illustration of mirror/vanity, chair, power, dryer rest and operator flow. This is explicitly labeled conceptual, NOT an electrical drawing.

## Code pointers

- `scripts/solutions-pages.mjs` — R9 brand/copy/industry layout and route generation.
- `src/solutions.css` — premium UI, mobile responsiveness, keyboard/focus and accessible contrast.
- `src/solutions-brief.ts` — local-only preview and brief creation.
- `public/images/solutions/salon-station-study.svg` — independently authored vector illustration.
- `tests/solutions.spec.ts` — responsive, accessible, route, image-decoding and private download/copy coverage.
- `scripts/build-storefront.mjs` — all 42 original + Solutions routes, with prior commerce gating.

## Local visual QA screenshots

Captured directly from the isolated preview at 1440px desktop and 390px mobile, with image decoding completed first. They represent a working browser, **not** production deployment:

| Screenshot | View |
|---|---|
| `solutions-desktop.png` | Full Solutions landing, four core sectors, original diagram, product edit and FAQ |
| `solutions-mobile.png` | Full mobile Solutions page |
| `salons-desktop.png` | Full professional salon buyer journey |
| `salons-mobile.png` | Salon mobile flow |
| `planner-desktop.png` | Side-by-side form and live project preview |
| `planner-mobile.png` | Responsive planner |
| `spas-desktop.png` | Wellness industry page |
| `fitness-desktop.png` | Dark club industry hero |
| `navigation-mega-desktop.png` | Expanded desktop Solutions mega-menu |
| `navigation-open-mobile.png` | Expanded mobile Solutions disclosure |

## Verification and evidence

The test suite reports are run against the branch's isolated HTTP preview, not the live AERLOR production storefront. Summarize results only after they actually complete.

- `npm run build` — PASS (42 routes, TypeScript and Vite).
- `npm run test:contracts` — 14 PASS.
- `npm run test:server` — 39 PASS.
- Chromium `tests/storefront.spec.ts`, desktop and mobile — 36 PASS.
- Chromium `tests/solutions.spec.ts`, desktop and mobile — 18 PASS, 2 intentional platform skips.
- WebKit combined `tests/solutions.spec.ts` + `tests/storefront.spec.ts` run — 53 PASS, 2 intentional platform skips, 1 tooling-only trace cleanup error (`browserContext.close` ENOENT for a `.network` trace file) on mobile 320px reflow.
- WebKit isolated retry of that exact mobile 320px reflow test, with tracing disabled — 1 PASS. No layout assertion failure was observed.
- Combined coverage therefore verifies all intended test cases, though the original all-in-one WebKit run did not finish cleanly because of the runner artifact error.
- Accessibility: all nine Solutions routes audited with axe WCAG 2A/AA/2.1AA on desktop/mobile, after fixing actual small-type color contrast issues.
- Responsive geometry check: 320, 390, 768 and 1024px; no horizontal scroll on checked Solutions views.
- Image decode test: all nine Solutions routes; original vector asset validated as SVG XML and successfully rendered in browser.
- Private planner test: changing environment, market, stations, locations and priority updates summary and questions; download and copy create text on the user's device; no POST or localStorage.

## Integrity and release boundary

This source remains a **pre-commercial design prototype**, not commercial launch proof. External inquiry transmission, seller/corporate verification, tax, payment activation, provider acceptance, certification, warranty, product inventory, customs and pricing remain separately gated. No deployment or merge is performed by this visual hardening task. Concurrent campaign-image PR #23 is independent; do not assert its changes are included in this PR. Keep the private Google Drive buyer, supplier and financial details out of this public repository.
