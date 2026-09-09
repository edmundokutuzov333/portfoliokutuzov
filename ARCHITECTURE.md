# Architecture

## Runtime contract

This application is a dynamic TanStack Start application deployed to Vercel with SSR and server functions.

```text
Request
  -> TanStack Start server
  -> route tree
  -> root document
  -> SSR HTML
  -> src/client.tsx / StartClient hydration
```

The application must never introduce a second SPA bootstrap or a parallel routing system.

## Public data flow

```text
Supabase
  -> React Query hooks
  -> normalized domain data
  -> UI components
```

Public Supabase configuration is centralized in `src/config/public.ts`. The Supabase client consumes that configuration from one location.

Published projects and clients are read dynamically. Resilient fallbacks exist in `src/hooks/useSiteData.ts` for transient data failures.

## Server boundaries

Server-only configuration belongs in `src/config/server.ts` or server-only modules. Secrets such as Gemini, service-role and email provider credentials must never use `VITE_` variables.

The AI API is exposed through `/api/chat` and enforces origin policy, request limits and rate limiting before executing model operations.

## Authentication boundary

The public site does not require authentication. The Control Room uses Supabase Auth. Administrator access is granted only when the authenticated user is present in `admin_users` and the database policies allow the operation.

Local storage is not an authentication authority.

## UI architecture

```text
routes/
  page route
    -> page sections
      -> reusable UI primitives

components/
  layout
  home
  portfolio
  services
  admin
  ui
```

The admin route is intentionally thin and delegates its Control Room implementation to `src/components/admin/AdminControlRoom.tsx`.

Framer Motion is part of the visual language. `prefers-reduced-motion` must remain respected.

## Deployment boundary

Vercel detects `tanstack-start`. Nitro generates the SSR function and static assets. Do not add a custom output directory and do not convert this application to a static export.

Node 24 is the supported runtime and is declared consistently in `package.json`, `.nvmrc` and the deployment configuration contract.

## Verification boundary

The minimum verification sequence is:

```bash
npm ci
npm test
npm run diagnose
npm run typecheck
npm run lint
npm run build
```

`tests/phase1-hardening.test.mjs` protects critical architecture/security assumptions. `scripts/diagnose-build.mjs` validates the production structure and reports stale architecture.

## Source of truth

The following rules are non-negotiable:

1. TanStack Start owns application bootstrap and routing.
2. Supabase owns production CMS data.
3. Supabase Auth plus RLS owns admin authorization.
4. Server routes own secrets and expensive AI operations.
5. Vercel owns deployment execution.
6. The visual identity and existing real CMS media must not be replaced with synthetic placeholders during maintenance.
