# Supabase Setup Guide

This project uses Supabase for Edge Functions (AI processing) and can be extended for database persistence and authentication.

## 📋 Prerequisites

1.  [Supabase CLI](https://supabase.com/docs/guides/cli) installed.
2.  A Supabase account and project.

## ⚙️ Initial Configuration

### 1. Initialize Supabase
If you haven't already:
```bash
supabase login
supabase init
```

### 2. Environment Variables
Add these to your `.env.local`:
```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

## ⚡ Edge Functions (AI Gateway)

The primary use of Supabase in this project is the `resume-ai` function, which acts as a secure proxy for AI providers.

### 1. Set Secrets
You must set your LLM provider keys as secrets in Supabase:
```bash
# For Gemini (Default)
supabase secrets set GOOGLE_AI_API_KEY=your_gemini_key

# Optional: For OpenAI
supabase secrets set OPENAI_API_KEY=your_openai_key

# Optional: For Groq
supabase secrets set GROQ_API_KEY=your_groq_key
```

### 2. Deploy Functions
Deploy the AI service to your project:
```bash
supabase functions deploy resume-ai --no-verify-jwt
```
*Note: `--no-verify-jwt` is used for the public AI gateway, which implements its own internal validation.*

## 🛠️ Local Development

### Serving Edge Functions Locally
To test AI features without deploying:
1.  Run the local Supabase server: `supabase start`
2.  Serve the function: `supabase functions serve resume-ai --no-verify-jwt`
3.  The service will be available at `http://localhost:54321/functions/v1/resume-ai`

## 🗄️ Database (Optional)
This project is currently "Client-First" and uses `localStorage` for persistence. To enable cloud sync:
1.  Run migrations: `supabase db push`
2.  Enable the `Persistence` feature flag in `src/config/features.ts`.
