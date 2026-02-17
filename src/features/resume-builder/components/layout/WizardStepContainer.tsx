import React, { useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '@/shared/contexts/WizardContext';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { ChevronLeft, ChevronRight, SkipForward, Save, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { SectionAIAnalysis } from '@/features/resume-builder/components/editor/SectionAIAnalysis';
import { validateStep } from '@/shared/config/wizardSteps';
import { useSectionAnalysis } from '@/shared/hooks/useSectionAnalysis';
import { useResume } from '@/shared/contexts/ResumeContext';
import { AutoSaveIndicator } from '@/features/resume-builder/components/layout/AutoSaveIndicator';

interface WizardStepContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  onNext?: () => void | Promise<void>;
  onPrevious?: () => void;
  hideNavigation?: boolean;
}

export const WizardStepContainer: React.FC<WizardStepContainerProps> = ({
  children,
  title,
  description,
  onNext,
  onPrevious,
  hideNavigation = false,
}) => {
  const {
    currentStep,
    nextStep,
    prevStep,
    skipStep,
    validateCurrentStep,
    wizardState,
    saveCurrentProgress,
  } = useWizard();
  const { resumeData } = useResume();

  // Determine if we should show AI analysis for this step
  const analysisEnabledSteps = ['summary', 'experience', 'projects', 'achievements', 'education', 'skills'];
  const showAnalysis = analysisEnabledSteps.includes(currentStep.id) || currentStep.id.startsWith('custom:');

  // Get data for the current section
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
  const { analysis, isAnalyzing, triggerAnalysis } = useSectionAnalysis(currentStep.id, sectionData);
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const errorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [lastChildren, setLastChildren] = React.useState<React.ReactNode>(children);
  React.useEffect(() => {
    if (children) {
      setLastChildren(children);
    }
  }, [children]);

  const isFirstStep = wizardState.currentStepIndex === 0;
  const canSkip = !currentStep.isRequired;

  // Real-time validation check for enabling/disabling Next button
  const liveValidation = useMemo(() => {
    // Build a data object that matches what validateStep expects
    const dataForValidation = {
      personal: resumeData.personal,
      summary: resumeData.summary,
      experience: resumeData.experience,
      education: resumeData.education,
      skills: resumeData.skills,
      projects: resumeData.projects,
      achievements: resumeData.achievements,
      certifications: resumeData.certifications,
      selectedTemplate: wizardState.selectedTemplate,
    };
    return validateStep(currentStep.id, dataForValidation);
  }, [currentStep.id, resumeData, wizardState.selectedTemplate]);

  // Determine if the Next button should be disabled
  const isNextDisabled = isProcessing || (currentStep.isRequired && !liveValidation.isValid);

  useEffect(() => {
    // Clear validation errors when step changes
    setValidationErrors([]);
  }, [currentStep.id]);

  // Auto-collapse sidebar on mobile when form inputs are focused
  useEffect(() => {
    if (!isMobile || !contentRef.current) return;

    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        // Dispatch custom event to collapse sidebar
        window.dispatchEvent(new CustomEvent('collapse-sidebar'));
      }
    };

    const content = contentRef.current;
    content.addEventListener('focusin', handleFocus);
    return () => content.removeEventListener('focusin', handleFocus);
  }, [isMobile]);

  const handleNext = async () => {
    setIsProcessing(true);
    setValidationErrors([]);

    try {
      // Run custom onNext if provided
      if (onNext) {
        await onNext();
      }

      // Validate current step
      const validation = validateCurrentStep();
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        // Scroll to error
        setTimeout(() => {
          errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        return;
      }

      // Proceed to next step
      nextStep();
    } catch (error) {
      console.error('Error in handleNext:', error);
      toast({
        title: 'Error',
        description: 'Failed to proceed to next step',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
    prevStep();
  };

  const handleSkip = () => {
    skipStep();
    toast({
      title: 'Step Skipped',
      description: `${currentStep.title} has been skipped`,
    });
  };

  const handleSaveDraft = () => {
    saveCurrentProgress();
    toast({
      title: 'Draft Saved',
      description: 'Your progress has been saved',
    });
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="border-b bg-card px-6 py-4 flex-shrink-0"
      >
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </motion.div>

      {/* Validation Errors (shown on submit attempt) */}
      {validationErrors.length > 0 && (
        <div ref={errorRef} className="px-6 pt-4 flex-shrink-0 bg-background">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium">Please fix the following errors:</div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Live Validation Summary (shown when step has requirements not yet met) */}
      {currentStep.isRequired && !liveValidation.isValid && validationErrors.length === 0 && (
        <div className="px-6 pt-4 flex-shrink-0 bg-background">
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <div className="font-medium flex items-center gap-2">
                <span>Complete this step to continue</span>
              </div>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                {liveValidation.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Success indicator when step is complete */}
      {currentStep.isRequired && liveValidation.isValid && (
        <div className="px-6 pt-4 flex-shrink-0 bg-background">
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-800 dark:text-green-200 font-medium">
              ✓ All required fields are complete. You can proceed to the next step.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Content Area - Scrollable */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 bg-background"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex gap-6 h-full"
        >
          {/* Main Form Content */}
          <div className="flex-1 transition-all duration-300 max-w-full">
            {children || lastChildren || <div className="text-muted-foreground text-center py-8">Loading section...</div>}
          </div>
        </motion.div>
      </div>

      {/* Navigation Bar - Fixed at bottom */}
      {!hideNavigation && (
        <div className="flex-shrink-0 border-t bg-background/95 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {!isFirstStep && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isProcessing}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}
              {canSkip && (
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  disabled={isProcessing}
                >
                  <SkipForward className="mr-2 h-4 w-4" />
                  Skip
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Auto-save indicator */}
              <AutoSaveIndicator />

              <Button
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isProcessing}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </Button>
              <Button
                onClick={handleNext}
                disabled={isNextDisabled}
                className={cn(
                  "transition-all duration-200",
                  isNextDisabled && !isProcessing && "opacity-60"
                )}
                title={isNextDisabled && !isProcessing ? "Complete required fields to continue" : undefined}
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
