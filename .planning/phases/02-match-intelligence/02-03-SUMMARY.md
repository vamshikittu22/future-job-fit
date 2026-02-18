---
phase: 02-match-intelligence
plan: 03
subsystem: match-intelligence
tags: [semantic-similarity, tf-idf, scoring]
dependency_graph:
  requires:
    - 02-01 (Match Intelligence Types)
  provides:
    - useSemanticSimilarity hook
    - SemanticScoreCard component
    - similarityCalculator utility
  affects:
    - ResumeContext integration
    - JobContext integration
tech_stack:
  added:
    - TF-IDF vectorization
    - Cosine similarity
    - Section extraction
  patterns:
    - Semantic similarity scoring with fallback
    - Section-level analysis
key_files:
  created:
    - src/features/match-intelligence/utils/similarityCalculator.ts
    - src/features/match-intelligence/hooks/useSemanticSimilarity.ts
    - src/features/match-intelligence/components/SemanticScoreCard.tsx
  modified:
    - src/features/match-intelligence/types/types.ts
    - src/features/match-intelligence/hooks/index.ts
    - src/features/match-intelligence/components/index.ts
decisions:
  - Weighted scoring: 70% TF-IDF + 30% keyword Jaccard for robust similarity
  - Section extraction: Parse resume by common section headers for per-section scoring
  - Interpretation thresholds: 80%+ excellent, 60-80% good, 40-60% fair, <40% poor
metrics:
  duration: ~3 minutes
  completed: 2026-02-17
  tasks: 3
  files: 6
---

# Phase 2 Plan 3: Semantic Similarity Scoring Summary

**Objective:** Build semantic similarity scoring using TF-IDF approach (MATCH-04)

**One-liner:** TF-IDF based semantic similarity with section-level breakdown

---

## Tasks Completed

### Task 1: Implement TF-IDF Similarity Calculator
**Status:** ✅ Complete  
**Commit:** `807eca7`

Created `src/features/match-intelligence/utils/similarityCalculator.ts` with:
- `cosineSimilarity()` - Vector comparison using cosine similarity
- `termFrequency()` - Calculate term frequency normalized by max frequency
- `calculateIDF()` - Inverse document frequency with smoothing
- `tfidf()` - TF-IDF vector generation
- `calculateTFIDFSimilarity()` - Primary similarity method
- `calculateKeywordSimilarity()` - Secondary Jaccard similarity fallback
- `calculateSemanticSimilarity()` - Combined weighted scoring (70% TF-IDF + 30% keyword)
- `extractSections()` - Parse resume text by common headers
- `generateMockEmbedding()` - Future embedding API support

### Task 2: Create useSemanticSimilarity Hook
**Status:** ✅ Complete  
**Commit:** `7a2725a`

Created `src/features/match-intelligence/hooks/useSemanticSimilarity.ts`:
- Integrates with ResumeContext and JobContext
- Extracts resume text from all sections (summary, experience, skills, projects, education)
- Returns `SemanticScore` with overall score and section-level breakdown
- Handles missing job description gracefully

### Task 3: Build SemanticScoreCard Component
**Status:** ✅ Complete  
**Commit:** `f69cb66`

Created `src/features/match-intelligence/components/SemanticScoreCard.tsx`:
- Circular progress indicator for overall score
- Section breakdown with progress bars (summary, experience, skills, education)
- Color-coded interpretation labels:
  - Excellent (≥80%): Green - Strong semantic alignment
  - Good (60-80%): Blue - Reasonable match with gaps
  - Fair (40-60%): Yellow - Moderate alignment
  - Poor (<40%): Red - Significant gap
- Legend for score ranges
- Placeholder for missing job description

---

## Success Criteria Verification

- [x] Overall semantic score between 0-100%
- [x] Section breakdown shows scores for each resume section
- [x] Interpretation label matches score range
- [x] Component handles missing job description gracefully

---

## Technical Details

### Similarity Calculation
- **Primary method:** TF-IDF with cosine similarity (70% weight)
- **Fallback:** Keyword Jaccard similarity (30% weight)
- **Result:** Combined weighted score normalized to 0-100%

### Section Extraction
Parses resume text by common section headers:
- Summary/Profile/Objective → summary
- Experience/Work/Employment → experience
- Skills/Technical/Technologies → skills
- Education/Academic/Qualifications → education

### Interpretation Thresholds
| Score Range | Label | Color |
|-------------|-------|-------|
| ≥80% | Excellent | Green |
| 60-80% | Good | Blue |
| 40-60% | Fair | Yellow |
| <40% | Poor | Red |

---

## Commits

| Hash | Message |
|------|---------|
| `75c6c73` | types(match-intelligence): add SemanticScore type definition |
| `807eca7` | feat(match-intelligence): implement TF-IDF similarity calculator |
| `7a2725a` | feat(match-intelligence): add useSemanticSimilarity hook |
| `f69cb66` | feat(match-intelligence): add SemanticScoreCard component |

---

## Deviations from Plan

**None** - Plan executed exactly as written.

The implementation follows the plan exactly:
- TF-IDF similarity calculator created with all specified functions
- useSemanticSimilarity hook integrates with ResumeContext and JobContext
- SemanticScoreCard displays overall score and section breakdown with correct interpretation

---

## Self-Check

- [x] All created files exist
- [x] TypeScript compilation passes
- [x] Build completes successfully
- [x] All commits created with proper messages

## Self-Check: PASSED
