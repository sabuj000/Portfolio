# Shared module: Quality checklist (the single gate)

The one quality gate. **Create** skills run it as a self-review before delivery; **review-doc** runs it
against a draft or PR. Apply the common section always, plus the section for the doc type.

## Common (every doc type)
- [ ] **Factual parity** — every claim traces to a source (`shared/verify.md`); unverifiable claims are
      marked `[unverified]`, not guessed.
- [ ] **Structure & format** — matches the doc-type template; frontmatter/components valid per
      `project-profile.md`; no HTML comments in MDX.
- [ ] **Retrieval-readiness** (`shared/style-guide.md`) — self-locating headings; one intent per
      section; prerequisites before steps; no deictic "above/below"; present tense.
- [ ] **Style** — house voice, click/select verbs, imperative headings, chosen English variant, no
      marketing fluff, bias-free, descriptive link text.
- [ ] **Links & assets** — internal links resolve per profile rules; new links flagged for any build
      allowlist; images exist and depict what the step says.
- [ ] **Safety** — no customer PII, internal ticket IDs, raw quotes, repo paths, or draft scaffolding
      in the body.
- [ ] **Terminology** — run the check below across the *full touch-set*.

## Terminology check
Read `shared/terminology.md`. For **every file the change touches** (body, headings, frontmatter,
nav/index, alt text, link labels, `mailto:`/URLs — not just the body): brand and settled product names
match exactly; reject "do not use" variants; normalize invisible Unicode before matching. Result:
`Terminology: PASS | FAIL`. A FAIL blocks delivery/approval until fixed.

## By type
**API reference** — operations/params/enums/response fields match the spec (no phantom fields); request/
response samples use the documented fields with correct types; removed/renamed items not left linked;
version scope correct.

**User / product doc** — prerequisites & gating present and placed before steps; exact UI labels & nav
paths; feature-interaction notes correct; steps deterministic with a checkable final outcome.

**KB / help article** — question-based title (≤ ~80 chars) naming the feature (not just a symptom);
Problem → Solution → Important notes order; metadata matches *this* article (no stale/borrowed SEO); no
invented "related articles"; gating at top of Solution.

**Use-case / implementation** — the end-to-end flow is complete and ordered; each step names its
prerequisites and the system/role acting; success criteria stated; failure/rollback paths covered.

**Release notes** — release status correct (GA vs beta/early-access vs phased); audience/type tags
right; benefit stated; no root-cause/implementation detail for bug fixes; heading names the change.

## Depth guardrail
Before finishing a large change, ask: did I verify against the source (not just the diff/draft)? Did I
read full files, not only hunks? Would a reader be misled by any remaining mismatch? If any answer is
no, keep going.
