import React from 'react';
import { Button, ButtonProps } from '@/shared/ui/button';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { resumeAI } from '@/shared/api/resumeAI';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/shared/ui/tooltip';

interface AIEnhanceButtonProps extends ButtonProps {
    showDemoBadge?: boolean;
}

export const AIEnhanceButton = React.forwardRef<HTMLButtonElement, AIEnhanceButtonProps>(
    ({ className, showDemoBadge = true, children, ...props }, ref) => {
        const isDemo = resumeAI.isDemoMode;

        const buttonContent = (
            <Button
                ref={ref}
                variant="outline"
                size="sm"
                className={cn(
                    "gap-2 shadow-sm transition-all duration-300 relative overflow-hidden group/ai-btn",
                    isDemo
                        ? "border-amber-200 hover:bg-amber-50 text-amber-700 hover:border-amber-300"
                        : "border-purple-200 hover:bg-purple-50 text-purple-700 hover:border-purple-300",
                    className
                )}
                {...props}
            >
                {/* Animated background glow for live mode */}
                {!isDemo && (
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-purple-500/0 -translate-x-full group-hover/ai-btn:animate-[shimmer_2s_infinite] pointer-events-none" />
                )}

                {isDemo ? (
                    <Zap className="h-4 w-4 text-amber-500 group-hover/ai-btn:scale-110 transition-transform" />
                ) : (
                    <Sparkles className="h-4 w-4 text-purple-500 group-hover/ai-btn:scale-110 transition-transform" />
                )}

                {children || "Enhance with AI"}

                {isDemo && showDemoBadge && (
                    <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20 ml-1">
                        <span className="text-[9px] font-black tracking-tighter uppercase leading-none">Demo</span>
                    </div>
                )}
            </Button>
        );

        return (
            <TooltipProvider delayDuration={200}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        {buttonContent}
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[240px] p-3 text-xs leading-relaxed">
                        {isDemo ? (
                            <div className="space-y-1.5">
                                <p className="font-bold flex items-center gap-1.5 text-amber-600">
                                    <Zap className="h-3 w-3" />
                                    Limited Demo Mode
                                </p>
                                <p className="text-muted-foreground">
                                    Generate content using pre-defined patterns. Connect Supabase for real-time GPT-4o powered improvements.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                <p className="font-bold flex items-center gap-1.5 text-purple-600">
                                    <ShieldCheck className="h-3 w-3" />
                                    Live AI Enhancement
                                </p>
                                <p className="text-muted-foreground">
                                    Using {resumeAI.currentProvider.toUpperCase()} to intelligently rewrite and optimize your content for ATS compatibility.
                                </p>
                            </div>
                        )}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
);

AIEnhanceButton.displayName = "AIEnhanceButton";
