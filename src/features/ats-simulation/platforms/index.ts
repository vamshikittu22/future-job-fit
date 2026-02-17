/**
 * ATS Platform Simulators - Barrel Export
 *
 * Provides platform-specific simulation logic and comparison functionality.
 * Each simulator models how a specific ATS (Workday, Taleo, etc.) parses resumes.
 *
 * @module ats-simulation/platforms
 */

import {
  PlatformType,
  PlatformScore,
  ScoreIssue,
  PlatformConfig,
  DEFAULT_PLATFORM_CONFIGS,
  RiskLevel,
} from '../types';
import type { LayoutAnalysis } from '../detector/types';

/**
 * Platform comparison result with best/worst platform identification
 */
export interface PlatformComparison {
  /** Scores for each platform */
  scores: PlatformScore[];

  /** Platform with highest score */
  bestPlatform: { platform: PlatformType; score: number };

  /** Platform with lowest score */
  worstPlatform: { platform: PlatformType; score: number };

  /** Timestamp of comparison */
  timestamp: number;
}

/**
 * Simulates how different ATS platforms parse a resume
 * and returns comparison scores for each platform.
 *
 * @param resumeText - Plain text content of the resume
 * @param layoutAnalysis - Optional layout analysis results
 * @returns Comparison of all platform scores
 */
export function comparePlatforms(
  resumeText: string,
  layoutAnalysis?: LayoutAnalysis
): PlatformComparison {
  const platforms = [
    PlatformType.WORKDAY,
    PlatformType.TALEO,
    PlatformType.GREENHOUSE,
    PlatformType.LEVER,
  ];

  const scores: PlatformScore[] = platforms.map((platform) =>
    simulatePlatform(platform, resumeText, layoutAnalysis)
  );

  // Find best and worst platforms
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return {
    scores,
    bestPlatform: { platform: best.platform, score: best.score },
    worstPlatform: { platform: worst.platform, score: worst.score },
    timestamp: Date.now(),
  };
}

/**
 * Simulates a specific platform parsing the resume
 */
function simulatePlatform(
  platform: PlatformType,
  resumeText: string,
  layoutAnalysis?: LayoutAnalysis
): PlatformScore {
  const config = DEFAULT_PLATFORM_CONFIGS[platform];
  const issues: ScoreIssue[] = [];
  let score = 100;

  // Apply table penalties
  if (layoutAnalysis) {
    layoutAnalysis.tables.forEach((table) => {
      const penalty = Math.round(table.qualityPenalty * config.quirks.tablePenalty * 100);
      score -= penalty;

      if (table.severity !== 'none') {
        issues.push({
          category: 'LAYOUT',
          severity: table.severity,
          message: table.message,
          suggestion: table.isLayoutTable
            ? 'Convert layout table to single-column format'
            : 'Consider simplifying table structure',
          platforms: [platform],
        });
      }
    });

    // Apply column penalties
    layoutAnalysis.columns.forEach((col) => {
      const penalty = Math.round(col.qualityPenalty * config.quirks.columnPenalty * 100);
      score -= penalty;

      if (col.severity !== 'none') {
        issues.push({
          category: 'LAYOUT',
          severity: col.severity,
          message: col.message,
          suggestion: 'Use single-column layout for better ATS compatibility',
          platforms: [platform],
        });
      }
    });
  }

  // Parse resume content for section issues
  const lines = resumeText.split('\n');

  // Check for common parsing issues
  lines.forEach((line, index) => {
    // Check for special characters that might cause issues
    if (/[\u{1F300}-\u{1F9FF}]/u.test(line)) {
      issues.push({
        category: 'PARSING',
        severity: 'medium',
        message: `Line ${index + 1}: Emoji may not render correctly`,
        suggestion: 'Remove emojis for better ATS compatibility',
        platforms: [PlatformType.WORKDAY, PlatformType.TALEO],
      });
      score -= 5;
    }

    // Check for header format issues on strict platforms
    if (config.quirks.strictHeaders) {
      const potentialHeader = line.trim();
      if (
        potentialHeader.length > 0 &&
        potentialHeader.length < 30 &&
        !config.quirks.allowedHeaders.some((h) =>
          potentialHeader.toLowerCase().includes(h.toLowerCase())
        )
      ) {
        // This might be a header that won't be recognized
        // Only flag if it looks like a section header (all caps, underlined, etc.)
        if (/^[A-Z\s]{3,20}$/.test(potentialHeader)) {
          issues.push({
            category: 'PARSING',
            severity: 'low',
            message: `Unrecognized header: "${potentialHeader}"`,
            suggestion: `Use standard headers like: ${config.quirks.allowedHeaders.slice(0, 3).join(', ')}`,
            platforms: [platform],
          });
          score -= 3;
        }
      }
    }
  });

  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));

  // Determine risk level based on score
  let riskLevel: RiskLevel;
  if (score >= 85) riskLevel = RiskLevel.NONE;
  else if (score >= 70) riskLevel = RiskLevel.LOW;
  else if (score >= 50) riskLevel = RiskLevel.MEDIUM;
  else if (score >= 30) riskLevel = RiskLevel.HIGH;
  else riskLevel = RiskLevel.CRITICAL;

  return {
    platform,
    score,
    issues,
    riskLevel,
  };
}

// Re-export types for convenience
export type { PlatformComparison, PlatformScore, PlatformConfig };
export { PlatformType, RiskLevel, DEFAULT_PLATFORM_CONFIGS };
