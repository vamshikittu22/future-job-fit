import React, { createContext, useContext, useReducer, useEffect, useState, useCallback, ReactNode, useRef } from 'react';
import { debounce } from 'lodash';
import { ResumeData, initialResumeData } from '@/shared/lib/initialData';
import { CustomSection, CustomField, CustomSectionEntry, Certification } from '@/shared/types/resume';
import { setItemVersioned, getItemVersioned, getQuotaStatus, formatBytes } from '@/shared/lib/storage';

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
  | { type: 'ADD_CERTIFICATION'; payload: any }
  | { type: 'UPDATE_CERTIFICATION'; payload: { index: number; data: any } }
  | { type: 'REMOVE_CERTIFICATION'; payload: number }
  | { type: 'ADD_CUSTOM_SECTION'; payload: ResumeData['customSections'][0] }
  | { type: 'UPDATE_CUSTOM_SECTION'; payload: { index: number; data: ResumeData['customSections'][0] } }
  | { type: 'REMOVE_CUSTOM_SECTION'; payload: string }
  | { type: 'REORDER_CUSTOM_SECTIONS'; payload: string[] }
  | { type: 'REORDER_SECTIONS'; payload: string[] }
  | { type: 'ADD_CUSTOM_FIELD'; payload: { sectionId: string; field: CustomField } }
  | { type: 'UPDATE_CUSTOM_FIELD'; payload: { sectionId: string; fieldId: string; updates: Partial<CustomField> } }
  | { type: 'REMOVE_CUSTOM_FIELD'; payload: { sectionId: string; fieldId: string } }
  | { type: 'REORDER_CUSTOM_FIELDS'; payload: { sectionId: string; fieldIds: string[] } }
  | { type: 'ADD_CUSTOM_ENTRY'; payload: { sectionId: string; entry: CustomSectionEntry } }
  | { type: 'UPDATE_CUSTOM_ENTRY'; payload: { sectionId: string; entryId: string; updates: Partial<CustomSectionEntry> } }
  | { type: 'REMOVE_CUSTOM_ENTRY'; payload: { sectionId: string; entryId: string } }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'CLEAR_HISTORY' }
  | { type: 'UPDATE_RESUME'; payload: ResumeData };

interface ResumeContextType {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
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
  addCustomSection: (section: ResumeData['customSections'][0]) => void;
  updateCustomSection: (index: number, data: ResumeData['customSections'][0]) => void;
  removeCustomSection: (id: string) => void;
  reorderCustomSections: (ids: string[]) => void;
  reorderSections: (ids: string[]) => void;
  addCustomField: (sectionId: string, field: CustomField) => void;
  updateCustomField: (sectionId: string, fieldId: string, updates: Partial<CustomField>) => void;
  removeCustomField: (sectionId: string, fieldId: string) => void;
  reorderCustomFields: (sectionId: string, fieldIds: string[]) => void;
  addCustomEntry: (sectionId: string, entry: CustomSectionEntry) => void;
  updateCustomEntry: (sectionId: string, entryId: string, updates: Partial<CustomSectionEntry>) => void;
  removeCustomEntry: (sectionId: string, entryId: string) => void;
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
      // Ensure customSections has proper structure with initialized fields and entries
      const data = action.payload;
      return {
        ...data,
        customSections: (data.customSections || []).map(section => ({
          ...section,
          fields: section.fields?.map(f => ({
            id: f.id,
            name: f.name || '',
            type: f.type || 'text',
            required: f.required || false,
            options: f.options || []
          })) || [],
          entries: section.entries?.map(entry => ({
            ...entry,
            values: entry.values || {}
          })) || []
        }))
      };
    case 'UPDATE_SECTION':
      return { ...state, [action.payload.section]: action.payload.data };
    case 'ADD_SKILL': {
      // Handle legacy skills format (object with languages/frameworks/tools keys)
      const currentSkills = state.skills as { languages: string[]; frameworks: string[]; tools: string[] };
      return {
        ...state,
        skills: {
          ...currentSkills,
          [action.payload.category]: [
            ...(currentSkills[action.payload.category] || []),
            action.payload.skill
          ]
        }
      };
    }

    case 'REMOVE_SKILL': {
      // Handle legacy skills format (object with languages/frameworks/tools keys)
      const currentSkills = state.skills as { languages: string[]; frameworks: string[]; tools: string[] };
      return {
        ...state,
        skills: {
          ...currentSkills,
          [action.payload.category]: currentSkills[action.payload.category].filter((_: string, index: number) => index !== action.payload.index)
        }
      };
    }

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
        certifications: [...(state.certifications || []), action.payload],
      };

    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        certifications: (state.certifications || []).map((item, index) =>
          index === action.payload.index ? action.payload.data : item
        ),
      };

    case 'REMOVE_CERTIFICATION':
      return {
        ...state,
        certifications: (state.certifications || []).filter((_, index) => index !== action.payload),
      };

    case 'ADD_CUSTOM_SECTION':
      return {
        ...state,
        customSections: [
          ...state.customSections,
          {
            ...action.payload,
            fields: action.payload.fields || [],
            entries: action.payload.entries || []
          }
        ],
      };

    case 'UPDATE_CUSTOM_SECTION':
      return {
        ...state,
        customSections: state.customSections.map((item, index) =>
          index === action.payload.index ? action.payload.data : item
        ),
      };

    case 'REMOVE_CUSTOM_SECTION':
      return {
        ...state,
        customSections: state.customSections.filter((section) => section.id !== action.payload),
        metadata: {
          ...state.metadata,
          sectionOrder: state.metadata?.sectionOrder?.filter(id => id !== `custom:${action.payload}`)
        }
      };
    case 'REORDER_CUSTOM_SECTIONS':
      return {
        ...state,
        customSections: action.payload
          .map(id => state.customSections.find(s => s.id === id))
          .filter((s): s is CustomSection => Boolean(s))
      };
    case 'REORDER_SECTIONS':
      return {
        ...state,
        metadata: {
          ...state.metadata,
          sectionOrder: action.payload
        }
      };
    case 'ADD_CUSTOM_FIELD': {
      const { sectionId, field } = action.payload;
      return {
        ...state,
        customSections: state.customSections.map(sec => {
          if (sec.id !== sectionId) return sec;

          // Initialize the new field's value in all existing entries
          const updatedEntries = (sec.entries || []).map(entry => ({
            ...entry,
            values: {
              ...entry.values,
              [field.id]: field.type === 'tag' ? [] : ''
            }
          }));

          return {
            ...sec,
            fields: [...(sec.fields || []), field],
            entries: updatedEntries
          };
        })
      };
    }
    case 'UPDATE_CUSTOM_FIELD': {
      const { sectionId, fieldId, updates } = action.payload;
      return {
        ...state,
        customSections: state.customSections.map(sec =>
          sec.id === sectionId
            ? { ...sec, fields: (sec.fields || []).map(f => f.id === fieldId ? { ...f, ...updates } : f) }
            : sec
        )
      };
    }
    case 'REMOVE_CUSTOM_FIELD': {
      const { sectionId, fieldId } = action.payload;
      return {
        ...state,
        customSections: state.customSections.map(sec =>
          sec.id === sectionId ? { ...sec, fields: (sec.fields || []).filter(f => f.id !== fieldId) } : sec
        )
      };
    }
    case 'REORDER_CUSTOM_FIELDS': {
      const { sectionId, fieldIds } = action.payload;
      return {
        ...state,
        customSections: state.customSections.map(sec =>
          sec.id === sectionId
            ? {
              ...sec,
              fields: fieldIds
                .map(id => (sec.fields || []).find(f => f.id === id))
                .filter((f): f is CustomField => Boolean(f))
            }
            : sec
        )
      };
    }
    case 'ADD_CUSTOM_ENTRY': {
      const { sectionId, entry } = action.payload;
      return {
        ...state,
        customSections: state.customSections.map(sec => {
          if (sec.id !== sectionId) return sec;

          // Initialize values for all fields
          const initialValues: Record<string, any> = {};
          (sec.fields || []).forEach(field => {
            initialValues[field.id] = field.type === 'tag' ? [] : '';
          });

          return {
            ...sec,
            entries: [
              ...(sec.entries || []),
              {
                ...entry,
                values: {
                  ...initialValues,
                  ...entry.values
                }
              }
            ]
          };
        })
      };
    }
    case 'UPDATE_CUSTOM_ENTRY': {
      const { sectionId, entryId, updates } = action.payload;
      return {
        ...state,
        customSections: state.customSections.map(sec =>
          sec.id === sectionId
            ? { ...sec, entries: (sec.entries || []).map(e => e.id === entryId ? { ...e, ...updates } : e) }
            : sec
        )
      };
    }
    case 'REMOVE_CUSTOM_ENTRY': {
      const { sectionId, entryId } = action.payload;
      return {
        ...state,
        customSections: state.customSections.map(sec =>
          sec.id === sectionId ? { ...sec, entries: (sec.entries || []).filter(e => e.id !== entryId) } : sec
        )
      };
    }
    default:
      return state;
  }
}

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
  const [savedVersions, setSavedVersions] = useState<SavedVersion[]>(() => {
    try {
      const saved = getItemVersioned<SavedVersion[]>(SNAPSHOTS_STORAGE_KEY);
      return saved ?? [];
    } catch (error) {
      console.error('Failed to load saved versions:', error);
      return [];
    }
  });

  const [history, historyDispatch] = useReducer(
    historyReducer as React.Reducer<HistoryState, ResumeAction>,
    {
      past: [],
      present: initialResumeData,
      future: []
    } as HistoryState
  );

  const { present: resumeData, past = [], future = [] } = history;
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;

  useEffect(() => {
    try {
      const savedData = getItemVersioned<ResumeData>(STORAGE_KEY);
      if (savedData) {
        historyDispatch({ type: 'SET_RESUME_DATA', payload: savedData });
      }
    } catch (error) {
      console.error('Failed to load resume data:', error);
    }
  }, []);

  useEffect(() => {
    try {
      setItemVersioned(STORAGE_KEY, resumeData);
      
      // Dev mode: log storage metrics (now handled by setItemVersioned)
      if (import.meta.env.DEV) {
        const status = getQuotaStatus();
        if (status.warning) {
          console.warn(`[Storage] Warning: Storage usage above 80%`);
        }
      }
    } catch (error) {
      console.error('Failed to save resume data:', error);
    }
  }, [resumeData]);

  useEffect(() => {
    try {
      setItemVersioned(SNAPSHOTS_STORAGE_KEY, savedVersions);
    } catch (error) {
      console.error('Failed to save saved versions:', error);
    }
  }, [savedVersions]);

  const dispatch = useCallback((action: ResumeAction) => {
    const pastLimit = past.length >= 100; // Using a reasonable default limit
    historyDispatch({ ...action, pastLimit } as any);
  }, [past.length]);

  // Set resume data function
  const setResumeData = useCallback((data: React.SetStateAction<ResumeData>) => {
    const newData = typeof data === 'function' ? data(resumeData) : data;
    historyDispatch({
      type: 'SET_RESUME_DATA',
      payload: newData
    } as any);
  }, [resumeData]);

  const debouncedSave = useRef(
    debounce((data: ResumeData) => {
      try {
        setItemVersioned(STORAGE_KEY, data);
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

  const addCustomSection = useCallback((section: ResumeData['customSections'][0]) => {
    dispatch({ type: 'ADD_CUSTOM_SECTION', payload: section });
  }, [dispatch]);

  const updateCustomSection = useCallback((index: number, data: ResumeData['customSections'][0]) => {
    dispatch({ type: 'UPDATE_CUSTOM_SECTION', payload: { index, data } });
  }, [dispatch]);

  const removeCustomSection = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_SECTION', payload: id });
  }, [dispatch]);

  const reorderCustomSections = useCallback((ids: string[]) => {
    dispatch({ type: 'REORDER_CUSTOM_SECTIONS', payload: ids });
  }, [dispatch]);

  const reorderSections = useCallback((ids: string[]) => {
    dispatch({ type: 'REORDER_SECTIONS', payload: ids });
  }, [dispatch]);

  const addCustomField = useCallback((sectionId: string, field: CustomField) => {
    dispatch({ type: 'ADD_CUSTOM_FIELD', payload: { sectionId, field } });
  }, [dispatch]);

  const updateCustomField = useCallback((sectionId: string, fieldId: string, updates: Partial<CustomField>) => {
    dispatch({ type: 'UPDATE_CUSTOM_FIELD', payload: { sectionId, fieldId, updates } });
  }, [dispatch]);

  const removeCustomField = useCallback((sectionId: string, fieldId: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_FIELD', payload: { sectionId, fieldId } });
  }, [dispatch]);

  const reorderCustomFields = useCallback((sectionId: string, fieldIds: string[]) => {
    dispatch({ type: 'REORDER_CUSTOM_FIELDS', payload: { sectionId, fieldIds } });
  }, [dispatch]);

  const addCustomEntry = useCallback((sectionId: string, entry: CustomSectionEntry) => {
    dispatch({ type: 'ADD_CUSTOM_ENTRY', payload: { sectionId, entry } });
  }, [dispatch]);

  const updateCustomEntry = useCallback((sectionId: string, entryId: string, updates: Partial<CustomSectionEntry>) => {
    dispatch({ type: 'UPDATE_CUSTOM_ENTRY', payload: { sectionId, entryId, updates } });
  }, [dispatch]);

  const removeCustomEntry = useCallback((sectionId: string, entryId: string) => {
    dispatch({ type: 'REMOVE_CUSTOM_ENTRY', payload: { sectionId, entryId } });
  }, [dispatch]);

  const saveResume = useCallback(async (name: string = 'Draft'): Promise<void> => {
    try {
      const newVersion: SavedVersion = {
        id: Date.now().toString(),
        name,
        timestamp: new Date().toISOString(),
        data: { ...resumeData }
      };

      const updatedVersions = [
        newVersion,
        ...savedVersions.filter(v => v.id !== newVersion.id)
      ].slice(0, 20); // Keep only the 20 most recent versions

      setSavedVersions(updatedVersions);
      setItemVersioned(SNAPSHOTS_STORAGE_KEY, updatedVersions);
      setItemVersioned(STORAGE_KEY, resumeData);
      
      // Dev mode: log storage metrics (now handled by setItemVersioned)
      if (import.meta.env.DEV) {
        const status = getQuotaStatus();
        console.log(
          `[Storage] Version saved: ${formatBytes(status.used)} / ${formatBytes(status.total)} ` +
          `(${status.percentUsed.toFixed(1)}%)`
        );
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Failed to save resume:', error);
      return Promise.reject(error);
    }
  }, [resumeData, savedVersions]);

  const loadResume = useCallback(async (id: string): Promise<void> => {
    try {
      const version = savedVersions.find(v => v.id === id);
      if (version) {
        dispatch({ type: 'SET_RESUME_DATA', payload: version.data });
        setItemVersioned(STORAGE_KEY, version.data);
        return Promise.resolve();
      }
      return Promise.reject(new Error('Version not found'));
    } catch (error) {
      console.error('Failed to load resume:', error);
      return Promise.reject(error);
    }
  }, [savedVersions]);

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
    setResumeData,
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
    addCustomSection,
    updateCustomSection,
    removeCustomSection,
    reorderCustomSections,
    reorderSections,
    addCustomField,
    updateCustomField,
    removeCustomField,
    reorderCustomFields,
    addCustomEntry,
    updateCustomEntry,
    removeCustomEntry,
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
