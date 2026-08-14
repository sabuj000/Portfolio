---
name: write-kb-article
description: >-
  Turn a resolved support issue, bug fix, or troubleshooting thread (from any source — issue tracker,
  Notion, Google Doc, Word/PDF, or text) into a question-based KB / help-center article. Written so the
  next person with the same problem solves it without opening a ticket. For feature guides use
  write-user-doc.
---

# Write KB Article

Owns the **structure** of a help/KB article. Composes the shared modules.

Pipeline: `shared/ingest → extract (below) → shared/verify → draft (below) → shared/quality-checklist
→ shared/deliver`. Read `project-profile.md` first.

## Extract & generalize
Recover: the **core problem** (what the user was trying to do, in general terms), the **resolution**
(concrete steps, prerequisites, permissions/plan gating), **variations/edge cases**, and the **product
area** (for category/links). Then strip all specifics (customer/company, record IDs, real emails,
ticket-specific amounts/dates) — the article serves everyone.

If the source has no actual fix, don't invent steps — ask, or produce a clearly-flagged draft with a
low confidence score. Verify prerequisites/gating and any UI labels via `shared/verify.md`.

## Draft (structure)
Follow `templates/kb-article.md` and `shared/style-guide.md`:
- **Question-based title** ("How do I…", "Why does…", "What is…"), ≤ ~80 chars, naming the feature/area
  (not just the symptom).
- **Problem statement → Solution → Important notes.** Optional "Related scenarios" only if the same fix
  covers other phrasings. **Gating at the top of Solution**, before step 1.
- Deterministic numbered steps; bold UI labels; nav as `A > B > C`; final step states the outcome.
- **No "Related Articles" body section** and no invented links. Self-contained (no ticket references).

## Finish
Self-review with `shared/quality-checklist.md` (common + **KB** section), then `shared/deliver.md`
(production file + plain-Markdown review copy if MDX; confidence score; `[unverified]` list).
