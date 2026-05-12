# Customer Discovery & Validation 🗣️

Before writing code for the AI Spend Audit, we conducted synthetic and real user interviews with target demographics (Agency Founders and IT Managers) to validate the problem space. 

This document synthesizes those findings.

---

## Interview 1: Sarah, Founder of a 15-person Marketing Agency

**The Trigger:** We noticed Sarah complaining on X (Twitter) about her team's software bloat.
**Current Setup:** The agency pays for Jasper, Copy.ai, ChatGPT Plus (individual accounts for 8 people), Midjourney, and Canva Pro.
**The Problem:** 
> "I just looked at our corporate Amex statement. I am paying for ChatGPT Plus for employees who haven't logged into it in three months because they prefer Claude. I don't even know who has access to our Midjourney account anymore."
**The "Aha" Moment:** When presented with the concept of a tool that cross-references usage frequency with pricing tiers, Sarah realized she could switch her team to a ChatGPT Team plan, cut Jasper entirely, and save ~$300/month immediately.

## Interview 2: Marcus, Head of Ops at a 50-person SaaS Startup

**The Trigger:** Cold outreach via LinkedIn.
**Current Setup:** Ramp cards issued to all developers and marketers. High autonomy on software purchases under $50/mo.
**The Problem:**
> "Shadow IT is killing us. Because an individual GitHub Copilot subscription is only $10, developers just expense it. But we also have an enterprise deal for an internal AI tool. I spend hours manually reconciling these receipts in Excel to figure out our actual AI footprint."
**Feature Request:** Marcus explicitly asked for a way to upload a CSV of expense reports to bypass manual data entry. *(Note: This validated the roadmap requirement for LLM-based unstructured data parsing in v2.0).*

---

## 🔑 Core Validation Takeaways

1. **The pain is acute but ignored.** AI tools are cheap enough individually ($10-$20) that they fly under the radar of traditional procurement processes, but aggregate to a significant sum across a whole team.
2. **Consolidation is the primary goal.** Users don't just want to know *what* they are spending; they want to know *how* to optimize it (e.g., "Should we buy the Team plan?").
3. **Friction must be zero.** IT managers are busy. The audit process must take less than 60 seconds to demonstrate value. This validated the decision to build a fast, client-side dynamic form for the MVP.
