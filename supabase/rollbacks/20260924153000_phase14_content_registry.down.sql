-- Phase 14 content registry rollback.
drop trigger if exists trg_admin_version_site_metrics on public.site_metrics;
drop trigger if exists trg_admin_audit_site_metrics on public.site_metrics;
drop trigger if exists trg_site_metrics_updated on public.site_metrics;
drop trigger if exists trg_admin_version_testimonials on public.testimonials;
drop trigger if exists trg_admin_audit_testimonials on public.testimonials;
drop trigger if exists trg_testimonials_updated on public.testimonials;
drop trigger if exists trg_admin_version_faq_entries on public.faq_entries;
drop trigger if exists trg_admin_audit_faq_entries on public.faq_entries;
drop trigger if exists trg_faq_entries_updated on public.faq_entries;
drop table if exists public.site_metrics;
drop table if exists public.testimonials;
drop table if exists public.faq_entries;
