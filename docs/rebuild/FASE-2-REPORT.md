# Relatório — Fase 2: Fundação técnica, CI/CD e guardrails

## Resumo

A fundação técnica foi endurecida sem tocar na composição visual pública. Node 24/Nitro/Vercel ficam formalmente documentados, CSP passa para Report-Only, /admin* recebe noindex via Vercel, Speed Insights foi integrado e os gates de parity, change-gate, performance e Playwright smoke foram adicionados ao CI. A fase não promove produção nem altera dados.

## Commit(s) / tag

Principais commits da execução:
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

No phase-2-green tag was created: Phase 1 remains BLOCKED-EXTERNAL and, by the 1 → 2 dependency, this phase cannot be marked green yet.

## Preview Vercel

The project is generating Vercel previews for pushes to awwwards-rebuild. Latest observed preview:
https://portfoliokutuzov-fr36fbqe0-kutuzov.vercel.app

Latest observed state at report time: QUEUED. Intermediate Phase 2 previews reached READY.

## Ficheiros criados/alterados

- package.json
- package-lock.json
- src/routes/__root.tsx
- vercel.json
- .github/workflows/ci.yml
- scripts/phase2-performance-budget.mjs
- scripts/change-gate.mjs
- scripts/parity.mjs
- tests/phase2-foundation.test.mjs
- docs/ARCHITECTURE.md
- docs/rebuild/FASE-2-REPORT.md
- docs/rebuild/STATE.md

## Dependências

- @vercel/speed-insights@2.0.0
- pixelmatch@7.2.0
- pngjs@7.0.0

Speed Insights is runtime instrumentation. pixelmatch and pngjs are dev tooling for visual regression. No visual/UI framework was introduced.

## Comandos e resultado

- lint: wired into CI; runner result unavailable from this connector.
- typecheck: wired into CI; runner result unavailable from this connector.
- Vitest/regression: npm test remains in CI; runner result unavailable from this connector.
- Playwright smoke: wired into CI for Chromium critical journeys; runner result unavailable from this connector.
- parity: npm run test:parity implemented.
- change-gate: npm run test:change-gate implemented; returns NOT_APPLICABLE when no after screenshots exist for a page phase.
- performance: npm run test:performance implemented with JS/CSS/font/LCP budgets.

## Gate de Paridade

Phase 2 does not touch content. Ground truth remains Portfolio 16, Clients 16, Experience 5, Competency groups 3, Studio waitlist 2, Storage objects 0. The parity guard checks the four static content counts against the Phase 1 inventory. Full DB parity remains a runtime gate.

## Gate de Mudança

Not applicable: this phase does not alter public page composition. The runner is ready for page phases.

## Requisitos resolvidos

- Node 24 and .nvmrc aligned.
- Nitro vercel preset documented.
- CI on awwwards-rebuild now includes parity, change-gate, performance and Playwright smoke.
- Vercel CSP changed to Report-Only.
- X-Robots-Tag noindex added to /admin* and /edmundo-control-room*.
- Canonical www → apex redirect formalized in vercel.json.
- Speed Insights integrated at the root.
- Performance budgets automated.
- Runtime architecture documented.

## Checklist Não quebrei nada

- [x] No Supabase/Storage data mutation.
- [x] No migration created.
- [x] No public page redesign.
- [x] Reel component untouched.
- [x] Existing Playwright browser matrix preserved.
- [ ] Final lint/typecheck/Vitest/Playwright gates cannot be marked green because GitHub Actions run results are not exposed by this execution surface.
- [ ] Latest preview is still queued.

## Decisões autónomas

1. Kept Node 24 because the repository was already pinned to 24.x and Vercel supports Node 24 LTS for builds and functions.
2. Kept iad1, the region observed in existing deployments, to avoid an unnecessary operational change.
3. Kept CSP in Report-Only as specified; enforcement remains a Phase 15 action.
4. Made change-gate explicitly NOT_APPLICABLE during non-page foundation phases instead of inventing after screenshots.
5. Added no migrations because Phase 2 has no schema requirement.

## Riscos / dívida técnica

- Phase 1 remains BLOCKED-EXTERNAL because its external backup/runner evidence is not confirmed.
- Vercel-side Observability dashboard activation is external account configuration; code instrumentation is committed.
- The 16-project ground truth versus the 106 described in the source remains documented under R12.

## Avança automaticamente

No. Phase 2 is technically implemented but remains BLOCKED-EXTERNAL while the Phase 1 gate chain is unresolved. This preserves R3/R10.