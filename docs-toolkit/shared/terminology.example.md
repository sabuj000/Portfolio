# Terminology Reference (example)

Copy to `shared/terminology.md` and fill with **your** brand and product terms. The quality gate's
terminology check enforces this list across the whole touch-set (body, headings, frontmatter, nav, alt
text, links, emails/URLs). The **setup** skill can seed this by scanning your docs corpus.

## Critical brand misspellings (hard fail — never ship)
_List your brand name and its common corruptions. Any hit is an automatic FAIL._

| Wrong | Correct |
|---|---|
| `<Brandd>` / `<Brnad>` / `Brand ` (spaced) | `<Brand>` |
| `<brand>.co` / `<brnad>.com` | `<brand>.com` |

## Settled product/feature names
_The exact spelling and casing that must win over surrounding text._

| Correct form | Do not use |
|---|---|
| `<Product Name>` | `<Productname>` / `<Product-name>` |
| `<Feature Name>` | `<feature name variants>` |

## Casing & hyphenation traps
| Correct | Do not use |
|---|---|
| `<self-serve>` | `<selfserve>` |
| `<Add-on>` (or your house form) | `<addon>` / `<add on>` |

## Acronyms — always uppercase
`<API>` · `<SDK>` · `<CLI>` · `<JSON>` · `<CSV>` · `<...>`

## Concept pairs that must not be swapped
| Term | Not to be confused with | Why it matters |
|---|---|---|
| `<Term A>` | `<Term B>` | `<the distinction>` |

## Notes
- Prefer one settled form per term; record genuinely unresolved variants and pick a winner before publishing.
- Normalize invisible Unicode (non-breaking spaces, zero-width chars, soft hyphens) before matching —
  they hide brand typos from a naive search.
