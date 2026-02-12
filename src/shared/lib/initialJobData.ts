import { JobData } from '@/shared/types/job';

/**
 * localStorage key for current/draft job data
 */
export const JOB_STORAGE_KEY = 'jobBuilderDraft';

/**
 * localStorage key for list of saved jobs
 */
export const SAVED_JOBS_KEY = 'jobBuilderSavedJobs';

/**
 * Maximum number of saved jobs to prevent localStorage overflow
 */
export const MAX_SAVED_JOBS = 50;

/**
 * Initial/default job data state
 * 
 * Used when creating a new job or clearing the current job.
 * All fields are properly initialized with default values.
 */
export const initialJobData: JobData = {
  id: '',
  title: '',
  company: '',
  location: '',
  description: '',
  extractedFields: [],
  requirements: [],
  salaryRange: undefined,
  url: '',
  status: 'draft',
  metadata: {
    createdAt: '',
    updatedAt: '',
    tags: []
  },
  notes: ''
};

/**
 * Creates a new job data object with generated ID and timestamps
 * 
 * @param overrides - Optional partial JobData to override defaults
 * @returns A complete JobData object ready for use
 */
export function createNewJob(overrides: Partial<JobData> = {}): JobData {
  const now = new Date().toISOString();
  const id = generateJobId();
  
  return {
    ...initialJobData,
    id,
    metadata: {
      ...initialJobData.metadata,
      createdAt: now,
      updatedAt: now
    },
    ...overrides
  };
}

/**
 * Generates a unique job ID
 * Uses timestamp + random string for collision resistance
 * 
 * @returns A unique string ID
 */
export function generateJobId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Creates initial metadata with current timestamps
 * 
 * @returns JobMetadata with createdAt and updatedAt set to now
 */
export function createInitialMetadata(): JobData['metadata'] {
  const now = new Date().toISOString();
  return {
    createdAt: now,
    updatedAt: now,
    tags: []
  };
}
