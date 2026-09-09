# Deployment Guide

This project is a dynamic TanStack Start application with SSR and server functions. Vercel deploys the Nitro `vercel` preset output and must not be configured as a static export.

## Vercel settings

- Framework: `TanStack Start`
- Root Directory: `/`
- Node.js: `24.x`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: leave empty

The repository also pins Node 24 through `package.json` and `.nvmrc`.

## Environment

Set the public Supabase variables for Production and Preview:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
VITE_PUBLIC_SITE_URL
VITE_SITE_URL
```

Set server-only variables where the corresponding feature is enabled:

```text
GEMINI_API_KEY
AI_MODEL_PRIMARY
AI_MODEL_FALLBACK
GEMINI_MODEL_PRIMARY
GEMINI_MODEL_FALLBACK
GEMINI_LIVE_MODEL
GEMINI_TTS_MODEL
SUPABASE_PROJECT_ID
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
RESEND_AUDIENCE_ID
BRIEFING_FROM
BRIEFING_ADMIN_EMAIL
ADMIN_EMAIL
NEWSLETTER_FROM
LOVABLE_API_KEY
PUBLIC_SITE_URL
SITE_URL
CORS_ALLOWED_ORIGINS
```

Never commit `.env` files or server secrets. `VITE_*` values are public by design and must never contain service-role keys.

## Pre-deploy verification

```bash
npm ci
npm test
npm run diagnose
npm run lint
npm run build
```

The equivalent single command is:

```bash
npm run check
```

`npm ci` is intentionally used as a gate. It fails when `package.json` and `package-lock.json` drift, preventing non-reproducible production installs.

## Production rules

Do not:

- convert the project to a static SPA;
- add an arbitrary Vercel output directory;
- commit `.vercel`, `.output` or environment files;
- reintroduce legacy `index.html` or `src/main.tsx` bootstrapping;
- bypass Supabase Auth for administrative access;
- expose server-only keys with a `VITE_` prefix.

## Runtime model

The browser receives the SSR document and hydrates through `src/client.tsx` using TanStack Start's `StartClient`. Public portfolio content is read from Supabase through React Query with resilient fallbacks. AI and other sensitive operations stay on server routes.
