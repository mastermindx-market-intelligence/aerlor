# AERLOR deployment

## Targets and boundaries

- Source: `mastermindx-market-intelligence/aerlor`, production branch `main`.
- Storefront and same-origin server functions: https://aerlor.vercel.app/.
- GitHub Pages: https://mastermindx-market-intelligence.github.io/aerlor/ — **R5 design/engineering showcase only**, not an ecommerce host.
- Native Paper foundation: https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0.

GitHub's Pages limits prohibit using Pages as free hosting for an online business or ecommerce site: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits. R5 separates the application from the non-transactional showcase rather than pretending a static Pages origin can run payment or email services.

## Build artifacts

`npm run build` generates the 33-route application into `dist/`. On Vercel it runs with `BASE_PATH=/`; the local verification base is `/aerlor/`. Vercel also deploys the five root `api/*.js` functions and their imported server/shared modules. The private product-contact setting and credentials belong in server environment variables, never the public repository.

`npm run build:showcase` generates `showcase-dist/` separately. Only this directory is uploaded to GitHub Pages. It contains project documentation, reviewed design screenshots, styles, a 404 page and build metadata. It has no form, cart, price offer or payment endpoint.

Both artifacts contain an exact `build-info.json` source commit. A live URL alone does not establish that the intended revision was released.

## Verification pipeline

The pinned GitHub Actions workflow runs `npm ci`, build/type checks, source contracts, server/domain tests and desktop/mobile Chromium journeys. It builds the showcase only after application verification succeeds. PRs do not publish; the main-only Pages job respects `AERLOR_ENABLE_GITHUB_PAGES` and the `github-pages` environment. Its post-release job checks the exact public showcase commit and four viewport widths.

The Vercel application is independently verified:

```sh
TEST_URL=https://aerlor.vercel.app/ \
  EXPECTED_COMMIT=<exact-40-character-released-sha> \
  VERIFY_KIND=storefront npm run verify:deployment
TEST_URL=https://aerlor.vercel.app/ npm test
```

The deployment verifier is read-only: it does not submit inquiries, payments, shipments or credentials. It checks build identity, routes, actual PDF bytes, same-origin API configuration, wrong-method rejection, artwork, JavaScript errors, 3D initialization, touch targets, four widths and custom 404 behavior. Browser fixture tests are reported separately from real provider acceptance.

The Pages check uses the returned public URL and exact commit with `VERIFY_KIND=design-showcase`. It asserts that no customer-data forms are present.

## Release operation

Review the exact intended team/project/commit. Do not weaken deployment protection to make automation pass. Unique Vercel deployment URLs may require authentication even when the stable public alias is accessible. Use approved authentication or test the actual public alias after release.

Normal Pages publication follows an authorized main push. A deliberate redeploy uses:

```sh
gh workflow run site.yml --ref main --repo mastermindx-market-intelligence/aerlor
```

Do not run the provisioning helper or change organization policy merely because a deploy is queued. Existing public-Page enablement is not a grant to change unrelated repositories or policies.

## Commercial activation

No product is currently released or priced. The website remains `noindex`; no custom domain has been configured. The public business-email draft path works only after the contact environment variable is present. Direct email submission and paid checkout remain off until their respective gates are satisfied. See `docs/commerce/OPERATIONS.md`, `.env.example` and `LAUNCH.md`.

No domain, paid service, merchant account or inventory is purchased by this deployment. No real payment, email send, refund or shipment is triggered by the release tests.

## R5 product-view acceptance

The homepage uses the original static flagship artwork and has no 3D canvas. The optional early-geometry viewer lives on `/products/hairdryer-premium/`; the release verifier explicitly opens it and checks the gallery and live canvas. The site is also checked at desktop, tablet and narrow phone widths. Existing checkout and direct-submission gates remain unchanged. The current native Paper page is `p-6-0`; shared precision tokens remain in `src/precision-tokens.css`.
