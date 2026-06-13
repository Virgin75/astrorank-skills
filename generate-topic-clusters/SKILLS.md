---
name: generate-topic-clusters
description: Use this tool when user explicitly asks to create or update their topic clusters.
---

Your goal is to create/update the topic_clusters.html file in current directory. You must infer the most relevant topics or subtopics, no need to go into the pillar pages granularity.
There is no skill files for this skill. Please refer to the "How to find relevant info about the user's company" section.

# What is are Topic Cluster in SEO
Topic clusters are an SEO strategy that organizes related content around a central theme to establish topical authority. The model relies on three key components:
- Pillar Page: A comprehensive, high-level guide on a core topic.
- Cluster Pages: Focused articles diving deep into specific subtopics.
- Internal Links: Hyperlinks connecting the clusters back to the pillar.
This structured architecture helps search engines parse semantic relevance, signaling expertise and boosting rankings for both broad and long-tail keywords.

# How to find relevant info about the user's company
Analyse the every files in the current directory knowledge folder to gather more info about the user company. If this is not enough, check the settings.json file in current directory: you might find in there the user company website. You can fetch the URL of the website to gather additional intelligence on the company. 

# Expected output
The expected output is an html page in current directory: topic_clusters.html.
The page must be really simple, no head tags, nothing fancy. Just html tags and body tags with the main topic and their sub-topics.
In this page we must see the main topic clusters the company need to write about on its blog (let's call this a node). Every node might have sub topics (also nodes). The parent/child relation must be displayed visually.
Each node only have a title, that's it.

# Critical design references
The following design references are critical to follow:
- Each node must have a bg-color : rgba(6,182,212,0.12)
- Each node text-color must be #0e7490 in bold
