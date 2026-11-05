# AERLOR commerce and inquiry operations

## Implementation is not merchant activation

R3 implements six product concepts, a product-only project bag, wholesale inquiry preparation, hosted checkout, provider-verified payment status, signed webhooks and a durable stock/order ledger. **No product is currently released for sale.** Catalog prices are null. Live payment and direct email-submission gates remain off until the prerequisites below are approved and tested.

A prepared email draft is not sent. A browser redirect is not proof of payment. A paid event is not a shipment. These states are intentionally separate.

The public business contact is configured server-side, not committed to this public repository. The current inquiry path prepares a reviewable email draft or a complete local text brief. Sending remains a deliberate action in the visitor's email application.

## Hosting and trust boundaries

- Vercel serves the storefront and five same-origin `/api` functions. No card data is entered into AERLOR forms.
- GitHub stores source and public-safe design evidence. GitHub Pages serves a non-transactional design/engineering showcase, not the commercial application. GitHub's published Pages limits prohibit ecommerce hosting.
- Stripe Checkout collects payment details. Server-approved Price IDs are corroborated with Stripe. Browser-supplied amounts, Price IDs and redirect URLs are ignored.
- Upstash Redis supplies durable atomic stock reservations, rate limits and receipts; there is no production in-memory substitute.
- Cloudflare Turnstile verifies hostname and action for direct inquiry and checkout creation.
- Resend is the optional direct inquiry adapter, disabled until the verified sending identity, inbox, privacy approval, verification and idempotency store exist.

Primary references reviewed 4 November 2026:
- https://docs.stripe.com/api/checkout/sessions/create
- https://docs.stripe.com/api/idempotent_requests
- https://docs.stripe.com/checkout/fulfillment?ui=full-page
- https://docs.stripe.com/payments/checkout/managing-limited-inventory?ui=full-page
- https://vercel.com/docs/functions/runtimes/node-js
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Required owner decisions before accepting money

1. Identify the legal seller and **correct authorized Stripe merchant account**. A connected account is not automatically AERLOR's seller. Onboarding, banking, tax and financial commitments require owner action.
2. Release the exact product configuration: approved supplier model/revision, verified specifications, destination-market evidence, hospitality-use terms and real stock/supply. Set `released` only after approval.
3. Approve actual unit/volume pricing and currency; create the corresponding Stripe one-time Prices in the correct environment. This build does not invent prices or discounts.
4. Publish and approve seller identity, delivery/returns/warranty terms, shipping rates, tax configuration and fulfillment ownership.
5. Configure server-only credentials through authenticated provider settings or an approved secret manager. Never place keys in chat, source, `VITE_*`, issues or screenshots.
6. Complete real provider test-mode acceptance, then explicitly authorize live activation. Fixture tests are not merchant acceptance.

## Configuration

See `.env.example`. `node scripts/commerce-readiness.mjs` prints gate names and booleans only, never secret values.

`AERLOR_PRICEBOOK_JSON` is an array with `id`, `finish`, `priceId`, positive integer `unitAmount` in minor currency units, `currency`, `maxQuantity`, `releaseReference`, and `inventoryKey` matching `stock_<approved_configuration>`. Each finish/configuration needs its own active one-time Stripe Price and inventory record. The record must match a catalog product explicitly released for sale and the provider's price.

Supported currencies currently use two decimal minor units: USD, CAD, GBP, EUR, AED. Do not add zero- or three-decimal currencies without adapting and testing formatting/amount rules. Allowed shipping countries must be real supported two-letter destinations; `EU` is not one. Shipping-rate IDs must be approved, active and in the same currency. Syntactic validity does not establish operational coverage.

## Ledger and review

Private Redis namespace: `aerlor:v1:`.

- `stock:<inventoryKey>`: available integer units of the exact approved configuration. Missing stock is unavailable. Seed only against a real counted receipt; never overwrite an active record to resolve a checkout failure.
- `order:<UUID>`: durable reservation/order state; product and payment-session references, not card/address data.
- `pending`: unresolved reservation UUIDs.
- `fulfillment`: paid orders awaiting an operator; membership does not mean shipped.
- `event:<Stripe event ID>`: duplicate-event receipt, retained 30 days.
- `inquiry:<UUID>`: HMAC fingerprint, provider reference and status, retained 48 hours; no name, email or inquiry message.
- `rate:<scope>:<HMAC>`: short-lived pseudonymous rate-limit counters.

State transitions: `creating` -> `open`; only verified paid events create `paid` / `awaiting_operator`. Expired or failed unpaid sessions restore inventory once. A payment after an inventory release creates `payment-review` / `inventory_review_required`, requiring staff review before shipment.

### Uncertain session creation

Session creation uses a stable UUID idempotency key and a fixed one-hour expiry. A timeout/5xx does **not** prove no session exists. The reservation stays held. The same unchanged request retries with the same provider key. An unresolved create older than 20 minutes is blocked for reconciliation, not blindly recreated.

For a pending record without a session ID, read its UUID and find the matching Stripe `client_reference_id` and `metadata.aerlor_request_id` in the correct environment. Compare cart hash and line items. Reconcile with the current provider status and replay signed events through the normal webhook path where appropriate. Absence from an incomplete list is not evidence that stock can be released. Complete the investigation before an authorized inventory adjustment; preserve the private audit record.

### Fulfillment and aftercare

An authorized operator reviews paid queue entries against Stripe, accesses delivery details through authenticated provider tools, confirms stock/destination, and creates the actual shipment through the selected fulfillment process. Carrier labels, dispatch messages, returns, refunds and disputes are **not automated in R3**. Select and integrate the actual fulfillment service before enabling live checkout.

No refund, cancellation, stock adjustment or shipment is initiated by this build. A future automated worker needs explicit authorization, idempotency, auditing and real-provider tests.

## Test-mode acceptance before live release

Use a dedicated approved test environment, not live cards or customer data.

- Confirm merchant identity/mode, exact Price and Shipping Rate records, tax and supported destinations.
- Configure canonical origin and Turnstile action/hostname; verify genuine token validation.
- Test durable Redis connectivity and actual Lua atomicity in a dedicated test database. Unit fixtures do not establish live database acceptance.
- Exercise success, decline, cancellation, reload and repeated checkout creation.
- Interrupt the response after provider acceptance; prove retry does not create another session/reservation.
- Deliver duplicate/out-of-order signed events: unpaid does not fulfill; paid queues once; expired restores once.
- Verify tax/shipping presentation and receipt against the actual offer.
- Verify direct inquiry delivery and idempotent retry; test provider error/captcha expiry. No delivery claim before a real provider receipt.
- Verify secrets cannot reach client bundles, public config, logs or artifacts.
- Record exact test-mode evidence and obtain explicit live activation approval.

## What was verified in the build

Pure-rule and dependency-injected tests cover cart validation, tampering, eligibility, retries, simulated atomic inventory, signatures, delayed payment, replay, delivery failures and HTTP boundaries. Browser tests cover the multi-page site, project workflows, mock hosted checkout, PDFs, responsive layouts and automated accessibility rules. Actual deployed-site verification separately checks source commit, server configuration and fail-closed behavior. None is represented as a real paid-order, delivery or fulfillment test.
