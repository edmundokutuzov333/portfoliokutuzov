# Production Data Recovery Plan

## Scope

Kutuzov Studio stores real design documents and digital-card metadata in Supabase/PostgreSQL. Database migrations remain versioned under `supabase/migrations/` and the application must treat the database as production data, not disposable cache.

## Recovery targets

- RPO target: 24 hours maximum for production Studio data.
- RTO target: 4 hours for database restoration and application verification.
- Critical data: `public.studio_cards`, published-card identity fields, and `public.studio_events` analytics.
- Source of truth: Supabase PostgreSQL plus the versioned repository migrations.

## Backup policy

The production Supabase project must have managed database backups enabled according to the project plan, with point-in-time recovery enabled where the plan supports it. Retain at least one independently exported encrypted database backup outside the primary project account on a scheduled basis.

A repository copy is not a database backup. Git stores the migration history and application code, not the live rows owned by Supabase.

Recommended operational schedule:

1. Managed provider backup / PITR: continuously enabled where available.
2. External encrypted database export: daily.
3. Monthly restore drill into an isolated Supabase project or PostgreSQL environment.
4. Record the last successful backup and restore drill in the operations log.

## Backup commands

For an operator with an approved Supabase database connection string, a PostgreSQL dump can be created with:

```bash
pg_dump --format=custom --no-owner --no-privileges "$SUPABASE_DB_URL" > studio-backup-$(date -u +%Y-%m-%d).dump
```

The backup must be encrypted at rest and access-controlled. Never commit dump files or database credentials to Git.

## Restore procedure

1. Freeze writes to the affected Studio surfaces.
2. Identify the incident window and the newest trusted backup before the incident.
3. Restore the PostgreSQL backup into the approved recovery project.
4. Reapply versioned migrations only when required by the chosen recovery point; do not blindly replay migrations over an already restored schema.
5. Verify row counts and representative Studio records.
6. Verify RLS, admin membership checks, public-card reads, email/export routes and telemetry writes.
7. Run `npm test`, `npm run diagnose`, `npm run typecheck`, `npm run lint` and `npm run build`.
8. Re-enable writes and observe error rates before declaring recovery complete.

## Disaster recovery boundaries

Vercel is the deployment layer and Supabase is the database layer. Recovery must therefore be tested independently for application deployment and database restoration. A Vercel deployment rollback does not restore PostgreSQL data.

## Secrets

`RESEND_API_KEY`, Supabase service-role credentials and other provider credentials belong only in the deployment secret store or local `.env` files that are never committed. A secret exposed in chat, logs or source control must be revoked and replaced immediately.

## Compliance and deliverability

Production email requires authenticated sender-domain configuration and monitoring for SPF, DKIM and DMARC. Legal retention and data-subject requirements must be reviewed for recipients and jurisdictions served by the deployment. This document is an engineering recovery control, not legal advice.
