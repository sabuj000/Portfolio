<!-- Template: API / CLI reference for one operation. Fill only from the spec/code — never invent. -->
<!-- Frontmatter fields per project-profile.md + shared/metadata.md. -->
---
title: <Operation name>
description: <one-line summary of what the operation does>
type: reference
product: <Product>
version: <API version — critical>
audience: developer
keywords: <resource, method, endpoint>
# personalization: sdk/language variants of the samples
---

# <Operation name, e.g. Create a customer>

<One line: what the operation does and when to use it.>

`<METHOD> <path>`  ·  Auth: `<scheme>`  ·  Version: `<scope>`

## Parameters
| Name | Type | Required | Description |
|---|---|---|---|
| `<name>` | `<type>` | Yes/No | <what it is; allowed enum values if any> |

## Request example
```<language/curl>
<request using the documented params>
```

## Response
| Field | Type | Description |
|---|---|---|
| `<field>` | `<type>` | <what it returns> |

```json
<response sample including the documented fields, with correct wire types>
```

## Errors
- `<code>` — <when it happens and how to resolve>.

## Related
- <Links to related operations/objects, per your URL conventions.>
