import { describe, it, expect } from 'vitest';
import { analyzeSingleTool, runAuditEngine } from '../utils/auditEngine.js';

describe('Audit Engine Optimization Rules', () => {
  
  it('recommends ChatGPT Plus for small teams (downgrade logic)', () => {
    const result = analyzeSingleTool({
      name: 'ChatGPT',
      plan: 'Team',
      seats: 2
    }, 2);
    
    expect(result.recommendedPlan).toBe('Plus');
    expect(result.savings).toBe(20); // (30*2) - (20*2) = 60 - 40 = 20
  });

  it('calculates yearly savings correctly', () => {
    const result = analyzeSingleTool({
      name: 'Copilot',
      plan: 'Business',
      seats: 1
    }, 1);
    
    expect(result.recommendedPlan).toBe('Individual');
    expect(result.savings).toBe(9); // 19 - 10 = 9
    expect(result.yearlySavings).toBe(108); // 9 * 12
  });

  it('handles the no savings case properly (Already optimal)', () => {
    const result = analyzeSingleTool({
      name: 'ChatGPT',
      plan: 'plus',
      seats: 1
    }, 1);
    
    expect(result.recommendedPlan).toBe('plus');
    expect(result.savings).toBe(0);
    expect(result.reason).toContain('Already optimal');
  });

  it('recommends Enterprise tier for high seat counts (enterprise threshold)', () => {
    const result = analyzeSingleTool({
      name: 'Cursor',
      plan: 'business',
      seats: 25
    }, 25);
    
    expect(result.recommendedPlan).toBe('Enterprise');
    expect(result.savings).toBe(0); // Requires sales negotiation
  });

  it('identifies and removes excess seats', () => {
    const result = analyzeSingleTool({
      name: 'Claude',
      plan: 'pro',
      seats: 5
    }, 3); // 5 seats allocated, but team size is 3
    
    expect(result.recommendedPlan).toBe('Reduce Seats');
    expect(result.savings).toBe(40); // 2 excess seats * $20 = $40
  });

  it('aggregates total savings across multiple tools', () => {
    const engineResult = runAuditEngine({
      teamSize: 2,
      useCase: 'writing',
      tools: [
        { name: 'ChatGPT', plan: 'team', seats: 2 }, // Saves $20
        { name: 'Claude', plan: 'pro', seats: 5 } // 3 excess seats * $20 = $60
      ]
    });
    
    expect(engineResult.totalSavings).toBe(80);
    expect(engineResult.auditBreakdown).toHaveLength(2);
  });
});
