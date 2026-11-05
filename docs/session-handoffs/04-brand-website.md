# SITE-04 — Brand and Website Implementation
**Role:** frontend/design-system engineer; one isolated implementation PR, not marketing launch.

## Launch prompt
> Work on AERLOR lane SITE-04. Read root AGENTS.md, docs/PROJECT_BOOTSTRAP.md and this handoff. Inspect latest main README, LAUNCH.md, src/, tests/, design/paper/native and deployment evidence. Own only the exact website files required by your issue on a separate `work/site/<short-name>` branch. Build or refine a premium, fast, accessible hotel-B2B concept experience; preserve truthful prelaunch status and existing product/Paper visual consistency. Run actual build, contract, browser and accessibility tests as possible; provide verification. Don't deploy production changes, activate lead capture, remove noindex, insert unsupported product claims or connect user accounts without explicit authorization.

## Priority deliverable
Prepare a **launch-safe hospitality buyer experience** as a reviewable prototype that:
- Uses the current brand visuals without implying final CAD, inventory, sample availability or certified specifications.
- Clearly distinguishes conceptual Essential/Signature product presentation from tested SKU data.
- Explains the acquisition flow: buyer requirements discussion -> technical review -> paid pilot after approvals -> portfolio rollout if funded.
- Provides a practical list of procurement documents **to be supplied later**, without counterfeit badges, falsified certifications or invented hotels.
- Retains an explicitly **local-only** private brief download until a real server-side lead endpoint and compliant privacy notice are approved and tested.
- Keeps perfect mobile behavior, keyboard focus, reduced motion, screen-reader semantics and static fallback for 3D.

## Integration dependencies
Coordination required with DESIGN-03 for actual original packaging/industrial concept; SOURCE-02 for approved exact-model claims; FINANCE-05 for honest retail/reference pricing; MARKET-01 for buyer needs. Do not modify those owners' docs or shared branch; link unresolved needs in PR.

## Acceptance
- Updated implementation on owned branch with code diff and new/updated tests for affected behavior.
- `npm ci`, `npm run build`, `npm run test:contracts`, and `npm test` with genuine statuses (do not fabricate if tools unavailable).
- Screenshots or captured QA report of responsive buyer journey and no unwarranted claims.
- Link PR and exact commit SHA; no auto-merge and no assumed deployment.

## Stop
Blocked by product verification, legal identity, server endpoint requirements or restricted tool access: produce source-ready design spec, not a fake functioning contact form.

## R3 implemented release frontier — 4 November 2026

The 33-route hospitality storefront is live on Vercel. Verified release source: `2d6d5fe47c9036d311622e0436ed0ca6878cf61c`, identical tree to the reviewed SITE-04 branch. Six Lite/Premium product pages, hotel/wholesale/group/designer content, ten PDFs (36 pages), corporate/support/policy pages, a product-only project bag and server-gated checkout/inquiry integrations are implemented. See `docs/commerce/OPERATIONS.md` and `design/previews/r3/live-verification-20261104.json`.

Actual public runtime verification passed for routes, all ten PDFs, API configuration and the configured business-email draft. No email was sent and no charge or shipment was initiated. Chromium and WebKit browser evidence is recorded separately; provider fixture tests are not live merchant acceptance.

GitHub Pages now hosts the separate non-transactional design/engineering showcase, not the commercial application. A final QA patch improves the 320px showcase heading and makes geometry checks wait for actual stylesheet application; it does not change commerce eligibility.

Commercial activation remains gated on the approved exact supplier models/specifications/market evidence, legal seller and correct merchant account, real prices/stock, tax/shipping/support terms, durable service credentials and real provider test-mode acceptance. Do not invent these facts or mark products released to make checkout appear active.

## R4 precision redesign / 4 November 2026

Founder direction: replace the cosmetic/editorial feel with a premium technology system designed for hotel buyers. Implementation branch: `work/site/precision-tech-r4`, baseline `68f0ba1`. All 33 routes are restructured and rewritten, six products use original studio renders, and the homepage uses an opt-in 3D viewer instead of automatic motion. Native Paper page `p-4-0` contains nine editable boards and 25 tokens; see `design/precision-r4/README.md`. Ten PDFs / 36 pages are restyled in the same system. Browser and deployment evidence is retained in `design/previews/r4/`. Commercial product and merchant release gates are unchanged. Do not revert the active interface to the archived R2 serif/ivory system.


## R5 premium-technology redesign / 4 November 2026

The founder requested a substantial departure from the beauty/editorial identity. Current implementation branch: `work/site/premium-tech-r5`. Five native R5 design boards are on Paper page `p-6-0`; `design/precision-r5/README.md` records scope, actual IDs, image provenance and the relationship to the shared R4 tokens.

The 33-route site now has the product-led homepage, a separate hotel-buyer journey, improved product galleries, direct project calls to action and a neutral premium-tech design system. The ten PDFs have been refreshed in that system. Local Chromium and WebKit runs each passed 57 tests with one intentional mobile-only duplicate skipped; the server/domain fixture suite passed 39 tests. Live release identity must be checked against `build-info.json`, not inferred from this handoff.

PR #23 imagery was integrated from exact source `4d80d3d781a9e992c7922e3f66c38adc18fa486b`; its conflicting legacy CSS/generator changes were not. Do not merge the old visual direction over this rebuild. Preserve independent assurance, sourcing and finance work. Commercial activation remains a separate prerequisite: no paid orders, production claims or automated email delivery were enabled by this design release.
