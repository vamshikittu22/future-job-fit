# AI Integration Guide

The Future Job Fit platform uses a multi-tiered intelligence system to provide real-time resume enhancement and analysis.

## 🧠 Intelligence Tiers

1.  **Tier 1: Local Pattern Matching (Offline)**
    -   **Engine**: Regex-based keyword extraction.
    -   **Usage**: Real-time skill categorization and basic formatting checks.
    -   **Latency**: < 10ms.
2.  **Tier 2: Offline Parser (Hybrid)**
    -   **Engine**: Python/FastAPI service in `offline-parser/`.
    -   **Usage**: ATS scoring, keyword matching against job descriptions.
    -   **Latency**: < 50ms.
3.  **Tier 3: Cloud LLM (Online)**
    -   **Provider**: Google Gemini 1.5 Flash (via Supabase Edge Functions).
    -   **Usage**: Complex content rewriting, summary generation, and contextual improvements.
    -   **Latency**: 1-3 seconds.

## 🛠️ Configuration

### Development Modes
Set these in your `.env.local`:

-   `VITE_AI_DEMO_MODE=true`: Uses mock responses for all AI features (no API calls).
-   `VITE_OFFLINE_PARSER=true`: Routes analysis tasks to the local Python service instead of Cloud LLMs.
-   `VITE_AI_PROVIDER=gemini`: Choices are `gemini`, `openai`, or `groq`.

### API Keys
The platform supports two ways to provide API keys:
1.  **Server-Side**: Keys stored in Supabase Secrets (for production/team use).
2.  **Client-Side**: Users can provide their own key in the "Settings" modal, which is stored in `sessionStorage` (for private development).

## 🚀 Key Modules

### `ResumeAIService` (`src/shared/api/resumeAI.ts`)
The orchestrator that decides which intelligence tier to use based on configuration and network status.

### `resume-ai` Edge Function (`supabase/functions/resume-ai/`)
A Deno-based proxy that handles secure communication with LLM providers, ensuring API keys are never exposed to the client.

## 🧬 Feature Implementations

### Section Enhancement
-   **Trigger**: "Enhance with AI" button in the Resume Wizard.
-   **Presets**: 'ATS Optimized', 'Concise Professional', 'Maximum Impact'.
-   **Logic**: Sends original text + preset to Gemini to generate 3 high-impact variants.

### ATS Evaluation
-   **Trigger**: Job Optimizer analysis or Wizard Review step.
-   **Logic**: Extracts keywords from the job description and resume, calculates match frequency, and generates actionable improvement suggestions.
