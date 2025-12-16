import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResumeData } from '@/shared/lib/initialData';
import { useResume } from '@/shared/contexts/ResumeContext';
import { BASE_WIZARD_STEPS, getWizardSteps, validateStep, calculateStepCompletion, getStepStatus, type WizardStep } from '@/shared/config/wizardSteps';
import { Folder } from 'lucide-react';
import debounce from 'lodash/debounce';

// Wizard-specific state
export interface WizardState {
  currentStepIndex: number;
  completedSteps: string[];
  partialSteps: string[];
  validationErrors: Record<string, string[]>;
  selectedTemplate: string;
  currentDraftId: string | null;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
  skippedSteps: string[];
}

interface WizardContextType {
  // State
  wizardState: WizardState;
  steps: WizardStep[];
  currentStep: WizardStep;
  canNavigateToStep: (stepId: string) => boolean;
  
  // Navigation
  goToStep: (stepId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipStep: () => void;
  
  // Validation
  validateCurrentStep: () => { isValid: boolean; errors: string[] };
  getStepCompletion: (stepId: string) => number;
  getStepStatusByStep: (stepId: string) => 'complete' | 'partial' | 'empty';
  
  // State management
  markStepComplete: (stepId: string) => void;
  setSelectedTemplate: (templateId: string) => void;
  saveCurrentProgress: () => void;
  loadDraft: (draftId: string) => void;
  
  // Auto-save
  triggerAutoSave: () => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const WIZARD_STORAGE_KEY = 'resume-wizard-state';
const WIZARD_AUTOSAVE_KEY = 'resume-wizard-autosave';

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { resumeData, updateResumeData } = useResume();
  
  // Initialize wizard state
  const [wizardState, setWizardState] = useState<WizardState>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse wizard state:', e);
      }
    }
    
    return {
      currentStepIndex: 0,
      completedSteps: [],
      partialSteps: [],
      validationErrors: {},
      selectedTemplate: '',
      currentDraftId: null,
      autoSaveStatus: 'idle',
      skippedSteps: [],
    };
  });
  
  // Get steps with custom sections, ensuring review is always last
  const steps: WizardStep[] = useMemo(() => {
    return getWizardSteps(resumeData.customSections);
  }, [resumeData.customSections]);

  const currentStep = steps[wizardState.currentStepIndex] || steps[0];
  
  // Save wizard state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(wizardState));
  }, [wizardState]);
  
  // Auto-save functionality
  const performAutoSave = useCallback(() => {
    try {
      setWizardState(prev => ({ ...prev, autoSaveStatus: 'saving' }));
      
      const autoSaveData = {
        wizardState,
        resumeData,
        timestamp: new Date().toISOString(),
      };
      
      localStorage.setItem(WIZARD_AUTOSAVE_KEY, JSON.stringify(autoSaveData));
      
      setWizardState(prev => ({ ...prev, autoSaveStatus: 'saved' }));
      
      // Reset status after 2 seconds
      setTimeout(() => {
        setWizardState(prev => ({ ...prev, autoSaveStatus: 'idle' }));
      }, 2000);
    } catch (error) {
      console.error('Auto-save failed:', error);
      setWizardState(prev => ({ ...prev, autoSaveStatus: 'error' }));
    }
  }, [wizardState, resumeData]);
  
  // Debounced auto-save with useRef to maintain the same debounced function
  const debouncedAutoSave = React.useRef(
    debounce((data: any) => {
      performAutoSave();
    }, 2000)
  );
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      debouncedAutoSave.current.cancel();
    };
  }, []);
  
  const triggerAutoSave = React.useCallback(() => {
    debouncedAutoSave.current(resumeData);
  }, [resumeData]);
  
  // Trigger auto-save when resume data changes
  useEffect(() => {
    if (resumeData) {
      triggerAutoSave();
    }
  }, [resumeData, triggerAutoSave]);
  
  // Calculate step completion and update state
  const updateStepStatus = useCallback(() => {
    // Only update if the component is still mounted
    let isMounted = true;
    
    // Run the calculation in a timeout to prevent blocking the main thread
    const timer = window.setTimeout(() => {
      if (!isMounted) return;
      
      const completed: string[] = [];
      const partial: string[] = [];
      
      steps.forEach(step => {
        const completion = calculateStepCompletion(step.id, { 
          ...resumeData, 
          selectedTemplate: wizardState.selectedTemplate 
        });
        const status = getStepStatus(completion);
        
        if (status === 'complete') {
          completed.push(step.id);
        } else if (status === 'partial') {
          partial.push(step.id);
        }
      });
      
      // Only update if there are changes to prevent unnecessary re-renders
      if (isMounted) {
        setWizardState(prevState => {
          const newCompleted = [...new Set(completed)];
          const newPartial = [...new Set(partial)];
          
          // Only update if the values have actually changed
          if (
            newCompleted.length !== prevState.completedSteps.length ||
            !newCompleted.every((val, idx) => val === prevState.completedSteps[idx]) ||
            newPartial.length !== prevState.partialSteps.length ||
            !newPartial.every((val, idx) => val === prevState.partialSteps[idx])
          ) {
            return {
              ...prevState,
              completedSteps: newCompleted,
              partialSteps: newPartial,
            };
          }
          return prevState;
        });
      }
    }, 0); // Use a small timeout to prevent blocking the main thread
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [resumeData, wizardState.selectedTemplate, steps]);
  
  // Add a debug effect to log state changes
  useEffect(() => {
    console.log('Wizard state updated:', {
      currentStep: currentStep.id,
      completedSteps: wizardState.completedSteps,
      partialSteps: wizardState.partialSteps,
      resumeData: {
        experience: resumeData.experience?.map(exp => ({
          title: exp.title,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          current: exp.current,
          description: exp.description ? `${exp.description.substring(0, 20)}...` : null
        }))
      }
    });
  }, [wizardState.completedSteps, wizardState.partialSteps, currentStep.id, resumeData.experience]);
  
  // Update step status when data changes
  useEffect(() => {
    updateStepStatus();
  }, [updateStepStatus]);
  
  // Allow navigation to any step
  const canNavigateToStep = useCallback((stepId: string): boolean => {
    return steps.some(step => step.id === stepId);
  }, [steps]);
  
  // Navigate to a specific step
  const goToStep = useCallback((stepId: string) => {
    if (!canNavigateToStep(stepId)) {
      console.warn(`Cannot navigate to step: ${stepId}`);
      return;
    }
    
    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      setWizardState(prev => ({ ...prev, currentStepIndex: stepIndex }));
      navigate(steps[stepIndex].path);
    }
  }, [canNavigateToStep, navigate, steps]);
  
  // Validate current step
  const validateCurrentStep = useCallback((): { isValid: boolean; errors: string[] } => {
    const validation = validateStep(currentStep.id, {
      ...resumeData,
      selectedTemplate: wizardState.selectedTemplate,
    });
    
    setWizardState(prev => ({
      ...prev,
      validationErrors: {
        ...prev.validationErrors,
        [currentStep.id]: validation.errors,
      },
    }));
    
    return validation;
  }, [currentStep, resumeData, wizardState.selectedTemplate]);
  
  // Navigate to next step
  const nextStep = useCallback(() => {
    // Validate current step if required
    if (currentStep.isRequired) {
      const validation = validateCurrentStep();
      if (!validation.isValid) {
        console.warn('Current step validation failed:', validation.errors);
        return;
      }
    }
    
    // Mark current step as complete
    if (!wizardState.completedSteps.includes(currentStep.id)) {
      setWizardState(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, currentStep.id],
      }));
    }
    
    // Navigate to next step
    if (wizardState.currentStepIndex < steps.length - 1) {
      const nextIndex = wizardState.currentStepIndex + 1;
      setWizardState(prev => ({ ...prev, currentStepIndex: nextIndex }));
      navigate(steps[nextIndex].path);
    }
  }, [currentStep, validateCurrentStep, wizardState, navigate, steps]);
  
  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (wizardState.currentStepIndex > 0) {
      const prevIndex = wizardState.currentStepIndex - 1;
      setWizardState(prev => ({ ...prev, currentStepIndex: prevIndex }));
      navigate(steps[prevIndex].path);
    }
  }, [wizardState.currentStepIndex, navigate, steps]);
  
  // Skip current step (only for optional steps)
  const skipStep = useCallback(() => {
    if (!currentStep.isRequired) {
      setWizardState(prev => ({
        ...prev,
        skippedSteps: [...prev.skippedSteps, currentStep.id],
      }));
      
      // Navigate to next step if not at the end
      if (wizardState.currentStepIndex < steps.length - 1) {
        const nextIndex = wizardState.currentStepIndex + 1;
        setWizardState(prev => ({ ...prev, currentStepIndex: nextIndex }));
        navigate(steps[nextIndex].path);
      }
    }
  }, [currentStep, wizardState.currentStepIndex, navigate, steps]);
  
  // Get step completion percentage
  const getStepCompletion = useCallback((stepId: string): number => {
    return calculateStepCompletion(stepId, {
      ...resumeData,
      selectedTemplate: wizardState.selectedTemplate,
    });
  }, [resumeData, wizardState.selectedTemplate]);
  
  // Get step status
  const getStepStatusByStep = useCallback((stepId: string): 'complete' | 'partial' | 'empty' => {
    const completion = getStepCompletion(stepId);
    return getStepStatus(completion);
  }, [getStepCompletion]);
  
  // Mark step as complete
  const markStepComplete = useCallback((stepId: string) => {
    if (!wizardState.completedSteps.includes(stepId)) {
      setWizardState(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, stepId],
      }));
    }
  }, [wizardState.completedSteps]);
  
  // Set selected template
  const setSelectedTemplate = useCallback((templateId: string) => {
    setWizardState(prev => ({ ...prev, selectedTemplate: templateId }));
  }, []);
  
  // Save current progress manually
  const saveCurrentProgress = useCallback(() => {
    performAutoSave();
  }, [performAutoSave]);
  
  // Load draft
  const loadDraft = useCallback((draftId: string) => {
    try {
      const saved = localStorage.getItem(WIZARD_AUTOSAVE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setWizardState(data.wizardState);
        // Resume data is loaded separately through ResumeContext
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, []);
  
  // Sync current step with URL
  useEffect(() => {
    const currentPath = location.pathname;
    const stepIndex = steps.findIndex(s => s.path === currentPath);
    
    if (stepIndex !== -1 && stepIndex !== wizardState.currentStepIndex) {
      // Check if navigation is allowed
      const step = steps[stepIndex];
      if (canNavigateToStep(step.id)) {
        setWizardState(prev => ({ ...prev, currentStepIndex: stepIndex }));
      } else {
        // Redirect to current allowed step
        navigate(currentStep.path);
      }
    }
  }, [location.pathname, wizardState.currentStepIndex, canNavigateToStep, currentStep, navigate, steps]);
  
  const contextValue: WizardContextType = {
    wizardState,
    steps,
    currentStep,
    canNavigateToStep,
    goToStep,
    nextStep,
    prevStep,
    skipStep,
    validateCurrentStep,
    getStepCompletion,
    getStepStatusByStep,
    markStepComplete,
    setSelectedTemplate,
    saveCurrentProgress,
    loadDraft,
    triggerAutoSave,
  };
  
  return (
    <WizardContext.Provider value={contextValue}>
      {children}
    </WizardContext.Provider>
  );
};

// Create a custom hook to use the wizard context
export const useWizard = (): WizardContextType => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};

export default WizardProvider;
