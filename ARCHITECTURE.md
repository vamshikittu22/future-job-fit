# Architecture Documentation

> **Status**: Updated 2026-03-02 — reflects post-redesign codebase state
> **Purpose**: Maps routes, design system, AI integration, persistence, exports, and technical debt.

## Table of Contents

1. [Routes & Navigation](#routes--navigation)
2. [Design System Architecture](#design-system-architecture)
3. [AI Integration](#ai-integration)
4. [Resume Domain Types](#resume-domain-types)
5. [Persistence Layer](#persistence-layer)
6. [Export Mechanisms](#export-mechanisms)
7. [Technology Stack](#technology-stack)
8. [Current Technical Debt](#current-technical-debt)
9. [Build Status](#build-status)

---

## Routes & Navigation

Routes are defined in `src/app/App.tsx` using `react-router-dom@6.30.1` with `createBrowserRouter`. All heavy features are **lazy loaded** with a `<Suspense>` fallback.

### Public Routes

| Route | Component | Load Strategy | Purpose |
|-------|-----------|---------------|---------|
| `/` | `HomePage` | Eager | Landing page — hero, features, CTA |
| `/about-platform` | `AboutPlatformPage` | Lazy | Architecture case study |
| `/input` | `JobInputPage` | Lazy | Job description input |
| `/results` | `AnalysisResultPage` | Lazy | ATS analysis results |
| `/match-intelligence` | `MatchIntelligencePage` | Lazy | Deep compatibility analysis |
| `*` | `NotFoundPage` | Eager | 404 error page |

### Resume Builder Wizard (`/resume-wizard`)

Nested routes under `WizardLayout`, all lazy loaded:

| Route | Component |
|-------|-----------|
| `/resume-wizard` (index) | `TemplateStep` |
| `/resume-wizard/template` | `TemplateStep` |
| `/resume-wizard/personal` | `PersonalInfoStep` |
| `/resume-wizard/summary` | `SummaryStep` |
| `/resume-wizard/experience` | `ExperienceStep` |
| `/resume-wizard/education` | `EducationStep` |
| `/resume-wizard/skills` | `SkillsStep` |
| `/resume-wizard/projects` | `ProjectsStep` |
| `/resume-wizard/achievements` | `AchievementsStep` |
| `/resume-wizard/certifications` | `CertificationsStep` |
| `/resume-wizard/review` | `ReviewStep` |
| `/resume-wizard/custom/:id` | `CustomSectionStep` |

### Navigation Component

**File**: `src/shared/components/layout/AppNavigation.tsx`

The navigation renders as a **floating pill** centered at the top of the viewport:

```
position: fixed; top: 0.75rem; left: 50%; transform: translateX(-50%);
max-width: 72rem; backdrop-filter: blur(20px); border-radius: 1rem;
```

State-aware behavior:

- **Home page** (`/`): shows nav links (Job Optimizer, Match AI, Resume Wizard, Architecture)
- **All other pages**: shows Back to Home button + New Analysis CTA
- **Wizard** (`/resume-wizard/*`): suppresses builder tools panel
- **With `builderTools` prop**: renders Save / Preview / Export / More dropdown

---

## Design System Architecture

> **Updated**: 2026-03-02 — Full redesign applying Minimal Futuristic Swiss style

### Design Philosophy

| Dimension | Decision |
|-----------|---------|
| **Style** | Exaggerated Minimalism + Swiss Grid discipline |
| **Mode** | OLED-optimized dark mode primary; clean light mode |
| **Typography** | Inter — clamp-scaled, `-0.02em` to `-0.03em` tracking |
| **Color** | Electric Blue / Vibrant Violet / Cyan triadic accent palette |
| **Layout** | Swiss grid — left-aligned section headers, consistent max-width |
| **Effects** | Glassmorphism, neon glows, ambient radial orbs, gradient borders |

### File Locations

| File | Role |
|------|------|
| `src/app/styles/index.css` | Global design tokens, component classes, animations |
| `tailwind.config.ts` | Tailwind extension — shadow, font size, gradient background, keyframe tokens |
| `design-system/futurejobfit/MASTER.md` | Generated design system source of truth |

### CSS Custom Properties

#### Color Palette

```css
/* Light mode */
--primary:    231 100% 62%;   /* Electric Blue  */
--accent:     265 90%  60%;   /* Vibrant Violet */
--background: 0   0%   98%;   /* Near-white     */

/* Dark mode (OLED) */
--primary:    231 100% 65%;   /* Brighter Electric Blue */
--accent:     265 85%  65%;   /* Brighter Violet        */
--background: 220 20%  4%;    /* OLED near-black        */
```

#### Gradient Tokens

```css
--gradient-accent:   linear-gradient(135deg, hsl(231 100% 62%) → hsl(265 90% 60%));
--gradient-vibrant:  linear-gradient(135deg, blue → violet → cyan, animated 4s);
--gradient-hero:     radial-gradient(ellipse at top, blue glow) + OLED base;
--gradient-border:   linear-gradient(135deg, blue, violet, cyan) [used in ::before masks];
```

#### Shadow & Glass

```css
--shadow-glass:  0 8px 32px rgb(0 0 0 / 0.6), inset 0 1px 0 hsl(0 0% 100% / 0.06);
--shadow-accent: 0 0 32px hsl(231 100% 65% / 0.3), 0 4px 16px hsl(231 100% 65% / 0.2);
--shadow-swiss:  0 2px 16px rgb(0 0 0 / 0.6), 0 0 0 1px hsl(220 20% 13%);
```

### Component Class System

```
.swiss-container        → max-w-5xl centered layout
.swiss-section          → 6rem block padding
.swiss-divider          → 1px border-color rule with 4rem gradient left accent
.glass-card             → backdrop-blur(16px) + border + hover lift
.feature-card           → subtle border, hover translateY(-3px) + neon glow (dark)
.gradient-border-card   → CSS ::before mask with gradient-border, opacity 0→1 on hover
.icon-container         → 3rem square, accent tint bg + border, hover glow
.step-number            → 3.5rem circle, gradient-accent fill, shadow-accent
.neon-pill              → small badge with box-shadow glow, uppercase tracking
.nav-floating           → fixed pill with backdrop-filter + border
.overline               → 0.69rem uppercase 0.12em tracking, primary color
.brand-logo             → gradient-accent background-clip text, 800 weight
.gradient-text-animated → gradient-vibrant with 4s background-position animation
.cta-section            → radial gradient bg + border, overflow hidden
```

### Animation Keyframes

| Name | Effect | Duration |
|------|--------|---------|
| `fadeIn` | opacity 0→1 + translateY(16px→0) | 500ms |
| `slideUp` | opacity 0→1 + translateY(28px→0) | 550ms |
| `scaleIn` | opacity 0→1 + scale(0.93→1) | 400ms |
| `gradientShift` | background-position 0%→100%→0% | 4s infinite |
| `pulseGlow` | box-shadow intensity oscillation | 3s ease-in-out infinite |
| `float` | translateY(0 → -8px → 0) | 6s ease-in-out infinite |
| `accordion-down/up` | Radix accordion height transition | 200ms |

### Typography Scale

Defined via Tailwind `fontSize` extension:

```ts
'display': ['clamp(3rem, 7vw, 6rem)',    { lineHeight: '1.02', letterSpacing: '-0.03em' }],
'hero':    ['clamp(2.25rem, 5vw, 4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
'title':   ['clamp(1.75rem, 3vw, 2.75rem)', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
```

Body text uses responsive `font-size` at breakpoints: 1rem → 0.937rem → 0.875rem → 0.812rem.

---

## AI Integration

**Status**: Secure Server-Side (deployed 2026-01-15, unchanged in redesign)

All AI functionality is centralized through a **Supabase Edge Function** gateway at `supabase/functions/resume-ai/index.ts`. API keys never reach the browser.

```
User Input → Frontend (resumeAI.ts) → Supabase Client → Edge Function → AI Provider → Response
```

### Supported Providers

| Provider | Model | Server Secret | Use Case |
|----------|-------|--------------|---------|
| **Gemini** | `gemini-1.5-flash` | `GEMINI_API_KEY` | Fast, free-tier friendly |
| **OpenAI** | `gpt-4o-mini` | `OPENAI_API_KEY` | High quality output |
| **Groq** | `llama-3.3-70b-versatile` | `GROQ_API_KEY` | Ultra-low latency |

Provider selection: `VITE_AI_PROVIDER` env variable (client) / `AI_PROVIDER` (server fallback).

### AI Operations

#### `enhanceSection(request: EnhancementRequest)`

**Location**: `src/shared/api/resumeAI.ts`
**Purpose**: Improves resume section text with AI-powered rewriting
**Output**: 3–5 variant rewrites, tone/style metadata, improvement notes

#### `analyzeSection(sectionId, content)`

**Location**: `src/shared/api/resumeAI.ts`
**Purpose**: Scores and provides feedback on resume section quality
**Output**: Score (0–100), strengths, weaknesses, suggestions

#### `evaluateResume(request: ResumeEvaluationRequest)`

**Location**: `src/shared/api/resumeAI.ts`
**Purpose**: Full resume evaluation and rewriting optimized for a specific job
**Output**: ATS score, missing keywords, improvement suggestions, rewritten resume

### Environment Configuration

```env
# Client-side (VITE_ prefix, public)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_AI_PROVIDER=gemini

# Server-side (Supabase secrets, private)
GEMINI_API_KEY=...
OPENAI_API_KEY=...
GROQ_API_KEY=...
```

---

## Resume Domain Types

### Type Location

**Canonical Source**: `src/shared/types/resume.ts`
**Pattern**: Feature-Specific Layer → Shared Types (FSD-like architecture)

### Core Interface

```typescript
interface ResumeData {
  personal:       PersonalInfo;
  summary:        string;
  experience:     Experience[];
  education:      Education[];
  skills:         SkillsStructure;
  projects:       Project[];
  achievements:   Achievement[];
  certifications: Certification[];
  customSections: CustomSection[];
  metadata?:      ResumeMetadata;
}
```

### Supporting Types

| Type | Purpose | Key Fields |
|------|---------|-----------|
| `CustomSection` | User-defined sections | id, title, description, fields[], entries[] |
| `CustomField` | Field schema | id, name, type, required, options[] |
| `CustomSectionEntry` | Data row | id, values (Record<fieldId, value>) |
| `Certification` | Professional certifications | name, issuer, date, expiryDate, credentialId, credentialUrl |
| `ResumeMetadata` | Resume configuration | sectionOrder[], lastUpdated, template, version, themeConfig |

> **Note**: `src/shared/lib/types.ts` maintains a compatibility layer for legacy code. Type aliases (`school`/`institution`, `tech`/`technologies`) indicate an in-progress migration.

---

## Persistence Layer

**Strategy**: Client-side localStorage with optimistic updates
**Implementation**: `src/shared/contexts/ResumeContext.tsx`

### Storage Keys

| Key | Purpose |
|-----|---------|
| `resumeBuilderDraft` | Active working draft (`ResumeData`) |
| `resumeBuilderSnapshots` | Up to 20 saved version snapshots |

### Features

**Auto-Save** — Debounced (2s via Lodash) on every `resumeData` state change.

**Undo/Redo** — Custom history reducer with `past`/`present`/`future` stacks. Limit: 100 entries.

**Version Snapshots** — Manual `saveResume(name?)` stores full `ResumeData` with timestamp. `loadResume(id)` restores any snapshot. Retention: 20 most recent.

### Context API

`ResumeProvider` wraps entire app at `src/app/App.tsx`.
`useResume()` hook provides full CRUD for all sections plus history and persistence operations.

---

## Export Mechanisms

**Directory**: `src/shared/lib/export/`

| File | Purpose | Dependencies |
|------|---------|-------------|
| `pdf.ts` | PDF via HTML → Canvas → PDF | `html2canvas`, `jspdf` |
| `docx.ts` | DOCX generation | `docx@8.5.0` |
| `formats.ts` | HTML, Markdown, Plain Text, LaTeX, ATS-PDF | `file-saver`, template utilities |

### Export Formats

| Format | Method | Library |
|--------|--------|---------|
| **PDF** | HTML → Canvas → jsPDF | html2canvas + jspdf |
| **ATS-PDF** | Pure text, no images | jspdf |
| **DOCX** | Template-based document | docx |
| **JSON** | `JSON.stringify(resumeData, null, 2)` | native |
| **Markdown** | Template generator with section headers | native |
| **Plain Text** | Simple line-based format | native |
| **LaTeX** | Academic CV format | native |
| **HTML** | Standalone page with inline styles | native |

> **Dependency note**: Both `html2pdf.js@0.10.2` and `html2canvas@1.4.1 + jspdf@3.0.3` exist in `package.json`. `html2pdf.js` appears unused — recommend removal.

---

## Technology Stack

### Core Framework

| Layer | Technology |
|-------|-----------|
| UI library | React 18.3.1 |
| Language | TypeScript 5.0.2 |
| Build tool | Vite 5.4.0 |
| Routing | react-router-dom 6.30.1 |

### UI & Styling

| Layer | Technology |
|-------|-----------|
| CSS framework | Tailwind CSS 3.3.2 |
| Component library | Shadcn/UI (Radix UI primitives) |
| Animation | Framer Motion 10.18.0 |
| Theme | next-themes 0.4.6 |
| **Design system** | **Custom Swiss/Futuristic tokens — OLED palette, glassmorphism, gradient animations** |
| Fonts | Inter (Google Fonts) + JetBrains Mono |

### State Management

| Layer | Technology |
|-------|-----------|
| Global state | React Context API (ResumeContext, WizardContext, SaveContext) |
| Server state | @tanstack/react-query 5.87.4 |
| Forms | react-hook-form 7.62.0 + @hookform/resolvers 3.10.0 |
| Validation | zod 3.25.76 |

### AI & APIs

| Layer | Technology |
|-------|-----------|
| Gemini SDK | @google/generative-ai 0.24.1 |
| Backend gateway | @supabase/supabase-js 2.81.1 |

### Export Libraries

| Format | Library |
|--------|---------|
| PDF | jspdf 3.0.3, html2canvas 1.4.1 |
| DOCX | docx 8.5.0 |
| Utilities | file-saver 2.0.5 |

### Utilities

| Purpose | Library |
|---------|---------|
| Dates | date-fns 3.6.0 |
| UUIDs | uuid 13.0.0 |
| Deep operations | lodash 4.17.21 |
| Drag & drop | @dnd-kit/core 6.3.1, @dnd-kit/sortable 10.0.0 |
| Virtualization | @tanstack/react-virtual 3.13.18 |

---

## Current Technical Debt

### 1. TypeScript Configuration

`tsconfig.json` has relaxed settings:

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

```javascript
// eslint.config.js
"@typescript-eslint/no-unused-vars": "off"
```

**Impact**: Dead code accumulation; reduced code quality signals.

### 3. Security — API Keys

~~Client-side `VITE_GEMINI_API_KEY` exposed in browser~~ — **RESOLVED (2026-01-15)**
Server-side AI gateway via Supabase Edge Function (`resume-ai`) is now the default.

### 4. UI Inconsistency — NotFoundPage

`src/features/home/pages/NotFoundPage.tsx` uses hardcoded Tailwind colors (`bg-gray-50`, `text-gray-900`) instead of design system tokens (`bg-background`, `text-foreground`). Breaks dark mode and the new OLED palette.

**Fix**: Replace all hardcoded colors with CSS variable tokens.

### 5. Dependency Redundancy

| Category | Duplicate |
|----------|-----------|
| PDF export | `html2pdf.js` AND `html2canvas + jspdf` |
| Drag & drop | `@dnd-kit/*` AND `@hello-pangea/dnd` (if present) |

### 6. Type System Drift

Compatibility layer in `src/shared/lib/types.ts` suggests duplicate type definitions. Aliases in domain types (`school`/`institution`, `tech`/`technologies`) indicate a migration that is still in progress.

### 7. Chunk Size Warning

Main bundle: **2,018 kB** (600 kB gzipped). Vite warns on chunks > 500 kB.
Pyodide and PDF libraries are the primary contributors. Further code-splitting of these modules is recommended.

---

## Build Status

### Build Command

```bash
npm run build   # tsc && vite build
```

**Status**: Passing (as of 2026-01-06 baseline; UI redesign changes in 2026-03-02 are CSS/TSX only and do not affect build output size significantly)

**Output Summary**:

- 2,745+ modules transformed
- Build time: ~17–19s
- Main bundle: ~2,018 kB (600 kB gzipped)
- Warning: Chunks > 500 kB

### Lint Command

```bash
npm run lint    # eslint . --report-unused-disable-directives --max-warnings 0
```

**Status**: Failing (68+ errors across 18 files — primarily `no-explicit-any` in resume-builder components; pre-existing, unrelated to redesign)

---

**Document Version**: 2.0.0
**Last Updated**: 2026-03-02
**Changes in v2.0.0**:

- Added Design System Architecture section (complete)
- Updated Navigation section to document floating pill nav behavior
- Updated Technology Stack with new design system row and font entries
- Updated Technical Debt #4 (NotFoundPage) to mention OLED palette impact
- Updated Build Status with redesign impact note
