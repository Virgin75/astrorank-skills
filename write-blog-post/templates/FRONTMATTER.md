# Frontmatter template

Every blog post must start with this YAML block. Replace the placeholders.

```yaml
---
title: "Your Keyword-Rich Title (Under 60 Characters)"
description: "A compelling 150–160 character summary that includes the target keyword and earns the click."
keyword: primary-keyword-phrase
slug: your-keyword-rich-slug
date: YYYY-MM-DD
author: "Author Name"
tags:
  - tag-one
  - tag-two
status: draft
---
```

## Field rules

- `title` — under 60 characters so it isn't truncated in search results.
- `description` — 150–160 characters. Front-load the keyword, end with a benefit.
- `keyword` — the primary keyword the post targets (lowercase, spaces ok).
- `slug` — lowercase, hyphen-separated, no stop words, includes the keyword.
- `date` — ISO 8601 (YYYY-MM-DD). Use today's date unless told otherwise.
- `status` — `draft` until the user confirms it's ready.
- `tags` — 2–5 relevant tags; reuse tags already in use on the blog if known.
