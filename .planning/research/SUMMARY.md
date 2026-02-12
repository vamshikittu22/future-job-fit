# Project Research Summary

**Project:** Future Job Fit — AI Career Intelligence Platform  
**Domain:** AI-powered career tools (Resume Builder, Cover Letter, LinkedIn Sync, Interview Prep, Template Marketplace)  
**Researched:** February 11-12, 2026  
**Confidence:** HIGH (verified with official sources, current package registries, and domain experts)

---

## Executive Summary

Future Job Fit is an AI-powered career intelligence platform that extends an existing React + Supabase resume builder with four new capabilities: Cover Letter Generation, LinkedIn Profile Sync, Interview Preparation, and Template Marketplace. Research confirms the platform should build on its existing Feature-Sliced Design architecture while introducing privacy-first, local-storage-based data handling that differentiates it from cloud-centric competitors.

The recommended approach follows a phased rollout starting with foundational shared infrastructure (JobContext), then building Cover Letter Generation which leverages existing AI infrastructure with minimal new dependencies. LinkedIn Sync comes next with careful OAuth scope validation to avoid permission wall pitfalls. Interview Preparation and Template Marketplace follow, each with specific anti-patterns to avoid based on competitive research.

Critical risks center on AI detection concerns (95% of Fortune 500 companies now use AI detection tools), LinkedIn API permission restrictions, and maintaining ATS compatibility in template marketplace submissions. Mitigation strategies include guided prompt workflows (not one-click generation), verifying OAuth scopes before building, and implementing ATS certification for all marketplace templates.

---

## Key Findings

### Recommended Stack

The existing React + Vite + Supabase + Pyodide foundation is solid. Research identifies targeted additions for each new feature domain without architectural disruption. All additions are actively maintained with strong community support.

**Core technologies to add:**

| Technology | Purpose | Why Recommended |
|------------|---------|-----------------|
| `@react-pdf/renderer` ^4.3.2 | Cover letter PDF generation | Already proven in codebase; consistent API with resume generation |
| `mammoth` ^1.11.0 | DOCX import for existing cover letters | Most reliable browser-based DOCX→HTML parser |
| `jose` ^5.9.6 | JWT verification for LinkedIn OAuth | Lightweight, modern JWT library for browser and Edge Functions |
| `zustand` ^5.0.3 | Interview prep state management | Better than Context for complex flows; persists to localStorage |
| `immer` ^10.1.1 | Immutable template state updates | Industry standard; prevents accidental mutations |

**Architecture decisions:**
- LinkedIn integration uses native OAuth 2.0 + PKCE (no SDK — LinkedIn deprecated JS SDK in 2023)
- Interview module uses Supabase Realtime for presence + Zustand for state
- Template marketplace built on Supabase Storage + RLS (custom implementation, not third-party platform)

---

### Expected Features

Research analyzed competitive landscape (Resumly.ai, Kickresume, Enhancv, OfferGenie, Revarta, Canva) to identify user expectations and differentiation opportunities.

**Must have (table stakes):**
- Cover Letter: Job-resume matching, ATS keyword optimization, multiple tone options, PDF/DOCX export, editable output
- LinkedIn Sync: One-click import, data field mapping, profile URL input, selective import
- Interview Prep: Behavioral question bank (50+ questions minimum), resume-based question generation, AI-generated sample answers, practice mode
- Template Marketplace: Category browsing, preview functionality, one-click apply, ATS-friendly tags, free tier availability

**Should have (competitive differentiators):**
- Cover Letter: Story injection prompts (avoid AI detection), culture fit analysis, version comparison
- LinkedIn Sync: Profile optimization tips, gap analysis
- Interview Prep: STAR method coach, performance analytics, salary negotiation scripts
- Template Marketplace: AI template customization, dynamic color theming

**Defer to v2+:**
- Voice/video mock interviews (high complexity, validate demand first)
- Bidirectional LinkedIn sync (requires partner program approval)
- Peer practice matching (community feature)
- Template revenue sharing (defer creator payouts)
- Real-time interview assistance (ethical concerns)

**Anti-features (explicitly avoid):**
- Fully automated LinkedIn posting (violates ToS)
- Bulk connection request automation (account ban risk)
- Generic cover letter templates (recruiters spot immediately)
- Resume "spin" that falsifies experience (ethical liability)
- Interview answer cheating during live interviews

---

### Architecture Approach

Research recommends maintaining Feature-Sliced Design (FSD) principles with each new feature as a self-contained domain in `src/features/`. This enables feature isolation while sharing contracts through `shared/`.

**Major components:**

1. **Cover Letter Domain** (`src/features/cover-letter/`)
   - Components: generator workflow, editor, preview
   - Context: CoverLetterContext for letter state
   - Service: coverLetterAI.ts extending existing AI gateway

2. **LinkedIn Sync Domain** (`src/features/linkedin-sync/`)
   - Components: OAuth flow UI, sync controls, import panel
   - Service: linkedinAPI.ts with Edge Function for token exchange
   - Critical: OAuth via PKCE flow (Client Secret stays server-side)

3. **Interview Prep Domain** (`src/features/interview-prep/`)
   - Components: simulator, question bank, progress tracking, feedback display
   - State: Zustand store (better than Context for frequent updates)
   - Uses: Supabase Realtime for presence tracking

4. **Template Marketplace Domain** (`src/features/template-marketplace/`)
   - Components: browse grid, detail view, upload workflow, ratings
   - Storage: Supabase Storage with RLS policies
   - Schema: templates, user_templates, template_reviews tables

**Cross-feature integration patterns:**
- JobContext (shared) — required by Cover Letter and Interview Prep
- Context Bridge hooks — for Resume ↔ Job data combination
- Event bus for loose coupling — Resume builder emits, other features listen

---

### Critical Pitfalls

Research identified five critical pitfalls with specific prevention strategies:

1. **AI Detection Death Penalty in Cover Letters**
   - 95% of Fortune 500 companies use AI detection tools
   - **Prevention:** Guided prompt engineering (not one-click generation), multi-variant output (3-4 different approaches), humanization layer with explicit coaching

2. **LinkedIn API Permission Walls**
   - Default OAuth only provides basic profile (name, email); useful data requires partner program applications
   - **Prevention:** Scope audit before building, graceful degradation design, clear user communication about limitations

3. **Privacy Violations and Compliance**
   - GDPR violations can result in 4% global revenue fines; third-party AI services may train on user data
   - **Prevention:** Data minimization (only send necessary data to AI), local-first architecture, transparent consent, automated deletion workflows

4. **Interview Feedback Users Distrust**
   - Generic AI feedback ("speak more confidently") is dismissed; users abandon feature after 1-2 attempts
   - **Prevention:** Structured frameworks (STAR method, specific rubrics), human-in-the-loop validation, specificity over generalities

5. **Template Marketplace Breaking ATS Compatibility**
   - Third-party templates introduce graphics, tables, columns that ATS can't parse
   - **Prevention:** ATS certification badge for every template, ATS score preview before download, creator guidelines mandating ATS-friendly requirements

---

## Implications for Roadmap

Based on combined research, recommended phase structure:

### Phase 1: Foundation & Shared Infrastructure
**Rationale:** JobContext is required by both Cover Letter and Interview Prep; establishes cross-feature data contracts  
**Delivers:** JobContext for job description state, shared type definitions (coverLetter, interview, linkedin), API service stubs  
**Duration:** 1-2 weeks  
**Risk level:** LOW — standard patterns  
**Research Flag:** Standard patterns, skip phase research

### Phase 2: Cover Letter Generator
**Rationale:** Builds heavily on existing AI infrastructure; shares patterns with Interview Prep; high user value  
**Delivers:** Cover letter generation workflow, job-resume matching, ATS keyword optimization, multi-variant output, PDF/DOCX export  
**Uses:** `@react-pdf/renderer`, `mammoth`  
**Avoids:** AI detection pitfalls via guided prompts and multi-variant generation  
**Duration:** 2-3 weeks  
**Risk level:** MEDIUM — AI detection concerns  
**Research Flag:** May need `/gsd-research-phase` for AI prompt engineering optimization

### Phase 3: LinkedIn Profile Sync
**Rationale:** OAuth patterns established; can leverage existing import logic; lower priority than Cover Letter  
**Delivers:** OAuth 2.0 + PKCE flow, profile data import, selective field mapping, resume data merge  
**Uses:** `jose` for JWT verification, Supabase Edge Function for token exchange  
**Avoids:** Permission wall pitfalls via scope audit and graceful degradation  
**Duration:** 2 weeks  
**Risk level:** MEDIUM-HIGH — LinkedIn API restrictions  
**Research Flag:** **Requires `/gsd-research-phase`** — must verify OAuth scopes and partner program requirements before building

### Phase 4: Interview Preparation Module
**Rationale:** Most complex feature; builds on JobContext and AI patterns from Cover Letter; validates demand with text-first approach  
**Delivers:** Question bank (100+ behavioral), resume-based question generation, sample answer generation, text-based practice mode, progress tracking  
**Uses:** `zustand` for state, Supabase Realtime for presence  
**Avoids:** Feedback distrust via structured frameworks and specificity  
**Duration:** 3-4 weeks  
**Risk level:** HIGH — voice features deferred, but text feedback quality critical  
**Research Flag:** May need `/gsd-research-phase` for feedback quality validation

### Phase 5: Template Marketplace
**Rationale:** Most independent feature; relies only on ResumeContext for uploads; can launch with curated content  
**Delivers:** Template browsing, preview, one-click apply, 20+ curated team-created templates, rating system foundation  
**Uses:** `immer` for immutable updates, Supabase Storage + RLS  
**Avoids:** ATS incompatibility via certification pipeline  
**Duration:** 2-3 weeks  
**Risk level:** MEDIUM — quality control and ATS validation  
**Research Flag:** May need `/gsd-research-phase` for ATS compatibility testing infrastructure

### Phase 6: Integration & Polish
**Rationale:** Cross-feature navigation, unified dashboard, shared analytics  
**Delivers:** Unified user dashboard, cross-feature navigation, shared analytics, performance optimization  
**Duration:** 1-2 weeks  
**Risk level:** LOW — integration work  
**Research Flag:** Standard patterns, skip phase research

---

### Phase Ordering Rationale

1. **JobContext first** — Required dependency for both Cover Letter and Interview Prep
2. **Cover Letter before Interview** — Shares AI prompt patterns; establishes context usage patterns
3. **LinkedIn after Cover Letter** — Lower priority feature; can leverage established OAuth patterns
4. **Marketplace last** — Most independent; relies only on ResumeContext; benefits from established patterns

**Pitfall avoidance in ordering:**
- AI detection risk addressed in Phase 2 (Cover Letter) with guided prompts
- LinkedIn permission risk addressed in Phase 3 with scope verification before building
- Interview feedback quality risk addressed in Phase 4 with structured frameworks
- Template ATS risk addressed in Phase 5 with certification pipeline

---

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 3 (LinkedIn Sync):** OAuth scope verification, partner program requirements — may need API access validation
- **Phase 4 (Interview Prep):** Feedback quality validation — may need career coach consultation
- **Phase 5 (Template Marketplace):** ATS compatibility testing — may need access to ATS parsing tools

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation):** Standard FSD patterns, Context setup — well-documented
- **Phase 2 (Cover Letter):** Builds on existing AI infrastructure — patterns established
- **Phase 6 (Integration):** Standard integration work — no novel domain

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| **Stack** | HIGH | Verified with npm registry (current as of Feb 2026), official docs |
| **Features** | MEDIUM-HIGH | Multiple competitive sources agree; LinkedIn API uncertainty lowers slightly |
| **Architecture** | HIGH | FSD principles well-established; Supabase patterns documented |
| **Pitfalls** | HIGH | Multiple verified sources (2025-2026); official LinkedIn API docs |

**Overall confidence:** HIGH

---

### Gaps to Address

1. **LinkedIn API v2/v3 specific capabilities** — Need to verify exact scopes available without partner program; may affect feature scope
   - **Action:** Test OAuth flow with real LinkedIn app before Phase 3 planning

2. **Voice synthesis quality/cost** — WebSearch-only data for TTS services; voice features deferred but need pricing for future planning
   - **Action:** Research during Phase 4 if voice features prioritized for v2

3. **ATS compatibility testing infrastructure** — Need access to ATS parsing tools (Workday, Taleo, Greenhouse) for template certification
   - **Action:** Identify testing approach during Phase 5 planning

4. **AI generation cost modeling** — Cover letters longer than resume bullets; may impact unit economics
   - **Action:** Implement usage tracking in Phase 2; model costs before scaling

5. **User trust metrics for interview feedback** — No sources on what drives long-term engagement with AI coaching
   - **Action:** Build analytics into Phase 4; validate with user testing

---

## Sources

### Primary (HIGH confidence)
- LinkedIn API Documentation (Microsoft Learn) — OAuth 2.0 flow, scope requirements
- npm @react-pdf/renderer — v4.3.2 verified current (Feb 2026)
- npm mammoth — v1.11.0 verified latest
- Feature-Sliced Design Documentation — architecture patterns
- Supabase Documentation — Storage, Realtime, RLS policies
- Supabase Security Retro 2025 — security best practices

### Secondary (MEDIUM confidence)
- Resumly.ai — "Ultimate Guide to Using an AI Cover Letter Generator" (2025)
- Piktochart — "5 Best AI Cover Letter Generators of 2025"
- Enhancv — LinkedIn Resume Builder capabilities
- Kickresume — "Create Resume from LinkedIn" (2025)
- OfferGenie.ai — Mock interview tools landscape
- Revarta.com — AI Interview Prep Platforms 2025
- Canva — Resume template marketplace patterns (20,000+ templates)
- CNBC Make It — "No. 1 mistake job seekers are making in 2025"
- Coursera — "5 AI Cover Letter Red Flags Recruiters Spot Fast"

### Tertiary (LOW confidence / needs validation)
- LinkedIn Partner Program success rates and timelines
- Voice synthesis vendor pricing for future interview features
- User retention data for AI interview coaching tools

---

*Research completed: February 12, 2026*  
*Ready for roadmap: YES*
