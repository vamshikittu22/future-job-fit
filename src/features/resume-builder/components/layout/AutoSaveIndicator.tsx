import React, { useMemo } from 'react';
import { useWizard } from '@/shared/contexts/WizardContext';
import { Cloud, CloudOff, Check, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/shared/ui/tooltip';

interface AutoSaveIndicatorProps {
    className?: string;
    showText?: boolean;
}

export const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({
    className,
    showText = true,
}) => {
    const { wizardState } = useWizard();
    const { autoSaveStatus, lastSavedAt } = wizardState;

    // Calculate relative time
    const relativeTime = useMemo(() => {
        if (!lastSavedAt) return null;

        const savedDate = new Date(lastSavedAt);
        const now = new Date();
        const diffMs = now.getTime() - savedDate.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);

        if (diffSecs < 10) return 'just now';
        if (diffSecs < 60) return `${diffSecs}s ago`;
        if (diffMins < 60) return `${diffMins}m ago`;
        return `${diffHours}h ago`;
    }, [lastSavedAt]);

    // Determine what to show based on status
    const getStatusConfig = () => {
        switch (autoSaveStatus) {
            case 'saving':
                return {
                    icon: <Loader2 className="h-4 w-4 animate-spin" />,
                    text: 'Saving...',
                    className: 'text-blue-500',
                    tooltip: 'Auto-saving your progress...',
                };
            case 'saved':
                return {
                    icon: <Check className="h-4 w-4" />,
                    text: 'Saved',
                    className: 'text-green-500',
                    tooltip: 'All changes saved',
                };
            case 'error':
                return {
                    icon: <CloudOff className="h-4 w-4" />,
                    text: 'Save failed',
                    className: 'text-destructive',
                    tooltip: 'Failed to save. Your changes may not be saved.',
                };
            case 'idle':
            default:
                if (lastSavedAt) {
                    return {
                        icon: <Cloud className="h-4 w-4" />,
                        text: `Saved ${relativeTime}`,
                        className: 'text-muted-foreground',
                        tooltip: `Last saved ${new Date(lastSavedAt).toLocaleTimeString()}`,
                    };
                }
                return {
                    icon: <Cloud className="h-4 w-4" />,
                    text: 'Not saved yet',
                    className: 'text-muted-foreground',
                    tooltip: 'Your progress will be auto-saved as you type',
                };
        }
    };

    const config = getStatusConfig();

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            'flex items-center gap-1.5 text-sm font-medium transition-all duration-300',
                            config.className,
                            autoSaveStatus === 'saving' && 'animate-pulse',
                            className
                        )}
                    >
                        {config.icon}
                        {showText && (
                            <span className="hidden sm:inline">{config.text}</span>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                    <p>{config.tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default AutoSaveIndicator;
