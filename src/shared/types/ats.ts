/**
 * ATS Engine Domain Types
 * 
 * Shared type definitions for the deterministic, explainable ATS scoring system.
 * Used across offline Python parser, Supabase Edge Function, and frontend hooks.
 */

// --- Enums & Literal Types ---

/** Category for JD keywords */
export type KeywordCategory = 'hard_skill' | 'tool' | 'concept' | 'soft_skill';

/** Match status between JD keyword and resume content */
export type MatchStatus = 'matched' | 'partial' | 'missing';

/** Recommendation severity levels */
export type RecommendationSeverity = 'info' | 'warning' | 'critical';

// --- Core Models ---

/**
 * Represents a keyword extracted from a job description
 */
export interface KeywordModel {
    /** The keyword or phrase */
    keyword: string;
    /** Category classification */
    category: KeywordCategory;
    /** Importance weight (higher = more important) */
    weight: number;
    /** How often this keyword appears in the JD */
    frequency: number;
    /** Which JD section this keyword came from */
    jdSection: string;
}

/**
 * Result of matching a JD keyword against resume content
 */
export interface MatchResultModel {
    /** The keyword being matched */
    keyword: string;
    /** Category of the keyword */
    category: KeywordCategory;
    /** Match status */
    status: MatchStatus;
    /** Resume locations where keyword was found (e.g., "experience:0:bullets:2") */
    locations: string[];
    /** Contribution to overall ATS score */
    scoreContribution: number;
}

/**
 * Breakdown of ATS score by category
 */
export interface ATSScoreBreakdown {
    /** Score for hard/technical skills (0-100) */
    hardSkillScore: number;
    /** Score for tools/technologies (0-100) */
    toolsScore: number;
    /** Score for domain concepts (0-100) */
    conceptScore: number;
    /** Score for role/title match (0-100) */
    roleTitleScore: number;
    /** Score for resume structure/formatting (0-100) */
    structureScore: number;
    /** Weighted total score (0-100) */
    total: number;
}

/**
 * Parsed job description model
 */
export interface JobDescriptionModel {
    /** Unique identifier */
    id: string;
    /** Original raw JD text */
    rawText: string;
    /** Extracted sections (requirements, responsibilities, etc.) */
    sections: Record<string, string>;
    /** Categorized and weighted keywords */
    categorizedKeywords: KeywordModel[];
}

/**
 * Actionable recommendation for improving resume
 */
export interface Recommendation {
    /** Unique identifier */
    id: string;
    /** Human-readable recommendation message */
    message: string;
    /** Severity level */
    severity: RecommendationSeverity;
    /** Target location in resume (e.g., "experience:0:bullets:2") */
    targetLocation?: string;
    /** Related keyword category */
    category?: KeywordCategory;
    /** Related keyword (if applicable) */
    keyword?: string;
}

/**
 * Complete ATS evaluation response
 */
export interface ATSEvaluationResponse {
    /** Parsed job description model */
    jdModel: JobDescriptionModel;
    /** Match results for each keyword */
    matchResults: MatchResultModel[];
    /** Score breakdown by category */
    scoreBreakdown: ATSScoreBreakdown;
    /** Actionable recommendations */
    recommendations: Recommendation[];
}

// --- Request Types ---

/**
 * Request payload for parsing a job description
 */
export interface ParseJDRequest {
    /** Raw job description text */
    rawText: string;
}

/**
 * Request payload for ATS evaluation
 */
export interface EvaluateATSRequest {
    /** Resume text (plain text format) */
    resumeText: string;
    /** Job description text */
    jobDescriptionText: string;
}

// --- Helper Types ---

/**
 * Section coverage statistics
 */
export interface SectionCoverage {
    /** Section identifier */
    sectionId: string;
    /** Number of keywords covered in this section */
    covered: number;
    /** Total keywords that could appear in this section */
    total: number;
    /** Coverage percentage (0-100) */
    percentage: number;
}

/**
 * Legacy ATS response (for backward compatibility)
 */
export interface LegacyATSResponse {
    score: number;
    matchRatio: number;
    matchingKeywords: string[];
    missing: string[];
    suggestions: string[];
    breakdown: {
        keywordMatch: number;
        formatScore: number;
        readability: number;
        actionVerbs: number;
    };
}
