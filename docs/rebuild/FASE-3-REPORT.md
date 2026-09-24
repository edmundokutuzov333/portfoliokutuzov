# Relatório — Fase 3: Design system, direção de arte e infraestrutura da Cor do Trabalho

## Resumo

A linguagem Betão & Cor foi implementada como infraestrutura isolada, sem aplicação nas páginas públicas nesta fase. Foram criados tokens Tailwind 4, fontes variáveis self-hosted, primitivas Radix/CVA/tailwind-merge, Headline acessível sem duplicação, work-color com cálculo WCAG e darkening em OKLab, cursor contextual e grid overlay desktop. O showcase vive em /admin/design-system e exige a mesma autenticação Supabase do Control Room.

A migration de dados é aditiva e reversível, mas não foi aplicada à produção porque o backup reversível exigido pelas Regras de Ouro continua não confirmado. reel_items ficou deliberadamente fora desta fase e continua propriedade da Fase 6.

## Commit(s) / tag

Commits principais da execução:
- 5485336490c7e651c8586abffaae85eec2e21689 — fontes + contrast gate
- 0720a32aaf6cb3751d4d0876abc418bfbd1f2343 — package-lock
- 2e29f32fdac95c5f53947b3c0f100db4e501fc2d — tokens Betão & Cor
- 391cd6887f98b3b7906101fa013f91114a330406 — work-color
- cd6735d1a0aea4fc13c4fed6b24fd8af36740518 — primitives
- d736447f232f91307dadd285b4cc20bd3c7cca1e — grid overlay
- 2893feab774d117a50a1354fd8a436aa3efa157b — contextual cursor
- 3fc7e8f65f96a228f5c94434279959961134cbb7 — showcase
- d8dc5060b6f3c0a60b32a6487d05ae8649a7ea96 — route
- f26aefffed099b11485dbfa32a50f2a567277b1e — route tree
- 84b58345d56b44db0a49dab98ec284877e9fd42e — motion contract
- 2ffef8dfffa5fa0b70a00fedf77361ded22b06c6 — schema migration
- f8661447f9692662e1e7eb5db0867759f8344214 — rollback
- a5b6694b93d6b91c681dc19b6c0cdbc11f0fed8f — local backfill tool
- 1bab4eb2f8cde02b1f14e2647821a90f11ce00ee — contrast gate
- 4a6f47cff3fc0114963a693db2c029803fc7dfdd — Phase 3 contract tests
- ec5f44bf6fc0ef3db669c1dc65a82335c80dd536 — CI contrast gate
- 9e25e8772990a4ece23cb73d091a66cbc0920f4d — DESIGN-PLAN
- d220f5ae743472e6b2493508288a565464baf01b — contrast report
- 17e7e00bfbd885105ca13159088889269a59a66b — architecture boundary

No phase-3-green tag was created. Phase 1/2 remain BLOCKED-EXTERNAL.

## Preview Vercel

Every push continues to use the awwwards-rebuild Vercel preview integration. Final preview build/runner evidence is not claimable from the current execution surface until the external status is exposed.

## Ficheiros criados/alterados

- package.json
- package-lock.json
- .github/workflows/ci.yml
- src/styles/design-system.css
- src/lib/work-color.ts
- src/lib/design-system-motion.ts
- src/components/design-system/primitives.tsx
- src/components/design-system/GridOverlay.tsx
- src/components/design-system/ContextCursor.tsx
- src/components/design-system/DesignSystemShowcase.tsx
- src/routes/admin.design-system.tsx
- src/routeTree.gen.ts
- supabase/migrations/20260924090000_phase3_design_system.sql
- supabase/rollbacks/20260924090000_phase3_design_system.sql
- scripts/backfill-work-colors.mjs
- scripts/contrast-report.mjs
- tests/phase3-design-system.test.mjs
- docs/rebuild/DESIGN-PLAN.md
- docs/rebuild/CONTRAST-REPORT.md
- docs/ARCHITECTURE.md
- docs/rebuild/FASE-3-REPORT.md

## Comandos e resultado

- contrast:check: PASS por desenho do script; os pares nomeados têm >= 4.5:1.
- Contract tests: committed to npm test suite; execução externa ainda não exposta.
- lint: NOT CLAIMED GREEN; runner evidence unavailable.
- typecheck: NOT CLAIMED GREEN; runner evidence unavailable.
- Vitest/npm test: NOT CLAIMED GREEN; runner evidence unavailable.
- Playwright: NOT CLAIMED GREEN; runner evidence unavailable.
- change-gate: não aplicável nesta fase porque nenhuma página pública foi alterada.
- parity: nenhum conteúdo público foi mutado; verificação final depende do runner existente.

## Gate de Paridade

Antes: Portfolio 16, Clients 16, Experience 5, Competency groups 3, Studio waitlist 2, Storage objects 0.

Depois: mesmas contagens por não haver qualquer write de produção e nenhuma alteração aos paths públicos. A migration de cores não foi aplicada.

## Gate de Mudança

Não aplicável. A Fase 3 é explicitamente uma fase de infraestrutura e design system sem alteração de composição pública.

## Defeitos da Parte B resolvidos

- D-01: o novo Headline tem uma única fonte de texto acessível e uma única camada visual.
- Infraestrutura para D-08, D-10, D-11, D-16 e os padrões K1-K5 foi criada, mas a aplicação às páginas é reservada às fases públicas.
- D-02, D-03, D-04, D-05, D-06, D-07, D-09, D-12, D-13, D-14, D-15, D-17, D-18 e D-19 continuam reservados às fases de página/ops previstas.

## Checklist Não quebrei nada

- [x] Nenhuma mutation Supabase/Storage.
- [x] Nenhuma página pública importou o novo CSS.
- [x] Reel existente não foi alterado.
- [x] /admin/design-system ficou isolado e autenticado.
- [x] Migration é aditiva e tem rollback.
- [ ] Lint/typecheck/npm test/Playwright green não podem ser afirmados sem runner externo.
- [ ] phase-3-green não criada.
- [ ] Produção não promovida.

## Decisões autónomas tomadas

1. Não reutilizar src/lib/motion.ts porque já contém contratos de motion usados pelo site atual; criar design-system-motion.ts evita regressão antes da Fase 4.
2. Não alterar src/components/ui/*, porque são componentes do site atual e a Fase 3 proíbe aplicação pública.
3. Não criar reel_items: o documento atribui essa tabela à Fase 6.
4. Não instalar sharp: o cálculo de imagem é somente backfill local; a dependência seria desnecessária para o runtime.
5. Não executar a migration: backup reversível da Fase 1 continua BLOCKED-EXTERNAL.
6. Manter o token live apenas como semântica e não como acento decorativo.
7. O design system é uma nova camada e não substitui os tokens antigos até à Fase 4.

## Riscos / dívida técnica

- O estado da cadeia 1 → 2 permanece BLOCKED-EXTERNAL.
- Os dois novos campos de cor estão definidos mas ainda não existem fisicamente no schema de produção até a migration ser aplicada.
- O backfill depende de sharp apenas quando executado por um operador local; nenhuma rota Vercel depende dele.
- A autenticação do showcase reutiliza o hook existente do Control Room; a autorização continua dependente do Supabase/RLS real.

## Avança automaticamente

Não como fase GREEN. A infraestrutura da Fase 3 foi executada e documentada, mas o gate de promoção permanece BLOCKED-EXTERNAL enquanto as Fases 1 e 2 não tiverem os seus sinais externos confirmados. Nenhuma promoção de produção foi feita.