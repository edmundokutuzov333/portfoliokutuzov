# Architecture — edmundokutuzov.art

## Phase 2 baseline

This document records the technical runtime and guardrails without changing the public visual system.

### Runtime matrix

| Surface | Runtime | Reason / boundary |
|---|---|---|
| Public React routes | Browser + Nitro SSR | Standard TanStack Start page rendering |
| TanStack server routes under `src/routes/api.*` | Node.js serverless on Vercel | Node APIs, secrets, external SDKs and streaming belong here |
| `/api/chat` | Node.js serverless | Gemini SDK, streaming Response, rate limiting and server-side secrets |
| Studio server APIs | Node.js serverless | Supabase service role, Resend/Magnific integrations and Node APIs |
| PDF/OG generation routes | Node.js serverless | Node-compatible binary generation and `pdf-lib` |
| Static assets | Vercel static/CDN | Immutable build assets |
| Realtime Supabase subscriptions | Browser | Public read paths use anon/publishable credentials with RLS |
| Admin mutations | Browser -> server/data layer | Authenticated admin paths; production writes must remain server/RLS guarded |

### Deployment

- Runtime target: Node.js 24.x.
- Repository pin: `.nvmrc = 24`.
- Package declaration: `engines.node = 24.x`.
- Nitro preset: `vercel`.
- Current Vercel deployment region observed in production previews: `iad1`; Phase 2 pins `iad1` to keep the baseline deterministic.
- Vercel Preview is produced from pushes by the connected project integration.
- Production promotion remains reserved for Phase 15.

### Server-route rule

Do not move streaming or Node-dependent server routes to Edge. The application must return standard `Response` objects from TanStack Start server handlers for streaming endpoints.

### Security headers

Phase 2 changes CSP from enforcing to `Content-Security-Policy-Report-Only`. This is intentional: the Phase 2 job is to observe violations before enforcement in Phase 15.

Current header policy includes:
- HSTS
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy
- Permissions-Policy
- CSP Report-Only
- X-Robots-Tag `noindex, nofollow` on `/admin*` and `/edmundo-control-room*`
- Canonical `www.edmundokutuzov.art` -> apex redirect

### Performance budgets

CI checks each critical public route at 1440x900 with:
- initial JavaScript <= 170 KB gzip
- CSS <= 30 KB gzip
- above-the-fold fonts <= 120 KB gzip
- LCP image <= 150 KB

The lazy Selected Portfolio Reel chunk is excluded from the initial JS budget by filename pattern. The Reel implementation itself remains protected and unchanged in Phase 2.

### Quality gates

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run test:parity`
- `npm run test:change-gate`
- `npm run test:performance`
- Playwright chromium smoke on critical public journeys
- Full Playwright browser matrix remains defined for Chromium, WebKit, Firefox, iPhone Safari and Android Chrome.

### Visual regression contract

`test:change-gate` uses PNG edge maps for structural comparison and pixelmatch as an auxiliary pixel diff. During foundation phases with no page screenshots in `docs/rebuild/after/`, the command reports NOT_APPLICABLE and exits successfully. During page phases it requires the documented >= 0.45 structural diff.

### Dependencies introduced in Phase 2

- `@vercel/speed-insights@2.0.0` — direct Vercel RUM integration.
- `pixelmatch@7.2.0` — screenshot pixel comparison.
- `pngjs@7.0.0` — PNG decoding/encoding for visual regression.

These packages are confined to runtime instrumentation and test tooling; no new UI framework was introduced.

### Observability

Speed Insights instrumentation is committed in the root shell. Vercel-side Observability/Speed Insights dashboard activation is external account configuration and must remain verifiable before the final release gate.

### Source-of-truth boundary

Phase 2 does not change public content or production data. All current content-count divergences remain documented in:
- `docs/baseline/INVENTARIO.md`
- `docs/rebuild/DIVERGENCIAS.md`
- `docs/rebuild/CONTEUDO-CONFLITOS.md`

### Rebuild safety

- No production DB/Storage mutation is performed by Phase 2.
- No migration is introduced by Phase 2.
- Public UI remains visually unchanged by this phase.

## Phase 3 design-system boundary

- Public routes keep their existing visual CSS in Phase 3; no public route imports the design-system stylesheet.
- /admin/design-system is an authenticated Control Room surface and is the only route that imports the Phase 3 design-system CSS and self-hosted variable fonts.
- Design tokens live in src/styles/design-system.css and are intentionally namespaced through semantic variables such as --bg, --fg, --muted, --rule and --work.
- Radix/CVA/tailwind-merge primitives live under src/components/design-system/ so the existing public UI primitives remain unchanged until the global shell phase.
- Work Colour runtime logic is pure browser-safe TypeScript in src/lib/work-color.ts. It has no production-only image-processing dependency.
- public.projects receives nullable dominant_color and accent_color through a versioned additive migration. The migration is committed but not applied to production while the prior backup gate remains BLOCKED-EXTERNAL.
- reel_items is deliberately not created in Phase 3; the Reel schema remains owned by Phase 6.
- The local colour backfill tool is an optional developer utility and is not part of the Vercel serverless runtime.



## Phase 4 global shell boundary

- Public routes now inherit a full-width global shell from the root route. The shell uses the Betão & Cor semantic layer without changing page-internal content contracts.
- The global header derives its tone from the nearest visible section and keeps one primary action: Start a project.
- Navigation uses TanStack Router View Transitions with a reduced-motion-safe fallback; no new animation dependency was added.
- EN is the default locale. PT is exposed through /pt/* mirror routes that reuse the existing public components and data. The locale layer changes UI chrome, document language, canonical/hreflang metadata and route paths; public content is not translated without a real source.
- Newsletter writes remain server-only. The Phase 4 double-opt-in schema is committed but migration-gated behind UNIFIED_NEWSLETTER_ENABLED until the required production backup gate is restored. Existing subscriber and Studio waitlist records are not deleted.
- Availability is a site_settings source with an explicit Control Room editor. Public labels read this source and derive the year from the setting instead of embedding a fixed 2026 date.
- Command Palette keeps the existing server portfolio search and adds navigation, recent items stored only in browser localStorage, Start a project, language switching and an AI assistant open action.
- SEO includes canonical URLs, EN/PT hreflang, sitemap entries for both locale families, a public Studio crawl path, WebSite/Person/ProfilePage structured data and route-level WebPage/ProfilePage/Article synchronization.
- Fonts for the new shell are self-hosted Archivo Variable and Newsreader Variable. Remote Google Fonts are no longer loaded by the public root shell.
