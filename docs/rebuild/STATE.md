# Rebuild State — edmundokutuzov.art

Master execution state for SUPERPROMPT v2. This file is operational, not an approval gate.

| Phase | Status | Tag | Summary |
|---|---|---|---|
| 1 | BLOCKED-EXTERNAL | — | Truth-terrain, stability, SEO hotfix and safety baseline executed; external runner evidence still unavailable |
| 2 | BLOCKED-EXTERNAL | — | Technical foundation, CI/CD and guardrails implemented; final runner gates cannot be verified from this execution surface |
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
- Current production had incorrect internal canonicals and Studio noindex; these are addressed in the rebuild/hotfix source.

### External gate blockers
- The execution container cannot resolve edmundokutuzov.art, so direct local curl UA validation could not complete.
- GitHub workflow-run/artifact results are not exposed by the current connector surface, so the fresh DB/Storage backup artifact cannot be marked confirmed from this session.
- The latest SEO hotfix commit does not yet have a verifiable preview build result through the available Vercel status surface.
- Required git tag phase-1-green could not be created because the available GitHub toolset exposes branch ref updates but no tag creation primitive.

### Production safety
- No production database row was mutated.
- No Storage object was mutated or deleted.
- No production promotion was attempted without the missing build/backup evidence.

## Phase 2 execution log

Phase 2 technical scope was executed on the canonical awwwards-rebuild branch without touching public page composition or production data.

### Completed
- Confirmed TypeScript strict mode, Node 24, .nvmrc and package engines alignment.
- Confirmed Nitro preset vercel.
- Added Vercel Preview-compatible CI gates on every push to awwwards-rebuild.
- Added foundation parity guard.
- Added structural change-gate runner using PNG edge maps and pixelmatch.
- Added runtime performance budgets for JS/CSS/fonts/LCP image.
- Added Chromium Playwright smoke to CI while preserving the existing multi-browser matrix.
- Added @vercel/speed-insights instrumentation.
- Changed CSP from enforcing to Content-Security-Policy-Report-Only.
- Added X-Robots-Tag noindex for /admin* and /edmundo-control-room*.
- Formalised www → apex canonical redirect.
- Added docs/ARCHITECTURE.md.
- Added tests/phase2-foundation.test.mjs.
- Added docs/rebuild/FASE-2-REPORT.md.
- No migration, DB write, Storage write or public visual redesign was introduced.

### Phase 2 dependency decisions
- @vercel/speed-insights 2.0.0
- pixelmatch 7.2.0
- pngjs 7.0.0
- No alternative UI framework or state library introduced.
- No schema change because Phase 2 contains no required data-model change.

### Phase 2 gate status
- Repository/package consistency: verified by source inspection; package and lock root dependency ranges match.
- CI gate definitions: committed.
- Vercel previews: generated for awwwards-rebuild; latest observed preview was queued and intermediate previews reached READY.
- GitHub Actions execution result: BLOCKED-EXTERNAL because workflow runs/artifacts are not exposed by the available connector.
- Final lint/typecheck/Vitest/Playwright/performance result: NOT CLAIMED GREEN without runner evidence.
- phase-2-green tag: not created.
- Phase 3 must not be started from this session until the dependency chain is green or an explicit external gate is restored.

### Phase 2 commits
- 7ae2747857dcb3728da65ee164329c123f4536df
- 2da1f722adf871479c88912db7e53b95a303b74b
- 100e6096bff8b3163191eabb0b46cb78667fd1ee
- e33c1e959f7d20a6648e79526611fef14162bd10
- 8575b82c6b93ebaf8740a595d5448de00cafd6f4
- 9e40d799d0867920feeb8290dbe3b9098448d10e
- 18b7cea458abeaa3021976e383fb3ed150204169
- 6ccfb4b1ffc114857ae49026ff59caa3d820c3ae
- d4e9f8a7cd7ee800a844083aea08c5c7e100e8f2
- 030b32a3d214db22e18690713ea10b4d195e3a00
- 8fe1210bf714aa43af416c205ad6267dd7202f10
- 383f294499ee74a4d55148b23c5b0dc4b1a4bf90
- 78925a4cbf7a146ba47c2176f2548ed0fa946ae1

## Gate decision

Phase 1: BLOCKED-EXTERNAL.
Phase 2: BLOCKED-EXTERNAL.

The technical work for Phase 2 is committed, but the phase cannot be promoted to green because R3 requires verified lint, typecheck, Vitest, Playwright and the preceding phase dependency. No production promotion was attempted.

## Open risks

- Public fallback Supabase configuration points at project ref uqcuzsuqkutxjqkopary while current production project ref is hdmopgkbragcoirhabhi.
- Ground-truth counts conflict with the visual audit; see docs/rebuild/DIVERGENCIAS.md.
- 404 currently carries generic public robots/canonical metadata; reserved for the dedicated error/SEO pass.
- Vercel-side Observability dashboard activation remains external account configuration; code instrumentation is committed.
