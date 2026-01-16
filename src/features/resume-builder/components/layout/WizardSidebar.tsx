import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, MouseSensor, TouchSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { useSortable, arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Simple sortable item component
const SortableItem = ({ id, children, disabled }: { id: string; children: React.ReactNode; disabled?: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? (isDragging ? 100 : 1) : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="w-full group/sortable relative">
      <div
        {...listeners}
        className={cn(
          "absolute -left-1 top-1/2 -translate-y-1/2 p-1 transition-opacity cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground",
          disabled && "hidden"
        )}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </div>
      {children}
    </div>
  );
};

import { useWizard } from '@/shared/contexts/WizardContext';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useATS } from '@/shared/hooks/use-ats';
import { TEMPLATE_OPTIONS } from '@/shared/config/wizardSteps';
import { TemplateCustomizer } from '@/features/resume-builder/components/editor/steps/TemplateCustomizer';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import { Badge } from '@/shared/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Circle, Sparkles, Plus, Edit, Save, Layout, GripVertical, ChevronDown, ChevronUp, PanelLeftClose, PanelLeft } from 'lucide-react';
import { SectionAIAnalysis } from '@/features/resume-builder/components/editor/SectionAIAnalysis';
import { useSectionAnalysis } from '@/shared/hooks/useSectionAnalysis';
import { useMediaQuery } from '@/shared/hooks/use-media-query';

interface WizardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const WizardSidebar: React.FC<WizardSidebarProps> = ({ isCollapsed, onToggle }) => {
  const { resumeData, addCustomSection, updateCustomSection, updateResumeData, reorderSections } = useResume();
  const { wizardState, steps, currentStep, goToStep, canNavigateToStep, getStepCompletion, setSelectedTemplate } = useWizard();
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const [isAIAnalysisExpanded, setIsAIAnalysisExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { atsScore, analysis: atsAnalysis } = useATS(resumeData);

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isCompact = useMediaQuery('(max-width: 1280px)');

  // AI Content Analysis Logic
  const analysisEnabledSteps = ['summary', 'experience', 'projects', 'achievements', 'education', 'skills'];
  const showSectionAnalysis = analysisEnabledSteps.includes(currentStep.id) || currentStep.id.startsWith('custom:');

  const getSectionData = () => {
    switch (currentStep.id) {
      case 'summary': return resumeData.summary;
      case 'experience': return resumeData.experience;
      case 'projects': return resumeData.projects;
      case 'achievements': return resumeData.achievements;
      case 'education': return resumeData.education;
      case 'skills': return resumeData.skills;
      default: return null;
    }
  };

  const sectionData = getSectionData();
  const { analysis: sectionAnalysis, isAnalyzing, triggerAnalysis } = useSectionAnalysis(currentStep.id, sectionData);

  const prefersReducedMotion = useMemo(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const getStatusColor = (stepId: string) => {
    const completion = getStepCompletion(stepId);
    if (completion === 100) return 'bg-green-500';
    if (completion > 50) return 'bg-blue-500';
    if (completion > 0) return 'bg-yellow-500';
    return 'bg-muted';
  };

  const getStatusIcon = (stepId: string) => {
    const completion = getStepCompletion(stepId);
    if (completion === 100) return <CheckCircle2 className="h-3 w-3 text-green-500" />;
    if (completion > 0) return <Circle className="h-3 w-3 fill-current text-yellow-500" />;
    return <Circle className="h-3 w-3 text-muted-foreground" />;
  };

  const getATSScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    if (score >= 30) return 'text-orange-500';
    return 'text-red-500';
  };

  const getATSScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    if (score >= 30) return 'Poor';
    return 'Critical';
  };

  const handleAddSection = () => {
    const id = Date.now().toString();
    const newSectionId = `custom:${id}`;
    const newSection = {
      id,
      title: `Custom ${resumeData.customSections.length + 1}`,
      description: '',
      fields: [],
      entries: []
    };

    addCustomSection(newSection);

    // Update sectionOrder to include the new section
    const currentOrder = resumeData.metadata?.sectionOrder || [
      'personal', 'summary', 'experience', 'education', 'skills', 'projects', 'achievements', 'certifications'
    ];
    const newOrder = [...currentOrder, newSectionId];
    reorderSections(newOrder);

    // Give WizardContext a tick to recompute steps, then navigate
    setTimeout(() => {
      goToStep(newSectionId);
    }, 0);
  };

  const handleEditSection = (sectionId: string, title: string) => {
    setEditingSectionId(sectionId);
    setSectionTitle(title);
  };

  const handleSaveSectionTitle = (sectionId: string, index: number) => {
    if (sectionTitle.trim()) {
      updateCustomSection(index, {
        ...resumeData.customSections[index],
        title: sectionTitle.trim()
      });
    }
    setEditingSectionId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, sectionId: string, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveSectionTitle(sectionId, index);
    } else if (e.key === 'Escape') {
      setEditingSectionId(null);
    }
  };

  const handleBlur = (sectionId: string, index: number) => {
    if (sectionTitle.trim()) {
      handleSaveSectionTitle(sectionId, index);
    } else {
      setEditingSectionId(null);
    }
  };

  useEffect(() => {
    if (editingSectionId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingSectionId]);

  // Set up drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const currentOrder = resumeData.metadata?.sectionOrder?.length
        ? resumeData.metadata.sectionOrder
        : ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'achievements', 'certifications'];

      const oldIndex = currentOrder.indexOf(active.id.toString());
      const newIndex = currentOrder.indexOf(over.id.toString());

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove([...currentOrder], oldIndex, newIndex);
        reorderSections(newOrder);
      }
    }
  };

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <div className="flex h-full flex-col items-center py-4 border-r bg-card">
          <div className="relative w-full px-2 mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="w-full hover:bg-accent"
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                <p className="font-medium">Expand Sidebar</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="mb-4"
                onClick={handleAddSection}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              <p className="font-medium">Add Custom Section</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex-1 w-full space-y-1 px-2">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep.id === step.id;
              const completion = getStepCompletion(step.id);
              const isCustomStep = step.id.startsWith('custom:');
              const sectionId = isCustomStep ? step.id.replace('custom:', '') : '';
              const section = isCustomStep ? (resumeData.customSections || []).find(s => s.id === sectionId) : null;
              const sectionName = isCustomStep ? (section?.title || 'Custom Section') : step.title;

              return (
                <Tooltip key={step.id}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'w-full relative',
                        isActive && 'bg-accent ring-1 ring-primary/20'
                      )}
                      onClick={() => canNavigateToStep(step.id) && goToStep(step.id)}
                      disabled={!canNavigateToStep(step.id)}
                    >
                      <Icon className="h-4 w-4" />
                      {/* Completion indicator */}
                      <div
                        className={cn(
                          "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all",
                          completion === 100 ? "bg-green-500 w-4" :
                            completion > 0 ? "bg-yellow-500 w-3" : "bg-muted w-2"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={10} className="flex flex-col gap-1">
                    <p className="font-medium">{sectionName}</p>
                    <p className="text-xs text-muted-foreground">
                      {completion === 100 ? '✓ Complete' :
                        completion > 0 ? `${completion}% complete` : 'Not started'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>

          {/* ATS Score Mini */}
          <div className="mt-4 px-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors cursor-default",
                  atsScore >= 70 ? "border-green-500 text-green-500" :
                    atsScore >= 50 ? "border-yellow-500 text-yellow-500" : "border-red-500 text-red-500"
                )}>
                  {atsScore}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                <p className="font-medium">ATS Score: {atsScore}%</p>
                <p className="text-xs text-muted-foreground">{getATSScoreLabel(atsScore)}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex h-full flex-col border-r bg-card transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4 flex-shrink-0">
        <div className="flex items-center gap-2 overflow-hidden">
          <Sparkles className="h-5 w-5 text-primary shrink-0" />
          {!isCompact && (
            <h2 className="font-semibold truncate">Resume Wizard</h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider delayDuration={400}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("h-8 px-2", isCompact ? "w-8 p-0" : "text-xs")}
                  onClick={() => { }}
                >
                  <Save className="h-3.5 w-3.5" />
                  {!isCompact && <span className="ml-1.5">Save Draft</span>}
                </Button>
              </TooltipTrigger>
              {isCompact && <TooltipContent>Save Draft</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onToggle}>
                  <PanelLeftClose className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Collapse Sidebar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-4">
          {/* Section List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Sections</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={handleAddSection}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={(resumeData.metadata?.sectionOrder?.length
                  ? resumeData.metadata.sectionOrder
                  : ['personal', 'summary', 'experience', 'education', 'skills', 'projects', 'achievements', 'certifications']
                ).filter(id => id !== 'template' && id !== 'review')}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {steps.filter(s => s.id !== 'template' && s.id !== 'review').map((step, index) => {
                    const isActive = currentStep.id === step.id;
                    const canNavigate = canNavigateToStep(step.id);
                    const completion = getStepCompletion(step.id);
                    const isCustomStep = step.id.startsWith('custom:');
                    const sectionId = isCustomStep ? step.id.replace('custom:', '') : '';
                    const sectionIndex = isCustomStep ? (resumeData.customSections || []).findIndex(s => s.id === sectionId) : -1;
                    const section = isCustomStep ? (resumeData.customSections || [])[sectionIndex] : null;
                    const sectionName = isCustomStep ? (section?.title || 'Untitled Section') : step.title;

                    return (
                      <SortableItem key={step.id} id={step.id}>
                        <div
                          className={cn(
                            'relative flex items-center gap-2 p-2 rounded-md transition-all group',
                            isActive ? 'bg-accent shadow-sm' : 'hover:bg-accent/50',
                            'cursor-pointer',
                            !canNavigate && 'opacity-50 cursor-not-allowed'
                          )}
                          onClick={() => canNavigate && goToStep(step.id)}
                        >
                          <div className="flex-1 flex items-center gap-2 min-w-0 ml-4">
                            <div>{getStatusIcon(step.id)}</div>
                            {isCustomStep && editingSectionId === sectionId ? (
                              <input
                                ref={inputRef}
                                type="text"
                                value={sectionTitle}
                                onChange={(e) => setSectionTitle(e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, sectionId, sectionIndex)}
                                onBlur={() => handleBlur(sectionId, sectionIndex)}
                                className="w-full bg-transparent border-b border-primary focus:outline-none focus:border-primary text-sm font-medium text-foreground"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <TooltipProvider delayDuration={300}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className={cn('truncate text-sm block max-w-[120px] xl:max-w-[150px]', isActive ? 'font-semibold' : 'font-medium')}>
                                      {sectionName}
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" sideOffset={8}>
                                    <p className="font-medium">{sectionName}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {completion === 100 ? '✓ Complete' :
                                        completion > 0 ? `${completion}% complete` : 'Click to start'}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>

                          {isCustomStep && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditSection(sectionId, section?.title || '');
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          )}

                          <div className="w-10 ml-auto">
                            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                              <div
                                className={cn('h-full transition-all duration-500', getStatusColor(step.id))}
                                style={{ width: `${completion}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </SortableItem>
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>

            {/* Review Step Fixed Link */}
            {steps.find(s => s.id === 'review') && (
              <div
                className={cn(
                  'flex items-center gap-3 p-2 rounded-md hover:bg-accent/50 cursor-pointer mt-2 border border-transparent',
                  currentStep.id === 'review' && 'bg-accent border-accent shadow-sm'
                )}
                onClick={() => goToStep('review')}
              >
                <div className="ml-4">{getStatusIcon('review')}</div>
                <span className={cn('truncate text-sm', currentStep.id === 'review' ? 'font-semibold' : 'font-medium')}>Review & Export</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Navigation Buttons */}
          <div className="flex justify-between gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("flex-1 h-8", isCompact ? "w-8 px-0" : "text-xs")}
                  onClick={() => {
                    const currentIndex = steps.findIndex(step => step.id === currentStep.id);
                    if (currentIndex > 0) goToStep(steps[currentIndex - 1].id);
                  }}
                  disabled={steps.findIndex(step => step.id === currentStep.id) === 0}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  {!isCompact && <span className="ml-1">Previous</span>}
                </Button>
              </TooltipTrigger>
              {isCompact && <TooltipContent>Previous Step</TooltipContent>}
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("flex-1 h-8", isCompact ? "w-8 px-0" : "text-xs")}
                  onClick={() => {
                    const currentIndex = steps.findIndex(step => step.id === currentStep.id);
                    if (currentIndex < steps.length - 1) goToStep(steps[currentIndex + 1].id);
                  }}
                  disabled={steps.findIndex(step => step.id === currentStep.id) === steps.length - 1}
                >
                  {!isCompact && <span className="mr-1">Next</span>}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              {isCompact && <TooltipContent>Next Step</TooltipContent>}
            </Tooltip>
          </div>

          <Separator />

          {/* ATS Score Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">ATS Score</h3>
              <Badge variant={atsScore >= 70 ? 'default' : 'destructive'} className="text-[10px] px-1.5 py-0 h-5">
                {!isCompact ? getATSScoreLabel(atsScore) : atsScore}
              </Badge>
            </div>
            <div className={cn(
              "flex items-center bg-muted/30 rounded-lg border border-muted transition-all",
              isCompact ? "p-2 gap-2" : "p-4 gap-4"
            )}>
              <div className={cn("relative shrink-0", isCompact ? "h-12 w-12" : "h-16 w-16")}>
                <svg className={cn("-rotate-90 transform", isCompact ? "h-12 w-12" : "h-16 w-16")}>
                  <circle
                    cx={isCompact ? "24" : "32"}
                    cy={isCompact ? "24" : "32"}
                    r={isCompact ? "20" : "28"}
                    stroke="currentColor"
                    strokeWidth={isCompact ? "3" : "4"}
                    fill="transparent"
                    className="text-muted"
                  />
                  <circle
                    cx={isCompact ? "24" : "32"}
                    cy={isCompact ? "24" : "32"}
                    r={isCompact ? "20" : "28"}
                    stroke="currentColor"
                    strokeWidth={isCompact ? "3" : "4"}
                    fill="transparent"
                    strokeDasharray={isCompact ? 125.6 : 175.9}
                    strokeDashoffset={(isCompact ? 125.6 : 175.9) - ((isCompact ? 125.6 : 175.9) * atsScore) / 100}
                    strokeLinecap="round"
                    className={cn("transition-all duration-1000", getATSScoreColor(atsScore))}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={cn('font-bold', isCompact ? 'text-sm' : 'text-lg', getATSScoreColor(atsScore))}>{atsScore}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("font-semibold text-foreground mb-0.5", isCompact ? "text-[10px]" : "text-xs")}>Resume Strength</p>
                {!isCompact && <p className="text-[10px] text-muted-foreground leading-tight">Your resume is {atsScore}% optimized for ATS systems.</p>}
              </div>
            </div>

            {/* ATS Suggestions */}
            {atsAnalysis.suggestions && atsAnalysis.suggestions.length > 0 && (
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="suggestions" className="border-none">
                  <AccordionTrigger className="text-xs font-bold py-2 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 text-primary" />
                      View Suggestions ({atsAnalysis.suggestions.length})
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-2">
                    <div className="space-y-2">
                      {atsAnalysis.suggestions.slice(0, 5).map((suggestion: any, index: number) => (
                        <div key={index} className="rounded-md border bg-muted/20 p-2 text-[10px]">
                          <div className="flex items-start gap-2">
                            <div className={cn(
                              "mt-1 rotate-45 h-1 w-1 shrink-0",
                              suggestion.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                            )} />
                            <span className="text-muted-foreground">{suggestion.text}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>

          <Separator />

          {/* AI Section Analysis */}
          {showSectionAnalysis && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <h3 className="text-sm font-medium text-muted-foreground">AI Content Score</h3>
                </div>
                {sectionAnalysis && (
                  <Badge variant="outline" className={cn(
                    "text-[10px] px-1.5 py-0 h-5 dark:border-opacity-20",
                    sectionAnalysis.score >= 80 ? "bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800" :
                      sectionAnalysis.score >= 60 ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800" :
                        "bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                  )}>
                    {sectionAnalysis.score}/100
                  </Badge>
                )}
              </div>

              <div className="bg-purple-500/10 dark:bg-purple-500/20 p-3 rounded-lg border border-purple-200/50 dark:border-purple-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-tighter">Current Section Quality</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-purple-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-500/10"
                    onClick={() => setIsAIAnalysisExpanded(!isAIAnalysisExpanded)}
                  >
                    {isAIAnalysisExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                </div>

                <AnimatePresence>
                  {isAIAnalysisExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <SectionAIAnalysis
                        score={sectionAnalysis?.score || 0}
                        strengths={sectionAnalysis?.strengths || []}
                        weaknesses={sectionAnalysis?.weaknesses || []}
                        suggestions={sectionAnalysis?.suggestions || []}
                        isAnalyzing={isAnalyzing}
                        onRefresh={triggerAnalysis}
                        className="bg-transparent border-none shadow-none pt-0 p-0"
                        hideHeader
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {!isAIAnalysisExpanded && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-purple-500/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 transition-all duration-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]"
                        style={{ width: `${sectionAnalysis?.score || 0}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">{sectionAnalysis?.score || 0}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Template Selection & Customization */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  Template
                </h3>
                <Badge variant="outline" className="text-[10px]">
                  {TEMPLATE_OPTIONS.length} Options
                </Badge>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {TEMPLATE_OPTIONS.map((template) => {
                  const isSelected = wizardState.selectedTemplate === template.id;
                  return (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={cn(
                        "group cursor-pointer p-2 rounded-lg border transition-all duration-200",
                        isSelected
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "bg-background hover:border-muted-foreground/30 hover:bg-muted/10 border-muted"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "h-2 w-2 rounded-full",
                            isSelected ? "bg-primary" : "bg-muted-foreground/30"
                          )} />
                          <span className={cn(
                            "text-[12px] font-semibold",
                            isSelected ? "text-primary" : "text-foreground"
                          )}>
                            {template.name}
                          </span>
                        </div>
                        {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <TemplateCustomizer />
          </div>

          {/* Footer Save Info */}
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                wizardState.autoSaveStatus === 'saved' ? 'bg-green-500' :
                  wizardState.autoSaveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' : 'bg-muted'
              )} />
              <span>
                {wizardState.autoSaveStatus === 'saved' ? 'All changes saved' :
                  wizardState.autoSaveStatus === 'saving' ? 'Saving changes...' : 'Auto-save enabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
