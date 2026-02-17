# Phase 2: Match Intelligence - Research Document

**Date:** February 17, 2026  
**Goal:** Upgrade from "keyword overlap" to "application performance analytics"  
**Domain:** Resume-Job Matching Analytics, Visual Heatmaps, Competency Gap Analysis

---

## Summary

This phase transforms the existing basic keyword matching into a comprehensive Match Intelligence Dashboard with advanced analytics. The key insight from research is that **recruiters spend <10 seconds scanning resumes in an F-pattern** (eye-tracking data from Wonsulting and JobEase studies), and **80% of resumes get filtered by ATS before human review**. This creates the need for weighted scoring that prioritizes required skills over preferred ones, visual heatmaps showing recruiter attention zones, and actionable competency gap recommendations.

**Primary recommendation:** Build Match Intelligence as a new feature module (`src/features/match-intelligence/`) that extends the existing ATS evaluation engine with weighted keyword scoring, competency gap analysis, and visual comparison components. Leverage the existing `JobDescriptionModel` and `ATSScoreBreakdown` types from `src/shared/types/ats.ts`, and add new types for match-specific analytics.

**Confidence:** HIGH - The existing codebase has the foundation (ATS evaluation, resume parsing, AI enhancement), and the research validates the technical approaches.

---

## User Constraints

**No CONTEXT.md found - proceeding with full research scope.**

---

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 18 | ^18.3.1 | UI framework | Already installed |
| TypeScript | ^5.0.2 | Type safety | Already installed |
| Recharts | ^3.4.1 | Score visualization | Already installed, used in ATS Risk Report |
| Framer Motion | ^10.18.0 | Animations | Already installed |

### New Libraries Required
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @tanstack/react-table | ^8.x | Data tables for comparison view | Industry standard for React tables |
| sentence-transformers (via Edge) | latest | Semantic embeddings | For MATCH-04 semantic similarity |

### Supporting (No New Dependencies)
| Library | Purpose | When to Use |
|---------|---------|-------------|
| ResumeContext | Resume data access | All features |
| JobContext | Job description data | All features |
| resumeAI service | AI enhancement | MATCH-06 recommendations |
| ATS evaluation engine | Keyword matching | MATCH-01, MATCH-03 |

---

## Architecture Patterns

### Recommended Project Structure

```
src/features/match-intelligence/
├── components/
│   ├── MatchDashboard.tsx        # Main container
│   ├── MatchScoreGauge.tsx        # Circular score with breakdown
│   ├── WeightedKeywordList.tsx    # Required vs Preferred display
│   ├── SkillClusteringViz.tsx     # Skill cluster visualization
│   ├── CompetencyGapList.tsx      # Missing skills ranked by importance
│   ├── SemanticScoreCard.tsx      # Similarity scoring display
│   ├── RecruiterHeatmap.tsx      # F-pattern visualization
│   ├── RecommendationsPanel.tsx  # Impact improvements
│   ├── JDComparisonView.tsx       # Side-by-side comparison
│   └── index.ts                   # Exports
├── hooks/
│   ├── useMatchScore.ts           # Weighted scoring logic
│   ├── useSkillClusters.ts        # Skill grouping
│   ├── useCompetencyGaps.ts       # Gap analysis
│   ├── useSemanticSimilarity.ts   # Embedding-based scoring
│   └── useRecruiterHeatmap.ts    # F-pattern calculation
├── types/
│   └── index.ts                   # Match-specific types
├── utils/
│   ├── keywordWeighting.ts        # Required/preferred logic
│   ├── skillClustering.ts         # Grouping algorithms
│   ├── heatmapGenerator.ts        # F-pattern zones
│   └── similarityCalculator.ts    # Cosine similarity
└── index.ts                       # Module exports
```

### Pattern 1: Weighted Keyword Scoring (MATCH-01)

**What:** Scoring system that differentiates required vs preferred keywords with different weights

**When to use:** When displaying match results to users who need to understand which skills are critical vs nice-to-have

**Algorithm:**
```
Total Score = (Required Skills Match × 0.50) + (Preferred Skills Match × 0.25) + (Experience Match × 0.15) + (Keywords × 0.10)
```

**Implementation approach:**
1. Parse JD to extract keywords marked as "required" vs "preferred" (from JD language like "must have", "required", "preferred", "nice to have")
2. Match resume content against both sets
3. Calculate weighted contribution to overall score

**Example type definition:**
```typescript
interface WeightedKeywordResult {
  keyword: string;
  weightType: 'required' | 'preferred' | 'bonus';
  weight: number;  // 0.5 for required, 0.25 for preferred, 0.1 for bonus
  status: 'matched' | 'partial' | 'missing';
  matchScore: number;  // Actual score based on weight × status
  locations: string[]; // Where in resume it appears
}
```

### Pattern 2: Skill Clustering Visualization (MATCH-02)

**What:** Grouping skills into meaningful clusters for visual display

**When to use:** When user needs to understand their skill coverage across categories

**Cluster categories:**
- Technical Skills (programming languages, frameworks)
- Tools & Platforms (AWS, Docker, Kubernetes)
- Domain Concepts (architectures, methodologies)
- Soft Skills (leadership, communication)

**Implementation:**
```typescript
interface SkillCluster {
  category: 'technical' | 'tools' | 'concepts' | 'soft';
  label: string;
  required: string[];      // Required skills in this cluster
  preferred: string[];    // Preferred skills
  matched: string[];      // What user has
  missing: string[];      // Gaps
  coverage: number;       // 0-100%
}
```

### Pattern 3: F-Pattern Heatmap (MATCH-05)

**What:** Visual representation of where recruiters focus attention based on eye-tracking research

**When to use:** When showing users which resume sections get priority attention

**Research-backed zones (from eye-tracking studies):**
- **Zone 1 (Top-left anchor):** 0-2 seconds, 89% first fixation - Name, current title, core value prop
- **Zone 2 (Top horizontal scan):** First line read fully, next 1-2 lines partially
- **Zone 3 (Left margin scan):** Down the left edge, reading job titles and company names
- **Zone 4 (Content area):** Bulleted achievements with numbers/metrics

**Heatmap implementation:**
```typescript
interface HeatmapZone {
  id: string;
  section: 'header' | 'summary' | 'experience' | 'education' | 'skills';
  x: number;      // Percentage position (0-100)
  y: number;      // Percentage position (0-100)
  intensity: number; // 0-1, based on eye-tracking data
  attentionSeconds: number;
  label: string;
}

// F-pattern zones (based on research)
const F_PATTERN_ZONES: HeatmapZone[] = [
  { id: 'z1', section: 'header', x: 10, y: 5, intensity: 1.0, attentionSeconds: 2.0, label: 'Name & Title' },
  { id: 'z2a', section: 'summary', x: 50, y: 10, intensity: 0.7, attentionSeconds: 1.5, label: 'Professional Summary' },
  { id: 'z3a', section: 'experience', x: 5, y: 30, intensity: 0.85, attentionSeconds: 3.0, label: 'Latest Job Title' },
  { id: 'z3b', section: 'experience', x: 5, y: 45, intensity: 0.6, attentionSeconds: 2.0, label: 'Previous Job Title' },
  // ... more zones
];
```

### Pattern 4: Semantic Similarity (MATCH-04)

**What:** Using embeddings to measure semantic closeness between resume content and JD

**When to use:** When exact keyword match isn't enough to capture meaning similarity

**Technical approach:**
1. Use existing AI service (Gemini via Edge Function) to generate embeddings
2. Calculate cosine similarity between resume embedding and JD embedding
3. Score based on similarity threshold

**Implementation (Edge Function extension):**
```typescript
interface SemanticScoreResult {
  overallSimilarity: number;      // 0-100 cosine similarity
  sectionScores: {
    summary: number;
    experience: number;
    skills: number;
  };
  interpretation: 'strong_match' | 'moderate_match' | 'weak_match';
}
```

### Pattern 5: Side-by-Side Comparison (MATCH-08)

**What:** Visual diff showing resume content alongside JD requirements

**When to use:** When user wants to see exactly what matches and what's missing

**UI Pattern:**
```
┌────────────────────────────────────────────────────────────────────┐
│  RESUME CONTENT                    │  JD REQUIREMENTS              │
├────────────────────────────────────────────────────────────────────┤
│  █ Python (matched)               │  Required: Python             │
│  █ React (matched)                │  Required: React              │
│  █ PostgreSQL (matched)           │  Preferred: PostgreSQL        │
│  █ Docker (partial)               │  Required: Docker             │
│  ○ Kubernetes (MISSING)           │  Preferred: Kubernetes        │
│  ○ AWS (MISSING)                  │  Preferred: AWS              │
└────────────────────────────────────────────────────────────────────┘
```

---

## Data Structures Needed

### New Types (add to `src/features/match-intelligence/types/index.ts`)

```typescript
// MATCH-01: Weighted Scoring
export interface WeightedKeywordResult {
  keyword: string;
  weightType: 'required' | 'preferred' | 'bonus';
  baseWeight: number;
  actualWeight: number;
  status: 'matched' | 'partial' | 'missing';
  matchScore: number;
  locations: string[];
  sourceJD: string;  // Which JD section
}

export interface WeightedScoreBreakdown {
  requiredSkills: {
    total: number;
    matched: number;
    score: number;
    maxScore: number;
  };
  preferredSkills: {
    total: number;
    matched: number;
    score: number;
    maxScore: number;
  };
  bonusSkills: {
    total: number;
    matched: number;
    score: number;
    maxScore: number;
  };
  overall: {
    score: number;
    maxScore: number;
    percentage: number;
  };
}

// MATCH-02: Skill Clusters
export interface SkillCluster {
  id: string;
  category: 'technical' | 'tools' | 'concepts' | 'soft' | 'domain';
  label: string;
  icon?: string;
  required: MatchedSkill[];
  preferred: MatchedSkill[];
  coverage: number;
}

export interface MatchedSkill {
  name: string;
  status: 'matched' | 'partial' | 'missing';
  weight: number;
  inResume: boolean;
  resumeLocations?: string[];
}

// MATCH-03: Competency Gaps
export interface CompetencyGap {
  skill: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  weight: number;
  category: string;
  isRequired: boolean;
  recommendation: string;
  difficulty: 'easy' | 'moderate' | 'hard';  // How hard to acquire
}

// MATCH-04: Semantic Similarity
export interface SemanticScore {
  overall: number;
  bySection: {
    summary: number;
    experience: number;
    skills: number;
    education: number;
  };
  interpretation: 'excellent' | 'good' | 'fair' | 'poor';
}

// MATCH-05: Heatmap
export interface HeatmapZone {
  id: string;
  resumeSection: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  attention: number;  // 0-1 normalized
  label: string;
  color: string;
}

// MATCH-06: Recommendations
export interface ImpactRecommendation {
  id: string;
  type: 'add_skill' | 'enhance_experience' | 'add_metrics' | 'reorder' | 'quantify';
  impact: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  specificAction: string;  // e.g., "Add 'Kubernetes' to skills section"
  targetLocation?: string;
  expectedScoreImprovement: number;
}

// MATCH-07: Competency Gap Analysis
export interface CompetencyGapAnalysis {
  gaps: CompetencyGap[];
  totalCritical: number;
  totalHigh: number;
  totalMedium: number;
  totalLow: number;
  overallGapScore: number;  // Higher = bigger gaps
  prioritizedRecommendations: ImpactRecommendation[];
}

// MATCH-08: Comparison View
export interface ComparisonItem {
  keyword: string;
  resumeText?: string;
  jdRequirement: string;
  status: 'matched' | 'partial' | 'missing';
  type: 'required' | 'preferred';
  category: string;
}

export interface JDComparisonData {
  items: ComparisonItem[];
  matchedCount: number;
  partialCount: number;
  missingCount: number;
}
```

---

## Integration Points with Existing Codebase

### ResumeContext (`src/shared/contexts/ResumeContext.tsx`)
- Access: `resumeData` for current resume content
- Methods: None needed - read-only access
- Integration point: Convert resume data to plain text for matching

### JobContext (`src/shared/contexts/JobContext.tsx`)
- Access: `currentJob.description` for JD text
- Access: `currentJob.extractedFields` for structured JD data
- Integration point: Use existing job data for JD parsing

### ATS Evaluation (`src/shared/api/resumeAI.ts`, Edge Function)
- Extend: `evaluateATS()` to return weighted results
- New method: `getWeightedScoreBreakdown()`
- Integration point: Leverage existing keyword extraction

### ATS Simulation Feature (`src/features/ats-simulation/`)
- Coordinate with: Platform comparison for ATS-specific insights
- Integration point: Share layout detection for heatmap positioning

### Use Hook (`src/shared/hooks/use-ats.ts`)
- Extend: Add new parameters for weighted scoring
- Integration point: Use existing ATS evaluation hook

---

## UI Component Architecture

### Main Dashboard Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  MATCH INTELLIGENCE                              [Export] [Refresh]│
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│  │   MATCH SCORE        │  │  SEMANTIC SIMILARITY                │ │
│  │   ████████░░ 78%     │  │  ████████████████░░ 82%              │ │
│  │   Required: 85%      │  │  Summary: 88%                        │ │
│  │   Preferred: 62%     │  │  Experience: 79%                    │ │
│  └──────────────────────┘  │  Skills: 85%                         │ │
│                            └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  RECRUITER HEATMAP (F-Pattern Simulation)                   │ │
│  │  [████████████    ]  [███████████    ]                       │ │
│  │  [█████████        ]              [███████  ]               │ │
│  │  [██████           ]              [████    ]                 │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌─────────────────────────────┐  ┌────────────────────────────┐  │
│  │  SKILL CLUSTERS             │  │  COMPETENCY GAPS           │  │
│  │  ● Technical    ██████ 90% │  │  ○ Kubernetes (Critical)   │  │
│  │  ● Tools        █████  75% │  │  ○ AWS (High)              │  │
│  │  ● Concepts     ████░░ 60% │  │  ○ Leadership (Medium)      │  │
│  │  ● Soft Skills  █████░░80% │  └────────────────────────────┘  │
│  └─────────────────────────────┘                                  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  RECOMMENDATIONS                        [View All]         │ │
│  │  • Add Kubernetes to skills section (+12 pts)               │ │
│  │  • Quantify achievements in experience section (+8 pts)     │ │
│  │  • Reorder skills to lead with required (+5 pts)            │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │  JD COMPARISON                              [Toggle View]    │ │
│  │  ┌─────────────────────┐  ┌─────────────────────────────┐    │ │
│  │  │ Resume              │  │ Job Description             │    │ │
│  │  │ ✓ Python            │  │ Required: Python           │    │ │
│  │  │ ✓ React             │  │ Required: React             │    │ │
│  │  │ ✗ Kubernetes        │  │ Preferred: Kubernetes      │    │ │
│  │  └─────────────────────┘  └─────────────────────────────┘    │ │
│  └──────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

| Component | Props | Purpose |
|-----------|-------|---------|
| `MatchDashboard` | `{ jobId: string }` | Main container, manages state |
| `MatchScoreGauge` | `{ score: number, breakdown: WeightedScoreBreakdown }` | Circular progress with tooltip breakdown |
| `WeightedKeywordList` | `{ keywords: WeightedKeywordResult[] }` | Scrollable list with required/preferred tabs |
| `SkillClusteringViz` | `{ clusters: SkillCluster[] }` | Progress bars per category |
| `CompetencyGapList` | `{ gaps: CompetencyGap[] }` | Ranked list with importance badges |
| `SemanticScoreCard` | `{ similarity: SemanticScore }` | Score gauge + section breakdown |
| `RecruiterHeatmap` | `{ zones: HeatmapZone[], resumeSections: SectionData[] }` | Canvas/SVG overlay on resume preview |
| `RecommendationsPanel` | `{ recommendations: ImpactRecommendation[] }` | Actionable list sorted by impact |
| `JDComparisonView` | `{ comparison: JDComparisonData }` | Side-by-side or unified diff view |

---

## Common Pitfalls

### Pitfall 1: Flat Keyword Matching
**What goes wrong:** Treating all keywords equally leads to poor recommendations  
**Why it happens:** Not distinguishing "required" from "preferred" in JD parsing  
**How to avoid:** Parse JD for explicit requirement language ("must have", "required", "3+ years")  
**Warning signs:** User sees "add this keyword" but doesn't know which are critical

### Pitfall 2: Static Heatmap
**What goes wrong:** Heatmap doesn't reflect actual resume content/layout  
**Why it happens:** Using generic F-pattern without mapping to actual sections  
**How to avoid:** Generate heatmap zones dynamically based on resume section positions  
**Warning signs:** Heatmap zones don't align with actual resume content

### Pitfall 3: Vague Recommendations
**What goes wrong:** "Improve your skills section" instead of "Add Kubernetes"  
**Why it happens:** Not mapping specific missing keywords to actionable changes  
**How to avoid:** Store specific keyword → action mappings  
**Warning signs:** Recommendations could apply to any resume

### Pitfall 4: Ignoring Partial Matches
**What goes wrong:** Marking "Python" as missing when "PythonScript" exists  
**Why it happens:** Exact string matching without fuzzy logic  
**How to avoid:** Use substring matching and normalize variations  
**Warning signs:** High "missing" count despite relevant skills

### Pitfall 5: No Section-Level Semantic Analysis
**What goes wrong:** Overall similarity score without understanding which sections need work  
**Why it happens:** Only calculating total embedding similarity  
**How to avoid:** Calculate similarity per section (summary, experience, skills)  
**Warning signs:** User doesn't know which section to improve

---

## Code Examples

### Example 1: Weighted Keyword Calculation

```typescript
// src/features/match-intelligence/utils/keywordWeighting.ts
import type { WeightedKeywordResult, WeightedScoreBreakdown } from '../types';

const WEIGHTS = {
  required: 0.50,
  preferred: 0.25,
  bonus: 0.10,
};

export function calculateWeightedKeywords(
  jdKeywords: KeywordModel[],
  matchedKeywords: Map<string, string[]>
): WeightedKeywordResult[] {
  return jdKeywords.map((keyword) => {
    const locations = matchedKeywords.get(keyword.keyword.toLowerCase()) || [];
    const status = locations.length > 0 
      ? (locations.length > 1 ? 'matched' : 'partial')
      : 'missing';
    
    const weightType = keyword.weight > 0.7 ? 'required' 
      : keyword.weight > 0.4 ? 'preferred' 
      : 'bonus';
    
    const matchScore = status === 'matched' 
      ? WEIGHTS[weightType] * 100 
      : status === 'partial' 
        ? WEIGHTS[weightType] * 50 
        : 0;

    return {
      keyword: keyword.keyword,
      weightType,
      baseWeight: WEIGHTS[weightType],
      actualWeight: WEIGHTS[weightType] * keyword.weight,
      status,
      matchScore,
      locations,
      sourceJD: keyword.jdSection,
    };
  });
}

export function calculateBreakdown(results: WeightedKeywordResult[]): WeightedScoreBreakdown {
  const required = results.filter(r => r.weightType === 'required');
  const preferred = results.filter(r => r.weightType === 'preferred');
  const bonus = results.filter(r => r.weightType === 'bonus');

  const getScore = (items: WeightedKeywordResult[]) => 
    items.reduce((sum, r) => sum + r.matchScore, 0);
  
  const getMax = (items: WeightedKeywordResult[]) =>
    items.reduce((sum, r) => sum + WEIGHTS[r.weightType as keyof typeof WEIGHTS] * 100, 0);

  const overall = getScore(results);
  const maxOverall = getMax(results);

  return {
    requiredSkills: {
      total: required.length,
      matched: required.filter(r => r.status === 'matched').length,
      score: getScore(required),
      maxScore: getMax(required),
    },
    preferredSkills: {
      total: preferred.length,
      matched: preferred.filter(r => r.status === 'matched').length,
      score: getScore(preferred),
      maxScore: getMax(preferred),
    },
    bonusSkills: {
      total: bonus.length,
      matched: bonus.filter(r => r.status === 'matched').length,
      score: getScore(bonus),
      maxScore: getMax(bonus),
    },
    overall: {
      score: overall,
      maxScore: maxOverall,
      percentage: maxOverall > 0 ? (overall / maxOverall) * 100 : 0,
    },
  };
}
```

### Example 2: F-Pattern Heatmap Generation

```typescript
// src/features/match-intelligence/utils/heatmapGenerator.ts
import type { HeatmapZone } from '../types';

interface SectionPosition {
  id: string;
  top: number;      // Percentage from top
  left: number;    // Percentage from left
  height: number;  // Percentage height
  width: number;   // Percentage width
}

// Base F-pattern attention weights (from eye-tracking research)
const F_PATTERN_WEIGHTS = {
  topLine: 1.0,        // First line - highest attention
  secondLine: 0.7,     // Partial second line
  leftMargin: 0.85,    // Left edge scanning
  content: 0.5,        // Main content area
  rightEdge: 0.2,      // Right edge - rarely looked at
};

export function generateHeatmapZones(
  sections: SectionPosition[]
): HeatmapZone[] {
  const zones: HeatmapZone[] = [];

  sections.forEach((section, index) => {
    let intensity: number;
    let attentionTime: number;

    // First section gets highest attention
    if (index === 0) {
      intensity = F_PATTERN_WEIGHTS.topLine;
      attentionTime = 2.0;
    } else if (index === 1) {
      intensity = F_PATTERN_WEIGHTS.secondLine;
      attentionTime = 1.5;
    } else if (section.left < 10) {
      // Left margin = F-pattern vertical scan
      intensity = F_PATTERN_WEIGHTS.leftMargin;
      attentionTime = 1.2;
    } else {
      intensity = F_PATTERN_WEIGHTS.content;
      attentionTime = 0.8;
    }

    const colors = [
      'rgba(239, 68, 68, ',   // Red - highest attention
      'rgba(249, 115, 22, ',  // Orange
      'rgba(234, 179, 8, ',   // Yellow
      'rgba(34, 197, 94, ',   // Green
    ];
    
    const colorIndex = Math.min(
      Math.floor(intensity * 4),
      3
    );

    zones.push({
      id: `zone-${section.id}`,
      resumeSection: section.id,
      position: { x: section.left, y: section.top },
      dimensions: { width: section.width, height: section.height },
      attention: intensity,
      label: `${section.id} (${attentionTime}s)`,
      color: colors[colorIndex] + `${intensity * 0.4})`,
    });
  });

  return zones;
}
```

### Example 3: Semantic Similarity via Edge Function

```typescript
// In Supabase Edge Function (extend existing resume-ai)
interface SemanticSimilarityRequest {
  resumeText: string;
  jobDescription: string;
}

async function calculateSemanticSimilarity(
  resumeText: string,
  jdText: string
): Promise<SemanticScore> {
  // Use Gemini to get embeddings (via existing API)
  const [resumeEmbedding, jdEmbedding] = await Promise.all([
    getEmbedding(resumeText),
    getEmbedding(jdText),
  ]);

  const similarity = cosineSimilarity(resumeEmbedding, jdEmbedding);
  
  // Also check per-section similarity
  const [summarySim, expSim, skillsSim] = await Promise.all([
    getEmbedding(getResumeSection(resumeText, 'summary')),
    getEmbedding(getResumeSection(resumeText, 'experience')),
    getEmbedding(getResumeSection(resumeText, 'skills')),
  ]);

  const sectionSimilarities = [
    cosineSimilarity(summarySim, getJDSection(jdText, 'requirements')),
    cosineSimilarity(expSim, getJDSection(jdText, 'responsibilities')),
    cosineSimilarity(skillsSim, getJDSection(jdText, 'skills')),
  ];

  const avgSection = sectionSimilarities.reduce((a, b) => a + b, 0) / 3;

  return {
    overall: similarity * 100,
    bySection: {
      summary: sectionSimilarities[0] * 100,
      experience: sectionSimilarities[1] * 100,
      skills: sectionSimilarities[2] * 100,
      education: 0, // Could add
    },
    interpretation: similarity > 0.8 ? 'excellent'
      : similarity > 0.6 ? 'good'
      : similarity > 0.4 ? 'fair'
      : 'poor',
  };
}

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
```

---

## Implementation Roadmap

### Week 1: Core Scoring & Types
- [ ] Define all new types in `match-intelligence/types`
- [ ] Implement weighted keyword scoring algorithm
- [ ] Create required vs preferred keyword extraction from JD
- [ ] Build `useMatchScore` hook

### Week 2: Visualizations
- [ ] Implement skill clustering algorithm
- [ ] Build `SkillClusteringViz` component with Recharts
- [ ] Create `CompetencyGapList` with importance ranking
- [ ] Implement `useSkillClusters` hook

### Week 3: Advanced Analytics
- [ ] Extend Edge Function with semantic similarity
- [ ] Build `SemanticScoreCard` component
- [ ] Create `RecruiterHeatmap` with F-pattern zones
- [ ] Build `useSemanticSimilarity` hook

### Week 4: Recommendations & Comparison
- [ ] Implement impact scoring for recommendations
- [ ] Build `RecommendationsPanel` component
- [ ] Create `JDComparisonView` with diff highlighting
- [ ] Integration testing and polish

---

## Open Questions

1. **Semantic Embeddings:**
   - What we know: Gemini API can generate embeddings
   - What's unclear: Whether edge function has embedding support or needs text generation fallback
   - Recommendation: Test with Gemini `embedContent` API; fallback to using similarity prompts

2. **JD Parsing Accuracy:**
   - What we know: Existing JD parser extracts keywords with categories
   - What's unclear: How accurately it distinguishes required vs preferred
   - Recommendation: Add explicit detection for "must have", "required", "preferred", "nice to have" patterns

3. **Heatmap Data Source:**
   - What we know: Eye-tracking studies show F-pattern
   - What's unclear: Whether to use generic zones or map to actual resume DOM
   - Recommendation: Use generic F-pattern overlaid on resume preview as MVP

4. **Recommendation Specificity:**
   - What we know: Users want specific actions like "Add Kubernetes"
   - What's unclear: How to map missing skills to specific resume locations
   - Recommendation: Store location hints in keyword matching, use AI for complex mappings

---

## Sources

### Primary (HIGH confidence)
- **Existing codebase** (`src/shared/types/ats.ts`) - KeywordModel, MatchResultModel, ATSScoreBreakdown
- **Existing Edge Function** (`supabase/functions/resume-ai/index.ts`) - JD parsing, keyword matching logic
- **Recharts** - Existing visualization library in project

### Secondary (MEDIUM confidence)
- **Wonsulting Eye-Tracking Study** - F-pattern research, <10 second scanning data
- **JobEase Eye-Tracking Study (Dec 2025)** - 847 hiring managers, heatmap zones
- **Resume2Vec (MDPI 2025)** - Semantic similarity with transformer embeddings
- **FreeCodeCamp Resume Screening Tutorial** - Weighted scoring formula (50/25/15/10)

### Tertiary (LOW confidence)
- **GitHub: AI-Resume-Matcher** - TF-IDF + cosine similarity implementation
- **Jobscan/Resume Worded** - Commercial approaches to weighted keyword matching (reverse-engineered)

---

## Metadata

**Confidence breakdown:**
- Standard Stack: HIGH - Uses existing libraries, minimal new dependencies
- Architecture: HIGH - Follows existing feature module pattern in codebase
- Pitfalls: MEDIUM - Identified via research, some assumptions about JD parsing accuracy
- Heatmap: MEDIUM - Based on eye-tracking studies, needs validation with actual users

**Research date:** February 17, 2026
**Valid until:** March 17, 2026 (30 days for stable features)
