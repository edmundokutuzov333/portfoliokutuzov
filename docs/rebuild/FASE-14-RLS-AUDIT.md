# Fase 14 — Auditoria de Auth/RLS

## Estado real antes da migration

- `admin_users` existe e usa roles de aplicação `owner | admin | editor | finance`.
- `is_admin()` e `admin_has_permission()` já eram SECURITY DEFINER e resolviam o papel através de `admin_users`, não através de `auth.jwt()->>'role'`.
- Todas as tabelas públicas auditadas têm RLS activo.
- `booking_requests`, `briefing_submissions`, `contact_requests` e `newsletter_subscribers` ainda tinham políticas de INSERT para o papel `public`.
- `analytics_events` tem INSERT público deliberado para telemetria anónima, sem SELECT público.
- `media_assets` já tinha auditoria por trigger e storage privado de escrita administrativo via políticas do bucket `site-assets`.
- `admin_audit_log` é imutável via trigger.
- `capture_admin_content_version()` regista snapshots para as entidades existentes.

## Hardening preparado

Migration: `supabase/migrations/20260924150000_phase14_admin_security_media.sql`
Rollback: `supabase/rollbacks/20260924150000_phase14_admin_security_media.down.sql`

1. `admin_users.mfa_required` é aditivo e default false para não bloquear contas existentes antes do onboarding.
2. `is_admin()` e `admin_has_permission()` passam a exigir AAL2 quando `mfa_required=true`.
3. Writes administrativos passam de `public` para `authenticated` + `admin_has_permission(...)`.
4. Submissões públicas deixam de escrever directamente em `booking_requests`, `briefing_submissions`, `contact_requests` e `newsletter_subscribers`.
5. Booking passa por `submit_booking_request(...)`, uma função SECURITY DEFINER com validação de nome/email/data.
6. Storage writes usam `authenticated` + `media.manage`.
7. Media recebe metadata para cor dominante e variantes WebP/AVIF.

## MFA

`src/components/admin/AdminMfaSecurity.tsx` implementa:
- TOTP via Supabase Auth MFA;
- QR code;
- secret de fallback;
- challenge + verify;
- `autocomplete=one-time-code` e `inputMode=numeric`;
- sem testes cognitivos;
- gate opcional por `VITE_ADMIN_MFA_REQUIRED=true`;
- gestão da flag `mfa_required` no Users & Roles.

## Dados intocáveis

A migration não foi aplicada à produção nesta fase porque o workflow de Supabase Backup continua sem evidência reversível confirmada. Portanto não houve mutações DB/Storage.

## Teste requerido pós-migration

Depois da aplicação, a matriz deve provar:
- anon não consegue INSERT/UPDATE/DELETE nas quatro tabelas administrativas;
- authenticated sem permission não consegue escrever;
- admin sem MFA obrigatório continua operacional;
- admin com `mfa_required=true` e AAL1 não consegue passar `admin_has_permission`;
- AAL2 permite operações;
- Storage upload/update/delete requer `media.manage`.