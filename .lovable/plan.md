## Plan

1. **Confirm the failure signals**
   - Inspect live runtime errors, console logs, recent Vite/dev-server logs, hydration/HMR messages, and current route state.
   - Run a local browser verification pass after changes across refresh and hot reload, checking that the page never stays blank.

2. **Fix SSR/browser API hazards**
   - Audit all remaining `window`, `document`, `localStorage`, `sessionStorage`, `navigator`, `matchMedia`, `indexedDB`, `lazy()`, and dynamic `import()` usages.
   - Move render-time browser reads into `useEffect`/event handlers or wrap them with safe utilities.
   - Extend the existing safe browser utility with guarded localStorage/sessionStorage JSON parsing, safe setters/removers, safe `matchMedia`, safe reload/origin helpers, and corrupted-state reset.

3. **Harden error boundaries and provider isolation**
   - Keep the root global `<AppErrorBoundary>` but ensure it isolates providers and route content reliably.
   - Add smaller isolation boundaries around risky visual/background/layout areas so one component cannot blank the entire app.
   - Add a robust route-level error UI with retry that invalidates router and query state.

4. **Improve runtime diagnostics and preview auto-recovery**
   - Expand diagnostics to capture `window.onerror`, `unhandledrejection`, Vite HMR failures, early boot failures, and stored diagnostics safely.
   - Show a visible fallback overlay for blank DOM, failed hot reload, or uncaught boot errors.
   - Add automatic recovery actions: clear corrupted runtime diagnostics/storage entries, clear query caches on retry, and provide reload/home controls.

5. **Stabilize React Query and loading/error states**
   - Ensure query defaults avoid infinite retries and failed API calls render error/fallback UI rather than blank content.
   - Verify route/query provider mount order and clear caches during recovery.
   - Check public/admin data hooks for permanent loading or crash-on-error states and add safe fallbacks where needed.

6. **Resolve lockfile/version inconsistency risk**
   - Align lockfiles with `package.json` so the preview/build cannot randomly use stale TanStack versions.
   - Remove or update stale lockfile data that still references older TanStack Start/Router versions, then regenerate the active text lockfile.

7. **Clean caches and verify**
   - Clear Vite/build caches as requested (`node_modules/.vite`, `dist`, relevant cache folders).
   - Rebuild/typecheck through the normal project tooling.
   - Flush HMR and verify the preview survives initial load, refresh, route navigation, failed route/API conditions, and hot reload without a white screen.

## Likely causes already found

- Browser API usage had previously existed in render/module paths; current code still needs a full audit to ensure no SSR/hydration edge remains.
- The app has recovery code, but it can be strengthened so failed boot/HMR and corrupted persisted state always produce a visible fallback.
- There is a stale `package-lock.json` with older TanStack dependency ranges while `bun.lock` and `package.json` point to newer versions; that mismatch can cause inconsistent installs/build behavior and should be corrected.
- Current logs show dependency optimization reloads and no captured browser error, which is consistent with an intermittent HMR/runtime boot failure that needs defensive recovery plus cache/lockfile cleanup.