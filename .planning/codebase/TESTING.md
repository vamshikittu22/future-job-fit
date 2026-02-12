# Testing Strategy

## Frameworks
- **Unit Testing**: Vitest (configured in `vitest.config.ts`).
- **Environment**: jsdom for component testing.
- **Python Testing**: `test_nlp_core.py` (assumed standard Python `unittest` or similar).

## Coverage & Scope
- **Current Focus**: 
  - Shared logic (`use-ats.ts`).
  - Python NLP core (`nlp_core.py`).
- **Missing**:
  - Full E2E tests (Playwright/Cypress not evident).
  - Component visual regression tests.

## Test conventions
- **Location**: Co-located `__tests__` or adjacent `.test.ts` files? (Structure implies separate `src/test` or co-location). *(Note: `src/test` exists, likely for setup).*
- **Command**: `npm run test` or `vitest run`.

## Key Test Suites
- **ATS Logic**: Ensures keyword matching and scoring is deterministic.
- **Resume Context**: Verifies state updates and undo/redo logic.
