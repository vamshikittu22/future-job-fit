import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import { ScrollArea } from '@/shared/ui/scroll-area';
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
}

export const SectionAIAnalysis: React.FC<SectionAIAnalysisProps> = ({
    score,
    strengths,
    weaknesses,
    suggestions,
    isAnalyzing,
    onRefresh,
    className
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
        <Card className={cn("border-l-4 border-l-primary/50 overflow-hidden", className)}>
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
            <CardContent className="pt-4 space-y-5">

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
                                    <h4 className="text-xs font-bold uppercase text-green-600 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Strengths
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {strengths.map((str, i) => (
                                            <Badge key={i} variant="outline" className="text-[10px] bg-green-50/50 border-green-200 text-green-700">
                                                {str}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {suggestions.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase text-amber-600 flex items-center gap-1.5">
                                        <Lightbulb className="w-3.5 h-3.5" /> Improvements
                                    </h4>
                                    <ul className="space-y-2">
                                        {suggestions.map((sug, i) => (
                                            <li key={i} className="text-xs text-muted-foreground bg-amber-50/30 p-2 rounded border border-amber-100/50 flex gap-2 items-start">
                                                <span className="mt-0.5 block w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                                                {sug}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Weaknesses (Optional / If critical) */}
                            {weaknesses.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold uppercase text-red-600 flex items-center gap-1.5">
                                        <AlertCircle className="w-3.5 h-3.5" /> Critical Issues
                                    </h4>
                                    <ul className="space-y-1">
                                        {weaknesses.map((weak, i) => (
                                            <li key={i} className="text-xs text-red-600/80 pl-2 border-l-2 border-red-200">
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
