# Future Job Fit

## What This Is

An AI-powered career intelligence platform that helps professionals create ATS-optimized resumes and match them to job descriptions. Features a 10-step resume wizard with real-time preview, AI-powered content enhancement, offline ATS scoring via Pyodide/WebAssembly, and multi-format export capabilities.

## Core Value

Users can build professional resumes that successfully pass ATS systems and match job requirements, with or without internet connectivity.

## Requirements

### Validated

- ✓ Resume Wizard with 10-step guided experience — existing
- ✓ Real-time preview panel with live updates — existing
- ✓ AI content enhancement via Supabase Edge Functions — existing
- ✓ Offline ATS scoring with Pyodide NLP engine — existing
- ✓ Multi-format export (PDF, DOCX, HTML, Markdown, JSON, TXT, LaTeX) — existing
- ✓ Auto-save to localStorage with undo/redo (100 steps) — existing
- ✓ Job description analysis and keyword matching — existing
- ✓ Version snapshots (20 saved versions) — existing
- ✓ PWA with offline support — existing
- ✓ Multiple resume templates (Modern, Professional, Minimal, Creative) — existing

### Active

- [ ] Cover letter generator tailored to specific jobs
- [ ] LinkedIn profile synchronization
- [ ] Interview preparation module with Q&A
- [ ] Template marketplace with community templates
- [ ] Resume import improvements (better PDF parsing)

### Out of Scope

- User accounts/cloud sync — Data privacy priority, local-first architecture
- Job board integrations — Focus on resume optimization, not job search
- Real-time collaboration — Single-user tool by design
- Mobile native apps — PWA sufficient for mobile use

## Context

**Current State:** Production-ready codebase with comprehensive feature set. Architecture follows Feature-Sliced Design with clear separation between resume-builder and job-optimizer domains.

**Technical Environment:**
- Frontend: React 18 + Vite + TypeScript
- Styling: Tailwind CSS + Shadcn/UI components
- State: React Context with localStorage persistence
- AI: Multi-provider (Gemini, OpenAI, Groq) via Supabase Edge Functions
- Offline Engine: Pyodide (Python in WebAssembly) for ATS scoring
- Build: Currently passing, lint has 68+ errors to address

**Known Issues:**
- TypeScript strict mode disabled (noImplicitAny: false)
- ESLint no-unused-vars rule disabled
- Duplicate dependencies (@dnd-kit + @hello-pangea/dnd, html2pdf.js + html2canvas)
- 68+ lint errors across 18 files (mostly any types)

**Architecture Decisions:**
- Server-side AI keys via Supabase Edge Functions (security resolved Jan 2026)
- Local-first data storage (privacy-first approach)
- Pyodide for offline NLP capabilities
- Feature-based folder structure (src/features/*)

## Constraints

- **Tech Stack**: React 18 + TypeScript — Established codebase, migration cost prohibitive
- **Offline Capability**: Core features must work without internet — Target market includes users with limited connectivity
- **Privacy**: No resume data leaves browser — Product differentiation, user trust
- **Browser Storage**: localStorage limits (~5MB) — Large resumes may hit limits
- **Build Size**: 2MB+ bundle with Pyodide — Performance consideration for mobile

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase Edge Functions for AI | Hide API keys server-side, support multiple providers | ✓ Good — Secure, flexible |
| Pyodide for offline ATS | Enable offline functionality without backend | ✓ Good — Differentiating feature |
| localStorage over cloud | Privacy-first, no backend complexity | ✓ Good — Aligns with user trust |
| Feature-Sliced Design | Clear boundaries between domains | ⚠️ Revisit — Some cross-feature coupling exists |
| Shadcn/UI component library | Consistent design system, rapid development | ✓ Good — Cohesive UI |

---
*Last updated: 2025-02-12 after initialization*
