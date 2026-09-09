# Edmundo Kutuzov Portfolio

Dynamic production portfolio for Edmundo Kutuzov. The application uses TanStack Start with SSR, TanStack Router, React, React Query, Supabase, Framer Motion and server-side AI capabilities.

Phase 1 establishes the production baseline for runtime consistency, SSR entrypoints, admin authorization, API hardening, security headers, regression checks, CI validation and deployment documentation.

Phase 2 establishes the premium product baseline for performance, deferred heavy UI, deterministic portfolio motion, responsive image behavior, accessibility primitives, technical SEO, route timing instrumentation and Lighthouse regression gates.

## Architecture

```text
Browser
  -> TanStack Start SSR
  -> TanStack Router
  -> React UI + Framer Motion
  -> React Query + Supabase
  -> Server routes / AI services
```