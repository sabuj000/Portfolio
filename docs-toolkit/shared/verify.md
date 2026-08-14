# Shared module: Verify claims ("second SME")

Guiding principle: **verify claims, don't mine behavior.** The ticket/spec/SME supplied per request is
the *primary* source — it originates what the doc says. Your code/spec/UI sources (from
`project-profile.md`) are a *second SME* that confirm, contradict, or expose a gap in a claim that
already exists. Never reverse-engineer behavior from code and write it as fact.

## Verify by role (not by repo name)
- **UI labels, field/screen names, navigation paths** → the product UI source.
- **Prerequisites, gating (plan/role/feature-flag), required inputs, state transitions, feature
  interactions (A-disables-B)** → the backend/service source.
- **API operations, params, required/optional, enums, response fields, events** → the API spec/code.

## Discipline
- **Anchor on a concrete token** from the claim — the literal label, a flag constant, a field name —
  never a topic word. A thematically-related hit is **not** verification.
- **Scoped search, then read only the located region.** Cap the effort: if a few scoped searches don't
  surface authoritative source, record "not found" and stop.

## Outcome per claim
| Outcome | Action |
|---|---|
| **Confirmed** | Claim stands. Record the source in the PR/notes — never in customer-facing prose. |
| **Contradicted** | Do **not** auto-fix. Mark `[unverified]` inline, note the discrepancy, lower confidence. Human resolves. |
| **Not found / ambiguous** | Treat as unverified; leave the source claim as written; record it was not verifiable. |
| **Gap** (source shows a condition the draft omits) | Surface as a *suggested addition* flagged for confirmation — never silently add. |
| **No source mapped** for this doc area | No ground truth; keep claims `[unverified]`, lower confidence. Never adopt a candidate as truth. |

## Autonomy boundary
Confirm or flag only. **Never** rewrite a source/SME-supplied behavior to match your reading of the
code, and **never** resolve a code-vs-SME (or UI-vs-backend) conflict yourself — every conflict goes to
a human. When in doubt, flag and lower confidence.

## Feed the result forward
Verification outcomes set the **confidence score** and the `[unverified]` list the create skill
reports at delivery, and populate the **source-of-truth ledger** the review skill records.
