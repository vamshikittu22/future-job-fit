import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { ATS_KEYWORDS } from '@/shared/lib/atsKeywords';

const STOP_WORDS = new Set([
  'a',
  'about',
  'all',
  'an',
  'and',
  'any',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'have',
  'if',
  'in',
  'into',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'our',
  'that',
  'the',
  'their',
  'this',
  'to',
  'we',
  'will',
  'with',
  'you',
  'your',
]);

const TECH_TERMS = [
  'typescript',
  'javascript',
  'react',
  'node.js',
  'node',
  'next.js',
  'nextjs',
  'vue',
  'angular',
  'python',
  'java',
  'c#',
  'c++',
  'go',
  'rust',
  'sql',
  'postgresql',
  'mysql',
  'mongodb',
  'redis',
  'aws',
  'azure',
  'gcp',
  'docker',
  'kubernetes',
  'terraform',
  'jenkins',
  'github actions',
  'ci/cd',
  'rest',
  'graphql',
  'microservices',
  'machine learning',
  'data science',
  'agile',
  'scrum',
  'figma',
  'tableau',
  'power bi',
  'leadership',
  'communication',
  'project management',
  'stakeholder management',
];

const CANONICAL_TERMS: Record<string, string> = {
  'node.js': 'Node.js',
  node: 'Node.js',
  'next.js': 'Next.js',
  nextjs: 'Next.js',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  csharp: 'C#',
  'c#': 'C#',
  'c++': 'C++',
  aws: 'AWS',
  gcp: 'GCP',
  sql: 'SQL',
  graphql: 'GraphQL',
  ci: 'CI',
  cd: 'CD',
};

export interface OverviewData {
  roleTitle: string;
  seniority: string;
  company: string | null;
  location: string | null;
}

export interface RequirementsData {
  required: string[];
  preferred: string[];
}

export interface KeywordFrequency {
  keyword: string;
  frequency: number;
}

export interface KeywordsData {
  keywords: KeywordFrequency[];
}

export interface InsightsData {
  roleType: 'IC' | 'Manager' | 'Mixed' | 'Unknown';
  techStack: string[];
  experienceYears: string[];
}

export interface JobAnalyzerResult {
  overview: OverviewData;
  requirements: RequirementsData;
  keywords: KeywordsData;
  insights: InsightsData;
  isAnalyzing: boolean;
}

function emptyOverview(): OverviewData {
  return {
    roleTitle: 'Unknown role',
    seniority: 'Unspecified',
    company: null,
    location: null,
  };
}

function extractOverview(text: string): OverviewData {
  const normalized = text.trim();
  if (!normalized) {
    return emptyOverview();
  }

  const lines = normalized
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const titledRole = normalized.match(/(?:job\s*title|position|role)\s*:\s*([^\n]+)/i)?.[1]?.trim();
  const firstLineRole = lines[0] ?? 'Unknown role';
  const roleTitle = titledRole || firstLineRole;

  const lower = normalized.toLowerCase();
  const seniority = lower.includes('principal')
    ? 'Principal'
    : lower.includes('staff')
      ? 'Staff'
      : lower.includes('lead')
        ? 'Lead'
        : lower.includes('senior')
          ? 'Senior'
          : lower.includes('junior')
            ? 'Junior'
            : lower.includes('intern')
              ? 'Intern'
              : 'Mid';

  const company =
    normalized.match(/company\s*:\s*([^\n]+)/i)?.[1]?.trim() ||
    normalized.match(/(?:at|with)\s+([A-Z][A-Za-z0-9&.,'\-\s]{1,40})/m)?.[1]?.trim() ||
    null;

  const location =
    normalized.match(/location\s*:\s*([^\n]+)/i)?.[1]?.trim() ||
    normalized.match(/\b(remote|hybrid|on[-\s]?site|onsite)\b/i)?.[1] ||
    null;

  return {
    roleTitle,
    seniority,
    company,
    location,
  };
}

// Build a plain-string set for fast membership checks
const ATS_KW_SET = new Set(ATS_KEYWORDS.map(k => k.toLowerCase()));

/**
 * Extracts individual ATS keywords found in a requirement line.
 * Returns an array of canonical keyword strings (original casing).
 */
function extractKeywordsFromLine(line: string): string[] {
  const lineLower = line.toLowerCase();
  const found: string[] = [];
  for (const kw of ATS_KEYWORDS) {
    const kwLower = kw.toLowerCase();
    // Simple substring check with basic boundary guard
    const idx = lineLower.indexOf(kwLower);
    if (idx === -1) continue;
    const before = lineLower[idx - 1];
    const after = lineLower[idx + kwLower.length];
    const boundaryBefore = !before || /[^a-z0-9]/i.test(before);
    const boundaryAfter = !after || /[^a-z0-9]/i.test(after);
    if (boundaryBefore && boundaryAfter) {
      found.push(kw);
    }
  }
  // Suppress unused set (kept for future use)
  void ATS_KW_SET;
  return found;
}

function extractRequirements(text: string): RequirementsData {
  const lines = text.split(/\r?\n/);
  const required = new Set<string>();
  const preferred = new Set<string>();

  // Section keywords – expanded to cover real JD formats
  const REQUIRED_SECTION = /^(required\s+qualifications?|requirements?|must[\s-]have|minimum\s+qualifications?|basic\s+qualifications?|what\s+you[\s'']+need|what\s+we[\s'']+need|you[\s'']+will\s+(need|have|bring)|your\s+qualifications?|qualifications?\s+required)/i;
  const PREFERRED_SECTION = /^(preferred\s+qualifications?|nice[\s-]to[\s-]have|bonus|preferred|good[\s-]to[\s-]have|plus|ideally|what\s+would\s+be\s+(great|a\s+plus)|you[\s'']+might\s+also)/i;
  const RESET_SECTION = /^(about\s+(us|the\s+(company|role|team|position))|responsibilities|what\s+you[\s'']+will|your\s+role|job\s+summary|overview|benefits|compensation|perks|job\s+description|the\s+role)/i;

  // Inline signal regexes
  const INLINE_REQUIRED = /\b(required|must(\s+have)?|mandatory|minimum|necessary|non[\s-]negotiable)\b/i;
  const INLINE_PREFERRED = /\b(preferred?|nice[\s-]to[\s-]have|bonus|a\s+plus|ideally|advantageous|desirable)\b/i;
  const IS_BULLET = /^[\u2022\-\*\u2013•]\s+|^\d+[.)]\s+/;

  let activeSection: 'required' | 'preferred' | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Detect section heading switches
    if (REQUIRED_SECTION.test(line)) { activeSection = 'required'; continue; }
    if (PREFERRED_SECTION.test(line)) { activeSection = 'preferred'; continue; }
    if (RESET_SECTION.test(line)) { activeSection = null; continue; }

    // Extract individual ATS keywords from this line (not the full phrase)
    const lineKeywords = extractKeywordsFromLine(line);
    if (!lineKeywords.length) continue;

    // Determine category for this line
    const lineIsRequired = activeSection === 'required' || INLINE_REQUIRED.test(line);
    const lineIsPreferred = activeSection === 'preferred' || INLINE_PREFERRED.test(line);
    const isBullet = IS_BULLET.test(rawLine);

    for (const kw of lineKeywords) {
      if (lineIsRequired && !preferred.has(kw)) {
        required.add(kw);
      } else if (lineIsPreferred && !required.has(kw)) {
        preferred.add(kw);
      } else if (!lineIsRequired && !lineIsPreferred && isBullet) {
        // Uncategorised bullet — treat as preferred
        preferred.add(kw);
      }
    }
  }

  // If nothing required (single-section JD), promote first half of preferred
  if (required.size === 0 && preferred.size > 0) {
    const arr = [...preferred];
    const splitAt = Math.ceil(arr.length / 2);
    arr.slice(0, splitAt).forEach(r => { required.add(r); preferred.delete(r); });
  }

  return {
    required: [...required],
    preferred: [...preferred],
  };
}


function toLabel(token: string): string {
  const canonical = CANONICAL_TERMS[token.toLowerCase()];
  if (canonical) {
    return canonical;
  }

  return token
    .split(' ')
    .map((part) => (part ? `${part[0].toUpperCase()}${part.slice(1)}` : part))
    .join(' ');
}

function extractKeywords(text: string): KeywordsData {
  const lower = text.toLowerCase();
  const counts = new Map<string, number>();

  for (const term of TECH_TERMS) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matcher = new RegExp(`\\b${escaped}\\b`, 'g');
    const matches = lower.match(matcher);
    if (!matches?.length) {
      continue;
    }

    const canonical = toLabel(term);
    counts.set(canonical, (counts.get(canonical) ?? 0) + matches.length);
  }

  const tokens = lower.match(/[a-z][a-z0-9+#./-]{1,}/g) ?? [];
  for (const token of tokens) {
    const normalized = token.replace(/[^a-z0-9+#./-]/g, '').trim();
    if (!normalized || STOP_WORDS.has(normalized) || normalized.length <= 2) {
      continue;
    }

    const label = toLabel(normalized);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  const keywords = [...counts.entries()]
    .map(([keyword, frequency]) => ({ keyword, frequency }))
    .sort((a, b) => {
      if (b.frequency === a.frequency) {
        return a.keyword.localeCompare(b.keyword);
      }
      return b.frequency - a.frequency;
    });

  return { keywords };
}

function extractInsights(text: string): InsightsData {
  const lower = text.toLowerCase();

  const managerSignals = ['manager', 'leadership', 'mentor', 'direct reports', 'hiring', 'team lead'];
  const icSignals = ['individual contributor', 'hands-on', 'implement', 'develop', 'build'];

  const managerScore = managerSignals.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);
  const icScore = icSignals.reduce((sum, term) => sum + (lower.includes(term) ? 1 : 0), 0);

  const roleType: InsightsData['roleType'] =
    managerScore > 0 && icScore > 0
      ? 'Mixed'
      : managerScore > 0
        ? 'Manager'
        : icScore > 0
          ? 'IC'
          : 'Unknown';

  const techStack = TECH_TERMS.filter((term) => lower.includes(term.toLowerCase())).map((term) => toLabel(term));
  const dedupedStack = [...new Set(techStack)];

  const yearsPattern = /(\d+\+?(?:\s*-\s*\d+\+?)?)\s+years?/gi;
  const years = new Set<string>();
  let match = yearsPattern.exec(text);

  while (match) {
    years.add(`${match[1]} years`);
    match = yearsPattern.exec(text);
  }

  return {
    roleType,
    techStack: dedupedStack,
    experienceYears: [...years],
  };
}

export function useJobAnalyzer(jobDescription: string): JobAnalyzerResult {
  const [debouncedDescription, setDebouncedDescription] = useState(jobDescription);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const debouncedSync = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedDescription(value);
        setIsAnalyzing(false);
      }, 500),
    []
  );

  useEffect(() => {
    if (jobDescription === debouncedDescription) {
      return;
    }

    setIsAnalyzing(true);
    debouncedSync(jobDescription);
  }, [jobDescription, debouncedDescription, debouncedSync]);

  useEffect(() => {
    return () => {
      debouncedSync.cancel();
    };
  }, [debouncedSync]);

  const analysis = useMemo(() => {
    const text = debouncedDescription.trim();
    if (!text) {
      return {
        overview: emptyOverview(),
        requirements: {
          required: [],
          preferred: [],
        },
        keywords: {
          keywords: [],
        },
        insights: {
          roleType: 'Unknown' as const,
          techStack: [],
          experienceYears: [],
        },
      };
    }

    return {
      overview: extractOverview(text),
      requirements: extractRequirements(text),
      keywords: extractKeywords(text),
      insights: extractInsights(text),
    };
  }, [debouncedDescription]);

  return {
    ...analysis,
    isAnalyzing,
  };
}

export {
  extractInsights,
  extractKeywords,
  extractOverview,
  extractRequirements,
};
