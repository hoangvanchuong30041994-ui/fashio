# Current Files Map

**Last Updated:** 2026-07-13

## Purpose

This document maps modification risk and feature ownership for AI Agents. It does not replace architecture, governance, or coding conventions.

## Classification Legend

| Classification | Meaning |
| --- | --- |
| Editable | May be changed within confirmed scope after reading the file. |
| Reference | Normally read for context; edit only when its owned information changes. |
| Protected | Requires explicit approval or clearly authorized narrow scope. |
| High risk | Can affect multiple features or repository-wide behavior; requires additional caution. |
| Frozen | Stable baseline content; avoid wording-only churn. Explicit authorization to correct verified drift still applies. |

A file can have more than one classification. Protected and high-risk classifications take precedence over editable status.

## Editable Areas

| Area | Purpose | Risk |
| --- | --- | --- |
| `src/features/auth/**` | Authentication UI, actions, schemas, and helpers | Medium to High |
| `src/features/cart/**` | Cart reads, mutations, UI, and guest-cart handling | Medium |
| `src/features/order/**` | Checkout, order creation, list, detail, and UI | Medium |
| `src/features/product/**` | Product catalog, collection views, and variant UI | Medium |
| `src/shared/components/**` | Shared UI, layout, providers, and icons | Medium to High |
| `src/shared/lib/**` | Shared infrastructure and utilities | High |
| `src/shared/hooks/**` | Shared hooks | Medium |
| `src/i18n/**` | Locale routing, navigation, and request configuration | High |
| `src/app/[locale]/**` | Route pages, layouts, metadata, and orchestration | Medium to High |
| `messages/**` | Locale message catalogs | Medium |
| `docs/**` | Topic-specific technical documentation when present | Low to Medium |

## Reference and Frozen Documents

The following documents are reference and frozen unless their owned information changes:

- `README.md`
- `.ai/project.md`
- `.ai/architecture.md`
- `.ai/decision-inventory.md`
- `.ai/decisions.md`
- `.ai/coding-style.md`
- `.ai/00-index.md`
- `.ai/ai-workflow.md`
- `.ai/document-map.md`
- `.ai/roadmap.md`
- `.ai/glossary.md`

`current-task.md` and this file are working-context documents and change only when their context or mapping materially changes.

## Protected Files

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `prisma/schema.prisma`
- `AGENTS.md`
- `.ai/project.md`
- `.ai/architecture.md`
- `.ai/decision-inventory.md`
- `.ai/decisions.md`

## High-Risk Files

- `src/proxy.ts`
- `src/features/auth/server/auth.ts`
- `src/features/auth/server/session.ts`
- `src/features/auth/server/require-auth.ts`
- `src/features/auth/server/require-guest.ts`
- `src/i18n/request.ts`
- `src/i18n/routing.ts`
- `src/i18n/navigation.ts`
- `src/shared/lib/prisma.ts`
- `prisma/schema.prisma`
- `package.json`

## Feature Ownership

| Feature | Primary area | Key shared dependencies |
| --- | --- | --- |
| Authentication | `src/features/auth` | shared components, Prisma, i18n, messages |
| Cart | `src/features/cart` | session helper, Prisma, shared components, messages |
| Order | `src/features/order` | auth, cart, Prisma, shared components, messages |
| Product | `src/features/product` | cart action, Prisma, shared components, messages |
| Agent | `src/features/agent` | Stub-only; expansion requires explicit scope confirmation |
| User | `src/features/user` | Stub-only; expansion requires explicit scope confirmation |

## Safe Modification Rules

- Keep changes feature-local when possible.
- Reuse existing abstractions before creating new ones.
- Keep message changes aligned between `messages/en` and `messages/vi`.
- Use `.ai/document-map.md` to update documentation only when owned information changes.
- Follow `AGENTS.md` for protected/high-risk changes and stop conditions.
