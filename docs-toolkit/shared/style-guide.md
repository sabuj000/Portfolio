# Documentation Style Guide (generic)

A portable house style for docs-as-code. Defaults to the **Microsoft Writing Style Guide (MSTP)**
(<https://learn.microsoft.com/en-us/style-guide/welcome/>) for general mechanics, with a few
deliberate overrides. Adjust in `project-profile.md`.

## Voice & mechanics (MSTP defaults)
- Second person ("you"), present tense, active voice.
- Sentence-case headings. Oxford comma. One space after periods.
- Plain, technical voice — no marketing language ("seamless", "streamline", "effortless", "powerful").
- Bias-free — avoid "easy", "simple", "just". Descriptive link text (never "click here" or a bare URL).
- Pick one English variant (US or UK) and keep it consistent.

## House overrides (win over MSTP where they conflict)
**UI verbs — click vs. select:**
- **Click** — activating a control that acts/navigates: buttons, CTAs, links, icons.
- **Select** — choosing a value/item: dropdown values, radio buttons, list/menu items, tabs,
  checkboxes, text. **Clear** to uncheck; **Turn on/off** for toggles; **Tap** for touch steps.
- Mental model: click = trigger/activate; select = choose from options.

**Task headings — imperative:** "Create a customer record", not "To create a customer record". Keep
headings at one level parallel; sentence case still applies.

## Retrieval-readiness (write for humans *and* AI/search/RAG)
The unit of quality is the **section**, because retrieval pipelines chunk pages:
1. **Self-locating headings** — identify the subject without the page title as context.
2. **One intent per section** — merge duplicates; don't shelter unrelated settings under a heading.
3. **Prerequisites before procedures** — gating goes before the steps it gates.
4. **Outcome-changing rules in body prose**, not callouts (chunkers orphan callouts).
5. **Chunk-independent sections** — no "above / as mentioned earlier".
6. **Present tense, current behavior** — history belongs in release notes.
7. **Inline sibling boundaries** — when two features overlap, each says when to use it vs. the sibling.
8. **No dead-end references** — "see the documentation" is a real link or a `TODO`.
9. **Review with a clean slate** — read as a brand-new user; answer every question that reader has.

## Structure & formatting
- `##/###` headings; numbered steps for procedures; bullets for options; tables for comparisons.
- Bold UI elements; nav paths as `A > B > C` using real labels.
- Deterministic steps (name exact fields); final step states a checkable outcome.
