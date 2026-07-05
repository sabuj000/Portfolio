# Portfolio — maintenance rules

This repo is Sabuj Bandopadhyay's portfolio: an interactive multi-page site plus a README that
mirrors it, and machine-readable profile files for LLMs/agents.

## Keep surfaces in sync (IMPORTANT)

When updating the **site** (any of `index.html`, `impact.html`, `approach.html`, `vision.html`,
`leadership.html`, `experience.html`, `skills.html`, `work.html`, `styles.css`, `script.js`),
**ALWAYS update these in the same change** so no surface drifts:

- **`README.md`** — the GitHub landing page that mirrors the portfolio.
- **`llms.txt`** — the LLM-facing profile summary.

Also update when relevant:
- **`AGENTS.md`** — agent-facing profile (positioning, achievements, guidance).
- **`sitemap.xml`** — when a new page is added.

## Source of truth & honesty

- Canonical facts live in `README.md`, `llms.txt`, and `AGENTS.md`. Only reflect **real, provided**
  information — never fabricate metrics, titles, dates, or experience.
- Keep content **recruiter-friendly** (plain language); the terms `LLM`, `MCP`, `API`, `SDK`,
  `docs-as-code`, `AEO/SEO` are fine to keep.
- Positioning: a **problem-solver / builder**, hands-on leader, open to both **lead-IC and
  leadership** roles. Frame achievements as **problem → what I built → ROI**.

## Structure notes

- The site uses a **landing → detail** flow (summary cards on `index.html` link to detail pages via
  "Read more →"). When adding content, prefer **linking context** over repeating it.
- Metrics have a single home (**Impact Highlights**); other sections describe approach and link to it.
- Shared styling is in `styles.css`; shared behavior (theme, nav, search, reveal, counters) in `script.js`.
- The `.claude/skills/ats-resume/` skill generates JD-tailored ATS resumes from the canonical profile.
