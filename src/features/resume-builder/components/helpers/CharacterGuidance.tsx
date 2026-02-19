import { Card } from '@/shared/ui/card';
import { FileText } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface CharacterGuidanceProps {
  currentLength: number; // Current character or word count
  targetRange: [number, number]; // [min, max]
  unit: 'characters' | 'words' | 'bullets';
  guidanceText: string; // e.g., "3-4 lines, 100-150 words"
  className?: string;
}

export const CharacterGuidance: React.FC<CharacterGuidanceProps> = ({
  currentLength,
  targetRange,
  unit,
  guidanceText,
  className
}) => {
  const [min, max] = targetRange;
  const percentage = Math.min(100, (currentLength / max) * 100);
  
  const getStatus = () => {
    if (currentLength === 0) return 'empty';
    if (currentLength < min) return 'under';
    if (currentLength > max) return 'over';
    return 'good';
  };
  
  const status = getStatus();
  
  const statusColors = {
    empty: 'text-muted-foreground',
    under: 'text-yellow-600 dark:text-yellow-400',
    good: 'text-green-600 dark:text-green-400',
    over: 'text-red-600 dark:text-red-400'
  };
  
  const bgColors = {
    empty: 'bg-muted-foreground/20',
    under: 'bg-yellow-500/20',
    good: 'bg-green-500/20',
    over: 'bg-red-500/20'
  };
  
  const barColors = {
    empty: 'bg-muted-foreground',
    under: 'bg-yellow-500',
    good: 'bg-green-500',
    over: 'bg-red-500'
  };
  
  return (
    <Card className={cn("p-3 bg-blue-50 dark:bg-blue-950 border-blue-200", className)}>
      <div className="flex items-start gap-2">
        <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
        <div className="flex-1 space-y-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                Character guidance
              </p>
              <span className={cn("text-xs font-bold", statusColors[status])}>
                {currentLength} / {max} {unit}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className={cn("h-1.5 rounded-full overflow-hidden", bgColors[status])}>
              <div 
                className={cn("h-full transition-all duration-300", barColors[status])}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {guidanceText}
          </p>
        </div>
      </div>
    </Card>
  );
};
