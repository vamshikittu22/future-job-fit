/**
 * ATS Simulation Engine Types - Barrel Export
 *
 * Central export point for all ATS Simulation 2.0 type definitions.
 * This module provides comprehensive TypeScript types for:
 *
 * - Section parsing and field extraction (@see parser.types)
 * - Scoring with weighted categories (@see scoring.types)
 * - Platform simulation (@see platform.types)
 *
 * ## Architecture Overview
 *
 * The type system is designed to support:
 * 1. **Section Parsing**: Extract structured data from resume sections
 * 2. **Confidence Scoring**: Assess extraction reliability with factor breakdown
 * 3. **Layout Detection**: Identify ATS-risky elements (tables, columns)
 * 4. **Platform Simulation**: Model different ATS behaviors (Workday, Taleo, etc.)
 * 5. **Risk Reporting**: Generate comprehensive ATS compatibility reports
 *
 * ## Score Weights (40/30/20/10)
 *
 * - Parsing: 40% - Section extraction accuracy
 * - Keywords: 30% - JD keyword matching
 * - Format: 20% - ATS-friendly formatting
 * - Layout: 10% - Visual structure risks
 *
 * ## Platform Quirks (Research-Based)
 *
 * - Workday: 40% table penalty, strict headers
 * - Taleo: 50% column penalty, date format strict
 * - Greenhouse: Flexible parsing, moderate penalties
 * - Lever: Semantic detection, modern engine
 *
 * @module ats-simulation/types
 * @version 2.0.0
 */

// ============================================================================
// Parser Types - Section and field extraction
// ============================================================================

export {
  // Enums
  SectionType,
  // Types
  type FieldType,
  type DateFormat,
  // Interfaces
  type DateRange,
  type FieldExtraction,
  type ExtractedSection,
  type ParsedResume,
  type ParserConfig,
  // Type guards
  isSectionType,
  isFieldType,
  isDateFormat,
} from './parser.types';

// ============================================================================
// Scoring Types - Weighted scoring and confidence
// ============================================================================

export {
  // Enums
  ScoreCategory,
  RiskLevel,
  // Types
  type ConfidenceFactorType,
  type LayoutRiskType,
  type ATSBadgeLevel,
  // Interfaces
  type CategoryScore,
  type ScoreIssue,
  type ConfidenceFactor,
  type ConfidenceScore,
  type LayoutRisk,
  type ATSScore,
  type ScoreRange,
  // Constants
  DEFAULT_SCORE_RANGES,
  // Functions
  getBadgeLevel,
  calculateOverallScore,
} from './scoring.types';

// ============================================================================
// Platform Types - ATS platform simulation
// ============================================================================

export {
  // Enums
  PlatformType,
  // Interfaces
  type PlatformQuirks,
  type ParsedResumeResult,
  type DataLossWarning,
  type ParsingError,
  type PlatformScore,
  type PlatformSimulator,
  type PlatformConfig,
  // Constants
  DEFAULT_PLATFORM_CONFIGS,
  SUPPORTED_PLATFORMS,
  // Functions
  isPlatformType,
  getPlatformConfig,
} from './platform.types';

// ============================================================================
// Shared Utility Types
// ============================================================================

import type { ScoreCategory } from './scoring.types';
import type { CategoryScore } from './scoring.types';
import type { PlatformScore } from './platform.types';
import type { LayoutRisk } from './scoring.types';
import type { ExtractedSection } from './parser.types';
import { PlatformType } from './platform.types';
import type { DataLossWarning } from './platform.types';
import type { ScoreIssue } from './scoring.types';
import type { ATSBadgeLevel } from './scoring.types';
import type { ScoreRange } from './scoring.types';
import type { PlatformConfig } from './platform.types';
import type { SectionType } from './parser.types';
import { DEFAULT_PLATFORM_CONFIGS } from './platform.types';

/**
 * Complete ATS risk report combining all analysis results.
 * This is the primary output type for the ATS simulation engine.
 */
export interface ATSRiskReport {
  /** Unique identifier for this report */
  id: string;

  /** When the report was generated */
  timestamp: number;

  /** Overall ATS compatibility score (0-100) */
  overallScore: number;

  /** Badge level based on score */
  badgeLevel: ATSBadgeLevel;

  /** Score breakdown by category */
  categoryScores: Record<ScoreCategory, CategoryScore>;

  /** Platform-specific scores */
  platformScores: PlatformScore[];

  /** Layout risks detected */
  layoutRisks: LayoutRisk[];

  /** Sections extracted from resume */
  extractedSections: ExtractedSection[];

  /** Data loss warnings by platform */
  dataLossWarnings: Record<PlatformType, DataLossWarning[]>;

  /** Issues affecting the score */
  issues: ScoreIssue[];

  /** Top recommendations for improvement */
  recommendations: string[];

  /** Report version */
  version: string;
}

/**
 * Configuration for the ATS simulation engine.
 */
export interface ATSConfig {
  /** Scoring configuration */
  scoring: {
    /** Minimum confidence threshold for field extraction */
    minConfidenceThreshold: number;

    /** Category weights (should sum to 100) */
    categoryWeights: Record<ScoreCategory, number>;

    /** Score ranges for badge assignment */
    scoreRanges: ScoreRange[];
  };

  /** Platform configurations to simulate */
  platforms: PlatformConfig[];

  /** Parser configuration */
  parser: {
    /** Enable fuzzy matching for headers */
    enableFuzzyMatching: boolean;

    /** Custom section header mappings */
    customHeaderMappings: Record<string, SectionType>;

    /** Maximum content length per section */
    maxSectionLength: number;
  };
}

import { ScoreCategory as ScoreCategoryEnum } from './scoring.types';

/**
 * Default ATS configuration.
 */
export const DEFAULT_ATS_CONFIG: ATSConfig = {
  scoring: {
    minConfidenceThreshold: 50,
    categoryWeights: {
      [ScoreCategoryEnum.PARSING]: 40,
      [ScoreCategoryEnum.KEYWORDS]: 30,
      [ScoreCategoryEnum.FORMAT]: 20,
      [ScoreCategoryEnum.LAYOUT]: 10,
    },
    scoreRanges: [
      { min: 95, max: 100, label: 'excellent', color: '#22c55e', description: 'ATS-optimized' },
      { min: 85, max: 95, label: 'good', color: '#3b82f6', description: 'Likely to parse well' },
      { min: 70, max: 85, label: 'fair', color: '#eab308', description: 'Some parsing risks' },
      { min: 0, max: 70, label: 'poor', color: '#ef4444', description: 'Significant issues' },
    ],
  },
  platforms: [
    DEFAULT_PLATFORM_CONFIGS[PlatformType.WORKDAY],
    DEFAULT_PLATFORM_CONFIGS[PlatformType.TALEO],
    DEFAULT_PLATFORM_CONFIGS[PlatformType.GREENHOUSE],
    DEFAULT_PLATFORM_CONFIGS[PlatformType.LEVER],
  ],
  parser: {
    enableFuzzyMatching: true,
    customHeaderMappings: {},
    maxSectionLength: 10000,
  },
};

// ============================================================================
// Type Aliases for Convenience
// ============================================================================

import type { FieldExtraction } from './parser.types';

/** Shorthand for extracted section type */
export type ATSSection = ExtractedSection;

/** Shorthand for field extraction type */
export type ATSField = FieldExtraction;

// ============================================================================
// Version
// ============================================================================

/** Current version of the ATS simulation type system */
export const ATS_TYPES_VERSION = '2.0.0';
