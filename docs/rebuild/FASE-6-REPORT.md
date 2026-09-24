# Relatório — Fase 6: Selected Portfolio Reel

## Resumo

A Fase 6 evoluiu o Selected Portfolio Reel no único ponto do plano em que o componente protegido podia ser alterado, mantendo o paradigma de leque 3D e sem o substituir por carousel plano/Embla.

O Reel agora tem ordem round-robin determinística por disciplina, virtualização active ±5, teclado completo, botões prev/next, reduced-motion em scroll-snap 2D, pausa por hover/foco/viewport, captions apenas na carta activa, Work Colour, morph preparado, cinema mode e analytics por batch.

A implementação é realista perante a verdade-terreno: os 16 projectos publicados actualmente têm 0 cover_url, 0 gallery e 0 gallery_meta. Em vez de inventar media, o Reel renderiza posters de projecto baseados em metadados e cor real. A migration futura só faz seed a partir de media real existente.

## Commit(s) / tag

Principais commits da Fase 6:

- 8d3b2b67c4ec29a027107dc8725463fec4bc648c — evolução principal do Reel protegido
- 21fa42eaabc9075b728d7a4f274bc02d656f0dfc — analytics server route
- 9b940b23696f784fb3c8436524d910a2d0bed69d — migration reel_items/reel_analytics
- 0a8120cdef49b34c97f76df0a03ef99e865c49aa — rollback migration
- 887fcfce81225ae668235e621218a73bd2a0469b — Phase 6 contract tests
- 97406dd05ae9428a3b3e22106f0a73e5df5f154f — analytics feature flag documentation
- 58602f80fbd31e3fd773fe1c9c98d6fb978a2f6e — landmark semantics correction
- e3e056fe80085a66c538e4a7dcb739b3468c4812 — row-mode active-card correction
- 22e0d4a0dfd3b4a2bb2ba34bee6c065fe7cb5716 — stable case-slug centering
- cc58dedc42267a821b0c6e8402823f748cbb5127 — final row-mode test contract
- 9b5d15755e13a6feed465bbf42737af61fd99ec1 — STATE
- b8529e7182d3ae1cc4def308f3b15cde1b0be095 — divergências

No phase-6-green tag was created.

## Ficheiros criados/alterados

- src/components/ui/cinematic-portfolio-reel.tsx
- src/routes/api.reel-analytics.ts
- supabase/migrations/20260924090000_phase6_reel_items.sql
- supabase/migrations/20260924090000_phase6_reel_items.down.sql
- tests/phase6-reel.test.mjs
- .env.example
- docs/rebuild/STATE.md
- docs/rebuild/DIVERGENCIAS.md
- docs/rebuild/FASE-6-REPORT.md

Não houve alteração a src/components/home/DeferredReel.tsx.

## Contrato do Reel implementado

### Fan 3D

- Leque 3D mantido.
- Nenhum Embla ou carousel plano introduzido.
- Perspectiva e transform-style preservados.
- Apenas active ±5 é renderizado.
- Drag horizontal mantido.
- Ordem round-robin por disciplina é determinística.

### Acessibilidade

- role=region + aria-roledescription=carousel.
- Cada carta é role=group + aria-roledescription=slide.
- aria-live anuncia o projecto activo.
- Left / Right.
- Home / End.
- Enter abre cinema mode.
- Space pausa/retoma.
- Prev / Next são a alternativa explícita ao drag.
- Botões de controlo têm 44px.
- Reduced motion elimina autoplay/fan.

### Auto-play

O autoplay pára quando:
- o Reel está em hover;
- existe foco dentro da região;
- a região sai da viewport;
- reduced-motion está activo;
- o utilizador pausa manualmente.

### Reduced-motion / fallback

Sem suporte 3D ou com reduced-motion, o Reel usa uma fila horizontal scroll-snap.

A carta activa é automaticamente centrada quando muda por teclado ou controlo.

### Captions

Só a carta activa mostra título completo + cliente + ano.

As cartas laterais não mostram legendas cortadas.

### Cor do Trabalho

O item activo alimenta --work via setWorkColor.
A origem actual é:
1. accentColor, quando existir;
2. dominantColor, quando existir;
3. cor derivada da palette actual do projecto;
4. fallback cobalt #2f4bff.

### Morph

A carta activa recebe viewTransitionName baseado no slug real do projecto:
work-[case-slug].

### Cinema mode

- Dialog com focus management Radix.
- Ecrã inteiro.
- Esc fecha através do Dialog.
- Swipe horizontal altera o item activo.
- Media real é mostrado quando existir.
- Sem media real, é mostrado o poster tipográfico baseado em dados existentes.

## Analytics

Foi criado:

POST /api/reel-analytics

Características:
- feature flag REEL_ANALYTICS_ENABLED;
- disabled por defeito;
- rate limit por hash de IP;
- session seed aleatório sem cookies;
- hash diário SHA-256 no servidor;
- batch via navigator.sendBeacon;
- sem PII;
- sem policy pública de INSERT na tabela;
- escrita através de Supabase service role apenas em server route.

A tabela e analytics permanecem inactivos até à migration e ao gate de segurança serem efectivamente aprovados.

## Migration

Foi criada a migration:
supabase/migrations/20260924090000_phase6_reel_items.sql

E o rollback:
supabase/migrations/20260924090000_phase6_reel_items.down.sql

A migration:
- é aditiva;
- cria reel_items;
- cria reel_analytics;
- activa RLS;
- permite leitura pública apenas de reel_items publicados;
- restringe writes de reel_items a admins;
- não cria policy pública de insert para analytics;
- cria índices de leitura/analytics;
- faz seed apenas de projectos com cover_url real.

Como a verdade-terreno actual tem 0 capas, a migration preparada produz zero reel_items até existir media real. Isto é deliberado e evita violar R11.

## Segurança / R1

A migration não foi aplicada à produção.

Verificação directa ao Supabase:
- public.reel_items = inexistente
- public.reel_analytics = inexistente

Nenhuma row foi criada, alterada ou apagada.
Nenhum objecto Storage foi criado, alterado ou apagado.

Motivo: a evidência do backup externo da Fase 1 continua não-confirmável pela superfície disponível, e R1 proíbe mutation de produção sem backup confirmado.

## Verdade-terreno

Inventário actual usado pelo Reel:

| Entidade | Valor |
|---|---:|
| Published projects | 16 |
| Project cover_url | 0 |
| Project gallery | 0 |
| Project gallery_meta | 0 |
| reel_items em produção | 0 |
| reel_analytics em produção | 0 |

O visual descrito na auditoria da produção representa um Reel com imagens; a fonte de dados actual não fornece essas imagens. R12 determina que a BD/código real prevaleçam. Por isso a implementação não inventa URLs.

## Validação

Inspecção estática dos contratos da Fase 6: 18/18 verificações PASS.

Cobertura confirmada:
- fan 3D;
- virtualization;
- reduced-motion;
- centering em row mode;
- pause conditions;
- keyboard navigation;
- button alternatives;
- carousel semantics;
- active captions;
- shared transition;
- cinema;
- analytics;
- migration rollback;
- no synthetic media;
- protected wrapper;
- env flag;
- predecessor gate;
- regression test contract.

Lint: NOT CLAIMED GREEN.
Typecheck: NOT CLAIMED GREEN.
Vitest/node:test: NOT CLAIMED GREEN; os runs externos não estão expostos.
Playwright: NOT CLAIMED GREEN.
Lighthouse: NOT RUN.
Gate de Mudança: NOT CLAIMED GREEN.
Gate de Paridade formal: não claimable para reel_items porque a tabela ainda não existe em produção.

## Vercel

O HEAD verificado da branch awwwards-rebuild no momento do fecho foi cc58dedc42267a821b0c6e8402823f748cbb5127.

O status Vercel disponível para o último commit verificado pela integração continua failure, com alvo do deployment do projecto.

Não foi feito promotion para main.

## Defeitos / requisitos tratados

- D-18: atacado na Fase 6 — o título da carta passou a ser o nome real do projecto, não a categoria.
- DR-09: round-robin determinístico por disciplina.
- C.4: active item alimenta Work Colour.
- R4: leque 3D mantido.
- R7: Reel alterado exclusivamente nesta Fase 6.
- WCAG 2.2: teclado, pause alternative, focus behaviour, reduced-motion, touch alternative.
- Virtualização: active ±5.
- Cinema mode: implementado.
- Analytics sem cookies/PII: implementado por feature flag.

## Lista de abate

O Reel novo não introduz:
- carousel plano;
- pílulas de controlo;
- cards arredondados;
- captions laterais cortadas;
- micro-labels mono;
- autoplay que ignora focus/hover/viewport;
- interação apenas por drag;
- media fictício.

## Decisões autónomas

1. Mantive a arquitectura do fan e evoluí-a, em vez de a substituir.
2. Usei round-robin runtime porque reel_items ainda não existe em produção.
3. Mantive posters tipográficos quando o media real está ausente, usando apenas dados existentes.
4. Mantive a migration sem FK de case_slug porque a tabela de case studies não foi confirmada como fonte FK segura.
5. Mantive analytics desactivado por defeito.
6. Não apliquei qualquer migration em produção devido ao gate R1.

## Riscos / dívida técnica

- Fases 1–5 permanecem BLOCKED-EXTERNAL.
- Fase 6 depende formalmente da Fase 5.
- Media real do portfolio ainda não está populado.
- reel_items e reel_analytics aguardam backup confirmado + gate de execução.
- Vercel build-rate-limit/failure continua externo.
- Admin pinning de ordem permanece reservado à Fase 14.

## Avança automaticamente

Não para GREEN.

A implementação técnica da Fase 6 está em awwwards-rebuild, mas a fase permanece BLOCKED-EXTERNAL porque:
1. Fase 5 ainda está BLOCKED-EXTERNAL;
2. backup externo necessário para migration não está confirmado;
3. lint/typecheck/Vitest/Playwright/Gate de Mudança não têm evidência de runner;
4. Vercel está actualmente em failure.

Isto é deliberado para cumprir R1, R3 e a cadeia de dependências do plano.
