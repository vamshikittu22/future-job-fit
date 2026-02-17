/**
 * Skill Clustering Utilities
 *
 * Algorithm for grouping skills into categories and analyzing competency gaps.
 */

import type {
  MatchedSkill,
  SkillCluster,
  CompetencyGap,
  CompetencyGapAnalysis,
  ImpactRecommendation,
  SkillCategory,
} from '../types';

// Skill category definitions - keywords for auto-categorization
const CATEGORY_KEYWORDS: Record<SkillCategory, string[]> = {
  technical: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust',
    'react', 'angular', 'vue', 'node', 'django', 'flask', 'spring', 'rails',
    'html', 'css', 'sql', 'mongodb', 'postgresql', 'mysql', 'graphql', 'rest', 'api',
    'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch',
    'aws', 'gcp', 'azure', 'cloud', 'devops', 'ci/cd', 'docker', 'kubernetes',
  ],
  tools: [
    'git', 'github', 'gitlab', 'jira', 'confluence', 'slack', 'zoom', 'figma', 'sketch',
    'visual studio', 'vscode', 'intellij', 'pycharm', 'eclipse', 'xcode', 'android studio',
    'jenkins', 'travis', 'circleci', 'github actions', 'terraform', 'ansible',
    'splunk', 'datadog', 'new relic', 'cloudwatch', 'logrocket',
  ],
  concepts: [
    'agile', 'scrum', 'kanban', 'waterfall', 'tdd', 'bdd', 'ddd',
    'microservices', 'monolith', 'serverless', 'event-driven', 'mvc', 'mvvm',
    'oop', 'functional', 'design patterns', 'solid', 'clean code',
    'security', 'oauth', 'jwt', 'encryption', 'ssl', 'tls',
    'performance', 'optimization', 'caching', 'cdn', 'load balancing',
    'data structures', 'algorithms', 'complexity', 'big o',
  ],
  soft: [
    'leadership', 'communication', 'teamwork', 'problem-solving', 'analytical',
    'collaboration', 'presentation', 'mentoring', 'conflict resolution',
    'project management', 'time management', 'adaptability', 'creativity',
    'strategic thinking', 'stakeholder management', 'negotiation',
  ],
};

// Category metadata
const CATEGORY_META: Record<SkillCategory, { label: string; icon: string }> = {
  technical: { label: 'Technical Skills', icon: '💻' },
  tools: { label: 'Tools & Platforms', icon: '🔧' },
  concepts: { label: 'Concepts & Methods', icon: '📚' },
  soft: { label: 'Soft Skills', icon: '🤝' },
};

/**
 * Categorize a skill into one of four categories based on keywords
 */
export function categorizeSkill(skill: string): SkillCategory {
  const lower = skill.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return category as SkillCategory;
    }
  }

  // Default to 'technical' for unknown skills
  return 'technical';
}

/**
 * Cluster skills by category
 * Groups skills into Technical, Tools, Concepts, and Soft skill categories
 * and calculates coverage percentage for each cluster
 */
export function clusterSkills(matchedSkills: MatchedSkill[]): SkillCluster[] {
  const clusters: Map<SkillCategory, SkillCluster> = new Map();

  // Initialize clusters
  for (const category of Object.keys(CATEGORY_KEYWORDS) as SkillCategory[]) {
    clusters.set(category, {
      id: category,
      category,
      label: CATEGORY_META[category].label,
      icon: CATEGORY_META[category].icon,
      required: [],
      preferred: [],
      coverage: 0,
    });
  }

  // Categorize each skill
  for (const skill of matchedSkills) {
    const category = categorizeSkill(skill.name);
    const cluster = clusters.get(category)!;

    // Separate required (high weight) from preferred skills
    if (skill.weight >= 0.7) {
      cluster.required.push(skill);
    } else {
      cluster.preferred.push(skill);
    }
  }

  // Calculate coverage for each cluster
  for (const cluster of clusters.values()) {
    const total = cluster.required.length + cluster.preferred.length;
    const matched =
      cluster.required.filter((s) => s.status !== 'missing').length +
      cluster.preferred.filter((s) => s.status !== 'missing').length;
    cluster.coverage = total > 0 ? (matched / total) * 100 : 100;
  }

  return Array.from(clusters.values());
}

/**
 * Identify missing competencies from matched skills
 * Ranks gaps by importance (critical/high/medium/low)
 */
export function identifyCompetencyGaps(matchedSkills: MatchedSkill[]): CompetencyGap[] {
  const gaps: CompetencyGap[] = [];

  for (const skill of matchedSkills) {
    if (skill.status === 'missing') {
      let importance: 'critical' | 'high' | 'medium' | 'low';
      let difficulty: 'easy' | 'moderate' | 'hard';

      // Determine importance based on weight
      if (skill.weight >= 0.7) {
        importance = 'critical';
        difficulty = categorizeSkill(skill.name) === 'soft' ? 'moderate' : 'hard';
      } else if (skill.weight >= 0.4) {
        importance = 'high';
        difficulty = 'moderate';
      } else {
        importance = skill.weight >= 0.2 ? 'medium' : 'low';
        difficulty = 'easy';
      }

      const category = categorizeSkill(skill.name);

      gaps.push({
        skill: skill.name,
        importance,
        weight: skill.weight,
        category,
        isRequired: skill.weight >= 0.7,
        recommendation: getRecommendation(skill.name, importance, category),
        difficulty,
      });
    }
  }

  // Sort by importance (critical first), then by weight
  const importanceOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return gaps.sort((a, b) => {
    const impDiff = importanceOrder[a.importance] - importanceOrder[b.importance];
    if (impDiff !== 0) return impDiff;
    return b.weight - a.weight;
  });
}

/**
 * Generate specific recommendation based on skill and importance
 */
function getRecommendation(
  skill: string,
  importance: string,
  category: SkillCategory
): string {
  const actionVerbs: Record<string, string> = {
    technical: `Add "${skill}" to your skills section`,
    tools: `Include "${skill}" in your technical toolkit`,
    concepts: `Demonstrate understanding of ${skill}`,
    soft: `Showcase ${skill} in your achievements`,
  };

  return actionVerbs[category] || `Add "${skill}" to improve your profile`;
}

/**
 * Calculate overall gap score based on importance weights
 * Higher score = more critical gaps to address
 */
export function calculateGapScore(gaps: CompetencyGap[]): number {
  const weights = { critical: 10, high: 5, medium: 2, low: 1 };
  return gaps.reduce((score, gap) => score + weights[gap.importance], 0);
}

/**
 * Full competency gap analysis
 * Returns comprehensive gap analysis with prioritized recommendations
 */
export function analyzeCompetencyGaps(
  matchedSkills: MatchedSkill[]
): CompetencyGapAnalysis {
  const gaps = identifyCompetencyGaps(matchedSkills);

  return {
    gaps,
    totalCritical: gaps.filter((g) => g.importance === 'critical').length,
    totalHigh: gaps.filter((g) => g.importance === 'high').length,
    totalMedium: gaps.filter((g) => g.importance === 'medium').length,
    totalLow: gaps.filter((g) => g.importance === 'low').length,
    overallGapScore: calculateGapScore(gaps),
    prioritizedRecommendations: gaps.slice(0, 5).map((g) => ({
      id: `rec-${g.skill}`,
      type: 'add_skill' as const,
      impact: g.importance === 'critical' ? 'high' : g.importance === 'high' ? 'medium' : 'low',
      title: g.recommendation,
      description: `${g.importance} priority skill gap`,
      specificAction: g.recommendation,
      expectedScoreImprovement: g.isRequired ? 12 : 5,
    })),
  };
}

/**
 * Calculate coverage for a specific category
 */
export function calculateCoverage(
  matchedSkills: MatchedSkill[],
  category: SkillCategory
): number {
  const categorySkills = matchedSkills.filter(
    (s) => categorizeSkill(s.name) === category
  );
  if (categorySkills.length === 0) return 100;

  const matched = categorySkills.filter((s) => s.status !== 'missing').length;
  return (matched / categorySkills.length) * 100;
}
