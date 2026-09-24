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
| 7 | BLOCKED-EXTERNAL | — | Portfolio archive rebuilt with Grid/Index, URL filters, pagination and Work Colour; execution gates remain external |
| 8 | BLOCKED-EXTERNAL | — | Case study motor modular executado; formal gates continuam não verificáveis |
| 9 | BLOCKED-EXTERNAL | — | Services rebuilt; external execution/change-gate evidence still pending |
| 10 | BLOCKED-EXTERNAL | — | Credentials dossier rebuilt; formal runner and change-gate evidence not yet GREEN |
| 11 | BLOCKED-EXTERNAL | — | Contact rebuilt; production migration and formal gates remain blocked by R1/external runner evidence |
| 12 | BLOCKED-EXTERNAL | — | Kutuzov Studio rebuilt; formal gates and unified newsletter production migration remain blocked |
| 13 | BLOCKED-EXTERNAL | — | AI assistant evolved with RAG-ready grounding, citations, guardrails, tools, Live Voice context and accessible panel |
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

- e21dee5162406a5a0960be45d9d0157001280429 — Phase 6 report


## Phase 7 execution log

Phase 7 was executed independently, as allowed by the plan. The public /portfolio archive was rebuilt without mutating Supabase data or Storage.

### Completed
- New Betao / Portfolio route composition with the exact "Selected Work." heading.
- Two URL-persisted views: grid and index.
- Grid uses deterministic justified rows from real project aspect metadata; no artwork is cropped.
- Index presents Year / Project / Client / Discipline and an interactive Work Colour preview on hover/focus.
- Existing category taxonomy is preserved and exposed as rectangular multi-select toggles.
- Year and Client filters added.
- Search state is debounced and persisted through q in the URL.
- Server query supports d/y/c/q + page/limit and returns live facet counts.
- useInfiniteQuery loads 24 projects per page with an IntersectionObserver sentinel.
- Scroll restoration uses sessionStorage keyed by the current filter state.
- Project links prefetch their real record through the portfolio endpoint.
- First-page ItemList JSON-LD emitted from the archive.
- Existing route SEO preserved.
- No DB migration or production data mutation.

### Truth-terrain
- Published projects: 16.
- Featured projects: 6.
- Distinct project client_name values: 16.
- Distinct project years: 4 (2023, 2024, 2025, 2026).
- Normalised public categories: Social Media 1; Ad Campaigns 4; Digital Design 8; Offline Actions 0; Clothes Design 0; Videos 1; Web Design 2.
- Production media remains empty for the projects inspected in Phase 6, so the archive uses Work Colour metadata posters when artwork is unavailable.

### Parity / safety
- No rows inserted, updated or deleted.
- No Storage writes.
- The archive still resolves project records from the same public projects source.
- The requested 106-project expectation in the visual brief is not the current DB truth; the real count of published projects is 16 and the UI reflects 16.

### Gate status
- Static Phase 7 contract checks: 14/14 repository checks passed after final corrections.
- Executable local npm/Playwright run: BLOCKED-EXTERNAL. The execution container cannot resolve github.com, so a fresh checkout could not be obtained.
- Lint/typecheck/Vitest/Playwright: NOT CLAIMED GREEN.
- Gate de Mudança: NOT CLAIMED GREEN because the required browser/screenshot runner is unavailable.
- Gate de Paridade: data count preserved at 16 published projects before → after, with no DB write.
- Vercel/GitHub external status remains subject to the branch's external runner; not used to manufacture green.
- phase-7-green tag: not created.
- Production promotion: not attempted.

### Phase 7 decisions
1. The server archive remains source-driven rather than replacing the existing projects data with a new content model.
2. Multi-selection is encoded as comma-separated query parameters in d/y/c to keep URLs shareable and deterministic.
3. The Index preview uses Work Colour and a fixed preview panel on keyboard focus; no cursor-only behavior is required.
4. Because source media is absent, placeholders use the real project palette instead of invented images.
5. No new dependency was installed; native URLSearchParams, IntersectionObserver and sessionStorage provide the required infrastructure.

### Dependency decision
Phase 7 is an independent page phase under A.3, but it remains BLOCKED-EXTERNAL because its formal quality gates cannot be verified from this execution surface.

- fd7f803fedd7af60ad23eb3017645a039f636d4c — Phase 7 report


## Phase 8 execution log

Phase 8 was executed independently on awwwards-rebuild and consolidated the existing modular case-study scaffold rather than creating a second data model.

### Completed
- /portfolio/$slug routed through the modular CaseStudyPage engine.
- Data map created/updated for all 16 published cases.
- Editorial and gallery fallback templates preserved.
- Factual fallback semantics hardened: subtitle remains hero support; notes/structured outcome fields alone drive outcomes.
- Work Colour uses existing palette, OKLab darkening and contrast-aware foreground.
- Shared View Transition name retained for the case hero.
- Media keeps native proportions; gallery/lightbox only render with real media.
- Native dialog lightbox now has modal focus behaviour and Escape close.
- Previous/next and related projects use real published project data.
- Share uses Web Share API with clipboard fallback.
- Node PDF endpoint uses pdf-lib + @pdf-lib/fontkit.
- Dynamic OG endpoint is per-case and data-backed.
- /contact?ref=<slug> preselects the Project step using the existing project-type taxonomy.
- Phase 8 contract tests aligned to the real implementation surface.
- No DB or Storage mutations.

### Truth-terrain
- Published cases: 16.
- Covers: 0.
- Galleries: 0.
- Videos: 0.
- project_sections: 0.
- project_media: 0.
- project_metrics: 0.
- project_credits: 0.
- project_relations: 0.

### Formal gate status
- Lint: NOT CLAIMED GREEN.
- Typecheck: NOT CLAIMED GREEN.
- Vitest/node:test: NOT CLAIMED GREEN.
- Playwright: NOT CLAIMED GREEN.
- Gate de Mudança: NOT CLAIMED GREEN.
- Gate de Paridade: implementation preserves 16 published cases and performs no writes.
- Vercel/GitHub runner: external verification remains unavailable/rate-limited.
- phase-8-green: not created.
- Production promotion: not attempted.

### Decision
Phase 8 technical scope is complete. Formal state remains BLOCKED-EXTERNAL under R3/A.3.


## Phase 9 execution log

Phase 9 rebuilt `/services` on `awwwards-rebuild` using the existing static discipline definitions plus real published portfolio metadata.

### Completed
- Billboard layout for four service disciplines.
- Expand/collapse by hover, focus, keyboard and touch with `aria-expanded`.
- Real selected work per discipline from the published 16-project archive.
- URL link to filtered portfolio using `d=`.
- Work Colour activation on real project palette values.
- Contextual chatbot prompt.
- `/contact?service=` handoff into the existing Project step.
- Method ownership moved from Credentials to Services; empty production Method source remains hidden.
- FAQ structure prepared with Radix Accordion but hidden because the live source does not exist.
- Phase 9 static and browser tests added.
- CI browser smoke updated to include Services.
- No production database or Storage mutation.

### Truth-terrain
- Published projects: 16.
- Services rows: 0.
- About Method rows: 0.
- FAQ table: absent.
- Published project cover media audited: 0.

### Gate status
- Gate de Paridade: DB-preserving, 16 projects remain 16.
- Static Phase 9 contracts: committed.
- CI: pending/in progress at phase close; not claimed GREEN.
- Lint: NOT CLAIMED GREEN.
- Typecheck: NOT CLAIMED GREEN.
- Vitest/node:test: NOT CLAIMED GREEN.
- Playwright: NOT CLAIMED GREEN.
- Gate de Mudança: NOT CLAIMED GREEN; screenshot diff runner not verified.
- Supabase Backup: external backup workflow failed, but no production writes were made.
- phase-9-green: not created.
- Production promotion: not attempted.

### Decision
Phase 9 is code-complete but BLOCKED-EXTERNAL under R3.


## Phase 10 execution log

Phase 10 rebuilt `/credentials` as a Betão & Cor dossier while preserving the current production content and truth-terrain.

### Completed
- New Credentials dossier with seven chapters: Profile, Numbers, Experience, Toolbelt, Competencies, Clients, Principles.
- H1 rendered once.
- Direct contact converted from card to a horizontal contact strip.
- WhatsApp direct link preserved through the existing helper.
- Metrics read from active stats when present, otherwise current credentials CMS cards.
- Home and Credentials now use the same credential metrics source.
- Experience centralized and ordered newest first.
- Ikigai role resolved to "Graphic Designer".
- Toolbelt replaces percentage bars with Core / Fluent / Exploring grouping.
- Current five skills preserved; no invented sixth skill.
- Competencies remain the existing three groups and cross-link to Services.
- Reusable ClientWall primitive created.
- 16 real active clients displayed as accessible names because logo_url is null for all.
- Principles moved into a full-page colour section with existing four principles and Reference.
- Legacy ghost lettering removed.
- Press Kit / CV PDF added at /api/credentials/press-kit.pdf.
- PDF route runs on Node and uses pdf-lib + qrcode-generator already installed.
- PDF reads site_settings.credentials before fallbacks.
- Static and browser tests added; CI browser gate extended.
- No database/storage mutation.

### Truth-terrain
- Published projects: 16.
- Active clients: 16.
- Active stats: 0.
- Credentials cards: 5.
- Credentials skills: 5.
- Credentials experience records: 5.
- Competency groups: 3.
- Service disciplines: 4.
- site_metrics table: absent.
- experience table: absent.
- skills table: absent.
- client logo_url values: 0 populated.

### Parity
- Projects 16 -> 16.
- Clients 16 -> 16.
- Experience 5 -> 5.
- Skills 5 -> 5.
- Metrics 5 -> 5.
- Competency groups 3 -> 3.
- Service disciplines 4 -> 4.
- Production data mutations: 0.

### Gate status
- Lint: NOT CLAIMED GREEN.
- Typecheck: NOT CLAIMED GREEN until final workflow completes.
- Vitest/node:test: NOT CLAIMED GREEN until final workflow completes.
- Playwright: NOT CLAIMED GREEN until final workflow completes.
- Vercel preview for final phase commit: NOT VERIFIED by available deployment surface.
- Gate de Mudança: NOT CLAIMED GREEN; structural screenshot evidence is not available from the current execution surface.
- Supabase Backup workflow: continues to fail externally; no production mutation was attempted.
- phase-10-green tag: not created.
- Production promotion: not attempted.

### Final phase commits
- 918b9500b3de221a2e471589869139980baf9de4
- 99662abb0b60c3a2b86aadf4c46312024bd9f671
- 83076499ca207b419090cd2f44bf9b790be6e652
- f5b4d99cb612451dd90476603023c93c71330704
- 353128d3772bc7b049e772ac7df9278757f9d8f5
- 7e3255a3a447d9838d7291a2528632fcf51ae175
- f37fa2e4adbf5385b3a9ff8df8c492a8c9753871
- 468405edab6baf5a963bd2aaa536f098873c71a0
- e71a71922f34a46defed483926ce9f31714ff154
- 5852f8a7a0deb5de69d8b7a2540f1114cfe6e2d2
- fcde0aa92b9e1f0e2c6abb4b9db190dc8c26ae26
- 116f2fb3645769afdacfcc2d5533577c9932764b
- 9863eaee0022c980d941beea16e526c80c89afb0
- 5d0b10b0c58ffb91734f8a3732b493a15aa169cf
- 86e10573a31fc34ddd540e1ea415df7003ba3863
- 776fd07db9be3a7d51d672a4abac620e9a703c11
- c6842bf9a76cf50edcf75b1481aa0e209917e7fb

### Decision
Phase 10 code is complete, but remains BLOCKED-EXTERNAL under R3. No production promotion.


## Phase 11 execution log

Phase 11 rebuilt `/contact` as a Betao & Cal five-step briefing experience and moved public submission to a server-side route.

### Completed
- Contact visual composition rebuilt with Betao background and Cal form panel.
- Removed the old large top void.
- H1 `Let's talk.` rendered once.
- Five named steps: Identity, Project, Budget, Timing, References.
- Step numbers retained because they represent a real sequence.
- Approximate completion time shown.
- Existing Project Types and Urgency taxonomies preserved.
- Budget now explicitly includes `Prefer not to say`.
- Zod validation added per step and again at final submission.
- Inline error messages use alert/aria-live semantics.
- Autocomplete and inputmode attributes added to identity/contact inputs.
- Step heading receives focus after navigation.
- Enter advances the wizard outside textarea/button controls.
- Draft persisted in sessionStorage and restored after reload.
- Final review summary added before submission.
- WhatsApp, email and existing booking integration preserved.
- `?service=` and `?ref=` handoffs preserved.
- Contact submission moved to `POST /api/contact/submit`.
- Server route validates input, handles honeypot, hashes IP and rate-limits.
- Server route writes through `supabaseAdmin`, never direct anon insert.
- Resend confirmation + internal notification path implemented server-side.
- Persistent `contact_rate_limits` table/RPC migration prepared with rollback.
- Resend delivery checker script added for `delivered@resend.dev`.
- Contract tests, browser tests and CI smoke coverage added.
- No production DB or Storage write was executed.

### Truth-terrain
- briefing_submissions: 0
- booking_requests: 0
- newsletter_subscribers: 0
- crm_leads: 0
- crm_lead_profiles: 0
- site_settings contact row: 0
- existing client/project/service/credential counts remain unchanged.

### Migration status
Prepared:
- `supabase/migrations/20260924110000_phase11_contact_security.sql`
- `supabase/rollbacks/20260924110000_phase11_contact_security.down.sql`

Not applied to production because the automatic Supabase backup workflow has not produced confirmable reversible backup evidence. This is an R1 block.

### E2E email status
`scripts/phase11-resend-check.mjs` exists and checks Resend `GET /emails/{id}` until `last_event=delivered`. The environment available to this execution did not expose Resend provider credentials, so no real delivery test was claimed.

### Gate status
- Lint: NOT CLAIMED GREEN.
- Typecheck: NOT CLAIMED GREEN.
- Vitest/node:test: NOT CLAIMED GREEN.
- Playwright: NOT CLAIMED GREEN.
- Vercel final preview: NOT VERIFIED by available deployment surface.
- Gate de Paridade: content/source counts preserved; no production rows created or removed.
- Gate de Mudança: NOT CLAIMED GREEN because formal screenshot diff evidence is unavailable.
- Supabase Backup: external workflow remains failing.
- phase-11-green tag: not created.
- Production promotion: not attempted.

### Commits
- 90522ba55196755f38e93a0bb5a5f68ec5bec793
- 4782873f4b0289f076d3d927b171dc32c572e12a
- 477453a7ee495551bf57d0d9cdfac936b4c9c74e
- 9174995ac10418cc8125499a84b6f7976d69fcbc
- c7e23d7974917a8496ca1eaf9fd84510a1cb9ea2
- 04f41b82e4e03859e778708cd67c6257d9e3e220
- efb496bbd5a16cb6747600fedf9b589af88adac7
- 4dfd507f4bd9a2d0b1945b0b83c7122d659da43c
- 82a3b0042b41d5d09a1d4f855b018a4d6582799e
- dc47328d9ccb67aa045b46c4303cb9c847c707de
- dec2f3e5a8e3e13342206bcae685f007b41b8fb2
- be1467a8f11ff69c5e4f6a08de40cc16e3b70296
- 8c523658c3d3da6a415cf35dc7d06a4e6ddbb1ba
- 3228a39c8a3d2ba07c08bc58d30f3795a463dd3b
- fde07c4bf894807bbfcfe4f18d7f5cb6f5be1dbe
- 98dc630adab73a3aa1441d7d4e4b56d2d12ef1bd
- 36f211f69cc9a132a28449373dbfa0809ac11add

### Execution environment
The execution container could not resolve github.com, so local npm install/build could not be performed. GitHub Actions and Vercel remain the authoritative external execution surfaces.

### Decision
Phase 11 is code-complete but remains BLOCKED-EXTERNAL under R1/R3. No production promotion.


## Phase 12 execution log

Phase 12 rebuilt /studio as a standalone prelaunch/lab surface.

### Completed
- Preserved the exact Studio prelaunch content required by the brief.
- Permanent black tone with fixed mint --work identity.
- Cartaz/Livro typography applied to the Studio hierarchy.
- Rectangular controls and 2px borders replace the former rounded visual system.
- SVG constellation rebuilt with pointer-reactive nodes.
- reduced-motion produces a static constellation.
- Studio nodes remain anonymous because studio_cards is empty in production.
- /admin/studio logic and internal tool data were not changed.
- Existing Explore the portfolio cross-link preserved without duplicating the navigation CTA.
- Waitlist continues through the unified newsletter source=studio path.
- Newsletter confirmation now returns to /studio?newsletter_confirm=...
- Studio fails closed until the unified newsletter migration is active, avoiding an unintended single-opt-in path.
- Confirmation, success and error states added to the Studio route.
- Existing reversible Phase 4 newsletter migration and rollback reused; no new audience schema created.
- Static and browser tests added.
- CI browser smoke extended for Studio.
- No production DB or Storage writes.

### Truth-terrain
- studio_waitlist: 2
- studio_waitlist active: 2
- newsletter_subscribers: 0
- studio_cards: 0
- public.studio_events: not found in production audit

### Migration status
The existing Phase 4 migration 20260924093000_phase4_newsletter_unified.sql remains unapplied because the Supabase backup gate is not confirmed. No data migration or schema write was executed.

### Gate status
- Lint: NOT CLAIMED GREEN.
- Typecheck: NOT CLAIMED GREEN.
- Vitest/node:test: NOT CLAIMED GREEN.
- Playwright: NOT CLAIMED GREEN.
- Gate de Paridade: PASS by preservation of Studio and global content counts.
- Gate de Mudança: NOT CLAIMED GREEN pending formal screenshot edge-diff.
- Supabase Backup: BLOCKED-EXTERNAL.
- Vercel final preview: not verified as READY for final Phase 12 HEAD.
- phase-12-green: not created.
- Production promotion: not attempted.

### Decision
Phase 12 is code-complete but remains BLOCKED-EXTERNAL under R1/R3.


### Phase 12 addendum
- 86811ada2bab53e11686b72ff46867faddd8edd8 isolates the unified newsletter schema boundary behind the server-side Supabase client because generated types still describe the legacy schema.
- 4fe45b013a42030f4373388f23b65cb09a96697a documents that correction.
- Latest CI run for the current HEAD is still in progress at npm install; no gate is being claimed GREEN.
- Latest Supabase Backup run for the current HEAD is in progress; previous Phase 12 backup runs failed.


## Phase 13 execution log

### Completed
- Audited existing Gemini text, SSE, tool-calling, TTS and Gemini Live architecture.
- Confirmed server-only GEMINI_API_KEY usage.
- Preserved the existing Live Voice ephemeral-token architecture and added RAG context to its server-generated system instruction.
- Rebuilt AiAssistantRealtime with Betão/Cor rules: 2px borders, rectangular launcher, no rounded/shadow/gradient/mono micro-labels.
- Preserved title, subtitle, welcome card and four default suggestions.
- Added route-aware contextual suggestions.
- Added dialog semantics, focus trap, Escape-to-close, focus return, aria-live log and reduced obstruction.
- Added visible privacy notice.
- Added clickable RAG source citations.
- Added tool-calling declarations for searchPortfolio, getCaseStudyDetails, sendContactRequest, generateOnePagePDF and checkAvailability.
- Connected contact handoff to /contact?message= and optional service prefill.
- Preserved existing PDF endpoints and did not create a new scheduling API.
- Added Phase 13 RAG migration + rollback.
- Added vector(768) HNSW knowledge_chunks, AI conversation/message schema and service-role match function.
- Added admin-protected reindex function.
- Added guarded reindex hooks to existing admin publish paths.
- Added session/IP guardrails, sensitive-request refusal, scope refusal, per-response and daily token budgets.
- Added privacy-safe hashed AI conversation logging with admin-only RLS.
- Added 15-question golden contract and browser QA.
- Added Phase 13 browser tests to CI.
- No production DB or Storage writes.

### Truth-terrain
- knowledge_chunks: absent in production.
- ai_conversations: absent in production.
- ai_messages: absent in production.
- vector extension: not installed in production.
- FAQ table: absent.
- studio_events: absent.
- booking API: absent.
- Existing portfolio/client/service/credential/contact counts unchanged.

### Migration status
Prepared but not applied:
- supabase/migrations/20260924130000_phase13_ai_knowledge.sql
- supabase/rollbacks/20260924130000_phase13_ai_knowledge.down.sql

R1 remains blocking because Supabase Backup has not produced confirmed reversible evidence.

### Gate status
- Lint: NOT CLAIMED GREEN.
- Typecheck: NOT CLAIMED GREEN.
- Vitest/node:test: NOT CLAIMED GREEN.
- Playwright: NOT CLAIMED GREEN.
- Gate de Paridade: PASS by zero production writes.
- Gate de Mudança: NOT CLAIMED GREEN pending formal screenshot edge-diff.
- Supabase Backup: external workflow remains failing.
- Vercel final READY evidence: not yet confirmed for final Phase 13 HEAD.
- phase-13-green: not created.
- Production promotion: not attempted.

### Decision
Phase 13 is code-complete but remains BLOCKED-EXTERNAL under R1/R3. The next phase may proceed independently only under the documented resilience rules.


### Phase 13 gate addendum
- First CI typecheck cycle found one Phase 13 error: outputBudget scope in src/lib/ai/agent.ts.
- Commit c0e8ce3bdb72785616ee8351d4ecf2fd64bf49c2 fixed it.
- Second typecheck cycle confirms the Phase 13 AI layer introduces no remaining type errors; CI still fails on the previously documented Admin/Home/Portfolio/API debt.
- Browser QA for the same HEAD reached browser installation and had not yet produced a GREEN conclusion.
- Supabase Backup for the Phase 13 HEAD remains FAILURE, so R1 stays blocked.
