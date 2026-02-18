---
phase: 02-match-intelligence
plan: 04
subsystem: match-intelligence
tags: [heatmap, f-pattern, eye-tracking, visualization]
dependency_graph:
  requires:
    - 02-01 (Match Intelligence Types)
  provides:
    - useRecruiterHeatmap hook
    - RecruiterHeatmap component
  affects:
    - Resume preview integration
tech_stack:
  added:
    - F-pattern heatmap generation
    - SVG overlay visualization
    - Zone-based attention time calculation
  patterns:
    - Attention-weighted zone coloring (red/orange/yellow/green)
    - Generic fallback when no section positions available
key_files:
  created:
    - src/features/match-intelligence/utils/heatmapGenerator.ts
    - src/features/match-intelligence/hooks/useRecruiterHeatmap.ts
    - src/features/match-intelligence/components/RecruiterHeatmap.tsx
  modified:
    - src/features/match-intelligence/types/types.ts
    - src/features/match-intelligence/utils/index.ts
    - src/features/match-intelligence/hooks/index.ts
    - src/features/match-intelligence/components/index.ts
decisions:
  - Used eye-tracking research (Wonsulting/JobEase) for attention weights
  - 89% first fixation on top-left zone
  - <10 seconds total scanning time
  - Color-coded zones: red (high), orange (medium), yellow (low), green (minimal)
metrics:
  duration: ~4 minutes
  completed: 2026-02-18
  tasks: 3
  files: 7
---

# Phase 2 Plan 4: Recruiter Heatmap Summary

## Objective

Build recruiter scanning heatmap with F-pattern simulation based on eye-tracking research. Show users where recruiters focus attention when scanning resumes.

## What Was Built

### 1. F-Pattern Heatmap Generator (`heatmapGenerator.ts`)
- `generateHeatmapZones()` - creates zones based on actual section positions
- `generateGenericHeatmap()` - fallback F-pattern template
- `calculateTotalAttention()` - sums attention times
- F_PATTERN_ZONES constant with attention weights
- Color calculation based on attention intensity

### 2. useRecruiterHeatmap Hook (`useRecruiterHeatmap.ts`)
- Accepts optional section positions from resume DOM
- Falls back to generic F-pattern template
- Returns zones array and total attention time

### 3. RecruiterHeatmap Component (`RecruiterHeatmap.tsx`)
- Toggle button to show/hide heatmap
- SVG overlay on resume preview area
- Color-coded zones (red/orange/yellow/green)
- Attention time labels per zone
- Research insight about F-pattern behavior (89% first fixation)
- Legend showing attention levels

## Research Basis

Based on eye-tracking studies:
- 89% of recruiters' first fixation is on top-left (name & title)
- Total scanning time: <10 seconds
- F-pattern: horizontal top scan, vertical left scan, content area

### Attention Weights
| Zone | Weight | Time |
|------|--------|------|
| Header (top line) | 1.0 | 2.0s |
| Left margin | 0.85 | varies |
| Content area | 0.5 | varies |
| Right edge | 0.2 | minimal |

## Success Criteria Status

- [x] F-pattern zones generated with correct attention weights
- [x] Heatmap displays as overlay on resume preview area
- [x] Color coding reflects attention intensity
- [x] Toggle to show/hide heatmap
- [x] Attention time per zone displayed
- [x] Research insight included

## Deviations from Plan

None - plan executed exactly as written.

## Integration Points

The component accepts optional `sectionPositions` prop to use actual resume DOM positions:
```typescript
<RecruiterHeatmap 
  sectionPositions={[
    { id: 'header', type: 'header', top: 0, left: 0, height: 8, width: 100 },
    // ... more sections
  ]}
/>
```

When not provided, uses generic F-pattern template as fallback.

## Self-Check: PASSED

All files verified:
- src/features/match-intelligence/utils/heatmapGenerator.ts - FOUND
- src/features/match-intelligence/hooks/useRecruiterHeatmap.ts - FOUND
- src/features/match-intelligence/components/RecruiterHeatmap.tsx - FOUND
- Commit 7fc27e5 - FOUND
