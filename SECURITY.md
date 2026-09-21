# Security Policy

## Current architecture

The application is a dynamic TanStack Start project with SSR, server routes, Supabase Auth, Supabase RLS and server-side AI operations. Public Studio functionality is feature-gated and remains disabled until launch.

## Authentication

The public site is unauthenticated. The Control Room uses Supabase Auth and checks membership in the `admin_users` table through RLS-backed authorization.

There is no supported production mock-admin flow and no local-storage flag is accepted as proof of administrator access.

## Database security

Publicly visible content is readable by the anonymous publishable key. Administrative tables and write operations remain protected by Supabase Row Level Security.

Automated RLS regression tests live in `tests/rls.test.ts`.

## API security

Sensitive server routes use origin allowlisting, request-size validation, input validation and bounded in-memory rate limits. Studio generation, publishing, email and public-card APIs are additionally disabled while `VITE_STUDIO_PUBLIC_ENABLED=false`.

The current hardening layer adds a site-wide Content Security Policy through `vercel.json`. The policy blocks object embedding, restricts frames, limits network connections and permits only the external origins required by the current application.

## AI API security

`/api/chat` is a same-site/server API for text, opening messages, TTS and voice streaming. It applies:

- origin allowlisting;
- request-size limits;
- message and audio count limits;
- per-instance request rate limiting;
- non-cacheable responses for dynamic data.

Server AI credentials are never read from `VITE_*` browser variables.

## Deployment security

Vercel applies response security headers from `vercel.json` including:

- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`
- `Permissions-Policy`

The canonical production origin is `https://edmundokutuzov.art`. The `www` hostname redirects permanently to the apex hostname.

## Secrets

Never commit `.env` files or server credentials. Use Vercel environment variables for server secrets. Public browser configuration may use `VITE_*` variables, but service-role credentials must never use that prefix.

The server-side Supabase client fails closed when `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is missing. No placeholder service-role credential is present in the production client.

## Studio release gate

`VITE_STUDIO_PUBLIC_ENABLED=false` keeps unfinished Studio routes and server APIs unavailable in production while development continues privately. Enable it only after the Studio release gate and browser QA pass.

## Reporting

For a security issue, provide a reproducible description, affected route or component, impact and any relevant logs without including live secrets.
