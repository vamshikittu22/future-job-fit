import { ResumeData, PersonalInfo as WizardPersonalInfo } from '@/features/resume-builder/components/editor/types';

export const initialResumeData: ResumeData = {
  personal: {
    id: '',
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: [],
  atsScore: undefined
};
