---
name: keyword-research
description: Perform keyword research tasks by analyzing strategy context and generating keyword ideas using Google Keyword Planner
---

# Keyword Research Skill

You are performing a keyword research task. Follow these steps in order:

## Step 1: Analyze Context and Generate a Goal

Read and analyze the following files to understand what keywords have been researched before and what the current SEO strategy focus is:

- **Previous research tasks**: Read all `.json` files in the `research_tasks/` directory
- **Monthly SEO focus**: Read `monthly/YYYY-MM.md` (current month)
- **Weekly SEO focus**: Read `weekly/YYYY-Www.md` (current week)

Based on this analysis, generate a focused goal for this keyword research task. The goal should:
- Avoid duplicating what was already researched
- Define a clear target market and language (rotate them if user company has multiple ones)
- Align with the current monthly/weekly strategy focus
- Be specific enough to guide keyword discovery
- CRITICAL : The goal must be maximum 2 lines (80 words).

## Step 2: Update the Task File

Once you have the goal, update the task file by writing the goal to the `goal` field. The task file path is provided in the initial prompt or can be found as the most recent `.json` file in `research_tasks/`.

Update the JSON structure:
```json
{
  "session_id": "...",
  "goal": "Your generated goal here",
  "conclusion": ""
}
```

## Step 3: Find New Keyword Ideas

Use the `keyword_planner_get_keyword_ideas` tool to generate new keyword ideas based on the goal you just defined.

The tool requires:
- `seed_keyword`: Extract from your goal
- `target_country`: Use the target country identified from the goal in step 1.
- `target_language`: Use the target language identified from the goal in step 1.

## Step 4: Update Conclusion & strategy/keywords.csv

Two things to do (absolutely mandatory to do both otherwise this is not considerd as done): 

1. Save the conclusion: After completing the keyword research, update the task file's `conclusion` field with a summary of the findings, including:
- Number of keywords found
- Any notable patterns or insights
- CRITICAL : The conclusion must be maximum 2 lines (80 words).

2. Save the keywords found in strategy/keywords.csv respecting the file existing headers (do not forget to set the target country based on the research you performed).
- You must use the add_new_keywords tool to update the strategy/keywords.csv. Only this is valid: it will auto deduplicate entries.


