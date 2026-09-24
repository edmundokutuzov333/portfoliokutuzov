# Defeitos Fase 2

| ID | Sev | Estado | Causa | Acção | Commit |
|---|---|---|---|---|---|
| DEF-001 | P0 | BLOCKED-EXTERNAL | writes anónimos em tabelas sensíveis | hotfix merged em main; migration preparada; deploy/migration produção não comprovados | 4612414968494d0db853c6232eae9f2f14a1c937 |
| DEF-002 | P1 | FIXED-IN-SOURCE | robots/sitemap/i18n legados | rebuild Phase4 | 8aa693c75909a6cc816ee9cb6729f5cee2026abc |
| DEF-003 | P1 | FIXED-IN-SOURCE | sistema visual legado | rebuild Phase3/5 | 8aa693c75909a6cc816ee9cb6729f5cee2026abc |
| DEF-004 | P1 | OPEN | verdade-terrain 16 projects vs baseline v2 106 | R12 impede inventar dados | N/A |
| DEF-005 | P1 | FIXED-IN-SOURCE | site_metrics não aplicado à produção | Home/Credentials agora usam site_metrics; backfill preparado a partir de credentials.cards; produção ainda não migrada | 89b5c9b69fac47655bb0028209a4ba7019050b83 |
| DEF-006 | P1 | FIXED | A6 patterns e performance workflow | remove inline eslint-disable e || true | 46ca037401e93d5d0a548f60c9051d0ad83cd3a9 / 6e16d600ae42e4ca5dcd16c85e391a05fb4d92a1 |
| DEF-007 | P1 | OPEN | Lighthouse Desktop Home 0.75 | atacar bundle/LCP sem baixar threshold | 9000d8a2b4a13bc304031cd7afba08fd9661f42c |
| DEF-008 | P1 | OPEN | JS/fonts acima do budget | root modules diferidos, font preconnect removido, medição final pendente | 9000d8a2b4a13bc304031cd7afba08fd9661f42c |
| DEF-009 | P1 | BLOCKED-EXTERNAL | Storage upload público em produção | migration P0 remove policy, ainda não aplicada | 20260924160000_phase2_p0_rls_boundary |
| DEF-010 | P1 | OPEN | main não comprovadamente deployado após hotfix | Vercel não expôs deployment do commit 4612414 | 4612414968494d0db853c6232eae9f2f14a1c937 |
