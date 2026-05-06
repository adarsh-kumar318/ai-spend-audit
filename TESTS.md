# Testing Strategy

## Manual Tests
1. **Flow**: Submit tools -> View recommendations -> Enter Email -> Check Shareable Link -> Verify data loads without email.
2. **Pricing Engine**:
   - Add `chatgpt` Team plan with 3 seats. Verify it recommends Plus and saves $20.
   - Add 10 seats for a 5 person team. Verify it recommends reducing seats.
   - Add total cost > $100. Verify Credex global recommendation appears.
3. **Rate Limiting**: Refresh the API rapidly to trigger the `429 Too Many Requests` block.

## Future Automated Tests
- Setup Jest/Supertest for testing the `/api/audit/create` backend logic.
- Setup React Testing Library for frontend component rendering.
