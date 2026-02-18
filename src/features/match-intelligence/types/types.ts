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
 * F-pattern reading zone (legacy)
 */
export type FPatternZone = 'top-left' | 'top-right' | 'middle-left' | 'middle-right' | 'bottom-left' | 'bottom-right';

/**
 * Section position data from resume layout
 */
export interface SectionPosition {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'custom';
  top: number;      // Percentage from top (0-100)
  left: number;    // Percentage from left (0-100)
  height: number;  // Percentage height (0-100)
  width: number;   // Percentage width (0-100)
}

/**
 * Detailed heatmap zone for F-pattern visualization
 */
export interface HeatmapZoneDetailed {
  id: string;
  resumeSection: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  attention: number;  // 0-1 normalized
  label: string;
  color: string;
  attentionSeconds?: number;
}

/**
 * Alias for backward compatibility - use detailed type now
 */
export type { HeatmapZoneDetailed as HeatmapZone };

/**
 * Skill cluster category (string literal)
 */
export type SkillClusterCategory = 'technical' | 'tools' | 'concepts' | 'soft';

/**
 * Heatmap analysis result
 */
export interface HeatmapAnalysis {
  zone: FPatternZone;
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

/**
 * Skill category type
 */
export type SkillCategory = 'technical' | 'tools' | 'concepts' | 'soft';

/**
 * Clustered skill group with metadata
 */
export interface SkillCluster {
  id: string;
  category: SkillCategory;
  label: string;
  icon?: string;
  required: MatchedSkill[];
  preferred: MatchedSkill[];
  coverage: number;
}

/**
 * Competency gap with importance ranking
 */
export interface CompetencyGap {
  skill: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  weight: number;
  category: string;
  isRequired: boolean;
  recommendation: string;
  difficulty: 'easy' | 'moderate' | 'hard';
}

/**
 * Impact recommendation for improvements
 */
export interface ImpactRecommendation {
  id: string;
  type: 'add_skill' | 'enhance_skill' | 'add_keyword' | 'improve_format';
  impact: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  specificAction: string;
  expectedScoreImprovement: number;
}

/**
 * Full competency gap analysis result
 */
export interface CompetencyGapAnalysis {
  gaps: CompetencyGap[];
  totalCritical: number;
  totalHigh: number;
  totalMedium: number;
  totalLow: number;
  overallGapScore: number;
  prioritizedRecommendations: ImpactRecommendation[];
}

// --- Semantic Similarity Types ---

/**
 * Semantic score interpretation levels
 */
export type SemanticInterpretation = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * Section-level similarity scores
 */
export interface SectionScores {
  summary: number;
  experience: number;
  skills: number;
  education: number;
}

/**
 * Semantic similarity score result
 */
export interface SemanticScore {
  /** Overall similarity score (0-100) */
  overall: number;
  /** Per-section similarity breakdown */
  bySection: SectionScores;
  /** Interpretation label based on score */
  interpretation: SemanticInterpretation;
}
