---
name: write-usecase-doc
description: >-
  Create an end-to-end use-case or implementation guide — a real-world scenario that spans several
  features, APIs, or steps — from a brief, spec, or set of tickets. Produces an ordered path from
  prerequisites to a working outcome, with the roles/systems involved at each step.
---

# Write Use-Case / Implementation Doc

Owns the **structure** of an end-to-end scenario guide. Composes the shared modules.

Pipeline: `shared/ingest → extract (below) → shared/verify → draft (below) → shared/quality-checklist
→ shared/deliver`. Read `project-profile.md` first.

## Extract
The **goal** (what the reader achieves) · **audience/role** · **prerequisites** (accounts, roles,
plans, feature flags, prior setup) · the **ordered stages** (each: what happens, who/what acts —
user, UI, API, backend — and the inputs/outputs) · **decision points/branches** · **success criteria**
· **failure/rollback** paths · related features and where they hand off.

Verify each stage via `shared/verify.md`: API steps against the spec/code; UI steps against the UI
source; gating/order against the backend. Cross-feature order-of-operations is the highest-risk claim —
verify it.

## Draft (structure)
Follow `templates/usecase-doc.md` and `shared/style-guide.md`:
- Open with the goal + who it's for + prerequisites (before any step).
- Walk the scenario in **ordered stages** with self-locating headings; show code/`YAML`/`JSON`/CLI
  examples and API/UI references where relevant.
- State **success criteria** (how the reader knows it worked) and cover **failure/rollback**.
- One intent per section; each stage makes sense retrieved alone.

## Finish
Self-review with `shared/quality-checklist.md` (common + **Use-case/implementation** section), then
`shared/deliver.md` (confidence score; `[unverified]` list).
