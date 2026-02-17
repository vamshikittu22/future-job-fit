/**
 * Use Skill Clusters Hook
 *
 * React hook for computing skill clusters and competency gap analysis.
 * Integrates with useMatchScore to provide cluster visualization data.
 */

import { useMemo } from 'react';
import {
  clusterSkills,
  analyzeCompetencyGaps,
  categorizeSkill,
} from '../utils/skillClustering';
import { useMatchScore } from './useMatchScore';
import type { SkillCluster, CompetencyGapAnalysis, MatchedSkill } from '../types';

interface UseSkillClustersResult {
  clusters: SkillCluster[];
  gapAnalysis: CompetencyGapAnalysis | null;
  isLoading: boolean;
}

/**
 * Convert WeightedKeywordResult to MatchedSkill format
 */
function convertToMatchedSkill(
  keyword: string,
  weight: number,
  status: 'matched' | 'partial' | 'missing'
): MatchedSkill {
  return {
    name: keyword,
    status,
    weight,
    inResume: status !== 'missing',
    resumeLocations: status !== 'missing' ? ['resume text'] : undefined,
  };
}

/**
 * Hook to get skill clusters and gap analysis from match score
 *
 * @returns Skill clusters, gap analysis, and loading state
 */
export function useSkillClusters(): UseSkillClustersResult {
  const { keywords, isLoading, hasJobDescription } = useMatchScore();

  const result = useMemo(() => {
    if (!hasJobDescription || keywords.length === 0) {
      return {
        clusters: [],
        gapAnalysis: null,
      };
    }

    // Convert WeightedKeywordResult to MatchedSkill format
    const matchedSkills: MatchedSkill[] = keywords.map((kw) =>
      convertToMatchedSkill(kw.keyword, kw.actualWeight, kw.status)
    );

    // Cluster skills by category
    const clusters = clusterSkills(matchedSkills);

    // Analyze competency gaps
    const gapAnalysis = analyzeCompetencyGaps(matchedSkills);

    return {
      clusters,
      gapAnalysis,
    };
  }, [keywords, hasJobDescription]);

  return {
    ...result,
    isLoading,
  };
}

export default useSkillClusters;
