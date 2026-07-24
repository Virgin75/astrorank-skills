---
name: create-report-data-structure
description: Create a report data structure (json file). Trigger when user wants to create a new report in the Astrorank UI. Can only be triggered manually when specific skill is asked by user.
---

# 1st thing to do before continuing: 
Make sure you have all the following inputs:
- report_id or report_path so that you can write reports/<report_id>/data.json
- Report prompt : to know exactly what the report is about
- List of Connectors/tools to use for the report
If one of these 3 is missing, just ask the user, it is critical.

# What to do?
Inspect and use ALL the tools at your disposal (MCP servers, connectors, skills) to understand what data sources are available and how they work. Open and read any tool definitions or documentation you can find.
Your goal: create the file reports/<report_id>/data.json that defines the data structure for this report based on the report context sent by user.

# data.json file structure:
The JSON must contain one or more of the following top-level keys, each being a list:

"metrics": [{"name": "<metric name>", "how_to_get": "<which tool to use and how>"}, ...]
"bar_charts": [{"name": "<chart name>", "how_to_get": "<which tool to use>", "x_axis": "<x-axis description>", "y_axis": "<y-axis description>"}, ...]
"pie_charts": [{"name": "<chart name>", "how_to_get": "<which tool to use>", "labels": "<what segments represent>", "values": "<what values represent>"}, ...]
"line_charts": [{"name": "<chart name>", "how_to_get": "<which tool to use>", "x_axis": "<x-axis description>", "y_axis": "<y-axis description>"}, ...]
"table": [{"name": "<table name>", "how_to_get": "<which tool to use and how>", "columns": "<comma-separated list of column descriptions>"}, ...]

CRITICAL RULES (STRICT — violating any rule is a failure):
RELEVANCE: Only include a metric/chart/table if it is DIRECTLY implied by the user's report prompt above. Do NOT invent or add metrics, charts, or tables that the user did not ask for, even if a tool could provide them.
MINIMALISM: Prefer fewer, high-signal items over many. Hard caps per key: metrics ≤ 6 items, each chart type ≤ 4 items, table ≤ 3 items. Only add an item if removing it would make the report incomplete relative to the prompt.
TOOL-BACKED: Every item's "how_to_get" must name a SPECIFIC, AVAILABLE tool and the exact query/steps. If no available tool can retrieve the data, OMIT the item entirely — never include aspirational or speculative items.
NO DUPLICATES: Do not include two items that measure the same thing, and do not add a chart that merely restates a metric.
SPECIFICITY: "how_to_get" must be concrete (tool name + parameters/steps), not generic descriptions like "use search data".
SCOPE: Do not add top-level keys other than the five listed above. Do not add extra fields inside items beyond those shown in the spec.
VALIDITY: Output must be valid JSON with at least one of the five keys above (omit empty keys entirely — do not include a key with an empty list).
Write the final result as a JSON file to: reports/rpt_1784838281365_dz7bj8/data.json