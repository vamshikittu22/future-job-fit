/**
 * Competency Gap List Component
 *
 * Displays missing skills ranked by importance with badges and recommendations.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import type { CompetencyGap } from '../types';

interface CompetencyGapListProps {
  gaps: CompetencyGap[];
  maxItems?: number;
}

/**
 * Importance badge configuration
 */
const importanceConfig = {
  critical: { label: 'Critical', variant: 'destructive' as const },
  high: { label: 'High', variant: 'secondary' as const },
  medium: { label: 'Medium', variant: 'outline' as const },
  low: { label: 'Low', variant: 'outline' as const },
};

/**
 * Difficulty color mapping
 */
const difficultyColors = {
  easy: 'text-green-500',
  moderate: 'text-yellow-500',
  hard: 'text-red-500',
};

/**
 * Competency Gap List
 *
 * Shows missing skills ranked by importance (critical > high > medium > low)
 * with specific recommendations and difficulty ratings.
 */
export function CompetencyGapList({ gaps, maxItems = 10 }: CompetencyGapListProps) {
  const displayGaps = gaps.slice(0, maxItems);

  if (displayGaps.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No competency gaps found. Great job!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competency Gaps</CardTitle>
        <p className="text-sm text-muted-foreground">
          Missing skills ranked by importance
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayGaps.map((gap, index) => {
          const config = importanceConfig[gap.importance];
          return (
            <div
              key={gap.skill}
              className="flex items-start justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{gap.skill}</span>
                  <Badge variant={config.variant}>{config.label}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {gap.recommendation}
                </p>
              </div>
              <div className="text-right ml-4">
                <div className={`text-sm font-medium ${difficultyColors[gap.difficulty]}`}>
                  {gap.difficulty}
                </div>
                <div className="text-xs text-muted-foreground">
                  +{gap.isRequired ? 12 : 5} pts
                </div>
              </div>
            </div>
          );
        })}
        {gaps.length > maxItems && (
          <p className="text-center text-sm text-muted-foreground">
            +{gaps.length - maxItems} more gaps
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default CompetencyGapList;
