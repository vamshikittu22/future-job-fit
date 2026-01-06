import { LucideIcon } from 'lucide-react';

// ============================================
// UI-Specific Types (not domain data)
// ============================================

export interface Section {
  id: string;
  title: string;
  value: string;
  icon: LucideIcon | (() => JSX.Element);
}

export interface ResumeFormProps {
  resumeData: import('@/shared/types/resume').ResumeData;
  onChange: (data: Partial<import('@/shared/types/resume').ResumeData>) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

// ============================================
// Extended Types (may not be in canonical)
// ============================================

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Professional' | 'Native';
}

export type SkillCategory =
  | 'Programming Languages'
  | 'Frameworks & Libraries'
  | 'Tools & Platforms'
  | 'Design'
  | 'Soft Skills'
  | 'Languages'
  | 'Other';

export interface Skill {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  category: SkillCategory;
  showProficiency?: boolean;
}

export interface ATSScore {
  score: number;
  suggestions: string[];
  lastUpdated: string;
  jobDescription: string;
}

// ============================================
// REMOVED: Duplicate ResumeData, PersonalInfo, Experience, Education,
// Project, Achievement, Certification
// 
// These are now imported from @/shared/types/resume
// ============================================
