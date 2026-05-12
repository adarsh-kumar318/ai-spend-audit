# Official AI Tool Pricing Data 💸

This document serves as the "single source of truth" for the hardcoded values used by the AI Spend Audit logic engine (`runAudit`). Keeping this document updated is critical to ensuring our financial recommendations are accurate.

*Last Updated: Q2 2026*

## Foundational LLMs

| Tool Name | Tier | Price / Mo | Billing | Seats Minimum | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ChatGPT** | Plus | $20.00 | User | 1 | Standard individual premium. |
| **ChatGPT** | Team | $25.00 | User | 2 | Minimum $50/mo. Includes shared workspace. |
| **Claude** | Pro | $20.00 | User | 1 | Individual premium. |
| **Claude** | Team | $30.00 | User | 5 | Minimum $150/mo. |
| **Gemini** | Advanced | $19.99 | User | 1 | Bundled with Google One AI Premium. |

## Coding Assistants

| Tool Name | Tier | Price / Mo | Billing | Seats Minimum | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GitHub Copilot** | Individual | $10.00 | User | 1 | |
| **GitHub Copilot** | Business | $19.00 | User | 1 | Organization-level policy management. |
| **Cursor** | Pro | $20.00 | User | 1 | Flat monthly fee. |

## Image & Video Generation

| Tool Name | Tier | Price / Mo | Billing | Seats Minimum | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Midjourney** | Basic | $10.00 | User | 1 | Limited fast GPU time. |
| **Midjourney** | Standard | $30.00 | User | 1 | 15hr fast GPU time. |
| **Runway** | Standard | $15.00 | User | 1 | Video generation. |

## Marketing & Copywriting

| Tool Name | Tier | Price / Mo | Billing | Seats Minimum | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Jasper** | Creator | $39.00 | User | 1 | AI Marketing copilot. |
| **Copy.ai** | Pro | $49.00 | User | 1 | Unlimited words. |

---

## Logic Engine Rules Mapping

The engine applies the following heuristic rules based on this data:

1. **The "LLM Overlap" Rule:** If a user has both *ChatGPT Plus* and *Claude Pro*, flag $20/mo in savings as redundant unless explicit distinct use-cases are provided.
2. **The "Team Consolidation" Rule:** If a company reports 3 individual *ChatGPT Plus* accounts ($60/mo), the engine suggests switching to *ChatGPT Team* for 2 seats ($50/mo) and sharing, or formalizing 3 seats on Team ($75/mo) for data privacy benefits (though this represents an *increase* in spend, it's flagged as an "Optimization/Security" alert).
3. **The "Infrequent Use" Rule:** Any tool marked "Rarely" or "Never" used has 100% of its price added to the "Immediate Savings" bucket.
