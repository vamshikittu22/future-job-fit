/**
 * Analytics Events - NO PII EVER
 * Track: Actions, metadata, counts
 * NEVER: Content, names, emails, companies
 */
export enum AnalyticsEvent {
  // Resume events - metadata only
  RESUME_CREATED = 'resume_created',
  RESUME_UPDATED = 'resume_updated',
  SECTION_ADDED = 'section_added',        // type only, not content
  SECTION_EDITED = 'section_edited',      // type only, not content
  TEMPLATE_CHANGED = 'template_changed',  // template name only
  
  // AI events - no prompts, no responses
  AI_ENHANCE_USED = 'ai_enhance_used',           // section_type only
  AI_COVER_LETTER_GENERATED = 'ai_cover_letter_generated',
  AI_ATS_SCORED = 'ai_ats_scored',
  AI_ERROR = 'ai_error',                         // error type only
  
  // Navigation - page names only
  PAGE_VIEW = 'page_view',
  WIZARD_STEP_COMPLETED = 'wizard_step_completed',
  
  // Export - format only
  RESUME_EXPORTED = 'resume_exported',     // format: pdf|docx|etc
}

export interface EventProperties {
  // Only safe metadata
  section_type?: string;     // 'experience' | 'education' | etc
  template_name?: string;    // 'modern' | 'professional'
  format?: string;           // 'pdf' | 'docx'
  provider?: string;         // 'gemini' | 'openai'
  step_number?: number;
  error_type?: string;       // 'network' | 'timeout' | 'rate_limit'
  [key: string]: string | number | boolean | undefined;
}
