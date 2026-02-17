/**
 * ATS Simulation Scoring Types
 *
 * Type definitions for ATS scoring system with weighted categories.
 * Implements the 40/30/20/10 scoring breakdown:
 * - Parsing: 40% (section extraction accuracy)
 * - Keywords: 30% (JD keyword matching)
 * - Format: 20% (ATS-friendly formatting)
 * - Layout: 10% (visual structure risks)
 *
 * @module ats-simulation/types/scoring
 */

import type { PlatformType } from './platform.types';

/**
 * Score categories with their respective weights.
 * Weights sum to 100 for consistent percentage calculations.
 *
 * @example
 * ```typescript
 * const categoryWeight = ScoreCategory.PARSING; // 40
 * ```
 */
export enum ScoreCategory {
  /** Section extraction accuracy - most critical for ATS parsing */
  PARSING = 40,

  /** JD keyword matching and semantic relevance */
  KEYWORDS = 30,

  /** Format compliance (dates, structure, standard sections) */
  FORMAT = 20,

  /** Layout risks (tables, columns, headers) - visual elements */
  LAYOUT = 10,
}

/**
 * Risk severity levels for identifying parsing dangers.
 * Used for prioritizing issues and user attention.
 */
export enum RiskLevel {
  /** Blocks parsing entirely - immediate fix required */
  CRITICAL = 'critical',

  /** Significant parsing degradation - should fix */
  HIGH = 'high',

  /** Minor parsing impact - nice to fix */
  MEDIUM = 'medium',

  /** Minimal impact - informational only */
  LOW = 'low',

  /** No risk detected */
  NONE = 'none',
}

/**
 * Individual score within a category with detailed breakdown.
 * Tracks both raw score and weighted contribution to overall score.
 */
export interface CategoryScore {
  /** Raw score for this category (0-100) */
  score: number;

  /** Weight of this category in overall calculation (0-100) */
  weight: number;

  /** Weighted contribution to overall score (score * weight / 100) */
  weightedContribution: number;

  /** Issues that affected this category's score */
  issues: ScoreIssue[];
}

/**
 * Detailed issue affecting a score category.
 * Provides actionable feedback for improvement.
 */
export interface ScoreIssue {
  /** Severity level of the issue */
  severity: 'critical' | 'high' | 'medium' | 'low';

  /** Category this issue belongs to */
  category: ScoreCategory;

  /** Human-readable description of the issue */
  message: string;

  /** Actionable suggestion for fixing */
  suggestion: string;

  /** Which ATS platforms are affected by this issue */
  affectedPlatforms: PlatformType[];
}

/**
 * Factor contributing to confidence calculation.
 * Each factor has a weight and score that combine into overall confidence.
 */
export interface ConfidenceFactor {
  /** Type of confidence factor */
  type: ConfidenceFactorType;

  /** Weight of this factor in overall confidence (0-1) */
  weight: number;

  /** Score for this factor (0-100) */
  score: number;

  /** Human-readable description of this factor's assessment */
  description: string;
}

/**
 * Types of factors that contribute to confidence scoring.
 */
export type ConfidenceFactorType =
  | 'pattern_match'      // Regex or pattern matching confidence
  | 'context_proximity'  // Nearby contextual clues
  | 'format_validity'    // Whether extracted format is valid
  | 'section_boundary';  // Confidence in section boundaries

/**
 * Comprehensive confidence score with factor breakdown.
 * Used for extracted fields and sections to indicate reliability.
 */
export interface ConfidenceScore {
  /** Overall confidence (0-100) */
  overall: number;

  /** Individual factors contributing to confidence */
  factors: ConfidenceFactor[];

  /** Human-readable explanation of confidence assessment */
  reasoning: string;
}

/**
 * Layout-related risk that may cause ATS parsing issues.
 * Visual elements like tables and columns often confuse parsers.
 */
export interface LayoutRisk {
  /** Type of layout element causing risk */
  type: LayoutRiskType;

  /** Severity of the risk */
  severity: RiskLevel;

  /** CSS selector or element identifier */
  element: string;

  /** Human-readable description of the risk */
  message: string;

  /** Which platforms are affected (empty = all) */
  platformsAffected: PlatformType[];
}

/**
 * Types of layout elements that can cause ATS parsing issues.
 */
export type LayoutRiskType =
  | 'table'      // Tables often lose structure when parsed
  | 'column'     // Multi-column layouts may be read out of order
  | 'header'     // Headers/footers may be prepended/appended unexpectedly
  | 'footer'     // Footer content may be concatenated with main content
  | 'text_box'   // Text boxes may be ignored or mangled
  | 'graphic';   // Graphics/images with text are invisible to ATS

/**
 * Complete ATS score with weighted breakdown.
 * Primary result type from ATS simulation.
 *
 * @example
 * ```typescript
 * const score: ATSScore = {
 *   overall: 78,
 *   breakdown: {
 *     [ScoreCategory.PARSING]: { score: 85, weight: 40, weightedContribution: 34, issues: [] },
 *     [ScoreCategory.KEYWORDS]: { score: 70, weight: 30, weightedContribution: 21, issues: [] },
 *     [ScoreCategory.FORMAT]: { score: 90, weight: 20, weightedContribution: 18, issues: [] },
 *     [ScoreCategory.LAYOUT]: { score: 50, weight: 10, weightedContribution: 5, issues: [] }
 *   },
 *   timestamp: Date.now(),
 *   version: '2.0.0'
 * };
 * // Total: 34 + 21 + 18 + 5 = 78
 * ```
 */
export interface ATSScore {
  /** Overall weighted score (0-100) */
  overall: number;

  /** Score breakdown by category */
  breakdown: Record<ScoreCategory, CategoryScore>;

  /** When the score was calculated */
  timestamp: number;

  /** Version of the scoring algorithm */
  version: string;
}

/**
 * Badge levels for displaying ATS compatibility visually.
 * Based on overall score ranges.
 */
export type ATSBadgeLevel = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * Score range configuration for badge assignment.
 */
export interface ScoreRange {
  /** Minimum score for this range (inclusive) */
  min: number;

  /** Maximum score for this range (exclusive, except for 100) */
  max: number;

  /** Badge level for this range */
  label: ATSBadgeLevel;

  /** Display color for this range */
  color: string;

  /** Human-readable description */
  description: string;
}

/**
 * Default score ranges for badge assignment.
 * 95-100: Excellent (green)
 * 85-95: Good (blue)
 * 70-85: Fair (yellow)
 * 0-70: Poor (red)
 */
export const DEFAULT_SCORE_RANGES: ScoreRange[] = [
  { min: 95, max: 100, label: 'excellent', color: '#22c55e', description: 'ATS-optimized' },
  { min: 85, max: 95, label: 'good', color: '#3b82f6', description: 'Likely to parse well' },
  { min: 70, max: 85, label: 'fair', color: '#eab308', description: 'Some parsing risks' },
  { min: 0, max: 70, label: 'poor', color: '#ef4444', description: 'Significant issues' },
];

/**
 * Get badge level for a given score.
 * @param score - Overall ATS score (0-100)
 * @returns Badge level classification
 */
export function getBadgeLevel(score: number): ATSBadgeLevel {
  if (score >= 95) return 'excellent';
  if (score >= 85) return 'good';
  if (score >= 70) return 'fair';
  return 'poor';
}

/**
 * Calculate overall score from category scores using weights.
 * @param breakdown - Record of category scores
 * @returns Weighted overall score (0-100)
 */
export function calculateOverallScore(
  breakdown: Record<ScoreCategory, CategoryScore>
): number {
  let total = 0;
  for (const categoryScore of Object.values(breakdown)) {
    total += categoryScore.weightedContribution;
  }
  return Math.round(total);
}
