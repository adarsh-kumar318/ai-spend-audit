# Developer Reflection 🪞

Building the AI Spend Audit MVP has been an intensive exercise in balancing speed-to-market with robust technical architecture. Here is a reflection on the process, key takeaways, and what lies ahead.

## 🌟 What Went Well

1. **The "Wedge" Concept Execution:** The core product strategy—offering immediate value (the audit) before asking for an email—works beautifully. The UI feels fast because the initial logic runs client-side.
2. **MERN Stack Velocity:** React and Express continue to provide unmatched velocity for prototyping. Being able to share JSON structures between the frontend state and the Mongoose models sped up development significantly.
3. **Resend Integration:** Moving away from traditional SMTP servers to the Resend API made transactional email setup incredibly fast and developer-friendly.

## 🚧 Challenges & Learnings

1. **Single Page Application (SPA) Deployment Nuances:** The biggest technical hurdle was resolving the 404 errors upon refreshing the React app when deployed. It served as a stark reminder of how SPAs handle routing vs. how traditional servers do. Writing the Express catch-all route reinforced my understanding of server-side vs. client-side routing.
2. **State Management Complexity:** Managing an array of dynamic objects (the tools) in React required careful mapping and state updating to prevent re-rendering bugs. 
3. **Pricing Logic Edge Cases:** Building the rule-based recommendation engine highlighted how complex AI pricing tiers are becoming (e.g., ChatGPT Team requires a minimum of 2 seats). Capturing these nuances programmatically was harder than expected.

## 🛣️ Technical Roadmap (v2)

Moving forward, the focus will shift from "making it work" to "making it scale."

1. **Authentication & Dashboards (B2B SaaS Transition):** 
   - Implement JWT-based authentication.
   - Allow enterprise users to log in, connect their corporate credit cards via an API (like Plaid or Stripe), and automate the audit rather than relying on manual input.
2. **Migration to Next.js:** 
   - Refactor the React app to Next.js for Server-Side Rendering (SSR). This will improve SEO for the landing pages and simplify the deployment routing issues.
3. **Generative AI Fallback Integration:**
   - Integrate the OpenAI API to analyze unstructured data (e.g., if a user uploads a CSV of their software expenses) and automatically map them to known AI tools.
