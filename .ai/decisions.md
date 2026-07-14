# Architecture Decisions

## Purpose

This document records accepted architecture decisions. The evidence-backed decision inventory is maintained in `.ai/decision-inventory.md`.

## Index

| ID | Title | Status |
| --- | --- | --- |
| ADR-001 | Adopt a Next.js App Router core application stack | Implemented |
| ADR-002 | Adopt feature-first repository organization | Implemented |
| ADR-003 | Use a server-first rendering and mutation model | Implemented |
| ADR-004 | Use localized App Router routing with next-intl | Implemented |
| ADR-005 | Standardize authentication on Better Auth with server-first session access | Implemented |
| ADR-006 | Use Prisma and PostgreSQL as the primary data layer | Implemented |
| ADR-007 | Validate server-side input with Zod | Implemented |
| ADR-008 | Use React Hook Form for auth forms and useActionState for server-action mutation forms | Implemented |
| ADR-009 | Standardize shared UI on Tailwind CSS, shared primitives, and theme support | Implemented |
| ADR-010 | Prefer server-owned state and mutation-driven refresh over global client state | Implemented |

# ADR-001

## Title

Adopt a Next.js App Router core application stack

## Status

Implemented

## Context

The repository needs a single web application foundation that can provide routing, layout composition, server rendering, and a predictable production workflow. The codebase also needs a consistent typed development model so feature code, shared code, and framework integration all operate inside one runtime and build system.

## Decision

The project uses Next.js 16 with App Router as its application framework, React 19 as the UI runtime, and TypeScript with strict mode as the primary language configuration. This establishes one framework boundary for routing, rendering, application startup, and build output, rather than mixing multiple frontend application patterns.

## Consequences

- Provides a single framework boundary for routing, rendering, and application startup.
- Keeps feature and shared code aligned to one runtime model.
- Strengthens maintainability through strict TypeScript checking.
- Preserves the standard Next.js build and start lifecycle.
- Ties the application to App Router conventions and React 19 behavior.
- Makes framework replacement a significant future change.

## Repository Evidence

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `src/app`

## Related Decisions

- ADR-002
- ADR-003
- ADR-004
- ADR-005
- ADR-006

# ADR-002

## Title

Adopt feature-first repository organization

## Status

Implemented

## Context

The repository needs a structural convention that can scale across multiple storefront domains while staying understandable to new developers and AI agents. Without a stable top-level split, business modules, route orchestration, and reusable infrastructure would become harder to separate and maintain.

## Decision

The project uses a feature-first repository organization centered on `src/features` for domain-oriented modules, `src/shared` for reusable infrastructure and UI primitives, and `src/app` for routing, layouts, and route orchestration. The repository does not introduce a separate repository abstraction layer or a dedicated domain-layer entity and value-object model at the current stage. Feature data access is handled directly through feature `queries/` and `actions/` using the shared Prisma client.

## Consequences

- Keeps business code grouped by feature instead of by technical layer alone.
- Preserves a clear responsibility split between routes, features, and shared modules.
- Avoids adding extra abstraction layers before they are justified by source complexity.
- Makes feature growth easier within the current repository shape.
- Leaves repository abstraction and domain-layer formalization open for future decisions.
- Requires discipline to keep business logic out of `src/app` and feature-specific logic out of `src/shared`.

## Repository Evidence

- `src/app`
- `src/features`
- `src/shared`
- `src/shared/lib/prisma.ts`

## Related Decisions

- ADR-001
- ADR-003
- ADR-005
- ADR-006
- ADR-010

# ADR-003

## Title

Use a server-first rendering and mutation model

## Status

Implemented

## Context

The storefront needs a rendering model that supports data-backed pages, authenticated flows, and localized routes without forcing unnecessary client-side state and hydration. It also needs a mutation boundary that keeps sensitive operations on the server and aligns with the framework’s built-in primitives.

## Decision

The project uses a server-first model. Server Components are the default rendering unit for routes and layout composition. Client Components are limited to interactive leaf components such as forms and selectors. State-changing operations are handled through Server Actions, and React Compiler is enabled in the Next.js configuration.

## Consequences

- Reduces the amount of client-side logic that must be hydrated.
- Keeps sensitive mutations on the server boundary.
- Supports server-rendered data access in route-level components.
- Limits client complexity to interaction-focused components.
- Requires careful boundary discipline between server and client code.
- Makes some highly interactive flows more constrained than a client-heavy architecture.

## Repository Evidence

- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/(main)/page.tsx`
- `src/features/auth/components/login-form.tsx`
- `src/features/order/components/checkout-form.tsx`
- `src/features/product/components/product-variant-selector.tsx`
- `src/features/auth/actions/sign-in.ts`
- `src/features/cart/actions/add-to-cart.ts`
- `src/features/order/actions/create-order.ts`
- `next.config.ts`

## Related Decisions

- ADR-001
- ADR-002
- ADR-004
- ADR-005
- ADR-010

# ADR-004

## Title

Use localized App Router routing with next-intl

## Status

Implemented

## Context

The storefront needs locale-aware routing and localized content delivery as a built-in capability rather than an afterthought. The repository also needs one place to define supported locales, localized pathnames, and request-time message resolution so routing and translation loading remain aligned.

## Decision

The project uses `next-intl` for internationalization and locale-aware routing. Supported locales are `vi` and `en`, with `vi` as the default locale. Localized routing is enforced under `src/app/[locale]`. Pathname localization is defined centrally in `src/i18n/routing.ts`, request-time locale and message resolution are handled in `src/i18n/request.ts`, and middleware is used for locale routing rather than for authentication enforcement.

## Consequences

- Centralizes locale definitions and pathname mapping.
- Integrates internationalization directly into the routing model.
- Supports consistent server-side locale and message resolution.
- Makes locale expansion easier within the current structure.
- Requires message catalog consistency across supported locales.
- Keeps auth enforcement outside middleware, which narrows middleware responsibility.

## Repository Evidence

- `src/i18n/routing.ts`
- `src/i18n/request.ts`
- `src/proxy.ts`
- `src/app/[locale]`
- `messages/en`
- `messages/vi`
- `next.config.ts`
- `package.json`

## Related Decisions

- ADR-001
- ADR-003
- ADR-005

# ADR-005

## Title

Standardize authentication on Better Auth with server-first session access

## Status

Implemented

## Context

The repository needs a single authentication system that can support email and password login, OAuth providers, persistent sessions, and server-side access control without scattering auth logic across unrelated modules. The auth model must also align with the server-first rendering approach already used by the application.

## Decision

The project standardizes authentication on Better Auth. Better Auth is configured with Prisma persistence, email and password authentication, Google OAuth, and GitHub OAuth. Session access is performed server-first through the auth session helper and wrapped with React `cache()`. The HTTP auth surface is exposed through `/api/auth/[[...all]]`, and active route protection is enforced at page level through auth guards rather than middleware.

## Consequences

- Provides one authentication system for sign-in, sign-up, OAuth, and session lookup.
- Keeps auth decision points on the server.
- Aligns authentication with Prisma-backed persistence.
- Reuses page-level guards with the current App Router structure.
- Leaves middleware-based auth enforcement unimplemented.
- Requires route protection discipline at page boundaries.

## Repository Evidence

- `src/features/auth/server/auth.ts`
- `src/features/auth/server/session.ts`
- `src/features/auth/server/require-auth.ts`
- `src/features/auth/server/require-guest.ts`
- `src/features/auth/client/auth-client.ts`
- `src/app/api/auth/[[...all]]/route.ts`
- `src/features/auth/actions/sign-in.ts`
- `src/features/auth/actions/sign-up.ts`

## Related Decisions

- ADR-003
- ADR-004
- ADR-006
- ADR-007

# ADR-006

## Title

Use Prisma and PostgreSQL as the primary data layer

## Status

Implemented

## Context

The repository needs one persistence model for authentication data and commerce data. It also needs a consistent schema workflow, migration workflow, runtime client strategy, and shared data access mechanism that can be reused across feature modules without introducing multiple database access patterns.

## Decision

The project uses PostgreSQL as the database provider and Prisma as the ORM and primary data access layer. Prisma Client is generated to `prisma/generated`, runtime access uses `@prisma/adapter-pg`, and a singleton-style Prisma client is reused through `globalThis` outside production. Prisma migrations and seeding are part of the repository workflow. The schema contains Better Auth core tables and commerce-related models for products, carts, orders, agent conversations, and user preferences.

## Consequences

- Unifies authentication and storefront persistence in one schema workflow.
- Provides a single query and mutation model across features.
- Makes migrations and seeding part of normal repository operations.
- Supports direct feature-level data access through Prisma.
- Couples the data layer to Prisma conventions and generated client output.
- Leaves planned schema capabilities outside implemented application flows.

## Repository Evidence

- `prisma/schema.prisma`
- `prisma/generated`
- `prisma/migrations`
- `prisma/seed.ts`
- `src/shared/lib/prisma.ts`
- `package.json`
- `tsconfig.json`

## Related Decisions

- ADR-002
- ADR-005
- ADR-007
- ADR-010

# ADR-007

## Title

Validate server-side input with Zod

## Status

Implemented

## Context

The repository needs a consistent validation strategy for implemented authentication and order flows. Validation must protect server-side mutations and remain compatible with the form handling patterns already used by the application.

## Decision

The project uses Zod as the validation library and applies schema validation at server-action boundaries. Authentication and checkout schemas are defined inside feature modules and are used to validate submitted input before business logic proceeds. For auth forms, the same schema layer is also integrated with the React Hook Form resolver.

## Consequences

- Establishes one validation approach across implemented mutation flows.
- Keeps server-side validation as the authoritative boundary.
- Allows schema reuse across actions and form integration.
- Improves typed parsing and error consistency.
- Requires schema maintenance as forms and actions evolve.
- Leaves unimplemented domains without validated application flows until they are built.

## Repository Evidence

- `src/features/auth/schemas/login.schema.ts`
- `src/features/order/schemas/checkout.schema.ts`
- `src/features/auth/actions/sign-in.ts`
- `src/features/auth/actions/sign-up.ts`
- `src/features/order/actions/create-order.ts`
- `package.json`

## Related Decisions

- ADR-003
- ADR-005
- ADR-008

# ADR-008

## Title

Use React Hook Form for auth forms and useActionState for server-action mutation forms

## Status

Implemented

## Context

The repository currently contains two implemented form interaction patterns. Authentication flows need richer client-side field handling and schema integration, while checkout and cart-related mutation flows need a lightweight bridge into Server Actions. The project needs an explicit rule for these already implemented cases.

## Decision

The project uses React Hook Form for authentication forms and integrates it with Zod through `@hookform/resolvers`. For checkout and cart-related mutation flows, the project uses `useActionState` to connect form submission to Server Actions. This establishes two approved form patterns aligned to the current responsibilities of each flow.

## Consequences

- Supports richer field interaction for authentication forms.
- Keeps mutation forms lightweight and aligned with server-first updates.
- Makes the implemented form patterns explicit.
- Preserves compatibility with the current rendering and validation model.
- Requires contributors to understand two form patterns.
- May need future consolidation if additional form types expand.

## Repository Evidence

- `src/features/auth/components/login-form.tsx`
- `src/features/auth/components/register-form.tsx`
- `src/features/order/components/checkout-form.tsx`
- `src/features/product/components/product-variant-selector.tsx`
- `package.json`

## Related Decisions

- ADR-003
- ADR-007

# ADR-009

## Title

Standardize shared UI on Tailwind CSS, shared primitives, and theme support

## Status

Implemented

## Context

The repository needs a reusable UI foundation that can serve multiple storefront features without rebuilding primitives inside each feature. It also needs a consistent styling system and theme mechanism that can operate across shared and feature-level UI.

## Decision

The project uses Tailwind CSS 4 as the styling system and maintains shared UI primitives under `src/shared/components/ui`. Theme handling is implemented with `next-themes`. The UI layer also uses Hugeicons and a shadcn-oriented primitive stack reflected in dependencies and shared component structure.

## Consequences

- Encourages reuse of shared primitives instead of rebuilding UI foundations per feature.
- Keeps styling centered on one utility-first system.
- Supports theme-aware UI composition.
- Provides a consistent base for feature-level interfaces.
- Couples UI implementation to the current shared primitive layer and dependency set.
- Requires continued discipline as the shared primitive layer grows.

## Repository Evidence

- `src/shared/components/ui`
- `src/shared/components/theme-provider.tsx`
- `src/shared/components/providers.tsx`
- `src/shared/components/icons`
- `package.json`

## Related Decisions

- ADR-002
- ADR-003

# ADR-010

## Title

Prefer server-owned state and mutation-driven refresh over global client state

## Status

Implemented

## Context

The repository needs a state model that fits server-rendered storefront pages, authenticated flows, and direct database-backed reads. The project must avoid introducing unnecessary client-wide state complexity when server rendering, feature queries, and mutation-triggered refresh are already present.

## Decision

The project prefers server-owned state over global client state. Feature data is primarily loaded through server-rendered routes and feature query modules, and view refresh is driven through mutation-side revalidation. The repository does not use a dedicated global client state library.

## Consequences

- Keeps authoritative data close to server rendering and database-backed queries.
- Reduces the need for centralized client-side state management.
- Aligns state handling with the server-first architecture and Server Action model.
- Makes revalidation part of the update path after mutations.
- Can make highly interactive client-side workflows more dependent on server boundaries.
- Requires careful revalidation coverage as mutation surfaces expand.

## Repository Evidence

- `src/app`
- `src/features/cart/queries`
- `src/features/order/queries`
- `src/features/product/queries`
- `src/features/cart/actions/add-to-cart.ts`
- `src/features/order/actions/create-order.ts`
- `package.json`

## Related Decisions

- ADR-002
- ADR-003
- ADR-006