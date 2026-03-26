# Graph-Based Data Query System

## Overview
This project converts structured business data into a graph and allows querying using natural language.

## Architecture
- Backend: Node.js + SQLite
- Frontend: React + Cytoscape
- LLM: Groq (LLaMA 3.1)

## Flow
1. User asks a question
2. LLM converts it into SQL
3. SQL executes on database
4. Results returned as natural language
5. Graph highlights related nodes

## Features
- Natural language querying
- Dynamic SQL generation
- Graph visualization
- Node highlighting
- Guardrails for domain restriction

## Challenges
- Handling LLM output formatting
- Graph layout complexity
- Mapping relational data to graph

## Future Improvements
- Better graph layout
- Full flow tracing (Order → Delivery → Payment)
- UI improvements