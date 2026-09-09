# Edmundo Kutuzov Portfolio

Dynamic production portfolio for Edmundo Kutuzov. The application uses TanStack Start with SSR, TanStack Router, React, React Query, Supabase, Framer Motion and server-side AI capabilities.

## Architecture

```text
Browser
  -> TanStack Start SSR
  -> TanStack Router
  -> React UI + Framer Motion
  -> React Query
  -> Supabase data and storage

Server
  -> TanStack Start server entry
  -> protected API routes
  -> AI services
  -> contact and business operations
```

The project is intentionally dynamic. It is not a static export. SSR, real CMS data, images, video support, animation and interactive behaviour are part of the product contract.

## Local development

Requirements: Node.js 24 and npm.

```bash
npm ci
npm run dev
```

## Verification

```bash
npm test
npm run diagnose
npm run lint
npm run build
```

Or run the full sequence with:

```bash
npm run check
```

## Production deployment

Vercel is configured for the TanStack Start framework with the Nitro Vercel preset.

Node runtime contract:

- `package.json`: `24.x`
- `.nvmrc`: `24`
- Vercel Project Settings: `24.x`

Do not configure a custom output directory and do not convert the application to a static SPA.

## Environment

Browser configuration uses the `VITE_*` variables documented in `.env.example`. Server secrets must remain server-only and must never receive a `VITE_` prefix.

## Data model

Supabase is the production source of truth for published projects, clients and site settings. React Query hooks provide typed fallbacks for transient data failures so a temporary CMS problem does not turn the interface into a blank page.

## Admin

The Control Room is protected by Supabase Auth and membership in `admin_users` enforced through Row Level Security. Local mock state is not an authentication mechanism.

## AI API

`/api/chat` supports streaming chat, opening messages, TTS and voice turns. The endpoint validates origin, payload size and request volume before invoking AI services.

## Documentation

- `DEPLOY.md` for deployment configuration and checks
- `SECURITY.md` for security architecture
- `.env.example` for the environment variable contract
- `tests/phase1-hardening.test.mjs` for architecture regression checks
- `scripts/diagnose-build.mjs` for production architecture diagnostics
