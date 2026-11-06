# AERLOR R11 — Original Visual Asset Masters
**2026-11-04 · Preproduction design studies · Public-safe source assets**

This directory preserves the **original PNG image outputs**, retrieved from the exact Paper-generated image fills. These are *not* screenshot crops or three crops of one product photograph. All eight masters are RGBA PNG files at **928 × 1120 px**, intended as editable-source visual references for the production frontend to derive responsive, optimized formats.

## Image index

| File | Visual role | Paper provenance |
| --- | --- | --- |
| `aerlor-porcelain-white-r11.png` | Flagship hero / white finish, original isolated product design | Product hero `5JY-1`; collection `68C-1` |
| `aerlor-stone-r11.png` | Matching three-quarter Stone colorway design | Collection `68H-1` |
| `aerlor-graphite-r11.png` | Matching three-quarter Graphite colorway design | Collection `68M-1` |
| `aerlor-outlet-macro-r11.png` | New optical macro study of radial outlet, not cropped from hero | Detail study `6DY-1` |
| `aerlor-controls-macro-r11.png` | New optical macro study of controls/handle | Detail study `6EB-1` |
| `aerlor-intake-macro-r11.png` | New optical macro study of perforated intake | Detail study `6EE-1` |
| `salon-station-editorial-r11.png` | Salon-specific workstation product-context image | Professional salon hero `5O9-1` |
| `salon-inuse-editorial-r11.png` | Distinct salon stylist-in-use scene; replaces placement diagram | Salon scene `6DM-1` |

**Editable Paper source:** https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-8-0 (consumer); https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-9-1 (business). Key boards: consumer home desktop/mobile `50D-0`/`53B-0`, flagship retail `5YG-1`/`61L-1`, business Solutions `5HR-1`/`5HU-1`, professional Salons `5HS-1`/`5HV-1`.

## Intended visual system

- **Retail hero:** an isolated single product against a neutral stage, no face/model or distracting bathroom scene; product identifiable in 1–2 seconds.
- **Detail stories:** three genuinely different original optical studies (outlet, controls, intake), presented as generous editorial feature chapters with real visual distinction; do not crop one packshot into three cards.
- **Colorways:** identical overall product geometry, angle and lighting across porcelain white, stone and graphite *concept* colorways. Do not represent these as released SKUs.
- **Salons:** show a genuine working salon environment or hairstylist-use visualization, not an unexplained chair/vanity schematic. Maintain separate photographs for salon hero and in-use context.
- **Use-case integrity:** salon imagery in salon pages, hotel imagery in hotel pages; do not repurpose the same luxury-bathroom background as every industry's product shot.
- **Publishing:** copy, optimize and self-host derivatives under `public/images/` after QA. Do not embed authenticated Paper file-assets directly in production HTML.

## Implementation / QA handoff

The Solutions integration owner is [PR #25](https://github.com/mastermindx-market-intelligence/aerlor/pull/25), which currently references `public/images/solutions/salon-station-study.svg` from `scripts/solutions-pages.mjs`. Replace the obsolete diagram with these owned visuals. The retail R11 gallery/copy improvements are saved in native Paper; source-code parity on current Vercel is a **separate pending acceptance gate**. Do not overwrite other active SITE-04 branches without an integration decision.

- Use responsive AVIF/WebP derivatives (at least desktop/mobile sizes); preserve the original PNG masters as sources.
- For isolated product assets, inspect alpha in a raster tool before asserting true transparent cutouts in shipping artwork; RGBA format alone is not proof that meaningful pixels are transparent.
- Retain correct `object-fit`/crop behavior, descriptive alternative text, keyboard interactions, mobile 320px reflow, reduced motion, and reasonable image-loading performance.
- Do not recreate an active cart from a concept-only release, invent MSRP/specs, or use an unverified engineering cross-section as a factual teardown.
- Re-run `npm run build`, the contract suite and targeted Chromium/WebKit tests. Save actual viewport screenshots and commit/SHA evidence to the integration PR.

These visuals are **AI-generated design studies**, not photographs of certified or available production units or proof of actual salon installations. Manufacturing geometry, electrical qualification, materials, packaging and product availability remain unconfirmed.

## Actual verification

The three product colorways were generated and visually inspected together in the Paper flagship `684-1` card section; outlet/controls/intake chapters were inspected on `6DR-1`; business and salon desktop/mobile boards were inspected. The source PNGs were read from their exact file-asset URLs; each source reported `image/png`, `928×1120`, PNG color type `6` (RGBA). The final website has not yet been built or deployed from this asset package.
