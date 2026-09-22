# Admin Control Kernel

Phase 1 establishes the production foundation for the Kutuzov Control Room.

## Boundary

Administrative content writes now follow:
Admin UI -> TanStack server function -> Supabase Auth context -> role permission -> Supabase/RLS -> database triggers -> audit/version history -> realtime invalidation -> public UI.

The browser no longer performs direct database mutations for the main site content managed by Control Room.

## Permissions

Supported roles:

- owner: unrestricted administrative access
- admin: unrestricted administrative access
- editor: content and media operations
- finance: leads and finance operations

Permissions are evaluated by public.admin_has_permission(permission) and are enforced again by database policies.

## Version history

Administrator-controlled content is versioned automatically through database triggers for:

- site_settings
- clients
- projects
- services
- stats
- about_method

The previous row is stored before updates/deletes, while new rows store their initial state. The history retention window is 20 revisions per entity.

## Audit log

public.admin_audit_log records create/update/delete events for administrator-controlled content and administrator membership records. Reads are restricted by the system.audit.read permission.

The Audit workspace exposes actor, action, entity, timestamp, before state and after state.

## Transactional ordering

Portfolio reorder uses public.admin_reorder_projects so the pair of order updates executes inside one Postgres transaction rather than two independent browser mutations.

## Production constraints

Secrets remain server-only. The Control Room does not expose Supabase service-role credentials, Resend credentials, Gemini credentials or other infrastructure secrets to browser code.

## QA

Phase 1 adds:

- static regression coverage for the database kernel and client/server boundary
- anonymous browser coverage for /admin and /admin/studio
- existing repository typecheck, lint, build and browser QA gates remain mandatory

The production database migration is versioned in supabase/migrations/20260922110000_admin_control_kernel.sql.