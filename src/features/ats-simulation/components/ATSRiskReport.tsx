import { useMemo } from 'react';
import { cn } from '@/shared/lib/utils';
import { ScoreCategory, RiskLevel, PlatformType } from '../types';
import { comparePlatforms } from '../platforms';
import type { LayoutAnalysis } from '../detector/types';
import { ScoreGauge } from './ScoreGauge';
import { ScoreBreakdown } from './ScoreBreakdown';
import { PlatformComparison } from './PlatformComparison';
import { RiskItemsList } from './RiskItemsList';
import type { RiskItemsListProps } from './RiskItemsList';

/**
 * Props for the ATSRiskReport component
 */
export interface ATSRiskReportProps {
  /** Resume text content */
  resumeText: string;
  /** Optional DOM element for layout analysis */
  resumeElement?: HTMLElement;
  /** Optional pre-computed layout analysis */
  layoutAnalysis?: LayoutAnalysis | null;
  /** Additional CSS classes */
  className?: string;
}

/**
 * ATS Risk Report main container component
 * 
 * Displays comprehensive ATS compatibility analysis including:
 * - Overall score gauge (circular progress)
 * - Category score breakdown (4 categories)
 * - Platform comparison (4 major ATS)
 * - Risk items list sorted by severity
 * 
 * @example
 * ```tsx
 * <ATSRiskReport 
 *   resumeText={resumeContent}
 *   layoutAnalysis={layoutAnalysis}
 * />
 * ```
 */
export function ATSRiskReport({ 
  resumeText, 
  layoutAnalysis: providedLayoutAnalysis,
  className 
}: ATSRiskReportProps) {
  // Run platform simulations
  const comparison = useMemo(() => {
    return comparePlatforms(resumeText, providedLayoutAnalysis || undefined);
  }, [resumeText, providedLayoutAnalysis]);

  // Calculate overall score (average of all platforms)
  const overallScore = useMemo(() => {
    const avg = comparison.scores.reduce((sum, s) => sum + s.score, 0) / comparison.scores.length;
    return Math.round(avg);
  }, [comparison]);

  // Calculate category scores based on actual resume content analysis
  const categoryScores = useMemo(() => {
    // Parsing score: Average extraction quality across all platforms (40% weight)
    const parsingScore = comparison.scores.reduce((sum, s) => sum + s.score, 0) / comparison.scores.length;
    
    // Keywords score: Analyze resume for keyword indicators (30% weight)
    // Check for action verbs, quantifiable metrics, industry terms
    const keywordsLower = resumeText.toLowerCase();
    const keywordIndicators = [
      // Action verbs (strong resume language)
      /managed|led|developed|created|implemented|designed|built|launched|increased|decreased|improved|achieved/,
      // Quantifiable metrics
      /\d+%|\$\d+|\d+ (users|customers|clients|employees|team|members|projects)/,
      // Technical skills patterns
      /javascript|typescript|react|node|python|java|aws|azure|docker|kubernetes|sql/,
      // Soft skills
      /communication|leadership|collaboration|problem.solving|critical.thinking/
    ];
    let keywordMatches = 0;
    keywordIndicators.forEach(pattern => {
      if (pattern.test(keywordsLower)) keywordMatches++;
    });
    // Score based on keyword density (cap at 100)
    const keywordsScore = Math.min(100, 50 + (keywordMatches * 12));
    
    // Format score: Analyze formatting quality (20% weight)
    // Check for proper structure, reasonable length, bullet points
    const formatChecks = [
      resumeText.length > 200 && resumeText.length < 10000, // Reasonable length
      /\n.{2,}/.test(resumeText), // Has multiple paragraphs/sections
      /•|-|\* /.test(resumeText) || /^\s*[-*•]/.test(resumeText), // Has bullet points
      /^[A-Z][a-z]+/.test(resumeText), // Starts with capitalized words
    ];
    const formatScore = (formatChecks.filter(Boolean).length / formatChecks.length) * 100;
    
    // Layout score: Based on layout analysis (10% weight)
    const layoutScore = providedLayoutAnalysis 
      ? Math.max(0, 100 - providedLayoutAnalysis.riskScore)
      : 100;
    
    return {
      parsing: Math.round(parsingScore),
      keywords: Math.round(keywordsScore),
      format: Math.round(formatScore),
      layout: Math.round(layoutScore)
    };
  }, [comparison, resumeText, providedLayoutAnalysis]);

  // Compile all risks from layout and platform analysis
  const allRisks = useMemo((): RiskItemsListProps['risks'] => {
    const risks: RiskItemsListProps['risks'] = [];
    
    // Add layout risks from layout analysis
    if (providedLayoutAnalysis) {
      // Table risks
      providedLayoutAnalysis.tables.forEach((table) => {
        risks.push({
          severity: table.severity as RiskLevel,
          category: 'Layout',
          message: table.message,
          suggestion: table.isLayoutTable
            ? 'Convert layout table to single-column format'
            : 'Consider simplifying table structure',
          platforms: table.platformsAffected as unknown as PlatformType[],
        });
      });
      
      // Column risks
      providedLayoutAnalysis.columns.forEach((col) => {
        risks.push({
          severity: col.severity as RiskLevel,
          category: 'Layout',
          message: col.message,
          suggestion: 'Use single-column layout for better ATS compatibility',
          platforms: col.platformsAffected as unknown as PlatformType[],
        });
      });
    }
    
    // Add platform-specific issues
    comparison.scores.forEach(({ platform, issues }) => {
      issues.forEach((issue) => {
        risks.push({
          severity: issue.severity as RiskLevel,
          category: String(issue.category), // Convert numeric enum to string
          message: `${platform}: ${issue.message}`,
          suggestion: issue.suggestion,
          platforms: [platform],
        });
      });
    });
    
    return risks;
  }, [providedLayoutAnalysis, comparison]);

  // Generate score message based on overall score
  const scoreMessage = useMemo(() => {
    if (overallScore >= 85) {
      return 'Excellent ATS compatibility!';
    } else if (overallScore >= 60) {
      return 'Some improvements recommended.';
    } else {
      return 'Significant issues detected.';
    }
  }, [overallScore]);

  return (
    <div className={cn("bg-white rounded-lg shadow-lg p-6 space-y-6", className)}>
      {/* Header with score gauge */}
      <div className="flex items-start gap-6">
        <ScoreGauge score={overallScore} size="lg" />
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-2">ATS Risk Report</h2>
          <p className="text-gray-600">
            Your resume scores {overallScore}/100 across major ATS platforms. {scoreMessage}
          </p>
        </div>
      </div>
      
      {/* Score breakdown by category */}
      <ScoreBreakdown 
        scores={[
          { category: ScoreCategory.PARSING, score: categoryScores.parsing, weight: 40 },
          { category: ScoreCategory.KEYWORDS, score: categoryScores.keywords, weight: 30 },
          { category: ScoreCategory.FORMAT, score: categoryScores.format, weight: 20 },
          { category: ScoreCategory.LAYOUT, score: categoryScores.layout, weight: 10 }
        ]} 
      />
      
      {/* Platform comparison */}
      <PlatformComparison comparison={comparison} />
      
      {/* Risk items list */}
      <RiskItemsList risks={allRisks} />
    </div>
  );
}

export default ATSRiskReport;
