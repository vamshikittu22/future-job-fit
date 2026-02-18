import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import type { ComparisonItem, JDComparisonData } from '../types';

interface JDComparisonViewProps {
  comparison: JDComparisonData;
}

const statusConfig = {
  matched: { 
    icon: '✓', 
    className: 'text-green-600 bg-green-50 dark:bg-green-950',
    label: 'Matched'
  },
  partial: { 
    icon: '~', 
    className: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950',
    label: 'Partial'
  },
  missing: { 
    icon: '✗', 
    className: 'text-red-600 bg-red-50 dark:bg-red-950',
    label: 'Missing'
  },
};

export function JDComparisonView({ comparison }: JDComparisonViewProps) {
  const [viewMode, setViewMode] = useState<'unified' | 'split'>('unified');

  const { items, matchedCount, partialCount, missingCount } = comparison;

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No job description loaded. Add a job to see comparison.
        </CardContent>
      </Card>
    );
  }

  const total = items.length;
  const matchPercentage = total > 0 ? Math.round((matchedCount / total) * 100) : 0;

  // Group items by status
  const missing = items.filter(i => i.status === 'missing');
  const partial = items.filter(i => i.status === 'partial');
  const matched = items.filter(i => i.status === 'matched');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>JD Comparison</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'unified' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('unified')}
            >
              Unified
            </Button>
            <Button 
              variant={viewMode === 'split' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('split')}
            >
              Split
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary stats */}
        <div className="flex gap-4 text-sm flex-wrap">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span>Matched ({matchedCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span>Partial ({partialCount})</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span>Missing ({missingCount})</span>
          </div>
        </div>

        {viewMode === 'unified' ? (
          // Unified view - grouped by status
          <div className="space-y-3">
            {missing.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-red-600 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-xs">✗</span>
                  Missing ({missing.length})
                </h4>
                {missing.map((item, idx) => (
                  <div 
                    key={`missing-${idx}`}
                    className="flex items-center gap-2 p-2 rounded bg-red-50 dark:bg-red-950"
                  >
                    <span className="text-red-600 font-medium">✗</span>
                    <span className="flex-1 text-sm">{item.keyword}</span>
                    <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                    {item.category && (
                      <span className="text-xs text-muted-foreground">({item.category})</span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {partial.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-yellow-600 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center text-xs">~</span>
                  Partial ({partial.length})
                </h4>
                {partial.map((item, idx) => (
                  <div 
                    key={`partial-${idx}`}
                    className="flex items-center gap-2 p-2 rounded bg-yellow-50 dark:bg-yellow-950"
                  >
                    <span className="text-yellow-600 font-medium">~</span>
                    <span className="flex-1 text-sm">{item.keyword}</span>
                    {item.resumeText && (
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        → {item.resumeText}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                  </div>
                ))}
              </div>
            )}

            {matched.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-green-600 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-xs">✓</span>
                  Matched ({matched.length})
                </h4>
                {matched.map((item, idx) => (
                  <div 
                    key={`matched-${idx}`}
                    className="flex items-center gap-2 p-2 rounded bg-green-50 dark:bg-green-950"
                  >
                    <span className="text-green-600 font-medium">✓</span>
                    <span className="flex-1 text-sm">{item.keyword}</span>
                    <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Split view - resume vs JD
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium mb-2 px-2">Resume Keywords</h4>
              <div className="max-h-[300px] overflow-y-auto space-y-1">
                {items.filter(i => i.status !== 'missing').map((item, idx) => (
                  <div key={`resume-${idx}`} className="flex items-center gap-2 p-2 rounded bg-green-50 dark:bg-green-950">
                    <span className="text-green-600 font-medium">✓</span>
                    <span className="text-sm">{item.keyword}</span>
                  </div>
                ))}
                {items.filter(i => i.status === 'missing').length > 0 && (
                  <div className="text-sm text-muted-foreground p-2 italic">
                    + {items.filter(i => i.status === 'missing').length} missing
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium mb-2 px-2">Job Description Requirements</h4>
              <div className="max-h-[300px] overflow-y-auto space-y-1">
                {items.map((item, idx) => {
                  const config = statusConfig[item.status];
                  return (
                    <div 
                      key={`jd-${idx}`}
                      className={`flex items-center gap-2 p-2 rounded ${config.className}`}
                    >
                      <span className="font-medium">{config.icon}</span>
                      <span className="text-sm flex-1">{item.keyword}</span>
                      <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm mb-2">
            <span>Match Rate</span>
            <span className="font-medium">{matchPercentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-green-500 transition-all" 
              style={{ width: `${(matchedCount / total) * 100}%` }} 
            />
            <div 
              className="h-full bg-yellow-500 transition-all" 
              style={{ width: `${(partialCount / total) * 100}%` }} 
            />
            <div 
              className="h-full bg-red-500 transition-all" 
              style={{ width: `${(missingCount / total) * 100}%` }} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default JDComparisonView;
