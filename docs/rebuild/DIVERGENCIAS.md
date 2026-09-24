# Divergências — Verdade-terreno vs Parte B

Data da auditoria: 24/09/2026.

R12 applies: the live repository, production response and production database win over the supplied visual description. No data was changed to force the audit numbers to match.

| ID | Parte B / expectativa | Verdade-terreno observada | Tratamento |
|---|---|---|---|
| DV-01 | Portfolio esperado: 106 itens | public.projects contém 16 registos publicados; src/data/projects.ts contém 16 entradas de fallback | Não alterar dados. Gate de paridade deverá usar o inventário real. |
| DV-02 | Clientes/logos: ≥23 | public.clients contém 16 clientes activos; src/data/clients.ts contém 16 nomes | Não inventar clientes. |
| DV-03 | Home H1 descrito como “I shape ideas…” | HTML actual de produção usa composição “I make ideas / stop, take notice, / stay in memory, / and act.” | Registar e manter até a fase de página correspondente. |
| DV-04 | Credentials métricas descritas como 08 / 120+ / 16 / 03 | Produção/BD actual usa 6+ / 150+ / 30+ / 3 / 360º via site_settings.credentials | Não normalizar na Fase 1. Resolver pela regra D-04/R11. |
| DV-05 | Home descrita com 7+ / 150+ / 30+ / 3 / 360º | Código actual contém fallback de Home com esses valores, mas a fonte dinâmica stats está vazia na BD | Não inventar/alterar fonte durante baseline. |
| DV-06 | Reel ~15 cartas em leque 3D com imagens | CinematicPortfolioReel deriva de useProjects e filtra cover_url; os 16 projectos da BD actualmente têm cover_url = null. | Preservar implementação. Investigar/reestruturar apenas na Fase 6. |
| DV-07 | public.stats / about_method populated | Ambas as tabelas estão vazias (0 rows) | Componentes continuam com fallback existente; nenhuma escrita em produção. |
| DV-08 | ≥23 clientes e 5 experiências como fonte de BD | Não existe tabela experience no inventário; experiência é actualmente hard-coded em componentes e contém 5 entradas. | Mapear fonte actual; não migrar dados na Fase 1. |
| DV-09 | Produção sofreu HTTP 500 para non-browser | Deployment actual 58f1e911... está READY; runtime-error clusters de SOCIAL_IMAGE e Supabase env vars pertencem a deployments anteriores. | Não aplicar hotfix especulativo. Continuar com testes HTTP reais e registar resultados. |
| DV-10 | Website + apex/www devem ser auditados separadamente | edmundokutuzov.art respondeu 200 via Vercel fetch; www.edmundokutuzov.art respondeu 308 para apex. | Redirect considerado candidato correcto; validar com curl real sem o wrapper do Vercel. |
| DV-11 | SEO sem noindex acidental | Apex HTML tem meta robots index,follow,max-image-preview:large; resposta não expôs X-Robots-Tag | Sem alteração na Fase 1. |
| DV-12 | Supabase runtime corresponde à fonte pública | Código contém fallback uqcuzsuqkutxjqkopary; projecto Supabase actual é hdmopgkbragcoirhabhi | Não substituir cegamente; requer investigação específica de configuração/fallback.

## Production runtime errors observed
- Histórico: SOCIAL_IMAGE is not defined (17 ocorrências, 22/09/2026), associado a deployment anterior.
- Histórico: Supabase server env vars ausentes em deployments anteriores.
- Isolados: erros 503 do Gemini e 403 ORIGIN_NOT_ALLOWED no chatbot.
- Não foi identificado um cluster 500 activo no deployment actualmente READY.

## Decisions
Nenhuma correcção de dados ou migração foi feita apenas para alinhar a Parte B. A realidade será a fonte dos gates seguintes.

12. **DV-13 — Canonical SSR:** produção em /portfolio, /services, /credentials e /contact responde 200 mas emite canonical para /. O código raiz era responsável por injectar o canonical global; hotfix preparado.
13. **DV-14 — Studio robots:** /studio responde 200 mas emitia noindex,nofollow apesar de ser uma rota pública de Studio. Hotfix preparado para index,follow.
14. **DV-15 — 404 SEO:** a resposta 404 ainda inclui robots index,follow e canonical da Home. Registado para a fase de Error/SEO, sem alterar agora além do escopo do hotfix público.


## Fase 4 — decisões de verdade-terreno

15. **DV-16 — PT content source:** não existe uma fonte de conteúdo PT-PT comprovada para as páginas públicas. /pt/* reutiliza o conteúdo factual existente e traduz apenas o chrome/UI. Nenhuma tradução editorial foi inventada.
16. **DV-17 — Newsletter schema:** public.newsletter_subscribers já existe e studio_waitlist continua a conter os registos históricos. A Fase 4 adiciona a migration de unificação, mas não a aplica enquanto o backup R1 não estiver confirmado.
17. **DV-18 — Availability:** não havia um campo dedicado de disponibilidade na fonte única usada pelo shell. Foi criado um setting aditivo em site_settings e um editor administrativo; a alteração só passa a controlar produção depois de publicação pelo Release Management.
18. **DV-19 — Public shell rollout:** as páginas internas continuam com o styling antigo nesta fase, de acordo com o contrato da Fase 4. O novo shell, navegação, footer, idioma, SEO e acessibilidade global são aplicados na camada raiz sem reescrever ainda o conteúdo interno das páginas.


## Fase 5 — Home

20. **DV-20 — Portfolio count:** Parte B/Phase 5 describe 106 projects; truth-terrain has 16 published rows. The Home displays the real 16 count, not 106.
21. **DV-21 — Featured media:** six published projects are marked featured, but all six have no cover_url and empty gallery arrays. The Home uses their real title/client/category/year metadata and the existing palette colour, without fabricating media.
22. **DV-22 — Client logos:** 16 active clients exist, but all logo_url values are null. The Home ClientWall therefore uses accessible text names rather than invented logo assets.
23. **DV-23 — Metrics/services:** public.stats and public.services both contain zero active rows. The Home uses existing CMS credential metric cards and the existing four Services page discipline definitions as fallbacks; no production rows were created.
