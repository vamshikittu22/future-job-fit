import { ReactNode } from 'react';
import { Card } from '@/shared/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

interface StepGuideCardProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  content: ReactNode;
}

export const StepGuideCard: React.FC<StepGuideCardProps> = ({
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100 dark:bg-blue-900',
  title,
  content
}) => {
  return (
    <Card className="p-4 bg-background border">
      <div className="flex items-start gap-3">
        {/* Icon container */}
        <div className={cn(
          'shrink-0 p-2 rounded-lg',
          iconBgColor
        )}>
          <Icon className={cn('h-4 w-4', iconColor)} />
        </div>
        
        {/* Content */}
        <div className="space-y-1 flex-1">
          <h4 className="text-sm font-semibold">{title}</h4>
          {typeof content === 'string' ? (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {content}
            </p>
          ) : (
            content
          )}
        </div>
      </div>
    </Card>
  );
};
