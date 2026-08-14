# Project Profile

The single config for this toolkit. Every skill reads it first, so the toolkit adapts to *your* setup
instead of hardcoding anyone's. Run the **setup** skill to generate this interactively, or copy this
file to `project-profile.md` and fill it in. Delete the _italic_ guidance as you go.

---

## Product & audience
- **Product name:** `<Your Product>`  _(exact customer-facing name + correct casing)_
- **One-line description:** `<...>`
- **Primary reader:** `<developers | admins | non-technical users>`
- **Docs base URL:** `<https://docs.yourproduct.com>`

## Docs repository (docs-as-code)
- **Repo:** `<git URL or path>`  ·  **Content path:** `<docs/ or content/>`
- **Format:** `<Markdown | MDX | AsciiDoc>`  ·  **PR base branch:** `<main>`
- **Link & asset rules:** _how internal links and image paths are written; any build link-allowlist._

## Sources of truth ("second SME")
_Where claims are confirmed. A claim is "verified" only if found here._
- **Primary (originates the doc):** `<the ticket/spec/SME text supplied per request>`
- **Code / implementation:** `<repo(s) + how to search — e.g. grep UI labels in locale files; flags/roles in backend config>`
- **API spec (API docs):** `<OpenAPI/Swagger path or URL, or the code that defines it>`
- **Product UI (labels/nav):** `<repo or app to confirm exact labels>`

## Components & frontmatter
_Skip the table if you write plain Markdown._
- **Format:** `<plain Markdown | MDX with components>`
- **Frontmatter fields (exact names + format):** `<e.g. title; description; keywords (comma string); draft (bool)>`
- **Component mapping:**

  | Purpose | Your component | Plain-Markdown fallback |
  |---|---|---|
  | Note/callout | `<...>` | `> **Note:** …` |
  | Warning | `<...>` | `> **Warning:** …` |
  | Table | `<...>` | pipe table |
  | Image | `<...>` | `![alt](src)` |
  | Tabs | `<...>` | one heading per tab |

- **Comment syntax:** `<e.g. {/* */} for MDX; never HTML comments>`

## House style
- **Base style guide:** `shared/style-guide.md` (Microsoft Writing Style Guide by default) — or your own.
- **English variant:** `<US | UK>`  ·  **UI verbs:** `<default click/select, or your own>`
- **Terminology file:** `shared/terminology.md`  ·  **Banned words:** `<seamless, streamline, powerful…>`

## Delivery
- **Deliver by:** `<open a PR | downloadable files | inline in chat>`
- **PR conventions:** `<branch naming, commit format, PR description block>`
- **Review model:** `<who reviews; what "done" means>`

## Guardrails
- Never publish customer names, emails, phone numbers, or record IDs.
- Never put internal ticket IDs, raw ticket quotes, or repo paths in the body.
- Generalize ticket-specific amounts/dates unless they're product constants.
