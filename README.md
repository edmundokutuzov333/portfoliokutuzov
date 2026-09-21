# Edmundo Kutuzov Portfolio

Production portfolio for Edmundo Kutuzov, built as a dynamic full-stack TanStack Start application with SSR, a Supabase-backed content layer, protected server routes, AI capabilities and a private Kutuzov Studio workspace.

## Production stack

- TanStack Start + TanStack Router
- React 19 + TypeScript
- Vite + Nitro
- React Query
- Tailwind CSS + Framer Motion
- Supabase PostgreSQL + Supabase Auth + Row Level Security
- Vercel deployment
- Server-side Gemini/provider integrations
- Server-side Resend email delivery

## Architecture

```text
Visitor
  -> Vercel
  -> TanStack Start SSR
  -> TanStack Router
  -> React UI
  -> React Query
  -> Supabase / server routes
  -> Gemini / Resend / other server providers
```

The browser is never the authority for administrative access. Public content is read through the publishable Supabase client and protected writes use server boundaries plus database RLS. Server-only credentials remain outside `VITE_*` variables.

## Canonical production identity

The canonical origin is:

```text
https://edmundokutuzov.art
```

`https://www.edmundokutuzov.art` permanently redirects to the apex domain. Canonical SEO URLs, Open Graph URLs, sitemap references and production smoke-test defaults use the canonical origin.

The Vercel deployment URL remains an implementation detail and is not used as the SEO identity of the site.

## Security model

Security is layered rather than delegated to one mechanism:

```text
TLS / HTTPS
   +
Vercel edge protections
   +
HSTS
   +
Content Security Policy
   +
X-Frame-Options
   +
X-Content-Type-Options
   +
Referrer-Policy
   +
Permissions-Policy
   +
Origin allowlisting
   +
Rate limits
   +
Request-size limits
   +
Input validation
   +
Supabase Auth
   +
PostgreSQL RLS
   +
Server-only service-role operations
```

The site-wide CSP is defined in `vercel.json`. It is compatible with the current SSR document, Supabase connections, hosted media and YouTube/Vimeo embeds. The current policy intentionally retains `unsafe-inline` for scripts/styles because the current application still has inline SSR code and styles. Removing that exception requires a nonce/hash CSP migration.

The server-only Supabase admin client fails closed when real credentials are missing. No placeholder service-role key is used.

Database backup connections use `PGSSLMODE=verify-full`, so the PostgreSQL endpoint certificate and hostname are validated before export.

## Kutuzov Studio: private build mode

Kutuzov Studio remains in the repository for continued private development.

The public release gate is:

```text
VITE_STUDIO_PUBLIC_ENABLED=false
```

While the flag is false:

- `/studio` shows the public English construction experience.
- Unfinished Studio tools redirect to `/studio`.
- Unfinished Studio APIs return `404 STUDIO_UNAVAILABLE`.
- The implementation remains in source control and is not deleted.

When the Studio is ready for public launch, the release process can enable:

```text
VITE_STUDIO_PUBLIC_ENABLED=true
```

only after the complete browser, performance and functional release gates pass.

## Studio construction experience

The public construction page is intentionally treated as a product surface rather than a blank maintenance screen.

UI:
- custom cyan network/portal signal built from React, SVG, CSS 3D and Framer Motion;
- pointer-reactive perspective rotation;
- animated nodes, network traces, particles, scanning line and orbital layers;
- responsive composition;
- reduced-motion support.

UX:
- immediate explanation that the Studio is under construction;
- clear hierarchy between status, message and next action;
- primary escape route to the portfolio;
- secondary return-home route.

CX:
- the visitor is not blocked by unfinished product work;
- the existing portfolio remains one click away;
- the experience communicates an active build rather than a dead end.

Service design:
- unfinished product capabilities remain available to the development team in source control;
- public routes are feature-gated separately from private implementation;
- server APIs are gated as well, so hiding the interface does not leave unfinished backend entry points exposed.

## Three-phase hardening programme

### Phase 1: Canonical + Security

Completed implementation includes:

- canonical domain migration to `edmundokutuzov.art`;
- permanent `www` to apex redirect;
- SEO, Open Graph, sitemap and robots alignment;
- removal of the server-role placeholder fallback;
- fail-closed Supabase server credentials;
- PostgreSQL backup TLS hardening with `verify-full`;
- site-wide CSP;
- preserved browser security headers.

### Phase 2: Private Studio + Interface

Completed implementation includes:

- construction-first public Studio landing;
- private feature flag;
- private route gating;
- private API gating;
- custom interactive 3D construction signal;
- English public copy;
- direct portfolio CTA;
- existing Studio code retained for continued development.

### Phase 3: Verification + Release Control

Completed implementation includes:

- regression contracts for canonical identity and security hardening;
- regression contracts for Studio privacy and public construction UX;
- browser QA for desktop and mobile journeys;
- documentation of architecture, security and deployment boundaries;
- Vercel preview deployment validation.

## Verification

Primary local verification sequence:

```bash
npm ci
npm test
npm run diagnose
npm run typecheck
npm run lint
npm run build
npx playwright test
```

The GitHub CI pipeline executes the regression suite. Browser QA covers Chromium, Edge, Firefox, WebKit, iPhone Safari and Android Chrome. Performance gates run Lighthouse against desktop and mobile configurations.

## Repository structure

```text
src/
  components/
    admin/
    home/
    layout/
    portfolio/
    studio/
    ui/
  config/
  hooks/
  integrations/
    supabase/
  lib/
    ai/
    studio/
  routes/

supabase/
  migrations/

tests/
  browser/

scripts/
.github/
```

## Operational notes

The canonical website and the database have separate recovery boundaries. A Vercel rollback does not roll back PostgreSQL data.

Production backups target the documented recovery objectives, while the migration history under `supabase/migrations/` remains the database schema source of truth.

## Release rule

Do not merge unfinished Studio functionality into the public experience.

The source code may continue evolving in private, but the public contract stays:

```text
Portfolio -> fully public
Kutuzov Studio -> construction experience until release-ready
```
