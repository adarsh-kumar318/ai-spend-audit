# Key Performance Indicators (KPIs) 📊

To measure the success and product-market fit of the AI Spend Audit MVP, we track the following core metrics. 

*Note: All event tracking is currently managed via lightweight, privacy-friendly analytics (e.g., Plausible or PostHog).*

## 1. The North Star Metric
**Total Identified Savings ($)**
- **Definition:** The cumulative dollar amount of potential savings our audit engine has successfully identified for all users.
- **Why it matters:** This directly quantifies the value our product brings to the world. If this number is high, our marketing copy writes itself.

## 2. Funnel Conversion Metrics

Tracking the user journey from landing to sharing:

| Metric | Target | Description |
| :--- | :--- | :--- |
| **Visit-to-Audit Rate** | 40% | Percentage of landing page visitors who click "Add Tool" and run the initial client-side calculation. (Target is high because the form is immediately accessible). |
| **Audit-to-Email Rate** | 20% | Percentage of users who, after seeing the calculated savings number, input their email to receive the full detailed report. |
| **Email Deliverability** | 99% | Tracked via Resend API to ensure reports are not hitting spam filters. |

## 3. Product-Led Growth (Virality) Metrics

Because this tool is designed to be shared internally within companies, we track viral coefficients:

- **K-Factor (Shares per Audit):** 
  - **Definition:** The average number of times a `/audit/:shareId` link is opened by a unique IP address *other* than the creator's IP.
  - **Target:** 1.5. (Meaning for every audit created, 1.5 other people at the company view it).

## 4. Operational Health Metrics

- **API Latency:** 
  - **Target:** `< 200ms` for the `/api/audit/create` endpoint.
- **Rate Limit Hits:** 
  - **Target:** Track 429 status codes. High spikes indicate potential bot activity or DDoS attempts on the email endpoint.
