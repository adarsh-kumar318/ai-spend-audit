# AI Spend Audit MVP

A full-stack MERN application that analyzes your AI tool subscriptions (ChatGPT, Claude, Copilot, etc.) and provides actionable cost-saving recommendations.

## Features
- Dynamic form to input current AI stack.
- Intelligent rule-based recommendation engine for downgrading, deduplicating, or optimizing seats.
- Dynamic fallback AI summary of savings.
- Email capture for full report delivery.
- Shareable URL (`/audit/:id`) hiding sensitive data.
- Rate-limited API protection.

## Setup
### Backend
1. `cd server`
2. `npm install`
3. Add `.env` with `MONGODB_URI=your_uri`
4. `npm run dev`

### Frontend
1. `cd client`
2. `npm install`
3. `npm start`
