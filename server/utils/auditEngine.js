/**
 * Core Audit Engine for analyzing AI tool spend.
 * Extracts business logic from the controller to ensure testability and clean architecture.
 */

// Centralized pricing data reference based on PRICING_DATA.md
const PRICING = {
  chatgpt: { plus: 20, team: 30 },
  cursor: { pro: 20, business: 40 },
  copilot: { individual: 10, business: 19 },
  claude: { pro: 20, team: 30 }
};

/**
 * Analyzes a single tool to find savings and recommendations.
 * @param {Object} tool - The tool configuration
 * @param {Number} teamSize - Total team size
 * @param {String} useCase - Primary use case
 * @returns {Object} - Recommendation details
 */
const analyzeSingleTool = (tool, teamSize = 1, useCase = "") => {
  const toolName = tool.name ? tool.name.toLowerCase() : "";
  const plan = tool.plan ? tool.plan.toLowerCase() : "";
  const seats = tool.seats || 1;
  
  let recommendedPlan = tool.plan; // Default to keep current
  let savings = 0;
  let reason = "Already optimal. No better pricing option found for your current setup.";

  // Rule 1: ChatGPT Team downgrade for small teams
  if (toolName === "chatgpt" && plan === "team" && seats <= 3) {
    recommendedPlan = "Plus";
    savings = (PRICING.chatgpt.team * seats) - (PRICING.chatgpt.plus * seats);
    reason = `Your ${seats}-person team is paying $${PRICING.chatgpt.team * seats}/month for ChatGPT Team. Individual Plus accounts provide the same core model capabilities, reducing spend by $${savings}/month.`;
  }

  // Rule 2: Copilot Business downgrade for single users
  else if (toolName === "copilot" && plan === "business" && seats === 1) {
    recommendedPlan = "Individual";
    savings = PRICING.copilot.business - PRICING.copilot.individual;
    reason = `You are paying $${PRICING.copilot.business}/month for Copilot Business as a solo user. The Individual plan offers the same coding autocomplete capabilities for $${PRICING.copilot.individual}/month.`;
  }

  // Rule 3: Use-case mismatch (Writing -> Claude)
  else if (toolName === "chatgpt" && useCase === "writing" && plan === "plus") {
    recommendedPlan = "Claude Pro";
    savings = 0; // Same cost, better value
    reason = `Based on your primarily writing-focused workflow, Claude Pro provides superior long-context writing capabilities at the exact same price point ($20/mo).`;
  }

  // Rule 4: Enterprise Threshold Avoidance
  else if (seats >= 20 && plan !== "enterprise") {
    recommendedPlan = "Enterprise";
    savings = 0; // Requires sales negotiation
    reason = `With ${seats} seats, you cross the threshold to negotiate an Enterprise volume discount directly with the vendor instead of standard per-seat billing.`;
  }

  // Rule 5: Excess seats
  else if (seats > teamSize) {
    recommendedPlan = "Reduce Seats";
    const costPerSeat = PRICING[toolName] && PRICING[toolName][plan] ? PRICING[toolName][plan] : 20;
    savings = (seats - teamSize) * costPerSeat;
    reason = `You have ${seats} seats allocated but only a team size of ${teamSize}. Removing unused seats eliminates dead weight in your SaaS budget.`;
  }

  return {
    tool: tool.name,
    recommendedPlan,
    savings,
    reason,
    yearlySavings: savings * 12
  };
};

/**
 * Runs cost optimization rules against an entire tool stack.
 * @param {Object} data - The audit payload containing tools, teamSize, and useCase
 * @returns {Object} - The structured audit breakdown and total savings
 */
const runAuditEngine = (data) => {
  const tools = data.tools || [];
  const teamSize = data.teamSize || 1;
  const useCase = data.useCase || "";

  let totalSavings = 0;

  const auditBreakdown = tools.map((tool) => {
    const analysis = analyzeSingleTool(tool, teamSize, useCase);
    totalSavings += analysis.savings;
    
    // Format required for frontend
    return {
      tool: analysis.tool,
      recommendation: analysis.recommendedPlan !== tool.plan 
        ? `Switch to ${analysis.recommendedPlan}` 
        : "Keep current plan",
      savings: analysis.savings,
      reason: analysis.reason
    };
  });

  return {
    totalSavings,
    auditBreakdown
  };
};

module.exports = { runAuditEngine, analyzeSingleTool, PRICING };
