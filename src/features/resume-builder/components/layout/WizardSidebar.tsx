import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
// Simple sortable item component
const SortableItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  return <div data-id={id} className="w-full">{children}</div>;
};
import { useWizard } from '@/shared/contexts/WizardContext';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useATS } from '@/shared/hooks/use-ats';
import { TEMPLATE_OPTIONS } from '@/shared/config/wizardSteps';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { cn } from '@/shared/lib/utils';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Circle, Sparkles, Plus, Edit, Save, Loader2 } from 'lucide-react';

interface WizardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const WizardSidebar: React.FC<WizardSidebarProps> = ({ isCollapsed, onToggle }) => {
  const { wizardState, steps, currentStep, goToStep, canNavigateToStep, getStepCompletion } = useWizard();
  const { resumeData, addCustomSection, updateCustomSection, reorderCustomSections } = useResume();
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionTitle, setSectionTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { atsScore, analysis } = useATS(resumeData);
  
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
    const newSection = { 
      id, 
      title: `Custom ${resumeData.customSections.length + 1}`, 
      description: '', 
      fields: [], 
      entries: [] 
    };
    addCustomSection(newSection);
    // Give WizardContext a tick to recompute steps, then navigate
    setTimeout(() => {
      goToStep(`custom:${id}`);
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
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = resumeData.customSections?.findIndex(section => `custom:${section.id}` === active.id) ?? -1;
      const newIndex = resumeData.customSections?.findIndex(section => `custom:${section.id}` === over.id) ?? -1;
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove([...resumeData.customSections], oldIndex, newIndex);
        reorderCustomSections(newOrder.map(section => section.id));
      }
    }
  };

  if (isCollapsed) {
    return (
      <div className="flex h-full flex-col items-center py-4 border-r">
        <div className="relative w-full px-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="absolute right-0 top-0 transform translate-x-1/2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {/* Quick add button in collapsed view */}
        <Button
          variant="outline"
          size="icon"
          className="mb-3"
          title="Add custom section"
          onClick={handleAddSection}
        >
          <Plus className="h-4 w-4" />
        </Button>
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep.id === step.id;
          return (
            <Button
              key={step.id}
              variant="ghost"
              size="icon"
              className={cn(
                'mb-2',
                isActive && 'bg-accent'
              )}
              onClick={() => canNavigateToStep(step.id) && goToStep(step.id)}
              disabled={!canNavigateToStep(step.id)}
            >
              <Icon className={cn('h-4 w-4', getStatusColor(step.id))} />
            </Button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col border-r">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Resume Wizard</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs"
            onClick={() => {}}
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            Save Draft
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="space-y-6 p-4 pb-6">
          {/* Step Navigation */}
          <div className="space-y-1">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Sections</h3>
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep.id === step.id;
              const canNavigate = canNavigateToStep(step.id);
              const completion = getStepCompletion(step.id);
              const isCustomStep = step.id.startsWith('custom:');
              const sectionId = isCustomStep ? step.id.replace('custom:', '') : '';
              const section = isCustomStep ? 
                (resumeData.customSections || []).find((s: any) => s.id === sectionId) : null;

              return (
                <motion.div 
                  key={step.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.2 }}
                  className={cn(
                    'relative flex items-center gap-2 p-2 rounded-md transition-all',
                    isActive ? 'bg-accent shadow-sm' : 'hover:bg-accent/50',
                    'cursor-pointer',
                    !canNavigate && 'opacity-50 cursor-not-allowed'
                  )}
                  onClick={() => canNavigate && goToStep(step.id)}
                  whileHover={!prefersReducedMotion ? { x: 2 } : {}}
                  whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
                >
                  {/* Connector line to next step */}
                  {index < steps.length - 1 && (
                    <motion.div 
                      className="absolute left-5 top-full w-px bg-border"
                      initial={{ height: 0 }}
                      animate={{ height: completion === 100 ? 16 : 16 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.3, delay: 0.1 }}
                    />
                  )}
                  
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <motion.div
                      animate={
                        isActive && !prefersReducedMotion 
                          ? { scale: [1, 1.1, 1] } 
                          : completion === 100 && !prefersReducedMotion
                          ? { scale: [1, 1.2, 1] }
                          : {}
                      }
                      transition={{ duration: 0.3 }}
                    >
                      {completion === 100 ? (
                        <motion.div
                          initial={prefersReducedMotion ? {} : { scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {getStatusIcon(step.id)}
                        </motion.div>
                      ) : (
                        getStatusIcon(step.id)
                      )}
                    </motion.div>
                    <span className={cn('truncate', isActive && 'font-semibold')}>
                      {isCustomStep ? (section?.title || 'Untitled Section') : step.title}
                    </span>
                  </div>
                  {!isCollapsed && (
                    <div className="w-16">
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          className={cn('h-full transition-colors', getStatusColor(step.id))}
                          initial={{ width: 0 }}
                          animate={{ width: `${completion}%` }}
                          transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          <Separator />

          {/* Custom Sections */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-muted-foreground">Custom Sections</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={handleAddSection}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
            </div>
            
            <div className="space-y-2">
              {resumeData.customSections.length > 0 ? (
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={resumeData.customSections.map(section => `custom:${section.id}`)}
                    strategy={verticalListSortingStrategy}
                  >
                    {resumeData.customSections.map((section, index) => {
                      const stepId = `custom:${section.id}`;
                      const step = steps.find(s => s.id === stepId);
                      const isActive = currentStep.id === stepId;
                      
                      return (
                        <SortableItem key={stepId} id={stepId}>
                          <div 
                            className={cn(
                              'flex items-center gap-2 p-2 rounded-md hover:bg-accent/50 group',
                              isActive && 'bg-accent',
                              'w-full'
                            )}
                            onClick={() => goToStep(stepId)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(stepId)}
                                {editingSectionId === section.id ? (
                                  <input
                                    ref={inputRef}
                                    type="text"
                                    value={sectionTitle}
                                    onChange={(e) => setSectionTitle(e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(e, section.id, index)}
                                    onBlur={() => handleBlur(section.id, index)}
                                    className="w-full bg-transparent border-b border-primary focus:outline-none focus:border-primary text-sm font-medium text-foreground"
                                    aria-label="Edit section title"
                                    placeholder="Section title"
                                    autoFocus
                                  />
                                ) : (
                                  <span className="truncate font-medium">
                                    {section.title || 'Untitled Section'}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditSection(section.id, section.title);
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <div className="h-4 w-px bg-border mx-1"></div>
                                <div className="h-4 w-4 flex items-center justify-center text-muted-foreground">
                                  <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </SortableItem>
                      );
                    })}
                  
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No custom sections added yet
                </div>
              )}
              
              {/* Navigation Buttons */}
              <div className="flex justify-between pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 px-3"
                  onClick={() => {
                    const currentIndex = steps.findIndex(step => step.id === currentStep.id);
                    if (currentIndex > 0) {
                      goToStep(steps[currentIndex - 1].id);
                    }
                  }}
                  disabled={steps.findIndex(step => step.id === currentStep.id) === 0}
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 px-3"
                  onClick={() => {
                    const currentIndex = steps.findIndex(step => step.id === currentStep.id);
                    if (currentIndex < steps.length - 1) {
                      goToStep(steps[currentIndex + 1].id);
                    }
                  }}
                  disabled={steps.findIndex(step => step.id === currentStep.id) === steps.length - 1}
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* ATS Score */}
          <motion.div 
            className="space-y-3"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-medium text-muted-foreground">ATS Score</h3>
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-center">
                <div className="relative h-32 w-32">
                  {/* Circular progress */}
                  <svg className="h-32 w-32 -rotate-90 transform">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-muted"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - atsScore / 100) }}
                      transition={{ duration: prefersReducedMotion ? 0 : 1, ease: 'easeOut', delay: 0.5 }}
                      className={cn('transition-colors duration-500', getATSScoreColor(atsScore))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      className={cn('text-3xl font-bold', getATSScoreColor(atsScore))}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.3 }}
                    >
                      {atsScore}
                    </motion.span>
                    <span className="text-xs text-muted-foreground">out of 100</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <Badge variant={atsScore >= 70 ? 'default' : 'destructive'}>
                  {getATSScoreLabel(atsScore)}
                </Badge>
              </div>
            </div>
          </motion.div>

          {/* ATS Suggestions */}
          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="suggestions">
                <AccordionTrigger className="text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Suggestions ({analysis.suggestions.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {analysis.suggestions.slice(0, 5).map((suggestion: any, index: number) => (
                      <div
                        key={index}
                        className="rounded-md border p-2 text-xs hover:bg-accent cursor-pointer transition-colors"
                      >
                        <div className="flex items-start gap-2">
                          <Badge
                            variant={
                              suggestion.priority === 'high'
                                ? 'destructive'
                                : suggestion.priority === 'medium'
                                ? 'default'
                                : 'secondary'
                            }
                            className="text-[10px] px-1 py-0"
                          >
                            {suggestion.priority}
                          </Badge>
                          <span className="flex-1">{suggestion.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {/* Template Switcher */}
          {wizardState.selectedTemplate && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Template</h3>
              <Select
                value={wizardState.selectedTemplate}
                onValueChange={(value) => goToStep('template')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_OPTIONS.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center gap-2">
                        <span>{template.name}</span>
                        <Badge variant="outline" className="text-xs">
                          ATS {template.atsScore}%
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Auto-save status */}
          <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Circle
                className={cn(
                  'h-2 w-2 fill-current',
                  wizardState.autoSaveStatus === 'saved' && 'text-green-500',
                  wizardState.autoSaveStatus === 'saving' && 'text-yellow-500 animate-pulse',
                  wizardState.autoSaveStatus === 'error' && 'text-red-500'
                )}
              />
              <span>
                {wizardState.autoSaveStatus === 'saved' && 'All changes saved'}
                {wizardState.autoSaveStatus === 'saving' && 'Saving...'}
                {wizardState.autoSaveStatus === 'error' && 'Save failed'}
                {wizardState.autoSaveStatus === 'idle' && 'Auto-save enabled'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
