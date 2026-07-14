# AI Workflow

## Purpose

`.ai/ai-workflow.md` defines the operating procedure for AI Agents. Mandatory constraints, stop conditions, collaboration rules, and the definition of done are owned by [`AGENTS.md`](../AGENTS.md). Navigation and startup order are owned by [`00-index.md`](00-index.md).

## Operating Workflow

1. Follow the canonical startup flow in `00-index.md`.
2. Classify the request using `AGENTS.md`.
3. Identify the smallest affected feature or documentation boundary.
4. Read the current implementation and applicable configuration.
5. Check `current-files.md` for editable, protected, and high-risk surfaces.
6. Reuse repository patterns before proposing new structure.
7. Plan the smallest safe change.
8. Obtain confirmation if a stop condition in `AGENTS.md` applies.
9. Implement only within the confirmed scope.
10. Review the change against coding standards and documentation impact.
11. Run the smallest relevant available validation.
12. Handoff the completed work clearly.

## Task Procedures

### New feature

- Confirm the owning feature boundary.
- Check current task, roadmap, architecture, decisions, and current files.
- Confirm schema, auth, routes, locale, messages, and dependency impacts.
- Stop for approval where `AGENTS.md` requires it.

### Bug fix

- Reproduce the failure or inspect the failing path.
- Identify the root cause.
- Change the smallest correct surface.
- Validate the affected behavior.

### Refactor

- Confirm that the intended behavior and existing contracts remain unchanged.
- Identify the smallest local structural improvement supported by current implementation evidence.
- Stop for approval if the work becomes architectural or crosses feature boundaries.
- Validate the affected behavior and imports after the refactor.

### Configuration

- Read the applicable configuration and identify its repository-wide workflow impact.
- Confirm whether the change affects dependencies, build behavior, linting, routing, locale, authentication, or deployment.
- Obtain confirmation before changing configuration when `AGENTS.md` requires it.
- Validate the smallest affected command or workflow after the confirmed change.

### Security

- Inspect the relevant server-side authentication, authorization, validation, session, or data boundary.
- Identify the concrete risk and the smallest safe correction.
- Preserve server authority and existing Better Auth, Prisma, and validation patterns.
- Stop when the correct security decision or validation path remains uncertain.

### Testing

- Identify the smallest relevant available validation command or manual verification path.
- Do not assume a test suite or test convention exists when it is not present.
- Run the selected validation and report its result or absence accurately.
- Update test-related documentation only when repository testing practice changes.

### Performance

- Identify the current rendering, query, caching, bundle, or runtime bottleneck from repository evidence.
- Prefer a measured local change that preserves server-first and feature-boundary patterns.
- Stop for approval if the work changes caching policy, architecture, dependencies, or cross-feature behavior.
- Validate the affected performance path when a safe local measurement is available.

### Documentation change

- Verify statements against the responsible source of truth.
- Edit only the document that owns the information according to `document-map.md`.
- Check paths, status labels, cross-references, and terminology.
- Do not introduce architecture, product, or policy decisions while editing documentation.

### Review-only request

- Read the relevant documents and implementation evidence.
- Report facts, inferences, and recommendations separately.
- Do not modify files unless explicitly requested.

## Escalation

Use the stop conditions in `AGENTS.md`. In particular, do not proceed without confirmation for schema, dependency, configuration, authentication, authorization, route, locale, architecture, public API, cross-feature refactor, or planned-feature expansion.

## Review Procedure

Before completing work, confirm:

- The task remains inside the requested boundary.
- Existing patterns and coding conventions were followed.
- Server, auth, validation, localization, accessibility, and security boundaries remain appropriate where relevant.
- No unrelated changes were introduced.
- Documentation is updated only through the policy in `document-map.md` when repository truth changed.
- Validation results and remaining limitations are stated accurately.

## Handoff Procedure

A handoff must state:

- what changed;
- files changed and intentionally untouched files when useful;
- validation run and its result;
- known risks, limitations, or deferred work; and
- the immediate next safe step.

## Document Validity Checklist

This document is valid when it remains procedural, covers each task type defined in `AGENTS.md`, does not duplicate governance from `AGENTS.md`, does not create a competing startup flow with `00-index.md`, and does not replace the maintenance policy in `document-map.md`.
