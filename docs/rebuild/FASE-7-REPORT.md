# Relatório — Fase 7: Portfolio (/portfolio)

## Resumo

O arquivo Portfolio foi reconstruído em Betão & Cor como uma experiência de arquivo navegável, mantendo os dados reais e evoluindo os filtros e pesquisa existentes.

A página agora tem duas vistas persistidas no URL: Grid e Index. A Grid usa linhas justificadas sem recorte; a Index usa tabela de Year / Project / Client / Discipline com preview de Work Colour por hover/foco. Filtros de disciplina são multi-select; Year, Client e Search também ficam partilháveis no URL.

Nenhum dado do Supabase/Storage foi alterado.

## Commit(s) / tag

Principais commits:
- 15eb4099df9bb0a0fdc066847ec4c68f81b0bed8 — API de portfolio paginada + facets
- 8c65a5153081e3a620d026a47a214216b3929329 — useInfiniteQuery 24/page
- b52ca4096776cdf09f037569cfc693df409242b5 — nova PortfolioArchive
- b614604b3992432fbb99aea66fb9f50f5d55fd26 — SSR/type hardening
- 260c18a06b31ccef612efcd8d238715eb899f14c — novo route /portfolio
- be1eee279452d471e92f602eba75db21907a618e — alinhamento de /portfolio/
- 766b13a8d15ce71878d8f049a7b168bc629f1676 — Work Colour em hover
- e399989dbf0a9e2acf0b95e48251c5a7d2f61f97 — testes Phase 7
- 0901cf44a56b2287c451cbaab61ab56d5c10868d — prefetch cacheable
- 46f7851077739feccad1f0dc0ebcb70a5050811d — effects/lint hardening
- 8dd394bd2ec273fb3ae5a6fcec2cc6f1ae944702 — limpeza final do regression test

No phase-7-green tag foi criado.

## Ficheiros principais

- src/routes/portfolio.tsx
- src/routes/portfolio.index.tsx
- src/routes/api.portfolio-projects.ts
- src/hooks/usePortfolioArchive.ts
- src/components/portfolio/PortfolioArchive.tsx
- tests/phase7-portfolio.test.mjs
- tests/portfolio-regression.test.mjs
- docs/rebuild/STATE.md
- docs/rebuild/DIVERGENCIAS.md
- docs/rebuild/FASE-7-REPORT.md

`src/components/portfolio/PortfolioGrid.tsx` foi preservado para evitar remoção sem substituição; a rota pública deixou de o utilizar.

## Implementação

### 1. Duas vistas

`?view=grid`:
- linhas justificadas;
- proporção derivada de cover_width/cover_height ou gallery_meta quando existe;
- fallback 4:3 apenas para layout de records sem media;
- object-contain, sem cortar cartazes;
- Work Colour quando a peça recebe hover/foco.

`?view=index`:
- tabela Year / Project / Client / Discipline;
- hover mostra preview fixo que acompanha o ponteiro;
- foco de teclado mostra o mesmo preview num painel fixo;
- active item actualiza --work;
- clicar no projecto abre o case route existente.

## Filtros e pesquisa

Disciplinas:
- Social Media
- Ad Campaigns
- Digital Design
- Offline Actions
- Clothes Design
- Videos
- Web Design

Os toggles são multi-select e gravados em d.
Year fica em y.
Client fica em c.
Pesquisa fica em q.

A pesquisa actualiza o URL com debounce de 280ms.

O estado pode ser copiado/partilhado directamente.

## Paginação

O front-end usa useInfiniteQuery.
Page size = 24.

A API devolve:
- projects;
- total;
- page;
- nextPage;
- hasMore;
- facets.

O sentinel usa IntersectionObserver para carregar a página seguinte antes de o utilizador atingir o fim.

## Prefetch

Ao passar o rato ou focar um projecto, o registro do projecto é prefetched através de /api/portfolio-projects?slug=....

Não existe conteúdo inventado no prefetch.

## Scroll restoration

A posição é guardada em sessionStorage utilizando uma chave derivada dos filtros activos.

Ao regressar à archive, a posição é recuperada.

## SEO

Foi adicionado ItemList JSON-LD para a primeira página de resultados, com links para os slugs reais.

O canonical da rota continua /portfolio.

## Performance

Nenhuma dependência nova foi instalada.

A implementação usa URLSearchParams nativo, IntersectionObserver nativo e sessionStorage nativo, além do React Query já existente.

A API continua a usar o Supabase service role apenas no servidor e mantém a resposta cacheável.

## Gate de Paridade

| Entidade | Antes | Depois |
|---|---:|---:|
| Published projects | 16 | 16 |
| Featured projects | 6 | 6 |
| Distinct project clients | 16 | 16 |
| Project years | 4 | 4 |
| Storage mutations | 0 | 0 |
| DB mutations | 0 | 0 |

Não foram criadas rows.

## Gate de Mudança

A Fase 7 cumpre estruturalmente o mandato:
- S1 novo paradigma de arquivo: Grid justificado + Index.
- S2 papéis tipográficos Cartaz/Livro.
- S3 superfícies rectangulares sem pills/cards.
- S4 preview ligado a hover/foco e Work Colour.
- S5 ritmo Betão + Cor do Trabalho.
- S6 nova hierarquia e ordem do arquivo.

A medição formal diff >= 0.45 não foi declarada porque o runner Playwright/screenshot não está disponível nesta execução.

## Lista de Abate

A nova rota pública não usa:
- nav/pill chrome;
- botões pill;
- cards arredondados;
- gradientes decorativos;
- mono micro-labels;
- CTA com seta universal;
- interação exclusivamente hover;
- corte de artwork.

O arquivo novo também não contém rounded-full, rounded-2xl, bg-gradient, shadow-lg, mono ou uppercase.

## Conteúdo real

A produção tem 16 projectos publicados, não 106.

Categorias normalizadas no archive:
- Social Media: 1
- Ad Campaigns: 4
- Digital Design: 8
- Offline Actions: 0
- Clothes Design: 0
- Videos: 1
- Web Design: 2

Os 8 projectos normalizados como Digital Design vêm de labels reais existentes no DB: Branding, Campaign, Digital, Editorial e Experimental.

## Execução e gates

Static Phase 7 contract checks: 14/14 PASS.

Tentativa de execução local:
- git clone --branch awwwards-rebuild falhou porque o container não consegue resolver github.com.
- Node/npm runner não pôde ser iniciado sobre um checkout novo.
- Portanto não foi fabricada evidência de lint/typecheck/Vitest/Playwright.

Formal:
- lint: NOT CLAIMED GREEN
- typecheck: NOT CLAIMED GREEN
- Vitest: NOT CLAIMED GREEN
- Playwright: NOT CLAIMED GREEN
- Gate de Mudança: NOT CLAIMED GREEN
- Lighthouse: NOT RUN
- phase-7-green: NOT CREATED

## Riscos / dívida técnica

- O inventário continua com 16 projectos publicados enquanto o documento visual usa 106 como expectativa histórica.
- Media de projecto continua ausente no dataset actual.
- dominant_color definitivo permanece reservado à infraestrutura já preparada nas fases anteriores.
- A medição final de performance/visual depende do runner externo.
- O branch continua dependente dos gates externos das fases anteriores.

## Avança automaticamente

Não para GREEN.

A Fase 7 é independente e foi tecnicamente executada em awwwards-rebuild, mas R3 impede declarar a fase verde sem lint/typecheck/Vitest/Playwright e Gate de Mudança comprovados por runner.

Nenhum dado de produção foi alterado.