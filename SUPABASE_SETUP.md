# Setting Up Supabase Edge Functions for AI

This guide walks you through deploying the `resume-ai` edge function to Supabase.

## Prerequisites

- A Supabase account (free tier works)
- Your AI API keys (Gemini, OpenAI, or Groq)

---

## Quick Setup (Recommended)
This requires PowerShell (Windows).

**Run the automated setup script:**
```powershell
./scripts/setup_ai_backend.ps1
```
This script will automatically:
- Fix your `.env` encoding issues
- Login to Supabase CLI
- Set your secure API keys
- Deploy the latest Edge Function

---

## Manual Setup (Fallback)

If the script above fails, follow these manual steps.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or login with GitHub
3. Click **"New Project"**
4. Fill in:
   - **Project name**: `future-job-fit`
   - **Database password**: (save this!)
   - **Region**: Choose closest to you
5. Wait ~2 minutes for project creation

---

## Step 2: Get Your Project Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: Under "Project API keys"

---

## Step 3: Login to Supabase CLI

Open a terminal in your project directory and run:

```bash
npx supabase login
```

This opens a browser for authentication. Authorize and return to terminal.

---

## Step 4: Link Your Project

```bash
npx supabase link --project-ref YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with the ID from your project URL (the part before `.supabase.co`).

---

## Step 5: Set API Key Secrets

Add your AI API keys as secrets (these are stored securely on Supabase, never exposed to clients):

```bash
# For Gemini (recommended - free tier available)
npx supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here

# For OpenAI (optional)
npx supabase secrets set OPENAI_API_KEY=your_openai_api_key_here

# For Groq (optional - fast and free)
npx supabase secrets set GROQ_API_KEY=your_groq_api_key_here

# Set default provider
npx supabase secrets set AI_PROVIDER=gemini
```

---

## Step 6: Deploy the Edge Function

Your edge function is already in `supabase/functions/resume-ai/index.ts`.

Deploy it:

```bash
npx supabase functions deploy resume-ai --no-verify-jwt
```

The `--no-verify-jwt` flag allows unauthenticated calls (for demo purposes).

---

## Step 7: Update Your .env.local

Update your `.env.local` file with real Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_public_key_here

# AI Configuration
VITE_AI_PROVIDER=gemini
VITE_AI_DEMO_MODE=false
```

**Important**: Set `VITE_AI_DEMO_MODE=false` to use real AI!

---

## Step 8: Restart Dev Server

```bash
# Stop current server (Ctrl+C) and restart
npm run dev
```

---

## Step 9: Test the Integration

1. Open your app at `http://localhost:8080`
2. Go to Resume Wizard → any step with "Enhance with AI"
3. Check console for: `[AI Service] Using provider: gemini (server-side via Supabase Edge Function)`
4. Try generating AI enhancements - they should now use real AI!

---

## Troubleshooting

### "Edge function not found"
```bash
npx supabase functions list
```
Make sure `resume-ai` is listed. If not, redeploy.

### "GEMINI_API_KEY not configured"
```bash
npx supabase secrets list
```
Verify your secrets are set.

### "Invalid API key"
Get a new API key from:
- **Gemini**: https://aistudio.google.com/app/apikey
- **OpenAI**: https://platform.openai.com/api-keys
- **Groq**: https://console.groq.com/keys

---

## Getting Free AI API Keys

### Gemini (Recommended - Free Tier)
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Sign in with Google
3. Click "Get API Key" → "Create API key"
4. Copy the key

### Groq (Free & Fast)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (free)
3. Go to API Keys → Create new key
4. Copy the key

### OpenAI (Paid, Pay-as-you-go)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up (requires payment method)
3. Go to API Keys → Create new key
4. Copy the key

---

## Quick Command Summary

```bash
# Login to Supabase
npx supabase login

# Link project
npx supabase link --project-ref YOUR_PROJECT_ID

# Set secrets
npx supabase secrets set GEMINI_API_KEY=your_key_here

# Deploy function
npx supabase functions deploy resume-ai --no-verify-jwt

# Check logs
npx supabase functions logs resume-ai
```
