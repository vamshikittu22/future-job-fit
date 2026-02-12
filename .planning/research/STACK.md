# Technology Stack Additions

**Project:** Future Job Fit — AI Career Intelligence Platform  
**Researched:** February 12, 2026  
**Overall Confidence:** HIGH (verified with official sources and current package registries)

## Executive Summary

This research identifies stack additions needed for four new features: Cover Letter Generation, LinkedIn Profile Sync, Interview Preparation Module, and Template Marketplace. The existing React + Vite + Supabase + Pyodide foundation is solid; these additions extend capabilities without architectural disruption.

**Key Decisions:**
- Continue with `@react-pdf/renderer` for cover letter PDF generation (already proven in codebase)
- Use native LinkedIn OpenID Connect (no third-party SDK needed)
- Leverage Supabase Realtime for interview practice presence/tracking
- Implement marketplace with Supabase Storage + RLS + new database schema

---

## Feature 1: Cover Letter Generation

### Recommended Additions

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `@react-pdf/renderer` | ^4.3.2 | PDF generation for cover letters | Already used for resumes; consistent API, React-native syntax, 1.7M weekly downloads, actively maintained |
| `mammoth` | ^1.11.0 | DOCX import for existing cover letters | Most reliable browser-based DOCX→HTML parser; preserves formatting; no server required |
| `pdf-lib` | ^1.17.1 | PDF manipulation (merge, split) | If combining resume + cover letter; lightweight alternative to heavy server-side tools |

### Installation

```bash
# Cover letter document handling
npm install @react-pdf/renderer@^4.3.2 mammoth@^1.11.0 pdf-lib@^1.17.1

# Type definitions
npm install -D @types/mammoth
```

### Implementation Pattern

```typescript
// Cover letter generation using same patterns as resume
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// AI enhancement uses existing Supabase Edge Function pattern
// No additional AI dependencies needed
```

### What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `jspdf` for cover letters | Lower-level API; more code for same result | `@react-pdf/renderer` (already in use) |
| Server-side Puppeteer | Overkill for cover letters; adds infrastructure cost | Client-side `@react-pdf/renderer` |
| `docx` library for parsing | Designed for generation, not parsing | `mammoth` for parsing DOCX |

---

## Feature 2: LinkedIn Profile Synchronization

### Recommended Additions

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Native OAuth 2.0 / OpenID Connect | N/A (browser API) | LinkedIn authentication | LinkedIn deprecated JS SDK in 2023; native OAuth is the only supported path |
| `jose` | ^5.9.6 | JWT verification (ID tokens) | Lightweight, modern JWT library; runs in browser and Edge Functions |
| PKCE flow implementation | Custom | Secure OAuth without client secret | Required for SPA security; prevents authorization code interception |

### Installation

```bash
# JWT handling for LinkedIn ID tokens
npm install jose@^5.9.6

# For PKCE code generation (or use native crypto)
# No additional package needed — use Web Crypto API
```

### Implementation Pattern

```typescript
// LinkedIn OAuth 2.0 with PKCE — no third-party SDK needed
class LinkedInOAuth {
  private clientId: string;
  private redirectUri: string;
  
  async initiateAuth() {
    // Generate PKCE parameters
    const codeVerifier = this.generateCodeVerifier();
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    // Store verifier for callback
    sessionStorage.setItem('linkedin_pkce', codeVerifier);
    
    // Redirect to LinkedIn
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'openid profile email w_member_social',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    });
    
    window.location.href = `https://www.linkedin.com/oauth/v2/authorization?${params}`;
  }
}
```

### Supabase Edge Function Addition

Create new Edge Function: `linkedin-profile-sync`

```typescript
// supabase/functions/linkedin-profile-sync/index.ts
// Handles token exchange (requires client secret)
// Fetches profile data from LinkedIn API v2
// Maps LinkedIn schema to internal resume schema
```

### LinkedIn API Scope Requirements

| Scope | Purpose | Note |
|-------|---------|------|
| `openid` | Basic profile (name, photo) | Required |
| `profile` | Full profile data | Required |
| `email` | Email address | Required |
| `w_member_social` | Post on behalf of user | Optional — only if sharing features added |

### Critical: What LinkedIn Does NOT Allow

LinkedIn **does not** permit:
- Bulk profile scraping via API
- Automated connection requests
- Resume/CV download from profiles
- Skills endorsement automation

**Implementation must:** Only sync user's OWN profile data with explicit consent.

---

## Feature 3: Interview Preparation Module

### Recommended Additions

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Supabase Realtime | Native (supabase-js) | Presence tracking, live practice sessions | Already available; shows who's practicing; enables collaborative features |
| `zustand` | ^5.0.3 | State management for complex interview flow | Better than Context for frequent state updates; minimal boilerplate; persists to localStorage |
| `framer-motion` | ^11.x (already in use) | Interview card animations | Existing dependency; use for flip cards, transitions |

### Installation

```bash
# Enhanced state management for interview module
npm install zustand@^5.0.3

# DevTools for debugging
npm install -D @redux-devtools/extension  # Zustand compatible
```

### Implementation Pattern: Zustand Store

```typescript
// src/features/interview-prep/store/interviewStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InterviewStore {
  currentQuestion: Question | null;
  userResponse: string;
  aiFeedback: AIFeedback | null;
  practiceHistory: PracticeSession[];
  
  setCurrentQuestion: (q: Question) => void;
  submitResponse: (response: string) => Promise<void>;
  // ... actions
}

export const useInterviewStore = create<InterviewStore>()(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: 'interview-prep-storage',
      partialize: (state) => ({ practiceHistory: state.practiceHistory })
    }
  )
);
```

### Supabase Realtime Integration

```typescript
// Track interview practice presence
const channel = supabase.channel('interview-prep', {
  config: {
    presence: {
      key: userId,
    },
  },
});

channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState();
  // Show "X people practicing now"
});

channel.subscribe();
```

### AI Integration Pattern

Reuse existing AI service pattern from `resumeAI.ts`:

```typescript
// New method in resumeAI service
async generateInterviewQuestions(params: {
  jobTitle: string;
  experienceLevel: 'entry' | 'mid' | 'senior';
  questionTypes: ('behavioral' | 'technical' | 'situational')[];
}): Promise<Question[]>;

async evaluateInterviewResponse(params: {
  question: string;
  response: string;
  jobContext: JobContext;
}): Promise<AIFeedback>;
```

### What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Socket.io | Adds unnecessary complexity; Supabase Realtime covers use case | Supabase Realtime (native) |
| Redux Toolkit | Overkill for this feature scope; adds boilerplate | Zustand or keep using Context |
| Third-party interview APIs | Unnecessary cost; AI models can generate quality questions | Existing AI providers (Gemini/OpenAI/Groq) |

---

## Feature 4: Template Marketplace

### Recommended Additions

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Supabase Storage | Native | Template file storage (JSON schemas, preview images) | Native integration; RLS support; CDN delivery |
| Supabase RLS Policies | SQL | Access control for premium vs free templates | Row Level Security already in use; extend pattern |
| `immer` | ^10.1.1 | Immutable template state updates | Industry standard; prevents accidental mutations |

### Database Schema Additions

```sql
-- Templates table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'resume', 'cover_letter'
  type TEXT NOT NULL, -- 'free', 'premium'
  price_cents INTEGER, -- NULL for free
  schema JSONB NOT NULL, -- Template structure
  preview_image_url TEXT,
  download_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User template purchases/downloads
CREATE TABLE user_templates (
  user_id UUID REFERENCES auth.users(id),
  template_id UUID REFERENCES templates(id),
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  purchase_price_cents INTEGER,
  PRIMARY KEY (user_id, template_id)
);

-- Template reviews
CREATE TABLE template_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id UUID REFERENCES templates(id),
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### RLS Policies Example

```sql
-- Templates: Public can view published free templates
CREATE POLICY "Public can view published free templates"
  ON templates FOR SELECT
  USING (is_published = true AND type = 'free');

-- Templates: Users can view their purchased premium templates
CREATE POLICY "Users can view purchased templates"
  ON templates FOR SELECT
  USING (
    is_published = true 
    AND type = 'premium'
    AND EXISTS (
      SELECT 1 FROM user_templates 
      WHERE user_templates.template_id = templates.id
      AND user_templates.user_id = auth.uid()
    )
  );

-- User templates: Users can only see their own purchases
CREATE POLICY "Users can view own purchases"
  ON user_templates FOR SELECT
  USING (user_id = auth.uid());
```

### Storage Bucket Structure

```
templates/
  ├── previews/        # Template preview images (PNG/JPG)
  │   ├── {template_id}-thumb.jpg
  │   └── {template_id}-full.jpg
  ├── schemas/         # Template JSON schemas
  │   └── {template_id}.json
  └── assets/          # Template-specific assets (fonts, graphics)
      └── {template_id}/
```

### Installation

```bash
# Immutable state updates
npm install immer@^10.1.1

# Type-safe schema validation for templates
npm install zod@^3.24.1  # If not already installed
```

### What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Stripe Connect for payouts | Overkill for MVP; marketplace complexity | Manual payout process or defer creator earnings |
| Third-party marketplace platforms | Locks in vendor; loses data ownership | Custom implementation with Supabase |
| S3/Cloudflare R2 | Extra infrastructure; no native RLS | Supabase Storage (already in use) |

---

## Core Dependency Updates

### Recommended Version Upgrades

| Package | Current | Recommended | Reason |
|---------|---------|-------------|--------|
| `@supabase/supabase-js` | ^2.39.x | ^2.95.3 | Latest features: enhanced type inference, improved Realtime stability, bug fixes |
| `zustand` | Not installed | ^5.0.3 | New interview module; better state management than Context for complex flows |
| `jose` | Not installed | ^5.9.6 | LinkedIn JWT verification; lightweight, modern |

### No Changes Needed

| Package | Status |
|---------|--------|
| `react` | Keep ^18.2.0 — upgrade to React 19 optional, not required |
| `vite` | Keep ^5.0.0 — stable, no critical features needed |
| `tailwindcss` | Keep ^3.4.0 — upgrade to v4 optional |
| `pyodide` | Keep current — offline engine working well |

---

## Architecture Decisions Summary

### 1. LinkedIn Integration: OAuth 2.0 + PKCE (No SDK)

**Decision:** Implement LinkedIn auth using native OAuth 2.0 with PKCE, not a third-party library.

**Rationale:**
- LinkedIn deprecated their JavaScript SDK in 2023
- OAuth 2.0 is a web standard — no library needed
- PKCE provides security without requiring client secret in browser
- Edge Function handles token exchange (where client secret is safe)

### 2. Interview Module: Supabase Realtime + Zustand

**Decision:** Use Supabase Realtime for presence/tracking, Zustand for state management.

**Rationale:**
- Realtime already available; no additional infrastructure
- Zustand simpler than Redux for interview-specific state
- Persistence to localStorage for offline practice continuity

### 3. Template Marketplace: Supabase Storage + RLS

**Decision:** Build custom marketplace on Supabase, not use third-party platform.

**Rationale:**
- Full data ownership
- Native RLS for access control
- Storage already integrated
- No vendor lock-in

### 4. Document Handling: Extend Existing Libraries

**Decision:** Continue using `@react-pdf/renderer` and add `mammoth` for DOCX.

**Rationale:**
- Consistency with existing resume PDF generation
- `mammoth` is the standard for client-side DOCX parsing
- No server-side document conversion needed

---

## Installation Summary

```bash
# All new production dependencies
npm install \
  @react-pdf/renderer@^4.3.2 \
  mammoth@^1.11.0 \
  pdf-lib@^1.17.1 \
  jose@^5.9.6 \
  zustand@^5.0.3 \
  immer@^10.1.1

# Development dependencies
npm install -D \
  @types/mammoth

# Upgrade existing
npm install @supabase/supabase-js@^2.95.3
```

---

## Confidence Assessment

| Technology | Confidence | Verification Source |
|------------|------------|---------------------|
| `@react-pdf/renderer` ^4.3.2 | HIGH | npm registry, GitHub releases (verified current as of Feb 2026) |
| `mammoth` ^1.11.0 | HIGH | npm registry, official repo (verified latest version) |
| LinkedIn OAuth 2.0 (no SDK) | HIGH | Official LinkedIn documentation, Microsoft Learn |
| Supabase Realtime | HIGH | Official Supabase docs, recent updates (Feb 2026) |
| Zustand ^5.0.3 | HIGH | npm registry, official docs |
| Supabase Storage + RLS | HIGH | Official Supabase docs, security retro 2025 |

---

## Sources

1. **LinkedIn API Documentation** — https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow
2. **npm @react-pdf/renderer** — https://www.npmjs.com/package/@react-pdf/renderer (v4.3.2 verified)
3. **npm mammoth** — https://www.npmjs.com/package/mammoth (v1.11.0 verified)
4. **Supabase Security Retro 2025** — https://supabase.com/blog/supabase-security-2025-retro
5. **Supabase Realtime Docs** — https://supabase.com/docs/guides/realtime
6. **Zustand Documentation** — https://docs.pmnd.rs/zustand/getting-started/introduction
7. **Supabase Storage RLS** — https://supabase.com/docs/guides/storage/security/access-control
8. **LinkedIn OAuth 2.0 Guide** — https://www.linkedin.com/developers/apps (product verification required)

---

*Stack research for: Future Job Fit — Career Intelligence Platform*  
*Researched: February 12, 2026*
