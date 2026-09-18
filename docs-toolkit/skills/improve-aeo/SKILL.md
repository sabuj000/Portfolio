---
name: improve-aeo
description: >-
  Audit and improve a page (or a whole site) for AEO/GEO — how well answer engines, RAG systems, and AI
  agents can find, retrieve, and correctly cite it. Harnesses crawl4ai's crawl-to-clean-Markdown logic to
  see the page the way a machine does, scores it across nine retrieval-readiness dimensions, returns
  prioritized fixes, and can emit a starter llms.txt. Works on any docs, marketing, or KB site — no
  company-specific content. Use whenever someone asks to make content "AI-ready", improve AEO/GEO, or get
  cited by ChatGPT/Perplexity/Claude/AI Overviews.
---

# improve-aeo

Make content answer-engine- and generative-engine-ready. AEO (Answer Engine Optimization) and GEO
(Generative Engine Optimization) are the same core problem: a machine has to **find** your page,
**retrieve the right chunk**, and **cite it correctly**. This skill audits a page the way a machine sees
it and returns concrete fixes — it never rewrites silently and never invents facts.

This is the create/fix counterpart to the browser **AI-readiness checker**: it scores the same
dimensions, plus a crawl and a whole-site variant so you can audit content you don't have the raw source
for. It reuses `shared/metadata.md` for the metadata/schema/personalization guidance.

## 0) Config (optional)
If a `project-profile.md` exists, read it for the product name, canonical field names, and style so fixes
match house conventions. This skill also runs standalone on any URL — no profile required.

## 1) Inputs
One of:
- **A URL** (single page) — the common case.
- **A site / sitemap URL** — audit many pages and roll up (the crawl variant).
- **Pasted content** (Markdown/HTML) — when there's no reachable URL.

Also capture the **goal** (e.g. "get cited for our pricing questions", "rank in AI Overviews for X") so
recommendations are prioritized against real queries. If nothing is given, ask for a URL — don't invent one.

## 2) See the page the way a machine does (harness crawl4ai)
Answer engines don't read your rendered page; they read a stripped, chunked, text version of it. Reproduce
that view before judging it — a page that looks fine in a browser can be nav-and-boilerplate to a crawler.

**With [crawl4ai](https://github.com/unclecode/crawl4ai)** (open-source, runs locally at zero cost — it is
the crawl engine, not a dependency of this skill):

```bash
pip install -U crawl4ai && crawl4ai-setup     # one-time
```

```python
# single page → LLM-ready Markdown (this is what a retriever ingests)
import asyncio
from crawl4ai import AsyncWebCrawler
async def main():
    async with AsyncWebCrawler() as c:
        r = await c.arun(url="https://example.com/docs/page")
        print(r.markdown)        # cleaned, boilerplate-stripped body
        print(r.metadata)        # <title>, description, og/schema tags it found
        print(r.links)           # internal/external links for the graph check
asyncio.run(main())
```

For a **whole site**, crawl the sitemap or use crawl4ai's deep-crawl to collect each page's `markdown`,
then run the per-page audit (step 4) over the set. Cache results so re-audits are cheap.

**Without crawl4ai** (or on a page you can only paste): work from the pasted Markdown/HTML, or fetch and
strip nav/footer/scripts yourself. The audit logic below is identical — crawl4ai just automates getting the
machine-eye view at scale. Never audit the pretty rendered page alone; audit the extracted text.

Note what the crawl reveals before scoring: content that only appears after JS, body drowned in
navigation, or a near-empty `markdown` are themselves top findings — a machine sees what crawl4ai sees.

## 3) Fetch the machine signals
From the crawl (or the raw HTML), record what answer engines key on:
- `<title>` and `meta description`.
- Frontmatter fields (if source Markdown) or `<meta>`/Open Graph tags.
- JSON-LD structured data (`application/ld+json`, `@type`, `schema.org`).
- Heading outline (H1–H4), link graph (internal + external), images/alt, code fences.
- Whether a root `llms.txt` and/or `robots.txt` exist and what they allow.

## 4) Score the nine dimensions
Grade each 0–100 with specific evidence, then weight into an overall score. These mirror the AI-readiness
checker exactly, so a page authored to `shared/quality-checklist.md` passes by construction.

| # | Dimension | Weight | What earns a high score |
|---|---|---|---|
| 1 | **Structure & chunkability** | 20 | Clear H1; H2/H3 sections; no section over ~350 words. Retrieval chunks on headings — a wall of text can't be chunked. |
| 2 | **Self-locating headings** | 20 | Headings name their subject ("Configure webhooks in *Product*"), not generic ("Overview", "Details"); no duplicates. Generic headings collide at retrieval time. |
| 3 | **Chunk independence** | 15 | Sections stand alone; no deictic references ("as mentioned above", "this feature", "the section below") that break a lifted chunk. |
| 4 | **Answerability** | 12 | A 1–2 sentence lead answers "what is this / what will I do" before the first H2; task/question-shaped headings ("How do I…", "Create a…") that match how people and AI ask. |
| 5 | **Links & references** | 15 | Descriptive link text (the destination's name, not "click here"); no dead-end "see the documentation" without a link; related concepts linked so answers can chain. |
| 6 | **Freshness & tense** | 10 | Present tense, dateless behavior ("the API returns", not "as of last year" / "recently" / "will soon"). Time-relative phrasing ages badly in an index. |
| 7 | **Media & code** | 5 | Every image has alt text; every code fence has a language label. Machines can't read unlabeled media. |
| 8 | **Metadata, schema & personalization** | 16 | Frontmatter (`description`, `type`, `product`, `version`, `audience`, `keywords`); JSON-LD (`TechArticle`/`HowTo`/`FAQPage`/`APIReference`); personalization signals (`sdk`/`plan`/`region` or per-language variants). Apply `shared/metadata.md`. |
| 9 | **Findability & llms.txt** | 12 | Page is crawlable (`robots.txt` doesn't block it); a canonical URL; a root `llms.txt` points agents at the right pages; a sitemap lists it. This is the discovery layer — a perfect page that agents can't find scores zero here. |

Overall = weighted average. Report a per-dimension breakdown, not just a number.

> Dimensions 1–8 match the browser checker's weights; **9 (Findability & llms.txt)** is added here because a
> crawl can see discovery signals a single pasted page can't. If you only have pasted text, mark 9
> `not assessed` rather than guessing.

## 5) Return prioritized fixes (never rewrite silently)
Group findings by impact, each as an **exact, apply-ready change**:
- **Must fix** — blocks retrieval or citation: no H1, unchunkable wall of text, blocked in `robots.txt`, no
  description, JS-only content a crawler can't see.
- **Should fix** — degrades precision: generic/duplicate headings, deictic chunks, missing schema, thin
  metadata, no lead summary.
- **Nice to have** — polish: alt text, code-fence languages, descriptive link text, an `llms.txt`.

For each finding give: the dimension, the evidence (the offending heading/line/missing field), and the
concrete fix (the rewritten heading, the frontmatter block to add, the JSON-LD snippet). Show the before/after.
Never fabricate a `version`, `audience`, or fact the page doesn't support — flag it `[unverified]` instead.

## 6) Emit artifacts
Offer to produce, from the audit:
- A **starter `llms.txt`** for the site root (title, one-line summary, curated page list grouped by
  section, optional Instructions) — the same output as the llms.txt generator, so agents retrieve the right
  pages. Keep it honest: list only pages that exist.
- **Ready-to-paste frontmatter + JSON-LD** for each audited page.
- A **site rollup** (for the crawl variant): a table of URL · overall score · top-2 fixes, sorted worst-first,
  so the owner fixes the highest-impact pages first.

## 7) Summarize
Return the overall score, the per-dimension breakdown, the prioritized fix list, any generated artifacts, and
what to re-audit after fixes land. If the crawl was blocked or the page was JS-only/empty to a crawler, say so
plainly — that's the finding, not a footnote.

## Rules
- Audit the **extracted/crawled text**, not the rendered page alone — that's what the machine ingests.
- **AEO and GEO share this checklist**; don't treat them as separate work.
- Recommend only; never edit, commit, or publish unless explicitly asked.
- Never invent metrics, versions, audiences, or links — missing → `[unverified]` / `TODO`.
- crawl4ai is optional and runs locally; the skill degrades gracefully to pasted content without it.
