import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { AlertTriangle, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { useSectionRecommendations } from '@/shared/contexts/ATSContext';
import { cn } from '@/shared/lib/utils';

interface InlineRecommendationsProps {
    /** The section type (e.g., 'summary', 'experience', 'skills') */
    section: string;
    /** Optional index for array sections */
    index?: number;
    /** Maximum number of recommendations to show */
    maxItems?: number;
    /** Show missing keywords */
    showMissingKeywords?: boolean;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Inline recommendations component that can be placed in any editor step.
 * Shows ATS recommendations and missing keywords for the specific section.
 */
export const InlineRecommendations: React.FC<InlineRecommendationsProps> = ({
    section,
    index,
    maxItems = 3,
    showMissingKeywords = true,
    className,
}) => {
    const { recommendations, missingKeywords, coverage, hasJD } = useSectionRecommendations(section, index);

    // Don't render if no JD is provided
    if (!hasJD) {
        return null;
    }

    // Don't render if nothing to show
    if (recommendations.length === 0 && missingKeywords.length === 0) {
        return null;
    }

    const displayRecs = recommendations.slice(0, maxItems);
    const displayKeywords = showMissingKeywords ? missingKeywords.slice(0, 5) : [];

    return (
        <Card className={cn('border-dashed border-yellow-500/50 bg-yellow-50/30 dark:bg-yellow-950/10', className)}>
            <CardContent className="py-3 px-4">
                {/* Header with coverage */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-yellow-700 dark:text-yellow-400">
                        <Lightbulb className="h-4 w-4" />
                        ATS Suggestions
                    </div>
                    {coverage.total > 0 && (
                        <Badge variant="outline" className="text-xs">
                            {coverage.covered}/{coverage.total} keywords ({coverage.percentage}%)
                        </Badge>
                    )}
                </div>

                {/* Recommendations */}
                {displayRecs.length > 0 && (
                    <ul className="space-y-1 mb-2">
                        {displayRecs.map((rec) => (
                            <li key={rec.id} className="flex items-start gap-2 text-xs text-muted-foreground">
                                {rec.severity === 'critical' ? (
                                    <AlertTriangle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                                ) : rec.severity === 'warning' ? (
                                    <Target className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <TrendingUp className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                )}
                                <span>{rec.message}</span>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Missing keywords */}
                {displayKeywords.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-yellow-500/20">
                        <p className="text-xs text-muted-foreground mb-1">
                            Consider adding these keywords:
                        </p>
                        <div className="flex flex-wrap gap-1">
                            {displayKeywords.map((kw, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800">
                                    {kw.keyword}
                                </Badge>
                            ))}
                            {missingKeywords.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                    +{missingKeywords.length - 5} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
