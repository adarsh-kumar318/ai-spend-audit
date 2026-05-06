export const runAudit = (data) => {
  let results = [];
  let totalSavings = 0;
  let totalSpend = 0;

  if (!data.tools || data.tools.length === 0) {
    return { results: [], totalSavings: 0, yearlySavings: 0 };
  }

  // Calculate total spend for global rules
  data.tools.forEach(t => {
    totalSpend += (t.cost || 0);
  });

  data.tools.forEach((tool) => {
    let recommendation = "";
    let savings = 0;
    let reason = "";

    const toolName = tool.name ? tool.name.toLowerCase() : "";
    const plan = tool.plan ? tool.plan.toLowerCase() : "";
    const perUser = tool.seats > 0 ? (tool.cost / tool.seats) : 0;

    // 1. ChatGPT Plan Optimization
    if (toolName === "chatgpt" && plan === "team" && tool.seats <= 3) {
      recommendation = "Switch to ChatGPT Plus";
      savings = tool.cost - 20;
      reason = "Small teams don’t need Team plan";
    } 
    // 2. Claude Plan Optimization
    else if (toolName === "claude" && plan === "team" && tool.seats <= 3) {
      recommendation = "Switch to Claude Pro";
      savings = tool.cost - 20;
      reason = "Team plan is expensive for small usage";
    } 
    // 3. Copilot Overpay
    else if (toolName === "copilot" && plan === "business" && tool.seats === 1) {
      recommendation = "Switch to Individual plan";
      savings = tool.cost - 10;
      reason = "Single user doesn’t need business plan";
    } 
    // 8. API vs Subscription
    else if (toolName === "openai-api" && tool.cost < 20) {
      recommendation = "Switch to ChatGPT Plus subscription";
      savings = tool.cost - 20;
      reason = "Subscription is cheaper for low usage";
    } 
    // 9. Use-case mismatch
    else if (data.useCase === "coding" && toolName === "chatgpt") {
      recommendation = "Consider GitHub Copilot";
      savings = 10;
      reason = "Copilot is optimized for coding tasks";
    } 
    // 4. Seats > Team Size
    else if (tool.seats > data.teamSize) {
      recommendation = "Reduce number of seats";
      savings = (tool.seats - data.teamSize) * perUser;
      reason = "You are paying for unused seats";
    } 
    // 5. Per-user cost too high
    else if (perUser > 30) {
      recommendation = "Switch to a cheaper plan";
      savings = tool.cost * 0.3;
      reason = "Cost per user is too high";
    } 
    // 10. Already optimal (VERY IMPORTANT)
    else {
      recommendation = "Your current plan is optimal";
      savings = 0;
      reason = "No better pricing option found";
    }

    totalSavings += savings;

    results.push({
      tool: tool.name,
      currentPlan: tool.plan,
      recommendation,
      savings,
      reason
    });
  });

  // 6. Duplicate tools (ChatGPT + Claude)
  const hasChatGPT = data.tools.some(t => t.name && t.name.toLowerCase() === "chatgpt");
  const hasClaude = data.tools.some(t => t.name && t.name.toLowerCase() === "claude");
  
  if (hasChatGPT && hasClaude) {
    results.push({
      tool: "Multiple Tools",
      currentPlan: "ChatGPT + Claude",
      recommendation: "Consider using only one AI tool",
      savings: 20,
      reason: "Both tools overlap in functionality"
    });
    totalSavings += 20;
  }

  // 7. High spend → Credex suggestion
  if (totalSpend > 100) {
    results.push({
      tool: "Total Stack",
      currentPlan: "High Spend",
      recommendation: "Use discounted AI credits via Credex",
      savings: totalSpend * 0.2,
      reason: "Bulk credits can reduce cost significantly"
    });
    totalSavings += totalSpend * 0.2;
  }

  return {
    results,
    totalSavings,
    yearlySavings: totalSavings * 12
  };
};
