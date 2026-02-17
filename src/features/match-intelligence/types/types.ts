/**
 * Match Intelligence Types
 *
 * TypeScript type definitions for weighted keyword scoring and match analysis.
 * Used across the match-intelligence feature for scoring resume-JD matches.
 */

// --- Weight Types ---

/** Weight classification for keywords */
export type WeightType = 'required' | 'preferred' | 'bonus';

/** Match status for individual keywords */
export type MatchStatus = 'matched' | 'partial' | 'missing';

// --- Core Result Types ---

/**
 * Result for a single weighted keyword
 */
export interface WeightedKeywordResult {
  /** The keyword from the job description */
  keyword: string;
  /** Classification of this keyword's importance */
  weightType: WeightType;
  /** Base weight based on weightType (0.50, 0.25, or 0.10) */
  baseWeight: number;
  /** Actual weight considering user-defined weight multiplier */
  actualWeight: number;
  /** Current match status */
  status: MatchStatus;
  /** Score contribution from this keyword (0-100) */
  matchScore: number;
  /** Locations in resume where keyword was found */
  locations: string[];
  /** Source JD section where keyword was extracted */
  sourceJD: string;
}

/**
 * Score breakdown by category
 */
export interface WeightedScoreBreakdown {
  /** Required skills category (50% weight) */
  requiredSkills: {
    total: number;
    matched: number;
    score: number;
    maxScore: number;
  };
  /** Preferred skills category (25% weight) */
  preferredSkills: {
    total: number;
    matched: number;
    score: number;
    maxScore: number;
  };
  /** Bonus skills category (10% weight) */
  bonusSkills: {
    total: number;
    matched: number;
    score: number;
    maxScore: number;
  };
  /** Overall aggregate scores */
  overall: {
    score: number;
    maxScore: number;
    percentage: number;
  };
}

/**
 * Matched skill with detailed status
 */
export interface MatchedSkill {
  /** Skill name */
  name: string;
  /** Current match status */
  status: MatchStatus;
  /** Weight contribution */
  weight: number;
  /** Whether skill exists in resume */
  inResume: boolean;
  /** Locations in resume where skill was found */
  resumeLocations?: string[];
}

/**
 * Main match score result combining all analysis
 */
export interface MatchScoreResult {
  /** Detailed score breakdown by category */
  breakdown: WeightedScoreBreakdown;
  /** Individual keyword results */
  keywords: WeightedKeywordResult[];
  /** Overall weighted match score (0-100) */
  overallScore: number;
  /** Experience match score (0-15) */
  experienceScore: number;
}

// --- Input Types ---

/**
 * Input keyword with weight for scoring
 */
export interface KeywordInput {
  keyword: string;
  weight: number;
  jdSection: string;
}

/**
 * Configuration options for match score calculation
 */
export interface MatchScoreOptions {
  /** Include experience matching (15% of total) */
  includeExperience?: boolean;
  /** Enable partial matching (substring) */
  enablePartialMatch?: boolean;
  /** Minimum match threshold (0-1) */
  minMatchThreshold?: number;
}

// --- F-Pattern Heatmap Types ---

/**
 * F-pattern reading zone
 */
export type HeatmapZone = 'top-left' | 'top-right' | 'middle-left' | 'middle-right' | 'bottom-left' | 'bottom-right';

/**
 * Skill cluster category
 */
export type SkillCluster = 'technical' | 'tools' | 'concepts' | 'soft';

/**
 * Heatmap analysis result
 */
export interface HeatmapAnalysis {
  zone: HeatmapZone;
  keywordDensity: number;
  readingProbability: number;
}

// --- Skill Cluster Types ---

/**
 * Clustered skills by category
 */
export interface SkillClusterResult {
  technical: MatchedSkill[];
  tools: MatchedSkill[];
  concepts: MatchedSkill[];
  soft: MatchedSkill[];
}
