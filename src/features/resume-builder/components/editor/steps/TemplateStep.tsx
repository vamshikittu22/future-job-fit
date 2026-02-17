import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '@/shared/contexts/WizardContext';
import { useResume } from '@/shared/contexts/ResumeContext';
import { WizardStepContainer } from '@/features/resume-builder/components/layout/WizardStepContainer';
import { TEMPLATE_OPTIONS } from '@/shared/config/wizardSteps';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { CheckCircle2, Eye, Info, Sparkles, TrendingUp, Scale, ArrowLeftRight, Table2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import ResumePreview from '@/features/resume-builder/components/preview/ResumePreview';
import { sampleResumeData } from '@/shared/lib/sampleResumeData';
import type { ResumeData } from '@/shared/types/resume';
import { FullPreviewModal } from '@/features/resume-builder/components/modals/FullPreviewModal';
import { TemplateComparisonModal } from '@/features/resume-builder/components/modals/TemplateComparisonModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';

export const TemplateStep: React.FC = () => {
  const { wizardState, setSelectedTemplate } = useWizard();
  const { resumeData } = useResume();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [previewTemplateId, setPreviewTemplateId] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  // Determine which data to use for preview (prefer real data if available, else sample)
  const previewData = (resumeData?.personal?.name && resumeData.experience?.length)
    ? resumeData
    : sampleResumeData;

  const sectionOrder = [
    'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'achievements', 'certifications'
  ];

  return (
    <WizardStepContainer
      title="Choose Your Template"
      description="Select a professional layout optimized for ATS and human readability"
    >
      <div className="space-y-8">
        {/* Comparison Toggle or Info */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-dashed">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Template Guidance</h4>
              <p className="text-xs text-muted-foreground">Modern and Classic templates have the highest ATS success rates.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-2 border-primary/30 text-primary hover:bg-primary/5"
              onClick={() => setShowComparison(true)}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              Compare Templates
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                    <TrendingUp className="h-3.5 w-3.5" />
                    ATS Optimization Guide
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Learn how template choice affects ATS scoring</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATE_OPTIONS.map((template, index) => {
            const isSelected = wizardState.selectedTemplate === template.id;
            const isHovered = hoveredTemplate === template.id;

            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    'group relative flex flex-col h-full cursor-pointer transition-all duration-300 border-2 overflow-hidden',
                    isSelected
                      ? 'border-primary shadow-lg ring-1 ring-primary/20 bg-primary/5'
                      : 'hover:border-primary/40 hover:shadow-md bg-card'
                  )}
                  onClick={() => handleTemplateSelect(template.id)}
                  onMouseEnter={() => setHoveredTemplate(template.id)}
                  onMouseLeave={() => setHoveredTemplate(null)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base flex items-center gap-2 truncate">
                          {template.name}
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          )}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-1 mt-0.5">
                          {template.description}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={template.atsScore >= 90 ? 'default' : 'outline'}
                        className={cn(
                          "text-[10px] px-1.5 py-0 h-5 shrink-0 ml-2",
                          template.atsScore >= 90 ? "bg-green-500 hover:bg-green-600 border-none" : ""
                        )}
                      >
                        {template.atsScore}% ATS
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 flex-1 flex flex-col">
                    {/* Interactive Template Preview */}
                    <div className="relative aspect-[210/297] bg-white dark:bg-slate-900 rounded-md border shadow-sm overflow-hidden mb-4 group-hover:shadow-md transition-shadow">
                      {/* Scaled Resume Content */}
                      <div
                        className="absolute inset-x-0 top-0 origin-top p-4"
                        style={{ transform: 'scale(0.25)', width: '400%' }}
                      >
                        <ResumePreview
                          resumeData={previewData as ResumeData}
                          template={template.id}
                          sectionOrder={sectionOrder}
                        />
                      </div>

                      {/* Hover Overlay */}
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center flex-col gap-3 p-4 z-10"
                          >
                            <Button
                              size="sm"
                              className="w-full gap-2 font-bold"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewTemplateId(template.id);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              Full Preview
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              className="w-full font-bold"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTemplateSelect(template.id);
                              }}
                            >
                              {isSelected ? 'Selected' : 'Select Template'}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Quick Info Badge */}
                      <div className="absolute top-2 right-2 flex gap-1 z-0">
                        {template.id === 'modern' && (
                          <Badge className="bg-blue-500/20 text-blue-600 border-none text-[8px] h-4">Popular</Badge>
                        )}
                        {template.id === 'classic' && (
                          <Badge className="bg-amber-500/20 text-amber-600 border-none text-[8px] h-4">Classic</Badge>
                        )}
                      </div>
                    </div>

                    {/* Features & Tags */}
                    <div className="space-y-3 mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {template.bestFor.slice(0, 3).map((industry) => (
                          <span key={industry} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground whitespace-nowrap">
                            {industry}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t space-y-1.5">
                        {template.features.slice(0, 2).map((feature) => (
                          <div key={feature} className="flex items-center text-[10px] text-muted-foreground">
                            <CheckCircle2 className="h-3 w-3 mr-2 text-green-500 shrink-0" />
                            <span className="truncate">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <FullPreviewModal
        open={!!previewTemplateId}
        onOpenChange={(open) => !open && setPreviewTemplateId(null)}
        templateId={previewTemplateId || ''}
      />

      <TemplateComparisonModal
        open={showComparison}
        onOpenChange={setShowComparison}
        initialLeftTemplate={wizardState.selectedTemplate || 'modern'}
      />
    </WizardStepContainer>
  );
};
