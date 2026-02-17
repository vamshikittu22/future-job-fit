/**
 * ATS Platform Simulation Types
 *
 * Type definitions for simulating different ATS platform behaviors.
 * Each platform (Workday, Taleo, Greenhouse, Lever) has unique quirks
 * that affect how resumes are parsed and scored.
 *
 * Research findings:
 * - Workday: 40% penalty for tables, strict header detection
 * - Taleo: 50% penalty for columns, date format strictness varies
 * - Greenhouse: Flexible parsing, moderate table tolerance
 * - Lever: Semantic header detection, modern parsing engine
 *
 * @module ats-simulation/types/platform
 */

import type { ExtractedSection } from './parser.types';
import { RiskLevel } from './scoring.types';
import type { ATSScore, ScoreIssue } from './scoring.types';

/**
 * Enumeration of major ATS platforms to simulate.
 * Each has distinct parsing behaviors and quirks.
 */
export enum PlatformType {
  /** Oracle Workday - strictest parser, high table/column penalties */
  WORKDAY = 'workday',

  /** Oracle Taleo - older system, column-sensitive, date strict */
  TALEO = 'taleo',

  /** Greenhouse - modern, flexible, moderate tolerance */
  GREENHOUSE = 'greenhouse',

  /** Lever - semantic parsing, intelligent header detection */
  LEVER = 'lever',

  /** iCIMS - enterprise focus, structured data preference */
  ICIMS = 'icims',

  /** Generic fallback for unknown platforms */
  GENERIC = 'generic',
}

/**
 * Platform-specific parsing quirks and behaviors.
 * These configuration values determine how each platform
 * handles different resume elements.
 */
export interface PlatformQuirks {
  /** Whether the platform requires exact header matches */
  strictHeaders: boolean;

  /** List of header variations the platform recognizes */
  allowedHeaders: string[];

  /** Penalty applied when tables are detected (0-1, e.g., 0.4 = 40% penalty) */
  tablePenalty: number;

  /** Penalty applied when multi-column layouts are detected (0-1) */
  columnPenalty: number;

  /** Whether the platform enforces strict date formats */
  dateFormatStrict: boolean;

  /** Date formats this platform can parse */
  supportedDateFormats: string[];

  /** Header detection strategy used by the platform */
  headerDetection: 'strict' | 'flexible' | 'semantic';

  /** How sensitive the platform is to footer content */
  footerSensitivity: RiskLevel;
}

/**
 * Result of parsing a resume through a specific platform simulator.
 * Contains extracted sections, quality metrics, and any data loss warnings.
 */
export interface ParsedResumeResult {
  /** The platform that performed the parsing */
  platform: PlatformType;

  /** Sections successfully extracted from the resume */
  sections: ExtractedSection[];

  /** Overall quality of extraction (0-100) */
  extractionQuality: number;

  /** Warnings about data that may have been lost or mangled */
  dataLossWarnings: DataLossWarning[];

  /** Errors encountered during parsing */
  parsingErrors: ParsingError[];
}

/**
 * Warning about potential data loss during parsing.
 * Helps users understand what information might not make it through.
 */
export interface DataLossWarning {
  /** Type of data loss that occurred */
  type: 'section_missed' | 'field_truncated' | 'date_unparsed' | 'content_duplicated';

  /** Severity of the data loss */
  severity: RiskLevel;

  /** Original text before parsing */
  originalText: string;

  /** Text as extracted (null if completely lost) */
  extractedText: string | null;

  /** Which section was affected */
  section: string;
}

/**
 * Error encountered during platform-specific parsing.
 */
export interface ParsingError {
  /** Error code for programmatic handling */
  code: string;

  /** Human-readable error message */
  message: string;

  /** Section where error occurred */
  section?: string;

  /** Position in document where error occurred */
  position?: { start: number; end: number };
}

/**
 * Score result from a specific platform simulation.
 */
export interface PlatformScore {
  /** Platform that generated this score */
  platform: PlatformType;

  /** Overall compatibility score (0-100) */
  score: number;

  /** Issues that affected this score */
  issues: ScoreIssue[];

  /** Overall risk level for this platform */
  riskLevel: RiskLevel;
}

/**
 * Platform simulator interface.
 * Implementations simulate how specific ATS platforms parse resumes.
 */
export interface PlatformSimulator {
  /** Platform being simulated */
  platform: PlatformType;

  /** Platform-specific configuration quirks */
  quirks: PlatformQuirks;

  /**
   * Simulate parsing a resume through this platform.
   * @param resume - Resume content to parse
   * @returns Parsing result with extracted sections
   */
  simulate: (resume: string) => ParsedResumeResult;

  /**
   * Calculate ATS compatibility score for this platform.
   * @param result - Parsing result to score
   * @returns Platform-specific score
   */
  calculateScore: (result: ParsedResumeResult) => PlatformScore;
}

/**
 * Configuration for a specific platform.
 */
export interface PlatformConfig {
  /** Platform type */
  type: PlatformType;

  /** Platform name for display */
  name: string;

  /** Platform description */
  description: string;

  /** Platform quirks and behaviors */
  quirks: PlatformQuirks;

  /** Market share / popularity (for prioritization) */
  popularity: 'high' | 'medium' | 'low';
}

/**
 * Default platform configurations based on research.
 */
export const DEFAULT_PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  [PlatformType.WORKDAY]: {
    type: PlatformType.WORKDAY,
    name: 'Workday',
    description: 'Oracle Workday - Enterprise ATS with strict parsing',
    popularity: 'high',
    quirks: {
      strictHeaders: true,
      allowedHeaders: ['Experience', 'Work Experience', 'Employment', 'Professional Experience'],
      tablePenalty: 0.4, // 40% penalty for tables
      columnPenalty: 0.3,
      dateFormatStrict: true,
      supportedDateFormats: ['MMM YYYY', 'MM/YYYY', 'YYYY'],
      headerDetection: 'strict',
      footerSensitivity: RiskLevel.MEDIUM,
    },
  },
  [PlatformType.TALEO]: {
    type: PlatformType.TALEO,
    name: 'Taleo',
    description: 'Oracle Taleo - Legacy enterprise ATS',
    popularity: 'high',
    quirks: {
      strictHeaders: true,
      allowedHeaders: ['Experience', 'Education', 'Skills'],
      tablePenalty: 0.5, // 50% penalty for tables
      columnPenalty: 0.5, // 50% penalty for columns
      dateFormatStrict: true,
      supportedDateFormats: ['MM/YYYY', 'YYYY'],
      headerDetection: 'strict',
      footerSensitivity: RiskLevel.HIGH,
    },
  },
  [PlatformType.GREENHOUSE]: {
    type: PlatformType.GREENHOUSE,
    name: 'Greenhouse',
    description: 'Greenhouse - Modern recruiting platform',
    popularity: 'high',
    quirks: {
      strictHeaders: false,
      allowedHeaders: [], // Flexible - accepts many variations
      tablePenalty: 0.2,
      columnPenalty: 0.15,
      dateFormatStrict: false,
      supportedDateFormats: ['MMM YYYY', 'MM/YYYY', 'YYYY', 'Month YYYY'],
      headerDetection: 'flexible',
      footerSensitivity: RiskLevel.LOW,
    },
  },
  [PlatformType.LEVER]: {
    type: PlatformType.LEVER,
    name: 'Lever',
    description: 'Lever - Modern ATS with semantic parsing',
    popularity: 'medium',
    quirks: {
      strictHeaders: false,
      allowedHeaders: [],
      tablePenalty: 0.15,
      columnPenalty: 0.1,
      dateFormatStrict: false,
      supportedDateFormats: ['MMM YYYY', 'MM/YYYY', 'YYYY'],
      headerDetection: 'semantic',
      footerSensitivity: 'low',
    },
  },
  [PlatformType.ICIMS]: {
    type: PlatformType.ICIMS,
    name: 'iCIMS',
    description: 'iCIMS - Enterprise talent acquisition',
    popularity: 'medium',
    quirks: {
      strictHeaders: true,
      allowedHeaders: ['Experience', 'Work History', 'Education', 'Qualifications'],
      tablePenalty: 0.35,
      columnPenalty: 0.25,
      dateFormatStrict: true,
      supportedDateFormats: ['MM/YYYY', 'YYYY'],
      headerDetection: 'strict',
      footerSensitivity: 'medium',
    },
  },
  [PlatformType.GENERIC]: {
    type: PlatformType.GENERIC,
    name: 'Generic ATS',
    description: 'Default behavior for unknown ATS platforms',
    popularity: 'low',
    quirks: {
      strictHeaders: false,
      allowedHeaders: [],
      tablePenalty: 0.25,
      columnPenalty: 0.2,
      dateFormatStrict: false,
      supportedDateFormats: ['MMM YYYY', 'MM/YYYY', 'YYYY'],
      headerDetection: 'flexible',
      footerSensitivity: 'medium',
    },
  },
};

/**
 * Type guard to check if a value is a valid PlatformType
 * @param value - Value to check
 * @returns True if value is a PlatformType
 */
export function isPlatformType(value: unknown): value is PlatformType {
  return typeof value === 'string' && Object.values(PlatformType).includes(value as PlatformType);
}

/**
 * Get platform configuration by type.
 * @param type - Platform type
 * @returns Platform configuration
 */
export function getPlatformConfig(type: PlatformType): PlatformConfig {
  return DEFAULT_PLATFORM_CONFIGS[type] || DEFAULT_PLATFORM_CONFIGS[PlatformType.GENERIC];
}

/**
 * List of all supported platforms for UI display.
 */
export const SUPPORTED_PLATFORMS: PlatformType[] = [
  PlatformType.WORKDAY,
  PlatformType.TALEO,
  PlatformType.GREENHOUSE,
  PlatformType.LEVER,
  PlatformType.ICIMS,
];
