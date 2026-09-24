# Rebuild State — edmundokutuzov.art

Master execution state for SUPERPROMPT v2. This file is operational, not an approval gate.

| Phase | Status | Tag | Summary |
|---|---|---|---|
| 1 | BLOCKED-EXTERNAL | — | Truth-terrain, stability, SEO hotfix and safety baseline executed; external runner evidence still unavailable |
| 2 | BLOCKED-EXTERNAL | — | Technical foundation, CI/CD and guardrails implemented; final runner gates cannot be verified from this execution surface |
| 3 | BLOCKED-EXTERNAL | — | Design system / Betão & Cor technical scope executed; predecessor gates remain unresolved |
| 4 | BLOCKED-EXTERNAL | — | Global shell / i18n / SEO executed; external runner and Vercel build-rate limit remain |
| 5 | BLOCKED-EXTERNAL | — | Home rebuilt; page gates cannot be verified because external runners/Vercel latest build evidence are blocked |
| 6 | BLOCKED-EXTERNAL | — | Reel 3D evoluído e testado por contratos; migration/analytics preparados mas não aplicados por R1 e gates predecessores |
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
- Contrast token gate: PASS by deterministic token calculation in the committed script; external GitHub runner execution is still unavailable.
- Vercel code-bearing Phase 3 commit ec5f44bf6fc0ef3db669c1dc65a82335c80dd536 reached READY in deployment dpl_27wQDxu3JZ6xscwuvKTSpGVeynty. Later commits only updated documentation/state and were queued.
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


## Phase 4 execution log

Phase 4 technical scope was executed on awwwards-rebuild. The public shell was changed globally; page interiors remain reserved for their later phases.

### Completed
- Full-width Betão & Cor global header with dynamic section tone.
- New footer with one closing CTA block, navigation, socials, quote, Maputo clock and unified newsletter entry.
- Rectangular mobile menu and EN/PT language switch.
- /pt, /pt/portfolio, /pt/portfolio/$slug, /pt/services, /pt/credentials, /pt/contact and /pt/studio mirrors registered in TanStack Router.
- Root document language is SSR-aware for /pt/*.
- Canonical, hreflang and x-default SEO infrastructure.
- Sitemap now emits EN and PT pages plus localized project URLs.
- Public Studio is no longer disallowed by robots.
- Web manifest committed; root loads self-hosted Archivo/Newsreader instead of Google Fonts.
- Native TanStack View Transitions enabled.
- Global route loading state added through Suspense.
- Flat 404 and Error Boundary surfaces created.
- Command palette expanded with navigation, actions, AI-open command, language switch, search and recent projects.
- AI assistant listens for the palette open event.
- Newsletter server function gained rate limiting, double-opt-in flow and confirmation endpoint, feature-gated until migration is applied.
- Studio waitlist now uses the unified newsletter function.
- Additive newsletter migration and rollback committed; no production migration executed.
- Availability setting added to CMS and exposed through the Control Room.
- Route-level JSON-LD synchronization and ProfilePage/WebSite/Person base schema maintained.
- Phase 4 contract tests added.
- Architecture and divergence documentation updated.

### Production safety
- No Supabase data rows changed.
- No Storage objects changed.
- No production migration executed.
- No secrets added to source control.
- No public page interior was re-authored.
- Selected Portfolio Reel was not changed.

### External evidence
- Vercel READY deployment dpl_2mKNQCGVBvWRaK2TnJQ27zySyM8s for commit dfeac8056f72272660ac61f0b665d121e9628bdd proves a code-bearing Phase 4 preview compiled before the remaining changes.
- Latest checked commit status returned Vercel failure with target URL indicating the build-rate-limit page.
- GitHub Actions returned no workflow runs for the latest checked commit.

### Gate status
- Phase 1: BLOCKED-EXTERNAL.
- Phase 2: BLOCKED-EXTERNAL.
- Phase 3: BLOCKED-EXTERNAL.
- Phase 4: BLOCKED-EXTERNAL.
- Lint/typecheck/node:test/Playwright: NOT CLAIMED GREEN without runner evidence.
- Gate de Paridade: unchanged by production data mutation; no content counts were changed.
- Gate de Mudança: NOT APPLICABLE to the shell phase.
- phase-4-green tag: not created.
- Production promotion: not attempted.

### Phase 4 key commits
- 5afa83c55d2caaac934f713c056dd7e83b7f458e
- a7892224af726db677f2a1e0e7eb126a1a7cae38
- 023aaad9073cf63a966f31b39f863e631a64cd23
- 7340c8c79596a9c2c2cc7224f302274f5a656ddc
- e7f9ad14172a30c098ed3a64ab7a426dc4e78e66
- e41148b06d83c85b892c1533b95a56adb2718e75
- 4ade83b5d57a533fa96450ecde6dc414151dfdac
- e23b8ee08c30ab1325a323f722c916ef8ec807d9
- 8047bb5d52d2f37c0bae037e3eb6ce66d3ef7a66
- 6b7b0bb59e2d180f83094921939f7ef610514e64
- 4d75e1f657f93d8e3e576aeeb8c703fb723015d9
- e83bba563b423afcc7fce28a063e7780706713a9
- 9a44abc208fd0f24478e13f23299a339e8ba4580
- 874b50e889ac0b2e0bbcf6bb01a32dd47fae6944
- db4bb06deac71a1947ef29d6006de31f29839128
- ddbc7720bb1de2fc9b7ec8bc98af7d1aae06189
- 6bc2e8fb7e508b77e7df0d43f9f6fcf0536c9687
- e084ddc384edde72a9dac8f3772c7ec7e9ea1b8d
- 9ab1e0226086d018859ff98d26523aa4f3c5fae2
- 3ccede7b7527dda83de26859cb335e08713656a0
- b0d884a1245dfa19cb705953390c87c8ac901716
- 1a9768d56da28c093b07ab5538869ca554e7be33
- cda46dfb7d9a4ee7d744873836683a6d61942cee
- 737ac674073eb9a24eb610f3054fefef62a338ef
- 13e5be327ec7fd7ea2e8bcf544bd54cee8a8580b
- f1929b715333c2721a5cd5d60607e803dc66cb8d
- 7409ef8138158fc0daa0b8850448d07b5dc309d7
- 9f224930f5f3cbf7ebada8068c0d20aefa1de1ce
- 6dbc681bab972f35fb94725f2777f6bd32d3feca
- 55b3fe9d7e3bfc3cefa2d7989e39c0418f6f1e7d
- 38a87c97cd5aa0218a69684217c905e5feb9484d
- 62ef32fc82ee020c8bc06703fbb251c27b7d360b
- 81e2a7bb48420060a1df8c215fd1cd3116d06cbc
- b9bea1bd31dcfcba48d13babcb5a296795869830


## Phase 5 execution log

Phase 5 Home was rebuilt on awwwards-rebuild as a five-content-block composition whose sixth closing block is the homepage-aware global footer from Phase 4. The implementation follows the Phase 5 brief while preserving the protected Reel as-is.

### Completed
- Replaced the previous Home route composition with HomePhase5.
- Hero uses the exact approved headline once, Archivo/Cartaz typography, Newsreader bio and a single Start a project CTA.
- Availability reads the Phase 4 admin setting.
- Protected DeferredReel is mounted inside the new Hero stage; its source/component was not edited.
- Featured Work reads real published/featured projects from Supabase, currently six featured records. It supports up to eight without inventing records.
- Work Colour is derived from each project's existing palette field when available, with the Phase 3 cobalt fallback.
- Missing project media is not replaced by invented imagery; the colour block remains as composition and the absence is documented.
- Services reuses the four real discipline definitions already used by the Services page, with hover/focus/touch expansion and aria-expanded.
- Discipline source was extracted to src/data/disciplines.ts so the homepage does not pull the whole ServicesInteractive runtime into the initial bundle.
- Proof reads active clients and active stats from Supabase, with the existing CMS credential cards as fallback because public.stats currently has zero rows.
- Client wall is text-based because the current 16 active client records have no logo_url values.
- Current role is read from the existing experience source.
- Reference remains sourced from credentials.reference and renders GOD without the previous ghost lettering.
- Homepage closing copy is delivered by the global footer when the route is /, preventing duplicate CTA blocks.
- Added phase5-home contract tests.
- No database/storage mutation was performed.

### Truth-terrain at execution
- Published projects: 16.
- Featured published projects: 6.
- Active clients: 16.
- Active stats: 0.
- Active services: 0.
- Active subscribers: 0.
- Studio waitlist: 2.
- Featured project media: cover_url/gallery are empty for all six current featured records.
- Client logo_url is null for all 16 current active client rows.

### Gate status
- Static Phase 5 contract checks performed through the repository connector: 11/11 passed.
- Lint: NOT CLAIMED GREEN.
- Typecheck: NOT CLAIMED GREEN.
- Vitest/node:test through GitHub runner: NOT CLAIMED GREEN; GitHub Actions returns zero workflow runs for the latest checked commit.
- Playwright: NOT CLAIMED GREEN.
- Lighthouse mobile/desktop: NOT RUNNABLE from this execution surface.
- Gate de Mudança: NOT CLAIMED GREEN because baseline screenshot files cannot be regenerated without the external browser runner.
- Gate de Paridade: content/database counts remain unchanged: 16 published projects, 6 featured projects, 16 clients, 5 experience rows from the existing CMS fallback, 4 service definitions, 5 metric cards from the existing credentials setting, 3 competency groups.
- Vercel: commit 91b26a31997c5458488431d3fd98c5301759f550 produced READY deployment dpl_9VdbApxzNMgmpymhvuBAE9tmNtqJ. Later Phase 5 commits are blocked by Vercel build-rate-limit status.
- phase-5-green tag: not created.
- Production promotion: not attempted.

### Phase 5 decisions
1. The plan expects 106 portfolio records, but truth-terrain is 16 published records; the Home uses the real 16 count.
2. Six featured records already exist, so no feature flags or DB writes were needed.
3. Because stats/services tables are empty, the Home uses the existing CMS credential cards and existing Services page definitions rather than fabricating new records.
4. Because project covers, galleries and client logos are absent, no fake media or logos were introduced.
5. The global footer is the sixth closing block on Home to preserve the Phase 4 one-closing-block contract.

- 771b8a0029bb50df6cd2606b1bf6e235f6d5414f — Phase 5 report


## Phase 6 execution log

Phase 6 technical scope was executed on awwwards-rebuild. The protected Selected Portfolio Reel component was deliberately changed only here, preserving the 3D fan while adding the specified accessibility, reduced-motion, virtualization, Work Colour, morph, cinema and analytics contracts.

### Completed
- Audited the existing Reel implementation and the current production project/media source.
- Preserved the fan paradigm; no flat carousel replacement was introduced.
- Deterministic round-robin ordering now interleaves project disciplines.
- Render virtualization limits the active render window to active ±5.
- Full keyboard contract: Left/Right, Home/End, Enter, Space.
- Previous/Next controls provide a drag alternative.
- The Reel pauses on hover, focus, outside viewport and reduced-motion.
- Reduced-motion or unsupported 3D uses a horizontal scroll-snap row.
- Only the active card exposes full title/client/year caption.
- Active item defines --work through the existing Phase 3 work-color utility.
- Active item receives a shared View Transition name for the case-study morph.
- Fullscreen cinema mode with Radix focus management and horizontal touch swipe.
- Analytics batching via navigator.sendBeacon and a server route with feature flag, rate limit and daily salted session hash.
- Reversible reel_items + reel_analytics migration committed but not applied.
- .env.example documents REEL_ANALYTICS_ENABLED=false.
- Phase 6 contract test suite added.
- DeferredReel wrapper was not changed.

### Truth-terrain
- public.projects: 16 published.
- Project cover_url values: 0.
- Project gallery rows: 0.
- Project gallery_meta rows: 0.
- The 3D Reel therefore uses truthful metadata/color posters for projects without real media instead of invented image URLs.
- Production database currently has no public.reel_items or public.reel_analytics table.

### Safety
- No Supabase migration executed.
- No DB rows modified.
- No Storage writes/modifications.
- Analytics route remains feature-disabled unless REEL_ANALYTICS_ENABLED=true is explicitly configured after the migration and backup gate are satisfied.

### Gate status
- Static Phase 6 contract checks: 17/17 PASS through repository inspection.
- Lint: NOT CLAIMED GREEN.
- Typecheck: NOT CLAIMED GREEN.
- Vitest/node:test: NOT CLAIMED GREEN; external GitHub workflow runs remain unavailable.
- Playwright: NOT CLAIMED GREEN.
- Gate de Mudança: NOT CLAIMED GREEN; required browser/screenshot runner is unavailable.
- Gate de Paridade: implementation preserves all 16 published project records and does not mutate their count; formal reel_items parity cannot be claimed because its production table does not exist yet.
- Vercel: latest checked commit 6c241607d056316e9f733126902c0146766fc8e0 reports Vercel failure on deployment target.
- phase-6-green tag: not created.
- Production promotion: not attempted.

### Phase 6 decisions
1. Because production has no real project media, never invent media URLs; use data-driven color/title posters until the real media pipeline exists.
2. Do not apply the migration because Phase 1 backup evidence is not confirmed and R1 prohibits production schema/data mutation without it.
3. Keep analytics server-gated and disabled by default.
4. Keep the migration's seed restricted to project rows with existing real cover media; the current dataset consequently seeds zero reel_items until media exists.
5. Do not replace the 3D fan with a flat/Embla carousel.

### Dependency decision
Phase 6 remains BLOCKED-EXTERNAL because Phase 5 is BLOCKED-EXTERNAL. The implementation is committed as technical groundwork, but the phase cannot be promoted to GREEN under R3/A.3 until predecessor and external execution gates are verified.
