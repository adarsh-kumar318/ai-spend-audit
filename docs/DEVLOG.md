# Development Log 📓

This log tracks the engineering decisions, milestones, and challenges encountered while building the AI Spend Audit MVP.

## Week 1: Foundation & Backend Setup

**Goal:** Establish the MERN stack infrastructure and database connections.

- **Milestone:** Initialized the Express server and connected to MongoDB Atlas.
- **Challenge:** Encountered a Mongoose Schema syntax error (`User.js` missing a comma) which crashed the Node server during initial compilation.
- **Resolution:** Used standard linting practices to resolve the schema structure and successfully established the `mongoose.connect()` lifecycle.
- **Decision:** Chose to use `dotenv` for environment variable management to keep `MONGODB_URI` and port configurations secure.

## Week 2: Core Logic & Frontend Interface

**Goal:** Build the React client and the actual audit logic engine.

- **Milestone:** Created the dynamic form allowing users to add multiple AI tools, specify seats, and usage frequency.
- **Logic implementation:** Built the `runAudit` function locally on the React side to calculate savings (e.g., suggesting a downgrade if usage is "Rare").
- **Challenge:** Determining how to persist the audit data securely without forcing user registration.
- **Decision:** Implemented a unique `shareId` generated via `nanoid` on the backend. When a user submits an audit, it posts to `/api/audit/create` anonymously. 

## Week 3: Email Integration & Deployment Prep

**Goal:** Implement lead capture, email notification, and deploy to production.

- **Milestone:** Integrated `Resend` API for sending transactional emails (the full audit report).
- **Security implementation:** Added `express-rate-limit` to the `/api/audit/email` endpoint to prevent malicious bots from spamming the email API.
- **Challenge:** Deployment to Render failed with a 404 error on page refresh. 
- **Resolution:** Realized the Express backend wasn't serving the React static files. Updated `server/index.js` to serve `client/build` and added a catch-all route `app.get('*')` to hand routing back to React Router.

---

## 🛠️ Technical Debt & Future Refactoring

1. **Hardcoded Pricing:** Currently, AI tool pricing (e.g., $20/mo for ChatGPT Plus) is hardcoded into the logic engine. This needs to be abstracted into a database collection or a dynamic config file.
2. **TypeScript:** The MVP is built in plain JavaScript. Migrating to TypeScript would prevent the schema/prop-type bugs encountered early in development.
3. **Unit Tests:** While Vitest is configured, coverage for the core `runAudit` logic is not yet at 100%. Need to mock the edge cases (e.g., a user having 5 different enterprise tools).
