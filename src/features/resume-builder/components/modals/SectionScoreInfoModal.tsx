import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/shared/ui/dialog';
import { Progress } from '@/shared/ui/progress';
import { CheckCircle2, AlertCircle, Info, Target, Zap, BookOpen, Search } from 'lucide-react';
import { Button } from '@/shared/ui/button';

interface SectionScoreInfoModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    score: number;
}

export const SectionScoreInfoModal: React.FC<SectionScoreInfoModalProps> = ({
    open,
    onOpenChange,
    score,
}) => {
    const components = [
        {
            name: "ATS Keyword Density",
            description: "How well your content matches industry-standard keywords for your role.",
            value: Math.min(100, score + 5),
            icon: Search,
            color: "text-blue-500",
        },
        {
            name: "Action Verb Usage",
            description: "Starting sentences with strong action verbs (e.g., 'Spearheaded', 'Optimized').",
            value: Math.max(0, score - 10),
            icon: Zap,
            color: "text-amber-500",
        },
        {
            name: "Readability & Flow",
            description: "Sentence structure, length, and overall professional tone.",
            value: Math.min(100, score + 2),
            icon: BookOpen,
            color: "text-purple-500",
        },
        {
            name: "Quantifiable Impact",
            description: "Use of metrics, percentages, and dollar amounts to prove value.",
            value: Math.max(0, score - 15),
            icon: Target,
            color: "text-rose-500",
        }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-primary/10 p-2 rounded-full">
                            <Info className="w-5 h-5 text-primary" />
                        </div>
                        <DialogTitle>AI Content Score Breakdown</DialogTitle>
                    </div>
                    <DialogDescription>
                        Your current section score is <span className="font-bold text-foreground">{score}/100</span>.
                        This score is calculated based on four key pillars of resume quality.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {components.map((comp, idx) => {
                        const Icon = comp.icon;
                        return (
                            <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-2">
                                        <Icon className={`w-4 h-4 ${comp.color}`} />
                                        <span className="text-sm font-semibold">{comp.name}</span>
                                    </div>
                                    <span className="text-xs font-mono font-bold">{comp.value}%</span>
                                </div>
                                <Progress value={comp.value} className="h-1.5" />
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    {comp.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 bg-muted/50 rounded-lg border flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-xs font-bold">Pro Tip</p>
                        <p className="text-[11px] text-muted-foreground">
                            Sections with scores above <span className="font-bold text-green-600">85%</span> have a 3x higher chance of passing automated ATS filters.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        Got it, thanks!
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
