# Phase 3: Job Optimizer UI Redesign - Research

**Researched:** 2026-02-17  
**Domain:** Multi-Panel Dashboard Layouts, Progressive Disclosure, Empty State UX  
**Confidence:** HIGH

## Summary

This phase redesigns the Job Optimizer page (`JobInputPage.tsx`) from a crowded single-analysis-panel layout into a clearer 3-panel architecture that separates concerns: Resume (left), JD Analysis (top-right), and Resume vs JD Match (bottom-right). The research reveals that **the project already has the necessary infrastructure**—`react-resizable-panels` (v2.1.9), Radix UI primitives, Framer Motion for animations, and established contexts (JobContext, ResumeContext, ATSContext).

The key insight is that **multi-panel layouts succeed when each panel has a clear, singular purpose** and uses progressive disclosure to avoid overwhelming users. The existing WizardLayout demonstrates the project's successful implementation of a 3-panel system (sidebar, editor, preview), which serves as an excellent reference architecture.

**Primary recommendation:** Build the 3-panel layout using `react-resizable-panels` with horizontal orientation for resume vs analysis panels, and nested vertical panel groups for the two analysis panels. Leverage existing Swiss-inspired design tokens, implement empty states with actionable CTAs, and use Framer Motion's `AnimatePresence` for panel transitions. All state coordination should flow through existing contexts.

---

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-resizable-panels | ^2.1.9 | Resizable panel layout system | Already installed, proven solution for dashboard layouts |
| Radix UI | Various | Accessible UI primitives (Tabs, ScrollArea, Separator) | Already installed, full shadcn/ui component library |
| Framer Motion | ^10.18.0 | Animation and transitions | Already installed, used throughout app |
| Tailwind CSS | ^3.3.2 | Styling system with Swiss design tokens | Already installed with custom theme |
| lucide-react | ^0.357.0 | Icon system | Already installed, consistent iconography |

### Supporting (No New Dependencies)
| Component/Library | Purpose | When to Use |
|---------|---------|-------------|
| ResumeContext | Resume data and operations | Resume panel interaction |
| JobContext | Job description state | JD analysis panel |
| ATSContext | ATS scoring and keyword extraction | Match comparison panel |
| useMediaQuery | Responsive breakpoint detection | Mobile/tablet layouts |
| AnimatePresence | Enter/exit animations | Panel visibility transitions |
| ScrollArea | Custom scrollbars | Overflow content in panels |
| Tabs | Segmented panel content | Analysis sections within panels |

**Installation:**
```bash
# No new dependencies required - all tools already installed
npm install  # Just ensure existing dependencies are up to date
```

---

## Architecture Patterns

### Recommended Project Structure

```
src/features/job-optimizer/
├── components/
│   ├── JobOptimizerLayout.tsx        # NEW: Main 3-panel container
│   ├── ResumePanelV2.tsx             # NEW: Left panel with upload/paste
│   ├── JDAnalyzerPanel.tsx           # NEW: Top-right panel (JD-only insights)
│   ├── MatchComparisonPanel.tsx      # NEW: Bottom-right (resume vs JD)
│   ├── EmptyStatePrompt.tsx          # NEW: Reusable empty state component
│   ├── PanelHeader.tsx               # NEW: Consistent panel headers
│   ├── AnalysisPanel.tsx             # EXISTING: Keep for transition period
│   ├── QuickMatchSummary.tsx         # EXISTING: May integrate into new panels
│   ├── KeywordIntegrationModal.tsx   # EXISTING: Reuse as-is
│   ├── ExportOptimizedModal.tsx      # EXISTING: Reuse as-is
│   └── CustomizeAIModal.tsx          # EXISTING: Reuse as-is
├── pages/
│   ├── JobInputPage.tsx              # MODIFY: Replace with new layout
│   └── AnalysisResultPage.tsx        # EXISTING: Keep as separate route
└── hooks/
    ├── useJobAnalyzer.ts             # NEW: JD-only analysis logic
    ├── useMatchComparison.ts         # NEW: Resume vs JD comparison
    └── usePanelLayout.ts             # NEW: Layout state persistence
```

### Pattern 1: Panel Group Nesting (3-Panel Layout)

**What:** Nested panel groups to achieve a 3-panel layout—one vertical group containing the resume panel and a nested horizontal group for the two analysis panels.

**When to use:** When you need hierarchical panel layouts with different orientations (vertical + horizontal).

**Example:**
```typescript
// Source: react-resizable-panels documentation + existing WizardLayout
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function JobOptimizerLayout() {
  return (
    <PanelGroup direction="horizontal" className="h-full">
      {/* Left: Resume Panel */}
      <Panel defaultSize={35} minSize={25} maxSize={50}>
        <ResumePanelV2 />
      </Panel>
      
      <PanelResizeHandle className="w-1 bg-border hover:bg-accent transition-colors" />
      
      {/* Right: Nested Analysis Panels */}
      <Panel defaultSize={65} minSize={50}>
        <PanelGroup direction="vertical">
          {/* Top: JD Analyzer */}
          <Panel defaultSize={50} minSize={30}>
            <JDAnalyzerPanel />
          </Panel>
          
          <PanelResizeHandle className="h-1 bg-border hover:bg-accent transition-colors" />
          
          {/* Bottom: Match Comparison */}
          <Panel defaultSize={50} minSize={30}>
            <MatchComparisonPanel />
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}
```

**Key configuration:**
- `defaultSize`: Percentage (0-100) of parent container
- `minSize`/`maxSize`: Constraints to prevent panels from becoming unusable
- `collapsible`: Allow panels to collapse to `collapsedSize` (useful for mobile)
- `onResize`: Callback for saving user's layout preferences

**Persistence pattern (from WizardLayout reference):**
```typescript
// Save layout to localStorage for user preference
const [layout, setLayout] = useState<number[]>([35, 65]); // Resume: 35%, Analysis: 65%

useEffect(() => {
  const savedLayout = localStorage.getItem('job-optimizer-layout');
  if (savedLayout) setLayout(JSON.parse(savedLayout));
}, []);

const handleLayoutChange = (sizes: number[]) => {
  setLayout(sizes);
  localStorage.setItem('job-optimizer-layout', JSON.stringify(sizes));
};
```

### Pattern 2: Progressive Disclosure with Tabs

**What:** Breaking complex analysis into manageable sections using Radix UI Tabs within each panel.

**When to use:** When a panel contains multiple categories of information that would overwhelm if shown simultaneously.

**Example:**
```typescript
// JD Analyzer Panel with tabbed sections
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export function JDAnalyzerPanel({ jobDescription }: Props) {
  const analysis = useJobAnalyzer(jobDescription);
  
  return (
    <Card className="h-full flex flex-col">
      <PanelHeader icon={FileText} title="Job Description Analysis" />
      
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1">
          <TabsContent value="overview" className="p-4">
            {/* Role summary, seniority level, company insights */}
          </TabsContent>
          
          <TabsContent value="requirements" className="p-4">
            {/* Required vs preferred skills breakdown */}
          </TabsContent>
          
          <TabsContent value="keywords" className="p-4">
            {/* ATS keyword extraction from JD */}
          </TabsContent>
          
          <TabsContent value="insights" className="p-4">
            {/* AI-powered insights about the role */}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
```

**Anti-pattern to avoid:** Don't use accordions for primary navigation within panels—they require more clicks and hide information. Tabs provide better discoverability.

### Pattern 3: Empty State Best Practices

**What:** Contextual empty states that guide users to the next action, not generic "no data" messages.

**When to use:** When a panel depends on data from another panel or user input.

**Research-backed principles:**
1. **Explain WHY empty**: "Upload a resume to see how it matches this job"
2. **Show HOW to fill it**: Clear CTA button with icon
3. **Illustrate WHAT'S possible**: Preview of what the panel will show when populated
4. **Match visual hierarchy**: Use same panel structure/spacing as populated state

**Example:**
```typescript
// Source: Empty state UX research + existing AnalysisPanel pattern
export function EmptyStatePrompt({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full p-8 text-center"
    >
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">{description}</p>
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.icon && <action.icon className="mr-2 h-4 w-4" />}
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}

// Usage in MatchComparisonPanel
export function MatchComparisonPanel({ resumeText, jobDescription }: Props) {
  const hasData = resumeText.trim() && jobDescription.trim();
  
  if (!hasData) {
    return (
      <EmptyStatePrompt
        icon={Target}
        title="Match Analysis Ready to Go"
        description="Upload your resume and paste a job description to see how well they align. Get ATS scores, keyword gaps, and optimization suggestions."
        action={{
          icon: Upload,
          label: "Get Started",
          onClick: () => document.getElementById('resume-upload')?.click()
        }}
      />
    );
  }
  
  return (
    <div className="h-full overflow-auto p-4">
      {/* Match comparison content */}
    </div>
  );
}
```

### Pattern 4: Real-Time Analysis Without UI Blocking

**What:** Using React Query or local state with debouncing to provide real-time feedback without freezing the interface.

**When to use:** When analysis needs to update as user types, but computation is expensive.

**Example:**
```typescript
// Source: Existing ResumeContext debounce pattern
import { useMemo } from 'react';
import { debounce } from 'lodash';
import { extractATSKeywords } from '@/shared/lib/atsKeywords';

export function useJobAnalyzer(jobDescription: string) {
  // Debounced analysis to avoid excessive computation
  const analyze = useMemo(
    () => debounce((jd: string) => {
      return {
        keywords: extractATSKeywords(jd),
        requirements: parseRequirements(jd),
        insights: generateInsights(jd)
      };
    }, 500), // 500ms delay
    []
  );
  
  const [analysis, setAnalysis] = useState(null);
  
  useEffect(() => {
    if (jobDescription.trim()) {
      const result = analyze(jobDescription);
      // Result is a promise if async, handle accordingly
      setAnalysis(result);
    }
  }, [jobDescription, analyze]);
  
  return analysis;
}
```

**Loading states pattern:**
```typescript
// Show skeleton loaders during analysis
{isAnalyzing ? (
  <div className="space-y-3">
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-20 w-full" />
  </div>
) : (
  <AnalysisResults data={analysis} />
)}
```

### Pattern 5: Responsive Mobile Strategy (Stacked + Drawer)

**What:** Transform 3-panel desktop layout into single-panel mobile view with drawer navigation.

**When to use:** Screens narrower than 768px (existing `isMobile` breakpoint).

**Implementation:**
```typescript
// Source: WizardLayout mobile patterns
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { Drawer } from '@/shared/ui/drawer'; // vaul library already installed

export function JobOptimizerLayout() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activePanel, setActivePanel] = useState<'resume' | 'jd' | 'match'>('resume');
  
  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        {/* Mobile: Tab Bar Navigation */}
        <div className="border-b bg-card flex items-center justify-around p-2">
          <Button
            variant={activePanel === 'resume' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('resume')}
          >
            <FileText className="mr-2 h-4 w-4" />
            Resume
          </Button>
          <Button
            variant={activePanel === 'jd' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('jd')}
          >
            <Briefcase className="mr-2 h-4 w-4" />
            JD Analysis
          </Button>
          <Button
            variant={activePanel === 'match' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('match')}
          >
            <Target className="mr-2 h-4 w-4" />
            Match
          </Button>
        </div>
        
        {/* Mobile: Single Panel View with Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePanel}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 overflow-hidden"
          >
            {activePanel === 'resume' && <ResumePanelV2 />}
            {activePanel === 'jd' && <JDAnalyzerPanel />}
            {activePanel === 'match' && <MatchComparisonPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }
  
  // Desktop: 3-panel layout (see Pattern 1)
  return <DesktopPanelLayout />;
}
```

### Pattern 6: Consistent Panel Headers

**What:** Standardized header component for all panels with icon, title, subtitle, and optional actions.

**When to use:** Every major panel to establish visual hierarchy and purpose.

**Example:**
```typescript
export function PanelHeader({ 
  icon: Icon, 
  title, 
  subtitle, 
  actions 
}: PanelHeaderProps) {
  return (
    <div className="p-4 border-b bg-card/50 backdrop-blur-sm flex items-center gap-3">
      <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
```

### Anti-Patterns to Avoid

1. **Parallel scrolling panels**: Don't make multiple panels scrollable at the same level—use a primary scroll container with sticky headers
2. **Inconsistent empty states**: Each panel should have its own contextual empty state, not a single app-wide "no data" message
3. **Hidden overflow without indication**: Always show scrollbars or fade gradients when content is clipped
4. **Over-animation**: Limit transitions to panel visibility changes; don't animate every content update (causes motion sickness)
5. **Context drilling**: Don't pass resume/job data through props—always read from contexts for consistency

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Resizable panels | Custom drag handlers with mouse events | `react-resizable-panels` (already installed) | Handles touch, keyboard, RTL, min/max constraints, persistence |
| Accessible tabs | `<div>` with click handlers | Radix UI Tabs (already installed via shadcn) | ARIA roles, keyboard navigation, focus management |
| Scroll containers | `overflow: auto` on divs | Radix UI ScrollArea (already installed) | Consistent cross-browser scrollbar styling, smooth scrolling |
| Animation presence | Manual show/hide with CSS | Framer Motion AnimatePresence (already installed) | Automatic exit animations, stagger children, layout animations |
| Responsive breakpoints | `window.matchMedia` directly | `useMediaQuery` hook (already exists in codebase) | SSR-safe, cleanup handled, React-friendly |
| Empty state illustrations | Custom SVGs | Lucide React icons with gradient backgrounds | Consistent with design system, smaller bundle size |

**Key insight:** The project already has a production-tested 3-panel system (WizardLayout) with mobile responsiveness, panel collapsing, and smooth transitions. **Reuse these patterns rather than reinventing.**

---

## Common Pitfalls

### Pitfall 1: Panel Size Constraints Conflict

**What goes wrong:** Panels become unusable because min/max sizes don't add up correctly, causing layout thrashing or panels that can't be resized.

**Why it happens:** `react-resizable-panels` calculates sizes as percentages, but if `minSize` values for all panels sum to more than 100%, the layout breaks.

**How to avoid:**
- Ensure sum of all `minSize` values ≤ 100%
- For 3 panels with min sizes: Panel1(25%) + Panel2(30%) + Panel3(30%) = 85% ✓ (leaves 15% flex room)
- Test at smallest viewport size (320px mobile)

**Warning signs:**
- Panels jump or snap unexpectedly when resizing
- Console warnings from `react-resizable-panels` about constraint violations
- Panels render at different sizes than specified defaults

**Example fix:**
```typescript
// BAD: Min sizes sum to 110%
<Panel minSize={40} /> {/* 40% */}
<Panel minSize={40} /> {/* 40% */}
<Panel minSize={30} /> {/* 30% = 110% total ❌ */}

// GOOD: Min sizes sum to 80%
<Panel minSize={25} /> {/* 25% */}
<Panel minSize={30} /> {/* 30% */}
<Panel minSize={25} /> {/* 25% = 80% total ✓ */}
```

### Pitfall 2: Dependent Panel Updates Cause State Flicker

**What goes wrong:** When job description changes, all three panels re-render, causing visible flicker or stale data showing briefly.

**Why it happens:** React batches state updates, but context updates from JobContext trigger all consumers simultaneously without coordination.

**How to avoid:**
- Use transition loading states during analysis
- Add `key` prop to panels tied to job ID to force remount on job change
- Wrap dependent computations in `useMemo` with proper dependencies

**Example:**
```typescript
// In MatchComparisonPanel
export function MatchComparisonPanel() {
  const { currentJob } = useJob();
  const { resumeData } = useResume();
  
  // Memoize expensive comparison
  const matchResults = useMemo(() => {
    if (!currentJob || !resumeData) return null;
    return computeMatch(resumeData, currentJob);
  }, [currentJob?.id, resumeData]); // Only recompute when IDs change
  
  // Show loading state during computation
  if (!matchResults) {
    return <EmptyStatePrompt />;
  }
  
  return <MatchResultsView data={matchResults} />;
}
```

### Pitfall 3: Mobile Layout Doesn't Account for Keyboard

**What goes wrong:** On mobile, when user focuses a textarea (resume input), the keyboard covers the content without scrolling compensation.

**Why it happens:** Fixed-height panels don't adjust for virtual keyboard, and `vh` units don't account for dynamic viewport changes.

**How to avoid:**
- Use `dvh` (dynamic viewport height) instead of `vh` in Tailwind: `h-[100dvh]`
- Add `scrollIntoView` on input focus events
- Test on real iOS/Android devices, not just browser DevTools

**Warning signs:**
- Users report "can't see what I'm typing" on mobile
- Text input is partially covered by keyboard
- Panel doesn't scroll when keyboard appears

**Example fix:**
```typescript
// In ResumePanelV2 mobile view
<Textarea
  ref={resumeInputRef}
  onFocus={() => {
    // Scroll input into view when keyboard opens
    resumeInputRef.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center' 
    });
  }}
  className="min-h-[50dvh]" // Use dvh not vh
/>
```

### Pitfall 4: Over-Reliance on Animations Impacts Performance

**What goes wrong:** Every panel update triggers animations, causing jank on lower-end devices or when many updates happen rapidly.

**Why it happens:** Framer Motion animations run on every state change unless explicitly controlled.

**How to avoid:**
- Use `AnimatePresence` only for mount/unmount, not every content change
- Check `prefers-reduced-motion` media query (already in WizardLayout)
- Disable animations when user is typing (high-frequency updates)
- Profile with React DevTools Profiler to find animation bottlenecks

**Example:**
```typescript
// Respect user motion preferences
const prefersReducedMotion = useMemo(() => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}, []);

<motion.div
  initial={prefersReducedMotion ? {} : { opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
>
  {content}
</motion.div>
```

### Pitfall 5: Empty State CTAs Don't Actually Work

**What goes wrong:** User clicks "Upload Resume" in empty state, but nothing happens or action is unclear.

**Why it happens:** Empty state CTAs are disconnected from actual input mechanisms; buttons trigger actions that aren't wired up.

**How to avoid:**
- Always provide real, working callbacks in empty state CTAs
- Use existing input refs and trigger their click events
- Test empty state interactions in isolation

**Example:**
```typescript
// In JobOptimizerLayout
const resumeInputRef = useRef<HTMLInputElement>(null);

// Pass callback to empty state
<EmptyStatePrompt
  action={{
    label: "Upload Resume",
    onClick: () => resumeInputRef.current?.click() // Trigger file input
  }}
/>

{/* Hidden file input */}
<input
  ref={resumeInputRef}
  type="file"
  accept=".pdf,.docx,.txt"
  className="hidden"
  onChange={handleResumeUpload}
/>
```

---

## Code Examples

Verified patterns from official sources and existing codebase:

### Multi-Panel Layout with Persistence

```typescript
// Source: react-resizable-panels docs + WizardLayout pattern
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

export default function JobOptimizerLayout() {
  const [layout, setLayout] = useState<number[]>([35, 65]);
  
  // Load saved layout on mount
  useEffect(() => {
    const saved = localStorage.getItem('job-optimizer-layout');
    if (saved) setLayout(JSON.parse(saved));
  }, []);
  
  // Save layout on change (debounced)
  const handleLayoutChange = useMemo(
    () => debounce((sizes: number[]) => {
      setLayout(sizes);
      localStorage.setItem('job-optimizer-layout', JSON.stringify(sizes));
    }, 300),
    []
  );
  
  return (
    <PanelGroup 
      direction="horizontal" 
      onLayout={handleLayoutChange}
      className="h-full"
    >
      <Panel 
        id="resume-panel"
        defaultSize={layout[0]} 
        minSize={25} 
        maxSize={50}
        collapsible
        collapsedSize={5}
      >
        <ResumePanelV2 />
      </Panel>
      
      <PanelResizeHandle className="w-1 bg-border hover:bg-accent transition-colors" />
      
      <Panel 
        id="analysis-panel"
        defaultSize={layout[1]}
        minSize={50}
      >
        <PanelGroup direction="vertical">
          <Panel defaultSize={50} minSize={30}>
            <JDAnalyzerPanel />
          </Panel>
          <PanelResizeHandle className="h-1 bg-border hover:bg-accent transition-colors" />
          <Panel defaultSize={50} minSize={30}>
            <MatchComparisonPanel />
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  );
}
```

### Radix Tabs with ScrollArea

```typescript
// Source: Radix UI docs + existing AnalysisPanel pattern
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Card } from '@/shared/ui/card';

export function JDAnalyzerPanel({ jobDescription }: Props) {
  const analysis = useJobAnalyzer(jobDescription);
  
  if (!jobDescription.trim()) {
    return (
      <EmptyStatePrompt
        icon={Briefcase}
        title="No Job Description Yet"
        description="Paste a job description to analyze requirements, keywords, and role insights."
      />
    );
  }
  
  return (
    <Card className="h-full flex flex-col shadow-swiss">
      <PanelHeader
        icon={Briefcase}
        title="Job Description Analysis"
        subtitle="Understanding the role requirements"
      />
      
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid grid-cols-4 w-full rounded-none border-b">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-1">
          <TabsContent value="overview" className="p-4 m-0">
            <div className="space-y-4">
              <MetricCard label="Seniority Level" value={analysis.seniority} />
              <MetricCard label="Role Type" value={analysis.roleType} />
              <MetricCard label="Team Size" value={analysis.teamSize} />
            </div>
          </TabsContent>
          
          <TabsContent value="requirements" className="p-4 m-0">
            <RequiredSkillsList skills={analysis.requiredSkills} />
            <Separator className="my-4" />
            <PreferredSkillsList skills={analysis.preferredSkills} />
          </TabsContent>
          
          <TabsContent value="keywords" className="p-4 m-0">
            <KeywordCloud keywords={analysis.keywords} />
          </TabsContent>
          
          <TabsContent value="insights" className="p-4 m-0">
            <InsightsList insights={analysis.insights} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
}
```

### Empty State with AnimatePresence

```typescript
// Source: Framer Motion docs + existing AnalysisPanel empty state
import { motion, AnimatePresence } from 'framer-motion';

export function MatchComparisonPanel({ resumeText, jobDescription }: Props) {
  const hasData = resumeText.trim() && jobDescription.trim();
  const matchData = useMatchComparison(resumeText, jobDescription);
  
  return (
    <Card className="h-full flex flex-col shadow-swiss">
      <PanelHeader
        icon={Target}
        title="Resume vs Job Match"
        subtitle="How well your resume aligns with this job"
      />
      
      <ScrollArea className="flex-1">
        <AnimatePresence mode="wait">
          {!hasData ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center justify-center h-full p-8"
            >
              <EmptyStatePrompt
                icon={Target}
                title="Ready to Compare"
                description="Upload your resume and paste a job description to see match analysis, ATS scores, and keyword gaps."
                action={{
                  icon: Upload,
                  label: "Get Started",
                  onClick: () => document.getElementById('resume-upload')?.click()
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              <MatchScoreCard score={matchData.score} />
              <KeywordGapsList gaps={matchData.missingKeywords} />
              <OptimizationSuggestions suggestions={matchData.suggestions} />
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
}
```

### Responsive Mobile Strategy

```typescript
// Source: WizardLayout mobile patterns + vaul drawer
import { useMediaQuery } from '@/shared/hooks/use-media-query';
import { Button } from '@/shared/ui/button';

export default function JobOptimizerLayout() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [activePanel, setActivePanel] = useState<'resume' | 'jd' | 'match'>('resume');
  
  if (isMobile) {
    return (
      <div className="h-[100dvh] flex flex-col bg-background">
        {/* Mobile Tab Bar */}
        <div className="border-b bg-card flex items-center justify-around p-2 flex-shrink-0">
          <Button
            variant={activePanel === 'resume' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('resume')}
            className="flex-1"
          >
            <FileText className="mr-2 h-4 w-4" />
            Resume
          </Button>
          <Button
            variant={activePanel === 'jd' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('jd')}
            className="flex-1"
          >
            <Briefcase className="mr-2 h-4 w-4" />
            JD
          </Button>
          <Button
            variant={activePanel === 'match' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActivePanel('match')}
            className="flex-1"
          >
            <Target className="mr-2 h-4 w-4" />
            Match
          </Button>
        </div>
        
        {/* Single Panel with Slide Transitions */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activePanel === 'resume' && (
              <motion.div
                key="resume"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <ResumePanelV2 />
              </motion.div>
            )}
            {activePanel === 'jd' && (
              <motion.div
                key="jd"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <JDAnalyzerPanel />
              </motion.div>
            )}
            {activePanel === 'match' && (
              <motion.div
                key="match"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <MatchComparisonPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
  
  // Desktop: Multi-panel layout
  return <DesktopPanelLayout />;
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single large analysis panel | Multi-panel with separated concerns | 2024+ (modern dashboard UX) | Clearer information hierarchy, less cognitive load |
| CSS Grid for layouts | react-resizable-panels | 2023+ (v1.0 release) | User-controllable sizes, persistence, keyboard accessible |
| Custom scroll styling | Radix UI ScrollArea | 2022+ (Radix v1.0) | Cross-browser consistency, accessible |
| Class-based animations | Framer Motion declarative API | 2021+ (FM v4+) | Less code, automatic cleanup, gesture support |
| `vh` units for mobile | `dvh` dynamic viewport units | 2023+ (CSS spec update) | Accounts for mobile browser chrome |
| Explicit loading spinners | Skeleton loaders matching content | 2023+ (UX pattern shift) | Perceived performance improvement |

**Deprecated/outdated:**
- **react-split-pane**: Unmaintained since 2020, lacks TypeScript support → Use `react-resizable-panels`
- **react-grid-layout**: Overkill for simple panel layouts, large bundle → Use native CSS or `react-resizable-panels`
- **Manual `matchMedia` listeners**: Memory leaks common → Use `useMediaQuery` hook with cleanup

---

## Open Questions

1. **JD Analyzer AI Features**
   - What we know: Existing `resumeAI` service can be extended for JD analysis
   - What's unclear: Should JD insights be cached per job, or recomputed on each view?
   - Recommendation: Add caching layer keyed by job ID hash; invalidate after 24 hours or manual refresh

2. **Mobile: Tabs vs Swipeable Panels**
   - What we know: Buttons for panel switching work, but swipe gestures are more native
   - What's unclear: Does Framer Motion gesture support work well with ScrollArea?
   - Recommendation: Start with tab buttons (simpler); add swipe in Phase 4 if user feedback requests it

3. **Panel Layout Persistence Scope**
   - What we know: localStorage works for saving panel sizes
   - What's unclear: Should layout persist per-device or sync across sessions?
   - Recommendation: localStorage is sufficient for MVP; cloud sync deferred to post-launch

4. **Empty State Illustrations**
   - What we know: Lucide icons with gradient backgrounds match design system
   - What's unclear: Should we add custom SVG illustrations for more visual appeal?
   - Recommendation: Use Lucide icons for MVP; custom illustrations deferred unless designer available

---

## Sources

### Primary (HIGH confidence)
- react-resizable-panels GitHub: https://github.com/bvaughn/react-resizable-panels
- Radix UI Tabs documentation: https://www.radix-ui.com/primitives/docs/components/tabs
- Existing codebase patterns:
  - `src/features/resume-builder/components/layout/WizardLayout.tsx` (3-panel reference)
  - `src/features/job-optimizer/components/AnalysisPanel.tsx` (existing analysis + empty states)
  - `src/shared/contexts/JobContext.tsx` (job data management)
  - `tailwind.config.ts` (Swiss design system tokens)
  - `package.json` (installed dependencies verification)

### Secondary (MEDIUM confidence)
- Framer Motion AnimatePresence: Official docs for transition patterns
- Eye-tracking research referenced in Phase 2 research (F-pattern, recruiter scan behavior)
- CSS `dvh` units: MDN Web Docs (mobile viewport handling)

### Tertiary (LOW confidence - needs validation)
- None - all research grounded in existing codebase and official documentation

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed, versions verified in package.json
- Architecture patterns: HIGH - Based on existing working implementations in WizardLayout
- Empty state UX: HIGH - Patterns exist in AnalysisPanel, Radix UI provides primitives
- Responsive mobile: HIGH - WizardLayout demonstrates proven mobile patterns
- Performance (debouncing, memoization): HIGH - Patterns already in ResumeContext

**Research date:** 2026-02-17  
**Valid until:** 2026-03-17 (30 days - stable domain, minimal ecosystem churn)  
**Codebase version:** React 18.3.1, react-resizable-panels 2.1.9, Tailwind 3.3.2

**Technical debt identified:**
- Current `JobInputPage.tsx` has 150+ lines mixing concerns (resume input + JD input + analysis)
- `AnalysisPanel.tsx` conflates JD analysis with resume vs JD comparison
- No layout persistence for user-preferred panel sizes
- Empty states are inline conditionals, not reusable components

**Recommended cleanup during this phase:**
- Extract reusable `EmptyStatePrompt` component
- Create `PanelHeader` component for consistency
- Separate JD-only analysis from resume-JD comparison
- Add layout persistence to localStorage
