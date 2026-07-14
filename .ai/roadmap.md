# Development Roadmap

## Purpose

`.ai/roadmap.md` defines repository development sequencing and deferred work. It is planning context, not a source of current implementation truth; use `current-task.md` for active context and `architecture.md` for as-built status.

## Status Taxonomy

This roadmap uses the shared taxonomy from `architecture.md`: Implemented, Implemented with Known Limitations, In Progress, Planned, Not Implemented, Not Defined Yet, and Unknown.

## Current Phase

**Repository Foundation Stabilization — In Progress**

Goal: maintain a consistent documentation baseline and preserve the implemented storefront foundation before broader feature expansion.

## Development Phases

| Phase | Area | Status | Priority | Scope |
| --- | --- | --- | --- | --- |
| 1 | Repository Foundation | In Progress | Highest | Documentation, decision tracking, coding standards, and working context alignment. |
| 2 | Authentication | Implemented with Known Limitations | High | Better Auth, session access, page guards, and auth UI; middleware remains locale-focused. |
| 3 | Catalog | Implemented | High | Product listing, detail, collections, and localized presentation. |
| 4 | Cart | Implemented with Known Limitations | High | Guest/authenticated carts and cart mutations; guest-to-user merge is not implemented. |
| 5 | Checkout and Orders | Implemented with Known Limitations | High | Checkout, order creation, list, and detail; payment and broader status workflow are not implemented. |
| 6 | Payment | Not Implemented | Medium | Reserved for explicitly approved payment design and implementation. |
| 7 | User | Planned | Low | Reserved for approved application-layer implementation of `src/features/user`. |
| 8 | Agent | Planned | Low | Reserved for approved application-layer implementation of `src/features/agent`. |
| 9 | Testing | Not Implemented | Medium | Reserved until a test strategy, tooling, and scripts are approved. |
| 10 | Deployment | In Progress | Medium | Current build/start workflow exists; broader deployment standardization remains unverified. |

## Current Priorities

1. Keep documentation synchronized with verified repository state.
2. Stabilize governance and repository conventions.
3. Preserve implemented authentication, catalog, cart, checkout, and order behavior.
4. Avoid unapproved expansion into payment, user, agent, testing, or broader middleware responsibility.

## Deferred Work

- Payment implementation.
- `agent` and `user` application logic.
- Auth middleware expansion beyond locale routing.
- Automated test infrastructure without an approved strategy.
- Deployment platform expansion beyond currently evidenced build/start workflow.
- Monitoring and semantic-search expansion referenced by existing repository documentation.

## Planning Rules

- Do not treat planned or stub-only areas as active implementation targets.
- `current-task.md` takes precedence over this roadmap for active work.
- `AGENTS.md` stop conditions apply to all roadmap phases.
- Update this document only when sequencing, priority, or phase status changes.
