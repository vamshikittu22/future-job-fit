/**
 * Centralized type exports for Future Job Fit
 * 
 * This file provides a single import location for all types:
 * `import { CoverLetter, InterviewQuestion, LinkedInProfile } from '@/shared/types'`
 * 
 * Feature types can also be imported directly:
 * `import { CoverLetter } from '@/features/cover-letter/types'`
 */

// Re-export feature types
export * from '@/features/cover-letter/types';
export * from '@/features/interview-prep/types';
export * from '@/features/linkedin-sync/types';
export * from '@/features/template-marketplace/types';

// Re-export existing shared types for convenience
export * from './resume';
export * from './ats';
