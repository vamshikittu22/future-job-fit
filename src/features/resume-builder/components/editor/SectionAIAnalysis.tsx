import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import { Lightbulb, CheckCircle2, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionAIAnalysisProps {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    isAnalyzing: boolean;
    onRefresh: () => void;
    className?: string;
    hideHeader?: boolean;
}

export const SectionAIAnalysis: React.FC<SectionAIAnalysisProps> = ({
    score,
    strengths,
    weaknesses,
    suggestions,
    isAnalyzing,
    onRefresh,
    className,
    hideHeader = false
}) => {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getProgressColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <Card className={cn("border-l-4 border-l-primary/50", !hideHeader && "overflow-hidden", className)}>
            {!hideHeader && (
                <CardHeader className="pb-3 bg-muted/20">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            AI Analysis
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onRefresh}
                            disabled={isAnalyzing}
                            className={cn("h-6 w-6", isAnalyzing && "animate-spin")}
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </CardHeader>
            )}
            <CardContent className={cn("space-y-5", hideHeader ? "p-0 pt-2" : "pt-4")}>
                {/* Score Section */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className="text-xs font-medium text-muted-foreground">Quality Score</span>
                        <span className={cn("text-xl font-black", getScoreColor(score))}>
                            {score}/100
                        </span>
                    </div>
                    <Progress value={score} className="h-2" indicatorClassName={getProgressColor(score)} />
                </div>

                {isAnalyzing ? (
                    <div className="py-8 text-center text-muted-foreground text-sm flex flex-col items-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-primary/50" />
                        <p>Analyzing section content...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {/* Strengths */}
                            {strengths.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase text-green-600 dark:text-green-400 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {strengths.map((str, i) => (
                                            <Badge key={i} variant="outline" className="text-[10px] bg-green-500/10 dark:bg-green-500/20 border-green-200/50 dark:border-green-800/30 text-green-700 dark:text-green-400 whitespace-normal text-left">
                                                {str}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                        <Lightbulb className="w-3.5 h-3.5" /> Improvements
                                    </h4>
                                    <ul className="space-y-2">
                                        {suggestions.map((sug, i) => (
                                            <li key={i} className="text-xs text-muted-foreground bg-amber-500/10 dark:bg-amber-500/20 p-2 rounded border border-amber-200/50 dark:border-amber-800/30 flex gap-2 items-start">
                                                <span className="mt-0.5 block w-1 h-1 rounded-full bg-amber-500 shrink-0 shadow-[0_0_5px_rgba(245,158,11,0.5)]" />
                                                <span className="leading-tight text-foreground/80">{sug}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Weaknesses (Optional / If critical) */}
                            {weaknesses.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                        <AlertCircle className="w-3.5 h-3.5" /> Critical Issues
                                    </h4>
                                    <ul className="space-y-1">
                                        {weaknesses.map((weak, i) => (
                                            <li key={i} className="text-xs text-red-600 dark:text-red-400 pl-2 border-l-2 border-red-200 dark:border-red-900 leading-tight opacity-90">
                                                {weak}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </CardContent>
        </Card>
    );
};
