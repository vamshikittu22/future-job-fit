# Architecture Research: AI Career Platform Extensions

**Domain:** AI-powered career intelligence platform (Resume Builder + Extensions)  
**Researched:** 2026-02-11  
**Confidence:** HIGH

## System Overview

The platform extends an existing React + Supabase resume builder with four new feature domains: Cover Letter Generator, LinkedIn Sync, Interview Prep, and Template Marketplace. This architecture maintains Feature-Sliced Design (FSD) principles while introducing cross-domain data flows.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              APPLICATION LAYER                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌────────────┐ │
│  │  resume-builder │  │  cover-letter   │  │  interview-prep │  │  linkedin  │ │
│  │   (existing)    │  │    (new)        │  │    (new)        │  │   (new)    │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  └─────┬──────┘ │
│           │                    │                    │                 │        │
│  ┌────────▼────────────────────▼────────────────────▼─────────────────▼──────┐ │
│  │                        SHARED / CROSS-CUTTING                             │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │ │
│  │  │ ResumeContext│  │  JobContext │  │  AI Gateway │  │ TemplateContext │  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────┤
│                              SERVICE LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  ResumeAI       │  │  LinkedInAPI    │  │  Supabase Edge  │                  │
│  │  (existing)     │  │  (new)          │  │  Functions      │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                              STORAGE LAYER                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                  │
│  │  localStorage   │  │  Supabase DB    │  │  Supabase       │                  │
│  │  (privacy)      │  │  (auth/user)    │  │  Storage        │                  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Recommended Project Structure

Following FSD principles, each new feature is a self-contained domain in `src/features/`:

```
src/
├── features/
│   ├── resume-builder/           # Existing: Core resume editing
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   │
│   ├── job-optimizer/            # Existing: ATS analysis
│   │   └── ...
│   │
│   ├── cover-letter/             # NEW: Cover letter generation
│   │   ├── components/
│   │   │   ├── generator/        # Generation workflow UI
│   │   │   ├── editor/           # Cover letter editor
│   │   │   └── preview/          # Live preview
│   │   ├── hooks/
│   │   │   ├── useCoverLetter.ts # CRUD + generation
│   │   │   └── useTemplates.ts   # Letter templates
│   │   ├── services/
│   │   │   └── coverLetterAI.ts  # AI generation API
│   │   └── pages/
│   │       └── GeneratorPage.tsx
│   │
│   ├── linkedin-sync/            # NEW: LinkedIn OAuth & sync
│   │   ├── components/
│   │   │   ├── auth/             # OAuth flow UI
│   │   │   ├── sync/             # Sync controls
│   │   │   └── import/           # Profile import
│   │   ├── hooks/
│   │   │   ├── useLinkedInAuth.ts    # OAuth state
│   │   │   └── useLinkedInProfile.ts # Profile fetch
│   │   ├── services/
│   │   │   └── linkedinAPI.ts    # LinkedIn API wrapper
│   │   └── pages/
│   │       └── SyncPage.tsx
│   │
│   ├── interview-prep/           # NEW: Interview preparation
│   │   ├── components/
│   │   │   ├── simulator/        # Mock interview UI
│   │   │   ├── questions/        # Question bank
│   │   │   ├── progress/         # Progress tracking
│   │   │   └── feedback/         # AI feedback display
│   │   ├── hooks/
│   │   │   ├── useInterview.ts   # Session management
│   │   │   └── useProgress.ts    # Progress tracking
│   │   ├── services/
│   │   │   └── interviewAI.ts    # Q&A generation
│   │   └── pages/
│   │       ├── SimulatorPage.tsx
│   │       └── DashboardPage.tsx
│   │
│   └── template-marketplace/     # NEW: Template marketplace
│       ├── components/
│       │   ├── browse/           # Template grid/list
│       │   ├── detail/           # Template detail view
│       │   ├── upload/           # Upload workflow
│       │   └── rating/           # Rating/review UI
│       ├── hooks/
│       │   ├── useTemplates.ts   # Browse/search
│       │   ├── useUpload.ts      # Upload workflow
│       │   └── useRatings.ts     # Reviews
│       ├── services/
│       │   └── templateAPI.ts    # Storage operations
│       └── pages/
│           └── MarketplacePage.tsx
│
├── shared/                       # Cross-cutting concerns
│   ├── contexts/
│   │   ├── ResumeContext.tsx     # Existing: Resume data
│   │   ├── JobContext.tsx        # NEW: Job description
│   │   └── InterviewContext.tsx  # NEW: Interview state
│   ├── api/
│   │   ├── resumeAI.ts           # Existing: AI gateway
│   │   ├── linkedin.ts           # NEW: LinkedIn service
│   │   └── interview.ts          # NEW: Interview AI
│   ├── types/
│   │   ├── coverLetter.ts        # NEW: Cover letter types
│   │   ├── linkedin.ts           # NEW: LinkedIn types
│   │   └── interview.ts          # NEW: Interview types
│   └── integrations/
│       └── supabase/
│
└── app/                          # App entry, routing
    └── App.tsx
```

### Structure Rationale

- **Feature Isolation:** Each new domain (cover-letter, linkedin-sync, interview-prep, template-marketplace) is self-contained with its own components, hooks, and services
- **Shared Contracts:** Types and API clients live in `shared/` to enable cross-feature communication
- **Privacy-First:** Continue using localStorage for sensitive resume data; use Supabase only for shared/community features
- **FSD Compliance:** Each feature exposes a public API via `index.ts`, internals remain private

## Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| `CoverLetterGenerator` | Orchestrates generation flow | ResumeContext, JobContext, coverLetterAI |
| `LinkedInAuthButton` | OAuth initiation | linkedinAPI (via Edge Function) |
| `LinkedInSyncPanel` | Profile import UI | ResumeContext, linkedinAPI |
| `InterviewSimulator` | Mock interview session | InterviewContext, interviewAI |
| `ProgressTracker` | Interview progress visualization | InterviewContext, localStorage |
| `TemplateBrowser` | Marketplace browsing | templateAPI (Supabase) |
| `TemplateUploader` | Upload workflow | templateAPI, ResumeContext |
| `JobContext` | Job description state | CoverLetterGenerator, InterviewSimulator |

## Data Flow

### Flow 1: Cover Letter Generation

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Resume     │────▶│ Cover Letter     │────▶│   AI Gateway     │
│   Context    │     │ Generator        │     │   (Edge Func)    │
└──────────────┘     └──────────────────┘     └──────────────────┘
       │                       │                        │
       │                       ▼                        ▼
       │              ┌──────────────────┐     ┌──────────────────┐
       └─────────────▶│   Job Context    │     │   Generated      │
                      │   (JD data)      │     │   Letter         │
                      └──────────────────┘     └──────────────────┘
```

1. User selects "Generate Cover Letter" from resume
2. Generator fetches resume data from ResumeContext
3. User inputs or selects job description (stored in JobContext)
4. AI Gateway sends combined data to Supabase Edge Function
5. Edge Function calls LLM with structured prompt
6. Generated letter returned to UI, stored in CoverLetterContext

### Flow 2: LinkedIn OAuth & Sync

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   User       │────▶│ LinkedIn OAuth   │────▶│ Supabase Edge    │
│   Click      │     │ Flow (Popup)     │     │ Function         │
└──────────────┘     └──────────────────┘     └──────────────────┘
                                                          │
                       ┌──────────────────┐               │
                       │ Profile Import   │◀──────────────┘
                       │ Selection UI     │     (Token exchange)
                       └──────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Resume Context   │
                       │ (Data merge)     │
                       └──────────────────┘
```

**OAuth Implementation Pattern (2024):**
- Use Supabase Edge Function for token exchange (Client Secret must be server-side)
- Store access token in memory (sessionStorage) - LinkedIn tokens expire in ~60 days
- Use PKCE extension for security
- Required scopes: `openid`, `profile`, `email`, `r_basicprofile`

### Flow 3: Interview Preparation

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Resume     │────▶│ Interview        │────▶│ Question Bank    │
│   Context    │     │ Simulator        │     │ (AI-generated)   │
└──────────────┘     └──────────────────┘     └──────────────────┘
       │                       │                        │
       │                       ▼                        ▼
       │              ┌──────────────────┐     ┌──────────────────┐
       └─────────────▶│ Job Context      │     │ Answer Tracking  │
                      │ (Role focus)     │     │ (localStorage)   │
                      └──────────────────┘     └──────────────────┘
```

1. Simulator fetches resume + job description as context
2. AI generates role-specific questions based on:
   - Resume experience (behavioral questions)
   - Job description requirements (technical questions)
   - Selected interview type (screening, technical, behavioral)
3. User answers are recorded and analyzed
4. Feedback stored in InterviewContext
5. Progress persisted to localStorage for privacy

### Flow 4: Template Marketplace

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Template    │────▶│ Supabase Storage │────▶│   CDN Delivery   │
│  Upload      │     │ + Database       │     │   (Optimized)    │
└──────────────┘     └──────────────────┘     └──────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ Template Browser │
                       │ (Search/Filter)  │
                       └──────────────────┘
```

**Storage Architecture:**
- Templates stored as JSON schema + preview images in Supabase Storage
- Metadata (ratings, downloads, author) in Supabase Database
- Public templates served via CDN with image optimization
- User uploads trigger Edge Function for validation

## Cross-Feature Integration Patterns

### Pattern 1: Context Bridge

When features need to share state, use a bridge hook:

```typescript
// src/features/cover-letter/hooks/useResumeJobBridge.ts
import { useResume } from '@/shared/contexts/ResumeContext';
import { useJob } from '@/shared/contexts/JobContext';

export function useResumeJobBridge() {
  const { resumeData } = useResume();
  const { jobDescription } = useJob();
  
  return {
    context: {
      resume: resumeData,
      job: jobDescription,
      skills: extractSkills(resumeData, jobDescription)
    },
    isReady: Boolean(resumeData.personal.name && jobDescription?.title)
  };
}
```

### Pattern 2: Event Bus for Cross-Feature Actions

For loose coupling between features:

```typescript
// src/shared/lib/events.ts
export const featureEvents = {
  emit(event: string, data: any) {
    window.dispatchEvent(new CustomEvent(`fjf:${event}`, { detail: data }));
  },
  on(event: string, handler: (data: any) => void) {
    window.addEventListener(`fjf:${event}`, (e: CustomEvent) => handler(e.detail));
  }
};

// Usage: Resume builder emits, Cover letter listens
featureEvents.emit('resume:saved', { id: resumeId });
featureEvents.on('resume:saved', ({ id }) => loadCoverLetters(id));
```

### Pattern 3: Shared Types Contract

```typescript
// src/shared/types/crossFeature.ts
export interface CrossFeatureContext {
  resume: ResumeData;
  job?: JobDescription;
  interview?: InterviewConfig;
}

// All AI services accept this unified context
export interface AIGenerationRequest {
  context: CrossFeatureContext;
  task: 'cover-letter' | 'interview-questions' | 'resume-enhance';
  preferences?: GenerationPreferences;
}
```

## Suggested Build Order (Dependencies)

```
Phase 1: Foundation (Week 1-2)
├── JobContext (shared)
├── Types definitions (coverLetter, interview, linkedin)
└── API service stubs

Phase 2: Cover Letter (Week 3-4)
├── CoverLetterContext
├── Generation workflow
├── Editor + Preview
└── Integration with ResumeContext

Phase 3: LinkedIn Sync (Week 5-6)
├── OAuth Edge Function
├── LinkedIn API service
├── Import/Export UI
└── Resume data merge logic

Phase 4: Interview Prep (Week 7-8)
├── InterviewContext
├── Question generation AI
├── Simulator UI
└── Progress tracking (localStorage)

Phase 5: Template Marketplace (Week 9-10)
├── Supabase Storage setup
├── Template schema validation
├── Browse/Upload UI
└── Rating system

Phase 6: Integration (Week 11-12)
├── Cross-feature navigation
├── Unified dashboard
├── Shared analytics
└── Performance optimization
```

**Dependency Justification:**
1. **JobContext first** - Required by both Cover Letter and Interview Prep
2. **Cover Letter before Interview** - Shares AI prompt patterns, establishes context usage
3. **LinkedIn after Cover Letter** - Lower priority, can leverage established OAuth patterns
4. **Marketplace last** - Most independent, relies only on ResumeContext for uploads

## Anti-Patterns to Avoid

### Anti-Pattern 1: Deep Feature Coupling

**What people do:** Import components directly from other features
```typescript
// BAD: Deep import from another feature
import { ExperienceForm } from '@/features/resume-builder/components/editor/forms/ExperienceForm';
```

**Why it's wrong:** Breaks FSD boundaries, creates circular dependencies

**Do this instead:** Use shared types + composition
```typescript
// GOOD: Shared contract, passed as props
import type { Experience } from '@/shared/types/resume';

interface CoverLetterProps {
  experience: Experience[];
  onExperienceChange?: (exp: Experience[]) => void;
}
```

### Anti-Pattern 2: Context Overload

**What people do:** Single massive context for all features
```typescript
// BAD: Everything in one context
const AppContext = createContext({
  resume: {},
  coverLetter: {},
  interview: {},
  linkedin: {},
  // ... keeps growing
});
```

**Why it's wrong:** Unnecessary re-renders, hard to maintain, breaks encapsulation

**Do this instead:** Feature-specific contexts with bridge hooks
```typescript
// GOOD: Separate contexts, compose at component level
const { resumeData } = useResume();
const { letterData } = useCoverLetter();
const combined = useMemo(() => merge(resumeData, letterData), [resumeData, letterData]);
```

### Anti-Pattern 3: API Key in Client

**What people do:** Handle LinkedIn OAuth token exchange in browser
```typescript
// BAD: Client-side token exchange exposes Client Secret
const response = await fetch('https://linkedin.com/oauth/v2/accessToken', {
  body: JSON.stringify({ client_secret: 'SECRET' }) // NEVER DO THIS
});
```

**Why it's wrong:** Client Secret exposed, security vulnerability

**Do this instead:** Supabase Edge Function for exchange
```typescript
// GOOD: Edge Function handles secrets
const { data, error } = await supabase.functions.invoke('linkedin-oauth', {
  body: { code: authCode }
});
```

### Anti-Pattern 4: Storing Sensitive Tokens

**What people do:** Persist LinkedIn tokens to localStorage
```typescript
// BAD: Tokens in localStorage vulnerable to XSS
localStorage.setItem('linkedin_token', accessToken);
```

**Why it's wrong:** XSS attack surface, LinkedIn recommends short-lived tokens

**Do this instead:** Memory-only storage with refresh
```typescript
// GOOD: Store in memory (React state), refresh on page load if needed
const [token, setToken] = useState<string | null>(null);
// User re-authenticates on new session or use refresh token pattern
```

## Scalability Considerations

| Scale | Cover Letter | LinkedIn Sync | Interview Prep | Marketplace |
|-------|--------------|---------------|----------------|-------------|
| **1-100 users** | Direct AI calls | OAuth per user | LocalStorage | Supabase Free |
| **100-10K users** | Queue + caching | Rate limiting | IndexedDB | CDN + caching |
| **10K+ users** | Batch processing | Connection pooling | Server sync | Multi-region |

### Scaling Priorities

1. **AI Rate Limits:** Implement request queuing with TanStack Query for retries
2. **LinkedIn API Limits:** Cache profile data, implement backoff strategy
3. **Template Storage:** Use Supabase Storage transformations for image optimization
4. **Interview Data:** Implement sync to Supabase (encrypted) for cross-device access

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| LinkedIn OAuth | PKCE flow via Edge Function | Client Secret in Edge Function env vars |
| LinkedIn API | REST API with Bearer token | Rate limit: 500 req/day per user |
| Supabase Storage | SDK upload with RLS | Public read, authenticated write |
| AI Gateway | Edge Function proxy | Supports fallback between providers |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| resume-builder ↔ cover-letter | Context + Props | ResumeContext provides data |
| resume-builder ↔ linkedin-sync | Event bus | Decoupled import/export |
| interview-prep ↔ job-optimizer | Shared JobContext | Reuses job description data |
| template-marketplace ↔ all | Props + Callbacks | Templates passed as props |

## Database Schema (Supabase)

```sql
-- Cover letters (user-specific, encrypted at rest)
create table cover_letters (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  resume_id text, -- localStorage reference
  job_id uuid references jobs,
  content text not null,
  template_used text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Jobs (for cover letter targeting)
create table jobs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  title text not null,
  company text,
  description text,
  url text,
  created_at timestamptz default now()
);

-- Interview sessions
create table interview_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  job_id uuid references jobs,
  resume_snapshot jsonb, -- frozen resume state
  questions jsonb, -- generated questions
  answers jsonb, -- user answers
  feedback jsonb, -- AI feedback
  completed boolean default false,
  created_at timestamptz default now()
);

-- Templates (community/shared)
create table templates (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references auth.users,
  name text not null,
  description text,
  category text, -- resume, cover-letter, etc.
  schema jsonb not null, -- template structure
  preview_url text, -- storage URL
  downloads int default 0,
  rating_avg float default 0,
  is_public boolean default false,
  created_at timestamptz default now()
);

-- Template ratings
create table template_ratings (
  id uuid default uuid_generate_v4() primary key,
  template_id uuid references templates,
  user_id uuid references auth.users,
  rating int check (rating between 1 and 5),
  review text,
  created_at timestamptz default now(),
  unique(template_id, user_id)
);
```

## Sources

- [Feature-Sliced Design Documentation](https://feature-sliced.design/) - HIGH confidence
- [LinkedIn OAuth 2.0 Flow](https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow) - HIGH confidence
- [DEV Community: React LinkedIn Access Token](https://dev.to/garciadiazjaime/react-linkedin-access-token-in-10-steps-5fci) - MEDIUM confidence
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage) - HIGH confidence
- [LinkedIn OAuth Best Practices 2025](https://medium.com/@ed.sav/setting-up-linkedin-oauth-few-notes-2025-0097ac858157) - MEDIUM confidence
- [FSD Migration Guide](https://medium.com/@O5-25/migrating-a-legacy-react-project-to-feature-sliced-design-benefits-challenges-and-considerations-0aeecbc8b866) - MEDIUM confidence

---
*Architecture research for: Future Job Fit - AI Career Platform Extensions*  
*Researched: 2026-02-11*
