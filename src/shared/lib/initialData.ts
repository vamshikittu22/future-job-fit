import { ResumeData as IResumeData } from '@/shared/types/resume';

export type ResumeData = IResumeData;

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
  customSections: [],
  metadata: {
    sectionOrder: [
      'personal',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'achievements',
      'certifications'
    ],
    themeConfig: {}
  }
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
