# Deployment / AERLOR

## Verified targets

- Repository: `mastermindx-market-intelligence/aerlor`, production source branch `main`.
- Existing public preview: https://aerlor.vercel.app/.
- Native design: https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0.
- GitHub Pages: **not provisioned or live**. The organization denies public Pages creation.

## GitHub Pages policy boundary

The live organization read returned `members_can_create_public_pages: false`. Creating a workflow-backed Pages site returned HTTP 422: `GitHub organization administrators disabled Pages creation.` A workflow, a branch, or a successful build cannot override this policy.

An organization owner must review the **organization Settings > Pages** policy and explicitly permit public Pages creation. If enterprise policy governs the setting, the enterprise owner must resolve that restriction. This project does not change a global security policy, switch accounts, transfer the repository, or change repository visibility as a workaround.

Once public Pages creation is approved:

```sh
sh scripts/enable-github-pages.sh
```

The helper verifies the policy, creates the repo's Pages site with GitHub Actions as the build source when absent, sets `AERLOR_ENABLE_GITHUB_PAGES=true`, and dispatches `site.yml`. It refuses to change an existing non-workflow Pages source silently. It does not wait or claim publication success.

Verify the workflow's returned page URL, HTTP status, images, dialogs, base paths, and `build-info.json`, then run:

```sh
TEST_URL=<actual-returned-Pages-URL> npm test
```

Do not announce a constructed `github.io` address as live before this succeeds.

## Build and release behavior

GitHub Actions uses Node 26 and pinned action commits. Builds and tests run before the Pages artifact is uploaded. The deployment job runs only on main, outside PRs, when the enablement flag is true. Its permissions are limited to `pages:write` and `id-token:write`; ordinary verification has `contents:read`.

The default asset base is `/aerlor/`. Vercel uses `BASE_PATH=/ npm run build` through `vercel.json`. Both builds generate a matching 404 return link and `build-info.json`. Only `dist/` is deployed; native design references, screenshots, source, private receipts, and developer files are not web-root assets.

The public Vercel alias is an existing authorized preview target. Unique deployment URLs may require Vercel authentication. Do not disable deployment protection merely to make a test pass.

## Commercial activation is separate

The site is intentionally `noindex`. Its form makes a private local brief, not a network request. Connecting a verified inquiry service requires endpoint-side validation, abuse protection, delivery/retention policies, and end-to-end error/receipt tests. See `LAUNCH.md`.
