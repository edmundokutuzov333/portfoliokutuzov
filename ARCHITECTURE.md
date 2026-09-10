# Architecture

## Runtime contract

This application is a dynamic TanStack Start application deployed to Vercel with SSR and server functions.

```text
Request
  -> TanStack Start server
  -> route tree
  -> root document
  -> src/client.tsx / StartClient hydration
```

The application must never introduce a second SPA bootstrap or a parallel routing system.

## Technical discovery

| Area | Production choice |
| --- | --- |
| Application | TanStack Start + TanStack Router |
| UI | React 19 + TypeScript |
| Runtime | Node 24 |
| Build/server | Vite + Nitro |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth + RLS + `is_admin()` |
| Storage | Supabase data layer; Studio design payloads are persisted as database JSON/text fields and local draft fallback |
| Deployment | Vercel |
| AI | Server-side Google Gemini / provider adapters |
| Email | Resend API, server-side only |
| Observability | Studio telemetry in `public.studio_events`, Vercel runtime logs, CI and browser QA |
| Migrations | Versioned SQL under `supabase/migrations/` |

There is no Prisma or Drizzle layer. The database boundary is Supabase PostgreSQL accessed through `@supabase/supabase-js` and protected server routes.

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

Server-only configuration belongs in `src/config/server.ts` or server-only modules. Secrets such as Gemini, service-role and Resend credentials must never use `VITE_` variables.

AI, background generation, Studio persistence, email delivery and admin analytics execute behind server routes with bounded requests and rate limits.

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
  studio
  ui
```

The admin route is intentionally thin and delegates its Control Room implementation to `src/components/admin/AdminControlRoom.tsx`.

Framer Motion is part of the visual language. `prefers-reduced-motion` must remain respected.

## Studio editor architecture

The card editor uses a structured `StudioDesignDocument` as the single source of truth. Canvas interactions update the document directly during pointer capture and create one bounded history entry when the interaction completes. Discrete edits use immutable document replacement, undo/redo stacks are bounded, and a new commit clears the redo stack.

The browser editor uses pointer events rather than separate mouse/touch implementations, so touch and pen input share the same interaction path. Keyboard movement is disabled while a form control is being edited to preserve normal text-field cursor behaviour.

SVG is generated from the same structured document for SVG, PNG and PDF exports. Uploaded SVG assets are sanitized before entering the document model.

## Email architecture

Resend is the delivery provider. The server route validates the recipient, body size, attachment MIME types and encoded attachment size before creating the provider request. Credentials remain server-only.

Operational deliverability requires SPF, DKIM and DMARC for the sender domain, provider-level bounce/complaint monitoring and retry handling. The repository can enforce the application-side contract, but DNS authentication and provider-account controls are external deployment configuration.

## Printing architecture

The normal PDF export is an on-screen PDF representation of the 90 × 50 mm card. A separate **Print PDF** export is provided for production work: it renders at 300 DPI, adds 3 mm bleed and crop marks, and includes the trim/bleed area in the PDF page size.

The current print pipeline is rasterized. Therefore it does not claim native CMYK, PDF/X certification or embedded/subset PDF fonts. Those are print-house prepress requirements and require a dedicated vector/PDF prepress pipeline rather than a browser canvas raster export.

## Database lifecycle, backups and disaster recovery

Production Studio records are durable business data. The migration chain under `supabase/migrations/` is the schema source of truth, while live rows remain owned by Supabase PostgreSQL.

Backups are not substituted by Git history. The operational policy is documented in `docs/DATA_RECOVERY.md` and targets an RPO of 24 hours and an RTO of 4 hours, with provider-managed backup/PITR where available, independent encrypted exports and scheduled restore drills.

A Vercel rollback cannot restore PostgreSQL. Database recovery and application recovery are separate exercises.

## Deployment boundary

Vercel detects `tanstack-start`. Nitro generates the SSR function and static assets. Do not add a custom output directory and do not convert this application to a static export.

Node 24 is the supported runtime and is declared consistently in `package.json`, `.nvmrc` and the deployment configuration contract.

## CI/CD and verification gates

Every pull request targeting `main` is expected to pass the regression and browser gates before merge. The regression suite covers the accumulated phase contracts A–H; the Playwright suite covers Studio surfaces across Chromium, Edge, Firefox and WebKit plus mobile browser emulation where configured.

The baseline verification sequence is:

```bash
npm ci
npm test
npm run diagnose
npm run typecheck
npm run lint
npm run build
npx playwright test
```

Phase coverage is enforced by `tests/phase-coverage.test.mjs`, so a future refactor cannot silently delete a phase regression contract.

## Source of truth

The following rules are non-negotiable:

1. TanStack Start owns application bootstrap and routing.
2. Supabase owns production CMS and Studio data.
3. Supabase Auth plus RLS owns admin authorization.
4. Server routes own secrets and expensive provider operations.
5. Vercel owns deployment execution.
6. Versioned migrations own the database schema history.
7. Backups and restore drills are operational controls, not Git features.
8. The visual identity and existing real CMS media must not be replaced with synthetic placeholders during maintenance.
