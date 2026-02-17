---
phase: 01-ats-simulation
plan: 04
subsystem: ats-simulation
tags: [ats, platform-simulators, workday, taleo, greenhouse, lever]

# Dependency graph
requires:
  - phase: 01-ats-simulation
    provides: Type system foundation (01-01), Section extraction engine (01-02), DOM layout detector (01-03)
provides:
  - Workday simulator with strict headers and 40% table penalty
  - Lever simulator with semantic matching and 15% table penalty
  - Greenhouse simulator with clean layout bonus and 20% table penalty
  - Taleo simulator with 50% column penalty and legacy regex
  - Platform comparison function for multi-platform analysis
affects: [01-05, 01-06]

# Tech tracking
added: [platform simulators, comparePlatforms function]
patterns: [platform-quirks pattern, quality penalty/bonus system]

key-files:
  created:
    - src/features/ats-simulation/platforms/lever.ts
    - src/features/ats-simulation/platforms/greenhouse.ts
    - src/features/ats-simulation/platforms/taleo.ts
  modified:
    - src/features/ats-simulation/platforms/index.ts

key-decisions:
  - "Lever uses semantic header detection for flexible matching"
  - "Greenhouse rewards clean layouts with 10% bonus"
  - "Taleo has highest column penalty (50%) due to legacy parsing"

patterns-established:
  - "Platform quirks configuration for ATS-specific behavior"
  - "Quality penalty/bonus system for layout analysis"
  - "Data loss warnings for date format issues"

# Metrics
duration: 11min
completed: 2026-02-17
---

# Phase 1 Plan 4: Platform Simulators Summary

**Platform-specific ATS simulators for Workday, Lever, Greenhouse, and Taleo with unique parsing quirks**

## Performance

- **Duration:** 11 min
- **Started:** 2026-02-17T05:00:22Z
- **Completed:** 2026-02-17T05:11:30Z
- **Tasks:** 3 (Workday pre-existing, Lever+Greenhouse created, Taleo+Index created)
- **Files modified:** 4

## Accomplishments
- Implemented Lever ATS simulator with semantic header matching (15% table penalty)
- Implemented Greenhouse ATS simulator with clean layout bonus (10% bonus, 20% table penalty)
- Implemented Taleo ATS simulator with highest column sensitivity (50% column penalty, 35% table penalty)
- Created comparePlatforms() function for multi-platform score comparison
- All simulators use shared section extractor with platform-specific options

## Task Commits

Each task was committed atomically:

1. **Task 1: Workday simulator** - Pre-existing in codebase (feat(01-01))
2. **Task 2: Lever and Greenhouse simulators** - `1b8f994` (feat)
3. **Task 3: Taleo simulator and platform index** - `1b8f994` (feat)

**Plan metadata:** `1b8f994` (feat: complete plan)

## Files Created/Modified
- `src/features/ats-simulation/platforms/lever.ts` - Lever ATS simulator
- `src/features/ats-simulation/platforms/greenhouse.ts` - Greenhouse ATS simulator
- `src/features/ats-simulation/platforms/taleo.ts` - Taleo ATS simulator
- `src/features/ats-simulation/platforms/index.ts` - Updated with exports and comparePlatforms

## Decisions Made
- Lever: Semantic header detection for flexible matching
- Greenhouse: Clean layout bonus (10%) for table-free, column-free resumes
- Taleo: Highest column penalty (50%) due to legacy parsing limitations
- All platforms: Different penalties based on research findings

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Platform simulators ready for UI components (Plan 01-05)
- comparePlatforms() function available for platform comparison UI
- All four major ATS platforms now have specific simulation logic

---
*Phase: 01-ats-simulation*
*Completed: 2026-02-17*
