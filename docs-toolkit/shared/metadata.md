# Shared module: Metadata for AI (precision + personalization)

Documentation is increasingly read by machines (search, RAG, in-product AI, coding agents). Metadata is
what turns "the AI found a relevant page" into "the AI returned the right, precise, personalized answer."
Every create skill applies this; `shared/quality-checklist.md` and the AI-readiness checker score it.

Use the exact field names your `project-profile.md` defines. The fields below are the recommended set.

## 1. Structured metadata (frontmatter) — for precision
Put these in each page's frontmatter so retrieval lands on the right chunk, not a fuzzy match:

- **`description`** — a one-line summary of what the page is and does (also your search/AI snippet).
- **`type`** — the doc type: `concept` | `how-to` | `reference` | `tutorial` | `release-note`. Tells a
  retriever the page's purpose.
- **`product`** — the product/area, so answers are scoped correctly.
- **`version`** — the product/API version, so agents never mix versions.
- **`audience`** / **`persona`** — who it is for (e.g. `developer`, `admin`, `enterprise`).
- **`keywords`** / **`tags`** — topical terms for precision.

## 2. Schema / structured data — for machine parsing
Where the platform allows it, add JSON-LD so search engines and AI parse the page cleanly:

- **`TechArticle`** for concepts, **`HowTo`** for procedures, **`FAQPage`** for Q&A, **`APIReference`**
  for reference. Include `headline`, `description`, `dateModified`, and (for HowTo) the steps.
- Keep the schema's title/description in sync with the page and frontmatter.

## 3. Personalization signals — for the right variant
Tag content so an agent can return the variant that fits the reader, not a generic answer:

- **`sdk`** / **`language`** (e.g. `node`, `python`, `go`) — serve the matching code example.
- **`plan`** / **`tier`** — show the steps for the reader's plan.
- **`region`** / **`locale`** — surface the correct regional flow.
- Where a page genuinely differs by variant, offer per-language/per-tier variants rather than one
  blended page.

## 4. Section-level answers — for chunk precision
- Give each major section a **self-locating heading** and, where useful, a one-line answer up top, so a
  retrieved chunk stands alone and answers directly.

## Keep it honest (governance)
- Metadata is only useful if it stays true. When a page is deprecated, renamed, or re-versioned, update
  the frontmatter, schema, and any `.md`/`llms.txt` outputs in the **same change**. Stale metadata is
  worse than none.
- Only tag what is true. Do not claim a `version` or `audience` the page does not actually serve.

## How this maps to the checker
The AI-readiness checker's **"Metadata, schema & personalization"** dimension scores exactly these:
frontmatter fields, JSON-LD presence, and personalization tags. Authoring to this module means your
pages pass that dimension by construction.
