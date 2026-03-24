# Phase 05: Keyword Integration Fix - Research

**Researched:** 2026-03-24
**Domain:** AI Resume Enhancement, Natural Language Processing, Keyword Integration
**Confidence:** HIGH

## Summary

The "keyword dump" problem occurs because the current implementation treats keyword integration as a simple append/copy operation rather than contextual rewriting. When users interact with JD keyword hints or AI enhancement, keywords are either copied to clipboard for manual pasting (resulting in awkward placement) or given to the AI with weak instructions to "include" them (resulting in tacked-on phrases).

The fix requires a fundamental shift from "add keywords" to "rewrite content with keywords naturally integrated." This involves both UI/UX improvements (smart insertion workflows) and AI prompt engineering (contextual integration instructions).

**Primary recommendation:** Implement a "Smart Integration" mode that rewrites content to naturally weave keywords into sentences, using the existing `rewriteBulletWithKeyword` method as a pattern, extended across all resume sections.

---

## Current Implementation Review

### 1. JD Keyword Hints Flow (The "Copy-Paste" Problem)

**File:** `src/features/resume-builder/components/helpers/JDKeywordHints.tsx`

```typescript
// Lines 27-34: Extract keywords from JD
const extractKeywords = () => {
  const fields = currentJob.extractedFields || [];
  const keywords = fields
    .filter(field => field.fieldType === 'skill' || field.fieldType === 'requirement')
    .map(field => field.value);
  return keywords;
};

// Lines 77-84: Copy to clipboard - NO INTEGRATION
const handleCopyKeyword = (keyword: string) => {
  navigator.clipboard.writeText(keyword);
  toast({
    title: "Copied to clipboard",
    description: `"${keyword}" copied. Add it naturally to your content.`,
    duration: 2000
  });
};
```

**Problem:** Users get raw keywords copied to clipboard. They must manually paste and integrate, leading to awkward phrasing like:
- "I worked on projects. React"
- "Experience with Node.js, AWS" (at end of unrelated bullet)

### 2. AI Enhancement Flow (The "Weak Prompt" Problem)

**File:** `src/shared/api/resumeAI.ts` (Lines 156-170)

```typescript
private async callGeminiDirect(apiKey: string, task: string, data: any): Promise<any> {
  let prompt = '';
  if (task === 'enhanceSection') {
    prompt = `You are a professional resume writer. Enhance the following ${data.section_type} section.
    Original text: ${data.original_text}
    ${data.quick_preset ? `Style: ${data.quick_preset}` : ''}
    ${data.tone_style?.length ? `Tone: ${data.tone_style.join(', ')}` : ''}
    ${data.industry_keywords ? `Include keywords: ${data.industry_keywords}` : ''}  // <-- WEAK INSTRUCTION
    
    Provide 3 enhanced variants...`;
  }
}
```

**File:** `supabase/functions/resume-ai/index.ts` (Lines 492-518)

```typescript
const getEnhancementSystemPrompt = (payload: EnhancementRequest): string => {
  return `You are a Career Expert & Resume Strategist...
  
  INPUT CONTENT:
  ${payload.original_text}
  
  CONTEXT:
  - Section: ${payload.section_type}
  - Preset: ${payload.quick_preset || 'Standard'}
  - Tone: ${payload.tone_style?.join(', ') || 'Professional'}
  
  RULES:
  1. Preserve all factual data...
  2. Use strong action verbs...
  // NOTE: No explicit instruction on HOW to integrate keywords
  
  RESPONSE FORMAT (JSON ONLY):
  ...`;
};
```

**Problem:** The AI receives keywords with only "Include keywords" instruction - no guidance on:
- Where in the sentence to place them
- How to grammatically integrate them
- When to rewrite vs append

### 3. Demo Mode (The Literal "Dump")

**File:** `src/shared/api/resumeAI.ts` (Lines 272-328)

```typescript
private getDemoResponse(task: string, data: any): any {
  if (task === 'enhanceSection') {
    const original = data.original_text || '';
    // Basic lexical variations for demo mode
    const variants = [
      original.replace(/Experienced/i, 'A seasoned').replace(/Building/i, 'Architecting').replace(/Expert/i, 'Strategist'),
      `Accomplished professional with a proven track record in ${original.toLowerCase()}.`,
      `Dynamic individual leveraging expertise to drive results in ${original.toLowerCase()}.`,
      // <-- Appends content as-is with keyword "in original"
    ];
  }
}
```

**Problem:** Demo mode does string replacement and appending - this trains users to expect "dump" behavior.

### 4. Existing Smart Integration (Underutilized)

**File:** `src/shared/api/resumeAI.ts` (Lines 616-705)

```typescript
async rewriteBulletWithKeyword(request: {
  originalBullet: string;
  keyword: string;
  context?: string;
}): Promise<{ rewrittenBullet: string }> {
  const prompt = `You are a professional resume writer. Rewrite this resume bullet point to naturally incorporate the keyword "${request.keyword}".
  
  Original bullet point: "${request.originalBullet}"
  
  Rules:
  1. Keep the same meaning and achievements
  2. Naturally integrate the keyword - don't just append it  // <-- EXPLICIT RULE
  3. Maintain professional tone
  4. Keep similar length
  5. Use strong action verbs
  
  Return ONLY the rewritten bullet point, nothing else.`;
}
```

**Problem:** This method exists but is ONLY used by `KeywordIntegrationModal`. It's not connected to:
- JDKeywordHints (copy-to-clipboard)
- AIEnhanceModal (weak "include keywords" prompt)
- Direct text editing in forms

---

## Root Cause Analysis

### The "Dump" Behavior Has 3 Sources:

1. **Manual Integration Path**: JDKeywordHints → Copy → Manual Paste = Unnatural placement
2. **Weak AI Instructions**: "Include keywords" vs "Rewrite to naturally weave in keywords"
3. **Missing Integration Layer**: No bridge between "missing keywords" and "rewritten content"

### User Flow Breakdown:

```
Current Flow (Broken):
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ JD Analysis     │────▶│ Missing Keywords │────▶│ Copy to Clipboard│
│ Extracts Skills │     │ Displayed as     │     │ Manual Paste     │
│                 │     │ Clickable Badges │     │ (Awkward!)       │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Receive Variants│◀────│ AI Enhancement   │◀────│ "Include these  │
│ (May have       │     │ (Weak Prompt)    │     │ keywords"       │
│ tacked-on       │     │                  │     │ (Weak!)         │
│ keywords)       │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘

Desired Flow (Fixed):
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ JD Analysis     │────▶│ Missing Keywords │────▶│ "Smart Insert"  │
│ Extracts Skills │     │ With "Integrate  │     │ Option          │
│                 │     │ Here" Button    │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                           │
                                                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Natural Language│◀────│ AI Rewrite with  │◀────│ Context +       │
│ (Keywords woven │     │ Strong Prompt    │     │ Target Keywords │
│ into sentences) │     │ "Weave these     │     │                 │
│                 │     │ naturally"       │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

---

## Recommended Solution Approaches

### Approach 1: Enhanced AI Prompts (Quick Win)

**Change:** Update AI prompts to explicitly instruct contextual integration

**Implementation:**
```typescript
// In supabase/functions/resume-ai/index.ts
const getEnhancementSystemPrompt = (payload: EnhancementRequest): string => {
  const keywordInstruction = payload.industry_keywords 
    ? `CRITICAL - Keyword Integration:
    You MUST naturally weave these keywords into the content: ${payload.industry_keywords}
    - Do NOT append keywords at the end
    - Do NOT create standalone keyword lists within bullets
    - Rewrite sentences to incorporate keywords grammatically
    - Example BAD: "Led team projects. React"
    - Example GOOD: "Led React-based team projects, delivering 3 features"
    - Keywords should feel organic to the sentence flow`
    : '';
    
  return `... ${keywordInstruction} ...`;
};
```

**Pros:** Simple, no UI changes
**Cons:** AI may still struggle with complex integrations

### Approach 2: Smart Insert Mode (Recommended)

**Change:** Add "Smart Insert" button to JDKeywordHints that triggers `rewriteBulletWithKeyword`

**New Component Flow:**
```typescript
// Enhanced JDKeywordHints
const handleSmartInsert = async (keyword: string) => {
  // 1. Detect which field has focus (experience bullet, summary, etc.)
  // 2. Get current text
  // 3. Call rewriteBulletWithKeyword
  // 4. Show inline diff/preview
  // 5. Apply on confirm
};
```

**UI Changes:**
- Replace "click to copy" with "click to integrate"
- Add inline preview showing before/after
- Allow users to select target location (which bullet/experience)

**Pros:** Direct integration, natural language, user control
**Cons:** Requires focus detection, more complex UI

### Approach 3: Contextual AI Enhancement (Comprehensive)

**Change:** Modify AIEnhanceModal to:
1. Detect missing JD keywords automatically
2. Pass them as required integrations (not suggestions)
3. Show keyword integration preview
4. Allow selective application

**Implementation:**
```typescript
// In AIEnhanceModal
const performEnhancement = async () => {
  // Get missing keywords for this section
  const missingKeywords = getSectionMissingKeywords(step);
  
  const request: EnhancementRequest = {
    section_type: step,
    original_text: originalText,
    industry_keywords: missingKeywords.join(', '),
    restrictions: `CRITICAL: You MUST integrate these keywords naturally into the content. 
      Do not append them. Rewrite sentences to include them grammatically.
      Keywords to integrate: ${missingKeywords.join(', ')}`
  };
  
  // Show variants with keyword highlighting
};
```

**Pros:** Comprehensive, works across all sections
**Cons:** More complex, requires changes to AIEnhanceModal

---

## Technical Implementation Options

### Option A: Extend Existing `rewriteBulletWithKeyword`

**File:** `src/shared/api/resumeAI.ts` (Lines 616-705)

**Changes Needed:**
1. Add support for multiple keywords (currently single keyword)
2. Add support for different section types (currently only bullets)
3. Connect to JDKeywordHints component

```typescript
// Enhanced method signature
async integrateKeywords(request: {
  content: string;
  keywords: string[];
  sectionType: 'summary' | 'experience' | 'skills';
  targetLocation?: 'inline' | 'new_bullet' | 'end';
}): Promise<{ rewrittenContent: string; appliedKeywords: string[] }> {
  // Implement section-aware integration
}
```

### Option B: Create New `SmartKeywordInserter` Service

**New File:** `src/shared/lib/ai/smartKeywordInserter.ts`

**Features:**
- Parse resume structure to find insertion points
- Determine best integration method (inline, new bullet, rewrite)
- Show preview before applying
- Support undo/redo

```typescript
export class SmartKeywordInserter {
  async suggestIntegration(
    keyword: string,
    resumeData: ResumeData,
    section: string
  ): Promise<IntegrationSuggestion[]> {
    // Return ranked suggestions with confidence scores
  }
  
  async applyIntegration(
    suggestion: IntegrationSuggestion
  ): Promise<ResumeData> {
    // Apply the change and return updated resume
  }
}
```

### Option C: AI-Powered Full Rewrite with Keyword Constraints

**New Prompt Strategy:**
```typescript
const SMART_INTEGRATION_PROMPT = `
You are an expert resume writer. Your task is to rewrite the content 
to naturally incorporate the following keywords: {{keywords}}

Original Content:
{{content}}

SECTION TYPE: {{sectionType}}

INTEGRATION RULES:
1. Analyze where each keyword fits best based on semantic relevance
2. Rewrite sentences to weave keywords into natural flow
3. NEVER append keywords at the end as standalone phrases
4. NEVER create "Skills: X, Y, Z" lists within narrative sections
5. Ensure grammatical correctness after integration
6. Maintain original meaning and achievements

BAD EXAMPLES (NEVER DO):
- "Led projects. React, Node.js"
- "Worked on team. AWS"
- "Experience includes: TypeScript"

GOOD EXAMPLES:
- "Led React and Node.js projects, delivering 3 customer-facing features"
- "Architected AWS cloud infrastructure serving 50K daily users"
- "Built TypeScript-based component library adopted by 5 teams"

Return JSON:
{
  "rewrittenContent": "...",
  "integratedKeywords": ["..."],
  "confidence": 0.95
}
`;
```

---

## Success Criteria for the Fix

### Functional Requirements

1. **Natural Integration**: Keywords must be grammatically integrated into sentences, not appended
2. **Context Awareness**: System should suggest appropriate locations for keywords
3. **User Control**: Users can preview and approve/reject integrations
4. **Multi-Section Support**: Works for Summary, Experience bullets, and Projects
5. **Preserves Content**: Original achievements and meaning maintained

### UX Requirements

1. **No Manual Copy-Paste**: Users shouldn't need to copy keywords manually
2. **Inline Preview**: Show before/after diff before applying
3. **One-Click Apply**: Smart suggestions can be applied with single click
4. **Clear Feedback**: Show which keywords were integrated successfully

### Quality Metrics

1. **Integration Success Rate**: >90% of keywords integrated without manual editing
2. **User Acceptance**: >80% of AI suggestions accepted without modification
3. **Grammatical Correctness**: 100% of integrated content must be grammatically valid
4. **ATS Compatibility**: Integrated keywords must still be detected by ATS parser

---

## Common Pitfalls to Avoid

### Pitfall 1: Keyword Stuffing

**Problem:** Over-integrating keywords makes content unnatural
**Prevention:** Limit to 3-5 keywords per section, prioritize most important

### Pitfall 2: Context Mismatch

**Problem:** Adding "Kubernetes" to 2018 experience (before widespread adoption)
**Prevention:** Check dates/experience context before suggesting integration

### Pitfall 3: Lost Achievements

**Problem:** In rewriting to fit keywords, original metrics get lost
**Prevention:** Explicit prompt instruction: "Preserve all metrics and achievements"

### Pitfall 4: Demo Mode Misleading

**Problem:** Demo mode shows simple string replacement, setting wrong expectations
**Prevention:** Update demo mode to show realistic natural integration examples

---

## Code Examples

### Example: Enhanced JDKeywordHints with Smart Integration

```typescript
// src/features/resume-builder/components/helpers/JDKeywordHints.tsx

const handleSmartIntegrate = async (keyword: string) => {
  // Detect active field (needs focus tracking)
  const activeField = getActiveResumeField();
  if (!activeField) {
    // Show modal to select target location
    openIntegrationModal(keyword);
    return;
  }
  
  // Call smart integration
  const result = await resumeAI.integrateKeyword({
    content: activeField.value,
    keyword,
    sectionType: activeField.section
  });
  
  // Show inline preview
  showIntegrationPreview({
    before: activeField.value,
    after: result.rewrittenContent,
    onAccept: () => updateField(activeField.id, result.rewrittenContent),
    onReject: () => {/* do nothing */}
  });
};

// In render:
{missingKeywords.slice(0, 5).map(keyword => (
  <Badge
    key={keyword}
    variant="outline"
    className="cursor-pointer hover:bg-amber-100"
    onClick={() => handleSmartIntegrate(keyword)} // <-- Changed from copy
  >
    {keyword}
    <Wand2 className="h-3 w-3 ml-1" /> {/* Magic wand icon */}
  </Badge>
))}
```

### Example: Updated AI Prompt for Natural Integration

```typescript
// In supabase/functions/resume-ai/index.ts

const getSmartIntegrationPrompt = (
  content: string,
  keywords: string[],
  sectionType: string
): string => {
  return `You are an expert resume writer specializing in ATS optimization.

TASK: Rewrite the following ${sectionType} section to naturally incorporate these keywords: ${keywords.join(', ')}

ORIGINAL CONTENT:
${content}

RULES FOR NATURAL INTEGRATION:
1. REWRITE sentences to weave keywords into the flow - do NOT append them
2. Keywords must be grammatically part of sentences
3. Maintain all original facts, metrics, and achievements
4. Use strong action verbs (Led, Architected, Implemented, etc.)
5. Ensure the result sounds professional and natural

INTEGRATION EXAMPLES:

BAD (Appending):
"Managed development team. React, Node.js"

GOOD (Natural Integration):
"Led React and Node.js development team of 5 engineers, delivering 12 features"

BAD (Standalone mention):
"Experience with AWS"

GOOD (Contextual):
"Architected AWS infrastructure serving 50K daily users with 99.9% uptime"

RETURN FORMAT (JSON ONLY):
{
  "rewrittenContent": "The full rewritten content",
  "integratedKeywords": ["list", "of", "successfully", "integrated", "keywords"],
  "unchangedContent": "Parts that didn't need changing",
  "notes": "Brief explanation of changes made"
}`;
};
```

---

## State of the Art

| Approach | When Used | Pros | Cons |
|----------|-----------|------|------|
| **Copy-Paste** (Current) | Manual integration | Full user control | Awkward phrasing, time-consuming |
| **AI "Include"** (Current) | AI Enhancement | Automated | Weak results, keyword dumping |
| **Smart Rewrite** (Proposed) | One-click integration | Natural language, fast | Requires good AI prompts |
| **Template-Based** | Fallback when AI fails | Reliable, fast | Less flexible, generic |

---

## Open Questions

1. **Focus Detection**: How do we detect which field the user is currently editing to offer inline integration?
   - *Current knowledge:* No focus tracking exists in ResumeContext
   - *Recommendation:* Add focus tracking or use explicit "Integrate Here" buttons

2. **Multi-Keyword Integration**: Should we integrate one keyword at a time or allow batch integration?
   - *Current knowledge:* `rewriteBulletWithKeyword` supports single keyword
   - *Recommendation:* Start single, batch as enhancement

3. **Demo Mode Realism**: Should demo mode show realistic integration or current simple replacement?
   - *Current knowledge:* Demo mode does string replacement (misleading)
   - *Recommendation:* Update demo mode to show realistic natural integration

---

## Sources

### Primary (HIGH confidence)
- `src/features/resume-builder/components/helpers/JDKeywordHints.tsx` - Current keyword hint implementation
- `src/shared/api/resumeAI.ts` - AI service with `rewriteBulletWithKeyword` method
- `src/features/job-optimizer/components/KeywordIntegrationModal.tsx` - Existing smart integration UI
- `supabase/functions/resume-ai/index.ts` - AI prompts and enhancement logic

### Secondary (MEDIUM confidence)
- `src/features/resume-builder/components/modals/AIEnhanceModal.tsx` - AI enhancement modal
- `src/shared/hooks/useResumeAI.ts` - Hook wrapping AI service

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All code reviewed and verified
- Architecture: HIGH - Clear separation of concerns
- Pitfalls: MEDIUM - Based on code analysis and UX best practices

**Research date:** 2026-03-24
**Valid until:** 2026-04-24 (30 days for stable codebase)

---

## RESEARCH COMPLETE

**Phase:** 05 - Keyword Integration Fix
**Confidence:** HIGH

### Key Findings

1. **Root Cause Identified**: The "dump" behavior stems from two broken paths:
   - JDKeywordHints uses copy-to-clipboard instead of smart integration
   - AI enhancement uses weak "include keywords" prompts instead of "rewrite to weave in"

2. **Solution Exists but Underutilized**: The `rewriteBulletWithKeyword` method (lines 616-705 in resumeAI.ts) already implements smart integration but is only used by KeywordIntegrationModal

3. **Quick Win Available**: Updating AI prompts to explicitly instruct "rewrite to naturally weave in" vs "include keywords" will improve results immediately

4. **Comprehensive Fix Required**: Full solution requires connecting smart integration to JDKeywordHints and AIEnhanceModal

### Recommended Implementation Path

1. **Phase 1 (Quick Fix)**: Update AI prompts with explicit natural integration instructions
2. **Phase 2 (UX Fix)**: Add "Smart Insert" button to JDKeywordHints using existing `rewriteBulletWithKeyword`
3. **Phase 3 (Comprehensive)**: Extend smart integration to all sections with inline preview

### File Created
`.planning/phases/05-keyword-integration-fix/05-RESEARCH.md`

### Ready for Planning
Research complete. Planner can now create PLAN.md with specific tasks for implementation.
