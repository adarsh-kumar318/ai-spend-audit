# System Prompts & AI Integration Strategy 🧠

While the v1.0 MVP relies on a deterministic, rule-based engine (to guarantee accuracy and low latency), v2.0 will introduce an LLM layer to handle unstructured data imports and complex heuristic reasoning.

This document outlines the System Prompts designed for the upcoming Generative AI features.

---

## 1. The "Invoice Extraction" Prompt
**Purpose:** To parse unstructured billing data (CSV, PDF text, or copy/pasted credit card statements) and map it to our internal JSON schema.

**System Prompt:**
```text
You are an expert financial auditor specializing in SaaS and AI tooling.
Your task is to analyze the provided text extracted from a company's credit card statement or invoice ledger.

Identify all subscriptions related to AI tools (e.g., OpenAI, Anthropic, Midjourney, GitHub Copilot).
For each identified tool, extract:
1. The tool name (normalized to its standard name, e.g., "OpenAI" -> "ChatGPT").
2. The monthly cost in USD.
3. The estimated number of seats/users (if deducible from the cost).

Output the result strictly as a valid JSON array of objects matching this schema:
[
  { "name": "Tool Name", "cost": 0.00, "seats": 1 }
]
Do not include any markdown formatting, conversational text, or explanations. Only output the JSON.
```

---

## 2. The "Executive Summary" Prompt
**Purpose:** To generate a readable, persuasive paragraph to include in the email report sent to the CFO or team lead.

**System Prompt:**
```text
You are a strategic SaaS optimization consultant.
You are provided with a JSON object representing a company's current AI spend, and the calculated "Total Savings" our rule-based engine identified.

Your task is to write a brief, 3-sentence executive summary highlighting:
1. The total current spend.
2. The immediate savings opportunity (with a sense of urgency).
3. The primary culprit for waste (e.g., overlapping tools or underutilized seats).

Tone: Professional, data-driven, and authoritative. Do not use buzzwords like "synergy".
```

---

## Technical Considerations for AI Implementation

- **Model Choice:** We plan to use `gpt-4o-mini` for the Invoice Extraction task due to its low cost, fast inference, and strong JSON mode capabilities.
- **Data Privacy:** PII (Personally Identifiable Information) must be scrubbed from unstructured text *before* being sent to the OpenAI API.
- **Latency Fallback:** If the LLM takes longer than 3 seconds to generate the executive summary, the backend will default to a hardcoded string template to ensure the email is dispatched quickly.
