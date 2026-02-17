import { cn } from '@/shared/lib/utils';
import { PlatformType, PlatformScore, RiskLevel } from '../types';
import type { PlatformComparison as PlatformComparisonType } from '../platforms';

/**
 * Platform display information with icons and colors
 * Only showing major 4 platforms used in comparison
 */
const platformInfo: Record<string, { name: string; icon: string; color: string }> = {
  [PlatformType.WORKDAY]: { name: 'Workday', icon: '💼', color: 'bg-orange-100 text-orange-800' },
  [PlatformType.TALEO]: { name: 'Taleo', icon: '📋', color: 'bg-blue-100 text-blue-800' },
  [PlatformType.GREENHOUSE]: { name: 'Greenhouse', icon: '🌱', color: 'bg-green-100 text-green-800' },
  [PlatformType.LEVER]: { name: 'Lever', icon: '🎯', color: 'bg-purple-100 text-purple-800' },
};

/**
 * Props for the PlatformComparison component
 */
export interface PlatformComparisonProps {
  /** Platform comparison data */
  comparison: PlatformComparisonType;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get risk level badge content
 */
function getRiskBadgeContent(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.NONE:
      return 'Clean';
    case RiskLevel.LOW:
      return 'Minor Issues';
    case RiskLevel.MEDIUM:
      return 'Caution';
    case RiskLevel.HIGH:
      return 'Problems';
    case RiskLevel.CRITICAL:
      return 'Critical';
    default:
      return 'Unknown';
  }
}

/**
 * Get badge color class based on score
 */
function getBadgeColorClass(score: number): string {
  if (score >= 85) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

/**
 * Platform comparison component showing side-by-side ATS scores
 * 
 * Displays 4 ATS platforms (Workday, Taleo, Greenhouse, Lever) 
 * with their individual scores, risk levels, and issue summaries.
 * Highlights best and worst performing platforms.
 * 
 * @example
 * ```tsx
 * <PlatformComparison comparison={platformComparisonData} />
 * ```
 */
export function PlatformComparison({ comparison, className }: PlatformComparisonProps) {
  // Defensive: Handle undefined or empty comparison
  if (!comparison || !comparison.scores || comparison.scores.length === 0) {
    return (
      <div className={cn("p-4 text-center text-gray-500", className)}>
        <p>No platform comparison data available.</p>
        <p className="text-sm mt-1">Add more content to your resume to see platform analysis.</p>
      </div>
    );
  }

  const { scores, bestPlatform, worstPlatform } = comparison;
  
  // Defensive: Handle undefined best/worst platforms
  const safeBestPlatform = bestPlatform ?? { platform: PlatformType.LEVER, score: 0 };
  const safeWorstPlatform = worstPlatform ?? { platform: PlatformType.WORKDAY, score: 0 };
  
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-medium text-gray-700">
        How Different ATS Read Your Resume
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {scores.map((platformScore: PlatformScore) => {
          const info = platformInfo[platformScore.platform] ?? { name: platformScore.platform, icon: '📄', color: 'bg-gray-100' };
          const isBest = platformScore.platform === safeBestPlatform.platform;
          const isWorst = platformScore.platform === safeWorstPlatform.platform;
          
          return (
            <div
              key={platformScore.platform}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                isBest ? 'border-green-400 bg-green-50' :
                isWorst ? 'border-red-400 bg-red-50' :
                'border-gray-200 bg-white',
                "hover:shadow-md"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{info.icon}</span>
                <span className="font-semibold text-sm">{info.name}</span>
              </div>
              
              <div className="text-2xl font-bold mb-1">
                {platformScore.score}/100
              </div>
              
              <div className={cn(
                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                getBadgeColorClass(platformScore.score)
              )}>
                {getRiskBadgeContent(platformScore.riskLevel)}
              </div>
              
              {platformScore.issues.length > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  {platformScore.issues.slice(0, 2).map((issue, i) => (
                    <div key={i} className="flex items-start gap-1">
                      <span>⚠️</span>
                      <span className="truncate">{issue.message}</span>
                    </div>
                  ))}
                  {platformScore.issues.length > 2 && (
                    <div className="text-gray-400">
                      +{platformScore.issues.length - 2} more
                    </div>
                  )}
                </div>
              )}
              
              {isBest && (
                <div className="mt-2 text-xs font-medium text-green-600">
                  ✓ Best Compatibility
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Summary insight */}
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <span className="font-medium">Insight:</span> Your resume performs best on {platformInfo[safeBestPlatform.platform]?.name ?? 'Unknown'} 
        ({safeBestPlatform.score}/100) but may have issues with {platformInfo[safeWorstPlatform.platform]?.name ?? 'Unknown'} 
        ({safeWorstPlatform.score}/100).
      </div>
    </div>
  );
}

export default PlatformComparison;
