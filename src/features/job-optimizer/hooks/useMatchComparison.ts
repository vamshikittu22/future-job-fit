import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

import { calculateBreakdown, calculateWeightedKeywords } from '@/features/match-intelligence/utils/keywordWeighting';
import { calculateSemanticSimilarity as calculateSemanticSimilarityV2 } from '@/features/match-intelligence/utils/similarityCalculator';

export interface MatchBreakdown {
  keywords: number;
  semantic: number;
  format: number;
  length: number;
}

export interface KeywordGap {
  keyword: string;
  importance: 'required' | 'preferred';
  suggestions: string[];
}

export interface Recommendation {
  type: 'add_keyword' | 'improve_section' | 'adjust_format';
  priority: 'high' | 'medium' | 'low';
  action: string;
}

interface MatchComparisonResult {
  atsScore: number;
  matchBreakdown: MatchBreakdown;
  keywordGaps: KeywordGap[];
  semanticSimilarity: number;
  recommendations: Recommendation[];
  topMatchingPhrases: string[];
  isAnalyzing: boolean;
}

interface WeightedScoringModule {
  calculateWeightedScore?: (resume: string, jd: string) => number;
}

interface SemanticSimilarityModule {
  semanticSimilarity?: (resume: string, jd: string) => number;
  calculateSemanticSimilarity?: (resume: string, jd: string) => { overall?: number } | number;
}

const PHASE2_MODULES = import.meta.glob('/src/shared/lib/match/*.ts');

const EMPTY_BREAKDOWN: MatchBreakdown = {
  keywords: 0,
  semantic: 0,
  format: 0,
  length: 0,
};

const REQUIRED_HINTS = ['required', 'must', 'minimum', 'need to', 'required qualifications'];
const PREFERRED_HINTS = ['preferred', 'nice to have', 'bonus', 'plus', 'good to have'];
const TECH_TERMS = [
  'typescript',
  'javascript',
  'react',
  'node.js',
  'python',
  'java',
  'aws',
  'docker',
  'kubernetes',
  'sql',
  'graphql',
  'leadership',
  'communication',
  'microservices',
  'agile',
];

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function getKeywordWeight(line: string): number {
  const normalizedLine = line.toLowerCase();
  if (REQUIRED_HINTS.some((hint) => normalizedLine.includes(hint))) {
    return 0.85;
  }
  if (PREFERRED_HINTS.some((hint) => normalizedLine.includes(hint))) {
    return 0.55;
  }
  return 0.45;
}

function extractCandidateKeywords(jobDescription: string): Array<{ keyword: string; weight: number; line: string }> {
  const lines = jobDescription
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const candidates: Array<{ keyword: string; weight: number; line: string }> = [];

  for (const line of lines) {
    const weight = getKeywordWeight(line);

    for (const term of TECH_TERMS) {
      if (line.toLowerCase().includes(term)) {
        candidates.push({
          keyword: term,
          weight,
          line,
        });
      }
    }

    const nounPhrases = line.match(/\b[a-z][a-z0-9+#./-]{2,}(?:\s+[a-z][a-z0-9+#./-]{2,}){0,2}\b/gi) ?? [];
    for (const phrase of nounPhrases.slice(0, 2)) {
      const cleanedPhrase = phrase.toLowerCase();
      if (cleanedPhrase.length < 4) {
        continue;
      }
      candidates.push({ keyword: cleanedPhrase, weight, line });
    }
  }

  const deduped = new Map<string, { keyword: string; weight: number; line: string }>();
  for (const candidate of candidates) {
    if (!deduped.has(candidate.keyword) || deduped.get(candidate.keyword)!.weight < candidate.weight) {
      deduped.set(candidate.keyword, candidate);
    }
  }

  return [...deduped.values()].slice(0, 40);
}

function getTopMatchingPhrases(resumeText: string, jobDescription: string): string[] {
  const normalizedResume = normalize(resumeText);
  const phrases = extractCandidateKeywords(jobDescription)
    .map((entry) => entry.keyword)
    .filter((keyword) => normalizedResume.includes(keyword));

  return [...new Set(phrases)].slice(0, 5);
}

function calculateSemanticSimilarityFallback(resume: string, jd: string): number {
  if (!resume.trim() || !jd.trim()) {
    return 0;
  }

  const similarityResult = calculateSemanticSimilarityV2(resume, jd);
  return clampScore(similarityResult.overall);
}

function calculateKeywordScore(resume: string, jd: string): number {
  const keywordInputs = extractCandidateKeywords(jd).map((entry) => ({
    keyword: entry.keyword,
    weight: entry.weight,
    jdSection: 'description',
  }));
  if (!keywordInputs.length) {
    return 0;
  }

  const weighted = calculateWeightedKeywords(keywordInputs, normalize(resume));
  const breakdown = calculateBreakdown(weighted);
  return clampScore(breakdown.overall.percentage);
}

function calculateFormatQuality(resume: string): number {
  const bulletCount = (resume.match(/[•\-*]\s/g) ?? []).length;
  const sectionCount = (resume.match(/\b(summary|experience|education|skills|projects)\b/gi) ?? []).length;
  const score = 45 + Math.min(bulletCount * 2, 30) + Math.min(sectionCount * 5, 25);
  return clampScore(score);
}

function calculateLengthAppropriateness(resume: string, jd: string): number {
  const resumeWords = resume.trim().split(/\s+/).filter(Boolean).length;
  const jdWords = jd.trim().split(/\s+/).filter(Boolean).length;
  if (!resumeWords || !jdWords) {
    return 0;
  }

  const ratio = resumeWords / jdWords;
  if (ratio >= 0.45 && ratio <= 1.2) {
    return 100;
  }
  if (ratio >= 0.3 && ratio <= 1.5) {
    return 75;
  }
  if (ratio >= 0.2 && ratio <= 2) {
    return 55;
  }
  return 35;
}

function findKeywordGaps(resume: string, jd: string): KeywordGap[] {
  const normalizedResume = normalize(resume);

  return extractCandidateKeywords(jd)
    .filter((entry) => !normalizedResume.includes(entry.keyword))
    .slice(0, 16)
    .map((entry) => ({
      keyword: entry.keyword,
      importance: entry.weight >= 0.75 ? 'required' : 'preferred',
      suggestions: [`Add '${entry.keyword}' to Skills section`, `Reference '${entry.keyword}' in a recent experience bullet`],
    }));
}

function generateRecommendations(gaps: KeywordGap[], atsScore: number): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const gap of gaps.slice(0, 5)) {
    recommendations.push({
      type: 'add_keyword',
      priority: gap.importance === 'required' ? 'high' : 'medium',
      action: `Add '${gap.keyword}' to Skills section and back it with one quantified experience bullet.`,
    });
  }

  if (atsScore < 60) {
    recommendations.push({
      type: 'improve_section',
      priority: 'high',
      action: 'Rewrite summary to mirror the role scope and top responsibilities from the JD.',
    });
    recommendations.push({
      type: 'adjust_format',
      priority: 'medium',
      action: 'Use concise bullet points with action verbs and metrics to improve ATS parsing clarity.',
    });
  }

  if (atsScore >= 60 && atsScore < 80) {
    recommendations.push({
      type: 'improve_section',
      priority: 'low',
      action: 'Tune wording for stronger semantic alignment in summary and latest experience.',
    });
  }

  return recommendations;
}

async function loadPhase2Modules() {
  const weightedLoader = PHASE2_MODULES['/src/shared/lib/match/weightedScoring.ts'];
  const semanticLoader = PHASE2_MODULES['/src/shared/lib/match/semanticSimilarity.ts'];

  const [weightedModule, semanticModule] = await Promise.all([
    weightedLoader ? weightedLoader() : Promise.resolve(null),
    semanticLoader ? semanticLoader() : Promise.resolve(null),
  ]);

  return {
    weighted: weightedModule as WeightedScoringModule | null,
    semantic: semanticModule as SemanticSimilarityModule | null,
  };
}

export function useMatchComparison(resumeText: string, jobDescription: string): MatchComparisonResult {
  const [debouncedInput, setDebouncedInput] = useState({ resumeText, jobDescription });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [phase2Modules, setPhase2Modules] = useState<{
    weighted: WeightedScoringModule | null;
    semantic: SemanticSimilarityModule | null;
  }>({ weighted: null, semantic: null });

  const debouncedSync = useMemo(
    () =>
      debounce((nextResume: string, nextJD: string) => {
        setDebouncedInput({ resumeText: nextResume, jobDescription: nextJD });
        setIsAnalyzing(false);
      }, 500),
    []
  );

  useEffect(() => {
    let isMounted = true;

    loadPhase2Modules()
      .then((modules) => {
        if (isMounted) {
          setPhase2Modules(modules);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPhase2Modules({ weighted: null, semantic: null });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (resumeText === debouncedInput.resumeText && jobDescription === debouncedInput.jobDescription) {
      return;
    }

    setIsAnalyzing(true);
    debouncedSync(resumeText, jobDescription);
  }, [resumeText, jobDescription, debouncedInput, debouncedSync]);

  useEffect(() => {
    return () => {
      debouncedSync.cancel();
    };
  }, [debouncedSync]);

  return useMemo(() => {
    const resume = debouncedInput.resumeText.trim();
    const jd = debouncedInput.jobDescription.trim();

    if (!resume || !jd) {
      return {
        atsScore: 0,
        matchBreakdown: EMPTY_BREAKDOWN,
        keywordGaps: [],
        semanticSimilarity: 0,
        recommendations: [],
        topMatchingPhrases: [],
        isAnalyzing,
      };
    }

    const keywordScore = phase2Modules.weighted?.calculateWeightedScore
      ? clampScore(phase2Modules.weighted.calculateWeightedScore(resume, jd))
      : calculateKeywordScore(resume, jd);

    const semanticScore =
      phase2Modules.semantic?.semanticSimilarity
        ? clampScore(phase2Modules.semantic.semanticSimilarity(resume, jd))
        : typeof phase2Modules.semantic?.calculateSemanticSimilarity === 'function'
          ? clampScore(
              typeof phase2Modules.semantic.calculateSemanticSimilarity(resume, jd) === 'number'
                ? (phase2Modules.semantic.calculateSemanticSimilarity(resume, jd) as number)
                : (phase2Modules.semantic.calculateSemanticSimilarity(resume, jd) as { overall?: number }).overall ?? 0
            )
          : calculateSemanticSimilarityFallback(resume, jd);

    const formatScore = calculateFormatQuality(resume);
    const lengthScore = calculateLengthAppropriateness(resume, jd);

    const atsScore = clampScore(
      keywordScore * 0.5 + semanticScore * 0.25 + formatScore * 0.15 + lengthScore * 0.1
    );

    const keywordGaps = findKeywordGaps(resume, jd);
    const recommendations = generateRecommendations(keywordGaps, atsScore);

    return {
      atsScore,
      matchBreakdown: {
        keywords: keywordScore,
        semantic: semanticScore,
        format: formatScore,
        length: lengthScore,
      },
      keywordGaps,
      semanticSimilarity: semanticScore,
      recommendations,
      topMatchingPhrases: getTopMatchingPhrases(resume, jd),
      isAnalyzing,
    };
  }, [debouncedInput, isAnalyzing, phase2Modules]);
}
