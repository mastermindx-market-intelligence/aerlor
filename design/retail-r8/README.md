# AERLOR — R8 Retail Flagship Implementation

## Source of truth and scope

- [Editable Paper retail boards](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-8-0): desktop `5YG-1`, mobile `61L-1`.
- Source product image masters: [DESIGN R11 PR #27](https://github.com/mastermindx-market-intelligence/aerlor/pull/27) (`design/asset-masters/r11/`). Six original independent studies are copied as self-hosted binary Git objects into `public/images/retail/`, not linked to the Paper asset service.
- The lifestyle scene `public/images/retail/ritual-model.jpg` was extracted directly from the R8 Paper generated image fill `66D-1` at 1360 × 768 and added to Git as a self-hosted JPEG.
- Paper design is conceptual. A product image is not a CAD file, certified model, performance proof, or product release.

## Visual review captures

- [Desktop R8 design](./previews/desktop.jpg) — original Paper artboard `5YG-1`.
- [Mobile R8 design](./previews/mobile.jpg) — original Paper artboard `61L-1`.

These are source **Paper design captures**, not screenshots of a verified website deployment. Browser QA is separately tracked by the PR checks.

## Implementation

- `scripts/r8-retail.mjs`: visual narrative, hierarchy, hero, finish presentation, technology macros, FAQ, development specifications, professional CTA and lightbox.
- `src/r8-retail.css`: exclusive desktop/mobile responsive layout and reduced-motion rules.
- `public/images/retail/thumb-*.jpg`: 60–160 KB original-image JPEG thumbnail derivatives extracted from the Paper masters; full-resolution PNG is reserved for the selected main/detail view. Finish switching also updates the first thumbnail.
- `src/r8-retail.ts`: progressive client interactions — accessible image gallery, pressed thumbnail and finish states, quantity controls, modal image enlargement, keyboard gallery navigation, and focus recovery.
- `scripts/r5-experience.mjs`: dispatches only `dryer-premium` to the retail flagship; all other product pages retain their existing buying flows.
- `src/catalog.json`: adds conceptual Porcelain White and Stone to the Premium dryer. Prior Champagne is retained as a legacy design finish to avoid invalidating saved project selections.
- `src/storefront.ts`: maps each selected finish to a corresponding real product visualization, including the project bag.

This is **consumer-first visual merchandising**. The header and existing B2B project-bag workflow remain shared with the broader storefront. The optional 3D viewer is preserved as a subordinate study, not as production CAD.

## Guardrails

- Current price display `$329 USD*` is an explicitly **indicative retail concept**, not a released MSRP, enabled checkout, inventory or binding offer. The product catalog price remains `null` and the existing runtime commerce gates are unchanged.
- CTA saves a local project selection only. It does not collect contact details or transmit a lead. Browser-level commerce controls remain unaltered.
- New close-ups use separate assets for outlet, controls and intake — they are not one repeated crop. No performance, technical safety, hotel partnership, review, testimonial, certification or availability claims were added.
- Current source PNG masters are 928 × 1120 and are lazy-loaded except for the hero. Optimized WebP/AVIF derivatives, final measured core-web-vitals, and production-quality engineering validation remain separate optimization gates.

## Verification

Review the accompanying PR checks, especially Vite/TypeScript build, contract/server suites, Playwright Chromium + optional WebKit, keyboard/zoom/finish/bag tests, 320 px reflow, and actual screenshot review. An HTML prototype or a passing component test alone is not proof of a deployed production release.

Main storefront and other open SITE-04/Design PRs are untouched until a reviewed merge decision.
