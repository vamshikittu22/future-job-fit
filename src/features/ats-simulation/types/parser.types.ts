/**
 * ATS Parser Types
 *
 * Type definitions for section extraction and field parsing from resume content.
 * These types support the parsing engine that simulates how real ATS systems
 * extract structured data from unstructured resume documents.
 *
 * @module ats-simulation/types/parser
 */

import type { ConfidenceScore } from './scoring.types';

/**
 * Enumeration of section types that ATS parsers recognize
 * Each represents a standard resume section
 */
export enum SectionType {
  /** Work experience entries with companies, roles, and dates */
  EXPERIENCE = 'experience',
  /** Educational background with institutions and degrees */
  EDUCATION = 'education',
  /** Skills section (technical, soft, tools) */
  SKILLS = 'skills',
  /** Project portfolio with descriptions */
  PROJECTS = 'projects',
  /** Professional certifications and credentials */
  CERTIFICATIONS = 'certifications',
  /** Professional summary or objective */
  SUMMARY = 'summary',
  /** User-defined custom sections */
  CUSTOM = 'custom',
}

/**
 * Types of fields that can be extracted from resume sections
 * Used for granular parsing and validation
 */
export type FieldType =
  | 'date_range'      // Employment or education dates
  | 'company'         // Company or organization name
  | 'title'           // Job title or position
  | 'location'        // Geographic location
  | 'degree'          // Educational degree earned
  | 'institution'     // School or university name
  | 'skill'           // Individual skill mention
  | 'bullet'          // Bullet point description
  | 'description';    // General description text

/**
 * Represents the detected format of a date range
 * Helps identify parsing accuracy and format compliance
 */
export type DateFormat =
  | 'MMM YYYY'        // Jan 2020, Dec 2023
  | 'MM/YYYY'         // 01/2020, 12/2023
  | 'YYYY'            // 2020, 2023
  | 'unknown';        // Could not determine format

/**
 * Date range with validation and format detection
 * Used for experience and education date parsing
 *
 * @example
 * ```typescript
 * const dateRange: DateRange = {
 *   startDate: 'Jan 2020',
 *   endDate: 'Dec 2023',
 *   isValidFormat: true,
 *   formatDetected: 'MMM YYYY'
 * };
 * ```
 */
export interface DateRange {
  /** Starting date as extracted (e.g., "Jan 2020") */
  startDate: string;

  /** Ending date or 'Present' for current positions */
  endDate: string | 'Present';

  /** Whether the date format is ATS-friendly */
  isValidFormat: boolean;

  /** The detected format pattern */
  formatDetected: DateFormat;
}

/**
 * Represents a single extracted field from a resume section
 * Includes confidence scoring and position information for debugging
 */
export interface FieldExtraction {
  /** Type of field extracted */
  fieldType: FieldType;

  /** Normalized/cleaned value */
  value: string;

  /** Original raw text before normalization */
  rawText: string;

  /** Confidence score for this extraction with factor breakdown */
  confidence: ConfidenceScore;

  /** Position within the section content */
  position: {
    /** Character start index */
    start: number;
    /** Character end index */
    end: number;
  };
}

/**
 * Represents an extracted resume section with all metadata
 * Core data structure for parsed resume content
 *
 * @example
 * ```typescript
 * const section: ExtractedSection = {
 *   type: SectionType.EXPERIENCE,
 *   title: 'Work Experience',
 *   content: 'Software Engineer at Google...',
 *   startIndex: 150,
 *   endIndex: 1250,
 *   confidence: 87,
 *   fields: [...]
 * };
 * ```
 */
export interface ExtractedSection {
  /** Type of section (experience, education, etc.) */
  type: SectionType;

  /** Original header text as written in resume */
  title: string;

  /** Full extracted content of the section */
  content: string;

  /** Character position where section begins in full resume */
  startIndex: number;

  /** Character position where section ends */
  endIndex: number;

  /** Overall confidence in section extraction (0-100) */
  confidence: number;

  /** Extracted fields within this section */
  fields: FieldExtraction[];
}

/**
 * Result of parsing a complete resume
 * Contains all extracted sections with metadata
 */
export interface ParsedResume {
  /** All sections found in the resume */
  sections: ExtractedSection[];

  /** Order of sections as they appear */
  sectionOrder: SectionType[];

  /** Any sections that couldn't be parsed */
  unparsedContent: string[];

  /** Overall parsing quality score (0-100) */
  parsingQuality: number;

  /** Timestamp of parsing */
  parsedAt: number;
}

/**
 * Configuration for the section parser
 */
export interface ParserConfig {
  /** Minimum confidence threshold for accepting extractions (0-100) */
  minConfidenceThreshold: number;

  /** Whether to attempt fuzzy matching for section headers */
  enableFuzzyMatching: boolean;

  /** Custom section header mappings (e.g., {"Employment": "experience"}) */
  customHeaderMappings: Record<string, SectionType>;

  /** Maximum length for extracted content fields */
  maxContentLength: number;
}

/**
 * Type guard to check if a value is a valid SectionType
 * @param value - Value to check
 * @returns True if value is a SectionType
 */
export function isSectionType(value: unknown): value is SectionType {
  return typeof value === 'string' && Object.values(SectionType).includes(value as SectionType);
}

/**
 * Type guard to check if a value is a valid FieldType
 * @param value - Value to check
 * @returns True if value is a FieldType
 */
export function isFieldType(value: unknown): value is FieldType {
  const validTypes: FieldType[] = [
    'date_range',
    'company',
    'title',
    'location',
    'degree',
    'institution',
    'skill',
    'bullet',
    'description',
  ];
  return typeof value === 'string' && validTypes.includes(value as FieldType);
}

/**
 * Type guard to check if a value is a valid DateFormat
 * @param value - Value to check
 * @returns True if value is a DateFormat
 */
export function isDateFormat(value: unknown): value is DateFormat {
  const validFormats: DateFormat[] = ['MMM YYYY', 'MM/YYYY', 'YYYY', 'unknown'];
  return typeof value === 'string' && validFormats.includes(value as DateFormat);
}
