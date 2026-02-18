import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';

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

function cleanRequirementLine(line: string): string {
  return line
    .replace(/^[-*•\d.)\s]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractRequirements(text: string): RequirementsData {
  const lines = text.split(/\r?\n/);
  const required = new Set<string>();
  const preferred = new Set<string>();
  let activeSection: 'required' | 'preferred' | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      continue;
    }

    const lower = line.toLowerCase();
    if (
      /^(required|requirements|must\s+have|required\s+qualifications|minimum\s+qualifications)\b/.test(lower)
    ) {
      activeSection = 'required';
      continue;
    }

    if (/^(preferred|nice\s+to\s+have|bonus|preferred\s+qualifications)\b/.test(lower)) {
      activeSection = 'preferred';
      continue;
    }

    const cleaned = cleanRequirementLine(line);
    if (cleaned.length < 3) {
      continue;
    }

    if (activeSection === 'required' || /\b(must|required|minimum)\b/.test(lower)) {
      required.add(cleaned);
      continue;
    }

    if (activeSection === 'preferred' || /\b(preferred|nice to have|bonus|plus)\b/.test(lower)) {
      preferred.add(cleaned);
    }
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
