# System Patterns & Coding Guidelines
Naming: Components are PascalCase (`Component.tsx`), hooks are camelCase (`useHook.ts`), and utility files are kebab-case (`file-utils.ts`).
Error Handling: Use `try-catch` blocks for async operations and API calls. Zod is used for runtime type validation.
Architecture: The project follows a component-based architecture. Reusable UI components are in `src/components/ui`, and feature-specific components are likely organized by feature. Custom hooks are used for state management and side effects.
Testing: No testing framework is explicitly configured, but Vitest or React Testing Library would be a standard choice for this stack.
Performance: TanStack Query is used for caching API responses. Code splitting should be handled automatically by Vite.
Security: API keys and other secrets are managed via environment variables (`.env.local`) and should not be committed to version control.