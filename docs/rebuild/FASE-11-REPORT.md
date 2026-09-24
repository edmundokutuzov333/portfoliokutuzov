# Relatório — Fase 11: Contact (/contact)

## Resumo

A Fase 11 reconstruiu o Contact como uma experiência de briefing em Betão & Cor, mantendo o wizard de 5 passos e as integrações existentes, mas substituindo o layout escuro, cartões arredondados e micro-labels por uma composição editorial com painel em Cal.

O fluxo agora é:
Identity → Project → Budget → Timing → References.

A submissão pública passa a usar exclusivamente o endpoint server-side `/api/contact/submit`, com validação Zod, honeypot, hash de IP, rate limiting persistente preparado em migration, persistência em `briefing_submissions` e envio via Resend server-side.

Nenhuma row de produção nem objecto Storage foi criado, actualizado ou apagado durante a execução.

## Escopo da especificação

A especificação da Fase 11 exige layout Betão/Cal, cinco passos nomeados, validação por passo, erros inline com aria-live, autocomplete/inputmode, foco entre passos, draft em sessionStorage, resumo final, "Prefer not to say" no Budget, três canais rectangulares, prefill por ?ref= e ?service=, Resend, lead em Supabase através de server-side write, honeypot/rate limiting e feedback Sonner. fileciteturn376file0L1177-L1195

## Commits principais

- 90522ba55196755f38e93a0bb5a5f68ec5bec793 — migration de segurança Contact
- 4782873f4b0289f076d3d927b171dc32c572e12a — rollback da migration
- 477453a7ee495551bf57d0d9cdfac936b4c9c74e — endpoint /api/contact/submit
- 9174995ac10418cc8125499a84b6f7976d69fcbc — nova composição Contact
- c7e23d7974917a8496ca1eaf9fd84510a1cb9ea2 — montagem inicial da rota Contact
- 04f41b82e4e03859e778708cd67c6257d9e3e220 — correcção do contrato TanStack da rota
- efb496bbd5a16cb6747600fedf9b589af88adac7 — fallback de rate limit antes da migration
- 4dfd507f4bd9a2d0b1945b0b83c7122d659da43c — Field helper type-safe
- 82a3b0042b41d5d09a1d4f855b018a4d6582799e — preservação de múltiplos uploads
- dc47328d9ccb67aa045b46c4303cb9c847c707de — contratos estáticos
- dec2f3e5a8e3e13342206bcae685f007b41b8fb2 — browser tests
- be1467a8f11ff69c5e4f6a08de40cc16e3b70296 — CI inclui Contact browser gate
- 8c523658c3d3da6a415cf35dc7d06a4e6ddbb1ba — Resend E2E checker
- 3228a39c8a3d2ba07c08bc58d30f3795a463dd3b — script npm para E2E Resend
- fde07c4bf894807bbfcfe4f18d7f5cb6f5be1dbe — divergências Fase 11
- 98dc630adab73a3aa1441d7d4e4b56d2d12ef1bd — conflitos de conteúdo Fase 11

HEAD da branch no fecho desta etapa: `98dc630adab73a3aa1441d7d4e4b56d2d12ef1bd` antes do relatório/STATE final.

## Ficheiros principais

- `src/components/contact/ContactPagePhase11.tsx`
- `src/routes/contact.lazy.tsx`
- `src/routes/api.contact.submit.ts`
- `supabase/migrations/20260924110000_phase11_contact_security.sql`
- `supabase/rollbacks/20260924110000_phase11_contact_security.down.sql`
- `scripts/phase11-resend-check.mjs`
- `tests/phase11-contact.test.mjs`
- `tests/browser/contact.spec.ts`
- `.github/workflows/ci.yml`
- `docs/rebuild/DIVERGENCIAS.md`
- `docs/rebuild/CONTEUDO-CONFLITOS.md`
- `docs/rebuild/FASE-11-REPORT.md`
- `docs/rebuild/STATE.md`

## Contact UI

### 1. Hero

H1 único:
`Let's talk.`

A área esquerda contém:
- Email
- WhatsApp Direct
- Schedule 30-Min Call
- localização
- target de resposta

A antiga margem superior de aproximadamente 250px foi removida.

### 2. Wizard

Cinco passos nomeados:
- Identity
- Project
- Budget
- Timing
- References

A numeração está semanticamente justificada pelo processo.

O formulário vive numa superfície Cal com borda de 2px.

### 3. Identity

Mantidos:
- Full name
- Email
- Company / brand
- Role / title
- Country / city
- Phone / WhatsApp

Os campos recebem autocomplete e inputmode apropriados.

### 4. Project

Mantidos todos os 12 tipos actuais de Project Types e os quatro estados de Urgency.

Os handoffs existentes continuam:
- `?service=`
- `?ref=`

O case-study prefill continua a puxar o projecto via `/api/portfolio-case-study`.

### 5. Budget

A moeda e os quatro brackets existentes são preservados.

Adicionado explicitamente:
`Prefer not to say`

Os valores de exact amount e negotiable continuam disponíveis.

### 6. Timing

Mantidos:
- Target launch / delivery date
- Preferred contact channel

### 7. References

Mantidos:
- project description
- reference URLs
- visual attachments

O upload continua a usar o bucket existente `site-assets`; nenhum upload foi executado durante a fase.

Foi acrescentado resumo final antes do envio para evitar entrada redundante.

### 8. Draft + focus + validation

Implementado:
- sessionStorage draft
- restauração após reload
- validação Zod por passo
- errors inline
- `aria-live`
- foco no heading do novo passo
- Enter para continuar em inputs
- navegação Back/Continue
- navegação directa pelos cinco passos sem saltar validações
- toasts Sonner

## Backend

### Endpoint

`POST /api/contact/submit`

Runtime:
`nodejs`

Responsabilidades:
- validar payload com Zod
- detectar honeypot
- obter IP do pedido sem guardar o IP puro
- gerar hash SHA-256
- aplicar rate limit via RPC
- usar fallback conservador em memória enquanto a migration não estiver aplicada
- inserir via `supabaseAdmin`
- enviar confirmação ao lead
- enviar notificação interna
- devolver briefing_id

### RLS / migration

Produção tinha a policy:
`anyone can submit briefing`

Foi criada migration reversível que:
- remove o INSERT público
- cria `contact_rate_limits`
- cria `check_contact_rate_limit`
- restringe a função ao `service_role`

A migration NÃO foi aplicada em produção.

Motivo:
R1. O workflow de backup Supabase continua a falhar e não existe prova verificável de backup reversível desta execução.

### CRM

A BD já tinha:
- `briefing_submissions`
- `crm_leads`
- `crm_lead_profiles`

A Fase 11 reutiliza `briefing_submissions` e não cria uma segunda tabela de leads.

## Truth-terrain auditada

Produção antes da execução:
- briefing_submissions: 0
- booking_requests: 0
- newsletter_subscribers: 0
- crm_leads: 0
- crm_lead_profiles: 0
- contact settings row (`site_settings.key='contact'`): 0

Nenhuma alteração de dados foi realizada.

## Email

Foi preparado:
`scripts/phase11-resend-check.mjs`

O script:
1. envia para `delivered@resend.dev`
2. consulta `GET /emails/{id}`
3. espera `last_event = delivered`
4. envia também a notificação interna
5. falha explicitamente se o teste de delivered não chegar

O script termina em SKIPPED quando as credenciais Resend necessárias não estão disponíveis.

Não houve teste E2E efectivo nesta sessão porque as credenciais de provider não estão expostas no ambiente de execução actual.

## Dependências

Nenhuma dependência nova foi adicionada.

Foram reutilizados:
- React 19
- TanStack Start/Router
- Tailwind 4
- Framer Motion
- Lucide
- Sonner
- Zod
- Supabase client
- Resend via HTTP API

R8 cumprida.

## Paridade

Entidades potencialmente tocadas:
- Leads: 0 → 0
- Bookings: 0 → 0
- Subscribers: 0 → 0
- CRM leads: 0 → 0
- CRM profiles: 0 → 0
- briefing submissions: 0 → 0

Conteúdo do wizard preservado:
- 12 Project Types
- 4 Urgency states
- 5 passos
- campos de Identity
- campos de Budget
- campos de Timing
- referências
- attachments
- booking integration
- WhatsApp integration

## Lista de Abate / estrutura

Aplicado no novo Contact:
- K3: removidos cartões arredondados como contentor principal
- K4: eliminado H1 com itálico azul
- K5: eliminados micro-labels mono
- K8: removida a paleta azul-marinho/sky da página
- K10: canais deixam de depender de hover-only
- K11: hierarquia CTA simplificada
- K13: texto mínimo público >= 14px no novo componente
- K15: setas removidas de CTAs internos

Sinais estruturais pretendidos:
- S1 novo paradigma de layout
- S2 papéis tipográficos Cartaz/Livro
- S3 componentes rectangulares
- S4 motion apenas na transição de passo
- S5 ritmo Betão/Cal
- S6 nova hierarquia e resumo final

A medição formal do diff estrutural continua dependente do runner de screenshot.

## QA

### Local

O checkout local do GitHub não foi possível porque o ambiente de execução não resolve `github.com`. Portanto não foi possível correr `npm ci` localmente.

### GitHub Actions

O branch recebeu:
- CI com Contact browser smoke
- Browser QA geral
- Supabase Backup

No fecho deste relatório, a execução final do HEAD estava pendente/executando.

### Supabase Backup

O workflow de backup continua a falhar externamente.

### Vercel

Não existe evidência final verificável de READY para o HEAD da Fase 11 no surface de Vercel disponível nesta sessão.

### Gates

- lint: NOT CLAIMED GREEN
- typecheck: NOT CLAIMED GREEN
- node:test/Vitest: NOT CLAIMED GREEN
- Playwright: NOT CLAIMED GREEN
- Gate de Paridade: conteudos e contagens preservados
- Gate de Mudança: NOT CLAIMED GREEN
- E2E Resend: preparado, não executado por falta de credenciais
- phase-11-green: não criado
- produção: não promovida

## Decisões autónomas

1. Reutilizar `briefing_submissions` em vez de criar leads duplicados.
2. Preparar hardening RLS como migration e não aplicá-lo sem backup confirmado.
3. Usar fallback de rate limit em memória até a migration existir, para não quebrar o Contact durante a janela intermédia.
4. Preservar o upload de attachments existente em `site-assets`.
5. Tratar a ausência de `site_settings.contact` como fallback editorial, sem inventar configuração nova.
6. Manter o BookingModal existente como fallback quando não há booking_url configurado.

## Riscos / dívida técnica

- A policy de INSERT público de `briefing_submissions` continua activa em produção até a migration ser aplicada.
- O rate limit persistente ainda não está activo em produção.
- Resend E2E depende de credenciais de provider.
- O Gate de Mudança depende do runner de screenshots.
- O checkout local depende de DNS externo indisponível nesta sessão.
- Backup Supabase continua sem confirmação.

## Estado final

A implementação da Fase 11 está concluída em código, mas permanece `BLOCKED-EXTERNAL` sob R3/R1.

Não houve promoção para produção.
