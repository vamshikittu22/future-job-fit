# Project Roadmap: Future Job Fit

**Last Updated:** 2026-02-12
**Depth:** Standard (5 phases)
**Coverage:** 40/40 v1 requirements mapped ✓

---

## Overview

This roadmap delivers four major new capabilities to the AI-powered career intelligence platform: Cover Letter Generation, LinkedIn Profile Sync, Interview Preparation, and Template Marketplace. Phases are derived from natural feature boundaries and dependency chains — Foundation infrastructure enables dependent features, each phase delivers a complete, verifiable user capability.

---

## Phase Structure

| Phase | Goal | Requirements | Success Criteria |
|-------|------|--------------|------------------|
| 1 - Foundation | Shared infrastructure and cross-feature data layer established | FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05 | 4 criteria |
| 2 - Cover Letter Generator | Users can create tailored cover letters matched to job descriptions | COVER-01, COVER-02, COVER-03, COVER-04, COVER-05, COVER-06, COVER-07, COVER-08 | 5 criteria |
| 3 - LinkedIn Profile Sync | Users can import profile data from LinkedIn to accelerate resume building | LINKED-01, LINKED-02, LINKED-03, LINKED-04, LINKED-05, LINKED-06, LINKED-07 | 5 criteria |
| 4 - Interview Preparation | Users can practice role-specific interview questions with AI feedback | INTERV-01, INTERV-02, INTERV-03, INTERV-04, INTERV-05, INTERV-06, INTERV-07, INTERV-08 | 5 criteria |
| 5 - Template Marketplace | Users can browse, preview, and apply professional resume templates | MARKET-01, MARKET-02, MARKET-03, MARKET-04, MARKET-05, MARKET-06, MARKET-07, MARKET-08 | 5 criteria |

---

## Phase 1: Foundation & Infrastructure

**Goal:** Establish shared data layer and cross-feature infrastructure required by Cover Letter and Interview Prep features.

### Dependencies
None — foundation phase

### Requirements
| ID | Requirement |
|----|-------------|
| FOUND-01 | JobContext state management for job-specific data (job description, target role, company info) |
| FOUND-02 | Shared types for cover letter, interview, and LinkedIn data structures |
| FOUND-03 | API service stubs for LinkedIn OAuth and profile operations |
| FOUND-04 | Updated navigation structure with new feature routes |
| FOUND-05 | Cross-feature data bridge (ResumeContext ↔ JobContext integration) |

### Success Criteria
1. JobContext is available application-wide and persists job description, target role, and company information to localStorage
2. TypeScript types exist for CoverLetter, InterviewQuestion, InterviewSession, LinkedInProfile, and LinkedInOAuthResponse
3. Navigation includes routes for /cover-letter, /interview-prep, /linkedin-sync, and /templates with working links
4. Resume data can be read from ResumeContext and combined with JobContext data for AI prompts
5. All foundation code passes TypeScript compilation with no new errors

---

## Phase 2: Cover Letter Generator

**Goal:** Users can create professional, ATS-optimized cover letters tailored to specific job descriptions with multiple variants and export options.

### Dependencies
- Phase 1 (Foundation) — requires JobContext and shared types

### Requirements
| ID | Requirement |
|----|-------------|
| COVER-01 | User can input job description and target company information |
| COVER-02 | System generates 3 variant cover letters from resume + job data |
| COVER-03 | AI generation includes guided prompting (not raw generation) |
| COVER-04 | User can edit generated cover letter with rich text editor |
| COVER-05 | System provides ATS compatibility score for cover letter |
| COVER-06 | User can export cover letter as PDF, DOCX, and TXT |
| COVER-07 | Cover letters are saved to localStorage with version history |
| COVER-08 | Multi-variant comparison view (side-by-side or tabbed) |

### Success Criteria
1. User can enter job description and company information, and the system stores this in JobContext
2. AI generates 3 distinct cover letter variants combining resume data and job description
3. Generation uses guided prompting workflow (user answers 2-3 questions before generation)
4. User can edit generated cover letters with a rich text editor (bold, italic, lists, paragraphs)
5. System displays ATS score for cover letter with specific improvement suggestions
6. User can export cover letter as PDF, DOCX, and TXT with proper formatting
7. Generated cover letters are auto-saved to localStorage with up to 10 previous versions
8. User can view and compare multiple variants side-by-side or in tabs before selecting

---

## Phase 3: LinkedIn Profile Sync

**Goal:** Users can securely import LinkedIn profile data to pre-populate resume fields, reducing manual data entry.

### Dependencies
- Phase 1 (Foundation) — requires shared types and API stubs

### Requirements
| ID | Requirement |
|----|-------------|
| LINKED-01 | User can initiate OAuth 2.0 + PKCE flow with LinkedIn |
| LINKED-02 | Supabase Edge Function handles token exchange securely |
| LINKED-03 | System imports basic profile data (name, headline, profile image) |
| LINKED-04 | System maps imported data to resume fields with user confirmation |
| LINKED-05 | Graceful degradation when LinkedIn data is limited (manual entry fallback) |
| LINKED-06 | Tokens stored in memory only (not persisted to storage) |
| LINKED-07 | User can disconnect LinkedIn integration at any time |

### Success Criteria
1. User can click "Connect LinkedIn" button and complete OAuth 2.0 + PKCE flow without errors
2. LinkedIn access token is exchanged securely via Supabase Edge Function (not client-side)
3. System imports name, headline, and profile image URL from LinkedIn basic profile
4. Imported data is displayed in a mapping interface with checkboxes for user confirmation before applying
5. If LinkedIn returns limited data, system shows graceful fallback with manual entry fields pre-filled with available data
6. Access tokens are held in memory only and cleared on page refresh or disconnect
7. User can disconnect LinkedIn at any time via settings, immediately invalidating the session

---

## Phase 4: Interview Preparation

**Goal:** Users can practice interview questions tailored to their target role with structured feedback and progress tracking.

### Dependencies
- Phase 1 (Foundation) — requires JobContext
- Phase 2 (Cover Letter) — shares AI prompt patterns

### Requirements
| ID | Requirement |
|----|-------------|
| INTERV-01 | System generates role-specific interview questions from job description |
| INTERV-02 | Questions categorized by type (behavioral, technical, situational) |
| INTERV-03 | User can practice answers with text input |
| INTERV-04 | AI provides structured feedback using STAR methodology framework |
| INTERV-05 | Feedback includes specific metrics (filler word count, response length) |
| INTERV-06 | User can track practice history and progress |
| INTERV-07 | Questions and answers saved to localStorage |
| INTERV-08 | "Practice mode" with session timer and question rotation |

### Success Criteria
1. System generates 10+ interview questions specific to the job description and role
2. Questions are categorized as Behavioral, Technical, or Situational with clear labels
3. User can type answers in a text area with a minimum 50-character input
4. AI feedback follows STAR method (Situation, Task, Action, Result) with specific scores for each component
5. Feedback displays specific metrics: word count, filler words ("um", "like", "you know"), estimated speaking time
6. Practice history shows previously answered questions with scores and improvement trends
7. All questions and answers are saved to localStorage and survive browser restarts
8. Practice mode includes a timer (5, 10, or 15 minutes) and rotates through question bank randomly

---

## Phase 5: Template Marketplace

**Goal:** Users can browse, preview, and apply professional resume templates with ATS compatibility assurance.

### Dependencies
- Phase 1 (Foundation) — requires shared infrastructure
- Existing ResumeContext — for template application

### Requirements
| ID | Requirement |
|----|-------------|
| MARKET-01 | Users can browse available resume templates in marketplace |
| MARKET-02 | Template preview with live data (user's resume rendered in template) |
| MARKET-03 | Templates categorized by industry and style |
| MARKET-04 | ATS certification badge displayed on compatible templates |
| MARKET-05 | User can download and apply templates to their resume |
| MARKET-06 | 50+ high-quality team-created templates at launch |
| MARKET-07 | Template metadata includes author, ATS score, and usage count |
| MARKET-08 | Search and filter templates by category, style, and ATS compatibility |

### Success Criteria
1. Marketplace displays templates in a browsable grid with thumbnail previews
2. Clicking a template shows live preview with user's actual resume data rendered in that template
3. Templates are categorized by Industry (Tech, Healthcare, Finance, etc.) and Style (Modern, Professional, Creative, Minimal)
4. ATS-certified templates display a badge with score (e.g., "ATS Score: 95/100")
5. User can apply a template to their resume with one click, immediately updating the preview
6. At least 50 high-quality templates are available at launch, all created by the team
7. Each template shows metadata: author name, ATS compatibility score, and download count
8. User can search templates by keyword and filter by category, style, and ATS compatibility (Yes/No)

---

## Progress

| Phase | Status | Requirements Complete | Notes |
|-------|--------|----------------------|-------|
| 1 - Foundation | 🔵 Not Started | 0/5 | Foundation for all features |
| 2 - Cover Letter | 🔵 Not Started | 0/8 | High user value, shares AI patterns |
| 3 - LinkedIn Sync | 🔵 Not Started | 0/7 | OAuth flow, scope validation needed |
| 4 - Interview Prep | 🔵 Not Started | 0/8 | Most complex, builds on prior phases |
| 5 - Template Marketplace | 🔵 Not Started | 0/8 | Most independent feature |

**Overall Progress:** 0/40 requirements (0%)

---

## Phase Dependencies

```
Phase 1: Foundation
    │
    ├──→ Phase 2: Cover Letter Generator
    │       │
    │       └── (shares AI patterns)
    │
    ├──→ Phase 4: Interview Preparation
    │       │
    │       └── (requires JobContext)
    │
    └──→ Phase 3: LinkedIn Profile Sync
            │
            └── (can leverage OAuth patterns)

Phase 1 → Phase 5: Template Marketplace (independent, uses ResumeContext)
```

---

## Risk Mitigation

| Risk | Affected Phase | Mitigation Strategy |
|------|---------------|---------------------|
| AI Detection in Cover Letters | Phase 2 | Guided prompting (not one-click), multi-variant generation (3+ variants), humanization coaching |
| LinkedIn API Permission Walls | Phase 3 | Scope audit before building, graceful degradation, clear user communication about limitations |
| Interview Feedback Quality | Phase 4 | STAR methodology framework, specific metrics (not generic advice), human-in-the-loop validation |
| Template ATS Incompatibility | Phase 5 | ATS certification badge for all templates, score preview before download, creator guidelines |

---

## Research Flags

Phases flagged for deeper research during planning:

- **Phase 3 (LinkedIn Sync):** OAuth scope verification — must verify available scopes before building
- **Phase 4 (Interview Prep):** Feedback quality validation — may need career coach consultation for STAR framework
- **Phase 5 (Template Marketplace):** ATS compatibility testing — need access to ATS parsing tools for certification

---

*Roadmap generated: 2026-02-12*
*Next review: After Phase 2 completion*
