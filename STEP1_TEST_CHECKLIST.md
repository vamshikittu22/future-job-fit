# STEP 1 Manual Test Checklist

## ✅ Pre-Test Setup

### 1. Configure Environment

Update your `.env` file:

```env
# Client-side (public)
VITE_SUPABASE_URL=https://ccsbrhulwjdvrmakeqwk.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key_here
VITE_AI_PROVIDER=gemini

# Server-side (secret - for local development)
GEMINI_API_KEY=your_actual_gemini_key
OPENAI_API_KEY=your_actual_openai_key
GROQ_API_KEY=your_actual_groq_key
AI_PROVIDER=gemini
```

### 2. Start Supabase Edge Function Locally

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Serve the edge function
supabase functions serve resume-ai --env-file .env
```

This should start at `http://localhost:54321/functions/v1/resume-ai`.

### 3. Start Development Server

In a **separate terminal**:

```bash
npm run dev
```

## 🧪 Test Cases

### Test 1: Resume Wizard AI Enhancement

1. Navigate to `http://localhost:8080/resume-wizard`
2. Fill in basic personal information
3. Navigate to "Professional Summary" step
4. Type: "Software engineer with 5 years of experience"
5. Click **"Enhance with AI"** button
6. **Expected**: 
   - Loading indicator appears
   - 3-5 variant suggestions returned
   - Variants are professional and relevant
   - No API key errors in console
7. **Success Criteria**: Variants appear without errors

### Test 2: Experience Section AI Enhancement

1. Navigate to "Experience" step
2. Add a work experience entry
3. In description field, type: "Led team and built features"
4. Click **"Enhance with AI"**
5. **Expected**: 
   - Multiple improved bullet points returned
   - Text includes action verbs and is more impactful
   - No client-side API key warnings in console
6. **Success Criteria**: Enhanced text appears

### Test 3: Section Analysis

1. On any step with AI analysis feature (Experience, Projects, etc.)
2. Enter some content
3. Click **"Analyze"** button (if available)
4. **Expected**:
   - Score (0-100) displayed
   - Strengths, weaknesses, and suggestions shown
   - Analysis is relevant to the content
6. **Success Criteria**: Analysis result appears

### Test 4: Job Optimizer Flow

1. Navigate to `http://localhost:8080/input`
2. Paste a sample resume (or upload JSON)
3. Optionally paste a job description
4. Click "Analyze Resume"
5. Navigate to `/results`
6. **Expected**:
   - ATS score displayed
   - Missing keywords identified
   - Suggestions provided
   - Optimized resume shown
7. **Success Criteria**: Results page loads with AI-generated analysis

### Test 5: Provider Switching

Test with each provider:

#### Test 5a: Gemini
```env
VITE_AI_PROVIDER=gemini
```
- Restart dev server
- Try Test 1 again
- **Expected**: Works with Gemini

#### Test 5b: OpenAI
```env
VITE_AI_PROVIDER=openai
```
- Restart dev server
- Try Test 1 again
- **Expected**: Works with OpenAI (if API key configured)

#### Test 5c: Groq
```env
VITE_AI_PROVIDER=groq
```
- Restart dev server
- Try Test 1 again
- **Expected**: Works with Groq (if API key configured)

### Test 6: Error Handling

1. Stop the Supabase edge function (Ctrl+C in that terminal)
2. Try AI enhancement again
3. **Expected**:
   - Graceful error message shown
   - Fallback response with helpful note
   - Application doesn't crash
4. **Success Criteria**: User-friendly error, no crash

### Test 7: Security Verification

1. Build for production:
   ```bash
   npm run build
   ```
2. Inspect `dist/assets/*.js` files
3. Search for API key patterns:
   ```bash
   # PowerShell
   Select-String -Path "dist/assets/*.js" -Pattern "AIza.*|sk-.*|gsk_.*"
   ```
4. **Expected**: No API keys found in bundled JavaScript
5. **Success Criteria**: Zero API keys in production bundle

### Test 8: Local Edge Function Testing

Test the edge function directly (bypassing frontend):

```bash
curl -X POST http://localhost:54321/functions/v1/resume-ai \
  -H "Content-Type: application/json" \
  -d '{
    "task": "enhanceSection",
    "provider": "gemini",
    "section_type": "summary",
    "original_text": "Software developer with 5 years experience"
  }'
```

**Expected**: JSON response with variants.

## 📋 Test Results Log

| Test # | Description | Status | Notes |
|--------|-------------|--------|-------|
| 1 | Wizard AI Enhancement | ⬜️ | |
| 2 | Experience Enhancement | ⬜️ | |
| 3 | Section Analysis | ⬜️ | |
| 4 | Job Optimizer Flow | ⬜️ | |
| 5a | Gemini Provider | ⬜️ | |
| 5b | OpenAI Provider | ⬜️ | |
| 5c | Groq Provider | ⬜️ | |
| 6 | Error Handling | ⬜️ | |
| 7 | Security Verification | ⬜️ | |
| 8 | Direct Edge Function | ⬜️ | |

## 🐛 Debugging

### Check Edge Function Logs

```bash
supabase functions logs resume-ai
```

### Check Browser Console

Look for:
- `[AI Service]` prefixed logs
- Network requests to `/functions/v1/resume-ai`
- Any error messages

### Common Issues

**Issue**: "Supabase client not configured"
- **Fix**: Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set

**Issue**: "GEMINI_API_KEY not configured"
- **Fix**: Check edge function can access the key (add to `.env` for local dev)

**Issue**: CORS errors
- **Fix**: Verify CORS headers in edge function (already included)

**Issue**: "Failed to fetch"
- **Fix**: Ensure edge function is running (`supabase functions serve resume-ai --env-file .env`)

## ✅ Acceptance Criteria

- [/] All AI features work via server-side gateway
- [/] No API keys exposed in browser bundle
- [/] Optimizer flow still works
- [/] Wizard AI enhance/analyze still works
- [/] Build succeeds
- [/] Graceful error handling when edge function unavailable
