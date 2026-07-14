# Repository Glossary

## Purpose

This document defines repository terminology. Architecture, governance, and coding conventions remain owned by their respective documents.

# Business Terms

## Cart

- Term: Cart
- Meaning: The repository model and feature area that stores selected product variants before checkout.
- Where Used: `src/features/cart/**`, `prisma/schema.prisma`, `src/app/[locale]/(main)/cart/page.tsx`
- Related Terms: Guest Cart, Cart Item, Checkout
- Notes: Supports both guest and authenticated flows.

## Guest Cart

- Term: Guest Cart
- Meaning: A cart associated with the `fashio_guest_id` cookie instead of an authenticated user.
- Where Used: `src/features/cart/utils/cart-cookie.ts`, `src/features/cart/actions/add-to-cart.ts`, `prisma/schema.prisma`
- Related Terms: Cart, Guest ID, Cart Item
- Notes: Uses server-side cookie helpers.

## Checkout

- Term: Checkout
- Meaning: The implemented flow that collects address data and creates an order from the current cart.
- Where Used: `src/features/order/components/checkout-form.tsx`, `src/features/order/actions/create-order.ts`, `src/app/[locale]/(main)/checkout/page.tsx`
- Related Terms: Cart, Order, Create Order
- Notes: Payment is not implemented in this phase.

## Order
- Term: Order
- Meaning: The repository model and feature area for created purchases, including order list, detail, and status display.
- Where Used: `src/features/order/**`, `prisma/schema.prisma`, `src/app/[locale]/(main)/orders/**`
- Related Terms: Checkout, Order Status, Order Item
- Notes: Order creation is implemented; payment is not.

## Order Status

- Term: Order Status
- Meaning: The enum-backed state of an order in the Prisma schema.
- Where Used: `prisma/schema.prisma`, `src/features/order/components/order-status-badge.tsx`
- Related Terms: Order, Prisma Schema
- Notes: Status exists in persistence even though broader workflow is limited.

## Product

- Term: Product
- Meaning: The main catalog entity displayed in product lists, product detail pages, and collections.
- Where Used: `src/features/product/**`, `prisma/schema.prisma`, `src/app/[locale]/(main)/products/**`
- Related Terms: Category, Variant, Product Image
- Notes: Only active products are returned in implemented queries.

## Variant

- Term: Variant
- Meaning: A purchasable product variation identified by SKU and optional size and color.
- Where Used: `prisma/schema.prisma`, `src/features/product/components/product-variant-selector.tsx`, `src/features/cart/**`
- Related Terms: Product, Cart Item, Order Item
- Notes: Stock is tracked at the variant level.

## Category

- Term: Category
- Meaning: The classification used to group products and support collection-style browsing.
- Where Used: `prisma/schema.prisma`, `src/features/product/queries/get-products.ts`
- Related Terms: Product, Collection
- Notes: Implemented as a tree through parent and children relations.

## Collection

- Term: Collection
- Meaning: The localized storefront route pattern used to browse products by a category-like slug.
- Where Used: `src/app/[locale]/(main)/collections/[slug]/page.tsx`, `src/i18n/routing.ts`
- Related Terms: Category, Product, Locale Routing
- Notes: Exists at the route level rather than as a separate Prisma model.

# Repository Terms

## Feature First

- Term: Feature First
- Meaning: The repository organizes domain-specific code under `src/features` instead of splitting everything by technical layer.
- Where Used: `src/features`, `.ai/decision-inventory.md`, `.ai/coding-style.md`
- Related Terms: Shared Component, Query Layer, Server First
- Notes: This is a repository structure rule, not a separate framework feature.

## Server First

- Term: Server First
- Meaning: Data access, auth decisions, and most route orchestration are implemented on the server by default.
- Where Used: `src/app/**`, `src/features/auth/server/**`, `.ai/decisions.md`, `.ai/coding-style.md`
- Related Terms: Server Component, Server Action, Session
- Notes: Client Components are used only where interaction requires them.

## Shared Component

- Term: Shared Component
- Meaning: A reusable UI or layout component placed under `src/shared/components` for cross-feature use.
- Where Used: `src/shared/components/**`, `.ai/coding-style.md`
- Related Terms: Shared UI, Primitive, Layout Shell
- Notes: Feature-specific UI should stay out of shared unless reuse is current.

## Server Action

- Term: Server Action
- Meaning: A `'use server'` mutation entry point used by implemented auth, cart, and order flows.
- Where Used: `src/features/*/actions/*.ts`, `.ai/decision-inventory.md`, `.ai/coding-style.md`
- Related Terms: Action State, Query Layer, Revalidation
- Notes: This repository uses Server Actions instead of route handlers for in-app mutations.

## Query Layer

- Term: Query Layer
- Meaning: The feature-local `queries/` pattern used for reusable server-side reads.
- Where Used: `src/features/cart/queries`, `src/features/order/queries`, `src/features/product/queries`
- Related Terms: Server First, Prisma, Repository Pattern
- Notes: Reads are feature-owned and do not use a separate repository abstraction.

## Repository Pattern

- Term: Repository Pattern
- Meaning: A pattern explicitly noted as not implemented in this repository; features access Prisma through `queries/` and `actions/` directly.
- Where Used: `.ai/decision-inventory.md`, `.ai/architecture.md`, `src/features/**`, `src/shared/lib/prisma.ts`
- Related Terms: Query Layer, Prisma, Feature First
- Notes: The term is relevant here because its absence is an active repository decision.

## Action State

- Term: Action State
- Meaning: The typed state object returned by Server Actions and consumed by interactive forms.
- Where Used: `src/features/auth/types/auth-action-state.ts`, `src/features/order/actions/create-order.ts`, `src/features/cart/actions/add-to-cart.ts`
- Related Terms: Server Action, Expected Error, useActionState
- Notes: Usually includes `ok` plus narrow error or status codes.

# Authentication Terms

## Better Auth

- Term: Better Auth
- Meaning: The authentication system configured for email/password, OAuth, sessions, and route handling.
- Where Used: `src/features/auth/server/auth.ts`, `src/app/api/auth/[[...all]]/route.ts`, `package.json`
- Related Terms: Session, OAuth, requireAuth
- Notes: Auth persistence is backed by Prisma.

## Session

- Term: Session
- Meaning: The server-first authenticated session returned by Better Auth and accessed through cached helpers.
- Where Used: `src/features/auth/server/session.ts`, `src/features/auth/server/require-auth.ts`, `src/features/auth/server/require-guest.ts`
- Related Terms: Better Auth, getCurrentUser, getSession
- Notes: Session access is a server concern in this repository.

## OAuth

- Term: OAuth
- Meaning: Social sign-in flow implemented through Google and GitHub providers.
- Where Used: `src/features/auth/server/auth.ts`, `src/features/auth/client/auth-client.ts`, `src/features/auth/components/oauth-buttons.tsx`
- Related Terms: Better Auth, Session, Login Form
- Notes: Triggered from client UI but handled by the auth system.

## requireAuth

- Term: requireAuth
- Meaning: The server helper used to protect authenticated routes.
- Where Used: `src/features/auth/server/require-auth.ts`, `src/app/[locale]/(main)/checkout/page.tsx`, `src/app/[locale]/(main)/orders/**`
- Related Terms: requireGuest, getSession, Session
- Notes: Redirects through locale-aware navigation when no session exists.

## requireGuest

- Term: requireGuest
- Meaning: The server helper used to keep authenticated users out of guest-only routes such as sign-in and sign-up.
- Where Used: `src/features/auth/server/require-guest.ts`, `src/app/[locale]/(auth)/sign-in/page.tsx`, `src/app/[locale]/(auth)/sign-up/page.tsx`
- Related Terms: requireAuth, Session, redirect
- Notes: Used at the page boundary.

## getCurrentUser

- Term: getCurrentUser
- Meaning: The helper that derives the current user from the server session.
- Where Used: `src/features/auth/server/session.ts`, `src/features/cart/**`, `src/features/order/**`
- Related Terms: Session, getSession, requireAuth
- Notes: Returns `session?.user ?? null`.

## getSession

- Term: getSession
- Meaning: The cached server helper that retrieves the current Better Auth session.
- Where Used: `src/features/auth/server/session.ts`, `src/features/auth/server/require-auth.ts`, `src/features/auth/server/require-guest.ts`
- Related Terms: Session, getCurrentUser, Better Auth
- Notes: Wrapped with React `cache()`.

# Database Terms

## Prisma

- Term: Prisma
- Meaning: The repository’s primary data access layer used by feature queries and actions.
- Where Used: `src/shared/lib/prisma.ts`, `src/features/**/queries/*.ts`, `src/features/**/actions/*.ts`, `package.json`
- Related Terms: Schema, Migration, Transaction, Driver Adapter
- Notes: Access is shared through one Prisma client helper.

## Schema

- Term: Schema
- Meaning: The Prisma data model definition for auth, catalog, cart, order, agent, and user-related persistence.
- Where Used: `prisma/schema.prisma`
- Related Terms: Prisma, Migration, Transaction
- Notes: This is a protected file in repository governance.

## Migration

- Term: Migration
- Meaning: The Prisma database change workflow represented by the `prisma/migrations` directory and migration scripts.
- Where Used: `prisma/migrations`, `package.json`, `.ai/decision-inventory.md`
- Related Terms: Schema, Prisma, Seed
- Notes: Migration capability exists even though schema changes are protected.

## Transaction

- Term: Transaction
- Meaning: A grouped write flow executed through `prisma.$transaction` for atomic multi-step operations.
- Where Used: `src/features/order/actions/create-order.ts`, `.ai/coding-style.md`
- Related Terms: Prisma, Order, Stock Update
- Notes: Used during order creation to keep related writes together.

## Driver Adapter

- Term: Driver Adapter
- Meaning: The Prisma runtime database adapter configured through `@prisma/adapter-pg`.
- Where Used: `src/shared/lib/prisma.ts`, `package.json`
- Related Terms: Prisma, PostgreSQL
- Notes: This repository does not use the default runtime client configuration.

# Localization Terms

## Locale

- Term: Locale
- Meaning: The route-level language context used throughout the application, currently `vi` and `en`.
- Where Used: `src/i18n/routing.ts`, `src/app/[locale]/**`, `src/i18n/request.ts`
- Related Terms: Routing, Navigation, Message Namespace
- Notes: `vi` is the default locale.

## Message Namespace

- Term: Message Namespace
- Meaning: The logical grouping used when loading and accessing localized strings.
- Where Used: `messages/en/*.json`, `messages/vi/*.json`, `getTranslations({ namespace: ... })`, `useTranslations(...)`
- Related Terms: Locale, next-intl, Navigation
- Notes: Examples include `Auth`, `Order.checkout`, and `Auth.errors`.

## next-intl

- Term: next-intl
- Meaning: The localization library used for localized routing, request config, and translations.
- Where Used: `src/i18n/request.ts`, `src/i18n/routing.ts`, `src/i18n/navigation.ts`, `package.json`
- Related Terms: Locale, Routing, Navigation
- Notes: Used both at request level and component level.

## Routing

- Term: Routing
- Meaning: The localized path configuration and route structure centered on `src/app/[locale]`.
- Where Used: `src/i18n/routing.ts`, `src/app/[locale]/**`, `src/proxy.ts`
- Related Terms: Locale, Navigation, Route Group
- Notes: Includes localized pathnames for storefront and auth routes.

## Navigation

- Term: Navigation
- Meaning: The locale-aware navigation helpers created from the repository routing config.
- Where Used: `src/i18n/navigation.ts`, feature redirects and links, route guards
- Related Terms: Routing, Locale, redirect
- Notes: Provides `Link`, `redirect`, `usePathname`, `useRouter`, and `getPathname`.

# UI Terms

## shadcn/ui

- Term: shadcn/ui
- Meaning: The shared UI primitive approach reflected in the repository dependency set and `src/shared/components/ui`.
- Where Used: `src/shared/components/ui/**`, `package.json`, `.ai/decisions.md`
- Related Terms: Shared UI, Primitive, Theme Provider
- Notes: Used as a repository UI foundation, not as a separate feature module.

## Shared UI

- Term: Shared UI
- Meaning: The reusable UI layer under `src/shared/components/ui` and related shared component areas.
- Where Used: `src/shared/components/ui/**`, `src/shared/components/layout/**`, `src/shared/components/providers.tsx`
- Related Terms: Shared Component, Primitive, Layout Shell
- Notes: Intended for cross-feature reuse.

## Primitive

- Term: Primitive
- Meaning: A reusable low-level shared UI component used as a building block for higher-level feature UI.
- Where Used: `src/shared/components/ui/**`, `.ai/coding-style.md`
- Related Terms: Shared UI, shadcn/ui, Shared Component
- Notes: Examples include button, input, field, and dialog primitives.

## Layout Shell

- Term: Layout Shell
- Meaning: A reusable shared layout wrapper used to structure route-level UI.
- Where Used: `src/shared/components/layout/app-shell.tsx`, `src/app/[locale]/(main)/layout.tsx`
- Related Terms: Shared UI, Header, Route Group
- Notes: The main storefront layout composes around `AppShell`.

## Theme Provider

- Term: Theme Provider
- Meaning: The shared client provider wrapper around `next-themes` used by repository UI.
- Where Used: `src/shared/components/theme-provider.tsx`, `src/shared/components/providers.tsx`
- Related Terms: Shared UI, next-themes
- Notes: Theme support is part of the shared UI baseline.

# Development Terms

## Status Taxonomy

- Term: Status Taxonomy
- Meaning: The shared set of repository status labels: Implemented, Implemented with Known Limitations, In Progress, Planned, Not Implemented, Not Defined Yet, and Unknown.
- Where Used: `.ai/architecture.md`, `.ai/document-map.md`, `.ai/roadmap.md`
- Related Terms: Decision Inventory, Working Memory
- Notes: `architecture.md` defines the canonical status taxonomy.

## ADR

- Term: ADR
- Meaning: The accepted architecture decision record format used in `.ai/decisions.md`.
- Where Used: `.ai/decisions.md`, `.ai/decision-inventory.md`
- Related Terms: Decision Inventory, Repository Freeze
- Notes: Only accepted, evidenced decisions are promoted to ADRs.

## Decision Inventory

- Term: Decision Inventory
- Meaning: The repository-wide inventory of implemented, planned, or in-progress technical decisions.
- Where Used: `.ai/decision-inventory.md`
- Related Terms: ADR, Working Memory, Repository Freeze
- Notes: This file is not itself an ADR log.

## Working Memory

- Term: Working Memory
- Meaning: The current repository-state summary used to help AI Agents continue work without re-analyzing everything.
- Where Used: `.ai/current-task.md`
- Related Terms: Current Task, Current Files, AI Handoff Notes
- Notes: Focused on active context rather than long-term architecture.

## Repository Freeze

- Term: Repository Freeze
- Meaning: The state where baseline documentation files are treated as stable and should change only when repository behavior or standards change.
- Where Used: `.ai/current-files.md`, `.ai/document-map.md`
- Related Terms: Protected File, Decision Inventory, ADR
- Notes: Applies to core AI/documentation files, not all source code.

## Protected File

- Term: Protected File
- Meaning: A file that should not be modified casually and may require explicit approval or tightly scoped intent.
- Where Used: `.ai/current-files.md`, `AGENTS.md`
- Related Terms: High Risk File, Reference, Repository Freeze
- Notes: Examples include `prisma/schema.prisma`, `package.json`, and governance documents.

## High Risk File

- Term: High Risk File
- Meaning: A file whose changes can affect multiple features or core repository behavior.
- Where Used: `.ai/current-files.md`
- Related Terms: Protected File, Entry Point
- Notes: These files require more caution even when edits are allowed.

# AI Collaboration Terms

## Current Task

- Term: Current Task
- Meaning: The current repository working context that tells AI Agents what the repo is actively focused on.
- Where Used: `.ai/current-task.md`
- Related Terms: Working Memory, Current Files, AI Handoff Notes
- Notes: It is not a product roadmap.

## Current Files

- Term: Current Files
- Meaning: The AI modification map that marks editable, protected, reference, frozen, and high-risk areas.
- Where Used: `.ai/current-files.md`
- Related Terms: Editable Area, Protected File, Feature Ownership
- Notes: This file reduces accidental edits and scope drift.

## Reference

- Term: Reference
- Meaning: A file classification used for documents that are normally read for context and edited only when their owned information changes.
- Where Used: `.ai/current-files.md`, `.ai/document-map.md`
- Related Terms: Protected File, Current Files, Repository Freeze
- Notes: Used for key repository guidance documents.

## Editable Area

- Term: Editable Area
- Meaning: A folder or file group that AI Agents can normally modify within scope when implementing or maintaining features.
- Where Used: `.ai/current-files.md`
- Related Terms: Current Files, Protected File, Feature Ownership
- Notes: Editable does not mean risk-free.

## Feature Ownership

- Term: Feature Ownership
- Meaning: The mapping between a feature area, its primary folder, shared dependencies, and protected files.
- Where Used: `.ai/current-files.md`
- Related Terms: Editable Area, Protected File, Shared Infrastructure
- Notes: Used to keep modifications inside the right feature boundary.

## AI Handoff Notes

- Term: AI Handoff Notes
- Meaning: The short continuation guidance for the next AI Agent.
- Where Used: `.ai/current-task.md`
- Related Terms: Current Task, Working Memory, Safe Modification Areas
- Notes: Focused on what is safe, risky, and immediately next.

## Barrel Export

- Term: Barrel Export
- Meaning: An `index.ts` module that intentionally exposes a feature or shared module's public surface.
- Where Used: `.ai/coding-style.md`, `.ai/architecture.md`
- Related Terms: Feature First, Import Strategy
- Notes: Current feature-barrel usage is documented as inconsistent in `.ai/architecture.md`.

## Revalidation

- Term: Revalidation
- Meaning: Refreshing affected server-rendered views after a mutation through the repository's Server Action patterns.
- Where Used: `.ai/architecture.md`, `.ai/coding-style.md`
- Related Terms: Server Action, Action State
- Notes: The current caching and revalidation policy is not fully defined.

## Page Guard

- Term: Page Guard
- Meaning: A server helper used at a route page boundary to enforce authenticated or guest-only access.
- Where Used: `src/features/auth/server/require-auth.ts`, `src/features/auth/server/require-guest.ts`
- Related Terms: requireAuth, requireGuest, Session
- Notes: The current repository uses page-level guards rather than auth middleware.

## `fashio_guest_id`

- Term: `fashio_guest_id`
- Meaning: The guest-cart cookie identifier used before a user has an authenticated cart.
- Where Used: `src/features/cart/utils/cart-cookie.ts`, `.ai/architecture.md`
- Related Terms: Guest Cart, Cart
- Notes: Guest-to-authenticated cart merge is not implemented.

## React Compiler

- Term: React Compiler
- Meaning: The React Compiler setting enabled in the repository's Next.js configuration.
- Where Used: `next.config.ts`, `.ai/architecture.md`, `.ai/decision-inventory.md`
- Related Terms: Server First, Rendering
- Notes: Its implementation status is recorded in the architecture and decision inventory.