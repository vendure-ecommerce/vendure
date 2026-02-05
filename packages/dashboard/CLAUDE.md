# Dashboard Package Development Guide

## React Context Pattern for Extension Compatibility

### The Problem

When dashboard extensions dynamically import hooks from `@vendure/dashboard`, Vite can create duplicate module instances. If a React Context is defined in the same file as a hook that consumes it, the extension's hook will reference a different Context object than the one used by the main app's Provider - causing "must be used within a Provider" errors even when the component IS inside the provider.

### The Solution

**Never define a React Context and its consuming hook in the same file within `src/lib/`.**

Split them into separate files:

1. **Context file** - Contains `createContext()` and the Provider component
2. **Hook file** - In `src/lib/hooks/`, imports context via `@/vdb/` path

### Example

```tsx
// ❌ BAD: Context and hook in same file (src/lib/components/my-context.tsx)
export const MyContext = createContext<MyContextValue | undefined>(undefined);

export function MyProvider({ children }) {
    return <MyContext.Provider value={...}>{children}</MyContext.Provider>;
}

export function useMyContext() {
    const context = useContext(MyContext);  // Same file = module identity issues
    if (!context) throw new Error('...');
    return context;
}
```

```tsx
// ✅ GOOD: Context in one file, hook in separate file

// src/lib/components/my-context.tsx
export const MyContext = createContext<MyContextValue | undefined>(undefined);

export function MyProvider({ children }) {
    return <MyContext.Provider value={...}>{children}</MyContext.Provider>;
}

// src/lib/hooks/use-my-context.ts
import { MyContext } from '@/vdb/components/my-context.js';

export function useMyContext() {
    const context = useContext(MyContext);
    if (!context) throw new Error('...');
    return context;
}
```

### Why This Works

Both the main app and dynamically-imported extension code resolve the context import to the same module instance when using internal `@/vdb/` paths, preserving React Context identity.

### Automated Enforcement

This pattern is enforced by `scripts/check-lib-imports.js`, which runs on pre-commit. It will fail if any file in `src/lib/` contains both `createContext(` and `useContext(`.

**Allowlist:** Some shadcn UI primitives (carousel, chart, form, toggle-group) are allowlisted because their contexts are internal implementation details not accessed by extensions.

### Hooks Directory Rules

All hooks in `src/lib/hooks/` must:
- Import using `@/vdb/` prefix (not relative `../` paths)
- Never import from `@/vdb/index.js` directly

These rules are also enforced by the same lint script.

## Internationalization (i18n)

See `scripts/translate/README.md` for full documentation.

```bash
# Extract new strings and update .po files
npm run i18n:extract --workspace=@vendure/dashboard

# Apply LLM-translated strings
npm run i18n:apply --workspace=@vendure/dashboard
```

For locale-aware date/currency formatting, use `useLocalFormat()` hook instead of `date-fns` formatting functions.
