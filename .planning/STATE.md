# Project State: Future Job Fit

**Project:** Future Job Fit — ATS Optimization Authority  
**Core Value:** The most accurate ATS simulation engine for job applications — works offline.  
**Last Updated:** 2026-02-12  
**Strategy:** Plan A (Pivot from Career Super App)

---

## Strategic Pivot ✓

**From:** Career super app (40 requirements, 5 phases, feature buffet)  
**To:** ATS optimization authority (23 requirements, 4 phases, deep precision)

**Why:** Defensible moat (Pyodide), differentiated positioning, focused execution, clearer monetization.

**Competitive tier:** Workday, Taleo, Greenhouse, Lever — NOT Kickresume, Canva, Enhancv.

---

## Current Position

**Current Phase:** Phase 0 — Codebase Hardening  
**Status:** 🔵 Ready to Execute — 4 plans prepared

```
Progress: [░░░░░░░░░░] 0% (0/23 requirements)
Phase 0:  [░░░░░░░░░░] 0% (0/4 plans complete)
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

**Phase 1 Foundation (Pre-Pivot - In Progress):**
- ✅ Plan 01-01: JobContext state management (COMPLETE)
- ✅ Plan 01-02: Type Definition & Validation Layer (COMPLETE)
- ⏳ Plans 01-03 through 01-05: On hold pending Phase 0 completion

**Strategic Pivot (Plan A):**
- ✅ New roadmap created (4 phases, focused scope)
- ✅ Phase 0 plans created (4 hardening plans)
- ✅ Old 02-cover-letter plans archived (8 plans from career super app direction)

---

## New Roadmap (Plan A)

| Phase | Goal | Requirements | Status |
|-------|------|--------------|--------|
| 0 — Hardening | Stabilize codebase for engine complexity | 7 | 🔵 Ready |
| 1 — ATS Simulation 2.0 | Deep parsing simulation engine | 8 | ⚪ Planned |
| 2 — Match Intelligence | Advanced analytics dashboard | 8 | ⚪ Planned |
| 3 — Cover Letter Optimizer | ATS-focused letter optimization | 6 | ⚪ Planned |

**Deferred to v2:**
- Interview Preparation (was Phase 4)
- LinkedIn Sync beyond minimal onboarding
- Template Marketplace beyond internal templates

---

## Phase 0: Codebase Hardening (Ready to Execute)

**Goal:** Prepare foundation for ATS engine complexity. Weak foundations break under precision requirements.

### Plans
- [ ] 00-01-PLAN.md — TypeScript strict mode & lint cleanup
- [ ] 00-02-PLAN.md — Dependency cleanup & storage compression
- [ ] 00-03-PLAN.md — Storage versioning & migration system
- [ ] 00-04-PLAN.md — Analytics & AI cost monitoring

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

## Next Up

**Immediate:**
1. Execute Phase 0 (Codebase Hardening) → `/gsd-execute-phase 00-hardening`
   - 4 plans in Wave 1 (parallel execution)
   - 2-week target

**Soon:**
2. Plan Phase 1 (ATS Simulation 2.0)
3. Plan Phase 2 (Match Intelligence)
4. Plan Phase 3 (Cover Letter Optimizer)

---

## Performance Metrics

**Code Quality:**
- TypeScript strict mode: Disabled (noImplicitAny: false) → **Target: Enabled**
- ESLint errors: 68+ across 18 files → **Target: <10**
- Known issues: Duplicate dependencies → **Target: Removed**

**Bundle Size:**
- Current: 2MB+ (includes Pyodide) → **Target: <1.8MB (10% reduction)**

**Build Status:**
- Build: Passing
- Lint: 68+ errors → **Target: <10**

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

*State updated: 2026-02-12 — Plan A Pivot*  
*Next update: After Phase 0 Wave 1 completion*
