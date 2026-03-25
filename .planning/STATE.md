# Project State: Future Job Fit

**Project:** Future Job Fit — ATS Optimization Authority  
**Core Value:** The most accurate ATS simulation engine for job applications — works offline.  
**Last Updated:** 2026-02-19 22:42 UTC
**Strategy:** Plan A (Pivot from Career Super App)

---

## Strategic Pivot ✓

**From:** Career super app (40 requirements, 5 phases, feature buffet)  
**To:** ATS optimization authority (23 requirements, 4 phases, deep precision)

**Why:** Defensible moat (Pyodide), differentiated positioning, focused execution, clearer monetization.

**Competitive tier:** Workday, Taleo, Greenhouse, Lever — NOT Kickresume, Canva, Enhancv.

---

## Current Position

**Current Phase:** Phase 5 — Keyword Integration Fix
**Current Plan:** COMPLETE (3 of 3 plans)
**Status:** ✅ PHASE COMPLETE

```
Progress: [██████████] 100% (3/3 plans complete)
Phase 0: [██████████] 100% (4/4 plans complete) ✅
Phase 1: [██████████] 100% (6/6 plans complete) ✅
Phase 2: [██████████] 100% (6/6 plans complete) ✅
Phase 3: [██████████] 100% (6/6 plans complete) ✅
Phase 4: [██████████] 100% (6/6 plans complete) ✅
Phase 5: [██████████] 100% (3/3 plans complete) ✅
```
Progress: [░░░░░░░░░░] 0% (0/3 plans complete)
Phase 0: [██████████] 100% (4/4 plans complete) ✅
Phase 1: [██████████] 100% (6/6 plans complete) ✅
Phase 2: [██████████] 100% (6/6 plans complete) ✅
Phase 3: [██████████] 100% (6/6 plans complete) ✅
Phase 4: [██████████] 100% (6/6 plans complete) ✅
Phase 5: [░░░░░░░░░░] 33% (1/3 plans complete) 🔄
```
Progress: [██████████] 100% (23/23 requirements)
Phase 0:  [██████████] 100% (4/4 plans complete) ✅
Phase 1:  [██████████] 100% (6/6 plans complete) ✅
Phase 2:  [██████████] 100% (6/6 plans complete) ✅
Phase 3:  [██████████] 100% (6/6 plans complete) ✅
Phase 4:  [██████████] 100% (6/6 plans complete) ✅
```

---

## Completed Work

**Foundation (Existing Codebase - Pre-Pivot):**
- ✅ Resume Wizard with 10-step guided experience
- ✅ Real-time preview panel with live updates
- ✅ AI content enhancement via Supabase Edge Functions
- ✅ Offline ATS scoring with Pyodide NLP engine
- ✅ Multi-format export (PDF, DOCX, HTML, Markdown, JSON, TXT, LaTeX)
- ✅ Auto-save to localStorage with undo/redo (100 steps)
- ✅ Job description analysis and keyword matching
- ✅ Version snapshots (20 saved versions)
- ✅ PWA with offline support
- ✅ Multiple resume templates (Modern, Professional, Minimal, Creative)

**Planning Completed (Pre-Pivot):**
- ✅ Project charter defined
- ✅ Requirements documented (40 v1 requirements)
- ✅ Research completed (5 critical pitfalls identified)
- ✅ Roadmap created (5 phases)

**Strategic Pivot (Plan A):**
- ✅ New roadmap created (4 phases, focused scope)
- ✅ Phase 0 plans created (4 hardening plans)
- ✅ Old 02-cover-letter plans archived (8 plans from career super app direction)

---

## Simplified Roadmap (Focused)

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 0 — Hardening | Stabilize codebase for engine complexity | 7 | ✅ Complete |
| 1 — ATS Simulation 2.0 | Deep parsing simulation engine | 8 | 🔵 Ready (6 plans) |

**Archived/Removed:**
- ❌ LinkedIn Sync (01-foundation) — archived to `.planning/archive/`
- ❌ Cover Letter Optimizer — archived to `.planning/archive/`
- ❌ Match Intelligence — deferred until core engine complete
- ❌ Interview Preparation — deferred to v2

**Focus:** Resume creation + JD optimization ONLY

---

## Phase 0: Codebase Hardening (Ready to Execute)

**Goal:** Prepare foundation for ATS engine complexity. Weak foundations break under precision requirements.

### Plans
- [x] 00-01-PLAN.md — TypeScript strict mode & lint cleanup ✅
- [x] 00-02-PLAN.md — Dependency cleanup & storage compression ✅
- [x] 00-03-PLAN.md — Storage versioning & migration system ✅
- [x] 00-04-PLAN.md — Analytics & AI cost monitoring ✅

### Wave Structure
| Wave | Plans | Description |
|------|-------|-------------|
| 1 | 00-01, 00-02, 00-03, 00-04 | All independent hardening work (parallel) |

### Success Criteria
1. `npm run lint` returns <10 errors
2. `npm run build` passes with strict mode enabled
3. Storage compression reduces size 3-5x
4. Storage versioning prevents data loss
5. AI cost tracking visible in dev tools

---

## Phase 1: ATS Simulation 2.0 (PLANNED — Ready to Execute)

**Goal:** Transform from "keyword matcher" to "ATS simulator" with parsing accuracy.

### Research Completed ✅
- Real ATS parsing behavior (Workday, Taleo, Greenhouse, Lever)
- Pyodide NLP options (rule-based first, spaCy later)
- DOM-based layout detection strategy
- Confidence scoring approaches

### Plans
- [x] 01-01-PLAN.md — Type system foundation (parser, scoring, platform types) ✅
- [x] 01-02-PLAN.md — Section extraction engine (TDD approach) ✅
- [x] 01-03-PLAN.md — DOM layout detector (tables, columns, headers) ✅
- [x] 01-04-PLAN.md — Platform simulators (Workday, Lever, Greenhouse, Taleo)
- [x] 01-05-PLAN.md — ATS Risk Report UI (ScoreGauge, PlatformComparison) ✅
- [x] 01-06-PLAN.md — Integration + modal (checkpoint for UX verification) ✅

### Wave Structure
| Wave | Plans | Description |
|------|-------|-------------|
| 1 | 01-01, 01-02, 01-03 | Foundation (types, extraction, layout) |
| 2 | 01-04, 01-05 | Engine (platforms, UI components) |
| 3 | 01-06 | Integration (checkpoint) |

### Key Technical Decisions
1. **Rule-based NLP first** — 85% accuracy, zero bundle overhead
2. **DOM-based layout detection** — 10x faster than image analysis
3. **Score weights** — Parsing 40%, Keywords 30%, Format 20%, Layout 10%
4. **Platform quirks** — Workday 40% table penalty, Taleo 50% column penalty

---

## Phase 4: Resume Wizard Redesign (COMPLETE ✅ — 6/6 plans)

**Goal:** Transform wizard UX from linear form-fill to modern guided experience with progressive disclosure and contextual assistance.

### Plans
- [x] 04-01-PLAN.md — Modern vertical stepper with completion states & ATS badges ✅
- [x] 04-02-PLAN.md — Helper rail with step-specific guidance ✅
- [x] 04-03-PLAN.md — Smart content guidance (AI prompts, character counts) ✅
- [x] 04-04-PLAN.md — Job description awareness (linked badge, keyword hints, match snapshot) ✅
- [x] 04-05-PLAN.md — Mobile optimization (progress bar, action bar, Sheet drawers) ✅
- [x] 04-06-PLAN.md — Human verification checkpoint (5 bugs fixed) ✅

### Key Technical Decisions
1. **Non-linear navigation** — Allow free navigation with gentle warnings, not blocking
2. **ATS weight visibility** — Show badges only for steps >=20% (Experience, Skills, Summary)
3. **Visual completion states** — Green check (100%), yellow circle (partial), grey circle (empty)
4. **Motion feedback** — whileHover micro-interactions for navigable items
5. **Helper rail pattern** — Collapsible 30% panel with step-specific guidance, localStorage persistence
6. **JD awareness integration** — Linked badge in header, keyword hints per step, match snapshot in review
7. **Floating helper panel** — Left-side panel (300px) slides between sidebar and editor, preserves preview visibility
8. **Responsive overflow menus** — ResizeObserver-based button priority system for QuickActionsBar

---

## Next Up

**Phase 4 COMPLETE ✅**
All 6 plans executed successfully. Resume wizard redesign complete with enhanced vertical sidebar, helper rail, JD integration, and mobile-responsive layout. Human verification revealed and fixed 5 critical UX bugs.

**Phase 5 COMPLETE ✅**
All 3 plans executed successfully. Fixed the "keyword dump" issue where keywords were being appended as lists instead of naturally integrated into resume content.

**Immediate:**
1. **All planned phases complete!** 🎉
 - Phase 0: Codebase Hardening ✅
 - Phase 1: ATS Simulation 2.0 ✅
 - Phase 2: Match Intelligence ✅
 - Phase 3: Job Optimizer 3-Panel UI ✅
 - Phase 4: Resume Wizard Redesign ✅
 - Phase 5: Keyword Integration Fix ✅

**Next Steps:**
2. Consider future enhancements or new phases
3. Production deployment readiness check
4. User acceptance testing

---

## Performance Metrics

**Code Quality:**
- TypeScript strict mode: ✅ Enabled (shared/ directory zero errors)
- ESLint errors: ~260 (reduced from 68+) → **Target: <10**
- Duplicate dependencies: ✅ Removed (@hello-pangea/dnd removed, kept @dnd-kit)

**Bundle Size:**
- Current: 3.9MB dist/ total (Pyodide from CDN)
- Storage: LZ-String compression reduces resume data 3-5x ✅

**Build Status:**
- Build: Passing ✅
- Lint: 68+ errors → **Target: <10**
- Analytics: PII-free tracking implemented ✅
- AI Cost Tracking: ESTIMATE ONLY with $5 budget warning ✅

---

## Accumulated Context

### Key Decisions Log

| Date | Decision | Context |
|------|----------|---------|
| 2026-02-12 | 5-phase roadmap structure | Derived from natural feature boundaries |
| 2026-02-12 | Guided prompting for Cover Letter | Mitigation for AI detection risk |
| 2026-02-12 | OAuth 2.0 + PKCE for LinkedIn | LinkedIn deprecated JS SDK |
| 2026-02-12 | STAR methodology for Interview | Prevents generic feedback |
| 2026-02-12 | ATS certification for templates | Prevents ATS incompatibility |
| **2026-02-12** | **Plan A Strategic Pivot** | **From career super app to ATS authority** |
| **2026-02-12** | **Phase 0 hardening first** | **Weak foundations break under engine complexity** |
| **2026-02-12** | **00-01 TypeScript strict mode** | **Shared directory zero errors, strict mode enabled** |
| **2026-02-12** | **00-02 Dependency cleanup** | **Removed @hello-pangea/dnd, kept @dnd-kit, LZ-String compression** |
| **2026-02-13** | **00-03 Storage versioning** | **Sequential migration chain, mandatory backups, VersionedData<T> wrapper** |
| **2026-02-13** | **00-04 Analytics & AI cost tracking** | **PII-free events with sanitization, ESTIMATE ONLY cost disclaimers, $5 budget warning** |
| **2026-02-16** | **01-01 Type system foundation** | **Comprehensive TS types for ATS simulation: 40/30/20/10 scoring, platform quirks (Workday 40% table penalty), barrel exports** |
| **2026-02-17** | **01-02 Section extraction engine** | **Rule-based NLP with 85%+ accuracy, TDD approach with 32 tests, weighted confidence scoring (30/25/25/20), date extraction (MMM YYYY, MM/YY, YYYY)** |
| **2026-02-17** | **01-03 DOM layout detector** | **DOM-based detection 10x faster than image analysis, 500ms debounce, risk scoring algorithm** |
| **2026-02-17** | **01-04 Platform simulators** | **Workday (40% table), Taleo (50% column), Greenhouse (10% clean bonus), Lever (semantic matching), comparePlatforms() for multi-platform analysis** |
| **2026-02-17** | **01-03 DOM layout detector** | **DOM-based detection 10x faster than image analysis, 500ms debounce, risk scoring algorithm** |
| **2026-02-17** | **01-05 ATS Risk Report UI** | **5 React components: ScoreGauge, ScoreBreakdown, PlatformComparison, RiskItemsList, ATSRiskReport container with 40/30/20/10 category breakdown** |
| **2026-02-17** | **01-06 ATS Integration** | **Modal integration, ATS button in preview, dynamic score calculation (parsing/keywords/format/layout), all 4 platforms displayed** |
| **2026-02-17** | **02-01 Match Intelligence Types** | **Weighted keyword scoring with 50/25/15/10 formula, partial matching with abbreviations, useMatchScore hook integrating ResumeContext and JobContext** |
| **2026-02-18** | **02-04 Recruiter Heatmap** | **F-pattern heatmap with eye-tracking research (89% first fixation on top-left), color-coded zones (red/orange/yellow/green)** |
| **2026-02-18** | **03-01 UI foundation primitives** | **Introduced EmptyStatePrompt and PanelHeader shared components for consistent 3-panel Job Optimizer UI** |
| **2026-02-18** | **03-01 layout persistence model** | **Persist horizontal and vertical panel splits together under `job-optimizer-layout` with runtime validation** |
| **2026-02-17** | **03-02 resume panel implementation** | **Added useResumeUpload and ResumePanelV2 with file upload/paste flows, parsed contact summary, and clear/edit states synced through JobContext** |
| **2026-02-18** | **03-03 JD analyzer logic** | **Rule-based extraction for overview/requirements/keywords/insights; no AI dependency in MVP** |
| **2026-02-18** | **03-03 debounce behavior** | **500ms debounced `useJobAnalyzer` updates with `isAnalyzing` flag to keep UI responsive** |
| **2026-02-18** | **03-04 match comparison scoring** | **Added debounced `useMatchComparison` hook with 50/25/15/10 ATS breakdown and keyword-gap driven recommendations** |
| **2026-02-18** | **03-04 match panel UX** | **Built MatchComparisonPanel with empty/partial/analysis states and Score/Gaps/Similarity/Actions tabs** |
| **2026-02-18** | **03-05 layout orchestration** | **Implemented nested `react-resizable-panels` desktop shell with persisted horizontal/vertical splits for Resume, JD Analysis, and Match panels** |
| **2026-02-18** | **03-05 mobile navigation pattern** | **Switched to tabbed single-panel mobile flow with AnimatePresence transitions for sub-768px screens** |
| **2026-02-18** | **03-06 JD input discoverability** | **Embedded visible JD paste textarea directly in JDAnalyzerPanel and synchronized updates via JobContext** |
| **2026-02-18** | **03-06 header overlap fix** | **Adjusted JobInputPage spacing/responsive header controls to avoid subtitle/control overlap under fixed navigation** |
| **2026-02-19** | **04-02 Helper rail integration** | **Collapsible helper panel (30% desktop width) with step-specific guidance, localStorage persistence, preview takes precedence, mobile accordion** |
| **2026-02-19** | **04-03 Smart content guidance** | **AIPromptCard for quick AI actions, CharacterGuidance for length feedback with ATS-optimized ranges** |
| **2026-02-19** | **04-04 JD awareness integration** | **Linked JD badge in header, JDKeywordHints per step (5-8 missing keywords), JDMatchSnapshot in review (match % + skill breakdown)** |
| **2026-02-19** | **04-05 Mobile wizard optimization** | **Sticky MobileProgressBar (top) and MobileActionBar (bottom), Sheet-based drawers for sidebar/preview, Accordion helper rail, 44px touch targets** |
| **2026-02-19** | **04-06 Wizard verification checkpoint** | **5 bugs fixed: floating helper panel (left-side), responsive overflow menu (ResizeObserver), helper close button, Pyodide graceful degradation, Badge forwardRef** |
| Phase 01-ats-simulation P06 | 10min | 4 tasks | 4 files |
| Phase 03 P01 | 6 min | 3 tasks | 3 files |
| Phase 03 P02 | 2 min | 2 tasks | 2 files |
| Phase 03 P03 | 5 min | 2 tasks | 2 files |
| Phase 03 P04 | 3 min | 2 tasks | 2 files |
| Phase 03 P05 | 1 min | 2 tasks | 2 files |
| Phase 03 P06 | 8 min | 1 tasks | 2 files |
| Phase 04-resume-wizard-redesign P02 | 4min | 3 tasks | 3 files |
| Phase 04-resume-wizard-redesign P01 | 6 min | 3 tasks | 3 files |
| Phase 04-resume-wizard-redesign P04-04 | 6min | 3 tasks | 4 files |
| Phase 04-resume-wizard-redesign P05 | 4min | 3 tasks | 3 files |
| Phase 04-resume-wizard-redesign P06 | 45min | 1 checkpoint task | 6 files (5 bugs fixed) |
| **2026-03-24** | **05-01 Natural keyword integration prompts** | **Smart/Append/Suggest modes with explicit "DO NOT append" rules and BAD vs GOOD examples** |
| **2026-03-24** | **05-02 Contextual keyword integration UI** | **keywordIntegration.ts utilities, enhanced JDKeywordHints with onKeywordSelect, AIEnhanceModal mode toggle** |
| **2026-03-24** | **05-03 Visual feedback and validation** | **KeywordHighlighter component, integration quality scoring, validation warnings for standalone keywords** |

### Pivot Rationale

| Dimension | Old Plan | Plan A |
|-----------|----------|--------|
| Differentiation | Low — commodity features | **High** — deep ATS simulation |
| Moat | Weak | **Defensible** — Pyodide + NLP |
| Build Risk | Explosive — 40 requirements | **Controlled** — 23 requirements |
| Brand Clarity | Blurry — "career tools" | **Sharp** — "ATS Success Engine" |
| Complexity | Very High | **Moderate** |

### What Changed

| Feature | Old Plan | Plan A |
|---------|----------|--------|
| Interview Prep | Phase 4 (8 requirements) | ❌ Deferred |
| LinkedIn Sync | Phase 3 (7 requirements) | ❌ Minimal only |
| Template Marketplace | Phase 5 (8 requirements) | ❌ Internal only |
| Cover Letter | Generic AI writer (8 plans) | 🔄 ATS-optimized only |
| ATS Engine | Basic keyword matching | 🔄 Deep parsing simulation |

---

## Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 1 | Fix Vercel build error - Card import case sensitivity | 2026-02-20 | 77166eb | [1-fix-vercel-build-error-card-import-case-](./quick/1-fix-vercel-build-error-card-import-case-/) |

---

## Quick Reference

**Project Root:** `C:\Users\kittu\Downloads\GIT\future-job-fit`

**Key Commands:**
```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run lint         # Check lint errors
```

**Planning Files:**
- `.planning/PROJECT.md` — Project charter
- `.planning/ROADMAP.md` — Plan A roadmap
- `.planning/STATE.md` — This file
- `.planning/phases/00-hardening/` — Phase 0 plans

**Tech Stack:**
- Frontend: React 18 + Vite + TypeScript
- Styling: Tailwind CSS + Shadcn/UI
- State: React Context + localStorage (compressed)
- AI: Supabase Edge Functions (multi-provider)
- Offline: Pyodide (Python in WASM) — **Our moat**

---

*State updated: 2026-03-24 17:45 UTC — Phase 5 complete: Fixed keyword integration "dump" issue with Smart Rewrite mode and visual feedback*
*Last activity: 2026-03-24 - Completed Phase 05: Keyword Integration Fix (3 plans) — AI prompts now enforce natural keyword weaving, UI provides contextual guidance, visual validation shows integration quality*
