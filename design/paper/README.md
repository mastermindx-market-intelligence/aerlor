# AERLOR / Paper design handoff

**Status: prepared, not imported into Paper.** No native AERLOR file or artboard has been created. The images in `../previews/` are browser screenshots, not Paper screenshots.

## Why native authoring is paused

The existing approved Paper Desktop adapter is connected but reports its current upstream tool catalog as incompatible with the approved catalog. Its write schema is not accepted. The current active document belongs to another project and the resource census found no AERLOR file. No unrelated document, adapter policy, service, or account setting was changed.

## Prepared materials

`tokens.json` contains the source colors, typography and spacing. Numbered HTML fragments contain editable text, flex layouts and original inline SVG product studies for desktop and mobile. `review.html` provides a browser-readable design sheet. `manifest.json` deliberately leaves native file and artboard IDs empty.

The fragments are an editable handoff, not a claim of native Paper acceptance. Their compatibility and appearance must be checked in Paper after import. The live website includes progressive 3D, interactions and responsive rules that a static canvas cannot reproduce directly.

## Resume native design safely

1. Restore an approved compatible Paper connection through the normal installation owner. Do not disable catalog validation or repoint to an unapproved staged runtime.
2. Inspect the exact connection and catalog. Create a dedicated AERLOR file using the admitted tool, then inspect and record its actual returned file ID.
3. Establish desktop 1440px and mobile 390px artboards. Use fit-content height for the full page. Keep an 80px canvas gap between boards.
4. Create or reconcile the design tokens from `tokens.json` against the current upstream schema.
5. Import incrementally: navigation, copy blocks, product-stage container, product illustration, labels and finish controls. Each modifying call needs the actual target ID, current snapshot guard and stable operation identity. The fragments may be split further into these visual items rather than sent as one large page.
6. Build the rest of the page from the implementation's section hierarchy. Add the product-detail and pilot-planner states, including validation and honest local-export confirmation.
7. Capture actual native screenshots at each representative viewport. Verify wrapping, contrast, spacing and product proportions. Record the resulting file/artboard IDs only after successful readback.
8. Retrieve native JSX after visual review; reconcile any approved changes into the implementation and rerun browser tests before publishing.

## Design intent

The experience should feel like a considered luxury object rather than a commodity supplier catalogue: warm stone, brushed-metal concepts, restrained forest green, fine rules, generous negative space, and expressive serif typography. The main persona is a hotel owner, general manager, procurement lead or designer evaluating an emerging supplier.

Do not add unverified hotel logos, certification marks, performance numbers, testimonials, sale prices, awards or available-to-ship claims. Production photography and validated specifications should replace the clearly labelled concepts once available.
