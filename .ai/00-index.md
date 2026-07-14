# AI Documentation Index

## Purpose

`.ai/00-index.md` is the canonical entry point for AI documentation in this repository. It owns the repository-fact source hierarchy, the AI startup flow, and navigation to the responsible document for each topic.

## Repository-Fact Source Hierarchy

Use this hierarchy only to determine facts about the repository:

1. Repository source code and configuration
2. Current working context: `.ai/current-task.md`, `.ai/current-files.md`
3. Architecture documentation: `.ai/architecture.md`
4. Decision records: `.ai/decision-inventory.md`, `.ai/decisions.md`
5. Standards: `.ai/coding-style.md`, `AGENTS.md`, `.ai/ai-workflow.md`
6. Planning: `.ai/roadmap.md`
7. Public documentation: `README.md`

`AGENTS.md` separately defines how to resolve instruction conflicts. Do not use its instruction priority to replace this repository-fact hierarchy.

## Canonical AI Startup Flow

Before substantial work:

1. Read [`README.md`](../README.md).
2. Read this index.
3. Read [`AGENTS.md`](../AGENTS.md).
4. Read [`.ai/ai-workflow.md`](ai-workflow.md).
5. Read [`.ai/project.md`](project.md).
6. Read [`.ai/architecture.md`](architecture.md).
7. Read [`.ai/decision-inventory.md`](decision-inventory.md) and [`.ai/decisions.md`](decisions.md).
8. Read [`.ai/coding-style.md`](coding-style.md).
9. Read [`.ai/current-task.md`](current-task.md) and [`.ai/current-files.md`](current-files.md).
10. Read [`.ai/roadmap.md`](roadmap.md) and [`.ai/glossary.md`](glossary.md) when relevant to the task.
11. Read the relevant configuration and source files.
12. Classify the task and follow the applicable procedure in `AGENTS.md` and `ai-workflow.md`.

For a small, clearly scoped task, steps 10 and unrelated source areas may be skipped only when they cannot affect the requested work.

## Documentation Directory

| Document | Responsibility | Primary audience |
| --- | --- | --- |
| `README.md` | Public repository entry point, setup, and navigation | Developers and visitors |
| `AGENTS.md` | Mandatory AI governance, stop conditions, and definition of done | AI Agents |
| `00-index.md` | AI navigation, startup flow, and repository-fact hierarchy | AI Agents |
| `ai-workflow.md` | AI operating procedures, review, and handoff | AI Agents |
| `project.md` | Project vision, stable principles, and long-term direction | Developers and AI Agents |
| `architecture.md` | As-built architecture and documented technical debt | Developers and AI Agents |
| `decision-inventory.md` | Evidence-backed inventory of technical decisions | Architects and AI Agents |
| `decisions.md` | Accepted architecture decision records | Architects and AI Agents |
| `coding-style.md` | Coding conventions and implementation patterns | Developers and AI Agents |
| `current-task.md` | Current working context and active risks | AI Agents |
| `current-files.md` | Modification map and file risk classification | AI Agents |
| `roadmap.md` | Development sequencing and deferred work | Developers and AI Agents |
| `glossary.md` | Repository terminology | Developers and AI Agents |
| `document-map.md` | Documentation responsibilities and maintenance policy | Documentation maintainers and AI Agents |
| `changelog.md` | Historical change record when intentionally used | Maintainers |

## Quick Navigation

| Need | Read |
| --- | --- |
| Repository entry point | `README.md` |
| Mandatory AI constraints | `AGENTS.md` |
| Operating procedure | `.ai/ai-workflow.md` |
| Project principles | `.ai/project.md` |
| Architecture and technical debt | `.ai/architecture.md` |
| Technical decisions | `.ai/decision-inventory.md`, `.ai/decisions.md` |
| Coding conventions | `.ai/coding-style.md` |
| Active context and editable scope | `.ai/current-task.md`, `.ai/current-files.md` |
| Development sequencing | `.ai/roadmap.md` |
| Terminology | `.ai/glossary.md` |
| Documentation ownership or update policy | `.ai/document-map.md` |

## Conflict Resolution

- Use the repository-fact hierarchy above to resolve statements about current implementation.
- If `roadmap.md` and `current-task.md` differ, treat `current-task.md` as the active context and `roadmap.md` as planning context.
- If documentation conflicts with source, treat documentation as outdated until verified against source.
- If the conflict cannot be resolved safely, follow the stop conditions in `AGENTS.md`.

## Maintenance

The canonical documentation update policy is in `.ai/document-map.md`. Register any new documentation there and in this index.
