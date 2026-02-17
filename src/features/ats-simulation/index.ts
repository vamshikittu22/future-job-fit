/**
 * ATS Simulation 2.0 - Feature Barrel Export
 * 
 * Central export point for all ATS simulation functionality.
 * Provides types, engines, detectors, platforms, hooks, and components.
 * 
 * ## Quick Start
 * 
 * ```typescript
 * import { ATSRiskReport, useLayoutAnalysis, comparePlatforms } from '@/features/ats-simulation';
 * ```
 * 
 * ## Available Exports
 * 
 * - **Types**: Section parsing, scoring, platform types
 * - **Engine**: Rule-based section extraction with confidence scoring
 * - **Detector**: DOM layout detection (tables, columns, headers)
 * - **Platforms**: Workday, Taleo, Greenhouse, Lever simulators
 * - **Hooks**: useLayoutAnalysis for real-time DOM analysis
 * - **Components**: ATSRiskReport, ScoreGauge, ScoreBreakdown, etc.
 * 
 * @module ats-simulation
 * @version 2.0.0
 */

// ============================================================================
// Types - Comprehensive type system for ATS simulation
// ============================================================================

export * from './types';

// ============================================================================
// Engine - Rule-based section extraction
// ============================================================================

export {
  extractSections,
  extractFields,
  calculateConfidence,
  normalizeDate,
  parseDateRange,
  SECTION_PATTERNS,
  DATE_PATTERNS,
} from './engine/sectionExtractor';

// ============================================================================
// Detector - DOM layout analysis
// ============================================================================

export {
  analyzeLayout,
  detectTables,
  detectColumns,
  detectHeaderFooter,
} from './detector/layoutDetector';

// Re-export detector types
export type {
  LayoutAnalysis,
  LayoutDetectorOptions,
  TableRisk,
  ColumnRisk,
  HeaderFooterRisk,
  RiskLevel,
  ColumnType,
  HeaderFooterType,
} from './detector/types';

// ============================================================================
// Hooks - React hooks for ATS analysis
// ============================================================================

export { useLayoutAnalysis } from './hooks/useLayoutAnalysis';

// ============================================================================
// Platforms - ATS platform simulators
// ============================================================================

export {
  simulatePlatform,
  comparePlatforms,
  PLATFORMS,
  simulateWorkday,
  simulateLever,
  simulateGreenhouse,
  simulateTaleo,
  WORKDAY_QUIRKS,
  LEVER_QUIRKS,
  GREENHOUSE_QUIRKS,
  TALEO_QUIRKS,
} from './platforms';

// Re-export platform types
export type { PlatformScore, PlatformConfig, PlatformComparison } from './platforms';

// ============================================================================
// Components - React UI components
// ============================================================================

export {
  ATSRiskReport,
  ScoreGauge,
  ScoreBreakdown,
  PlatformComparison as PlatformComparisonComponent,
  RiskItemsList,
} from './components';

// Re-export component props
export type {
  ATSRiskReportProps,
  ScoreGaugeProps,
  ScoreBreakdownProps,
  PlatformComparisonProps,
  RiskItemsListProps,
} from './components';
