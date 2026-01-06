# Architecture Documentation

> **Status**: Baseline documentation created 2026-01-06  
> **Purpose**: This document maps the current architecture before systematic refactoring begins.

## 📋 Table of Contents

1. [Routes & Navigation](#routes--navigation)
2. [AI Integration](#ai-integration)
3. [Resume Domain Types](#resume-domain-types)
4. [Persistence Layer](#persistence-layer)
5. [Export Mechanisms](#export-mechanisms)
6. [Technology Stack](#technology-stack)
7. [Current Technical Debt](#current-technical-debt)

---

## Routes & Navigation

### Route Configuration
Routes are defined in `src/app/App.tsx` using `react-router-dom@6.30.1` with `createBrowserRouter`.

#### Public Routes
| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | `HomePage` | Landing page with feature overview and CTAs |
| `/input` | `JobInputPage` | Job description input for resume optimization |
| `/results` | `AnalysisResultPage` | Resume analysis results and optimization suggestions |
| `*` | `NotFoundPage` | 404 error page |

#### Resume Builder Wizard (`/resume-wizard`)
Nested routes under `WizardLayout` component:

| Route | Component | Section |
|-------|-----------|---------|
| `/resume-wizard` (index) | `TemplateStep` | Choose resume template |
| `/resume-wizard/template` | `TemplateStep` | Template selection |
| `/resume-wizard/personal` | `PersonalInfoStep` | Contact information |
| `/resume-wizard/summary` | `SummaryStep` | Professional summary |
| `/resume-wizard/experience` | `ExperienceStep` | Work history |
| `/resume-wizard/education` | `EducationStep` | Educational background |
| `/resume-wizard/skills` | `SkillsStep` | Technical and soft skills |
| `/resume-wizard/projects` | `ProjectsStep` | Portfolio projects |
| `/resume-wizard/achievements` | `AchievementsStep` | Awards and achievements |
| `/resume-wizard/certifications` | `CertificationsStep` | Professional certifications |
| `/resume-wizard/review` | `ReviewStep` | Final review and export |
| `/resume-wizard/custom/:id` | `CustomSectionStep` | Dynamic custom sections |

---

## AI Integration

### Architecture Overview
**Current Status**: ✅ **Secure Server-Side** (as of STEP 1, 2026-01-06)

AI functionality is centralized through a **Supabase Edge Function** gateway at `supabase/functions/resume-ai/index.ts`, ensuring all API keys remain server-side and never exposed to the browser.

**Architecture Flow**:
```
User Input → Frontend (resumeAI.ts) → Supabase Client → Edge Function → AI Provider API → Response
```

### Supported Providers
| Provider | Model | Configuration | Use Case |
|----------|-------|---------------|----------|
| **Gemini** | `gemini-1.5-flash` | Server: `GEMINI_API_KEY` | Fast, free-tier friendly |
| **OpenAI** | `gpt-4o-mini` | Server: `OPENAI_API_KEY` | High quality output |
| **Groq** | `llama-3.3-70b-versatile` | Server: `GROQ_API_KEY` | Ultra-low latency |

Provider selection:
- **Client-side**: `VITE_AI_PROVIDER` environment variable (defaults to `gemini`)
- **Server-side**: `AI_PROVIDER` environment variable (fallback)

### AI Operations

#### 1. `enhanceSection(request: EnhancementRequest): Promise<EnhancementResponse>`
**Location**: `src/shared/api/resumeAI.ts:75` (frontend)  
**Gateway**: `supabase/functions/resume-ai/index.ts` (server)  
**Purpose**: Improves resume section text with AI-powered rewriting  
**Input**:
- Section type (summary, experience, skills, etc.)
- Original text
- Optional: quick presets, tone/style, highlight areas, job description
**Output**:
- 3-5 variant rewrites
- Applied tone and highlight metadata
- Notes on improvements

**Security**: No API keys required in browser; all calls routed through Supabase Edge Function.

#### 2. `analyzeSection(sectionId: string, content: any): Promise<AnalysisResult>`
**Location**: `src/shared/api/resumeAI.ts:90` (frontend)  
**Gateway**: `supabase/functions/resume-ai/index.ts` (server)  
**Purpose**: Scores and provides feedback on resume section quality  
**Output**:
- Score (0-100)
- Strengths, weaknesses, suggestions

#### 3. `evaluateResume(request: ResumeEvaluationRequest): Promise<ResumeEvaluationResponse>`
**Location**: `src/shared/api/resumeAI.ts:108` (frontend)  
**Gateway**: `supabase/functions/resume-ai/index.ts` (server)  
**Purpose**: Full resume evaluation and rewriting  
**Output**:
- ATS score
- Missing keywords
- Improvement suggestions
- Rewritten resume

### Environment Configuration

**Client-side** (`.env` with `VITE_` prefix - public):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_AI_PROVIDER=gemini
```

**Server-side** (Supabase secrets - private):
```bash
# Set via Supabase CLI or Dashboard
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set OPENAI_API_KEY=your_key
supabase secrets set GROQ_API_KEY=your_key
```

**Local Development** (`.env` without `VITE_` prefix):
```env
GEMINI_API_KEY=your_actual_key
OPENAI_API_KEY=your_actual_key
GROQ_API_KEY=your_actual_key
```

### Legacy Endpoints
~~**File**: `/api/resume.js`~~ **REMOVED** (STEP 1)  
~~**Purpose**: Server-side resume evaluation~~ **DEPRECATED**  
**Reason for Removal**: 
- Used deprecated Gemini model (`text-bison-001`)
- Inconsistent with main AI service architecture
- Replaced by Supabase Edge Function gateway

---

## Resume Domain Types

### Type Location Strategy
**Canonical Source**: `src/shared/types/resume.ts`  
**Pattern**: Feature-Specific Layer → Shared Types (FSD-like architecture)

### Core Types

#### `ResumeData` Interface
**Location**: `src/shared/types/resume.ts:60-125`

```typescript
interface ResumeData {
  personal: PersonalInfo;
  summary: string;
  certifications?: Certification[];
  experience: Experience[];
  education: Education[];
  skills: SkillsStructure;
  projects: Project[];
  achievements: Achievement[];
  customSections: CustomSection[];
  metadata?: ResumeMetadata;
}
```

**Key Characteristics**:
- Supports both array-based (`SkillCategoryType[]`) and object-based skills structures
- Includes aliased fields for backward compatibility (e.g., `school`/`institution`, `tech`/`technologies`)
- Extensible via `CustomSection[]` for user-defined sections
- Metadata tracks section order, template, theme config, last updated timestamp

#### Supporting Types
| Type | Purpose | Fields |
|------|---------|--------|
| `CustomSection` | User-defined resume sections | id, title, description, fields[], entries[] |
| `CustomField` | Field schema for custom sections | id, name, type, required, options[] |
| `CustomSectionEntry` | Data row in custom section | id, values (Record<fieldId, value>) |
| `Certification` | Professional certifications | name, issuer, date, expiryDate, credentialId, credentialUrl |
| `ResumeMetadata` | Resume configuration | sectionOrder[], lastUpdated, template, version, themeConfig |

### Type Compatibility Layer
**Location**: `src/shared/lib/types.ts`  
**Purpose**: Re-exports and compatibility glue for legacy code  
**⚠️ Issue**: Indicates potential type duplication and drift across features.

---

## Persistence Layer

### Overview
**Strategy**: Client-side localStorage with optimistic updates  
**Implementation**: `src/shared/contexts/ResumeContext.tsx`

### Storage Keys
| Key | Purpose | Max Size |
|-----|---------|----------|
| `resumeBuilderDraft` | Active working draft | Single `ResumeData` object |
| `resumeBuilderSnapshots` | Saved versions | 20 most recent snapshots |

### Features

#### 1. Auto-Save
- **Mechanism**: Debounced updates every 2 seconds via Lodash `debounce`
- **Trigger**: Any change to `resumeData` state
- **Location**: `src/shared/contexts/ResumeContext.tsx:541-554`

#### 2. Undo/Redo
- **Implementation**: Custom history reducer with past/present/future stacks
- **Limit**: 100 history entries (configurable via `HISTORY_LIMIT`)
- **Actions**: `UNDO`, `REDO`, `CLEAR_HISTORY`
- **Location**: `src/shared/contexts/ResumeContext.tsx:408-463`

#### 3. Version Snapshots
- **Manual save**: `saveResume(name?: string): Promise<void>`
- **Load saved**: `loadResume(id: string): Promise<void>`
- **Retention**: 20 most recent versions
- **Data**: Full `ResumeData` snapshot with timestamp and user-provided name

### Context API
**Provider**: `ResumeProvider` wraps entire app in `src/app/App.tsx:58`  
**Hook**: `useResume()` provides access to all resume operations

**Key Operations**:
- CRUD for all sections: experience, education, skills, projects, achievements, certifications
- Custom section management: add/update/remove/reorder
- Custom field/entry operations for dynamic sections
- History navigation: undo/redo
- Persistence: save/load versions

---

## Export Mechanisms

### Implementation Location
**Directory**: `src/shared/lib/export/`

| File | Purpose | Dependencies |
|------|---------|--------------|
| `pdf.ts` | PDF generation via HTML rendering | `html2canvas`, `jspdf` |
| `docx.ts` | DOCX generation via docx library | `docx@8.5.0` |
| `formats.ts` | HTML, Markdown, Plain Text, LaTeX, ATS-optimized PDF | `file-saver`, template utilities |

### Export Formats

#### 1. PDF Export (`generatePDF`)
**Method**: HTML → Canvas → PDF  
**Libraries**: `html2canvas@1.4.1` + `jspdf@3.0.3`  
**Template Support**: Yes (via template classes on HTML element)  
**Entry Point**: `src/shared/lib/export/pdf.ts`

#### 2. ATS-Optimized PDF (`generateATSPdf`)
**Method**: Pure text rendering in jsPDF (no images)  
**Purpose**: Maximum ATS compatibility  
**Library**: `jspdf@3.0.3`  
**Entry Point**: `src/shared/lib/export/formats.ts`

#### 3. DOCX Export (`generateDocx`)
**Library**: `docx@8.5.0`  
**Features**:
- Template-based styling (font, colors, spacing)
- Full section support (experience, education, skills, projects, achievements, certifications)
- Custom sections rendered dynamically
**Entry Point**: `src/shared/lib/export/docx.ts`

#### 4. Other Formats
- **JSON**: `JSON.stringify(resumeData, null, 2)`
- **Markdown**: Template-based generator with section headers
- **Plain Text**: Simple line-based format
- **LaTeX**: Academic CV format
- **HTML**: Standalone HTML with inline styles

### Duplicate Dependency
⚠️ **Issue**: Both `html2pdf.js@0.10.2` AND `html2canvas@1.4.1` + `jspdf@3.0.3` exist in `package.json`.  
**Recommendation**: Remove `html2pdf.js` if unused (appears to be the case).

---

## Technology Stack

### Core Framework
- **React**: 18.3.1
- **TypeScript**: 5.0.2
- **Build Tool**: Vite 5.4.0
- **Routing**: react-router-dom 6.30.1

### UI & Styling
- **CSS Framework**: Tailwind CSS 3.3.2
- **Component Library**: Shadcn/UI (Radix UI primitives + custom components)
- **Animations**: Framer Motion 10.18.0
- **Theme**: next-themes 0.4.6 (dark mode support)

### State Management
- **Global State**: React Context API (`ResumeContext`, `WizardContext`, `SaveContext`)
- **Server State**: @tanstack/react-query 5.87.4
- **Forms**: react-hook-form 7.62.0 + @hookform/resolvers 3.10.0
- **Validation**: zod 3.25.76

### AI & APIs
- **Google Gemini**: @google/generative-ai 0.24.1
- **Backend (optional)**: @supabase/supabase-js 2.81.1

### Export Libraries
- **PDF**: jspdf 3.0.3, html2canvas 1.4.1, html2pdf.js 0.10.2
- **DOCX**: docx 8.5.0
- **Utilities**: file-saver 2.0.5

### Drag & Drop
⚠️ **Duplicate Libraries**:
- @dnd-kit/core 6.3.1 + @dnd-kit/sortable 10.0.0
- @hello-pangea/dnd 16.3.0

### Utilities
- **Date**: date-fns 3.6.0
- **UUID**: uuid 13.0.0
- **Deep Operations**: lodash 4.17.21

---

## Current Technical Debt

### 1. TypeScript Configuration
**File**: `tsconfig.json`

```json
{
  "noImplicitAny": false,
  "strictNullChecks": false,
  "noUnusedParameters": false,
  "noUnusedLocals": false
}
```

**Impact**: Weakened type safety; potential runtime null/undefined errors.

### 2. ESLint Configuration
**File**: `eslint.config.js:26`

```javascript
"@typescript-eslint/no-unused-vars": "off"
```

**Impact**: Dead code accumulation; reduced code quality signals.

### 3. Security Issues
- **Client-side API keys**: `VITE_GEMINI_API_KEY`, `VITE_OPENAI_API_KEY`, `VITE_GROQ_API_KEY` exposed in browser bundle
- **Recommendation**: Implement server-side AI gateway (Supabase Edge Functions, Vercel Functions, or Netlify Functions)

### 4. UI Inconsistency
**File**: `src/features/home/pages/NotFoundPage.tsx`
- Uses hardcoded Tailwind colors (`bg-gray-50`, `text-gray-900`) instead of theme tokens (`bg-background`, `text-foreground`)
- Breaks dark mode consistency

### 5. Dependency Redundancy
- **DnD**: Both `@dnd-kit/*` and `@hello-pangea/dnd`
- **PDF**: Both `html2pdf.js` and `html2canvas` + `jspdf`

### 6. Legacy Endpoint
- `/api/resume.js` uses deprecated Gemini model (`text-bison-001`)
- Unclear if endpoint is actively used
- Inconsistent with main AI service architecture

### 7. Type System Drift
- Compatibility layer in `src/shared/lib/types.ts` suggests duplicate type definitions
- Aliases in domain types (`school`/`institution`, `tech`/`technologies`) indicate migration in progress

---

## Build Status (Baseline)

### Current Build Command
```bash
npm run build
# Executes: tsc && vite build
```

**Status**: ✅ **PASSING** (as of 2026-01-06)

**Output Summary**:
- 2,745 modules transformed
- Build time: 17.35s
- Main bundle: 2,018.12 kB (600.63 kB gzipped)
- ⚠️ Warning: Chunks larger than 500 kB (code-splitting recommended)
- Exit code: 0

### Current Lint Command
```bash
npm run lint
# Executes: eslint . --report-unused-disable-directives --max-warnings 0
```

**Status**: ❌ **FAILING** (as of 2026-01-06)

**Error Summary**:
- **Total Errors**: 68+ across 18 files
- **Primary Issues**:
  - `no-case-declarations`: 5 errors in ExportResumeModal.tsx
  - `@typescript-eslint/no-explicit-any`: 63+ errors across resume-builder components
  
**Most Affected Files**:
1. `ExperienceSection.tsx` - 7 errors
2. `ProjectSection.tsx` - 7 errors  
3. `AchievementSection.tsx` - 6 errors
4. `ExportResumeModal.tsx` - 6 errors
5. `CustomSectionEditor.tsx` - 5 errors

**Note**: These lint errors exist due to disabled `@typescript-eslint/no-unused-vars` rule and permissive TypeScript config. These will be addressed in STEP 3 (TypeScript strictness) and STEP 4 (Lint standards).

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-01-06  
**Next Review**: After STEP 1 (AI Security Architecture)
