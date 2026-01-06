// Re-export canonical types
export type {
    ResumeData,
    Certification,
    CustomSection,
    CustomSectionEntry,
    CustomField,
    CustomFieldType,
    SkillCategoryType,
    ThemeSettings,
    ResumeMetadata,
    ResumePreviewProps,
} from '@/shared/types/resume';

// Re-export feature-specific types
export type {
    Language,
    Section,
    SkillCategory,
    Skill,
    ATSScore,
    ResumeFormProps,
} from './resume.types';
