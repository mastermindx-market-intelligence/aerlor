# AERLOR

**The art of a better stay.** A hospitality-focused collection preview with original visual studies, responsive editorial design, and an interactive product experience.

[Design handoff](design/paper/README.md) · [Launch gates](LAUNCH.md)

> This is a prelaunch design preview. Product imagery is conceptual, not production photography or validated CAD. No certification, measured performance, approved hotel partnership, stock, price, or sample availability is represented.

## Experience

- An original procedural Three.js dryer study with champagne, graphite and pearl finish controls, restrained motion, pause control, and pointer response.
- Original local SVG illustrations and a fully usable visual fallback when WebGL, JavaScript or the 3D enhancement is unavailable.
- PRO and LITE collection stories with functional product-detail dialogs.
- Responsive hospitality sections, an accessible FAQ, mobile navigation and keyboard-operable dialogs.
- A **private pilot-brief planner** that creates a local downloadable text file. It does **not** send leads, reserve samples, process orders or subscribe anyone to marketing.
- No analytics pixels, advertising scripts, browser persistence, or lead-transmission endpoint. Google Fonts is the only external presentation dependency.
- Reduced-motion handling, offscreen/background render suspension, and a low-power rendering preference.

## Run

Use Node 26 (the CI version), or a compatible Node version at least 22.12.0 that supports the project's tooling and TypeScript test imports.

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run test:contracts
npx playwright install chromium
npm test
```

The default path is `/aerlor/`. Development uses port 5187; production preview uses 4187. Set `BASE_PATH=/` when building for a future custom domain. Never put secrets in `VITE_*` variables.

The 3D module is dynamically loaded; the initial application bundle is small. The larger Three.js enhancement is intentional and has a static alternative. `?static` disables the enhancement for fallback review.

## Validation

The browser suite covers page content, finishes, both product dialogs, keyboard focus return, product-to-planner handoff, required fields, local downloads, no-transmission/no-storage behavior, FAQ, privacy, mobile navigation, asset loading, overflow, reduced motion and no-JavaScript fallback. It also runs axe's WCAG A/AA checks on the page and planner. Automated checks are not a substitute for a complete manual accessibility audit.

```sh
npm run build
npm run test:contracts
npm test
# Test an actual deployed site:
TEST_URL=https://your-verified-preview-host/ npm test
```

`design/previews/` contains browser observations and screenshots. The initial verified local run passed 23 browser checks and five contract checks; one desktop copy of the mobile-only check was intentionally skipped.

## Publishing

`.github/workflows/site.yml` verifies the build, contracts and browser behavior on every main-branch push and pull request. Optional GitHub Pages publication is disabled unless the repository variable `AERLOR_ENABLE_GITHUB_PAGES` is set to `true` after organization approval. The organization currently blocks Pages creation; that policy has not been changed. A Vercel deployment configuration is included as the separate website hosting target. Actions are pinned to commit hashes. The site is intentionally `noindex` until the commercial launch gates are satisfied. No custom domain has been configured.

## Paper status

Native Paper authoring is **not complete**. The existing guarded adapter reported an incompatible approved/live catalog and the active document belonged to another project. No unrelated canvas or connection policy was changed. `design/paper/` contains nine prepared editable HTML fragments, source tokens, a review sheet, and an explicit resume procedure. It is not a fabricated Paper export.

## Structure

```text
index.html              Semantic page and dialog markup
src/style.css           Responsive design system and layouts
src/main.ts             Interactions and private local brief export
src/scene.ts            Original procedural 3D product study
src/pilot.ts            Bounded text-brief builder
public/images/          Original local SVG artwork
scripts/                Reproducible artwork and QA utilities
 design/paper/          Editable native-design handoff (not imported)
 design/previews/       Browser review evidence
 tests/                 Functional, accessibility and contract checks
```

## Rights and commercial use

Custom brand visuals and code are reserved to the project owner. Dependencies retain their respective licenses. Google Fonts remain subject to their published licenses; no font binaries are distributed in this repository. AERLOR name/domain/trademark clearance and product engineering remain separate launch requirements.
