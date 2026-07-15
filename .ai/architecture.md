# Fashio — Architecture Document

**Status:** As-built documentation derived from repository source code.  
**Last verified against:** repository tree, `package.json`, `prisma/schema.prisma`, `src/**`.  
**Legend:** Implemented | Implemented with Known Limitations | In Progress | Planned | Not Implemented | Not Defined Yet | Unknown

**Documentation ownership:** This document is the as-built architecture reference. AI governance is owned by `AGENTS.md`, operating procedure by `.ai/ai-workflow.md`, and coding conventions by `.ai/coding-style.md`.

## Quick Navigation

- Overview, directory tree, dependency graph, and layers: Sections 1–4
- Feature, routing, rendering, auth, database, request, and data flows: Sections 5–11
- Feature dependencies, shared layer, i18n, error handling, validation, responsibilities, and imports: Sections 12–18
- Technical debt, risks, decisions, and recommended evolution: Sections 19–23
- Action, query, service, and stack inventories: Appendices A–D

---

## 1. Architecture Overview

Fashio is a **Next.js 16 App Router** fashion ecommerce storefront with **locale-first routing**, **server-first data access**, and **feature-based code organization**.

| Area                                | Status          |
| ----------------------------------- | --------------- |
| App Router + route groups           | Implemented     |
| Feature modules (`src/features`)    | Implemented     |
| Shared UI/layout/lib (`src/shared`) | Implemented     |
| Prisma 7 + PostgreSQL               | Implemented     |
| Better Auth                         | Implemented     |
| next-intl (vi, en)                  | Implemented     |
| Repository pattern                  | Not Implemented |
| Dedicated domain layer              | Not Implemented |
| Global client state store           | Not Implemented |
| Automated tests                     | Not Implemented |

**High-level shape:**

- `src/app` owns routing, layouts, and page orchestration only.
- `src/features` owns business capabilities grouped by domain (auth, cart, order, product, …).
- `src/shared` owns cross-feature UI primitives, layout shell, hooks, and infrastructure helpers.
- Data access is performed through **Prisma** via `src/shared/lib/prisma.ts`, primarily from **`queries/`** and **`actions/`** modules inside features — not through a repository abstraction.

---

## 2. Directory Tree Summary

```
fashio/
├── messages/en|vi/          # JSON translation files (source strings)
├── prisma/
│   ├── schema.prisma        # Data model
│   ├── migrations/          # SQL migrations
│   ├── generated/           # Prisma Client output
│   └── seed.ts
├── public/                  # Static assets (product images, brand logos)
└── src/
    ├── app/
    │   ├── layout.tsx       # Root html/body
    │   ├── globals.css
    │   ├── api/auth/[[...all]]/route.ts
    │   └── [locale]/
    │       ├── layout.tsx   # Locale + i18n provider
    │       ├── (auth)/      # sign-in, sign-up (no global header)
    │       └── (main)/      # storefront pages (AppShell + Header)
    ├── features/
    │   ├── auth/            # Full implementation
    │   ├── cart/            # Full implementation
    │   ├── order/           # Implemented with Known Limitations (checkout/orders; no payment)
    │   ├── product/         # Full catalog implementation
    │   ├── agent/           # Stub only
    │   └── user/            # Stub only
    ├── i18n/                # Routing, navigation, message aggregation
    ├── proxy.ts             # next-intl middleware (locale routing)
    └── shared/
        ├── components/      # layout, ui (shadcn), providers
        ├── hooks/
        └── lib/             # prisma, utils, ai (placeholder)
```

**Note:** `docs/` is a repository documentation area. Its topic-specific content is outside this architecture reference.

---

## 3. Dependency Graph

```
Browser
  ↓
src/proxy.ts (next-intl locale routing)
  ↓
src/app/[locale]/(main|auth)/page.tsx          [Presentation — Server Components]
  ↓
src/features/<feature>/components              [Presentation — Server or Client Components]
  ↓
src/features/<feature>/actions                 [Application — Server Actions]
  ↓
src/features/<feature>/queries                 [Data access — async functions]
  ↓
src/features/auth/services/auth.service.ts     [Application — auth only]
  ↓
src/shared/lib/prisma.ts                       [Infrastructure — Prisma singleton]
  ↓
PostgreSQL

Parallel paths:
  src/app/api/auth/[[...all]]/route.ts → Better Auth → Prisma → PostgreSQL
  src/features/auth/server/session.ts    → Better Auth API → session
```

**Cross-cutting reads:** `getCurrentUser()` / `getSession()` from `@/auth/server/session` are used by Header, cart, order queries/actions.

**Observed feature-to-feature dependencies:** see Section 12.

---

## 4. Layer Architecture

Layers below reflect **what exists in source**, not aspirational DDD.

### Presentation — Implemented

- **App pages/layouts:** `src/app/**`
- **Feature components:** `src/features/**/components/**`
- **Shared layout/UI:** `src/shared/components/**`
- Default rendering unit is **React Server Component**. Client Components exist only where `'use client'` is present.

### Application — Implemented with Known Limitations

- **Server Actions:** `src/features/*/actions/*.ts` (`'use server'`)
- **Route guards:** `requireAuth`, `requireGuest` in `src/features/auth/server/`
- **Auth orchestration:** `authService` in `src/features/auth/services/auth.service.ts`
- No generic application service layer outside auth.

### Domain — Not Implemented

- No `domain/` folder or isolated domain entities/value objects.
- Business rules live inline in **actions** (mutations) and **queries** (reads).

### Infrastructure — Implemented

- **Database client:** `src/shared/lib/prisma.ts` (Prisma 7 + `@prisma/adapter-pg`)
- **Auth engine:** `src/features/auth/server/auth.ts` (Better Auth + Prisma adapter)
- **Auth HTTP handler:** `src/app/api/auth/[[...all]]/route.ts`
- **Locale proxy:** `src/proxy.ts`
- **Guest cart cookie:** `src/features/cart/utils/cart-cookie.ts`

### Data Access Pattern — Implemented (as `queries/`, not Repository)

- Read functions: `src/features/*/queries/*.ts` call `prisma` directly.
- Write paths: `src/features/*/actions/*.ts` call `prisma` directly (often with `prisma.$transaction`).

---

## 5. Feature Map

### auth

| Field                      | Detail                                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Status**                 | Implemented                                                                                                                                    |
| **Responsibilities**       | Email/password sign-in & sign-up, OAuth (Google, GitHub), sign-out, session lookup, route guards, auth error mapping, auth UI forms            |
| **Public API**             | **Not Defined Yet** — no `index.ts`. Consumers import via `@/auth/*` path alias                                                                |
| **Key exports (de facto)** | `getCurrentUser`, `getSession`, `requireAuth`, `requireGuest`, `signInAction`, `signUpAction`, `signOutAction`, `authService`, auth components |
| **Dependencies**           | `@/lib/prisma`, Better Auth, next-intl, Zod schemas                                                                                            |

### cart

| Field                | Detail                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------ |
| **Status**           | Implemented with Known Limitations                                                              |
| **Responsibilities** | Guest cart (cookie `fashio_guest_id`) and authenticated user cart, add/update/remove/clear items |
| **Public API**       | `src/features/cart/index.ts` exports actions, `getCart`, types                                   |
| **Dependencies**     | `@/auth/server/session`, `@/lib/prisma`, `cart-cookie` utils                                     |

### order

| Field                | Detail                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| **Status**           | Implemented with Known Limitations                                                               |
| **Responsibilities** | Checkout form, order creation (Prisma transaction), order list/detail pages, order status display |
| **Public API**       | `src/features/order/index.ts` exports `createOrderAction`, queries, `OrderStatusBadge`, types     |
| **Dependencies**     | `@/auth/server/session`, `@/lib/prisma`, cart data (types/query results), Zod `checkout.schema`   |
| **Not Implemented**  | Payment processing, order status workflow beyond creation                                         |

### product

| Field                | Detail                                                                                       |
| -------------------- | -------------------------------------------------------------------------------------------- |
| **Status**           | Implemented                                                                                  |
| **Responsibilities** | Product/category queries, catalog UI, product detail, variant selection, add-to-cart trigger |
| **Public API**       | `src/features/product/index.ts` exports components, queries, types                           |
| **Dependencies**     | `@/lib/prisma`; **cross-feature:** imports `addToCartAction` from cart                       |

### user

| Field                | Detail                                                            |
| -------------------- | ----------------------------------------------------------------- |
| **Status**           | Planned                                                           |
| **Responsibilities** | Unknown — only stub `src/features/user/index.ts` with comment     |
| **Public API**       | None                                                              |
| **Dependencies**     | None in code                                                      |
| **Schema**           | `UserPreference` model exists in Prisma — **no application code** |

### agent

| Field                   | Detail                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| **Status**              | Planned                                                          |
| **Responsibilities**    | Comment in stub: "AI shopping assistant"                         |
| **Public API**          | None                                                             |
| **Dependencies**        | None in code                                                     |
| **Schema**              | `Conversation`, `Message` models exist — **no application code** |
| **Infrastructure hint** | `src/shared/lib/ai.ts` is placeholder comment only               |

---

## 6. Routing Architecture

### App Router — Implemented

Root: `src/app/layout.tsx` → `src/app/[locale]/layout.tsx` → route group layout.

### Route Groups — Implemented

| Group    | Path prefix       | Layout behavior                                                        |
| -------- | ----------------- | ---------------------------------------------------------------------- |
| `(main)` | Storefront routes | Renders `AppShell` + `Header` via `src/app/[locale]/(main)/layout.tsx` |
| `(auth)` | Sign-in, sign-up  | Minimal passthrough layout; **no global Header**                       |

### Locale — Implemented

- Locales: `vi` (default), `en` — defined in `src/i18n/routing.ts`
- Localized pathnames configured for sign-in, sign-up, products, cart, checkout, orders, collections
- Locale segment: `src/app/[locale]/...`
- Proxy: `src/proxy.ts` (next-intl middleware); excludes `/api`, `/_next`, static files

### Main Routes — Implemented

| Logical path          | Page file                            |
| --------------------- | ------------------------------------ |
| `/`                   | `(main)/page.tsx`                    |
| `/products`           | `(main)/products/page.tsx`           |
| `/products/[slug]`    | `(main)/products/[slug]/page.tsx`    |
| `/collections/[slug]` | `(main)/collections/[slug]/page.tsx` |
| `/cart`               | `(main)/cart/page.tsx`               |
| `/checkout`           | `(main)/checkout/page.tsx`           |
| `/orders`             | `(main)/orders/page.tsx`             |
| `/orders/[id]`        | `(main)/orders/[id]/page.tsx`        |

### Auth Routes — Implemented

| Logical path | Page file                 | Guard          |
| ------------ | ------------------------- | -------------- |
| `/sign-in`   | `(auth)/sign-in/page.tsx` | `requireGuest` |
| `/sign-up`   | `(auth)/sign-up/page.tsx` | `requireGuest` |

### API Routes — Implemented

| Route                  | Handler                 | Purpose                                  |
| ---------------------- | ----------------------- | ---------------------------------------- |
| `/api/auth/[[...all]]` | `toNextJsHandler(auth)` | Better Auth HTTP API (required for auth) |

### Protected Routes — Implemented with Known Limitations

| Route                                   | Protection                         |
| --------------------------------------- | ---------------------------------- |
| `/checkout`                             | `requireAuth`                      |
| `/orders`, `/orders/[id]`               | `requireAuth`                      |
| `/cart`                                 | **None** — guest and authenticated |
| `/products`, `/`, `/collections/[slug]` | **None**                           |

Auth is **not** enforced in `src/proxy.ts` — only page-level guards.

---

## 7. Rendering Strategy

| Mechanism               | Status      | Usage in repo                                                                                                         |
| ----------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------- |
| **SSR / RSC (default)** | Implemented | All `page.tsx` and most layout/component files without `'use client'`                                                 |
| **Server Components**   | Implemented | Pages fetch data via `queries/*`, pass props to child components                                                      |
| **Client Components**   | Implemented | Auth forms, OAuth buttons, checkout form, product variant selector, theme/locale providers, interactive UI primitives |
| **Server Actions**      | Implemented | Auth mutations, cart mutations, order creation                                                                        |
| **Route Handlers**      | Implemented | Better Auth only (`/api/auth/*`)                                                                                      |
| **React Compiler**      | Implemented | `reactCompiler: true` in `next.config.ts`                                                                             |
| **Static generation**   | Implemented with Known Limitations | `generateStaticParams` for locales in `[locale]/layout.tsx`                                            |

### Form rendering patterns — Implemented (two coexisting patterns)

1. **Auth forms:** React Hook Form + Zod resolver + `useAuthFormSubmit` calling server actions directly (not `useActionState`).
2. **Cart/checkout mutation forms:** native `<form>` + `useActionState` bound to server actions (`addToCartAction`, `createOrderAction`).

### Client Components inventory (feature-level)

- `src/features/auth/components/*` — login, register, oauth, password UI (multiple files)
- `src/features/auth/hooks/*` — all client hooks
- `src/features/product/components/product-variant-selector.tsx`
- `src/features/order/components/checkout-form.tsx`

---

## 8. Authentication Architecture

### Better Auth — Implemented

| Component      | Location                                            |
| -------------- | --------------------------------------------------- |
| Server config  | `src/features/auth/server/auth.ts`                  |
| HTTP handler   | `src/app/api/auth/[[...all]]/route.ts`              |
| Prisma adapter | `prismaAdapter(prisma, { provider: 'postgresql' })` |
| Cookie plugin  | `nextCookies()`                                     |
| Providers      | Verified email/password, Google OAuth, GitHub OAuth |

**Documented environment variables:** `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_APP_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `AUTH_RATE_LIMIT_SECRET`.

### Session — Implemented (server-first)

| Function         | Location                              | Behavior                                                       |
| ---------------- | ------------------------------------- | -------------------------------------------------------------- |
| `getSession`     | `src/features/auth/server/session.ts` | `auth.api.getSession({ headers })`, wrapped in React `cache()` |
| `getCurrentUser` | same                                  | Returns `session?.user ?? null`                                |

### Client auth surface — Implemented (limited scope)

| Component        | Location                                      | Usage                                                |
| ---------------- | --------------------------------------------- | ---------------------------------------------------- |
| `authClient`     | `src/features/auth/client/auth-client.ts`     | OAuth sign-in (`loginWithGoogle`, `loginWithGithub`) |
| `useSession`     | `src/features/auth/hooks/use-session.ts`      | Wraps `authClient.useSession()`                      |
| `useCurrentUser` | `src/features/auth/hooks/use-current-user.ts` | **Defined but not imported anywhere else in repo**   |

### Middleware / Proxy — Implemented with Known Limitations

- `src/proxy.ts`: **locale routing only** — no auth checks.
- Auth enforcement: **page-level** via `requireAuth` / `requireGuest`.

### Protected Routes — Implemented with Known Limitations

See Section 6 for protected-route coverage and page-level guards.

### Auth flow (email/password) — Implemented

```
LoginForm/RegisterForm (client)
  → useAuthFormSubmit / handleSubmit
  → signInAction / signUpAction (server action)
  → Zod validation
  → Upstash Redis rate limit
  → authService.signIn / signUp
  → auth.api.signInEmail / signUpEmail
  → Resend verification email after sign-up
  → redirect to verify-email or redirect on successful verified sign-in
  → mapAuthError on failure
```

### Auth flow (OAuth) — Implemented

```
LoginForm/RegisterForm (client)
  → loginWithGoogle / loginWithGithub
  → authClient.signIn.social
  → Better Auth /api/auth/*
```

### Prisma auth models — Implemented

`User`, `Session`, `Account`, `Verification` — schema comment: Better Auth field/table names must remain unchanged.

### Current State Summary

| Capability                        | Status                                     |
| --------------------------------- | ------------------------------------------ |
| Sign-in / sign-up (email)         | Implemented (email verification required) |
| Email verification (Resend)       | Implemented                                |
| OAuth (Google, GitHub)            | Implemented                                |
| Sign-out                          | Implemented                                |
| Server Action rate limiting        | Implemented (Upstash Redis)                |
| Server session lookup             | Implemented                                |
| Header user display               | Implemented (server `getCurrentUser`)      |
| Guest route redirect              | Implemented (`requireGuest` on auth pages) |
| Auth middleware                   | Not Implemented                            |
| Guest-to-user cart merge on login | Not Implemented (no merge logic found)     |
| Role-based authorization          | Not Implemented                            |

---

## 9. Database Architecture

### Prisma — Implemented

| Item             | Value                                               |
| ---------------- | --------------------------------------------------- |
| Version          | 7.x (`package.json`)                                |
| Schema           | `prisma/schema.prisma`                              |
| Client output    | `prisma/generated/`                                 |
| Import path      | `@generated/prisma/client`                          |
| Runtime client   | `src/shared/lib/prisma.ts`                          |
| Driver adapter   | `@prisma/adapter-pg` with `DATABASE_URL`            |
| Migration config | `prisma.config.ts` uses `DIRECT_URL` for datasource |
| Migrations       | `prisma/migrations/` (init migration present)       |
| Seed             | `prisma/seed.ts` via `pnpm db:seed`                 |

### Models — Implemented in schema

| Domain                   | Models                                          |
| ------------------------ | ----------------------------------------------- |
| Auth (Better Auth)       | User, Session, Account, Verification            |
| Product                  | Category, Product, ProductImage, ProductVariant |
| Cart                     | Cart, CartItem                                  |
| Order                    | Order, OrderItem, Address, OrderStatus (enum)   |
| Agent (schema only)      | Conversation, Message, MessageRole (enum)       |
| User prefs (schema only) | UserPreference                                  |

### Relationships (key)

- User 1—1 Cart (optional), 1—N Order, 1—N Address, 1—N Conversation, 1—1 UserPreference
- Cart supports **guestId** (cookie) OR **userId** (mutually exclusive lookup in code)
- Order requires User + Address; OrderItem snapshots variant price
- Product → Category, ProductVariant; CartItem → ProductVariant

### Migration Strategy — Implemented

- Dev: `pnpm db:migrate` (`prisma migrate dev`)
- Prod deploy: `pnpm db:deploy` (`prisma migrate deploy`)
- Alternative: `pnpm db:push` (documented in README, no migration file)

### Planned (schema comment only)

- Semantic search via `pgvector` embedding on Product — **Planned**, not in current schema fields

---

## 10. Request Flow

### Read path (typical storefront page)

```
Browser
  → src/proxy.ts (locale)
  → src/app/[locale]/(main)/<page>.tsx          [Server Component]
  → src/features/<feature>/queries/<fn>.ts
  → prisma.<model>.findMany|findFirst|...       [@/lib/prisma]
  → PostgreSQL
  → props → feature/shared components → HTML
```

### Mutation path (cart example)

```
Browser form POST
  → Server Action (e.g. addToCartAction)
  → getCurrentUser() + getOrCreateGuestId() (if guest)
  → prisma queries/writes
  → revalidatePath('/', 'layout')
  → typed *State return OR redirect
```

### Mutation path (checkout/order)

```
Browser
  → createOrderAction
  → getCurrentUser() — returns unauthorized if null
  → checkoutSchema (Zod)
  → prisma.$transaction (cart read, stock check, address create, order create, stock decrement, cart clear)
  → revalidatePath + redirect to /orders/[id]
```

### Auth path (email sign-in)

```
Browser
  → signInAction
  → loginSchema (Zod)
  → authService.signIn → auth.api.signInEmail
  → redirect OR AuthActionState error
```

**Note:** `authService` is used for auth mutations only. Cart/order mutations bypass a service layer and call Prisma in actions directly.

---

## 11. Data Flow

### Product catalog

```
searchParams (q, category) on products page
  → getProducts({ q, category })
  → Prisma Product findMany with filters
  → ProductGrid → ProductCard (server)
```

### Collections

```
/collections/[slug]
  → getCategories() + getProducts({ category: slug })
  → ProductGrid
```

### Cart (guest or authenticated)

```
getCart()
  → getCurrentUser() OR getGuestId() from cookie
  → prisma.cart.findFirst by userId or guestId
  → include items → variant → product → images
```

### Checkout

```
requireAuth → getCart() → CheckoutForm (client) + CheckoutCartSummary (server)
  → createOrderAction → transaction → redirect to order detail
```

### Header user state

```
Header (server)
  → getCurrentUser() + getTranslations
  → passes user prop to HeaderActions → UserMenu
```

### i18n data flow

```
proxy.ts sets locale
  → [locale]/layout.tsx setRequestLocale + getMessages()
  → NextIntlClientProvider
  → getTranslations (server) / useTranslations (client)
```

---

## 12. Feature Dependency Rules

**Status: Not Defined Yet** — no documented import matrix or lint enforcement in repository.

### Observed dependencies (from import analysis)

| From      | To                   | Evidence                                                    |
| --------- | -------------------- | ----------------------------------------------------------- |
| app pages | auth guards          | `requireAuth`, `requireGuest`                               |
| app pages | cart, order, product | direct `@/features/...` imports                             |
| cart      | auth                 | `getCurrentUser` in queries/actions                         |
| order     | auth                 | `getCurrentUser` in queries/actions                         |
| order     | cart                 | `CartWithItems` type from cart queries; checkout reads cart |
| product   | cart                 | `product-variant-selector` imports `addToCartAction`        |
| product   | product              | internal component/query imports                            |
| cart      | cart                 | internal action → query imports                             |
| auth      | shared, i18n, lib    | no imports from other features                              |

**Not observed:** cart → order, auth → cart/order/product, user → _, agent → _.

---

## 13. Shared Layer

**Location:** `src/shared/`

| Area          | Path                                                | Responsibility                             |
| ------------- | --------------------------------------------------- | ------------------------------------------ |
| Layout        | `components/layout/`                                | `AppShell`, `Header`, logo, nav, user menu |
| UI primitives | `components/ui/`                                    | shadcn/ui-based components (~50 files)     |
| Icons         | `components/icons/`                                 | Google, GitHub brand icons                 |
| Providers     | `components/providers.tsx`                          | Theme + tooltip wrappers (client)          |
| Theme         | `components/theme-provider.tsx`, `theme-toggle.tsx` | Dark mode (client)                         |
| Locale UI     | `components/locale-switcher.tsx`                    | Language switch (client)                   |
| Hooks         | `hooks/use-mobile.ts`                               | Responsive helper                          |
| Lib           | `lib/prisma.ts`                                     | Prisma singleton                           |
| Lib           | `lib/utils.ts`                                      | `cn()` and utilities                       |
| Lib           | `lib/ai.ts`                                         | Placeholder — **Planned**, not implemented |

**Header rules (from `AGENTS.md`, reflected in code):**

- `Header.tsx` is Server Component (no `'use client'`).
- Interactive controls (`LocaleSwitcher`, `ModeToggle`, dropdown) are client leaf components.

---

## 14. i18n Architecture

**Status:** Implemented

| Piece                     | Location                                                      |
| ------------------------- | ------------------------------------------------------------- |
| Locale config + pathnames | `src/i18n/routing.ts`                                         |
| Locale-aware navigation   | `src/i18n/navigation.ts` (`Link`, `redirect`, `useRouter`, …) |
| Request config plugin     | `src/i18n/request.ts`                                         |
| Message aggregation       | `src/i18n/messages/en.ts`, `vi.ts`, `index.ts`                |
| Source strings            | `messages/en/*.json`, `messages/vi/*.json`                    |
| Middleware                | `src/proxy.ts`                                                |

**Namespaces registered:** About, Auth, Cart, Collections, Footer, Hero, HeroCard, Metadata, Navigation, Order, Product, UI.

**Rules in practice:**

- Server: `getTranslations({ locale, namespace })`
- Client: `useTranslations('Namespace')`
- Routing: `@/i18n/navigation` helpers only (no hardcoded locale paths in components found)

---

## 15. Error Handling Strategy

**Status:** Implemented with Known Limitations — patterns vary by feature.

### Auth — Implemented

- Typed codes: `AUTH_ERROR_CODES` in `src/features/auth/constants/auth-error-codes.ts`
- Better Auth API errors mapped via `mapAuthError()` → typed codes
- UI: `AuthFieldError`, `AuthFormError` with `Auth.errors` translations
- Server action return type: `AuthActionState` with `fieldErrors` and `formError`

### Cart — Implemented

- Action return types: `AddToCartState` with `ok` + `code` union (`added`, `invalidVariant`, `outOfStock`, `unknown`)
- Errors caught in try/catch; no thrown errors to client

### Order — Implemented

- `CreateOrderState` with codes: `invalidInput`, `emptyCart`, `outOfStock`, `unauthorized`, `unknown`
- Transaction failures mapped from thrown `Error` messages (`EMPTY_CART`, `OUT_OF_STOCK`)

### Global error boundary / logging — Not Implemented

- No `error.tsx`, `global-error.tsx`, or structured server logging module found.

---

## 16. Validation Strategy

**Status:** Implemented

| Boundary          | Mechanism                                          | Location examples                                                   |
| ----------------- | -------------------------------------------------- | ------------------------------------------------------------------- |
| Auth forms        | Zod + RHF resolver (client) + Zod in server action | `login.schema.ts`, `register.schema.ts`, `sign-in.ts`, `sign-up.ts` |
| Checkout          | Zod in server action                               | `checkout.schema.ts`, `create-order.ts`                             |
| Cart actions      | Manual parsing / guards in action                  | `add-to-cart.ts` (variantId, quantity)                              |
| URL search params | Passed to query functions                          | `getProducts({ q, category })` — trimmed in query                   |

**Server validation is authoritative** for mutations. Client validation exists for auth forms only.

---

## 17. Folder Responsibilities

| Path                             | Responsibility                                                              |
| -------------------------------- | --------------------------------------------------------------------------- |
| `src/app`                        | Routes, layouts, metadata, page-level orchestration; minimal business logic |
| `src/app/api`                    | HTTP route handlers (Better Auth only)                                      |
| `src/features/<name>/actions`    | Server Actions — mutations, auth operations                                 |
| `src/features/<name>/queries`    | Async read functions — Prisma access                                        |
| `src/features/<name>/components` | Feature-specific UI                                                         |
| `src/features/<name>/schemas`    | Zod schemas                                                                 |
| `src/features/<name>/services`   | **auth only** — wraps Better Auth API                                       |
| `src/features/<name>/server`     | **auth only** — Better Auth config, session, guards                         |
| `src/features/<name>/client`     | **auth only** — Better Auth React client                                    |
| `src/features/<name>/hooks`      | Feature client hooks                                                        |
| `src/features/<name>/utils`      | Feature-local helpers                                                       |
| `src/features/<name>/constants`  | Feature constants                                                           |
| `src/features/<name>/types`      | Feature types                                                               |
| `src/features/<name>/index.ts`   | Barrel public API (**auth missing this file**)                              |
| `src/shared/components/ui`       | Reusable UI primitives (shadcn)                                             |
| `src/shared/components/layout`   | App shell, header                                                           |
| `src/shared/lib`                 | Cross-cutting infrastructure                                                |
| `src/i18n`                       | Localization config and message loading                                     |
| `messages/`                      | Translation JSON source files                                               |
| `prisma/`                        | Schema, migrations, generated client, seed                                  |
| `public/`                        | Static assets served as-is                                                  |

---

## 18. Import Strategy

### Path aliases — Implemented (`tsconfig.json`)

| Alias                 | Maps to                     |
| --------------------- | --------------------------- |
| `@/*`                 | `./src/*`                   |
| `@/auth/*`            | `./src/features/auth/*`     |
| `@/lib/*`             | `./src/shared/lib/*`        |
| `@/hooks/*`           | `./src/shared/hooks/*`      |
| `@/components/*`      | `./src/shared/components/*` |
| `@generated/prisma/*` | `./prisma/generated/*`      |

### Import patterns observed

| Pattern                    | Usage                                                     |
| -------------------------- | --------------------------------------------------------- |
| `@/auth/*`                 | Auth module imports (preferred for auth)                  |
| `@/features/<feature>/...` | **Dominant** in app pages and cross-feature imports       |
| `@/components/ui/*`        | Shared UI in feature components                           |
| `@/shared/components/ui/*` | Used in `UserMenu.tsx` (inconsistent with `@/components`) |
| `@/lib/prisma`             | All Prisma access                                         |
| `@/i18n/navigation`        | Locale-aware routing                                      |

### Barrel export — Implemented with Known Limitations

| Feature | `index.ts`  | Actually used by app pages          |
| ------- | ----------- | ----------------------------------- |
| cart    | Yes         | **No** — pages import deep paths    |
| product | Yes         | **No** — pages import deep paths    |
| order   | Yes         | **No** — pages import deep paths    |
| auth    | **Missing** | N/A — uses `@/auth/*` alias instead |

### Direct import — Implemented (de facto standard)

App routes consistently import from concrete file paths under `@/features/...` rather than feature barrels.

---

## 19. Current Technical Debt

Items verified in source — not aspirational.

1. **Feature barrel exports unused** — `index.ts` exists for cart/product/order but app pages import deep paths.
2. **auth feature has no `index.ts`** — unlike other features; relies on `@/auth/*` alias only.
3. **Inconsistent shared UI import paths** — `@/components/ui/*` vs `@/shared/components/ui/*`.
4. **`useCurrentUser` hook unused** — defined, zero consumers.
5. **`useSession` client hook exists** — only used by unused `useCurrentUser`; session display uses server `getCurrentUser` in Header.
6. **Guest cart merge on login** — Not Implemented; separate guest and user carts in schema/code.
7. **Order payment** — orders created with default `PENDING` status; no payment integration.
8. **Prisma models without features** — `Conversation`, `Message`, `UserPreference` have schema but no application code.
9. **`src/shared/lib/ai.ts`** — placeholder only.
10. **Agent and user features** — stub `index.ts` only.
11. **No automated tests** — no `*.test.ts` / `*.spec.ts` files.
12. **No global error handling UI** — no route-level `error.tsx`.
13. **Feature dependency rules** — Not Defined Yet; cross-feature imports exist without documentation.
14. **Protected route coverage incomplete** — cart and catalog unauthenticated; orders/checkout guarded individually only.
15. **Documentation synchronization** — repository paths and status labels require ongoing verification against source and the canonical documentation policy.

---

## 20. Architecture Risks

| Risk                                    | Basis                                                                                              |
| --------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Undocumented cross-feature coupling** | `product` → `cart` action import; `order` → `cart` types; no enforced boundaries                   |
| **Dual cart identity**                  | Guest cookie cart vs user cart without merge — data loss risk on login                             |
| **Business logic in actions**           | Order/checkout rules in `create-order.ts`; harder to reuse/test                                    |
| **No test coverage**                    | Zero test files — regressions undetected                                                           |
| **Auth client surface**                 | `useSession`/`authClient` exist alongside server-only policy in docs — ambiguous for future agents |
| **Better Auth schema coupling**         | Schema comment requires fixed field names — migrations risky                                       |
| **Prisma dual URL**                     | Runtime pooler vs direct migration URL — misconfiguration risk                                     |
| **Incomplete authorization model**      | Binary authenticated/guest only — no roles                                                         |
| **Placeholder domains in schema**       | Conversation/UserPreference tables without code — schema drift risk                                |

---

## 21. Architecture Decisions Already Implemented

Derived from source code and configuration only. See `.ai/decision-inventory.md` for evidence-backed D-IDs and `.ai/decisions.md` for accepted ADR rationale.

1. **Next.js App Router** with `[locale]` segment and route groups `(main)` / `(auth)`.
2. **Feature-first folder structure** under `src/features/`.
3. **Server Components as default**; client boundaries at leaf interactive components.
4. **Better Auth** with Prisma adapter, email/password + Google/GitHub OAuth, `nextCookies` plugin.
5. **Dedicated auth API route** at `/api/auth/[[...all]]` (required by Better Auth).
6. **Server-side session** via `getSession` / `getCurrentUser` with React `cache()`.
7. **Page-level auth guards** (`requireAuth`, `requireGuest`) — not middleware-based auth.
8. **Prisma 7** with custom generated output path and `@prisma/adapter-pg` driver adapter.
9. **Data access via `queries/` functions and `actions/`** — no repository layer.
10. **Guest cart** via httpOnly cookie `fashio_guest_id`.
11. **Order creation in Prisma transaction** with stock decrement and cart clear.
12. **next-intl** with localized pathnames and `src/proxy.ts` middleware.
13. **Translation JSON** in `messages/` aggregated through `src/i18n/messages/*.ts`.
14. **shadcn/ui** primitives in `src/shared/components/ui/`.
15. **React Compiler enabled** in `next.config.ts`.
16. **Two form mutation patterns** — RHF for auth, `useActionState` for cart/checkout.
17. **Typed error codes** for auth and mutation state objects for cart/order.
18. **`@/auth/*` path alias** for auth module encapsulation.

---

## 22. Architecture Decisions Missing

Documented gaps — no decision recorded in repo.

1. Feature cross-import policy and enforcement.
2. Barrel export vs deep import standard (aliases exist; usage inconsistent).
3. When to use `authService` vs direct Prisma in new features.
4. Guest-to-authenticated cart merge strategy.
5. Payment provider and order state machine.
6. Authorization model beyond authentication (roles, admin).
7. Agent/AI integration architecture (`ai.ts` placeholder).
8. User profile and preferences feature boundaries.
9. Caching/revalidation policy beyond ad hoc `revalidatePath('/', 'layout')`.
10. Testing strategy and CI quality gates.
11. Global error handling and observability.
12. Semantic search / pgvector adoption (schema comment only).
13. Precedence between `AGENTS.md` and `.ai/*.md` for AI agents.

---

## 23. Recommended Evolution

Architecture roadmap only — **no code changes implied**. Status tags reflect schema/comments/stubs, not `.ai/project.md` alone.

| Initiative                         | Status          | Rationale (from repo)                                                                  |
| ---------------------------------- | --------------- | -------------------------------------------------------------------------------------- |
| **Agent / AI shopping assistant**  | Planned         | `features/agent` stub; `Conversation`/`Message` models; `shared/lib/ai.ts` placeholder |
| **User preferences / profile**     | Planned         | `UserPreference` model; `features/user` stub                                           |
| **Semantic product search**        | Planned         | Comment in `prisma/schema.prisma` re pgvector embedding                                |
| **Payment integration**            | Not Implemented | Orders stop at `PENDING`; no payment models or routes                                  |
| **Wishlist**                       | Not Implemented | No schema, routes, or features                                                         |
| **Reviews**                        | Not Implemented | No schema, routes, or features                                                         |
| **Coupons**                        | Not Implemented | No schema, routes, or features                                                         |
| **Notifications**                  | Not Implemented | No schema, routes, or features                                                         |
| **Admin dashboard**                | Not Implemented | No admin routes or features                                                            |
| **Basic text search on products**  | Implemented     | `q` searchParam + `getProducts` filter — extend only if requirements grow              |
| **Auth hardening**                 | In Progress     | Core flows done; guest cart merge, middleware auth, roles — Not Implemented            |
| **Feature public API consistency** | In Progress     | Barrels partially exist; auth lacks `index.ts`; app uses deep imports                  |
| **Test infrastructure**            | Not Implemented | No tests present                                                                       |

---

## Appendix A — Server Actions Inventory

| Action                 | Feature | File                          |
| ---------------------- | ------- | ----------------------------- |
| `signInAction`         | auth    | `actions/sign-in.ts`          |
| `signUpAction`         | auth    | `actions/sign-up.ts`          |
| `signOutAction`        | auth    | `actions/sign-out.ts`         |
| `addToCartAction`      | cart    | `actions/add-to-cart.ts`      |
| `updateCartItemAction` | cart    | `actions/update-cart-item.ts` |
| `removeCartItemAction` | cart    | `actions/remove-cart-item.ts` |
| `clearCartAction`      | cart    | `actions/clear-cart.ts`       |
| `createOrderAction`    | order   | `actions/create-order.ts`     |

## Appendix B — Queries Inventory

| Query              | Feature | File                             |
| ------------------ | ------- | -------------------------------- |
| `getCart`          | cart    | `queries/get-cart.ts`            |
| `getOrders`        | order   | `queries/get-orders.ts`          |
| `getOrderById`     | order   | `queries/get-order-by-id.ts`     |
| `getProducts`      | product | `queries/get-products.ts`        |
| `getProductBySlug` | product | `queries/get-product-by-slug.ts` |
| `getCategories`    | product | `queries/get-categories.ts`      |

## Appendix C — Services Inventory

| Service       | Feature | File                       |
| ------------- | ------- | -------------------------- |
| `authService` | auth    | `services/auth.service.ts` |

**No other service modules exist in repository.**

## Appendix D — Tech Stack (from `package.json`)

| Technology      | Version         | Role           |
| --------------- | --------------- | -------------- |
| Next.js         | 16.2.9          | Framework      |
| React           | 19.2.4          | UI             |
| TypeScript      | ^5              | Language       |
| Tailwind CSS    | ^4              | Styling        |
| shadcn          | ^4.11.1         | UI tooling     |
| Better Auth     | ^1.6.22         | Authentication |
| Prisma          | ^7.8.0          | ORM            |
| next-intl       | ^4.13.0         | i18n           |
| Zod             | ^4.4.3          | Validation     |
| React Hook Form | ^7.80.0         | Auth forms     |
| Hugeicons       | ^4.2.2 / ^1.1.9 | Icons          |
