/**
 * Match Score Gauge Component
 *
 * Circular score display with weighted breakdown visualization.
 * Integrates with Match Intelligence dashboard.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import type { WeightedScoreBreakdown } from '../types';

interface MatchScoreGaugeProps {
  /** Overall match score (0-100) */
  score: number;
  /** Detailed score breakdown by category */
  breakdown: WeightedScoreBreakdown | null;
}

/**
 * Get color class based on score value
 */
const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-blue-500';
  if (score >= 40) return 'text-yellow-500';
  return 'text-red-500';
};

/**
 * Get stroke color for SVG based on score value
 */
const getStrokeColor = (score: number): string => {
  if (score >= 80) return '#22c55e'; // green-500
  if (score >= 60) return '#3b82f6'; // blue-500
  if (score >= 40) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
};

export function MatchScoreGauge({ score, breakdown }: MatchScoreGaugeProps) {
  // Calculate stroke dasharray for circular progress
  const circumference = 2 * Math.PI * 56; // r = 56
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Match Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main score display */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-muted"
              />
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke={getStrokeColor(score)}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
                {Math.round(score)}
              </span>
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        {/* Score breakdown */}
        {breakdown && (
          <div className="space-y-3">
            {/* Required Skills */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Required Skills
                </span>
                <span className="font-medium">
                  {breakdown.requiredSkills.matched}/{breakdown.requiredSkills.total}
                  <span className="text-muted-foreground ml-1">
                    ({Math.round((breakdown.requiredSkills.score / (breakdown.requiredSkills.maxScore || 1)) * 100)}%)
                  </span>
                </span>
              </div>
              <Progress
                value={(breakdown.requiredSkills.score / (breakdown.requiredSkills.maxScore || 1)) * 100}
                className="h-2"
                indicatorClassName="bg-red-500"
              />
            </div>

            {/* Preferred Skills */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Preferred Skills
                </span>
                <span className="font-medium">
                  {breakdown.preferredSkills.matched}/{breakdown.preferredSkills.total}
                  <span className="text-muted-foreground ml-1">
                    ({Math.round((breakdown.preferredSkills.score / (breakdown.preferredSkills.maxScore || 1)) * 100)}%)
                  </span>
                </span>
              </div>
              <Progress
                value={(breakdown.preferredSkills.score / (breakdown.preferredSkills.maxScore || 1)) * 100}
                className="h-2"
                indicatorClassName="bg-yellow-500"
              />
            </div>

            {/* Bonus/Keywords */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Keywords
                </span>
                <span className="font-medium">
                  {breakdown.bonusSkills.matched}/{breakdown.bonusSkills.total}
                  <span className="text-muted-foreground ml-1">
                    ({Math.round((breakdown.bonusSkills.score / (breakdown.bonusSkills.maxScore || 1)) * 100)}%)
                  </span>
                </span>
              </div>
              <Progress
                value={(breakdown.bonusSkills.score / (breakdown.bonusSkills.maxScore || 1)) * 100}
                className="h-2"
                indicatorClassName="bg-blue-500"
              />
            </div>
          </div>
        )}

        {/* Weight explanation */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Scoring weights:</strong> Required (50%), Preferred (25%), Keywords (10%), Experience (15%)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default MatchScoreGauge;
