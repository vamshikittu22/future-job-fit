/**
 * Taleo ATS Simulator
 *
 * Simulates how Oracle Taleo parses resumes with its legacy parsing engine.
 * Taleo is known for being the most problematic with:
 * - Highest column penalty (50%) - really struggles with columns
 * - High table penalty (35%) - tables cause significant issues
 * - Strict date format requirements (limited formats)
 * - Strict header detection
 *
 * Research findings:
 * - Taleo uses older regex-based parsing
 * - Multi-column layouts are often read out of order
 * - Tables frequently cause complete data loss
 * - Very limited date format support (MM/YYYY, YYYY only)
 * - Headers must match exactly or sections are missed
 *
 * @module ats-simulation/platforms/taleo
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
 * Taleo-specific quirks and configuration.
 * Taleo is the strictest with legacy parsing.
 */
export const TALEO_QUIRKS: PlatformQuirks = {
  strictHeaders: true,
  allowedHeaders: [
    'Work Experience',
    'Professional Experience',
    'Employment History',
    'Experience',
    'Education',
    'Skills',
    'Summary',
  ],
  tablePenalty: 0.35,
  columnPenalty: 0.5, // Taleo REALLY struggles with columns
  dateFormatStrict: true,
  supportedDateFormats: ['MM/YYYY', 'YYYY'], // Very limited
  headerDetection: 'strict',
  footerSensitivity: RiskLevel.HIGH,
};

/**
 * Check if a date string matches Taleo's limited formats.
 * Taleo only supports MM/YYYY and YYYY formats.
 *
 * @param dateStr - Date string to validate
 * @returns True if the date format is supported by Taleo
 */
function isTaleoSupportedDateFormat(dateStr: string): boolean {
  if (!dateStr) return false;

  // MM/YYYY format (e.g., "01/2020", "12/2023")
  const slashPattern = /^\d{1,2}\/\d{4}$/;
  if (slashPattern.test(dateStr)) return true;

  // YYYY format (e.g., "2020")
  const yearPattern = /^\d{4}$/;
  if (yearPattern.test(dateStr)) return true;

  // Date range with Taleo formats
  const rangePattern = /^\d{1,2}\/\d{4}\s*[-–—]\s*\d{1,2}\/\d{4}$/;
  if (rangePattern.test(dateStr)) return true;

  // YYYY-YYYY range
  const yearRangePattern = /^\d{4}\s*[-–—]\s*\d{4}$/;
  if (yearRangePattern.test(dateStr)) return true;

  // YYYY-Present
  const yearPresentPattern = /^\d{4}\s*[-–—]\s*Present$/i;
  if (yearPresentPattern.test(dateStr)) return true;

  return false;
}

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
 * Simulate Taleo ATS parsing behavior.
 *
 * Taleo applies the strictest rules:
 * 1. Strict header matching - only exact headers recognized
 * 2. High table penalty (35%) - significant data loss
 * 3. CRITICAL column penalty (50%) - columns often read out of order
 * 4. Strict date formats - only MM/YYYY and YYYY supported
 * 5. High footer sensitivity - content may be duplicated
 *
 * @param resumeText - Raw resume text content
 * @param layout - Optional layout analysis for penalty calculation
 * @returns Parsed resume result with Taleo-specific quirks applied
 */
export function simulateTaleo(
  resumeText: string,
  layout?: LayoutAnalysis
): ParsedResumeResult {
  // 1. Extract sections with strict header matching
  const sections = extractSections(resumeText);

  // 2. Apply column penalty FIRST (Taleo's biggest issue)
  let qualityFactor = 1.0;

  // Taleo really struggles with columns - 50% penalty
  if (layout?.columns && layout.columns.length > 0) {
    const problematicColumns = layout.columns.filter(
      (c: { type: string }) => c.type === 'float' || c.type === 'flex'
    );
    if (problematicColumns.length > 0) {
      qualityFactor *= (1 - TALEO_QUIRKS.columnPenalty);
    }
  }

  // 3. Apply table penalty (35%)
  if (layout?.tables && layout.tables.length > 0) {
    const criticalTables = layout.tables.filter(
      (t: { severity: string }) => t.severity === 'critical' || t.severity === 'high'
    );
    if (criticalTables.length > 0) {
      qualityFactor *= (1 - TALEO_QUIRKS.tablePenalty);
    }
  }

  // 4. Check date format compliance (strict)
  const dateIssues: DataLossWarning[] = [];
  sections.forEach(section => {
    section.fields
      .filter(field => field.fieldType === 'date_range')
      .forEach(field => {
        if (!isTaleoSupportedDateFormat(field.value)) {
          dateIssues.push({
            type: 'date_unparsed',
            severity: RiskLevel.HIGH,
            originalText: field.value,
            extractedText: null,
            section: section.title,
          });
        }
      });
  });

  // 5. Calculate extraction quality
  const baseQuality = calculateAverageConfidence(sections);
  const extractionQuality = Math.round(baseQuality * qualityFactor);

  return {
    platform: PlatformType.TALEO,
    sections,
    extractionQuality,
    dataLossWarnings: dateIssues,
    parsingErrors: [],
  };
}

export default simulateTaleo;
