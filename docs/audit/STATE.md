# QA Hardening State

Project: edmundokutuzov.art
Production baseline: 9fd078cef7a3c2c24ca88b9ae64031fa8260389b
Reconciled rebuild: 8aa693c75909a6cc816ee9cb6729f5cee2026abc

## Fase 1
BLOCKED-EXTERNAL / NO-GO.

## Fase 2
- [x] 2.1 Triagem por causa raiz
- [x] 2.2 Reconciliar rebuild v2 com a verdade-terrain
- [x] 2.3 Fechar P1 estruturais no código do rebuild onde a implementação já existia
- [x] 2.4 Endurecer A6 e thresholds Lighthouse sem baixar gates
- [x] 2.5 Preparar contenção P0 em main
- [x] 2.6 Criar migration de fronteira RLS/Storage
- [x] 2.7 Centralizar site_metrics no rebuild e preparar backfill reversível
- [x] 2.8 Fechar documentação, ledger, evidências e issues
- [ ] 2.9 Verificar deploy do P0 hotfix em produção
- [ ] 2.10 Aplicar migration P0 em produção
- [ ] 2.11 Reauditoria E2E completa
- [ ] 2.12 Duas execuções audit:all verdes
- [ ] 2.13 Release gate

## Tracking
- GitHub issue #25: P0 RLS/Storage deployment verification
- GitHub issue #26: P1 Lighthouse and JS/font budgets

## Estado actual
NO-GO / BLOCKED-EXTERNAL.

main está no commit 4612414968494d0db853c6232eae9f2f14a1c937, com o hotfix P0 merged. Vercel não expôs deployment desse commit nesta sessão. A migration 20260924160000_phase2_p0_rls_boundary.sql continua sem aplicação para não quebrar a aplicação pública antiga sem o transporte server-side verificável.

qa-hardening contém o rebuild v2, os gates de auditoria, source-of-truth site_metrics, backfill reversível, hardened Lighthouse, A6 clean state e o runbook.

Não existe audit-2-done nem pre-release tag. O release gate não foi satisfeito.
