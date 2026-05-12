# Testing Strategy 🧪

To ensure the reliability of the AI Spend Audit financial calculations and backend stability, we implement a multi-layered testing approach.

## 1. Unit Testing (Vitest)

We use **Vitest** for testing the core logic engine because of its speed and seamless integration with modern JS ecosystems.

**Primary Focus: `runAudit` function.**
The financial recommendation engine must be mathematically perfect.

### Key Test Cases:
- **Downgrade Logic:** If a user inputs `ChatGPT Plus` with "Rare" usage, the engine MUST return a savings recommendation of $20/month.
- **Seat Consolidation:** If a user inputs 3 individual `Claude Pro` accounts, the engine should recommend moving to a `Claude Team` plan (if applicable) or evaluate the price diff.
- **Deduplication:** If a user inputs both `ChatGPT Plus` and `Jasper`, the engine should flag this as a redundancy and suggest cutting the lesser-used tool.
- **Zero Usage:** If usage is marked as "Never", the tool should flag 100% of the cost as potential savings.

*Run unit tests:*
```bash
cd server
npm test
```

## 2. API Endpoint Testing (Supertest)

Backend routes are tested to ensure data validation, rate limiting, and security compliance.

### Key Test Cases:
- **POST `/api/audit/create`:** Verify that passing valid tool data returns a 201 status and a valid `shareId`.
- **POST `/api/audit/create` (Edge Case):** Verify that empty tool arrays are rejected with a 400 status.
- **GET `/api/audit/:id`:** Ensure that the returned JSON payload successfully strips the `email` field to maintain privacy.
- **Rate Limiting:** Simulate 101 requests to `/api/audit/email` within 15 minutes to verify the 429 "Too Many Requests" response is triggered.

## 3. Frontend Component Testing (React Testing Library)

Testing the user interface to ensure the dynamic form behaves correctly.

### Key Test Cases:
- **Dynamic Form Addition:** Clicking "Add Tool" increases the input row count by 1.
- **Validation:** Attempting to submit the form without selecting a tool name triggers a validation warning.
- **Savings Render:** The UI correctly renders the "Total Savings" output card when the `savings` state is greater than $0.

## 4. CI/CD Integration

All tests run automatically on GitHub Actions upon PR creation targeting the `main` branch. Merges are blocked if test coverage falls below 85% or if any Vitest case fails.
