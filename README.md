# AERLOR

**The art of a better stay.** An editorial hospitality website for hairdryers, illuminated makeup mirrors and curling tools, each in Lite and Premium expressions.

[Storefront](https://aerlor.vercel.app/) · [Native Paper foundation](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0) · [Commerce operations](docs/commerce/OPERATIONS.md) · [Commercial launch gates](LAUNCH.md)

## R3 implementation

- **33 semantic HTML routes**: collection/family pages, six complete product pages, comparison, hospitality, wholesale, groups, designers, pricing, resources, journal, company, support, policies, project bag, checkout and order verification.
- Story-led hotel copy, attributed independent guest anecdotes and a room-level investment calculator. No fabricated testimonials, hotel partnerships or revenue uplift.
- **Ten downloadable PDFs / 36 pages**: collection lookbook, hotel business-case guide, procurement guide, pilot toolkit and six product briefs. Guides are embedded in dedicated resource pages with direct-download alternatives.
- Original product concept artwork, progressive Three.js hairdryer, finish selection, responsive navigation and accessible product/brief interactions.
- Product-only project bag with quantity/finish editing, bundles and local persistence. Personal inquiry and payment details are not saved in browser storage.
- Genuine user-reviewed business-email drafts and complete local brief downloads. Optional direct inquiry adapter returns success only after its provider accepts delivery.
- Server-authoritative hosted checkout, provider price corroboration, durable stock reservation/idempotency, verified payment status and signed webhook processing. **Live checkout is disabled until commercial prerequisites are approved.**

## What is not represented

The six products are development concepts, not certified production units or ready-to-ship stock. Product specifications clearly distinguish the design identity, proposed direction and technical fields still requiring evidence. No commercial prices are invented. A project brief is not an order; a payment return URL is not proof of payment; payment is not shipment.

The transaction code is tested with dependency-injected provider fixtures. Real merchant, database, verification, email-delivery and fulfillment acceptance are separate gates. See the operations runbook; do not relabel mocked tests as live paid-order proof.

## Development

Use Node 26, matching CI and `.nvmrc`.

```sh
npm ci
npm run build
npm run preview
npm run test:contracts
npm run test:server
npx playwright install chromium
npm test
```

The isolated local preview runs at `http://127.0.0.1:4188/aerlor/` and includes the same Web Standard API handlers, in fail-closed development mode. `BASE_PATH=/` builds for Vercel; `/aerlor/` is the local/static default. HTML is generated deterministically from `scripts/build-storefront.mjs` and the catalog; do not hand-edit generated inner pages. The original R2 homepage template is retained under `templates/`.

```sh
node scripts/commerce-readiness.mjs
# Read-only exact deployment proof:
TEST_URL=https://aerlor.vercel.app/ EXPECTED_COMMIT=<40-character-sha> npm run verify:deployment
```

Never put credentials into client variables, source, screenshots, issues or generated documents. `.env.example` contains blank secrets and disabled activation flags.

## Documents and evidence

```sh
node scripts/build-marketing-documents.mjs
python3 scripts/verify-marketing-pdfs.py
```

The document generator uses Playwright and authored HTML. PDF QA needs `pdftoppm`, PyMuPDF and Pillow. The repository includes final PDFs, source documents, a page manifest and a visual-review receipt. Generated render scratch files remain under ignored `test-results/`.

`src/evidence.json` records the attributed sources and limitations. Anecdotes are self-selected public discussions, not AERLOR endorsements or representative surveys. Operator examples are explicitly historical/category context where appropriate.

## Design continuity

The R2 native Paper file contains 15 editable artboards, three pages and 28 tokens. Its palette and type exports remain the shared foundation in `src/paper-tokens.css`, guarded by a drift test. R3 expands the production codebase; its 33 routes are not falsely described as 33 newly exported native Paper boards. Native references and screenshots remain in `design/paper/native/`.

## Deployment architecture

The storefront and same-origin APIs run on Vercel. GitHub Pages publishes only `showcase-dist/`, a non-transactional design/engineering case study with no checkout or inquiry collection. It does not host the commercial application. This respects GitHub's published Pages ecommerce restrictions.

The pinned workflow runs type/build checks, contracts, server/domain tests and desktop/mobile browser checks before publishing the separate Pages showcase. The post-deployment check binds the public build to the exact commit. Vercel releases must also be checked against `build-info.json`, live API configuration, routes, PDFs and actual browser journeys. See `DEPLOYMENT.md`.

## Source map

```text
src/catalog.json                 Product concepts and specification status
src/storefront.ts                Product bag, filters, forms and hosted-checkout handoff
src/storefront.css               Responsive editorial interface
src/main.ts, src/scene.ts         Existing homepage interactions and progressive 3D
shared/domain.mjs                Pure rules shared by browser/server/tests
server/                          Payment, inquiry, validation and durable-ledger adapters
api/                             Web Standard Vercel entry points
scripts/build-storefront.mjs      Deterministic multi-page authoring source
scripts/build-design-showcase.mjs Non-transactional GitHub Pages artifact
marketing/                       Authored PDF sources, manifest and quality review
public/documents/                Ten finished PDFs
public/images/                   Original concept artwork
```

Custom visuals and code are reserved to the project owner. Dependencies retain their licenses. No standalone font binaries are distributed. The website remains `noindex` while product release and commercial activation are pending.
