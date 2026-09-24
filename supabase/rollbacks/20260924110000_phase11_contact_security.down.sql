-- Rollback for Phase 11 contact security migration.
-- Re-enables the previous public insert path and removes only the added rate-limit objects.

drop function if exists public.check_contact_rate_limit(text, integer, integer);
drop table if exists public.contact_rate_limits;

drop policy if exists "anyone can submit briefing" on public.briefing_submissions;
create policy "anyone can submit briefing"
  on public.briefing_submissions for insert with check (true);
