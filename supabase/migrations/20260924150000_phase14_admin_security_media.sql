-- Phase 14: Admin security, MFA boundary, booking RPC and media optimization metadata.
-- Additive/reversible. Do not apply to production until R1 backup evidence is confirmed.

alter table public.admin_users
  add column if not exists mfa_required boolean not null default false;

alter table public.media_assets
  add column if not exists dominant_color text,
  add column if not exists optimized_webp_path text,
  add column if not exists optimized_webp_url text,
  add column if not exists optimized_avif_path text,
  add column if not exists optimized_avif_url text,
  add column if not exists optimized_width integer,
  add column if not exists optimized_height integer;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
      and (coalesce(mfa_required, false) = false or coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2')
  );
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create or replace function public.admin_has_permission(p_permission text)
returns boolean
language sql stable security definer
set search_path = public, pg_catalog
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
    and (coalesce(u.mfa_required, false) = false or coalesce(auth.jwt() ->> 'aal', 'aal1') = 'aal2')
  limit 1;
$$;
revoke all on function public.admin_has_permission(text) from public, anon;
grant execute on function public.admin_has_permission(text) to authenticated;

-- Public submission tables: server functions/service role write them; the browser does not.
drop policy if exists "anyone can submit booking" on public.booking_requests;
drop policy if exists "admins read bookings" on public.booking_requests;
drop policy if exists "admins update bookings" on public.booking_requests;
drop policy if exists "admins delete bookings" on public.booking_requests;
create policy "admins read bookings" on public.booking_requests for select to authenticated using (public.admin_has_permission('leads.read'));
create policy "admins update bookings" on public.booking_requests for update to authenticated using (public.admin_has_permission('leads.write')) with check (public.admin_has_permission('leads.write'));
create policy "admins delete bookings" on public.booking_requests for delete to authenticated using (public.admin_has_permission('leads.write'));

drop policy if exists "anyone can submit briefing" on public.briefing_submissions;
drop policy if exists "admins read briefings" on public.briefing_submissions;
drop policy if exists "admins update briefings" on public.briefing_submissions;
drop policy if exists "admins delete briefings" on public.briefing_submissions;
create policy "admins read briefings" on public.briefing_submissions for select to authenticated using (public.admin_has_permission('leads.read'));
create policy "admins update briefings" on public.briefing_submissions for update to authenticated using (public.admin_has_permission('leads.write') or public.admin_has_permission('finance.write')) with check (public.admin_has_permission('leads.write') or public.admin_has_permission('finance.write'));
create policy "admins delete briefings" on public.briefing_submissions for delete to authenticated using (public.admin_has_permission('leads.write') or public.admin_has_permission('finance.write'));

drop policy if exists "anyone can submit contact request" on public.contact_requests;
drop policy if exists "admins read contact_requests" on public.contact_requests;
drop policy if exists "admins update contact_requests" on public.contact_requests;
drop policy if exists "admins delete contact_requests" on public.contact_requests;
create policy "admins read contact_requests" on public.contact_requests for select to authenticated using (public.admin_has_permission('leads.read'));
create policy "admins update contact_requests" on public.contact_requests for update to authenticated using (public.admin_has_permission('leads.write')) with check (public.admin_has_permission('leads.write'));
create policy "admins delete contact_requests" on public.contact_requests for delete to authenticated using (public.admin_has_permission('leads.write'));

drop policy if exists "anyone can subscribe" on public.newsletter_subscribers;
drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
drop policy if exists "admins update subscribers" on public.newsletter_subscribers;
drop policy if exists "admins delete subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers" on public.newsletter_subscribers for select to authenticated using (public.admin_has_permission('leads.read'));
create policy "admins update subscribers" on public.newsletter_subscribers for update to authenticated using (public.admin_has_permission('leads.write')) with check (public.admin_has_permission('leads.write'));
create policy "admins delete subscribers" on public.newsletter_subscribers for delete to authenticated using (public.admin_has_permission('leads.write'));

-- Browser booking submission becomes a narrow SECURITY DEFINER RPC.
create or replace function public.submit_booking_request(
  p_name text,
  p_email text,
  p_preferred_date date,
  p_preferred_time text default null,
  p_timezone text default null,
  p_note text default null
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare v_id uuid;
begin
  if length(trim(p_name)) < 2 or length(trim(p_name)) > 160 then raise exception 'Invalid name' using errcode='22023'; end if;
  if length(trim(p_email)) < 5 or length(trim(p_email)) > 320 or position('@' in p_email) < 2 then raise exception 'Invalid email' using errcode='22023'; end if;
  if p_preferred_date is null then raise exception 'Preferred date is required' using errcode='22023'; end if;
  insert into public.booking_requests(name,email,preferred_date,preferred_time,timezone,note)
  values(trim(p_name),lower(trim(p_email)),p_preferred_date,nullif(trim(p_preferred_time),''),nullif(trim(p_timezone),''),nullif(trim(p_note),''))
  returning id into v_id;
  return v_id;
end;
$$;
revoke all on function public.submit_booking_request(text,text,date,text,text,text) from public;
grant execute on function public.submit_booking_request(text,text,date,text,text,text) to anon, authenticated;

-- Tighten Storage writes to authenticated admins with media permission.
drop policy if exists "admins upload site-assets" on storage.objects;
drop policy if exists "admins update site-assets" on storage.objects;
drop policy if exists "admins delete site-assets" on storage.objects;
create policy "admins upload site-assets" on storage.objects for insert to authenticated with check (bucket_id = 'site-assets' and public.admin_has_permission('media.manage'));
create policy "admins update site-assets" on storage.objects for update to authenticated using (bucket_id = 'site-assets' and public.admin_has_permission('media.manage')) with check (bucket_id = 'site-assets' and public.admin_has_permission('media.manage'));
create policy "admins delete site-assets" on storage.objects for delete to authenticated using (bucket_id = 'site-assets' and public.admin_has_permission('media.manage'));

-- Ensure the Phase 14 metadata fields can be queried safely by existing admin media policies.
create index if not exists media_assets_dominant_color_idx on public.media_assets(dominant_color) where dominant_color is not null;
