import React, { useState, useRef, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useWizard } from '@/shared/contexts/WizardContext';
import { useResume } from '@/shared/contexts/ResumeContext';
import { useATS } from '@/shared/hooks/use-ats';
import { TEMPLATE_OPTIONS } from '@/shared/config/wizardSteps';
import { Button } from '@/shared/ui/button';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { Badge } from '@/shared/ui/badge';
import { Progress } from '@/shared/ui/progress';
import { Input } from '@/shared/ui/input';
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
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Circle, Sparkles, Plus, Edit, Save, Loader2, X } from 'lucide-react';
import { SortableItem } from '@/features/resume-builder/components/layout/SortableItem';

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

  // Status and progress functions
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

  // Custom section handlers
  const handleAddSection = () => {
    const id = `custom-${Date.now()}`;
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
      setEditingSectionId(null);
    }
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

  const handleSaveDraft = async () => {
    // This would typically save to a database or local storage
    console.log('Saving draft...');
    // Add your save logic here
  };

  // Focus the input when editing
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
      const oldIndex = resumeData.customSections.findIndex(s => s.id === active.id);
      const newIndex = resumeData.customSections.findIndex(s => s.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(resumeData.customSections, oldIndex, newIndex);
        reorderCustomSections(newOrder.map(section => section.id));
      }
    }
  };

  // Calculate ATS score
  const atsPercentage = Math.round(atsScore * 100);
  const atsColor = atsPercentage >= 70 ? 'bg-green-500' : 
                  atsPercentage >= 40 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={`flex flex-col h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          {!isCollapsed && <h2 className="font-semibold">Resume Builder</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Progress Section */}
        {!isCollapsed && (
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">ATS Score</span>
              <span className={`text-sm font-medium ${atsColor.replace('bg', 'text')}`}>
                {atsPercentage}%
              </span>
            </div>
            <Progress value={atsPercentage} className="h-2" />
            <div className="mt-2 text-xs text-muted-foreground">
              {analysis.length > 0 && (
                <div className="space-y-1 mt-2">
                  {analysis.slice(0, 2).map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {item.type === 'success' ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-yellow-500" />
                      )}
                      <span>{item.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Steps Navigation */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {steps.map((step) => {
              const isActive = currentStep.id === step.id;
              const canNavigate = canNavigateToStep(step.id);
              const completion = getStepCompletion(step.id);
              const Icon = step.icon;
              
              // Skip review step in the sidebar
              if (step.id === 'review') return null;

              // Handle custom sections
              if (step.id.startsWith('custom:')) {
                const sectionId = step.id.replace('custom:', '');
                const section = resumeData.customSections.find(s => s.id === sectionId);
                if (!section) return null;
                
                const index = resumeData.customSections.findIndex(s => s.id === sectionId);
                
                return (
                  <div key={step.id} className="relative group">
                    <div 
                      className={cn(
                        'flex items-center justify-between p-2 rounded-md hover:bg-accent',
                        isActive && 'bg-accent font-medium',
                        !canNavigate && 'opacity-60 cursor-not-allowed'
                      )}
                      onClick={() => canNavigate && goToStep(step.id)}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        {editingSectionId === section.id ? (
                          <Input
                            ref={inputRef}
                            type="text"
                            value={sectionTitle}
                            onChange={(e) => setSectionTitle(e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, section.id, index)}
                            onBlur={() => handleBlur(section.id, index)}
                            className="h-6 px-1 py-0 text-sm border-0 shadow-none focus-visible:ring-1"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <span className="truncate">{section.title}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <div className="h-2 w-12 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${getStatusColor(step.id)}`}
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                          <span>{completion}%</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditSection(section.id, section.title);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }

              // Regular steps
              return (
                <Button
                  key={step.id}
                  variant="ghost"
                  className={cn(
                    'w-full justify-between px-2 h-8',
                    isActive ? 'bg-accent font-medium' : 'font-normal',
                    !canNavigate && 'opacity-60 cursor-not-allowed'
                  )}
                  onClick={() => canNavigate && goToStep(step.id)}
                  disabled={!canNavigate}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="truncate text-left">{step.title}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-12 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${getStatusColor(step.id)}`}
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{completion}%</span>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Actions */}
        <div className="p-4 border-t space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={handleAddSection}
          >
            <Plus className="mr-2 h-4 w-4" />
            {!isCollapsed && 'Add Custom Section'}
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="w-full"
            onClick={handleSaveDraft}
            disabled={wizardState.autoSaveStatus === 'saving'}
          >
            {wizardState.autoSaveStatus === 'saving' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {!isCollapsed && 'Saving...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {!isCollapsed && 'Save Draft'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
