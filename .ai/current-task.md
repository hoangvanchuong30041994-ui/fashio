# Current Task Context

**Last Updated:** 2026-07-13
**Status:** Active

## Purpose

This document is working memory for the active repository context. It does not replace stable architecture, governance, coding conventions, or roadmap sequencing.

## Current Phase

**Repository Foundation Stabilization**

The active goal is to keep repository documentation, AI governance, decision tracking, and coding conventions aligned with the implemented storefront baseline.

## Implemented Baseline

- App Router and locale-aware routing.
- Better Auth integration, server session helpers, and required email verification for email/password accounts.
- Product catalog.
- Guest and authenticated cart behavior.
- Checkout, order creation, order list, and order detail.
- Shared UI and layout foundation.
- AI documentation, decision inventory, ADRs, and coding standards.

## Implemented with Known Limitations

- Authentication is protected at page level; middleware remains locale-focused.
- Cart does not merge guest and authenticated carts on login.
- Checkout and orders do not include payment processing or a broader order-status workflow.

## Planned or Not Implemented

- Payment.
- Application-layer implementation for `src/features/agent`.
- Application-layer implementation for `src/features/user`.
- Automated test suite.
- Broader middleware responsibility beyond locale routing.
- Monitoring and other future expansion areas listed in `roadmap.md`.

## Active Risks and Blockers

- No automated test suite is present.
- Payment is not implemented.
- `agent` and `user` are stub-only feature areas.
- Authentication protection is split between page guards and locale-only middleware.
- Future work can cause documentation drift if responsible documents are not updated.

## Modification Context

- Follow `.ai/current-files.md` for editable, protected, high-risk, and frozen surfaces.
- `prisma/schema.prisma`, authentication, locale routing, configuration, `agent`, `user`, and cross-feature refactors require the approval rules in `AGENTS.md`.
- Expand only existing implemented domains unless explicit scope authorizes another area.

## Immediate Next Safe Step

Begin Authentication Documentation by reading `AGENTS.md`, `.ai/architecture.md`, `.ai/decision-inventory.md`, `.ai/decisions.md`, and `.ai/current-files.md`; verify statements against the documented sources of truth; and update only the responsible documentation within the existing auth boundary. Do not change authentication behavior, routes, locale strategy, schema, dependencies, or architecture without the confirmation required by `AGENTS.md`.

## Maintenance

Documentation ownership and update policy are defined in `.ai/document-map.md`. This file should be updated only when the active working context materially changes.
