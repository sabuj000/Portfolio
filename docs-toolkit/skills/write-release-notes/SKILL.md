---
name: write-release-notes
description: >-
  Turn a feature/enhancement/bug-fix source (issue tracker item, spec, or brief) into a polished
  release note / changelog / "what's new" entry. Confirms release status first, uses a feature format
  and a bug-fix format, and offers heading options.
---

# Write Release Notes

Owns the **structure** of release-note copy. Composes the shared modules.

Pipeline: `shared/ingest → classify + status (below) → shared/verify → draft (below) →
shared/quality-checklist → shared/deliver`. Read `project-profile.md` first.

## Classify & check status
- **Format:** feature/enhancement → "What / Why / How"; bug fix → symptom-first paragraph.
- **Release status (before writing):** confirm it actually shipped and to whom — generally available,
  beta/early-access, or phased rollout. Never present in-development work as released; if not GA, say
  so and scope the note to what's live. Prefer customer-facing wording over internal mechanics; verify
  the real feature name and nav via `shared/verify.md`.

## Draft
Follow `templates/release-note.md` and `shared/style-guide.md`:

**Feature/enhancement — "What / Why / How":**
- One paragraph opening with the change ("You can now…"), then what it lets the reader do.
- **Why is this important?** — the benefit, 1–2 lines (bullets if several).
- **How can you use it?** — numbered steps for a UI path, or "No additional setup is required."

**Bug fix:** one paragraph — lead with the user-facing symptom and conditions, then confirm it's fixed
and what now works. No root cause or implementation detail.

**Style:** short active sentences, second person for the reader, third person for their customers; no
em dashes; hyperlink feature/product names to the relevant docs with descriptive link text.

Offer **3–4 short heading options** (sentence case) that name the change; for API/developer changes,
name the exact parameter/endpoint. Add the audience/type/maturity tags your profile defines.

## Finish
Self-review with `shared/quality-checklist.md` (common + **Release notes** section), then
`shared/deliver.md`. End with a "sources checked / open questions" note listing what you could and
couldn't confirm (status, naming, steps).
