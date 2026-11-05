# AERLOR

**Better tools. Better stays.** A buyer-led guestroom technology website for hairdryers, illuminated mirrors and styling tools in Lite and Premium ranges.

[Live website](https://aerlor.vercel.app/) · [R4 native Paper design](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-4-0) · [Design decisions](design/precision-r4/DESIGN_DECISIONS.md) · [Commerce operations](docs/commerce/OPERATIONS.md)

## R4: precision hospitality

R4 replaces the warm beauty-editorial treatment with a premium-technology system: Inter typography, white and graphite surfaces, neutral silver product studies and a restrained copper accent. It restructures the buyer journey rather than simply changing colours.

- **33 semantic HTML routes** for the collection, six products, comparison, hotel purchasing, groups, specifiers, resources, company information and transactional journeys.
- Clear navigation: Products, For hotels, Resources, About and Discuss a project.
- Dedicated product pages lead with the model, room fit, finish, quantity and next action. Technical release information and documentation remain close to the decision.
- Original studio presentation models and **19 rendered views** across the three families. The homepage loads a lightweight image first; 3D inspection is explicitly requested, keyboard-operable and optional.
- **Nine native R4 Paper artboards, 25 tokens and 2,740 native nodes**. The dedicated page includes desktop/mobile layouts, collection, product, hotel, project and foundation boards. Text and frames are editable; product artwork remains a separate asset.
- **Ten PDFs / 36 pages**, restyled in the same R4 system: collection overview, hotel upgrade guide, procurement checklist, pilot toolkit and six product briefs.
- Product-only project bag, quantities, finishes, bundles, local brief downloads and a user-reviewed business-email draft.
- Existing server-authoritative checkout and inquiry adapters are preserved. This design release does not activate real payments or manufacture commercial readiness.

## Commercial status

The six products remain development concepts. Technical fields distinguish collection identity, proposed design and evidence still required. No final performance, certification, stock or price is invented. The property form prepares a real email draft when the contact endpoint is configured; the visitor reviews and sends it in their own email application.

Direct inquiry submission and checkout remain disabled until the responsible seller, released models, pricing, inventory, provider configuration and applicable commercial terms are approved. Provider-fixture tests are not live merchant acceptance. See [LAUNCH.md](LAUNCH.md) and the [operations runbook](docs/commerce/OPERATIONS.md).

## Development

Use Node 26, matching `.nvmrc` and CI.

```sh
npm ci
npm run build
npm run preview
npm run test:contracts
npm run test:server
npx playwright install chromium
npm test
# Optional Safari-engine suite:
npx playwright install webkit
npm run test:webkit
```

The isolated preview is `http://127.0.0.1:4194/aerlor/`; the dev server uses port 5194. `BASE_PATH=/` builds for Vercel. The local/static default is `/aerlor/`. All route HTML is authored through `scripts/build-storefront.mjs` and shared components in `scripts/r4/ui.mjs`; do not edit generated pages by hand.

```sh
# Read-only runtime configuration inspection:
node scripts/commerce-readiness.mjs
# Verify an exact public source revision:
TEST_URL=https://aerlor.vercel.app/ EXPECTED_COMMIT=<40-character-sha> npm run verify:deployment
```

## Design and documents

The new system starts with the native Paper direction and tokens, then reconciles the final browser layouts into native editable artboards. [The R4 handoff](design/precision-r4/README.md) contains board IDs, native JSX references and screenshots. R2 native references remain archived in `design/paper/native/`; they are not the active visual direction.

```sh
# With the local dev server running, regenerate missing original studio PNGs:
node scripts/r4/render-products.mjs
python3 scripts/r4/export-web-assets.py
# Regenerate and inspect the actual PDFs:
node scripts/build-marketing-documents.mjs
python3 scripts/verify-marketing-pdfs.py
```

The PDF workflow uses authored HTML, `marketing/print.css`, Playwright, `pdftoppm`, PyMuPDF and Pillow. Rendering is followed by visual review. Browser test output is temporary; durable release evidence belongs under `design/previews/`.

## Verification scope

R4 local verification: **55 Chromium checks and 55 WebKit checks passed**, plus one intentional desktop duplicate of a mobile-only navigation test skipped per engine. Coverage includes all 33 routes, 320-pixel reflow, fonts unavailable, product selection, quote drafts, download integrity, inaccessible services, optional 3D, keyboard controls and automated accessibility rules. Server/domain tests cover payment and inquiry invariants using controlled provider fixtures. Native design review and actual public deployment proof are separate checks.

## Deployment

Vercel serves the storefront and same-origin API handlers. GitHub Pages publishes only `showcase-dist/`, a non-transactional design/engineering case study. It does not host checkout or collect buyer data. The pinned workflow builds and verifies the application before publishing the separate showcase. Public verification checks the exact build commit, responsive layout, assets, 3D on request, API configuration, PDFs and custom 404.

## Source map

```text
scripts/r4/ui.mjs                 Shared page components and buyer copy
scripts/build-storefront.mjs      The 33-route content and structure
src/precision-tokens.css          Actual native R4 Paper token export
src/style.css, storefront.css     Precision responsive interface
src/catalog.json                 Product concepts and specification status
src/storefront.ts                 Bag, filters, forms and checkout handoff
src/main.ts, studio-models.ts     Optional product inspection and original models
shared/, server/, api/            Existing commerce/inquiry rules and adapters
design/precision-r4/              Native designs, JSX, screenshots and decisions
marketing/, public/documents/     Ten versioned guides and product briefs
```

Custom visuals and code are reserved to the project owner. Dependencies retain their licenses. No standalone font binaries are distributed. The website remains `noindex` while product release and commercial activation are pending.
