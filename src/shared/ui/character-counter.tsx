import React from 'react';
import { cn } from '@/shared/lib/utils';

interface CharacterCounterProps {
    current: number;
    max?: number;
    min?: number;
    recommended?: { min: number; max: number };
    showWords?: boolean;
    className?: string;
}

/**
 * Reusable Character/Word Counter component with color-coded feedback
 * 
 * Colors:
 * - Gray: Empty or below minimum
 * - Amber: Below recommended or approaching max
 * - Green: Within recommended range
 * - Red: Over maximum
 */
export const CharacterCounter: React.FC<CharacterCounterProps> = ({
    current,
    max,
    min = 0,
    recommended,
    showWords = false,
    className,
}) => {
    // Calculate word count if needed
    const wordCount = showWords
        ? current.toString().trim().split(/\s+/).filter(Boolean).length
        : 0;

    // Determine color based on thresholds
    const getColor = () => {
        // Over max limit - red
        if (max && current > max) {
            return 'text-destructive';
        }

        // Within recommended range - green
        if (recommended) {
            if (current >= recommended.min && current <= recommended.max) {
                return 'text-green-600 dark:text-green-400';
            }
            // Below recommended - amber
            if (current > 0 && current < recommended.min) {
                return 'text-amber-500';
            }
            // Above recommended but below max - amber
            if (current > recommended.max && (!max || current <= max)) {
                return 'text-amber-500';
            }
        }

        // Has content but no recommended range defined
        if (current > min && current > 0) {
            return 'text-muted-foreground';
        }

        // Empty or at minimum
        return 'text-muted-foreground/60';
    };

    // Get status message
    const getStatusMessage = () => {
        if (max && current > max) {
            return ` (${current - max} over limit)`;
        }

        if (recommended) {
            if (current === 0) {
                return '';
            }
            if (current < recommended.min) {
                return ' (add more detail)';
            }
            if (current >= recommended.min && current <= recommended.max) {
                return ' ✓';
            }
            if (current > recommended.max && (!max || current <= max)) {
                return ' (consider shortening)';
            }
        }

        return '';
    };

    return (
        <span className={cn('text-xs font-medium transition-colors', getColor(), className)}>
            {showWords ? (
                <>
                    {wordCount} words
                    {recommended && ` (${recommended.min}-${recommended.max} recommended)`}
                    {getStatusMessage()}
                </>
            ) : (
                <>
                    {current}{max ? `/${max}` : ''} chars
                    {recommended && !max && ` (${recommended.min}-${recommended.max} recommended)`}
                    {getStatusMessage()}
                </>
            )}
        </span>
    );
};

/**
 * Helper hook to count characters and words in text
 */
export const useTextCounts = (text: string) => {
    const charCount = text.length;
    const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

    return { charCount, wordCount };
};

export default CharacterCounter;
