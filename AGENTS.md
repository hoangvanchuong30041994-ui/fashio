# AGENTS.md

## Purpose

`AGENTS.md` is the repository's canonical AI governance document. It defines mandatory AI behavior, decision boundaries, stop conditions, collaboration rules, and the definition of done.

It does not define architecture, coding conventions, roadmap sequencing, or detailed operating procedures. Read the canonical documentation index and startup flow in `.ai/00-index.md` before substantial work.

## Governance Scope

These rules apply to every AI Agent that reads, reviews, modifies, or generates repository content.

## Instruction Priority

When instructions conflict, follow this order:

1. System instructions
2. User request
3. `AGENTS.md`
4. `.ai/project.md`
5. `.ai/architecture.md`
6. Existing repository source and configuration
7. Personal preference

Repository source code remains the authority for what currently exists. The repository source-of-truth hierarchy for repository facts is defined only in `.ai/00-index.md`.

## Mandatory Startup

Before substantial work, follow the canonical AI Startup Flow in `.ai/00-index.md`. Do not create a competing reading order in this document.

## Task Classification

Classify every request before acting:

| Type | Use when | Required approach |
| --- | --- | --- |
| New Feature | New behavior, screen, flow, or domain capability | Confirm feature boundary and impacts on schema, auth, routes, locale, and messages. |
| Bug Fix | Existing behavior is incorrect | Inspect the failing path, identify the root cause, and fix the smallest correct surface. |
| Refactor | Structure or maintainability changes without intended behavior change | Preserve contracts and stop if the work becomes architectural. |
| Review | Analysis-only request | Read relevant materials and report repository-grounded findings; do not modify files. |
| Documentation | Repository guidance or technical documentation changes | Verify against the documented source of truth and edit only the responsible document. |
| Testing | Adding, updating, or running validation | Start with the smallest relevant validation scope; do not claim results not run. |
| Configuration | Scripts, framework configuration, linting, build behavior, or environment setup | Read the configuration first and assess workflow impact. |
| Performance | Rendering, query, caching, bundle, or runtime efficiency changes | Identify the current bottleneck and prefer measured local changes. |
| Security | Auth, session, secrets, validation, user data, or access control changes | Keep authority on the server and stop when uncertainty remains. |

## Decision Confidence

| Confidence | Meaning | Required action |
| --- | --- | --- |
| High | Request, target, pattern, and verification path are clear from repository evidence. | Proceed and validate normally. |
| Medium | The smallest safe path is supported by evidence, with bounded inference. | Proceed conservatively and state the inference. |
| Low | Intent, target, behavior, or safe decision is unknown. | Stop and ask a targeted question. |

Low-confidence implementation is not allowed.

## Modification Boundaries

- Read a file before modifying it.
- Modify only files directly related to the request.
- Keep changes small, local, reversible, and consistent with repository patterns.
- Do not rename, move, delete, or reorganize files unless explicitly requested.
- Keep `src/app` focused on routing, layouts, route groups, and orchestration.
- Do not move feature-specific logic into `src/shared` without proven current reuse.
- Treat `src/features/agent` and `src/features/user` as out of scope unless explicitly requested.
- Treat `prisma/schema.prisma` as protected; do not change it without approval.
- Use `.ai/current-files.md` as the canonical modification map.

## Package and Architecture Boundaries

Do not install, remove, replace, or change package versions without approval. Do not make architecture, schema, route, locale, auth-flow, authorization, public API, or cross-feature refactor changes without approval.

## Security and Performance Boundaries

- Keep authentication and authorization decisions on the server.
- Do not expose secrets, credentials, tokens, cookies, headers, or session internals.
- Preserve validation at boundaries.
- Do not bypass Better Auth or Prisma patterns already established in the repository.
- Prefer Server Components by default and do not add `'use client'` without a concrete interaction need.
- Do not move server work to the client or introduce unnecessary global client state.
- Avoid over-fetching and unnecessary hydration.

## AI Collaboration Rules

- Respect unrelated work and do not overwrite it.
- Do not broaden a diff or perform opportunistic cleanup.
- Preserve feature ownership boundaries.
- Reuse existing abstractions before creating parallel ones.
- Keep handoffs clear using the procedure in `.ai/ai-workflow.md`.

## Stop Conditions

Stop and ask for confirmation when the task requires any of the following:

- a schema change or migration;
- a dependency, package version, package manager, or configuration change;
- authentication or authorization behavior change;
- route or locale strategy change;
- architecture or public API contract change;
- cross-feature refactor;
- expansion of `src/features/agent` or `src/features/user`;
- a protected or high-risk file without clear authorization;
- an unknown correct target, intent, or behavior decision;
- a risky change that cannot be validated safely.

## AI Must Never Do

1. Guess repository facts or continue when the correct decision is unknown.
2. Modify a file before reading it or modify files outside task scope.
3. Rename, move, delete, or reorganize files without explicit instruction.
4. Add, remove, replace, or change dependency versions without approval.
5. Change schema, migrations, routes, locale strategy, auth flow, authorization, architecture, or public APIs silently.
6. Bypass Better Auth, Prisma, validation, or server-side authorization.
7. Expose or hardcode secrets, credentials, tokens, private URLs, cookies, or session internals.
8. Use `any` to avoid proper typing.
9. Hardcode user-facing text where localization is expected.
10. Query Prisma from client code, instantiate Prisma clients in feature files, or use raw SQL when the established Prisma approach is sufficient.
11. Add `'use client'` to shared layouts or common headers without necessity.
12. Create global state for data that can remain server-owned.
13. Duplicate an existing abstraction or move feature logic into `src/shared` without proven reuse.
14. Claim validation passed without running it or fabricate results.
15. Treat governance documents as permission to override repository source truth.

## Definition of Done

A task is complete only when:

- the requested outcome is complete and stays within scope;
- the task was classified and the required documentation was read;
- existing patterns and boundaries were respected;
- no unauthorized package, schema, architecture, auth, route, locale, or API change was introduced;
- localization, accessibility, validation, and server security boundaries were preserved where relevant;
- required documentation was updated through the policy in `.ai/document-map.md` when repository truth changed;
- available relevant validation was run or its absence was stated;
- risks, limitations, and unfinished work were communicated clearly.

## Repository-Specific Notes

The repository uses Next.js App Router, locale-aware routing, Better Auth, Prisma, and a server-first rendering model. Automated tests are not implemented according to the current architecture and coding-style documentation. Middleware currently serves locale routing concerns; broader middleware responsibility requires approval.
