import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import type { ImpactRecommendation } from '../types';

interface RecommendationsPanelProps {
  recommendations: ImpactRecommendation[];
  maxItems?: number;
  onApplyRecommendation?: (recommendation: ImpactRecommendation) => void;
}

const impactConfig = {
  high: { label: 'High Impact', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900' },
  medium: { label: 'Medium Impact', color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900' },
  low: { label: 'Low Impact', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-900' },
};

const typeIcons: Record<string, string> = {
  add_skill: '➕',
  enhance_skill: '✨',
  add_keyword: '🔑',
  improve_format: '📝',
  add_metrics: '📊',
  enhance_experience: '💼',
  reorder: '🔄',
  quantify: '📈',
};

export function RecommendationsPanel({ 
  recommendations, 
  maxItems = 10,
  onApplyRecommendation,
}: RecommendationsPanelProps) {
  // Sort by impact (high > medium > low) then by score improvement
  const sortedRecs = [...recommendations].sort((a, b) => {
    const impactOrder = { high: 0, medium: 1, low: 2 };
    const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
    if (impactDiff !== 0) return impactDiff;
    return b.expectedScoreImprovement - a.expectedScoreImprovement;
  });
  
  const displayRecs = sortedRecs.slice(0, maxItems);

  if (displayRecs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No recommendations available. Your resume looks great!
        </CardContent>
      </Card>
    );
  }

  const totalImprovement = recommendations.reduce(
    (sum, r) => sum + r.expectedScoreImprovement, 
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
        <p className="text-sm text-muted-foreground">
          Actions to improve your match score
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayRecs.map((rec) => {
          const config = impactConfig[rec.impact];
          return (
            <div
              key={rec.id}
              className="p-4 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => onApplyRecommendation?.(rec)}
            >
              <div className="flex items-start gap-3">
                <span className="text-xl">{typeIcons[rec.type] || '💡'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-medium text-sm">{rec.title}</span>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${config.color}`}
                    >
                      +{rec.expectedScoreImprovement} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {rec.description}
                  </p>
                  {rec.specificAction && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                      → {rec.specificAction}
                    </p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={config.bg}>
                      {config.label}
                    </Badge>
                    {rec.targetLocation && (
                      <Badge variant="outline" className="text-xs">
                        {rec.targetLocation}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {recommendations.length > maxItems && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm">
              View All {recommendations.length} Recommendations
            </Button>
          </div>
        )}

        {/* Summary */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Total potential improvement
            </span>
            <span className="font-bold text-green-600">
              +{totalImprovement} pts
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecommendationsPanel;
