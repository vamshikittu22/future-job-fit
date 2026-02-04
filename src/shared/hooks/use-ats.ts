import { useState, useEffect, useCallback, useMemo } from 'react';
import { ResumeData } from '@/shared/lib/initialData';
import { resumeAI } from '@/shared/api/resumeAI';
import { usePyNLP } from './usePyNLP';
import type {
  ATSScoreBreakdown,
  MatchResultModel,
  Recommendation,
  MatchStatus,
  ATSEvaluationResponse
} from '@/shared/types/ats';

// Legacy keywords for backward-compatible scoring when no JD is provided
const KEYWORDS = {
  technical: ['react', 'typescript', 'javascript', 'css', 'html', 'node.js', 'next.js', 'graphql', 'rest', 'api', 'git', 'webpack', 'babel', 'agile', 'tailwind'],
  actionVerbs: ['developed', 'led', 'managed', 'created', 'implemented', 'designed', 'architected', 'optimized', 'automated', 'streamlined'],
  degrees: ['bachelor', 'master', 'phd', 'mba', 'diploma', 'certification', 'certificate'],
};

const SCORING_WEIGHTS = {
  summaryKeywords: 15,
  skillsMatch: 25,
  experienceKeywords: 20,
  experienceImpact: 15,
  projectsKeywords: 10,
  educationRelevance: 5,
  achievements: 5,
  formatting: 5,
};

const countKeywords = (text: string, keywords: string[]): { count: number; matched: string[] } => {
  const lowerText = text.toLowerCase();
  const matched = keywords.filter(kw => new RegExp(`\\b${kw}\\b`, 'i').test(lowerText));
  return { count: matched.length, matched: Array.from(new Set(matched)) };
};

const checkQuantifiable = (text: string): boolean => /[\d%$x]/.test(text.toLowerCase());

/**
 * Convert ResumeData to plain text for ATS evaluation
 */
const resumeToText = (resumeData: ResumeData): string => {
  const parts: string[] = [];

  // Personal info
  if (resumeData.personal) {
    parts.push(`${resumeData.personal.name || ''}`);
    parts.push(`${resumeData.personal.email || ''}`);
  }

  // Summary
  if (resumeData.summary) {
    parts.push('SUMMARY', resumeData.summary);
  }

  // Experience
  if (resumeData.experience?.length) {
    parts.push('EXPERIENCE');
    resumeData.experience.forEach(exp => {
      parts.push(`${exp.title} at ${exp.company}`);
      const bullets = 'bullets' in exp ? exp.bullets || [] : [exp.description];
      bullets.forEach(b => parts.push(`• ${b}`));
    });
  }

  // Skills
  if (resumeData.skills) {
    parts.push('SKILLS');
    const skills = Array.isArray(resumeData.skills)
      ? resumeData.skills.flatMap(cat => cat.items || [])
      : Object.values(resumeData.skills).flat();
    parts.push(skills.join(', '));
  }

  // Education
  if (resumeData.education?.length) {
    parts.push('EDUCATION');
    resumeData.education.forEach(edu => {
      parts.push(`${edu.degree} - ${edu.school}`);
    });
  }

  return parts.join('\n');
};

export interface UseATSResult {
  // Core score (always available)
  atsScore: number;

  // Legacy analysis object
  analysis: {
    keywords: { matched: string[]; total: number };
    sections: Record<string, number>;
    suggestions: Array<{ text: string; priority: string }>;
  };

  // New structured outputs (available when JD is provided)
  atsScoreBreakdown?: ATSScoreBreakdown;
  matchResults?: MatchResultModel[];
  recommendations?: Recommendation[];

  // Status
  loading: boolean;
  error: string | null;

  // Helper selectors
  getKeywordsByStatus: (status: MatchStatus) => MatchResultModel[];
  getCoverageBySection: (sectionId: string) => { covered: number; total: number; percentage: number };
  getRecommendationsForLocation: (location: string) => Recommendation[];
}

/**
 * ATS Hook with support for both legacy and structured evaluation.
 * 
 * - When jobDescription is NOT provided: Uses legacy local scoring
 * - When jobDescription IS provided: Uses new structured ATS engine (offline or cloud)
 * 
 * @param resumeData - The resume data object
 * @param jobDescription - Optional job description text for JD-aware scoring
 * @param preferOffline - Prefer offline (Pyodide) evaluation over cloud
 */
export const useATS = (
  resumeData: ResumeData,
  jobDescription?: string,
  preferOffline: boolean = true
): UseATSResult => {
  const [atsScore, setAtsScore] = useState(0);
  const [analysis, setAnalysis] = useState<any>({
    keywords: { matched: [], total: KEYWORDS.technical.length },
    sections: {},
    suggestions: [],
  });

  // Structured ATS state (new)
  const [atsScoreBreakdown, setAtsScoreBreakdown] = useState<ATSScoreBreakdown | undefined>();
  const [matchResults, setMatchResults] = useState<MatchResultModel[] | undefined>();
  const [recommendations, setRecommendations] = useState<Recommendation[] | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pyNLP = usePyNLP();

  // ---------------------------
  // Structured ATS Evaluation (when JD is provided)
  // ---------------------------
  useEffect(() => {
    if (!resumeData || !jobDescription) {
      // Clear structured results when no JD
      setAtsScoreBreakdown(undefined);
      setMatchResults(undefined);
      setRecommendations(undefined);
      return;
    }

    const runStructuredEvaluation = async () => {
      setLoading(true);
      setError(null);

      try {
        const resumeText = resumeToText(resumeData);
        let result: ATSEvaluationResponse;

        // Prefer offline (Pyodide) if available and preferred
        if (preferOffline && pyNLP.isReady) {
          console.log('[useATS] Using offline (Pyodide) for structured evaluation');
          result = await pyNLP.evaluateATS(resumeText, jobDescription);
        } else {
          console.log('[useATS] Using cloud for structured evaluation');
          result = await resumeAI.evaluateATSCloud(resumeText, jobDescription);
        }

        // Update structured state
        setAtsScore(result.scoreBreakdown.total);
        setAtsScoreBreakdown(result.scoreBreakdown);
        setMatchResults(result.matchResults);
        setRecommendations(result.recommendations);

        // Also update legacy analysis for compatibility
        const matchedKeywords = result.matchResults
          .filter(r => r.status === 'matched')
          .map(r => r.keyword);
        const missingSuggestions = result.recommendations.map(rec => ({
          text: rec.message,
          priority: rec.severity === 'critical' ? 'high' : rec.severity === 'warning' ? 'medium' : 'low'
        }));

        setAnalysis({
          keywords: {
            matched: matchedKeywords,
            total: result.matchResults.length
          },
          sections: {
            hardSkills: result.scoreBreakdown.hardSkillScore,
            tools: result.scoreBreakdown.toolsScore,
            concepts: result.scoreBreakdown.conceptScore,
            roleTitle: result.scoreBreakdown.roleTitleScore,
            structure: result.scoreBreakdown.structureScore,
          },
          suggestions: missingSuggestions,
        });
      } catch (err: any) {
        console.error('[useATS] Structured evaluation failed:', err);
        setError(err.message || 'ATS evaluation failed');
        // Fall through to legacy scoring
      } finally {
        setLoading(false);
      }
    };

    runStructuredEvaluation();
  }, [resumeData, jobDescription, preferOffline, pyNLP.isReady]);

  // ---------------------------
  // Legacy Scoring (when no JD is provided)
  // ---------------------------
  useEffect(() => {
    if (!resumeData || jobDescription) return;

    let totalScore = 0;
    const newAnalysis: any = {
      keywords: { matched: [], total: KEYWORDS.technical.length },
      sections: {},
      suggestions: [],
    };

    // 1. Summary Analysis
    const summaryText = resumeData.summary || '';
    const summaryMatch = countKeywords(summaryText, [...KEYWORDS.technical, ...KEYWORDS.actionVerbs]);
    const summaryScore = Math.min((summaryMatch.count / 5) * SCORING_WEIGHTS.summaryKeywords, SCORING_WEIGHTS.summaryKeywords);
    totalScore += summaryScore;
    newAnalysis.keywords.matched.push(...summaryMatch.matched);
    newAnalysis.sections.summary = (summaryScore / SCORING_WEIGHTS.summaryKeywords) * 100;
    if (summaryMatch.count < 3) newAnalysis.suggestions.push({ text: 'Add more role-specific keywords to your summary.', priority: 'high' });
    if (summaryText.length < 50) newAnalysis.suggestions.push({ text: 'Expand summary to at least 50 characters.', priority: 'medium' });

    // 2. Skills Analysis
    const skills = resumeData.skills || [];
    let allSkills: string[] = [];

    if (Array.isArray(skills)) {
      allSkills = skills.flatMap(category =>
        Array.isArray(category.items) ? category.items : []
      );
    } else if (typeof skills === 'object' && skills !== null) {
      allSkills = Object.values(skills).flat();
    }

    const skillsMatch = countKeywords(allSkills.join(' '), KEYWORDS.technical);
    const skillsScore = (skillsMatch.count / KEYWORDS.technical.length) * SCORING_WEIGHTS.skillsMatch;
    totalScore += skillsScore;
    newAnalysis.keywords.matched.push(...skillsMatch.matched);
    newAnalysis.sections.skills = (skillsScore / SCORING_WEIGHTS.skillsMatch) * 100;
    if (skillsMatch.count < KEYWORDS.technical.length / 2) {
      newAnalysis.suggestions.push({
        text: 'Add more technical skills relevant to the job description.',
        priority: 'high'
      });
    }

    // 3. Experience Analysis
    let experienceKeywordCount = 0;
    let quantifiableBullets = 0;
    const uniqueVerbs: string[] = [];
    (resumeData.experience || []).forEach(exp => {
      const bullets = 'bullets' in exp ? exp.bullets || [] : [exp.description];
      const expTech = 'technologies' in exp ? exp.technologies : (exp as any).tech || [];
      const expText = [exp.title, exp.company, ...expTech, ...bullets].join(' ');
      const expMatch = countKeywords(expText, [...KEYWORDS.technical, ...KEYWORDS.actionVerbs]);
      experienceKeywordCount += expMatch.count;
      bullets.forEach(b => { if (checkQuantifiable(b)) quantifiableBullets++; });
      uniqueVerbs.push(...countKeywords(bullets.join(' '), KEYWORDS.actionVerbs).matched);
    });
    const experienceKeywordScore = Math.min((experienceKeywordCount / 10) * SCORING_WEIGHTS.experienceKeywords, SCORING_WEIGHTS.experienceKeywords);
    const experienceImpactScore = ((quantifiableBullets / (resumeData.experience?.length || 1)) / 2) * SCORING_WEIGHTS.experienceImpact;
    totalScore += experienceKeywordScore + experienceImpactScore;
    newAnalysis.sections.experience = ((experienceKeywordScore + experienceImpactScore) / (SCORING_WEIGHTS.experienceKeywords + SCORING_WEIGHTS.experienceImpact)) * 100;

    // 4. Projects Analysis
    let projectKeywordCount = 0;
    (resumeData.projects || []).forEach(proj => {
      const projTech = 'technologies' in proj ? proj.technologies : (proj as any).tech || [];
      const projText = [proj.name, proj.role || '', proj.description, ...projTech].join(' ');
      const projMatch = countKeywords(projText, [...KEYWORDS.technical, ...KEYWORDS.actionVerbs]);
      projectKeywordCount += projMatch.count;

      const bullets = 'bullets' in proj ? proj.bullets || [] : [proj.description];
      bullets.forEach(b => { if (checkQuantifiable(b)) quantifiableBullets++; });
    });

    const projectsScore = Math.min((projectKeywordCount / 5) * SCORING_WEIGHTS.projectsKeywords, SCORING_WEIGHTS.projectsKeywords);
    totalScore += projectsScore;
    newAnalysis.sections.projects = (projectsScore / SCORING_WEIGHTS.projectsKeywords) * 100;

    // 5. Education
    const educationText = (resumeData.education || [])
      .map(edu => [
        edu.degree,
        edu.school,
        edu.fieldOfStudy || (edu as any).field || '',
        edu.description || ''
      ].join(' '))
      .join(' ');
    const educationMatch = countKeywords(educationText, KEYWORDS.degrees);
    const educationScore = (educationMatch.count / 2) * SCORING_WEIGHTS.educationRelevance;
    totalScore += educationScore;
    newAnalysis.sections.education = (educationScore / SCORING_WEIGHTS.educationRelevance) * 100;
    if (educationMatch.count === 0) newAnalysis.suggestions.push({ text: 'Add relevant degrees or certifications.', priority: 'medium' });

    // 6. Achievements / Certifications
    let achievementCount = 0;
    (resumeData.achievements || []).forEach(ach => {
      const achText = [ach.title, ach.issuer || '', ach.description].join(' ');
      const achMatch = countKeywords(achText, [...KEYWORDS.degrees, ...KEYWORDS.actionVerbs]);
      achievementCount += achMatch.count;
    });

    const achievementsScore = Math.min((achievementCount / 5) * SCORING_WEIGHTS.achievements, SCORING_WEIGHTS.achievements);
    totalScore += achievementsScore;
    newAnalysis.sections.achievements = (achievementsScore / SCORING_WEIGHTS.achievements) * 100;
    if (achievementCount === 0) newAnalysis.suggestions.push({ text: 'Add notable achievements or certifications.', priority: 'medium' });

    // 7. Formatting
    let formattingScore = SCORING_WEIGHTS.formatting;
    if (!resumeData.summary) formattingScore -= 3;
    if ((resumeData.experience || []).length === 0) formattingScore -= 4;

    const hasSkills = Array.isArray(resumeData.skills)
      ? resumeData.skills.length > 0
      : resumeData.skills && (
        (resumeData.skills.languages?.length || 0) > 0 ||
        (resumeData.skills.frameworks?.length || 0) > 0 ||
        (resumeData.skills.tools?.length || 0) > 0
      );
    if (!hasSkills) formattingScore -= 3;
    totalScore += Math.max(0, formattingScore);

    newAnalysis.keywords.matched = Array.from(new Set(newAnalysis.keywords.matched));
    setAtsScore(Math.min(100, Math.round(totalScore)));
    setAnalysis(newAnalysis);

  }, [resumeData, jobDescription]);

  // ---------------------------
  // Helper Selectors
  // ---------------------------

  const getKeywordsByStatus = useCallback((status: MatchStatus): MatchResultModel[] => {
    if (!matchResults) return [];
    return matchResults.filter(r => r.status === status);
  }, [matchResults]);

  const getCoverageBySection = useCallback((sectionId: string): { covered: number; total: number; percentage: number } => {
    if (!matchResults) return { covered: 0, total: 0, percentage: 0 };

    const sectionKeywords = matchResults.filter(r =>
      r.locations.some(loc => loc.startsWith(sectionId))
    );
    const covered = sectionKeywords.filter(r => r.status === 'matched').length;
    const total = sectionKeywords.length;

    return {
      covered,
      total,
      percentage: total > 0 ? Math.round((covered / total) * 100) : 0
    };
  }, [matchResults]);

  const getRecommendationsForLocation = useCallback((location: string): Recommendation[] => {
    if (!recommendations) return [];
    return recommendations.filter(rec => rec.targetLocation === location);
  }, [recommendations]);

  return {
    atsScore,
    analysis,
    atsScoreBreakdown,
    matchResults,
    recommendations,
    loading,
    error,
    getKeywordsByStatus,
    getCoverageBySection,
    getRecommendationsForLocation,
  };
};
