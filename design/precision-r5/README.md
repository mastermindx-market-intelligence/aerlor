# AERLOR R5 / Premium technology

[Editable Paper page](https://app.paper.design/file/01M6JNN71ZN4867VJZ83PPXQZ0/p-6-0)

## Direction

A product-led premium-technology identity for hotel owners, operators, procurement teams and specifiers. White, graphite and restrained metallic product finishes replace the previous ivory/serif beauty-editorial treatment. Inter, precise spacing and short, concrete copy make the range and the next buying action clear.

The homepage establishes product desire and a coherent range. The dedicated hotel path covers guest use, room categories, budget planning and the steps toward a property proposal. Product pages provide selectable views, finishes, quantities, technical information and a direct project handoff.

## Native design

Five new editable artboards on `p-6-0`, read back as 530 native nodes:

| Artboard | Native ID |
|---|---|
| Home / desktop | `3UX-0` |
| Home / mobile | `3Z2-0` |
| Hairdryer Premium / desktop | `47I-0` |
| Hairdryer Premium / mobile | `4BD-0` |
| Hotel buyer journey / desktop | `4F3-0` |

Native compositions were authored in Paper and refined after screenshot review. `native-manifest.json` records the observed IDs and exports. The JSX contains editable native frames and text, with original project artwork referenced by relative path. Whole pages were not flattened into screenshots. Galleries, form states, the optional 3D study and transactional behavior are application-owned and verified separately.

The shared precision tokens originated in the R4 native foundations and remain in `src/precision-tokens.css`, tested against `design/precision-r4/tokens.css`. Earlier R2/R4 files remain historical design references, not the current release direction.

## Image provenance

The flagship Champagne cutout was recovered from the existing AERLOR Paper design; its detail crop uses the same source. Campaign images were supplied by the founder or generated in the authorized website session and recovered from PR #23 at `4d80d3d781a9e992c7922e3f66c38adc18fa486b`. Only its visual assets and provenance were integrated, not its conflicting earlier CSS or page generator.

Mirrors, curlers and the Lite dryer use original procedural design renders. Images remain preproduction visualizations, not evidence of a manufactured model. The optional 3D dryer is explicitly an early geometry study and does not claim to reproduce the campaign model or production CAD. Alternate campaign views identify their pictured finish separately from the selected order configuration.

## Implementation

- `scripts/r5-experience.mjs`: homepage, flagship product structure and hotel-buyer narrative.
- `scripts/build-storefront.mjs`: all 33 semantic HTML routes.
- `scripts/r4/ui.mjs`: shared layout helpers and buyer controls retained across the range.
- `src/style.css`, `src/storefront.css`, `src/premium-tech.css`: responsive design system.
- `src/storefront.ts`: project bag, gallery, inquiries and gated checkout.
- `src/main.ts`, `src/studio-models.ts`: optional on-demand geometry study.
- `marketing/`: coordinated document sources, manifests and PDF review evidence.

## Verification boundaries

Browser screenshots and native Paper screenshots are separate evidence. Automated accessibility checks are not a complete accessibility certification. Provider fixtures test failure and payment boundaries but do not establish live merchant readiness. No new product specification, hotel partnership, certification, commercial price or payment activation is created by this design release.
