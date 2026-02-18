/**
 * Match Intelligence Module
 *
 * Provides weighted keyword scoring, semantic similarity, skill clustering,
 * recruiter heatmap visualization, recommendations, and JD comparison features.
 */

// Main module exports
export * from './types';
export * from './hooks';
export * from './components';
export * from './utils';

// Re-export for convenience
export { useMatchScore } from './hooks/useMatchScore';
export { useSkillClusters } from './hooks/useSkillClusters';
export { useSemanticSimilarity } from './hooks/useSemanticSimilarity';
export { useRecruiterHeatmap } from './hooks/useRecruiterHeatmap';

// Components
export { SkillClusteringViz } from './components/SkillClusteringViz';
export { CompetencyGapList } from './components/CompetencyGapList';
export { SemanticScoreCard } from './components/SemanticScoreCard';
export { RecruiterHeatmap } from './components/RecruiterHeatmap';
export { RecommendationsPanel } from './components/RecommendationsPanel';
export { JDComparisonView } from './components/JDComparisonView';
export { MatchScoreGauge } from './components/MatchScoreGauge';
export { MatchDashboard } from './components/MatchDashboard';
