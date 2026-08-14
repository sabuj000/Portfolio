# Docs-as-Code Documentation Toolkit

Reusable AI **skills** for teams that write product documentation as code. Point them at your own
product, repo, and sources, and they **create** and **review** high-quality docs from any input —
Word, PDF, Notion export, Jira ticket, Google Doc, or pasted text.

Works with any AI assistant that reads Markdown "skills" (a `SKILL.md` it follows) — e.g. Claude Code
or a similar tool.

> Ships **zero company-specific content**. Everything about *your* product, repo, sources, components,
> and style lives in one file — `project-profile.md` — which the interactive **setup** skill builds
> for you. Nothing is hardcoded.

## Design in one picture

```
                       ┌─────────────────────────────┐
   your source ─────►  │   docs  (orchestrator)      │
 (Word/PDF/Notion/     │  detect → classify → route  │
  Jira/GDoc/text)      └───────────────┬─────────────┘
                                       │  picks one create skill
        ┌──────────────┬───────────────┼───────────────┬──────────────┐
   write-user-doc  write-kb-article  write-api-doc  write-usecase  write-release-notes
        └──────────────┴───────────────┼───────────────┴──────────────┘
                                       │  every create skill composes the SAME shared modules
        shared/ingest → shared/verify → (doc template) → shared/quality-checklist → shared/deliver
                                       │
                                 review-doc  ◄── uses the SAME quality-checklist to review a draft or PR
```

The point: **one pipeline, shared logic.** Create skills are thin — they only own their doc-type
*structure*. Ingestion, verification, the quality gate, and delivery are written once in `shared/` and
reused by every skill (create and review). That keeps it consistent and easy to extend.

## What's inside

```
docs-toolkit/
  project-profile.example.md      copy → project-profile.md (or let setup build it)
  setup/SKILL.md                  interactive: builds project-profile.md by asking you questions
  shared/
    ingest.md                     format-agnostic source loading (Word/PDF/Notion/Jira/GDoc/text)
    verify.md                     "second SME" — verify claims against your source of truth, by role
    quality-checklist.md          the single quality gate (create self-review AND review-doc use it)
    style-guide.md                generic house style + retrieval-readiness rules
    terminology.example.md        your brand/product terms that must not be misspelled
    deliver.md                    delivery options (open a PR / files / inline)
  skills/
    docs/SKILL.md                 orchestrator (entry point)
    write-user-doc/SKILL.md       feature overviews, how-to & step-by-step guides
    write-kb-article/SKILL.md     question-based help/KB articles from resolved issues
    write-api-doc/SKILL.md        API/CLI reference from a spec or code
    write-usecase-doc/SKILL.md    end-to-end use-case / implementation guides
    write-release-notes/SKILL.md  release notes / changelog / "what's new"
    review-doc/SKILL.md           review a draft or PR against the quality gate
  templates/                      one starting template per doc type
```

## Principles (why the output is trustworthy)

1. **No invention.** Every claim traces to a source you provide; anything unverifiable is marked
   `[unverified]` for a human, never guessed.
2. **Verify against a source of truth.** Docs are checked against the real implementation (spec/code/
   tickets), not just written to read well.
3. **Retrieval-ready.** Structured for humans *and* AI assistants (search, RAG, in-product AI):
   self-locating headings, one intent per section, prerequisites before steps.
4. **Interactive & self-serve.** `setup` builds your profile; skills confirm type/product/audience and
   ask when a fact is missing.
5. **Review never rewrites.** The review skill only reports findings.

## Getting started

1. Run **setup** — it interviews you and writes `project-profile.md` (and starts `shared/terminology.md`).
2. Install `skills/` where your AI assistant looks for skills.
3. Say "write a doc from this…" or "review this PR…" — the `docs` orchestrator takes it from there.

## License

A community template. Adapt freely for your own docs-as-code workflow.
