import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { TEMPLATE_OPTIONS } from '@/shared/config/wizardSteps';
import ResumePreview from '@/features/resume-builder/components/preview/ResumePreview';
import { sampleResumeData } from '@/shared/lib/sampleResumeData';
import type { ResumeData } from '@/shared/types/resume';
import { X, ZoomIn, ZoomOut, ArrowLeftRight, Check, AlertTriangle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";

interface TemplateComparisonModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialLeftTemplate?: string;
    initialRightTemplate?: string;
}

export const TemplateComparisonModal: React.FC<TemplateComparisonModalProps> = ({
    open,
    onOpenChange,
    initialLeftTemplate = 'modern',
    initialRightTemplate = 'classic',
}) => {
    const [leftTemplateId, setLeftTemplateId] = useState(initialLeftTemplate);
    const [rightTemplateId, setRightTemplateId] = useState(initialRightTemplate);
    const [zoom, setZoom] = useState(0.45);

    const leftTemplate = TEMPLATE_OPTIONS.find((t) => t.id === leftTemplateId);
    const rightTemplate = TEMPLATE_OPTIONS.find((t) => t.id === rightTemplateId);

    const sectionOrder = [
        'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'achievements', 'certifications'
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[95vw] w-[1400px] h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 bg-card border-b flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ArrowLeftRight className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Template Comparison</DialogTitle>
                            <p className="text-sm text-muted-foreground">Compare layouts side-by-side to find your perfect fit.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-muted rounded-lg p-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(prev => Math.max(0.2, prev - 0.05))}>
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(prev => Math.min(0.8, prev + 0.05))}>
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => onOpenChange(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex overflow-hidden bg-slate-100 dark:bg-slate-900/50">
                    {/* Left Template Pane */}
                    <div className="flex-1 flex flex-col border-r h-full overflow-hidden">
                        <div className="p-4 bg-card border-b flex items-center justify-between gap-4">
                            <Select value={leftTemplateId} onValueChange={setLeftTemplateId}>
                                <SelectTrigger className="w-[180px] h-9">
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TEMPLATE_OPTIONS.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {leftTemplate && (
                                <Badge variant={leftTemplate.atsScore >= 90 ? 'default' : 'secondary'}>
                                    {leftTemplate.atsScore}% ATS Success
                                </Badge>
                            )}
                        </div>
                        <div className="flex-1 overflow-auto p-8 flex justify-center items-start scrollbar-hide bg-dot-pattern">
                            <div
                                className="bg-white shadow-xl origin-top transition-transform duration-200"
                                style={{ transform: `scale(${zoom})`, width: '210mm' }}
                            >
                                <ResumePreview
                                    resumeData={sampleResumeData as ResumeData}
                                    template={leftTemplateId}
                                    sectionOrder={sectionOrder}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Template Pane */}
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        <div className="p-4 bg-card border-b flex items-center justify-between gap-4">
                            <Select value={rightTemplateId} onValueChange={setRightTemplateId}>
                                <SelectTrigger className="w-[180px] h-9">
                                    <SelectValue placeholder="Select template" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TEMPLATE_OPTIONS.map(t => (
                                        <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {rightTemplate && (
                                <Badge variant={rightTemplate.atsScore >= 90 ? 'default' : 'secondary'}>
                                    {rightTemplate.atsScore}% ATS Success
                                </Badge>
                            )}
                        </div>
                        <div className="flex-1 overflow-auto p-8 flex justify-center items-start scrollbar-hide bg-dot-pattern">
                            <div
                                className="bg-white shadow-xl origin-top transition-transform duration-200"
                                style={{ transform: `scale(${zoom})`, width: '210mm' }}
                            >
                                <ResumePreview
                                    resumeData={sampleResumeData as ResumeData}
                                    template={rightTemplateId}
                                    sectionOrder={sectionOrder}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ATS Analysis Summary Footer */}
                <div className="p-4 bg-card border-t grid grid-cols-2 gap-8 divide-x">
                    <div className="px-4 space-y-2">
                        <h5 className="text-sm font-bold flex items-center gap-2">
                            <ArrowLeftRight className="h-4 w-4 text-primary" /> Key Differences
                        </h5>
                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Left Layout:</p>
                                <p className="font-semibold">{leftTemplate?.features[0]}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-muted-foreground">Right Layout:</p>
                                <p className="font-semibold">{rightTemplate?.features[0]}</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-8 space-y-2">
                        <h5 className="text-sm font-bold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" /> ATS Verdict
                        </h5>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {leftTemplateId === 'classic' || rightTemplateId === 'classic'
                                ? "The Classic template provides the most reliable parsing for older ATS systems used in Finance and Legal sectors."
                                : "Both selected templates are highly parsible by modern cloud-based ATS (Workday, Greenhouse, etc.)."}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
