import { LucideIcon } from 'lucide-react';

export interface Language {
  id: string;
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Professional' | 'Native';
}

export interface Section {
  id: string;
  title: string;
  value: string;
  icon: LucideIcon | (() => JSX.Element);
}

export interface PersonalInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  summary: string;
}

export interface Experience {
  id: string;
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  githubUrl?: string;
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

export interface Achievement {
  id: string;
  title: string;
  date: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  description?: string;
}

export interface ATSScore {
  score: number;
  suggestions: string[];
  lastUpdated: string;
  jobDescription: string;
}

export interface ResumeData {
  personal: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  achievements: Achievement[];
  languages: Language[];
  atsScore?: ATSScore;
}

export interface ResumeFormProps {
  resumeData: ResumeData;
  onChange: (data: Partial<ResumeData>) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}
