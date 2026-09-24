# Relatório — Fase 14: Admin, CMS, Segurança e Analytics

## Resumo

A Fase 14 endurece a superfície administrativa existente sem substituir o Control Room. A mudança concentra-se em Auth/RLS, MFA TOTP, Storage, CMS estruturado, Reel management, analytics e aplicação de tokens no Admin Studio.

A especificação da fase exige auditoria completa de Auth/RLS, CRUD de todos os conteúdos ligados pelas fases anteriores, pipeline de media com optimização/cor dominante, dashboard com Recharts, audit logs, Supabase MFA e tokens no /admin/studio, mantendo FAQ/testemunhos vazios enquanto não existirem fontes reais. fileciteturn754file0L1177-L1255

## Segurança e RLS

Migration principal:
`supabase/migrations/20260924150000_phase14_admin_security_media.sql`
Rollback:
`supabase/rollbacks/20260924150000_phase14_admin_security_media.down.sql`

Foi preparada uma segunda migration de conteúdo vazio:
`supabase/migrations/20260924153000_phase14_content_registry.sql`
`supabase/rollbacks/20260924153000_phase14_content_registry.down.sql`

Reel registry:
`supabase/migrations/20260924155000_phase14_reel_registry.sql`
`supabase/rollbacks/20260924155000_phase14_reel_registry.down.sql`

### Alterações preparadas
- `admin_users.mfa_required` nullable-safe via default false.
- `is_admin()` e `admin_has_permission()` exigem AAL2 quando o admin está marcado como MFA-required.
- Writes directos de browser nas tabelas de booking, briefing, contact request e subscribers deixam de usar o papel public.
- Booking passa por RPC SECURITY DEFINER validada.
- Storage writes passam a exigir `authenticated` + `media.manage`.
- Media metadata recebe cor dominante e URLs/paths de variantes optimizadas.

### Auditoria real
Todos os public tables auditados têm RLS activo.
Existem triggers de audit para as principais entidades administrativas e media.
`admin_audit_log` já é imutável por trigger.
`capture_admin_content_version()` guarda snapshots para as entidades existentes.

Falha encontrada: quatro superfícies de submissão ainda permitiam INSERT directo pelo papel public. A correcção foi preparada em migration e não aplicada em produção.

## MFA

`src/components/admin/AdminMfaSecurity.tsx` implementa:
- Supabase Auth TOTP;
- QR code e secret de fallback;
- challenge/verify;
- password-manager one-time-code autofill;
- gate opcional por `VITE_ADMIN_MFA_REQUIRED=true`;
- `mfa_required` por conta no Users & Roles;
- zero testes cognitivos.

O default do flag é false para evitar lockout de contas existentes antes do onboarding. O mecanismo de enforcement está preparado no DB para contas marcadas com `mfa_required=true`.

## CMS estruturado

Foi adicionado `ContentRegistryManager` para:
- FAQ;
- Testimonials;
- Site metrics.

As três fontes são vazias por defeito e não inventam conteúdo.
Os campos PT são suportados nas tabelas novas.
CRUD é feito por server functions protegidas por `content.write`.

O CMS existente continua a ser a fonte administrativa para Homepage, Credentials, Services, Portfolio, Clients, Media, Availability, Leads, Bookings, Newsletter, Experience e Skills.

## Reel

O endpoint `/api/reel-analytics` já existia mas dependia de `reel_analytics`, que não estava na BD de produção.

A Phase 14 prepara:
- `reel_items`;
- `reel_analytics`;
- seed determinístico a partir dos `projects` existentes;
- RLS public-read published/admin-write;
- analytics sem PII;
- manager administrativo de ordem/publicação/cor manual.

`CinematicPortfolioReel` tenta primeiro o registry e faz fallback automático para `projects` se a tabela/migration não estiver disponível. Portanto não há regressão enquanto R1 permanecer bloqueado.

## Media pipeline

`src/lib/media-optimization.ts` usa apenas Web APIs:
- `createImageBitmap`;
- Canvas;
- `toBlob(image/webp)`;
- `toBlob(image/avif)` quando suportado;
- sampling `getImageData` para dominant color.

Não foi adicionada `sharp` ou outra dependência nativa.

Uploads do Media Library agora produzem metadata e variantes quando o browser suporta os formatos. SVG e formatos não raster mantêm o fluxo original.

## Analytics

`getAdminAnalyticsOverview` agora agrega:
- eventos do site;
- leads por dia;
- subscribers por dia;
- Reel view/select/open;
- chatbot open/message/handoff;
- taxa de handoff do chatbot.

Admin Analytics passou a renderizar Recharts para leads, subscribers, Reel e chatbot.

O Reel passou a emitir `reel_view`, `reel_select` e `reel_open`.
O chatbot passou a emitir `ai_handoff` no handoff para Contact.

## Admin Studio

`src/styles/admin-studio-phase14.css` aplica um bridge de tokens ao shell visual do Admin Studio sem alterar a lógica dos módulos.
`/admin/studio` passou a emitir `noindex,nofollow,noarchive`.

Não foi redesenhada internamente nenhuma ferramenta do Studio.

## Conteúdo preservado

Nenhum conteúdo real existente foi apagado.
Nenhuma métrica pública existente foi substituída pela nova tabela `site_metrics`.
As novas FAQ/testimonials/site_metrics permanecem vazias.

## Dependências

Nenhuma dependência nova foi adicionada.
O pipeline de imagens usa APIs nativas.
Recharts já existia no stack e é reutilizado.
Supabase Auth MFA já faz parte do runtime existente.

## R1 / produção

Nenhuma migration Phase 14 foi aplicada.
Nenhuma row de produção foi criada, alterada ou apagada.
Nenhum Storage object foi alterado.
O backup Supabase continua sem evidência reversível confirmada.

## Testes

Adicionados:
- `tests/phase14-admin.test.mjs`;
- `tests/browser/admin-phase14.spec.ts`.

O CI foi actualizado para incluir o browser suite da Fase 14.

## Gates

- Lint: não certificado GREEN.
- Typecheck: não certificado GREEN.
- Vitest/node:test: não certificado GREEN.
- Playwright: não certificado GREEN.
- Gate de Paridade: PASS por ausência de writes em produção.
- Gate de Mudança: não aplicável à página pública; Admin Studio recebeu apenas token bridge.
- Supabase Backup: permanece externo/BLOCKED.
- `phase-14-green`: não criado.
- produção: não promovida.

## Decisões autónomas

1. Manter o Control Room existente e evoluir por módulos, não reconstruí-lo de raiz.
2. MFA enforcement por flag + `mfa_required` para evitar lockout de admins existentes.
3. RPC de booking para preservar o UX sem expor INSERT directo.
4. Media optimisation via Web APIs nativas para evitar dependência nativa.
5. Reel registry com fallback para projects enquanto a migration não é aplicada.
6. FAQ/testimonials/site_metrics vazios até existirem fontes reais.

## Riscos

- As migrations ainda não estão aplicadas.
- A suite global continua a conter dívida técnica anterior.
- O browser QA final depende do runner CI.
- O analytics dashboard permanece vazio até existir tráfego real.

## Estado

Phase 14 está implementada em código mas permanece BLOCKED-EXTERNAL sob R1/R3 até backup, typecheck, lint e browser gates serem verificáveis.