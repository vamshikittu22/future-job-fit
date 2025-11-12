import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '@/contexts/WizardContext';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronLeft, ChevronRight, SkipForward, Save, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/use-media-query';

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

      {/* Validation Errors */}
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

      {/* Content Area - Scrollable */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6 bg-background"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {children || lastChildren || <div className="text-muted-foreground text-center py-8">Loading section...</div>}
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

            <div className="flex gap-2">
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
                disabled={isProcessing}
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
