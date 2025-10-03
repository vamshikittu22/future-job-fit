import { z } from 'zod';
import { 
  User, FileText, Briefcase, GraduationCap, Code, 
  Folder, CheckCircle, Layout 
} from 'lucide-react';

// Wizard Step Configuration
export interface WizardStep {
  id: string;
  title: string;
  path: string;
  icon: any;
  isRequired: boolean;
  fields: string[];
  helpText?: string;
  atsWeight: number;
}

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'template',
    title: 'Template Selection',
    path: '/resume-wizard/template',
    icon: Layout,
    isRequired: true,
    fields: ['selectedTemplate'],
    helpText: 'Choose a template that best fits your industry and style',
    atsWeight: 0,
  },
  {
    id: 'personal',
    title: 'Personal Information',
    path: '/resume-wizard/personal',
    icon: User,
    isRequired: true,
    fields: ['personal.name', 'personal.email', 'personal.phone'],
    helpText: 'Provide your contact information',
    atsWeight: 5,
  },
  {
    id: 'summary',
    title: 'Professional Summary',
    path: '/resume-wizard/summary',
    icon: FileText,
    isRequired: true,
    fields: ['summary'],
    helpText: 'Write a compelling 100-150 word summary',
    atsWeight: 15,
  },
  {
    id: 'experience',
    title: 'Work Experience',
    path: '/resume-wizard/experience',
    icon: Briefcase,
    isRequired: true,
    fields: ['experience'],
    helpText: 'Add your work history with achievements',
    atsWeight: 30,
  },
  {
    id: 'education',
    title: 'Education',
    path: '/resume-wizard/education',
    icon: GraduationCap,
    isRequired: false,
    fields: ['education'],
    helpText: 'Add your educational background',
    atsWeight: 10,
  },
  {
    id: 'skills',
    title: 'Skills',
    path: '/resume-wizard/skills',
    icon: Code,
    isRequired: true,
    fields: ['skills'],
    helpText: 'List your technical and soft skills',
    atsWeight: 25,
  },
  {
    id: 'projects',
    title: 'Projects',
    path: '/resume-wizard/projects',
    icon: Folder,
    isRequired: false,
    fields: ['projects'],
    helpText: 'Showcase your notable projects',
    atsWeight: 10,
  },
  {
    id: 'review',
    title: 'Review & Export',
    path: '/resume-wizard/review',
    icon: CheckCircle,
    isRequired: true,
    fields: [],
    helpText: 'Review your resume and export',
    atsWeight: 5,
  },
];

// Template Configuration
export interface TemplateOption {
  id: string;
  name: string;
  description: string;
  bestFor: string[];
  atsScore: number;
  previewImage?: string;
  features: string[];
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean lines with blue accents and two-column layout',
    bestFor: ['Tech', 'Startups', 'Digital Marketing'],
    atsScore: 95,
    features: [
      'Two-column layout',
      'Icon-based sections',
      'Modern typography',
      'Accent colors'
    ],
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional single-column with formal styling',
    bestFor: ['Corporate', 'Finance', 'Legal', 'Government'],
    atsScore: 98,
    features: [
      'Single-column layout',
      'Serif headers',
      'Formal styling',
      'Maximum ATS compatibility'
    ],
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Gradient accents with card-based sections',
    bestFor: ['Design', 'Marketing', 'Creative Industries'],
    atsScore: 85,
    features: [
      'Card-based sections',
      'Gradient accents',
      'Visual flair',
      'Modern sans-serif'
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Maximum whitespace with Swiss-style design',
    bestFor: ['All Industries', 'Minimalists', 'Executive Roles'],
    atsScore: 92,
    features: [
      'Ultra-clean design',
      'Maximum whitespace',
      'Thin lines',
      'Swiss typography'
    ],
  },
];

// Validation Schemas
export const personalInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  location: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  linkedin: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  github: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  title: z.string().optional(),
});

export const summarySchema = z.object({
  summary: z.string()
    .min(50, 'Summary should be at least 50 characters')
    .max(800, 'Summary should not exceed 800 characters'),
});

export const experienceSchema = z.object({
  title: z.string().min(2, 'Job title is required'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().min(20, 'Description should be at least 20 characters'),
});

export const educationSchema = z.object({
  degree: z.string().min(2, 'Degree is required'),
  school: z.string().min(2, 'School name is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

export const skillsSchema = z.object({
  languages: z.array(z.string()).min(1, 'Add at least one skill'),
  frameworks: z.array(z.string()),
  tools: z.array(z.string()),
});

export const projectSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  role: z.string().optional(),
  description: z.string().min(20, 'Description should be at least 20 characters'),
  technologies: z.array(z.string()),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// ATS Scoring Weights
export const ATS_SCORING_WEIGHTS = {
  personalInfo: 5,
  summary: 15,
  experience: 30,
  education: 10,
  skills: 25,
  projects: 10,
  formatting: 5,
};

// Validation helper functions
export const validateStep = (stepId: string, data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  try {
    switch (stepId) {
      case 'personal':
        personalInfoSchema.parse(data.personal);
        break;
      case 'summary':
        summarySchema.parse({ summary: data.summary });
        break;
      case 'experience':
        if (!data.experience || data.experience.length === 0) {
          errors.push('At least one work experience is required');
        }
        break;
      case 'skills':
        const totalSkills = (data.skills?.languages?.length || 0) + 
                           (data.skills?.frameworks?.length || 0) + 
                           (data.skills?.tools?.length || 0);
        if (totalSkills < 5) {
          errors.push('Add at least 5 skills total');
        }
        break;
      case 'template':
        if (!data.selectedTemplate) {
          errors.push('Please select a template');
        }
        break;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      errors.push(...error.errors.map(e => e.message));
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Calculate step completion percentage
export const calculateStepCompletion = (stepId: string, data: any): number => {
  switch (stepId) {
    case 'template':
      return data.selectedTemplate ? 100 : 0;
      
    case 'personal':
      const personalFields = ['name', 'email', 'phone'];
      const optionalFields = ['location', 'website', 'linkedin', 'github', 'title'];
      const requiredFilled = personalFields.filter(f => data.personal?.[f]).length;
      const optionalFilled = optionalFields.filter(f => data.personal?.[f]).length;
      return Math.round(((requiredFilled / personalFields.length) * 70) + ((optionalFilled / optionalFields.length) * 30));
      
    case 'summary':
      if (!data.summary) return 0;
      if (data.summary.length < 50) return 30;
      if (data.summary.length < 100) return 60;
      return 100;
      
    case 'experience':
      if (!data.experience || data.experience.length === 0) return 0;
      const expWithDesc = data.experience.filter((e: any) => e.description && e.description.length > 20).length;
      return Math.min(100, Math.round((expWithDesc / data.experience.length) * 100));
      
    case 'education':
      if (!data.education || data.education.length === 0) return 0;
      return data.education.length > 0 ? 100 : 0;
      
    case 'skills':
      const total = (data.skills?.languages?.length || 0) + 
                   (data.skills?.frameworks?.length || 0) + 
                   (data.skills?.tools?.length || 0);
      if (total === 0) return 0;
      if (total < 5) return 40;
      if (total < 10) return 70;
      return 100;
      
    case 'projects':
      if (!data.projects || data.projects.length === 0) return 0;
      return data.projects.length > 0 ? 100 : 0;
      
    case 'review':
      return 100;
      
    default:
      return 0;
  }
};

// Get step status based on completion
export const getStepStatus = (completion: number): 'complete' | 'partial' | 'empty' => {
  if (completion === 100) return 'complete';
  if (completion > 0) return 'partial';
  return 'empty';
};
