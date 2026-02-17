/**
 * Workday ATS Simulator
 *
 * Simulates how Oracle Workday parses resumes with its strict parsing behavior.
 * Workday is known for being particularly strict with:
 * - Header matching (only exact headers recognized)
 * - Table layouts (40% quality penalty)
 * - Date formats (limited format support)
 * - Multi-column layouts (30% penalty)
 *
 * Research findings:
 * - Workday uses a strict rules-based parser
 * - Tables are often completely mangled or ignored
 * - Only standard headers like "Work Experience" are recognized
 * - Non-standard date formats frequently cause parsing failures
 * - Headers and footers can interfere with content extraction
 *
 * @module ats-simulation/platforms/workday
 * @version 1.0.0
 */

import type {
  PlatformType,
  PlatformQuirks,
  ParsedResumeResult,
  DataLossWarning,
  LayoutAnalysis,
  ExtractedSection,
} from '../types';
import { extractSections } from '../engine/sectionExtractor';

/**
 * Workday-specific quirks and configuration.
 * These values are based on research and real-world testing.
 */
export const WORKDAY_QUIRKS: PlatformQuirks = {
  strictHeaders: true,
  allowedHeaders: [
    'Work Experience',
    'Professional Experience',
    'Employment History',
    'Experience',
    'Education',
    'Skills',
    'Summary',
    'Professional Summary',
    'Projects',
    'Certifications',
    'Achievements',
  ],
  tablePenalty: 0.4, // 40% quality reduction for tables
  columnPenalty: 0.3, // 30% for float columns
  dateFormatStrict: true,
  supportedDateFormats: ['MMM YYYY', 'MM/YYYY', 'YYYY'],
  headerDetection: 'strict',
  footerSensitivity: 'high',
};

/**
 * Check if a date string matches Workday's supported formats.
 * Workday is strict about date formats and may fail to parse non-standard dates.
 *
 * @param dateStr - Date string to validate
 * @returns True if the date format is supported by Workday
 */
function isStandardDateFormat(dateStr: string): boolean {
  if (!dateStr) return false;

  // MMM YYYY format (e.g., "Jan 2020", "December 2023")
  const monthYearPattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}$/i;
  if (monthYearPattern.test(dateStr)) return true;

  // MM/YYYY format (e.g., "01/2020", "12/2023")
  const slashPattern = /^\d{1,2}\/\d{4}$/;
  if (slashPattern.test(dateStr)) return true;

  // YYYY format (e.g., "2020")
  const yearPattern = /^\d{4}$/;
  if (yearPattern.test(dateStr)) return true;

  // Date ranges with dash (e.g., "Jan 2020 - Dec 2022")
  const rangePattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}$/i;
  if (rangePattern.test(dateStr)) return true;

  // Present ranges (e.g., "Jan 2020 - Present")
  const presentPattern = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*Present$/i;
  if (presentPattern.test(dateStr)) return true;

  // YYYY-YYYY ranges (e.g., "2020-2022")
  const yearRangePattern = /^\d{4}\s*[-–—]\s*\d{4}$/;
  if (yearRangePattern.test(dateStr)) return true;

  // YYYY-Present ranges
  const yearPresentPattern = /^\d{4}\s*[-–—]\s*Present$/i;
  if (yearPresentPattern.test(dateStr)) return true;

  return false;
}

/**
 * Calculate the average confidence score across all sections.
 *
 * @param sections - Array of extracted sections
 * @returns Average confidence score (0-100)
 */
function calculateAverageConfidence(sections: ExtractedSection[]): number {
  if (sections.length === 0) return 0;

  const totalConfidence = sections.reduce((sum, section) => {
    return sum + (section.confidence?.overall ?? 50);
  }, 0);

  return Math.round(totalConfidence / sections.length);
}

/**
 * Generate Workday-specific issues based on parsing results.
 *
 * @param result - The parsed resume result
 * @returns Array of score issues
 */
function generateWorkdayIssues(result: ParsedResumeResult): import('../types').ScoreIssue[] {
  const issues: import('../types').ScoreIssue[] = [];

  // Add issues for data loss warnings
  result.dataLossWarnings.forEach(warning => {
    issues.push({
      code: warning.type,
      message: `Data loss in "${warning.section}": ${warning.originalText} could not be parsed`,
      severity: warning.severity,
      section: warning.section,
    });
  });

  // Add issues for low extraction quality
  if (result.extractionQuality < 50) {
    issues.push({
      code: 'low_extraction_quality',
      message: `Very low extraction quality (${result.extractionQuality}%). Workday may have missed significant content.`,
      severity: 'critical',
    });
  } else if (result.extractionQuality < 70) {
    issues.push({
      code: 'moderate_extraction_quality',
      message: `Moderate extraction quality (${result.extractionQuality}%). Some content may not be properly parsed.`,
      severity: 'medium',
    });
  }

  return issues;
}

/**
 * Simulate Workday ATS parsing behavior.
 *
 * Workday applies strict rules:
 * 1. Only recognizes specific header variations
 * 2. Applies 40% quality penalty for tables
 * 3. Applies 30% quality penalty for float columns
 * 4. Strict date format validation
 * 5. High sensitivity to headers/footers
 *
 * @param resumeText - Raw resume text content
 * @param layout - Optional layout analysis for penalty calculation
 * @returns Parsed resume result with Workday-specific quirks applied
 */
export function simulateWorkday(
  resumeText: string,
  layout?: LayoutAnalysis
): ParsedResumeResult {
  // 1. Extract sections with strict header matching
  const sections = extractSections(resumeText);

  // Filter sections to only include those with allowed headers (strict matching)
  const filteredSections = sections.filter(section => {
    // Check if section header matches allowed headers
    const headerLower = section.header?.toLowerCase() ?? '';
    return WORKDAY_QUIRKS.allowedHeaders.some(
      allowed => allowed.toLowerCase() === headerLower
    );
  });

  // Use filtered sections if any match, otherwise use all (Workday might miss non-standard sections)
  const finalSections = filteredSections.length > 0 ? filteredSections : sections;

  // 2. Apply table penalty if detected
  let qualityPenalty = 1.0;
  if (layout?.tables.some(t => t.severity === 'critical' || t.severity === 'high')) {
    qualityPenalty *= (1 - WORKDAY_QUIRKS.tablePenalty);
  }

  // 3. Apply column penalty
  if (layout?.columns.some(c => c.type === 'float')) {
    qualityPenalty *= (1 - WORKDAY_QUIRKS.columnPenalty);
  }

  // 4. Check date format compliance
  const dateIssues: DataLossWarning[] = [];
  finalSections.forEach(section => {
    section.fields.forEach(field => {
      if (field.fieldType === 'date_range' && !isStandardDateFormat(field.value)) {
        dateIssues.push({
          type: 'date_unparsed',
          severity: 'medium',
          originalText: field.value,
          extractedText: null,
          section: section.header ?? section.type,
        });
      }
    });
  });

  // 5. Calculate extraction quality
  const baseQuality = calculateAverageConfidence(finalSections);
  const extractionQuality = Math.round(baseQuality * qualityPenalty);

  return {
    platform: 'WORKDAY' as PlatformType,
    sections: finalSections,
    extractionQuality,
    dataLossWarnings: dateIssues,
    parsingErrors: [],
  };
}

export default simulateWorkday;
