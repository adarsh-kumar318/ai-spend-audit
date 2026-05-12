# AI Spend Audit 💰🤖

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

> **Stop paying for AI subscriptions you don't use.** AI Spend Audit is a full-stack web application designed to help businesses, agencies, and individuals analyze their AI SaaS stack and uncover actionable cost-saving insights.

## Why This Matters
As the AI tooling landscape explodes, teams are rapidly accumulating overlapping subscriptions (ChatGPT Plus, Claude Pro, GitHub Copilot, Midjourney, etc.). Without centralized visibility, "SaaS sprawl" leads to thousands of dollars in wasted annual spend. AI Spend Audit fixes this by ingesting your current toolset and cross-referencing it with a rule-based engine to identify:
- **Underutilization:** Finding seats that can be downgraded.
- **Deduplication:** Consolidating overlapping tools (e.g., dropping Jasper if you have ChatGPT Team).
- **Consolidation:** Moving from individual Pro accounts to Team/Enterprise accounts.

---

## 🚀 Key Features

1. **Intelligent Audit Engine:** A rule-based logic system analyzing individual vs. team pricing and overlapping features.
2. **Frictionless Onboarding:** A dynamic UI for inputting current AI tools, employee count, and usage frequency.
3. **Secure & Anonymous:** All financial data is generated and stored securely with a unique, unguessable Share ID. Emails are captured *only* if the user requests the full report, keeping the audit itself frictionless.
4. **Shareable Reports:** Generate a secure link (`/audit/:id`) to share savings projections with your CFO or team leads.
5. **Rate-Limited API:** Robust backend protection against brute force and DDoS attacks.

---

## 🛠️ Technology Stack

- **Frontend:** React (Create React App), Tailwind CSS (v3), React Router v7.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (Mongoose ODM).
- **Communication:** Resend API / Nodemailer for transactional report delivery.
- **Security:** `express-rate-limit`, CORS.

---

## 💻 Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)
- Resend API Key (for email delivery)

### 1. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `/server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=onboarding@resend.dev
NODE_ENV=development
```
Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
```
Start the development server:
```bash
npm start
```
The application will be running at `http://localhost:3000`.

---

## 🏗️ Production Deployment

This project is configured to run as a unified MERN stack application in production. When deployed (e.g., on Render or Heroku):
1. The backend (`server/index.js`) handles all API requests under `/api/`.
2. Static frontend files from `client/build` are served by the backend.
3. A catch-all route (`*`) ensures React Router correctly handles client-side routing on refresh.

Build the frontend before deployment:
```bash
cd client && npm run build
```

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
