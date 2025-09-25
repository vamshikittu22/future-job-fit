import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { ResumeData, initialResumeData } from '../lib/initialData';

export interface SavedVersion {
  id: string;
  name: string;
  timestamp: string;
  data: ResumeData;
}

// History state for undo/redo
interface HistoryState {
  past: ResumeData[];
  present: ResumeData;
  future: ResumeData[];
}

type ResumeAction =
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'UPDATE_SECTION'; payload: { section: keyof ResumeData; data: any } }
  | { type: 'ADD_SKILL'; payload: { category: 'languages' | 'frameworks' | 'tools'; skill: string } }
  | { type: 'REMOVE_SKILL'; payload: { category: 'languages' | 'frameworks' | 'tools'; index: number } }
  | { type: 'ADD_EXPERIENCE'; payload: ResumeData['experience'][0] }
  | { type: 'UPDATE_EXPERIENCE'; payload: { index: number; data: ResumeData['experience'][0] } }
  | { type: 'REMOVE_EXPERIENCE'; payload: number }
  | { type: 'ADD_EDUCATION'; payload: ResumeData['education'][0] }
  | { type: 'UPDATE_EDUCATION'; payload: { index: number; data: ResumeData['education'][0] } }
  | { type: 'REMOVE_EDUCATION'; payload: number }
  | { type: 'ADD_PROJECT'; payload: ResumeData['projects'][0] }
  | { type: 'UPDATE_PROJECT'; payload: { index: number; data: ResumeData['projects'][0] } }
  | { type: 'REMOVE_PROJECT'; payload: number }
  | { type: 'ADD_ACHIEVEMENT'; payload: ResumeData['achievements'][0] }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: { index: number; data: ResumeData['achievements'][0] } }
  | { type: 'REMOVE_ACHIEVEMENT'; payload: number }
  | { type: 'ADD_CERTIFICATION'; payload: ResumeData['certifications'][0] }
  | { type: 'UPDATE_CERTIFICATION'; payload: { index: number; data: ResumeData['certifications'][0] } }
  | { type: 'REMOVE_CERTIFICATION'; payload: number }
  | { type: 'LOAD_FROM_STORAGE' }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_HISTORY' };

interface ResumeContextType {
  resumeData: ResumeData;
  canUndo: boolean;
  canRedo: boolean;
  dispatch: React.Dispatch<ResumeAction>;
  updateSection: (section: keyof ResumeData, data: any) => void;
  addSkill: (category: 'languages' | 'frameworks' | 'tools', skill: string) => void;
  removeSkill: (category: 'languages' | 'frameworks' | 'tools', index: number) => void;
  saveDraft: () => void;
  loadDraft: () => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  saveSnapshot: (name?: string) => string;
  restoreSnapshot: (versionId: string) => boolean;
  getSavedVersions: () => SavedVersion[];
  clearForm: () => void;
}

const resumeReducer = (state: ResumeData, action: ResumeAction): ResumeData => {
  switch (action.type) {
    case 'SET_RESUME_DATA':
      return action.payload;
    
    case 'UPDATE_SECTION':
      return {
        ...state,
        [action.payload.section]: action.payload.data,
      };
    
    case 'ADD_SKILL':
      return {
        ...state,
        skills: {
          ...state.skills,
          [action.payload.category]: [...state.skills[action.payload.category], action.payload.skill]
        }
      };
    
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: {
          ...state.skills,
          [action.payload.category]: state.skills[action.payload.category].filter((_, index) => index !== action.payload.index)
        }
      };
    
    case 'ADD_EXPERIENCE':
      return {
        ...state,
        experience: [...state.experience, action.payload],
      };
    
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.map((item, index) =>
          index === action.payload.index ? action.payload.data : item
        ),
      };
    
    case 'REMOVE_EXPERIENCE':
      return {
        ...state,
        experience: state.experience.filter((_, index) => index !== action.payload),
      };
    
    case 'ADD_EDUCATION':
      return {
        ...state,
        education: [...state.education, action.payload],
      };
    
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map((item, index) =>
          index === action.payload.index ? action.payload.data : item
        ),
      };
    
    case 'REMOVE_EDUCATION':
      return {
        ...state,
        education: state.education.filter((_, index) => index !== action.payload),
      };
    
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map((item, index) =>
          index === action.payload.index ? action.payload.data : item
        ),
      };
    
    case 'REMOVE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((_, index) => index !== action.payload),
      };
    
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
      };
    
    case 'UPDATE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map((item, index) =>
          index === action.payload.index ? action.payload.data : item
        ),
      };
    
    case 'REMOVE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.filter((_, index) => index !== action.payload),
      };
    
    case 'ADD_CERTIFICATION':
      return {
        ...state,
        certifications: [...state.certifications, action.payload],
      };
    
    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.map((item, index) =>
          index === action.payload.index ? action.payload.data : item
        ),
      };
    
    case 'REMOVE_CERTIFICATION':
      return {
        ...state,
        certifications: state.certifications.filter((_, index) => index !== action.payload),
      };
    
    default:
      return state;
  }
};

const STORAGE_KEY = 'resume_builder_draft';
const SNAPSHOTS_STORAGE_KEY = 'resume_builder_snapshots';
const HISTORY_LIMIT = 50;

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Helper function to create a deep copy of resume data
const cloneResumeData = (data: ResumeData): ResumeData => {
  return JSON.parse(JSON.stringify(data));
};

// History reducer for undo/redo
const historyReducer = (
  state: HistoryState,
  action: ResumeAction & { pastLimit?: boolean }
): HistoryState => {
  const { past, present, future } = state;
  
  switch (action.type) {
    case 'UNDO':
      if (past.length === 0) return state;
      const undoPrevious = past[past.length - 1];
      const undoNewPast = past.slice(0, past.length - 1);
      
      return {
        past: undoNewPast,
        present: undoPrevious,
        future: [present, ...future]
      };
      
    case 'REDO':
      if (future.length === 0) return state;
      const next = future[0];
      const newFuture = future.slice(1);
      
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
      
    case 'CLEAR_HISTORY':
      return {
        past: [],
        present: state.present,
        future: []
      };
      
    default:
      // For other actions, update the present state
      const defaultNewPresent = resumeReducer(present, action);
      
      // If the state hasn't changed, don't update history
      if (defaultNewPresent === present) return state;
      
      // Limit history size
      const defaultNewPast = action.pastLimit 
        ? [...past.slice(1), present]
        : [...past, present];
      
      return {
        past: defaultNewPast,
        present: defaultNewPresent,
        future: [] // Clear redo stack on new action
      };
  }
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};

interface ResumeProviderProps {
  children: ReactNode;
}

export const ResumeProvider: React.FC<ResumeProviderProps> = ({ children }) => {
  const [history, historyDispatch] = useReducer(historyReducer, {
    past: [],
    present: initialResumeData,
    future: []
  });
  
  const { present: resumeData, past, future } = history;
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  
  // Debounced save to localStorage - only save when user stops typing
  const debouncedSave = useRef(
    debounce((data: ResumeData) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    }, 2000) // Increased delay to 2 seconds
  ).current;
  
  // Save to localStorage whenever resumeData changes
  useEffect(() => {
    debouncedSave(resumeData);
    return () => debouncedSave.cancel();
  }, [resumeData, debouncedSave]);
  
  const dispatch = useCallback((action: ResumeAction) => {
    const pastLimit = past.length >= HISTORY_LIMIT;
    historyDispatch({ ...action, pastLimit });
  }, [past.length]);
  
  const updateSection = useCallback((section: keyof ResumeData, data: any) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { section, data } });
  }, [dispatch]);
  
  const addSkill = useCallback((category: 'languages' | 'frameworks' | 'tools', skill: string) => {
    dispatch({ type: 'ADD_SKILL', payload: { category, skill } });
  }, [dispatch]);
  
  const removeSkill = useCallback((category: 'languages' | 'frameworks' | 'tools', index: number) => {
    dispatch({ type: 'REMOVE_SKILL', payload: { category, index } });
  }, [dispatch]);
  
  const saveDraft = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  }, [resumeData]);
  
  const loadDraft = useCallback(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'SET_RESUME_DATA', payload: parsedData });
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
    }
  }, [dispatch]);
  
  const undo = useCallback(() => {
    if (canUndo) {
      historyDispatch({ type: 'UNDO' });
    }
  }, [canUndo]);
  
  const redo = useCallback(() => {
    if (canRedo) {
      historyDispatch({ type: 'REDO' });
    }
  }, [canRedo]);
  
  const clearHistory = useCallback(() => {
    historyDispatch({ type: 'CLEAR_HISTORY' });
  }, []);

  const saveSnapshot = useCallback((name?: string): string => {
    try {
      const existingSnapshots = getSavedVersions();
      const timestamp = new Date().toISOString();
      const snapshotName = name || `Resume Snapshot - ${new Date().toLocaleString()}`;

      const newSnapshot: SavedVersion = {
        id: `snapshot-${Date.now()}`,
        name: snapshotName,
        timestamp,
        data: cloneResumeData(resumeData)
      };

      const updatedSnapshots = [...existingSnapshots, newSnapshot];
      localStorage.setItem(SNAPSHOTS_STORAGE_KEY, JSON.stringify(updatedSnapshots));

      return newSnapshot.id;
    } catch (error) {
      console.error('Failed to save snapshot:', error);
      return '';
    }
  }, [resumeData]);

  const restoreSnapshot = useCallback((versionId: string): boolean => {
    try {
      const snapshots = getSavedVersions();
      const snapshot = snapshots.find(s => s.id === versionId);

      if (snapshot) {
        dispatch({ type: 'SET_RESUME_DATA', payload: snapshot.data });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to restore snapshot:', error);
      return false;
    }
  }, [dispatch]);

  const getSavedVersions = useCallback((): SavedVersion[] => {
    try {
      const stored = localStorage.getItem(SNAPSHOTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get saved versions:', error);
      return [];
    }
  }, []);

  const clearForm = useCallback(() => {
    dispatch({ type: 'SET_RESUME_DATA', payload: initialResumeData });
    clearHistory();
  }, [dispatch, clearHistory]);
  
  // Load saved data on initial render - ONLY ONCE
  useEffect(() => {
    loadDraft();
  }, []); // Empty dependency array to run only once on mount
  
  const value = {
    resumeData,
    canUndo,
    canRedo,
    dispatch,
    updateSection,
    addSkill,
    removeSkill,
    saveDraft,
    loadDraft,
    undo,
    redo,
    clearHistory,
    saveSnapshot,
    restoreSnapshot,
    getSavedVersions,
    clearForm
  };
  
  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};
