# Shared module: Deliver

Deliver per the method in `project-profile.md`. Always end with the confidence score, the
`[unverified]` list, and any links to register.

## Options
- **Open a PR** — create a branch per the profile's naming, commit with the profile's message format,
  and open the PR against the base branch. Start the PR description with a **decision block**:
  ```
  Decision: <doc type> · <create | update>
  Sources: <primary source> + <files each major claim was verified against>
  Verification: <claims checked> → <confirmed | contradicted | not found | gap | no source mapped>
  Terminology: <PASS | FAIL> — touch-set: <files>; findings: <none | list>
  Unverified: <low | med | high> — <list or "none">
  ```
  Traceability lives here — **never** in the customer-facing body.
- **Downloadable files** — write the production file (and a plain-Markdown review copy if the format is
  MDX). Name files from the kebab-cased title.
- **Inline** — post the production version and (for MDX) a plain-Markdown review copy, clearly labeled.

## Two-version rule (MDX/component formats only)
When the production format uses components, also produce a **plain-Markdown review copy** so a reviewer
can read/paste it easily: components → their Markdown fallback (see the component mapping), frontmatter
omitted, tables as pipe tables, callouts as labeled blockquotes.

## Always end with
- **Confidence score (0.0–1.0)** — lowered honestly when the source was thin or verification was
  skipped/failed.
- **`[unverified]` claims** — the list a human must resolve.
- **Links used** — so any new ones can be registered if the build requires it.
