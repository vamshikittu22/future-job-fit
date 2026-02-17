/**
 * Skill Clustering Visualization Component
 *
 * Displays skill clusters with progress bars showing coverage per category.
 */

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import type { SkillCluster } from '../types';

interface SkillClusteringVizProps {
  clusters: SkillCluster[];
}

/**
 * Color mapping for skill categories
 */
const categoryColors: Record<string, string> = {
  technical: 'bg-blue-500',
  tools: 'bg-purple-500',
  concepts: 'bg-green-500',
  soft: 'bg-orange-500',
};

/**
 * Skill Clustering Visualization
 *
 * Shows skill coverage for each category (Technical, Tools, Concepts, Soft)
 * with progress bars and matched/missing skill badges.
 */
export function SkillClusteringViz({ clusters }: SkillClusteringVizProps) {
  if (clusters.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No skill data available. Add a job description to see clustering.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Clusters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {clusters.map((cluster) => (
          <div key={cluster.id} className="space-y-2">
            {/* Category Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">{cluster.icon}</span>
                <span className="font-medium">{cluster.label}</span>
                <span className="text-xs text-muted-foreground">
                  ({cluster.required.length + cluster.preferred.length} skills)
                </span>
              </div>
              <span className="text-sm font-medium">
                {Math.round(cluster.coverage)}%
              </span>
            </div>

            {/* Progress Bar */}
            <Progress
              value={cluster.coverage}
              className="h-2"
              indicatorClassName={categoryColors[cluster.id] || 'bg-primary'}
            />

            {/* Skill Badges */}
            <div className="flex gap-2 flex-wrap mt-2">
              {/* Matched required skills */}
              {cluster.required
                .filter((s) => s.status !== 'missing')
                .map((skill) => (
                  <span
                    key={skill.name}
                    className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 rounded text-green-800 dark:text-green-200"
                  >
                    ✓ {skill.name}
                  </span>
                ))}
              {/* Missing required skills */}
              {cluster.required
                .filter((s) => s.status === 'missing')
                .map((skill) => (
                  <span
                    key={skill.name}
                    className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900 rounded text-red-800 dark:text-red-200"
                  >
                    ✗ {skill.name}
                  </span>
                ))}
              {/* Matched preferred skills */}
              {cluster.preferred
                .filter((s) => s.status !== 'missing')
                .map((skill) => (
                  <span
                    key={skill.name}
                    className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded text-blue-800 dark:text-blue-200"
                  >
                    ✓ {skill.name}
                  </span>
                ))}
              {/* Missing preferred skills */}
              {cluster.preferred
                .filter((s) => s.status === 'missing')
                .map((skill) => (
                  <span
                    key={skill.name}
                    className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900 rounded text-yellow-800 dark:text-yellow-200"
                  >
                    ✗ {skill.name}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default SkillClusteringViz;
