# Cloudflare deployment

The build targets Cloudflare and produces both deployment shapes from a single
`npm run build`:

| Output | Path | Used by |
|--------|------|---------|
| Workers Static Assets bundle | `dist/server/` + `dist/client/` | `wrangler deploy` (modern, recommended) |
| Pages advanced `_worker.js` | `dist/client/_worker.js/` + `_routes.json` | Cloudflare **Pages** (dashboard / `wrangler pages deploy`) |

## Option A — Cloudflare Pages (dashboard)

1. Push the repo to GitHub.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - **Framework preset:** None
   - **Install command:** `npm ci`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/client`
   - **Node version:** `20` (env var `NODE_VERSION=20`)
4. Add the same env vars used locally (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, etc.) under
   **Settings → Environment variables** for both Production and Preview.
5. Deploy. Pages will pick up `dist/client/_worker.js/index.js` automatically
   and serve static assets (excluded in `_routes.json`) from the edge cache.

## Option B — Cloudflare Pages (CLI)

```bash
npm run build
npx wrangler pages deploy dist/client --project-name tanstack-start-app
```

Or the shortcut: `npm run deploy:pages`.

## Notes

- Server functions read secrets via `process.env.*` inside `.handler()` — set
  those in the Cloudflare dashboard, not as `VITE_*`.
- Do not commit `bun.lock`, `bun.lockb`, `bunfig.toml`, `wrangler.json`, or
  `wrangler.jsonc` for this Pages setup; `package-lock.json` is the single
  dependency lockfile used by automatic deploys.
