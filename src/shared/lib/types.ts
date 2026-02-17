// Re-export types from the main types file for compatibility
export type {
  ResumeData as ResumeDataLegacy,
  Certification as CertificationLegacy,
  CustomSection
} from '@/shared/types/resume';

// Inline type definitions for backward compatibility
export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  title?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
  bullets?: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  institution?: string;
  fieldOfStudy?: string;
  field?: string;
  startDate: string;
  endDate: string;
  description?: string;
  gpa?: string;
}

export interface Project {
  id: string;
  name: string;
  role?: string;
  description: string;
  technologies: string[];
  tech?: string[];
  bullets?: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer?: string;
  date?: string;
  description: string;
}

// Re-export ATS types
export type {
  KeywordCategory,
  MatchStatus,
  RecommendationSeverity,
  KeywordModel,
  MatchResultModel,
  ATSScoreBreakdown,
  JobDescriptionModel,
  Recommendation,
  ATSEvaluationResponse,
  ParseJDRequest,
  EvaluateATSRequest,
  SectionCoverage,
  LegacyATSResponse
} from '@/shared/types/ats';
