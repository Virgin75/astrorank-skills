# How to research

Before drafting, gather everything you need to write a grounded, useful post.

## 1. Read local knowledge

Read every file under `knowledge/` in the current directory. This is the
primary source of truth about the company, product, voice, and any
topic-specific notes the user has prepared.

## 2. Check settings

Open `settings.json` in the current directory. If it contains a company
website URL, you may fetch it for additional context (about page, blog,
pricing, customers). Do not guess URLs — only fetch what is listed.

## 3. Topic clusters

If `topic_clusters.html` exists in the current directory, open it and locate
the node the user wants to write about. The surrounding nodes are candidates
for internal links.

## 4. External research (optional)

Only if local knowledge is insufficient, you may fetch the company website
directly referenced in `settings.json`. Do not fabricate statistics, quotes,
or studies. If a claim needs a source and you don't have one, leave a
`[TODO: source]` placeholder.

## 5. Capture notes

Keep a short research summary at the top of your scratch pad:
- Target keyword + search intent (informational / commercial / transactional)
- 3–5 key points the post must cover
- 2–3 internal link targets from the topic cluster
- Any product facts, names, or numbers that must appear
