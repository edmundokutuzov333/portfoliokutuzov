# Security Policy

## Current architecture

The application is a dynamic TanStack Start project with SSR, server routes, Supabase Auth, Supabase RLS and server-side AI operations. Older documentation describing a static-only SPA is obsolete.

## Authentication

The public site is unauthenticated. The Control Room uses Supabase Auth and checks membership in the `admin_users` table through RLS-backed authorization.

There is no supported production mock-admin flow and no local-storage flag is accepted as proof of administrator access.

## Database security

Publicly visible content is readable by the anonymous publishable key. Administrative tables and write operations remain protected by Supabase Row Level Security.

Automated RLS regression tests live in `tests/rls.test.ts`.

## AI API security

`/api/chat` is a same-site/server API for text, opening messages, TTS and voice streaming. It applies:

- origin allowlisting;
- request-size limits;
- message and audio count limits;
- per-instance request rate limiting;
- non-cacheable responses for dynamic data.

Server AI credentials are never read from `VITE_*` browser variables.

## Deployment security

Vercel applies baseline response security headers from `vercel.json` including:

- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`

## Secrets

Never commit `.env` files or server credentials. Use Vercel environment variables for server secrets. Public browser configuration may use `VITE_*` variables, but service-role credentials must never use that prefix.

## Reporting

For a security issue, provide a reproducible description, affected route or component, impact and any relevant logs without including live secrets.
