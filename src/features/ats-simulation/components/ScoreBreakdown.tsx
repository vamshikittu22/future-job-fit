import { cn } from '@/shared/lib/utils';
import { ScoreCategory } from '../types';

/**
 * Configuration for score categories with labels, colors, and weights
 */
const categoryConfig = [
  { key: ScoreCategory.PARSING, label: 'Parsing', color: 'bg-blue-500', weight: 40 },
  { key: ScoreCategory.KEYWORDS, label: 'Keywords', color: 'bg-purple-500', weight: 30 },
  { key: ScoreCategory.FORMAT, label: 'Format', color: 'bg-orange-500', weight: 20 },
  { key: ScoreCategory.LAYOUT, label: 'Layout', color: 'bg-pink-500', weight: 10 },
];

/**
 * Get config by category key
 */
function getCategoryConfig(category: ScoreCategory) {
  return categoryConfig.find(c => c.key === category) || categoryConfig[0];
}

/**
 * Props for the ScoreBreakdown component
 */
export interface ScoreBreakdownProps {
  /** Array of category scores with category, score, and weight */
  scores: Array<{
    category: ScoreCategory;
    score: number;
    weight: number;
  }>;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get text color class based on score
 */
function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * Score breakdown component with horizontal bar chart
 * 
 * Displays 4 category scores with weighted contributions:
 * - Parsing (40%): Section extraction accuracy
 * - Keywords (30%): JD keyword matching  
 * - Format (20%): ATS-friendly formatting
 * - Layout (10%): Visual structure risks
 * 
 * @example
 * ```tsx
 * <ScoreBreakdown 
 *   scores={[
 *     { category: ScoreCategory.PARSING, score: 85, weight: 40 },
 *     { category: ScoreCategory.KEYWORDS, score: 70, weight: 30 },
 *     { category: ScoreCategory.FORMAT, score: 90, weight: 20 },
 *     { category: ScoreCategory.LAYOUT, score: 60, weight: 10 }
 *   ]}
 * />
 * ```
 */
export function ScoreBreakdown({ scores, className }: ScoreBreakdownProps) {
  // Calculate total weighted score
  const totalScore = scores.reduce((acc, s) => acc + Math.round((s.score * s.weight) / 100), 0);
  
  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-sm font-medium text-gray-700">Score Breakdown</h3>
      
      {scores.map(({ category, score, weight }) => {
        const config = getCategoryConfig(category);
        const weightedScore = Math.round((score * weight) / 100);
        
        return (
          <div key={category} className="space-y-1 group">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-gray-600">
                {config.label} ({weight}%)
              </span>
              <span className={cn(
                "font-semibold",
                getScoreColorClass(score)
              )}>
                {score}/100
              </span>
            </div>
            
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500 group-hover:opacity-80",
                  config.color
                )}
                style={{ width: `${score}%` }}
              />
            </div>
            
            <div className="text-xs text-gray-400">
              Weighted: {weightedScore} pts
            </div>
          </div>
        );
      })}
      
      {/* Total contribution */}
      <div className="pt-2 border-t border-gray-100">
        <div className="flex justify-between text-sm font-semibold">
          <span>Total Score</span>
          <span>
            {totalScore}/100
          </span>
        </div>
      </div>
    </div>
  );
}

export default ScoreBreakdown;
