# 🤖 AI Integration Guide

The **AI Resume Builder** features a secure, server-side AI engine powered by **Supabase Edge Functions** that protects your API keys and supports multiple AI providers.

## 🔒 Security Architecture

**Previous Approach** (❌ Insecure):
- API keys in client-side `.env` with `VITE_` prefix
- Keys exposed in browser bundle
- Direct API calls from frontend

**Current Approach** (✅ Secure):
- API keys stored server-side in Supabase secrets
- All AI calls routed through Supabase Edge Function (`resume-ai`)
- Frontend only calls secure gateway endpoint
- Zero API key exposure to browser

## ⚙️ Configuration

### 1. Choose Your AI Provider

Set `VITE_AI_PROVIDER` in your `.env` (client-side):

| Provider | Model Used | Best For |
| :--- | :--- | :--- |
| `gemini` | `gemini-1.5-flash` | Speed & Free-tier availability |
| `openai` | `gpt-4o-mini` | High quality & consistency |
| `groq` | `llama-3.3-70b-versatile` | Performance and ultra-low latency |

```env
VITE_AI_PROVIDER=gemini
```

### 2. Configure Supabase (Required)

Add your Supabase project credentials to `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

### 3. Set Server-Side API Keys

#### Local Development

Add API keys to your local `.env` (WITHOUT `VITE_` prefix):

```env
GEMINI_API_KEY=your_actual_gemini_key
OPENAI_API_KEY=your_actual_openai_key
GROQ_API_KEY=your_actual_groq_key
AI_PROVIDER=gemini
```

#### Production Deployment

Set secrets in Supabase using the CLI or Dashboard:

```bash
# Using Supabase CLI
supabase secrets set GEMINI_API_KEY=your_key
supabase secrets set OPENAI_API_KEY=your_key
supabase secrets set GROQ_API_KEY=your_key
supabase secrets set AI_PROVIDER=gemini
```

Or via **Supabase Dashboard** → Project Settings → Edge Functions → Secrets.

## 🛠️ How It Works

### Architecture Flow

```
User Input
   ↓
Frontend (resumeAI.ts)
   ↓
Supabase Client SDK
   ↓
Edge Function (resume-ai)
   ↓
AI Provider API (Gemini/OpenAI/Groq)
   ↓
Response back to Frontend
```

### 1. Enhancement Request

When a user clicks **"Enhance with AI"**, the frontend calls:

```typescript
const result = await resumeAI.enhanceSection({
  section_type: 'experience',
  original_text: 'Led team of developers...',
  quick_preset: 'ATS Optimized',
  tone_style: ['Professional', 'Impactful'],
});
```

This triggers the Supabase Edge Function at `supabase/functions/resume-ai/index.ts`.

### 2. Server-Side Processing

The edge function:
1. Validates the request
2. Selects the AI provider (Gemini/OpenAI/Groq)
3. Makes the API call using server-side secret keys
4. Returns 3-5 improved variants

### 3. Multi-Variant Response

Response format:

```json
{
  "section_type": "experience",
  "preset_used": "ATS Optimized",
  "applied_tone_style": ["Professional", "Impactful"],
  "variants": [
    "Spearheaded cross-functional team of 5 developers...",
    "Led engineering team that delivered 3 major features...",
    "Directed development team, achieving 40% faster delivery..."
  ],
  "notes": "Optimized for ATS with industry keywords"
}
```

### 4. Section Analysis

The `analyzeSection` method evaluates content quality:

```typescript
const analysis = await resumeAI.analyzeSection('experience-1', content);
```

Returns:
```json
{
  "score": 85,
  "strengths": ["Strong action verbs", "Quantifiable metrics"],
  "weaknesses": ["Missing industry keywords"],
  "suggestions": ["Add specific technologies used", "Quantify team size"]
}
```

## 🚀 Local Development Setup

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Link to Your Project

```bash
supabase link --project-ref your-project-id
```

### 3. Serve Edge Functions Locally

```bash
supabase functions serve resume-ai --env-file .env
```

This runs the edge function at `http://localhost:54321/functions/v1/resume-ai`.

### 4. Test the Function

```bash
curl -X POST http://localhost:54321/functions/v1/resume-ai \
  -H "Content-Type: application/json" \
  -d '{
    "task": "enhanceSection",
    "provider": "gemini",
    "section_type": "summary",
    "original_text": "Experienced developer with 5 years in web development"
  }'
```

## 🚨 Migration from Client-Side Keys

If you were using the old approach with `VITE_GEMINI_API_KEY`, etc.:

1. **Remove** all `VITE_*_API_KEY` variables from `.env`
2. **Add** `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
3. **Set** server-side secrets in Supabase (see Configuration above)
4. **Keep** `VITE_AI_PROVIDER` to choose your preferred provider

## 🧪 Testing Your Setup

1. Open the **Professional Summary** step in the wizard
2. Type a few words in the summary field
3. Click **"Enhance with AI"**
4. If variants appear → ✅ Setup successful!
5. If errors occur → Check browser console and Supabase function logs

### Debugging

View edge function logs:

```bash
supabase functions logs resume-ai
```

## 📚 Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [Groq API Docs](https://console.groq.com/docs)

---

**Security Note**: Never commit actual API keys to version control. Always use environment variables and Supabase secrets.
