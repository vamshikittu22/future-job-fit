/**
 * Lever ATS Simulator
 *
 * Simulates how Lever parses resumes with its modern, semantic parsing engine.
 * Lever is known for being more tolerant and intelligent with:
 * - Semantic header matching ("Professional Journey" is similar to "Experience")
 * - Flexible date formats
 * - Light table penalties (15%)
 * - Minimal column concerns (10%)
 *
 * Research findings:
 * - Lever uses modern parsing technology (Affinda)
 * - Focuses on readability and content quality
 * - More forgiving of non-standard resume formats
 * - Semantic understanding of section headers
 *
 * @module ats-simulation/platforms/lever
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
 * Lever-specific quirks and configuration.
 * Lever is the most tolerant of non-standard formats.
 */
export const LEVER_QUIRKS: PlatformQuirks = {
  strictHeaders: false,
  allowedHeaders: [],
  tablePenalty: 0.15,
  columnPenalty: 0.1,
  dateFormatStrict: false,
  supportedDateFormats: ['MMM YYYY', 'MM/YYYY', 'YYYY', 'Month YYYY'],
  headerDetection: 'semantic',
  footerSensitivity: RiskLevel.LOW,
};

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
 * Simulate Lever ATS parsing behavior.
 *
 * Lever applies lenient rules:
 * 1. Semantic header matching - understands related terms
 * 2. Light table penalty (15%) - only critical tables affected
 * 3. Minimal column penalty (10%) - focus on readability
 * 4. Flexible date formats - accepts most common formats
 * 5. Low footer sensitivity - ignores most footer content
 *
 * @param resumeText - Raw resume text content
 * @param layout - Optional layout analysis for penalty calculation
 * @returns Parsed resume result with Lever-specific quirks applied
 */
export function simulateLever(
  resumeText: string,
  layout?: LayoutAnalysis
): ParsedResumeResult {
  // 1. Extract sections with semantic matching
  const sections = extractSections(resumeText);

  // Lever keeps all sections since it uses semantic matching

  // 2. Apply light layout penalties
  let qualityPenalty = 1.0;

  // Only critical tables get penalized (Lever is tolerant)
  if (layout?.tables?.some((t: { severity: string }) => t.severity === 'critical')) {
    qualityPenalty *= (1 - LEVER_QUIRKS.tablePenalty);
  }

  // Minimal column penalty - Lever handles columns reasonably well
  if (layout?.columns?.some((c: { type: string; severity: string }) => c.type === 'float' && c.severity === 'critical')) {
    qualityPenalty *= (1 - LEVER_QUIRKS.columnPenalty);
  }

  // 3. Calculate extraction quality
  const extractionQuality = Math.round(calculateAverageConfidence(sections) * qualityPenalty);

  // Lever rarely generates data loss warnings
  const dataLossWarnings: DataLossWarning[] = [];

  return {
    platform: PlatformType.LEVER,
    sections,
    extractionQuality,
    dataLossWarnings,
    parsingErrors: [],
  };
}

export default simulateLever;
