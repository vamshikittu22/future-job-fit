/**
 * ATS Simulation Components - Barrel Export
 * 
 * Export all ATS Risk Report UI components:
 * - ScoreGauge: Circular progress indicator
 * - ScoreBreakdown: Horizontal bar chart with 4 categories
 * - PlatformComparison: Side-by-side platform score cards
 * - RiskItemsList: Expandable list sorted by severity
 * - ATSRiskReport: Main container integrating all components
 * 
 * @module ats-simulation/components
 */

export { ATSRiskReport } from './ATSRiskReport';
export { ScoreGauge } from './ScoreGauge';
export { ScoreBreakdown } from './ScoreBreakdown';
export { PlatformComparison } from './PlatformComparison';
export { RiskItemsList } from './RiskItemsList';

// Re-export types
export type { ATSRiskReportProps } from './ATSRiskReport';
export type { ScoreGaugeProps } from './ScoreGauge';
export type { ScoreBreakdownProps } from './ScoreBreakdown';
export type { PlatformComparisonProps } from './PlatformComparison';
export type { RiskItemsListProps } from './RiskItemsList';
