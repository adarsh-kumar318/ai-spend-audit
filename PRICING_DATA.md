# Pricing Data Rules

The logic inside `client/src/utils/audit.js` relies on these hardcoded rules:

1. **ChatGPT Plan Optimization**: If `chatgpt` Team plan and seats <= 3 -> Recommend Plus (Save $20/seat).
2. **Claude Plan Optimization**: If `claude` Team plan and seats <= 3 -> Recommend Pro (Save $20/seat).
3. **Copilot Overpay**: If `copilot` Business plan and seats == 1 -> Recommend Individual (Save $10/seat).
4. **Seats > Team Size**: If `seats > teamSize` -> Recommend reducing seats.
5. **Per-user Cost High**: If cost/seat > $30 -> Recommend cheaper plan (Save 30%).
6. **Duplicate Tools**: If both ChatGPT & Claude present -> Recommend dropping one (Save $20).
7. **High Spend**: If total spend > $100 -> Suggest Credex discounted credits.
8. **API vs Subscription**: If `openai-api` cost < $20 -> Recommend Plus subscription.
9. **Use Case Mismatch**: If `coding` use-case but using `chatgpt` -> Recommend Copilot.
10. **Optimal**: Fallback if no rules match.
