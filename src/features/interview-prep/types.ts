import { z } from 'zod';

/**
 * Categories for interview questions.
 * Per user decision: categorized questions for better organization.
 */
export type InterviewQuestionCategory = 'behavioral' | 'technical' | 'situational' | 'company_specific';

/**
 * Difficulty levels for interview questions.
 */
export type InterviewQuestionDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Interview question generated from job analysis.
 * Per user decision: categorized questions for targeted practice.
 */
export interface InterviewQuestion {
  /** Unique identifier for this question */
  id: string;
  /** The question text */
  question: string;
  /** Category of the question */
  category: InterviewQuestionCategory;
  /** Difficulty level */
  difficulty: InterviewQuestionDifficulty;
  /** Keywords/concepts the answer should address */
  expectedFocus: string[];
  /** Estimated time to answer in minutes */
  timeEstimateMinutes: number;
  /** Context about how this question was generated (e.g., from job requirements) */
  sourceContext?: string;
  /** Reference to the job this question relates to */
  jobId: string;
}

/**
 * Schema for validating InterviewQuestion
 */
export const interviewQuestionSchema = z.object({
  id: z.string(),
  question: z.string().min(1, 'Question text is required'),
  category: z.enum(['behavioral', 'technical', 'situational', 'company_specific']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  expectedFocus: z.array(z.string()),
  timeEstimateMinutes: z.number().positive(),
  sourceContext: z.string().optional(),
  jobId: z.string(),
});

/**
 * User's answer to an interview question.
 */
export interface InterviewAnswer {
  /** Unique identifier for this answer */
  id: string;
  /** Reference to the question being answered */
  questionId: string;
  /** The answer text content */
  content: string;
  /** Word count (auto-calculated) */
  wordCount: number;
  /** Count of filler words detected */
  fillerWordCount: number;
  /** Estimated duration in minutes based on word count */
  estimatedDurationMinutes: number;
  /** When the answer was submitted */
  submittedAt: string;
  /** Reference to practice session if part of one */
  practiceSessionId?: string;
}

/**
 * Schema for validating InterviewAnswer
 */
export const interviewAnswerSchema = z.object({
  id: z.string(),
  questionId: z.string(),
  content: z.string().min(1, 'Answer content is required'),
  wordCount: z.number().nonnegative(),
  fillerWordCount: z.number().nonnegative(),
  estimatedDurationMinutes: z.number().nonnegative(),
  submittedAt: z.string().datetime(),
  practiceSessionId: z.string().optional(),
});

/**
 * STAR methodology scores for interview feedback.
 * Per user decision: STAR framework prevents generic feedback.
 * 
 * STAR = Situation, Task, Action, Result
 */
export interface STARScores {
  /** How well the situation was described (0-10) */
  situation: number;
  /** How well the task was explained (0-10) */
  task: number;
  /** How well the actions were detailed (0-10) */
  action: number;
  /** How well the results were presented (0-10) */
  result: number;
}

/**
 * AI-generated feedback on a user's interview answer.
 * Per user decision: STAR methodology framework for actionable feedback.
 */
export interface InterviewFeedback {
  /** Unique identifier for this feedback */
  id: string;
  /** Reference to the answer being evaluated */
  answerId: string;
  /** STAR methodology scores */
  starScores: STARScores;
  /** Overall score (0-100) */
  overallScore: number;
  /** Strengths identified in the answer */
  strengths: string[];
  /** Areas for improvement */
  improvements: string[];
  /** Filler words detected with counts */
  fillerWords: Array<{
    word: string;
    count: number;
  }>;
  /** When the feedback was generated */
  generatedAt: string;
}

/**
 * Schema for validating STARScores
 */
export const starScoresSchema = z.object({
  situation: z.number().min(0).max(10),
  task: z.number().min(0).max(10),
  action: z.number().min(0).max(10),
  result: z.number().min(0).max(10),
});

/**
 * Schema for validating InterviewFeedback
 */
export const interviewFeedbackSchema = z.object({
  id: z.string(),
  answerId: z.string(),
  starScores: starScoresSchema,
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  fillerWords: z.array(z.object({
    word: z.string(),
    count: z.number().nonnegative(),
  })),
  generatedAt: z.string().datetime(),
});

/**
 * Status of a practice session.
 */
export type InterviewSessionStatus = 'in_progress' | 'completed' | 'paused';

/**
 * Practice session with timed questions.
 * Per user decision: practice mode with timer (5, 10, or 15 minutes).
 */
export interface InterviewSession {
  /** Unique identifier for this session */
  id: string;
  /** Reference to the job this session is for */
  jobId: string;
  /** Duration of the session in minutes (5, 10, or 15) */
  durationMinutes: number;
  /** IDs of questions in this session */
  questionIds: string[];
  /** Index of the current question being answered */
  currentQuestionIndex: number;
  /** User's answers in this session */
  answers: InterviewAnswer[];
  /** Current status of the session */
  status: InterviewSessionStatus;
  /** When the session started */
  startedAt: string;
  /** When the session was completed (if applicable) */
  completedAt?: string;
}

/**
 * Schema for validating InterviewSession
 */
export const interviewSessionSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  durationMinutes: z.number().refine((val) => [5, 10, 15].includes(val), {
    message: 'Duration must be 5, 10, or 15 minutes',
  }),
  questionIds: z.array(z.string()),
  currentQuestionIndex: z.number().nonnegative(),
  answers: z.array(interviewAnswerSchema),
  status: z.enum(['in_progress', 'completed', 'paused']),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
});

// Type exports for convenience
export type InterviewQuestionType = z.infer<typeof interviewQuestionSchema>;
export type InterviewAnswerType = z.infer<typeof interviewAnswerSchema>;
export type InterviewFeedbackType = z.infer<typeof interviewFeedbackSchema>;
export type InterviewSessionType = z.infer<typeof interviewSessionSchema>;
export type STARScoresType = z.infer<typeof starScoresSchema>;
