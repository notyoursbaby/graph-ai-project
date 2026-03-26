# Graph-Based Data Query System

## Overview
This project converts fragmented business data into a graph structure and enables querying using natural language.

## Architecture
- Backend: Node.js (Express)
- Frontend: React + Cytoscape
- LLM: Groq (LLaMA 3.1)
- Data: JSONL dataset (in-memory processing)

## Features
- Graph-based visualization of entities (Orders, Customers)
- Natural language query interface
- Dynamic data fetching
- Node highlighting based on query
- Guardrails for domain-specific queries

## System Flow
1. User enters a query
2. Backend processes query
3. Data is filtered from dataset
4. Response is returned
5. Graph highlights related nodes

## Setup Instructions

### Backend
cd src/server
npm install
node index.js


### Frontend

cd src/client
npm install
npm run dev


## Deployment
- Backend deployed on Render
- Frontend deployed on Vercel

## Future Improvements
- Advanced graph layouts
- Full entity relationships (Delivery, Payment, etc.)
- Improved UI/UX
- Better query understanding

- Used ChatGPT for:
- system design guidance
- debugging deployment issues
- API integration
- graph visualization setup

Iterative debugging was done to resolve:
- SQLite deployment errors
- API connectivity issues
- frontend rendering issues
