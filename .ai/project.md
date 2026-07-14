# Fashio Project Constitution

## Purpose

This document defines Fashio's stable product vision, project goals, and long-term principles. Architecture details belong in `.ai/architecture.md`; coding conventions belong in `.ai/coding-style.md`; AI governance belongs in `AGENTS.md`; development sequencing belongs in `.ai/roadmap.md`.

## Product Vision

Fashio is a modern fashion ecommerce platform built with an AI-first development mindset. Its long-term goal is a secure, scalable, multilingual storefront that remains understandable and maintainable as the codebase and number of contributors grow.

## Project Goals

- **Maintainability:** The system should be easy to understand, modify, and extend.
- **Scalability:** The system should support new features, traffic, and data without unnecessary complexity.
- **AI collaboration:** AI Agents should be able to work safely and consistently.
- **Performance:** Prioritize fast experience, SSR, selective queries, and controlled bundle size.
- **Security:** Protect user data, sessions, authentication, and business data.
- **Developer experience:** Keep development structured and minimize guesswork.
- **Internationalization:** Support multiple languages from the beginning.

## Technology Direction

The repository uses Next.js App Router, React, TypeScript, Tailwind CSS, shadcn-oriented UI primitives, Better Auth, Prisma, PostgreSQL, Zod, React Hook Form, next-intl, Hugeicons, and Vercel as the documented primary deployment direction. Current implementation evidence and versions are maintained in `.ai/architecture.md`.

## Folder Philosophy

- `src/features` contains feature-based logic and UI.
- `src/shared` contains current cross-feature components, hooks, providers, utilities, layouts, and primitives.
- `src/app` contains routing, layouts, route groups, and high-level orchestration.
- `prisma` contains schema, migrations, and data-model workflow.
- `.ai` contains AI-facing repository documentation.
- `docs` contains topic-specific technical documentation when present.

## Architecture Principles

- Feature-first architecture is the default organizational model.
- Server-first is the default for data, authentication, and page control.
- Prefer composition over inheritance.
- Every feature has a clear boundary.
- Keep feature-specific logic in `src/features` and promote logic to `src/shared` only for proven current reuse.
- Avoid duplicating an adequate existing abstraction.
- Keep UI, data access, and business responsibilities separated where the current repository pattern supports it.
- Keep data contracts consistent across the system.

## Product and Engineering Principles

- Use type-safe, readable, maintainable implementation patterns.
- Keep security-sensitive authority on the server.
- Preserve validation at boundaries.
- Treat localization and accessibility as required for user-facing work.
- Prefer incremental, reversible changes over broad rewrites.
- Keep dependencies stable and use existing capabilities before introducing new ones.

## Governance References

- AI governance and stop conditions: [`AGENTS.md`](../AGENTS.md)
- AI operating procedure: [`ai-workflow.md`](ai-workflow.md)
- Architecture: [`architecture.md`](architecture.md)
- Coding conventions: [`coding-style.md`](coding-style.md)
- Development sequencing: [`roadmap.md`](roadmap.md)
