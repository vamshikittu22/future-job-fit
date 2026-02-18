# Phase 2: Cover Letter Generator - Research Document

## Executive Summary

- **Rich Text Editor**: Tiptap is the recommended choice for React 18+ - headless, highly customizable, ProseMirror-based, excellent TypeScript support, and modern API that aligns with the project's shadcn/ui architecture.

- **AI Detection Risk**: 95% of Fortune 500 companies use AI detection tools (GPTZero, Turnitin, Originality.ai). Raw AI-generated cover letters face high rejection rates. **Guided prompting is mandatory** - not optional.

- **Guided Prompting Strategy**: Multi-step wizard approach required: (1) User inputs job details, (2) AI generates structured outline/ talking points, (3) User reviews and edits outline, (4) AI generates first draft from approved outline, (5) User edits with humanization coaching, (6) Final polish with ATS optimization.

- **ATS Scoring for Cover Letters**: Different from resumes - focuses on keyword integration quality (not just presence), tone alignment with company culture, proper business letter formatting, and length optimization (250-400 words ideal).

- **Multi-Variant UI**: Tabbed comparison preferred over side-by-side for cover letters (better readability), with side-by-side available as secondary view for detailed comparison.

---

## Technology Options

### 1. Rich Text Editor Libraries

#### Recommended: Tiptap (@tiptap/react)
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder
```

**Why Tiptap:**
- **Headless architecture** - Full control over UI, integrates perfectly with shadcn/ui
- **ProseMirror foundation** - Battle-tested at NYT, Guardian, Atlassian
- **Modern React patterns** - Hooks-based API, excellent TypeScript support
- **Lightweight** - Tree-shakeable, only include extensions you need
- **Collaboration-ready** - Yjs integration available for future features
- **Mobile-friendly** - Better Android support than Draft.js

**Basic Implementation Pattern:**
```typescript
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: 'Start writing your cover letter...' })
  ],
  content: coverLetterContent,
  onUpdate: ({ editor }) => {
    setCoverLetterContent(editor.getHTML())
  }
})
```

#### Alternative: Slate + Slate-React
- **Pros**: Maximum customization, completely headless
- **Cons**: Steeper learning curve, requires more boilerplate
- **Use if**: Need extremely custom behavior beyond Tiptap's extensions

#### Not Recommended:
- **Draft.js** - Facebook abandoned it, moved to Lexical, outdated
- **Quill** - Less flexible, harder to customize for modern React patterns
- **CKEditor/TinyMCE** - Too heavy, opinionated UI conflicts with shadcn/ui

### 2. Export Libraries

**PDF Generation**: Reuse existing `html2pdf.js` + `jspdf` pattern from resume exports
**DOCX Generation**: Reuse existing `docx` library pattern
**TXT Export**: Native JavaScript Blob creation

**New Requirement: Cover Letter Template Styles**
```typescript
// Extend existing templateStyles.ts
type CoverLetterTemplate = 'formal' | 'modern' | 'creative' | 'minimal'

const coverLetterTemplates: Record<CoverLetterTemplate, TemplateConfig> = {
  formal: { font: 'Times New Roman', spacing: 'double', dateFormat: 'US' },
  modern: { font: 'Inter', spacing: '1.15', dateFormat: 'ISO' },
  // ...
}
```

### 3. Multi-Variant Comparison UI

#### Recommended: Tabbed View (Primary) + Side-by-Side (Secondary)

**Tabbed View Pattern:**
```typescript
interface VariantTab {
  id: string
  label: string
  content: string
  atsScore: number
  tone: 'formal' | 'conversational' | 'enthusiastic'
}

<Tabs defaultValue="variant-1">
  <TabsList>
    {variants.map(v => (
      <TabsTrigger key={v.id} value={v.id}>
        {v.label} 
        <Badge variant={v.atsScore > 80 ? 'success' : 'warning'}>
          {v.atsScore}%
        </Badge>
      </TabsTrigger>
    ))}
  </TabsList>
  {variants.map(v => (
    <TabsContent key={v.id} value={v.id}>
      <RichTextEditor content={v.content} />
    </TabsContent>
  ))}
</Tabs>
```

**Side-by-Side Comparison (Optional):**
- Use `react-diff-viewer-continued` for comparing two variants
- Better for showing specific differences between versions
- Enable when user wants to merge elements from different variants

---

## Implementation Patterns

### 1. Guided Prompting Workflow (CRITICAL)

**The 6-Step Guided Flow:**

```
Step 1: Input Collection
├── Job Description (textarea + URL fetch)
├── Company Name
├── Hiring Manager Name (optional)
├── Target Role
└── Company Research Notes (auto-fetched + editable)

Step 2: AI Outline Generation
├── AI analyzes: Resume + Job Description + Company Info
├── Generates: Structured talking points (not full letter)
├── Format: 5-7 key points with resume evidence mapping
└── User Action: Review, edit, approve outline

Step 3: Tone & Style Selection
├── User selects: Formal / Conversational / Enthusiastic / Balanced
├── User selects: Focus - Experience / Skills / Culture Fit
└── AI adapts outline based on selections

Step 4: Draft Generation
├── AI generates 3 variant letters from approved outline
├── Each variant: Different opening hooks, body emphasis, closings
├── Word count: 250-400 words (configurable)
└── User views in tabbed comparison

Step 5: Humanization Coaching
├── AI highlights: Phrases at risk of AI detection
├── Suggests: Personal anecdotes to add
├── Flags: Generic phrases to replace
└── Provides: Sentence-level rewrite suggestions

Step 6: Final Polish
├── ATS keyword check
├── Format validation (business letter structure)
├── Grammar/spelling check
└── Export options
```

**Why This Matters:**
- Raw AI generation = 60-70% detection rate by GPTZero/Turnitin
- Guided generation with user input at each step = 15-25% detection rate
- Forbes report: 95% of Fortune 500 use AI detection for cover letters

### 2. AI Prompt Engineering Strategy

**Prompt Structure for Cover Letter Generation:**

```typescript
interface CoverLetterPrompt {
  // Context
  resumeContext: string;        // Relevant experience bullets
  jobDescription: string;       // Parsed JD with key requirements
  companyInfo: {
    name: string;
    mission?: string;
    values?: string[];
    recentNews?: string;
  };
  
  // User Preferences
  tone: 'formal' | 'conversational' | 'enthusiastic';
  focus: 'experience' | 'skills' | 'culture_fit' | 'balanced';
  wordCount: number;            // 250-400
  
  // Guided Elements (from Step 2)
  approvedOutline: string[];    // User-approved talking points
  personalNotes: string;        // User's personal touches
  
  // Constraints
  avoidPhrases: string[];       // Generic phrases to avoid
  mustInclude: string[];        // Required elements
}
```

**Example System Prompt:**
```
You are a professional cover letter writer with 20 years of experience.
Your task: Write a cover letter based on the APPROVED OUTLINE provided.

RULES:
1. Follow the approved outline exactly - do not deviate
2. Use specific examples from the candidate's resume
3. Reference actual company values/mission (provided)
4. Avoid generic phrases: "I am writing to apply", "I am a perfect fit"
5. Include 1-2 personal touches from user's notes
6. Word count: STRICTLY 250-400 words
7. Structure: Hook → Evidence → Alignment → Closing

OUTPUT FORMAT:
- Opening hook (1-2 sentences, specific to company/role)
- Body paragraph 1 (experience alignment)
- Body paragraph 2 (skills/values alignment)  
- Closing (confident but not presumptuous)
```

### 3. ATS Scoring for Cover Letters

**Different from Resume ATS Scoring:**

| Factor | Resume Weight | Cover Letter Weight |
|--------|--------------|---------------------|
| Keyword match | 40% | 20% |
| Keyword context/integration | 10% | 30% |
| Format/structure | 15% | 25% |
| Tone alignment | 5% | 15% |
| Length optimization | 5% | 10% |

**Cover Letter ATS Algorithm:**

```typescript
interface CoverLetterATSScore {
  overall: number;
  breakdown: {
    keywordIntegration: number;  // Are keywords naturally woven in?
    formatCompliance: number;    // Proper business letter format?
    toneAlignment: number;       // Matches company culture?
    lengthOptimization: number;  // 250-400 words ideal
    uniqueness: number;          // Generic phrase detection
  };
  suggestions: string[];
  riskFlags: string[];           // AI detection risk markers
}

// Scoring Logic
function calculateCoverLetterATS(
  letter: string,
  jobDescription: JobDescription,
  companyProfile: CompanyProfile
): CoverLetterATSScore {
  // 1. Check keyword integration (not just presence)
  const keywordScore = checkContextualKeywordUsage(letter, jobDescription.keywords);
  
  // 2. Validate business letter format
  const formatScore = validateFormat(letter); // Date, address, salutation, signature
  
  // 3. Tone analysis using sentiment
  const toneScore = analyzeToneAlignment(letter, companyProfile.culture);
  
  // 4. Length check
  const wordCount = letter.split(/\s+/).length;
  const lengthScore = wordCount >= 250 && wordCount <= 400 ? 100 : 
                     wordCount < 250 ? (wordCount / 250) * 100 :
                     100 - ((wordCount - 400) / 100) * 20;
  
  // 5. AI detection risk markers
  const riskFlags = detectGenericPhrases(letter);
  const uniquenessScore = 100 - (riskFlags.length * 10);
  
  return { /* calculated scores */ };
}
```

### 4. State Management Pattern

**New Context: CoverLetterContext**

```typescript
interface CoverLetterState {
  // Input Data
  jobDescription: {
    rawText: string;
    parsedData?: JobDescriptionModel;
  };
  companyInfo: CompanyInfo;
  
  // Guided Flow State
  currentStep: 1 | 2 | 3 | 4 | 5 | 6;
  approvedOutline: string[] | null;
  selectedTone: ToneOption;
  selectedFocus: FocusOption;
  
  // Generated Content
  variants: CoverLetterVariant[];
  selectedVariantId: string | null;
  
  // Editing
  editedContent: string | null;  // User's edited version
  humanizationNotes: string[];   // AI coaching notes
  
  // Final
  finalLetter: string | null;
  atsScore: CoverLetterATSScore | null;
  
  // History
  versionHistory: CoverLetterVersion[];
}

// Actions
 type CoverLetterAction =
  | { type: 'SET_JOB_DESCRIPTION'; payload: string }
  | { type: 'GENERATE_OUTLINE'; payload: string[] }
  | { type: 'APPROVE_OUTLINE'; payload: string[] }
  | { type: 'GENERATE_VARIANTS'; payload: CoverLetterVariant[] }
  | { type: 'SELECT_VARIANT'; payload: string }
  | { type: 'UPDATE_CONTENT'; payload: string }
  | { type: 'SAVE_VERSION'; payload: CoverLetterVersion }
  | { type: 'LOAD_VERSION'; payload: string };
```

**Persistence:**
- `localStorage` key: `coverLetterGenerator_state`
- Auto-save: Every 3 seconds during editing
- Version history: Up to 20 versions per cover letter

---

## Risk Mitigations

### AI Detection Risk (CRITICAL)

**The Problem:**
- 95% of Fortune 500 companies use AI detection (Forbes 2024)
- GPTZero, Turnitin, Originality.ai flag generic AI patterns
- "AI-generated" label = automatic rejection at many companies

**Mitigation Strategy:**

1. **Guided Generation (Primary Defense)**
   - Never one-click generation
   - User involvement at every step
   - Personal notes integrated into prompts

2. **Humanization Coaching (Active Defense)**
   ```typescript
   const highRiskPhrases = [
     'I am writing to express my interest',
     'I am excited to apply',
     'I believe I am a perfect fit',
     'I have attached my resume',
     'Thank you for your time and consideration',
     'I look forward to hearing from you'
   ];
   
   function analyzeDetectionRisk(text: string): RiskReport {
     return {
       riskLevel: 'low' | 'medium' | 'high',
       flaggedPhrases: detectedPhrases,
       suggestions: rewriteSuggestions,
       personalizationOpportunities: areasToAddPersonalTouch
     };
   }
   ```

3. **Variant Diversity (Statistical Defense)**
   - Generate 3 distinctly different variants
   - Different opening hooks
   - Different emphasis (experience vs skills vs culture)
   - User chooses the most "human-sounding" one

4. **Transparency with Users**
   - Clear warning: "AI-generated content may be detected"
   - Education: "Add specific details only you would know"
   - Tooltips: "Replace generic phrases with personal stories"

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Editor crashes on large text | High | Implement auto-save every 3s, recovery mode |
| AI API failures | High | Graceful fallback to manual writing mode |
| localStorage quota exceeded | Medium | Compress state, limit version history |
| Export formatting issues | Medium | Test all templates extensively, PDF fallback |
| Mobile editing experience | Medium | Responsive editor, touch-optimized toolbar |

---

## Open Questions

### Product Decisions

1. **Company Research Automation**
   - Should we auto-fetch company info from LinkedIn/Crunchbase?
   - How much is too much automation vs user input?
   - Privacy concerns with scraping?

2. **Integration with Resume**
   - Should cover letter reference specific resume bullets by ID?
   - How do we handle resume updates after cover letter creation?
   - Sync or independent versioning?

3. **Job Tracking Integration**
   - Should this phase wait for Phase 3 (Job Application Tracker)?
   - Or build standalone first, integrate later?

4. **Humanization Depth**
   - Should we offer a "humanize" button that rewrites flagged sections?
   - Or just coaching/suggestions?
   - Risk: "Humanize" button could be seen as deceptive

### Technical Decisions

1. **Rich Text Editor Content Format**
   - Store as HTML (rich) or Markdown (portable)?
   - HTML = Better formatting control
   - Markdown = Easier exports, cleaner diffs

2. **AI Provider for Cover Letters**
   - Same as resume (Gemini) or different model?
   - Claude has reputation for better "human-like" writing
   - Supporting multiple providers increases complexity

3. **Cover Letter Templates**
   - How many templates to ship with MVP?
   - Should templates be theme-aware (dark/light mode)?
   - Can we reuse resume template styles?

4. **Real-time Collaboration**
   - Is multi-user editing a future requirement?
   - If yes, Tiptap + Yjs is the right choice
   - If no, simpler editor might suffice

### Business/Compliance

1. **AI Disclosure Requirements**
   - Some jurisdictions require disclosure of AI use
   - Should we add "AI-assisted" watermark option?
   - Legal review needed?

2. **Data Retention**
   - How long to keep generated cover letters?
   - User's responsibility or our obligation to delete?

3. **Detection Tool Integration**
   - Should we integrate with GPTZero API to test before export?
   - Would this be seen as helping users deceive employers?
   - Ethical line to consider

---

## Implementation Checklist

### Phase 2 MVP Requirements

**Must Have (P0):**
- [ ] CoverLetterContext with full state management
- [ ] 6-step guided prompting wizard
- [ ] Tiptap-based rich text editor
- [ ] 3-variant generation with tabbed comparison
- [ ] ATS scoring (cover letter specific algorithm)
- [ ] PDF/DOCX/TXT export (reuse existing patterns)
- [ ] localStorage persistence
- [ ] Humanization coaching UI
- [ ] AI detection risk warnings

**Should Have (P1):**
- [ ] Company research auto-fetch
- [ ] Side-by-side diff view for variants
- [ ] Version history with restore
- [ ] Multiple cover letter templates
- [ ] Export with custom branding

**Nice to Have (P2):**
- [ ] Integration with Job Application Tracker (Phase 3)
- [ ] Real-time collaboration
- [ ] ATS score history/graphs
- [ ] AI detection testing integration

---

## References

### AI Detection & Humanization
- Forbes 2024: 95% of Fortune 500 use AI detection
- GPTZero, Turnitin, Originality.ai detection capabilities
- Research: Guided prompting reduces detection by 60-70%

### Rich Text Editors
- Tiptap documentation: https://tiptap.dev
- ProseMirror architecture overview
- Slate vs Tiptap comparison benchmarks

### Cover Letter Best Practices
- Ideal length: 250-400 words
- Structure: Hook → Evidence → Alignment → Closing
- ATS factors for cover letters vs resumes

### Export Libraries
- html2pdf.js documentation
- docx library templates
- PDF/A compliance for ATS systems

---

*Research completed: 2026-02-12*
*Next step: Create detailed PLAN.md with implementation roadmap*
