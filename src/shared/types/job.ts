/**
 * Job Types
 *
 * TypeScript type definitions for job data management.
 * Used across JobContext, job analysis features, and cover letter generation.
 */

// --- Enums & Literal Types ---

/** Types of fields that can be extracted from a job description */
export type JobFieldType = 'requirement' | 'qualification' | 'responsibility' | 'skill' | 'benefit';

/** Source of the job data */
export type JobSource = 'manual' | 'linkedin' | 'import';

/** Application status for tracking job applications */
export type JobStatus = 'draft' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'archived';

/** Salary period options */
export type SalaryPeriod = 'hourly' | 'yearly';

// --- Core Models ---

/**
 * AI-extracted structured field from job descriptions
 */
export interface ExtractedJobField {
  /** Unique identifier for the field */
  id: string;
  /** Type of field extracted */
  fieldType: JobFieldType;
  /** The extracted value/text */
  value: string;
  /** AI confidence score (0-1) */
  confidence: number;
  /** Which JD section this field came from */
  sourceSection: string;
}

/**
 * Salary range structure
 */
export interface SalaryRange {
  /** Minimum salary amount */
  min?: number;
  /** Maximum salary amount */
  max?: number;
  /** Currency code (e.g., 'USD', 'EUR') */
  currency?: string;
  /** Payment period */
  period?: SalaryPeriod;
}

/**
 * Metadata for a job entry
 */
export interface JobMetadata {
  /** ISO timestamp when job was created */
  createdAt: string;
  /** ISO timestamp when job was last updated */
  updatedAt: string;
  /** ISO timestamp when job was last analyzed by AI */
  lastAnalyzedAt?: string;
  /** Source of the job data */
  source?: JobSource;
  /** User-defined tags for organization */
  tags?: string[];
}

/**
 * Core job data structure
 * Stores both raw job description text and AI-extracted structured fields
 */
export interface JobData {
  /** Unique identifier for the job */
  id: string;
  /** Job title/position */
  title: string;
  /** Company name */
  company: string;
  /** Job location (city, remote, etc.) */
  location?: string;
  /** Raw job description text */
  description: string;
  /** AI-extracted structured fields from description */
  extractedFields: ExtractedJobField[];
  /** Derived requirements (synthesized from extractedFields) */
  requirements?: string[];
  /** Salary information if available */
  salaryRange?: SalaryRange;
  /** URL to job posting */
  url?: string;
  /** Current application status */
  status: JobStatus;
  /** Metadata for the job entry */
  metadata: JobMetadata;
  /** User notes about this job */
  notes?: string;
}

/**
 * Persisted job structure with version support
 */
export interface SavedJob {
  /** The job data */
  job: JobData;
  /** Version number for optimistic locking */
  version?: number;
}

// --- Context Types ---

/**
 * Job context state structure
 */
export interface JobContextState {
  /** Currently active/selected job */
  currentJob: JobData | null;
  /** List of all saved jobs */
  savedJobs: SavedJob[];
}

/**
 * Job action types for reducer
 */
export type JobAction =
  | { type: 'SET_CURRENT_JOB'; payload: JobData }
  | { type: 'ADD_JOB'; payload: JobData }
  | { type: 'UPDATE_JOB'; payload: { id: string; updates: Partial<JobData> } }
  | { type: 'REMOVE_JOB'; payload: string }
  | { type: 'LOAD_JOB'; payload: string }
  | { type: 'CLEAR_CURRENT_JOB' }
  | { type: 'UPDATE_EXTRACTED_FIELDS'; payload: { id: string; fields: ExtractedJobField[] } }
  | { type: 'ADD_NOTE'; payload: { id: string; note: string } }
  | { type: 'SET_SAVED_JOBS'; payload: SavedJob[] };

/**
 * Job context value interface (exposed via useJob hook)
 */
export interface JobContextValue {
  /** Currently active job */
  currentJob: JobData | null;
  /** List of saved jobs */
  savedJobs: SavedJob[];
  /** Set the current job */
  setCurrentJob: (job: JobData) => void;
  /** Add a new job to saved jobs */
  addJob: (job: JobData) => void;
  /** Update an existing job */
  updateJob: (id: string, updates: Partial<JobData>) => void;
  /** Remove a job from saved jobs */
  removeJob: (id: string) => void;
  /** Save current job to saved jobs list */
  saveCurrentJob: () => void;
  /** Load a job from saved jobs into current */
  loadJob: (id: string) => void;
  /** Clear the current job (reset to initial state) */
  clearCurrentJob: () => void;
  /** Update extracted fields for a job */
  updateExtractedFields: (fields: ExtractedJobField[]) => void;
  /** Add a note to the current job */
  addNote: (note: string) => void;
}

// --- Helper Types ---

/**
 * Filter options for job list
 */
export interface JobFilterOptions {
  /** Filter by status */
  status?: JobStatus;
  /** Filter by source */
  source?: JobSource;
  /** Search query for title/company */
  searchQuery?: string;
  /** Filter by tags */
  tags?: string[];
}

/**
 * Job statistics for dashboard
 */
export interface JobStatistics {
  /** Total number of jobs */
  total: number;
  /** Count by status */
  byStatus: Record<JobStatus, number>;
  /** Recently added jobs (last 7 days) */
  recentCount: number;
}
