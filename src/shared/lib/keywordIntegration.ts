/**
 * Keyword Integration Utilities
 * Provides contextual suggestions for where keywords should be integrated
 */

export interface KeywordIntegrationContext {
  keyword: string;
  category: 'skill' | 'tool' | 'concept' | 'soft_skill';
  suggestedSections: string[];
  integrationPhrases: string[];
  exampleSentence: string;
}

export interface SectionContext {
  sectionType: 'summary' | 'experience' | 'skills' | 'projects' | 'education';
  currentText: string;
  existingKeywords: string[];
  suggestedInsertions: InsertionPoint[];
}

export interface InsertionPoint {
  location: number; // Character position or line index
  context: string; // Surrounding text
  suggestedText: string; // How to integrate keyword
  reason: string; // Why this is a good spot
}

/**
 * Get integration context for a keyword based on its category
 */
export function getKeywordIntegrationContext(
  keyword: string,
  category: KeywordIntegrationContext['category'] = 'skill'
): KeywordIntegrationContext {
  const contexts: Record<string, KeywordIntegrationContext> = {
    skill: {
      keyword,
      category: 'skill',
      suggestedSections: ['experience', 'summary', 'skills'],
      integrationPhrases: [
        `leveraged ${keyword} to`,
        `utilizing ${keyword}`,
        `proficient in ${keyword}`,
        `applied ${keyword} to optimize`,
        `implemented ${keyword} solutions`
      ],
      exampleSentence: `Leveraged ${keyword} to streamline deployment processes, reducing release time by 40%.`
    },
    tool: {
      keyword,
      category: 'tool',
      suggestedSections: ['experience', 'skills'],
      integrationPhrases: [
        `using ${keyword}`,
        `via ${keyword}`,
        `implemented ${keyword}`,
        `configured ${keyword} to`,
        `administered ${keyword} for`
      ],
      exampleSentence: `Implemented ${keyword} to automate infrastructure provisioning, cutting deployment time by 50%.`
    },
    concept: {
      keyword,
      category: 'concept',
      suggestedSections: ['summary', 'experience'],
      integrationPhrases: [
        `specialized in ${keyword}`,
        `expertise in ${keyword}`,
        `focused on ${keyword}`,
        `driving ${keyword}`,
        `championed ${keyword}`
      ],
      exampleSentence: `Championed ${keyword} adoption across 3 engineering teams, establishing best practices.`
    },
    soft_skill: {
      keyword,
      category: 'soft_skill',
      suggestedSections: ['summary', 'experience'],
      integrationPhrases: [
        `demonstrated ${keyword}`,
        `strong ${keyword}`,
        `excellent ${keyword}`,
        `proven ${keyword}`,
        `effective ${keyword}`
      ],
      exampleSentence: `Demonstrated strong ${keyword} by aligning cross-functional teams on project priorities.`
    }
  };

  return contexts[category] || contexts.skill;
}

/**
 * Detect the category of a keyword based on common patterns
 */
export function detectKeywordCategory(keyword: string): KeywordIntegrationContext['category'] {
  const lower = keyword.toLowerCase();

  // Tool patterns
  const toolPatterns = ['docker', 'kubernetes', 'git', 'jenkins', 'jira', 'aws', 'azure', 'terraform', 'ansible'];
  if (toolPatterns.some(t => lower.includes(t))) return 'tool';

  // Concept patterns
  const conceptPatterns = ['agile', 'scrum', 'strategy', 'architecture', 'methodology', 'framework'];
  if (conceptPatterns.some(c => lower.includes(c))) return 'concept';

  // Soft skill patterns
  const softPatterns = ['leadership', 'communication', 'collaboration', 'mentoring', 'management'];
  if (softPatterns.some(s => lower.includes(s))) return 'soft_skill';

  // Default to skill
  return 'skill';
}

/**
 * Find potential insertion points in text for a keyword
 */
export function findInsertionPoints(
  text: string,
  keyword: string
): InsertionPoint[] {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const points: InsertionPoint[] = [];

  sentences.forEach((sentence, index) => {
    const trimmed = sentence.trim();

    // Skip if keyword already present
    if (trimmed.toLowerCase().includes(keyword.toLowerCase())) return;

    // Look for patterns that suggest good insertion points
    const patterns = [
      { regex: /\b(led|managed|spearheaded|developed|built|created|implemented|designed)\b/gi, reason: 'After action verb' },
      { regex: /\b(team|group|department|organization)\b/gi, reason: 'Near team references' },
      { regex: /\b(system|platform|application|product)\b/gi, reason: 'Near technology references' },
      { regex: /\d+%|\$\d+|by \d+/, reason: 'Near metrics (add impact)' }
    ];

    patterns.forEach(pattern => {
      if (pattern.regex.test(trimmed)) {
        points.push({
          location: index,
          context: trimmed.substring(0, 60) + (trimmed.length > 60 ? '...' : ''),
          suggestedText: `${trimmed} leveraging ${keyword}`.replace(/^\s+/, ''),
          reason: pattern.reason
        });
      }
    });
  });

  return points.slice(0, 3); // Return top 3 suggestions
}

/**
 * Highlight keywords in text to show integration
 */
export function highlightIntegratedKeywords(
  text: string,
  keywords: string[]
): { text: string; highlights: { word: string; index: number }[] } {
  const highlights: { word: string; index: number }[] = [];
  let resultText = text;

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = [...text.matchAll(regex)];

    matches.forEach(match => {
      highlights.push({
        word: keyword,
        index: match.index || 0
      });
    });
  });

  return { text: resultText, highlights };
}

/**
 * Get integration mode options for UI
 */
export type IntegrationMode = 'smart' | 'append' | 'suggest';

export interface IntegrationModeOption {
  id: IntegrationMode;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  recommended: boolean;
}

export const INTEGRATION_MODES: IntegrationModeOption[] = [
  {
    id: 'smart',
    label: 'Smart Rewrite',
    description: 'AI rewrites content to naturally weave in keywords',
    icon: 'Sparkles',
    recommended: true
  },
  {
    id: 'suggest',
    label: 'Suggest Placement',
    description: 'Show where keywords can fit in existing text',
    icon: 'Target',
    recommended: false
  },
  {
    id: 'append',
    label: 'Append Keywords',
    description: 'Add keywords to the end (not recommended)',
    icon: 'Plus',
    recommended: false
  }
];

/**
 * Score the quality of keyword integration (0-100)
 */
export interface IntegrationScore {
  score: number;
  category: 'excellent' | 'good' | 'fair' | 'poor';
  found: string[];
  missing: string[];
  issues: string[];
}

export function scoreKeywordIntegration(
  text: string,
  keywords: string[]
): IntegrationScore {
  const found: string[] = [];
  const missing: string[] = [];
  const issues: string[] = [];
  let score = 0;

  const textLower = text.toLowerCase();
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 10);

  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();

    if (!textLower.includes(keywordLower)) {
      missing.push(keyword);
      return;
    }

    found.push(keyword);

    // Find sentences containing keyword
    const sentencesWithKeyword = sentences.filter(s =>
      s.toLowerCase().includes(keywordLower)
    );

    if (sentencesWithKeyword.length === 0) {
      issues.push(`"${keyword}" appears but not in a complete sentence`);
      score += 20; // Partial credit
      return;
    }

    // Check integration quality in each sentence
    sentencesWithKeyword.forEach(sentence => {
      const words = sentence.split(/\s+/);
      const keywordIndex = words.findIndex(w =>
        w.toLowerCase().replace(/[^\w]/g, '') === keywordLower
      );

      if (keywordIndex === -1) {
        score += 20;
        return;
      }

      // Score based on context
      let sentenceScore = 50; // Base score for being in sentence

      // Bonus if not at start or end
      if (keywordIndex > 1 && keywordIndex < words.length - 2) {
        sentenceScore += 15;
      }

      // Bonus if surrounded by meaningful words (not standalone)
      const prevWord = words[keywordIndex - 1]?.toLowerCase() || '';
      const nextWord = words[keywordIndex + 1]?.toLowerCase() || '';

      const goodContextWords = ['using', 'with', 'via', 'through', 'leveraging', 'implementing', 'developed', 'built', 'created'];
      if (goodContextWords.some(w => prevWord.includes(w) || nextWord.includes(w))) {
        sentenceScore += 20;
      }

      // Penalty if keyword is standalone (short sentence)
      if (words.length < 5) {
        sentenceScore -= 20;
        issues.push(`"${keyword}" appears in a very short phrase - may be standalone`);
      }

      score += sentenceScore;
    });
  });

  // Normalize score
  const maxScore = keywords.length * 100;
  const normalizedScore = maxScore > 0 ? Math.min(100, Math.round((score / maxScore) * 100)) : 0;

  // Determine category
  let category: IntegrationScore['category'] = 'poor';
  if (normalizedScore >= 90) category = 'excellent';
  else if (normalizedScore >= 70) category = 'good';
  else if (normalizedScore >= 50) category = 'fair';

  return {
    score: normalizedScore,
    category,
    found,
    missing,
    issues
  };
}

/**
 * Get color for integration category
 */
export function getIntegrationCategoryColor(category: IntegrationScore['category']): {
  bg: string;
  text: string;
  border: string;
} {
  switch (category) {
    case 'excellent':
      return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' };
    case 'good':
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'fair':
      return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
    case 'poor':
      return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
  }
}

/**
 * Check if text appears to be keyword dumping
 */
export function detectKeywordDumping(text: string): {
  isDumping: boolean;
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
} {
  const reasons: string[] = [];
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

  // Check for list patterns
  const listPatterns = [
    /^[•\-\*]\s*[A-Z][a-z]+\s*,\s*[A-Z][a-z]+/, // Bullet followed by comma-separated
    /:\s*[A-Z][a-z]+\s*,\s*[A-Z][a-z]+\s*,\s*[A-Z][a-z]+/, // Colon followed by comma list
    /^[A-Z][a-z]+\s*,\s*[A-Z][a-z]+\s*,\s*[A-Z][a-z]+\.?$/ // Just comma-separated words
  ];

  let listPatternMatches = 0;
  lines.forEach(line => {
    listPatterns.forEach(pattern => {
      if (pattern.test(line)) listPatternMatches++;
    });
  });

  if (listPatternMatches > 0) {
    reasons.push(`${listPatternMatches} potential keyword list patterns detected`);
  }

  // Check for very short sentences (likely standalone keywords)
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
  const shortSentences = sentences.filter(s => s.split(/\s+/).length <= 3);
  if (shortSentences.length > sentences.length * 0.3) {
    reasons.push(`${shortSentences.length} very short sentences (possible standalone keywords)`);
  }

  // Check for keyword density (too many caps words)
  const words = text.split(/\s+/);
  const capitalizedWords = words.filter(w => /^[A-Z][a-z]+$/.test(w));
  if (capitalizedWords.length > words.length * 0.3) {
    reasons.push('High density of capitalized words (possible keyword stuffing)');
  }

  const isDumping = reasons.length >= 2;
  const confidence = reasons.length >= 3 ? 'high' : reasons.length >= 2 ? 'medium' : 'low';

  return { isDumping, confidence, reasons };
}

/**
 * Validate if keywords are properly integrated (not just appended)
 */
export function validateKeywordIntegration(
  text: string,
  keywords: string[]
): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);

  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();

    // Check if keyword exists
    if (!text.toLowerCase().includes(keywordLower)) {
      issues.push(`Keyword "${keyword}" not found in text`);
      return;
    }

    // Find sentences containing keyword
    const sentencesWithKeyword = sentences.filter(s =>
      s.toLowerCase().includes(keywordLower)
    );

    if (sentencesWithKeyword.length === 0) {
      issues.push(`Keyword "${keyword}" appears but not in a complete sentence`);
      return;
    }

    // Check if keyword is standalone (bad) or integrated (good)
    sentencesWithKeyword.forEach(sentence => {
      const words = sentence.split(/\s+/);
      const keywordIndex = words.findIndex(w =>
        w.toLowerCase().replace(/[^\w]/g, '') === keywordLower
      );

      if (keywordIndex !== -1) {
        // Check context - keyword should be part of sentence structure
        const isStandalone = words.length < 3 ||
          (keywordIndex === words.length - 1 && words.length < 5);

        if (isStandalone) {
          issues.push(`Keyword "${keyword}" appears standalone - consider integrating into a full sentence`);
        }
      }
    });
  });

  return { valid: issues.length === 0, issues };
}
