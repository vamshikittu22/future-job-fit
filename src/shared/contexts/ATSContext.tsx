import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useATS } from '@/shared/hooks/use-ats';
import { useResume } from '@/shared/contexts/ResumeContext';
import type { MatchResultModel, ATSScoreBreakdown, Recommendation } from '@/shared/types/ats';

interface ATSContextType {
    // JD state
    jobDescription: string;
    setJobDescription: (jd: string) => void;

    // ATS results
    atsScore: number;
    atsScoreBreakdown?: ATSScoreBreakdown;
    matchResults?: MatchResultModel[];
    recommendations?: Recommendation[];
    loading: boolean;
    error: string | null;

    // Helper selectors
    getKeywordsByStatus: (status: 'matched' | 'partial' | 'missing') => MatchResultModel[];
    getCoverageBySection: (section: string) => { covered: number; total: number; percentage: number };
    getRecommendationsForLocation: (location: string) => Recommendation[];

    // Analysis (legacy)
    analysis: any;
}

const ATSContext = createContext<ATSContextType | undefined>(undefined);

interface ATSProviderProps {
    children: ReactNode;
}

/**
 * ATS Provider that wraps the wizard to share JD and ATS state across all steps.
 * This allows inline recommendations to appear in any editor step.
 */
export const ATSProvider: React.FC<ATSProviderProps> = ({ children }) => {
    const { resumeData } = useResume();
    const [jobDescription, setJobDescription] = useState('');

    const {
        atsScore,
        analysis,
        atsScoreBreakdown,
        matchResults,
        recommendations,
        loading,
        error,
        getKeywordsByStatus,
        getCoverageBySection,
        getRecommendationsForLocation,
    } = useATS(resumeData, jobDescription || undefined);

    const value: ATSContextType = {
        jobDescription,
        setJobDescription,
        atsScore,
        atsScoreBreakdown,
        matchResults,
        recommendations,
        loading,
        error,
        getKeywordsByStatus,
        getCoverageBySection,
        getRecommendationsForLocation,
        analysis,
    };

    return (
        <ATSContext.Provider value={value}>
            {children}
        </ATSContext.Provider>
    );
};

/**
 * Hook to access ATS context from any editor step
 */
export const useATSContext = (): ATSContextType => {
    const context = useContext(ATSContext);
    if (!context) {
        throw new Error('useATSContext must be used within an ATSProvider');
    }
    return context;
};

/**
 * Hook to get recommendations for a specific editor section
 * @param sectionType - The section type (e.g., 'summary', 'experience', 'skills')
 * @param index - Optional index for array sections (e.g., experience[0])
 */
export const useSectionRecommendations = (
    sectionType: string,
    index?: number
): {
    recommendations: Recommendation[];
    missingKeywords: MatchResultModel[];
    coverage: { covered: number; total: number; percentage: number };
    hasJD: boolean;
} => {
    const context = useContext(ATSContext);

    // Return empty state if no context (not wrapped in provider)
    if (!context) {
        return {
            recommendations: [],
            missingKeywords: [],
            coverage: { covered: 0, total: 0, percentage: 0 },
            hasJD: false,
        };
    }

    const { jobDescription, getRecommendationsForLocation, getKeywordsByStatus, getCoverageBySection } = context;

    // Build location path
    const location = index !== undefined ? `${sectionType}:${index}` : sectionType;

    // Get recommendations for this location
    const recommendations = getRecommendationsForLocation(location);

    // Get missing keywords (relevant across sections)
    const missingKeywords = getKeywordsByStatus('missing');

    // Get coverage for this section
    const coverage = getCoverageBySection(sectionType);

    return {
        recommendations,
        missingKeywords,
        coverage,
        hasJD: Boolean(jobDescription && jobDescription.length > 0),
    };
};
