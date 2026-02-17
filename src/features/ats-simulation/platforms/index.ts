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
  ParsedResumeResult,
  ScoreCategory,
} from '../types';
import type { LayoutAnalysis } from '../detector/types';

// Import platform simulators
export { simulateWorkday, WORKDAY_QUIRKS } from './workday';
export { simulateLever, LEVER_QUIRKS } from './lever';
export { simulateGreenhouse, GREENHOUSE_QUIRKS } from './greenhouse';
export { simulateTaleo, TALEO_QUIRKS } from './taleo';

// Import simulator functions for use in this module
import { simulateWorkday } from './workday';
import { simulateLever } from './lever';
import { simulateGreenhouse } from './greenhouse';
import { simulateTaleo } from './taleo';

/**
 * Platform comparison result with best/worst platform identification
 */
export interface PlatformComparison {
  /** Results from each platform simulation */
  results: Array<{
    platform: PlatformType;
    result: ParsedResumeResult;
  }>;
  
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
 * All supported ATS platforms
 */
export const PLATFORMS: PlatformType[] = [
  PlatformType.WORKDAY,
  PlatformType.LEVER,
  PlatformType.GREENHOUSE,
  PlatformType.TALEO,
];

/**
 * Simulate a specific platform parsing the resume.
 * 
 * @param platform - The ATS platform to simulate
 * @param resumeText - Raw resume text content
 * @param layout - Optional layout analysis for penalty calculation
 * @returns Parsed resume result from that platform
 */
export function simulatePlatform(
  platform: PlatformType,
  resumeText: string,
  layout?: LayoutAnalysis
): ParsedResumeResult {
  switch (platform) {
    case PlatformType.WORKDAY:
      return simulateWorkday(resumeText, layout);
    case PlatformType.LEVER:
      return simulateLever(resumeText, layout);
    case PlatformType.GREENHOUSE:
      return simulateGreenhouse(resumeText, layout);
    case PlatformType.TALEO:
      return simulateTaleo(resumeText, layout);
    default:
      // Fallback to Workday for unknown platforms
      return simulateWorkday(resumeText, layout);
  }
}

/**
 * Calculate risk level from extraction quality score.
 */
function calculateRiskLevel(quality: number): RiskLevel {
  if (quality >= 85) return RiskLevel.NONE;
  if (quality >= 70) return RiskLevel.LOW;
  if (quality >= 50) return RiskLevel.MEDIUM;
  if (quality >= 30) return RiskLevel.HIGH;
  return RiskLevel.CRITICAL;
}

/**
 * Generate score issues from parsing result.
 */
function generateIssues(result: ParsedResumeResult): ScoreIssue[] {
  const issues: ScoreIssue[] = [];
  
  // Add data loss warnings as issues
  result.dataLossWarnings.forEach(warning => {
    issues.push({
      severity: warning.severity as 'critical' | 'high' | 'medium' | 'low',
      category: ScoreCategory.PARSING,
      message: `Data loss in "${warning.section}": ${warning.originalText}`,
      suggestion: 'Use standard date formats for better parsing',
      affectedPlatforms: [result.platform],
    });
  });
  
  return issues;
}

/**
 * Simulates how different ATS platforms parse a resume
 * and returns comparison scores for each platform.
 *
 * @param resumeText - Plain text content of the resume
 * @param layout - Optional layout analysis results
 * @returns Comparison of all platform scores
 */
export function comparePlatforms(
  resumeText: string,
  layout?: LayoutAnalysis
): PlatformComparison {
  // Run each platform simulator
  const results = PLATFORMS.map(platform => ({
    platform,
    result: simulatePlatform(platform, resumeText, layout)
  }));

  // Convert to PlatformScore format
  const scores: PlatformScore[] = results.map(r => ({
    platform: r.result.platform,
    score: r.result.extractionQuality,
    issues: generateIssues(r.result),
    riskLevel: calculateRiskLevel(r.result.extractionQuality)
  }));

  // Find best and worst platforms
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  return {
    results,
    scores,
    bestPlatform: { platform: best.platform, score: best.score },
    worstPlatform: { platform: worst.platform, score: worst.score },
    timestamp: Date.now(),
  };
}

// Re-export types for convenience
export type { PlatformScore, PlatformConfig };
export { PlatformType, RiskLevel, DEFAULT_PLATFORM_CONFIGS };
