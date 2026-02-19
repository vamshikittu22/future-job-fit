import React from 'react';
import { Progress } from '@/shared/ui/progress';
import { useWizard } from '@/shared/contexts/WizardContext';
import { cn } from '@/shared/lib/utils';

export const MobileProgressBar: React.FC = () => {
  const { steps, currentStep } = useWizard();
  const currentStepIndex = steps.findIndex(s => s.id === currentStep.id);
  const Icon = currentStep.icon;
  
  // Calculate overall progress percentage
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;
  
  return (
    <div className="sticky top-0 z-20 bg-background border-b">
      {/* Overall progress bar */}
      <Progress 
        value={progressPercentage} 
        className="h-1 rounded-none"
      />
      
      {/* Current step indicator */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium truncate max-w-[180px]">
            {currentStep.label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>
    </div>
  );
};
