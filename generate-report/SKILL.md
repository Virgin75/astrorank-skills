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

Charts are drawn by **Chart.js** into `<canvas>` elements via the
**`AstrorankCharts`** helper (defined in `base.html`), which bakes in the neon
theme. You only pass **values** (labels + data arrays + captions) — you never
compute SVG geometry, never write Chart.js configs, never restyle anything.

`base.html` is kept SMALL and LLM-friendly: its `<script>` block holds only the
literal placeholder `/*__CHART_JS_INLINE__*/`. The real ~200 KB Chart.js
library lives in `chart.umd.min.js` (a sibling file you **never open**). At the
very end of the workflow you run `inline-chart.js`, which mechanically replaces
that placeholder in your written report with the library — making the file
self-contained for the sandboxed `srcdoc` iframe. Never inline the library by hand.

**Core principle: the templates are fixed. You fill them with data; you never
redesign them, never add sections, never add a report title.**

## Inputs

You receive, in the prompt:
- **Report path** — the output file to write (e.g. `reports/<id>/<date>.html`).
- **Report description** — what the report is about (context only; do NOT render it as a title).
- **Tools to use** — MCP servers/connectors to fetch the real values.

The data structure lives at `reports/<id>/data.json` (sibling of the output dir). This file already exists, do not try to create it. If it does not exist, just stop and inform the user.

## data.json schema

This file already exists, read it first based on the report path you are given.
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
   the `how_to_get` instructions. Charts need actual data points (a labels
   array + a numbers array); metrics need an actual value. Never output a
   template with its sample/placeholder data.
3. **Start from `templates/base.html`** — copy it to the report path using a
   bash file copy (e.g. `cp`). It is SMALL (~7 KB): `<style>` (the only CSS),
   the `<script>` with the `/*__CHART_JS_INLINE__*/` **placeholder** (do NOT
   touch it), the `AstrorankCharts` helper, and the `.report-grid` container.
   Never open or read `chart.umd.min.js`.
4. **Render each item** with its matching template (`templates/<type>.html`),
   filling in ONLY the placeholders named in the template's top comment:
   - metric / table: the visible text fields.
   - bar / line: `labels` array, `data` array, `xLabel`, `yLabel`.
   - pie: `labels` array, `data` array, `totalText`, `totalSub`.
   The chart call is one line, e.g. `AstrorankCharts.bar("bar1", {...})`.
   **Each `<canvas id>` must be unique within the report** — if you add a
   second chart of the same type, rename the id (e.g. `bar2`) and pass that
   same id to the helper call.
5. **Assemble**: place every rendered `.card` inside `.report-grid`, in the
   same order as `data.json`'s keys (metrics → bar_charts → pie_charts →
   line_charts → table). Remove the two example cards from `base.html`.
6. **Write** the complete HTML (still containing the placeholder) to the report path.
7. **Final step — inline the library.** Run exactly this, substituting your
   report path:
   ```
   node generate-report/templates/inline-chart.js reports/<id>/<file>.html
   ```
   It replaces `/*__CHART_JS_INLINE__*/` in the written file with Chart.js
   (from `chart.umd.min.js`) and prints the byte count. **Do this LAST**, after
   all edits. Do NOT edit the report again afterward (that would overwrite the
   splice). Until you run this, the charts will not render.

## Template reference

All templates live in `templates/` next to this file.

| file | renders | width class |
|------|---------|-------------|
| `base.html` | document shell + shared `<style>` + Chart.js **placeholder** + `AstrorankCharts` helper + grid | — |
| `metric.html` | headline number card | `card` (narrow) |
| `bar-chart.html` | vertical bars (Chart.js) | `card span-2` |
| `pie-chart.html` | donut + legend (Chart.js) | `card` |
| `line-chart.html` | trend line + area (Chart.js) | `card span-2` |
| `table.html` | data table | `card span-2` |
| `chart.umd.min.js` | Chart.js v4.4.3 library source (NEVER open/edit; consumed by `inline-chart.js`) | — |
| `inline-chart.js` | final-assembly script: splices the library into a report's placeholder | — |

Charts run via JavaScript inside a sandboxed iframe. The host app MUST render
the report with `<iframe sandbox="allow-scripts allow-same-origin">`
(`srcdoc` or `src` both work — the Chart.js library is inlined into the report
by `inline-chart.js`, so the page needs no network access).

## STRICT rules (violating any = failure)

- **NO report title, heading, intro, summary, or footer.** The `<body>` contains
  exactly one `.report-grid` and nothing else. Do not add `<h1>`, do not write
  the report description as a heading, do not add "Generated on …".
- **ONLY render items that exist in `data.json`.** No extra metrics, no extra
  charts, no "interesting" additions. If a key is absent or empty, it yields nothing.
- **Use the templates verbatim.** Keep their CSS classes, canvas structure,
  color palette, and the `AstrorankCharts.bar/line/doughnut` calls as written.
  You fill placeholders with data; you do not restyle, restructure, or "improve" them.
- **The `<style>` block appears exactly once**, from `base.html`. Never add a
  second `<style>`, never inline conflicting styles, never import external CSS.
- **Leave the `/*__CHART_JS_INLINE__*/` placeholder exactly as-is** in
  `base.html`. Do NOT replace it by hand, do NOT paste the library in, do NOT
  open `chart.umd.min.js`. The final workflow step (`inline-chart.js`) is the
  ONLY thing that touches it.
- **Chart calls must use the `AstrorankCharts` helper only.** Do NOT hand-write
  `new Chart(...)` configs, do NOT import a different charting library, do NOT
  add `<script src="...">` to any CDN. The only `<script>` tags in the page are
  the ones already in `base.html` plus the one-line calls inside each chart card.
- **Every `<canvas id>` is unique within the report.**
- **Run `inline-chart.js` as the LAST step** on the written report file, and do
  not edit the report afterward. Until you do, the placeholder remains and the
  charts will not render.
- **Self-contained.** No external images, fonts, or scripts. After the splice
  the page renders offline from inline content alone.
- **Every value is real data** fetched via tools. Never leave the sample/
  placeholder numbers (520, 3.4k, 1760, …) from the templates in the output.

## Retro-gaming theme tokens (already in base.html)

Do not change these; they match the host app (`renderer/styles/input.css`):
`--bg #080d1a`, `--surface #0c1322`, `--cyan #22d3ee`, `--cyan-bright #67e8f9`,
text `#e2e8f0` / muted `#94a3b8`, neon glow via `text-shadow`.
Chart palette: `--c1` cyan, `--c2` purple, `--c3` pink, `--c4` green, `--c5` amber,
`--c6` blue — applied **automatically** by `AstrorankCharts` to pie segments and
reused for bar/line series. You do not pass colors in the chart calls.

## Common mistakes

| mistake | fix |
|---------|-----|
| Added an `<h1>` report title or intro paragraph | Delete it. Only `.report-grid` belongs in `<body>`. |
| Left sample numbers from the template | Replace every value with fetched data. |
| Invented a chart not in `data.json` | Remove it. Only `data.json` items are rendered. |
| Hand-wrote a `new Chart(...)` config / added a CDN `<script src>` | Remove it; use the `AstrorankCharts.bar/line/doughnut` call from the template as-is. |
| Pasted the Chart.js library into `base.html` by hand / opened `chart.umd.min.js` | Revert `base.html` to the placeholder; run `inline-chart.js` at the end instead. |
| Forgot to run `inline-chart.js` (placeholder still in the report) | Run `node generate-report/templates/inline-chart.js <report>` as the final step. |
| Edited the report again after running `inline-chart.js` (overwriting the splice) | Re-run `inline-chart.js`; it is idempotent-safe only if the placeholder still exists — otherwise copy `base.html` fresh and redo. |
| Two charts share the same canvas id | Make each id unique (`bar1`, `bar2`, …) and pass it to the helper. |
| Duplicated the `<style>` block per card | One `<style>` in `<head>`, from `base.html`. |
| New chart "design" / custom colors | Revert to the template's exact markup and palette. |
