import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, ReactNode } from 'react';
import { debounce } from 'lodash';
import {
  JobData,
  SavedJob,
  JobContextValue,
  JobAction,
  ExtractedJobField
} from '@/shared/types/job';
import {
  initialJobData,
  JOB_STORAGE_KEY,
  SAVED_JOBS_KEY,
  MAX_SAVED_JOBS,
  generateJobId
} from '@/shared/lib/initialJobData';
import { setItemCompressed, getItemWithMigration, getQuotaStatus, formatBytes } from '@/shared/lib/storage';

// --- Types ---

interface JobState {
  currentJob: JobData | null;
  savedJobs: SavedJob[];
}

// --- Initial State ---

const initialState: JobState = {
  currentJob: null,
  savedJobs: []
};

// --- Reducer ---

function jobReducer(state: JobState, action: JobAction): JobState {
  switch (action.type) {
    case 'SET_CURRENT_JOB':
      return {
        ...state,
        currentJob: action.payload
      };

    case 'ADD_JOB': {
      const jobWithTimestamps = {
        ...action.payload,
        metadata: {
          ...action.payload.metadata,
          createdAt: action.payload.metadata.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      const newSavedJob: SavedJob = {
        job: jobWithTimestamps,
        version: 1
      };

      // Limit to MAX_SAVED_JOBS to prevent localStorage overflow
      const updatedSavedJobs = [newSavedJob, ...state.savedJobs].slice(0, MAX_SAVED_JOBS);
      
      return {
        ...state,
        currentJob: jobWithTimestamps,
        savedJobs: updatedSavedJobs
      };
    }

    case 'UPDATE_JOB': {
      const { id, updates } = action.payload;
      const now = new Date().toISOString();
      
      // Update in savedJobs list
      const updatedSavedJobs = state.savedJobs.map(savedJob => {
        if (savedJob.job.id === id) {
          return {
            ...savedJob,
            job: {
              ...savedJob.job,
              ...updates,
              metadata: {
                ...savedJob.job.metadata,
                ...updates.metadata,
                updatedAt: now
              }
            },
            version: (savedJob.version || 1) + 1
          };
        }
        return savedJob;
      });

      // Update currentJob if it's the same job
      const updatedCurrentJob = state.currentJob?.id === id
        ? {
            ...state.currentJob,
            ...updates,
            metadata: {
              ...state.currentJob.metadata,
              ...updates.metadata,
              updatedAt: now
            }
          }
        : state.currentJob;

      return {
        ...state,
        currentJob: updatedCurrentJob,
        savedJobs: updatedSavedJobs
      };
    }

    case 'REMOVE_JOB': {
      const id = action.payload;
      const updatedSavedJobs = state.savedJobs.filter(savedJob => savedJob.job.id !== id);
      
      // Clear currentJob if it was the removed job
      const updatedCurrentJob = state.currentJob?.id === id ? null : state.currentJob;

      return {
        ...state,
        currentJob: updatedCurrentJob,
        savedJobs: updatedSavedJobs
      };
    }

    case 'LOAD_JOB': {
      const id = action.payload;
      const savedJob = state.savedJobs.find(sj => sj.job.id === id);
      
      if (savedJob) {
        return {
          ...state,
          currentJob: savedJob.job
        };
      }
      
      return state;
    }

    case 'CLEAR_CURRENT_JOB':
      return {
        ...state,
        currentJob: null
      };

    case 'UPDATE_EXTRACTED_FIELDS': {
      const { id, fields } = action.payload;
      const now = new Date().toISOString();
      
      // Update in savedJobs
      const updatedSavedJobs = state.savedJobs.map(savedJob => {
        if (savedJob.job.id === id) {
          return {
            ...savedJob,
            job: {
              ...savedJob.job,
              extractedFields: fields,
              metadata: {
                ...savedJob.job.metadata,
                updatedAt: now,
                lastAnalyzedAt: now
              }
            },
            version: (savedJob.version || 1) + 1
          };
        }
        return savedJob;
      });

      // Update currentJob if it matches
      const updatedCurrentJob = state.currentJob?.id === id
        ? {
            ...state.currentJob,
            extractedFields: fields,
            metadata: {
              ...state.currentJob.metadata,
              updatedAt: now,
              lastAnalyzedAt: now
            }
          }
        : state.currentJob;

      return {
        ...state,
        currentJob: updatedCurrentJob,
        savedJobs: updatedSavedJobs
      };
    }

    case 'ADD_NOTE': {
      const { id, note } = action.payload;
      const now = new Date().toISOString();
      
      // Update in savedJobs
      const updatedSavedJobs = state.savedJobs.map(savedJob => {
        if (savedJob.job.id === id) {
          const existingNotes = savedJob.job.notes || '';
          const updatedNotes = existingNotes
            ? `${existingNotes}\n\n${note}`
            : note;
          
          return {
            ...savedJob,
            job: {
              ...savedJob.job,
              notes: updatedNotes,
              metadata: {
                ...savedJob.job.metadata,
                updatedAt: now
              }
            },
            version: (savedJob.version || 1) + 1
          };
        }
        return savedJob;
      });

      // Update currentJob if it matches
      const updatedCurrentJob = state.currentJob?.id === id
        ? {
            ...state.currentJob,
            notes: state.currentJob.notes
              ? `${state.currentJob.notes}\n\n${note}`
              : note,
            metadata: {
              ...state.currentJob.metadata,
              updatedAt: now
            }
          }
        : state.currentJob;

      return {
        ...state,
        currentJob: updatedCurrentJob,
        savedJobs: updatedSavedJobs
      };
    }

    case 'SET_SAVED_JOBS':
      return {
        ...state,
        savedJobs: action.payload
      };

    default:
      return state;
  }
}

// --- Context ---

export const JobContext = createContext<JobContextValue | undefined>(undefined);

// --- Hook ---

export function useJob(): JobContextValue {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJob must be used within a JobProvider');
  }
  return context;
}

// --- Provider ---

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);
  const { currentJob, savedJobs } = state;

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = getItemWithMigration(JOB_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as JobData;
        dispatch({ type: 'SET_CURRENT_JOB', payload: parsed });
      }

      const savedJobsList = getItemWithMigration(SAVED_JOBS_KEY);
      if (savedJobsList) {
        const parsed = JSON.parse(savedJobsList) as SavedJob[];
        dispatch({ type: 'SET_SAVED_JOBS', payload: parsed });
      }
    } catch (error) {
      console.error('Failed to load job data from localStorage:', error);
    }
  }, []);

  // Auto-save current job to localStorage (debounced, 2-second delay)
  const debouncedSaveDraft = useRef(
    debounce((job: JobData | null) => {
      if (!job) {
        localStorage.removeItem(JOB_STORAGE_KEY);
        return;
      }
      try {
        setItemCompressed(JOB_STORAGE_KEY, JSON.stringify(job));
        
        // Dev mode: log storage metrics
        if (import.meta.env.DEV) {
          const status = getQuotaStatus();
          console.log(
            `[Storage] Job draft saved: ${formatBytes(status.used)} / ${formatBytes(status.total)} ` +
            `(${status.percentUsed.toFixed(1)}%)`
          );
        }
      } catch (error) {
        console.error('Failed to save job draft:', error);
      }
    }, 2000)
  ).current;

  useEffect(() => {
    debouncedSaveDraft(currentJob);
    return () => debouncedSaveDraft.cancel();
  }, [currentJob, debouncedSaveDraft]);

  // Save savedJobs list to localStorage whenever it changes
  useEffect(() => {
    try {
      setItemCompressed(SAVED_JOBS_KEY, JSON.stringify(savedJobs));
      
      // Dev mode: log storage metrics
      if (import.meta.env.DEV) {
        const status = getQuotaStatus();
        console.log(
          `[Storage] Jobs list saved: ${formatBytes(status.used)} / ${formatBytes(status.total)} ` +
          `(${status.percentUsed.toFixed(1)}%)`
        );
        if (status.warning) {
          console.warn(`[Storage] Warning: Storage usage above 80%`);
        }
      }
    } catch (error) {
      console.error('Failed to save jobs list:', error);
    }
  }, [savedJobs]);

  // --- Action Wrappers ---

  const setCurrentJob = useCallback((job: JobData) => {
    dispatch({ type: 'SET_CURRENT_JOB', payload: job });
  }, []);

  const addJob = useCallback((job: JobData) => {
    // Generate ID if not provided
    const jobWithId = job.id ? job : { ...job, id: generateJobId() };
    dispatch({ type: 'ADD_JOB', payload: jobWithId });
  }, []);

  const updateJob = useCallback((id: string, updates: Partial<JobData>) => {
    dispatch({ type: 'UPDATE_JOB', payload: { id, updates } });
  }, []);

  const removeJob = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_JOB', payload: id });
  }, []);

  const saveCurrentJob = useCallback(() => {
    if (!currentJob) {
      console.warn('Cannot save: no current job');
      return;
    }

    // Check if job already exists in savedJobs
    const existingIndex = savedJobs.findIndex(sj => sj.job.id === currentJob.id);
    
    if (existingIndex >= 0) {
      // Update existing
      dispatch({ type: 'UPDATE_JOB', payload: { id: currentJob.id, updates: currentJob } });
    } else {
      // Add new
      dispatch({ type: 'ADD_JOB', payload: currentJob });
    }
  }, [currentJob, savedJobs]);

  const loadJob = useCallback((id: string) => {
    dispatch({ type: 'LOAD_JOB', payload: id });
  }, []);

  const clearCurrentJob = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_JOB' });
  }, []);

  const updateExtractedFields = useCallback((fields: ExtractedJobField[]) => {
    if (!currentJob) {
      console.warn('Cannot update extracted fields: no current job');
      return;
    }
    dispatch({
      type: 'UPDATE_EXTRACTED_FIELDS',
      payload: { id: currentJob.id, fields }
    });
  }, [currentJob]);

  const addNote = useCallback((note: string) => {
    if (!currentJob) {
      console.warn('Cannot add note: no current job');
      return;
    }
    dispatch({
      type: 'ADD_NOTE',
      payload: { id: currentJob.id, note }
    });
  }, [currentJob]);

  // --- Context Value ---

  const contextValue: JobContextValue = {
    currentJob,
    savedJobs,
    setCurrentJob,
    addJob,
    updateJob,
    removeJob,
    saveCurrentJob,
    loadJob,
    clearCurrentJob,
    updateExtractedFields,
    addNote
  };

  return (
    <JobContext.Provider value={contextValue}>
      {children}
    </JobContext.Provider>
  );
};

export default JobContext;
