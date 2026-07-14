# Purpose

`.ai/coding-style.md` defines the official coding standard for this repository.

It exists to keep human contributors and AI Agents aligned on how code should be written inside the current codebase.

It is not an ESLint rule list.
It is not an architecture document.
It is not an AI governance document.
It complements `README.md`, `.ai/project.md`, `.ai/architecture.md`, `.ai/decision-inventory.md`, `.ai/decisions.md`, and `AGENTS.md`.

When implementation patterns in source code conflict with older documentation, current repository source code is the source of truth.

# Quick Navigation

- `Project Structure Rules`, `TypeScript Rules`, `Import Rules`, `Naming Convention`, and `Feature Module Rules`
- `Server Component Rules`, `Client Component Rules`, `Server Action Rules`, `Query Rules`, `Service Rules`, `Prisma Rules`, `Validation Rules`, and `Form Rules`
- `Authentication Rules`, `Internationalization Rules`, `UI Rules`, `State Management Rules`, `Error Handling Rules`, `Performance Rules`, `Security Rules`, `Testing Rules`, and `Refactoring Rules`
- `Repository Patterns`, `Repository Conventions`, `Decision Trees`, `Anti Patterns`, and completion checklists

# Coding Philosophy

The current codebase follows these practical coding principles:

- Prefer existing repository patterns over generic best-practice templates.
- Keep routing in `src/app`, feature logic in `src/features`, and reusable infrastructure in `src/shared`.
- Prefer server-first code paths for data loading, auth decisions, and mutations.
- Keep Client Components focused on interaction.
- Use explicit typing and small, composable functions.
- Keep feature code local until there is proven reuse.
- Reuse shared UI primitives before creating new UI abstractions.
- Validate input at server boundaries.
- Keep user-facing text localized.
- Prefer small, local, reversible changes over broad rewrites.

# Project Structure Rules

The repository uses a feature-first structure.

Rules:

- `src/app` is for routing, layouts, route groups, page orchestration, metadata, and route handlers.
- `src/app` must not become a general business-logic layer.
- `src/features` contains feature-specific code such as components, actions, queries, schemas, services, types, hooks, constants, and utils.
- `src/shared` contains reusable UI primitives, shared layout components, providers, hooks, and cross-feature infrastructure.
- `src/i18n` contains locale routing, navigation helpers, request configuration, and message aggregation.
- `prisma` contains schema, migrations, generated client output, and seed workflow.
- `messages` contains locale message catalogs.

Use the smallest responsible location:

- Route concern -> `src/app`
- Feature concern -> `src/features/<feature>`
- Cross-feature reusable concern -> `src/shared`
- Locale concern -> `src/i18n`
- Database schema concern -> `prisma/schema.prisma`

GOOD

- `src/app/[locale]/(main)/checkout/page.tsx`
- `src/features/order/actions/create-order.ts`
- `src/shared/components/ui/button.tsx`

BAD

- Business logic moved into `src/app`
- Feature-specific helper moved into `src/shared` without reuse
- Locale logic created outside `src/i18n`

# TypeScript Rules

The repository uses TypeScript in strict mode.

Rules:

- Keep all new code compatible with `strict: true` in `tsconfig.json`.
- Do not use `any`.
- Use `unknown` when the runtime type is genuinely unknown and narrow it before use.
- Prefer explicit function return types for exported functions, server actions, and shared utilities.
- Use `type` for object shapes, action state, and derived types unless `interface` provides a clear benefit that already exists in the file.
- Prefer derived types from implementation when it improves consistency, such as:
  - `Awaited<ReturnType<typeof getCart>>`
  - `NonNullable<...>`
  - `z.infer<typeof schema>`
- Reuse utility types instead of duplicating shapes.
- Use readonly semantics when data is intended to be immutable at the call site, especially for props and constant configuration objects.
- Prefer narrow string unions or literal types for action codes and state codes.
- Avoid type assertions unless narrowing is not practical and the source shape is already validated.
- If a cast is needed after schema validation, keep it local and minimal.

GOOD

- `type AuthActionState = { ok: boolean; formError?: AuthErrorCode }`
- `export type RegisterInput = z.infer<typeof registerSchema>`
- `function mapAuthError(error: unknown)`

BAD

- `let result: any`
- `function mapAuthError(error: any)`
- Broad untyped object returns from actions

# Import Rules

The repository uses alias imports.

Rules:

- Prefer alias imports over deep relative paths.
- Use configured aliases from `tsconfig.json`:
  - `@/*`
  - `@/auth/*`
  - `@/lib/*`
  - `@/hooks/*`
  - `@/components/*`
  - `@generated/prisma/*`
- Do not use deep relative imports such as `../../../..` when an alias is available.
- Prefer importing from feature-local modules when the dependency is feature-specific.
- Prefer importing from `index.ts` when a feature or shared module intentionally exposes a public surface.
- Keep imports grouped in a stable order:
  1. External packages
  2. Internal alias imports
  3. Type-only imports when separated for clarity
- Keep import order readable and consistent within each file.
- Remove unused imports.

GOOD

- `import { getCart } from '@/features/cart/queries/get-cart'`
- `import { Button } from '@/components/ui/button'`
- `import type { Locale } from '@/i18n/routing'`

BAD

- `import '../../../../features/cart/queries/get-cart'`
- `import '../../../../../shared/components/ui/button'`
- Mixed external and internal imports with no clear grouping

# Naming Convention

Use naming patterns already established in the repository.

## Files and Folders

- Use kebab-case for files and folders.
- Feature folders use short domain names such as `auth`, `cart`, `order`, `product`.
- Avoid creating parallel folder structures when an existing folder type already exists.

## Components

- Use PascalCase for React component names.
- Component filenames remain kebab-case, for example `login-form.tsx` and `auth-page-shell.tsx`.
- Shared layout/header component files follow the existing local naming where already present, such as `Header.tsx`, `Logo.tsx`, and `UserMenu.tsx`. Do not rename existing files only for style normalization.

## Hooks

- Hook names must start with `use`.
- Hook filenames use kebab-case and typically mirror the hook name, such as `use-auth-form-submit.ts`.

## Server Actions

- Name actions with an imperative verb plus `Action` suffix.
- Use filenames such as `sign-in.ts`, `sign-up.ts`, `add-to-cart.ts`, `create-order.ts`.
- Exported action names should match the domain intent, for example `signInAction`, `addToCartAction`, `createOrderAction`.

## Schemas

- Schema files use the `.schema.ts` suffix where the repository already does so, such as `login.schema.ts` and `register.schema.ts`.
- Schema constants use `camelCase` with `Schema` suffix, such as `loginSchema`.

## Types

- Use PascalCase for exported type names.
- Keep state and payload type names descriptive, such as `AuthActionState`, `CartWithItems`, `OrderListItem`.

## Enums

- Use PascalCase for enum type names.
- Use uppercase members when the enum comes from Prisma schema conventions, such as `OrderStatus.PENDING`.

## Constants

- Use UPPER_SNAKE_CASE for constant maps that behave like enums, such as `AUTH_ERROR_CODES`.
- Use descriptive constant names for route maps and static configuration, such as `AUTH_ROUTES`.

GOOD

- `create-order.ts`
- `createOrderAction`
- `registerSchema`
- `AUTH_ERROR_CODES`
- `useAuthFormSubmit`

BAD

- `order.ts`
- `handle()`
- `schema.ts`
- `constants.ts` for one unrelated constant
- `authformsubmit.ts`

# Feature Module Rules

Feature modules should stay self-contained and predictable.

A feature may contain these folders when needed:

- `components`
- `actions`
- `queries`
- `schemas`
- `services`
- `hooks`
- `types`
- `utils`
- `constants`
- `server`
- `client`
- `index.ts`

Rules:

- Create only the folders that the feature actually needs.
- Keep feature-specific code inside the owning feature.
- Use `components/` for feature UI.
- Use `actions/` for Server Actions.
- Use `queries/` for reusable server-side reads.
- Use `schemas/` for Zod schemas and input definitions.
- Use `services/` when a feature needs a reusable integration or orchestration layer, as seen in auth.
- Use `hooks/` for reusable client-side interaction logic.
- Use `types/` for exported feature types and action state types.
- Use `utils/` for local helpers that do not deserve promotion to shared modules.
- Use `server/` for server-only feature helpers such as auth session and guards.
- Use `client/` for client-only integrations when a feature needs them.
- Add `index.ts` only when the feature exposes a useful public surface.
- Do not create empty structure for future possibilities.
- Do not move logic to `src/shared` unless reuse across features is real and current.

GOOD

- `src/features/auth/actions/sign-in.ts`
- `src/features/auth/server/session.ts`
- `src/features/cart/queries/get-cart.ts`
- `src/features/order/index.ts`

BAD

- Shared helper created for one feature only
- Query logic duplicated in route pages
- Empty `services/` or `hooks/` folder with no real use

# When to create

Create folders only when the feature needs them.

## `components/`

Create when the feature owns UI that is not reusable enough for `src/shared`.

Do not create when the UI is a shared primitive or global layout concern.

## `actions/`

Create when the feature has server-side mutations.

Do not create when the feature is read-only.

## `queries/`

Create when the feature has reusable server reads.

Do not create when the data access is truly local and one-off.

## `schemas/`

Create when the feature validates input with Zod.

Do not create when the feature has no structured input boundary yet.

## `services/`

Create when the feature wraps an external system or needs reusable orchestration.

Do not create for a thin wrapper around a single local Prisma call.

## `hooks/`

Create when the feature has reusable client interaction logic.

Do not create for single-use state that belongs inside one component.

## `types/`

Create when multiple files in the feature share exported types.

Do not create when a local type is only used in one file.

## `utils/`

Create when the feature has local helper logic with repeated or clear supporting use.

Do not create for one-line helpers that add indirection without value.

## `constants/`

Create when the feature has stable grouped constants such as error codes or route maps.

Do not create when a constant is local to one file.

## `server/`

Create when the feature has server-only helpers such as auth guards, session access, or integrations.

Do not create when the file is not server-only in responsibility.

## `client/`

Create when the feature has client-only integration helpers, such as auth client wrappers.

Do not create for generic client state that belongs inside a component or hook.

## `index.ts`

Create when the feature exposes a stable public surface used by other modules.

Do not create only for formality if nothing useful is exported.

# Feature Template

This is a reference template, not a requirement that every feature must contain every folder.

Example shape:

- `auth/`
- `auth/components/`
- `auth/actions/`
- `auth/queries/`
- `auth/schemas/`
- `auth/services/`
- `auth/types/`
- `auth/hooks/`
- `auth/utils/`
- `auth/index.ts`

Use only the parts the feature actually needs.

# Server Component Rules

Server Components are the default.

Use a Server Component when:

- The file is a route `page.tsx` or layout.
- The component loads data from queries.
- The component reads translations via `getTranslations`.
- The component enforces auth or guest access.
- The component orchestrates page composition and passes props to interactive children.

Do not use a Server Component when the component requires:

- React client hooks such as `useState`, `useActionState`, or `useForm`
- Browser APIs
- Direct event handlers for client interaction
- Theme or provider behavior that requires a client boundary

Rules:

- Keep Server Components focused on orchestration, data loading, and composition.
- Prefer loading translations at the server boundary for pages.
- Prefer parallel async work with `Promise.all` where it improves clarity and fits the route.
- Do not move interactive state into Server Components.

GOOD

- `page.tsx` calls `getTranslations()` and `getCart()`
- Server page calls `requireAuth(locale)`
- Server page passes props into `CheckoutForm`

BAD

- `page.tsx` marked with `'use client'` only to submit a form
- Browser event handling inside a route page
- Prisma read moved into a Client Component

# Client Component Rules

Client Components are used only where interaction requires them.

Use a Client Component when:

- The component uses state or event handlers.
- The component uses `useActionState`.
- The component uses React Hook Form.
- The component needs browser-only behavior.
- The component is a provider boundary such as theme or tooltip providers.

Do not use a Client Component when:

- The component only renders server-provided data.
- The component only exists to fetch data that can be loaded on the server.
- The same behavior can be implemented as a small interactive child under a Server Component.

Rules:

- Add `'use client'` only when required.
- Keep Client Components as leaf-level as possible.
- Do not turn shared layout or route shells into Client Components without a clear need.
- Keep client-side logic focused on interaction, not authority.

GOOD

- `login-form.tsx`
- `checkout-form.tsx`
- `product-variant-selector.tsx`
- `providers.tsx`

BAD

- Client wrapper around a static page with no interaction
- Client component used only to run a server read
- Client auth check replacing `requireAuth()`

# Server Action Rules

Server Actions are the standard mutation boundary.

Rules:

- Every Server Action file must begin with `'use server'`.
- Use imperative action names with `Action` suffix.
- Give exported actions explicit return types.
- Prefer small, typed action state objects with `ok` and narrow error/status codes.
- Validate incoming `FormData` or input at the action boundary before business logic proceeds.
- Use Zod for structured validation where a schema exists.
- Return typed expected errors instead of throwing generic strings to the UI.
- Use redirects for successful navigation changes where the current flow already does so.
- Revalidate affected paths after successful mutations when the UI depends on server-rendered data.
- Keep sensitive logic in the action, not in the client component.

Naming and structure:

- File name: domain verb in kebab-case, such as `create-order.ts`
- Export name: `createOrderAction`
- Return type: explicit typed state, such as `Promise<CreateOrderState>`

Error handling:

- Map expected failures to stable codes.
- Catch unexpected failures and collapse them to a safe fallback code such as `unknown`.
- Do not leak internal error details to the client.

Revalidation:

- Use `revalidatePath` when the mutation changes server-rendered data already displayed elsewhere.
- Keep the revalidation target narrow when possible.
- Follow the existing repository pattern when a broader layout refresh is already in use.

GOOD

- `actions/sign-in.ts`
- `export async function signInAction()`
- `safeParse(...)` before mutation
- return `{ ok: false, code: 'invalidInput' }`

BAD

- `login.ts`
- `async function handleLogin()`
- direct mutation before validation
- throw raw internal error text to UI

# Query Rules

`queries/` is the standard place for reusable feature reads.

Use `queries/` when:

- A server-side read is reused or likely to be reused by route pages or feature components.
- The read needs feature-level ownership.
- The query represents a named data retrieval operation such as `getCart`, `getOrders`, or `getProductBySlug`.

Direct query access is acceptable when:

- The read is highly local and not reusable.
- The code remains inside the feature boundary or a clear server-only helper.

Do not:

- Scatter the same Prisma read logic across multiple pages.
- Put reusable feature reads in `src/app`.
- Query the database from client code.

Rules:

- Export query functions with clear verb-based names such as `getCart` and `getOrders`.
- Keep query return types inferable from Prisma when practical.
- Export derived types from query results when other files need them.
- Keep auth-aware reads inside server-side query functions when appropriate.

GOOD

- `queries/get-cart.ts`
- `queries/get-orders.ts`
- `export type CartWithItems = ...`

BAD

- Copying the same `prisma.cart.findFirst(...)` into multiple pages
- Querying in `src/app` when the read belongs to a feature
- Querying Prisma in a Client Component

# Service Rules

Services are not mandatory for every feature.

Use a `services/` layer when:

- The feature integrates with an external system or framework API.
- The feature needs reusable orchestration logic that should not live directly in the action.
- The feature benefits from centralizing translation of external errors into repository-specific codes.

The auth feature is the current model:

- `authService` wraps Better Auth API calls.
- Actions validate input and delegate auth operations to the service.
- Error mapping is kept reusable and separate.

Do not create a service when:

- The logic is a simple one-off mutation that is already clear inside an action.
- The service would only forward one Prisma call without adding useful structure.

GOOD

- `auth.service.ts` wrapping Better Auth API calls
- service + error mapping reused by multiple auth actions

BAD

- `cart.service.ts` that only forwards one Prisma upsert with no added value
- service layer created only because other repositories use one

# Prisma Rules

Prisma is the primary data access layer.

Rules:

- Use Prisma instead of raw SQL when Prisma can express the operation.
- Prefer feature-owned query and action files for Prisma usage.
- Use `select` when only a small subset of fields is needed.
- Use `include` when related records are truly required by the caller.
- Be intentional with nested `include` chains.
- Add ordering explicitly where UI depends on deterministic output.
- Use transactions for multi-step writes that must stay atomic.
- Keep stock updates, order creation, and cart cleanup in the same transaction when they are part of one business write.
- Prefer database-backed pagination patterns when list size can grow, even though the current repository does not yet show a dedicated shared pagination abstraction.
- Reuse the shared Prisma client from `@/lib/prisma`.
- Do not instantiate Prisma clients inside feature files.

GOOD

- `select: { id: true }`
- `include: { items: { orderBy: { createdAt: 'asc' } } }`
- `prisma.$transaction(async (tx) => { ... })`
- `import { prisma } from '@/lib/prisma'`

BAD

- fetching full related graphs without need
- missing ordering when UI depends on order
- creating `new PrismaClient()` in a feature file
- raw SQL when Prisma already supports the query

# Validation Rules

Zod is the repository validation standard.

Rules:

- Put feature-specific schemas in the feature’s `schemas/` folder.
- Use schema names with `Schema` suffix.
- Export inferred input types from schemas using `z.infer`.
- Validate at server-action boundaries.
- Keep validation messages and error codes aligned to the feature’s error model.
- Map external library errors into repository-specific codes when needed.
- Avoid duplicating validation logic across components and actions.

Error mapping:

- Prefer stable, typed error codes over raw error messages.
- Use feature utilities such as `map-auth-error.ts` when external systems return inconsistent errors.
- Keep field-level and form-level errors distinct when the UI needs both.

GOOD

- `schemas/login.schema.ts`
- `registerSchema.safeParse(...)`
- `map-auth-error.ts`

BAD

- inline validation duplicated in multiple actions
- raw provider error passed directly to the UI
- schema placed in `src/shared` for one feature only

# Form Rules

The repository currently uses two form patterns.

## React Hook Form Pattern

Use React Hook Form when:

- The form is highly interactive.
- Field-level validation and client-side UX are important.
- The feature already uses RHF, as in auth.

Rules:

- Use `useForm` in Client Components.
- Use `zodResolver` when a Zod schema exists.
- Keep field errors mapped to stable typed error codes where the feature already follows that pattern.

## useActionState Pattern

Use `useActionState` when:

- The form is primarily a server-action submission flow.
- The interaction is mutation-oriented and does not need RHF-level client form control.
- The current pattern matches checkout and add-to-cart behavior.

Rules:

- Bind the server action in the Client Component.
- Use a typed state object with narrow codes.
- Render server-returned codes through localized UI labels.

Do not introduce a third form pattern without a clear repository need.

GOOD

- RHF + `zodResolver(loginSchema)` for auth
- `useActionState(createOrderAction.bind(null, locale), ...)`
- localized error label mapping in form UI

BAD

- RHF added to a simple server-action form with no benefit
- untyped action state object
- hardcoded form error text in component

# Authentication Rules

Better Auth is the authentication standard.

Rules:

- Keep authentication and session decisions on the server by default.
- Use feature server helpers such as `getSession`, `getCurrentUser`, `requireAuth`, and `requireGuest`.
- Do not fetch session in the client when server composition is sufficient.
- Use the auth service for Better Auth mutations where the current feature already does so.
- Keep auth route handling inside the dedicated Better Auth route handler.
- Treat OAuth triggers as client-side entry points into an auth system that remains server-backed.
- Do not move authorization decisions into UI-only logic.

GOOD

- `await requireAuth(locale)`
- `const session = await getSession()`
- `authService.signIn(parsed.data)`

BAD

- checking access only in client UI
- direct session authority inside a client component when server guard is sufficient
- bypassing Better Auth with a custom auth flow

# Internationalization Rules

`next-intl` is the localization standard.

Rules:

- Do not hardcode user-facing text in UI components when translations are expected.
- In Server Components, use `getTranslations`.
- In Client Components, use `useTranslations` and `useLocale` when needed.
- Keep localized routes aligned with `src/i18n/routing.ts`.
- Use navigation utilities from `src/i18n/navigation` for locale-aware routing and redirect behavior.
- Keep message keys stable and organized by namespace.
- When adding new keys, keep `messages/en` and `messages/vi` aligned.

GOOD

- `getTranslations({ locale, namespace: 'Order.checkout' })`
- `useTranslations('Auth')`
- `redirect({ locale, href: AUTH_ROUTES.signIn })`

BAD

- hardcoded button text in UI
- `next/navigation` redirect used for locale-aware feature flow when `@/i18n/navigation` should be used
- adding message key to one locale only

# UI Rules

Shared UI primitives are the default UI foundation.

Rules:

- Reuse components from `src/shared/components/ui` before creating new primitives.
- Keep shared layout components in `src/shared/components/layout`.
- Use the existing shadcn-oriented primitive stack and helper conventions already present in the repository.
- Keep UI components accessible:
  - use labels
  - use `aria-invalid` when relevant
  - preserve keyboard interaction
  - preserve focus behavior
- Keep layouts responsive.
- Keep theme-aware UI compatible with `next-themes`.
- Reuse shared icon components or Hugeicons rather than mixing icon systems.
- Keep presentation utilities such as `cn` in the shared layer.

GOOD

- `import { Button } from '@/components/ui/button'`
- `className={cn(...)}'
- `aria-invalid={!!errors.email}`

BAD

- custom primitive created before checking `src/shared/components/ui`
- inaccessible form field with no label
- mixed className concatenation when `cn()` is already available

# State Management Rules

The repository prefers server-owned state.

Rules:

- Prefer server-rendered data over client-wide state.
- Use local component state for local interaction only.
- Use `useActionState` for mutation feedback where that pattern already exists.
- Use feature hooks for reusable client interaction logic.
- Do not add a global state library unless a repository need is demonstrated and approved.
- Prefer revalidation and server refresh over client cache complexity when the current flow already supports it.

GOOD

- server page loads data via `getCart()`
- local `useState` for password visibility or selected variant
- mutation feedback handled through `useActionState`

BAD

- global store added for server-owned data
- auth state duplicated in custom client store
- client cache layer added without repository need

# Error Handling Rules

Error handling must distinguish expected and unexpected failures.

Expected error rules:

- Represent expected failures with typed codes or typed state.
- Keep error surfaces stable for UI mapping.
- Return safe, localized UI-facing errors.

Unexpected error rules:

- Catch unexpected failures at the appropriate boundary.
- Do not leak internal exception details to the client.
- Collapse unexpected errors to a safe fallback code when the UI only needs a generic failure state.

Typed error rules:

- Prefer narrow unions such as `'invalidInput' | 'unknown'`.
- Keep field-level and form-level error types separate when the feature requires both.
- Use utilities to translate third-party errors into repository-level error codes.

GOOD

- `code?: 'invalidInput' | 'emptyCart' | 'outOfStock' | 'unauthorized' | 'unknown'`
- `AUTH_ERROR_CODES.invalidCredentials`
- `translateErrors(codes, t)`

BAD

- `return { error: 'Something went wrong in prisma transaction step 3' }`
- raw exception string shown to user
- inconsistent error shapes across actions in one feature

# Performance Rules

Performance rules should reflect the current server-first model.

Rules:

- Prefer SSR and Server Components for data-backed routes.
- Keep client bundles small by limiting `'use client'`.
- Do not move server work to the client without a clear need.
- Avoid over-fetching in Prisma queries.
- Use explicit ordering and limited nested data where possible.
- Use lazy loading only when it improves actual user experience and fits the route.
- Revalidate only the paths affected by a mutation, using current repository patterns as the baseline.
- Keep provider boundaries minimal.

GOOD

- server data read in route page
- limited related data in Prisma query
- small client leaf components for interaction

BAD

- whole page converted to client for convenience
- wide `include` trees without UI need
- extra provider added for one local concern

# Security Rules

Security rules must follow the implemented server-first model.

Rules:

- Validate input at the server boundary.
- Keep authentication and authorization decisions on the server.
- Do not expose secrets, tokens, or sensitive headers.
- Do not hardcode provider credentials or database connection values.
- Use environment variables for secrets and connection strings.
- Do not move auth logic into the client.
- Keep cookie-based guest cart handling in server utilities.
- Do not bypass Better Auth or Prisma patterns already established in the repository.

GOOD

- `process.env.GOOGLE_CLIENT_ID`
- `getOrCreateGuestId()` in server utility
- `requireAuth(locale)` before protected flow

BAD

- provider secret in source code
- auth cookie or token exposed to UI
- custom client-side authorization replacing server guard

# Testing Rules

Current repository status:

- No automated test suite is present in `package.json`.
- There is no repository-wide working test convention to standardize yet.

Rules:

- Do not claim tests exist when they do not.
- When validation is possible, use the smallest available command or manual verification path relevant to the change.
- If future tests are added, this document should be updated to reflect actual repository patterns rather than generic testing advice.

# Refactoring Rules

Refactoring must remain local and evidence-based.

Allowed refactoring:

- Small supporting refactors required to complete the requested task safely.
- Local extraction when duplication already exists in the touched area.
- Type cleanup that improves correctness without changing behavior.
- Moving reusable logic into a feature-local helper or shared module when reuse is current and proven.

Not allowed:

- Cross-repository cleanup for style preference alone.
- Moving feature logic into `src/shared` without real cross-feature reuse.
- Rewriting route pages into a different architectural pattern.
- Introducing new abstraction layers only because they are common elsewhere.
- Renaming files, folders, or exports without clear task scope.

# Repository Patterns

The repository currently shows these concrete patterns:

- Authentication pattern: `signInAction` and `signUpAction` validate input, delegate to `authService`, map errors, then redirect.
- Auth guard pattern: protected and guest-only pages call `requireAuth(locale)` or `requireGuest(locale)` in the server page.
- Session pattern: `getSession()` is cached on the server and `getCurrentUser()` derives the user from it.
- Form pattern: auth uses React Hook Form with Zod; checkout and add-to-cart use `useActionState`.
- Server Action pattern: validate input, run service or Prisma logic, return typed state, revalidate or redirect.
- Query pattern: reusable reads live in `queries/` and export derived result types.
- Prisma pattern: feature queries and actions import `prisma` from `@/lib/prisma`.
- Locale pattern: server pages use `getTranslations`, client components use `useTranslations`, and routing uses `@/i18n/navigation`.
- Error mapping pattern: external auth errors are normalized by `map-auth-error.ts` and surfaced through stable codes.
- Barrel export pattern: features with cross-module use expose a stable surface through `index.ts`.

# Decision Trees

Need database read?
↓
Reusable?
↓
YES -> `queries/`
↓
NO -> local server helper inside the feature

Need mutation?
↓
Server Action
↓
Need structured input validation?
↓
YES -> Zod schema in `schemas/`
↓
Need external integration or reusable orchestration?
↓
YES -> `services/`
↓
Otherwise -> Prisma in the action

Need state?
↓
Server-owned data?
↓
YES -> Server Component + query
↓
NO -> Client Component local state or feature hook

Need auth check?
↓
Route/page boundary?
↓
YES -> `requireAuth()` or `requireGuest()`
↓
Need session data only?
↓
YES -> `getSession()` or `getCurrentUser()`

Need user-facing text?
↓
Server Component?
↓
YES -> `getTranslations()`
↓
NO -> `useTranslations()`

# Anti Patterns

- Never query Prisma from Client Components.
- Never hardcode user-facing UI text when localization is expected.
- Never use `any`.
- Never bypass Better Auth for implemented auth flows.
- Never duplicate existing query logic across pages.
- Never create a shared abstraction for one-time usage.
- Never move feature code into `src/shared` without proven reuse.
- Never create route handlers when Server Actions are sufficient for in-app mutations.
- Never expose secrets, tokens, headers, or auth internals.
- Never instantiate a new Prisma client inside a feature file.
- Never replace server auth guards with client-only checks.
- Never create a service layer only to wrap one local call without added value.

# Repository Conventions

Current repository conventions to reuse:

- `getCurrentUser()` -> derive current user from server session.
- `getSession()` -> cached server session lookup.
- `requireAuth()` -> protect authenticated routes.
- `requireGuest()` -> protect guest-only routes.
- `map-auth-error()` -> normalize Better Auth errors to repository codes.
- `translateErrors()` -> map error codes to localized UI messages.
- `useActionState()` -> server-action form state for checkout and cart-related mutations.
- `getTranslations()` -> server-side translations.
- `useTranslations()` -> client-side translations.
- `useLocale()` -> client locale access.
- `cn()` -> merge class names consistently.
- `revalidatePath()` -> refresh affected server-rendered views after mutation.
- `redirect()` from `@/i18n/navigation` -> locale-aware redirects.
- `index.ts` -> feature barrel exports when a feature exposes a public surface.

# Documentation References

Documentation ownership and the canonical update policy are defined in `.ai/document-map.md`. Update this document only when coding conventions or implementation patterns change.

# AI Code Generation Checklist

Before AI-generated code is considered complete, verify:

- The file belongs in the correct layer: `src/app`, `src/features`, `src/shared`, `src/i18n`, or `prisma`.
- The implementation follows an existing repository pattern.
- Types are explicit enough for strict TypeScript.
- No `any` was introduced.
- Imports use aliases instead of deep relative paths.
- User-facing text is localized.
- Server/client boundaries are correct.
- Validation exists at mutation boundaries.
- Auth and authorization remain server-first.
- Prisma usage reuses `@/lib/prisma`.
- Query, action, service, schema, and component responsibilities are not mixed unnecessarily.
- Shared UI primitives were reused where applicable.
- Expected errors are typed and safe.
- Revalidation or redirect behavior is handled where needed.
- No unrelated code was changed.
- Repository pattern was reused instead of inventing a new one.
- Feature boundary was respected.
- The folder choice is correct.
- Existing abstraction was reused before creating a new one.
- No duplicate Prisma query logic was introduced.
- Localization is correct for the touched UI.
- The auth boundary is correct for protected or guest-only flows.
- Action state shape is correct and typed.
- Error codes are stable and consistent with the feature.

# AI Review Checklist

Use this checklist before considering generated code complete:

- Correct repository layer?
- Correct feature boundary?
- Correct folder?
- Existing repository pattern reused?
- Existing abstraction reused before creating a new one?
- No duplicate query logic?
- No duplicate Prisma mutation logic?
- Correct server/client boundary?
- Correct auth boundary?
- Correct localization?
- Correct action state shape?
- Correct error code shape?
- Correct use of shared UI primitives?
- Correct use of `@/i18n/navigation` for locale-aware redirects and links?
- Correct use of `@/lib/prisma`?
- No `any`?
- No hardcoded user-facing text?
- No unrelated refactor?

# Completion

The canonical definition of done is in `AGENTS.md`. Apply the coding and implementation checks in this document as part of that definition.