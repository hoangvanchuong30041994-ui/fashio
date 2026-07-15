# Fashio

Fashio is a Next.js App Router storefront for fashion commerce. The repository currently provides a server-first, locale-aware foundation for authentication, product catalog, cart, checkout, and order views.

## Current Status

| Area | Status |
| --- | --- |
| Application shell and routing | Implemented |
| Internationalization | Implemented |
| Authentication | Implemented with Known Limitations |
| Product catalog | Implemented |
| Cart | Implemented with Known Limitations |
| Checkout and orders | Implemented with Known Limitations |
| Payment | Not Implemented |
| User preferences | Planned |
| AI shopping assistant | Planned |
| Automated tests | Not Implemented |

For implemented scope, limitations, and current technical debt, read [`.ai/architecture.md`](.ai/architecture.md).

## Technology Stack

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4 and shadcn-oriented shared UI primitives
- Prisma with PostgreSQL
- Better Auth
- Zod and React Hook Form
- next-intl

The complete dependency inventory is maintained by [`package.json`](package.json) and summarized in [`.ai/architecture.md`](.ai/architecture.md).

## Repository Structure

- [`src/app`](src/app) — App Router entry points, layouts, route groups, and API routes.
- [`src/features`](src/features) — Domain-oriented modules: auth, cart, order, product, plus planned agent and user areas.
- [`src/shared`](src/shared) — Shared UI, layouts, providers, hooks, and infrastructure helpers.
- [`src/i18n`](src/i18n) — Locale routing, navigation helpers, and message registration.
- [`prisma`](prisma) — Prisma schema, migrations, generated client output, and seed workflow.
- [`messages`](messages) — Translation messages for `en` and `vi`.
- [`.ai`](.ai) — AI governance, architecture, decisions, standards, and working context.
- [`docs`](docs) — Topic-specific technical documentation when present.

## Development Flows

### Read flow

Feature page → query → Prisma → PostgreSQL

### Mutation flow

Feature form or action trigger → Server Action → Zod validation → Prisma transaction or mutation → revalidation or redirect

### Authentication flow

Client form or OAuth trigger → auth action or Better Auth client → Better Auth → Prisma → PostgreSQL

### Locale flow

Request → `src/proxy.ts` → `src/app/[locale]/layout.tsx` → `NextIntlClientProvider` → locale-aware pages and components

## Getting Started

### Prerequisites

- Node.js
- pnpm
- PostgreSQL

### Environment Variables

Configure the required environment variables before running the application:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_APP_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `AUTH_RATE_LIMIT_SECRET`

See [`.ai/architecture.md`](.ai/architecture.md) for the documented environment-variable inventory.

### Commands

```sh
pnpm install
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm db:generate
pnpm db:migrate
pnpm db:studio
pnpm db:seed
pnpm db:deploy
```

Use `pnpm db:migrate` for the migration workflow. `pnpm db:push` is an alternative schema-sync workflow and does not create a migration file.

## Documentation

### Start here

1. [`.ai/00-index.md`](.ai/00-index.md) — canonical navigation, source hierarchy, and AI startup flow.
2. [`AGENTS.md`](AGENTS.md) — mandatory AI governance.
3. [`.ai/project.md`](.ai/project.md) — project constitution.
4. [`.ai/architecture.md`](.ai/architecture.md) — as-built architecture.

### Core references

- [AI workflow](.ai/ai-workflow.md)
- [Documentation map](.ai/document-map.md)
- [Decision inventory](.ai/decision-inventory.md)
- [Architecture decisions](.ai/decisions.md)
- [Coding style](.ai/coding-style.md)
- [Current task](.ai/current-task.md)
- [Current files](.ai/current-files.md)
- [Roadmap](.ai/roadmap.md)
- [Glossary](.ai/glossary.md)
- [Changelog](.ai/changelog.md)

## License

Not Defined Yet
