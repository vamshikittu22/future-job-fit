import { z } from 'zod';

/**
 * User's answers to guided prompting questions for cover letter generation.
 * Per user decision: guided prompting with 2-3 questions to reduce AI detection risk.
 */
export interface CoverLetterPromptAnswers {
  /** Why the user is interested in this specific company */
  whyThisCompany: string;
  /** Top 2-3 strengths relevant to the role */
  keyStrengths: string[];
  /** Optional differentiator story to make the cover letter unique */
  uniqueAngle?: string;
}

/**
 * Schema for validating CoverLetterPromptAnswers
 */
export const coverLetterPromptAnswersSchema = z.object({
  whyThisCompany: z.string().min(1, 'Why this company is required'),
  keyStrengths: z.array(z.string()).min(1, 'At least one strength is required'),
  uniqueAngle: z.string().optional(),
});

/**
 * One of the generated cover letter variants.
 * AI generates 3 variants with different tones for user selection.
 */
export interface CoverLetterVariant {
  /** Unique identifier for this variant */
  id: string;
  /** The actual cover letter text content */
  content: string;
  /** Tone style of this variant */
  tone: 'formal' | 'conversational' | 'enthusiastic';
  /** Optional ATS compatibility score (0-100) */
  atsScore?: number;
  /** When this variant was generated */
  createdAt: string;
}

/**
 * Schema for validating CoverLetterVariant
 */
export const coverLetterVariantSchema = z.object({
  id: z.string(),
  content: z.string().min(1, 'Content is required'),
  tone: z.enum(['formal', 'conversational', 'enthusiastic']),
  atsScore: z.number().min(0).max(100).optional(),
  createdAt: z.string().datetime(),
});

/**
 * Status of a cover letter in the generation workflow
 */
export type CoverLetterStatus = 'draft' | 'generated' | 'edited' | 'finalized';

/**
 * Main Cover Letter type with version history support.
 * Per user decision: version history allows users to track and revert changes.
 */
export interface CoverLetter {
  /** Unique identifier for this cover letter */
  id: string;
  /** Reference to the job this cover letter is for */
  jobId: string;
  /** Reference to the resume version used when generating */
  resumeSnapshotId: string;
  /** User's answers to guided prompting questions */
  promptAnswers: CoverLetterPromptAnswers;
  /** Array of generated variants (typically 3) */
  variants: CoverLetterVariant[];
  /** ID of the variant selected by the user */
  selectedVariantId?: string;
  /** User's edited version of the selected variant */
  editedContent?: string;
  /** Current status in the workflow */
  status: CoverLetterStatus;
  /** ATS compatibility score after analysis (0-100) */
  atsScore?: number;
  /** Keywords from job description that were incorporated */
  keywordsUsed: string[];
  /** Metadata timestamps */
  metadata: {
    /** When the cover letter was first created */
    createdAt: string;
    /** When the cover letter was last updated */
    updatedAt: string;
    /** When the AI generation occurred */
    generatedAt?: string;
  };
}

/**
 * Schema for validating CoverLetter
 */
export const coverLetterSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  resumeSnapshotId: z.string(),
  promptAnswers: coverLetterPromptAnswersSchema,
  variants: z.array(coverLetterVariantSchema),
  selectedVariantId: z.string().optional(),
  editedContent: z.string().optional(),
  status: z.enum(['draft', 'generated', 'edited', 'finalized']),
  atsScore: z.number().min(0).max(100).optional(),
  keywordsUsed: z.array(z.string()),
  metadata: z.object({
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    generatedAt: z.string().datetime().optional(),
  }),
});

// Type exports for convenience
export type CoverLetterPromptAnswersType = z.infer<typeof coverLetterPromptAnswersSchema>;
export type CoverLetterVariantType = z.infer<typeof coverLetterVariantSchema>;
export type CoverLetterType = z.infer<typeof coverLetterSchema>;
