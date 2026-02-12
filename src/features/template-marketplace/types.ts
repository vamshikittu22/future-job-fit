import { z } from 'zod';
import type { ResumeData } from '@/shared/types/resume';

/**
 * Industry options for template categorization.
 * Per user decision: categorized by industry and style.
 */
export type TemplateIndustry = 'tech' | 'healthcare' | 'finance' | 'marketing' | 'education' | 'general' | 'creative';

/**
 * Style options for template categorization.
 */
export type TemplateStyle = 'modern' | 'professional' | 'minimal' | 'creative' | 'academic';

/**
 * Template category with industry and style.
 */
export interface TemplateCategory {
  industry: TemplateIndustry;
  style: TemplateStyle;
}

/**
 * Schema for validating TemplateCategory
 */
export const templateCategorySchema = z.object({
  industry: z.enum(['tech', 'healthcare', 'finance', 'marketing', 'education', 'general', 'creative']),
  style: z.enum(['modern', 'professional', 'minimal', 'creative', 'academic']),
});

/**
 * Template author information.
 */
export interface TemplateAuthor {
  /** Author name */
  name: string;
  /** Author title/role */
  title?: string;
  /** Author avatar URL */
  avatarUrl?: string;
}

/**
 * Schema for validating TemplateAuthor
 */
export const templateAuthorSchema = z.object({
  name: z.string(),
  title: z.string().optional(),
  avatarUrl: z.string().url().optional(),
});

/**
 * ATS certification information for templates.
 * Per user decision: ATS certification badge for all templates.
 */
export interface TemplateATSCertification {
  /** ATS compatibility score (0-100) */
  score: number;
  /** When the certification was performed */
  certifiedAt: string;
  /** Version of ATS tests used */
  testVersion: string;
  /** Any ATS compatibility issues found */
  issues: string[];
}

/**
 * Schema for validating TemplateATSCertification
 */
export const templateATSCertificationSchema = z.object({
  score: z.number().min(0).max(100),
  certifiedAt: z.string().datetime(),
  testVersion: z.string(),
  issues: z.array(z.string()),
});

/**
 * Template rating information.
 */
export interface TemplateRating {
  /** Average rating (0-5) */
  average: number;
  /** Number of ratings */
  count: number;
}

/**
 * Schema for validating TemplateRating
 */
export const templateRatingSchema = z.object({
  average: z.number().min(0).max(5),
  count: z.number().nonnegative(),
});

/**
 * Main Template type for marketplace.
 * Per user decision: 50+ team-created templates at launch with metadata.
 */
export interface Template {
  /** Unique identifier for the template */
  id: string;
  /** Template name */
  name: string;
  /** Template description */
  description: string;
  /** Thumbnail image URL */
  thumbnailUrl: string;
  /** Category (industry + style) */
  category: TemplateCategory;
  /** Author information */
  author: TemplateAuthor;
  /** ATS certification results */
  atsCertification: TemplateATSCertification;
  /** Number of times downloaded */
  downloadCount: number;
  /** Rating information */
  rating: TemplateRating;
  /** When the template was created */
  createdAt: string;
  /** When the template was last updated */
  updatedAt: string;
  /** Searchable tags */
  tags: string[];
  /** Sample resume data for preview */
  previewData?: ResumeData;
  /** Whether this is a featured template */
  isFeatured: boolean;
  /** Whether this is a new template */
  isNew: boolean;
}

/**
 * Schema for validating Template
 */
export const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  thumbnailUrl: z.string().url(),
  category: templateCategorySchema,
  author: templateAuthorSchema,
  atsCertification: templateATSCertificationSchema,
  downloadCount: z.number().nonnegative(),
  rating: templateRatingSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  tags: z.array(z.string()),
  previewData: z.any().optional(), // ResumeData type
  isFeatured: z.boolean(),
  isNew: z.boolean(),
});

/**
 * Sort options for template filtering.
 */
export type TemplateSortOption = 'popular' | 'newest' | 'rating' | 'ats_score';

/**
 * Filters for template search and filtering.
 */
export interface TemplateFilters {
  /** Search query string */
  searchQuery?: string;
  /** Selected industries */
  industries: TemplateIndustry[];
  /** Selected styles */
  styles: TemplateStyle[];
  /** Only show ATS certified templates */
  atsCertifiedOnly: boolean;
  /** Sort order */
  sortBy: TemplateSortOption;
}

/**
 * Schema for validating TemplateFilters
 */
export const templateFiltersSchema = z.object({
  searchQuery: z.string().optional(),
  industries: z.array(z.enum(['tech', 'healthcare', 'finance', 'marketing', 'education', 'general', 'creative'])),
  styles: z.array(z.enum(['modern', 'professional', 'minimal', 'creative', 'academic'])),
  atsCertifiedOnly: z.boolean(),
  sortBy: z.enum(['popular', 'newest', 'rating', 'ats_score']),
});

// Type exports for convenience
export type TemplateCategoryType = z.infer<typeof templateCategorySchema>;
export type TemplateAuthorType = z.infer<typeof templateAuthorSchema>;
export type TemplateATSCertificationType = z.infer<typeof templateATSCertificationSchema>;
export type TemplateRatingType = z.infer<typeof templateRatingSchema>;
export type TemplateType = z.infer<typeof templateSchema>;
export type TemplateFiltersType = z.infer<typeof templateFiltersSchema>;
