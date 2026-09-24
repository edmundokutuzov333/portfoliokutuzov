# Fase 1 — Backup e rede de segurança

## Backup policy already present

The repository already contained an encrypted Supabase backup workflow at .github/workflows/supabase-backup.yml.

It uses:
- SUPABASE_DB_URL repository secret.
- BACKUP_ENCRYPTION_KEY repository secret.
- pg_dump in custom format without owner and privileges.
- AES-256-CBC with PBKDF2.
- GitHub Actions artifact retention of 30 days.
- No raw dump committed to Git.

## Phase 1 requirement

The workflow is being extended to run on awwwards-rebuild so the first Phase 1 push produces a fresh encrypted production DB artifact before further production data work.

## Storage

Production storage.objects currently contains 0 objects. The baseline manifest therefore records a zero-object Storage state; no Storage object has been deleted or changed.

## External location

The encrypted database artifact is stored in the GitHub Actions run artifact produced by the Phase 1 safety workflow, not in the repository. The exact workflow run/artifact identifier is appended here after successful execution.

## Status

PENDING_CONFIRMATION — this file is not marked green until the backup workflow run is observed successful.
