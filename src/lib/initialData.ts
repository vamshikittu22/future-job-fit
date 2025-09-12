import { CustomSectionItem } from "@/components/CustomSectionModal";

// Types
export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  subtitle?: string;
  date?: string;
  description?: string;
  link?: string;
}

export interface CustomSection {
  id: string;
  title: string;
  description?: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  personal: {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string;
    current: boolean;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    date?: string;
    description: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  customSections: CustomSection[];
}

// Initial data
export const initialResumeData: ResumeData = {
  personal: {
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: ''
  },
  summary: '',
  experience: [],
  education: [],
  skills: {
    languages: [],
    frameworks: [],
    tools: []
  },
  projects: [],
  achievements: [],
  certifications: [],
  customSections: []
};

export const initialSections = [
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'achievements',
  'certifications'
];
