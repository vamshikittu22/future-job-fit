// Re-export types from the main types file for compatibility
export type {
  ResumeData as ResumeDataLegacy,
  Experience,
  Education,
  Project,
  Achievement,
  Certification as CertificationLegacy,
  CustomSection,
  PersonalInfo
} from '@/shared/types/resume';

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
