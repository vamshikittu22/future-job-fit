import React from 'react';
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
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';

interface FullPreviewModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    templateId: string;
}

export const FullPreviewModal: React.FC<FullPreviewModalProps> = ({
    open,
    onOpenChange,
    templateId,
}) => {
    const template = TEMPLATE_OPTIONS.find((t) => t.id === templateId);
    const [zoom, setZoom] = React.useState(0.8);

    if (!template) return null;

    const sectionOrder = [
        'personal',
        'summary',
        'experience',
        'education',
        'skills',
        'projects',
        'achievements',
        'certifications',
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
                <DialogHeader className="p-6 bg-card border-b flex-row items-center justify-between space-y-0">
                    <div className="flex items-center gap-4">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                                {template.name} Template
                                <Badge variant={template.atsScore >= 90 ? 'default' : 'secondary'} className="ml-2">
                                    ATS {template.atsScore}%
                                </Badge>
                            </DialogTitle>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center bg-muted rounded-lg p-1 mr-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setZoom(prev => Math.max(0.4, prev - 0.1))}
                            >
                                <ZoomOut className="h-4 w-4" />
                            </Button>
                            <span className="text-xs font-medium w-12 text-center">{Math.round(zoom * 100)}%</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
                            >
                                <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 ml-1"
                                onClick={() => setZoom(0.8)}
                            >
                                <Maximize2 className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-900/50 p-8 flex justify-center items-start scrollbar-hide">
                    <div
                        className="bg-white shadow-2xl origin-top transition-transform duration-200"
                        style={{
                            transform: `scale(${zoom})`,
                            marginBottom: `${(297 * 3.78 * (zoom - 1)) + 40}px`
                        }}
                    >
                        <ResumePreview
                            resumeData={sampleResumeData as ResumeData}
                            template={templateId}
                            sectionOrder={sectionOrder}
                            manualScale={zoom}
                        />
                    </div>
                </div>

                <div className="p-4 bg-card border-t flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close Preview
                    </Button>
                    <Button>
                        Select {template.name} Template
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
