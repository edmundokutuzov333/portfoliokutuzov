# Relatório — Fase 4: Casca global, i18n, cmdk, SEO e acessibilidade

## Resumo

A Fase 4 introduz a nova casca global sobre as rotas públicas sem reescrever o conteúdo interno das páginas. Header, footer, mobile menu, idioma, View Transitions, loading state, 404/error, newsletter, disponibilidade, command palette, sitemap, robots, manifest e SEO estruturado foram evoluídos no branch canónico awwwards-rebuild.

A migração de newsletter é versionada e reversível, mas não foi aplicada à produção por causa do gate R1 da Fase 1. O código de double opt-in está atrás de UNIFIED_NEWSLETTER_ENABLED; com a flag ausente, o comportamento legado continua operacional e seguro no schema actual.

## Commits principais

- 5afa83c55d2caaac934f713c056dd7e83b7f458e — global shell
- a7892224af726db677f2a1e0e7eb126a1a7cae38 — locale EN/PT
- 023aaad9073cf63a966f31b39f863e631a64cd23 — canonical/hreflang
- 7340c8c79596a9c2c2cc7224f302274f5a656ddc — View Transitions
- e7f9ad14172a30c098ed3a64ab7a426dc4e78e66 — shell root
- e41148b06d83c85b892c1533b95a56adb2718e75 — /pt route tree
- 4ade83b5d57a533fa96450ecde6dc414151dfdac — Navbar
- e23b8ee08c30ab1325a323f722c916ef8ec807d9 — Footer
- 8047bb5d52d2f37c0bae037e3eb6ce66d3ef7a66 — newsletter migration
- 6b7b0bb59e2d180f83094921939f7ef610514e64 — newsletter rollback
- 4d75e1f657f93d8e3e576aeeb8c703fb723015d9 — newsletter double-opt-in
- 9a44abc208fd0f24478e13f23299a339e8ba4580 — command palette
- 874b50e889ac0b2e0bbcf6bb01a32dd47fae6944 — AI palette bridge
- db4bb06deac71a1947ef29d6006de31f29839128 — availability admin editor
- ddbc7720bb1de2fc9b7ec8bc98af7d1aae06189 — Control Room availability navigation
- e084ddc384edde72a9dac8f3772c7ec7e9ea1b8d — self-hosted root fonts and 404
- 9ab1e0226086d018859ff98d26523aa4f3c5fae2 — error shell
- 3ccede7b7527dda83de26859cb335e08713656a0 — web manifest
- b0d884a1245dfa19cb705953390c87c8ac901716 — localized sitemap
- 1a9768d56da28c093b07ab5538869ca554e7be33 — robots
- cda46dfb7d9a4ee7d744873836683a6d61942cee — route JSON-LD
- 737ac674073eb9a24eb610f3054fefef62a338ef — route loading state
- f1929b715333c2721a5cd5d60607e803dc66cb8d3 — grounded command filters

No phase-4-green tag was created.

## Preview Vercel

A code-bearing Phase 4 preview reached READY at deployment dpl_2mKNQCGVBvWRaK2TnJQ27zySyM8s for commit dfeac8056f72272660ac61f0b665d121e9628bdd.

Later commits were subject to the Vercel build-rate limit. The latest checked commit had combined status context Vercel = failure with target URL indicating the build-rate limit page. The final Phase 4 state therefore cannot claim a fresh READY deployment for the last commit.

## Ficheiros principais

- src/styles/global-shell.css
- src/lib/site-locale.ts
- src/lib/seo.ts
- src/router.tsx
- src/routes/__root.tsx
- src/components/layout/Navbar.tsx
- src/components/layout/Footer.tsx
- src/components/CommandPalette.tsx
- src/components/AiAssistantRealtime.tsx
- src/components/contact/NewsletterForm.tsx
- src/components/studio/WaitlistForm.tsx
- src/lib/newsletter.functions.ts
- src/components/admin/Phase2WebsiteCMS.tsx
- src/components/admin/Phase2AdminSurface.tsx
- src/components/admin/AdminControlRoom.tsx
- src/components/SeoRuntimeSync.tsx
- src/routes/pt.tsx
- src/routes/pt.portfolio.tsx
- src/routes/pt.portfolio.$slug.tsx
- src/routes/pt.services.tsx
- src/routes/pt.credentials.tsx
- src/routes/pt.contact.tsx
- src/routes/pt.studio.tsx
- src/routes/sitemap[.]xml.ts
- public/robots.txt
- public/site.webmanifest
- supabase/migrations/20260924093000_phase4_newsletter_unified.sql
- supabase/rollbacks/20260924093000_phase4_newsletter_unified.sql
- tests/phase4-shell.test.mjs
- docs/ARCHITECTURE.md
- docs/rebuild/DIVERGENCIAS.md

## Comandos e resultado

- contrast:check: permanece definido pela Fase 3.
- npm test / Vitest-compatible node:test: NÃO DECLARADO GREEN; GitHub Actions não expõe workflow runs.
- typecheck: NÃO DECLARADO GREEN; sem runner.
- lint: NÃO DECLARADO GREEN; sem runner.
- Playwright: NÃO DECLARADO GREEN; sem runner.
- Gate de Mudança: NÃO APLICÁVEL à Fase 4, que é uma fase de casca/infraestrutura global.
- Build Vercel: evidência READY intermédia existe; o commit final verificado por status ficou bloqueado por limite de builds.

O workspace local não contém o checkout do repositório, portanto não foi possível executar npm test/typecheck/lint directamente contra a árvore do GitHub nesta sessão.

## Gate de Paridade

Nenhum dado de produção foi alterado. As contagens permanecem:

- Published projects: 16
- Active clients: 16
- Experience: 5
- Competency groups: 3
- Studio waitlist: 2
- Storage objects: 0

A migration da newsletter é apenas código versionado; não foi aplicada.

## Gate de Mudança

Não aplicável.

A Fase 4 não reconstrói Home, Portfolio, Services, Credentials ou Contact internamente. A composição de página fica reservada às fases correspondentes.

## Defeitos tratados

- D-07: infraestrutura EN/PT deliberada; sem mistura de idiomas de chrome.
- D-09: CTA primário unificado no shell como Start a project.
- D-11: nova casca abandona micro-labels mono abaixo de 14px.
- D-13: newsletter convergida para um único server function/tabela-alvo, com migration de unificação.
- D-14: disponibilidade e ano deixam de depender de hard-code do shell.
- D-16: navegação passa a um único padrão de estado ativo/foco.
- D-15: scroll-padding e shell fixo retiram a colisão com navegação global; o conteúdo específico de Contact permanece para a Fase 11.

K1/K2/K3/K5 deixam de existir no novo shell global. Os equivalentes ainda presentes dentro de páginas antigas permanecem deliberadamente para as fases de página e não foram reescritos nesta etapa.

## Newsletter / R1

A migration 20260924093000_phase4_newsletter_unified.sql:

- cria campos nullable/adições explícitas para confirmação;
- marca cópias originadas de studio_waitlist;
- evita eliminar os registos históricos;
- remove o INSERT público;
- tem rollback simétrico.

A aplicação foi bloqueada conscientemente até o backup reversível R1 estar confirmado.

## Dependências

Não foi adicionada nova dependência nesta fase.

A Fase 4 reutiliza:
- cmdk já existente;
- Framer Motion já existente apenas como fallback/infra existente;
- @fontsource-variable/archivo e @fontsource-variable/newsreader já introduzidos na Fase 3;
- TanStack Router View Transitions nativo.

## Decisões autónomas

1. /pt/* reutiliza componentes reais em vez de duplicar páginas ou inventar traduções editoriais.
2. Conteúdo sem tradução real permanece no idioma existente; apenas o chrome/UI é traduzido.
3. A newsletter unificada é feature-gated até à migration e backup.
4. Studio waitlist nova escreve através da função newsletter unificada, preservando os registos históricos antigos até à migration.
5. View Transitions usa a API do router existente; nenhum framework adicional foi instalado.
6. A command palette mantém a pesquisa server-side existente e apenas adiciona ações, navegação e recentes locais.
7. O Studio continua com identidade visual própria nesta fase; a nova casca global não reescreve o seu interior.

## Não quebrei nada

- [x] branch única awwwards-rebuild
- [x] nenhuma promoção para produção
- [x] nenhuma mutation DB/Storage
- [x] nenhum Reel alterado
- [x] /pt/* é additive routing
- [x] newsletter migration tem rollback
- [x] nenhum segredo novo no código
- [x] root public shell recebe fonts self-hosted, sem Google Fonts
- [x] 404/error/loading recebem novos estados estruturais
- [ ] CI completo verde
- [ ] lint/typecheck/Vitest/Playwright verificados por runner
- [ ] fresh Vercel READY para o último commit

## Riscos / dívida técnica

- Fases 1–3 continuam BLOCKED-EXTERNAL.
- Backup de produção anterior não está confirmado nesta sessão.
- A migration de newsletter está commitada mas não aplicada.
- O build final está condicionado pelo limite externo de builds do Vercel.
- O conteúdo PT editorial ainda não tem uma fonte real; por isso o fallback é EN.
- As páginas internas ainda contêm padrões K3/K4/K6/K8 etc. até às fases de página.

## Avança automaticamente

Não para GREEN. A execução técnica da Fase 4 está commitada em awwwards-rebuild e documentada, mas a promoção da fase permanece BLOCKED-EXTERNAL até que a cadeia anterior e os runners externos forneçam evidência verificável.
