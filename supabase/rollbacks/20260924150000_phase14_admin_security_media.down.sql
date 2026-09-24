-- Phase 14 rollback. Restores the pre-Phase-14 policies/functions and removes only Phase-14 metadata.

drop function if exists public.submit_booking_request(text,text,date,text,text,text);

drop policy if exists "admins read bookings" on public.booking_requests;
drop policy if exists "admins update bookings" on public.booking_requests;
drop policy if exists "admins delete bookings" on public.booking_requests;
create policy "admins read bookings" on public.booking_requests for select to public using (public.admin_has_permission('leads.read'));
create policy "admins update bookings" on public.booking_requests for update to public using (public.admin_has_permission('leads.write')) with check (public.admin_has_permission('leads.write'));
create policy "admins delete bookings" on public.booking_requests for delete to public using (public.admin_has_permission('leads.write'));
create policy "anyone can submit booking" on public.booking_requests for insert to public with check (true);

drop policy if exists "admins read briefings" on public.briefing_submissions;
drop policy if exists "admins update briefings" on public.briefing_submissions;
drop policy if exists "admins delete briefings" on public.briefing_submissions;
create policy "admins read briefings" on public.briefing_submissions for select to public using (admin_has_permission('leads.read'));
create policy "admins update briefings" on public.briefing_submissions for update to public using (admin_has_permission('leads.write') or admin_has_permission('finance.write')) with check (admin_has_permission('leads.write') or admin_has_permission('finance.write'));
create policy "admins delete briefings" on public.briefing_submissions for delete to public using (admin_has_permission('leads.write') or admin_has_permission('finance.write'));
create policy "anyone can submit briefing" on public.briefing_submissions for insert to public with check (true);

drop policy if exists "admins read contact_requests" on public.contact_requests;
drop policy if exists "admins update contact_requests" on public.contact_requests;
drop policy if exists "admins delete contact_requests" on public.contact_requests;
create policy "admins read contact_requests" on public.contact_requests for select to public using (admin_has_permission('leads.read'));
create policy "admins update contact_requests" on public.contact_requests for update to public using (admin_has_permission('leads.write')) with check (admin_has_permission('leads.write'));
create policy "admins delete contact_requests" on public.contact_requests for delete to public using (admin_has_permission('leads.write'));
create policy "anyone can submit contact request" on public.contact_requests for insert to public with check (true);

drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
drop policy if exists "admins update subscribers" on public.newsletter_subscribers;
drop policy if exists "admins delete subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers" on public.newsletter_subscribers for select to public using (admin_has_permission('leads.read'));
create policy "admins update subscribers" on public.newsletter_subscribers for update to public using (admin_has_permission('leads.write')) with check (admin_has_permission('leads.write'));
create policy "admins delete subscribers" on public.newsletter_subscribers for delete to public using (admin_has_permission('leads.write'));
create policy "anyone can subscribe" on public.newsletter_subscribers for insert to public with check (true);

drop policy if exists "admins upload site-assets" on storage.objects;
drop policy if exists "admins update site-assets" on storage.objects;
drop policy if exists "admins delete site-assets" on storage.objects;
create policy "admins upload site-assets" on storage.objects for insert with check (bucket_id = 'site-assets' and public.is_admin());
create policy "admins update site-assets" on storage.objects for update using (bucket_id = 'site-assets' and public.is_admin());
create policy "admins delete site-assets" on storage.objects for delete using (bucket_id = 'site-assets' and public.is_admin());

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.admin_has_permission(p_permission text)
returns boolean language sql stable security definer set search_path = public, pg_catalog
as $$
  select case lower(coalesce(u.role, ''))
    when 'owner' then true
    when 'admin' then true
    when 'editor' then lower(p_permission) in ('content.read','content.write','media.manage')
    when 'finance' then lower(p_permission) in ('leads.read','leads.write','finance.read','finance.write')
    else false
  end
  from public.admin_users u
  where u.user_id = auth.uid()
  limit 1;
$$;
revoke all on function public.admin_has_permission(text) from public;
grant execute on function public.admin_has_permission(text) to authenticated;

drop index if exists public.media_assets_dominant_color_idx;
alter table public.media_assets drop column if exists optimized_avif_url, drop column if exists optimized_webp_url, drop column if exists optimized_height, drop column if exists optimized_width, drop column if exists dominant_color;
alter table public.admin_users drop column if exists mfa_required;
