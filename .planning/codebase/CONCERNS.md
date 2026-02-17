# Areas of Concern

## Technical Debt
- **Type Safety**: `tsconfig.json` has `noImplicitAny: false`, `strictNullChecks: false`.
- **Linting**: 68+ lint errors (many `no-explicit-any`).
- **Duplicate Dependencies**: 
  - `html2pdf.js` vs `html2canvas`+`jspdf`.
  - `@dnd-kit` vs `@hello-pangea/dnd`.
- **Legacy Code**: `/api/resume.js` (removed but references might remain).
- **UI Inconsistency**: Hardcoded colors in `NotFoundPage` vs Theme tokens.

## Performance
- **Bundle Size**: Warnings about chunks > 500kB.
- **Re-renders**: Resume Context is large; optimization needed to prevent whole-app re-renders on small keystrokes (currently using `debounce`).
- **Pyodide Loading**: Initial load of Python runtime for offline ATS might be heavy.

## Security
- **API Keys**: Previously exposed client-side (fixed), now server-side.
- **Data Persistence**: LocalStorage usage limits data size (5MB cap typically) - Resume snapshots might fill it up.

## Pending Implementation
- **Phase 4 (ATS Engine)**: Dashboard & Inline Editing integration is incomplete (checked items in `PLAN_ATS_ENGINE.md` show Phase 0-3 done).
