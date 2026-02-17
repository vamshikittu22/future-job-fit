/**
 * Minimal TypeScript tests for use-ats.ts hook
 * These tests verify the core contracts of the ATS hook.
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useATS } from '../use-ats';
import type { ResumeData } from '@/shared/lib/initialData';

// Mock the dependencies
vi.mock('@/shared/api/resumeAI', () => ({
    resumeAI: {
        evaluateATSCloud: vi.fn(),
    },
}));

vi.mock('../usePyNLP', () => ({
    usePyNLP: () => ({
        isReady: false,
        evaluateATS: vi.fn(),
    }),
}));

// Sample minimal resume data for testing
// Using type assertion as the test data is valid at runtime but stricter at compile-time
const mockResumeData = {

    personal: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '555-1234',
        location: 'San Francisco, CA',
    },
    summary: 'Experienced software engineer with expertise in React and TypeScript.',
    experience: [
        {
            id: '1',
            title: 'Senior Developer',
            company: 'Tech Corp',
            location: 'Remote',
            startDate: '2020-01',
            endDate: '',
            current: true,
            description: 'Led development of web applications',
            bullets: [
                'Developed React components using TypeScript',
                'Implemented CI/CD pipelines reducing deployment time by 50%'
            ],
            technologies: ['React', 'TypeScript', 'Node.js'],
        },
    ],
    skills: [
        {
            category: 'Technical',
            items: ['React', 'TypeScript', 'JavaScript', 'Node.js', 'Git'],
        },
    ],
    education: [
        {
            id: '1',
            degree: 'Bachelor of Science',
            school: 'State University',
            location: 'California',
            startDate: '2014',
            endDate: '2018',
            fieldOfStudy: 'Computer Science',
            description: '',
        },
    ],
    projects: [],
    achievements: [],
    certifications: [],
    customSections: [],
};

describe('useATS hook', () => {
    describe('Legacy mode (no JD)', () => {
        it('returns a numeric atsScore', () => {
            const { result } = renderHook(() => useATS(mockResumeData));

            expect(typeof result.current.atsScore).toBe('number');
            expect(result.current.atsScore).toBeGreaterThanOrEqual(0);
            expect(result.current.atsScore).toBeLessThanOrEqual(100);
        });

        it('returns analysis object with expected structure', () => {
            const { result } = renderHook(() => useATS(mockResumeData));

            expect(result.current.analysis).toBeDefined();
            expect(result.current.analysis.keywords).toBeDefined();
            expect(result.current.analysis.sections).toBeDefined();
            expect(result.current.analysis.suggestions).toBeDefined();
        });

        it('returns loading and error states', () => {
            const { result } = renderHook(() => useATS(mockResumeData));

            expect(typeof result.current.loading).toBe('boolean');
            expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
        });

        it('provides helper selector functions', () => {
            const { result } = renderHook(() => useATS(mockResumeData));

            expect(typeof result.current.getKeywordsByStatus).toBe('function');
            expect(typeof result.current.getCoverageBySection).toBe('function');
            expect(typeof result.current.getRecommendationsForLocation).toBe('function');
        });
    });

    describe('Helper selectors (without JD)', () => {
        it('getKeywordsByStatus returns empty array when no JD provided', () => {
            const { result } = renderHook(() => useATS(mockResumeData));

            const missing = result.current.getKeywordsByStatus('missing');
            expect(Array.isArray(missing)).toBe(true);
            expect(missing.length).toBe(0);
        });

        it('getCoverageBySection returns zero stats when no JD provided', () => {
            const { result } = renderHook(() => useATS(mockResumeData));

            const coverage = result.current.getCoverageBySection('experience');
            expect(coverage).toEqual({ covered: 0, total: 0, percentage: 0 });
        });

        it('getRecommendationsForLocation returns empty array when no JD provided', () => {
            const { result } = renderHook(() => useATS(mockResumeData));

            const recs = result.current.getRecommendationsForLocation('summary');
            expect(Array.isArray(recs)).toBe(true);
            expect(recs.length).toBe(0);
        });
    });

    describe('Score determinism', () => {
        it('same input produces same score', () => {
            const { result: result1 } = renderHook(() => useATS(mockResumeData));
            const { result: result2 } = renderHook(() => useATS(mockResumeData));
            const { result: result3 } = renderHook(() => useATS(mockResumeData));

            expect(result1.current.atsScore).toBe(result2.current.atsScore);
            expect(result2.current.atsScore).toBe(result3.current.atsScore);
        });
    });

    describe('Structured mode (with JD)', () => {
        it('initially has no breakdown when JD is provided but loading', () => {
            const jd = 'Looking for a Senior React Developer with TypeScript experience.';
            const { result } = renderHook(() => useATS(mockResumeData, jd));

            // Initially loading or undefined
            expect(result.current.loading === true || result.current.atsScoreBreakdown === undefined).toBe(true);
        });
    });
});
