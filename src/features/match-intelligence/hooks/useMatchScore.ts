/**
 * Use Match Score Hook
 *
 * React hook for computing weighted match scores between resume and job description.
 * Integrates with ResumeContext and JobContext.
 */

import { useMemo } from 'react';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useJob } from '@/shared/contexts/JobContext';
import {
  calculateWeightedKeywords,
  calculateBreakdown,
  calculateExperienceScore,
  calculateOverallScore,
} from '../utils/keywordWeighting';
import type {
  MatchScoreResult,
  WeightedScoreBreakdown,
  WeightedKeywordResult,
} from '../types';

interface UseMatchScoreOptions {
  /** Include experience matching (15% of total) */
  includeExperience?: boolean;
}

interface UseMatchScoreResult {
  /** Overall match score (0-100) */
  score: number;
  /** Detailed score breakdown by category */
  breakdown: WeightedScoreBreakdown | null;
  /** Whether the calculation is loading */
  isLoading: boolean;
  /** Whether a job description is available */
  hasJobDescription: boolean;
  /** Keywords being analyzed */
  keywords: WeightedKeywordResult[];
  /** Full match result */
  result: MatchScoreResult | null;
}

/**
 * Hook to calculate match score between resume and job description
 *
 * @param options - Configuration options
 * @returns Match score data including breakdown and individual results
 */
export function useMatchScore(options: UseMatchScoreOptions = {}): UseMatchScoreResult {
  const { includeExperience = true } = options;
  
  const { resumeData } = useResume();
  const { currentJob } = useJob();

  const result = useMemo<MatchScoreResult | null>(() => {
    // Check if we have a job description
    if (!currentJob?.description) {
      return null;
    }

    // Extract keywords from job description
    // In a real implementation, this would use the JD parser to extract
    // keywords with weights. For now, we use extractedFields if available.
    const extractedFields = currentJob.extractedFields || [];
    
    // Convert extracted fields to keywords with weights
    // Skills have higher weight (0.8+), qualifications lower (0.5-0.7)
    const keywordsInput = extractedFields
      .filter((field) => field.fieldType === 'skill' || field.fieldType === 'requirement')
      .map((field) => {
        // Determine weight based on field type and confidence
        let weight = 0.5;
        if (field.fieldType === 'skill') {
          weight = field.confidence >= 0.8 ? 0.8 : 0.6;
        } else if (field.fieldType === 'requirement') {
          weight = field.confidence >= 0.7 ? 0.7 : 0.5;
        }
        
        return {
          keyword: field.value,
          weight,
          jdSection: field.sourceSection,
        };
      });

    // Convert resume data to plain text for matching
    const resumeText = [
      resumeData.summary,
      ...(resumeData.experience || []).flatMap((exp) => [
        exp.title,
        exp.company,
        ...(exp.bullets || []),
      ]),
      ...getSkillsText(resumeData.skills),
      ...(resumeData.projects || []).flatMap((p) => [p.name, p.description, ...(p.tech || []), ...(p.bullets || [])]),
      ...(resumeData.education || []).flatMap((e) => [e.school, e.degree, e.fieldOfStudy || '']),
      ...(resumeData.achievements || []).flatMap((a) => [a.title, a.description]),
      ...(resumeData.certifications || []).flatMap((c) => [c.name, c.issuer || '']),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    // Calculate weighted keywords
    const keywordResults = calculateWeightedKeywords(keywordsInput, resumeText);
    
    // Calculate breakdown
    const breakdown = calculateBreakdown(keywordResults);
    
    // Experience score (15% of total)
    let experienceScore = 0;
    if (includeExperience) {
      const experienceText = (resumeData.experience || [])
        .map((e) => `${e.title} ${e.company} ${e.bullets?.join(' ') || ''}`)
        .join(' ');
      experienceScore = calculateExperienceScore(experienceText, currentJob.description);
    }

    // Calculate overall score
    const overallScore = calculateOverallScore(breakdown, experienceScore);

    return {
      breakdown,
      keywords: keywordResults,
      overallScore,
      experienceScore,
    };
  }, [resumeData, currentJob, includeExperience]);

  return {
    score: result?.overallScore ?? 0,
    breakdown: result?.breakdown ?? null,
    isLoading: false,
    hasJobDescription: Boolean(currentJob?.description),
    keywords: result?.keywords ?? [],
    result,
  };
}

/**
 * Extract skills text from various skills formats
 */
function getSkillsText(
  skills: ResumeData['skills']
): string[] {
  if (!skills) return [];
  
  // Handle array format
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

export default useMatchScore;
