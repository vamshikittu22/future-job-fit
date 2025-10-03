import React from 'react';
import { motion } from 'framer-motion';
import { useWizard } from '@/contexts/WizardContext';
import { WIZARD_STEPS } from '@/config/wizardSteps';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useMediaQuery } from '@/hooks/use-media-query';

export const ProgressStepper: React.FC = () => {
  const { wizardState, currentStep, goToStep, canNavigateToStep, getStepCompletion } = useWizard();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');

  if (isMobile) {
    return (
      <div className="bg-gradient-card shadow-swiss rounded-lg p-4 mb-6">
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Step {wizardState.currentStepIndex + 1} of {WIZARD_STEPS.length}
          </span>
          <h3 className="mt-1 text-lg font-semibold">{currentStep.title}</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-card shadow-swiss rounded-lg p-4 mb-6 overflow-hidden">
      <TooltipProvider>
        <div className="relative">
          {/* Progress bar background */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-muted -z-0"></div>
          
          <div className="flex items-start justify-between relative z-10 overflow-x-auto pb-2 -mx-2 px-2">
            {WIZARD_STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep.id === step.id;
              const isCompleted = wizardState.completedSteps.includes(step.id);
              const canNavigate = canNavigateToStep(step.id);
              const isLast = index === WIZARD_STEPS.length - 1;

              return (
                <div key={step.id} className="flex flex-col items-center px-1" style={{ minWidth: '60px' }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        className={cn(
                          'relative flex flex-col items-center gap-1 transition-all',
                          canNavigate && 'cursor-pointer hover:scale-105',
                          !canNavigate && 'cursor-not-allowed opacity-50',
                          'z-10' // Ensure buttons are above the progress bar
                        )}
                        onClick={() => canNavigate && goToStep(step.id)}
                        disabled={!canNavigate}
                        whileHover={canNavigate ? { scale: 1.05 } : {}}
                        whileTap={canNavigate ? { scale: 0.95 } : {}}
                      >
                        {/* Circle */}
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full border-2 font-semibold transition-all',
                            isActive && 'border-primary bg-primary text-primary-foreground shadow-lg scale-110',
                            isCompleted && !isActive && 'border-green-500 bg-green-500 text-white',
                            !isActive && !isCompleted && 'border-muted bg-background text-muted-foreground',
                            'text-xs' // Smaller text for numbers
                          )}
                        >
                          {isCompleted && !isActive ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : isActive ? (
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <Icon className="h-4 w-4" />
                            </motion.div>
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>

                        {/* Step Title */}
                        <div className="text-center">
                          <div
                            className={cn(
                              'text-[10px] leading-tight font-medium transition-colors whitespace-nowrap',
                              isActive && 'text-primary',
                              isCompleted && !isActive && 'text-green-600',
                              !isActive && !isCompleted && 'text-muted-foreground'
                            )}
                          >
                            {isTablet
                              ? step.title.split(' ')[0]
                              : step.title.split(' ').slice(0, 2).join(' ')}
                          </div>
                        </div>

                        {/* Active indicator pulse */}
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 -z-10 rounded-full bg-primary/20"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                      </motion.button>
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
          <div 
            className="absolute top-5 left-0 h-1 bg-primary/30 transition-all duration-500"
            style={{
              width: `${(WIZARD_STEPS.findIndex(step => step.id === currentStep.id) / (WIZARD_STEPS.length - 1)) * 100}%`,
              maxWidth: 'calc(100% - 32px)'
            }}
          ></div>
        </div>
      </TooltipProvider>
    </div>
  );
};
