# Phase 1: Foundation - Context

**Gathered:** 2025-02-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish shared data layer (JobContext) and cross-feature infrastructure required by Cover Letter, Interview Prep, LinkedIn Sync, and Template Marketplace features. This phase creates the foundation that enables all subsequent feature phases.

</domain>

<decisions>
## Implementation Decisions

### JobContext Data Structure
- **Fields:** Standard job data (title, company, description, requirements, salary range)
- **Scope:** Multiple saved jobs supported from the start
- **Persistence:** Same as resume (localStorage with auto-save)
- **Data format:** Both raw job description text and structured/AI-extracted fields stored
- **Relationship:** ResumeContext is central/primary; JobContext is secondary but can access resume data

### Navigation Integration
- **Pattern:** Contextual appearance — features show up based on where the user is
- **Existing wizard:** Keep existing 10-step wizard as-is, add separate entry points for new features
- **LinkedIn Sync:** Prominent CTA in Personal Info step of wizard
- **Cover Letter:** Accessible after job analysis AND as standalone tool
- **Interview Prep:** Entry from job analysis results AND standalone job selection
- **Template Marketplace:** Replaces/enhances existing template chooser in wizard + full marketplace at /templates
- **Home navigation:** Reorganize into categories (Build, Optimize, Prepare)
- **Navigation depth:** Deep as needed — don't constrain, let UX drive depth

### Type Definition Strategy
- **Scope:** Standard — define types for all v1 features (Cover Letter, Interview, LinkedIn, Marketplace) now, implement gradually
- **Relationships:** Hybrid approach with shared base types, feature-specific extensions
- **Location:** Feature-specific type files (co-located with features in src/features/*/types.ts)
- **Validation:** Zod schemas for all types (runtime validation + TypeScript safety)

### Cross-Context Communication
- **Pattern:** Bridge hooks — dedicated hooks that read from both contexts and combine data
- **Data access:** Components use useResume() and useJob() hooks directly
- **Coupling:** ResumeContext drives everything; resume is central, job is secondary
- **Change handling:** Show stale data warning when resume changes mid-analysis (not auto-refresh)

### Claude's Discretion
- Exact hook naming conventions
- Specific Zod schema implementation details
- Error state designs for context initialization
- Loading skeleton patterns for new navigation

</decisions>

<specifics>
## Specific Ideas

- Job data should include both raw text (for reference) and structured data (for AI prompts)
- Navigation should feel contextual — features appear when they're relevant to what the user is doing
- Home page should reorganize into clear categories: Build (Resume Wizard), Optimize (Job Optimizer, Cover Letter), Prepare (Interview, LinkedIn)
- Resume context remains the "source of truth" — JobContext builds on top of it
- Warning pattern for stale data: "Your resume has changed since you generated this cover letter. Regenerate?"

</specifics>

<deferred>
## Deferred Ideas

- User dashboard/home page personalization (after first use) — could be a future Phase 6
- Advanced job tracking with application status pipeline — separate feature for later
- Cross-device sync of job data — conflicts with privacy-first approach, needs discussion
- Real-time collaboration on job applications — out of scope for this platform

</deferred>

---

*Phase: 01-foundation*
*Context gathered: 2025-02-12*
