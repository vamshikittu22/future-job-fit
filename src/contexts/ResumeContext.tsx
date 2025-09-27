import React, { createContext, useContext, useReducer, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import { debounce } from 'lodash';
import { ResumeData, initialResumeData } from '../lib/initialData';

const STORAGE_KEY = 'resumeBuilderDraft';
const SNAPSHOTS_STORAGE_KEY = 'resumeBuilderSnapshots';
const HISTORY_LIMIT = 100;

const cloneResumeData = (data: ResumeData): ResumeData => JSON.parse(JSON.stringify(data));

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
  | { type: 'CLEAR_HISTORY' }
  | { type: 'UPDATE_RESUME'; payload: ResumeData };

interface ResumeContextType {
  resumeData: ResumeData;
  updateResumeData: (section: keyof ResumeData, data: any) => void;
  addSkill: (category: 'languages' | 'frameworks' | 'tools', skill: string) => void;
  removeSkill: (category: 'languages' | 'frameworks' | 'tools', index: number) => void;
  addExperience: (experience: ResumeData['experience'][0]) => void;
  updateExperience: (index: number, data: ResumeData['experience'][0]) => void;
  removeExperience: (index: number) => void;
  addEducation: (education: ResumeData['education'][0]) => void;
  updateEducation: (index: number, data: ResumeData['education'][0]) => void;
  removeEducation: (index: number) => void;
  addProject: (project: ResumeData['projects'][0]) => void;
  updateProject: (index: number, data: ResumeData['projects'][0]) => void;
  removeProject: (index: number) => void;
  saveResume: () => Promise<void>;
  loadResume: (id: string) => Promise<void>;
  savedVersions: SavedVersion[];
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clearForm: () => void;
  sections?: any[];
}

export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Reducer function for resume data
function resumeReducer(state: ResumeData, action: ResumeAction): ResumeData {
  switch (action.type) {
    case 'SET_RESUME_DATA':
        return action.payload;
    case 'UPDATE_SECTION':
        return { ...state, [action.payload.section]: action.payload.data };
    case 'ADD_SKILL':
      return {
        ...state,
        skills: {
          ...state.skills,
          [action.payload.category]: [
            ...(state.skills?.[action.payload.category] || []),
            action.payload.skill
          ]
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
  const [savedVersions, setSavedVersions] = useState<SavedVersion[]>([]);

  const dispatch = useCallback((action: ResumeAction) => {
    const pastLimit = past.length >= HISTORY_LIMIT;
    historyDispatch({ ...action, pastLimit });
  }, [past.length]);

  const debouncedSave = useRef(
    debounce((data: ResumeData) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to save draft:', error);
      }
    }, 2000)
  ).current;

  useEffect(() => {
    debouncedSave(resumeData);
    return () => debouncedSave.cancel();
  }, [resumeData, debouncedSave]);

  const updateResumeData = useCallback((section: keyof ResumeData, data: any) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { section, data } });
  }, [dispatch]);

  const addSkill = useCallback((category: 'languages' | 'frameworks' | 'tools', skill: string) => {
    dispatch({ type: 'ADD_SKILL', payload: { category, skill } });
  }, [dispatch]);

  const removeSkill = useCallback((category: 'languages' | 'frameworks' | 'tools', index: number) => {
    dispatch({ type: 'REMOVE_SKILL', payload: { category, index } });
  }, [dispatch]);

  const addExperience = useCallback((experience: ResumeData['experience'][0]) => {
    dispatch({ type: 'ADD_EXPERIENCE', payload: experience });
  }, [dispatch]);

  const updateExperience = useCallback((index: number, data: ResumeData['experience'][0]) => {
    dispatch({ type: 'UPDATE_EXPERIENCE', payload: { index, data } });
  }, [dispatch]);

  const removeExperience = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_EXPERIENCE', payload: index });
  }, [dispatch]);

  const addEducation = useCallback((education: ResumeData['education'][0]) => {
    dispatch({ type: 'ADD_EDUCATION', payload: education });
  }, [dispatch]);

  const updateEducation = useCallback((index: number, data: ResumeData['education'][0]) => {
    dispatch({ type: 'UPDATE_EDUCATION', payload: { index, data } });
  }, [dispatch]);

  const removeEducation = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_EDUCATION', payload: index });
  }, [dispatch]);

  const addProject = useCallback((project: ResumeData['projects'][0]) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  }, [dispatch]);

  const updateProject = useCallback((index: number, data: ResumeData['projects'][0]) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { index, data } });
  }, [dispatch]);

  const removeProject = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_PROJECT', payload: index });
  }, [dispatch]);

  const saveResume = useCallback(async (): Promise<void> => {
    // This is a placeholder. In a real app, you'd save to a server.
  }, []);

  const loadResume = useCallback(async (id: string): Promise<void> => {
    // This is a placeholder. In a real app, you'd load from a server.
  }, []);

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

  const clearForm = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      dispatch({ type: 'SET_RESUME_DATA', payload: initialResumeData });
    }
  }, [dispatch]);

  const contextValue: ResumeContextType = {
    resumeData,
    updateResumeData,
    addSkill,
    removeSkill,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    saveResume,
    loadResume,
    savedVersions,
    undo,
    redo,
    canUndo,
    canRedo,
    clearForm,
  };

  return (
    <ResumeContext.Provider value={contextValue}>
      {children}
    </ResumeContext.Provider>
  );
};
