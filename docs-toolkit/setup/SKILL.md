---
name: docs-setup
description: >-
  Interactively create or update project-profile.md and terminology.md for the docs-as-code toolkit.
  Use once when adopting the toolkit, or whenever the product, repo, sources, components, or style
  change. Builds the config by asking questions — no blind template-filling.
---

# Docs Toolkit — Setup

Interview the user and write a complete `project-profile.md` (and seed `shared/terminology.md`) so the
create/review skills work for their product. Be efficient: ask in small batches, infer sensible
defaults, and confirm rather than interrogate.

## Flow
1. **Detect first.** If a docs repo is available, inspect it to pre-fill answers: content format
   (Markdown/MDX/AsciiDoc), an existing style guide, frontmatter fields in existing files, and the
   component set actually used. Propose these as defaults so the user just confirms.
2. **Ask in batches** (offer defaults; accept "use defaults"):
   - Product name + one-line description + primary reader + docs base URL.
   - Docs repo, content path, format, PR base branch, link/asset rules.
   - Sources of truth: primary source per request; code/implementation repo(s) and how to search
     them; API spec location; UI source for labels/nav.
   - Components & frontmatter: exact field names/format and the component mapping (or "plain Markdown").
   - Style: base style guide, English variant, UI-verb rule, banned words.
   - Delivery: PR / files / inline; PR conventions; review model.
3. **Seed terminology.** Ask for the brand/product names and settled spellings that must never be
   misspelled, plus known "do not use" variants. Write them into `shared/terminology.md` (copy the
   structure from `terminology.example.md`). If a docs corpus is available, offer to scan it for the
   most frequent product/proper-noun terms and propose the list.
4. **Write the files.** Produce a filled `project-profile.md` and `shared/terminology.md`. Show them,
   confirm, and note anything left as a `TODO` for the user to complete.

## Rules
- Never invent the user's product facts — if unknown, leave a clear `TODO`.
- Keep the profile minimal but complete; a create skill must be able to run from it without more setup.
- Re-runnable: on later runs, load the existing profile and only ask about what's changing.
