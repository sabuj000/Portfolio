---
name: review-doc
description: >-
  Review a documentation change — a draft or an open pull request — against the source of truth and the
  shared quality gate, and return actionable findings (optionally as inline "apply suggestion" comments
  on a PR). Reviews only; never silently rewrites. Works for API, user/product, KB, use-case, and
  release-note docs.
---

# review-doc

Review-only. Compares a doc (or PR) to the implementation/source, applies the same
`shared/quality-checklist.md` the create skills use, and reports findings — as exact fixes where
possible. Never drafts or edits the branch.

## 0) Config
Read `project-profile.md` (repo, sources of truth, format/components, style, terminology, PR
conventions).

## 1) Inputs
The draft, or the **PR URL/number**; optional companion source (implementation PR, API spec, ticket,
SME notes); the user's intent (review only / request changes / approve / comment). If the target is
missing, ask — never invent one.

## 2) Fetch (for a PR)
Get metadata, the **diff**, CI checks, and existing reviews. Review the **PR head**; read the **full
changed files**, not only the hunks — structural omissions hide outside the diff. Don't force-checkout
or edit the branch.

## 3) Verify against the source of truth
Apply `shared/verify.md` by role (spec/code, UI, backend). Keep a **source-of-truth ledger**: each
major claim → source → confirmed / contradicted / not found / no-source. Flag phantom fields and
omitted new surface. Never rewrite an SME/source behavior to match a code reading — flag it.

## 4) Deep review
Run `shared/quality-checklist.md` — the **common** section plus the section for this doc type. If a
large change would yield only a couple of wording nits, re-run: you likely missed a parity/structure
issue (**depth guardrail**).

## 5) Report (only actionable findings)
Separate into **Must fix** (blocks publish), **Should fix**, **Nit**. Prefer exact **apply-suggestion**
fixes on changed lines; when a fix needs a file not in the diff, put it in the review body. Choose the
event:

| Event | When |
|---|---|
| Approve | No must-fix / should-fix findings. |
| Request changes | Wrong surface, broken links, wrong enums/params, doc↔source contradiction, or the user asked to block. |
| Comment | Questions / nits only, or the user didn't ask to block. |

Do not commit, push, merge, or edit unless explicitly asked.

## 6) Summarize
Return the review link (if a PR), the verdict, a compact finding list (severity · file:line ·
one-line issue), the source ledger, and any blockers (auth, empty diff, missing source, wrong doc type
for the checklist).
