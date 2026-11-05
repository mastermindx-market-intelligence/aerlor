# AERLOR R4 — Precision hospitality

## Assignment

Rebuild the R3 customer experience around hotel owners, operations leaders, procurement teams and specifiers. The founder rejected the warm editorial / cosmetics treatment and requested a sophisticated premium-technology direction. This is a structural and copy rewrite, not a dark-mode skin.

## Diagnosis

R3 put too much abstract brand language ahead of the product. Repeated large serif headlines, italic fragments, champagne surfaces and decorative product staging made the collection read like beauty editorial. Navigation mixed the portfolio story with a local-only planner, and the homepage did not make the three product families and next buying action clear quickly enough.

The software coverage was useful, but a page count or passing browser test does not establish a good buyer experience.

## Customer questions, in order

1. What does AERLOR supply, and is it relevant to my property?
2. Which category and range fit the room or service I am planning?
3. What is known about the product, and what needs technical confirmation?
4. How do I compare, save a selection and obtain a property-specific proposal?
5. What documents can I share with engineering, housekeeping and purchasing?

## New information architecture

- **Products:** the complete collection, three categories and a direct Lite / Premium comparison.
- **For hotels:** suitability, operating requirements, buying process and paths for independent hotels, groups and specifiers.
- **Resources:** product briefs, collection overview, procurement checklist and pilot toolkit.
- **About:** the product philosophy and current development status, without invented company history.
- **Discuss a project:** one clear procurement entry point. The project bag supports that action.

The old homepage quick-view dialogs and separate offline pilot funnel are removed from the primary journey. Each product has a real page; the shared property form is the inquiry route. Existing API and payment boundaries remain intact.

## Visual system

Mood: precision / industrial design studio. White surfaces, graphite product stages, neutral silver and a small copper product accent. Inter replaces the display serif. Product images are large enough to inspect; body copy is readable rather than set as microcopy. Numbering is used only where it helps a process, not as decoration on every section.

Native Paper tokens are recorded in `tokens.css` and used by the implementation through `src/precision-tokens.css`. The old Paper pages and tokens remain as the historical R2 reference, not the active R4 direction.

## Product presentation

Original procedural studio models provide consistent views of all three families, three finish studies, detail crops and a rear view. They are presentation assets, not production CAD or proof of construction. No competitor photography, logos or product claims are copied.

The homepage uses a lightweight product image first. A visitor explicitly chooses the optional 3D inspection. There is no perpetual automatic rotation, decorative plinth or dependency on WebGL for product information.

## Copy rules

Use the product category, buyer action and operational detail before abstract emotion. Prefer one clear sentence to a heading broken into artificial fragments. Avoid repeatedly saying “considered,” “ritual,” “signature expression” or “a feeling.” Do not replace cosmetic language with empty engineering jargon.

The product can look technologically sophisticated without asserting unverified sensors, motor speeds, temperature control, connectivity or performance. Design priorities and technical release information remain distinct.

## Reference review

Reviewed official product and business pages on 4 November 2026:

- Apple MacBook Pro: https://www.apple.com/macbook-pro/ — product-led hierarchy, clear feature navigation and a direct buying path.
- Dyson hospitality: https://www.dyson.com/commercial/hair-care/hospitality — hotel-specific product use and procurement context.
- Dyson Supersonic for business: https://www.dyson.com/commercial/hair-care/supersonic — technical information, documentation and support near the purchasing path.
- Vanity Group WAVES: https://www.vanitygroup.com/en/hair-dryers/waves — concrete hospitality product and sample-inquiry information.

These are visual and information-architecture references, not evidence of AERLOR equivalence or affiliation.

## Acceptance

Review actual desktop and mobile screenshots, not only markup. Verify all 33 routes, selectors, project-bag persistence, forms, document links, typography fallback, optional 3D, keyboard use and automated accessibility rules. Export native Paper frames/text and inspect their screenshots. Test the deployed revision against its exact source commit. Do not describe a merchant gate or concept specification as operational merely because the frontend is complete.
