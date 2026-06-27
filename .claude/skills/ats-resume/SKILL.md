---
name: ats-resume
description: Generate an ATS-friendly, JD-tailored resume for Sabuj Bandopadhyay from his portfolio profile. Use when the user provides or pastes a job description (JD) and wants a tailored resume, CV, or job-application document. If no JD is provided, ask for it first. Pulls facts only from the canonical profile (never fabricates).
---

# ATS Resume Builder (Sabuj Bandopadhyay)

Turn a job description (JD) into a tailored, **ATS-friendly** resume built strictly from Sabuj's
real profile. Optimize for keyword match and recruiter readability without ever inventing facts.

## Inputs
- **JD (required):** the full job description text. If the user invoked this skill without a JD,
  ask them to paste it. Also accept (optional): target company, target title, location, seniority,
  and any constraints (e.g., "one page", "emphasize IC" / "emphasize leadership").
- If a JD URL is given instead of text, fetch it; if it can't be fetched, ask the user to paste the text.

## Source of truth (read these first — never fabricate)
Read these files from the repo root for the canonical facts, in this order of preference:
1. `AGENTS.md` — structured profile + positioning guidance
2. `llms.txt` — concise profile with links
3. `README.md` — fullest detail (achievements, leadership, experience, education)
4. The site pages (`impact.html`, `approach.html`, `leadership.html`, `experience.html`, `skills.html`, `work.html`) for extra detail and live artifact links.

If these files are unavailable, fall back to the **Canonical profile** section at the bottom of this file.

**Rule:** Only use experience, metrics, titles, dates, and skills that appear in these sources. If the
JD asks for something not in the profile, do NOT invent it — list it as a gap (see step 6).

## Process
1. **Get the JD.** If missing, ask for it. Confirm target title/company if not obvious.
2. **Analyze the JD.** Extract and note:
   - Exact job title and seniority (IC vs lead vs manager).
   - Must-have skills/tools, nice-to-haves, and domain (e.g., docs, API, DevRel, AI).
   - Responsibilities and outcomes the role cares about.
   - **ATS keywords** — the exact words/phrases an ATS would scan for (hard skills, tools, certifications, methodologies). Capture singular/plural and acronym+spelled-out forms (e.g., "API documentation", "OpenAPI", "docs-as-code", "knowledge base").
3. **Map profile → JD.** Pick the most relevant achievements and skills from the profile. Decide the
   framing (IC vs leadership) to match the JD — Sabuj is credible for both. Choose a truthful target
   title for the headline (e.g., "Documentation Manager", "Lead Technical Writer", "Documentation
   Lead", "Developer Experience / Docs") that matches the JD without overstating.
4. **Mirror keywords truthfully.** Use the JD's exact terminology in the Summary, Skills, and bullets
   wherever it's genuinely true for Sabuj. This is what drives ATS match. Never keyword-stuff or claim
   untrue skills.
5. **Draft the resume** using the template and ATS rules below. Reverse-chronological, quantified
   bullets (Action + Result), led by the most JD-relevant content.
6. **Report gaps honestly.** After the resume, give a short **Match Summary**: JD keywords covered,
   which experience was emphasized, and any **gaps** (JD requirements not in the profile) with a note
   on whether to address them (e.g., reframe, learn, or omit). Do not paper over gaps with invented content.
7. **Save outputs** (see Output section) and offer to refine or export to .docx.

## ATS formatting rules (strict)
- **Single column.** No tables, text boxes, columns, images, icons, charts, or symbols beyond plain hyphens.
- **No headers/footers.** Put contact info as plain text lines at the very top of the body.
- **Standard section headings**, in this order: `PROFESSIONAL SUMMARY`, `CORE SKILLS`,
  `PROFESSIONAL EXPERIENCE`, `EDUCATION`, and optional `CERTIFICATIONS` / `SELECTED WORK`.
- **Reverse-chronological** experience: `Job Title | Company | Location | MMM YYYY – MMM YYYY`.
- **Bullets** start with strong past-tense action verbs (Built, Led, Automated, Reduced, Scaled,
  Migrated, Designed) and include a **quantified result** where the profile provides one.
- Spell out an acronym once with the acronym in parentheses, then reuse the acronym (e.g., "Application
  Programming Interface (API)") — but only when the JD uses that style; otherwise keep common acronyms.
- Plain bullets (`-`), standard punctuation, no fancy unicode. Dates as `MMM YYYY`.
- Keep to **1–2 pages** of content. Lead with the most relevant role and achievements.
- Contact line must include: full name, target title, location, email, LinkedIn, portfolio URL.

## Output
Create a `resume/` folder in the repo (if missing) and write:
- `resume/Sabuj-Bandopadhyay-<Company-or-Role>.md` — the tailored resume in clean Markdown.
- A plain-text version `resume/Sabuj-Bandopadhyay-<Company-or-Role>.txt` is optional but helpful for
  copy-paste into ATS forms.
- If `pandoc` is available, offer to also generate a `.docx`:
  `pandoc resume/...md -o resume/...docx` (most ATS prefer .docx). Don't assume pandoc exists — check first.
Use a filename slug from the company or role (e.g., `...-Stripe-Docs-Lead.md`). Then show the resume
in chat and the Match Summary.

## Resume template
```
Sabuj Bandopadhyay
<Target Title matching the JD>
Bengaluru, India | sbtechwriter@gmail.com | linkedin.com/in/sabujbandopadhyay | sabuj000.github.io/Portfolio

PROFESSIONAL SUMMARY
<3–4 lines tailored to the JD: who he is, years, the 2–3 most relevant strengths and a headline metric,
framed (IC vs leadership) to match the role. Mirror the JD's core keywords truthfully.>

CORE SKILLS
<Comma- or bullet-grouped skills, led by the JD's must-haves that are true for Sabuj. Pull from the
profile skills: docs-as-code, API/SDK documentation, AI/automation, analytics, etc.>

PROFESSIONAL EXPERIENCE
Documentation Manager | Chargebee | Bengaluru, India (Remote) | Apr 2023 – Present
- <Most JD-relevant achievement, quantified>
- <Next…>
Senior Technical Writer | Chargebee | Jan 2022 – Apr 2023
- <…>
Technical Writer | Chargebee | Aug 2021 – Dec 2021
- <…>
Technical Writer | Capillary Technologies | Aug 2020 – Aug 2021
- <…>
Technical Writer | Netradyne | Apr 2019 – Jul 2020
- <…>
Technical Writer | Alternative Minds | May 2017 – Apr 2019
- <…>
QA Tester | FreeBalance | Sep 2014 – Apr 2017
- <…>
(Condense or drop older roles to fit 1–2 pages and the JD's relevance.)

EDUCATION
Master of Computer Applications (MCA), Information Technology — West Bengal University of Technology, Kolkata (2012)
Bachelor of Computer Application (BCA), Information Technology — West Bengal University of Technology, Kolkata (2009)

SELECTED WORK (optional, if JD values portfolio)
- Live documentation artifacts and video walkthroughs: sabuj000.github.io/Portfolio/work.html
```

## Final QA checklist (run before delivering)
- [ ] Every claim/metric is traceable to the profile sources (no fabrication).
- [ ] JD must-have keywords appear naturally in Summary/Skills/bullets where true.
- [ ] Single column; no tables/images/headers-footers; standard headings; plain bullets.
- [ ] Reverse-chronological; consistent `MMM YYYY` dates; quantified bullets.
- [ ] 1–2 pages; most JD-relevant content first; framing (IC vs leadership) matches the JD.
- [ ] Match Summary included with honest gaps.

---

## Canonical profile (fallback facts — use only if the repo files are unavailable)

**Contact:** Sabuj Bandopadhyay · Bengaluru, India · sbtechwriter@gmail.com ·
https://in.linkedin.com/in/sabujbandopadhyay · https://sabuj000.github.io/Portfolio/

**Positioning:** Documentation problem-solver and builder; hands-on leader ("player-coach"); data-driven;
open to both lead individual-contributor and people-leadership roles. 10+ years in technical writing,
API documentation, and knowledge management; 3+ years leading documentation.

**Achievements (problem → build → ROI):**
- Built autonomous AI agents that analyze new & existing support tickets in bulk to proactively fix doc gaps → lower ticket volume and front-line support cost.
- Built a documentation CLI (OpenAPI generation, scaffolding, sync, validation, preview) → 79% of API doc PRs authored by non-docs engineers; contributor base nearly doubled; no added headcount.
- Built multiple AI skills that draft/update feature docs from any source (Notion, Google Docs, PDF, Jira) → publishing time cut >50%.
- Runs a sustained pipeline of 30+ how-to & concept videos per month → faster onboarding and prospect evaluation.
- Migrated 1,800+ knowledge-base articles → engagement +12%, page views 2× (58K+), copy-fix requests −45%, 95% style compliance.
- Automated release notes/changelogs → ~8 hrs to ~15 min; API docs as single source of truth.
- PM-as-first-drafter publishing model → documentation SLA reduced ~50%.

**Leadership:** hands-on writing/ownership of features; data-driven monthly/quarterly performance tracking;
communicates up via weekly updates; delegates ownership; coaches; defines team growth paths; advocates for
the team; fixes root causes; cross-functional with Product, Go-to-Market, Marketing, Support, Engineering,
Design, and Developer Experience.

**Skills:** docs-as-code (Markdown, MDX, Git, GitHub workflows, CI/CD, OpenAPI, Postman); AI & automation
(prompt engineering, custom GPTs, AI skills/agents, Claude, GPT, Cursor, AI-ready/LLM-friendly content,
MCP-aware content); analytics (GA4, Pendo, FullStory, Looker Studio, Splunk, AI/LLM-crawl analytics);
visual/process (Mermaid, Figma, Camtasia, Trainn, SnagIt, ISO standards, document control, accessibility);
code (HTML, CSS, JavaScript ES6+, TypeScript working knowledge, JSON, XML).

**Experience:**
- Chargebee — Documentation Manager (Apr 2023–present), Senior Technical Writer (Jan 2022–Apr 2023), Technical Writer (Aug 2021–Dec 2021).
- Capillary Technologies — Technical Writer (Aug 2020–Aug 2021): user & API docs, OpenAPI/Postman, UML diagrams, video training.
- Netradyne — Technical Writer (Apr 2019–Jul 2020): guides, installation manuals, FAQs, release notes for a driving-monitoring device.
- Alternative Minds — Technical Writer (May 2017–Apr 2019): manuals, online help, release notes.
- FreeBalance — QA Tester (Sep 2014–Apr 2017): docs and testing for government financial portals.

**Education:** MCA, Information Technology (2009–2012) and BCA, Information Technology (2006–2009), West Bengal University of Technology, Kolkata.
