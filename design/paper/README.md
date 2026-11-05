> **Current design: R4 precision hospitality.** See [the R4 native handoff](../precision-r4/README.md) and [Paper page p-4-0](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-4-0). The R2 material below is retained as design history, not the current visual direction.

# AERLOR / Native Paper design

[Open the editable Paper file](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0) | [Live GitHub Pages website](https://mastermindx-market-intelligence.github.io/aerlor/) | [Vercel preview](https://aerlor.vercel.app/)

The native implementation is complete: **15 artboards, three pages, and 28 design tokens**. This replaces the earlier unimported HTML handoff. The file contains editable frames and text, with original artwork used as image assets rather than flattening entire pages.

## Pages

- Foundations and components: palette, typography, controls, focus, touch targets, and feedback patterns.
- Website: complete desktop (1440px) and mobile (390px) pages.
- Product and interaction states: PRO/LITE details, planner default/invalid/local-download states, mobile privacy and navigation.

## Native exports

| Artboard | Native ID | Screenshot | JSX reference |
|---|---|---|---|
| AERLOR / Home / Desktop 1440 | `1-0` | [View](native/screenshots/home-desktop.jpg) | [JSX](native/reference-jsx/home-desktop.jsx) |
| AERLOR / Home / Mobile 390 | `A4-0` | [View](native/screenshots/home-mobile.jpg) | [JSX](native/reference-jsx/home-mobile.jsx) |
| AERLOR / PRO / desktop | `KT-0` | [View](native/screenshots/detail-pro-desktop.jpg) | [JSX](native/reference-jsx/detail-pro-desktop.jsx) |
| Pilot planner / default / mobile | `ME-0` | [View](native/screenshots/pilot-default-mobile.jpg) | [JSX](native/reference-jsx/pilot-default-mobile.jsx) |
| AERLOR / LITE / desktop | `PH-0` | [View](native/screenshots/detail-lite-desktop.jpg) | [JSX](native/reference-jsx/detail-lite-desktop.jsx) |
| Pilot planner / default / desktop | `R3-0` | [View](native/screenshots/pilot-default-desktop.jpg) | [JSX](native/reference-jsx/pilot-default-desktop.jsx) |
| Pilot planner / validation / desktop | `TR-0` | [View](native/screenshots/pilot-invalid-desktop.jpg) | [JSX](native/reference-jsx/pilot-invalid-desktop.jsx) |
| Pilot planner / local brief ready / desktop | `WI-0` | [View](native/screenshots/pilot-ready-desktop.jpg) | [JSX](native/reference-jsx/pilot-ready-desktop.jsx) |
| AERLOR / PRO / mobile | `Z9-0` | [View](native/screenshots/detail-pro-mobile.jpg) | [JSX](native/reference-jsx/detail-pro-mobile.jsx) |
| AERLOR / LITE / mobile | `10U-0` | [View](native/screenshots/detail-lite-mobile.jpg) | [JSX](native/reference-jsx/detail-lite-mobile.jsx) |
| Pilot planner / validation / mobile | `12F-0` | [View](native/screenshots/pilot-invalid-mobile.jpg) | [JSX](native/reference-jsx/pilot-invalid-mobile.jsx) |
| Pilot planner / local brief ready / mobile | `154-0` | [View](native/screenshots/pilot-ready-mobile.jpg) | [JSX](native/reference-jsx/pilot-ready-mobile.jsx) |
| Privacy and preview notice / mobile | `17T-0` | [View](native/screenshots/privacy-mobile.jpg) | [JSX](native/reference-jsx/privacy-mobile.jsx) |
| Navigation / mobile expanded | `18D-0` | [View](native/screenshots/navigation-mobile.jpg) | [JSX](native/reference-jsx/navigation-mobile.jsx) |
| AERLOR / Foundations and components | `18U-0` | [View](native/screenshots/foundations.jpg) | [JSX](native/reference-jsx/foundations.jsx) |

## Design to implementation

The native color and typography export is in [`native/tokens.css`](native/tokens.css) and is used by the production website in [`src/paper-tokens.css`](../../src/paper-tokens.css). A contract test prevents the token copies from drifting. Native JSX exports are reference documents; production retains semantic HTML, responsive layout, focus management, validation and motion handling.

The native product artwork is static. The website progressively enhances it into an interactive Three.js scene. Product specifications and certification remain unverified; all imagery is conceptual. The planner completion state means a local brief was prepared, not that an inquiry was submitted. Sample form data in these boards is illustrative.

The original design asset files are copied into `native/reference-jsx/assets/`; references contain no developer-machine paths. No font binaries are included. Exact file, page and node IDs plus native readback are in [`native/manifest.json`](native/manifest.json).
