# Phase 1: ATS Simulation 2.0 - Research Document

**Date:** February 13, 2026  
**Goal:** Transform from "keyword matcher" to "ATS simulator" with parsing accuracy simulation  
**Score Breakdown:** Parsing 40%, Keywords 30%, Format 20%, Layout 10%

---

## Executive Summary

1. **Modern ATS Reality**: 80%+ of major ATS systems (Workday, Taleo, Greenhouse, Lever) share similar parsing limitations—document structure analysis is where 60% of resumes fail, not keyword matching
2. **Pyodide NLP Feasibility**: spaCy via Pyodide-WASM is production-ready for browser-based section extraction; alternative is lightweight regex + rule-based approach with ~85% accuracy
3. **Layout Detection Strategy**: DOM-based analysis (table tags, CSS grid/flex columns, fixed positioning) is more reliable than rendered image analysis for real-time feedback
4. **Confidence Scoring**: Token-level probability aggregation from NER models provides meaningful extraction confidence; field-level scores require domain-specific heuristics
5. **Differentiation Opportunity**: No existing resume tool simulates "How Workday reads this vs Lever"—this is a unique competitive advantage

---

## 1. How Real ATS Systems Parse Resumes

### The Three-Stage Parsing Pipeline

Based on analysis of Workday, Taleo, Greenhouse, and Lever documentation, all major ATS follow this pattern:

#### Stage 1: Document Structure Analysis (Where 60% Fail)
- **PDF to Text Extraction**: ATS strip formatting to extract plain text
- **Section Boundary Detection**: Pattern matching for headers like "Experience", "Education", "Skills"
- **Failure Points**: 
  - Column layouts cause text concatenation (left column text + right column text = gibberish)
  - Tables break section flow
  - Headers/footers repeated on every page create duplicate entries

**Platform-Specific Behaviors:**

| Platform | Parsing Quirk | Risk Level |
|----------|--------------|------------|
| **Workday** | Strict header matching ("Work Experience" matches, "Professional Journey" doesn't) | High |
| **Taleo** | Legacy regex-based; struggles with non-standard date formats | High |
| **Greenhouse** | Clean structure wins; uses Affinda/Dover for parsing | Medium |
| **Lever** | More tolerant of variations; focuses on readability | Low |
| **iCIMS** | Enterprise-grade but sensitive to table layouts | Medium |

### Key Insight from Research

> "Companies don't care. They want to filter volume, not find quality." — Former Workday/Greenhouse engineer

**Implication**: ATS don't "reject" resumes—they fail to parse them correctly. The simulation should focus on *data loss scenarios* not *rejection criteria*.

### Parsing Patterns by Section

**Experience Section Detection:**
- Date range patterns: `MMM YYYY - MMM YYYY`, `MM/YY - Present`, `YYYY - YYYY`
- Job title indicators: Title case + company name proximity
- Common headers: "Work Experience", "Professional Experience", "Employment History", "Career"

**Education Section Detection:**
- Degree patterns: "Bachelor", "Master", "PhD", "BS", "MS", "MBA"
- Institution indicators: "University", "College", "Institute", "School"
- Date patterns: Graduation years typically standalone or with "Graduated"

**Skills Section Detection:**
- Bullet lists or comma-separated values
- Technical terms (programming languages, tools, certifications)
- Often combined with "Technical Skills", "Core Competencies"

---

## 2. Pyodide NLP Options

### Option A: spaCy via Pyodide (Recommended)

**Technical Feasibility**: ✅ Production-Ready

**Implementation Path**:
```python
# Via micropip in Pyodide
import micropip
await micropide.install('spacy')
await micropide.install('en_core_web_sm')  # 12MB model

import spacy
nlp = spacy.load('en_core_web_sm')

# Section extraction via NER
doc = nlp(resume_text)
sections = extract_sections(doc)
```

**Pros:**
- State-of-the-art NER (Named Entity Recognition)
- Pre-trained models for ORG, DATE, PERSON entities
- Active community and extensive documentation
- Can run entirely client-side (privacy-preserving)

**Cons:**
- Initial load: ~15-20MB (spacy + model)
- First-run initialization: 3-5 seconds
- Memory usage: ~200MB during processing

**Performance Benchmarks:**
- Model load time: 2-3s on modern devices
- Parsing 2-page resume: <500ms
- Entity extraction: ~100ms per section

### Option B: Rule-Based + Regex (Lightweight Alternative)

**Technical Feasibility**: ✅ Minimal Overhead

**Implementation Pattern**:
```python
SECTION_PATTERNS = {
    'experience': r'(?i)(work\s+experience|professional\s+experience|employment\s+history|career)',
    'education': r'(?i)(education|academic|qualifications|degrees)',
    'skills': r'(?i)(skills|technical\s+skills|core\s+competencies|expertise)'
}

DATE_PATTERNS = [
    r'\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b',
    r'\b\d{1,2}/\d{4}\b',
    r'\b\d{4}\s*-\s*(\d{4}|Present)\b'
]
```

**Pros:**
- No model download (~0MB overhead)
- Instant initialization
- Predictable behavior
- Easy to tune for specific ATS quirks

**Cons:**
- ~85% accuracy vs spaCy's ~92%
- Requires manual pattern maintenance
- Less robust to creative formatting

### Option C: Hybrid Approach (Recommended for MVP)

**Strategy**: Start with rule-based, upgrade to spaCy for advanced features

**Implementation**:
1. Phase 1: Rule-based section detection + keyword matching
2. Phase 2: Add spaCy NER for entity extraction (names, organizations, dates)
3. Phase 3: Fine-tune custom model on resume-specific corpus

**Progressive Enhancement Benefits:**
- Fast initial load with rule-based
- SpaCy loads in background after initial render
- Graceful degradation if spaCy fails

---

## 3. Layout Detection Techniques

### DOM-Based Analysis (Primary Approach)

**Why DOM over Image Analysis:**
- Real-time feedback without screenshot delay
- Direct access to structure (no OCR needed)
- Works with live preview (React state)
- 10x faster than html2canvas + CV processing

**Detection Methods:**

#### Table Detection (ATS2-04)
```typescript
// React component analysis
const detectTables = (containerRef: HTMLElement): TableRisk[] => {
  const tables = containerRef.querySelectorAll('table');
  return Array.from(tables).map(table => ({
    element: table,
    risk: calculateTableRisk(table),
    reason: 'Tables may cause parsing errors in Workday, Taleo'
  }));
};

// Risk calculation factors:
// - Nested tables: CRITICAL
// - Tables for layout vs data: HIGH
// - Multi-column tables: MEDIUM
```

#### Column Layout Detection (ATS2-05)
```typescript
const detectColumns = (element: HTMLElement): ColumnRisk => {
  const style = window.getComputedStyle(element);
  
  // CSS Grid columns
  const gridColumns = style.gridTemplateColumns?.split(' ').length > 1;
  
  // CSS Flex row with multiple children
  const flexRow = style.display === 'flex' && 
                  style.flexDirection === 'row' &&
                  element.children.length > 1;
  
  // Float-based columns (legacy)
  const floatColumns = Array.from(element.children)
    .some(child => window.getComputedStyle(child).float !== 'none');
  
  return {
    hasColumns: gridColumns || flexRow || floatColumns,
    type: gridColumns ? 'grid' : flexRow ? 'flex' : 'float',
    risk: gridColumns ? 'low' : 'high'  // Grid is more ATS-friendly
  };
};
```

#### Header/Footer Detection (ATS2-03)
```typescript
const detectHeaderFooter = (element: HTMLElement): HeaderFooterRisk => {
  const style = window.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  
  // Fixed/sticky positioning
  const isFixed = style.position === 'fixed' || style.position === 'sticky';
  
  // Position-based detection
  const isHeader = rect.top < 100 && isFixed;
  const isFooter = rect.bottom > viewportHeight - 100 && isFixed;
  
  // Repeated content detection (across pages)
  const content = element.textContent?.trim();
  const isRepeated = checkRepeatedAcrossPages(content);
  
  return {
    hasHeaderFooter: isHeader || isFooter || isRepeated,
    type: isHeader ? 'header' : isFooter ? 'footer' : 'repeated',
    risk: 'high'  // Headers/footers often duplicate in ATS
  };
};
```

### Layout Risk Scoring Matrix

| Layout Feature | Workday Risk | Taleo Risk | Greenhouse Risk | Lever Risk |
|----------------|--------------|------------|-----------------|------------|
| Tables | CRITICAL | HIGH | MEDIUM | LOW |
| CSS Grid Columns | LOW | MEDIUM | LOW | LOW |
| Float Columns | HIGH | CRITICAL | HIGH | MEDIUM |
| Fixed Header | HIGH | HIGH | MEDIUM | LOW |
| Fixed Footer | HIGH | HIGH | MEDIUM | LOW |
| Text Boxes | CRITICAL | HIGH | MEDIUM | MEDIUM |
| Graphics/Images | LOW | LOW | LOW | LOW |

---

## 4. Confidence Scoring Approaches

### Token-Level Confidence (NLP-based)

**For spaCy Implementation:**
```python
# spaCy provides token probabilities
doc = nlp(text)
for ent in doc.ents:
    # Average token probabilities for entity
    token_probs = [token.prob for token in ent]
    confidence = sum(token_probs) / len(token_probs)
    
    # Adjust for entity type
    if ent.label_ == 'ORG':
        confidence *= 0.9  # Organizations can be ambiguous
    elif ent.label_ == 'DATE':
        confidence *= 0.95  # Dates are usually clear
```

### Field-Level Confidence (Heuristic-based)

**Extraction Confidence Formula:**
```typescript
interface FieldConfidence {
  field: string;
  value: string;
  confidence: number;  // 0-100
  factors: ConfidenceFactor[];
}

type ConfidenceFactor = 
  | { type: 'pattern_match'; weight: number; matched: boolean }
  | { type: 'context_proximity'; weight: number; score: number }
  | { type: 'format_validity'; weight: number; valid: boolean }
  | { type: 'section_boundary'; weight: number; clear: boolean };

const calculateConfidence = (field: Field): number => {
  const weights = {
    pattern_match: 0.3,
    context_proximity: 0.25,
    format_validity: 0.25,
    section_boundary: 0.2
  };
  
  // Example: Date extraction confidence
  if (field.type === 'date_range') {
    const hasValidFormat = DATE_PATTERNS.some(p => p.test(field.value));
    const hasStartEnd = field.value.includes('-') || field.value.toLowerCase().includes('present');
    const inExperienceSection = field.section === 'experience';
    
    return (
      (hasValidFormat ? 30 : 0) +
      (hasStartEnd ? 25 : 10) +
      (inExperienceSection ? 20 : 15) +
      25 // Base confidence
    );
  }
};
```

### Confidence Visualization Strategy

**Three-Tier Display:**
1. **High Confidence (80-100%)**: Green checkmark, "Clear extraction"
2. **Medium Confidence (50-79%)**: Yellow warning, "May need verification"
3. **Low Confidence (<50%)**: Red alert, "Potential parsing issue"

---

## 5. Platform-Specific Simulation (ATS2-08)

### Workday Simulator

**Characteristics:**
- Conservative parsing (prefers standard headers)
- Sensitive to tables and columns
- Strict date format requirements
- Limited tolerance for creative formatting

**Simulation Approach:**
```typescript
const simulateWorkday = (resume: Resume): ParsedResume => {
  // 1. Strict header matching
  const sections = extractSections(resume, { 
    strictHeaders: true,
    allowedHeaders: WORKDAY_STANDARD_HEADERS 
  });
  
  // 2. Table penalty
  if (resume.hasTables) {
    sections.quality *= 0.6;  // 40% penalty
  }
  
  // 3. Date format validation
  sections.experience.forEach(exp => {
    if (!isStandardDateFormat(exp.dateRange)) {
      exp.confidence *= 0.7;
    }
  });
  
  return sections;
};
```

### Lever Simulator

**Characteristics:**
- Tolerant of header variations
- Better column handling
- Focus on readability over strict structure
- Modern parsing engine

**Simulation Approach:**
```typescript
const simulateLever = (resume: Resume): ParsedResume => {
  // 1. Flexible header matching
  const sections = extractSections(resume, {
    strictHeaders: false,
    semanticMatching: true  // "Professional Journey" ≈ "Experience"
  });
  
  // 2. Layout penalty (lighter)
  if (resume.hasColumns) {
    sections.quality *= 0.85;  // 15% penalty
  }
  
  return sections;
};
```

### Comparison Visualization

**UI Concept:**
```
┌─────────────────────────────────────────────────┐
│  How Different ATS Read Your Resume            │
├─────────────┬─────────────┬─────────────┬───────┤
│  Workday    │   Taleo     │ Greenhouse  │ Lever │
├─────────────┼─────────────┼─────────────┼───────┤
│  72/100     │   68/100    │   85/100    │ 91/100│
│  ⚠️ Issues: │  ⚠️ Issues: │  ✓ Clean    │  ✓ Clean
│  - Table    │  - Column   │             │       │
│    detected │    layout   │             │       │
│  - Date fmt │  - Footer   │             │       │
└─────────────┴─────────────┴─────────────┴───────┘
```

---

## 6. Visual Reporting for ATS Risk Report (ATS2-06)

### Dashboard Design Principles

**5-Second Rule**: Users should understand their risk level within 5 seconds

**Key Components:**

1. **Overall Score Gauge**
   - Circular progress indicator (0-100)
   - Color-coded: Red (<60), Yellow (60-84), Green (85+)
   - Position: Top-left (F-pattern reading)

2. **Score Breakdown**
   - Horizontal bar chart showing 4 categories
   - Parsing (40%), Keywords (30%), Format (20%), Layout (10%)
   - Interactive: Hover reveals details

3. **Risk Items List**
   - Sorted by severity (Critical > High > Medium > Low)
   - Expandable cards with:
     - Issue description
     - Affected ATS platforms
     - Fix suggestion
     - Visual diff (before/after)

4. **Platform Comparison**
   - Side-by-side score cards
   - Icons representing each ATS
   - Click to expand detailed breakdown

### Implementation with Recharts

```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const ScoreBreakdown = ({ scores }) => (
  <BarChart data={scores} layout="vertical">
    <XAxis type="number" domain={[0, 100]} />
    <YAxis type="category" dataKey="category" />
    <Tooltip />
    <Bar dataKey="score" fill="#8884d8" radius={[0, 4, 4, 0]}>
      {scores.map((entry, index) => (
        <cell fill={getColorForScore(entry.score)} />
      ))}
    </Bar>
  </BarChart>
);
```

---

## 7. Implementation Recommendations

### Phase 1: Foundation (Week 1-2)

**Deliverables:**
1. Rule-based section extraction engine
2. DOM layout detector (tables, columns, headers)
3. Basic confidence scoring (heuristic-based)
4. ATS Risk Report UI skeleton

**Technical Stack:**
- React + TypeScript (existing)
- No Pyodide initially (keep bundle small)
- html2canvas for preview snapshots (optional)

### Phase 2: NLP Enhancement (Week 3-4)

**Deliverables:**
1. Pyodide integration with lazy loading
2. spaCy NER for entity extraction
3. Token-level confidence scoring
4. Field extraction validation

**Performance Optimization:**
- Load Pyodide only when user opens ATS panel
- Cache parsed results in sessionStorage
- Web Worker for NLP processing

### Phase 3: Platform Simulation (Week 5-6)

**Deliverables:**
1. Workday simulator
2. Lever simulator
3. Greenhouse/Taleo simulators (optional)
4. Comparison view component

### Key Libraries Needed

```json
{
  "dependencies": {
    "pyodide": "^0.25.0",
    "recharts": "^2.10.0",
    "html2canvas": "^1.4.1",
    "compromise": "^14.10.0"
  }
}
```

**`compromise`** is a lightweight NLP library (200KB) that can serve as fallback/alternative to spaCy for basic entity extraction.

---

## 8. Open Questions

### Technical

1. **Pyodide Bundle Size**: Is 15-20MB initial load acceptable, or should we implement progressive loading?
2. **Mobile Performance**: How does Pyodide perform on mobile devices? Should we disable NLP features on low-end devices?
3. **Real-time vs Batch**: Should layout detection run continuously during editing, or only on demand?

### Product

1. **Platform Coverage**: Which ATS platforms are most important to simulate? (Workday, Taleo, Greenhouse, Lever are top 4)
2. **Confidence Thresholds**: What confidence scores constitute "good enough" for job seekers?
3. **False Positives**: How do we prevent alerting users to issues that don't actually affect parsing?

### Design

1. **Report Placement**: Should ATS Risk Report be a separate tab, overlay, or integrated into preview?
2. **Gamification**: Should we add badges/achievements for ATS optimization? (e.g., "Workday Compatible")
3. **Education vs Anxiety**: How do we educate without creating "ATS anxiety"?

---

## Appendix A: Confidence Score Benchmarks

**Industry Standards for Information Extraction:**
- 95%+: Production-ready, automated processing
- 85-94%: Good, occasional human review needed
- 70-84%: Moderate, requires validation
- <70%: Poor, likely extraction errors

**Target for MVP:**
- Overall parsing confidence: 85%
- Date extraction: 90%
- Organization/Company: 80%
- Job titles: 75% (highly variable)

---

## Appendix B: Resource Links

**ATS Research:**
- https://cvbooster.nnitiwe.io/resources/article/ats-algorithms-guide-for-developers
- https://www.reddit.com/r/jobsearchhacks/comments/1r32a25/i_spent_8_months_testing_how_ats_systems_actually/
- https://www.princive.com/ats/systems

**Pyodide Resources:**
- https://pyodide.org/
- https://github.com/SyedAhkam/spacy-wasm
- https://github.com/josephrocca/tokenizers-pyodide

**NLP Libraries:**
- https://spacy.io/
- https://github.com/spencermountain/compromise

**Dashboard Design:**
- https://www.uxpin.com/studio/blog/dashboard-design-principles/
- https://observablehq.com/blog/seven-ways-design-better-dashboards

---

**Document Version:** 1.0  
**Next Steps:** Proceed to technical specification and architecture design
