import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

export interface ResumeData {
  personal: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location?: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    gpa?: string;
    description?: string;
  }>;
  skills: string[];
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    startDate: string;
    endDate: string;
    current: boolean;
    url?: string;
    github?: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    organization?: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
}

type ResumeAction =
  | { type: 'SET_RESUME_DATA'; payload: ResumeData }
  | { type: 'UPDATE_SECTION'; payload: { section: keyof ResumeData; data: any } }
  | { type: 'ADD_SKILL'; payload: string }
  | { type: 'REMOVE_SKILL'; payload: number }
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
  | { type: 'LOAD_FROM_STORAGE' };

interface ResumeContextType {
  resumeData: ResumeData;
  dispatch: React.Dispatch<ResumeAction>;
  updateSection: (section: keyof ResumeData, data: any) => void;
  addSkill: (skill: string) => void;
  removeSkill: (index: number) => void;
  saveDraft: () => void;
  loadDraft: () => void;
}

const initialResumeData: ResumeData = {
  personal: {},
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: [],
  achievements: [],
  certifications: [],
  languages: [],
};

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
        skills: [...state.skills, action.payload],
      };
    
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: state.skills.filter((_, index) => index !== action.payload),
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

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

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
  const [resumeData, dispatch] = useReducer(resumeReducer, initialResumeData);

  // Load data from localStorage on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Auto-save to localStorage whenever resumeData changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('resume_draft', JSON.stringify(resumeData));
    }, 500); // Debounce saves by 500ms

    return () => clearTimeout(timeoutId);
  }, [resumeData]);

  const updateSection = (section: keyof ResumeData, data: any) => {
    dispatch({ type: 'UPDATE_SECTION', payload: { section, data } });
  };

  const addSkill = (skill: string) => {
    if (skill.trim()) {
      dispatch({ type: 'ADD_SKILL', payload: skill.trim() });
    }
  };

  const removeSkill = (index: number) => {
    dispatch({ type: 'REMOVE_SKILL', payload: index });
  };

  const saveDraft = () => {
    localStorage.setItem('resume_draft', JSON.stringify(resumeData));
    localStorage.setItem('resume_draft_timestamp', new Date().toISOString());
  };

  const loadDraft = () => {
    try {
      const savedData = localStorage.getItem('resume_draft');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        dispatch({ type: 'SET_RESUME_DATA', payload: parsedData });
      }
    } catch (error) {
      console.error('Failed to load draft from localStorage:', error);
    }
  };

  const contextValue: ResumeContextType = {
    resumeData,
    dispatch,
    updateSection,
    addSkill,
    removeSkill,
    saveDraft,
    loadDraft,
  };

  return (
    <ResumeContext.Provider value={contextValue}>
      {children}
    </ResumeContext.Provider>
  );
};
