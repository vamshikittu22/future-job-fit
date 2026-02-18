/**
 * Match Dashboard Component
 *
 * Main container integrating all Match Intelligence components.
 * Provides unified view with tabbed navigation for different analysis views.
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shared/ui/tabs';
import { useMatchScore } from '../hooks/useMatchScore';
import { useSkillClusters } from '../hooks/useSkillClusters';
import { useSemanticSimilarity } from '../hooks/useSemanticSimilarity';
import { useRecruiterHeatmap } from '../hooks/useRecruiterHeatmap';
import { MatchScoreGauge } from './MatchScoreGauge';
import { SkillClusteringViz } from './SkillClusteringViz';
import { CompetencyGapList } from './CompetencyGapList';
import { SemanticScoreCard } from './SemanticScoreCard';
import { RecruiterHeatmap } from './RecruiterHeatmap';
import { RecommendationsPanel } from './RecommendationsPanel';
import { JDComparisonView } from './JDComparisonView';
import type { JDComparisonData } from '../types';

interface MatchDashboardProps {
  /** Optional: pass job ID for fetching specific job data */
  jobId?: string;
  /** Optional: enable all features or specific ones */
  features?: {
    score?: boolean;
    clusters?: boolean;
    gaps?: boolean;
    similarity?: boolean;
    heatmap?: boolean;
    recommendations?: boolean;
    comparison?: boolean;
  };
}

export function MatchDashboard({ jobId, features }: MatchDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const { score, breakdown, hasJobDescription } = useMatchScore();
  const { clusters, gapAnalysis } = useSkillClusters();
  const { similarity } = useSemanticSimilarity();
  const { zones: heatmapZones } = useRecruiterHeatmap({});

  const enabled = {
    score: features?.score ?? true,
    clusters: features?.clusters ?? true,
    gaps: features?.gaps ?? true,
    similarity: features?.similarity ?? true,
    heatmap: features?.heatmap ?? true,
    recommendations: features?.recommendations ?? true,
    comparison: features?.comparison ?? true,
  };

  if (!hasJobDescription) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-medium mb-2">No Job Description</h3>
          <p className="text-muted-foreground mb-4">
            Add a job description to see your match intelligence analysis.
          </p>
          <Button>
            Import Job Description
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Build comparison data from available sources
  const comparisonData: JDComparisonData = {
    items: (gapAnalysis?.gaps || []).map((gap) => ({
      keyword: gap.skill,
      jdRequirement: gap.skill,
      status: 'missing' as const,
      type: gap.isRequired ? 'required' as const : 'preferred' as const,
      category: gap.category,
    })),
    matchedCount: 0,
    partialCount: 0,
    missingCount: gapAnalysis?.gaps.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Match Intelligence</h2>
          <p className="text-muted-foreground">
            Application performance analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Top row - Scores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enabled.score && (
              <MatchScoreGauge score={score} breakdown={breakdown} />
            )}
            {enabled.similarity && (
              <SemanticScoreCard similarity={similarity} />
            )}
          </div>

          {/* Middle row - Clusters and Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enabled.clusters && <SkillClusteringViz clusters={clusters} />}
            {enabled.gaps && (
              <CompetencyGapList gaps={gapAnalysis?.gaps || []} />
            )}
          </div>

          {/* Recommendations */}
          {enabled.recommendations && gapAnalysis && (
            <RecommendationsPanel
              recommendations={gapAnalysis.prioritizedRecommendations}
            />
          )}
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enabled.clusters && <SkillClusteringViz clusters={clusters} />}
            {enabled.gaps && (
              <CompetencyGapList gaps={gapAnalysis?.gaps || []} maxItems={20} />
            )}
          </div>
        </TabsContent>

        {/* Heatmap Tab */}
        <TabsContent value="heatmap" className="mt-6">
          {enabled.heatmap && <RecruiterHeatmap />}
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="mt-6">
          {enabled.comparison && (
            <JDComparisonView comparison={comparisonData} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default MatchDashboard;
