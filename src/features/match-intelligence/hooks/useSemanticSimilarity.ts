/**
 * Use Semantic Similarity Hook
 *
 * React hook for computing semantic similarity scores between resume and job description.
 * Integrates with ResumeContext and JobContext to provide section-level analysis.
 */

import { useMemo } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useJob } from '@/shared/contexts/JobContext';
import { calculateSemanticSimilarity } from '../utils/similarityCalculator';
import type { SemanticScore } from '../types';

interface UseSemanticSimilarityResult {
  /** Semantic similarity score with overall and section breakdown */
  similarity: SemanticScore | null;
  /** Whether the calculation is loading */
  isLoading: boolean;
  /** Whether a job description is available */
  hasJobDescription: boolean;
}

/**
 * Hook to calculate semantic similarity between resume and job description
 *
 * @returns Similarity data including overall score and section-level breakdown
 */
export function useSemanticSimilarity(): UseSemanticSimilarityResult {
  const { resumeData } = useResume();
  const { currentJob } = useJob();

  const similarity = useMemo<SemanticScore | null>(() => {
    // Check if we have a job description
    if (!currentJob?.description) {
      return null;
    }

    // Convert resume to plain text
    const resumeText = [
      resumeData.summary,
      ...(resumeData.experience || []).map((e) =>
        `${e.title} ${e.company} ${e.bullets?.join(' ') || ''}`
      ),
      ...getSkillsText(resumeData.skills),
      ...(resumeData.projects || []).map((p) =>
        `${p.name} ${p.description}`
      ),
      ...(resumeData.education || []).map((e) =>
        `${e.school} ${e.degree} ${e.fieldOfStudy || ''}`
      ),
    ]
      .filter(Boolean)
      .join('\n');

    return calculateSemanticSimilarity(resumeText, currentJob.description);
  }, [resumeData, currentJob]);

  return {
    similarity,
    isLoading: false,
    hasJobDescription: Boolean(currentJob?.description),
  };
}

/**
 * Extract skills text from various skills formats
 */
function getSkillsText(
  skills: ResumeData['skills']
): string[] {
  if (!skills) return [];

  // Handle array format (categorical skills)
  if (Array.isArray(skills)) {
    return skills.flatMap((category) => category.items || []);
  }

  // Handle object format { languages, frameworks, tools }
  return [
    ...(skills.languages || []),
    ...(skills.frameworks || []),
    ...(skills.tools || []),
  ];
}

// Type import for ResumeData
import type { ResumeData } from '@/shared/types/resume';

export default useSemanticSimilarity;
