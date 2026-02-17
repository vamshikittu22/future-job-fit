# Coding Conventions

## Code Style
- **Linter**: ESLint (currently configured in `eslint.config.js`).
- **Formatting**: Prettier (implied usage).
- **Structure**: Components use functional approach with Hooks.
- **Prop Drilling**: Avoided via Context (`ResumeContext`) for global resume state.
- **Composition**: Shadcn/UI pattern (Headless primitives + Tailwind styling in component file).

## Naming Conventions
- **Files**: PascalCase for Components (`ResumePreview.tsx`), camelCase for hooks/utils (`useResume.ts`).
- **Directories**: kebab-case (`resume-builder`, `job-optimizer`).
- **Types**: PascalCase (`ResumeData`, `Experience`).
- **Constants**: UPPER_SNAKE_CASE (`HISTORY_LIMIT`).

## Architecture Patterns
- **Feature Sliced Design (Lite)**: 
  - `features/` isolates domain logic.
  - `shared/` holds cross-cutting concerns.
- **Data Access**:
  - API calls encapsulated in `src/shared/api`.
  - Edge Functions handled via Supabase client.
- **State Management**:
  - Form state via `react-hook-form` locally, synced to global context on valid submit/change.
  - "Save" is implicit (auto-save) + explicit (snapshot).

## Documentation
- `ARCHITECTURE.md`: Keeps high-level track of system status.
- `PLAN_ATS_ENGINE.md`: Tracks specific feature refactor milestones.
