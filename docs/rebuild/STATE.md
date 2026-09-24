# Rebuild State — edmundokutuzov.art

Master execution state for SUPERPROMPT v2. This file is operational, not an approval gate.

| Phase | Status | Tag | Summary |
|---|---|---|---|
| 1 | BLOCKED-EXTERNAL | — | Truth-terrain, stability, SEO hotfix and safety baseline executed; external runner evidence still unavailable |
| 2 | TODO | — | Technical foundation / CI / guardrails |
| 3 | TODO | — | Design system / Betão & Cor |
| 4 | TODO | — | Global shell / i18n / SEO |
| 5 | TODO | — | Home |
| 6 | TODO | — | Selected Portfolio Reel |
| 7 | TODO | — | Portfolio |
| 8 | TODO | — | Case study |
| 9 | TODO | — | Services |
| 10 | TODO | — | Credentials |
| 11 | TODO | — | Contact |
| 12 | TODO | — | Kutuzov Studio |
| 13 | TODO | — | Chatbot / AI |
| 14 | TODO | — | Admin / operations |
| 15 | TODO | — | Final release |

## Execution rules
- Canonical branch: awwwards-rebuild.
- Production promotion: Phase 15 only, unless a proven Phase 1 production hotfix is validated and promoted.
- Phase gates and the SUPERPROMPT are authoritative.
- Ambiguity is resolved conservatively and reversibly.
- Production data changes require a confirmed reversible backup first.

## Phase 1 execution log

Starting main HEAD: 58f1e91158edce32841975b76bdc9f6f247270f9.
Canonical rebuild branch created: awwwards-rebuild.
Emergency hotfix branch created: hotfix/seo-canonical.

### Completed
- Ground-truth repository and production audit.
- Direct production route/SEO inspection.
- Supabase production inventory.
- Source-of-truth map.
- Content conflict register.
- Divergence register.
- Phase 1 HTTP audit script with browser/crawler UA matrix.
- Playwright desktop/mobile screenshot + axe baseline tooling.
- Lighthouse baseline tooling.
- Bundle-size baseline tooling.
- Encrypted DB backup workflow wired to awwwards-rebuild.
- Storage manifest with SHA-256 evidence included in backup package.
- Regression assertions for public SEO boundaries.
- Hotfix for SSR canonical ownership and public Studio noindex.

### Confirmed ground truth
- Production portfolio DB rows: 16.
- Production client rows: 16.
- Studio waitlist rows: 2.
- Storage objects: 0.
- Admin users: 1.
- Public production routes tested through Vercel fetch: public pages return 200; explicit missing-route probe returns 404.
- robots.txt and sitemap.xml return 200.
- Current production had incorrect internal canonicals and Studio noindex; these are now addressed in the rebuild/hotfix source.

### External gate blockers
- The execution container cannot resolve edmundokutuzov.art, so direct local curl UA validation could not complete.
- GitHub workflow-run/artifact results are not exposed by the current connector surface, so the fresh DB/Storage backup artifact cannot be marked confirmed from this session.
- The latest SEO hotfix commit does not yet have a verifiable preview build result through the available Vercel status surface.
- Required git tag phase-1-green could not be created because the available GitHub toolset exposes branch ref updates but no tag creation primitive.

### Production safety
- No production database row was mutated.
- No Storage object was mutated or deleted.
- No production promotion was attempted without the missing build/backup evidence.

## Gate decision
Phase 1 remains BLOCKED-EXTERNAL, not GREEN. Do not start Phase 2 until the runner can verify:
1. fresh encrypted DB dump + Storage manifest artifact;
2. HTTP UA matrix;
3. build/typecheck/lint/Vitest/Playwright/axe/Lighthouse baseline;
4. validated hotfix preview before any Phase 1 production promotion.

## Open risks
- Public fallback Supabase configuration points at project ref uqcuzsuqkutxjqkopary while current production project ref is hdmopgkbragcoirhabhi.
- Ground-truth counts conflict with the visual audit; see docs/rebuild/DIVERGENCIAS.md.
- 404 currently carries generic public robots/canonical metadata; reserved for the dedicated error/SEO pass.
