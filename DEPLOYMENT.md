# Deployment / AERLOR

## Live targets

- Source repository: `mastermindx-market-intelligence/aerlor`; release branch: `main`.
- **GitHub Pages:** https://mastermindx-market-intelligence.github.io/aerlor/.
- Existing Vercel preview: https://aerlor.vercel.app/.
- Editable native design: https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0.

GitHub Pages is provisioned with `build_type=workflow` and the repository variable `AERLOR_ENABLE_GITHUB_PAGES=true`. On November 4, 2026, the public homepage returned HTTP 200 and `build-info.json` identified source commit `74ab4b9046c3ff0e9e1861b361d2db10ec07f525`, design revision `native-paper-r2`, and the native Paper file above. The corresponding initial Pages workflow is [41794688107](https://github.com/mastermindx-market-intelligence/aerlor/actions/runs/41794688107). Current release evidence must be checked against the current source commit; this dated observation is not a claim that an older commit remains deployed.

The previous organization-level creation denial is historical. No global policy, repository visibility, account, or deployment-protection change is performed by this release workflow or its verification scripts.

## Normal releases

A push to `main` starts `.github/workflows/site.yml`. The pipeline:

1. Installs pinned dependencies, builds the site, runs contract checks and the desktop/mobile browser suite.
2. Uploads only the tested `dist/` output as the Pages artifact.
3. Deploys through the `github-pages` environment, only on main and only when the repository enablement variable is true.
4. Runs a separate read-only browser check against the public deployment URL returned by GitHub.

Pull requests are verified but never deployed. To redeploy the existing main revision:

```sh
gh workflow run site.yml --ref main --repo mastermindx-market-intelligence/aerlor
```

Inspect the run's `verify`, `deploy`, and `verify-public` results before calling the release complete. A successful build is not proof of a public deployment.

## Live verification

The post-deployment script requires the actual public URL and exact expected source SHA:

```sh
TEST_URL=https://mastermindx-market-intelligence.github.io/aerlor/ \
  EXPECTED_COMMIT=$(git rev-parse HEAD) npm run verify:deployment

# Full functional and automated-accessibility suite against the public site:
TEST_URL=https://mastermindx-market-intelligence.github.io/aerlor/ npm test
```

The deployment check verifies public `build-info.json` provenance, deployment base path, native design identity, homepage status, a single main heading, artwork loading, 44-pixel finish controls, JavaScript exceptions, and horizontal overflow at 320/390/768/1440 pixels. Desktop WebGL must initialize. It also verifies that a missing route returns HTTP 404 with a link to the correct `/aerlor/` base.

The exact build-info check has a bounded CDN-propagation retry window. It never changes the expected SHA, treats an older release as success, disables authentication, or retries writes. The checks do not submit forms, transmit lead data, or use credentials.

Local output is saved to `test-results/deployment/receipt.json` and viewport screenshots. CI prints the receipt into the `verify-public` job log. The dated initial Pages evidence is in `design/previews/r2/pages-verification-20261104.json`; the associated live functional run passed 29 tests, with one intentionally skipped desktop duplicate of a mobile-only test.

## Build and security boundaries

The default asset base is `/aerlor/`. Vercel uses `BASE_PATH=/ npm run build` through `vercel.json`. Both builds produce a matching 404 return link and `build-info.json`. Native design references, screenshots, source, and developer files are not included in the deployed web root.

Actions are pinned to commit hashes. Ordinary verification and the public-browser check have only `contents:read`; the deployment job has `pages:write` and `id-token:write`. No tokens are added to client code or required by the public verification script.

`scripts/enable-github-pages.sh` is an initial-provisioning helper for use after organization-owner approval. It refuses creation while policy is disabled and does not modify that policy. An already live site should use the normal release workflow above, not be reprovisioned.

The Vercel alias remains an alternate preview. Unique Vercel deployment URLs can be protected; do not disable protection to make a test pass.

## Commercial activation is separate

The site remains `noindex`. Product visuals are concepts, and the planner creates a local file rather than sending an inquiry. A verified contact identity, operational lead endpoint, server-side validation, abuse protection, delivery/retention policies, real product specifications, and a custom domain remain separate commercial-launch work. See `LAUNCH.md`.
