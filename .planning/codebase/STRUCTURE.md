# Directory Structure

## Root Directory
- `.planning/`: GSD workflow state and documentation.
- `public/`: Static assets (`py-nlp` scripts).
- `scripts/`: Helper scripts (`setup_ai_backend.ps1`).
- `src/`: Source code.
- `supabase/`: Backend functions and config.

## /src breakdown
### /src/app
- `App.tsx`: Main component, providers setup.
- `main.tsx`: Entry point.
- `routes.tsx` (or similar within App): Routing logic.

### /src/features
Each feature contains `components/`, `hooks/`, `pages/`, `types/` (optional).
- `home/`: Landing page, `NotFoundPage`.
- `job-optimizer/`: Components for JD analysis (`JobInputPage`, `AnalysisResultPage`, `AnalysisPanel`, `KeywordIntegrationModal`).
- `resume-builder/`:
  - `components/`:
    - `editor/`: Form steps (`ExperienceStep`, `SkillsStep`, etc.).
    - `preview/`: Resume templates (`ModernTemplate`, `ProfessionalTemplate`).
  - `hooks/`: specific builder logic.
  - `context/`: Feature-local context? (Usually in shared if global).

### /src/shared
- `api/`: API clients (`resumeAI.ts`).
- `components/`: UI Kit (`shadcn` components like `Button`, `Dialog`).
- `config/`: Constants.
- `contexts/`: Global contexts (`ResumeContext`, `WizardContext`).
- `hooks/`: Shared hooks (`use-ats.ts`, `usePyNLP.ts`).
- `lib/`: Utilities (`utils.ts`, `export/` logic).
- `types/`: Global types (`resume.ts`, `ats.ts`).

### /supabase
- `functions/`: Edge functions.
  - `resume-ai/`: Main AI handler.
