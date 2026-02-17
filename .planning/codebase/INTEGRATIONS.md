# External Integrations

## AI & LLM Services
- **Google Gemini API**: Primary LLM for resume rewriting and analysis. Accessed via `@google/generative-ai` SDK and Supabase Edge Functions.
- **OpenAI API**: Supported alternative for server-side operations.
- **Groq API**: Supported for low-latency inference.

## Backend Services (Supabase)
- **Authentication**: User management and session handling.
- **Database**: PostgreSQL for storing user profiles (optional/future) - currently leveraging local storage heavily.
- **Edge Functions**:
  - `resume-ai`: Central gateway for AI operations, keeping API keys secure.
- **Storage**: Resume file uploads (PDF parsing).

## Browser & Offline Capabilities
- **Pyodide**: WebAssembly-based Python runtime for executing `nlp_core.py` in the browser (offline ATS analysis).
- **Local Storage**: Primary persistence mechanism for resume drafts (`resumeBuilderDraft`) and snapshots.

## Analytics & Monitoring
- None explicitly configured apart from standard Supabase logs.
