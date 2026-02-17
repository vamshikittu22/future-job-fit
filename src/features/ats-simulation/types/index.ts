/**
 * ATS Simulation Engine Types
 * 
 * Type definitions for the rule-based section extraction engine.
 */

/** Section types that can be extracted from a resume */
export type SectionType = 
  | 'EXPERIENCE' 
  | 'EDUCATION' 
  | 'SKILLS' 
  | 'PROJECTS' 
  | 'CERTIFICATIONS' 
  | 'SUMMARY' 
  | 'ACHIEVEMENTS' 
  | 'UNKNOWN';

/** Field types that can be extracted within a section */
export type FieldType = 
  | 'company' 
  | 'job_title' 
  | 'date_range' 
  | 'degree' 
  | 'institution' 
  | 'skill' 
  | 'project_name' 
  | 'certification_name'
  | 'issuer'
  | 'location'
  | 'description';

/** Confidence score breakdown with weighted factors */
export interface ConfidenceScore {
  /** Overall confidence 0-100 */
  overall: number;
  /** Pattern match score (0-30) - Did regex find it? */
  patternMatch: number;
  /** Context proximity score (0-25) - Is it near expected content? */
  contextProximity: number;
  /** Format validity score (0-25) - Does it match expected format? */
  formatValidity: number;
  /** Section boundary score (0-20) - Is it clearly within section? */
  sectionBoundary: number;
  /** Warning flags for this extraction */
  flags?: string[];
}

/** Represents a section boundary in the resume text */
export interface SectionBoundary {
  /** Section type identified */
  type: SectionType;
  /** Start position in text */
  start: number;
  /** End position in text */
  end: number;
  /** Raw header text that triggered detection */
  header: string;
  /** Confidence in this boundary detection */
  confidence: number;
}

/** Represents a field extracted from section content */
export interface FieldExtraction {
  /** Type of field extracted */
  fieldType: FieldType;
  /** Normalized extracted value */
  value: string;
  /** Raw text as it appeared in resume */
  rawText: string;
  /** Position in section content */
  location: {
    start: number;
    end: number;
  };
  /** Confidence score for this extraction */
  confidence?: ConfidenceScore;
}

/** Represents an extracted section with fields */
export interface ExtractedSection {
  /** Section type */
  type: SectionType;
  /** Raw content between section boundaries */
  content: string;
  /** Fields extracted from this section */
  fields: FieldExtraction[];
  /** Confidence score for this section */
  confidence: ConfidenceScore;
  /** Section position in resume */
  position: number;
  /** Original header text */
  header: string;
}

/** Represents a normalized date */
export interface NormalizedDate {
  /** Full year (e.g., 2020) */
  year: number;
  /** Month index (0-11, January = 0) */
  month?: number;
  /** Day of month (1-31) */
  day?: number;
  /** Original date string */
  raw: string;
}

/** Represents a date range */
export interface DateRange {
  /** Start date */
  startDate: NormalizedDate;
  /** End date or 'present' */
  endDate: NormalizedDate | 'present';
  /** Raw date range string */
  raw: string;
}

/** Configuration for section extraction */
export interface ExtractionConfig {
  /** Minimum confidence threshold (0-100) */
  minConfidence: number;
  /** Whether to include uncertain extractions */
  includeUncertain: boolean;
  /** Maximum section length to process */
  maxSectionLength: number;
  /** Custom patterns to add */
  customPatterns?: {
    sections?: Partial<Record<SectionType, RegExp[]>>;
    dates?: RegExp[];
    fields?: Partial<Record<FieldType, RegExp>>;
  };
}

/** Default extraction configuration */
export const DEFAULT_EXTRACTION_CONFIG: ExtractionConfig = {
  minConfidence: 50,
  includeUncertain: true,
  maxSectionLength: 10000,
};
