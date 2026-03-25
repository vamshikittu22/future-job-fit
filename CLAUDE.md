# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI Resume Evaluator & Builder - A React + Vite application that combines Swiss-inspired minimalist design with multi-model AI intelligence to help users create ATS-optimized resumes. The platform features a three-panel workflow (Sidebar, Editor, Live Preview) with real-time AI enhancement capabilities.

## Development Commands

### Setup and Development
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build in development mode
npm run build:dev

# Preview production build
npm preview

# Lint code
npm run lint
```

### AI Backend Setup
The platform uses Supabase Edge Functions for AI operations. Run the setup script in PowerShell:
```powershell
./scripts/setup_ai_backend.ps1
```

## Architecture

### Project Structure
```
src/
├── app/                    # Application entry point and routing
│   ├── App.tsx            # Main app with providers and router
│   ├── main.tsx           # React root render
│   └── styles/            # Global styles
├── features/              # Feature-based modules
│   ├── home/              # Landing and about pages
│   ├── job-optimizer/     # Job description analysis
│   └── resume-builder/    # Main resume wizard
│       ├── components/
│       │   ├── editor/    # Form components and step editors
│       │   ├── layout/    # WizardLayout, WizardSidebar, WizardPreview
│       │   ├── modals/    # AI enhance, export, API key modals
│       │   └── preview/   # Resume preview components
│       └── pages/
├── shared/                # Shared utilities and components
│   ├── api/              # API services (resumeAI.ts)
│   ├── components/       # Common reusable components
│   ├── contexts/         # React contexts (ResumeContext, APIKeyContext, WizardContext)
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # Supabase client
│   ├── lib/              # Utilities (initialData, export logic)
│   ├── providers/        # Theme provider
│   ├── templates/        # Resume templates
│   ├── types/            # TypeScript type definitions
│   └── ui/               # shadcn/ui components (Radix UI primitives)
└── types/                # Global type definitions
```

### Core Contexts

**ResumeContext** (`src/shared/contexts/ResumeContext.tsx`):
- Central state management for all resume data
- Implements undo/redo with history tracking (100-step limit)
- Auto-saves to localStorage with 2-second debounce
- Provides CRUD operations for all resume sections (experience, education, projects, skills, etc.)
- Manages custom sections with dynamic fields and entries
- Supports version snapshots (up to 20 saved versions)

**APIKeyContext** (`src/shared/contexts/APIKeyContext.tsx`):
- Manages user-provided API keys for AI services
- Stores keys in sessionStorage (cleared on browser close)
- Supports OpenAI, Gemini, and Groq providers
- Keys are used for direct API calls from client when configured

**WizardContext** (`src/shared/contexts/WizardContext.tsx`):
- Manages wizard navigation and step progression
- Tracks current step, completion status, and validation

### AI Service Architecture

**ResumeAIService** (`src/shared/api/resumeAI.ts`):
- Multi-mode operation: Demo Mode, User API Key Mode, or Supabase Edge Function Mode
- **Demo Mode**: Returns mock responses when `VITE_AI_DEMO_MODE=true`
- **User API Key Mode**: Direct API calls using user-provided keys from APIKeyContext
- **Edge Function Mode**: Proxies requests through Supabase Edge Functions (production)
- Currently supports Gemini 1.5 Flash for direct calls
- Edge Function location: `supabase/functions/resume-ai/index.ts`

Key methods:
- `enhanceSection()`: Returns 3 variant enhancements for any resume section
- `analyzeSection()`: Provides score, strengths, weaknesses, suggestions
- `evaluateResume()`: Full resume ATS score and keyword analysis

### Routing Structure

The app uses React Router with the following main routes:
- `/` - Home page
- `/about-platform` - About page
- `/resume-wizard/*` - Wizard with nested routes:
  - `/resume-wizard/template` - Template selection
  - `/resume-wizard/personal` - Personal information
  - `/resume-wizard/summary` - Professional summary
  - `/resume-wizard/experience` - Work experience
  - `/resume-wizard/education` - Education history
  - `/resume-wizard/skills` - Skills organized by category
  - `/resume-wizard/projects` - Projects
  - `/resume-wizard/achievements` - Achievements
  - `/resume-wizard/certifications` - Certifications
  - `/resume-wizard/review` - Final review and export
  - `/resume-wizard/custom/:id` - Dynamic custom sections

### State Persistence

**LocalStorage Keys**:
- `resumeBuilderDraft` - Auto-saved resume data
- `resumeBuilderSnapshots` - Saved version history

**SessionStorage Keys**:
- `user_api_key_config` - User's AI provider and API key

### UI Component Library

Built on **shadcn/ui** (Radix UI primitives + Tailwind CSS):
- All UI components in `src/shared/ui/`
- Theming via next-themes with system preference detection
- Path alias `@/` resolves to `src/`

## Common Patterns

### Adding a New Resume Section

1. Define the type in `src/shared/types/resume.ts`
2. Add actions to ResumeContext reducer in `src/shared/contexts/ResumeContext.tsx`
3. Create form component in `src/features/resume-builder/components/editor/forms/`
4. Create step component in `src/features/resume-builder/components/editor/steps/`
5. Add route in `src/app/App.tsx`
6. Update WizardContext steps if needed

### Working with AI Enhancements

All AI operations go through `resumeAI` singleton:
```typescript
import { resumeAI } from '@/shared/api/resumeAI';

// Check if in demo mode
if (resumeAI.isDemoMode) {
  // Show warning to user
}

// Enhance a section
const response = await resumeAI.enhanceSection({
  section_type: 'experience',
  original_text: 'Your text here',
  quick_preset: 'ATS Optimized',
  tone_style: ['Professional'],
  industry_keywords: 'JavaScript, React'
});

// response.variants contains 3 enhanced versions
```

### Export Functionality

Export utilities in `src/shared/lib/export/`:
- `pdf.ts` - PDF generation using jsPDF and html2canvas
- `docx.ts` - DOCX generation using docx library
- `formats.ts` - JSON, Markdown, LaTeX exports

All exports are triggered from `ExportResumeModal` component.

### Custom Sections

Custom sections support dynamic schema:
- Each custom section has a `fields` array defining the schema
- Field types: text, textarea, date, tag, url, email
- Each custom section has an `entries` array containing data instances
- Entries store values as key-value pairs matching field IDs

## Environment Variables

Required env vars (see `.env.example`):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Supabase anon key
- `VITE_AI_PROVIDER` - AI provider (gemini/openai/groq)
- `VITE_AI_DEMO_MODE` - Enable demo mode (true/false)

Server-side secrets (set via `supabase secrets set`):
- `GEMINI_API_KEY`
- `OPENAI_API_KEY`
- `GROQ_API_KEY`

## TypeScript Configuration

- Path alias `@/*` maps to `src/*`
- Experimental decorators enabled
- Strict mode enabled with selective overrides (noUnusedLocals: false)
- Target ES2020 with bundler module resolution

## Key Dependencies

- **React 18** + **React Router 6** - Core framework
- **Vite 5** - Build tool
- **TanStack Query** - Server state management
- **Radix UI** - Headless UI primitives
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Supabase** - Backend (Edge Functions)
- **docx, jspdf, html2canvas** - Export functionality
- **react-hook-form + zod** - Form validation
- **lodash** - Utility functions

## God Mode

Triple-click the "AI" text in the wizard header to enable developer console showing:
- Real-time resume data JSON
- Current context state
- API connection status

## Notes for Development

> ⚠️ **PORT: Always use http://localhost:8080** — The Vite dev server is configured to run on **port 8080**, NOT the default 5173. Never assume 5173. Always use 8080.

- `npm run dev` → http://localhost:8080
- All browser automation, testing, and browsing tasks must target **http://localhost:8080**
- The app runs on port 8080 (not the default 5173)
- All form state flows through ResumeContext - never bypass it
- The preview panel uses real-time resume data - no manual refresh needed
- Mobile uses a drawer-based sidebar with overlay
- All AI calls gracefully degrade to demo mode on failure
- Undo/redo is automatic for all ResumeContext actions
