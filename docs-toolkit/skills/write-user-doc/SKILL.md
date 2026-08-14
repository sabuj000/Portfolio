---
name: write-user-doc
description: >-
  Turn source material (Jira ticket, spec, brief, Notion/Google Doc, Word/PDF, or text) into a
  product/user document — feature overviews, how-to and step-by-step guides, settings/navigation
  pages — in your docs-as-code format. For question-based help articles use write-kb-article; for API
  reference use write-api-doc.
---

# Write User Doc

Owns the **structure** of a user/product doc. Everything else composes the shared modules.

Pipeline: `shared/ingest → extract (below) → shared/verify → draft (below) → shared/quality-checklist
→ shared/deliver`. Read `project-profile.md` first.

## Intake (ask, don't assume)
Confirm **doc type** (user doc here vs. KB vs. API), **product/area** (sets base link + asset paths),
and **audience** (persona + technical level). Offer defaults from the source, but ask.

## Extract these fields
Feature · audience · problem solved · functionality · user interaction · required inputs ·
**prerequisites/gating** · outputs · configuration · usage steps · **feature interactions**
(A-disables-B, shared settings, order) · limitations. Missing → `TODO: confirm <detail>`.

Verify via `shared/verify.md`: UI labels/nav against the UI source; gating/prereqs/interactions against
the backend source. The feature-interaction claims on overview pages matter most — verify them first.

## Draft (structure)
Follow `templates/user-doc.md` and `shared/style-guide.md`:
- Start with a short purpose line, then sections with **self-locating** `##/###` headings.
- **Prerequisites/gating before the steps.** Numbered steps for procedures; bold UI labels; nav as
  `A > B > C`; final step states a checkable outcome.
- One intent per section; inline sibling boundaries when features overlap.
- Render to the profile's format (plain Markdown or your components/frontmatter). MDX: only configured
  components; valid frontmatter; no HTML comments.

## Finish
Self-review with `shared/quality-checklist.md` (common + **User/product doc** section), then
`shared/deliver.md` (production file + a plain-Markdown review copy if MDX; confidence score;
`[unverified]` list).
