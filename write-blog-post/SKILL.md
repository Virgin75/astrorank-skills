---
name: write-blog-post
description: Use this skill when the user explicitly asks to write, draft, or create a blog post. It researches the topic, structures the article, and produces a polished Markdown draft following SEO and readability best practices.
---

Your goal is to produce a high-quality blog post in Markdown for the user's company blog. Before writing, gather context using the steps in `research/HOW_TO_RESEARCH.md`. Follow the structure described in `templates/STRUCTURE.md` and the writing rules in `templates/STYLE_GUIDE.md`.

# Workflow

1. **Understand the brief.** Ask (or infer) the target topic, audience, tone, target keyword, and desired length. If the user gave a topic cluster file (`topic_clusters.html`), pick the node they reference.
2. **Research.** Read the files under the `knowledge/` folder in the current directory and, if needed, fetch the company website from `settings.json`. See `research/HOW_TO_RESEARCH.md`.
3. **Outline.** Produce an H2/H3 outline and confirm it lines up with the target keyword and search intent. See `templates/STRUCTURE.md`.
4. **Draft.** Write the post in Markdown following `templates/STYLE_GUIDE.md`. Use `templates/FRONTMATTER.md` for the metadata header.
5. **Review.** Self-check against `research/CHECKLIST.md` before handing the file back.

# Expected output

A single Markdown file in the current directory named after the post slug, e.g. `how-to-rank-for-long-tail-keywords.md`. The file must include YAML frontmatter (title, description, keyword, slug) followed by the body.

# Critical rules

- Always ground claims in the research; never invent stats, quotes, or sources.
- Keep paragraphs under 4 sentences. Vary sentence length.
- Use H2 and H3 headings for structure. Never skip heading levels.
- One idea per paragraph. No filler intros ("In today's fast-paced world...").
- Link to at least 2 other relevant pages on the company site when possible.
