# Shared module: Ingest source (format-agnostic)

Every create skill starts here. Load the source content regardless of format, then hand the extracted
text to the skill's "extract" step. Never draft from a summary or an index — read the actual content.

## Accept any of
- **Pasted text / uploaded file** (Word `.docx`, `.pdf`, `.md`, `.txt`) → read it directly.
- **Notion / Google Doc / Confluence** (link or export) → fetch/read the page content.
- **Jira / issue tracker** (key or URL) → read the issue description, comments, and resolution.
- **A base draft** written by a PM/engineer/SME.

## Rules
- **Read children, not the index.** If the source is a hub/epic/tracker that links to child items,
  open the children — the real behavior and edge cases live there, not in the summary row. Note any
  child you could not access.
- **Multi-source sweep when thin.** If one source is sparse, check the others the user pointed to in
  `project-profile.md`, and explicitly say which you could and couldn't access.
- **Strip specifics on the way in.** Drop customer names, emails, phone numbers, record IDs, and raw
  ticket quotes — generalize to the common case. (These must never reach the body; see guardrails.)
- **Capture, don't assume.** Pull the facts the doc type needs (each create skill lists its fields). If
  a needed fact is missing, mark it `TODO: confirm <detail>` — do not invent it.

## Output of this step
A clean set of source facts + a note of any gaps and any sources you couldn't reach — ready for the
create skill's extract/verify steps.
