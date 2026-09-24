# RUNBOOK

## Deploy
1. Confirm preview deployment is READY.
2. Run audit:all from a clean clone.
3. Require two consecutive green executions.
4. Create the pre-release tag only after the release gate.
5. Promote the production branch.
6. Run the critical production subset.

## Rollback
Use Vercel Instant Rollback to the previous READY production deployment. If a database migration was applied, use its documented down migration only after checking application compatibility. For data loss, restore the latest verified Supabase dump and Storage manifest.

## Database
Apply migrations only after a fresh R1 backup is verified. Never apply the P0 RLS boundary while the matching server-side deployment is not confirmed.

## Audit
Command: npm run audit:all
Evidence: docs/audit/evidence/
Matrix: docs/audit/MATRIZ.md

## BLOCKED-EXTERNAL
Current blocker: Vercel did not expose a deployment for main commit 4612414968494d0db853c6232eae9f2f14a1c937 during this execution. Do not apply the P0 RLS/Storage migration until that deployment is verifiably live.
