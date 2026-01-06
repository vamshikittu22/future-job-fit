# STEP 1 Rollback Instructions

## ⚠️ When to Rollback

Rollback if:
- AI features completely broken after deployment
- Supabase Edge Functions cannot be deployed
- Production issues that cannot be quickly resolved
- Need to revert to previous working state

## 📦 Quick Rollback (Git)

If you committed STEP 1 changes:

```bash
# Find the commit before STEP 1
git log --oneline -10

# Rollback to the commit before STEP 1
git revert <commit-hash-of-step-1>

# Or reset if not pushed to remote
git reset --hard <commit-hash-before-step-1>
```

## 🔧 Manual Rollback Steps

### 1. Restore Old Resume AI Service

Replace `src/shared/api/resumeAI.ts` with the old version that makes direct API calls:

```bash
git checkout HEAD~1 -- src/shared/api/resumeAI.ts
```

### 2. Restore Old Edge Function (if modified)

```bash
git checkout HEAD~1 -- supabase/functions/resume-ai/index.ts
```

### 3. Restore Old Environment File

```bash
git checkout HEAD~1 -- .env.example
```

### 4. Restore Old Documentation

```bash
git checkout HEAD~1 -- README.md GPT_INTEGRATION.md
```

### 5. Restore Legacy API Endpoint (if deleted)

If `/api/resume.js` was deleted and it was actually in use:

```bash
git checkout HEAD~1 -- api/resume.js
```

### 6. Update .env to Use Client-Side Keys Again

Change `.env` back to:

```env
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=your_gemini_key_here
VITE_OPENAI_API_KEY=your_openai_key_here
VITE_GROQ_API_KEY=your_groq_key_here
```

Remove:
```env
# Remove these
VITE_SUPABASE_URL=...
VITE_SUPABASE_PUBLISHABLE_KEY=...
GEMINI_API_KEY=...
OPENAI_API_KEY=...
GROQ_API_KEY=...
```

### 7. Rebuild

```bash
npm run build
```

### 8. Verify

```bash
npm run dev
```

Test AI features work with direct API calls again.

## 🔍 Verification After Rollback

- [/] AI enhancement works in wizard
- [/] No Supabase-related errors in console
- [/] Build succeeds
- [/] All routes still accessible

## 📝 Post-Rollback Actions

If you had to rollback:

1. Document the specific issue that caused the rollback
2. Create a GitHub issue or note with:
   - Error messages
   - Steps to reproduce
   - Environment details
3. Plan a fix before attempting STEP 1 again

## 💡 Partial Rollback Options

### Keep Edge Function, Revert Frontend

If edge function works but frontend has issues:

```bash
# Only revert frontend changes
git checkout HEAD~1 -- src/shared/api/resumeAI.ts
```

### Keep Documentation, Revert Code

If you want to keep the updated docs but revert code:

```bash
# Revert only code files
git checkout HEAD~1 -- src/shared/api/resumeAI.ts supabase/functions/resume-ai/index.ts
```

## 🆘 Emergency Rollback (Production)

If in production and edge function is down:

### Option A: Hotfix Environment Variable

Add a feature flag to disable edge function temporarily:

```env
# In production .env
VITE_USE_EDGE_FUNCTION=false
```

Then add a check in `resumeAI.ts`:

```typescript
private async callEdgeFunction(task: string, data: any): Promise<any> {
  const useEdgeFunction = import.meta.env.VITE_USE_EDGE_FUNCTION !== 'false';
  
  if (!useEdgeFunction) {
    // Fall back to direct API calls
    return this.legacyDirectCall(task, data);
  }
  
  // Normal edge function call...
}
```

### Option B: Redeploy Previous Version

If using Vercel/Netlify/similar:

1. Go to deployment dashboard
2. Find the deployment before STEP 1
3. Click "Redeploy" or "Promote to Production"

## 📞 Support Checklist

Before rolling back, check:

- [/] Supabase project status (dashboard)
- [/] Edge function deployment logs
- [/] Browser console errors
- [/] Network tab for failed requests
- [/] Supabase function logs: `supabase functions logs resume-ai`

## ✅ Rollback Complete Checklist

After rollback:

- [/] Application builds successfully
- [/] AI features work (at least in fallback mode)
- [/] No console errors on startup
- [/] All routes accessible
- [/] Documentation updated to reflect rollback (if needed)
- [/] Team notified of rollback
