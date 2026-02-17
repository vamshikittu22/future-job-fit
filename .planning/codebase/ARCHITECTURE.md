# Architecture & Patterns

## High-Level Architecture
- **Type**: Single Page Application (SPA).
- **Pattern**: Feature-Sliced Design (Hybrid).
  - `src/features/*`: Encapsulated business domains (Resume Builder, Job Optimizer).
  - `src/shared/*`: Reusable cross-cutting concerns (UI, Hooks, API).
  - `src/app/*`: Composition root matches via Routes.

## Key Modules
1.  **Resume Builder (`src/features/resume-builder`)**:
    - **Wizard Flow**: Step-by-step form via `WizardLayout`.
    - **Preview Engine**: Real-time rendering of resume templates.
    - **State**: `ResumeContext` manages the complex recursive data structure.

2.  **Job Optimizer (`src/features/job-optimizer`)**:
    - **Input**: JD analysis.
    - **Analysis**: ATS scoring logic.
    - **Result**: Visual breakdown of match percentage.

3.  **AI Gateway (`supabase/functions/resume-ai`)**:
    - **Security**: Acts as a proxy to LLM providers (Gemini/OpenAI) to hide API keys.
    - **Logic**: Handles prompt engineering and JSON structuring for responses.

4.  **Offline ATS Engine (`public/py-nlp`)**:
    - **Logic**: Python-based keyword matching and scoring.
    - **Runtime**: Pyodide in browser.
    - **Sync**: `usePyNLP` hook bridges JS and Python worlds.

## Data Flow
- **Resume Data**:
    - User Input -> React Hook Form -> ResumeContext -> LocalStorage (Optimistic Save).
- **AI Operations**:
    - User Action -> `resumeAI.ts` -> Supabase Edge Function -> LLM -> Response -> Update Context.
- **ATS Analysis**:
    - Resume + JD -> `usePyNLP` / `useATS` -> Python Engine (Local/Remote) -> Score Result.

## Core Abstractions
- **ResumeData**: The central type definition (`src/shared/types/resume.ts`) governing the entire application state.
- **Templates**: Export templates defined in `src/shared/lib/export/` using `docx` and `jspdf` strategies.
