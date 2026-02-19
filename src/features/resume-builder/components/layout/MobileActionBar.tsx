import React from 'react';
import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import { useWizard } from '@/shared/contexts/WizardContext';
import { cn } from '@/shared/lib/utils';

interface MobileActionBarProps {
  onOpenDrawer?: () => void;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({ onOpenDrawer }) => {
  const { steps, currentStep, nextStep, prevStep } = useWizard();
  const currentStepIndex = steps.findIndex(s => s.id === currentStep.id);
  
  const canGoPrev = currentStepIndex > 0;
  const canGoNext = currentStepIndex < steps.length - 1;
  const nextLabel = canGoNext ? 'Next' : 'Review';
  
  return (
    <div className="sticky bottom-0 z-20 bg-background border-t p-4 space-y-2">
      {/* Prev/Next buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={!canGoPrev}
          className="flex-1 h-11"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <Button
          onClick={nextStep}
          disabled={!canGoNext && currentStep.id === 'review'}
          className="flex-1 h-11"
        >
          {nextLabel}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {/* Jump to step button */}
      {onOpenDrawer && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-9 text-xs"
          onClick={onOpenDrawer}
        >
          <Menu className="h-3.5 w-3.5 mr-2" />
          Jump to step...
        </Button>
      )}
    </div>
  );
};
