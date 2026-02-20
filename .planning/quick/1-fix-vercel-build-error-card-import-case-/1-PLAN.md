---
phase: quick-fix
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - src/features/match-intelligence/components/SemanticScoreCard.tsx
autonomous: true

must_haves:
  truths:
    - "Vercel build completes successfully without ENOENT errors"
    - "All Card imports use consistent lowercase path"
  artifacts:
    - path: "src/features/match-intelligence/components/SemanticScoreCard.tsx"
      provides: "Corrected Card import path"
      contains: "@/shared/ui/card"
  key_links:
    - from: "src/features/match-intelligence/components/SemanticScoreCard.tsx"
      to: "src/shared/ui/card.tsx"
      via: "import statement"
      pattern: "import.*Card.*from.*@/shared/ui/card"
---

<objective>
Fix Vercel build error caused by case-sensitive import path in SemanticScoreCard.tsx

**Purpose:** Linux-based Vercel build environment treats file paths as case-sensitive, failing when importing from uppercase `Card` while the actual file is lowercase `card.tsx`.

**Output:** Build passes with consistent lowercase import path matching all other 67 Card imports in codebase.
</objective>

<execution_context>
@C:/Users/kittu/.config/opencode/get-shit-done/workflows/execute-plan.md
@C:/Users/kittu/.config/opencode/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md

@src/features/match-intelligence/components/SemanticScoreCard.tsx
@src/shared/ui/card.tsx
</context>

<tasks>

<task type="auto">
  <name>Fix Card import case sensitivity</name>
  <files>src/features/match-intelligence/components/SemanticScoreCard.tsx</files>
  <action>
    Change line 9 import from:
    ```typescript
    import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
    ```
    
    To:
    ```typescript
    import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
    ```
    
    This aligns with all other 67 Card imports in the codebase which correctly use lowercase `card`.
    
    **Why:** Windows filesystem is case-insensitive (works locally), but Vercel's Linux build environment is case-sensitive (fails). The actual file is `src/shared/ui/card.tsx` (lowercase).
  </action>
  <verify>
    Run local build to ensure no import errors:
    ```bash
    npm run build
    ```
    
    Verify import matches pattern used elsewhere:
    ```bash
    grep "from '@/shared/ui/card'" src/features/match-intelligence/components/SemanticScoreCard.tsx
    ```
  </verify>
  <done>
    - SemanticScoreCard.tsx imports from lowercase `@/shared/ui/card`
    - Local build completes without errors
    - Import path matches 67 other Card imports in codebase
  </done>
</task>

</tasks>

<verification>
1. **Local build passes:**
   ```bash
   npm run build
   ```
   Expected: No ENOENT errors, build succeeds

2. **Import consistency verified:**
   ```bash
   grep -r "from '@/shared/ui/Card'" src/
   ```
   Expected: No results (no uppercase Card imports remain)

3. **File exists check:**
   ```bash
   ls src/shared/ui/card.tsx
   ```
   Expected: File found (confirming lowercase is correct)
</verification>

<success_criteria>
- [x] SemanticScoreCard.tsx line 9 uses lowercase `card` in import path
- [x] `npm run build` completes successfully
- [x] No uppercase `Card` imports remain in codebase
- [x] Import pattern matches all other 67 Card imports
- [x] Vercel build will succeed on case-sensitive filesystem
</success_criteria>

<output>
After completion, create `.planning/quick/1-fix-vercel-build-error-card-import-case-/1-SUMMARY.md`
</output>
