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


## Fase 6 — Selected Portfolio Reel

24. **DV-24 — Reel media:** the visual audit describes a real 3D reel with roughly 15 image cards, but the current production project source has 16 published projects with 0 cover_url values, 0 gallery rows and 0 gallery_meta rows. R12 therefore wins: the Phase 6 component cannot fabricate image/video URLs. It renders truthful project metadata and Work Colour posters when real media is unavailable.
25. **DV-25 — Reel persistence schema:** production has no reel_items or reel_analytics tables. A reversible migration was prepared but deliberately not applied because R1 backup evidence is not confirmed and Phase 5 remains BLOCKED-EXTERNAL.
26. **DV-26 — Reel ordering:** the planned DR-09 round-robin ordering is implemented deterministically at runtime from the existing project categories. Admin-pinned ordering remains reserved for Phase 14.


## Fase 7 — Portfolio

27. **DV-27 — Portfolio count:** the visual brief expects 106 published projects, but production truth is 16. The archive renders the real 16 rather than fabricating records.
28. **DV-28 — Category taxonomy:** production contains legacy labels (Branding, Campaign, Digital, Editorial, Experimental) in addition to current labels. R12 wins; the archive normalizes these legacy labels to the current public taxonomy "Digital Design" while preserving the underlying DB values.
29. **DV-29 — Media absence:** the archive is designed for real cover/gallery media but the current project inventory has no published cover/gallery assets. Work Colour title posters are used as a truthful fallback; no image URL is invented.


## Fase 8 — Case Studies

30. **DV-30 — Case-study richness:** a Parte B/B.5 expectativa de case studies multimédia não corresponde à base actual. Os 16 projectos publicados têm 0 covers, 0 galleries, 0 videos; project_sections, project_media, project_metrics, project_credits e project_relations estão presentes no schema mas têm 0 rows. O motor novo usa fallback determinístico e não fabrica narrativa, métricas ou media.
31. **DV-31 — Case-study source model:** existe um modelo editorial modular real no schema, além dos campos legados de public.projects. O novo template lê ambos: campos de projects como fonte factual e tabelas editoriais publicadas quando houver conteúdo.
32. **DV-32 — Work Colour data:** as colunas dominant_color/accent_color preparadas em fases anteriores não estão confirmadas na produção actual. A Fase 8 usa palette já existente e o fallback cobalt definido pelo design system; não executa backfill nem alteração de schema.



## Fase 9 — Services

33. **DV-33 — Services source:** a Parte B pressupõe quatro disciplinas estruturadas e dados CMS activos. Na produção actual, `public.services` contém 0 rows. O novo Services usa as quatro definições estruturadas já existentes em `src/data/disciplines.ts`, sem criar rows ou alterar a BD.
34. **DV-34 — Method source:** `public.about_method` contém 0 rows. Apesar de existir seed histórico em migrations, não é considerado conteúdo publicado actual. A secção "How the studio works" fica oculta até existir fonte editorial activa; Credentials passa a apontar para Services.
35. **DV-35 — FAQ source:** não existe tabela pública de FAQ no schema actual. A estrutura Radix Accordion foi preparada, mas permanece oculta enquanto não houver perguntas/respostas reais.
36. **DV-36 — Service work media:** os 16 projectos publicados têm `cover_url = null`. A ligação entre Services e Portfolio usa títulos, clientes, anos, categorias, tags e cores reais, sem inventar thumbnails ou imagens.



## Fase 10 — Credentials

37. **DV-37 — Métricas:** o plano prevê uma fonte `site_metrics`, mas a produção actual não tem essa tabela. A fonte factual disponível para Credentials é `site_settings.credentials.cards`, com 5 métricas: 6+, 150+, 30+, 3 e 360º. A Fase 10 usa essa fonte existente e não cria uma nova tabela sem backup/migration.
38. **DV-38 — Experiência:** não existe uma tabela pública `experience`. A fonte actual é `site_settings.credentials.experience` com 5 registos. A Home tinha uma variante hard-coded com "Senior Graphic Designer" para Ikigai; a verdade-terreno conservadora é "Graphic Designer", e a Fase 10 centraliza essa versão.
39. **DV-39 — Skills:** a auditoria visual refere seis skills, mas a fonte actual contém cinco: Adobe Photoshop 95, Adobe Illustrator 75, Adobe Premiere 75, Adobe After Effects 45 e Artificial Intelligence 95. "Vibe Coding" não foi encontrado na fonte actual. A Fase 10 não inventa o sexto skill; o Toolbelt renderiza os cinco reais.
40. **DV-40 — Clientes:** a produção tem 16 clientes activos e nenhum `logo_url`. A Fase 10 usa os 16 nomes como representação acessível e não fabrica logótipos.
41. **DV-41 — PDF:** não existia Press Kit/CV específico de Credentials. A Fase 10 adiciona uma rota Node read-only que gera o documento a partir das fontes actuais e inclui QR para o portfolio. Nenhuma persistência é criada.
