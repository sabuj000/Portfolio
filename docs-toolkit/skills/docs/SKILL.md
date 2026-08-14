---
name: docs
description: >-
  Entry point for the docs-as-code toolkit. Give it any source (Word, PDF, Notion, Jira, Google Doc,
  or text) and a request to write or review documentation; it classifies the work, routes to the right
  create skill, runs the shared quality gate, and delivers — or hands a review to review-doc. Use
  whenever someone wants to create or review product docs and isn't sure which skill to call.
---

# docs — orchestrator

One entry point that runs the whole pipeline. Keep the routing here; keep the craft in the child skills
and the reusable logic in `shared/`.

## 0) Load config
Read `project-profile.md`. If it doesn't exist, run **docs-setup** first (or ask for the essentials).

## 1) Classify the request
- **Create vs. review?** If the user points at an existing draft or a PR to check → route to
  **review-doc**. If they supply source material and want a document → create.
- **Which doc type?** Decide from the request and source, and confirm with the user (offer a default):

  | Signal | Route to |
  |---|---|
  | Feature overview, how-to, settings/navigation guide | `write-user-doc` |
  | Resolved support issue / troubleshooting / "how do I…" | `write-kb-article` |
  | Endpoint/CLI/SDK reference from a spec or code | `write-api-doc` |
  | End-to-end scenario spanning multiple features/steps | `write-usecase-doc` |
  | "What's new" / changelog / release entry | `write-release-notes` |

- If it's genuinely already answered by existing docs, say so and stop (don't draft).

## 2) Run the create pipeline (delegated to the child skill)
Every create skill follows the same shape, composing the shared modules:

```
shared/ingest → (extract this doc type's fields) → shared/verify →
draft per templates/<type> + shared/style-guide → shared/quality-checklist (self-review) → shared/deliver
```

Hand off to the chosen `write-*` skill; it owns only the doc-type structure and fields.

## 3) Auto-review before delivery
After a draft is produced, run the **common + type section of `shared/quality-checklist.md`** as a
self-review, fix what you can, and surface anything needing a human (`[unverified]`, contradictions).

## 4) Deliver
Follow `shared/deliver.md` (PR / files / inline per profile), ending with the confidence score,
`[unverified]` list, and links to register.

## Rules
- Confirm doc type before drafting; don't blend two structures.
- Never invent facts, categories, or links — missing → `TODO` / `[unverified]`.
- For a review request, don't draft — route to **review-doc**.
