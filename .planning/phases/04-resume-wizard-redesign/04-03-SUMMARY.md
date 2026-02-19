---
phase: 04-resume-wizard-redesign
plan: 03
subsystem: ui
tags: [ai-prompts, character-guidance, helper-rail, wizard-ux]

# Dependency graph
requires:
  - phase: 04-resume-wizard-redesign
    provides: Helper rail foundation with step-specific guidance (04-02)
provides:
  - AI prompt suggestions for quick enhancements (Summary, Experience, Projects)
  - Character count guidance with visual feedback (Summary, Experience)
  - One-click AI modal pre-fill from helper rail
affects: [04-04-resume-wizard-redesign, 04-05-resume-wizard-redesign, 04-06-resume-wizard-redesign]

# Tech tracking
tech-stack:
  added: []
  patterns: [status-based-coloring, real-time-feedback, prompt-pre-fill]

key-files:
  created:
    - src/features/resume-builder/components/helpers/AIPromptCard.tsx
    - src/features/resume-builder/components/helpers/CharacterGuidance.tsx
  modified:
    - src/features/resume-builder/components/layout/WizardHelperRail.tsx
    - src/features/resume-builder/components/modals/AIEnhanceModal.tsx

key-decisions:
  - "AI prompts use restrictions field (custom tab) in AIEnhanceModal for pre-fill"
  - "Character guidance: grey (empty), yellow (under), green (optimal), red (over)"
  - "Summary tracks word count (100-150), Experience tracks bullet count (3-5)"
  - "Progress bar fills to max target with 300ms transition animation"

patterns-established:
  - "Status-based coloring pattern for content quality feedback"
  - "Real-time guidance updates driven by resumeData context"
  - "Purple theme for AI-related actions (matches platform branding)"

# Metrics
duration: 8min
completed: 2026-02-19
---

# Phase 4 Plan 3: Smart Content Guidance Summary

**AI prompt suggestions and character count guidance for Summary, Experience, and Projects steps with one-click modal pre-fill and real-time status feedback**

## Performance

- **Duration:** 8 min
- **Started:** 2026-02-19T17:23:01Z
- **Completed:** 2026-02-19T17:31:29Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Created AIPromptCard component with purple-themed design for AI association
- Created CharacterGuidance component with status-based progress bar (yellow/green/red)
- Integrated both components into WizardHelperRail for relevant steps
- Added initialPrompt prop to AIEnhanceModal for pre-filling prompts
- Real-time character/word/bullet count updates as user types

## Task Commits

Each task was committed atomically:

1. **Task 1: Create AIPromptCard component** - `4754d7a` (feat)
2. **Task 2: Create CharacterGuidance component** - `aea15a1` (feat)
3. **Task 3: Enhance helper rail integration** - `d44492a` (feat)

**Note:** WizardHelperRail changes were included in commit 27ccbc7 from plan 04-04, which built on top of this plan's foundation.

## Files Created/Modified

### Created
- `src/features/resume-builder/components/helpers/AIPromptCard.tsx` - Purple-themed card with Sparkles icon, renders clickable prompt buttons, onApply callback
- `src/features/resume-builder/components/helpers/CharacterGuidance.tsx` - Blue-themed card with FileText icon, status-based coloring, progress bar visualization

### Modified
- `src/features/resume-builder/components/layout/WizardHelperRail.tsx` - Added aiPromptExamples to STEP_HELPER_CONTENT, integrated AIPromptCard and CharacterGuidance, added AI modal state and handlers
- `src/features/resume-builder/components/modals/AIEnhanceModal.tsx` - Added initialPrompt prop, useEffect to pre-fill restrictions field and switch to custom tab

## Decisions Made

1. **AI prompt pre-fill uses restrictions field** - Chosen over quick_preset because restrictions/custom instructions field allows arbitrary text input, whereas quick_preset is enum-based
2. **Character guidance for Summary uses word count** - ATS best practice is 100-150 words for professional summary (3-4 lines)
3. **Character guidance for Experience uses bullet count** - Tracks first role's description bullets (3-5 optimal), split by newline
4. **Progress bar color transitions** - Yellow (under target) encourages adding more, green (optimal) confirms good length, red (over) signals trimming needed
5. **Purple theme for AI components** - Consistent with platform's AI/magic theme (matches Sparkles icon usage elsewhere)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

Helper rail now provides:
- Contextual AI suggestions for content enhancement (Summary, Experience, Projects)
- Real-time length feedback (Summary word count, Experience bullet count)
- One-click workflow from suggestion to AI modal

Ready for:
- Plan 04-04: Section reordering improvements
- Plan 04-05: Template-specific recommendations
- Plan 04-06: Final integration and polish

---
*Phase: 04-resume-wizard-redesign*
*Completed: 2026-02-19*
