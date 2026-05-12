# Unit Economics & Monetization 📈

While the current version of AI Spend Audit operates as a free lead-generation tool, understanding the unit economics is crucial for the transition to a sustainable B2B SaaS model.

## 1. Operating Costs (COGS)

Currently, operating costs are kept extremely low by leveraging modern serverless and cloud DB free tiers.

| Resource | Service | Monthly Cost (Current) | Projected Cost (Scale: 10k users) |
| :--- | :--- | :--- | :--- |
| **Database** | MongoDB Atlas | $0 (M0 Sandbox) | $60 (M10 Dedicated) |
| **Backend/API** | Render (Web Service) | $0 (Free Tier) | $25 (Pro Tier) |
| **Email API** | Resend | $0 (3,000 emails/mo free) | $20 (50k emails/mo) |
| **LLM Inference** | OpenAI API (v2.0) | $0 (Not implemented) | ~$50 (using 4o-mini) |
| **Total** | | **$0.00/mo** | **~$155.00/mo** |

*Note: The cost to service a single free audit report is effectively $0.0001.*

## 2. Monetization Strategy

We plan to introduce a tiered business model once we have validated the core audit logic with 1,000 captured emails.

### Tier 1: The Free Audit (Lead Gen)
- **Features:** Manual entry form, basic savings calculation, 1 shareable report.
- **Price:** Free (requires email).
- **Goal:** Drive top-of-funnel awareness and capture qualified B2B leads.

### Tier 2: The "Pro" Dashboard (B2B SaaS)
- **Features:** 
  - OAuth integration with corporate accounting tools (Ramp, Brex, Expensify) to automatically ingest and track AI tool spend.
  - Team member management (mapping who is using what seat).
  - Monthly automated savings alerts.
- **Price:** $49/month or 10% of identified savings (Performance-based).
- **Goal:** Predictable MRR (Monthly Recurring Revenue).

## 3. Financial Projections (Year 1)

Assuming a transition to the Pro Dashboard model in Month 6:

- **Target Customer Acquisition Cost (CAC):** $15 (via programmatic SEO and LinkedIn organic reach).
- **Target Lifetime Value (LTV):** $588 (Assuming $49/mo with a 12-month retention rate).
- **LTV:CAC Ratio:** ~39:1 (Highly profitable, assuming organic channels hold strong).
