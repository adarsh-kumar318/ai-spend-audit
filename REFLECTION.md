# Reflection

Building the AI Spend Audit application presented several key challenges and learning opportunities.

## Challenges Overcome
1. **Tailwind v4 PostCSS conflict**: The initial setup with CRA clashed with Tailwind CSS v4's new architecture. Downgrading to v3 provided instant stability without ejecting CRA.
2. **Dynamic Forms**: Managing state for a dynamic array of tools required careful handling of React hooks.
3. **Audit Logic Prioritization**: To prevent rule overlap, the audit rules were structured linearly with `if/else if` blocks from most specific to least specific.

## Future Improvements
- Integrate actual OpenAI/Anthropic APIs for the AI summary.
- Connect Nodemailer to a real SMTP service.
- Add user authentication to view past audits.
