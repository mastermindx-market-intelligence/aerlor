# AERLOR

**The art of a better stay.** A hospitality collection preview with editorial design, original product studies, and a responsive interactive website.

[Live preview](https://aerlor.vercel.app/) | [Native Paper design](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0) | [Design handoff](design/paper/README.md) | [Launch gates](LAUNCH.md)

> Product imagery is conceptual, not production photography or validated CAD. No certification, measured performance, approved hotel partnership, price, stock, or sample availability is represented. The pilot planner produces a local text file; it does not send inquiries or collect leads.

## Website experience

- Original procedural Three.js product study, three finish choices, pointer interaction, pausable motion, reduced-motion support, and static artwork fallback.
- PRO and LITE product dialogs, a full hospitality narrative, accessible FAQ, mobile navigation, and keyboard focus management.
- Private pilot-brief planner with visible field validation, accessible error feedback, local file download, and honest completion messaging.
- Native Paper color and typography tokens used directly in `src/paper-tokens.css`. Readable body copy, 44-pixel finish controls, and responsive layouts down to 320 pixels.
- No advertising, analytics pixels, lead-transmission API, or browser persistence. Google Fonts supplies presentation fonts; no font binaries are distributed.

## Native Paper deliverable

The previously blocked native authoring is now implemented in a dedicated AERLOR file: **15 artboards, three organized pages, and 28 design tokens**.

The file contains the full 1440-pixel desktop and 390-pixel mobile pages; PRO/LITE details at both sizes; the pilot planner's default, validation, and local-download states at both sizes; mobile navigation and privacy; and a foundations/components board. Frames and text are editable. Original product and architectural artwork remains artwork, not a flattened screenshot of the website.

`design/paper/native/` contains exact IDs, native screenshots, exported tokens, and native JSX reference exports with local copies of the original imagery. The JSX is a design reference, not a replacement for semantic HTML, responsive CSS, or application behavior. The production implementation owns live 3D, focus, validation, motion, and responsive reflow.

## Development

Use Node 26, matching CI and `.nvmrc`.

```sh
npm ci
npm run dev
npm run build
npm run preview
npm run test:contracts
npx playwright install chromium
npm test
```

Development runs at `http://127.0.0.1:5187/aerlor/`; production preview uses port 4187. `BASE_PATH=/aerlor/` is the default for GitHub Pages. Vercel builds with `BASE_PATH=/`. The 404 return link is generated for the selected base path. `build-info.json` records the source commit and native design revision.

The 3D module is lazy-loaded. `?static` disables it for fallback review. Never put secrets in client-side variables.

## Verification

The browser suite covers content, finish controls, product dialogs, focus return, planner handoff, validation/recovery, local downloads, no-transmission/no-storage behavior, FAQ, privacy, mobile navigation, asset loading, overflow, reduced motion, motion-label transitions, touch-target sizes, and no-JavaScript fallback. Axe checks the homepage and planner against its WCAG A/AA rules. Automated checks do not constitute a complete manual accessibility audit.

```sh
npm run build
npm run test:contracts
npm test
TEST_URL=https://aerlor.vercel.app/ npm test
```

Release evidence is stored under `design/previews/`; the R2 receipt distinguishes local, GitHub, and deployed-site verification.

## Publishing

The source is in GitHub; the public preview is hosted on Vercel. **GitHub Pages has not been published**: the organization's public-Pages policy denies creation. No organization policy, repository visibility, or deployment protection was weakened.

The pinned GitHub Actions workflow builds and tests main/PR changes. It uploads the verified Pages artifact on main, but publication remains gated by `AERLOR_ENABLE_GITHUB_PAGES`. After an organization owner permits public Pages, run the documented enablement helper:

```sh
sh scripts/enable-github-pages.sh
```

That helper refuses to proceed while the policy is disabled. It does not change organization policy or repository visibility. A successful deployment and live browser check are still required after dispatch. See [Pages deployment details](DEPLOYMENT.md).

The preview deliberately remains `noindex`. No custom domain is configured and no operational inquiry inbox has been connected.

## Source layout

```text
index.html              Semantic homepage and dialogs
src/paper-tokens.css    Exported native Paper tokens used by the site
src/style.css           Responsive layouts and component states
src/main.ts             Accessible interactions and local brief workflow
src/scene.ts            Original procedural 3D study
src/pilot.ts            Bounded text-brief builder
public/images/          Original local SVG artwork
design/paper/native/    Native IDs, JSX references, tokens, and screenshots
design/previews/        Browser verification and release receipts
tests/                  Browser, accessibility, and contract tests
```

Custom brand visuals and code are reserved to the project owner. Dependencies retain their own licenses. Trademark clearance, product engineering, regulatory approval, fulfillment, and operational lead handling remain separate commercial-launch requirements.
