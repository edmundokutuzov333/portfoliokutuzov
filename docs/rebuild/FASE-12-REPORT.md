# Relatório — Fase 12: Kutuzov Studio (/studio)

## Resumo

A Fase 12 reconstruiu a landing pública do Kutuzov Studio como uma página de pré-lançamento/lab, sem transformar o Studio numa agência com equipa, clientes ou casos inventados.

O conteúdo obrigatório foi preservado: A studio still finding its lines., o parágrafo do lab, Status/Access/Release, Explore the portfolio e Maputo / 2026 · Private build. A identidade passa a ser permanentemente preta com --work fixo em menta.

A constelação foi reconstruída em SVG interactivo. Os nós respondem ao cursor e regressam a uma composição estática em reduced-motion.

A waitlist passa a usar o canal unificado de subscribers com source=studio e double opt-in preparado. Como a migration unificada ainda não está aplicada em produção e R1 permanece bloqueado, o fluxo Studio falha fechado em vez de efectuar uma subscrição single-opt-in.

## Base da especificação

A Fase 12 exige preservar o conteúdo editorial actual, manter o tom Preto e --work menta, tornar a constelação interactiva com fallback reduced-motion, ligar nós a ferramentas apenas quando existirem nomes reais em /admin/studio, usar a waitlist unificada com source=studio e double opt-in, e manter o Studio como prelaunch lab separado do portfolio.

## Commits principais

- 12e81c9f44eb7bd96e799e98796ff7ef7dac51ea — Studio landing + SVG constellation
- 49c9fe2bcaab0813d2921a4e699dce02dcfd2fd8 — newsletter Studio fail-closed + confirmação no Studio
- 1b04a17b4f3be493c559deea2181f93b6a9d2d73 — WaitlistForm unificado
- 331c21b1ae6571a23c5230eb1b4760bcfd136ca7 — documentação da flag de newsletter
- 8adb5c8ba2d2e326440460c5b7cf4d5d32093940 — contratos estáticos
- 761ec8278f4a12abc00abd15207236812c181b65 — browser QA Studio
- b6fa8d432adc4a05fb994dbb300ae8f0e9358164 — CI browser gate Studio
- 25f80460a79dfbf9e5f1c458befa0b9a91bdedb2 — divergências

## Implementação pública

### Conteúdo preservado

Mantidos: A studio still finding its lines.; parágrafo original do Kutuzov Studio; Status: Composing; Access: Private, by invitation; Release: When every layer holds; Explore the portfolio; Maputo / 2026; Private build.

Não foram introduzidos nomes de ferramentas, equipa, clientes, casos, métricas, preços ou capabilities fictícias.

### Visual

O Studio usa fundo preto permanente, --work em #25e3c2, Archivo/Cartaz para H1, Newsreader/Livro para narrativa, superfícies rectangulares e bordos de 2px. Não foram usados pílulas, cartões arredondados de contentor, mono/micro-labels decorativos ou paleta azul-celeste de interface.

### Constelação

A implementação anterior GenesisVisual era SVG mas apenas animava linhas e nós. A nova implementação usa SVG nativo, reage a pointer movement, cria parallax diferente por nó, aumenta o nó sob hover e usa reduced-motion para uma composição estática.

### Ferramentas internas

A auditoria da BD encontrou studio_cards = 0, studio_waitlist = 2 e newsletter_subscribers = 0. Como não existem ferramentas reais publicadas no studio_cards, a constelação permanece anónima. Não foi lido nem exposto conteúdo do /admin/studio.

## Waitlist / Double Opt-In

A Fase 4 já tinha preparado a migration reversível 20260924093000_phase4_newsletter_unified.sql e o rollback correspondente.

Essa migration adiciona confirmed_at, confirmation_token_hash e confirmation_expires_at; preserva e marca registos provenientes de studio_waitlist; copia a lista existente para newsletter_subscribers com source=studio; e remove o INSERT público anterior.

A Fase 12 não criou uma segunda tabela.

O newsletter.functions.ts foi ajustado para source=studio utilizar /studio?newsletter_confirm=TOKEN, falhar fechado enquanto a migration estiver desligada, enviar double opt-in quando activa e validar o token via confirmNewsletter.

### Confirmação

O Studio possui os estados Confirming your place., You’re in. / Subscription confirmed. e Confirmation failed. Após sucesso, o token é removido da URL.

## Segurança e R1

Nenhuma alteração de produção foi realizada: 0 rows inseridas, 0 rows actualizadas, 0 rows apagadas, 0 Storage writes e nenhuma migration aplicada.

O backup Supabase continua sem evidência confirmada, logo a migration unificada não foi aplicada.

## Dados

Truth-terrain auditada: studio_waitlist = 2 total; studio_waitlist activos = 2; newsletter_subscribers = 0; studio_cards = 0; public.studio_events não encontrado na produção auditada.

Os 2 registos existentes do Studio não foram tocados.

## Dependências

Nenhuma dependência nova. A implementação usa React, TanStack Router/Start, Framer Motion existente, Lucide existente, React Hook Form, Zod, SVG/Web APIs nativas, Supabase e Resend já existentes.

## Testes criados

- tests/phase12-studio.test.mjs
- tests/browser/studio-phase12.spec.ts

CI passou a incluir o browser gate do Studio.

## Gate de Paridade

A fase não modifica conteúdo do portfolio, clients, experience, skills, metrics, leads ou subscriptions existentes.

Studio: existing studio_waitlist 2 -> 2; studio_cards 0 -> 0; newsletter subscribers 0 -> 0.

Nenhuma entidade de dados foi alterada.

## Gate de Mudança

Sinais estruturais implementados: S1 novo paradigma de layout; S2 papéis Cartaz/Livro; S3 componentes rectangulares; S4 pointer-reactive interaction + reduced-motion; S5 ritmo Preto/Menta; S6 nova hierarquia e composição.

Lista de Abate no Studio: K1, K2, K3, K4, K5, K8, K13 e K15 eliminados.

A medição formal do diff estrutural >= 0.45 depende do runner Playwright.

## QA / gates

- Lint: NOT CLAIMED GREEN.
- Typecheck: NOT CLAIMED GREEN.
- Vitest/node:test: NOT CLAIMED GREEN.
- Playwright: NOT CLAIMED GREEN.
- Gate de Paridade: PASS por preservação de dados.
- Gate de Mudança: NOT CLAIMED GREEN sem screenshot edge-diff verificado.
- Supabase Backup: BLOCKED-EXTERNAL.
- Vercel final preview: ainda sem evidência READY final para o HEAD da fase.
- phase-12-green: não criado.
- produção: não promovida.

## Decisões autónomas

1. Manter nós anónimos porque studio_cards está vazio.
2. Não tocar no /admin/studio.
3. Reutilizar o contrato unified newsletter da Fase 4 em vez de criar outra tabela.
4. Falhar fechado para Studio enquanto a migration de double opt-in não estiver activa.
5. Usar SVG + Pointer Events nativos em vez de adicionar uma biblioteca.
6. Colocar a confirmação no próprio /studio para não criar uma nova rota estrutural apenas para um estado transitório.

## Riscos / dívida técnica

- Double opt-in Studio depende da aplicação da migration Phase 4 e de UNIFIED_NEWSLETTER_ENABLED=true.
- O backup Supabase continua a impedir a aplicação segura da migration.
- A tabela studio_events não foi encontrada na BD actual; a fase não cria analytics novos.
- Gate de Mudança aguarda screenshot runner.
- Gates formais anteriores continuam BLOCKED-EXTERNAL.

## Estado

A implementação da Fase 12 está concluída em código, mas a fase permanece BLOCKED-EXTERNAL sob R1/R3.

Não houve promoção para produção.