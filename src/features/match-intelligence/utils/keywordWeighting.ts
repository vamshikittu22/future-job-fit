/**
 * Keyword Weighting Utilities
 *
 * Weighted keyword scoring algorithm for match intelligence.
 * Implements 50/25/15/10 formula: 50% required, 25% preferred, 15% experience, 10% keywords bonus.
 */

import type {
  WeightedKeywordResult,
  WeightedScoreBreakdown,
  WeightType,
  MatchStatus,
  KeywordInput,
} from '../types';

// --- Constants ---

/** Base weights for each weight type */
const WEIGHTS: Record<WeightType, number> = {
  required: 0.50,
  preferred: 0.25,
  bonus: 0.10,
};

/** Known abbreviations/variations for partial matching */
const KEYWORD_VARIATIONS: Array<{ short: string; long: string }> = [
  { short: 'js', long: 'javascript' },
  { short: 'ts', long: 'typescript' },
  { short: 'py', long: 'python' },
  { short: 'ai', long: 'artificial intelligence' },
  { short: 'ml', long: 'machine learning' },
  { short: 'nlp', long: 'natural language processing' },
  { short: 'cv', long: 'computer vision' },
  { short: 'db', long: 'database' },
  { short: 'sql', long: 'structured query language' },
  { short: 'rest', long: 'representational state transfer' },
  { short: 'api', long: 'application programming interface' },
  { short: 'ci', long: 'continuous integration' },
  { short: 'cd', long: 'continuous deployment' },
  { short: 'devops', long: 'development operations' },
  { short: 'ui', long: 'user interface' },
  { short: 'ux', long: 'user experience' },
];

// --- Helper Functions ---

/**
 * Normalize a string for matching (lowercase, trim)
 */
function normalize(str: string): string {
  return str.toLowerCase().trim();
}

/**
 * Check if a keyword matches with partial/variation support
 */
export function isKeywordMatched(keyword: string, resumeText: string): boolean {
  const normKeyword = normalize(keyword);
  const normResume = normalize(resumeText);

  // Exact match
  if (normResume.includes(normKeyword)) return true;

  // Partial match: keyword is substring of resume
  if (normResume.length >= normKeyword.length && normResume.includes(normKeyword)) {
    return true;
  }

  // Check known abbreviations/variations
  for (const variation of KEYWORD_VARIATIONS) {
    // Short form matches long form in resume
    if (normKeyword === variation.short && normResume.includes(variation.long)) {
      return true;
    }
    // Long form matches short form in resume
    if (normKeyword === variation.long && normResume.includes(variation.short)) {
      return true;
    }
    // Bidirectional partial matching
    if (
      (normKeyword.includes(variation.short) && normResume.includes(variation.long)) ||
      (normKeyword.includes(variation.long) && normResume.includes(variation.short))
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Determine match status based on keyword and resume
 */
export function getMatchStatus(keyword: string, resumeText: string): MatchStatus {
  const normKeyword = normalize(keyword);
  const normResume = normalize(resumeText);

  if (normResume.includes(normKeyword)) return 'matched';
  if (isKeywordMatched(keyword, resumeText)) return 'partial';
  return 'missing';
}

/**
 * Determine weight type based on keyword weight value
 */
export function getWeightType(baseWeight: number): WeightType {
  if (baseWeight >= 0.7) return 'required';
  if (baseWeight >= 0.4) return 'preferred';
  return 'bonus';
}

/**
 * Calculate match score for a single keyword
 */
function calculateKeywordScore(status: MatchStatus, baseWeight: number): number {
  if (status === 'matched') {
    return baseWeight * 100; // Full points
  } else if (status === 'partial') {
    return baseWeight * 50; // Half points for partial match
  }
  return 0; // No points for missing
}

// --- Main Functions ---

/**
 * Calculate weighted keywords from job description keywords vs resume
 *
 * @param keywords - Array of keywords with weights from JD
 * @param resumeText - Plain text of resume for matching
 * @returns Array of WeightedKeywordResult
 */
export function calculateWeightedKeywords(
  keywords: KeywordInput[],
  resumeText: string
): WeightedKeywordResult[] {
  return keywords.map((kw) => {
    const status = getMatchStatus(kw.keyword, resumeText);
    const weightType = getWeightType(kw.weight);
    const baseWeight = WEIGHTS[weightType];

    const matchScore = calculateKeywordScore(status, baseWeight);

    // Find locations in resume where keyword appears
    const locations: string[] = [];
    if (status !== 'missing') {
      // Simple location detection - would need more sophisticated parsing
      // for production use (section detection, etc.)
      locations.push('resume_content');
    }

    return {
      keyword: kw.keyword,
      weightType,
      baseWeight,
      actualWeight: baseWeight * kw.weight,
      status,
      matchScore,
      locations,
      sourceJD: kw.jdSection,
    };
  });
}

/**
 * Calculate score breakdown by category
 *
 * @param results - Array of weighted keyword results
 * @returns WeightedScoreBreakdown with category scores
 */
export function calculateBreakdown(results: WeightedKeywordResult[]): WeightedScoreBreakdown {
  const required = results.filter((r) => r.weightType === 'required');
  const preferred = results.filter((r) => r.weightType === 'preferred');
  const bonus = results.filter((r) => r.weightType === 'bonus');

  // Calculate score as percentage of matched keywords within category
  // multiplied by the category weight (50% for required, 25% for preferred, 10% for bonus)
  // This gives us the category's contribution to the overall score
  const getScore = (items: WeightedKeywordResult[], weightType: WeightType): number => {
    if (items.length === 0) return 0;
    
    const matchedItems = items.filter((r) => r.status === 'matched');
    const matchedCount = matchedItems.length;
    const totalCount = items.length;
    
    // Calculate percentage of matched keywords
    const matchPercentage = (matchedCount / totalCount) * 100;
    
    // Multiply by category weight to get contribution to overall score
    return matchPercentage * WEIGHTS[weightType];
  };

  const getMax = (items: WeightedKeywordResult[]): number => {
    if (items.length === 0) return 0;
    return items.length * 100 * WEIGHTS.required; // Max is 100% * weight
  };

  const overall = getScore(results, 'required') + getScore(results, 'preferred') + getScore(results, 'bonus');
  const maxOverall = 50 + 25 + 10; // 85 total max from keywords

  return {
    requiredSkills: {
      total: required.length,
      matched: required.filter((r) => r.status === 'matched').length,
      score: getScore(required, 'required'),
      maxScore: getMax(required),
    },
    preferredSkills: {
      total: preferred.length,
      matched: preferred.filter((r) => r.status === 'matched').length,
      score: getScore(preferred, 'preferred'),
      maxScore: getMax(preferred),
    },
    bonusSkills: {
      total: bonus.length,
      matched: bonus.filter((r) => r.status === 'matched').length,
      score: getScore(bonus, 'bonus'),
      maxScore: getMax(bonus),
    },
    overall: {
      score: overall,
      maxScore: maxOverall,
      percentage: maxOverall > 0 ? (overall / maxOverall) * 100 : 0,
    },
  };
}

/**
 * Calculate experience match score (15% of total)
 *
 * @param resumeExperience - Text from resume experience section
 * @param jdExperience - Text from job description experience requirements
 * @returns Score from 0-15
 */
export function calculateExperienceScore(
  resumeExperience: string,
  jdExperience: string
): number {
  // Extract years mentioned in resume
  const resumeYearsMatch = resumeExperience.match(/\d+\+?\s*(?:years?|yrs?)/gi);
  const resumeYears = resumeYearsMatch
    ? resumeYearsMatch.reduce((total, match) => {
        const num = parseInt(match.match(/\d+/)?.[0] || '0', 10);
        return total + num;
      }, 0)
    : 0;

  // Extract years required in JD
  const jdYearsMatch = jdExperience.match(/\d+\+?\s*(?:years?|yrs?)/gi);
  const jdYears = jdYearsMatch
    ? jdYearsMatch.reduce((total, match) => {
        const num = parseInt(match.match(/\d+/)?.[0] || '0', 10);
        return total + num;
      }, 0)
    : 0;

  // Score based on experience match
  if (jdYears === 0) return 15; // No requirement = full points
  if (resumeYears >= jdYears) return 15; // Meets or exceeds = full points
  if (resumeYears >= jdYears * 0.5) return 10; // At least 50% = 10 points
  if (resumeYears > 0) return 5; // Has some experience = 5 points
  return 0; // No experience = 0 points
}

/**
 * Calculate overall match score combining all components
 *
 * @param breakdown - Score breakdown from calculateBreakdown
 * @param experienceScore - Experience score from calculateExperienceScore
 * @returns Final score (0-100)
 */
export function calculateOverallScore(
  breakdown: WeightedScoreBreakdown,
  experienceScore: number
): number {
  // Weighted component: 75% from required/preferred/bonus (50+25+10=85, but normalized to 75)
  // Actually: required(50) + preferred(25) + bonus(10) = 85 total base
  // But we want: keywords = 75%, experience = 15%, bonus keywords = 10%
  // Let's recalculate:
  // - Required skills: 50% of total
  // - Preferred skills: 25% of total
  // - Bonus/Keywords: 10% of total (from the 10% keyword component)
  // - Experience: 15% of total

  const keywordComponent = breakdown.overall.percentage * 0.75; // 75% weight for keywords
  const experienceComponent = experienceScore; // Already 0-15 (15% of 100)

  const overallScore = Math.min(100, keywordComponent + experienceComponent);

  return Math.round(overallScore * 100) / 100; // Round to 2 decimal places
}

// --- Export index for convenience ---
export * from '../types';
