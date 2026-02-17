import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '@/shared/contexts/WizardContext';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { useEffect } from 'react';

export const ProgressStepper: React.FC = () => {
  const {
    wizardState,
    currentStep,
    steps,
    canNavigateToStep,
    goToStep
  } = useWizard();

  // Debug logs
  useEffect(() => {
    console.log('Current step:', currentStep.id);
    console.log('Completed steps:', wizardState.completedSteps);
    console.log('Is current step completed?', wizardState.completedSteps.includes(currentStep.id));
  }, [currentStep.id, wizardState.completedSteps]);

  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  if (isMobile) {
    return (
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          Step {wizardState.currentStepIndex + 1} of {steps.length}
        </span>
        <h3 className="mt-1 text-lg font-semibold">{currentStep.title}</h3>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card shadow-swiss rounded-lg p-4 mb-6 overflow-hidden">
      <TooltipProvider>
        <div className="relative">
          {/* Progress bar background */}
          <div
            className="absolute top-5 bg-muted -z-0 h-1 rounded-full"
            style={{
              left: isTablet ? '35px' : '45px',
              right: isTablet ? '35px' : '45px'
            }}
          ></div>

          <div className="flex items-start justify-between relative z-10 overflow-x-auto pb-2 -mx-2 px-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep.id === step.id;
              const isCompleted = wizardState.completedSteps.includes(step.id);
              const canNavigate = canNavigateToStep(step.id);
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center shrink-0"
                  style={{ width: isTablet ? '70px' : '90px' }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          'relative flex flex-col items-center gap-2 transition-all group outline-none',
                          canNavigate && 'cursor-pointer',
                          !canNavigate && 'cursor-not-allowed opacity-50',
                          'z-10'
                        )}
                        onClick={() => canNavigate && goToStep(step.id)}
                        disabled={!canNavigate}
                      >
                        {/* Circle Container - Fixed Size to prevent layout shift */}
                        <div className="relative h-10 w-10 flex items-center justify-center shrink-0">
                          {/* Radiating pulse effect - Always absolute and doesn't affect layout */}
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-primary/10"
                              initial={{ scale: 1, opacity: 0.5 }}
                              animate={{ scale: 2, opacity: 0 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                            />
                          )}

                          {/* The actual circle */}
                          <div
                            className={cn(
                              'flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold transition-all duration-300 z-10 shrink-0',
                              isActive && 'border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]',
                              isCompleted && !isActive && 'border-green-500 bg-green-500 text-white',
                              !isActive && !isCompleted && 'border-muted bg-background text-muted-foreground',
                              'text-xs'
                            )}
                          >
                            {isCompleted && !isActive ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : isActive ? (
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex items-center justify-center"
                              >
                                <Icon className="h-4 w-4" />
                              </motion.div>
                            ) : (
                              <span className="text-xs">{index + 1}</span>
                            )}
                          </div>
                        </div>

                        {/* Step Title - Fixed Height Area to prevent jitter */}
                        <div className="h-10 flex flex-col items-center justify-start px-1 text-center overflow-hidden">
                          <span
                            className={cn(
                              'text-[10px] leading-tight font-medium transition-colors duration-300 subpixel-antialiased',
                              isActive && 'text-primary font-bold',
                              isCompleted && !isActive && 'text-green-600',
                              !isActive && !isCompleted && 'text-muted-foreground'
                            )}
                          >
                            {isTablet
                              ? (step.title.length > 8 ? step.title.substring(0, 8) + '...' : step.title)
                              : step.title}
                          </span>
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{step.title}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              );
            })}
          </div>

          {/* Progress bar fill */}
          {/* The calc above is tricky, simpler way is to use inset and width percent */}
          {/* Simpler Progress Bar Fill implementation */}
          <div
            className="absolute top-5 left-0 h-1 transition-all duration-500 bg-primary/40 rounded-full z-0"
            style={{
              left: isTablet ? '35px' : '45px',
              right: `calc(100% - ${isTablet ? '35px' : '45px'} - ${(steps.findIndex(step => step.id === currentStep.id) / Math.max(steps.length - 1, 1)) * 100}% + (${(steps.findIndex(step => step.id === currentStep.id) / Math.max(steps.length - 1, 1)) * (isTablet ? '70px' : '90px')}))`
            }}
          >
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};
