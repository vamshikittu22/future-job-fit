import React from 'react';
import { useWizard } from '@/contexts/WizardContext';
import { useResume } from '@/contexts/ResumeContext';
import { useATS } from '@/hooks/use-ats';
import { WIZARD_STEPS, TEMPLATE_OPTIONS } from '@/config/wizardSteps';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, Circle, Sparkles } from 'lucide-react';

interface WizardSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const WizardSidebar: React.FC<WizardSidebarProps> = ({ isCollapsed, onToggle }) => {
  const { wizardState, currentStep, goToStep, canNavigateToStep, getStepCompletion } = useWizard();
  const { resumeData } = useResume();
  const { atsScore, analysis } = useATS(resumeData);

  const getStatusColor = (stepId: string) => {
    const completion = getStepCompletion(stepId);
    if (completion === 100) return 'text-green-500';
    if (completion > 0) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  const getStatusIcon = (stepId: string) => {
    const completion = getStepCompletion(stepId);
    if (completion === 100) return <CheckCircle2 className="h-3 w-3" />;
    if (completion > 0) return <Circle className="h-3 w-3 fill-current" />;
    return <Circle className="h-3 w-3" />;
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
        {WIZARD_STEPS.map((step) => {
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
        <Button variant="ghost" size="icon" onClick={onToggle}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="space-y-6 p-4 pb-6">
          {/* Step Navigation */}
          <div className="space-y-1">
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Steps</h3>
            {WIZARD_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep.id === step.id;
              const canNavigate = canNavigateToStep(step.id);
              const completion = getStepCompletion(step.id);

              return (
                <Button
                  key={step.id}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start gap-3 px-3 py-2 h-auto',
                    isActive && 'bg-accent border-l-4 border-accent-foreground'
                  )}
                  onClick={() => canNavigate && goToStep(step.id)}
                  disabled={!canNavigate}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{index + 1}</span>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{step.title}</div>
                      {completion > 0 && completion < 100 && (
                        <Progress value={completion} className="h-1 mt-1 w-full" />
                      )}
                    </div>
                    <div className={getStatusColor(step.id)}>
                      {getStatusIcon(step.id)}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          <Separator />

          {/* ATS Score */}
          <div className="space-y-3">
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
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - atsScore / 100)}`}
                      className={cn('transition-all duration-500', getATSScoreColor(atsScore))}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn('text-3xl font-bold', getATSScoreColor(atsScore))}>
                      {atsScore}
                    </span>
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
          </div>

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
