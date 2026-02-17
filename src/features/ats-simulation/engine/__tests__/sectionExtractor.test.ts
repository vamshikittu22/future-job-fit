/**
 * Section Extractor Tests (TDD - RED Phase)
 * 
 * Comprehensive test suite for rule-based section extraction engine.
 * These tests should FAIL initially (RED phase) before implementation.
 */

import { describe, it, expect } from 'vitest';
import {
  extractSections,
  extractFields,
  calculateConfidence,
  SECTION_PATTERNS,
  DATE_PATTERNS,
  normalizeDate,
  parseDateRange,
} from '../sectionExtractor';
import type { ExtractedSection, FieldExtraction, SectionType, ConfidenceScore } from '../../types';

describe('Section Extraction Engine', () => {
  
  describe('Section Detection', () => {
    
    it('should detect standard WORK EXPERIENCE section', () => {
      const resumeText = `WORK EXPERIENCE
Software Engineer at Google
Jan 2020 - Present
Developed scalable systems`;
      
      const sections = extractSections(resumeText);
      
      expect(sections).toHaveLength(1);
      expect(sections[0].type).toBe('EXPERIENCE');
      expect(sections[0].confidence.overall).toBeGreaterThan(70);
    });

    it('should detect EDUCATION section with degree and institution', () => {
      const resumeText = `EDUCATION
BS Computer Science
University of Washington
2015-2019`;
      
      const sections = extractSections(resumeText);
      
      expect(sections).toHaveLength(1);
      expect(sections[0].type).toBe('EDUCATION');
    });

    it('should detect SKILLS section with technical skills', () => {
      const resumeText = `SKILLS
JavaScript, React, Node.js, TypeScript, Python`;
      
      const sections = extractSections(resumeText);
      
      expect(sections).toHaveLength(1);
      expect(sections[0].type).toBe('SKILLS');
    });

    it('should detect Experience section variations', () => {
      const variations = [
        'Work Experience',
        'Professional Experience',
        'Employment History',
        'Career History',
        'Professional Journey',
        'Career'
      ];
      
      variations.forEach(header => {
        const resumeText = `${header}
Software Engineer
2020-2023`;
        const sections = extractSections(resumeText);
        
        expect(sections).toHaveLength(1);
        expect(sections[0].type).toBe('EXPERIENCE');
      });
    });

    it('should detect Education section variations', () => {
      const variations = [
        'Education',
        'Academic Background',
        'Qualifications',
        'Degrees',
        'Academic History'
      ];
      
      variations.forEach(header => {
        const resumeText = `${header}
BS Computer Science
University of Washington`;
        const sections = extractSections(resumeText);
        
        expect(sections).toHaveLength(1);
        expect(sections[0].type).toBe('EDUCATION');
      });
    });

    it('should detect Skills section variations', () => {
      const variations = [
        'Skills',
        'Technical Skills',
        'Core Competencies',
        'Expertise',
        'Technical Expertise'
      ];
      
      variations.forEach(header => {
        const resumeText = `${header}
JavaScript, React, Node.js`;
        const sections = extractSections(resumeText);
        
        expect(sections).toHaveLength(1);
        expect(sections[0].type).toBe('SKILLS');
      });
    });

    it('should handle case-insensitive headers', () => {
      const variations = [
        'work experience',
        'WORK EXPERIENCE',
        'Work Experience',
        'WoRk ExPeRiEnCe'
      ];
      
      variations.forEach(header => {
        const resumeText = `${header}
Software Engineer at Google`;
        const sections = extractSections(resumeText);
        
        expect(sections).toHaveLength(1);
        expect(sections[0].type).toBe('EXPERIENCE');
      });
    });

    it('should detect multiple sections in one resume', () => {
      const resumeText = `WORK EXPERIENCE
Software Engineer at Google
Jan 2020 - Present

EDUCATION
BS Computer Science
University of Washington
2015-2019

SKILLS
JavaScript, React, Node.js`;
      
      const sections = extractSections(resumeText);
      
      expect(sections).toHaveLength(3);
      expect(sections.map(s => s.type)).toContain('EXPERIENCE');
      expect(sections.map(s => s.type)).toContain('EDUCATION');
      expect(sections.map(s => s.type)).toContain('SKILLS');
    });

    it('should handle non-standard headers by mapping to closest section type', () => {
      const resumeText = `Professional Journey
Software Engineer at Startup
2021-2023

Academic Background
BS in Computer Science
MIT
2017-2021`;
      
      const sections = extractSections(resumeText);
      
      expect(sections).toHaveLength(2);
      expect(sections[0].type).toBe('EXPERIENCE');
      expect(sections[1].type).toBe('EDUCATION');
    });
  });

  describe('Date Extraction', () => {
    
    it('should extract MMM YYYY format dates', () => {
      const dateFormats = [
        'Jan 2020 - Dec 2022',
        'January 2020 - December 2022',
        'Mar 2019 - Present',
        'Sep 2018 - Oct 2021'
      ];
      
      dateFormats.forEach(dateStr => {
        const result = parseDateRange(dateStr);
        expect(result).not.toBeNull();
        expect(result?.startDate).toBeDefined();
      });
    });

    it('should extract MM/YY format dates', () => {
      const dateFormats = [
        '01/20 - 12/22',
        '3/19 - Present',
        '09/18 - 10/21'
      ];
      
      dateFormats.forEach(dateStr => {
        const result = parseDateRange(dateStr);
        expect(result).not.toBeNull();
        expect(result?.startDate).toBeDefined();
      });
    });

    it('should extract YYYY format dates', () => {
      const dateFormats = [
        '2020 - 2022',
        '2019 - Present',
        '2018-2021'
      ];
      
      dateFormats.forEach(dateStr => {
        const result = parseDateRange(dateStr);
        expect(result).not.toBeNull();
        expect(result?.startDate).toBeDefined();
      });
    });

    it('should handle "Present" as end date', () => {
      const result = parseDateRange('Jan 2020 - Present');
      
      expect(result).not.toBeNull();
      expect(result?.endDate).toBe('present');
    });

    it('should normalize dates consistently', () => {
      const normalized = normalizeDate('Jan 2020');
      
      expect(normalized).toBeDefined();
      expect(normalized?.year).toBe(2020);
      expect(normalized?.month).toBe(0); // January = 0
    });
  });

  describe('Field Extraction', () => {
    
    it('should extract company names from Experience section', () => {
      const content = `Software Engineer at Google
Jan 2020 - Present
Developed scalable systems

Senior Developer at Microsoft
2018-2020
Led team of 5`;
      
      const fields = extractFields(content, 'EXPERIENCE');
      const companies = fields.filter(f => f.fieldType === 'company');
      
      expect(companies.length).toBeGreaterThanOrEqual(2);
      expect(companies.map(c => c.value)).toContain('Google');
      expect(companies.map(c => c.value)).toContain('Microsoft');
    });

    it('should extract job titles from Experience section', () => {
      const content = `Software Engineer at Google
Jan 2020 - Present

Senior Developer at Microsoft`;
      
      const fields = extractFields(content, 'EXPERIENCE');
      const titles = fields.filter(f => f.fieldType === 'job_title');
      
      expect(titles.length).toBeGreaterThanOrEqual(2);
      expect(titles.map(t => t.value)).toContain('Software Engineer');
      expect(titles.map(t => t.value)).toContain('Senior Developer');
    });

    it('should extract date ranges from Experience section', () => {
      const content = `Software Engineer at Google
Jan 2020 - Present

Senior Developer at Microsoft
2018-2020`;
      
      const fields = extractFields(content, 'EXPERIENCE');
      const dates = fields.filter(f => f.fieldType === 'date_range');
      
      expect(dates.length).toBeGreaterThanOrEqual(2);
    });

    it('should extract degree information from Education section', () => {
      const content = `BS Computer Science
University of Washington
2015-2019

MBA
Harvard Business School
2019-2021`;
      
      const fields = extractFields(content, 'EDUCATION');
      const degrees = fields.filter(f => f.fieldType === 'degree');
      
      expect(degrees.length).toBeGreaterThanOrEqual(2);
      expect(degrees.map(d => d.value)).toContain('BS Computer Science');
      expect(degrees.map(d => d.value)).toContain('MBA');
    });

    it('should extract institution names from Education section', () => {
      const content = `BS Computer Science
University of Washington
2015-2019`;
      
      const fields = extractFields(content, 'EDUCATION');
      const institutions = fields.filter(f => f.fieldType === 'institution');
      
      expect(institutions.length).toBeGreaterThanOrEqual(1);
      expect(institutions.map(i => i.value)).toContain('University of Washington');
    });

    it('should extract skills from Skills section', () => {
      const content = `JavaScript, React, Node.js, TypeScript, Python, AWS`;
      
      const fields = extractFields(content, 'SKILLS');
      
      expect(fields.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('Confidence Scoring', () => {
    
    it('should calculate high confidence for standard format with clear headers', () => {
      const field: FieldExtraction = {
        fieldType: 'date_range',
        value: 'Jan 2020 - Present',
        rawText: 'Jan 2020 - Present',
        location: { start: 50, end: 68 },
      };
      
      const confidence = calculateConfidence(field, 'EXPERIENCE');
      
      expect(confidence.overall).toBeGreaterThanOrEqual(70);
    });

    it('should calculate confidence using weighted factors (30/25/25/20)', () => {
      const field: FieldExtraction = {
        fieldType: 'company',
        value: 'Google',
        rawText: 'at Google Inc.',
        location: { start: 25, end: 37 },
      };
      
      const confidence = calculateConfidence(field, 'EXPERIENCE');
      
      expect(confidence.patternMatch).toBeGreaterThanOrEqual(0);
      expect(confidence.patternMatch).toBeLessThanOrEqual(30);
      expect(confidence.contextProximity).toBeGreaterThanOrEqual(0);
      expect(confidence.contextProximity).toBeLessThanOrEqual(25);
      expect(confidence.formatValidity).toBeGreaterThanOrEqual(0);
      expect(confidence.formatValidity).toBeLessThanOrEqual(25);
      expect(confidence.sectionBoundary).toBeGreaterThanOrEqual(0);
      expect(confidence.sectionBoundary).toBeLessThanOrEqual(20);
      expect(confidence.overall).toBeGreaterThanOrEqual(0);
      expect(confidence.overall).toBeLessThanOrEqual(100);
    });

    it('should return lower confidence for ambiguous content', () => {
      const field: FieldExtraction = {
        fieldType: 'company',
        value: 'Unknown',
        rawText: 'some text',
        location: { start: 0, end: 9 },
      };
      
      const confidence = calculateConfidence(field, 'EXPERIENCE');
      
      expect(confidence.overall).toBeLessThan(50);
    });

    it('should flag uncertain extraction with confidence below threshold', () => {
      const field: FieldExtraction = {
        fieldType: 'date_range',
        value: 'sometime last year',
        rawText: 'sometime last year',
        location: { start: 0, end: 18 },
      };
      
      const confidence = calculateConfidence(field, 'EXPERIENCE');
      
      expect(confidence.overall).toBeLessThan(50);
      expect(confidence.flags).toContain('uncertain_format');
    });
  });

  describe('Edge Cases', () => {
    
    it('should handle empty resume', () => {
      const sections = extractSections('');
      
      expect(sections).toHaveLength(0);
    });

    it('should handle resume with no recognizable sections', () => {
      const resumeText = 'Random text without any section headers or structure';
      const sections = extractSections(resumeText);
      
      expect(sections.length).toBeGreaterThanOrEqual(0);
      if (sections.length > 0) {
        expect(sections[0].confidence.overall).toBeLessThan(50);
      }
    });

    it('should handle duplicate section headers', () => {
      const resumeText = `WORK EXPERIENCE
Job 1

WORK EXPERIENCE
Job 2`;
      
      const sections = extractSections(resumeText);
      
      expect(sections.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle special characters and formatting', () => {
      const resumeText = `WORK EXPERIENCE
Software Engineer | Google
Jan 2020 – Present
• Led development
• Managed team`;
      
      const sections = extractSections(resumeText);
      
      expect(sections).toHaveLength(1);
      expect(sections[0].type).toBe('EXPERIENCE');
    });

    it('should handle very long content between sections', () => {
      const longContent = 'a'.repeat(5000);
      const resumeText = `WORK EXPERIENCE
${longContent}

EDUCATION
BS Computer Science`;
      
      const sections = extractSections(resumeText);
      
      expect(sections.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Pattern Constants', () => {
    
    it('should have SECTION_PATTERNS defined', () => {
      expect(SECTION_PATTERNS).toBeDefined();
      expect(SECTION_PATTERNS.EXPERIENCE).toBeDefined();
      expect(SECTION_PATTERNS.EXPERIENCE.length).toBeGreaterThan(0);
      expect(SECTION_PATTERNS.EDUCATION).toBeDefined();
      expect(SECTION_PATTERNS.SKILLS).toBeDefined();
    });

    it('should have DATE_PATTERNS defined', () => {
      expect(DATE_PATTERNS).toBeDefined();
      expect(DATE_PATTERNS.length).toBeGreaterThan(0);
    });

    it('should have valid regex patterns', () => {
      SECTION_PATTERNS.EXPERIENCE.forEach(pattern => {
        expect(pattern).toBeInstanceOf(RegExp);
      });
      
      DATE_PATTERNS.forEach(pattern => {
        expect(pattern).toBeInstanceOf(RegExp);
      });
    });
  });
});
