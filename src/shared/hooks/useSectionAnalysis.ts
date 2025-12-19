import { useState, useEffect, useCallback } from 'react';
import { resumeAI } from '@/shared/api/resumeAI';
import { debounce } from 'lodash';

export interface SectionAnalysis {
    score: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    lastUpdated: number;
}

export const useSectionAnalysis = (sectionId: string, content: any) => {
    const [analysis, setAnalysis] = useState<SectionAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyze = useCallback(
        async (data: any) => {
            if (!data || (Array.isArray(data) && data.length === 0) || (typeof data === 'string' && !data.trim())) {
                return;
            }

            setIsAnalyzing(true);
            setError(null);

            try {
                const result = await resumeAI.analyzeSection(sectionId, data);
                setAnalysis({
                    ...result,
                    lastUpdated: Date.now(),
                });
            } catch (err) {
                console.error('Section analysis failed:', err);
                setError('Failed to analyze section');
            } finally {
                setIsAnalyzing(false);
            }
        },
        [sectionId]
    );

    const debouncedAnalyze = useCallback(
        debounce((data: any) => analyze(data), 1000),
        [analyze]
    );

    useEffect(() => {
        debouncedAnalyze(content);
        return () => debouncedAnalyze.cancel();
    }, [content, debouncedAnalyze]);

    return {
        analysis,
        isAnalyzing,
        error,
        triggerAnalysis: () => analyze(content)
    };
};
