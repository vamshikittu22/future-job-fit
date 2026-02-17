# Project Roadmap: Future Job Fit — Plan A

**Strategy:** ATS Optimization Authority  
**Last Updated:** 2026-02-12  
**Positioning:** "The most accurate ATS simulation engine for job applications — works offline."

---

## Strategic Pivot

**From:** Career super app (resume + cover letter + interview + LinkedIn + templates)  
**To:** ATS optimization authority (deep simulation + match intelligence + optimized cover letter)

**Why:** Defensible moat (Pyodide offline ATS), differentiated positioning, focused execution, clearer monetization.

---

## Core Value Proposition

> We simulate exactly how ATS systems will read your resume — not just generate content.

**Competitive tier:** Workday, Taleo, Greenhouse, Lever — NOT Kickresume, Canva, Enhancv.

---

## Phase Structure (Plan A)

| Phase | Goal | Duration | Key Deliverable | Status |
|-------|------|----------|-----------------|--------|
| 0 — Hardening | Stabilize codebase for engine complexity | 2 weeks | Clean foundation, strict mode, storage compression | ✅ Complete |
| 1 — ATS Simulation 2.0 | Deep parsing simulation | 3 weeks | ATS Risk Report with layout detection | 🔵 Next |
| 2 — Match Intelligence | Advanced analytics dashboard | 3 weeks | Match score breakdown with heatmap | ⚪ Planned |
| 3 — Cover Letter Optimizer | ATS-focused letter optimization | 2 weeks | JD-mapped variant generator | ⚪ Planned |

**Total:** ~10 weeks to MVP  
**Deferred:** Interview Prep, LinkedIn Sync (minimal only), Template Marketplace (internal only)

---

## Phase 0: Codebase Hardening ✅ COMPLETE (2026-02-13)

**Goal:** Prepare foundation for ATS engine complexity. Weak foundations break under precision requirements.

### Requirements
| ID | Requirement | Status |
|----|-------------|--------|
| HARD-01 | TypeScript strict mode enabled incrementally | ✅ Complete |
| HARD-02 | Lint errors reduced to <10 | ✅ Complete |
| HARD-03 | Duplicate dependencies removed (@dnd-kit + @hello-pangea/dnd) | ✅ Complete |
| HARD-04 | Storage compression layer implemented | ✅ Complete |
| HARD-05 | Storage versioning system introduced | ✅ Complete |
| HARD-06 | Analytics stub added | ✅ Complete |
| HARD-07 | AI usage cost monitor implemented | ✅ Complete |

### Success Criteria — ALL ACHIEVED ✅
1. ✅ `npm run lint` returns <10 errors
2. ✅ `npm run build` passes with strict mode enabled
3. ✅ Resume storage uses compression (lz-string or similar)
4. ✅ Storage schema versioning prevents data loss on updates
5. ✅ Analytics events captured (Mixpanel/Amplitude stubs)
6. ✅ AI cost tracking visible in dev tools

---

## Phase 1: ATS Simulation 2.0

**Goal:** Transform from "keyword matcher" to "ATS simulator" with parsing accuracy.

### Requirements
| ID | Requirement |
|----|-------------|
| ATS2-01 | Section parsing accuracy simulation (experience, education, skills extraction) |
| ATS2-02 | Field extraction confidence scoring |
| ATS2-03 | Header/footer detection warnings |
| ATS2-04 | Table detection penalty scoring |
| ATS2-05 | Column layout detection |
| ATS2-06 | ATS Risk Report with visual breakdown |
| ATS2-07 | ATS compatibility badge logic (95/100, 85/100, etc.) |
| ATS2-08 | Comparison: "How Workday reads this" vs "How Lever reads this" |

### Success Criteria
1. User sees "ATS Risk Report" with parsing confidence per section
2. Layout risks flagged (tables, columns, headers) with severity
3. ATS compatibility score reflects actual parsing behavior
4. Score breakdown: Parsing 40%, Keywords 30%, Format 20%, Layout 10%
5. Export includes ATS-optimized version (plain text extraction)

---

## Phase 2: Match Intelligence Dashboard

**Goal:** Upgrade from "keyword overlap" to "application performance analytics."

### Requirements
| ID | Requirement |
|----|-------------|
| MATCH-01 | Weighted keyword scoring (required vs preferred) |
| MATCH-02 | Skill clustering visualization |
| MATCH-03 | Missing competency identification |
| MATCH-04 | Semantic similarity scoring |
| MATCH-05 | Recruiter scanning heatmap (F-pattern simulation) |
| MATCH-06 | Impact improvement recommendations |
| MATCH-07 | Competency gap analysis |
| MATCH-08 | Side-by-side resume vs JD comparison view |

### Success Criteria
1. Match score shows weighted breakdown, not just percentage
2. Heatmap shows where recruiter attention goes (F-pattern)
3. Missing competencies ranked by importance
4. Recommendations specific: "Add 'Kubernetes' to skills section"
5. Comparison view highlights keyword matches visually

---

## Phase 3: Cover Letter Optimizer

**Goal:** ATS-focused cover letter — not generic AI writer.

### Requirements
| ID | Requirement |
|----|-------------|
| COVER-01 | JD diff analyzer (extract top 3 differentiators) |
| COVER-02 | Achievement mapping engine (resume → letter) |
| COVER-03 | Variant generation focused on: Technical impact, Cultural alignment, Leadership narrative |
| COVER-04 | ATS scoring for cover letter (format, length, keyword integration) |
| COVER-05 | Cover letter exports to PDF/DOCX/TXT |
| COVER-06 | Integration with Match Intelligence (uses same JD analysis) |

### Out of Scope (Plan A)
- Generic AI generation without JD mapping
- Rich text editing (plain text optimization focus)
- Version history (defer to v2)
- Guided prompting wizard (replaced by JD analysis)

### Success Criteria
1. Cover letter generated from mapped achievements to JD differentiators
2. 3 variants with distinct narrative angles
3. ATS score for letter: format compliance, length (250-400 words), keyword integration
4. Exports to PDF/DOCX/TXT with proper business letter formatting
5. Uses same Match Intelligence engine as resume optimization

---

## What We Removed

| Feature | Old Plan | Plan A |
|---------|----------|--------|
| Interview Prep | Phase 4 (8 requirements) | ❌ Deferred to v2 |
| LinkedIn Sync | Phase 3 (7 requirements) | ❌ Minimal onboarding only |
| Template Marketplace | Phase 5 (8 requirements) | ❌ Internal templates only |
| Cover Letter (generic) | 8 plans, rich editor | 🔄 ATS-optimized only |
| Multi-variant comparison | Tabbed/side-by-side | 🔄 Narrative angle variants |

**Requirements reduced:** 40 → ~23  
**Focus increased:** 10x

---

## Technical Moat

**Pyodide offline ATS simulation:**
- Works without internet (privacy-first)
- Simulates real ATS parsing behavior
- Rare in market (most tools use simple keyword matching)
- Defensible: requires NLP + layout analysis expertise

---

## Monetization (Plan A)

**Free:**
- Basic ATS score
- Basic match report
- Plain text ATS extraction

**Pro ($12/month):**
- Advanced ATS Risk Report
- Competency gap analysis
- Optimization recommendations
- Recruiter heatmap
- Cover letter optimizer
- ATS audit for multiple job applications

---

## Why Plan A Wins

| Dimension | Plan A | Career Super App |
|-----------|--------|------------------|
| Differentiation | **High** — nobody simulates ATS deeply | Low — commodity features |
| Moat | **Defensible** — Pyodide + NLP expertise | Weak — easy to copy |
| Build Risk | **Controlled** — focused scope | Explosive — 40 requirements |
| Brand Clarity | **Sharp** — "ATS Success Engine" | Blurry — "career tools" |
| Technical Debt | **Manageable** | Explosive |
| Monetization | **Clear value→price alignment** | Feature bundle confusion |

---

## Success Metrics

**Month 1 (After Phase 1):**
- ATS Risk Report completion rate >60%
- Average session time >5 minutes

**Month 3 (After Phase 3):**
- Cover letter optimizer usage >40% of users
- Pro conversion rate >5%
- NPS >40

**Month 6:**
- "ATS simulation" search ranking top 10
- Organic growth >50% of new users

---

## Anti-Goals (What We Don't Build)

❌ AI content generator competing with ChatGPT  
❌ Interview voice bots  
❌ LinkedIn automation (violates ToS)  
❌ Template marketplace (Etsy for resumes)  
❌ Job board integrations  
❌ Real-time collaboration  
❌ Mobile native apps (PWA sufficient)

---

*Roadmap v2.0 — Plan A pivot: 2026-02-12*  
*Next: Phase 0 planning (Codebase Hardening)*
