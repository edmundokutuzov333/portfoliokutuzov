# Relatório — Fase 9: Services (/services)

## Resumo

A Fase 9 reconstrói `/services` como uma composição Betão & Cor de quatro disciplinas, substituindo os cartões arredondados e a dependência exclusiva de hover por linhas de billboard com controlo de expansão por teclado, foco, rato e toque.

Os trabalhos apresentados por disciplina são derivados dos 16 projectos publicados reais, usando categoria, tags e metadata. Não foram criadas imagens ou projectos fictícios.

A secção "How the studio works" foi deslocada para o ownership de Services, mas permanece oculta nesta fase porque `public.about_method` está vazia. FAQ também permanece oculta porque não existe fonte pública de FAQ.

Não foram executadas mutações no Supabase ou Storage.

## Commit(s) / tag

Principais commits:
- 097719b37ac40c5dc0a87f3c181bca1c9fcbb9bf — mapa determinístico de projectos por disciplina
- 07fc476fd09e998162361e5b9f8456daa79df5e9 — nova página Services
- 3b8b838d0407c3d9281dce0e1e1ebbe62bb817c4 — novo route /services
- 301e853ecab3fbe4aee1e71d11d80d872643bfa5 — correcção do estado do accordion
- 047f3060da57cc63c6b59c9e7f900fdb52b71738 — contextual prompt no chatbot
- 75fdc2f97c72e3b2d97893b5473477bb060da16b — handoff /contact?service=
- 0fcb1966047764ba3c88b3f8c8ec2d74e0b8e71a — remoção do Method de Credentials e ligação cruzada
- d0f9430a1980a0b3eb3a75b0b6ea7ab1c8d5e04e — contratos da Fase 9
- e11ee6919388024d09f80b0c6cf1c655269d2fdd — Playwright Services
- c1f4e996bec705b93904dbc1a7da910f26275da0 — CI inclui browser gate da Fase 9

phase-9-green: não criado. R3 continua sem evidência externa suficiente.

## Preview Vercel

Os novos pushes geram previews automaticamente no projecto `portfoliokutuzov`. Não é declarado READY para a Fase 9 sem evidência de deployment correspondente ao HEAD final.

## Ficheiros criados/alterados

- `src/routes/services.tsx`
- `src/components/services/ServicesPagePhase9.tsx`
- `src/lib/service-projects.ts`
- `src/components/AiAssistantRealtime.tsx`
- `src/routes/contact.lazy.tsx`
- `src/routes/credentials.tsx`
- `tests/phase9-services.test.mjs`
- `tests/browser/services.spec.ts`
- `.github/workflows/ci.yml`
- `docs/rebuild/DIVERGENCIAS.md`
- `docs/rebuild/FASE-9-REPORT.md`
- `docs/rebuild/STATE.md`

A implementação anterior `src/components/services/ServicesInteractive.tsx` não foi apagada. A nova rota deixou de a consumir.

## Dados e verdade-terreno

Produção auditada:
- Published projects: 16
- `public.services`: 0
- `public.about_method`: 0
- Tabela FAQ pública: inexistente
- Project media `cover_url`: 0 nos 16 projectos auditados

Gate de Paridade:
- Portfolio projects: 16 → 16
- Services rows: 0 → 0
- About Method rows: 0 → 0
- FAQ rows: 0 → 0
- Storage mutations: 0
- DB mutations: 0

A oferta pública continua suportada pelas quatro definições estáticas existentes no código, porque a fonte CMS de Services está vazia.

## Implementação

### 1. Billboard disciplines

As quatro disciplinas são:
- Visual Identity
- Art Direction
- Editorial & Print
- Digital Design

Cada disciplina é um `button` com `aria-expanded` e painel associado. A expansão funciona por click/touch e por foco/teclado.

A estrutura substitui:
- cartões rounded;
- pills;
- gradients;
- badges mono;
- interacção exclusivamente hover;
- preview incoerente de uma única peça.

### 2. Selected work real

`src/lib/service-projects.ts` cria uma classificação determinística sobre os projectos publicados.

O score usa:
- categoria normalizada;
- título;
- subtitle;
- descrição;
- cliente;
- tags.

Cada disciplina recebe no máximo quatro trabalhos reais. Com menos de três matches coerentes, a lista é ocultada.

O link da disciplina leva para o arquivo existente com `d=` e preserva a pesquisa por URL.

### 3. Work Colour

A primeira peça coerente da disciplina define a Work Colour através de `setWorkColor`.

Não são inventadas thumbnails. Como a produção não tem `cover_url`, o trabalho é representado pela sua metadata e pela cor já existente em `palette`.

### 4. Chatbot contextual

"Ask about this discipline" emite o evento `ek:open-chat` já utilizado pelo chatbot.

O evento passou a aceitar `detail.prompt`, permitindo abrir o chatbot já com uma pergunta contextual.

Não foi criado um novo motor de chat.

### 5. Contact handoff

O CTA único é `Start a project` e aponta para:

`/contact?service=<discipline>`

O wizard existente lê o parâmetro, mapeia a disciplina para o `PROJECT_TYPES` actual e abre o passo Project.

Não foi criado outro formulário.

### 6. Method e FAQ

O Method foi removido da composição pública de Credentials e substituído por uma ligação para Services.

A página Services está preparada para renderizar `useMethod()` quando existirem rows activas, mas actualmente a fonte tem zero rows, portanto a secção permanece oculta.

FAQ usa Radix Accordion mas a fonte está vazia/inexistente. A estrutura permanece oculta.

Isto cumpre R11/R12 e evita inventar conteúdo.

## Dependências / R8

Nenhuma dependência nova foi instalada.

A implementação usa:
- Radix Accordion já presente no package;
- React state;
- TanStack Router;
- Work Colour existente;
- APIs/eventos já existentes.

Não houve alteração do runtime Node.

## Defeitos da Parte B tratados

- D-02 — descrição única por disciplina.
- D-12 — interação por hover deixou de ser exclusiva; foco, teclado e toque funcionam.
- D-09 — CTA normalizado para "Start a project".
- K1/K2/K3 — sem navegação/pills/cartões arredondados no novo Services.
- K5/K13 — sem mono micro-labels no novo Services.
- K10 — nenhuma interacção funcional depende só de hover.
- K15 — CTA principal sem seta universal.
- D-06 — Services continua separado de Competencies em Credentials, com ligação entre superfícies.

## Testes

Static contracts:
- `tests/phase9-services.test.mjs` committed.

Browser:
- `tests/browser/services.spec.ts` committed.
- CI passou a incluir o browser gate da Fase 9.

Execução externa observada no momento do relatório:
- CI: em execução, sem conclusão final ainda.
- Browser QA: em execução, sem conclusão final ainda.
- Supabase Backup automático: falhou, como nas fases anteriores; nenhuma escrita de produção foi executada.
- lint/typecheck/build/Vitest: NOT CLAIMED GREEN enquanto o job não concluir.
- Playwright: NOT CLAIMED GREEN enquanto o job não concluir.
- Gate de Mudança: NOT CLAIMED GREEN; o runner/screenshot formal ainda não forneceu diff estrutural >= 0.45.
- Lighthouse: NOT RUN.

## Segurança / reversibilidade

- Nenhuma migration criada.
- Nenhuma migration aplicada.
- Nenhum insert/update/delete/upsert executado.
- Nenhuma Storage mutation.
- Nenhum segredo adicionado.
- Reel protegido e não alterado nesta fase.

## Decisões autónomas

1. Usar as quatro definições de disciplina já existentes em `src/data/disciplines.ts` enquanto `public.services` estiver vazio.
2. Não reactivar o seed histórico de `about_method`, porque a produção actual tem zero rows e R11/R12 impedem tratar histórico de migration como conteúdo publicado.
3. Não criar FAQ até existir uma fonte editorial real.
4. Representar trabalhos sem thumbnails através de metadata e Work Colour, em vez de inventar imagens.
5. Preservar a implementação antiga `ServicesInteractive` no código e retirar apenas o seu uso da rota pública.

## Riscos / dívida técnica

- Services ainda depende de fallback estático até o Admin preencher `public.services`.
- Method continuará oculto enquanto `public.about_method` estiver vazio.
- FAQ continua sem conteúdo porque não existe fonte publicada.
- O Gate de Mudança depende do runner externo.
- A branch continua dependente dos bloqueios externos das fases anteriores.

## Avança automaticamente

Tecnicamente a Fase 9 está implementada.

Formalmente permanece `BLOCKED-EXTERNAL` até existirem evidências verificáveis de lint, typecheck, testes, Playwright, Gate de Paridade e Gate de Mudança.
