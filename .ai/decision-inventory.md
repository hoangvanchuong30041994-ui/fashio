# Purpose

**Ownership:** This document inventories evidence-backed technical decisions. Accepted decision rationale belongs in `.ai/decisions.md`.

`decision-inventory.md` is the repository-wide inventory of technical decisions that already exist in source, configuration, schema, scripts, or documented repository rules.

This file is not an ADR.
It does not record rationale, trade-offs, or consequences.
It records what decisions are present, where they are evidenced, who owns them, when they were last verified, and the current ADR reference state for each decision.

# Scope

This inventory covers technical decisions that are implemented, in progress, planned, deprecated, or unknown based on repository evidence from configuration files, Prisma files, `src/`, `messages/`, and repository documentation.

Only decisions with evidence are listed.

Repository source code remains the highest source of truth. Documentation is used only when source code, configuration, or schema does not fully express the decision.

# Status Legend

- Implemented
- In Progress
- Planned
- Deprecated
- Unknown

# Decision Inventory

## Framework

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-001 | The application uses Next.js 16 as the primary framework | Implemented | `package.json` | Repository Root | High | 2026-07-09 | ADR-001 |
| D-002 | The repository uses React 19 | Implemented | `package.json` | Repository Root | High | 2026-07-09 | — |

## Architecture

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-004 | The repository follows a feature-first structure with `src/app`, `src/features`, and `src/shared` | Implemented | `src/app`, `src/features`, `src/shared` | Repository Root | High | 2026-07-09 | ADR-002 |
| D-005 | `src/app` is used for routing, layouts, and route orchestration rather than domain logic | Implemented | `src/app` | `src/app` | High | 2026-07-09 | — |
| D-006 | Shared infrastructure and reusable UI live under `src/shared` | Implemented | `src/shared` | `src/shared` | High | 2026-07-09 | — |
| D-007 | Domain-specific code is organized under `src/features` | Implemented | `src/features` | `src/features` | High | 2026-07-09 | — |
| D-066 | Repository pattern is not implemented; features access Prisma directly through `queries/` and `actions/` | Implemented | `src/features`, `src/shared/lib/prisma.ts` | `src/features` | High | 2026-07-09 | — |
| D-067 | Separate domain-layer entities or value objects are not implemented | Implemented | `src/` | Repository Root | Medium | 2026-07-09 | — |
| D-068 | `src/features/agent` exists only as a stub with no application code | Planned | `src/features/agent/index.ts` | `src/features/agent` | High | 2026-07-09 | — |
| D-069 | `src/features/user` exists only as a stub with no application code | Planned | `src/features/user/index.ts` | `src/features/user` | High | 2026-07-09 | — |

## Rendering

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-008 | Server Components are the default rendering model | Implemented | `src/app/[locale]/layout.tsx`, `src/app/[locale]/(main)/page.tsx` | `src/app` | High | 2026-07-09 | ADR-003 |
| D-009 | Client Components are used only for interactive leaf components such as forms and selectors | Implemented | `src/features/auth/components/login-form.tsx`, `src/features/order/components/checkout-form.tsx`, `src/features/product/components/product-variant-selector.tsx` | `src/features` | High | 2026-07-09 | — |
| D-010 | Server Actions are used for authenticated and state-changing mutations | Implemented | `src/features/auth/actions/sign-in.ts`, `src/features/cart/actions/add-to-cart.ts`, `src/features/order/actions/create-order.ts` | `src/features` | High | 2026-07-09 | — |
| D-011 | React Compiler is enabled in Next.js config | Implemented | `next.config.ts` | Repository Root | High | 2026-07-09 | — |

## Routing

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-012 | The repository uses Next.js App Router | Implemented | `src/app` | `src/app` | High | 2026-07-09 | — |
| D-013 | Route groups separate auth routes from main storefront routes | Implemented | `src/app/[locale]/(auth)`, `src/app/[locale]/(main)` | `src/app` | High | 2026-07-09 | — |
| D-014 | Locale-aware routing is enforced under `src/app/[locale]` | Implemented | `src/app/[locale]`, `src/i18n/routing.ts`, `src/app/[locale]/layout.tsx` | `src/i18n` | High | 2026-07-09 | — |
| D-015 | Middleware is used for locale routing, not for auth enforcement | Implemented | `src/proxy.ts` | `src/i18n` | High | 2026-07-09 | — |
| D-016 | Auth protection is applied at page level using auth guards | Implemented | `src/features/auth/server/require-auth.ts`, `src/features/auth/server/require-guest.ts`, `src/app/[locale]/(main)/checkout/page.tsx`, `src/app/[locale]/(main)/orders/page.tsx` | `src/features/auth` | High | 2026-07-09 | — |

## Authentication

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-022 | Better Auth is the authentication system | Implemented | `src/features/auth/server/auth.ts`, `src/app/api/auth/[[...all]]/route.ts` | `src/features/auth` | High | 2026-07-09 | ADR-005 |
| D-023 | Better Auth uses Prisma as its persistence adapter | Implemented | `src/features/auth/server/auth.ts` | `src/features/auth` | High | 2026-07-09 | — |
| D-024 | Authentication supports email/password sign-in and sign-up, with verification required before sign-in | Implemented | `src/features/auth/server/auth.ts`, `src/features/auth/actions/sign-in.ts`, `src/features/auth/actions/sign-up.ts`, `src/features/auth/services/email.service.ts` | `src/features/auth` | High | 2026-07-13 | — |
| D-025 | Authentication supports Google and GitHub OAuth providers | Implemented | `src/features/auth/server/auth.ts`, `src/features/auth/client/auth-client.ts` | `src/features/auth` | High | 2026-07-09 | — |
| D-026 | Session lookup is server-first and wrapped with React `cache()` | Implemented | `src/features/auth/server/session.ts` | `src/features/auth` | High | 2026-07-09 | — |
| D-027 | Better Auth route handling is exposed through `/api/auth/[[...all]]` | Implemented | `src/app/api/auth/[[...all]]/route.ts` | `src/features/auth` | High | 2026-07-09 | — |
| D-028 | Auth middleware is not implemented; auth enforcement remains page-level | Implemented | `src/proxy.ts`, `src/features/auth/server/require-auth.ts`, `src/features/auth/server/require-guest.ts` | `src/features/auth` | High | 2026-07-09 | — |

## Database

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-029 | PostgreSQL is the database provider | Implemented | `prisma/schema.prisma` | `prisma` | High | 2026-07-09 | ADR-006 |
| D-030 | Prisma is the ORM and primary data access layer | Implemented | `src/shared/lib/prisma.ts`, `package.json` | `prisma` | High | 2026-07-09 | — |
| D-031 | Prisma Client is generated to `prisma/generated` instead of default output | Implemented | `prisma/schema.prisma`, `tsconfig.json`, `prisma/generated` | `prisma` | High | 2026-07-09 | — |
| D-032 | Runtime Prisma access uses `@prisma/adapter-pg` | Implemented | `src/shared/lib/prisma.ts`, `package.json` | `prisma` | High | 2026-07-09 | — |
| D-033 | A singleton-style Prisma client is reused through `globalThis` in non-production | Implemented | `src/shared/lib/prisma.ts` | `src/shared` | High | 2026-07-09 | — |
| D-034 | Prisma migrations are part of the workflow | Implemented | `prisma/migrations`, `package.json` | `prisma` | High | 2026-07-09 | — |
| D-035 | Database seeding is part of the workflow via `prisma/seed.ts` | Implemented | `prisma/seed.ts`, `package.json` | `prisma` | High | 2026-07-09 | — |
| D-036 | The Prisma schema includes Better Auth core tables plus product, cart, order, agent, and user preference models | Implemented | `prisma/schema.prisma` | `prisma` | High | 2026-07-09 | — |
| D-037 | Cart supports both guest carts and authenticated user carts | Implemented | `prisma/schema.prisma`, `src/features/cart/actions/add-to-cart.ts` | `src/features/cart` | High | 2026-07-09 | — |
| D-038 | Order status is modeled as an enum in the database schema | Implemented | `prisma/schema.prisma` | `prisma` | High | 2026-07-09 | — |
| D-039 | Agent and user-preference database models exist before application-layer implementation | Planned | `prisma/schema.prisma`, `src/features/agent/index.ts`, `src/features/user/index.ts` | `prisma` | High | 2026-07-09 | — |
| D-040 | Semantic search with pgvector is noted in schema comments but not implemented | Planned | `prisma/schema.prisma` | `prisma` | High | 2026-07-09 | — |

## Validation

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-041 | Zod is the schema validation library | Implemented | `src/features/auth/schemas/login.schema.ts`, `src/features/order/schemas/checkout.schema.ts`, `package.json` | `src/features` | High | 2026-07-09 | ADR-007 |
| D-042 | Input validation is performed at server-action boundaries | Implemented | `src/features/auth/actions/sign-in.ts`, `src/features/auth/actions/sign-up.ts`, `src/features/order/actions/create-order.ts` | `src/features` | High | 2026-07-09 | — |

## Forms

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-043 | React Hook Form is used for auth forms | Implemented | `src/features/auth/components/login-form.tsx`, `src/features/auth/components/register-form.tsx`, `package.json` | `src/features/auth` | High | 2026-07-09 | ADR-008 |
| D-044 | `@hookform/resolvers` with Zod is used for auth form validation | Implemented | `src/features/auth/components/login-form.tsx`, `package.json` | `src/features/auth` | High | 2026-07-09 | — |
| D-045 | `useActionState` is used for checkout and cart-related mutation forms | Implemented | `src/features/order/components/checkout-form.tsx`, `src/features/product/components/product-variant-selector.tsx` | `src/features/order` | Medium | 2026-07-09 | — |

## UI

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-046 | Tailwind CSS 4 is the styling system | Implemented | `package.json` | Repository Root | High | 2026-07-09 | ADR-009 |
| D-047 | Shared UI primitives are maintained under `src/shared/components/ui` | Implemented | `src/shared/components/ui` | `src/shared` | High | 2026-07-09 | — |
| D-048 | `next-themes` is used for theming | Implemented | `src/shared/components/theme-provider.tsx`, `src/shared/components/providers.tsx`, `package.json` | `src/shared` | High | 2026-07-09 | — |
| D-049 | Hugeicons is the icon system in feature UI | Implemented | `src/features/auth/components/login-form.tsx`, `src/shared/components/icons`, `package.json` | `src/shared` | High | 2026-07-09 | — |
| D-050 | The repository includes shadcn-related dependencies and a large shared primitive layer | Implemented | `src/shared/components/ui`, `package.json` | `src/shared` | High | 2026-07-09 | — |

## State Management

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-051 | Server state is preferred over global client state | Implemented | `src/app`, `src/features/cart/queries`, `src/features/order/queries`, `src/features/product/queries` | `src/app` | Medium | 2026-07-09 | ADR-010 |
| D-052 | No dedicated global client state library is in use | Implemented | `package.json` | Repository Root | High | 2026-07-09 | — |

## Performance

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-053 | Static params are generated for locales | Implemented | `src/app/[locale]/layout.tsx` | `src/app` | High | 2026-07-09 | — |
| D-054 | Revalidation is used after mutations to refresh affected views | Implemented | `src/features/cart/actions/add-to-cart.ts`, `src/features/order/actions/create-order.ts` | `src/features` | High | 2026-07-09 | — |

## Security

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-055 | Authentication and authorization decisions are server-side concerns | Implemented | `src/features/auth/server/session.ts`, `src/features/auth/server/require-auth.ts`, `src/features/auth/server/require-guest.ts` | `src/features/auth` | High | 2026-07-09 | — |
| D-056 | Secrets and provider credentials are supplied through environment variables rather than hardcoded values | Implemented | `src/features/auth/server/auth.ts`, `src/shared/lib/prisma.ts` | Repository Root | High | 2026-07-09 | — |
| D-057 | Better Auth core table naming must remain unchanged | Implemented | `prisma/schema.prisma` | `prisma` | High | 2026-07-09 | — |

## Internationalization

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-017 | `next-intl` is the internationalization framework | Implemented | `src/i18n/request.ts`, `next.config.ts`, `package.json` | `src/i18n` | High | 2026-07-09 | ADR-004 |
| D-018 | Supported locales are `vi` and `en` with `vi` as default locale | Implemented | `src/i18n/routing.ts` | `src/i18n` | High | 2026-07-09 | — |
| D-019 | Localized pathnames are defined centrally in `src/i18n/routing.ts` | Implemented | `src/i18n/routing.ts` | `src/i18n` | High | 2026-07-09 | — |
| D-020 | Message catalogs are stored as namespace-based JSON files under `messages/en` and `messages/vi` | Implemented | `messages/en`, `messages/vi` | `src/i18n` | High | 2026-07-09 | — |
| D-021 | Server-side request config resolves locale and message bundle via `getRequestConfig` | Implemented | `src/i18n/request.ts` | `src/i18n` | High | 2026-07-09 | — |

## Tooling

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-003 | TypeScript is the primary language with strict mode enabled | Implemented | `tsconfig.json`, `package.json` | Repository Root | High | 2026-07-09 | — |
| D-058 | Path aliases are used for `src`, auth, shared lib, hooks, components, and generated Prisma client | Implemented | `tsconfig.json` | Repository Root | High | 2026-07-09 | — |
| D-059 | Module resolution uses ESNext with bundler resolution | Implemented | `tsconfig.json` | Repository Root | High | 2026-07-09 | — |
| D-060 | ESLint is part of the standard development workflow | Implemented | `package.json` | Repository Root | High | 2026-07-09 | — |
| D-061 | Prettier with `prettier-plugin-tailwindcss` is part of the repository tooling | Implemented | `package.json` | Repository Root | High | 2026-07-09 | — |
| D-062 | Prisma Client generation runs on postinstall | Implemented | `package.json` | Repository Root | High | 2026-07-09 | — |

## Deployment

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-063 | Production startup uses `next build` followed by `next start` | Implemented | `package.json` | Repository Root | High | 2026-07-09 | — |
| D-064 | Vercel is the documented primary deployment platform | Planned | `.ai/project.md` | Repository Root | Medium | 2026-07-09 | — |

## Testing

| ID | Decision | Status | Source | Owner | Confidence | Last Verified | ADR Reference |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D-065 | No automated test suite is currently present in the repository | Implemented | `package.json` | Repository Root | High | 2026-07-09 | — |

# Decisions Without ADR

Use the `ADR Reference` column as the canonical indicator. A value of `—` means the inventory entry has no accepted ADR record. Existing ADRs may cover more than one related inventory decision.

# Decisions Pending

- D-028 Auth middleware is not implemented; page-level guards remain the active approach.
- D-039 Agent and user-preference application layers are not implemented.
- D-040 Semantic search with pgvector is only noted in schema comments.
- D-064 Vercel is documented as the primary platform, but repository deployment configuration is not present in source.
- D-068 Agent feature remains stub-only.
- D-069 User feature remains stub-only.

Potential overlap review:

- D-004, D-006, and D-007 are related but not duplicates. D-004 describes the top-level structural pattern. D-006 and D-007 describe the responsibility split between shared and feature modules.
- D-008 and D-051 are related but not duplicates. D-008 covers rendering defaults. D-051 covers state ownership.
- D-022 through D-028 are related auth decisions with different scope and should remain separate.
- D-030 and D-066 are related but not duplicates. D-030 records Prisma as the data access layer. D-066 records the absence of a repository abstraction layer.

# Maintenance Rules

- Add a decision only when there is direct repository evidence.
- Every decision must include at least one concrete `Source`.
- Prefer source code as `Source` whenever it directly proves the decision.
- Use configuration files as `Source` when the decision is configuration-driven.
- Use schema files as `Source` when the decision is data-model-driven.
- Use repository documentation as `Source` only when source code, configuration, or schema does not fully express the decision.
- Every decision must include a single primary `Owner`.
- Use directory or module owners only. Do not use ambiguous owners.
- Update `Last Verified` whenever a decision is re-checked against current repository state.
- Keep `ADR Reference` as `—` until an ADR actually exists.
- If implementation changes invalidate a decision, update its `Status` instead of silently removing it.
- Do not convert this file into an ADR log.
- Do not record undocumented preferences as decisions.
- Use `High` confidence only when repository evidence is direct and sufficient.
- Use `Medium` or `Low` confidence when evidence is partial or inferential.
- If evidence disappears or becomes contradictory, move the decision to `Unknown` or `Decisions Pending` until re-verified.
