import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface AIPromptCardProps {
  title?: string; // Default: "AI Quick Actions"
  examples: string[]; // List of prompt examples
  onApply: (prompt: string) => void; // Callback when user clicks a prompt
  className?: string;
}

export const AIPromptCard: React.FC<AIPromptCardProps> = ({
  title = "AI Quick Actions",
  examples,
  onApply,
  className
}) => {
  return (
    <Card className={cn("p-4 bg-background", className)}>
      <div className="flex items-start gap-3">
        {/* Icon container */}
        <div className="shrink-0 p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
          <Sparkles className="h-4 w-4 text-purple-600" />
        </div>
        
        {/* Content */}
        <div className="space-y-2 flex-1">
          <h4 className="text-sm font-semibold">{title}</h4>
          <div className="space-y-1.5">
            {examples.map((example, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs h-8 hover:bg-purple-50 dark:hover:bg-purple-950 hover:border-purple-300"
                onClick={() => onApply(example)}
              >
                <Sparkles className="h-3 w-3 mr-2 text-purple-600" />
                {example}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
