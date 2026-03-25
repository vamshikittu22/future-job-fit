---
phase: 05-keyword-integration-fix
plan: 02
subsystem: ui

tags: [react, typescript, keyword-integration, ai-enhancement, ux]

requires:
  phase: 05-01
  provides: EnhancementRequest with integration_mode field

provides:
  - keywordIntegration.ts utility module with contextual suggestions
  - JDKeywordHints with expandable keyword integration guidance
  - AIEnhanceModal with Smart/Suggest/Append mode toggle
  - Integration mode validation and UI feedback

affects:
  - Resume wizard UX
  - AI enhancement workflow
  - JD keyword integration guidance

tech-stack:
  added: []
  patterns:
    - "Expandable UI pattern for contextual guidance"
    - "RadioGroup with visual feedback and recommended badge"
    - "Category-based keyword detection and suggestion"

key-files:
  created:
    - src/shared/lib/keywordIntegration.ts
  modified:
    - src/features/resume-builder/components/helpers/JDKeywordHints.tsx
    - src/features/resume-builder/components/modals/AIEnhanceModal.tsx

key-decisions:
  - "Three integration modes: Smart (recommended), Suggest (placement hints), Append (fallback)"
  - "Keyword categorization into skill/tool/concept/soft_skill for contextual suggestions"
  - "Visual warning for Append mode to encourage better UX"
  - "Dropdown expansion pattern for keyword hints to avoid UI clutter"

patterns-established:
  - "Expandable keyword hints: Click to see integration suggestions, examples, and phrases"
  - "Mode selection with RadioGroup: Visual cards with icons, recommended badges, and clear descriptions"

duration: 8min
completed: 2026-03-24
---

# Phase 05 Plan 02: UI Guidance for Contextual Keyword Integration Summary

**Contextual keyword integration UI with Smart/Suggest/Append modes and expandable integration hints**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-24T22:26:14.789Z
- **Completed:** 2026-03-24T22:35:12.451Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Created comprehensive keyword integration utility module with categorization
- Enhanced JDKeywordHints to show contextual integration suggestions on click
- Added integration mode selection (Smart Rewrite/Suggest Placement/Append Keywords) to AIEnhanceModal
- Smart mode marked as recommended with visual badge
- Append mode displays warning alert about readability impact
- Keywords passed to API with selected integration_mode field

## Task Commits

Each task was committed atomically:

1. **Task 1: Create keyword integration utilities module** - `cdf1862` (feat)
2. **Task 2: Enhance JDKeywordHints with contextual integration suggestions** - `e3b7fca` (feat)
3. **Task 3: Add Smart Rewrite vs Append mode toggle to AIEnhanceModal** - `0a70bde` (feat)

**Plan metadata:** `[TBD]` (docs: complete plan)

## Files Created/Modified

- `src/shared/lib/keywordIntegration.ts` - Utility functions for keyword categorization, integration suggestions, and validation
- `src/features/resume-builder/components/helpers/JDKeywordHints.tsx` - Enhanced with expandable keyword hints showing example phrases and sentences
- `src/features/resume-builder/components/modals/AIEnhanceModal.tsx` - Added RadioGroup for Smart/Suggest/Append mode selection

## Decisions Made

- Three integration modes: Smart Rewrite (recommended - AI weaves keywords naturally), Suggest Placement (shows where keywords fit), Append Keywords (adds to end with warning)
- Keyword categorization into skill, tool, concept, and soft_skill for appropriate contextual suggestions
- Visual warning alert when Append mode selected to encourage better UX
- Dropdown expansion pattern for keyword hints to avoid UI clutter while providing rich guidance

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## Next Phase Readiness

- Ready for 05-03: Keyword Integration Workflow Integration
- Integration modes are now selectable in UI and passed to API
- JDKeywordHints provides contextual guidance for manual keyword integration
- All foundation pieces in place for final workflow integration

---
*Phase: 05-keyword-integration-fix*
*Completed: 2026-03-24*
