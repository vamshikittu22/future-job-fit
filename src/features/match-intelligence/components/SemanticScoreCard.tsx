/**
 * Semantic Score Card Component
 *
 * Displays semantic similarity score between resume and job description.
 * Shows overall score with circular progress and section-level breakdown.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Progress } from '@/shared/ui/Progress';
import type { SemanticScore } from '../types';

interface SemanticScoreCardProps {
  /** Semantic similarity score data */
  similarity: SemanticScore | null;
}

/** Configuration for interpretation levels */
const interpretationConfig = {
  excellent: {
    label: 'Excellent',
    color: 'text-green-500',
    bg: 'bg-green-500',
    description: 'Strong semantic alignment with job requirements',
  },
  good: {
    label: 'Good',
    color: 'text-blue-500',
    bg: 'bg-blue-500',
    description: 'Reasonable match with some gaps to address',
  },
  fair: {
    label: 'Fair',
    color: 'text-yellow-500',
    bg: 'bg-yellow-500',
    description: 'Moderate alignment, consider improvements',
  },
  poor: {
    label: 'Poor',
    color: 'text-red-500',
    bg: 'bg-red-500',
    description: 'Significant gap between resume and JD',
  },
};

/**
 * Circular progress indicator component
 */
function CircularProgress({ value, size = 120, strokeWidth = 8 }: {
  value: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  // Determine color based on value
  const getColor = (val: number) => {
    if (val >= 70) return '#22c55e'; // green-500
    if (val >= 40) return '#eab308'; // yellow-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(value)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold">{Math.round(value)}%</span>
      </div>
    </div>
  );
}

/**
 * Semantic Score Card component
 *
 * Displays semantic similarity analysis with:
 * - Overall score as circular progress
 * - Section-level breakdown with progress bars
 * - Interpretation label and description
 */
export function SemanticScoreCard({ similarity }: SemanticScoreCardProps) {
  if (!similarity) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Add a job description to see semantic similarity analysis.
        </CardContent>
      </Card>
    );
  }

  const config = interpretationConfig[similarity.interpretation];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Semantic Similarity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="flex flex-col items-center space-y-4">
          <CircularProgress value={similarity.overall} />
          <div className="text-center">
            <span className={`text-lg font-semibold ${config.color}`}>
              {config.label}
            </span>
            <p className="text-sm text-muted-foreground mt-1">
              {config.description}
            </p>
          </div>
        </div>

        {/* Section Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Section Breakdown</h4>
          {Object.entries(similarity.bySection).map(([section, score]) => (
            <div key={section} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="capitalize">{section}</span>
                <span className="font-medium">{Math.round(score)}%</span>
              </div>
              <Progress
                value={score}
                className="h-1.5"
                indicatorClassName={
                  score >= 70
                    ? 'bg-green-500'
                    : score >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }
              />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-xs text-muted-foreground justify-center">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>≥70%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span>40-69%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>&lt;40%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SemanticScoreCard;
