# Technology Stack

## Core Framework
- **Runtime**: Browser / Node.js
- **Language**: TypeScript 5.0.2
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.0
- **Routing**: React Router DOM 6.30.1

## UI & Styling
- **CSS Engine**: Tailwind CSS 3.3.2
- **Component Library**: Shadcn/UI (Radix UI primitives)
- **Animations**: Framer Motion 10.18.0
- **Theme**: next-themes (Dark/Light mode)
- **Icons**: Lucide React

## State Management
- **Global State**: React Context (`ResumeContext`, `WizardContext`, `SaveContext`)
- **Server State**: TanStack Query v5.87.4
- **Form Handling**: React Hook Form 7.62.0
- **Validation**: Zod 3.25.76

## AI & Data Science
- **LLM Integration**: Google Gemini (`@google/generative-ai`)
- **Alternative Providers**: OpenAI, Groq (server-side support)
- **NLP Engine**: Python (via Pyodide in browser for offline handling)
- **Scripts**: `nlp_core.py` (Keyword matching, JD parsing)

## Backend & Services
- **Platform**: Supabase
- **Auth**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **Compute**: Supabase Edge Functions (Deno/Node)
- **Storage**: Supabase Storage

## Export & Documents
- **PDF**: `jspdf`, `html2canvas`
- **DOCX**: `docx`
- **ATS Friendly**: Plain text / simplified PDF generation
- **Utilities**: `file-saver`, `jszip`

## Dev Tools
- **Linting**: ESLint 8.45
- **Testing**: Vitest
- **Helpers**: `lodash`, `date-fns`, `uuid`
