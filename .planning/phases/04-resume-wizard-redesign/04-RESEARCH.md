# Phase 04: Resume Wizard Redesign - Research

**Researched:** 2026-02-17  
**Domain:** Wizard/Multi-Step Form UX, Vertical Navigation, Contextual Helper Rails, Mobile-First Responsive Design  
**Confidence:** HIGH

---

## Summary

This phase transforms the existing 10-step resume wizard from a basic sidebar navigation into a **modern, outcome-focused experience** with visual progress indicators, ATS weight communication, contextual AI helpers, and JD-awareness integration. The research reveals that **all infrastructure is already in place**—`react-resizable-panels` (v2.1.9), Radix UI primitives, Framer Motion for animations, and established contexts (ResumeContext, WizardContext, APIKeyContext).

The key insight is that **modern wizards succeed by communicating value and progress continuously**, not just tracking step completion. Users need to understand:
1. **Where am I?** (Clear visual progress)
2. **Why does this matter?** (ATS weight, impact indicators)
3. **How can I do better?** (Contextual AI helpers, JD-matched keywords)
4. **Can I finish later?** (Auto-save feedback, non-linear navigation)

The existing WizardLayout already demonstrates a 3-panel system (sidebar, editor, preview). This phase enhances it with:
- **Vertical side nav** with completion states, ATS weight badges, and progress visualization
- **Collapsible helper rail** on the right with step-specific guidance, AI tips, and JD match hints
- **Mobile-optimized** with top progress bar, drawer navigation, and content stacking priority

**Primary recommendation:** Enhance existing WizardLayout infrastructure with modern vertical stepper patterns, integrate Radix UI Progress and Collapsible components, use Framer Motion variants for smooth transitions, and leverage existing contexts for state coordination. All UI should align with Swiss-inspired minimalism (lots of whitespace, subtle indicators, micro-interactions).

---

## Standard Stack

### Core (Already in Project)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-resizable-panels | ^2.1.9 | Collapsible helper rail & preview panel | Already installed, proven for dashboard layouts |
| Radix UI | Various | Progress, Collapsible, Accordion, Tooltip primitives | Already installed via shadcn/ui |
| Framer Motion | ^10.18.0 | Step transitions, panel animations, micro-interactions | Already installed, used throughout |
| React Router | ^6.x | Step navigation and routing | Already installed, powers wizard flow |
| Tailwind CSS | ^3.3.2 | Swiss design system with custom tokens | Already installed with theme |
| lucide-react | ^0.357.0 | Icons for steps, completion states, badges | Already installed, consistent system |

### Supporting (No New Dependencies)
| Component/Hook | Purpose | When to Use |
|---------|---------|-------------|
| ResumeContext | Resume data CRUD, undo/redo, autosave | All step interactions |
| WizardContext | Step navigation, completion tracking, validation | Navigation logic |
| APIKeyContext | User's AI provider configuration | AI helper features |
| useMediaQuery | Responsive breakpoint detection | Mobile/tablet layouts |
| AnimatePresence | Enter/exit animations for steps | Step transitions |
| LayoutGroup | Shared layout animations | Sidebar rearrangement |
| Progress (Radix) | Visual progress indicators | Top bar, sidebar |
| Collapsible (Radix) | Helper rail toggle | Right panel |
| Tooltip (Radix) | ATS weight explanations, icon hints | Hover interactions |

**Installation:**
```bash
# No new dependencies required - all tools already installed
npm install  # Just ensure existing dependencies are up to date
```

---

## Architecture Patterns

### Recommended Component Structure

```
src/features/resume-builder/components/
├── layout/
│   ├── WizardLayout.tsx                    # MODIFY: Add helper rail
│   ├── WizardSidebar.tsx                   # ENHANCE: Vertical stepper pattern
│   ├── WizardPreview.tsx                   # KEEP: Already collapsible
│   ├── WizardHelperRail.tsx                # NEW: Contextual guidance panel
│   ├── StepNavigationItem.tsx              # NEW: Enhanced step button with badges
│   └── MobileProgressBar.tsx               # NEW: Top progress indicator
├── editor/
│   ├── steps/                              # EXISTING: Keep all step components
│   ├── forms/                              # EXISTING: Keep all form components
│   ├── StepContainer.tsx                   # NEW: Wrapper with helper content
│   └── StepEmptyState.tsx                  # NEW: Consistent empty states
└── helpers/
    ├── StepGuideCard.tsx                   # NEW: "How to make this section strong"
    ├── AIPromptSuggestions.tsx             # NEW: Quick AI enhancement examples
    ├── JDKeywordHints.tsx                  # NEW: "You haven't mentioned X"
    └── ATSWeightExplainer.tsx              # NEW: Modal/tooltip for ATS impact
```

### Pattern 1: Modern Vertical Stepper Navigation

**What:** A vertical side navigation that shows step completion, ATS weight, and allows non-linear navigation while nudging users toward incomplete high-priority steps.

**When to use:** Multi-step wizards with 6+ steps where users need clear progress tracking and the ability to jump between steps.

**Example:**
```typescript
// Source: Radix UI Progress + existing WizardContext
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { motion } from 'framer-motion';

interface StepNavItemProps {
  step: WizardStep;
  isActive: boolean;
  isComplete: boolean;
  completionPercent: number;
  atsWeight: number;
  onClick: () => void;
}

export function StepNavigationItem({ 
  step, isActive, isComplete, completionPercent, atsWeight, onClick 
}: StepNavItemProps) {
  const Icon = step.icon;
  
  // Determine status indicator
  const getStatusIndicator = () => {
    if (isComplete) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (completionPercent > 0) return <Circle className="h-4 w-4 text-amber-500" />;
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };
  
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "group relative w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
        isActive && "bg-accent shadow-sm",
        !isActive && "hover:bg-accent/50"
      )}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Status Indicator */}
      <div className="shrink-0">
        {getStatusIndicator()}
      </div>
      
      {/* Icon & Label */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium truncate">{step.label}</span>
        </div>
        
        {/* Progress bar for partial completion */}
        {completionPercent > 0 && completionPercent < 100 && (
          <Progress value={completionPercent} className="h-1 mt-1.5" />
        )}
      </div>
      
      {/* ATS Weight Badge */}
      {atsWeight > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={atsWeight >= 20 ? "default" : "secondary"}
              className="shrink-0 text-xs"
            >
              {atsWeight}%
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p className="text-xs">ATS Impact: {atsWeight}%</p>
            <p className="text-xs text-muted-foreground">
              {atsWeight >= 20 ? "High priority" : "Optional"}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </motion.button>
  );
}
```

**Key features:**
- **Visual hierarchy**: Active step has background, hover state for all
- **Completion states**: CheckCircle (complete), filled Circle (partial), empty Circle (not started)
- **Progress indication**: Mini progress bar for steps in progress
- **ATS weight badges**: Color-coded (primary for high-impact, secondary for optional)
- **Tooltips**: Explain ATS weight on hover
- **Micro-interactions**: Slight x-axis slide on hover, scale feedback on click

**Mobile adaptation:**
```typescript
// Mobile: Horizontal scrollable step indicator
export function MobileProgressBar({ steps, currentStepIndex }: Props) {
  return (
    <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
      {/* Overall progress */}
      <Progress 
        value={(currentStepIndex / steps.length) * 100} 
        className="h-1.5 mb-2"
      />
      
      {/* Step dots with labels */}
      <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            className={cn(
              "snap-center shrink-0 flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px]",
              idx === currentStepIndex && "bg-accent"
            )}
          >
            <div className="relative">
              <step.icon className="h-5 w-5" />
              {getStatusBadge(step)}
            </div>
            <span className="text-xs truncate max-w-full">{step.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Pattern 2: Collapsible Helper Rail

**What:** A right-side utility panel that displays contextual guidance, AI tips, JD match hints, and can be collapsed to focus on the form.

**When to use:** Complex forms where users need context-sensitive help without leaving the current step.

**Example:**
```typescript
// Source: Radix UI Collapsible + react-resizable-panels
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/shared/ui/collapsible';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

interface HelperRailContent {
  stepId: string;
  title: string;
  description: string;
  tips: string[];
  aiPromptExamples?: string[];
  jdKeywordHints?: string[];
}

export function WizardHelperRail({ currentStep, linkedJD, resumeData }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const content = getHelperContentForStep(currentStep);
  
  return (
    <div className="h-full flex flex-col border-l bg-muted/30">
      {/* Header with collapse toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold">Step Guide</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>
      
      {/* Collapsible content */}
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent className="flex-1 overflow-auto">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {/* What this step does */}
              <StepGuideCard
                icon={Info}
                title="What this section does"
                content={content.description}
              />
              
              {/* Tips for success */}
              <StepGuideCard
                icon={Target}
                title="How to make it strong"
                content={
                  <ul className="space-y-2 text-sm">
                    {content.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                }
              />
              
              {/* AI prompt suggestions */}
              {content.aiPromptExamples && (
                <AIPromptSuggestions 
                  examples={content.aiPromptExamples}
                  onApply={(prompt) => triggerAIEnhancement(prompt)}
                />
              )}
              
              {/* JD-specific hints (if linked) */}
              {linkedJD && content.jdKeywordHints && (
                <JDKeywordHints
                  keywords={content.jdKeywordHints}
                  resumeData={resumeData}
                  currentSection={currentStep.id}
                />
              )}
              
              {/* Character count guidance */}
              {['summary', 'experience'].includes(currentStep.id) && (
                <Card className="p-3 bg-blue-50 dark:bg-blue-950 border-blue-200">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-xs space-y-1">
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        Character guidance
                      </p>
                      <p className="text-blue-700 dark:text-blue-300">
                        {currentStep.id === 'summary' 
                          ? '3-4 lines, 100-150 words. Focus on value proposition.'
                          : 'Use bullet points. 3-5 per role. Start with action verbs.'
                        }
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
```

**Content strategy per step:**

| Step | Guide Content | AI Prompt Examples | JD Hints |
|------|---------------|-------------------|----------|
| **Summary** | "Your elevator pitch. Focus on: role, years, top skills, value proposition" | "Make this ATS-friendly", "Add industry keywords", "Quantify achievements" | "Missing: [skill from JD]" |
| **Experience** | "Action verb + quantified achievement + impact. Use PAR (Problem-Action-Result)" | "Enhance with metrics", "ATS optimize", "Add leadership examples" | "JD emphasizes [X]—highlight this" |
| **Skills** | "Categorize by type. Match JD keywords. Balance hard/soft skills" | "Extract from JD", "Cluster by domain" | "Add: [missing required skills]" |
| **Projects** | "Showcase technical depth. Include tech stack, your role, impact" | "Emphasize outcomes" | "JD values [tech]—feature it" |
| **Education** | "Degree, institution, year. GPA if >3.5. Relevant coursework if early career" | — | — |

### Pattern 3: JD Integration UI/UX

**What:** Visual indicators throughout the wizard showing when a job description is linked and providing contextual hints about missing keywords or misaligned content.

**When to use:** When the wizard can be enhanced with external context (like a job description) to improve outcomes.

**Example:**
```typescript
// Linked JD badge in wizard header
export function WizardHeader({ linkedJD }: Props) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Resume Builder</h1>
        
        {linkedJD && (
          <Badge variant="secondary" className="flex items-center gap-1.5">
            <Link2 className="h-3 w-3" />
            <span className="text-xs">Linked to: {linkedJD.title}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => navigateTo('/job-optimizer')}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Badge>
        )}
      </div>
    </div>
  );
}

// JD keyword hints in helper rail
export function JDKeywordHints({ keywords, resumeData, currentSection }: Props) {
  const missingKeywords = keywords.filter(kw => 
    !extractTextFromSection(resumeData, currentSection)
      .toLowerCase()
      .includes(kw.toLowerCase())
  );
  
  if (missingKeywords.length === 0) {
    return (
      <Card className="p-3 bg-green-50 dark:bg-green-950 border-green-200">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-xs text-green-700">
            Good JD alignment! All key terms present.
          </span>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-3 bg-amber-50 dark:bg-amber-950 border-amber-200">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <span className="text-xs font-medium text-amber-900 dark:text-amber-100">
            Missing keywords from JD
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {missingKeywords.slice(0, 5).map(kw => (
            <Badge 
              key={kw}
              variant="outline"
              className="text-xs cursor-pointer hover:bg-amber-100"
              onClick={() => copyToClipboard(kw)}
            >
              {kw}
            </Badge>
          ))}
        </div>
        
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Click to copy. Consider adding these naturally.
        </p>
      </div>
    </Card>
  );
}

// Review step: JD match snapshot
export function ReviewJDMatchSnapshot({ linkedJD, resumeData }: Props) {
  const matchScore = calculateMatchScore(linkedJD, resumeData);
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Job Match Score</h3>
        <Button variant="outline" size="sm" asChild>
          <Link to="/job-optimizer">
            View Full Analysis <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">{matchScore}%</span>
          <Badge variant={matchScore >= 80 ? "default" : "secondary"}>
            {matchScore >= 80 ? "Strong match" : "Room for improvement"}
          </Badge>
        </div>
        
        <Progress value={matchScore} className="h-2" />
        
        <p className="text-xs text-muted-foreground">
          Based on keyword overlap with "{linkedJD.title}"
        </p>
      </div>
    </Card>
  );
}
```

**Integration points:**
1. **Header badge**: Always visible, links back to Job Optimizer
2. **Helper rail hints**: Per-step contextual keyword suggestions
3. **Review step**: Summary of match score with link to full analysis
4. **Empty state**: "Link a job description for tailored suggestions" CTA

### Pattern 4: Mobile-First Responsive Strategy

**What:** Content stacking priority and touch-optimized navigation for mobile/tablet devices.

**When to use:** Any wizard that needs to work across devices without sacrificing usability.

**Breakpoint strategy:**
```typescript
// Responsive breakpoints (existing in project)
const isMobile = useMediaQuery('(max-width: 640px)');    // sm
const isTablet = useMediaQuery('(max-width: 1024px)');   // lg
const isDesktop = !isTablet;

// Layout variations
if (isMobile) {
  // Top progress bar + drawer sidebar + full-width editor + preview as modal
} else if (isTablet) {
  // Sidebar + editor stacked, preview as bottom sheet or modal
} else {
  // Full 3-panel: sidebar + editor + helper rail + collapsible preview
}
```

**Mobile layout:**
```typescript
// Mobile: Stacked layout with drawer navigation
export function WizardLayoutMobile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-screen">
      {/* Fixed header with progress */}
      <MobileProgressBar />
      
      {/* Menu button to open sidebar */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="ml-2">Steps</span>
        </Button>
        
        <Button variant="outline" size="sm" onClick={openPreviewModal}>
          <Eye className="h-4 w-4 mr-1" />
          Preview
        </Button>
      </div>
      
      {/* Main content: Editor */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
      
      {/* Drawer for step navigation */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <WizardSidebar onNavigate={() => setIsSidebarOpen(false)} />
        </SheetContent>
      </Sheet>
      
      {/* Bottom action bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t bg-background">
        <Button variant="outline" onClick={prevStep}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <span className="text-xs text-muted-foreground">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
        <Button onClick={nextStep}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
```

**Tablet layout:**
```typescript
// Tablet: Sidebar + Editor, Preview as modal
export function WizardLayoutTablet() {
  return (
    <ResizablePanelGroup direction="horizontal">
      {/* Collapsible sidebar */}
      <ResizablePanel 
        defaultSize={30} 
        minSize={20} 
        collapsible={true}
        collapsedSize={0}
      >
        <WizardSidebar />
      </ResizablePanel>
      
      <ResizableHandle />
      
      {/* Editor + inline helper rail */}
      <ResizablePanel defaultSize={70}>
        <div className="flex flex-col h-full">
          <Outlet />
          
          {/* Collapsible helper rail at bottom */}
          <Collapsible>
            <CollapsibleTrigger className="w-full p-2 border-t text-xs font-medium">
              Step Guide <ChevronUp className="inline h-3 w-3" />
            </CollapsibleTrigger>
            <CollapsibleContent className="max-h-[200px] overflow-auto">
              <WizardHelperRail />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
```

**Touch optimization:**
- **Minimum tap target**: 44x44px (WCAG AAA)
- **Drawer gestures**: Swipe from edge to open/close sidebar
- **Button spacing**: 8px minimum between interactive elements
- **Bottom sheet preview**: Modal preview triggered from header button
- **Keyboard dismissal**: Hide keyboard when navigating to next step

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| **Progress indicators** | Custom SVG circular progress | Radix UI Progress + CSS | Accessible, themeable, animated with CSS transitions |
| **Collapsible panels** | Custom accordion logic | Radix UI Collapsible/Accordion | Keyboard nav, ARIA labels, animation hooks built-in |
| **Step validation** | Manual form validation | Existing WizardContext `validateStep()` | Already implemented with error tracking |
| **Autosave feedback** | Custom save indicator | Existing WizardContext `autoSaveStatus` | Already debounced, persists to localStorage |
| **Responsive breakpoints** | Window resize listeners | Existing `useMediaQuery` hook | Performance-optimized, SSR-safe |
| **Icon system** | Custom SVGs or multiple libraries | Existing lucide-react | Consistent, tree-shakeable, TypeScript types |
| **Layout persistence** | Custom localStorage logic | localStorage with JSON.stringify | Simple, no extra dependencies |
| **Animation sequencing** | setTimeout chains | Framer Motion variants with `delayChildren` | Declarative, interruptible, respects reduced motion |

**Key insight:** The project already has a mature component library (shadcn/ui = Radix UI + Tailwind). Don't introduce new UI primitives—compose existing ones creatively.

---

## Common Pitfalls

### Pitfall 1: Overloading the Sidebar with Information

**What goes wrong:** Adding too many indicators (progress bars, badges, tooltips, ATS scores) to each step makes the sidebar visually overwhelming and hard to scan.

**Why it happens:** Desire to show all context at once; fear users will miss important information.

**How to avoid:**
- **Progressive disclosure**: Show badges on hover, not by default
- **Visual hierarchy**: Only show ATS weight for high-impact steps (20%+)
- **Consistent iconography**: Use 3 states (empty, partial, complete) not 5+
- **Whitespace**: 16px between step items minimum

**Warning signs:**
- Sidebar feels cramped
- Text truncation everywhere
- Can't distinguish active step easily

**Example fix:**
```typescript
// BAD: Too much information
<div className="flex items-center gap-1">
  <Icon />
  <span>{step.label}</span>
  <Badge>{atsWeight}%</Badge>
  <Badge>{completionPercent}%</Badge>
  <Progress value={completionPercent} />
  <Tooltip>More info...</Tooltip>
</div>

// GOOD: Progressive disclosure
<div className="flex items-center gap-3">
  <StatusIcon /> {/* Simple: empty/partial/complete */}
  <span className="flex-1">{step.label}</span>
  {atsWeight >= 20 && <Badge>{atsWeight}%</Badge>} {/* High-impact only */}
  {/* Progress bar ONLY if partial (0 < completion < 100) */}
</div>
```

### Pitfall 2: Helper Rail Becomes a Dumping Ground

**What goes wrong:** Helper rail accumulates every possible tip, example, and link, becoming a wall of text that users ignore.

**Why it happens:** Lack of content hierarchy; treating helper rail like documentation.

**How to avoid:**
- **Step-specific content ONLY**: No generic resume tips
- **Maximum 3-4 cards**: Guide, Tips, AI Prompts, JD Hints
- **Scannable format**: Bullet points, not paragraphs
- **Actionable**: Every piece of content should enable an action (copy, click AI, etc.)

**Warning signs:**
- Users immediately collapse the helper rail
- Average read time <5 seconds
- Content repeats between steps

**Example fix:**
```typescript
// BAD: Generic advice dump
<HelperRail>
  <p>Writing a great resume is important...</p>
  <p>Here are 15 tips for resume writing...</p>
  <p>Common mistakes include...</p>
  <p>Additional resources...</p>
</HelperRail>

// GOOD: Step-specific, actionable
<HelperRail>
  <GuideCard title="What this section does">
    Your summary is your elevator pitch. Focus on role, years, top skills.
  </GuideCard>
  
  <TipsCard items={[
    "Use 3-4 lines (100-150 words)",
    "Start with current/target role",
    "Quantify experience (e.g., '5+ years')"
  ]} />
  
  <AIPromptsCard examples={[
    "Make this ATS-friendly",
    "Add industry keywords for [role]"
  ]} />
</HelperRail>
```

### Pitfall 3: Mobile Navigation Becomes a Chore

**What goes wrong:** On mobile, users have to open a drawer → scroll to find step → close drawer → repeat for every navigation. Progress becomes hidden.

**Why it happens:** Directly translating desktop sidebar to mobile drawer without rethinking the UX.

**How to avoid:**
- **Always-visible progress**: Top bar showing step X of Y
- **Quick prev/next**: Bottom action bar with arrow buttons
- **Smart drawer**: Auto-closes after navigation
- **Gesture support**: Swipe between steps (optional, not required)

**Warning signs:**
- Users backtrack using browser back button instead of UI
- High drop-off rate on mobile wizard sessions
- Session recordings show repeated drawer open/close

**Example fix:**
```typescript
// BAD: Desktop sidebar stuffed into drawer
<Sheet>
  <SheetTrigger>Open Steps</SheetTrigger>
  <SheetContent>
    <WizardSidebar /> {/* Same as desktop */}
  </SheetContent>
</Sheet>

// GOOD: Mobile-optimized navigation
<>
  {/* Always visible progress */}
  <MobileProgressBar currentStep={3} totalSteps={10} />
  
  {/* Bottom action bar for quick navigation */}
  <div className="fixed bottom-0 inset-x-0 p-4 border-t bg-background">
    <div className="flex items-center justify-between mb-2">
      <Button variant="outline" onClick={prevStep}>
        <ChevronLeft /> Back
      </Button>
      <span className="text-xs">Step 3 of 10</span>
      <Button onClick={nextStep}>
        Next <ChevronRight />
      </Button>
    </div>
    
    {/* Optional: Jump to specific step */}
    <Button 
      variant="ghost" 
      size="sm" 
      className="w-full"
      onClick={openDrawer}
    >
      Jump to step...
    </Button>
  </div>
</>
```

### Pitfall 4: Animation Overload

**What goes wrong:** Every step transition, badge update, and helper rail toggle triggers a different animation, making the UI feel chaotic and slow.

**Why it happens:** Framer Motion makes animations easy to add; no animation budget defined.

**How to avoid:**
- **Animation budget**: Max 2 simultaneous animations
- **Consistent transitions**: Use same duration/easing for similar actions
- **Respect reduced motion**: Check `useReducedMotion()` hook
- **Performance**: Animate `transform` and `opacity` only (GPU-accelerated)

**Warning signs:**
- Animations feel laggy on mid-range devices
- Users disable animations in settings
- Step transitions take >300ms

**Example fix:**
```typescript
// BAD: Uncoordinated animations
<motion.div 
  initial={{ x: -100, opacity: 0, scale: 0.8, rotate: -10 }}
  animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
  transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
>
  {/* Also animating children individually */}
</motion.div>

// GOOD: Subtle, consistent transitions
const stepVariants = {
  enter: { x: 20, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 }
};

const transition = { duration: 0.2, ease: "easeInOut" };

<AnimatePresence mode="wait">
  <motion.div
    key={currentStep.id}
    variants={stepVariants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={transition}
  >
    <StepContent />
  </motion.div>
</AnimatePresence>
```

### Pitfall 5: Non-Linear Navigation Without Validation

**What goes wrong:** Users can jump to any step at any time, leading to incomplete data, validation errors on submit, and confusion about required steps.

**Why it happens:** Confusing "allow navigation" with "skip validation."

**How to avoid:**
- **Visual indicators**: Show which steps are required vs optional
- **Gentle nudges**: Warning toast when skipping incomplete required step
- **Block submission**: Review step checks all required fields before export
- **Preserve draft**: Even incomplete steps are auto-saved

**Warning signs:**
- Users export resumes with missing contact info
- High rate of validation errors on review step
- Support requests about "can't export" issues

**Example fix:**
```typescript
// Navigation logic in WizardContext
const goToStep = (stepId: string) => {
  const targetStep = steps.find(s => s.id === stepId);
  const currentStepData = validateStep(currentStep.id);
  
  // Allow navigation, but warn if leaving incomplete required step
  if (currentStep.isRequired && !currentStepData.isValid) {
    toast({
      title: "Step incomplete",
      description: `${currentStep.title} has required fields. You can come back to finish it.`,
      variant: "warning"
    });
  }
  
  // Navigate
  navigate(targetStep.path);
};

// On review/export, block if missing required data
const handleExport = () => {
  const incompleteRequired = steps.filter(s => 
    s.isRequired && getStepCompletion(s.id) < 100
  );
  
  if (incompleteRequired.length > 0) {
    toast({
      title: "Complete required steps",
      description: `Please fill out: ${incompleteRequired.map(s => s.label).join(', ')}`,
      variant: "destructive"
    });
    // Highlight steps in sidebar
    setHighlightedSteps(incompleteRequired.map(s => s.id));
    return;
  }
  
  // Proceed with export
  openExportModal();
};
```

---

## Code Examples

### Complete Vertical Stepper with All Features

```typescript
// Source: Radix UI + Framer Motion + existing WizardContext
import { Progress } from '@/shared/ui/progress';
import { Badge } from '@/shared/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWizard } from '@/shared/contexts/WizardContext';
import { cn } from '@/shared/lib/utils';

export function VerticalStepperSidebar() {
  const { steps, currentStep, goToStep, getStepCompletion, canNavigateToStep } = useWizard();
  const totalATSWeight = steps.reduce((sum, s) => sum + s.atsWeight, 0);
  
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Overall progress header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold">Resume Progress</h2>
          <span className="text-xs text-muted-foreground">
            {steps.filter(s => getStepCompletion(s.id) === 100).length} / {steps.length}
          </span>
        </div>
        <Progress 
          value={(steps.filter(s => getStepCompletion(s.id) === 100).length / steps.length) * 100}
          className="h-2"
        />
      </div>
      
      {/* Step list */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          <AnimatePresence mode="sync">
            {steps.map((step) => {
              const completion = getStepCompletion(step.id);
              const isActive = currentStep.id === step.id;
              const canNavigate = canNavigateToStep(step.id);
              
              return (
                <StepNavigationItem
                  key={step.id}
                  step={step}
                  isActive={isActive}
                  completionPercent={completion}
                  canNavigate={canNavigate}
                  onClick={() => goToStep(step.id)}
                />
              );
            })}
          </AnimatePresence>
        </nav>
      </ScrollArea>
      
      {/* ATS impact summary */}
      <div className="p-4 border-t bg-muted/30">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          <span>
            Numbers show ATS impact. Focus on high-value sections first.
          </span>
        </div>
      </div>
    </div>
  );
}

function StepNavigationItem({ step, isActive, completionPercent, canNavigate, onClick }: Props) {
  const Icon = step.icon;
  
  const getStatusIcon = () => {
    if (completionPercent === 100) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    if (completionPercent > 0) {
      return <Circle className="h-4 w-4 text-amber-500 fill-amber-500/20" />;
    }
    return <Circle className="h-4 w-4 text-muted-foreground" />;
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.button
          onClick={onClick}
          disabled={!canNavigate}
          className={cn(
            "group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
            isActive && "bg-accent shadow-sm",
            !isActive && canNavigate && "hover:bg-accent/50",
            !canNavigate && "opacity-50 cursor-not-allowed"
          )}
          whileHover={canNavigate ? { x: 4 } : {}}
          whileTap={canNavigate ? { scale: 0.98 } : {}}
          layout
        >
          {/* Status indicator */}
          <div className="shrink-0">
            {getStatusIcon()}
          </div>
          
          {/* Label with icon */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span className={cn(
                "text-sm font-medium truncate",
                isActive && "text-foreground",
                !isActive && "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
            
            {/* Progress bar for partial completion */}
            {completionPercent > 0 && completionPercent < 100 && (
              <Progress value={completionPercent} className="h-1" />
            )}
          </div>
          
          {/* ATS weight badge */}
          {step.atsWeight > 0 && (
            <Badge 
              variant={step.atsWeight >= 20 ? "default" : "secondary"}
              className="shrink-0 text-[10px] px-1.5 py-0"
            >
              {step.atsWeight}%
            </Badge>
          )}
          
          {/* Required indicator */}
          {step.isRequired && completionPercent < 100 && (
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
          )}
        </motion.button>
      </TooltipTrigger>
      
      <TooltipContent side="right" className="max-w-[200px]">
        <div className="space-y-1">
          <p className="font-medium text-xs">{step.title}</p>
          {step.helpText && (
            <p className="text-xs text-muted-foreground">{step.helpText}</p>
          )}
          {step.atsWeight > 0 && (
            <p className="text-xs text-blue-600">
              ATS Impact: {step.atsWeight}% ({step.atsWeight >= 20 ? 'High priority' : 'Optional'})
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
```

### Complete Helper Rail Implementation

```typescript
// Step-specific helper content configuration
const STEP_HELPER_CONTENT: Record<string, HelperContent> = {
  summary: {
    title: "Professional Summary",
    description: "Your elevator pitch. Focus on current/target role, years of experience, top skills, and value proposition.",
    tips: [
      "Keep it to 3-4 lines (100-150 words)",
      "Start with your current or target role",
      "Quantify experience (e.g., '5+ years in...')",
      "Highlight 2-3 key skills relevant to your target role",
      "End with unique value or specialization"
    ],
    aiPromptExamples: [
      "Make this ATS-friendly",
      "Add industry keywords for [role]",
      "Emphasize leadership experience",
      "Quantify achievements"
    ],
    characterGuidance: "3-4 lines, 100-150 words. Focus on value proposition."
  },
  experience: {
    title: "Work Experience",
    description: "Showcase achievements, not just responsibilities. Use PAR format: Problem you faced → Action you took → Result you achieved.",
    tips: [
      "Use action verbs (Led, Implemented, Optimized, etc.)",
      "Quantify impact with numbers, %, or $",
      "3-5 bullet points per role (quality over quantity)",
      "Most recent experience first",
      "Focus on achievements, not duties"
    ],
    aiPromptExamples: [
      "Add quantified metrics",
      "ATS optimize this role",
      "Emphasize leadership examples",
      "Highlight technical skills"
    ],
    characterGuidance: "Use bullet points. 3-5 per role. Start with action verbs."
  },
  skills: {
    title: "Skills",
    description: "Organize skills by category (Technical, Tools, Soft Skills). Match job description keywords.",
    tips: [
      "Group by category for easy scanning",
      "Include both hard and soft skills",
      "Match keywords from job descriptions",
      "Be specific (e.g., 'React 18' vs 'JavaScript')",
      "List proficiency level if relevant"
    ],
    aiPromptExamples: [
      "Extract keywords from JD",
      "Cluster by technical domain",
      "Add missing required skills"
    ]
  }
};

export function WizardHelperRail({ currentStep, linkedJD, resumeData }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const content = STEP_HELPER_CONTENT[currentStep.id];
  
  if (!content) return null;
  
  return (
    <div className="h-full flex flex-col border-l bg-muted/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <h3 className="text-sm font-semibold">Step Guide</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Content */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-hidden"
          >
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {/* What this step does */}
                <Card className="p-4 bg-background">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Info className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">What this section does</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {content.description}
                      </p>
                    </div>
                  </div>
                </Card>
                
                {/* Tips for success */}
                <Card className="p-4 bg-background">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 p-2 rounded-lg bg-green-100 dark:bg-green-900">
                      <Target className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h4 className="text-sm font-semibold">How to make it strong</h4>
                      <ul className="space-y-1.5">
                        {content.tips.map((tip, idx) => (
                          <li key={idx} className="flex gap-2 text-xs text-muted-foreground">
                            <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
                
                {/* Character count guidance */}
                {content.characterGuidance && (
                  <Card className="p-3 bg-blue-50 dark:bg-blue-950 border-blue-200">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-xs space-y-0.5">
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Character guidance
                        </p>
                        <p className="text-blue-700 dark:text-blue-300">
                          {content.characterGuidance}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
                
                {/* AI prompt suggestions */}
                {content.aiPromptExamples && (
                  <Card className="p-4 bg-background">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h4 className="text-sm font-semibold">AI Quick Actions</h4>
                        <div className="space-y-1.5">
                          {content.aiPromptExamples.map((example, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="w-full justify-start text-xs h-8"
                              onClick={() => triggerAIEnhancement(currentStep.id, example)}
                            >
                              <Sparkles className="h-3 w-3 mr-2" />
                              {example}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
                
                {/* JD-specific hints */}
                {linkedJD && (
                  <JDKeywordHints
                    linkedJD={linkedJD}
                    resumeData={resumeData}
                    currentSection={currentStep.id}
                  />
                )}
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## Microcopy & Tone Guidelines

### Principles

1. **Encouraging, not prescriptive**: "Consider adding..." vs "You must add..."
2. **Concise**: Max 2 sentences per tip
3. **Actionable**: Every piece of guidance should enable immediate action
4. **Contextual**: Change based on completion state (empty → partial → complete)

### Empty States

| Step | Empty State Microcopy |
|------|----------------------|
| **Summary** | "Your summary is your first impression. In 3-4 lines, tell employers who you are and what value you bring." |
| **Experience** | "Add your most recent roles. Focus on achievements, not just responsibilities." |
| **Skills** | "List your top skills. Group them by category (Technical, Tools, Soft Skills) for easy scanning." |
| **Projects** | "Showcase 2-3 standout projects that demonstrate your expertise and impact." |

### Success Feedback

| Action | Toast Message |
|--------|---------------|
| **Auto-save** | "Saved automatically" (subtle, bottom-right, 2s duration) |
| **AI enhancement applied** | "Section enhanced! Review the changes." |
| **Step completed** | "✓ [Step name] completed" (with confetti animation) |
| **JD linked** | "Job description linked. You'll see tailored keyword suggestions as you build." |

### Warning Patterns

| Scenario | Warning Microcopy |
|----------|-------------------|
| **Navigating away from incomplete required step** | "Step incomplete. [Step name] has required fields. You can come back to finish it." |
| **Exporting with missing required data** | "Complete required steps. Please fill out: Personal, Summary, Experience." |
| **Missing JD keywords** | "Missing 3 keywords from JD. Click to copy: [keyword] [keyword] [keyword]" |

---

## Mobile-First Responsive Patterns

### Breakpoint Strategy

```typescript
// Existing useMediaQuery hook (no new code needed)
const isMobile = useMediaQuery('(max-width: 640px)');     // Stacked layout
const isTablet = useMediaQuery('(max-width: 1024px)');    // Simplified panels
const isDesktop = !isTablet;                               // Full 3-panel layout
```

### Layout Variations

| Breakpoint | Sidebar | Editor | Helper Rail | Preview |
|------------|---------|--------|-------------|---------|
| **Mobile (<640px)** | Drawer (Sheet) | Full-width | Collapsible footer | Modal (Sheet) |
| **Tablet (640-1024px)** | Collapsible left panel (30%) | Main content (70%) | Bottom accordion | Modal or inline toggle |
| **Desktop (>1024px)** | Fixed left (25%) | Main content (45%) | Right panel (30%) | Inline collapsible |

### Mobile-Specific Components

```typescript
// Top progress bar (mobile only)
export function MobileProgressBar({ currentStepIndex, totalSteps, steps }: Props) {
  const currentStep = steps[currentStepIndex];
  
  return (
    <div className="sticky top-0 z-20 bg-background border-b">
      {/* Overall progress bar */}
      <Progress 
        value={(currentStepIndex / totalSteps) * 100} 
        className="h-1 rounded-none"
      />
      
      {/* Current step indicator */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <currentStep.icon className="h-4 w-4" />
          <span className="text-sm font-medium">{currentStep.label}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {currentStepIndex + 1} of {totalSteps}
        </span>
      </div>
    </div>
  );
}

// Bottom action bar (mobile only)
export function MobileActionBar({ onPrev, onNext, canGoPrev, canGoNext }: Props) {
  return (
    <div className="sticky bottom-0 z-20 bg-background border-t p-4">
      <div className="flex items-center justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex-1"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={!canGoNext}
          className="flex-1"
        >
          {canGoNext ? 'Next' : 'Review'}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// Drawer sidebar (mobile only)
export function MobileSidebarDrawer({ steps, currentStep, onNavigate }: Props) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-2">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Resume Steps</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-80px)]">
          <nav className="p-3 space-y-1">
            {steps.map(step => (
              <StepNavigationItem
                key={step.id}
                step={step}
                isActive={step.id === currentStep.id}
                onClick={() => {
                  onNavigate(step.id);
                  // Close drawer automatically
                }}
              />
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
```

### Touch Optimization

- **Minimum tap target**: 44x44px (WCAG AAA)
- **Spacing**: 8px minimum between interactive elements
- **Buttons**: Use `size="default"` on mobile (not `size="sm"`)
- **Drawers**: Enable swipe gesture to close
- **Form inputs**: `inputMode` attribute for appropriate keyboard

```typescript
// Example: Touch-optimized form inputs
<Input
  type="email"
  inputMode="email"      // Shows email keyboard on mobile
  className="h-12 text-base"  // Larger touch target, prevents zoom on iOS
/>
```

---

## Animation Best Practices with Framer Motion

### Animation Budget

**Rule:** Maximum 2 simultaneous animations. Favor subtlety over spectacle.

### Performance Guidelines

1. **Animate only GPU-accelerated properties**: `transform`, `opacity`
2. **Avoid animating**: `width`, `height`, `top`, `left` (use `scale` and `x`/`y` instead)
3. **Use `layout` prop** for automatic layout animations
4. **Respect reduced motion**: Always check `useReducedMotion()` hook

### Step Transition Pattern

```typescript
// Shared animation variants for all steps
const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 20 : -20,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -20 : 20,
    opacity: 0
  })
};

const stepTransition = {
  duration: 0.2,
  ease: "easeInOut"
};

// Usage in step container
export function StepContainer({ children }: Props) {
  const { currentStep, direction } = useWizard();
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    // No animation if user prefers reduced motion
    return <div className="p-6">{children}</div>;
  }
  
  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={currentStep.id}
        custom={direction}
        variants={stepVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={stepTransition}
        className="p-6"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### Sidebar Rearrangement Animation

```typescript
// Using LayoutGroup for smooth step reordering
import { LayoutGroup, motion } from 'framer-motion';

export function WizardSidebar({ steps }: Props) {
  return (
    <LayoutGroup>
      <nav className="space-y-1">
        {steps.map(step => (
          <motion.div
            key={step.id}
            layout              // Automatic layout animation on position change
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <StepNavigationItem step={step} />
          </motion.div>
        ))}
      </nav>
    </LayoutGroup>
  );
}
```

### Micro-interactions

```typescript
// Hover and tap feedback
<motion.button
  whileHover={{ scale: 1.02, x: 4 }}       // Slight grow + slide right
  whileTap={{ scale: 0.98 }}                // Slight shrink on press
  transition={{ duration: 0.15 }}
>
  {children}
</motion.button>

// Badge pulse on update
<motion.div
  key={atsScore}                            // Re-trigger animation when score changes
  initial={{ scale: 1.2, opacity: 0.5 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  <Badge>{atsScore}%</Badge>
</motion.div>

// Progress bar smooth fill
<motion.div
  className="h-2 bg-primary rounded-full"
  initial={{ width: 0 }}
  animate={{ width: `${percentage}%` }}
  transition={{ duration: 0.5, ease: "easeOut" }}
/>
```

### Reduced Motion Handling

```typescript
import { useReducedMotion } from 'framer-motion';

export function AnimatedComponent() {
  const prefersReducedMotion = useReducedMotion();
  
  const variants = prefersReducedMotion
    ? {
        // Instant transitions for reduced motion
        enter: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : {
        // Full animations for normal mode
        enter: { x: 20, opacity: 0 },
        exit: { x: -20, opacity: 0 }
      };
  
  return (
    <motion.div
      variants={variants}
      initial="enter"
      animate={{ x: 0, opacity: 1 }}
      exit="exit"
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Component Architecture (shadcn/ui Usage)

### Existing Components to Reuse

| Component | Use Case | Notes |
|-----------|----------|-------|
| **Progress** | Step completion, overall progress, mobile top bar | Already styled, supports theming |
| **Badge** | ATS weight, completion status, JD link indicator | Multiple variants (default, secondary, outline) |
| **Tooltip** | ATS weight explanations, icon hints | Position with `side` prop |
| **Collapsible** | Helper rail toggle, expandable sections | Use `CollapsibleContent` for smooth height animation |
| **Accordion** | Tablet helper rail, FAQ-style content | Multi-item or single-item mode |
| **ScrollArea** | Sidebar, helper rail, form content | Custom scrollbar styling |
| **Separator** | Visual dividers between sections | Horizontal or vertical |
| **Button** | Navigation, actions, AI triggers | Consistent sizing and variants |
| **Card** | Content containers, empty states | Use `CardHeader`, `CardContent` for structure |
| **Sheet** | Mobile sidebar drawer, preview modal | Side prop: left, right, bottom |

### New Components to Build

```typescript
// StepNavigationItem.tsx - Enhanced sidebar button
interface StepNavigationItemProps {
  step: WizardStep;
  isActive: boolean;
  completionPercent: number;
  onClick: () => void;
}

// WizardHelperRail.tsx - Right-side contextual helper
interface WizardHelperRailProps {
  currentStep: WizardStep;
  linkedJD?: JobDescription;
  resumeData: ResumeData;
}

// StepGuideCard.tsx - Reusable info card in helper rail
interface StepGuideCardProps {
  icon: LucideIcon;
  title: string;
  content: React.ReactNode;
}

// JDKeywordHints.tsx - Missing keywords from JD
interface JDKeywordHintsProps {
  linkedJD: JobDescription;
  resumeData: ResumeData;
  currentSection: string;
}

// MobileProgressBar.tsx - Top progress indicator
interface MobileProgressBarProps {
  currentStepIndex: number;
  totalSteps: number;
  steps: WizardStep[];
}
```

---

## Accessibility Considerations

### Keyboard Navigation

- **Step navigation**: Arrow keys to move between steps in sidebar
- **Focus management**: Auto-focus first input when entering new step
- **Skip links**: "Skip to next step" for screen reader users
- **Escape key**: Close drawers, modals, helper rail

### ARIA Labels

```typescript
// Step navigation
<button
  role="tab"
  aria-selected={isActive}
  aria-controls={`step-panel-${step.id}`}
  aria-label={`${step.title}. ${completionPercent}% complete. ${step.isRequired ? 'Required.' : 'Optional.'}`}
>
  {step.label}
</button>

// Progress bar
<Progress 
  value={percentage} 
  aria-label={`Overall resume completion: ${percentage}%`}
/>

// Helper rail
<aside
  aria-label="Step guidance and tips"
  role="complementary"
>
  {helperContent}
</aside>
```

### Focus Indicators

```css
/* Focus ring for keyboard navigation */
.focus-visible:focus {
  @apply ring-2 ring-ring ring-offset-2 ring-offset-background;
}

/* Ensure focus rings are visible in all steps */
button:focus-visible,
a:focus-visible,
input:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}
```

### Screen Reader Announcements

```typescript
// Announce step changes
const announceStepChange = (stepName: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = `Now editing: ${stepName}`;
  document.body.appendChild(announcement);
  setTimeout(() => document.body.removeChild(announcement), 1000);
};

// Auto-save feedback
<div role="status" aria-live="polite" className="sr-only">
  {autoSaveStatus === 'saved' && 'Changes saved automatically'}
</div>
```

---

## State of the Art (2026 Patterns)

### Modern Wizard UX Trends

| Old Approach | Current Approach (2026) | When Changed | Impact |
|--------------|-------------------------|--------------|--------|
| **Linear-only navigation** | Non-linear with gentle nudges | 2023-2024 | Users can jump around but get warnings for incomplete required steps |
| **Step count in header** | Dual progress (step count + % complete) | 2024 | Clearer sense of overall progress vs granular position |
| **Generic step labels** | Outcome-focused labels with impact indicators | 2024-2025 | "Experience (30% ATS)" vs just "Experience" |
| **Sidebar-only navigation** | Contextual helper rail + sidebar | 2025 | Guidance integrated into workflow, not separate help docs |
| **Mobile: Scaled-down desktop** | Mobile-first with stacked layout | 2023-2024 | Touch-optimized, vertical scrolling, bottom action bar |
| **Save button** | Auto-save with status indicator | 2022-2023 | Reduced anxiety, no data loss |
| **Validation on submit** | Real-time inline validation | 2023-2024 | Immediate feedback, fewer errors on submission |

### Deprecated/Outdated Patterns

- **Breadcrumb navigation for wizards**: Replaced by vertical stepper with completion states
- **"Back" and "Next" as sole navigation**: Now supplemented with jump-to-step sidebar
- **Modal-based steps**: Single-page with animated transitions performs better
- **Accordion sidebar**: Tabs and progressive disclosure are clearer
- **Desktop-first responsive**: Mobile-first prevents layout compromises

---

## Open Questions

### 1. **JD Integration Depth**

**What we know:** 
- Job Optimizer already extracts keywords from JDs
- ResumeContext has full resume data access
- ATSContext provides scoring logic

**What's unclear:**
- Should JD hints auto-populate form fields (e.g., auto-add missing skills)?
- Or keep it suggestion-only to preserve user control?

**Recommendation:** 
- Keep it suggestion-only for Phase 04
- Provide "Add to resume" button next to each keyword hint
- Track user acceptance rate to inform Phase 05 auto-population

### 2. **Helper Rail Persistence**

**What we know:**
- Radix Collapsible supports controlled state
- localStorage available for preference persistence

**What's unclear:**
- Should helper rail state persist across sessions?
- Or reset to expanded state each time?

**Recommendation:**
- Persist per-session (sessionStorage)
- Default to expanded for first-time users
- Track collapse/expand events to identify which content is ignored

### 3. **AI Prompt Execution Location**

**What we know:**
- AIEnhanceModal exists for manual AI enhancement
- Helper rail wants to suggest quick AI actions

**What's unclear:**
- Should helper rail AI buttons open the modal with pre-filled prompt?
- Or execute inline and show results in a toast/banner?

**Recommendation:**
- Open AIEnhanceModal with pre-filled prompt and selected section
- Keeps AI flow consistent with existing UX
- Allows users to customize prompt before execution

### 4. **Mobile Preview Strategy**

**What we know:**
- Desktop has collapsible right panel preview
- Mobile has limited screen space

**What's unclear:**
- Should mobile preview be a full-screen modal?
- Or bottom sheet with partial visibility?

**Recommendation:**
- Full-screen Sheet (modal) triggered from header button
- Include "Apply to actual resume" button if in preview-only mode
- Provide zoom controls for readability

---

## Sources

### Primary (HIGH confidence)

- **Radix UI Official Documentation** — Progress, Collapsible, Accordion primitives
  - https://www.radix-ui.com/primitives/docs/components/progress
  - https://www.radix-ui.com/primitives/docs/components/collapsible
  - https://www.radix-ui.com/primitives/docs/components/accordion
  
- **Framer Motion Official Documentation** — Animation patterns, transitions, reduced motion
  - https://www.framer.com/motion/animation/
  - Verified: AnimatePresence, variants, layout animations, useReducedMotion
  
- **Existing Codebase** — WizardContext, WizardLayout, react-resizable-panels usage
  - `src/shared/contexts/WizardContext.tsx` — Step navigation, completion tracking
  - `src/features/resume-builder/components/layout/WizardLayout.tsx` — 3-panel reference
  - `src/shared/config/wizardSteps.ts` — ATS weight configuration
  - `.planning/phases/03-job-optimizer-ui/03-RESEARCH.md` — Panel layout patterns

### Secondary (MEDIUM confidence)

- **Phase 03 Research** — Multi-panel layout patterns, progressive disclosure
  - Verified panel nesting strategy, empty state patterns
  - Applicable to wizard helper rail design

- **WCAG 2.1 Guidelines** — Accessibility requirements (keyboard nav, ARIA labels, focus management)
  - Touch target size (44x44px minimum)
  - Focus indicators, skip links, screen reader announcements

### Tertiary (LOW confidence — general UX knowledge)

- **Modern wizard UX trends** — Based on industry patterns (non-linear navigation, dual progress, outcome-focused labels)
  - No specific source, but widely adopted across SaaS products (Stripe, TurboTax, LinkedIn)
  - Marked as LOW confidence, should be validated with user testing

---

## Metadata

**Confidence breakdown:**

- **Standard stack**: HIGH — All libraries already installed, versions verified from package.json
- **Architecture patterns**: HIGH — Based on existing WizardLayout and Phase 03 research
- **Component examples**: HIGH — Using verified Radix UI and Framer Motion APIs
- **Mobile patterns**: MEDIUM — General best practices, not project-specific testing
- **UX trends**: MEDIUM — Industry observation, not user-tested for this project

**Research date:** 2026-02-17  
**Valid until:** ~30 days (stable domain, but UX trends evolve quickly)

**Assumptions:**
- Existing WizardContext provides sufficient step management (validation, completion tracking)
- ResumeContext autosave (2s debounce) is adequate for new layout
- Users have access to Job Optimizer separately (not embedded in wizard)

**Next steps for validation:**
- [ ] Prototype vertical stepper with ATS badges → test visual hierarchy
- [ ] Test helper rail content length → identify max before users ignore
- [ ] Mobile usability testing → validate bottom action bar vs swipe navigation
- [ ] A/B test JD hints (suggestion-only vs auto-populate) → measure engagement
