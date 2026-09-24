-- Phase 2 P0 containment: public tables become service-role write surfaces.
-- Rollback: restore the previous public INSERT policies only on a controlled incident path.

drop policy if exists "anyone can submit booking" on public.booking_requests;
drop policy if exists "anyone can submit briefing" on public.briefing_submissions;
drop policy if exists "anyone can submit contact request" on public.contact_requests;
drop policy if exists "anyone can subscribe" on public.newsletter_subscribers;
drop policy if exists "Public analytics inserts" on public.analytics_events;

drop policy if exists "admins read bookings" on public.booking_requests;
drop policy if exists "admins update bookings" on public.booking_requests;
drop policy if exists "admins delete bookings" on public.booking_requests;
create policy "admins read bookings" on public.booking_requests for select to authenticated using (public.is_admin());
create policy "admins update bookings" on public.booking_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete bookings" on public.booking_requests for delete to authenticated using (public.is_admin());

drop policy if exists "admins read briefings" on public.briefing_submissions;
drop policy if exists "admins update briefings" on public.briefing_submissions;
drop policy if exists "admins delete briefings" on public.briefing_submissions;
create policy "admins read briefings" on public.briefing_submissions for select to authenticated using (public.is_admin());
create policy "admins update briefings" on public.briefing_submissions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete briefings" on public.briefing_submissions for delete to authenticated using (public.is_admin());

drop policy if exists "admins read contact_requests" on public.contact_requests;
drop policy if exists "admins update contact_requests" on public.contact_requests;
drop policy if exists "admins delete contact_requests" on public.contact_requests;
create policy "admins read contact_requests" on public.contact_requests for select to authenticated using (public.is_admin());
create policy "admins update contact_requests" on public.contact_requests for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete contact_requests" on public.contact_requests for delete to authenticated using (public.is_admin());

drop policy if exists "admins read subscribers" on public.newsletter_subscribers;
drop policy if exists "admins update subscribers" on public.newsletter_subscribers;
drop policy if exists "admins delete subscribers" on public.newsletter_subscribers;
create policy "admins read subscribers" on public.newsletter_subscribers for select to authenticated using (public.is_admin());
create policy "admins update subscribers" on public.newsletter_subscribers for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete subscribers" on public.newsletter_subscribers for delete to authenticated using (public.is_admin());

drop policy if exists "admins read analytics" on public.analytics_events;
create policy "admins read analytics" on public.analytics_events for select to authenticated using (public.is_admin());
