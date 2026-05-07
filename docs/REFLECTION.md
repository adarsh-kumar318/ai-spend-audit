# REFLECTION

## 🧠 Q1 — Hardest Bug
The hardest bug I faced during development was an inconsistent total savings output between the frontend presentation and the backend database. Initially, I noticed that the frontend was showing $120 in savings for a specific tool stack, but the backend database was recording $0, or sometimes throwing a validation error. 

My first hypothesis was that there was a race condition in how React was rendering the state before the API response came back, so I spent time debugging React's lifecycle, adding loaders, and adjusting `useEffect` dependency arrays. However, the issue persisted. I then checked the network tab and noticed the API request payload was actually sending an empty `totalSavings` field, meaning the backend was just blindly accepting whatever it received. 

I realized the core problem: the frontend was calculating the savings correctly for display but failing to serialize it correctly for the payload, and worse, the backend was trusting the client entirely. This was a massive security flaw. I completely reversed the logic, moving the entire cost-calculation engine into the Node.js `createAudit` controller. The frontend now just passes the raw tool array, and the backend computes the single source of truth, saving it to MongoDB and returning the calculated results. This fixed the bug and instantly secured the API.

## 🧠 Q2 — Decision you reversed
A major architectural decision I reversed was how the application handled cost calculation logic. Initially, I believed that calculating savings on the frontend in `client/src/utils/audit.js` would result in a snappier user experience. My thought process was that minimizing server round-trips for simple math was the most efficient route for an MVP. 

However, halfway through building the application, I realized that relying on frontend logic meant the total savings value sent to the backend could easily be manipulated by a malicious user intercepting the request. This completely undermined the trust of the platform—if users could fake their "savings" to get discounted credits, Credex would lose money. 

Because of this realization, I completely ripped out the frontend calculation logic and shifted the exact same reduction loops into the backend `auditController.js`. It made the frontend strictly a presentation layer, which not only improved security but also made the React components significantly cleaner and easier to maintain. Adapting to this security requirement over premature optimization was a crucial pivot.

## 🧠 Q3 — What you’d build next
If I had another month to work on this platform, the immediate next step would be building an enterprise-grade dashboard with direct integrations into corporate billing APIs like Stripe and Ramp. 

Right now, the audit relies on manual user input, which is prone to human error or intentional inflation. By securely connecting to a company's corporate card or Stripe billing history via OAuth, the platform could automatically scan transaction descriptions for "OpenAI", "Cursor", or "Anthropic" and pull the exact subscription tiers dynamically. This would shift the product from a static calculator into a real-time benchmarking system that provides continuous value. 

Furthermore, I would introduce automated cancellation workflows. Instead of just telling a founder they are overpaying for GitHub Copilot, the platform could offer a one-click "Cancel Redundant Seats" button that interfaces directly with the vendor's API to eliminate the waste instantly, allowing the platform to take a percentage of the savings as a convenience fee.

## 🧠 Q4 — AI usage
Transparency regarding AI usage was a core philosophy during this build. I heavily utilized AI coding assistants (like ChatGPT) to accelerate the generation of standard boilerplate code, such as the initial Express server setup, Mongoose schema definitions, and scaffolding the premium Tailwind CSS layouts. It acted as an extremely fast pair programmer for tedious tasks.

However, I explicitly did not trust AI for the core financial calculations or the pricing logic. Those were hardcoded manually after verifying the official pricing pages for each vendor. 

There was one specific instance where an AI assistant suggested a `reduce` function for calculating the savings array that accidentally counted duplicate tool entries twice, inflating the savings artificially. Because I was manually testing the business logic and treating the AI's math with skepticism, I caught the hallucination immediately and rewrote the reduction loop myself. This reinforced my rule: AI is fantastic for scaffolding and styling, but absolutely cannot be blindly trusted with money, math, or core business logic.

## 🧠 Q5 — Self rating

- **Discipline (9/10):** Maintained consistent focus entirely on the core MVP rather than getting distracted by flashy, unnecessary features.
- **Code Quality (8/10):** The backend is highly secure and the frontend uses standard React patterns, though I could have added more unit tests for the pricing logic edge cases.
- **Design Sense (9/10):** Successfully pivoted to a highly polished, high-trust "Product Hunt" style UI that perfectly fits the SaaS aesthetic.
- **Problem Solving (9/10):** Effectively identified the architectural flaw in client-side calculations and refactored it to the backend without breaking the user experience.
- **Entrepreneurial Thinking (10/10):** Framed the entire project not just as a coding assignment, but as a high-intent lead generation engine optimized for Credex's specific revenue model.
