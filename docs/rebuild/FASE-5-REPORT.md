# Relatório — Fase 5: Home (/)

## Resumo

A Home foi reconstruída em composição Betão & Cor, reduzindo a antiga página repetitiva a uma sequência editorial curta: palco, Featured Work, Services, Proof e Reference, com o sexto bloco de fecho entregue pelo footer global quando a rota é /.

O H1 aprovado aparece uma única vez; o Reel 3D protegido foi apenas montado dentro do palco através do wrapper existente. Nenhum dado do Supabase/Storage foi alterado.

A implementação respeita a verdade-terreno: existem 16 projectos publicados e 6 featured, mas nenhum dos seis featured tem cover/gallery; há 16 clientes activos sem logos e não há rows activas em stats/services. Nenhum conteúdo visual foi inventado.

## Commit(s) / tag

Principais commits da Fase 5:

- 91b26a31997c5458488431d3fd98c5301759f550 — HomePhase5
- 102faf6628e85a77e1dd03c3a9416eb369c00c81 — route switch
- 7e31b41afaf4606e569b3f85b71c6725820366d3 — homepage-aware footer close
- 6f2199167ac80868df58a5df68b053f0eaf709ca — featured CMS copy + mobile Reel
- ccf0766031ddc7cc867831c4549270712551ff71 — existing discipline source export
- 267ceca56a37f655c51e69532c32ec6dc1099d3d — shared discipline consumer
- e6ae3fa83967dcb5e5eae968a735c7b8c563e899 — lightweight Home service source
- 2489a439b833c8c3949e76cbd6d8ccaac7bf97a9 — phase5 contract tests
- 5c77970c90ab12360965f7f0e146963553c6a026 — test refinement
- fd064581eb0135f065ea8e6a6c92785ef7c513d8 — remove unsupported Reference explanatory copy
- 1ecd23939d26c60791e4de647eeac017c23184dc — availability in Home footer close
- b77c461e3567a0b9e70b56a7c9188425e6e8af2 — media-safe featured composition refinement
- a316fe5df5c36f1433379af8f551f1a2a06c3366 — test alignment
- 4b8204c9d5845998d224ec3c9df25b03a7f88885 — work-colour media-safe fallback
- 29efab385aacaebce702c9ad13fb2cdfd2477f9b — shared discipline data file on awwwards-rebuild
- 50d492ac8ea9067ca2b2a228456e74b1bd3b3342 — STATE
- 31298305515ddc0b2aa0e09aa87f356b86dcea8d — divergences

No phase-5-green tag was created.

## Preview Vercel

The first complete code-bearing Phase 5 commit 91b26a31997c5458488431d3fd98c5301759f550 reached READY:

Deployment: dpl_9VdbApxzNMgmpymhvuBAE9tmNtqJ

Preview:
https://portfoliokutuzov-jlfm94sum-kutuzov.vercel.app

Later commits were not given fresh build evidence because the latest Vercel status is failure with the external build-rate-limit target. This prevents claiming the current tip is READY.

## Ficheiros principais

- src/components/home/HomePhase5.tsx
- src/routes/index.tsx
- src/components/layout/Footer.tsx
- src/data/disciplines.ts
- src/components/services/ServicesInteractive.tsx
- tests/phase5-home.test.mjs
- docs/rebuild/STATE.md
- docs/rebuild/DIVERGENCIAS.md

The existing src/components/home/DeferredReel.tsx was not edited.

## Home composition

### 1. Palco

- Exact H1: I shape ideas that cut through noise, stay in memory, and move people.
- Rendered once.
- Archivo/Cartaz heavy display typography.
- Newsreader body copy.
- Roles: Art director · Social media manager · AI expert.
- Availability reads Phase 4 admin setting.
- Primary action is only Start a project.
- Existing DeferredReel remains lazy and protected, mounted inside the hero rather than rewritten.

### 2. Featured Work

- Reads only featured=true and published projects.
- Current truth-terrain: 6 records.
- Supports up to eight without changing database data.
- Hover/focus drives --work using the existing project palette field where an actual hex value exists.
- No fake media: absent cover/gallery is represented by the project's work colour rather than invented artwork.
- Archive count is dynamic from the published project query.

### 3. Services

- Reuses the exact four discipline definitions already used by the existing Services page.
- Billboard rows.
- aria-expanded, click, focus and hover states.
- Link to /services.
- Static source extracted to src/data/disciplines.ts so the full ServicesInteractive runtime is not imported into the initial Home bundle.

### 4. Proof

- Metrics read active public.stats first.
- Because public.stats has zero active rows, the existing CMS credentials.cards source is used without modifying it.
- Current active clients count is 16 and all names remain visible.
- Current role is linked to Credentials.

### 5. Reference

- credentials.reference remains the source.
- Current real value: GOD.
- Legacy ghost typography removed.
- No extra factual copy was invented.

### 6. Closing block

The global footer becomes Home-aware and provides the single closing block:

Tell me what you're building. I'll show you how to make it impossible to ignore.

It keeps Start a project, email and the managed availability state.

## Performance decisions

No new dependency was installed.

The Home imports the lightweight discipline source rather than the entire ServicesInteractive module. The Reel remains lazy through the existing DeferredReel boundary.

The LCP candidate is the textual H1; Reel loading remains deferred.

No image optimisation was invented where source media does not exist.

## Data parity

Final production read-only inventory at execution:

| Entity | Before | After |
|---|---:|---:|
| Published projects | 16 | 16 |
| Featured published projects | 6 | 6 |
| Active clients | 16 | 16 |
| Active stats | 0 | 0 |
| Active services | 0 | 0 |
| Active subscribers | 0 | 0 |
| Studio waitlist | 2 | 2 |

No DB writes or Storage writes were performed.

## Gate de Mudança

The Phase 5 page contract was statically checked through the repository connector:

11 / 11 structural contract checks passed.

The formal screenshot Gate de Mudança is NOT CLAIMED GREEN because the required Playwright runner and baseline/after screenshot execution are not available through the current execution surface. No structural diff percentage was fabricated.

Expected signals implemented:

- S1 new poster/grid layout paradigm — yes.
- S2 new Cartaz/Livro typography roles — yes.
- S3 new flat rectangular component language — yes.
- S4 H1-specific motion and work-colour interaction — yes.
- S5 tone rhythm Preto / Betão / Preto / Betão / Preto — yes.
- S6 new content hierarchy and order — yes.

Formal K1-K15 verification remains runner-gated.

## Comandos e resultado

- Static repository contract checks: PASS 11/11.
- Lint: NOT CLAIMED GREEN.
- Typecheck: NOT CLAIMED GREEN.
- Vitest/node:test via external runner: NOT CLAIMED GREEN; latest GitHub workflow lookup returns zero runs.
- Playwright: NOT CLAIMED GREEN.
- Lighthouse mobile/desktop: NOT RUNNABLE from current surface.
- Vercel: one Phase 5 preview reached READY; latest tip remains blocked by build-rate-limit.

## Defeitos tratados

- D-01: Home headline duplication removed by rendering the exact sentence once.
- D-04: Home no longer hard-codes contradictory metric numbers; values come from the existing CMS credentials source until a real site_metrics table exists.
- D-06: Services remain a separate selling taxonomy and reuse the existing four-service definitions.
- D-08: Primary CTA hierarchy reduced to Start a project.
- D-09: Homepage close consolidated into one global footer closing block.
- D-10: Blue italic H1 formula removed.
- D-11: Home no longer uses mono micro-label treatment.
- D-17: Client wall uses one text-based component pattern because the current DB has no logo assets.

D-18 remains protected for Phase 6 and was not changed.

## Lista de Abate

The new Home avoids:

- floating pill navigation;
- pill buttons;
- rounded content cards;
- blue italic headline accents;
- mono eyebrows;
- skill percentage bars;
- placeholder metric boxes;
- gradients/glows as the default language;
- client chip walls;
- hover-only service interaction;
- repeated CTA blocks;
- cut-off marquee logos;
- sub-14px micro-labels;
- irrelevant sequence numbering;
- universal outbound-arrow buttons.

A semantic live-status dot remains rounded because its shape is a status indicator, not a content container.

## Checklist “Não quebrei nada”

- [x] Existing Home route preserved.
- [x] Existing Portfolio route preserved.
- [x] Existing Reel component preserved.
- [x] Existing CMS data preserved.
- [x] No production DB mutation.
- [x] No Storage mutation.
- [x] No secrets added.
- [x] No new package dependency.
- [x] Shared services source extracted without changing service semantics.
- [ ] Formal lint/typecheck/Vitest/Playwright green.
- [ ] Formal visual change gate green.
- [ ] Fresh Vercel READY on final tip.
- [ ] phase-5-green tag.

## Decisões autónomas

1. Treat the global footer as the Home's sixth closing block to satisfy both the Phase 5 one-close requirement and the Phase 4 global-footer contract.
2. Use actual public.projects.featured records rather than changing featured data.
3. Use project palette as a temporary data-driven Work Colour source because the real dominant_color pipeline is not populated yet.
4. Use text client names because the database has no logo assets.
5. Keep services sourced from the existing page definition rather than creating empty public.services rows.
6. Keep public stats sourced from the existing credentials.cards CMS fallback because public.stats is empty.
7. Extract the four static service definitions into a shared module to avoid inflating the Home's initial JS bundle.

## Riscos / dívida técnica

- Fases 1–4 remain BLOCKED-EXTERNAL.
- Formal visual screenshot gate has not been executed.
- Latest Vercel builds are rate-limited.
- Project media and client logos are missing from current production data.
- public.stats and public.services have no active rows; they remain data-model debt for Phase 14.
- Work Colour currently derives from legacy palette strings rather than populated dominant_color fields; Phase 6/14 will have the definitive pipeline.

## Avança automaticamente

Não para GREEN. The Phase 5 implementation is committed to awwwards-rebuild, and the first code-bearing preview reached READY, but R3 cannot be satisfied while the required external runner evidence and current Vercel build evidence remain blocked.
