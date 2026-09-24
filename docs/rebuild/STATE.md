# Rebuild State — edmundokutuzov.art

Master execution state for SUPERPROMPT v2. This file is operational, not an approval gate.

| Phase | Status | Tag | Summary |
|---|---|---|---|
| 1 | BLOCKED-EXTERNAL | — | Truth-terrain, stability, SEO hotfix and safety baseline executed; external runner evidence still unavailable |
| 2 | BLOCKED-EXTERNAL | — | Technical foundation, CI/CD and guardrails implemented; final runner gates cannot be verified from this execution surface |
| 3 | BLOCKED-EXTERNAL | — | Design system / Betão & Cor technical scope executed; predecessor gates remain unresolved |
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
- Phase 3 is dependency-blocked by Fases 1/2. Technical work was executed conservatively because the requested task was explicit; promotion to green remains prohibited until the predecessor gate evidence exists.

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


## Phase 3 execution log

Phase 3 technical scope was executed on awwwards-rebuild without applying public-page styling and without mutating production data.

### Completed
- Betão & Cor token layer isolated in src/styles/design-system.css.
- Self-hosted Archivo Variable and Newsreader Variable dependencies added.
- Design system primitives created under src/components/design-system.
- Headline contract prevents duplicate text rendering and exposes one accessible label.
- Work Colour contrast/OKLab utility created.
- Authenticated /admin/design-system showcase registered in the route tree.
- Desktop G grid overlay and contextual cursor utility added.
- Additive projects dominant_color/accent_color migration committed with rollback; not applied.
- Local backfill and AA contrast gate scripts added.
- CI contrast gate added.
- Design plan, anti-template review, contrast report and architecture boundary documented.
- Phase 3 contract tests added.

### Production safety
- No Supabase rows changed.
- No Storage objects changed.
- No migration executed.
- No public route imported the Phase 3 CSS.
- No change to the protected Reel component.

### Gate status
- Contrast token gate: designed to PASS; external runner execution is still unavailable.
- Lint/typecheck/npm test/Playwright: NOT CLAIMED GREEN without runner evidence.
- Gate de Mudança: NOT APPLICABLE because Phase 3 does not change public composition.
- Phase 3: BLOCKED-EXTERNAL because Fases 1 and 2 are still BLOCKED-EXTERNAL and no green tags exist.

### Phase 3 commits
- 5485336490c7e651c8586abffaae85eec2e21689
- 0720a32aaf6cb3751d4d0876abc418bfbd1f2343
- 2e29f32fdac95c5f53947b3c0f100db4e501fc2d
- 391cd6887f98b3b7906101fa013f91114a330406
- cd6735d1a0aea4fc13c4fed6b24fd8af36740518
- d736447f232f91307dadd285b4cc20bd3c7cca1e
- 2893feab774d117a50a1354fd8a436aa3efa157b
- 3fc7e8f65f96a228f5c94434279959961134cbb7
- d8dc5060b6f3c0a60b32a6487d05ae8649a7ea96
- f26aefffed099b11485dbfa32a50f2a567277b1e
- 84b58345d56b44db0a49dab98ec284877e9fd42e
- 2ffef8dfffa5fa0b70a00fedf77361ded22b06c6
- f8661447f9692662e1e7eb5db0867759f8344214
- a5b6694b93d6b91c681dc19b6c0cdbc11f0fed8f
- 1bab4eb2f8cde02b1f14e2647821a90f11ce00ee
- 4a6f47cff3fc0114963a693db2c029803fc7dfdd
- ec5f44bf6fc0ef3db669c1dc65a82335c80dd536
- 9e25e8772990a4ece23cb73d091a66cbc0920f4d
- d220f5ae743472e6b2493508288a565464baf01b
- 17e7e00bfbd885105ca13159088889269a59a66b

## Current gate decision

Phase 1: BLOCKED-EXTERNAL.
Phase 2: BLOCKED-EXTERNAL.
Phase 3: BLOCKED-EXTERNAL.

The design-system work is committed to awwwards-rebuild, but the execution record must not manufacture a green state while predecessor runner and backup evidence remains missing.
