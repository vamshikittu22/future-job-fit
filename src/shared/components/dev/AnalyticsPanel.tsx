import { useState, useEffect } from 'react';
import { getAICostSummary, getCurrentSessionCost } from '@/shared/lib/ai';
import { BarChart3, DollarSign, Activity, AlertTriangle } from 'lucide-react';

export function AnalyticsPanel() {
  const [summary, setSummary] = useState(getAICostSummary());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSummary(getAICostSummary());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const sessionCost = getCurrentSessionCost();
  const overBudget = sessionCost > 5;

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider">
        <BarChart3 className="w-4 h-4" />
        AI Usage (ESTIMATES)
      </div>
      
      {/* Budget Warning */}
      {overBudget && (
        <div className="flex items-center gap-2 text-red-400 bg-red-950/30 p-2 rounded border border-red-800">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-bold">Budget exceeded $5!</span>
        </div>
      )}
      
      {/* Cost Grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-300">
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="w-3 h-3" />
          Session Cost:
        </div>
        <div className={overBudget ? 'text-red-400 font-bold' : 'text-green-400'}>
          ${sessionCost.toFixed(4)}
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <DollarSign className="w-3 h-3" />
          Total Cost:
        </div>
        <div className="text-gray-300">${summary.totalCost.toFixed(4)}</div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="w-3 h-3" />
          Total Calls:
        </div>
        <div className="text-blue-400">{summary.totalCalls}</div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="w-3 h-3" />
          Success Rate:
        </div>
        <div className="text-green-400">
          {summary.totalCalls > 0 
            ? ((summary.successfulCalls / summary.totalCalls) * 100).toFixed(1)
            : 0}%
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <BarChart3 className="w-3 h-3" />
          Est. Tokens:
        </div>
        <div className="text-purple-400">
          {summary.totalInputTokens.toLocaleString()} → {summary.totalOutputTokens.toLocaleString()}
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground">
          <Activity className="w-3 h-3" />
          Avg Duration:
        </div>
        <div className="text-yellow-400">
          {summary.averageDuration.toFixed(0)}ms
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-gray-600 mt-2 italic border-t border-white/10 pt-2">
        ⚠️ Token counts and costs are ESTIMATES ONLY (~±20% accuracy)
      </p>

      {/* Operations Breakdown */}
      {Object.keys(summary.callsByOperation).length > 0 && (
        <>
          <div className="text-[10px] text-muted-foreground uppercase mt-4 pt-2 border-t border-white/10">
            By Operation
          </div>
          <div className="space-y-1">
            {Object.entries(summary.callsByOperation).map(([op, count]) => (
              <div key={op} className="flex justify-between text-xs">
                <span className="text-gray-400">{op}:</span>
                <span className="text-accent">{count}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
