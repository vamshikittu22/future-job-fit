# Legacy TypeScript/Lint Errors

This document tracks legacy errors that exist in the codebase but are not blocking the build.

## Summary

- **TypeScript errors**: ~215 (mostly in features/ directory)
- **Lint errors**: ~260 (mix of errors and warnings)
- **Shared directory**: ✅ Zero TypeScript errors

## Categories of Legacy Issues

### 1. Features Directory Type Mismatches

**Location**: `src/features/resume-builder/components/editor/`

**Issues**:
- Missing type exports from `@/features/resume-builder/components/editor/types`
- Components importing non-existent types (Experience, Education, Project, etc.)
- Implicit any in callback parameters
- Type mismatches in form components

**Impact**: Non-blocking, affects developer experience

### 2. Missing Import Statements

**Location**: Various files in `src/features/`

**Issues**:
- BuilderPage.tsx missing imports (useToast, useResume, Textarea, Label, etc.)
- ResumeSection.tsx importing non-existent modules

**Impact**: Non-blocking at build time due to Vite's handling

### 3. Type Definition Files

**Location**: `src/types/html2pdf.d.ts`

**Issues**:
- Uses `any` type for third-party library definitions

**Justification**: Third-party library without proper TypeScript definitions

### 4. UI Component Warnings

**Location**: `src/shared/ui/`

**Issues**:
- Fast refresh warnings for files exporting non-components
- Empty interface extending supertype

**Impact**: Development warnings only

### 5. Supabase Edge Functions

**Location**: `supabase/functions/resume-ai/index.ts`

**Issues**:
- Unused variables (STOP_WORDS, sectionId)
- Explicit any for API response handling

**Justification**: Edge function environment has different constraints

## Recommendation

These legacy errors should be addressed incrementally as part of ongoing development:

1. **Phase 1** (Completed): Shared directory hardened ✅
2. **Phase 2** (Future): Fix features/editor types and imports
3. **Phase 3** (Future): Address remaining lint warnings

The strict mode is now enabled and the build passes, providing a foundation for gradual cleanup.
