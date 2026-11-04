# AERLOR DESIGN-03 / Contour study R1

**2026-11-04 · PROPOSAL · CONCEPT ONLY · No product, tooling, packaging or market approval**

Issue [#15](https://github.com/mastermindx-market-intelligence/aerlor/issues/15) owns this entire directory. The design proposal is one corded dryer platform, two finish directions, and three distinct packout configurations. “Contour” is an internal study name, not a cleared product name. All product dimensions, mass, electrical construction, materials, thermal properties, accessory interfaces and manufacturing tolerances remain TBD pending an exact physical SKU.

## Review the work

- [Visual review book](AERLOR_DESIGN_03_REVIEW.pdf): appearance, product architecture, hotel delivery, future retail, room handling and decision gates.
- [Product and guestroom design specification](DESIGN_SPEC.md): the form proposal, controls, inclusive use, service, room fit and measurable acceptance questions.
- [Packaging specification](PACKOUT_SPEC.md): 6-/12-unit configuration, label zones, print/converter handoff, quality controls and transport qualification.
- [Source ledger](SOURCE_LEDGER.md): original URLs, access dates, exact scope, limits and design consequences.
- [Requirement register](requirements.csv): proposed criteria, evidence required and receiving owner. **Every physical criterion is untested.**
- [Cross-lane handoff](HANDOFF.md): bounded questions and the next evidence needed from SOURCE-02, MARKET-01 and the integrator.
- [Session return](SESSION_RETURN.md): actual verification and persistent PR/commit evidence.

## Editable visual sources

| Asset | What it communicates | What it cannot establish |
| --- | --- | --- |
| [Appearance study](assets/appearance-study.png) | Mineral Pearl and Graphite on one proposed form | Physical geometry, air path, circuit protection, materials, clearance or performance |
| [Product architecture](assets/product-architecture.svg) | Concept features and unresolved interfaces | CAD, dimensions, tolerance stack or manufacturability |
| [Hotel carton](assets/bulk-packout.svg) | Six cells / optional two layers and transport label zones | Final dieline, compression strength, weight or certified transport performance |
| [Future retail](assets/retail-packout.svg) | Paperboard sleeve/tray arrangement and label reservations | Available product, tested retail parcel shipper or approved print artwork |
| [Room handling](assets/room-cycle.svg) | Separate dry/cold storage and staff return/quarantine paths | A heat-rated stand, powered drawer, cleaning approval or operating hotel program |

The diagrams are editable SVG, explicitly **not to scale**. The appearance image was created with the built-in image-generation tool; its exact [prompt](appearance-prompt.txt) is retained. It has visual simplifications: the plug lacks engineering detail; the drawn cord is shortened; control legends, attachment interface, scale and rear-filter mechanism are unresolved. The SVG feature map and text specifications govern the intended review questions, not the image pixels.

## Evidence baseline and ownership

- Fresh `main`: `632c79717d8bd0657ac8c93fa6397533cbe16ce0` (bootstrap PR #14 merged).
- Subsequent main/live-site refresh: `2d6d5fe47c9036d311622e0436ed0ca6878cf61c`; the root AGENTS blob is unchanged. SITE-04 updates are outside this branch's write scope; see the ledger for the observed R3 metadata.
- Research PR [#1](https://github.com/mastermindx-market-intelligence/aerlor/pull/1), open when read: `22554c76f5468c02a138e12c5a008b5598bf8258`. Its competitive benchmark, ODM RFQ and validation protocol are proposal inputs, not approved products or merged instructions.
- Read root `AGENTS.md`, `docs/PROJECT_BOOTSTRAP.md`, requested MARKET-01 handoff and actual DESIGN-03 handoff, handoff directory, session control, existing packout brief, README, LAUNCH and native Paper handoff/screenshot.
- Read company Notion HQ and its launch/ownership pages. No shared Notion or Paper content was changed.
- Only this directory is written. The public website, shared source files, other workstreams and existing concept brief are outside the claim.

The dedicated Aerlor design Drive folder returned **404** on metadata lookup. Its permissions could not be verified; that access path was stopped. No restricted supplier, buyer, financial or personal material was collected, created or uploaded. This entire packet is public-safe concept research. It is not a substitute private store for later confidential inputs.

## Reproduce and verify

From this directory:

```sh
python packout_model.py packout-inputs.json
python verify_packet.py
python build_review.py
```

The model's normal outcome with the checked-in unknown measurements is `BLOCKED_MISSING_MEASUREMENTS` with no calculated carton size. `verify_packet.py` checks source/requirement cross-references, package counts, missing-measurement and invalid-input behavior, editable diagram structure, asset references, PDF page/text integrity and the public-safe source inventory. Its arithmetic fixtures are synthetic fictitious mm/kg examples, not AERLOR dimensions. `build_review.py` regenerates the SVG diagrams and PDF; it uses ReportLab, Pillow, DejaVu fonts and the runtime's Sharp renderer, with no remote fonts or assets.

Physical safety, compliance, packing, cleaning, user, drop, distribution and room-fit tests have **not** been performed. A successful software/artifact check does not pass any of those gates.

## Decision proposed

Use this packet to request a measured, legally reviewable platform envelope and a real guestroom/storage workflow. Keep the simpler paper-based unit protection module as the hotel bulk default. Study retail presentation separately. Evaluate a removable drawer/counter tray only for unplugged, dry, fully cooled storage. Advance to a dimensioned engineering revision only after the needed evidence returns; this PR itself authorizes no external engagement or spending.
