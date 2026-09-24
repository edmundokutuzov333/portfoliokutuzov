# Defeitos Fase 2

| ID | Sev | Estado | Causa | Acção |
|---|---|---|---|---|
| DEF-001 | P0 | BLOCKED-EXTERNAL | writes anónimos em tabelas sensíveis | hotfix merged em main; migration 20260924160000 preparada; deploy/migration produção não comprovados |
| DEF-002 | P1 | FIXED-IN-SOURCE | robots/sitemap/i18n legados | rebuild Phase4 |
| DEF-003 | P1 | FIXED-IN-SOURCE | sistema visual legado | rebuild Phase3/5 |
| DEF-004 | P1 | OPEN | verdade-terrain 16 projects vs baseline v2 106 | R12 impede inventar dados |
| DEF-005 | P1 | OPEN | site_metrics não aplicado à produção | migration preparada, produção inalterada |
| DEF-006 | P1 | FIXED | A6 patterns e performance workflow | remove inline eslint-disable e || true |
| DEF-007 | P1 | OPEN | Lighthouse Desktop Home 0.75 | atacar bundle/LCP sem baixar threshold |
| DEF-008 | P1 | OPEN | JS/fonts acima do budget | root modules agora diferidos, preconnect Google removido; ainda sem medição nova |
| DEF-009 | P1 | BLOCKED-EXTERNAL | Storage upload público em produção | migration P0 remove policy, ainda não aplicada |
| DEF-010 | P1 | OPEN | main não comprovadamente deployado após hotfix | Vercel não expôs deployment do commit 4612414 |
