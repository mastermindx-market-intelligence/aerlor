# AERLOR

**The essentials. Reimagined.** Premium product design for the modern hotel room. Hairdryers, illuminated mirrors and styling tools in Lite and Premium ranges.

[Website](https://aerlor.vercel.app/) · [R5 editable Paper design](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-6-0) · [Design handoff](design/precision-r5/README.md) · [Commerce operations](docs/commerce/OPERATIONS.md)

## R5: premium technology, built around the hotel buyer

A graphite product stage, white space, Inter typography and restrained metal finishes replace the previous cosmetics/editorial identity. The homepage establishes the product range and guest relevance; the hotel path provides a practical purchasing journey.

- **33 semantic HTML routes**, with six full product pages, comparison, hotel buying, wholesale, groups, specifiers, resources and company information.
- A product-led homepage using the founder's preproduction imagery, a three-family range, Lite/Premium comparison and a direct hotel-project route.
- Product galleries with selectable views, explicit finish captions, quantity controls, specification access and a project handoff.
- The optional, keyboard-operable 3D geometry study is secondary on the flagship product page and never blocks the first view. It is not presented as production CAD.
- **Five new editable R5 Paper artboards / 530 nodes**: home and flagship product on desktop/mobile, plus the hotel-buyer journey. Native JSX, screenshots and IDs are saved in `design/precision-r5/`. Earlier R4 foundations and 25 native tokens remain the shared design lineage.
- **Ten PDFs / 36 pages**, restyled and refreshed to match the current product and typography direction.
- Existing project bag, filters, finish selection, bundles, brief downloads, email-draft workflow, budgeting calculator and gated checkout remain functional.

The exact production revision is exposed by the deployed `build-info.json`; source and deployment verification are separate. GitHub Pages hosts the non-transactional design showcase, not the storefront.

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
