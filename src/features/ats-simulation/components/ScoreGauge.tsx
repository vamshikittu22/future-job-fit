import { cn } from '@/shared/lib/utils';

/**
 * Size configurations for the score gauge
 */
const sizes = {
  sm: { width: 80, stroke: 8, font: 'text-lg' },
  md: { width: 120, stroke: 12, font: 'text-2xl' },
  lg: { width: 180, stroke: 16, font: 'text-4xl' },
} as const;

/**
 * Props for the ScoreGauge component
 */
export interface ScoreGaugeProps {
  /** Score value from 0-100 */
  score: number;
  /** Size variant of the gauge */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the label/badge below the score */
  showLabel?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Get color based on score value
 */
function getScoreColor(score: number): string {
  if (score >= 85) return '#22c55e'; // green-500
  if (score >= 60) return '#eab308'; // yellow-500
  return '#ef4444'; // red-500
}

/**
 * Get badge level text based on score
 */
function getBadgeLevel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

/**
 * Circular score gauge component with animated progress
 * 
 * Displays a 0-100 score with color coding:
 * - Green (85+): Excellent
 * - Yellow (60-84): Good/Fair
 * - Red (<60): Poor
 * 
 * @example
 * ```tsx
 * <ScoreGauge score={75} size="lg" showLabel />
 * ```
 */
export function ScoreGauge({ 
  score, 
  size = 'md', 
  showLabel = true,
  className 
}: ScoreGaugeProps) {
  const { width, stroke, font } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const color = getScoreColor(score);
  const badgeLevel = getBadgeLevel(score);
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative" style={{ width, height: width }}>
        {/* Background circle */}
        <svg 
          className="transform -rotate-90" 
          width={width} 
          height={width}
          viewBox={`0 0 ${width} ${width}`}
        >
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ 
              transition: 'stroke-dashoffset 0.5s ease-out',
              transformOrigin: 'center',
            }}
          />
        </svg>
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", font)}>{score}</span>
          {showLabel && (
            <span className="text-xs text-gray-500">/100</span>
          )}
        </div>
      </div>
      {showLabel && (
        <div className={cn(
          "mt-2 text-sm font-medium",
          score >= 85 ? 'text-green-600' : 
          score >= 60 ? 'text-yellow-600' : 'text-red-600'
        )}>
          {badgeLevel}
        </div>
      )}
    </div>
  );
}

export default ScoreGauge;
