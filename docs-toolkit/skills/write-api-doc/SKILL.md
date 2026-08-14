---
name: write-api-doc
description: >-
  Create or update API / CLI / SDK reference documentation from an API spec (OpenAPI/Swagger) or the
  code that defines it, plus any brief or ticket. Produces endpoint/operation reference, parameters,
  request/response examples, and errors — grounded in the spec, not invented.
---

# Write API Doc

Owns the **structure** of API reference. Composes the shared modules. The API spec/code is the primary
source of truth — this doc type leans hardest on `shared/verify.md`.

Pipeline: `shared/ingest → extract (below) → shared/verify → draft (below) → shared/quality-checklist
→ shared/deliver`. Read `project-profile.md` first (esp. the API spec location).

## Extract from the spec/code
Per operation: path & method · summary/purpose · **parameters** (name, required/optional, type,
filters/operators, defaults) · **request body** · **response fields / returned resources** · **enums**
· **events/webhooks** · errors · auth · version scope. Pull real values from the spec — do not
paraphrase from memory.

## Verify (critical here)
Via `shared/verify.md`: every documented param/enum/field must exist in the spec/code (**no phantom
fields**); flag new public surface the spec adds but the draft omits; sample request/response fields and
types must match the schema; don't document internal/deprecated/hidden operations without intent.

## Draft (structure)
Follow `templates/api-doc.md` and `shared/style-guide.md`:
- Clear operation purpose first; then parameters, request example, response example, errors.
- Object/array field descriptions where the schema needs them; wire types exact (e.g. string amounts as
  strings). Cross-links use the profile's URL conventions; removed/renamed items not left linked.

## Finish
Self-review with `shared/quality-checklist.md` (common + **API reference** section), then
`shared/deliver.md` (confidence score; `[unverified]` list; links to register).
