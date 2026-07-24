---
name: generate-report
description: Use when generating a report HTML file from a report's data.json structure — renders metrics, bar/pie/line charts, and tables into a single self-contained retro-gaming styled page using fixed templates.
---

# Generate Report

## Overview

Turn a report's `data.json` into one self-contained HTML file. `data.json`
declares **which** visualizations exist (metrics, bar/pie/line charts, tables)
and **how to fetch** each item's real data (`how_to_get`). This skill renders
each item using a **fixed HTML template** — one per type — and assembles them
into a single page styled in the project's retro-gaming theme.

**Core principle: the templates are fixed. You fill them with data; you never
redesign them, never add sections, never add a report title.**

## Inputs

You receive, in the prompt:
- **Report path** — the output file to write (e.g. `reports/<id>/<date>.html`).
- **Report description** — what the report is about (context only; do NOT render it as a title).
- **Tools to use** — MCP servers/connectors to fetch the real values.

The data structure lives at `reports/<id>/data.json` (sibling of the output dir).

## data.json schema

The object has up to five top-level keys; each is a list. Omitted/empty keys
produce no output. Every item has a `name` and a `how_to_get` (the tool + query
that returns the item's real data).

| key | item shape | renders |
|-----|-----------|---------|
| `metrics` | `{name, how_to_get}` | one headline number |
| `bar_charts` | `{name, how_to_get, x_axis, y_axis}` | vertical bar chart |
| `pie_charts` | `{name, how_to_get, labels, values}` | donut + legend |
| `line_charts` | `{name, how_to_get, x_axis, y_axis}` | trend line + area |
| `table` | `{name, how_to_get, columns}` | data table |

`columns` is a comma-separated list of column descriptions → one `<th>` each.

## Workflow

1. **Read `data.json`** from the report's directory.
2. **Fetch real data** for every item, using the tools named in the prompt and
   the `how_to_get` instructions. Charts need actual data points; metrics need
   an actual value. Never output a template with its sample/placeholder data.
3. **Start from `templates/base.html`** — copy it verbatim. It contains the
   complete `<style>` block (the only CSS) and the `.report-grid` container.
4. **Render each item** with its matching template (`templates/<type>.html`),
   filling in the fetched data. Each template's top comment names every field
   and gives the SVG geometry math.
5. **Assemble**: place every rendered `.card` inside `.report-grid`, in the same
   order as `data.json`'s keys (metrics → bar_charts → pie_charts → line_charts
   → table). Remove the two example cards from `base.html`.
6. **Write** the complete HTML to the report path.

## Template reference

All templates live in `templates/` next to this file.

| file | renders | width class |
|------|---------|-------------|
| `base.html` | document shell + shared `<style>` + grid | — |
| `metric.html` | headline number card | `card` (narrow) |
| `bar-chart.html` | vertical bars (SVG) | `card span-2` |
| `pie-chart.html` | donut + legend (SVG) | `card` |
| `line-chart.html` | trend line + area (SVG) | `card span-2` |
| `table.html` | data table | `card span-2` |

Charts are pure SVG — **no JavaScript anywhere**. The report renders inside a
sandboxed `<iframe sandbox="allow-same-origin">`; scripts will not execute.

## STRICT rules (violating any = failure)

- **NO report title, heading, intro, summary, or footer.** The `<body>` contains
  exactly one `.report-grid` and nothing else. Do not add `<h1>`, do not write
  the report description as a heading, do not add "Generated on …".
- **ONLY render items that exist in `data.json`.** No extra metrics, no extra
  charts, no "interesting" additions. If a key is absent or empty, it yields
  nothing.
- **Use the templates verbatim.** Keep their CSS classes, SVG structure, glow
  filters, color palette, and geometry. You fill placeholders with data; you do
  not restyle, restructure, or "improve" them.
- **The `<style>` block appears exactly once**, from `base.html`. Never add a
  second `<style>`, never inline conflicting styles, never import external CSS.
- **No `<script>` tags. Ever.** Charts are pure SVG/HTML+CSS.
- **Self-contained.** No external images, fonts, or CDNs. The page is loaded via
  `iframe srcdoc` and must render offline from inline content alone.
- **Every value is real data** fetched via tools. Never leave sample/placeholder
  numbers (520, 3.4k, etc.) in the output.

## Retro-gaming theme tokens (already in base.html)

Do not change these; they match the host app (`renderer/styles/input.css`):
`--bg #080d1a`, `--surface #0c1322`, `--cyan #22d3ee`, `--cyan-bright #67e8f9`,
text `#e2e8f0` / muted `#94a3b8`, neon glow via `text-shadow`/SVG `feGaussianBlur`.
Chart palette: `--c1` cyan, `--c2` purple, `--c3` pink, `--c4` green, `--c5` amber,
`--c6` blue — used in this order across pie segments / bar series.

## Common mistakes

| mistake | fix |
|---------|-----|
| Added an `<h1>` report title or intro paragraph | Delete it. Only `.report-grid` belongs in `<body>`. |
| Left sample numbers from the template | Replace every value with fetched data. |
| Invented a chart not in `data.json` | Remove it. Only `data.json` items are rendered. |
| Added a `<script>` for charting | Remove it; use the SVG templates as-is. |
| Duplicated the `<style>` block per card | One `<style>` in `<head>`, from `base.html`. |
| New chart "design" / custom colors | Revert to the template's exact markup and palette. |
