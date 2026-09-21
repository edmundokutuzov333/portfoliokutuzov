# Edmundo Kutuzov Portfolio

Production portfolio for Edmundo Kutuzov. The application uses TanStack Start with SSR, TanStack Router, React, React Query, Supabase and Framer Motion.

## Production architecture

```text
Browser
  -> TanStack Start SSR
  -> TanStack Router
  -> React UI + Framer Motion
  -> React Query
  -> Supabase / server routes
```

The public portfolio remains the source of truth for the visible creative work. The Selected Portfolio Reel and Selected Clients experience consume the same production data path and must not be replaced with invented demo content.

## Canonical domain and SEO

The official canonical origin is:

`https://edmundokutuzov.art`

All SEO canonical URLs, Open Graph URLs, structured data, sitemap URLs and production smoke-test defaults use the apex domain.

Requests to `www.edmundokutuzov.art` are redirected permanently to the apex domain.

The production Supabase and Vercel deployments may still expose technical preview aliases, but those aliases are not the canonical public origin.

## Security baseline

The public application uses security headers including:

- Content Security Policy
- HSTS
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

The CSP is intentionally compatible with the current application architecture. Inline script and style execution remain allowed because TanStack Start SSR currently emits inline bootstrap/runtime markup and the application contains inline component styles. External origins are explicitly limited to the runtime dependencies actually used by the site, including Google Fonts, Supabase, Google Gemini, YouTube and Vimeo media surfaces.

Server-side Supabase service-role access fails closed when `SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` is absent. No placeholder service-role credentials are permitted.

The automated Supabase backup workflow uses `PGSSLMODE=verify-full`.

## Kutuzov Studio

Kutuzov Studio is an active private build surface.

The public route `/studio` intentionally remains visible as a construction experience. It explains that the Studio is under construction and directs visitors to the live portfolio.

Production default:

`VITE_STUDIO_PUBLIC_ENABLED=false`

When this flag is disabled, unfinished Studio workspaces and their APIs are not publicly usable. The source remains in the repository so development can continue privately.

Private surfaces currently gated include:

- `/studio/business-card`
- `/studio/background`
- `/studio/identity`
- `/card/:token`
- Studio card, publish, background, creative, email, admin, vCard and public-card APIs

The public construction page uses a custom SVG/Framer Motion signal inspired by the supplied construction icon. It is rendered from code, uses deterministic geometry for SSR consistency, supports pointer-reactive 3D perspective, continuous motion, glowing network particles, a scanning line and reduced-motion behavior.

## UI, UX, CX and Service Design

UI: the construction surface uses the existing dark visual language, restrained typography, cyan signal lighting and the site's existing navigation system.

UX: the visitor receives an immediate status signal, a clear explanation and one primary action to inspect the portfolio.

CX: the public-facing Studio experience sets an accurate expectation instead of exposing unfinished tools.

Service Design: the public Studio route is separated from the private production workspaces and APIs through one explicit feature gate, allowing the product to evolve without forcing an unfinished workflow onto visitors.

## Verification

The repository includes regression tests for:

- canonical domain consistency
- www to apex redirect behavior
- Supabase service-role fail-closed behavior
- PostgreSQL TLS verification
- CSP coverage
- Studio public/private gating
- construction-surface content and interaction contracts

Browser QA covers the public construction route and verifies that unfinished Studio surfaces redirect back to `/studio` while the feature flag remains disabled.

Before releasing Studio publicly, set `VITE_STUDIO_PUBLIC_ENABLED=true` only after the complete Studio release gate has passed.

## Development

```bash
npm ci
npm run test
npm run diagnose
npm run typecheck
npm run lint
npm run build
```

Node.js 24 is the project runtime.

## Production recovery rule

The portfolio's existing creative content, imagery, client set, data source and motion system are protected assets. Hardening work must be additive and must not replace production creative data with approximations, placeholders or demo content.
