# Documentation Map

## Purpose

`.ai/document-map.md` defines documentation ownership, responsibility boundaries, and the canonical documentation update policy. It does not define AI startup order, governance, architecture, or coding conventions.

## Responsibility Matrix

| Document | Owns | Must not duplicate |
| --- | --- | --- |
| `README.md` | Repository entry point, setup commands, concise status, navigation | Architecture detail, governance, coding rules |
| `AGENTS.md` | Mandatory AI governance, collaboration rules, stop conditions, definition of done | Architecture detail, procedures, roadmap |
| `.ai/00-index.md` | AI navigation, startup flow, repository-fact hierarchy | Workflow detail, architecture, coding rules |
| `.ai/ai-workflow.md` | Operating procedures, task review, handoff | Governance rules, startup order, update policy |
| `.ai/project.md` | Vision, goals, stable principles, folder philosophy | Current task state, workflow, coding-style detail, roadmap sequencing |
| `.ai/architecture.md` | As-built structure, flows, boundaries, technical debt, architecture risks | Governance, coding convention detail, current sprint planning |
| `.ai/decision-inventory.md` | Evidence-backed technical decision inventory | ADR rationale |
| `.ai/decisions.md` | Accepted ADR context, decisions, consequences | Full decision inventory |
| `.ai/coding-style.md` | Coding conventions, examples, implementation patterns | Governance, architecture narrative, documentation update policy |
| `.ai/current-task.md` | Active working context, blockers, risks, next safe step | Stable architecture and long-term principles |
| `.ai/current-files.md` | Editable/protected/high-risk map and feature ownership | Architecture narrative and coding rules |
| `.ai/roadmap.md` | Development sequencing, phase status, deferred work | Active task detail and implementation procedure |
| `.ai/glossary.md` | Repository terminology | Architecture narrative and product requirements |
| `.ai/changelog.md` | Historical changes when intentionally tracked | Planning, architecture, or ADR rationale |

## Canonical Documentation Update Policy

Update documentation only when the information owned by that document changes.

| Change | Update |
| --- | --- |
| Entry-point guidance, setup, or concise public status | `README.md` |
| AI governance, stop conditions, collaboration, or definition of done | `AGENTS.md` |
| AI navigation, startup flow, or repository-fact hierarchy | `.ai/00-index.md` |
| AI operating procedure or handoff procedure | `.ai/ai-workflow.md` |
| Project vision, goals, or stable principles | `.ai/project.md` |
| As-built structure, architecture flow, risk, or technical debt | `.ai/architecture.md` |
| Evidence-backed technical decision status | `.ai/decision-inventory.md` |
| Accepted technical decision rationale or consequence | `.ai/decisions.md` |
| Coding convention or implementation pattern | `.ai/coding-style.md` |
| Active context, blocker, risk, or next safe step | `.ai/current-task.md` |
| File risk classification, ownership, or modification boundary | `.ai/current-files.md` |
| Development phase, priority, or deferred work | `.ai/roadmap.md` |
| Repository term or definition | `.ai/glossary.md` |
| Historical change intentionally tracked by maintainers | `.ai/changelog.md` |

When one repository change affects multiple owned topics, update each responsible document. Do not duplicate the same source information in another document merely for convenience.

## Document Classification

- **Reference:** Read to understand a topic; edit only when its owned information changes.
- **Protected:** Requires explicit approval or a clearly authorized narrow task before editing.
- **High risk:** A change can affect multiple features or repository-wide behavior; additional review is required.
- **Frozen:** A stable baseline document that should not receive wording-only churn. Frozen does not override explicit authorization to correct verified drift.

`current-files.md` identifies which documents and files are currently reference, protected, high risk, or frozen.

## Cross-Reference Rules

- Use Markdown links for repository documentation references where practical.
- Reference the owner document instead of copying its rules.
- Do not reference files that are absent from the repository.
- Use the status taxonomy defined in `architecture.md`: Implemented, Implemented with Known Limitations, In Progress, Planned, Not Implemented, Not Defined Yet, Unknown.

## Document Quality Checklist

A document is complete when it has a clear purpose, stays inside its responsibility boundary, uses valid references, uses the shared status and terminology conventions, and does not duplicate another document's canonical content.
