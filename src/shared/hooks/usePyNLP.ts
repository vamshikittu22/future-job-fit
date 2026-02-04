import { useState, useEffect, useCallback, useRef } from 'react';
import { loadPyodide, type PyodideInterface } from 'pyodide';
import type {
    JobDescriptionModel,
    ATSEvaluationResponse
} from '@/shared/types/ats';

export interface PyNLPResponse {
    name: string | null;
    email: string | null;
    phone: string | null;
    linkedin: string | null;
    github: string | null;
    website: string | null;
    skills: string[];
    sections: Record<string, any>;
}

/**
 * Legacy ATS response (v1 - simpler format)
 */
export interface ATSResponse {
    score: number;
    matchRatio: number;
    matchingKeywords: string[];
    missing: string[];
    suggestions: string[];
    breakdown: {
        keywordMatch: number;
        formatScore: number;
        readability: number;
        actionVerbs: number;
    };
}

/**
 * Canonical resume representation with location tokens
 */
export interface ResumeCanonicalModel {
    sections: Record<string, string>;
    tokens: Array<{
        text: string;
        location: string;
        normalized: string;
    }>;
}

let pyodideInstance: PyodideInterface | null = null;
let initializationPromise: Promise<PyodideInterface> | null = null;

export const usePyNLP = () => {
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [error, setError] = useState<string | null>(null);

    const init = useCallback(async () => {
        if (pyodideInstance) {
            setStatus('ready');
            return pyodideInstance;
        }

        if (initializationPromise) {
            const py = await initializationPromise;
            setStatus('ready');
            return py;
        }

        initializationPromise = (async () => {
            try {
                const py = await loadPyodide({
                    // v0.26.1 is the latest stable that works well in most environments
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/",
                });

                // Fetch our core script
                const response = await fetch('/py-nlp/nlp_core.py');
                if (!response.ok) throw new Error('Failed to load nlp_core.py');
                const code = await response.text();

                // Setup the virtual filesystem
                py.FS.writeFile('nlp_core.py', code);

                // Warm up and verify imports - include new ATS v2 functions
                await py.runPythonAsync(`
          import json
          import sys
          from nlp_core import (
              parse_resume, score_ats, optimize_resume, rewrite_bullet,
              parse_jd, parse_resume_canonical, match_keywords, 
              calculate_ats_score, generate_recommendations, evaluate_ats
          )
        `);

                pyodideInstance = py;
                setStatus('ready');
                return py;
            } catch (err: any) {
                console.error('Pyodide Initialization Failed:', err);
                setError(err.message);
                setStatus('error');
                initializationPromise = null;
                throw err;
            }
        })();

        return initializationPromise;
    }, []);

    useEffect(() => {
        init();
    }, [init]);

    // --- Legacy v1 Methods ---

    const parseResume = useCallback(async (text: string): Promise<PyNLPResponse> => {
        const py = await init();
        py.globals.set("raw_text", text);
        const jsonStr = await py.runPythonAsync(`json.dumps(parse_resume(raw_text))`);
        return JSON.parse(jsonStr);
    }, [init]);

    const scoreATS = useCallback(async (resumeText: string, jobDesc: string): Promise<ATSResponse> => {
        const py = await init();
        py.globals.set("res_text", resumeText);
        py.globals.set("jd_text", jobDesc);
        const jsonStr = await py.runPythonAsync(`json.dumps(score_ats(res_text, jd_text))`);
        return JSON.parse(jsonStr);
    }, [init]);

    const optimizeResume = useCallback(async (resumeText: string, jobDesc: string): Promise<string> => {
        const py = await init();
        py.globals.set("res_text", resumeText);
        py.globals.set("jd_text", jobDesc);
        const result = await py.runPythonAsync(`optimize_resume(res_text, jd_text)`);
        return result;
    }, [init]);

    const rewriteBullet = useCallback(async (bullet: string, keyword: string): Promise<string> => {
        const py = await init();
        py.globals.set("bullet_text", bullet);
        py.globals.set("keyword_text", keyword);
        const result = await py.runPythonAsync(`rewrite_bullet(bullet_text, keyword_text)`);
        return result;
    }, [init]);

    // --- New ATS v2 Methods ---

    /**
     * Parse a job description into a structured model with categorized keywords.
     * This is deterministic (no LLM involved).
     */
    const parseJD = useCallback(async (rawText: string): Promise<JobDescriptionModel> => {
        const py = await init();
        py.globals.set("jd_raw", rawText);
        const jsonStr = await py.runPythonAsync(`json.dumps(parse_jd(jd_raw))`);
        return JSON.parse(jsonStr);
    }, [init]);

    /**
     * Parse a resume into a canonical format with tokenized content and locations.
     * This is deterministic (no LLM involved).
     */
    const parseResumeCanonical = useCallback(async (text: string): Promise<ResumeCanonicalModel> => {
        const py = await init();
        py.globals.set("resume_raw", text);
        const jsonStr = await py.runPythonAsync(`json.dumps(parse_resume_canonical(resume_raw))`);
        return JSON.parse(jsonStr);
    }, [init]);

    /**
     * Full ATS evaluation: parses JD, parses resume, matches keywords, calculates score,
     * and generates recommendations. This is the main entry point for ATS v2.
     * 
     * @param resumeText - The resume text content
     * @param jobDescriptionText - The job description text content
     * @returns Complete ATS evaluation response with breakdown and recommendations
     */
    const evaluateATS = useCallback(async (
        resumeText: string,
        jobDescriptionText: string
    ): Promise<ATSEvaluationResponse> => {
        const py = await init();
        py.globals.set("resume_text", resumeText);
        py.globals.set("jd_text", jobDescriptionText);
        const jsonStr = await py.runPythonAsync(`json.dumps(evaluate_ats(resume_text, jd_text))`);
        return JSON.parse(jsonStr);
    }, [init]);

    return {
        // Legacy v1
        parseResume,
        scoreATS,
        optimizeResume,
        rewriteBullet,
        // New ATS v2
        parseJD,
        parseResumeCanonical,
        evaluateATS,
        // Status
        status,
        error,
        isReady: status === 'ready',
        isLoading: status === 'loading'
    };
};
