export const SECTION_NAMES = {
  personal: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  achievements: 'Achievements',
  certifications: 'Certifications',
} as const;

export type SectionKey = keyof typeof SECTION_NAMES;

export const SECTION_ORDER: SectionKey[] = [
  'personal',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'achievements',
  'certifications',
];
