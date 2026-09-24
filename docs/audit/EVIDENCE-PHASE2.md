# Evidence Fase 2
Data: 2026-09-24

## P0 production
Pre-hotfix production RLS contained anonymous/public INSERT policies on booking_requests, briefing_submissions, contact_requests, newsletter_subscribers and analytics_events. Storage also contained public INSERT policy "public uploads to contact-uploads prefix".

Hotfix branch: hotfix/p0-rls-20260924.
Production main merge commit: 4612414968494d0db853c6232eae9f2f14a1c937.
Migration prepared: supabase/migrations/20260924160000_phase2_p0_rls_boundary.sql.
Vercel list after merge exposed no deployment for 4612414. The newest observed deployment was awwwads-rebuild commit 8aa693c75909a6cc816ee9cb6729f5cee2026abc. Therefore the production runtime for the hotfix is NOT-VERIFIED and the migration was not applied.

## Rebuild
Rebuild branch contains the Phase 2-15 implementation and remains awwwads-rebuild-derived. Source inspection confirms EN/PT routes, self-hosted Archivo/Newsreader, design-system tokens, admin/Studio separation and security migrations prepared but not applied to production.

## Performance
docs/rebuild/FASE-15-REPORT.md records Desktop Home Lighthouse Performance 0.75 and performance budget JS ~437-443 KB gzip and fonts ~222 KB gzip, both above v3 limits. Thresholds were not reduced; lighthouserc.cjs was made stricter in Phase 2.

## Reproducibility
package.json now exposes audit:all and test:audit-contract. Static governance runner is fail-closed. Local execution remains blocked by DNS/runner access in this environment.
