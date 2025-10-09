// Types
export type CustomFieldType = 'text' | 'textarea' | 'date' | 'url' | 'tag';

export interface CustomField {
  id: string;
  name: string;
  type: CustomFieldType;
  required?: boolean;
  options?: string[];
}

export interface CustomSectionEntry {
  id: string;
  // key is field.id, value is string or string[] for 'tag'
  values: Record<string, string | string[]>;
}

export interface CustomSection {
  id: string;
  title: string;
  description?: string;
  fields: CustomField[];
  entries: CustomSectionEntry[];
}

export interface ResumeMetadata {
  sectionOrder?: string[];
  lastUpdated?: string;
  template?: string;
  version?: string;
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
    title?: string;
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
    bullets?: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    fieldOfStudy?: string;
    field?: string; // Alias for fieldOfStudy
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }> | {
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  projects: Array<{
    id: string;
    name: string;
    role?: string;
    description: string;
    technologies: string[];
    tech?: string[]; // Alias for technologies
    bullets?: string[];
    url?: string;
    startDate?: string;
    endDate?: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    issuer?: string;
    date?: string;
    description: string;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    expiryDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    url?: string;
  }>;
  customSections: CustomSection[];
  metadata?: ResumeMetadata;
}

export interface ResumePreviewProps {
  resumeData: ResumeData;
  template: string;
  currentPage: number;
  sectionOrder: string[];
}
