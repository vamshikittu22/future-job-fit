/**
 * Section Extractor
 *
 * Rule-based section extraction engine that simulates how ATS systems parse resumes.
 * Implements pattern matching for headers, dates, and fields with confidence scoring.
 *
 * Features:
 * - Section detection with multiple header pattern variations
 * - Date extraction in MMM YYYY, MM/YY, and YYYY formats
 * - Field extraction (companies, titles, degrees, institutions, skills)
 * - Confidence scoring with weighted factors (30/25/25/20)
 * - Edge case handling for malformed input
 *
 * @module ats-simulation/engine
 * @version 1.0.0
 */

import type {
  SectionType,
  FieldType,
  ExtractedSection,
  FieldExtraction,
  ConfidenceScore,
  SectionBoundary,
  NormalizedDate,
  DateRange,
} from '../types';

/** Debug mode flag - set to true for verbose logging */
const DEBUG_MODE = false;

/**
 * Log debug message if debug mode is enabled
 * @param message - Message to log
 * @param data - Optional data to include
 */
function debugLog(message: string, data?: unknown): void {
  if (DEBUG_MODE) {
    console.log(`[SectionExtractor] ${message}`, data ?? '');
  }
}

/** Patterns for detecting section headers by type */
export const SECTION_PATTERNS: Record<SectionType, RegExp[]> = {
  EXPERIENCE: [
    /work\s+experience/i,
    /professional\s+experience/i,
    /employment\s+history/i,
    /career(\s+history)?/i,
    /professional\s+journey/i,
    /career/i,
  ],
  EDUCATION: [
    /education/i,
    /academic(\s+background)?/i,
    /qualifications/i,
    /degrees?/i,
    /academic\s+history/i,
  ],
  SKILLS: [
    /skills?/i,
    /technical\s+skills/i,
    /core\s+competencies/i,
    /expertise/i,
    /technical\s+expertise/i,
  ],
  PROJECTS: [
    /projects?/i,
    /portfolio/i,
    /personal\s+projects/i,
  ],
  CERTIFICATIONS: [
    /certifications?/i,
    /certificates?/i,
    /professional\s+certifications/i,
    /licenses?/i,
  ],
  SUMMARY: [
    /summary/i,
    /professional\s+summary/i,
    /objective/i,
    /career\s+objective/i,
    /profile/i,
  ],
  ACHIEVEMENTS: [
    /achievements?/i,
    /accomplishments?/i,
    /awards?/i,
    /honors?/i,
  ],
  UNKNOWN: [
    /.*/,
  ],
};

/** Patterns for detecting dates in various formats */
export const DATE_PATTERNS: RegExp[] = [
  // MMM YYYY - MMM YYYY (e.g., Jan 2020 - Dec 2022)
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b/gi,
  // MMM YYYY - Present
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*Present\b/gi,
  // MM/YY - MM/YY
  /\b\d{1,2}\/\d{2,4}\s*[-–—]\s*\d{1,2}\/\d{2,4}\b/g,
  // MM/YY - Present
  /\b\d{1,2}\/\d{2,4}\s*[-–—]\s*Present\b/gi,
  // YYYY - YYYY
  /\b\d{4}\s*[-–—]\s*\d{4}\b/g,
  // YYYY - Present
  /\b\d{4}\s*[-–—]\s*Present\b/gi,
  // Single dates
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b/gi,
  /\b\d{1,2}\/\d{2,4}\b/g,
  /\b\d{4}\b/g,
];

/** Patterns for extracting fields by type */
const FIELD_PATTERNS: Record<FieldType, RegExp | null> = {
  company: /(?:at|with|@)\s+([A-Z][A-Za-z0-9\s&.,]+(?:Inc\.?|LLC|Ltd\.?|Corp\.?|Company|Co\.?)?)/gi,
  job_title: /(?:^|\n)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,4}(?:Engineer|Developer|Manager|Director|Analyst|Designer|Architect|Lead|Specialist|Consultant|Coordinator))\b/gim,
  date_range: null, // Handled by DATE_PATTERNS
  degree: /\b(BS|BA|MS|MA|MBA|PhD|MD|JD|B\.S\.|B\.A\.|M\.S\.|M\.A\.|M\.B\.A\.|Ph\.D\.|Bachelor|Master|Doctorate)\s+(?:of\s+)?(?:Science|Arts|Business\s+Administration|Computer\s+Science|Engineering)?/gi,
  institution: /\b(?:University\s+of\s+[A-Za-z\s]+|College\s+of\s+[A-Za-z\s]+|[A-Z][a-z]+\s+University|[A-Z][a-z]+\s+College|[A-Z][a-z]+\s+Institute\s+of\s+Technology|MIT|Stanford|Harvard|Yale|Princeton|Columbia)\b/gi,
  skill: /\b([A-Z][a-z]+(?:\.?js)?(?:\+\+)?(?:#)?)\b/g,
  project_name: /(?:Project|App|System|Platform)[:\s]+([A-Z][A-Za-z0-9\s]+)/gi,
  certification_name: /\b(?:AWS\s+Certified|Microsoft\s+Certified|Google\s+Certified|Certified\s+[A-Za-z\s]+|PMP|CISSP|CISM|ITIL)\b/gi,
  issuer: null,
  location: /\b([A-Za-z\s]+,\s*[A-Z]{2}|Remote|Hybrid)\b/gi,
  description: null,
};

// Month name to index mapping
const MONTH_MAP: Record<string, number> = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

/**
 * Normalize a date string to structured format
 * @param dateStr - Date string to normalize
 * @returns Normalized date object or null
 */
export function normalizeDate(dateStr: string): NormalizedDate | null {
  const trimmed = dateStr.trim();
  
  // Try MMM YYYY format
  const monthYearMatch = trimmed.match(/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{4})$/i);
  if (monthYearMatch) {
    const monthName = monthYearMatch[1].toLowerCase();
    const year = parseInt(monthYearMatch[2], 10);
    return {
      year,
      month: MONTH_MAP[monthName],
      raw: trimmed,
    };
  }
  
  // Try YYYY format
  const yearMatch = trimmed.match(/^(\d{4})$/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    return {
      year,
      raw: trimmed,
    };
  }
  
  // Try MM/YY or MM/YYYY format
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{2,4})$/);
  if (slashMatch) {
    const month = parseInt(slashMatch[1], 10) - 1; // 0-indexed
    let year = parseInt(slashMatch[2], 10);
    // Handle 2-digit years
    if (year < 100) {
      year += year < 50 ? 2000 : 1900;
    }
    return {
      year,
      month,
      raw: trimmed,
    };
  }
  
  return null;
}

/**
 * Parse a date range string
 * @param rangeStr - Date range string (e.g., "Jan 2020 - Present")
 * @returns Parsed date range or null
 */
export function parseDateRange(rangeStr: string): DateRange | null {
  const trimmed = rangeStr.trim();
  
  // Check for Present as end date
  const presentMatch = trimmed.match(/^(.*?)\s*[-–—]\s*Present$/i);
  if (presentMatch) {
    const startDate = normalizeDate(presentMatch[1].trim());
    if (startDate) {
      return {
        startDate,
        endDate: 'present',
        raw: trimmed,
      };
    }
  }
  
  // Regular date range
  const rangeMatch = trimmed.match(/^(.*?)\s*[-–—]\s*(.*?)$/);
  if (rangeMatch) {
    const startDate = normalizeDate(rangeMatch[1].trim());
    const endDate = normalizeDate(rangeMatch[2].trim());
    if (startDate && endDate) {
      return {
        startDate,
        endDate,
        raw: trimmed,
      };
    }
  }
  
  // Single date (treat as start and end being the same)
  const singleDate = normalizeDate(trimmed);
  if (singleDate) {
    return {
      startDate: singleDate,
      endDate: singleDate,
      raw: trimmed,
    };
  }
  
  return null;
}

/**
 * Detect section boundaries in resume text
 * @param text - Resume text to analyze
 * @returns Array of section boundaries
 */
function detectSections(text: string): SectionBoundary[] {
  if (!text || text.trim().length === 0) {
    return [];
  }
  
  const boundaries: SectionBoundary[] = [];
  const lines = text.split('\n');
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    // Check each section type
    for (const [sectionType, patterns] of Object.entries(SECTION_PATTERNS)) {
      if (sectionType === 'UNKNOWN') continue;
      
      for (const pattern of patterns) {
        if (pattern.test(trimmedLine)) {
          // Calculate position in original text
          let position = 0;
          for (let i = 0; i < index; i++) {
            position += lines[i].length + 1; // +1 for newline
          }
          
          boundaries.push({
            type: sectionType as SectionType,
            start: position,
            end: position + line.length,
            header: trimmedLine,
            confidence: 80, // Base confidence for pattern match
          });
          return; // Found match for this line, move to next
        }
      }
    }
  });
  
  // Sort by position
  boundaries.sort((a, b) => a.start - b.start);
  
  // Remove duplicates (same type, close position)
  const uniqueBoundaries: SectionBoundary[] = [];
  for (const boundary of boundaries) {
    const isDuplicate = uniqueBoundaries.some(
      b => b.type === boundary.type && Math.abs(b.start - boundary.start) < 50
    );
    if (!isDuplicate) {
      uniqueBoundaries.push(boundary);
    }
  }
  
  return uniqueBoundaries;
}

/**
 * Extract content between section boundaries
 * @param text - Full resume text
 * @param boundaries - Array of section boundaries
 * @returns Array of section content strings
 */
function extractSectionContents(text: string, boundaries: SectionBoundary[]): { boundary: SectionBoundary; content: string }[] {
  const results: { boundary: SectionBoundary; content: string }[] = [];
  
  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i];
    const nextBoundary = boundaries[i + 1];
    
    const contentStart = boundary.end;
    const contentEnd = nextBoundary ? nextBoundary.start : text.length;
    
    const content = text.substring(contentStart, contentEnd).trim();
    
    results.push({ boundary, content });
  }
  
  return results;
}

/**
 * Check if text looks like ambiguous/uncertain content
 * @param text - Text to check
 * @returns True if content appears ambiguous
 */
function isAmbiguousContent(text: string): boolean {
  const ambiguousPatterns = [
    /\bunknown\b/i,
    /\bsome\s+text\b/i,
    /\bsometime\b/i,
    /\blast\s+year\b/i,
    /\bunclear\b/i,
    /\bambiguous\b/i,
    /\bvague\b/i,
  ];
  return ambiguousPatterns.some(pattern => pattern.test(text));
}

/**
 * Calculate confidence score for a field extraction
 * @param field - The extracted field
 * @param sectionType - Type of section containing the field
 * @returns Confidence score breakdown
 */
export function calculateConfidence(
  field: FieldExtraction,
  sectionType: SectionType
): ConfidenceScore {
  let patternMatch = 0;
  let contextProximity = 0;
  let formatValidity = 0;
  let sectionBoundary = 0;
  const flags: string[] = [];
  
  // Check for ambiguous content first (major confidence penalty)
  const isAmbiguous = isAmbiguousContent(field.value) || isAmbiguousContent(field.rawText);
  if (isAmbiguous) {
    flags.push('uncertain_format');
    flags.push('ambiguous_content');
  }
  
  // Pattern match score (0-30)
  if (field.value && field.value.length > 0) {
    patternMatch = 25;
    if (field.value.length >= 3) {
      patternMatch = 30;
    }
    // Penalty for ambiguous content
    if (isAmbiguous) {
      patternMatch = 5;
    }
  } else {
    patternMatch = 5;
    flags.push('no_value_extracted');
  }
  
  // Context proximity score (0-25)
  // Higher if field is in expected section
  const expectedFields: Record<SectionType, FieldType[]> = {
    EXPERIENCE: ['company', 'job_title', 'date_range', 'description'],
    EDUCATION: ['degree', 'institution', 'date_range'],
    SKILLS: ['skill'],
    PROJECTS: ['project_name', 'description'],
    CERTIFICATIONS: ['certification_name', 'issuer', 'date_range'],
    SUMMARY: ['description'],
    ACHIEVEMENTS: ['description'],
    UNKNOWN: [],
  };
  
  if (expectedFields[sectionType]?.includes(field.fieldType)) {
    contextProximity = 25;
  } else {
    contextProximity = 10;
    flags.push('unexpected_field_type');
  }
  
  // Heavy penalty for ambiguous content in context
  if (isAmbiguous) {
    contextProximity = 5;
  }
  
  // Format validity score (0-25)
  if (field.fieldType === 'date_range') {
    const dateRange = parseDateRange(field.value);
    if (dateRange) {
      formatValidity = 25;
    } else {
      formatValidity = 5;
      flags.push('invalid_date_format');
    }
  } else if (field.value && field.value.length >= 2) {
    formatValidity = 20;
    if (/^[A-Z]/.test(field.value)) {
      formatValidity = 25; // Starts with capital letter
    }
    // Penalty for ambiguous content
    if (isAmbiguous) {
      formatValidity = 0;
    }
  } else {
    formatValidity = 5;
    flags.push('short_value');
  }
  
  // Section boundary score (0-20)
  if (field.location && field.location.start >= 0) {
    sectionBoundary = 15;
    if (field.location.end > field.location.start) {
      sectionBoundary = 20;
    }
    // Penalty for ambiguous content
    if (isAmbiguous) {
      sectionBoundary = 5;
    }
  } else {
    sectionBoundary = 5;
    flags.push('no_location_data');
  }
  
  // Calculate overall score
  let overall = patternMatch + contextProximity + formatValidity + sectionBoundary;
  
  // Ensure ambiguous content has low confidence
  if (isAmbiguous && overall >= 50) {
    overall = 45; // Force below threshold
  }
  
  // Add flag for low confidence
  if (overall < 50 && !flags.includes('uncertain_format')) {
    flags.push('uncertain_format');
  }
  
  return {
    overall,
    patternMatch,
    contextProximity,
    formatValidity,
    sectionBoundary,
    flags: flags.length > 0 ? flags : undefined,
  };
}

/**
 * Extract fields from a section's content
 * @param content - Section content text
 * @param sectionType - Type of section being processed
 * @returns Array of extracted fields
 */
export function extractFields(content: string, sectionType: SectionType): FieldExtraction[] {
  const fields: FieldExtraction[] = [];
  
  if (!content || content.trim().length === 0) {
    return fields;
  }
  
  // Extract date ranges
  const datePattern = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b/gi;
  let dateMatch: RegExpExecArray | null;
  while ((dateMatch = datePattern.exec(content)) !== null) {
    fields.push({
      fieldType: 'date_range',
      value: dateMatch[0],
      rawText: dateMatch[0],
      location: {
        start: dateMatch.index,
        end: dateMatch.index + dateMatch[0].length,
      },
      confidence: calculateConfidence({
        fieldType: 'date_range',
        value: dateMatch[0],
        rawText: dateMatch[0],
        location: { start: dateMatch.index, end: dateMatch.index + dateMatch[0].length },
      }, sectionType),
    });
  }
  
  // Extract "Present" date ranges
  const presentPattern = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\s*[-–—]\s*Present\b/gi;
  let presentMatch: RegExpExecArray | null;
  while ((presentMatch = presentPattern.exec(content)) !== null) {
    // Check if this date is already captured
    const isDuplicate = fields.some(f => 
      f.fieldType === 'date_range' && 
      Math.abs(f.location.start - presentMatch!.index) < 5
    );
    if (!isDuplicate) {
      fields.push({
        fieldType: 'date_range',
        value: presentMatch[0],
        rawText: presentMatch[0],
        location: {
          start: presentMatch.index,
          end: presentMatch.index + presentMatch[0].length,
        },
        confidence: calculateConfidence({
          fieldType: 'date_range',
          value: presentMatch[0],
          rawText: presentMatch[0],
          location: { start: presentMatch.index, end: presentMatch.index + presentMatch[0].length },
        }, sectionType),
      });
    }
  }
  
  // Extract YYYY-YYYY date ranges
  const yearRangePattern = /\b(19|20)\d{2}\s*[-–—]\s*(19|20)\d{2}\b/g;
  let yearRangeMatch: RegExpExecArray | null;
  while ((yearRangeMatch = yearRangePattern.exec(content)) !== null) {
    const isDuplicate = fields.some(f => 
      f.fieldType === 'date_range' && 
      Math.abs(f.location.start - yearRangeMatch!.index) < 5
    );
    if (!isDuplicate) {
      fields.push({
        fieldType: 'date_range',
        value: yearRangeMatch[0],
        rawText: yearRangeMatch[0],
        location: {
          start: yearRangeMatch.index,
          end: yearRangeMatch.index + yearRangeMatch[0].length,
        },
        confidence: calculateConfidence({
          fieldType: 'date_range',
          value: yearRangeMatch[0],
          rawText: yearRangeMatch[0],
          location: { start: yearRangeMatch.index, end: yearRangeMatch.index + yearRangeMatch[0].length },
        }, sectionType),
      });
    }
  }
  
  // Extract YYYY-Present date ranges
  const yearPresentPattern = /\b(19|20)\d{2}\s*[-–—]\s*Present\b/gi;
  let yearPresentMatch: RegExpExecArray | null;
  while ((yearPresentMatch = yearPresentPattern.exec(content)) !== null) {
    const isDuplicate = fields.some(f => 
      f.fieldType === 'date_range' && 
      Math.abs(f.location.start - yearPresentMatch!.index) < 5
    );
    if (!isDuplicate) {
      fields.push({
        fieldType: 'date_range',
        value: yearPresentMatch[0],
        rawText: yearPresentMatch[0],
        location: {
          start: yearPresentMatch.index,
          end: yearPresentMatch.index + yearPresentMatch[0].length,
        },
        confidence: calculateConfidence({
          fieldType: 'date_range',
          value: yearPresentMatch[0],
          rawText: yearPresentMatch[0],
          location: { start: yearPresentMatch.index, end: yearPresentMatch.index + yearPresentMatch[0].length },
        }, sectionType),
      });
    }
  }
  
  // Extract companies (for EXPERIENCE sections)
  if (sectionType === 'EXPERIENCE') {
    // Pattern 1: "at Google" or "with Microsoft" - non-greedy to avoid capturing newlines
    const companyPattern = /(?:at|with|@)\s+([A-Z][A-Za-z0-9\s&.,]+?)(?:\s*(?:\n|\||,|\d{4}|\d{1,2}\/|\(|$))/gi;
    let companyMatch: RegExpExecArray | null;
    while ((companyMatch = companyPattern.exec(content)) !== null) {
      const companyName = companyMatch[1].trim();
      // Only accept company names that look reasonable (not too long, no dates)
      if (companyName.length > 1 && companyName.length < 50 && !/^\d{4}$/.test(companyName)) {
        fields.push({
          fieldType: 'company',
          value: companyName,
          rawText: companyMatch[0],
          location: {
            start: companyMatch.index,
            end: companyMatch.index + companyMatch[0].length,
          },
          confidence: calculateConfidence({
            fieldType: 'company',
            value: companyName,
            rawText: companyMatch[0],
            location: { start: companyMatch.index, end: companyMatch.index + companyMatch[0].length },
          }, sectionType),
        });
      }
    }
    
    // Also try to extract from "Company Name | Title" pattern
    const companyPipePattern = /^([A-Z][A-Za-z0-9\s&.,]+?)\s*\|/gm;
    let companyPipeMatch: RegExpExecArray | null;
    while ((companyPipeMatch = companyPipePattern.exec(content)) !== null) {
      const companyName = companyPipeMatch[1].trim();
      const isDuplicate = fields.some(f => 
        f.fieldType === 'company' && 
        f.value.toLowerCase() === companyName.toLowerCase()
      );
      if (!isDuplicate && companyName.length < 50) {
        fields.push({
          fieldType: 'company',
          value: companyName,
          rawText: companyPipeMatch[0],
          location: {
            start: companyPipeMatch.index,
            end: companyPipeMatch.index + companyPipeMatch[0].length,
          },
          confidence: calculateConfidence({
            fieldType: 'company',
            value: companyName,
            rawText: companyPipeMatch[0],
            location: { start: companyPipeMatch.index, end: companyPipeMatch.index + companyPipeMatch[0].length },
          }, sectionType),
        });
      }
    }
  }
  
  // Extract job titles (for EXPERIENCE sections)
  if (sectionType === 'EXPERIENCE') {
    // Parse line by line to avoid matching across lines
    const lines = content.split('\n');
    let position = 0;
    
    for (const line of lines) {
      // Pattern: "X at Company" on the same line
      const match = line.match(/([A-Za-z]+(?:\s+[A-Za-z]+){0,3})\s+at\s+([A-Z][A-Za-z]+)/);
      if (match) {
        const title = match[1].trim();
        // Only accept titles with multiple words
        if (title.includes(' ')) {
          fields.push({
            fieldType: 'job_title',
            value: title,
            rawText: match[0],
            location: {
              start: position + match.index!,
              end: position + match.index! + title.length,
            },
            confidence: calculateConfidence({
              fieldType: 'job_title',
              value: title,
              rawText: match[0],
              location: { start: position + match.index!, end: position + match.index! + title.length },
            }, sectionType),
          });
        }
      }
      position += line.length + 1; // +1 for newline
    }
  }
  
  // Extract degrees (for EDUCATION sections)
  if (sectionType === 'EDUCATION') {
    const degreePattern = /\b(BS|BA|MS|MA|MBA|PhD|MD|JD|B\.S\.|B\.A\.|M\.S\.|M\.A\.|M\.B\.A\.|Ph\.D\.|Bachelor|Master|Doctorate)\s+(?:of\s+)?(?:Science|Arts|Business\s+Administration|Computer\s+Science|Engineering)?/gi;
    let degreeMatch: RegExpExecArray | null;
    while ((degreeMatch = degreePattern.exec(content)) !== null) {
      fields.push({
        fieldType: 'degree',
        value: degreeMatch[0].trim(),
        rawText: degreeMatch[0],
        location: {
          start: degreeMatch.index,
          end: degreeMatch.index + degreeMatch[0].length,
        },
        confidence: calculateConfidence({
          fieldType: 'degree',
          value: degreeMatch[0].trim(),
          rawText: degreeMatch[0],
          location: { start: degreeMatch.index, end: degreeMatch.index + degreeMatch[0].length },
        }, sectionType),
      });
    }
    
    // Extract standalone degree abbreviations on their own line
    const standaloneDegreePattern = /(?:^|\n)\s*(BS|BA|MS|MA|MBA|PhD|MD|JD|B\.S\.|B\.A\.|M\.S\.|M\.A\.|M\.B\.A\.|Ph\.D\.)\s*(?:\n|$)/gim;
    let standaloneMatch: RegExpExecArray | null;
    while ((standaloneMatch = standaloneDegreePattern.exec(content)) !== null) {
      const isDuplicate = fields.some(f => 
        f.fieldType === 'degree' && 
        Math.abs(f.location.start - standaloneMatch!.index) < 10
      );
      if (!isDuplicate) {
        fields.push({
          fieldType: 'degree',
          value: standaloneMatch[1].trim(),
          rawText: standaloneMatch[0].trim(),
          location: {
            start: standaloneMatch.index,
            end: standaloneMatch.index + standaloneMatch[0].length,
          },
          confidence: calculateConfidence({
            fieldType: 'degree',
            value: standaloneMatch[1].trim(),
            rawText: standaloneMatch[0].trim(),
            location: { start: standaloneMatch.index, end: standaloneMatch.index + standaloneMatch[0].length },
          }, sectionType),
        });
      }
    }
  }
  
  // Extract institutions (for EDUCATION sections)
  if (sectionType === 'EDUCATION') {
    // Pattern 1: "University of X" or "College of X" 
    const institutionPattern = /(University\s+of\s+[A-Za-z]+(?:\s+[A-Za-z]+)?|College\s+of\s+[A-Za-z]+(?:\s+[A-Za-z]+)?)/gi;
    let institutionMatch: RegExpExecArray | null;
    while ((institutionMatch = institutionPattern.exec(content)) !== null) {
      const institution = institutionMatch[0].trim();
      fields.push({
        fieldType: 'institution',
        value: institution,
        rawText: institutionMatch[0],
        location: {
          start: institutionMatch.index,
          end: institutionMatch.index + institutionMatch[0].length,
        },
        confidence: calculateConfidence({
          fieldType: 'institution',
          value: institution,
          rawText: institutionMatch[0],
          location: { start: institutionMatch.index, end: institutionMatch.index + institutionMatch[0].length },
        }, sectionType),
      });
    }
    
    // Pattern 2: Standalone university names (MIT, Stanford, etc.)
    const standalonePattern = /\b(MIT|Stanford|Harvard|Yale|Princeton|Columbia|Oxford|Cambridge)\b/gi;
    let standaloneMatch: RegExpExecArray | null;
    while ((standaloneMatch = standalonePattern.exec(content)) !== null) {
      const institution = standaloneMatch[0].trim();
      // Check if not already captured
      const isDuplicate = fields.some(f => 
        f.fieldType === 'institution' && 
        f.value.toLowerCase().includes(institution.toLowerCase())
      );
      if (!isDuplicate) {
        fields.push({
          fieldType: 'institution',
          value: institution,
          rawText: standaloneMatch[0],
          location: {
            start: standaloneMatch.index,
            end: standaloneMatch.index + standaloneMatch[0].length,
          },
          confidence: calculateConfidence({
            fieldType: 'institution',
            value: institution,
            rawText: standaloneMatch[0],
            location: { start: standaloneMatch.index, end: standaloneMatch.index + standaloneMatch[0].length },
          }, sectionType),
        });
      }
    }
  }
  
  // Extract skills (for SKILLS sections)
  if (sectionType === 'SKILLS') {
    // Split by commas and newlines
    const skillSeparators = /[,\n]+/;
    const skillItems = content.split(skillSeparators);
    
    let currentPosition = 0;
    for (const skillItem of skillItems) {
      const trimmed = skillItem.trim();
      if (trimmed.length >= 2) {
        const skillIndex = content.indexOf(trimmed, currentPosition);
        if (skillIndex >= 0) {
          fields.push({
            fieldType: 'skill',
            value: trimmed,
            rawText: trimmed,
            location: {
              start: skillIndex,
              end: skillIndex + trimmed.length,
            },
            confidence: calculateConfidence({
              fieldType: 'skill',
              value: trimmed,
              rawText: trimmed,
              location: { start: skillIndex, end: skillIndex + trimmed.length },
            }, sectionType),
          });
          currentPosition = skillIndex + trimmed.length;
        }
      }
    }
  }
  
  return fields;
}

/**
 * Validate input text
 * @param text - Text to validate
 * @param paramName - Parameter name for error messages
 * @returns Validated text or empty string
 */
function validateInput(text: string | null | undefined, paramName: string): string {
  if (text === null || text === undefined) {
    debugLog(`Warning: ${paramName} is null/undefined`);
    return '';
  }
  if (typeof text !== 'string') {
    debugLog(`Warning: ${paramName} is not a string`, typeof text);
    return '';
  }
  return text;
}

/**
 * Extract all sections from a resume text
 * @param resumeText - Raw resume text content
 * @returns Array of extracted sections
 */
export function extractSections(resumeText: string): ExtractedSection[] {
  const validatedInput = validateInput(resumeText, 'resumeText');
  
  if (!validatedInput || validatedInput.trim().length === 0) {
    debugLog('Empty resume text provided, returning empty array');
    return [];
  }
  
  debugLog('Starting section extraction', { textLength: validatedInput.length });
  
  // Detect section boundaries
  const boundaries = detectSections(resumeText);
  
  if (boundaries.length === 0) {
    // No recognizable sections - return empty or create an unknown section
    return [];
  }
  
  // Extract content for each section
  const sectionContents = extractSectionContents(resumeText, boundaries);
  
  // Build extracted sections
  const sections: ExtractedSection[] = [];
  
  for (let i = 0; i < sectionContents.length; i++) {
    const { boundary, content } = sectionContents[i];
    
    // Extract fields from content
    const fields = extractFields(content, boundary.type);
    
    // Calculate section-level confidence
    const sectionConfidence: ConfidenceScore = {
      overall: boundary.confidence,
      patternMatch: 30,
      contextProximity: 25,
      formatValidity: 25,
      sectionBoundary: 20,
    };
    
    // Adjust confidence based on field extraction success
    if (fields.length === 0) {
      sectionConfidence.overall = Math.max(30, boundary.confidence - 20);
      sectionConfidence.formatValidity = 10;
    } else {
      // Boost confidence if we extracted meaningful fields
      const highConfidenceFields = fields.filter(f => (f.confidence?.overall || 0) >= 70);
      if (highConfidenceFields.length >= 2) {
        sectionConfidence.overall = Math.min(95, boundary.confidence + 10);
      }
    }
    
    sections.push({
      type: boundary.type,
      content,
      fields,
      confidence: sectionConfidence,
      position: i,
      header: boundary.header,
    });
  }
  
  return sections;
}

/**
 * Validate date format
 * @param dateRange - Date range to validate
 * @returns True if format is valid
 */
function validateDateFormat(dateRange: DateRange): boolean {
  if (!dateRange || !dateRange.startDate) {
    return false;
  }
  
  // Check if year is reasonable (1950-2030)
  const year = dateRange.startDate.year;
  if (year < 1950 || year > 2030) {
    return false;
  }
  
  // If end date is not 'present', validate it too
  if (dateRange.endDate !== 'present') {
    const endYear = dateRange.endDate.year;
    if (endYear < 1950 || endYear > 2030) {
      return false;
    }
    
    // Start should be before or equal to end
    if (year > endYear) {
      return false;
    }
  }
  
  return true;
}
