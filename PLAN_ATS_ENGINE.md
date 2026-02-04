# ATS Engine Architecture – Execution Plan (Milestones 1–4)

This plan governs the refactor to a deterministic, explainable, MVC-style ATS engine with JD-aware scoring and a structured frontend integration.  
Rules: Work on **one task at a time**. After completing a task, mark it `[x]` and add a single `> Done: ...` line below it.

---

## Phase 0 – Setup and Orientation

- [x] 0.1 Confirm file locations and architecture entry points
  > Done: Confirmed all locations: `public/py-nlp/nlp_core.py`, `supabase/functions/resume-ai/index.ts`, `src/shared/hooks/use-ats.ts`, `src/shared/api/resumeAI.ts`, `src/shared/hooks/usePyNLP.ts`, `src/features/resume-builder/components/editor/steps/ReviewStep.tsx`.

- [x] 0.2 Create this plan file and commit it
  > Done: Created `PLAN_ATS_ENGINE.md` in project root.

---

## Phase 1 – ATS Types and Contracts (Milestone 1)

- [x] 1.1 Introduce ATS domain types in TypeScript
  > Done: Created `src/shared/types/ats.ts` with all interfaces: KeywordModel, MatchResultModel, ATSScoreBreakdown, JobDescriptionModel, Recommendation, ATSEvaluationResponse.
  - Create `src/shared/types/ats.ts` (or similar shared types module).
  - Define:
    - `export type KeywordCategory = 'hard_skill' | 'tool' | 'concept' | 'soft_skill';`
    - `export type MatchStatus = 'matched' | 'partial' | 'missing';`
    - `export interface KeywordModel { keyword: string; category: KeywordCategory; weight: number; frequency: number; jdSection: string; }`
    - `export interface MatchResultModel { keyword: string; category: KeywordCategory; status: MatchStatus; locations: string[]; scoreContribution: number; }`
    - `export interface ATSScoreBreakdown { hardSkillScore: number; toolsScore: number; conceptScore: number; roleTitleScore: number; structureScore: number; total: number; }`
    - `export interface JobDescriptionModel { id: string; rawText: string; sections: Record<string, string>; categorizedKeywords: KeywordModel[]; }`
    - `export interface Recommendation { id: string; message: string; severity: 'info' | 'warning' | 'critical'; targetLocation?: string; category?: KeywordCategory; }`
    - `export interface ATSEvaluationResponse { jdModel: JobDescriptionModel; matchResults: MatchResultModel[]; scoreBreakdown: ATSScoreBreakdown; recommendations: Recommendation[]; }`

- [x] 1.2 Wire ATS types into existing TS code
  > Done: Added re-exports to `src/shared/lib/types.ts` for all ATS types.

- [x] 1.3 Extend Edge Function contracts for ATS tasks
  > Done: Added `parseJD` and `evaluateATS` handlers in `resume-ai/index.ts` with deterministic ATS engine (no LLM for scoring).

  - In `supabase/functions/resume-ai/index.ts`:
    - Add a `task: 'parseJD'` handler that returns `JobDescriptionModel`.
    - Add a `task: 'evaluateATS'` handler that returns `ATSEvaluationResponse`.
  - Keep existing tasks (`evaluateResume`, etc.) intact for backward compatibility.
  - Ensure responses are serializable and conform exactly to the new TS types.

---

## Phase 2 – Python ATS Engine (Milestone 2)

- [x] 2.1 Define Python models / shapes to match TS contracts
  > Done: Added structured data shapes in `nlp_core.py` matching TS contracts using plain dicts.
  - In `nlp_core.py`, define internal data structures (plain dicts or Pydantic models) that correspond to:
    - `JobDescriptionModel`
    - `KeywordModel`
    - `MatchResultModel`
    - `ATSScoreBreakdown`
    - `ATSEvaluationResponse`
  - Ensure final outputs are JSON-serializable dicts.

- [x] 2.2 Implement `parse_jd(text)` in Python
  > Done: Added `parse_jd()` function that parses JD into sections and categorized keywords.

  - Split JD into sections (requirements, responsibilities, nice-to-have, about) using headings + heuristics.
  - Extract multi-word phrases (e.g., "Spring Boot", "CI/CD") and single-word keywords.
  - Categorize keywords into `KeywordCategory` using:
    - Existing TECH_SKILLS / dictionaries for hard skills and tools.
    - Pattern-based logic for soft skills.
    - Default remaining domain phrases to concept.
  - Assign weights:
    - Base weight per section (requirements > responsibilities > nice-to-have > about).
    - Increase weight for repeated keywords (with a cap).

- [x] 2.3 Implement `parse_resume_canonical(text)` in Python
  > Done: Added `parse_resume_canonical()` with section tokenization and location strings.


- [x] 2.4 Implement `match_keywords(jd_model, resume_model)`
  > Done: Added `match_keywords()` with exact matching, partial matching, and location tracking.


- [x] 2.5 Refactor `score_ats()` to use new scoring formula
  > Done: Added `calculate_ats_score()` implementing the weighted formula (HardSkill*0.45 + Tools*0.20 + Concepts*0.20 + RoleTitle*0.10 + Structure*0.05).


- [x] 2.6 Build `evaluate_ats(resume_text, jd_text)` orchestration in Python
  > Done: Added `evaluate_ats()` that chains parse_jd → parse_resume_canonical → match_keywords → calculate_ats_score → generate_recommendations.

- [x] 2.7 Add Python unit tests
  > Done: Created `test_nlp_core.py` with tests for JD parsing, keyword matching, scoring determinism, and formula verification.


---

## Phase 3 – Frontend Integration (Milestone 3)

- [x] 3.1 Extend `usePyNLP.ts` API surface
  > Done: Added `parseJD`, `parseResumeCanonical`, and `evaluateATS` methods to `usePyNLP.ts`.
  - Add:
    - `parseJD(text: string): Promise<JobDescriptionModel>`
    - `evaluateATSStructured(resume: ResumeData, jd: string): Promise<ATSEvaluationResponse>`
  - Wire these to the Python backend / offline parser endpoints (or direct Pyodide calls) according to existing offline integration.


- [x] 3.2 Extend `resumeAI.ts` client
  > Done: Added `parseJDCloud` and `evaluateATSCloud` methods that call Edge Function tasks.
  - Add:
    - `parseJD(rawJDText: string): Promise<JobDescriptionModel>` → calls Supabase `task: 'parseJD'` when online.
    - `evaluateATSStructured(resumeData: ResumeData, jdText: string): Promise<ATSEvaluationResponse>` → calls `task: 'evaluateATS'`.
  - Respect `isOfflineMode`:
    - If offline, route to `usePyNLP` / offline parser.
    - If online, route to Supabase Edge Function.


- [x] 3.3 Refactor `use-ats.ts` hook API
  > Done: Refactored to support both legacy (no JD) and structured (with JD) evaluation. Added optional `jobDescription` input, `atsScoreBreakdown`, `matchResults`, `recommendations`, `loading`, `error` outputs.
  - Inputs:
    - `resumeData: ResumeData`
    - `jobDescription?: string`
  - Outputs:
    - Existing: `atsScore: number`
    - New:
      - `atsScoreBreakdown?: ATSScoreBreakdown`
      - `matchResults?: MatchResultModel[]`
      - `recommendations?: Recommendation[]`
      - `loading: boolean`
      - `error: string | null`
  - Implementation:
    - When JD is present → call `evaluateATSStructured`.
    - When JD is absent → fall back to existing legacy scoring and only populate `atsScore` to preserve backward compatibility.

- [x] 3.4 Add helper selectors to `use-ats.ts`
  > Done: Added `getKeywordsByStatus`, `getCoverageBySection`, and `getRecommendationsForLocation` helper functions.


- [x] 3.5 Optional minimal TS tests (once test runner is available)
  > Done: Set up Vitest with 9 tests for use-ats.ts covering legacy mode, helper selectors, score determinism, and structured mode. All tests passing.


---

## Phase 4 – ATS Dashboard & Inline Editing (Milestone 4)

- [ ] 4.1 Ensure JD is available in the Review step
  - Decide JD storage location (e.g., `resumeData.metadata.jobDescription`).
  - Wire JD input from an earlier wizard step into `ResumeContext`.
  - In `ReviewStep.tsx`, read JD from context and pass it to `useATS`.

- [ ] 4.2 Enhance `ReviewStep.tsx` with ATS dashboard
  - Use `useATS(resumeData, jd)` to fetch structured ATS data.
  - Score panel:
    - Reuse circular visualization for `atsScore`.
    - Show a small table of component scores: Hard Skills, Tools, Concepts, Role Match, Structure using `atsScoreBreakdown`.
  - Add an info icon / modal:
    - Explain how the score is calculated and what each component means.

- [ ] 4.3 Create `KeywordTable.tsx`
  - Props:
    - `matchResults: MatchResultModel[]`
    - Optional callbacks (`onKeywordClick`, etc.)
  - Table columns:
    - Keyword
    - Category
    - Status (colored: green matched, yellow partial, red missing)
    - Score contribution
    - Recommended section (using `recommendations` or heuristics).
  - Enable sorting by status and score contribution.

- [ ] 4.4 Create `SectionCoverageMap.tsx`
  - Props:
    - `matchResults: MatchResultModel[]`
    - Maybe `resumeData` if needed for section labels.
  - For each relevant section (Summary, Experience, Skills):
    - Compute `X of Y` keywords covered using `getCoverageBySection`.
    - Render progress bars indicating coverage percentage.

- [ ] 4.5 Inline recommendation hooks into editors
  - Use `getRecommendationsForLocation(location)` to surface:
    - Inline hints or badges within summary / experience editors.
  - Highlight steps in the wizard that have critical recommendations (e.g., mark Experience as needing attention).

---

## Phase 5 – Verification and Regression Checks

- [ ] 5.1 Manual verification – Review step dashboard
  - Run `npm run dev`, go to `/resume-wizard`, complete sample resume, open Review step.
  - Confirm:
    - ATS score circle appears.
    - Breakdown table shows 5 component scores.
    - Keyword table appears with proper color coding.
    - Section coverage map shows progress bars.

- [ ] 5.2 Manual verification – Offline parser mode
  - Set `.env.local` with `VITE_OFFLINE_PARSER=true`.
  - Run dev server and navigate to `/input` (Job Optimizer).
  - Paste sample resume and JD, click "Generate Resume".
  - Confirm:
    - Console log shows "[AI Service] Using offline parser".
    - ATS score and matching keywords appear without cloud API calls.

- [ ] 5.3 Manual verification – Score determinism
  - Use identical resume and JD text.
  - Run ATS evaluation three times (via Review step and/or Job Optimizer).
  - Confirm score and breakdown are identical each time.

- [ ] 5.4 Manual verification – Backward compatibility
  - Run the wizard through all steps including Review, with and without a JD.
  - Confirm:
    - No runtime errors or React warnings.
    - Existing UI that depends only on `atsScore` still works as before.
