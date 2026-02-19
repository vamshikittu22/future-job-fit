---
phase: 04-resume-wizard-redesign
plan: 01
subsystem: ui
tags: [react, wizard, navigation, ux, completion-tracking, ats-optimization]

# Dependency graph
requires:
  - phase: 03-job-optimizer-ui
    provides: Shared UI components (Badge, Progress, Tooltip)
provides:
  - Modern vertical stepper with visual completion states
  - ATS weight indicators on high-impact steps
  - Non-linear navigation with gentle warnings
  - Enhanced progress visualization
affects: [04-resume-wizard-redesign, resume-builder-ux]

# Tech tracking
tech-stack:
  added: []
  patterns: [visual-feedback-patterns, non-linear-navigation, gentle-nudge-ux]

key-files:
  created: []
  modified:
    - src/features/resume-builder/components/layout/WizardSidebar.tsx
    - src/shared/contexts/WizardContext.tsx
    - src/shared/config/wizardSteps.ts

key-decisions:
  - "Non-linear navigation with warnings instead of blocking"
  - "ATS badges only shown for steps with >=20% weight (Experience 30%, Skills 25%, Summary 15%)"
  - "Mini progress bars only for partial completion (0 < completion < 100)"
  - "Gentle toast warnings when leaving incomplete required steps (no blocking)"

patterns-established:
  - "Visual completion states: green CheckCircle2 (complete), yellow filled Circle (partial), grey Circle (empty)"
  - "Motion feedback: whileHover={{ x: 4 }} for navigable steps"
  - "Overall progress tracking: 'X / Y' completed count with progress bar"

# Metrics
duration: 6min
completed: 2026-02-19
---

# Phase 04 Plan 01: Modern Vertical Stepper with Completion States and ATS Badges

**Enhanced WizardSidebar with visual completion tracking, ATS weight indicators, and non-linear navigation with gentle warnings**

## Performance

- **Duration:** 6 min
- **Started:** 2026-02-19T17:14:01Z
- **Completed:** 2026-02-19T17:20:14Z
- **Tasks:** 3 completed
- **Files modified:** 3

## Accomplishments

- Transformed basic sidebar into modern vertical stepper with visual completion states
- Added ATS weight badges with tooltips on high-impact steps (Experience 30%, Skills 25%, Summary 15%)
- Implemented non-linear navigation allowing users to jump to any step
- Added gentle warning system for incomplete required steps (toast notification, non-blocking)
- Enhanced progress visualization with overall completion counter and mini progress bars

## Task Commits

Each task was committed atomically:

1. **Task 1: Enhance WizardSidebar with visual completion states and ATS badges** - `abe0e76` (feat)
2. **Task 2: Add non-linear navigation with gentle warning system** - `7b827f1` (feat)
3. **Task 3: Update wizardSteps config with ATS weight explanations** - `967d05b` (feat)

**Plan metadata:** (next commit) (docs: complete plan)

## Files Created/Modified

- `src/features/resume-builder/components/layout/WizardSidebar.tsx` - Enhanced vertical stepper with completion icons, ATS badges, mini progress bars, overall progress header, and motion feedback
- `src/shared/contexts/WizardContext.tsx` - Non-linear navigation with warning toasts, getStepATSWeight() helper, imported useToast hook
- `src/shared/config/wizardSteps.ts` - Added atsWeightReason field to WizardStep interface with explanations for 5 high-impact steps

## Decisions Made

**Non-linear Navigation Philosophy:**
- Allow users to navigate freely to any step without hard validation gates
- Show gentle warning toast when leaving incomplete required steps (doesn't block)
- Validation only enforced on "Next" button click, not free navigation
- This follows modern UX patterns (e.g., Notion, Linear) where users can explore non-linearly

**ATS Badge Visibility Threshold:**
- Only show ATS badges for steps with atsWeight >= 20%
- This highlights Experience (30%), Skills (25%), and Summary (15%) as high priorities
- Prevents visual clutter from showing badges on every step
- Tooltip provides context: "ATS Impact: X% - High priority for ATS optimization"

**Progress Visualization Strategy:**
- Overall progress: "X / Y" count + progress bar at top of sidebar
- Per-step progress: Mini progress bars only shown for partial completion (0 < completion < 100)
- Completion icons: Green check (100%), yellow filled circle (partial), grey circle (empty)
- Required incomplete steps: Amber AlertCircle icon for visibility

**Motion Feedback:**
- Added whileHover={{ x: 4 }} motion on step items for micro-interaction
- Only applies to active/navigable steps to indicate clickability
- Respects prefers-reduced-motion for accessibility

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Ready for next plan (04-02). Enhanced sidebar provides strong foundation for:
- AI-powered section suggestions (04-02)
- Smart content guidance (04-03)
- Section reordering improvements (04-04)
- Template-specific recommendations (04-05)

The visual completion tracking and ATS weight indicators establish clear value communication that future features can build upon.

---
*Phase: 04-resume-wizard-redesign*
*Completed: 2026-02-19*
