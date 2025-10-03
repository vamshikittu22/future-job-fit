import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResumeData } from '@/lib/initialData';
import { useResume } from './ResumeContext';
import { WIZARD_STEPS, validateStep, calculateStepCompletion, getStepStatus } from '@/config/wizardSteps';
import { debounce } from 'lodash';

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
  currentStep: typeof WIZARD_STEPS[0];
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
  
  const currentStep = WIZARD_STEPS[wizardState.currentStepIndex];
  
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
  
  // Debounced auto-save
  const debouncedAutoSave = useCallback(
    debounce(performAutoSave, 2000),
    [performAutoSave]
  );
  
  const triggerAutoSave = useCallback(() => {
    debouncedAutoSave();
  }, [debouncedAutoSave]);
  
  // Trigger auto-save when resume data changes
  useEffect(() => {
    if (resumeData) {
      triggerAutoSave();
    }
  }, [resumeData, triggerAutoSave]);
  
  // Calculate step completion and update state
  const updateStepStatus = useCallback(() => {
    const completed: string[] = [];
    const partial: string[] = [];
    
    WIZARD_STEPS.forEach(step => {
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
    
    setWizardState(prev => ({
      ...prev,
      completedSteps: completed,
      partialSteps: partial,
    }));
  }, [resumeData, wizardState.selectedTemplate]);
  
  // Update step status when data changes
  useEffect(() => {
    updateStepStatus();
  }, [updateStepStatus]);
  
  // Check if user can navigate to a specific step
  const canNavigateToStep = useCallback((stepId: string): boolean => {
    const targetIndex = WIZARD_STEPS.findIndex(s => s.id === stepId);
    if (targetIndex === -1) return false;
    
    // Can always go back to completed steps
    if (wizardState.completedSteps.includes(stepId)) return true;
    
    // Can go to current step
    if (targetIndex === wizardState.currentStepIndex) return true;
    
    // Can go to next step if current is complete or optional
    if (targetIndex === wizardState.currentStepIndex + 1) {
      const currentStepComplete = wizardState.completedSteps.includes(currentStep.id);
      const currentStepOptional = !currentStep.isRequired;
      return currentStepComplete || currentStepOptional;
    }
    
    // Can't skip ahead
    return false;
  }, [wizardState.completedSteps, wizardState.currentStepIndex, currentStep]);
  
  // Navigate to a specific step
  const goToStep = useCallback((stepId: string) => {
    if (!canNavigateToStep(stepId)) {
      console.warn(`Cannot navigate to step: ${stepId}`);
      return;
    }
    
    const stepIndex = WIZARD_STEPS.findIndex(s => s.id === stepId);
    if (stepIndex !== -1) {
      setWizardState(prev => ({ ...prev, currentStepIndex: stepIndex }));
      navigate(WIZARD_STEPS[stepIndex].path);
    }
  }, [canNavigateToStep, navigate]);
  
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
    if (wizardState.currentStepIndex < WIZARD_STEPS.length - 1) {
      const nextIndex = wizardState.currentStepIndex + 1;
      setWizardState(prev => ({ ...prev, currentStepIndex: nextIndex }));
      navigate(WIZARD_STEPS[nextIndex].path);
    }
  }, [currentStep, validateCurrentStep, wizardState, navigate]);
  
  // Navigate to previous step
  const prevStep = useCallback(() => {
    if (wizardState.currentStepIndex > 0) {
      const prevIndex = wizardState.currentStepIndex - 1;
      setWizardState(prev => ({ ...prev, currentStepIndex: prevIndex }));
      navigate(WIZARD_STEPS[prevIndex].path);
    }
  }, [wizardState.currentStepIndex, navigate]);
  
  // Skip current step (only for optional steps)
  const skipStep = useCallback(() => {
    if (!currentStep.isRequired) {
      setWizardState(prev => ({
        ...prev,
        skippedSteps: [...prev.skippedSteps, currentStep.id],
      }));
      
      // Navigate to next step
      if (wizardState.currentStepIndex < WIZARD_STEPS.length - 1) {
        const nextIndex = wizardState.currentStepIndex + 1;
        setWizardState(prev => ({ ...prev, currentStepIndex: nextIndex }));
        navigate(WIZARD_STEPS[nextIndex].path);
      }
    }
  }, [currentStep, wizardState.currentStepIndex, navigate]);
  
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
    const stepIndex = WIZARD_STEPS.findIndex(s => s.path === currentPath);
    
    if (stepIndex !== -1 && stepIndex !== wizardState.currentStepIndex) {
      // Check if navigation is allowed
      const step = WIZARD_STEPS[stepIndex];
      if (canNavigateToStep(step.id)) {
        setWizardState(prev => ({ ...prev, currentStepIndex: stepIndex }));
      } else {
        // Redirect to current allowed step
        navigate(currentStep.path);
      }
    }
  }, [location.pathname, wizardState.currentStepIndex, canNavigateToStep, currentStep, navigate]);
  
  const contextValue: WizardContextType = {
    wizardState,
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

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
