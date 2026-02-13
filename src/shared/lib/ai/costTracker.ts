export interface AICallRecord {
  timestamp: string;
  provider: 'gemini' | 'openai' | 'groq';
  model: string;
  operation: string;       // 'enhance' | 'generate' | 'score'
  inputTokens: number;     // ESTIMATED
  outputTokens: number;    // ESTIMATED
  estimatedCost: number;   // USD (estimate only)
  duration: number;        // ms
  success: boolean;
  error?: string;
}

// Cost per 1K tokens (approximate)
const COST_RATES: Record<string, { input: number; output: number }> = {
  'gemini-1.5-flash': { input: 0.00035, output: 0.00105 },
  'gemini-1.5-pro': { input: 0.0035, output: 0.0105 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
  'llama-3.1-70b': { input: 0.00059, output: 0.00079 },
};

const callHistory: AICallRecord[] = [];
const MAX_HISTORY = 1000;
const BUDGET_WARNING_THRESHOLD = 5.00; // $5 per session

/**
 * Track AI call with ESTIMATED costs
 * 
 * IMPORTANT: ESTIMATION ONLY
 * Token counts are approximate (1 token ≈ 4 characters for English)
 * Actual costs may vary by ±20%
 */
export function trackAICall(
  provider: string,
  model: string,
  operation: string,
  inputText: string,
  outputText: string,
  duration: number,
  success: boolean,
  error?: string
): AICallRecord {
  // ESTIMATION ONLY — approximate token calculation
  // 1 token ≈ 4 characters (English heuristic)
  // Actual tokenization varies by model and language
  const inputTokens = Math.ceil(inputText.length / 4);
  const outputTokens = Math.ceil(outputText.length / 4);
  
  const rates = COST_RATES[model] || { input: 0.01, output: 0.03 };
  const inputCost = (inputTokens / 1000) * rates.input;
  const outputCost = (outputTokens / 1000) * rates.output;
  
  const record: AICallRecord = {
    timestamp: new Date().toISOString(),
    provider: provider as any,
    model,
    operation,
    inputTokens,      // ESTIMATED
    outputTokens,     // ESTIMATED
    estimatedCost: inputCost + outputCost,  // ESTIMATE ONLY
    duration,
    success,
    error
  };

  callHistory.push(record);
  if (callHistory.length > MAX_HISTORY) {
    callHistory.shift();
  }

  // Budget guardrail
  const sessionCost = getCurrentSessionCost();
  if (sessionCost > BUDGET_WARNING_THRESHOLD) {
    console.warn(
      `⚠️ AI cost exceeded $${BUDGET_WARNING_THRESHOLD} this session. ` +
      `Current: $${sessionCost.toFixed(2)}`
    );
  }

  // Dev logging
  if (import.meta.env.DEV) {
    console.log(
      `[AI Cost] ${operation}: ~$${record.estimatedCost.toFixed(4)} ` +
      `(~${inputTokens} → ~${outputTokens} tokens, ESTIMATED)`
    );
  }

  return record;
}

export interface AICostSummary {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  totalCost: number;           // ESTIMATED
  totalInputTokens: number;    // ESTIMATED
  totalOutputTokens: number;   // ESTIMATED
  averageDuration: number;
  callsByOperation: Record<string, number>;
}

export function getAICostSummary(options?: {
  since?: Date;
  operation?: string;
}): AICostSummary {
  let filtered = [...callHistory];
  
  if (options?.since) {
    filtered = filtered.filter(c => 
      new Date(c.timestamp) >= options.since!
    );
  }
  if (options?.operation) {
    filtered = filtered.filter(c => 
      c.operation === options.operation
    );
  }

  const totalCalls = filtered.length;
  const successfulCalls = filtered.filter(c => c.success).length;
  
  const callsByOperation: Record<string, number> = {};
  filtered.forEach(c => {
    callsByOperation[c.operation] = (callsByOperation[c.operation] || 0) + 1;
  });

  return {
    totalCalls,
    successfulCalls,
    failedCalls: totalCalls - successfulCalls,
    totalCost: filtered.reduce((sum, c) => sum + c.estimatedCost, 0),
    totalInputTokens: filtered.reduce((sum, c) => sum + c.inputTokens, 0),
    totalOutputTokens: filtered.reduce((sum, c) => sum + c.outputTokens, 0),
    averageDuration: totalCalls > 0 
      ? filtered.reduce((sum, c) => sum + c.duration, 0) / totalCalls 
      : 0,
    callsByOperation
  };
}

export function getCurrentSessionCost(): number {
  const sessionStart = sessionStorage.getItem('ai_session_start');
  const since = sessionStart ? new Date(sessionStart) : new Date();
  return getAICostSummary({ since }).totalCost;
}

export function initAISession(): void {
  if (!sessionStorage.getItem('ai_session_start')) {
    sessionStorage.setItem('ai_session_start', new Date().toISOString());
  }
}
