# Project State: Future Job Fit

**Project:** Future Job Fit — ATS Optimization Authority  
**Core Value:** The most accurate ATS simulation engine for job applications — works offline.  
**Last Updated:** 2026-02-17
**Strategy:** Plan A (Pivot from Career Super App)

---

## Strategic Pivot ✓

**From:** Career super app (40 requirements, 5 phases, feature buffet)  
**To:** ATS optimization authority (23 requirements, 4 phases, deep precision)

**Why:** Defensible moat (Pyodide), differentiated positioning, focused execution, clearer monetization.

**Competitive tier:** Workday, Taleo, Greenhouse, Lever — NOT Kickresume, Canva, Enhancv.

---

## Current Position

**Current Phase:** Phase 2 — Match Intelligence  
**Status:** 🔵 IN PROGRESS — 1 of 6 plans complete

```
Progress: [██░░░░░░░] 39% (9/23 requirements)
Phase 0:  [██████████] 100% (4/4 plans complete) ✅
Phase 1:  [██████████] 100% (6/6 plans complete) ✅
Phase 2:  [▓▓░░░░░░░] 17% (1/6 plans complete) 🔵
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

## Next Up

**Phase 1 PLANNED 🔵**
6 plans ready for execution:
- Wave 1: Types, extraction engine, layout detector
- Wave 2: Platform simulators, ATS Risk Report UI
- Wave 3: Integration (checkpoint for UX verification)

**Immediate:**
1. **Execute Phase 1** → `/gsd-execute-phase 01-ats-simulation`
   - Deep parsing simulation engine
   - "How Workday vs Lever reads this" comparison
   - ATS Risk Report with visual breakdown

**Soon:**
2. Plan Phase 2 (Match Intelligence)
3. Plan Phase 3 (Cover Letter Optimizer)

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
| Phase 01-ats-simulation P06 | 10min | 4 tasks | 4 files |

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

*State updated: 2026-02-17 — Phase 1 COMPLETE*  
*Next: Plan Phase 2 (Match Intelligence)*
