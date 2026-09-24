# Production HTTP / SEO baseline — 24/09/2026

Source: direct Vercel fetch against the current production deployment, plus repository inspection. Local curl was also attempted but the execution environment could not resolve the public domain.

## Direct production response

| Route | Status | X-Robots-Tag | Meta robots | Canonical observed |
|---|---:|---|---|---|
| / | 200 | absent | index,follow,max-image-preview:large | https://edmundokutuzov.art/ |
| /portfolio | 200 | absent | index,follow,max-image-preview:large | https://edmundokutuzov.art/ |
| /portfolio/absa | 200 | absent | index,follow,max-image-preview:large | https://edmundokutuzov.art/ |
| /services | 200 | absent | index,follow,max-image-preview:large | https://edmundokutuzov.art/ |
| /credentials | 200 | absent | index,follow,max-image-preview:large | https://edmundokutuzov.art/ |
| /contact | 200 | absent | index,follow,max-image-preview:large | https://edmundokutuzov.art/ |
| /studio | 200 | absent | noindex,nofollow | https://edmundokutuzov.art/ |
| /__phase1_missing__ | 404 | absent | index,follow,max-image-preview:large | https://edmundokutuzov.art/ |
| /robots.txt | 200 | absent | n/a | n/a |
| /sitemap.xml | 200 | absent | n/a | n/a |

## Confirmed production defects

1. Internal public pages emit the homepage canonical URL in SSR HTML.
2. Kutuzov Studio is linked/public and present in the site architecture, but its route explicitly emits noindex,nofollow.
3. The 404 response currently carries the public robots meta and homepage canonical. This is not a Phase 1 production blocker for public indexing, but it is recorded for the later error/SEO pass.

## Hotfix

The following source-level fixes are implemented on awwwards-rebuild and mirrored to hotfix/seo-canonical:
- Root shell no longer injects the homepage canonical into every child route.
- Credentials now uses createSeo with /credentials.
- Portfolio case studies now use createSeo with /portfolio/:slug.
- Studio now uses createSeo with /studio and is no longer noindex.
- Phase 1 regression tests and HTTP audit now assert per-route canonicals.

## Limitations

- The local execution environment cannot resolve edmundokutuzov.art, so the requested curl UA matrix must be executed by the GitHub runner.
- The GitHub Actions connector is not exposing workflow runs for this branch, so the DB/Storage backup artifact and browser/axe/Lighthouse gates cannot yet be marked confirmed from this execution surface.
- Vercel successfully built an earlier awwwards-rebuild preview (commit 1a070692...), while the later SEO hotfix commit is pending/awaiting its own verifiable deployment result.
