/**
 * Greenhouse ATS Simulator
 *
 * Simulates how Greenhouse parses resumes with its modern, clean parsing engine.
 * Greenhouse is known for:
 * - Modern Affinda/Dover-powered parsing
 * - Clean structure rewards (10% bonus for table-free layouts)
 * - Moderate table penalties (20%)
 * - Flexible header detection
 *
 * Research findings:
 * - Greenhouse uses Affinda for parsing
 * - Clean, single-column layouts are rewarded
 * - Tables cause moderate issues (20% penalty)
 * - Multi-column layouts have 15% penalty
 * - Modern date format support (MMM YYYY, MM/YYYY, YYYY, ISO)
 *
 * @module ats-simulation/platforms/greenhouse
 * @version 1.0.0
 */

import type {
  PlatformQuirks,
  ParsedResumeResult,
  DataLossWarning,
  ExtractedSection,
} from '../types';
import { extractSections } from '../engine/sectionExtractor';
import { RiskLevel, PlatformType } from '../types';

// Import layout types from detector
import type { LayoutAnalysis } from '../detector/types';

/**
 * Greenhouse-specific quirks and configuration.
 * Greenhouse rewards clean structure with a bonus.
 */
export const GREENHOUSE_QUIRKS: PlatformQuirks = {
  strictHeaders: false,
  allowedHeaders: [],
  tablePenalty: 0.2,
  columnPenalty: 0.15,
  dateFormatStrict: false,
  supportedDateFormats: ['MMM YYYY', 'MM/YYYY', 'YYYY', 'ISO', 'Month YYYY'],
  headerDetection: 'flexible',
  footerSensitivity: RiskLevel.MEDIUM,
};

/**
 * Bonus for clean layouts (no tables, no columns).
 * Greenhouse rewards well-structured resumes.
 */
const CLEAN_LAYOUT_BONUS = 1.1; // 10% bonus

/**
 * Calculate the average confidence score across all sections.
 */
function calculateAverageConfidence(sections: ExtractedSection[]): number {
  if (sections.length === 0) return 0;

  const totalConfidence = sections.reduce((sum, section) => {
    return sum + (section.confidence ?? 50);
  }, 0);

  return Math.round(totalConfidence / sections.length);
}

/**
 * Check if the layout is clean (no tables or columns).
 * Clean layouts get a bonus with Greenhouse.
 */
function hasCleanLayout(layout?: LayoutAnalysis): boolean {
  if (!layout) return false;
  
  const hasNoTables = !layout.tables || layout.tables.length === 0;
  const hasNoColumns = !layout.columns || layout.columns.length === 0;
  
  return hasNoTables && hasNoColumns;
}

/**
 * Simulate Greenhouse ATS parsing behavior.
 *
 * Greenhouse applies these rules:
 * 1. Flexible header detection - accepts variations
 * 2. Moderate table penalty (20%) - tables cause issues
 * 3. Column penalty (15%) - multi-column is problematic
 * 4. CLEAN LAYOUT BONUS - 10% bonus for table-free, column-free resumes
 * 5. Flexible date formats - accepts most common formats
 *
 * @param resumeText - Raw resume text content
 * @param layout - Optional layout analysis for penalty calculation
 * @returns Parsed resume result with Greenhouse-specific quirks applied
 */
export function simulateGreenhouse(
  resumeText: string,
  layout?: LayoutAnalysis
): ParsedResumeResult {
  // 1. Extract sections with flexible matching
  const sections = extractSections(resumeText);

  // 2. Calculate quality adjustments
  let qualityFactor = 1.0;

  // Apply table penalty
  if (layout?.tables && layout.tables.length > 0) {
    const criticalTables = layout.tables.filter(
      (t: { severity: string }) => t.severity === 'critical' || t.severity === 'high'
    );
    if (criticalTables.length > 0) {
      qualityFactor *= (1 - GREENHOUSE_QUIRKS.tablePenalty);
    }
  }

  // Apply column penalty
  if (layout?.columns && layout.columns.length > 0) {
    const problematicColumns = layout.columns.filter(
      (c: { type: string; severity: string }) => 
        c.type === 'float' || c.type === 'flex'
    );
    if (problematicColumns.length > 0) {
      qualityFactor *= (1 - GREENHOUSE_QUIRKS.columnPenalty);
    }
  }

  // Apply clean layout bonus (10% boost for table-free, column-free)
  if (hasCleanLayout(layout)) {
    qualityFactor = Math.min(1.2, qualityFactor * CLEAN_LAYOUT_BONUS);
  }

  // 3. Calculate extraction quality with adjustments
  const baseQuality = calculateAverageConfidence(sections);
  const extractionQuality = Math.min(100, Math.round(baseQuality * qualityFactor));

  // Greenhouse generates minimal data loss warnings
  const dataLossWarnings: DataLossWarning[] = [];

  return {
    platform: PlatformType.GREENHOUSE,
    sections,
    extractionQuality,
    dataLossWarnings,
    parsingErrors: [],
  };
}

export default simulateGreenhouse;
